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
  if (subject.includes('commented on') || subject.includes('left a comment') || subject.includes('replied to your comment')) {
    type = 'comment';
    typeLabel = 'Comment';
    actionText = 'View Comment';

    // Extract person name from various comment formats
    let match = subject.match(/^(.+?)\s+commented on/);
    if (!match) match = subject.match(/^(.+?)\s+left a comment/);
    if (!match) match = subject.match(/^(.+?)\s+replied to your comment/);
    if (match) person = match[1];

    if (subject.includes('replied to your comment')) {
      action = 'replied to your comment';
    } else {
      action = 'commented on your post';
    }

  } else if (subject.includes('sent you a message') || subject.includes('messaged you') || subject.includes('You have a message from') || subject.includes('new message')) {
    type = 'dm';
    typeLabel = 'DM';
    actionText = 'Reply';

    let match = subject.match(/^(.+?)\s+(?:sent you a message|messaged you)/);
    if (!match) match = subject.match(/You have a message from (.+?)(?:\s|$)/);
    if (!match) match = subject.match(/new message from (.+?)(?:\s|$)/);
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

  } else if (subject.includes('liked your') || subject.includes('reacted to') || subject.includes('loves your')) {
    type = 'reaction';
    typeLabel = 'Reaction';
    actionText = 'View Post';

    let match = subject.match(/^(.+?)\s+(?:liked|reacted to|loves)/);
    if (match) person = match[1];

    if (subject.includes('loves your')) {
      action = 'loves your post';
    } else if (subject.includes('reacted to')) {
      action = 'reacted to your post';
    } else {
      action = 'liked your post';
    }

  } else if (subject.includes('shared your post') || subject.includes('reposted your')) {
    type = 'share';
    typeLabel = 'Share';
    actionText = 'View Share';

    const match = subject.match(/^(.+?)\s+(?:shared|reposted)/);
    if (match) person = match[1];
    action = 'shared your post';

  } else if (subject.includes('started following you') || subject.includes('is now following')) {
    type = 'follow';
    typeLabel = 'Follow';
    actionText = 'View Profile';

    const match = subject.match(/^(.+?)\s+(?:started following|is now following)/);
    if (match) person = match[1];
    action = 'started following you';

  } else {
    // Log unrecognized patterns for debugging
    console.log('Unrecognized LinkedIn notification pattern:', subject);
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
    q: 'from:noreply@linkedin.com OR from:messages-noreply@linkedin.com OR from:invitations-noreply@linkedin.com newer_than:7d',
    maxResults: 30
  });

  const notifications = [];
  console.log(`Found ${response.data.messages?.length || 0} LinkedIn emails to process`);

  for (const message of response.data.messages || []) {
    try {
      const email = await gmail.users.messages.get({
        userId: 'me',
        id: message.id
      });

      const subject = getEmailHeader(email.data, 'Subject');
      console.log(`Processing email: "${subject}"`);

      const notification = parseLinkedInEmail({
        id: email.data.id,
        subject: subject,
        body: getEmailBody(email.data),
        date: getEmailHeader(email.data, 'Date')
      });

      // Only include if we successfully parsed it as a LinkedIn notification
      if (notification.type !== 'unknown') {
        console.log(`✓ Parsed as ${notification.type}: ${notification.person} - ${notification.action}`);
        notifications.push(notification);
      } else {
        console.log(`✗ Could not parse notification type for: "${subject}"`);
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