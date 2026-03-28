"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Search, Calendar, Clock, Sparkles, Tag, Gavel, CheckCircle2, ChevronLeft, Share2, ArrowRight, User, Trash2 } from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const initialActionItems: { id: number; text: string; owner: string; done: boolean; initials?: string }[] = [
    { id: 1, text: "Update Jira tickets for roadmap changes", owner: "Sarah M.", done: false },
    { id: 2, text: "Review API cache proposal with dev team", owner: "James K.", done: true },
    { id: 3, text: "Send out follow-up survey to participants", owner: "Sarah M.", done: false },
    { id: 4, text: "Finalize budget allocation for Q4", owner: "David L.", done: false },
];

export default function MeetingInsights() {
  const [actionItems, setActionItems] = useState(initialActionItems);

  const toggleItem = (id: number) => {
    setActionItems(prev => prev.map(item => 
      item.id === id ? { ...item, done: !item.done } : item
    ));
  };

  const progress = useMemo(() => {
     const doneCount = actionItems.filter(i => i.done).length;
     return Math.round((doneCount / actionItems.length) * 100);
  }, [actionItems]);

  return (
    <div className="space-y-10 lg:space-y-12">
      
      {/* Header & Meta (Standard Lumina Style) */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/5 pb-8">
        <div className="space-y-4">
          <Link href="/meetings" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
             <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Return to Feed</span>
          </Link>
          <div className="space-y-2">
             <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-primary/20 text-primary border border-primary/20 rounded-full text-[9px] font-black tracking-widest uppercase shadow-neon">Synthesis Complete</span>
             </div>
             <h1 className="font-outfit text-4xl lg:text-5xl font-black text-white tracking-tighter leading-tight">Q4 Product Strategy & Roadmap Sync</h1>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground text-xs font-bold uppercase tracking-widest opacity-60">
             <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> Oct 24, 2023</span>
             <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> 45 mins</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-white transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest">
              <Share2 size={16} />
              Share
           </button>
           <button className="px-6 py-3 rounded-xl bg-primary text-black font-black text-xs uppercase tracking-widest shadow-neon hover:scale-105 active:scale-95 transition-all">
              Export PDF
           </button>
        </div>
      </section>

      {/* Main Analysis Content - 2-Column Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
         
         {/* Left Side: Summary & Topics */}
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
                  <p className="text-muted-foreground leading-relaxed text-lg lg:text-xl font-medium">
                     The team focused on streamlining the Q4 roadmap, specifically prioritizing the <span className="text-primary font-black">Intelligence Layer</span> over minor UI tweaks. Alex raised concerns about the API latency, which was addressed by proposing a new caching layer. Key outcomes include shifting the beta launch to <span className="text-white underline decoration-primary decoration-2 underline-offset-4">Nov 15th</span> to ensure stability.
                  </p>
               </div>
            </section>

            {/* Main Topics Hub */}
            <section className="space-y-6">
               <h3 className="font-outfit font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest opacity-40">
                  <Tag className="w-5 h-5 text-primary" />
                  Contextual Topics
               </h3>
               <div className="flex flex-wrap gap-3">
                  {["Roadmap 2024", "API Performance", "UI/UX Design", "Q4 Budget", "User Retention"].map((topic, i) => (
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

            {/* Key Decisions Grid */}
            <section className="space-y-6">
               <h3 className="font-outfit font-black text-xl text-white flex items-center gap-3 uppercase tracking-widest opacity-40">
                  <Gavel className="w-5 h-5 text-primary" />
                  Key Decisions
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all space-y-4 group">
                     <span className="text-primary font-black text-[9px] tracking-[0.4em] uppercase opacity-40">Decision 01</span>
                     <p className="font-outfit font-bold text-xl text-white leading-tight group-hover:text-primary transition-colors">Beta release date moved to November 15th for stability.</p>
                  </div>
                  <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/20 transition-all space-y-4 group">
                     <span className="text-primary font-black text-[9px] tracking-[0.4em] uppercase opacity-40">Decision 02</span>
                     <p className="font-outfit font-bold text-xl text-white leading-tight group-hover:text-primary transition-colors">Allocated $15k additional budget for infrastructure scaling.</p>
                  </div>
               </div>
            </section>
         </div>

         {/* Right Side: Interactive Checklist & Progress */}
         <aside className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="bg-background border border-white/10 rounded-[3rem] p-8 lg:p-10 space-y-8 shadow-2xl overflow-hidden relative">
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

               <div className="space-y-2">
                  <AnimatePresence>
                    {actionItems.map((item) => (
                      <motion.div 
                        key={item.id}
                        layout
                        className={cn(
                           "flex items-start gap-5 p-6 rounded-[2rem] border transition-all cursor-pointer group",
                           item.done ? "bg-primary/5 border-primary/20 opacity-60" : "bg-white/5 border-transparent hover:border-white/10"
                        )}
                        onClick={() => toggleItem(item.id)}
                      >
                        <div className={cn(
                           "mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                           item.done ? "bg-primary border-primary" : "border-white/10 group-hover:border-primary/40"
                        )}>
                           {item.done && <CheckCircle2 size={16} className="text-black fill-current" />}
                        </div>
                        <div className="space-y-1">
                           <p className={cn(
                              "text-base font-bold leading-tight transition-all",
                              item.done ? "text-white/40 line-through" : "text-white"
                           )}>
                              {item.text}
                           </p>
                           <span className={cn(
                              "text-[10px] font-black uppercase tracking-widest mt-1 block",
                              item.done ? "text-primary/30" : "text-primary/60"
                           )}>
                              Owner: {item.owner}
                           </span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
               </div>

               <div className="pt-6 border-t border-white/5 flex flex-col gap-4">
                  <button className="w-full bg-white/5 border border-white/10 text-white font-black py-5 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                     <User size={16} />
                     Assign to Task Manager
                  </button>
               </div>
            </div>

            {/* AI Contextual Prediction */}
            <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 space-y-4">
               <h4 className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2">
                  <Tag size={14} className="fill-current" />
                  AI RISK ASSESSMENT
               </h4>
               <p className="text-muted-foreground text-sm leading-relaxed">
                  Historical data suggests that moving the beta launch to Nov 15th may impact the holiday marketing cycle. Recommend early outreach to VIP partners.
               </p>
               <button className="text-primary font-black text-[10px] uppercase tracking-widest flex items-center gap-1 group">
                  Assess Cycle Impact <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </div>
         </aside>

      </div>

    </div>
  );
}
