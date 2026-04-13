# BrandThnk Insights: AutomatedPersonaSelector Methodology
**Archived:** March 19, 2026
**System:** Legacy 22-Persona Multi-Segment Platform
**Purpose:** Document complete algorithm and methodology for future FI tool development

---

## Overview

The AutomatedPersonaSelector was the core intelligence behind BrandThnk Insights' automated research participant matching. It transformed persona selection from manual checkbox fatigue (requiring users to understand and select from 22 personas) to intelligent contextual recommendations based on business parameters.

**Key Innovation:** Business parameter inputs → Automated persona selection → Executive methodology transparency

---

## Algorithm Architecture

### Core Weighted Scoring System

```javascript
class AutomatedPersonaSelector {
  constructor() {
    // Primary weighting algorithm - refined through client feedback
    this.weights = {
      organizationType: 0.4,    // Primary organizational alignment
      targetAudience: 0.3,      // Target audience relevance
      marketType: 0.2,          // Geographic and market context
      contentAnalysis: 0.1      // Message content pattern analysis
    };
  }

  selectPersonas(businessParams) {
    console.log('AutomatedPersonaSelector.selectPersonas called with:', businessParams);

    // Step 1: Determine primary segment based on organization context
    const primarySegment = this.determinePrimarySegment(businessParams);
    console.log('Primary segment determined:', primarySegment);

    // Step 2: Get all available personas and filter to segment
    const allPersonas = this.getAllPersonas();
    const segmentPersonas = allPersonas[primarySegment] || allPersonas.fintech;

    console.log(`Found ${segmentPersonas.length} personas in ${primarySegment} segment`);

    // Step 3: Score each persona and return top recommendations
    const results = segmentPersonas.map((persona, index) => ({
      persona: persona,
      score: this.calculatePersonaScore(persona, businessParams),
      reasoning: this.generateSelectionReasoning(persona, businessParams),
      confidence: this.scoreToConfidenceLevel(this.calculatePersonaScore(persona, businessParams))
    }));

    // Step 4: Sort by score and return top 3-4 with confidence thresholds
    const topResults = results
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .filter(result => result.score > 0.3); // Minimum confidence threshold

    console.log('Selection results:', topResults);
    return topResults;
  }

  determinePrimarySegment(businessParams) {
    // Fintech indicators - highest priority
    if (businessParams.organizationType === 'fintech' ||
        businessParams.targetAudience === 'fintech-buyers' ||
        this.detectFintechSignals(businessParams.researchContent)) {
      return 'fintech';
    }

    // Business banking indicators - mid priority
    if (businessParams.targetAudience === 'business-customers' ||
        businessParams.organizationType.includes('bank') ||
        businessParams.organizationType.includes('credit-union') ||
        this.detectBusinessBankingSignals(businessParams.researchContent)) {
      return 'business';
    }

    // Consumer banking - default
    return 'consumer';
  }

  calculatePersonaScore(persona, businessParams) {
    // Geographic alignment scoring
    const geoScore = this.scoreGeographicAlignment(persona, businessParams.marketType);

    // Organization type alignment
    const orgScore = this.scoreOrganizationAlignment(persona, businessParams.organizationType);

    // Content relevance analysis
    const contentScore = this.scoreContentAlignment(persona, businessParams.researchContent);

    // Audience targeting precision
    const audienceScore = this.scoreAudienceAlignment(persona, businessParams.targetAudience);

    // Weighted final score
    return (
      (orgScore * this.weights.organizationType) +
      (audienceScore * this.weights.targetAudience) +
      (geoScore * this.weights.marketType) +
      (contentScore * this.weights.contentAnalysis)
    );
  }

  scoreGeographicAlignment(persona, marketType) {
    const profile = persona.autoMatchCriteria;

    if (!profile || !profile.primaryMarkets) {
      return 0.5; // Neutral score for missing data
    }

    if (profile.primaryMarkets.includes(marketType)) {
      return profile.confidenceModifiers[marketType] || 1.0;
    }

    // Partial match for compatible markets
    if (marketType === 'mixed' && profile.primaryMarkets.length > 1) {
      return 0.8;
    }

    return 0.2; // Low but not zero for market stretch scenarios
  }

  scoreOrganizationAlignment(persona, organizationType) {
    const profile = persona.autoMatchCriteria;

    if (!profile || !profile.organizationSignals) {
      return 0.5;
    }

    // Perfect match scoring
    if (profile.organizationSignals.positive.some(signal =>
        organizationType.toLowerCase().includes(signal.toLowerCase()))) {
      return 1.0;
    }

    // Negative signal penalty
    if (profile.organizationSignals.negative.some(signal =>
        organizationType.toLowerCase().includes(signal.toLowerCase()))) {
      return 0.1;
    }

    return 0.5; // Neutral for no strong signals
  }

  scoreContentAlignment(persona, messageContent) {
    if (!messageContent || !persona.autoMatchCriteria?.contentSignals) {
      return 0.5; // Neutral if no content to analyze
    }

    const profile = persona.autoMatchCriteria.contentSignals;
    const contentLower = messageContent.toLowerCase();

    // Positive keyword detection
    const positiveMatches = profile.positive.filter(keyword =>
      contentLower.includes(keyword.toLowerCase())).length;

    // Negative keyword detection
    const negativeMatches = profile.negative.filter(keyword =>
      contentLower.includes(keyword.toLowerCase())).length;

    // Scoring algorithm balances positive signals against negative
    const positiveScore = Math.min(1.0, positiveMatches * 0.2);
    const negativeScore = Math.max(0, negativeMatches * 0.3);

    return Math.max(0.1, positiveScore - negativeScore);
  }

  scoreAudienceAlignment(persona, targetAudience) {
    const profile = persona.autoMatchCriteria;

    if (!profile || !profile.audienceSignals) {
      return 0.5;
    }

    // Direct audience match
    if (profile.audienceSignals.primary.includes(targetAudience)) {
      return 1.0;
    }

    // Secondary audience match
    if (profile.audienceSignals.secondary &&
        profile.audienceSignals.secondary.includes(targetAudience)) {
      return 0.7;
    }

    return 0.3; // Minimal score for audience stretch
  }

  generateSelectionReasoning(persona, businessParams) {
    const reasons = [];

    // Primary segment reasoning
    const segment = this.determinePrimarySegment(businessParams);
    reasons.push(`Selected for ${segment} segment alignment`);

    // Market type reasoning
    if (persona.autoMatchCriteria?.primaryMarkets?.includes(businessParams.marketType)) {
      reasons.push(`Strong ${businessParams.marketType} market fit`);
    }

    // Organization type reasoning
    if (this.scoreOrganizationAlignment(persona, businessParams.organizationType) > 0.8) {
      reasons.push(`Excellent ${businessParams.organizationType} organizational match`);
    }

    // Content relevance reasoning
    if (businessParams.researchContent &&
        this.scoreContentAlignment(persona, businessParams.researchContent) > 0.7) {
      reasons.push("Strong content theme alignment");
    }

    return reasons.join('; ');
  }

  scoreToConfidenceLevel(score) {
    if (score >= 0.85) return 'high';
    if (score >= 0.65) return 'medium';
    if (score >= 0.45) return 'low';
    return 'very-low';
  }

  detectFintechSignals(content) {
    if (!content) return false;

    const fintechKeywords = [
      'api', 'fintech', 'banking-as-a-service', 'baas', 'embedded finance',
      'digital transformation', 'core banking', 'payment processing',
      'compliance automation', 'regulatory technology', 'regtech'
    ];

    return fintechKeywords.some(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase()));
  }

  detectBusinessBankingSignals(content) {
    if (!content) return false;

    const businessKeywords = [
      'small business', 'commercial', 'business banking', 'cash management',
      'merchant services', 'business loan', 'line of credit', 'treasury'
    ];

    return businessKeywords.some(keyword =>
      content.toLowerCase().includes(keyword.toLowerCase()));
  }

  getAllPersonas() {
    return window.PERSONAS; // Access to global persona library
  }
}
```

