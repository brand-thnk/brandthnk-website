// Netlify Function: No-Logo Audit Lead Capture
// Subscribes to Beehiiv, creates HubSpot contact, sends branded scorecard email via Resend

// ─── Helpers ────────────────────────────────────────────────────────────────

function scoreLabel(score) {
  if (score >= 4) return 'Strong';
  if (score === 3) return 'Developing';
  return 'Needs work';
}

function verdictColor(verdict) {
  if (verdict === 'Recognizable') return '#000000';
  if (verdict === 'Generic but Competent') return '#555555';
  return '#888888';
}

function verdictLine(verdict, total) {
  if (verdict === 'Recognizable') {
    return 'Strip the logo and people still know it\'s you. That\'s what most brands spend years trying to get to.';
  }
  if (verdict === 'Generic but Competent') {
    return 'Professionally produced. Hard to tell apart from your competitors.';
  }
  return 'Content is going out, but nothing is accumulating. A competitor could publish all of it without changing a word.';
}

function dimensionBar(score) {
  const filled = Math.round(score);
  const empty = 5 - filled;
  const bars = '█'.repeat(filled) + '░'.repeat(empty);
  return bars;
}

// ─── Scorecard HTML Email ────────────────────────────────────────────────────

function buildScorecardEmail(name, scores, totalScore, verdict) {
  const firstName = name ? name.split(' ')[0] : 'there';
  const dimensions = [
    { key: 'voice',       label: 'Voice Consistency' },
    { key: 'pov',         label: 'Point of View' },
    { key: 'distinction', label: 'Category Distinction' },
    { key: 'clarity',     label: 'Decision Clarity' },
    { key: 'memory',      label: 'Memory Value' },
  ];

  const dimensionRows = dimensions.map(d => {
    const s = scores[d.key] || 0;
    return `
      <tr>
        <td style="padding:10px 16px; border-bottom:1px solid #E0E0E0; font-family:'Courier New',monospace; font-size:13px; color:#000;">
          ${d.label}
        </td>
        <td style="padding:10px 16px; border-bottom:1px solid #E0E0E0; font-family:'Courier New',monospace; font-size:13px; color:#000; white-space:nowrap;">
          ${dimensionBar(s)} ${s}/5
        </td>
        <td style="padding:10px 16px; border-bottom:1px solid #E0E0E0; font-family:'Courier New',monospace; font-size:12px; color:#666; white-space:nowrap;">
          ${scoreLabel(s)}
        </td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Your No-Logo Audit Scorecard</title>
</head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:'Courier New',monospace;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:32px 16px;">
  <tr>
    <td>
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;">

        <!-- Header -->
        <tr>
          <td style="background:#000000;padding:28px 32px;">
            <p style="margin:0;font-family:Georgia,serif;font-size:13px;color:#FFEB3B;letter-spacing:0.12em;text-transform:uppercase;">BrandThnk</p>
            <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:22px;color:#FFFFFF;font-weight:700;line-height:1.2;">
              90-Day No-Logo Audit
            </h1>
            <p style="margin:6px 0 0;font-family:'Courier New',monospace;font-size:12px;color:#999;letter-spacing:0.06em;text-transform:uppercase;">Scorecard</p>
          </td>
        </tr>

        <!-- Verdict -->
        <tr>
          <td style="background:#FFEB3B;padding:20px 32px;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;color:#000;letter-spacing:0.1em;text-transform:uppercase;">Diagnosis</p>
            <p style="margin:6px 0 4px;font-family:Georgia,serif;font-size:20px;font-weight:700;color:#000;">${verdict}</p>
            <p style="margin:0;font-family:'Courier New',monospace;font-size:12px;color:#333;line-height:1.5;">${verdictLine(verdict, totalScore)}</p>
          </td>
        </tr>

        <!-- Score total -->
        <tr>
          <td style="background:#FFFFFF;padding:20px 32px 0;">
            <p style="margin:0;font-family:'Courier New',monospace;font-size:12px;color:#666;letter-spacing:0.08em;text-transform:uppercase;">
              Hi ${firstName} — here's how your brand scored:
            </p>
            <p style="margin:8px 0 0;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#000;">${totalScore} <span style="font-size:16px;font-weight:400;color:#666;">/ 25</span></p>
          </td>
        </tr>

        <!-- Dimension table -->
        <tr>
          <td style="background:#FFFFFF;padding:16px 32px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0E0E0;border-radius:6px;overflow:hidden;">
              <thead>
                <tr style="background:#F5F5F5;">
                  <th style="padding:10px 16px;font-family:'Courier New',monospace;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.08em;text-align:left;border-bottom:1px solid #E0E0E0;">Dimension</th>
                  <th style="padding:10px 16px;font-family:'Courier New',monospace;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.08em;text-align:left;border-bottom:1px solid #E0E0E0;">Score</th>
                  <th style="padding:10px 16px;font-family:'Courier New',monospace;font-size:11px;color:#666;text-transform:uppercase;letter-spacing:0.08em;text-align:left;border-bottom:1px solid #E0E0E0;">Signal</th>
                </tr>
              </thead>
              <tbody>${dimensionRows}</tbody>
            </table>
          </td>
        </tr>

        <!-- What's next -->
        <tr>
          <td style="background:#FFFFFF;padding:0 32px 28px;">
            <div style="border-left:3px solid #FFEB3B;padding:12px 16px;background:#FFFDE7;">
              <p style="margin:0 0 6px;font-family:Georgia,serif;font-size:13px;font-weight:700;color:#000;">What to do with this</p>
              <p style="margin:0;font-family:'Courier New',monospace;font-size:12px;color:#333;line-height:1.6;">
                POV and Distinction move the other three — fix those first. Start with two questions: what does your brand actually believe, and what would it never say. Content strategy follows from that work.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#000000;padding:20px 32px;">
            <p style="margin:0 0 4px;font-family:'Courier New',monospace;font-size:11px;color:#FFEB3B;letter-spacing:0.1em;text-transform:uppercase;">BrandThnk</p>
            <p style="margin:0;font-family:'Courier New',monospace;font-size:11px;color:#666;line-height:1.5;">
              Brand strategy for financial services and fintech.<br>
              <a href="https://brandthnk.co" style="color:#999;text-decoration:none;">brandthnk.co</a>
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>`;
}

// ─── Resend email send ───────────────────────────────────────────────────────

async function sendScorecardEmail(toName, toEmail, scores, totalScore, verdict) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('Resend not configured — skipping email send');
    return 'not_configured';
  }

  const htmlBody = buildScorecardEmail(toName, scores, totalScore, verdict);
  const subject  = `Your No-Logo Audit: ${verdict} (${totalScore}/25)`;
  const to       = toName ? `${toName} <${toEmail}>` : toEmail;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'BrandThnk <allison@brandthnk.co>',
        to: [to],
        subject,
        html: htmlBody,
      }),
    });

    if (res.ok) return 'success';

    const err = await res.text();
    console.error('Resend error:', err);
    return 'failed';
  } catch (err) {
    console.error('Resend send error:', err.message);
    return 'failed';
  }
}

