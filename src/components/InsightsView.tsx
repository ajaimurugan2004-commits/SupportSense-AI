import React from 'react';
import { FeedbackItem, RoadmapInitiative } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Flame, 
  Users, 
  Sparkles, 
  Layers,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

interface InsightsViewProps {
  feedbacks: FeedbackItem[];
  roadmap: RoadmapInitiative[];
  onSelectFeedbackCategory: (category: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  feedbacks,
  roadmap,
  onSelectFeedbackCategory,
}) => {
  const total = feedbacks.length;

  // Sentiment counts
  const positiveCount = feedbacks.filter((f) => f.sentiment === 'Positive').length;
  const neutralCount = feedbacks.filter((f) => f.sentiment === 'Neutral').length;
  const negativeCount = feedbacks.filter((f) => f.sentiment === 'Negative').length;
  const urgentCount = feedbacks.filter((f) => f.sentiment === 'Urgent').length;

  // Average emotions
  const avgFrustration = Math.round(feedbacks.reduce((a, b) => a + b.emotions.frustration, 0) / Math.max(1, total));
  const avgDelight = Math.round(feedbacks.reduce((a, b) => a + b.emotions.delight, 0) / Math.max(1, total));
  const avgConfusion = Math.round(feedbacks.reduce((a, b) => a + b.emotions.confusion, 0) / Math.max(1, total));

  // Category counts and avg score
  const categories = ['Performance', 'Billing', 'Integrations', 'Reliability', 'UI/UX', 'Feature Request'];
  const categoryStats = categories.map((cat) => {
    const items = feedbacks.filter((f) => f.category === cat);
    const count = items.length;
    const avgScore = count > 0 ? Math.round(items.reduce((a, b) => a + b.score, 0) / count) : 0;
    return { name: cat, count, avgScore };
  });

  // Source breakdown
  const sources = ['Zendesk', 'Intercom', 'In-App Widget', 'Slack Community', 'G2 Crowd', 'Discord'];
  const sourceStats = sources.map((src) => {
    const items = feedbacks.filter((f) => f.source === src);
    return { name: src, count: items.length };
  });

  // Customer Tier breakdown
  const tiers = ['Enterprise', 'Scale', 'Pro', 'Free'];
  const tierStats = tiers.map((tier) => {
    const items = feedbacks.filter((f) => f.customerTier === tier);
    const count = items.length;
    const avgScore = count > 0 ? Math.round(items.reduce((a, b) => a + b.score, 0) / count) : 0;
    const churnRisks = items.filter((f) => f.potentialChurnRisk).length;
    return { tier, count, avgScore, churnRisks };
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Sentiment Synthesis Engine</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Executive Customer Insights</h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time sentiment trajectory aggregated across {total} ingested customer tickets and linked to {roadmap.length} active roadmap initiatives.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs text-slate-300">
          <div className="text-right">
            <div className="text-slate-400 text-[11px]">Advocate vs Detractor Ratio</div>
            <div className="text-lg font-bold text-white tabular-data font-mono">
              {(positiveCount / Math.max(1, negativeCount + urgentCount)).toFixed(2)}x
            </div>
          </div>
          <div className="text-right border-l border-slate-800 pl-6">
            <div className="text-slate-400 text-[11px]">Unaddressed Churn Alerts</div>
            <div className="text-lg font-bold text-rose-400 tabular-data font-mono">
              {feedbacks.filter((f) => f.potentialChurnRisk && f.status !== 'Resolved').length}
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Sentiment breakdown & Emotion radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sentiment Volume Breakdown (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sentiment Velocity Distribution</h3>
            <span className="text-xs text-slate-400 font-mono">{total} total items</span>
          </div>

          {/* Bar Segment */}
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex">
            <div style={{ width: `${(positiveCount / total) * 100}%` }} className="bg-emerald-500 h-full" title={`Positive: ${positiveCount}`} />
            <div style={{ width: `${(neutralCount / total) * 100}%` }} className="bg-slate-500 h-full" title={`Neutral: ${neutralCount}`} />
            <div style={{ width: `${(negativeCount / total) * 100}%` }} className="bg-amber-500 h-full" title={`Negative: ${negativeCount}`} />
            <div style={{ width: `${(urgentCount / total) * 100}%` }} className="bg-rose-500 h-full" title={`Urgent: ${urgentCount}`} />
          </div>

          {/* Legend Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-emerald-400 mb-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Positive</span>
              </div>
              <div className="text-lg font-bold text-white tabular-data font-mono">{positiveCount}</div>
              <div className="text-[10px] text-slate-500">{Math.round((positiveCount / total) * 100)}% volume</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-slate-300 mb-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Neutral</span>
              </div>
              <div className="text-lg font-bold text-white tabular-data font-mono">{neutralCount}</div>
              <div className="text-[10px] text-slate-500">{Math.round((neutralCount / total) * 100)}% volume</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-amber-400 mb-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Negative</span>
              </div>
              <div className="text-lg font-bold text-white tabular-data font-mono">{negativeCount}</div>
              <div className="text-[10px] text-slate-500">{Math.round((negativeCount / total) * 100)}% volume</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="flex items-center gap-1.5 text-rose-400 mb-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Urgent</span>
              </div>
              <div className="text-lg font-bold text-white tabular-data font-mono">{urgentCount}</div>
              <div className="text-[10px] text-slate-500">{Math.round((urgentCount / total) * 100)}% volume</div>
            </div>
          </div>
        </div>

        {/* Emotion Spectrum Averages (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Aggregated Emotion Spectrum</h3>
            <span className="text-xs text-slate-400">Gemini LLM calibrated</span>
          </div>

          <div className="space-y-4 pt-1 text-xs">
            {/* Frustration */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <Flame className="w-3.5 h-3.5" /> Frustration & Friction Index
                </span>
                <span className="font-mono tabular-data font-bold text-rose-400">{avgFrustration}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-500 h-full transition-all duration-500" style={{ width: `${avgFrustration}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Main driver: Data export latency and manual seat deactivation friction.</p>
            </div>

            {/* Delight */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" /> Customer Delight & Advocacy
                </span>
                <span className="font-mono tabular-data font-bold text-emerald-400">{avgDelight}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${avgDelight}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Main driver: Semantic natural language queries and keyboard shortcuts.</p>
            </div>

            {/* Confusion */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <ShieldAlert className="w-3.5 h-3.5" /> UI Confusion & Navigation Obstacles
                </span>
                <span className="font-mono tabular-data font-bold text-amber-400">{avgConfusion}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full transition-all duration-500" style={{ width: `${avgConfusion}%` }} />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Main driver: Hidden webhook signing settings and SAML session expiry.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Category Health & Tier Satisfaction */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Health (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Product Category Sentiment Health</h3>
            <span className="text-xs text-slate-400">Click category to filter inbox</span>
          </div>

          <div className="space-y-3">
            {categoryStats.map((cat) => (
              <div
                key={cat.name}
                onClick={() => onSelectFeedbackCategory(cat.name)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/50 cursor-pointer transition-all flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {cat.count} ticket{cat.count !== 1 ? 's' : ''} logged
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`font-mono tabular-data font-bold ${cat.avgScore >= 20 ? 'text-emerald-400' : cat.avgScore <= -20 ? 'text-rose-400' : 'text-amber-400'}`}>
                      {cat.avgScore > 0 ? `+${cat.avgScore}` : cat.avgScore}
                    </span>
                    <div className="text-[10px] text-slate-500">Net score</div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Tier Breakdown (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sentiment by Customer Tier</h3>
            <span className="text-xs text-slate-400">Churn exposure</span>
          </div>

          <div className="space-y-3">
            {tierStats.map((tier) => (
              <div key={tier.tier} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">{tier.tier} Accounts</span>
                  <span className={`font-mono tabular-data font-semibold ${tier.avgScore >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tier.avgScore > 0 ? `+${tier.avgScore}` : tier.avgScore} NPS Proxy
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                  <span>{tier.count} feedback tickets</span>
                  {tier.churnRisks > 0 ? (
                    <span className="text-rose-400 font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3" /> {tier.churnRisks} Churn Alert
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-medium">Stable</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
