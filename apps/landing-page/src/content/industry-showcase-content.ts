export const industryShowcaseContent = {
  title: 'See AI Agents in Action',
  subtitle:
    'Discover how businesses like yours are already using AI to automate operations, reduce costs, and accelerate growth. These are real implementations delivering measurable results.',

  trustElements: [
    {
      title: 'Industry-specific training',
      description: 'AI agents trained for your specific industry requirements',
      icon: 'training' as const,
    },
    {
      title: 'Custom integration',
      description: 'Seamlessly integrate with your existing systems',
      icon: 'integration' as const,
    },
    {
      title: 'Proven methodologies',
      description: 'Battle-tested approaches that deliver results',
      icon: 'methodology' as const,
    },
  ],

  industries: [
    {
      id: 'construction',
      name: 'Construction Company',
      description: 'Real implementations delivering measurable results',
      automations: [
        {
          id: 'procurement',
          title: 'Procurement Optimization',
          metric: '25% cost reduction',
          description:
            'AI analyzes market prices, negotiates with suppliers, and optimizes material ordering',
          benefits: [
            'Automated supplier negotiations',
            'Real-time price monitoring',
            'Bulk order optimization',
          ],
          icon: 'procurement' as const,
        },
        {
          id: 'timeline',
          title: 'Project Timeline Management',
          metric: '40% faster delivery',
          description:
            'Predictive scheduling prevents delays and optimizes resource allocation',
          benefits: [
            'Weather impact prediction',
            'Resource conflict resolution',
            'Critical path optimization',
          ],
          icon: 'timeline' as const,
        },
        {
          id: 'quality',
          title: 'Quality Control Automation',
          metric: '60% fewer defects',
          description:
            'AI-powered inspections and compliance monitoring reduce errors',
          benefits: [
            'Automated safety inspections',
            'Code compliance checking',
            'Progress photo analysis',
          ],
          icon: 'quality' as const,
        },
        {
          id: 'workforce',
          title: 'Workforce Planning',
          metric: '30% efficiency gain',
          description:
            'Intelligent scheduling and skill matching for optimal team deployment',
          benefits: [
            'Skill-based assignments',
            'Overtime optimization',
            'Training need identification',
          ],
          icon: 'workforce' as const,
        },
        {
          id: 'analytics',
          title: 'Cost Analysis & Reporting',
          metric: 'Live ROI tracking',
          description:
            'Real-time project profitability tracking and predictive cost modeling',
          benefits: [
            'Profit margin monitoring',
            'Cost overrun prediction',
            'Client billing automation',
          ],
          icon: 'analytics' as const,
        },
        {
          id: 'communication',
          title: 'Client Communication',
          metric: '50% time savings',
          description:
            'Automated progress updates and intelligent client query handling',
          benefits: [
            'Progress report generation',
            'Client portal updates',
            'Issue escalation alerts',
          ],
          icon: 'communication' as const,
        },
      ],
    },
    {
      id: 'manufacturing',
      name: 'Manufacturing Business',
      description: 'Streamlined production with AI-driven optimization',
      automations: [
        {
          id: 'production',
          title: 'Production Planning',
          metric: '35% efficiency boost',
          description:
            'AI optimizes production schedules and resource allocation',
          benefits: [
            'Demand forecasting',
            'Resource optimization',
            'Bottleneck identification',
          ],
          icon: 'timeline' as const,
        },
        {
          id: 'quality-manufacturing',
          title: 'Quality Assurance',
          metric: '45% defect reduction',
          description:
            'Automated quality control with computer vision and sensors',
          benefits: [
            'Real-time defect detection',
            'Predictive maintenance',
            'Compliance monitoring',
          ],
          icon: 'quality' as const,
        },
        {
          id: 'supply-chain',
          title: 'Supply Chain Optimization',
          metric: '20% cost savings',
          description: 'End-to-end supply chain visibility and optimization',
          benefits: [
            'Inventory optimization',
            'Supplier risk assessment',
            'Logistics planning',
          ],
          icon: 'procurement' as const,
        },
        {
          id: 'maintenance',
          title: 'Predictive Maintenance',
          metric: '50% downtime reduction',
          description: 'AI predicts equipment failures before they happen',
          benefits: [
            'Equipment health monitoring',
            'Failure prediction',
            'Maintenance scheduling',
          ],
          icon: 'analytics' as const,
        },
        {
          id: 'workforce-manufacturing',
          title: 'Workforce Management',
          metric: '25% productivity increase',
          description:
            'Optimize staffing and skill allocation across production lines',
          benefits: [
            'Shift optimization',
            'Skill matching',
            'Performance tracking',
          ],
          icon: 'workforce' as const,
        },
        {
          id: 'reporting',
          title: 'Production Reporting',
          metric: 'Real-time insights',
          description: 'Automated reporting and performance analytics',
          benefits: ['KPI dashboards', 'Automated reports', 'Trend analysis'],
          icon: 'communication' as const,
        },
      ],
    },
    {
      id: 'logistics',
      name: 'Logistics & Transport',
      description: 'Optimized delivery and transportation management',
      automations: [
        {
          id: 'route-optimization',
          title: 'Route Optimization',
          metric: '30% fuel savings',
          description:
            'AI optimizes delivery routes for efficiency and cost reduction',
          benefits: [
            'Dynamic route planning',
            'Traffic optimization',
            'Fuel efficiency tracking',
          ],
          icon: 'timeline' as const,
        },
        {
          id: 'fleet-management',
          title: 'Fleet Management',
          metric: '40% maintenance savings',
          description:
            'Comprehensive fleet monitoring and predictive maintenance',
          benefits: [
            'Vehicle health monitoring',
            'Maintenance scheduling',
            'Driver performance tracking',
          ],
          icon: 'analytics' as const,
        },
        {
          id: 'warehouse',
          title: 'Warehouse Automation',
          metric: '50% processing speed',
          description: 'Automated sorting, picking, and inventory management',
          benefits: [
            'Automated picking systems',
            'Inventory optimization',
            'Order fulfillment',
          ],
          icon: 'procurement' as const,
        },
        {
          id: 'tracking',
          title: 'Shipment Tracking',
          metric: '99% delivery accuracy',
          description: 'Real-time shipment tracking and delivery optimization',
          benefits: [
            'Real-time GPS tracking',
            'Delivery notifications',
            'Exception handling',
          ],
          icon: 'communication' as const,
        },
        {
          id: 'demand-forecasting',
          title: 'Demand Forecasting',
          metric: '25% inventory reduction',
          description:
            'AI predicts demand patterns and optimizes inventory levels',
          benefits: [
            'Seasonal trend analysis',
            'Demand prediction',
            'Inventory optimization',
          ],
          icon: 'analytics' as const,
        },
        {
          id: 'customer-service',
          title: 'Customer Service',
          metric: '60% query resolution',
          description: 'Automated customer support and delivery updates',
          benefits: [
            'Automated notifications',
            'Query resolution',
            'Delivery updates',
          ],
          icon: 'communication' as const,
        },
      ],
    },
    {
      id: 'retail',
      name: 'Retail & E-commerce',
      description:
        'Enhanced customer experience with AI-driven personalization',
      automations: [
        {
          id: 'personalization',
          title: 'Product Recommendations',
          metric: '35% sales increase',
          description: 'AI-powered personalization and product recommendations',
          benefits: [
            'Personalized recommendations',
            'Customer behavior analysis',
            'Dynamic pricing',
          ],
          icon: 'analytics' as const,
        },
        {
          id: 'inventory-retail',
          title: 'Inventory Management',
          metric: '20% stock optimization',
          description: 'Automated inventory tracking and replenishment',
          benefits: [
            'Real-time stock tracking',
            'Automated reordering',
            'Demand forecasting',
          ],
          icon: 'procurement' as const,
        },
        {
          id: 'customer-support',
          title: 'Customer Support',
          metric: '70% automated resolution',
          description: 'AI chatbots and automated customer service',
          benefits: [
            '24/7 customer support',
            'Instant query resolution',
            'Escalation handling',
          ],
          icon: 'communication' as const,
        },
        {
          id: 'fraud-detection',
          title: 'Fraud Detection',
          metric: '95% fraud prevention',
          description: 'AI monitors transactions for suspicious activity',
          benefits: [
            'Real-time fraud detection',
            'Risk assessment',
            'Transaction monitoring',
          ],
          icon: 'quality' as const,
        },
        {
          id: 'marketing',
          title: 'Marketing Automation',
          metric: '45% engagement boost',
          description:
            'Automated marketing campaigns and customer segmentation',
          benefits: [
            'Customer segmentation',
            'Campaign optimization',
            'A/B testing',
          ],
          icon: 'communication' as const,
        },
        {
          id: 'analytics-retail',
          title: 'Sales Analytics',
          metric: 'Real-time insights',
          description: 'Comprehensive sales and performance analytics',
          benefits: [
            'Sales performance tracking',
            'Customer insights',
            'Trend analysis',
          ],
          icon: 'analytics' as const,
        },
      ],
    },
  ],

  ctaText: 'Get Free AI Analysis Now',
}
