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
    // For now, return mock calendar data until Google Calendar API is configured
    const { timeMin, timeMax, calendarIds } = JSON.parse(event.body || '{}');

    const mockEvents = [
      {
        id: 'event_1',
        summary: "Q2 Strategy Review with Leadership Team",
        start: {
          dateTime: new Date(Date.now() + 2*60*60*1000).toISOString() // 2 hours from now
        },
        end: {
          dateTime: new Date(Date.now() + 3*60*60*1000).toISOString() // 3 hours from now
        },
        attendees: [
          { displayName: "Sarah Chen", email: "sarah.chen@company.com" },
          { displayName: "Mike Rodriguez", email: "mike.r@company.com" }
        ],
        location: "Conference Room A",
        description: "Quarterly strategy review covering Q2 goals, budget allocation, and key initiatives."
      },
      {
        id: 'event_2',
        summary: "Client Check-in: Regional Bank",
        start: {
          dateTime: new Date(Date.now() + 4*60*60*1000).toISOString() // 4 hours from now
        },
        end: {
          dateTime: new Date(Date.now() + 5*60*60*1000).toISOString() // 5 hours from now
        },
        attendees: [
          { displayName: "Jennifer Park", email: "j.park@regionalbank.com" },
          { displayName: "David Kim", email: "d.kim@regionalbank.com" }
        ],
        location: "Zoom",
        description: "Monthly check-in on brand positioning project and Q2 deliverables."
      },
      {
        id: 'event_3',
        summary: "Book Research Session",
        start: {
          dateTime: new Date(Date.now() + 6*60*60*1000).toISOString() // 6 hours from now
        },
        end: {
          dateTime: new Date(Date.now() + 8*60*60*1000).toISOString() // 8 hours from now
        },
        attendees: [],
        description: "Research session for next book chapter on AI impact on financial services marketing."
      },
      {
        id: 'event_4',
        summary: "Forward Bank: Digital Strategy Workshop",
        start: {
          dateTime: new Date(Date.now() + 5*60*60*1000).toISOString() // 5 hours from now
        },
        end: {
          dateTime: new Date(Date.now() + 6.5*60*60*1000).toISOString() // 6.5 hours from now
        },
        attendees: [
          { displayName: "Lisa Thompson", email: "lisa.thompson@forwardbank.com" },
          { displayName: "James Wilson", email: "j.wilson@forwardbank.com" },
          { displayName: "Maria Garcia", email: "maria.g@forwardbank.com" }
        ],
        location: "Forward Bank HQ - Board Room",
        description: "Workshop on digital transformation strategy and brand positioning in the digital banking space."
      }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        events: mockEvents,
        message: 'Mock calendar data - replace with real Google Calendar API once configured'
      })
    };

  } catch (error) {
    console.error('Error fetching calendar events:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: 'Failed to fetch calendar events',
        details: error.message
      })
    };
  }
};

// Template for Google Calendar API integration once configured
async function fetchGoogleCalendarEvents(timeMin, timeMax, calendarIds) {
  // This will be implemented once we have Google Calendar API access
  //
  // const oauth2Client = new google.auth.OAuth2(
  //   process.env.GOOGLE_CLIENT_ID,
  //   process.env.GOOGLE_CLIENT_SECRET,
  //   'redirect_uri_not_needed_for_server'
  // );
  //
  // oauth2Client.setCredentials({
  //   refresh_token: process.env.GOOGLE_REFRESH_TOKEN
  // });
  //
  // const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  //
  // const events = [];
  //
  // for (const calendarId of calendarIds) {
  //   const response = await calendar.events.list({
  //     calendarId: calendarId,
  //     timeMin: timeMin,
  //     timeMax: timeMax,
  //     singleEvents: true,
  //     orderBy: 'startTime',
  //     maxResults: 50
  //   });
  //
  //   events.push(...response.data.items);
  // }
  //
  // // Sort all events by start time
  // events.sort((a, b) => {
  //   const aTime = new Date(a.start.dateTime || a.start.date);
  //   const bTime = new Date(b.start.dateTime || b.start.date);
  //   return aTime - bTime;
  // });
  //
  // return events;
}