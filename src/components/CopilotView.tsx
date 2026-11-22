import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FeedbackItem, RoadmapInitiative, CopilotResponse } from '../types';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Quote, 
  Lightbulb, 
  Target, 
  Layers, 
  Flame, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface CopilotViewProps {
  feedbacks: FeedbackItem[];
  roadmap: RoadmapInitiative[];
  onOpenInitiativeModal: (initiative: RoadmapInitiative) => void;
  onShowToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  feedbacks,
  roadmap,
  onOpenInitiativeModal,
  onShowToast,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<CopilotResponse | null>({
    answer: "Enterprise accounts are experiencing critical friction around synchronous dataset exports. Customers with large datasets (over 100k rows) are hitting 504 timeouts on weekly audit runs, creating immediate churn risk for contract renewals next month. Additionally, billing seat deallocation is generating avoidable support volume due to hidden administrative controls.",
    keyFindings: [
      "Acme Global Logistics explicitly threatened non-renewal if 504 timeout on 150k row exports is not resolved before next billing cycle.",
      "Self-service seat revocation is hidden in settings, resulting in 3-day turnaround delays for new hire provisioning.",
      "Webhook delivery failures over the weekend failed silently without retry queues or dead-letter alerts.",
      "Users enthusiastically praise the natural language semantic search query speed and keyboard triage ergonomics."
    ],
    citedFeedbacks: [
      {
        customer: "Sarah Jenkins (Acme Global Logistics)",
        quote: "Twice in a row, the browser tab froze with a 504 gateway timeout and our finance team lost 3 hours of work. If we cannot export our historical data reliably, we cannot justify renewing our Enterprise tier.",
        sentiment: "Urgent"
      },
      {
        customer: "Marcus Vance (HyperGrowth Media)",
        quote: "Why does removing an offboarded teammate require filing a manual support ticket? It took 3 days just to get a license freed up.",
        sentiment: "Negative"
      },
      {
        customer: "Priya Sharma (FintechScale Partners)",
        quote: "Our data warehouse stopped receiving sentiment webhook updates over the weekend. No alert was sent, no retry queue exists.",
        sentiment: "Critical"
      }
    ],
    recommendedAction: "Expedite 'Asynchronous Bulk Data Export & S3 Streaming' into the current sprint to defend $180k ARR in enterprise renewal pipeline."
  });

  const promptSuggestions = [
    "Why are Enterprise customers threatening churn?",
    "Summarize billing & seat deallocation complaints",
    "What features are driving the highest customer delight?",
    "Which roadmap initiatives have the highest ROI for next sprint?",
    "Are there any silent failures reported in our integrations?"
  ];

  const handleRunQuery = async (userPrompt: string) => {
    if (!userPrompt.trim()) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userPrompt,
          feedbacks,
          roadmap,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setActiveResponse(data);
        onShowToast('Synthesis Complete', 'Cited feedback evidence and recommendations ready', 'success');
      }
    } catch (err: any) {
      onShowToast('Copilot error', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span>SupportSense AI Copilot</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Natural Language Feedback & Roadmap Intelligence
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Ask complex strategic questions about your customer voice. Grounded directly in ingested feedback transcripts with citations and calibrated RICE recommendations.
        </p>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunQuery(query);
          }}
          className="mt-5 flex gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything: 'Why are Enterprise accounts frustrated?' or 'What are our top 3 quick wins?'..."
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner"
            />
            <Sparkles className="w-4 h-4 text-indigo-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="flex items-center gap-2 px-5 py-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all btn-tactile disabled:opacity-50 shrink-0"
          >
            <span>{isLoading ? 'Analyzing...' : 'Ask Copilot'}</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Suggested Queries */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-medium flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            <span>Suggested queries:</span>
          </span>
          {promptSuggestions.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => {
                setQuery(prompt);
                handleRunQuery(prompt);
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-950/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors btn-tactile"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Synthesis Output Display */}
      {activeResponse && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6"
        >
          {/* Executive Answer */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Executive Synthesis</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed font-sans">
              {activeResponse.answer}
            </p>
          </div>

          {/* Key Findings List */}
          {activeResponse.keyFindings && activeResponse.keyFindings.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Extracted Findings
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {activeResponse.keyFindings.map((finding, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-950 text-indigo-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 border border-indigo-800/60">
                      {idx + 1}
                    </span>
                    <span>{finding}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Voice Citations */}
          {activeResponse.citedFeedbacks && activeResponse.citedFeedbacks.length > 0 && (
            <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Quote className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Direct Customer Evidence & Quotes</span>
                </span>
                <span className="text-[11px] text-slate-500 font-normal lowercase">
                  verbatim feedback citations
                </span>
              </div>

              <div className="space-y-2.5">
                {activeResponse.citedFeedbacks.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{item.customer}</span>
                      <span className={`font-mono text-[11px] ${
                        item.sentiment === 'Urgent' || item.sentiment === 'Critical'
                          ? 'text-rose-400 font-semibold'
                          : item.sentiment === 'Negative'
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}>
                        {item.sentiment}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200 italic leading-relaxed">
                      "{item.quote}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Roadmap Action */}
          {activeResponse.recommendedAction && (
            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/40 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-900/60 text-indigo-300 shrink-0">
                <Target className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white mb-0.5">Recommended Roadmap Action</div>
                <div className="text-indigo-200 leading-relaxed font-medium">
                  {activeResponse.recommendedAction}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      )}

    </div>
  );
};
