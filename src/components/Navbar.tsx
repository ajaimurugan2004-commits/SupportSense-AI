import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  MessageSquareText, 
  Layers, 
  BarChart3, 
  Bot, 
  Plus, 
  RotateCcw,
  Zap
} from 'lucide-react';

export type ActiveTab = 'feedbacks' | 'roadmap' | 'insights' | 'copilot';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddFeedback: () => void;
  onOpenGenerateRoadmap: () => void;
  onResetData: () => void;
  urgentCount: number;
  totalFeedbackCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddFeedback,
  onOpenGenerateRoadmap,
  onResetData,
  urgentCount,
}) => {
  const navItems = [
    {
      id: 'feedbacks' as ActiveTab,
      label: 'Feedback Stream',
      icon: MessageSquareText,
      badge: urgentCount > 0 ? `${urgentCount} urgent` : undefined,
    },
    {
      id: 'roadmap' as ActiveTab,
      label: 'Prioritization Matrix',
      icon: Layers,
    },
    {
      id: 'insights' as ActiveTab,
      label: 'Sentiment Trends',
      icon: BarChart3,
    },
    {
      id: 'copilot' as ActiveTab,
      label: 'Insights Copilot',
      icon: Bot,
      sparkle: true,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">SupportSense</span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI 3.8
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Customer Feedback & Roadmap Intelligence</p>
            </div>
          </div>

          {/* Navigation segmented control */}
          <nav className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 btn-tactile ${
                    isActive
                      ? 'text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-pill"
                      className="absolute inset-0 bg-indigo-600/90 rounded-lg -z-10 shadow-sm border border-indigo-400/30"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="hidden md:inline">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 rounded">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onResetData}
              title="Reset sample feedback data"
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 transition-colors btn-tactile"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGenerateRoadmap}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/40 rounded-lg transition-colors btn-tactile"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Roadmap Synthesizer</span>
            </button>

            <button
              onClick={onOpenAddFeedback}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition-all btn-tactile border border-indigo-400/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ingest Feedback</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
