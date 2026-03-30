"use client";

import { motion } from "framer-motion";
import { 
  Mic, 
  Calendar, 
  Clock, 
  Sparkles, 
  ArrowLeft, 
  Edit3, 
  CheckCircle2, 
  Brain, 
  ClipboardList, 
  History,
  Download,
  Share2,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function MeetingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [meeting, setMeeting] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await fetch(`/api/meetings/${id}`);
        const data = await res.json();
        if (data.id) {
          setMeeting(data);
          setEditedTitle(data.title);
        } else {
          router.push('/meetings');
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeeting();
  }, [id, router]);

  const handleUpdateTitle = async () => {
    try {
      const res = await fetch(`/api/meetings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editedTitle })
      });
      if (res.ok) {
        setMeeting({ ...meeting, title: editedTitle });
        setIsEditingTitle(false);
      }
    } catch (error) {
      console.error('Error updating title:', error);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const res = await fetch(`/api/meetings/${id}/analyze`, { method: 'POST' });
      const data = await res.json();
      if (data.id) {
        setMeeting(data); // This will automatically update Summary and Action Items in UI
      }
    } catch (error) {
      console.error('Error analyzing meeting:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isChatLoading) return;
    
    const userMsg = userInput;
    const currentMessages = [...chatMessages, { role: 'user', content: userMsg }];
    
    setUserInput("");
    setChatMessages(currentMessages as any);
    setIsChatLoading(true);

    try {
      const res = await fetch(`/api/meetings/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: chatMessages 
        })
      });
      const data = await res.json();
      if (data.content) {
        setChatMessages([...currentMessages, { role: 'assistant', content: data.content }] as any);
      }
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleDownload = () => {
    if (!meeting) return;
    
    // Create text content for the meeting
    const content = `
MEETING REPORT: ${meeting.title}
Date: ${new Date(meeting.date).toLocaleDateString()}
Duration: ${meeting.duration || '0m'}

SUMMARY:
${meeting.summary || 'N/A'}

ACTION ITEMS:
${meeting.actionItems?.map((item: any) => `- [${item.done ? 'x' : ' '}] ${item.text} (${item.owner || 'No owner'})`).join('\n') || 'None'}

TRANSCRIPT:
${transcriptData}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${meeting.title.replace(/\s+/g, '_')}_Archive.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: meeting?.title,
      text: `Review meeting notes for: ${meeting?.title}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
    }
  };

  const toggleActionItem = async (itemId: string, currentStatus: boolean) => {
    try {
      // Optimistic UI update
      setMeeting((prev: any) => ({
        ...prev,
        actionItems: prev.actionItems.map((ai: any) => 
          ai.id === itemId ? { ...ai, done: !currentStatus } : ai
        )
      }));

      // Find the action item in the DB and toggle it
      // Since we don't have a dedicated action item API, we use the patch on meeting or create a new route.
      // For now, let's assume we can add a quick PATCH to the meetings/[id] to update action items too
      await fetch(`/api/action-items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !currentStatus })
      });
    } catch (error) {
      console.error('Error toggling action item:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-primary font-black tracking-widest uppercase text-xs">
          Decrypting Session Data...
        </div>
      </div>
    );
  }

  if (!meeting) return null;

  // Robust formatting for transcript data (handles legacy strings and new JSON wrapper)
  const getTranscriptText = () => {
    if (!meeting?.transcript) return "";
    
    // If it's a string, return it
    if (typeof meeting.transcript === 'string') return meeting.transcript;
    
    // If it's the new format { data: "..." }
    if (typeof meeting.transcript === 'object' && 'data' in meeting.transcript) {
       return (meeting.transcript as any).data || "";
    }
    
    return "";
  };

  const transcriptData = getTranscriptText();

  return (
    <div className="space-y-10">
      
      {/* Header with Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <Link href="/library">
          <button className="group flex items-center gap-3 text-muted-foreground hover:text-white transition-all">
             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                <ArrowLeft size={18} className="group-hover:text-black transition-all" />
             </div>
             <span className="font-outfit font-black text-[10px] uppercase tracking-widest">Back to Archive</span>
          </button>
        </Link>
        <div className="flex items-center gap-4">
           <button 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-muted-foreground hover:text-white"
              title="Share Session"
           >
              <Share2 size={16} />
           </button>
           <button 
              onClick={handleDownload}
              className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-muted-foreground hover:text-white"
              title="Download Report"
           >
              <Download size={16} />
           </button>
        </div>
      </motion.nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Content Area: Title & Transcript */}
        <section className="lg:col-span-12 xl:col-span-8 space-y-12">
          
          <motion.div 
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-6"
          >
             <div className="flex items-center gap-4 text-primary font-black text-[10px] tracking-[0.3em] uppercase opacity-60 font-outfit">
                <Calendar size={14} />
                {new Date(meeting.date).toLocaleDateString()}
                <span className="mx-2">·</span>
                <Clock size={14} />
                {meeting.duration || '0m'}
             </div>

             <div className="group relative">
                {isEditingTitle ? (
                  <div className="flex items-center gap-3">
                    <input 
                      autoFocus
                      className="bg-white/5 border-b border-primary/50 text-white font-outfit font-black text-4xl lg:text-6xl tracking-tighter w-full focus:outline-none py-2"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      onBlur={handleUpdateTitle}
                      onKeyDown={(e) => e.key === 'Enter' && handleUpdateTitle()}
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <h1 
                      onClick={() => setIsEditingTitle(true)}
                      className="text-white font-outfit font-black text-4xl lg:text-6xl tracking-tighter leading-tight cursor-pointer hover:text-primary transition-colors"
                    >
                      {meeting.title}
                    </h1>
                    <button 
                       onClick={() => setIsEditingTitle(true)}
                       className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary"
                    >
                       <Edit3 size={20} />
                    </button>
                  </div>
                )}
             </div>
          </motion.div>

          <div className="bg-white/5 rounded-[3rem] border border-white/10 overflow-hidden">
             <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                <h2 className="text-white font-outfit font-bold text-lg flex items-center gap-3">
                   <Mic className="w-5 h-5 text-primary" />
                   Transcript Archive
                </h2>
                <span className="text-muted-foreground/30 text-[10px] font-black uppercase tracking-widest">Verbatim Record</span>
             </div>
             
             <div className="p-10 space-y-8 max-h-[600px] overflow-y-auto custom-scrollbar">
                {transcriptData ? (
                  <div className="space-y-6">
                    {transcriptData.split('\n').map((line: string, i: number) => {
                      const [speaker, ...rest] = line.split(':');
                      const text = rest.join(':');
                      if (!text) return <p key={i} className="text-muted-foreground/60 leading-relaxed italic">{line}</p>;
                      
                      return (
                        <div key={i} className="flex gap-6 group">
                           <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 font-black text-[10px] group-hover:bg-primary group-hover:text-black transition-all uppercase">
                              {speaker.trim().slice(0, 2)}
                           </div>
                           <div className="space-y-1 py-1">
                              <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">{speaker.trim()}</p>
                              <p className="text-white/80 leading-relaxed text-sm lg:text-base font-medium">{text.trim()}</p>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-20 text-center text-muted-foreground/30">
                     <History size={48} className="mx-auto mb-4 opacity-20" />
                     <p className="font-outfit font-bold tracking-widest uppercase text-xs">No transcript captured for this session.</p>
                  </div>
                )}
             </div>
          </div>
        </section>

        {/* Sidebar: Insights & Action Items */}
        <aside className="lg:col-span-12 xl:col-span-4 space-y-8">
           
           {/* Summary Section */}
           <motion.div 
             initial={{ opacity: 0, x: 10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.2 }}
             className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6 shadow-xl relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Brain size={80} className="text-primary" />
              </div>
              
              <div className="flex items-center gap-3 text-primary font-black text-[10px] tracking-widest uppercase">
                 <Sparkles size={14} className="fill-current" />
                 AI Intelligence Hub
              </div>

              <div className="space-y-4 relative z-10">
                 <h3 className="text-white font-outfit font-bold text-xl">Session Summary</h3>
                 <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">
                   {meeting.summary || "No automated summary available. Trigger AI Analysis to generate insights from the transcript."}
                 </p>
              </div>

              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className={cn(
                  "w-full bg-primary/10 border border-primary/20 text-primary font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all shadow-sm flex items-center justify-center gap-2",
                  isAnalyzing && "opacity-50 cursor-not-allowed"
                )}
              >
                 {isAnalyzing ? (
                   <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                 ) : (
                   <Brain size={14} />
                 )}
                 {isAnalyzing ? "AI Scanning..." : "Trigger AI Deep-Scan"}
              </button>
           </motion.div>

           {/* Action Items */}
           <motion.div 
             initial={{ opacity: 0, x: 10 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="bg-white/5 border border-white/10 rounded-[2.5rem] shadow-xl overflow-hidden"
           >
              <div className="p-8 border-b border-white/5 flex items-center gap-3">
                 <ClipboardList className="w-5 h-5 text-primary" />
                 <h3 className="text-white font-outfit font-bold text-lg">Action Items</h3>
              </div>
              
              <div className="p-8 space-y-4">
                 {meeting.actionItems?.length > 0 ? (
                   meeting.actionItems.map((item: any) => (
                      <div 
                         key={item.id} 
                         className="flex gap-4 group cursor-pointer"
                         onClick={() => toggleActionItem(item.id, item.done)}
                      >
                         <div className={cn(
                            "w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                            item.done ? "bg-primary border-primary shadow-neon" : "border-white/10 bg-white/5 group-hover:border-primary/50"
                         )}>
                            {item.done && <CheckCircle2 size={14} className="text-black" />}
                         </div>
                         <div className="space-y-1">
                            <p className={cn("text-sm transition-all", item.done ? "text-muted-foreground line-through opacity-50" : "text-white")}>
                               {item.text}
                            </p>
                            {item.owner && (
                               <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Owner: {item.owner}</span>
                            )}
                         </div>
                      </div>
                   ))
                 ) : (
                    <div className="py-10 text-center opacity-30">
                       <p className="text-[10px] font-black uppercase tracking-widest font-outfit">Clear Agenda - No Actions Found</p>
                    </div>
                 )}
              </div>
           </motion.div>

           <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex flex-col items-center justify-center text-center gap-4 group cursor-pointer hover:bg-primary/10 transition-all opacity-40 hover:opacity-100">
              <Bookmark className="text-primary w-6 h-6 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Save to Curated Collection</p>
           </div>

           {/* AI Chat Insight - New Feature */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="bg-black/40 border border-white/10 rounded-[3rem] overflow-hidden flex flex-col shadow-2xl h-[500px]"
           >
              <div className="p-6 bg-white/5 border-b border-white/5 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                       <Sparkles size={16} className="text-black fill-current" />
                    </div>
                    <span className="text-white font-outfit font-bold text-xs">AI Chat Insights</span>
                 </div>
                 <div className="flex items-center gap-1.5 antialiased">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-widest">Active</span>
                 </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                 {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-primary/20">
                          <Brain size={24} />
                       </div>
                       <p className="text-[11px] font-medium text-muted-foreground/40 leading-relaxed uppercase tracking-widest">
                          Ask anything about this meeting archive. AI will scan your transcript to answer.
                       </p>
                    </div>
                 ) : (
                    chatMessages.map((msg, i) => (
                       <div key={i} className={cn(
                          "flex flex-col gap-1.5 max-w-[90%]",
                          msg.role === 'user' ? "ml-auto items-end" : "items-start"
                       )}>
                          <div className={cn(
                             "p-4 rounded-[1.5rem] text-sm leading-relaxed antialiased",
                             msg.role === 'user' ? "bg-primary text-black font-bold rounded-tr-none" : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                          )}>
                             {msg.content}
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/30 px-2">{msg.role}</span>
                       </div>
                    ))
                 )}
                 {isChatLoading && (
                    <div className="flex items-center gap-3 text-primary/40 text-[9px] font-black uppercase tracking-widest animate-pulse pl-2">
                       <Sparkles size={12} className="animate-spin-slow" />
                       Analyzing Intelligence...
                    </div>
                 )}
              </div>

              <div className="p-4 bg-white/5 border-t border-white/5">
                 <div className="relative group">
                    <input 
                       className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-xs text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/20"
                       placeholder="Scan session for answers..."
                       value={userInput}
                       onChange={(e) => setUserInput(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <button 
                       onClick={handleSendMessage}
                       disabled={isChatLoading || !userInput.trim()}
                       className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
                    >
                       <ArrowLeft size={16} className="rotate-180" />
                    </button>
                 </div>
              </div>
           </motion.div>
        </aside>

      </div>
    </div>
  );
}
