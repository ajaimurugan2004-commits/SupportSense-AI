export type SentimentType = 'Positive' | 'Neutral' | 'Negative' | 'Urgent';
export type UrgencyType = 'Low' | 'Medium' | 'High' | 'Critical';
export type CustomerTier = 'Enterprise' | 'Scale' | 'Pro' | 'Free';
export type FeedbackSource = 'Zendesk' | 'Intercom' | 'In-App Widget' | 'Slack Community' | 'G2 Crowd' | 'Discord';
export type FeedbackCategory = 'UI/UX' | 'Performance' | 'Integrations' | 'Billing' | 'Feature Request' | 'Reliability';
export type FeedbackStatus = 'Unreviewed' | 'Under Investigation' | 'Roadmapped' | 'Resolved';

export interface EmotionSpectrum {
  frustration: number; // 0 - 100
  delight: number;     // 0 - 100
  confusion: number;   // 0 - 100
}

export interface FeedbackItem {
  id: string;
  customerName: string;
  customerEmail: string;
  customerTier: CustomerTier;
  company: string;
  source: FeedbackSource;
  createdAt: string;
  title: string;
  content: string;
  sentiment: SentimentType;
  score: number; // -100 to 100
  urgency: UrgencyType;
  emotions: EmotionSpectrum;
  category: FeedbackCategory;
  summary: string;
  keyPainPoints: string[];
  suggestedAction: string;
  potentialChurnRisk: boolean;
  relatedFeatureTag: string;
  status: FeedbackStatus;
  agentNotes?: string;
  draftReply?: string;
}

export type RoadmapStatus = 'Now' | 'Next' | 'Later' | 'Shipped';

export interface PRDSummary {
  problemStatement: string;
  userStories: string[];
  acceptanceCriteria: string[];
  targetMilestone: string;
}

export interface RoadmapInitiative {
  id: string;
  title: string;
  description: string;
  category: FeedbackCategory;
  status: RoadmapStatus;
  reach: number;          // monthly users affected
  impact: number;         // 0.5 (Minimal), 1.0 (Low), 2.0 (High), 3.0 (Massive)
  confidence: number;     // 50 - 100%
  effort: number;         // 1 - 10 person-weeks
  riceScore: number;      // (Reach * Impact * (Confidence / 100)) / Effort
  sentimentUrgency: number; // 0 - 100
  linkedFeedbackIds: string[];
  userQuotes: string[];
  prdSummary: PRDSummary;
  upvotes: number;
  hasUpvoted?: boolean;
}

export interface CopilotCitation {
  customer: string;
  quote: string;
  sentiment: string;
}

export interface CopilotResponse {
  answer: string;
  keyFindings: string[];
  citedFeedbacks: CopilotCitation[];
  recommendedAction: string;
}
