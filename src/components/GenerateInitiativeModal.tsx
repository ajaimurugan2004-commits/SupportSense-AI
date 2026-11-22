import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FeedbackItem, RoadmapInitiative } from '../types';
import { X, Sparkles, Layers, Lightbulb, ArrowRight } from 'lucide-react';

interface GenerateInitiativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feedbacks: FeedbackItem[];
  onInitiativeGenerated: (initiative: RoadmapInitiative) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const GenerateInitiativeModal: React.FC<GenerateInitiativeModalProps> = ({
  isOpen,
  onClose,
  feedbacks,
  onInitiativeGenerated,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [focusTopic, setFocusTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const urgentFeedbacks = feedbacks.filter((f) => f.sentiment === 'Urgent' || f.sentiment === 'Negative');

  const presetTopics = [
    'Async Large Data Export Pipeline',
    'Self-Serve Team Seat Allocation',
    'Webhook Replay & Dead-Letter Alerts',
    'Keyboard-First Triage Ergonomics',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const res = await fetch('/api/generate-roadmap-initiative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedbacks: urgentFeedbacks.slice(0, 8),
          focusTopic: focusTopic.trim() || undefined,
        }),
      });

      const data = await res.json();

      const newInitiative: RoadmapInitiative = {
        id: `rd-${Date.now()}`,
        title: data.title || 'Enterprise Data & Workflow Optimization',
        description: data.description || 'Prioritized platform enhancement addressing customer bottlenecks.',
        category: data.category || 'Performance',
        status: data.status || 'Now',
        reach: data.reach || 4500,
        impact: data.impact || 2.0,
        confidence: data.confidence || 85,
        effort: data.effort || 3,
        riceScore: data.riceScore || Math.round((4500 * 2.0 * 0.85) / 3),
        sentimentUrgency: data.sentimentUrgency || 80,
        linkedFeedbackIds: urgentFeedbacks.slice(0, 3).map((f) => f.id),
        userQuotes: data.userQuotes || [
          '"Need a more reliable workflow for large data tables without timeouts."',
        ],
        prdSummary: data.prdSummary || {
          problemStatement: 'Customer feedback indicates bottleneck in current processing.',
          userStories: ['As a customer, I want resilient background task processing.'],
          acceptanceCriteria: ['Completion time under 5 seconds', 'Automatic error recovery'],
          targetMilestone: 'Sprint 29 · Core',
        },
        upvotes: 1,
        hasUpvoted: false,
      };

      onInitiativeGenerated(newInitiative);
      onShowToast('Roadmap Initiative Synthesized', `RICE Score: ${newInitiative.riceScore.toLocaleString()}`, 'success');
      onClose();
    } catch (err: any) {
      onShowToast('Generation failed', err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Roadmap Synthesizer</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cluster Feedback into Roadmap Initiative
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors btn-tactile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleGenerate} className="p-6 space-y-5">
          <p className="text-xs text-slate-300 leading-relaxed">
            SupportSense AI will analyze <span className="text-rose-400 font-semibold">{urgentFeedbacks.length} critical feedback items</span>, calculate reach and effort estimates, pull customer quotes, and generate a complete RICE-calibrated PRD initiative.
          </p>

          {/* Preset topics */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
              <span>Suggested Focus Topics:</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presetTopics.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setFocusTopic(topic)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all btn-tactile"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Specific Focus Area (Optional)
            </label>
            <input
              type="text"
              value={focusTopic}
              onChange={(e) => setFocusTopic(e.target.value)}
              placeholder="e.g. Asynchronous CSV exports or leave empty to auto-cluster"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300">Included Ingested Feedback Data:</div>
            <div>• {feedbacks.filter((f) => f.customerTier === 'Enterprise').length} Enterprise customer tickets</div>
            <div>• {feedbacks.filter((f) => f.potentialChurnRisk).length} Flagged churn escalation signals</div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors btn-tactile"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all btn-tactile disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing with Gemini 3.8...' : 'Synthesize PRD Initiative'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
