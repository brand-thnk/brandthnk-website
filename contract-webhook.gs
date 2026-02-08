/**
 * BrandThnk Contract Signature Webhook
 *
 * Deploy this as a Google Apps Script Web App to receive
 * signature notifications and send emails via Gmail.
 *
 * SETUP:
 * 1. Go to script.google.com
 * 2. Create new project, paste this code
 * 3. Deploy → New deployment → Web app
 * 4. Execute as: Me, Access: Anyone
 * 5. Copy the web app URL
 * 6. Add URL as CONTRACT_WEBHOOK_URL in Netlify env vars
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Email to you when contract is signed
    const subject = `Contract Signed: ${data.contractId}`;
    const body = `
Contract Signed!

Contract: ${data.contractId}
Signed by: ${data.signerName}
Title: ${data.signerTitle}
Email: ${data.signerEmail}
Date: ${new Date(data.signedAt).toLocaleString()}

--- Audit Trail ---
IP Address: ${data.ipAddress}
Timestamp: ${data.timestamp}
Agreed to Terms: ${data.agreedToTerms ? 'Yes' : 'No'}

---
Next step: Generate signed PDF and archive to contracts folder.
    `.trim();

    GmailApp.sendEmail('allison@brandthnk.co', subject, body);

    // Also send confirmation to client
    const clientSubject = 'Agreement Signed - BrandThnk';
    const clientBody = `
Hi ${data.signerName},

This confirms your signature on the agreement with BrandThnk.

Contract: ${data.contractId}
Signed: ${new Date(data.signedAt).toLocaleString()}

A copy of the signed agreement will be sent to you shortly.

If you have any questions, please reply to this email.

Best,
Allison Netzer
BrandThnk
    `.trim();

    GmailApp.sendEmail(data.signerEmail, clientSubject, clientBody, {
      name: 'Allison Netzer',
      replyTo: 'allison@brandthnk.co'
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    console.error('Error:', error);
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test function - run this to verify email works
function testEmail() {
  GmailApp.sendEmail('allison@brandthnk.co', 'Test: Contract Webhook', 'This is a test email from your contract signing webhook.');
  Logger.log('Test email sent!');
}
