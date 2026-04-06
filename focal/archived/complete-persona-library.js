// Complete 22-Persona Library for BrandThnk Insights
// Extracted from validated persona library with full psychographic profiles

const COMPLETE_PERSONA_LIBRARY = {
  consumer: [
    {
      id: 'c1-mobile-first-momentum-builder',
      name: 'Mobile-First Momentum Builder',
      age: '24-32',
      segment: 'Early-career professional',
      coreMotivation: 'Build financial momentum through efficient digital tools',
      keyFears: 'Hidden fees, wasting time, missing opportunities for growth',
      typicalLanguage: 'get paid early, track subscriptions, instant transfers, slick UX',
      processingQuote: 'I need tools that work as well as my other apps - fast, transparent, and always available.',
      autoMatchCriteria: {
        organizationTypes: ['fintech', 'neobank', 'regional-bank'],
        targetAudiences: ['retail-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['mobile', 'fast', 'instant', 'digital', 'app', 'transparent', 'outcome-oriented'],
          negative: ['branch', 'traditional', 'corporate jargon', 'innovation claims']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 'c2-guided-opportunity-seeker',
      name: 'Guided Opportunity Seeker',
      age: '18-26',
      segment: 'Student or early-career with limited financial experience',
      coreMotivation: 'Learn and avoid financial mistakes while building credit',
      keyFears: 'Overdrafts, hidden fees, making wrong decisions, financial traps',
      typicalLanguage: 'how does this work, what could go wrong, plain language, visual explainers',
      processingQuote: 'I need to understand exactly how this works and what happens if I make a mistake.',
      autoMatchCriteria: {
        organizationTypes: ['credit-union', 'community-bank', 'fintech'],
        targetAudiences: ['retail-customers'],
        marketTypes: ['suburban', 'urban', 'mixed'],
        contentSignals: {
          positive: ['education', 'guidance', 'plain language', 'examples', 'coach', 'learn'],
          negative: ['complex', 'assumes knowledge', 'APR tables', 'jargon']
        },
        selectionWeight: 0.85
      }
    },
    {
      id: 'c3-busy-family-optimizer',
      name: 'Busy Family Optimizer',
      age: '35-48',
      segment: 'Dual-income household with children',
      coreMotivation: 'Automate financial management to save time and reduce stress',
      keyFears: 'Missed payments, account management complexity, data security breaches',
      typicalLanguage: 'automate bills, time-saving, family benefits, bundled value, cash-back',
      processingQuote: 'I need banking that saves me time and gives me predictable family benefits.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'community-bank', 'credit-union'],
        targetAudiences: ['retail-customers'],
        marketTypes: ['suburban', 'mixed'],
        contentSignals: {
          positive: ['automation', 'time-saving', 'family', 'bundled', 'predictable', 'rewards'],
          negative: ['disjointed', 'complex pricing', 'unclear data sharing']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 'c4-relationship-first-traditionalist',
      name: 'Relationship-First Traditionalist',
      age: '50-68',
      segment: 'Mid to late-career, values personal service',
      coreMotivation: 'Maintain trusted banking relationships with personal service',
      keyFears: 'Losing personal banker, forced into digital-only channels, service deterioration',
      typicalLanguage: 'my banker, branch experience, personal service, tried and trusted',
      processingQuote: 'I want to bank with people who know me and my business, not just a computer.',
      autoMatchCriteria: {
        organizationTypes: ['community-bank', 'credit-union'],
        targetAudiences: ['retail-customers'],
        marketTypes: ['rural', 'suburban'],
        contentSignals: {
          positive: ['personal', 'relationship', 'service', 'trusted', 'local', 'banker'],
          negative: ['digital-only', 'app-based', 'automation', 'AI']
        },
        selectionWeight: 0.95
      }
    },
    {
      id: 'c5-credit-stretched-rebuilder',
      name: 'Credit-Stretched Rebuilder',
      age: '28-45',
      segment: 'Recovering from financial setback, rebuilding credit',
      coreMotivation: 'Rebuild financial standing while avoiding further debt',
      keyFears: 'Unexpected fees, credit denial, falling behind on payments',
      typicalLanguage: 'second chance, no hidden fees, credit building, financial recovery',
      processingQuote: 'I need a bank that helps me rebuild, not one that profits from my mistakes.',
      autoMatchCriteria: {
        organizationTypes: ['credit-union', 'community-bank', 'fintech'],
        targetAudiences: ['retail-customers'],
        marketTypes: ['urban', 'suburban', 'rural'],
        contentSignals: {
          positive: ['second chance', 'credit building', 'transparent fees', 'financial recovery'],
          negative: ['premium', 'exclusive', 'high-income', 'investment']
        },
        selectionWeight: 0.8
      }
    },
    {
      id: 'c6-mass-affluent-planner',
      name: 'Mass Affluent Planner',
      age: '40-60',
      segment: 'High income, sophisticated financial needs',
      coreMotivation: 'Optimize wealth through integrated financial services',
      keyFears: 'Mediocre investment performance, poor financial advice, security breaches',
      typicalLanguage: 'wealth management, investment integration, private banking, portfolio optimization',
      processingQuote: 'I need sophisticated tools and advice that match my financial complexity.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'fintech'],
        targetAudiences: ['retail-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['wealth', 'investment', 'private banking', 'sophisticated', 'integration'],
          negative: ['basic', 'simple', 'one-size-fits-all']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 'c7-gig-economy-juggler',
      name: 'Gig Economy Juggler',
      age: '25-40',
      segment: 'Multiple income streams, freelance/contractor',
      coreMotivation: 'Manage irregular income across multiple platforms efficiently',
      keyFears: 'Cash flow gaps, complex tax reporting, platform payment delays',
      typicalLanguage: 'multiple income streams, gig payments, cash flow, instant access',
      processingQuote: 'I need banking that works with my unpredictable income from multiple sources.',
      autoMatchCriteria: {
        organizationTypes: ['fintech', 'neobank'],
        targetAudiences: ['retail-customers', 'business-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['gig economy', 'multiple income', 'instant access', 'freelance', 'cash flow'],
          negative: ['traditional employment', 'stable salary', 'long-term planning']
        },
        selectionWeight: 0.85
      }
    },
    {
      id: 'c8-retired-security-seeker',
      name: 'Retired Security Seeker',
      age: '62+',
      segment: 'Retired, focused on security and preservation',
      coreMotivation: 'Preserve wealth with maximum security and minimal risk',
      keyFears: 'Fraud, investment losses, complex digital systems, outliving savings',
      typicalLanguage: 'safe and secure, FDIC insured, established bank, fraud protection',
      processingQuote: 'I want banking with people I can trust and security I can understand.',
      autoMatchCriteria: {
        organizationTypes: ['community-bank', 'credit-union', 'regional-bank'],
        targetAudiences: ['retail-customers'],
        marketTypes: ['suburban', 'rural'],
        contentSignals: {
          positive: ['security', 'FDIC', 'established', 'trusted', 'safe', 'protection'],
          negative: ['digital-first', 'innovation', 'disruption', 'new technology']
        },
        selectionWeight: 0.95
      }
    }
  ],

  business: [
    {
      id: 's1-time-starved-solo-owner',
      name: 'Time-Starved Solo Owner',
      age: '35-50',
      business: 'Solo practice (law, accounting, consulting)',
      coreMotivation: 'Minimize time spent on banking and administrative tasks',
      keyFears: 'Wasted time on banking admin, missing client opportunities, cash flow gaps',
      typicalLanguage: 'streamlined, automated, time-saving, simple setup, no hassle',
      processingQuote: 'I need banking that takes five minutes to set up and runs itself.',
      autoMatchCriteria: {
        organizationTypes: ['fintech', 'regional-bank'],
        targetAudiences: ['business-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['automated', 'streamlined', 'time-saving', 'simple', 'efficient'],
          negative: ['complex setup', 'relationship manager', 'meetings', 'paperwork']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 's2-growth-oriented-founder',
      name: 'Growth-Oriented Founder',
      age: '28-45',
      business: 'Scaling startup or growth company',
      coreMotivation: 'Access capital and financial tools that scale with growth',
      keyFears: 'Outgrowing banking capabilities, limiting growth due to financial constraints',
      typicalLanguage: 'scalable, growth capital, lending, credit lines, cash management',
      processingQuote: 'I need banking that grows with me and never becomes the bottleneck.',
      autoMatchCriteria: {
        organizationTypes: ['fintech', 'regional-bank'],
        targetAudiences: ['business-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['growth', 'scalable', 'capital', 'lending', 'expansion', 'credit lines'],
          negative: ['traditional', 'conservative', 'small business only']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 's3-family-main-street-operator',
      name: 'Family Main Street Operator',
      age: '45-65',
      business: 'Family-owned local business (retail, restaurant, services)',
      coreMotivation: 'Maintain business stability and community relationships',
      keyFears: 'Losing local business advantages, being treated like a number',
      typicalLanguage: 'local business, community bank, personal service, main street',
      processingQuote: 'I want a bank that understands local business and supports our community.',
      autoMatchCriteria: {
        organizationTypes: ['community-bank', 'credit-union'],
        targetAudiences: ['business-customers'],
        marketTypes: ['rural', 'suburban'],
        contentSignals: {
          positive: ['local', 'community', 'main street', 'family business', 'personal service'],
          negative: ['digital-only', 'national', 'automated', 'impersonal']
        },
        selectionWeight: 0.95
      }
    },
    {
      id: 's4-professional-services-principal',
      name: 'Professional Services Principal',
      age: '40-60',
      business: 'Professional services firm (law, accounting, consulting)',
      coreMotivation: 'Sophisticated financial management and client trust accounts',
      keyFears: 'Regulatory compliance issues, commingled funds, professional liability',
      typicalLanguage: 'trust accounts, compliance, professional liability, sophisticated banking',
      processingQuote: 'I need banking that handles professional requirements and regulatory compliance.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'community-bank'],
        targetAudiences: ['business-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['professional', 'trust accounts', 'compliance', 'sophisticated', 'regulatory'],
          negative: ['simple', 'basic', 'startup-focused', 'consumer-grade']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 's5-nonprofit-steward',
      name: 'Nonprofit Steward',
      age: '35-55',
      business: 'Nonprofit organization management',
      coreMotivation: 'Maximize mission impact while ensuring financial stewardship',
      keyFears: 'Fund mismanagement, high fees reducing mission funding, compliance issues',
      typicalLanguage: 'mission-focused, stewardship, transparent fees, nonprofit banking',
      processingQuote: 'We need banking that supports our mission and treats donor funds with respect.',
      autoMatchCriteria: {
        organizationTypes: ['credit-union', 'community-bank'],
        targetAudiences: ['business-customers'],
        marketTypes: ['urban', 'suburban', 'rural'],
        contentSignals: {
          positive: ['nonprofit', 'mission', 'stewardship', 'community', 'transparent'],
          negative: ['profit-maximizing', 'commercial focus', 'high fees']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 's6-operational-cfo',
      name: 'Operational CFO',
      age: '40-60',
      business: 'Mid-market company financial management',
      coreMotivation: 'Optimize cash management and operational efficiency',
      keyFears: 'Operational inefficiencies, poor cash flow management, system integration issues',
      typicalLanguage: 'cash management, operational efficiency, system integration, Treasury services',
      processingQuote: 'I need banking that integrates seamlessly with our operational and financial systems.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'fintech'],
        targetAudiences: ['business-customers', 'bank-executives'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['cash management', 'operational', 'integration', 'treasury', 'efficiency'],
          negative: ['simple', 'basic', 'small business', 'consumer-focused']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 's7-tech-forward-digital-seller',
      name: 'Tech-Forward Digital Seller',
      age: '25-40',
      business: 'E-commerce or digital services company',
      coreMotivation: 'Integrate banking with digital sales and payment platforms',
      keyFears: 'Payment processing delays, platform disconnects, API limitations',
      typicalLanguage: 'API integration, payment processing, e-commerce, platform connectivity',
      processingQuote: 'I need banking APIs that integrate perfectly with my sales and payment platforms.',
      autoMatchCriteria: {
        organizationTypes: ['fintech', 'neobank'],
        targetAudiences: ['business-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['API', 'integration', 'e-commerce', 'digital', 'platform', 'payment processing'],
          negative: ['traditional', 'branch-based', 'manual processes', 'legacy systems']
        },
        selectionWeight: 0.95
      }
    }
  ],

  fintech: [
    {
      id: 'b1-bank-head-digital-transformation',
      name: 'Bank Head of Digital Transformation',
      age: '35-50',
      title: 'VP Digital Banking & Innovation',
      institution: 'Regional bank or large credit union',
      coreMotivation: 'Drive competitive digital capabilities while managing implementation risk',
      keyFears: 'Failed digital initiatives, falling behind competition, integration disasters',
      typicalLanguage: 'digital transformation, customer experience, integration timeline, competitive positioning',
      processingQuote: 'We need solutions that transform our capabilities without disrupting operations.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'community-bank', 'credit-union'],
        targetAudiences: ['bank-executives', 'fintech-buyers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['digital transformation', 'integration', 'competitive', 'customer experience'],
          negative: ['risky', 'unproven', 'complex implementation']
        },
        selectionWeight: 0.95
      }
    },
    {
      id: 'b2-enterprise-cio-cto',
      name: 'Enterprise CIO/CTO',
      age: '45-60',
      title: 'Chief Information/Technology Officer',
      institution: 'Large bank or enterprise',
      coreMotivation: 'Modernize technology infrastructure while maintaining security and compliance',
      keyFears: 'Security breaches, system downtime, regulatory violations, integration failures',
      typicalLanguage: 'architecture, security, scalability, compliance, infrastructure modernization',
      processingQuote: 'Any technology must meet our security and architectural standards before consideration.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'fintech'],
        targetAudiences: ['bank-executives', 'fintech-buyers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['security', 'architecture', 'scalability', 'compliance', 'infrastructure'],
          negative: ['quick implementation', 'minimal security', 'workarounds']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 'b3-chief-risk-compliance',
      name: 'Chief Risk & Compliance Officer',
      age: '45-65',
      title: 'Chief Risk Officer',
      institution: 'Financial institution',
      coreMotivation: 'Protect institution from regulatory fines and operational risks',
      keyFears: 'Regulatory violations, data breaches, operational failures, audit findings',
      typicalLanguage: 'regulatory compliance, risk management, audit trail, governance framework',
      processingQuote: 'Show me comprehensive risk controls and regulatory compliance documentation.',
      autoMatchCriteria: {
        organizationTypes: ['community-bank', 'credit-union', 'regional-bank'],
        targetAudiences: ['bank-executives', 'fintech-buyers'],
        marketTypes: ['suburban', 'rural', 'urban'],
        contentSignals: {
          positive: ['compliance', 'risk management', 'regulatory', 'audit', 'governance'],
          negative: ['fast implementation', 'minimal oversight', 'move quickly']
        },
        selectionWeight: 0.95
      }
    },
    {
      id: 'b4-payments-treasury-lead',
      name: 'Payments/Treasury Product Lead',
      age: '35-50',
      title: 'VP Payments & Treasury Services',
      institution: 'Bank product management',
      coreMotivation: 'Launch innovative payment products that drive revenue growth',
      keyFears: 'Product launch failures, poor customer adoption, competitive displacement',
      typicalLanguage: 'payment innovation, product roadmap, customer adoption, revenue growth',
      processingQuote: 'We need payment solutions that differentiate our product offering and drive adoption.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'fintech'],
        targetAudiences: ['bank-executives', 'fintech-buyers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['payment', 'innovation', 'product', 'customer adoption', 'revenue'],
          negative: ['traditional', 'conservative', 'slow to market']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 'b5-corporate-cfo-mid-market',
      name: 'Corporate CFO (Mid-Market)',
      age: '40-60',
      title: 'Chief Financial Officer',
      institution: 'Mid-market corporation',
      coreMotivation: 'Optimize financial operations and cash management efficiency',
      keyFears: 'Cash flow disruptions, operational inefficiencies, poor financial controls',
      typicalLanguage: 'cash management, operational efficiency, financial controls, treasury optimization',
      processingQuote: 'I need financial solutions that optimize our cash flow and operational efficiency.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'fintech'],
        targetAudiences: ['bank-executives', 'business-customers'],
        marketTypes: ['urban', 'suburban'],
        contentSignals: {
          positive: ['cash management', 'efficiency', 'treasury', 'optimization', 'financial controls'],
          negative: ['simple', 'basic', 'small business focused']
        },
        selectionWeight: 0.9
      }
    },
    {
      id: 'b6-operations-shared-services',
      name: 'Operations/Shared Services Leader',
      age: '40-55',
      title: 'VP Operations',
      institution: 'Financial services operations',
      coreMotivation: 'Streamline operations and reduce processing costs',
      keyFears: 'Operational disruptions, increased processing costs, workflow inefficiencies',
      typicalLanguage: 'operational efficiency, process automation, cost reduction, workflow optimization',
      processingQuote: 'We need solutions that streamline operations and reduce our processing overhead.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'community-bank', 'fintech'],
        targetAudiences: ['bank-executives', 'fintech-buyers'],
        marketTypes: ['urban', 'suburban', 'rural'],
        contentSignals: {
          positive: ['operational', 'automation', 'efficiency', 'cost reduction', 'streamline'],
          negative: ['manual', 'complex', 'labor intensive']
        },
        selectionWeight: 0.85
      }
    },
    {
      id: 'b7-procurement-vendor-management',
      name: 'Procurement & Vendor Management',
      age: '35-55',
      title: 'VP Vendor Management',
      institution: 'Financial institution procurement',
      coreMotivation: 'Select vendors that provide value while managing institutional risk',
      keyFears: 'Vendor failures, contract disputes, poor due diligence, budget overruns',
      typicalLanguage: 'vendor due diligence, contract terms, risk assessment, value optimization',
      processingQuote: 'Show me comprehensive vendor credentials and clear contract terms with measurable value.',
      autoMatchCriteria: {
        organizationTypes: ['regional-bank', 'community-bank', 'credit-union'],
        targetAudiences: ['bank-executives', 'fintech-buyers'],
        marketTypes: ['urban', 'suburban', 'rural'],
        contentSignals: {
          positive: ['vendor', 'credentials', 'due diligence', 'contract', 'value', 'risk assessment'],
          negative: ['untested', 'startup risk', 'unclear terms']
        },
        selectionWeight: 0.8
      }
    }
  ]
};

// Export for integration into main system
if (typeof module !== 'undefined') module.exports = COMPLETE_PERSONA_LIBRARY;
if (typeof window !== 'undefined') window.COMPLETE_PERSONA_LIBRARY = COMPLETE_PERSONA_LIBRARY;