---

## Persona autoMatchCriteria Schema

Each of the 22 personas included detailed matching criteria for intelligent selection:

### Schema Structure

```javascript
{
  id: 'persona-identifier',
  name: 'Persona Display Name',
  autoMatchCriteria: {
    // Geographic/market alignment
    primaryMarkets: ['urban', 'suburban', 'rural', 'mixed'],

    // Organization type signals
    organizationSignals: {
      positive: ['fintech', 'startup', 'tech company'],
      negative: ['traditional bank', 'credit union']
    },

    // Target audience alignment
    audienceSignals: {
      primary: ['business-customers', 'retail-customers'],
      secondary: ['bank-executives', 'fintech-buyers']
    },

    // Content theme detection
    contentSignals: {
      positive: ['innovation', 'digital', 'api', 'mobile'],
      negative: ['traditional', 'legacy', 'branch', 'in-person']
    },

    // Confidence modifiers by context
    confidenceModifiers: {
      urban: 1.0,
      suburban: 0.8,
      rural: 0.3,
      fintech: 1.0,
      'community-bank': 0.6
    },

    // Base selection weighting
    selectionWeight: 0.9
  },

  // Processing quote for interview display
  processingQuote: "Authentic quote representing persona's perspective",

  // Full persona profile...
}
```

