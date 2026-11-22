import React from 'react';
import { motion } from 'motion/react';
import { FeedbackItem } from '../types';
import { 
  Sparkles, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Send, 
  Layers,
  ChevronRight,
  Flame
} from 'lucide-react';

interface FeedbackCardProps {
  feedback: FeedbackItem;
  onOpenDetails: (feedback: FeedbackItem) => void;
  onQuickReply: (feedback: FeedbackItem) => void;
  onStatusChange: (id: string, status: FeedbackItem['status']) => void;
  onReanalyze: (feedback: FeedbackItem) => void;
  isAnalyzing?: boolean;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onOpenDetails,
  onQuickReply,
  onStatusChange,
  onReanalyze,
  isAnalyzing = false,
}) => {
  // Sentiment styling
  const sentimentColor =
    feedback.sentiment === 'Urgent'
      ? 'text-rose-400'
      : feedback.sentiment === 'Negative'
      ? 'text-amber-400'
      : feedback.sentiment === 'Positive'
      ? 'text-emerald-400'
      : 'text-slate-300';

  const sentimentDotColor =
    feedback.sentiment === 'Urgent'
      ? 'bg-rose-500'
      : feedback.sentiment === 'Negative'
      ? 'bg-amber-500'
      : feedback.sentiment === 'Positive'
      ? 'bg-emerald-500'
      : 'bg-slate-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.16 }}
      className={`rounded-2xl border p-5 bg-slate-900/40 hover:bg-slate-900/80 transition-all duration-200 group relative ${
        feedback.sentiment === 'Urgent' || feedback.potentialChurnRisk
          ? 'border-rose-900/40 hover:border-rose-600/50'
          : 'border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Top Header: Unboxed metadata with typographic separators */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-medium text-slate-200">{feedback.customerName}</span>
          <span aria-hidden="true">·</span>
          <span>{feedback.company}</span>
          <span aria-hidden="true">·</span>
          <span className={`${feedback.customerTier === 'Enterprise' ? 'text-indigo-400 font-medium' : 'text-slate-400'}`}>
            {feedback.customerTier}
          </span>
          <span aria-hidden="true">·</span>
          <span>{feedback.source}</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-500">{feedback.createdAt}</span>
        </div>

        {/* Sentiment Score & Churn Flag */}
        <div className="flex items-center gap-3">
          {feedback.potentialChurnRisk && (
            <span className="flex items-center gap-1 text-rose-400 text-[11px] font-medium">
              <Flame className="w-3.5 h-3.5" />
              <span>Churn Risk</span>
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${sentimentDotColor}`} />
            <span className={`font-semibold tabular-data ${sentimentColor}`}>
              {feedback.sentiment} ({feedback.score > 0 ? `+${feedback.score}` : feedback.score})
            </span>
          </div>
        </div>
      </div>

      {/* Primary Feedback Title */}
      <h3 
        onClick={() => onOpenDetails(feedback)}
        className="text-base font-semibold text-white tracking-tight hover:text-indigo-300 cursor-pointer transition-colors leading-snug mb-2"
      >
        {feedback.title}
      </h3>

      {/* Content quote */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
        "{feedback.content}"
      </p>

      {/* AI Key Pain Points or Highlights */}
      {feedback.keyPainPoints && feedback.keyPainPoints.length > 0 && (
        <div className="mb-4 pl-3 border-l-2 border-indigo-500/30 text-xs text-slate-400 space-y-1">
          {feedback.keyPainPoints.slice(0, 2).map((point, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span className="text-indigo-400 shrink-0">›</span>
              <span className="text-slate-300">{point}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Bar: Category, Emotion breakdown, Action Buttons */}
      <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Unboxed category and status indicator */}
        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-indigo-300 font-medium">{feedback.category}</span>
          <span aria-hidden="true">·</span>
          
          {/* Status selector */}
          <select
            value={feedback.status}
            onChange={(e) => onStatusChange(feedback.id, e.target.value as any)}
            className="bg-slate-950/80 text-slate-300 border border-slate-800 rounded-md px-2 py-1 text-xs focus:outline-none focus:border-indigo-500"
          >
            <option value="Unreviewed">Unreviewed</option>
            <option value="Under Investigation">Under Investigation</option>
            <option value="Roadmapped">Roadmapped</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        {/* Emotion Spectrum mini bars */}
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
          <span title="Frustration level">
            Frust: <span className="tabular-data text-rose-400 font-medium">{feedback.emotions.frustration}%</span>
          </span>
          <span title="Delight level">
            Delight: <span className="tabular-data text-emerald-400 font-medium">{feedback.emotions.delight}%</span>
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuickReply(feedback)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors btn-tactile"
          >
            <Send className="w-3 h-3 text-indigo-400" />
            <span>Draft Reply</span>
          </button>

          <button
            onClick={() => onReanalyze(feedback)}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/40 transition-colors btn-tactile disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>{isAnalyzing ? 'Analyzing...' : 'AI Dossier'}</span>
          </button>

          <button
            onClick={() => onOpenDetails(feedback)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="View Full Details"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </motion.div>
  );
};
