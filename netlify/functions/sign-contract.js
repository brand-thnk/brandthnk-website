// Contract Signing Function
// Captures signature data, sends confirmation emails

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

    // Send email notifications via Resend (if API key configured)
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Email to Allison (notification of signature)
      await sendEmail(resendApiKey, {
        from: 'BrandThnk Contracts <contracts@brandthnk.co>',
        to: 'allison@brandthnk.co',
        subject: `Contract Signed: ${data.contractId}`,
        html: `
          <h2>Contract Signed</h2>
          <p><strong>Contract:</strong> ${data.contractId}</p>
          <p><strong>Signed by:</strong> ${data.signerName}</p>
          <p><strong>Title:</strong> ${data.signerTitle}</p>
          <p><strong>Email:</strong> ${data.clientEmail}</p>
          <p><strong>Date:</strong> ${new Date(data.signedAt).toLocaleString()}</p>
          <hr>
          <h3>Audit Trail</h3>
          <p><strong>IP Address:</strong> ${clientIP}</p>
          <p><strong>User Agent:</strong> ${data.userAgent}</p>
          <p><strong>Agreed to Terms:</strong> ${data.agreedToTerms ? 'Yes' : 'No'}</p>
        `
      });

      // Email to client (confirmation)
      await sendEmail(resendApiKey, {
        from: 'BrandThnk <allison@brandthnk.co>',
        to: data.clientEmail,
        subject: `Agreement Signed - BrandThnk`,
        html: `
          <h2>Thank you for signing!</h2>
          <p>Hi ${data.signerName},</p>
          <p>This confirms your signature on the agreement with BrandThnk.</p>
          <p><strong>Contract:</strong> ${data.contractId}</p>
          <p><strong>Signed:</strong> ${new Date(data.signedAt).toLocaleString()}</p>
          <p>A copy of the signed agreement will be sent to you shortly.</p>
          <p>If you have any questions, please reply to this email.</p>
          <p>Best,<br>Allison Netzer<br>BrandThnk</p>
        `
      });
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

async function sendEmail(apiKey, { from, to, subject, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ from, to, subject, html })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Email send failed:', error);
    throw new Error('Failed to send email');
  }

  return response.json();
}