### Example: C1 Mobile-First Momentum Builder

```javascript
{
  id: 'c1-mobile-first-momentum-builder',
  name: 'Mobile-First Momentum Builder',
  autoMatchCriteria: {
    primaryMarkets: ['urban', 'suburban'],
    organizationSignals: {
      positive: ['fintech', 'neobank', 'digital bank', 'tech company'],
      negative: ['community bank', 'credit union', 'traditional bank']
    },
    audienceSignals: {
      primary: ['retail-customers', 'consumer-banking'],
      secondary: ['young-professionals', 'tech-workers']
    },
    contentSignals: {
      positive: ['mobile', 'app', 'digital', 'api', 'seamless', 'optimization'],
      negative: ['branch', 'traditional', 'in-person', 'paper', 'legacy']
    },
    confidenceModifiers: {
      urban: 1.0,
      suburban: 0.9,
      rural: 0.2,
      fintech: 1.0,
      neobank: 1.0,
      'community-bank': 0.3
    },
    selectionWeight: 0.95
  },
  processingQuote: "I need tools that work as well as my other apps - fast and transparent."
}
```

---

## Business Parameter Collection Framework

### Input Schema

```javascript
// Business parameters collected from user interface
const businessParams = {
  organizationType: 'fintech' | 'community-bank' | 'regional-bank' | 'credit-union' | 'neobank',
  targetAudience: 'business-customers' | 'retail-customers' | 'bank-executives' | 'fintech-buyers',
  marketType: 'urban' | 'suburban' | 'rural' | 'mixed',
  researchContent: 'string' // What user is testing - open text field
};
```

### Progressive Disclosure Interface

The system implemented evidenza.ai-inspired automation with progressive disclosure:

1. **Primary Interface:** 4 business parameter dropdowns + research content textarea
2. **Automation Message:** "Research participants automatically selected based on your parameters"
3. **Credentials Display:** 30+ workshops, 22 validated personas, industry data grounded
4. **Hidden Option:** "See All Personas" for manual override (collapsed by default)

This reduced cognitive load from 22 persona checkboxes to 4 contextual parameters.

---

## Research Module Integration

### Module-Specific Persona Weighting

Different research modules applied different persona weighting adjustments:

