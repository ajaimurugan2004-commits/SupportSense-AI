import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FeedbackItem, CustomerTier, FeedbackSource } from '../types';
import { X, Sparkles, Building2, Send, Wand2 } from 'lucide-react';

interface AddFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFeedback: (feedback: FeedbackItem) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const AddFeedbackModal: React.FC<AddFeedbackModalProps> = ({
  isOpen,
  onClose,
  onAddFeedback,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [company, setCompany] = useState('');
  const [customerTier, setCustomerTier] = useState<CustomerTier>('Enterprise');
  const [source, setSource] = useState<FeedbackSource>('Intercom');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preset demo templates to test quickly
  const loadPreset = (preset: 'urgent' | 'positive' | 'confusion') => {
    if (preset === 'urgent') {
      setCustomerName('David Chen');
      setCustomerEmail('david.c@strata-fin.com');
      setCompany('Strata Financial Corp');
      setCustomerTier('Enterprise');
      setSource('Zendesk');
      setTitle('Audit log export times out when selecting custom 90-day range');
      setContent('Our compliance audit is scheduled for this Friday. Every time I trigger the 90-day CSV export, the screen shows a spinny loader for 4 minutes and then resets to blank with error 504. Our security officers are on our backs. We need an urgent patch or a manual database dump immediately.');
    } else if (preset === 'positive') {
      setCustomerName('Miriam Al-Hassan');
      setCustomerEmail('miriam@stellar-ai.co');
      setCompany('Stellar AI Labs');
      setCustomerTier('Scale');
      setSource('In-App Widget');
      setTitle('The keyboard shortcuts and dark theme are pure perfection');
      setContent('Just upgraded our team to the annual plan after testing the new navigation shortcuts. The responsiveness of the triage keyboard controls shaved 40% off our morning backlog review. Keep up the phenomenal polish!');
    } else {
      setCustomerName('Julian Reed');
      setCustomerEmail('jreed@orbitdesign.io');
      setCompany('Orbit Design Studio');
      setCustomerTier('Pro');
      setSource('Intercom');
      setTitle('Where did the webhook signing secret move to in the new dashboard?');
      setContent('I spent 45 minutes searching through Workspace Settings, Security, and Integrations trying to rotate our webhook secret key. The documentation still shows the old layout from last year. Had to ping support to get a simple token.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      onShowToast('Missing required fields', 'Please provide a title and feedback content', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          customerName: customerName || 'Anonymous User',
          customerTier,
          source,
        }),
      });

      const analysis = await res.json();

      const newFeedback: FeedbackItem = {
        id: `fb-${Date.now()}`,
        customerName: customerName || 'Anonymous User',
        customerEmail: customerEmail || 'user@example.com',
        company: company || 'Independent Account',
        customerTier,
        source,
        createdAt: 'Just now',
        title,
        content,
        sentiment: analysis.sentiment || 'Neutral',
        score: analysis.score || 0,
        urgency: analysis.urgency || 'Low',
        emotions: analysis.emotions || { frustration: 20, delight: 20, confusion: 10 },
        category: analysis.category || 'Feature Request',
        summary: analysis.summary || 'Customer feedback submitted via ingestion modal.',
        keyPainPoints: analysis.keyPainPoints || [],
        suggestedAction: analysis.suggestedAction || 'Review during weekly product triage.',
        potentialChurnRisk: Boolean(analysis.potentialChurnRisk),
        relatedFeatureTag: analysis.relatedFeatureTag || 'Platform',
        status: 'Unreviewed',
      };

      onAddFeedback(newFeedback);
      onShowToast('Feedback Ingested & Analyzed', `AI Sentiment: ${newFeedback.sentiment} (${newFeedback.score})`, 'success');
      onClose();
    } catch (err: any) {
      onShowToast('Ingestion error', err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.18 }}
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Ingest Customer Feedback</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by Gemini 3.8 Flash for instant sentiment analysis and emotion breakdown
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors btn-tactile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Templates */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 font-medium">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Load Quick Sample:</span>
          </span>
          <button
            type="button"
            onClick={() => loadPreset('urgent')}
            className="px-2.5 py-1 text-xs rounded-md bg-rose-950/40 text-rose-300 hover:bg-rose-900/50 border border-rose-800/40 transition-colors btn-tactile"
          >
            Critical 504 Timeout (Enterprise)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('positive')}
            className="px-2.5 py-1 text-xs rounded-md bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-800/40 transition-colors btn-tactile"
          >
            Delighted Power User (Scale)
          </button>
          <button
            type="button"
            onClick={() => loadPreset('confusion')}
            className="px-2.5 py-1 text-xs rounded-md bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 border border-amber-800/40 transition-colors btn-tactile"
          >
            Confused UX Navigation (Pro)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. David Chen"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company / Org</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Strata Financial"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="david@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Customer Tier</label>
              <select
                value={customerTier}
                onChange={(e) => setCustomerTier(e.target.value as CustomerTier)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Enterprise">Enterprise</option>
                <option value="Scale">Scale</option>
                <option value="Pro">Pro</option>
                <option value="Free">Free</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Feedback Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as FeedbackSource)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Zendesk">Zendesk</option>
                <option value="Intercom">Intercom</option>
                <option value="In-App Widget">In-App Widget</option>
                <option value="Slack Community">Slack Community</option>
                <option value="G2 Crowd">G2 Crowd</option>
                <option value="Discord">Discord</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Feedback Title / Subject</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Audit log export times out when selecting custom 90-day range"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Verbatim Content / Ticket Transcript</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste exact customer quote, support ticket transcript, or community review..."
              rows={5}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors btn-tactile"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all btn-tactile disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Analyzing with Gemini...' : 'Analyze & Ingest'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
