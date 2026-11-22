/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar, ActiveTab } from './components/Navbar';
import { MetricCards } from './components/MetricCards';
import { FeedbackCard } from './components/FeedbackCard';
import { FeedbackDetailModal } from './components/FeedbackDetailModal';
import { AddFeedbackModal } from './components/AddFeedbackModal';
import { RoadmapView } from './components/RoadmapView';
import { RoadmapDetailModal } from './components/RoadmapDetailModal';
import { GenerateInitiativeModal } from './components/GenerateInitiativeModal';
import { InsightsView } from './components/InsightsView';
import { CopilotView } from './components/CopilotView';
import { ToastContainer, ToastMessage } from './components/Toast';

import { 
  FeedbackItem, 
  RoadmapInitiative, 
  SentimentType, 
  CustomerTier, 
  FeedbackCategory 
} from './types';
import { INITIAL_FEEDBACKS, INITIAL_ROADMAP } from './data/initialData';

import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Flame, 
  Plus, 
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';

export default function App() {
  // State with LocalStorage persistence
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('supportsense_feedbacks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_FEEDBACKS;
  });

  const [roadmap, setRoadmap] = useState<RoadmapInitiative[]>(() => {
    const saved = localStorage.getItem('supportsense_roadmap');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ROADMAP;
  });

  useEffect(() => {
    localStorage.setItem('supportsense_feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  useEffect(() => {
    localStorage.setItem('supportsense_roadmap', JSON.stringify(roadmap));
  }, [roadmap]);

  // Tab & Navigation
  const [activeTab, setActiveTab] = useState<ActiveTab>('feedbacks');

  // Filter & Search states for Feedback Inbox
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTier, setSelectedTier] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'urgency' | 'recent' | 'sentiment' | 'frustration'>('urgency');

  // Modal states
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [selectedRoadmapItem, setSelectedRoadmapItem] = useState<RoadmapInitiative | null>(null);
  const [isAddFeedbackOpen, setIsAddFeedbackOpen] = useState(false);
  const [isGenerateRoadmapOpen, setIsGenerateRoadmapOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Reset to initial seed
  const handleResetData = () => {
    setFeedbacks(INITIAL_FEEDBACKS);
    setRoadmap(INITIAL_ROADMAP);
    localStorage.removeItem('supportsense_feedbacks');
    localStorage.removeItem('supportsense_roadmap');
    addToast('Data Reset', 'Restored pristine sample feedback and roadmap datasets', 'info');
  };

  // Feedback updates
  const handleUpdateFeedback = (updated: FeedbackItem) => {
    setFeedbacks((prev) => prev.map((f) => (f.id === updated.id ? updated : f)));
    if (selectedFeedback?.id === updated.id) {
      setSelectedFeedback(updated);
    }
  };

  const handleStatusChange = (id: string, status: FeedbackItem['status']) => {
    setFeedbacks((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status } : f))
    );
    addToast('Status Updated', `Ticket marked as ${status}`, 'success');
  };

  // Roadmap updates
  const handleUpdateInitiative = (updated: RoadmapInitiative) => {
    setRoadmap((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    if (selectedRoadmapItem?.id === updated.id) {
      setSelectedRoadmapItem(updated);
    }
  };

  const handleAddInitiative = (newInitiative: RoadmapInitiative) => {
    setRoadmap((prev) => [newInitiative, ...prev]);
    setSelectedRoadmapItem(newInitiative);
  };

  // Filtered feedbacks
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((f) => {
      if (selectedSentiment !== 'All' && f.sentiment !== selectedSentiment) return false;
      if (selectedCategory !== 'All' && f.category !== selectedCategory) return false;
      if (selectedTier !== 'All' && f.customerTier !== selectedTier) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContent = f.content.toLowerCase().includes(q);
        const matchesTitle = f.title.toLowerCase().includes(q);
        const matchesCustomer = f.customerName.toLowerCase().includes(q);
        const matchesCompany = f.company.toLowerCase().includes(q);
        if (!matchesContent && !matchesTitle && !matchesCustomer && !matchesCompany) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'urgency') {
        const urgencyScore: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (urgencyScore[b.urgency] || 0) - (urgencyScore[a.urgency] || 0);
      }
      if (sortBy === 'sentiment') {
        return a.score - b.score; // lowest/most negative first
      }
      if (sortBy === 'frustration') {
        return b.emotions.frustration - a.emotions.frustration;
      }
      return 0; // recent default
    });
  }, [feedbacks, selectedSentiment, selectedCategory, selectedTier, searchQuery, sortBy]);

  // Urgent count
  const urgentCount = feedbacks.filter((f) => f.sentiment === 'Urgent' || f.urgency === 'Critical').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddFeedback={() => setIsAddFeedbackOpen(true)}
        onOpenGenerateRoadmap={() => setIsGenerateRoadmapOpen(true)}
        onResetData={handleResetData}
        urgentCount={urgentCount}
        totalFeedbackCount={feedbacks.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Executive Metric Cards Strip (displayed on Feedback & Roadmap views) */}
        {(activeTab === 'feedbacks' || activeTab === 'roadmap') && (
          <MetricCards
            feedbacks={feedbacks}
            roadmap={roadmap}
            onFilterUrgent={() => {
              setActiveTab('feedbacks');
              setSelectedSentiment('Urgent');
            }}
            onSelectRoadmapItem={(item) => setSelectedRoadmapItem(item)}
          />
        )}

        {/* TAB 1: FEEDBACK STREAM */}
        {activeTab === 'feedbacks' && (
          <div className="space-y-6">
            
            {/* Search and Filters Toolbar */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
              
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search feedback by keyword, customer, company, pain point..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Segmented Sentiment Filter */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                {(['All', 'Urgent', 'Negative', 'Neutral', 'Positive'] as const).map((sent) => (
                  <button
                    key={sent}
                    onClick={() => setSelectedSentiment(sent)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition-all btn-tactile ${
                      selectedSentiment === sent
                        ? sent === 'Urgent'
                          ? 'bg-rose-600 text-white shadow-sm'
                          : sent === 'Positive'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : sent === 'Negative'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {sent}
                  </button>
                ))}
              </div>

              {/* Dropdown Filters (Category, Tier, Sort) */}
              <div className="flex items-center gap-2 text-xs">
                {/* Category */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Categories</option>
                  <option value="Performance">Performance</option>
                  <option value="Billing">Billing</option>
                  <option value="Integrations">Integrations</option>
                  <option value="Reliability">Reliability</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="Feature Request">Feature Request</option>
                </select>

                {/* Tier */}
                <select
                  value={selectedTier}
                  onChange={(e) => setSelectedTier(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Tiers</option>
                  <option value="Enterprise">Enterprise</option>
                  <option value="Scale">Scale</option>
                  <option value="Pro">Pro</option>
                  <option value="Free">Free</option>
                </select>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="urgency">Sort: Critical First</option>
                  <option value="sentiment">Sort: Lowest Sentiment</option>
                  <option value="frustration">Sort: Highest Frustration</option>
                  <option value="recent">Sort: Most Recent</option>
                </select>
              </div>

            </div>

            {/* Results Counter & Active Filters indicator */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <div>
                Showing <span className="font-semibold text-white">{filteredFeedbacks.length}</span> of {feedbacks.length} customer feedback items
              </div>
              {(selectedSentiment !== 'All' || selectedCategory !== 'All' || selectedTier !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSentiment('All');
                    setSelectedCategory('All');
                    setSelectedTier('All');
                    setSearchQuery('');
                  }}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear filters
                </button>
              )}
            </div>

            {/* Feedback Cards Stream */}
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredFeedbacks.map((item) => (
                  <FeedbackCard
                    key={item.id}
                    feedback={item}
                    onOpenDetails={(f) => setSelectedFeedback(f)}
                    onQuickReply={(f) => setSelectedFeedback(f)}
                    onStatusChange={handleStatusChange}
                    onReanalyze={(f) => setSelectedFeedback(f)}
                  />
                ))}
              </AnimatePresence>

              {filteredFeedbacks.length === 0 && (
                <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto text-slate-500 border border-slate-800">
                    <Inbox className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">No feedback matches current filters</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try clearing your search query or selecting "All" across sentiment, category, and account tier filters.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedSentiment('All');
                      setSelectedCategory('All');
                      setSelectedTier('All');
                      setSearchQuery('');
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-indigo-400 hover:text-white bg-indigo-950/60 border border-indigo-800/40 rounded-lg transition-colors btn-tactile"
                  >
                    Reset all filters
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: ROADMAP PRIORITIZATION MATRIX */}
        {activeTab === 'roadmap' && (
          <RoadmapView
            roadmap={roadmap}
            feedbacks={feedbacks}
            onOpenInitiativeModal={(item) => setSelectedRoadmapItem(item)}
            onOpenGenerateModal={() => setIsGenerateRoadmapOpen(true)}
            onUpdateInitiative={handleUpdateInitiative}
            onShowToast={addToast}
          />
        )}

        {/* TAB 3: SENTIMENT ANALYTICS & TRENDS */}
        {activeTab === 'insights' && (
          <InsightsView
            feedbacks={feedbacks}
            roadmap={roadmap}
            onSelectFeedbackCategory={(cat) => {
              setSelectedCategory(cat);
              setActiveTab('feedbacks');
            }}
          />
        )}

        {/* TAB 4: COPILOT ASSISTANT */}
        {activeTab === 'copilot' && (
          <CopilotView
            feedbacks={feedbacks}
            roadmap={roadmap}
            onOpenInitiativeModal={(item) => setSelectedRoadmapItem(item)}
            onShowToast={addToast}
          />
        )}

      </main>

      {/* Modals & Dialogs */}
      <AnimatePresence>
        {selectedFeedback && (
          <FeedbackDetailModal
            feedback={selectedFeedback}
            onClose={() => setSelectedFeedback(null)}
            onUpdateFeedback={handleUpdateFeedback}
            onShowToast={addToast}
          />
        )}

        {selectedRoadmapItem && (
          <RoadmapDetailModal
            initiative={selectedRoadmapItem}
            onClose={() => setSelectedRoadmapItem(null)}
            onUpdateInitiative={handleUpdateInitiative}
            onShowToast={addToast}
          />
        )}

        {isAddFeedbackOpen && (
          <AddFeedbackModal
            isOpen={isAddFeedbackOpen}
            onClose={() => setIsAddFeedbackOpen(false)}
            onAddFeedback={(newFb) => {
              setFeedbacks((prev) => [newFb, ...prev]);
            }}
            onShowToast={addToast}
          />
        )}

        {isGenerateRoadmapOpen && (
          <GenerateInitiativeModal
            isOpen={isGenerateRoadmapOpen}
            onClose={() => setIsGenerateRoadmapOpen(false)}
            feedbacks={feedbacks}
            onInitiativeGenerated={handleAddInitiative}
            onShowToast={addToast}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
