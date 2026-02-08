/**
 * Newsletter Unsubscribe Handler
 *
 * Handles unsubscribe requests from newsletter emails.
 * URL format: /.netlify/functions/unsubscribe?email=base64encoded&token=hmac
 */

const crypto = require('crypto');

exports.handler = async (event) => {
  const { email: encodedEmail, token } = event.queryStringParameters || {};

  if (!encodedEmail || !token) {
    return redirect('/newsletter/error.html?type=missing');
  }

  let email;
  try {
    email = Buffer.from(encodedEmail, 'base64').toString('utf8');
  } catch (e) {
    return redirect('/newsletter/error.html?type=invalid');
  }

  // Verify HMAC token
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) {
    console.error('UNSUBSCRIBE_SECRET not configured');
    return redirect('/newsletter/error.html?type=config');
  }

  const expectedToken = crypto
    .createHmac('sha256', secret)
    .update(email.toLowerCase())
    .digest('hex')
    .slice(0, 16);

  if (token !== expectedToken) {
    console.log('Invalid token for email:', email);
    return redirect('/newsletter/error.html?type=invalid');
  }

  // Log the unsubscribe request
  console.log('UNSUBSCRIBE:', JSON.stringify({
    email: email,
    timestamp: new Date().toISOString(),
    ip: event.headers['x-forwarded-for'] || event.headers['client-ip']
  }));

  // Send to webhook to update subscriber list
  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'unsubscribe',
          email: email,
          timestamp: new Date().toISOString()
        })
      });
    } catch (e) {
      console.error('Webhook failed:', e);
      // Continue anyway - the unsubscribe is logged
    }
  }

  return redirect('/newsletter/unsubscribed.html');
};

function redirect(path) {
  return {
    statusCode: 302,
    headers: { 'Location': path }
  };
}
