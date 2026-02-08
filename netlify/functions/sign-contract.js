// Contract Signing Function
// Captures signature data, sends notification via Google Apps Script

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);

    // Capture IP address
    const clientIP = event.headers['x-forwarded-for'] ||
                     event.headers['x-real-ip'] ||
                     'unknown';

    // Build signature record
    const signatureRecord = {
      contractId: data.contractId,
      signerName: data.signerName,
      signerTitle: data.signerTitle,
      signerEmail: data.clientEmail,
      agreedToTerms: data.agreedToTerms,
      signedAt: data.signedAt,
      ipAddress: clientIP,
      userAgent: data.userAgent,
      timestamp: new Date().toISOString()
    };

    console.log('Contract signed:', JSON.stringify(signatureRecord, null, 2));

    // Send notification via Google Apps Script webhook
    const webhookUrl = process.env.CONTRACT_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signatureRecord)
        });
      } catch (webhookError) {
        // Log but don't fail - signature is still valid
        console.error('Webhook notification failed:', webhookError);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Agreement signed successfully',
        signatureRecord
      })
    };

  } catch (error) {
    console.error('Error processing signature:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process signature' })
    };
  }
};