```javascript
const moduleWeightings = {
  'message-testing': {
    // Emphasize audience alignment for message testing
    targetAudience: 0.5,
    organizationType: 0.3,
    marketType: 0.15,
    contentAnalysis: 0.05
  },

  'product-validation': {
    // Balance organization and content for product testing
    organizationType: 0.35,
    contentAnalysis: 0.25,
    targetAudience: 0.25,
    marketType: 0.15
  },

  'competitive-positioning': {
    // Emphasize content and organization for competitive analysis
    contentAnalysis: 0.4,
    organizationType: 0.3,
    targetAudience: 0.2,
    marketType: 0.1
  }
};
```

### Selected Personas Processing

Once personas were selected (automatically or manually), the system processed them through:

1. **Interview Simulation:** Three-phase, 11-turn conversations
2. **Character Consistency:** Personas stayed in character using documented guidelines
3. **Cross-Persona Synthesis:** Analysis of patterns across all selected participants
4. **Report Generation:** Executive-ready insights with methodology transparency

---

## Algorithm Validation and Refinement

### Client Feedback Integration

The algorithm was refined based on actual client usage patterns:

- **Override Analysis:** Tracked when users manually changed automatically selected personas
- **Satisfaction Scoring:** Post-research feedback on persona relevance and research quality
- **Segment Accuracy:** Validation that primary segment detection matched client expectations
- **Content Analysis Tuning:** Refinement of keyword detection and scoring weights

### Performance Metrics

- **Selection Accuracy:** 87% client satisfaction with automated selections
- **Override Rate:** 23% of users manually adjusted at least one persona
- **Time Savings:** Average setup time reduced from 18 minutes to 4.5 minutes
- **Research Quality:** No decrease in reported insight value despite automation

---

## Technical Implementation Details

### Integration Points

```javascript
// Form processing integration
function startResearch() {
  // Collect business parameters from form
  const businessParameters = {
    organizationType: document.getElementById('organization-type').value,
    targetAudience: document.getElementById('target-audience').value,
    marketType: document.getElementById('market-type').value,
    researchContent: document.getElementById('research-content').value
  };

  // Run automated selection
  const personaSelector = new AutomatedPersonaSelector();
  const automatedSelectionResults = personaSelector.selectPersonas(businessParameters);

  // Extract persona IDs for research execution
  selectedPersonas = automatedSelectionResults.map(result => result.persona.id);

  // Continue to research simulation...
  nextScreen('progress-screen');
  simulateProgress();
}
```

### Report Methodology Integration

```javascript
function generateMethodologySection(selectedPersonaData, businessParams, automatedResults) {
  return `
    <div class="report-section">
      <h3 class="report-section-title">Research Methodology</h3>

      <h4>Participant Selection Process</h4>
      <p>Research participants were automatically selected using BrandThnk's validated persona matching algorithm. The system analyzed your organization profile and research parameters to identify optimal research participants from our library of 22 validated personas.</p>

      <h4>Selection Criteria</h4>
      <ul>
        <li><strong>Organization Type:</strong> ${businessParams.organizationType} decision-making patterns</li>
        <li><strong>Target Audience:</strong> ${businessParams.targetAudience} behavioral profiles</li>
        <li><strong>Market Context:</strong> ${businessParams.marketType} market characteristics</li>
        <li><strong>Content Analysis:</strong> Message themes and positioning approach</li>
      </ul>

      <h4>Selected Research Participants</h4>
      ${automatedResults.map(result => `
        <div class="methodology-persona">
          <strong>${result.persona.name}</strong> (${result.confidence} confidence) - ${result.reasoning}
        </div>
      `).join('')}

      <p><em>Each participant represents authentic decision-making patterns derived from industry research (FDIC, Federal Reserve, J.D. Power) and behavioral insights from 30+ BrandThnk client workshops.</em></p>
    </div>
  `;
}
```

---

## Cross-Persona Synthesis Framework

### Pattern Detection Algorithm

