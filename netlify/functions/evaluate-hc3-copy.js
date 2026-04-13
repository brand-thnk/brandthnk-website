exports.handler = async function (event) {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    console.log("HC3 copy evaluation function executing");

    const { copy, options = {} } = JSON.parse(event.body);

    if (!copy || copy.trim().length < 50) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          error: "Copy must be at least 50 characters long"
        })
      };
    }

    // First Anti-Slop Analysis
    const antiSlopPrompt1 = `You are applying the Complete Anti-AI Slop Playbook. Check the provided copy against all 32 patterns and return a structured JSON response.

THE 32 ANTI-SLOP PATTERNS:

STRUCTURAL RED FLAGS:
1. Contrarian Reframes (FATAL): "It's not X, it's Y" and ALL variations - ANY sentence that negates one framing then asserts a corrected one
2. Triple Threat Syndrome: Everything grouped in threes (AI learned that three things = good writing)
3. Infomercial Transitions: "The catch?" / "Want to know the secret?" / "The brutal truth?"
4. Corporate Verb Disease: "highlighting the benefits" / "emphasizing critical importance" / "facilitating better outcomes"
5. Hedging Language: "it's worth considering..." / "you might want to think about..." / "it's important to note that..."
6. Thesaurus Abuse: "utilize" (use), "execute" (do), "facilitate" (help), "implement" (start), "optimize" (improve), "leverage" (use)

FORMATTING GIVEAWAYS:
7. Arrow Obsession: The → symbol used repeatedly
8. Emoji Explosion: Multiple emojis used as bullets or emphasis markers
9. Em Dash Overdose: Em dashes used more than twice in a short passage

PHRASE PATTERNS:
10. Staccato Lists: "No fluff. No theory. Just actionable insights." / "Your content, your products, your audience."
11. Game-Changer Cluster: "game-changer" / "supercharge your [thing]" / "the game has changed"
12. "Real" Overload: Stacking "real" to perform authenticity
13. The Serious Pitch: "If you're serious about [goal], let's [CTA]"
14. "To Your Success" Sign-Offs: "To your success," / "Here's to your growth,"
15. Profound But Obvious: States what everyone already knows as insight
16. Short Hook Questions: "The best part?" / "Want access?" / "Ready to level up?"
17. "Enter: [Thing]": "Enter: my revolutionary framework"
18. "Stopped Me in My Tracks": Melodramatic reaction language

CONTENT RED FLAGS:
19. Symbol Obsession: "this symbolizes..." / "which reflects..." / "emphasizing the importance of..."
20. Generic Case Study: Invented or vague people used as proof (AI favorite: Sarah Chen)
21. Everything Changed: Claiming total transformation without specifics

VOICE & TEXTURE RED FLAGS:
22. AI Smoothness Overload: Too clean, too rhythmic, no friction
23. Absent Voice Syndrome: Could have been written by anyone
24. Opened Threads, Neatly Tied: Following outline too perfectly
25. The Costco Croissant Effect: All form, no substance that sticks
26. Dead AI Language: "In today's [anything]" / "It's important to note" / "Delve/Dive into/Unpack" / "Harness/Leverage/Utilize"
27. Dead Transitions: "Furthermore/Additionally/Moreover" / "Moving forward"
28. Engagement Bait: "Let that sink in" / "Read that again" / "This changes everything"
29. AI Cringe Terms: "Supercharge/Unlock/Future-proof" / "10x your productivity"
30. Negation Runway: Multiple negations before positive claim
31. Generic Insider Claims: "Here's what nobody tells you" / "Most people don't realize"
32. Mechanical Writing Issues: Missing contractions, em dash overuse, abstract verbs

Copy to analyze: "${copy}"

Return ONLY valid JSON with this exact structure:
{
  "overall_verdict": "One sentence honest assessment",
  "flagged_patterns": [
    {
      "pattern_name": "Pattern Name",
      "pattern_number": 1,
      "offending_line": "exact quote from copy",
      "problem": "one sentence explanation",
      "rewrite": "concrete alternative"
    }
  ],
  "patterns_not_found": ["list of pattern categories that passed clean"],
  "net_score": "X of 32 patterns flagged",
  "needs_revision": true/false,
  "suggested_rewrite": "improved version of copy if major issues found, otherwise null"
}`;

    // First anti-slop analysis
    const antiSlopResponse1 = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: antiSlopPrompt1 }],
      }),
    });

    if (!antiSlopResponse1.ok) {
      throw new Error(`Anti-slop API error: ${antiSlopResponse1.status}`);
    }

    const antiSlopData1 = await antiSlopResponse1.json();
    let antiSlopResults1;

    try {
      const jsonMatch = antiSlopData1.content[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        antiSlopResults1 = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in anti-slop response");
      }
    } catch (parseError) {
      antiSlopResults1 = {
        overall_verdict: "Analysis failed due to parsing error",
        flagged_patterns: [],
        patterns_not_found: [],
        net_score: "Unable to determine",
        needs_revision: false,
        suggested_rewrite: null
      };
    }

    // Use original copy or revised copy for HC3 analysis
    const copyForHC3Analysis = antiSlopResults1.suggested_rewrite || copy;

    // HC3 Positioning Analysis
    const hc3PositioningPrompt = `You are evaluating marketing copy against HC3's brand positioning filters. HC3 is a financial services customer communications company positioned as a "Beyond-Core Specialist."

HC3 POSITIONING FILTERS:

FILTER 1 - IS/IS NOT:
- HC3 IS: An operational partner you trust with your most sensitive customer communications
- HC3 IS NOT: A technology vendor selling features on a comparison chart
- HC3 IS: A specialist in the work your core system was not built to do
- HC3 IS NOT: An enterprise platform that looks identical in the demo and diverges in year two
- HC3 IS: The team that takes ownership when something goes wrong and tells you before you have to ask
- HC3 IS NOT: The vendor you manage through support tickets and SLA reports

FILTER 2 - THREE POSITIONING STATEMENTS:
1. HC3 is a family-owned company that runs inside your operations, not a platform trying to replace the core
2. HC3 starts from where clients are today and adds capability without forcing a migration
3. When HC3 runs your customer communications, executive teams stop discussing them at quarterly reviews

FILTER 3 - COMPETITIVE DIFFERENTIATION:
- vs. Core-Bundled (Jack Henry, Fiserv): "Your core runs accounts. HC3 runs the communications those accounts depend on."
- vs. Enterprise CCM (Doxim): "The demo is identical. Ask what year two looks like."
- vs. Peer Specialists (PrintMail, InfoImage): "Everyone in this category runs statements. Ask what else they run."

CHECKLIST CRITERIA (9 items to evaluate):
1. Operational partner, not technology vendor
2. Specialization in beyond-core work, not platform replacement
3. Proactive ownership, not reactive vendor management
4. Running inside operations vs. replacing core systems
5. Building on current state, not forcing change
6. Seamless operations that reduce management overhead
7. Communications expertise vs. account management
8. Long-term delivery vs. demo promises
9. Comprehensive capabilities beyond statements

Copy to evaluate: "${copyForHC3Analysis}"

Analyze this copy against all HC3 positioning criteria. Return ONLY valid JSON:

{
  "filter_1_score": 85,
  "filter_1_feedback": "Specific analysis of Is/Is Not alignment",
  "filter_1_issues": ["specific issues found"],
  "filter_2_score": 78,
  "filter_2_feedback": "Analysis of three positioning statements",
  "filter_2_issues": ["specific issues found"],
  "filter_3_score": 82,
  "filter_3_feedback": "Competitive differentiation analysis",
  "filter_3_issues": ["specific issues found"],
  "overall_score": 82,
  "overall_zone": "strong|needs_work|weak",
  "checklist_results": [
    {"criterion": "Operational partner, not technology vendor", "passes": true, "feedback": "specific reason"},
    {"criterion": "Specialization in beyond-core work", "passes": false, "feedback": "specific issue"}
  ],
  "recommendations": [
    "Specific actionable recommendation 1",
    "Specific actionable recommendation 2"
  ],
  "passes_positioning_check": true/false
}`;

    // HC3 positioning analysis
    const hc3Response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2500,
        messages: [{ role: "user", content: hc3PositioningPrompt }],
      }),
    });

    if (!hc3Response.ok) {
      throw new Error(`HC3 positioning API error: ${hc3Response.status}`);
    }

    const hc3Data = await hc3Response.json();
    let hc3Results;

    try {
      const jsonMatch = hc3Data.content[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        hc3Results = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in HC3 positioning response");
      }
    } catch (parseError) {
      hc3Results = {
        filter_1_score: 50,
        filter_1_feedback: "Analysis failed due to parsing error",
        filter_1_issues: ["Could not complete evaluation"],
        filter_2_score: 50,
        filter_2_feedback: "Analysis failed due to parsing error",
        filter_2_issues: ["Could not complete evaluation"],
        filter_3_score: 50,
        filter_3_feedback: "Analysis failed due to parsing error",
        filter_3_issues: ["Could not complete evaluation"],
        overall_score: 50,
        overall_zone: "needs_work",
        checklist_results: [],
        recommendations: ["Please try again - analysis system temporarily unavailable"],
        passes_positioning_check: false
      };
    }

    // Second Anti-Slop Analysis (if first pass suggested revisions)
    let antiSlopResults2 = null;
    if (antiSlopResults1.needs_revision && antiSlopResults1.suggested_rewrite) {
      const antiSlopPrompt2 = antiSlopPrompt1.replace(`Copy to analyze: "${copy}"`, `Copy to analyze: "${antiSlopResults1.suggested_rewrite}"`);

      try {
        const antiSlopResponse2 = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            messages: [{ role: "user", content: antiSlopPrompt2 }],
          }),
        });

        if (antiSlopResponse2.ok) {
          const antiSlopData2 = await antiSlopResponse2.json();
          const jsonMatch2 = antiSlopData2.content[0].text.match(/\{[\s\S]*\}/);
          if (jsonMatch2) {
            antiSlopResults2 = JSON.parse(jsonMatch2[0]);
          }
        }
      } catch (error) {
        console.log("Second anti-slop analysis failed, continuing with first pass only");
      }
    }

    // Determine overall zone based on HC3 score
    let overallZone;
    if (hc3Results.overall_score >= 75) {
      overallZone = "strong";
    } else if (hc3Results.overall_score >= 50) {
      overallZone = "needs_work";
    } else {
      overallZone = "weak";
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        success: true,
        overall_score: hc3Results.overall_score,
        zone: overallZone,
        anti_slop_analysis: {
          first_pass: antiSlopResults1,
          second_pass: antiSlopResults2
        },
        hc3_positioning: hc3Results,
        analysis_timestamp: new Date().toISOString(),
        copy_length: copy.length,
        revised_copy: antiSlopResults1.suggested_rewrite
      })
    };

  } catch (error) {
    console.error("HC3 Copy Evaluation Error:", error);
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        success: false,
        error: error.message,
        fallback_message: "Analysis temporarily unavailable. Please use the manual checklist below.",
        manual_checklist: [
          "Check: Copy positions HC3 as operational partner, not technology vendor",
          "Check: Copy emphasizes specialization in beyond-core work",
          "Check: Copy highlights proactive ownership, not reactive vendor management",
          "Check: Copy reflects running inside operations vs. replacing core systems",
          "Check: Copy emphasizes building on current state, not forcing change",
          "Check: Copy suggests seamless operations that reduce management overhead",
          "Check: Copy distinguishes communications expertise from account management",
          "Check: Copy addresses long-term delivery vs. demo promises",
          "Check: Copy highlights comprehensive capabilities beyond statements"
        ]
      })
    };
  }
};