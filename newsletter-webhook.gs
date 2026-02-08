/**
 * BrandThnk Newsletter Sender Webhook
 *
 * Receives newsletter send requests from Netlify scheduled function
 * and sends emails via Gmail with rate limiting.
 *
 * SETUP:
 * 1. Go to script.google.com
 * 2. Create new project, paste this code
 * 3. Deploy → New deployment → Web app
 * 4. Execute as: Me, Access: Anyone
 * 5. Copy the web app URL
 * 6. Add URL as NEWSLETTER_WEBHOOK_URL in Netlify env vars
 * 7. In Script Properties, add UNSUBSCRIBE_SECRET (same as Netlify)
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Handle unsubscribe requests
    if (data.action === 'unsubscribe') {
      return handleUnsubscribe(data);
    }

    // Handle newsletter send requests
    if (data.action === 'send') {
      return handleSend(data);
    }

    return jsonResponse({ error: 'Unknown action' });

  } catch (error) {
    console.error('Webhook error:', error);
    return jsonResponse({ error: error.message });
  }
}

function handleUnsubscribe(data) {
  // Log unsubscribe for manual processing
  console.log('UNSUBSCRIBE REQUEST:', data.email, data.timestamp);

  // Send notification to Allison
  GmailApp.sendEmail('allison@brandthnk.co', 'Newsletter Unsubscribe', `
${data.email} unsubscribed from The BrandThnk Briefing.

Time: ${data.timestamp}

Update subscribers.json and commit to remove them from the list.
  `.trim());

  return jsonResponse({ success: true, action: 'unsubscribe' });
}

function handleSend(data) {
  const { subscribers, subject, html, fromName, replyTo, newsletterId } = data;

  const results = {
    newsletterId: newsletterId,
    totalSent: 0,
    failures: 0,
    failedEmails: []
  };

  // Rate limiting: 50 emails per batch, 1 second delay between batches
  const BATCH_SIZE = 50;
  const DELAY_MS = 1000;

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);

    batch.forEach(subscriber => {
      try {
        // Generate personalized unsubscribe link
        const unsubLink = generateUnsubscribeLink(subscriber.email);
        const personalizedHtml = html.replace('{{UNSUBSCRIBE_LINK}}', unsubLink);

        GmailApp.sendEmail(subscriber.email, subject, '', {
          htmlBody: personalizedHtml,
          name: fromName || 'Allison Netzer',
          replyTo: replyTo || 'allison@brandthnk.co'
        });

        results.totalSent++;
      } catch (error) {
        results.failures++;
        results.failedEmails.push(subscriber.email);
        console.error('Failed to send to ' + subscriber.email + ':', error);
      }
    });

    // Rate limiting delay between batches
    if (i + BATCH_SIZE < subscribers.length) {
      Utilities.sleep(DELAY_MS);
    }
  }

  console.log('Newsletter sent:', newsletterId, results.totalSent, 'success,', results.failures, 'failed');

  // Notify Allison of completion
  GmailApp.sendEmail('allison@brandthnk.co', 'Newsletter Sent: ' + subject, `
Newsletter ID: ${newsletterId}
Subject: ${subject}

Results:
- Sent: ${results.totalSent}
- Failed: ${results.failures}
${results.failedEmails.length > 0 ? '\nFailed emails:\n' + results.failedEmails.join('\n') : ''}
  `.trim());

  return jsonResponse(results);
}

function generateUnsubscribeLink(email) {
  const secret = PropertiesService.getScriptProperties().getProperty('UNSUBSCRIBE_SECRET');
  const encodedEmail = Utilities.base64Encode(email);

  // Create HMAC signature
  const signature = Utilities.computeHmacSha256Signature(email.toLowerCase(), secret);
  const token = Utilities.base64Encode(signature).replace(/[+/=]/g, '').slice(0, 16);

  return 'https://brandthnk.co/.netlify/functions/unsubscribe?email=' + encodedEmail + '&token=' + token;
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// Test function - run manually to verify setup
function testSetup() {
  const secret = PropertiesService.getScriptProperties().getProperty('UNSUBSCRIBE_SECRET');
  if (!secret) {
    Logger.log('ERROR: UNSUBSCRIBE_SECRET not set in Script Properties');
    return;
  }

  Logger.log('UNSUBSCRIBE_SECRET is configured');

  // Test email
  GmailApp.sendEmail('allison@brandthnk.co', 'Newsletter Webhook Test', 'Your newsletter webhook is working!');
  Logger.log('Test email sent to allison@brandthnk.co');
}