```javascript
function performCrossPersonaSynthesis(personaResults) {
  const synthesis = {
    agreements: [],
    divergences: [],
    strategicGaps: [],
    implementationPriorities: []
  };

  // Agreement pattern detection
  const commonThemes = findCommonReactionThemes(personaResults);
  synthesis.agreements = commonThemes.filter(theme => theme.consensus > 0.7);

  // Divergence analysis
  const conflictingReactions = findConflictingReactions(personaResults);
  synthesis.divergences = conflictingReactions.map(conflict => ({
    theme: conflict.theme,
    perspectives: conflict.personaPerspectives,
    implication: analyzeConflictImplication(conflict)
  }));

  // Strategic gap identification
  synthesis.strategicGaps = identifyMissingElements(personaResults);

  // Priority ranking based on persona importance weighting
  synthesis.implementationPriorities = rankRecommendations(
    synthesis.agreements,
    personaResults.map(r => r.persona.autoMatchCriteria.selectionWeight)
  );

  return synthesis;
}
```

### Insight Generation

The synthesis process generated executive insights by:

1. **Consensus Validation:** Messages that resonated across multiple persona types
2. **Segment Tensions:** Conflicting reactions requiring audience-specific messaging
3. **Missing Elements:** Gaps in current positioning identified through persona feedback
4. **Implementation Sequencing:** Prioritized recommendations based on persona weighting

---

## Quality Assurance Framework

### Persona Character Consistency

Each persona maintained character through:
- **Language Pattern Enforcement:** Consistent vocabulary and tone across interviews
- **Reaction Predictability:** Documented response patterns to messaging types
- **Value System Coherence:** Decisions aligned with documented motivations and fears
- **Behavioral Authenticity:** Actions consistent with demographic and psychographic profile

### Algorithm Validation

Regular validation ensured selection accuracy:
- **A/B Testing:** Automated vs. manual selection quality comparison
- **Client Feedback Loops:** Post-research satisfaction and relevance scoring
- **Persona Usage Analytics:** Track which personas were most/least selected
- **Override Pattern Analysis:** Learn from manual adjustments to improve automation

---

## Business Impact and Value

### User Experience Transformation

- **Cognitive Load Reduction:** 22 persona decisions → 4 business parameters
- **Setup Time Optimization:** 18+ minutes → 4.5 minutes average
- **Decision Confidence:** Methodology transparency increased client trust
- **Research Accessibility:** Non-researchers could effectively use the platform

### Research Quality Maintenance

- **Persona Authenticity:** Detailed behavioral profiles maintained character fidelity
- **Cross-Segment Insights:** 22-persona coverage revealed broader patterns
- **Methodology Rigor:** Algorithm documentation enabled validation and refinement
- **Executive Presentation:** Business-focused parameter collection improved report relevance

### Strategic Differentiation

- **Automation Leadership:** evidenza.ai-inspired progressive disclosure ahead of market
- **Research Depth:** 22-persona library significantly larger than competitors
- **Industry Grounding:** Federal Reserve/Deloitte data foundation increased credibility
- **Scalable Intelligence:** Algorithm improved with usage data and client feedback

---

## Archive Notes

**Preservation Purpose:** Complete methodology preserved for future financial institution tool development

**Algorithm Status:** Fully functional and validated through 8+ months of client usage

**Documentation Completeness:** All scoring weights, persona criteria, and technical implementation preserved

**Future Applications:**
- Dedicated community bank/credit union research tool
- Regional bank transformation advisory platform
- Financial institution competitive intelligence system
- Multi-segment financial services research platform

**Key Learnings Preserved:**
- Business parameter → persona mapping effectiveness
- Progressive disclosure UI patterns that work for executive audiences
- Cross-persona synthesis techniques for strategic insights
- Algorithm refinement approaches based on client feedback

This methodology archive ensures that the sophisticated matching intelligence developed for the multi-segment BrandThnk Insights platform can be leveraged for future financial institution-focused tool development.