// ─── Beehiiv subscribe ───────────────────────────────────────────────────────

async function subscribeBeehiiv(email, name, totalScore, verdict) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId  = process.env.BEEHIIV_PUBLICATION_ID || process.env.BEEHIIV_PUB_ID;

  if (!apiKey || !pubId) {
    console.warn('Beehiiv not configured');
    return 'not_configured';
  }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email,
          reactivate_existing: false,
          send_welcome_email: false,
          utm_source: 'no_logo_audit',
          utm_medium: 'tool',
          referring_site: 'brandthnk.co/tools/no-logo-audit',
          custom_fields: [
            { name: 'source',        value: '90-Day No-Logo Audit' },
            { name: 'audit_score',   value: String(totalScore) },
            { name: 'audit_verdict', value: verdict },
          ],
        }),
      }
    );
    return res.ok ? 'success' : 'failed';
  } catch (err) {
    console.error('Beehiiv error:', err.message);
    return 'error';
  }
}

// ─── HubSpot contact ─────────────────────────────────────────────────────────

async function upsertHubSpot(email, name, totalScore, verdict, scores) {
  const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  if (!token) {
    console.warn('HubSpot not configured');
    return 'not_configured';
  }

  const firstName = name ? name.split(' ')[0] : '';
  const lastName  = name && name.includes(' ') ? name.split(' ').slice(1).join(' ') : '';

  const properties = {
    email,
    firstname: firstName,
    lastname: lastName,
    hs_lead_status: 'NEW',
    lifecyclestage: 'lead',
    // Custom properties — add these in HubSpot if they don't exist
    no_logo_audit_score:   String(totalScore),
    no_logo_audit_verdict: verdict,
    lead_source:           '90-Day No-Logo Audit',
  };

  try {
    // Try create first; if conflict (409), update instead
    const createRes = await fetch('https://api.hubspot.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ properties }),
    });

    if (createRes.ok) return 'created';

    if (createRes.status === 409) {
      // Contact exists — patch it
      const existing = await createRes.json();
      const id = existing?.message?.match(/ID: (\d+)/)?.[1];
      if (!id) return 'conflict_unresolved';

      const patchRes = await fetch(
        `https://api.hubspot.com/crm/v3/objects/contacts/${id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ properties }),
        }
      );
      return patchRes.ok ? 'updated' : 'patch_failed';
    }

    const errText = await createRes.text();
    console.error('HubSpot create error:', errText);
    return 'failed';
  } catch (err) {
    console.error('HubSpot error:', err.message);
    return 'error';
  }
}

// ─── Google Sheets log ───────────────────────────────────────────────────────

async function logToSheets(email, name, totalScore, verdict, scores) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl) return 'not_configured';

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        source:    '90-Day No-Logo Audit',
        email,
        name,
        total_score:    totalScore,
        verdict,
        score_voice:       scores.voice       || 0,
        score_pov:         scores.pov         || 0,
        score_distinction: scores.distinction || 0,
        score_clarity:     scores.clarity     || 0,
        score_memory:      scores.memory      || 0,
      }),
    });
    return res.ok ? 'success' : 'failed';
  } catch (err) {
    console.error('Sheets log error:', err.message);
    return 'error';
  }
}

// ─── Handler ─────────────────────────────────────────────────────────────────

exports.handler = async (event) => {
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
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let name, email, scores, totalScore, verdict;

  try {
    ({ name, email, scores, totalScore, verdict } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!email || !email.includes('@')) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) };
  }

  if (typeof totalScore === 'undefined' || !verdict) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Score data required' }) };
  }

  // Run all integrations in parallel — none are blocking
  const [beehiiv, hubspot, email_result, sheets] = await Promise.all([
    subscribeBeehiiv(email, name, totalScore, verdict),
    upsertHubSpot(email, name, totalScore, verdict, scores || {}),
    sendScorecardEmail(name, email, scores || {}, totalScore, verdict),
    logToSheets(email, name, totalScore, verdict, scores || {}),
  ]);

  console.log('no-logo-capture results:', { beehiiv, hubspot, email: email_result, sheets });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      results: { beehiiv, hubspot, email: email_result, sheets },
    }),
  };
};
