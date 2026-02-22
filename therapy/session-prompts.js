// SESSION PROMPTS FOR BRAND THERAPY
// Update this file whenever you add new thinkers, frameworks, or references.
// No need to touch the main component.
//
// HOW TO UPDATE:
// 1. Add new sources to the relevant session's `sources` array
// 2. Add new context to the `context` string
// 3. Push to Netlify. Done.

const BrandTherapyConfig = {
  sharedContext: `
The audience is US banks, credit unions, regional FIs, and fintechs selling
software or platforms to those institutions.

All ideas should be grounded in the BrandThnk philosophy: brand is not your
logo. It is your operating system, your momentum, your economic moat. Think
brand-first, not product-first. Challenge the sea of sameness in financial
services.
`,

  sessions: {
    identity: {
      name: 'Identity',
      icon: '🪞',
      blurb: 'Clarify or build identity around your brand name or any two words',

      // Add or remove sources here as your thinking evolves
      sources: [
        {
          name: 'April Dunford',
          concept: 'Obviously Awesome',
          application: `Competitive alternatives define differentiation. Find the
            market frame that makes your value obvious. Deliberate positioning
            over default positioning.`,
        },
        {
          name: 'Emily Heyward',
          concept: 'Obsessed',
          application: `Ground brand in a real problem, not a solution. Define
            what people should feel when they interact with you.`,
        },
        {
          name: 'Marty Neumeier',
          concept: 'The Brand Gap / Zag',
          application: `Brand is a gut feeling, not a logo. The core question:
            "What makes you the only?" The gap between strategy and creativity
            is where most FIs lose their identity.`,
        },
        {
          name: 'BrandThnk / Allison Netzer',
          concept: 'Think Like a Brand, Not a Bank (Second Edition)',
          application: `The F/M/B Model: align function, meaning, and brand.
            Most FIs lead with function (rates, products) and skip meaning
            entirely. Identity lives in the overlap of what you do, what it
            means to people, and how you show up.`,
        },
        {
          name: 'BrandThnk / Allison Netzer',
          concept: 'Momentum Marketing',
          application: `Internal momentum drives external identity. If your
            team can't articulate what the brand stands for, your market
            won't either.`,
        },
      ],

      context: `This is the mirror-holding session. It helps FIs and fintechs
        see themselves how the market actually sees them, not how they wish to
        be seen.

        Ideas should address: stripping away the logo, tagline, and rate sheet
        to find what's actually there. The hard truth that most FIs are
        interchangeable and most fintechs sound identical.

        Ideas should force uncomfortable clarity, the kind that makes a room
        go quiet before the real work begins.`,
    },

    products: {
      name: 'Products',
      icon: '📦',
      blurb: 'Fresh product ideas from a brand lens using your inputs',

      sources: [
        {
          name: 'BrandThnk / Allison Netzer',
          concept: 'Think Like a Brand, Not a Bank (Second Edition)',
          application: `Every product is a brand expression. Products should
            embody the brand, not just serve a function. A checking account
            that feels like your brand is worth more than one that just
            works like every other checking account.`,
        },
        {
          name: 'BrandThnk / Allison Netzer',
          concept: 'Aspirations First',
          application: `Lead with what people aspire to, not what you sell.
            Products designed around aspirations create emotional connection
            that rate-driven products never will.`,
        },
        {
          name: 'Emily Heyward',
          concept: 'Obsessed',
          application: `The most important question is not what the product
            does, but what you want people to feel when they use it.`,
        },
      ],

      context: `For FIs: think deposit products, lending innovations, financial
        wellness tools, youth and Gen Z accounts, small business banking
        packages, digital-first account experiences, or member loyalty programs.

        For fintechs selling to FIs: think SaaS platforms, API integrations,
        white-label solutions, compliance automation, onboarding platforms,
        data analytics dashboards, or AI-powered underwriting.

        Ideas should solve real pain points and create competitive
        differentiation. The bar: would this product make someone switch
        institutions or choose this fintech over the next demo?`,
    },

    storytelling: {
      name: 'Story Starters',
      icon: '📖',
      blurb: 'Starting points for narratives around your brand name or any two words',

      sources: [
        {
          name: 'Doug Holt',
          concept: 'Cultural Strategy / How Brands Become Icons',
          application: `Brands become icons by addressing cultural tensions and
            creating identity myths, not by running better ads. The best FI
            stories tap into tensions their communities are already feeling.`,
        },
        {
          name: 'Emily Heyward',
          concept: 'Obsessed',
          application: `Emotional connection comes from specificity, not
            generality. "We care about our community" means nothing. The
            specific story of one family, one business, one moment does
            the work that taglines never will.`,
        },
        {
          name: 'BrandThnk / Allison Netzer',
          concept: 'Think Like a Brand, Not a Bank (Second Edition)',
          application: `Lead with humanity, not products. Stories should be
            conviction-driven, not corporate. The same "we care about you"
            messaging every FI runs is not a story. It is wallpaper.`,
        },
        {
          name: 'BrandThnk / Allison Netzer',
          concept: 'Momentum Marketing',
          application: `Internal stories matter as much as external ones.
            Employee culture stories attract talent and build brand alignment
            from the inside out.`,
        },
      ],

      context: `Ideas should be narrative frameworks and story concepts that
        financial services companies can actually use.

        Think: brand origin stories that go beyond "founded in 1952," customer
        success narratives that put the member as the hero (not the institution),
        case study formats that prove ROI without reading like whitepapers,
        thought leadership angles that challenge industry orthodoxy, founder
        stories for fintechs selling into FIs, employee culture stories that
        attract talent, community impact narratives tied to CRA and
        reinvestment, financial wellness storytelling that builds trust with
        Gen Z and millennials, and conference keynote narrative arcs.

        Stories should feel human, specific, and conviction-driven. Not
        corporate, not safe, not interchangeable.`,
    },
  },

  // BUILD THE PROMPT
  // This function assembles the final prompt from the config above.
  // The component calls this instead of managing prompt strings directly.
  buildSessionPrompt: function(sessionId, word1, word2) {
    const session = this.sessions[sessionId];
    if (!session) return '';

    const sourceText = session.sources
      .map(s => `${s.name} (${s.concept}): ${s.application}`)
      .join('\n\n');

    return `Generate exactly 4 creative and practical ideas that combine the words "${word1}" and "${word2}" for ${session.context}

Draw from these thinkers and frameworks:
${sourceText}

Shared context:
${this.sharedContext}

Make the ideas innovative, unique, practical and achievable. Each idea should have a clear title followed by a detailed explanation. Vary scope and approach.

Format as a numbered list: "1. [Idea Title] - [Detailed explanation in 1-2 sentences]"

Example: "1. The Mirror Audit - A structured 90-day process where an outside strategist interviews customers, prospects, and lost deals to build an honest portrait of how the market actually perceives the institution, presented back to the C-suite as a gap analysis between brand intent and brand reality."

Generate exactly 4 ideas. Make sure every idea has both a title AND a description separated by " - "`;
  }
};

// Export for browser usage
window.BrandTherapyConfig = BrandTherapyConfig;
