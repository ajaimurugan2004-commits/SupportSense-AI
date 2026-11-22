import React, { useState } from 'react';
import { motion } from 'motion/react';
import { RoadmapInitiative, RoadmapStatus } from '../types';
import { 
  X, 
  Layers, 
  Sliders, 
  FileText, 
  Quote, 
  Copy, 
  Check, 
  ThumbsUp, 
  Target,
  Sparkles,
  Flame
} from 'lucide-react';

interface RoadmapDetailModalProps {
  initiative: RoadmapInitiative | null;
  onClose: () => void;
  onUpdateInitiative: (updated: RoadmapInitiative) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const RoadmapDetailModal: React.FC<RoadmapDetailModalProps> = ({
  initiative,
  onClose,
  onUpdateInitiative,
  onShowToast,
}) => {
  if (!initiative) return null;

  const [reach, setReach] = useState(initiative.reach);
  const [impact, setImpact] = useState(initiative.impact);
  const [confidence, setConfidence] = useState(initiative.confidence);
  const [effort, setEffort] = useState(initiative.effort);
  const [status, setStatus] = useState<RoadmapStatus>(initiative.status);
  const [copied, setCopied] = useState(false);

  // Recalculate RICE dynamically
  const calculatedRice = Math.round((reach * impact * (confidence / 100)) / Math.max(1, effort));

  const handleApplyChanges = () => {
    const updated: RoadmapInitiative = {
      ...initiative,
      reach,
      impact,
      confidence,
      effort,
      status,
      riceScore: calculatedRice,
    };
    onUpdateInitiative(updated);
    onShowToast('Roadmap Parameters Saved', `Updated RICE Score: ${calculatedRice.toLocaleString()}`, 'success');
  };

  const handleCopyMarkdown = () => {
    const md = `# PRD: ${initiative.title}
**Milestone:** ${initiative.prdSummary.targetMilestone || initiative.status}
**Category:** ${initiative.category}
**RICE Score:** ${calculatedRice} (Reach: ${reach}, Impact: ${impact}x, Confidence: ${confidence}%, Effort: ${effort} wks)

## Problem Statement
${initiative.prdSummary.problemStatement}

## Customer Quotes & Voice
${(initiative.userQuotes || []).map((q) => `- ${q}`).join('\n')}

## User Stories
${(initiative.prdSummary.userStories || []).map((s) => `- ${s}`).join('\n')}

## Acceptance Criteria
${(initiative.prdSummary.acceptanceCriteria || []).map((c) => `- [ ] ${c}`).join('\n')}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    onShowToast('PRD Exported', 'Copied Markdown PRD specification to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Product Roadmap Specification</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-indigo-400">{initiative.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{initiative.prdSummary.targetMilestone}</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{initiative.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors btn-tactile"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Export PRD (MD)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors btn-tactile"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: PRD Specification Content (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Overview / Description */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Initiative Overview
              </label>
              <p className="text-sm text-slate-200 leading-relaxed font-sans">
                {initiative.description}
              </p>
            </div>

            {/* Problem Statement */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span>Problem Statement</span>
              </label>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {initiative.prdSummary.problemStatement}
              </div>
            </div>

            {/* Customer Voice & Verbatim Quotes */}
            {initiative.userQuotes && initiative.userQuotes.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <Quote className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Customer Voice & Verbatim Quotes</span>
                </label>
                <div className="space-y-2">
                  {initiative.userQuotes.map((quote, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-indigo-950/20 border border-indigo-900/40 text-xs text-indigo-200 italic"
                    >
                      {quote}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Stories */}
            {initiative.prdSummary.userStories && initiative.prdSummary.userStories.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  User Stories
                </label>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                  {initiative.prdSummary.userStories.map((story, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 font-bold shrink-0">›</span>
                      <span>{story}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acceptance Criteria */}
            {initiative.prdSummary.acceptanceCriteria && initiative.prdSummary.acceptanceCriteria.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                  Acceptance Criteria
                </label>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                  {initiative.prdSummary.acceptanceCriteria.map((crit, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold shrink-0">✓</span>
                      <span>{crit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right: Interactive RICE Calibrator & Priority Formula (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive RICE Score Box */}
            <div className="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>RICE Calibrator</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">Live Recalculation</span>
              </div>

              {/* Dynamic Big Score */}
              <div className="flex items-baseline justify-between p-4 bg-slate-950/80 rounded-xl border border-indigo-900/50">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Calculated Score</div>
                  <div className="text-3xl font-extrabold text-white tabular-data tracking-tight font-mono">
                    {calculatedRice.toLocaleString()}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400">
                  <div>Urgency Weight: <span className="text-rose-400 font-semibold font-mono">{initiative.sentimentUrgency}/100</span></div>
                  <div>Rank: <span className="text-indigo-300 font-semibold">Tier 1 Target</span></div>
                </div>
              </div>

              {/* Formula note */}
              <div className="text-[11px] text-slate-400 text-center font-mono bg-slate-900/50 py-1.5 rounded-lg border border-slate-800">
                ({reach} × {impact} × {confidence}%) ÷ {effort} = {calculatedRice}
              </div>

              {/* Slider 1: Reach */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Reach (Users/Month affected):</span>
                  <span className="font-mono text-white font-bold">{reach.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="12000"
                  step="100"
                  value={reach}
                  onChange={(e) => setReach(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Slider 2: Impact */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Impact Multiplier:</span>
                  <span className="font-mono text-white font-bold">{impact}x</span>
                </div>
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {[0.5, 1.0, 2.0, 3.0].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setImpact(val)}
                      className={`py-1 text-xs rounded font-medium transition-colors ${
                        impact === val
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {val}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 3: Confidence */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Confidence (% based on data):</span>
                  <span className="font-mono text-white font-bold">{confidence}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Slider 4: Effort */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Engineering Effort (Person-Weeks):</span>
                  <span className="font-mono text-white font-bold">{effort} wks</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="1"
                  value={effort}
                  onChange={(e) => setEffort(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              {/* Milestone Status Selector */}
              <div className="pt-2 border-t border-indigo-900/40 text-xs">
                <label className="block text-slate-300 mb-1 font-semibold">Milestone Pipeline</label>
                <div className="grid grid-cols-4 gap-1">
                  {(['Now', 'Next', 'Later', 'Shipped'] as RoadmapStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatus(st)}
                      className={`py-1.5 text-xs rounded-lg font-medium transition-colors ${
                        status === st
                          ? 'bg-indigo-600 text-white shadow'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleApplyChanges}
                className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all btn-tactile shadow-md shadow-indigo-600/30"
              >
                Apply Updated Scoring
              </button>

            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-mono">
            {initiative.linkedFeedbackIds.length} Linked Customer Quotes
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors btn-tactile"
          >
            Close PRD
          </button>
        </div>

      </motion.div>
    </div>
  );
};
