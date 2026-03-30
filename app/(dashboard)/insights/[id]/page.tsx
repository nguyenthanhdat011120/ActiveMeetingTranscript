"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Sparkles,
  Tag,
  Gavel,
  CheckCircle2,
  ChevronLeft,
  Share2,
  ArrowRight,
  User,
  Brain,
  Download,
  FileText,
  AlertCircle,
  Hash
} from "lucide-react";
import { useState, useEffect, use, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingState } from "@/components/shared/loading-state";

// Toast Notification Component
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error' | 'info', onClose: () => void }) => (
  <motion.div
    initial={{ opacity: 0, x: 50, scale: 0.9 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    exit={{ opacity: 0, x: 20, scale: 0.9 }}
    className={cn(
      "fixed top-24 right-8 z-[100] p-5 rounded-2xl border backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 min-w-[320px] max-w-md transition-all",
      type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]" :
        type === 'error' ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-[0_0_20px_rgba(239,44,44,0.1)]" :
          "bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.1)]"
    )}
  >
    <div className={cn(
      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
      type === 'success' ? "bg-green-500/20" : type === 'error' ? "bg-red-500/20" : "bg-primary/20"
    )}>
      {type === 'success' ? <CheckCircle2 size={20} /> : type === 'error' ? <AlertCircle size={20} /> : <Sparkles size={20} />}
    </div>
    <div className="flex-1">
      <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{type === 'success' ? 'System Success' : 'System Alert'}</p>
      <p className="text-sm font-bold leading-tight tracking-tight">{message}</p>
    </div>
    <button onClick={onClose} className="opacity-40 hover:opacity-100 transition-opacity p-1">
      <AlertCircle size={14} className="rotate-45" />
    </button>
  </motion.div>
);

