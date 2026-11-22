import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RoadmapInitiative, RoadmapStatus, FeedbackItem } from '../types';
import { 
  Layers, 
  Grid2X2, 
  Columns3, 
  ListOrdered, 
  Sparkles, 
  ThumbsUp, 
  ArrowUpRight, 
  ChevronRight,
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  SlidersHorizontal,
  FileCode
} from 'lucide-react';

interface RoadmapViewProps {
  roadmap: RoadmapInitiative[];
  feedbacks: FeedbackItem[];
  onOpenInitiativeModal: (initiative: RoadmapInitiative) => void;
  onOpenGenerateModal: () => void;
  onUpdateInitiative: (updated: RoadmapInitiative) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

type ViewMode = 'matrix' | 'kanban' | 'list';

export const RoadmapView: React.FC<RoadmapViewProps> = ({
  roadmap,
  feedbacks,
  onOpenInitiativeModal,
  onOpenGenerateModal,
  onUpdateInitiative,
  onShowToast,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedQuadrant, setSelectedQuadrant] = useState<string | null>(null);

  // Categories
  const categories = ['All', 'Performance', 'Billing', 'Integrations', 'Reliability', 'UI/UX', 'Feature Request'];

  const filteredRoadmap = roadmap.filter((item) => {
    if (categoryFilter !== 'All' && item.category !== categoryFilter) return false;
    return true;
  });

  // Upvote initiative
  const handleToggleUpvote = (item: RoadmapInitiative, e: React.MouseEvent) => {
    e.stopPropagation();
    const hasUpvoted = !item.hasUpvoted;
    const upvotes = hasUpvoted ? item.upvotes + 1 : item.upvotes - 1;
    onUpdateInitiative({ ...item, upvotes, hasUpvoted });
    onShowToast(hasUpvoted ? 'Upvoted Initiative' : 'Removed Upvote', item.title, 'info');
  };

  // Status change in kanban
  const handleStatusChange = (item: RoadmapInitiative, newStatus: RoadmapStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateInitiative({ ...item, status: newStatus });
    onShowToast('Roadmap Status Updated', `Moved to ${newStatus}`, 'success');
  };

  return (
    <div className="space-y-6">
      
      {/* Roadmap Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        
        {/* Left: View Mode Segmented Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all btn-tactile ${
              viewMode === 'matrix' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Grid2X2 className="w-3.5 h-3.5" />
            <span>Impact vs Effort Matrix</span>
          </button>

          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all btn-tactile ${
              viewMode === 'kanban' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>Milestone Kanban</span>
          </button>

          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all btn-tactile ${
              viewMode === 'list' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            <span>RICE Priority Ranking</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors btn-tactile ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Generate with AI button */}
        <button
          onClick={onOpenGenerateModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-all btn-tactile"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Prioritize Initiative</span>
        </button>

      </div>

      {/* VIEW 1: 2x2 PRIORITIZATION MATRIX */}
      {viewMode === 'matrix' && (
        <div className="space-y-4">
          
          {/* Matrix Description Header */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">2x2 Strategic Prioritization Matrix</span>
              <span aria-hidden="true">·</span>
              <span>Bubble size indicates Reach (monthly users)</span>
              <span aria-hidden="true">·</span>
              <span className="text-rose-400">Glow indicates Customer Urgency</span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Formula: (Reach × Impact × Confidence%) ÷ Effort
            </div>
          </div>

          {/* Visual Matrix Container */}
          <div className="relative rounded-2xl bg-slate-900/50 border border-slate-800 p-6 min-h-[520px] flex flex-col justify-between overflow-hidden">
            
            {/* Quadrant grid background overlays */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none">
              {/* Q1: Quick Wins (Top Left) */}
              <div className="border-r border-b border-slate-800/80 p-4 bg-emerald-950/5">
                <span className="text-xs font-bold text-emerald-400/80 tracking-wide uppercase">
                  Quick Wins (High Impact · Low Effort)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Highest ROI sprint targets</p>
              </div>

              {/* Q2: Strategic Big Bets (Top Right) */}
              <div className="border-b border-slate-800/80 p-4 bg-indigo-950/5">
                <span className="text-xs font-bold text-indigo-400/80 tracking-wide uppercase">
                  Major Projects (High Impact · High Effort)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Architectural & platform milestones</p>
              </div>

              {/* Q3: Fill-ins / Low-Hanging (Bottom Left) */}
              <div className="border-r border-slate-800/80 p-4 bg-slate-900/20">
                <span className="text-xs font-bold text-slate-400/80 tracking-wide uppercase">
                  Fill-ins (Low Impact · Low Effort)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Incremental polish & minor tweaks</p>
              </div>

              {/* Q4: Re-evaluate (Bottom Right) */}
              <div className="p-4 bg-rose-950/5">
                <span className="text-xs font-bold text-rose-400/70 tracking-wide uppercase">
                  Re-evaluate (Low Impact · High Effort)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Likely deprioritize or re-scope</p>
              </div>
            </div>

            {/* Axis Labels */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[11px] font-semibold text-slate-500 uppercase tracking-widest pointer-events-none">
              Impact (0.5 to 3.0) →
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-semibold text-slate-500 uppercase tracking-widest pointer-events-none">
              ← Effort (1 to 10 Weeks) →
            </div>

            {/* Interactive Scatter Plot Initiatives */}
            <div className="relative w-full h-[460px] z-10">
              {filteredRoadmap.map((item) => {
                // Map Effort (1 to 10) to X percentage (10% to 90%)
                const leftPercent = Math.max(12, Math.min(88, ((item.effort - 0.5) / 9.5) * 80 + 10));
                
                // Map Impact (0.5 to 3.0) to Y percentage (inverted: higher impact is higher up, 15% to 85%)
                const topPercent = Math.max(12, Math.min(85, 100 - (((item.impact - 0.4) / 2.7) * 75 + 15)));

                const isUrgent = item.sentimentUrgency > 75;

                return (
                  <motion.div
                    key={item.id}
                    onClick={() => onOpenInitiativeModal(item)}
                    whileHover={{ scale: 1.08, zIndex: 30 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  >
                    {/* Node circle */}
                    <div className={`relative flex items-center justify-center rounded-xl p-2.5 border shadow-lg transition-all ${
                      isUrgent
                        ? 'bg-rose-950/90 border-rose-500/60 shadow-rose-950/50 text-white'
                        : 'bg-indigo-950/90 border-indigo-500/50 shadow-indigo-950/50 text-white'
                    }`}>
                      <div className="flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap">
                        {isUrgent && <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                        <span className="max-w-[140px] truncate">{item.title}</span>
                      </div>
                      
                      {/* Floating RICE score badge */}
                      <span className="absolute -top-2.5 -right-2 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-700 text-indigo-300">
                        {item.riceScore.toLocaleString()}
                      </span>
                    </div>

                    {/* Tooltip on hover */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block w-64 p-3 bg-slate-950/95 border border-slate-800 rounded-xl shadow-2xl z-40 text-xs pointer-events-none">
                      <div className="font-semibold text-white mb-1">{item.title}</div>
                      <p className="text-slate-400 text-[11px] line-clamp-2 mb-2">{item.description}</p>
                      <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 pt-1 border-t border-slate-800 font-mono">
                        <div>Reach: {item.reach.toLocaleString()}</div>
                        <div>Impact: {item.impact}x</div>
                        <div>Confidence: {item.confidence}%</div>
                        <div>Effort: {item.effort} wks</div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN PIPELINE */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['Now', 'Next', 'Later', 'Shipped'] as RoadmapStatus[]).map((status) => {
            const items = filteredRoadmap.filter((item) => item.status === status);
            const statusColor =
              status === 'Now'
                ? 'text-emerald-400 border-emerald-500/30'
                : status === 'Next'
                ? 'text-indigo-400 border-indigo-500/30'
                : status === 'Later'
                ? 'text-slate-400 border-slate-700'
                : 'text-violet-400 border-violet-500/30';

            return (
              <div key={status} className="flex flex-col rounded-2xl bg-slate-900/40 border border-slate-800/80 p-4 min-h-[500px]">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${statusColor}`}>
                      {status}
                    </span>
                    <span className="text-xs font-mono text-slate-500">({items.length})</span>
                  </div>
                </div>

                {/* Cards List */}
                <div className="space-y-3 flex-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenInitiativeModal(item)}
                      className="p-4 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                        <span className="text-indigo-400 font-medium">{item.category}</span>
                        <span className="font-mono tabular-data font-semibold text-slate-300">
                          RICE {item.riceScore.toLocaleString()}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors leading-snug mb-2">
                        {item.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Card Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <button
                          onClick={(e) => handleToggleUpvote(item, e)}
                          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-colors ${
                            item.hasUpvoted ? 'text-indigo-300 bg-indigo-950/60' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{item.upvotes}</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {status !== 'Now' && (
                            <button
                              onClick={(e) => handleStatusChange(item, 'Now', e)}
                              className="text-[10px] text-slate-400 hover:text-emerald-400 px-1 py-0.5 rounded hover:bg-slate-800"
                              title="Move to Now"
                            >
                              → Now
                            </button>
                          )}
                          {status !== 'Next' && (
                            <button
                              onClick={(e) => handleStatusChange(item, 'Next', e)}
                              className="text-[10px] text-slate-400 hover:text-indigo-400 px-1 py-0.5 rounded hover:bg-slate-800"
                              title="Move to Next"
                            >
                              → Next
                            </button>
                          )}
                          {status !== 'Shipped' && (
                            <button
                              onClick={(e) => handleStatusChange(item, 'Shipped', e)}
                              className="text-[10px] text-slate-400 hover:text-violet-400 px-1 py-0.5 rounded hover:bg-slate-800"
                              title="Mark Shipped"
                            >
                              ✓ Ship
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-10 text-xs text-slate-600">
                      No initiatives in {status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: RICE RANKED LIST */}
      {viewMode === 'list' && (
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Initiative</th>
                <th className="py-3 px-3">Milestone</th>
                <th className="py-3 px-3 text-right">Reach</th>
                <th className="py-3 px-3 text-right">Impact</th>
                <th className="py-3 px-3 text-right">Confidence</th>
                <th className="py-3 px-3 text-right">Effort</th>
                <th className="py-3 px-3 text-right">RICE Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[...filteredRoadmap]
                .sort((a, b) => b.riceScore - a.riceScore)
                .map((item, idx) => (
                  <tr
                    key={item.id}
                    onClick={() => onOpenInitiativeModal(item)}
                    className="hover:bg-slate-850/60 cursor-pointer transition-colors group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-500 font-semibold w-5">#{idx + 1}</span>
                        <div>
                          <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-slate-300 font-medium">{item.status}</span>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-data text-slate-300">
                      {item.reach.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-data text-slate-300">
                      {item.impact}x
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-data text-slate-300">
                      {item.confidence}%
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-data text-slate-300">
                      {item.effort} wks
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono tabular-data font-bold text-indigo-400 text-sm">
                      {item.riceScore.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenInitiativeModal(item);
                        }}
                        className="px-2.5 py-1 text-xs text-indigo-300 hover:text-white bg-indigo-950/50 hover:bg-indigo-900/60 border border-indigo-800/40 rounded-lg transition-colors"
                      >
                        PRD Spec
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
