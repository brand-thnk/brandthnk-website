// Netlify Function: Brand Therapy Email Capture
// Sends to Beehiiv + logs to Google Sheet with session context

export async function handler(event) {
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
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { email, sessionContext } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email required' }),
      };
    }

    const results = { beehiiv: null, sheets: null };

    // 1. Add to Beehiiv
    const beehiivApiKey = process.env.BEEHIIV_API_KEY;
    const beehiivPublicationId = process.env.BEEHIIV_PUBLICATION_ID;

    if (beehiivApiKey && beehiivPublicationId) {
      try {
        const beehiivResponse = await fetch(
          `https://api.beehiiv.com/v2/publications/${beehiivPublicationId}/subscriptions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${beehiivApiKey}`,
            },
            body: JSON.stringify({
              email: email,
              reactivate_existing: false,
              send_welcome_email: false,
              utm_source: 'brand_therapy',
              utm_medium: 'tool',
              referring_site: 'brandthnk.co/therapy',
              custom_fields: [
                { name: 'source', value: 'Brand Therapy Tool' },
              ],
            }),
          }
        );

        if (beehiivResponse.ok) {
          results.beehiiv = 'success';
        } else {
          const error = await beehiivResponse.text();
          console.error('Beehiiv error:', error);
          results.beehiiv = 'failed';
        }
      } catch (err) {
        console.error('Beehiiv request failed:', err);
        results.beehiiv = 'error';
      }
    } else {
      console.warn('Beehiiv not configured');
      results.beehiiv = 'not_configured';
    }

    // 2. Log to Google Sheet via Apps Script webhook
    const sheetsWebhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (sheetsWebhookUrl) {
      try {
        const sheetData = {
          timestamp: new Date().toISOString(),
          email: email,
          word1: sessionContext?.word1 || '',
          word2: sessionContext?.word2 || '',
          category: sessionContext?.category || '',
          ideasGenerated: sessionContext?.ideasCount || 0,
          starredIdeas: sessionContext?.starredCount || 0,
          starredTitles: sessionContext?.starredTitles?.join('; ') || '',
          source: 'Brand Therapy Tool',
        };

        const sheetsResponse = await fetch(sheetsWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sheetData),
        });

        if (sheetsResponse.ok) {
          results.sheets = 'success';
        } else {
          console.error('Sheets webhook error');
          results.sheets = 'failed';
        }
      } catch (err) {
        console.error('Sheets request failed:', err);
        results.sheets = 'error';
      }
    } else {
      console.warn('Google Sheets webhook not configured');
      results.sheets = 'not_configured';
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, results }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
}