export default function MeetingInsightsDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [meeting, setMeeting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSyncingNotion, setIsSyncingNotion] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSyncNotion = async () => {
    setIsSyncingNotion(true);
    try {
      const res = await fetch('/api/integrations/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: id })
      });
      const data = await res.json();

      if (res.ok) {
        showToast("Đồng bộ Notion thành công!", "success");
        if (data.url) window.open(data.url, '_blank');
      } else {
        if (data.detail) {
          showToast(data.error + ": " + data.detail, "error");
        } else {
          showToast(data.error, "error");
        }
      }
    } catch (error) {
      console.error('Error syncing:', error);
      showToast("Lỗi hệ thống khi đồng bộ Notion.", "error");
    } finally {
      setIsSyncingNotion(false);
    }
  };
  const [isSyncingSlack, setIsSyncingSlack] = useState(false);

  const handleSyncSlack = async () => {
    setIsSyncingSlack(true);
    try {
      const res = await fetch('/api/integrations/slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ meetingId: id })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Synced to Slack successfully! 🚀", "success");
      } else {
        showToast(data.error || "Failed to sync to Slack.", "error");
      }
    } catch (err) {
      showToast("System error during Slack sync.", "error");
    } finally {
      setIsSyncingSlack(false);
    }
  };
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await fetch(`/api/meetings/${id}`);
        const data = await res.json();
        if (data.id) {
          setMeeting(data);
        } else {
          router.push('/library');
        }
      } catch (error) {
        console.error('Error fetching meeting insights:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeeting();
  }, [id, router]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/meetings/${id}/analyze`, { method: 'POST' });
      const data = await res.json();
      if (data.id) {
        setMeeting(data);
      }
    } catch (error) {
      console.error('Error triggering analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleActionItem = async (itemId: string, currentStatus: boolean) => {
    try {
      // Optimistic Update
      setMeeting((prev: any) => ({
        ...prev,
        actionItems: prev.actionItems.map((ai: any) =>
          ai.id === itemId ? { ...ai, done: !currentStatus } : ai
        )
      }));

      await fetch(`/api/action-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentStatus })
      });
    } catch (error) {
      console.error('Error updating action item:', error);
    }
  };

  const progress = useMemo(() => {
    if (!meeting?.actionItems || meeting.actionItems.length === 0) return 0;
    const doneCount = meeting.actionItems.filter((i: any) => i.done).length;
    return Math.round((doneCount / meeting.actionItems.length) * 100);
  }, [meeting]);

  if (isLoading) return <LoadingState type="page" message="Accessing Intelligence Vault" />;

  if (!meeting) return null;

  return (
    <>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <div className="space-y-10 lg:space-y-12">
        {/* Header Section */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <Link href={`/meetings/${id}`} className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Return to Report</span>
          </Link>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className={cn(
                "px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-[9px] font-black tracking-widest uppercase shadow-neon",
                !meeting.summary && "animate-pulse"
              )}>
                {meeting.summary ? "Synthesis Complete" : "Pending Analysis"}
              </span>
            </div>
            <h1 className="font-outfit text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight max-w-4xl">
              {meeting.title}
            </h1>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {new Date(meeting.date).toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> {meeting.duration || '0m'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!meeting.summary && (
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="px-8 py-3 rounded-xl bg-primary text-black font-black text-[10px] uppercase tracking-widest shadow-neon hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              {isAnalyzing ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" /> : <Brain size={16} />}
              Trigger AI Deep-Scan
            </button>
          )}
          <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            <Share2 size={16} />
            Share
          </button>
        </div>
      </section>

      {/* Main Analysis Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-20">

        {/* Left Side: Summary & Decisions */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-10">
          {/* AI Summary Panel */}
          <section className="bg-white/5 border border-white/10 rounded-[3rem] p-8 lg:p-12 relative overflow-hidden group hover:border-primary/40 transition-all shadow-xl">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles size={120} />
            </div>

            <div className="space-y-6 relative z-10">
              <h2 className="font-outfit font-black text-2xl lg:text-3xl text-primary tracking-tight uppercase flex items-center gap-3">
                <Sparkles className="w-6 h-6 fill-current shadow-neon" />
                Executive Summary
              </h2>
              <div className="text-muted-foreground leading-relaxed text-lg lg:text-xl font-medium space-y-4">
                {meeting.summary ? (
                  meeting.summary.split('\n').map((paragraph: string, i: number) => (
                    <p key={i}>{paragraph}</p>
                  ))
                ) : (
                  <div className="py-10 text-center space-y-6">
                    <Brain size={48} className="mx-auto text-primary/20 animate-pulse" />
                    <p className="text-sm opacity-40">Intelligence is currently locked. Trigger Deep-Scan to generate summary and insights from the transcript.</p>
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="mx-auto px-8 py-4 bg-primary/10 border border-primary/20 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                    >
                      {isAnalyzing ? "Processing..." : "Generate Insights Now"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contextual Topics (Derive from Summary if needed) */}
          {meeting.summary && (
            <section className="space-y-6">
              <h3 className="font-outfit font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest opacity-40">
                <Tag className="w-5 h-5 text-primary" />
                AI Extracted Topics
              </h3>
              <div className="flex flex-wrap gap-3">
                {["Decision Making", "Product Roadmap", "Technical Sync", "Action Planning"].map((topic, i) => (
                  <motion.span
                    key={topic}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-background border border-white/5 text-white/60 font-black text-[10px] px-6 py-3 rounded-full hover:border-primary/40 hover:text-primary cursor-pointer transition-all uppercase tracking-[0.2em] shadow-sm"
                  >
                    {topic}
                  </motion.span>
                ))}
              </div>
            </section>
          )}

          {/* Key Outcomes / Decisions Box */}
          <section className="space-y-6">
            <h3 className="font-outfit font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest opacity-40">
              <Gavel className="w-5 h-5 text-primary" />
              Primary Outcomes
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {meeting.actionItems?.slice(0, 2).map((item: any, i: number) => (
                <div key={item.id} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all space-y-4 group">
                  <span className="text-primary font-black text-[9px] tracking-[0.4em] uppercase opacity-40">Outcome 0{i + 1}</span>
                  <p className="font-outfit font-bold text-xl text-white leading-tight group-hover:text-primary transition-colors line-clamp-3">
                    {item.text}
                  </p>
                </div>
              ))}
              {(!meeting.actionItems || meeting.actionItems.length === 0) && (
                <div className="md:col-span-2 py-10 text-center bg-white/[0.02] rounded-[2.5rem] border border-dashed border-white/5 opacity-30 italic text-sm">
                  Run analysis to identify key outcomes.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Side: Interactive Checklist & Progress */}
        <aside className="lg:col-span-12 xl:col-span-5 space-y-8">
          <div className="bg-background border border-white/10 rounded-[3rem] p-8 lg:p-10 space-y-8 shadow-2xl overflow-hidden relative sticky top-28">
            <header className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-outfit font-black text-2xl text-white uppercase tracking-tighter">Action Items</h3>
                <span className="text-primary font-black text-sm tracking-widest">PROGRESS: {progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-primary shadow-neon"
                />
              </div>
            </header>

            <div className="space-y-2 max-h-[450px] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence>
                {meeting.actionItems?.map((item: any) => (
                  <motion.div
                    key={item.id}
                    layout
                    className={cn(
                      "flex items-start gap-5 p-6 rounded-[2rem] border transition-all cursor-pointer group",
                      item.done ? "bg-primary/5 border-primary/20 opacity-60" : "bg-white/5 border-transparent hover:border-white/10"
                    )}
                    onClick={() => toggleActionItem(item.id, item.done)}
                  >
                    <div className={cn(
                      "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all text-black",
                      item.done ? "bg-primary border-primary" : "border-white/10 group-hover:border-primary/40"
                    )}>
                      {item.done && <CheckCircle2 size={16} className="fill-current" />}
                    </div>
                    <div className="space-y-1">
                      <p className={cn(
                        "text-base font-bold leading-tight transition-all",
                        item.done ? "text-white/40 line-through" : "text-white"
                      )}>
                        {item.text}
                      </p>
                      {item.owner && (
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest mt-1 block",
                          item.done ? "text-primary/30" : "text-primary/60"
                        )}>
                          Owner: {item.owner}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {(!meeting.actionItems || meeting.actionItems.length === 0) && (
                <div className="py-20 text-center space-y-4 opacity-20">
                  <Brain size={40} className="mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest">No action items extracted yet.</p>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
              <button
                onClick={handleSyncNotion}
                disabled={isSyncingNotion || !meeting.summary}
                className={cn(
                  "w-full bg-white/5 border border-white/10 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2",
                  (isSyncingNotion || !meeting.summary) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSyncingNotion ? (
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : <FileText size={16} />}
                {isSyncingNotion ? "Syncing..." : "Sync to Notion"}
              </button>

              <button
                onClick={handleSyncSlack}
                disabled={isSyncingSlack || !meeting.summary}
                className={cn(
                  "w-full bg-[#4A154B]/10 border border-[#4A154B]/30 text-[#E01E5A] font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-[#4A154B]/20 transition-all flex items-center justify-center gap-2",
                  (isSyncingSlack || !meeting.summary) && "opacity-50 cursor-not-allowed"
                )}
              >
                {isSyncingSlack ? (
                  <div className="w-4 h-4 border-2 border-[#E01E5A]/20 border-t-[#E01E5A] rounded-full animate-spin" />
                ) : <Hash size={16} />}
                {isSyncingSlack ? "Sending..." : "Sync to Slack Channel"}
              </button>
            </div>
          </div>
        </aside>

      </div>
    </div>
    </>
  );
}
