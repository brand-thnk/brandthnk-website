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
    // Check if Gmail API is configured
    if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
      // Return mock data if not configured
      const mockNotifications = [
        {
          id: 'msg_' + Date.now() + '_1',
          type: 'comment',
          typeLabel: 'Comment',
          person: 'Sarah Miller',
          action: 'commented on your post about financial service brand positioning',
          timeAgo: '2 hours ago',
          link: 'https://linkedin.com/feed/update/activity:123456',
          actionText: 'View Comment'
        },
        {
          id: 'msg_' + Date.now() + '_2',
          type: 'dm',
          typeLabel: 'DM',
          person: 'Kevin Rodriguez',
          action: 'sent you a message about potential collaboration',
          timeAgo: '4 hours ago',
          link: 'https://linkedin.com/messaging/thread/abc123',
          actionText: 'Reply'
        }
      ];

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          notifications: mockNotifications,
          message: 'Gmail API not configured - showing mock data. Add environment variables to enable real notifications.'
        })
      };
    }

    // Use real Gmail API
    const notifications = await queryGmailForLinkedInNotifications();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        notifications: notifications,
        message: `Found ${notifications.length} LinkedIn notifications from Gmail`
      })
    };

  } catch (error) {
    console.error('Error fetching LinkedIn notifications:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch notifications',
        details: error.message
      })
    };
  }
};

// Function to parse LinkedIn notification emails once we get real data
function parseLinkedInEmail(email) {
  const subject = email.subject || '';
  const body = email.body || '';

  let type = 'unknown';
  let typeLabel = 'Activity';
  let person = '';
  let action = '';
  let actionText = 'View on LinkedIn';

  // Parse different LinkedIn notification types
  if (subject.includes('commented on')) {
    type = 'comment';
    typeLabel = 'Comment';
    actionText = 'View Comment';

    // Extract person name from subject like "John Smith commented on your post"
    const match = subject.match(/^(.+?)\s+commented on/);
    if (match) person = match[1];
    action = 'commented on your post';

  } else if (subject.includes('sent you a message') || subject.includes('messaged you')) {
    type = 'dm';
    typeLabel = 'DM';
    actionText = 'Reply';

    const match = subject.match(/^(.+?)\s+(?:sent you a message|messaged you)/);
    if (match) person = match[1];
    action = 'sent you a message';

  } else if (subject.includes('mentioned you') || subject.includes('tagged you')) {
    type = 'mention';
    typeLabel = 'Mention';
    actionText = 'View Post';

    const match = subject.match(/^(.+?)\s+(?:mentioned|tagged)\s+you/);
    if (match) person = match[1];
    action = 'mentioned you in a post';

  } else if (subject.includes('wants to connect') || subject.includes('connection request')) {
    type = 'connection';
    typeLabel = 'Connection';
    actionText = 'Accept/Decline';

    const match = subject.match(/^(.+?)\s+wants to connect/);
    if (match) person = match[1];
    action = 'wants to connect';

  } else if (subject.includes('liked your') || subject.includes('reacted to')) {
    type = 'reaction';
    typeLabel = 'Reaction';
    actionText = 'View Post';

    const match = subject.match(/^(.+?)\s+(?:liked|reacted to)/);
    if (match) person = match[1];
    action = 'reacted to your post';
  }

  // Extract LinkedIn URL from email body
  let link = 'https://linkedin.com';
  const urlMatch = body.match(/https:\/\/[^.\s]+\.linkedin\.com[^\s"'>)]+/);
  if (urlMatch) {
    link = urlMatch[0];
  }

  // Calculate time ago from email date
  const emailDate = new Date(email.date);
  const now = new Date();
  const diffHours = Math.floor((now - emailDate) / (1000 * 60 * 60));

  let timeAgo;
  if (diffHours < 1) timeAgo = 'Just now';
  else if (diffHours < 24) timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  else {
    const diffDays = Math.floor(diffHours / 24);
    timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  return {
    id: email.id,
    type,
    typeLabel,
    person: person || 'LinkedIn User',
    action,
    timeAgo,
    link,
    actionText
  };
}

// Gmail API integration - now active
async function queryGmailForLinkedInNotifications() {
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
    q: 'from:noreply@linkedin.com OR from:messages-noreply@linkedin.com newer_than:7d',
    maxResults: 20
  });

  const notifications = [];
  for (const message of response.data.messages || []) {
    try {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id
      });

      const notification = parseLinkedInEmail({
        id: email.data.id,
        subject: getEmailHeader(email.data, 'Subject'),
        body: getEmailBody(email.data),
        date: getEmailHeader(email.data, 'Date')
      });

      // Only include if we successfully parsed it as a LinkedIn notification
      if (notification.type !== 'unknown') {
        notifications.push(notification);
      }
    } catch (error) {
      console.error('Error processing email:', message.id, error.message);
    }
  }

  return notifications;
}

function getEmailHeader(email, headerName) {
  const header = email.payload.headers.find(h => h.name === headerName);
  return header ? header.value : '';
}

function getEmailBody(email) {
  // Extract email body from Gmail API response
  if (email.payload.body.data) {
    return Buffer.from(email.payload.body.data, 'base64').toString();
  }

  if (email.payload.parts) {
    for (const part of email.payload.parts) {
      if (part.mimeType === 'text/plain' && part.body.data) {
        return Buffer.from(part.body.data, 'base64').toString();
      }
    }
  }

  return '';
}