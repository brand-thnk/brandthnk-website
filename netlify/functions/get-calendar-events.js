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
    const { timeMin, timeMax, calendarIds } = JSON.parse(event.body || '{}');

    // Check if Google Calendar API is configured (same credentials as Gmail)
    if (!process.env.GMAIL_CLIENT_ID || !process.env.GMAIL_CLIENT_SECRET || !process.env.GMAIL_REFRESH_TOKEN) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          events: [],
          message: 'Google Calendar API not configured - please set up OAuth credentials'
        })
      };
    }

    // Use real Google Calendar API
    const events = await fetchGoogleCalendarEvents(timeMin, timeMax, calendarIds || ['primary']);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        events: events,
        message: `Found ${events.length} BrandThnk calendar events`
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

// Google Calendar API integration for BrandThnk calendar
async function fetchGoogleCalendarEvents(timeMin, timeMax, calendarIds) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    'http://localhost:3000/oauth/callback'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const events = [];

  for (const calendarId of calendarIds) {
    try {
      console.log(`Fetching events from calendar: ${calendarId}`);

      const response = await calendar.events.list({
        calendarId: calendarId,
        timeMin: timeMin,
        timeMax: timeMax,
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 20 // Focus on today's events only
      });

      console.log(`Found ${response.data.items?.length || 0} events`);

      // Only include events that aren't declined
      const validEvents = (response.data.items || []).filter(event => {
        // Skip if user declined the event
        if (event.attendees) {
          const userAttendance = event.attendees.find(attendee =>
            attendee.self && attendee.responseStatus === 'declined'
          );
          if (userAttendance) return false;
        }

        // Skip all-day events without specific times (like holidays)
        if (event.start.date && !event.start.dateTime) {
          return false;
        }

        return true;
      });

      events.push(...validEvents);

    } catch (error) {
      console.error(`Error fetching calendar ${calendarId}:`, error.message);
      // Continue with other calendars if one fails
    }
  }

  // Sort all events by start time
  events.sort((a, b) => {
    const aTime = new Date(a.start.dateTime || a.start.date);
    const bTime = new Date(b.start.dateTime || b.start.date);
    return aTime - bTime;
  });

  console.log(`Returning ${events.length} total events`);
  return events;
}