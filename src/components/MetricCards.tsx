import React from 'react';
import { FeedbackItem, RoadmapInitiative } from '../types';
import { TrendingUp, AlertTriangle, Layers, MessageSquare, ArrowUpRight } from 'lucide-react';

interface MetricCardsProps {
  feedbacks: FeedbackItem[];
  roadmap: RoadmapInitiative[];
  onFilterUrgent: () => void;
  onSelectRoadmapItem: (item: RoadmapInitiative) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  feedbacks,
  roadmap,
  onFilterUrgent,
  onSelectRoadmapItem,
}) => {
  // Compute analytics
  const total = feedbacks.length;
  const avgSentiment = total > 0 ? Math.round(feedbacks.reduce((acc, f) => acc + f.score, 0) / total) : 0;
  const avgFrustration = total > 0 ? Math.round(feedbacks.reduce((acc, f) => acc + f.emotions.frustration, 0) / total) : 0;
  const urgentCount = feedbacks.filter((f) => f.urgency === 'Critical' || f.sentiment === 'Urgent').length;
  const churnRiskCount = feedbacks.filter((f) => f.potentialChurnRisk).length;

  // Top RICE initiative
  const topRoadmap = [...roadmap].sort((a, b) => b.riceScore - a.riceScore)[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* 1. Net Sentiment Score */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Net Sentiment Score</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+8% WoW</span>
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-3xl font-bold tabular-data tracking-tight ${avgSentiment >= 20 ? 'text-emerald-400' : avgSentiment <= -20 ? 'text-rose-400' : 'text-amber-400'}`}>
            {avgSentiment > 0 ? `+${avgSentiment}` : avgSentiment}
          </span>
          <span className="text-xs text-slate-500">/ 100</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${avgSentiment >= 20 ? 'bg-emerald-500' : avgSentiment <= -20 ? 'bg-rose-500' : 'bg-amber-500'}`}
            style={{ width: `${Math.max(5, Math.min(100, (avgSentiment + 100) / 2))}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>-100 Critical</span>
          <span>+100 Delight</span>
        </div>
      </div>

      {/* 2. Customer Frustration Index */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-slate-700/80 transition-all">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Frustration Index</span>
          <span className="text-slate-400 text-[11px]">Emotion radar avg</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className={`text-3xl font-bold tabular-data tracking-tight ${avgFrustration > 60 ? 'text-rose-400' : avgFrustration > 35 ? 'text-amber-400' : 'text-slate-200'}`}>
            {avgFrustration}%
          </span>
          <span className="text-xs text-slate-500">friction rate</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-500"
            style={{ width: `${avgFrustration}%` }}
          />
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
          <span>Target threshold: &lt; 20%</span>
        </div>
      </div>

      {/* 3. Urgent Churn Escalations (Clickable!) */}
      <div 
        onClick={onFilterUrgent}
        className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-rose-500/40 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Urgent Escalations</span>
          </span>
          <span className="text-[11px] text-slate-500 group-hover:text-rose-300 transition-colors flex items-center">
            Filter <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold tabular-data text-white tracking-tight">
            {urgentCount}
          </span>
          <span className="text-xs text-slate-400">tickets needing action</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 mt-3 pt-2 border-t border-slate-800/60">
          <span className="text-rose-400 font-medium">{churnRiskCount} Enterprise at risk</span>
          <span aria-hidden="true">·</span>
          <span>SLA &lt; 2 hrs</span>
        </div>
      </div>

      {/* 4. Top RICE Roadmap Driver */}
      <div 
        onClick={() => topRoadmap && onSelectRoadmapItem(topRoadmap)}
        className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-sm relative overflow-hidden group hover:border-indigo-500/40 cursor-pointer transition-all"
      >
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-indigo-400">
            <Layers className="w-3.5 h-3.5" />
            <span>#1 Roadmap Priority</span>
          </span>
          <span className="text-[11px] text-indigo-400 tabular-data font-semibold">
            RICE {topRoadmap?.riceScore.toLocaleString() || 'N/A'}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
          {topRoadmap?.title || 'No initiatives defined'}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
          {topRoadmap?.description || 'Prioritized based on feedback weight'}
        </p>
        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
          <span>Sprint 28</span>
          <span aria-hidden="true">·</span>
          <span>{topRoadmap?.linkedFeedbackIds.length || 0} customer quotes</span>
        </div>
      </div>

    </div>
  );
};
