// C-Suite Fintech Buyer Personas - Replacement content
    },
    {
      id: 'cdo-digital-transformation',
      name: 'Digital Transformation CDO',
      age: '41',
      title: 'Chief Digital Officer',
      institution: '$8.5B Regional Bank',
      aumRange: '$5B-$30B (primary), $1B-$5B (secondary)',
      coreMotivation: 'Deliver digital experiences that match or exceed neobank standards',
      keyFears: 'Implementation failure, customer experience gaps, resource constraints, integration complexity',
      typicalLanguage: 'digital transformation, customer experience, competitive positioning, time to market',
      processingQuote: 'How quickly can we implement this to improve our customer experience and close the digital gap with our competitors?',
      autoMatchCriteria: {
        aumRanges: ['5b-15b', '15b-30b', '1b-5b'],
        primaryRole: ['5b-15b', '15b-30b'],
        secondaryRole: ['1b-5b'],
        buyingCommitteeRole: 'champion-influencer',
        decisionContexts: {
          strategic: 0.8,
          digital: 1.0,
          technical: 0.7,
          operations: 0.5,
          committee: 0.9
        },
        contentSignals: {
          positive: ['digital', 'customer experience', 'innovation', 'modern', 'competitive', 'transformation'],
          negative: ['legacy', 'traditional', 'manual processes', 'complex integration']
        },
        institutionTypes: ['regional-bank', 'progressive-community-bank', 'large-credit-union'],
        selectionWeight: 0.90
      }
    },
    {
      id: 'cio-technology-gatekeeper',
      name: 'Technology Gatekeeper CIO',
      age: '48',
      title: 'Chief Information Officer',
      institution: '$12B Regional Bank',
      aumRange: '$3B-$30B (all ranges)',
      coreMotivation: 'Ensure technology integrates securely and reliably with existing infrastructure',
      keyFears: 'System integration failures, security vulnerabilities, vendor dependency, performance degradation',
      typicalLanguage: 'security framework, compliance requirements, system integration, architecture, vendor stability',
      processingQuote: 'Any technology must meet our security and architectural standards before consideration. Show me your SOC 2 report and integration documentation.',
      autoMatchCriteria: {
        aumRanges: ['3b-10b', '10b-30b', '1b-3b'],
        primaryRole: ['3b-10b', '10b-30b'],
        secondaryRole: ['1b-3b'],
        buyingCommitteeRole: 'technical-gatekeeper',
        decisionContexts: {
          strategic: 0.3,
          digital: 0.7,
          technical: 1.0,
          operations: 0.9,
          committee: 0.8
        },
        contentSignals: {
          positive: ['security', 'integration', 'API', 'architecture', 'compliance', 'SOC 2', 'enterprise'],
          negative: ['simple', 'plug-and-play', 'no technical expertise', 'cloud-only']
        },
        institutionTypes: ['regional-bank', 'community-bank', 'credit-union'],
        selectionWeight: 0.85
      }
    },
    {
      id: 'cto-technical-architect',
      name: 'Technical Architect CTO',
      age: '39',
      title: 'Chief Technology Officer',
      institution: '$18B Regional Bank',
      aumRange: '$10B-$30B (primary), $5B-$10B (secondary)',
      coreMotivation: 'Design modern, scalable technology architecture for future innovation',
      keyFears: 'Technical debt, vendor lock-in, talent retention issues, scaling limitations',
      typicalLanguage: 'technology roadmap, developer experience, platform architecture, API strategy, scalability',
      processingQuote: 'I need to understand how this fits our long-term technology roadmap and whether the platform architecture supports our innovation goals.',
      autoMatchCriteria: {
        aumRanges: ['10b-30b', '5b-10b'],
        primaryRole: ['10b-30b'],
        secondaryRole: ['5b-10b'],
        buyingCommitteeRole: 'technical-architect',
        decisionContexts: {
          strategic: 0.6,
          digital: 0.8,
          technical: 1.0,
          operations: 0.4,
          committee: 0.7
        },
        contentSignals: {
          positive: ['API', 'platform', 'architecture', 'scalable', 'developer', 'microservices', 'modern'],
          negative: ['proprietary', 'limited', 'custom integration', 'legacy', 'monolith']
        },
        institutionTypes: ['regional-bank', 'large-community-bank'],
        selectionWeight: 0.80
      }
    },
    {
      id: 'coo-operations-risk',
      name: 'Operations & Risk COO',
      age: '55',
      title: 'Chief Operating Officer',
      institution: '$6.8B Regional Bank',
      aumRange: '$3B-$30B (all ranges)',
      coreMotivation: 'Maintain operational excellence while enabling beneficial technology adoption',
      keyFears: 'Operational disruption, staff training burden, compliance gaps, customer experience degradation',
      typicalLanguage: 'operational efficiency, implementation risk, staff training, compliance, change management',
      processingQuote: 'How will this actually work with our current operations, and what support do you provide for training and change management?',
      autoMatchCriteria: {
        aumRanges: ['3b-10b', '10b-30b', '1b-3b'],
        primaryRole: ['3b-10b', '10b-30b'],
        secondaryRole: ['1b-3b'],
        buyingCommitteeRole: 'operations-risk-manager',
        decisionContexts: {
          strategic: 0.5,
          digital: 0.4,
          technical: 0.6,
          operations: 1.0,
          committee: 0.8
        },
        contentSignals: {
          positive: ['operations', 'efficiency', 'training', 'compliance', 'implementation', 'risk management'],
          negative: ['revolutionary', 'disruptive', 'complex implementation', 'significant change']
        },
        institutionTypes: ['regional-bank', 'community-bank', 'credit-union'],
        selectionWeight: 0.82
      }
    }
  ]
};