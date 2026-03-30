"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, Sparkles, Brain, LayoutDashboard, ArrowRight, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function MeetingInsightsList() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/meetings');
        const data = await res.json();
        // Filter only meetings that have summaries or allow all but prioritize summarized
        if (Array.isArray(data)) {
          setMeetings(data);
        }
      } catch (error) {
        console.error('Error fetching meetings for insights:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const summarizedMeetings = meetings.filter(m => m.summary);
  const pendingMeetings = meetings.filter(m => !m.summary);

  if (isLoading) return <LoadingState type="page" message="Scanning Intelligence Vault" />;

  return (
    <div className="space-y-10">
      {/* Header */}
      <section className="space-y-4">
        <p className="font-outfit text-primary font-bold text-[10px] tracking-[0.4em] uppercase opacity-60">Intelligence Hub</p>
        <h1 className="font-outfit text-5xl font-black text-white tracking-tighter leading-tight">Meeting Insights</h1>
      </section>

      {/* Stats Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-40">Intelligence Score</p>
            <p className="text-4xl font-black text-white font-outfit">84<span className="text-primary text-xl">.2</span></p>
         </div>
         <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-40">Summarized Vault</p>
            <p className="text-4xl font-black text-white font-outfit">{summarizedMeetings.length}</p>
         </div>
         <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-2">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-40">Pending Analysis</p>
            <p className="text-4xl font-black text-white font-outfit">{pendingMeetings.length}</p>
         </div>
      </div>

      {/* Content Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Main List of Analyzed Meetings */}
         <div className="xl:col-span-8 space-y-8">
            <h2 className="text-white font-outfit font-black text-xl uppercase tracking-widest flex items-center gap-3">
               <Sparkles className="w-5 h-5 text-primary fill-current" />
               Latest Executive Recaps
            </h2>

            {summarizedMeetings.length > 0 ? (
               <div className="space-y-4">
                  {summarizedMeetings.map((meeting) => (
                      <Link key={meeting.id} href={`/insights/${meeting.id}`}>
                         <motion.div 
                            whileHover={{ x: 10 }}
                            className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 hover:border-primary/30 transition-all flex items-center justify-between group"
                         >
                            <div className="space-y-3 flex-1 pr-10">
                               <div className="flex items-center gap-3 text-primary text-[9px] font-black uppercase tracking-widest opacity-40">
                                  <Calendar size={12} />
                                  {new Date(meeting.date).toLocaleDateString()}
                                  <span>·</span>
                                  <Clock size={12} />
                                  {meeting.duration || '0m'}
                               </div>
                               <h3 className="text-white font-outfit font-bold text-2xl group-hover:text-primary transition-colors">{meeting.title}</h3>
                               <p className="text-muted-foreground text-sm line-clamp-2 max-w-2xl">{meeting.summary}</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-all">
                               <ArrowRight className="text-white group-hover:text-black transition-colors" />
                            </div>
                         </motion.div>
                      </Link>
                  ))}
               </div>
            ) : (
                <div className="py-20 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem] space-y-6">
                   <Brain size={60} className="mx-auto text-primary/10" />
                   <div className="space-y-2">
                      <p className="text-white font-bold opacity-30 uppercase tracking-widest text-sm">No intelligence extracted yet</p>
                      <p className="text-muted-foreground/30 text-xs px-10 max-w-md mx-auto">
                        Go to your Library and trigger "AI Deep-Scan" on any meeting to generate executive summaries and action items.
                      </p>
                   </div>
                   <Link href="/library" className="inline-block px-10 py-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest rounded-full shadow-neon hover:scale-105 transition-all">
                      Go to Library
                   </Link>
                </div>
            )}
         </div>

         {/* Sidebar for Pending Items */}
         <div className="xl:col-span-4 space-y-8">
            <h3 className="text-white/40 font-black text-[10px] uppercase tracking-[0.4em] px-4">Waitlist for Analysis</h3>
            <div className="space-y-3">
               {pendingMeetings.map((meeting) => (
                   <Link key={meeting.id} href={`/insights/${meeting.id}`}>
                      <div className="p-6 bg-white/5 border border-white/5 rounded-[2rem] hover:bg-white/10 transition-all cursor-pointer group">
                        <p className="text-white font-bold text-sm group-hover:text-primary transition-colors">{meeting.title}</p>
                        <div className="flex items-center gap-2 mt-2 text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">
                            <Clock size={10} />
                            Ready for Processing
                        </div>
                      </div>
                   </Link>
               ))}
               {pendingMeetings.length === 0 && meetings.length > 0 && (
                   <div className="p-10 text-center border border-white/5 rounded-[2rem] opacity-20 italic text-xs">
                      All meetings summarized.
                   </div>
               )}
            </div>
         </div>

      </div>
    </div>
  );
}
