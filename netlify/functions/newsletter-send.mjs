/**
 * Newsletter Send - Scheduled Function
 *
 * Runs hourly, checks schedule.json for newsletters ready to send,
 * and triggers the Apps Script webhook to send them.
 */

import { readFileSync } from 'fs';
import { join } from 'path';

// Netlify scheduled function config
export const config = {
  schedule: "0 * * * *"  // Every hour at :00
};

export default async function handler(request) {
  const now = new Date();
  console.log('Newsletter check running at:', now.toISOString());

  try {
    // Read schedule and subscribers from the deployed site files
    const scheduleData = JSON.parse(
      readFileSync(join(process.cwd(), 'newsletter', 'schedule.json'), 'utf8')
    );
    const subscriberData = JSON.parse(
      readFileSync(join(process.cwd(), 'newsletter', 'subscribers.json'), 'utf8')
    );
    const template = readFileSync(
      join(process.cwd(), 'newsletter', 'templates', 'briefing.html'), 'utf8'
    );

    // Find newsletters ready to send
    const readyToSend = scheduleData.queue.filter(item => {
      if (item.status !== 'scheduled') return false;
      const sendTime = new Date(item.scheduled_for);
      return sendTime <= now;
    });

    if (readyToSend.length === 0) {
      console.log('No newsletters ready to send');
      return new Response('No newsletters to send', { status: 200 });
    }

    // Get active subscribers
    const activeSubscribers = subscriberData.subscribers.filter(s => s.status === 'active');
    console.log('Active subscribers:', activeSubscribers.length);

    // Process first ready newsletter
    const item = readyToSend[0];
    console.log('Sending newsletter:', item.id);

    if (!item.newsletter.html_content) {
      console.error('No HTML content found for newsletter:', item.id);
      return new Response('Newsletter missing content', { status: 400 });
    }

    // Use html_content directly - it's either:
    // 1. Full Beehiiv HTML (for imported posts) - used as-is
    // 2. Body content (for new posts) - wrapped in template
    let emailHtml;
    if (item.newsletter.html_content.includes('<!DOCTYPE html>')) {
      // Full HTML from Beehiiv import - use directly
      emailHtml = item.newsletter.html_content;
    } else {
      // Body content only - wrap in template
      emailHtml = template
        .replace('{{TITLE}}', item.newsletter.title)
        .replace('{{SUBTITLE}}', item.newsletter.subtitle || '')
        .replace('{{BODY_HTML}}', item.newsletter.html_content);
    }

    // Send via webhook
    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('NEWSLETTER_WEBHOOK_URL not configured');
      return new Response('Webhook not configured', { status: 500 });
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send',
        newsletterId: item.id,
        subject: item.newsletter.subject_line,
        html: emailHtml,
        fromName: item.send_config?.from_name || 'Allison Netzer',
        replyTo: item.send_config?.reply_to || 'allison@brandthnk.co',
        subscribers: activeSubscribers.map(s => ({
          email: s.email,
          name: s.name
        }))
      })
    });

    const results = await response.json();
    console.log('Send results:', results);

    return new Response(JSON.stringify({
      newsletter: item.id,
      sent: results.totalSent,
      failed: results.failures
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Newsletter send error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
