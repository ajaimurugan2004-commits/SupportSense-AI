import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FeedbackItem } from '../types';
import { 
  X, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  RotateCw, 
  Building2, 
  Mail, 
  Flame, 
  CheckCircle2,
  Share2,
  FileText
} from 'lucide-react';

interface FeedbackDetailModalProps {
  feedback: FeedbackItem | null;
  onClose: () => void;
  onUpdateFeedback: (updated: FeedbackItem) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  feedback,
  onClose,
  onUpdateFeedback,
  onShowToast,
}) => {
  if (!feedback) return null;

  const [selectedTone, setSelectedTone] = useState<'empathetic' | 'technical' | 'executive'>('empathetic');
  const [draftText, setDraftText] = useState(feedback.draftReply || '');
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate reply using Gemini backend
  const handleGenerateReply = async () => {
    setIsGeneratingReply(true);
    try {
      const res = await fetch('/api/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback, tone: selectedTone }),
      });
      const data = await res.json();
      if (data.reply) {
        setDraftText(data.reply);
        onUpdateFeedback({ ...feedback, draftReply: data.reply });
        onShowToast('Empathy reply drafted', `Tone calibrated to ${selectedTone}`, 'success');
      }
    } catch (err: any) {
      onShowToast('Failed to draft reply', err.message, 'error');
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Re-analyze sentiment with Gemini backend
  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      const res = await fetch('/api/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: feedback.title,
          content: feedback.content,
          customerName: feedback.customerName,
          customerTier: feedback.customerTier,
          source: feedback.source,
        }),
      });
      const data = await res.json();
      if (data.sentiment) {
        const updated: FeedbackItem = {
          ...feedback,
          sentiment: data.sentiment,
          score: data.score,
          urgency: data.urgency,
          emotions: data.emotions,
          category: data.category,
          summary: data.summary,
          keyPainPoints: data.keyPainPoints,
          suggestedAction: data.suggestedAction,
          potentialChurnRisk: data.potentialChurnRisk,
          relatedFeatureTag: data.relatedFeatureTag,
        };
        onUpdateFeedback(updated);
        onShowToast('Sentiment Dossier Refreshed', `Gemini scored: ${data.sentiment} (${data.score})`, 'success');
      }
    } catch (err: any) {
      onShowToast('Re-analysis failed', err.message, 'error');
    } finally {
      setIsReanalyzing(false);
    }
  };

  const handleCopyReply = () => {
    if (!draftText) return;
    navigator.clipboard.writeText(draftText);
    setCopied(true);
    onShowToast('Copied to clipboard', 'Response ready to paste into support tool', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Customer Feedback Dossier</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-indigo-400">{feedback.id}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">{feedback.createdAt}</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">{feedback.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors btn-tactile"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two column split */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Customer Profile & Transcript (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Customer Metadata Card */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <span>{feedback.customerName}</span>
                  <span className="text-xs font-normal text-slate-400">({feedback.customerEmail})</span>
                </div>
                <span className={`font-semibold ${feedback.customerTier === 'Enterprise' ? 'text-indigo-400' : 'text-slate-300'}`}>
                  {feedback.customerTier} Tier
                </span>
              </div>
              <div className="flex items-center gap-4 text-slate-400 pt-1 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  {feedback.company}
                </span>
                <span aria-hidden="true">·</span>
                <span>Source: {feedback.source}</span>
                <span aria-hidden="true">·</span>
                <span>Module: {feedback.relatedFeatureTag}</span>
              </div>
            </div>

            {/* Verbatim Feedback Quote */}
            <div>
              <label className="text-xs font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
                Verbatim Customer Message
              </label>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                "{feedback.content}"
              </div>
            </div>

            {/* AI Executive Summary & Actionable Recommendation */}
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Executive Synopsis</span>
                </span>
                <button
                  onClick={handleReanalyze}
                  disabled={isReanalyzing}
                  className="text-xs text-indigo-300 hover:text-white flex items-center gap-1 disabled:opacity-50"
                >
                  <RotateCw className={`w-3 h-3 ${isReanalyzing ? 'animate-spin' : ''}`} />
                  <span>{isReanalyzing ? 'Analyzing...' : 'Re-Run'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {feedback.summary}
              </p>
              
              <div className="pt-2 border-t border-indigo-900/30">
                <div className="text-[11px] font-semibold text-slate-400 mb-1">Recommended Action:</div>
                <div className="text-xs text-indigo-200 font-medium">
                  {feedback.suggestedAction}
                </div>
              </div>

              {feedback.keyPainPoints && feedback.keyPainPoints.length > 0 && (
                <div className="pt-2 border-t border-indigo-900/30">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">Isolated Pain Points:</div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {feedback.keyPainPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-400">›</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sentiment Radar & Customer Reply Studio (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Sentiment & Emotion Metrics */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300">Sentiment & Urgency</span>
                {feedback.potentialChurnRisk && (
                  <span className="text-rose-400 flex items-center gap-1 font-semibold text-xs">
                    <Flame className="w-3.5 h-3.5" /> Churn Alert
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-slate-400">Sentiment Score:</span>
                <span className={`text-base font-bold tabular-data ${feedback.score >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {feedback.sentiment} ({feedback.score > 0 ? `+${feedback.score}` : feedback.score})
                </span>
              </div>

              {/* Emotion Bars */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Frustration</span>
                    <span className="text-rose-400 tabular-data font-semibold">{feedback.emotions.frustration}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full" style={{ width: `${feedback.emotions.frustration}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Delight</span>
                    <span className="text-emerald-400 tabular-data font-semibold">{feedback.emotions.delight}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${feedback.emotions.delight}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Confusion</span>
                    <span className="text-amber-400 tabular-data font-semibold">{feedback.emotions.confusion}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${feedback.emotions.confusion}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Empathy Reply Studio */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Empathy Reply Studio</span>
                </span>
                
                {/* Tone segmented button */}
                <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800">
                  {(['empathetic', 'technical', 'executive'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTone(t)}
                      className={`px-2 py-0.5 text-[10px] font-medium rounded capitalize transition-colors ${
                        selectedTone === t ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Click 'Draft with AI' to generate an empathetic response tailored to this customer's sentiment and issue..."
                rows={7}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed font-sans"
              />

              {/* Reply actions */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={handleGenerateReply}
                  disabled={isGeneratingReply}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all btn-tactile disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingReply ? 'Generating...' : 'Draft with Gemini'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyReply}
                    disabled={!draftText}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors btn-tactile disabled:opacity-40"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Status: <span className="text-slate-300 font-medium">{feedback.status}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors btn-tactile"
          >
            Close Dossier
          </button>
        </div>

      </motion.div>
    </div>
  );
};
