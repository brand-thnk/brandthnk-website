const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { query, maxResults = 10 } = JSON.parse(event.body || '{}');

    // Check if Gmail API is configured
    if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
      // Return mock email data if not configured
      const mockEmails = [
        {
          id: 'email_1',
          subject: "Q2 Strategy Discussion - Follow Up",
          from: "sarah.chen@company.com",
          date: "April 2, 2024",
          snippet: "Thanks for the productive discussion yesterday. I've attached the revised strategy deck with the updates we discussed. Key changes include updated market analysis and revised timeline for digital initiatives..."
        },
        {
          id: 'email_2',
          subject: "Regional Bank Project Update",
          from: "j.park@regionalbank.com",
          date: "April 1, 2024",
          snippet: "Hi Allison, Quick update on our brand positioning project. The executive team loved the initial concepts. We're ready to move forward with the recommended positioning. Can we schedule time this week to discuss implementation?"
        },
        {
          id: 'email_3',
          subject: "Forward Bank Workshop Prep",
          from: "lisa.thompson@forwardbank.com",
          date: "March 30, 2024",
          snippet: "Looking forward to our digital strategy workshop next week. I've shared the current brand guidelines and competitive analysis with the team. We're particularly interested in discussing how to differentiate in the digital banking space..."
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          emails: mockEmails,
          message: 'Gmail API not configured - showing mock data for meeting prep'
        })
      };
    }

    // Use real Gmail API
    const emails = await queryGmailForEmails(query, maxResults);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        emails: emails,
        message: `Found ${emails.length} recent emails`
      })
    };

  } catch (error) {
    console.error('Error fetching emails:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch emails',
        details: error.message
      })
    };
  }
};

// Gmail API integration for meeting prep
async function queryGmailForEmails(query, maxResults) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'http://localhost:3000/oauth/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const response = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults: maxResults
  });

  const emails = [];
  for (const message of response.data.messages || []) {
    try {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'metadata',
        metadataHeaders: ['Subject', 'From', 'Date']
      });

      const headers = email.data.payload.headers;
      const subject = getHeader(headers, 'Subject');
      const from = getHeader(headers, 'From');
      const date = getHeader(headers, 'Date');

      // Get snippet from message list
      const snippet = response.data.messages.find(m => m.id === message.id)?.snippet || '';

      emails.push({
        id: email.data.id,
        subject,
        from,
        date: formatEmailDate(date),
        snippet
      });
    } catch (error) {
      console.error('Error processing email:', message.id, error.message);
    }
  }

  return emails;
}

function getHeader(headers, headerName) {
  const header = headers.find(h => h.name === headerName);
  return header ? header.value : '';
}

function formatEmailDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return dateStr;
  }
}