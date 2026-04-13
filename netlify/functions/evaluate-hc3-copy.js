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
    console.log("HC3 copy evaluation function executing - optimized version");

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

    // Combined Analysis - Anti-Slop + HC3 Positioning in single API call
    const combinedAnalysisPrompt = `You are a copy analyzer for HC3, a financial services customer communications company. Perform BOTH anti-slop detection AND HC3 brand positioning evaluation.

PART 1: ANTI-SLOP ANALYSIS
Check for these key AI patterns (focus on most common):
- Contrarian Reframes: "It's not X, it's Y" structures
- Dead AI Language: "In today's", "leverage", "utilize", "cutting-edge"
- Game-Changer Terms: "revolutionize", "supercharge", "unlock", "10x"
- Corporate Jargon: "facilitating", "emphasizing", "optimize"
- Staccato Lists: "No X. No Y. Just Z." patterns

PART 2: HC3 POSITIONING EVALUATION
HC3 IS: Operational partner, specialist in beyond-core work, proactive ownership
HC3 IS NOT: Technology vendor, platform replacement, reactive support

Three Core Filters:
1. Family-owned operations focus (not platform replacement)
2. Migration-free capability addition (not forcing change)
3. Executive confidence (seamless operations)

Copy to analyze: "${copy}"

Return this EXACT JSON structure:
{
  "anti_slop": {
    "flagged_patterns": [{"pattern": "name", "line": "quote", "rewrite": "fix"}],
    "verdict": "assessment",
    "needs_revision": true/false,
    "suggested_rewrite": "improved copy or null"
  },
  "hc3_positioning": {
    "filter_1_score": 85,
    "filter_1_feedback": "brief analysis",
    "filter_2_score": 78,
    "filter_2_feedback": "brief analysis",
    "filter_3_score": 82,
    "filter_3_feedback": "brief analysis",
    "overall_score": 82,
    "recommendations": ["actionable fix 1", "actionable fix 2"]
  }
}`;

    // Single API call for combined analysis
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500, // Reduced for faster response
        messages: [{ role: "user", content: combinedAnalysisPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    let analysisResults;

    try {
      const jsonMatch = data.content[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResults = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in API response");
      }
    } catch (parseError) {
      // Fallback analysis structure
      analysisResults = {
        anti_slop: {
          flagged_patterns: [],
          verdict: "Analysis parsing failed",
          needs_revision: false,
          suggested_rewrite: null
        },
        hc3_positioning: {
          filter_1_score: 50,
          filter_1_feedback: "Could not complete analysis",
          filter_2_score: 50,
          filter_2_feedback: "Could not complete analysis",
          filter_3_score: 50,
          filter_3_feedback: "Could not complete analysis",
          overall_score: 50,
          recommendations: ["Please try again - analysis temporarily unavailable"]
        }
      };
    }

    // Determine overall zone based on HC3 score
    let overallZone;
    const overallScore = analysisResults.hc3_positioning.overall_score;
    if (overallScore >= 75) {
      overallZone = "strong";
    } else if (overallScore >= 50) {
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
        overall_score: overallScore,
        zone: overallZone,
        anti_slop_analysis: {
          first_pass: {
            overall_verdict: analysisResults.anti_slop.verdict,
            flagged_patterns: analysisResults.anti_slop.flagged_patterns,
            net_score: `${analysisResults.anti_slop.flagged_patterns.length} patterns flagged`,
            needs_revision: analysisResults.anti_slop.needs_revision,
            suggested_rewrite: analysisResults.anti_slop.suggested_rewrite
          },
          second_pass: null // Removed for performance
        },
        hc3_positioning: analysisResults.hc3_positioning,
        analysis_timestamp: new Date().toISOString(),
        copy_length: copy.length,
        revised_copy: analysisResults.anti_slop.suggested_rewrite
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