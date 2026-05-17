// Netlify Function: Sharpen Your Edge — Email Capture
// Logs submission to Google Sheet. No email sending, no marketing automation.

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { email, roughEdge, pass1, pass2, pass3, pass4, pass5 } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
    }

    // Log to Google Sheets via Apps Script webhook
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (sheetsWebhookUrl) {
      await fetch(sheetsWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp:  new Date().toISOString(),
          source:     'Sharpen Your Edge',
          email,
          roughEdge:  roughEdge || '',
          pass1:      pass1     || '',
          pass2:      pass2     || '',
          pass3:      pass3     || '',
          pass4:      pass4     || '',
          pass5:      pass5     || '',
        }),
      }).catch(err => console.error('Sheets log failed:', err));
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };

  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Internal server error' }) };
  }
};
