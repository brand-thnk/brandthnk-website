#!/usr/bin/env node

const { google } = require('googleapis');

// Get credentials from environment variables
const CLIENT_ID = process.env.GMAIL_CLIENT_ID || 'YOUR_CLIENT_ID_HERE';
const CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET || 'YOUR_CLIENT_SECRET_HERE';
const REDIRECT_URI = 'http://localhost:3000/oauth/callback';

// The authorization code from the URL (replace this with actual code when needed)
const AUTHORIZATION_CODE = process.env.AUTHORIZATION_CODE || 'PASTE_AUTHORIZATION_CODE_HERE';

async function exchangeCodeForTokens() {
  console.log('🔄 Exchanging authorization code for tokens...\n');

  const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );

  try {
    const { tokens } = await oauth2Client.getToken(AUTHORIZATION_CODE);

    console.log('🎉 Success! Here are your tokens:');
    console.log('=====================================');
    console.log(`GMAIL_CLIENT_ID="${CLIENT_ID}"`);
    console.log(`GMAIL_CLIENT_SECRET="${CLIENT_SECRET}"`);
    console.log(`GMAIL_REFRESH_TOKEN="${tokens.refresh_token}"`);
    console.log('\n📋 Copy these to your Netlify environment variables:');
    console.log('   https://app.netlify.com/sites/brandthnk/settings/env\n');

  } catch (error) {
    console.error('❌ Error exchanging code for tokens:', error.message);
  }
}

exchangeCodeForTokens();