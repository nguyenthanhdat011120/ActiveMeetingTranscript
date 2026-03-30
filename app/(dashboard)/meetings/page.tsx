"use client";

import { motion } from "framer-motion";
import { Mic, Calendar, Clock, Sparkles, TrendingUp, Lightbulb, UserCheck, ArrowUpRight, Plus, Users, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

// Static data for fallback or loading state
const initialUpcomingMeetings = [
    {
        id: "loading-1",
        title: "Scanning Schedule...",
        time: "--:--",
        duration: "0m",
        attendees: [],
        active: false
    }
];

export default function MeetingsDashboard() {
  const supabase = createClient();
  const [userName, setUserName] = useState("Commander");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Set dynamic date
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

    const fetchInitialData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch User Info
        const { data: profile } = await supabase
          .from('Profile')
          .select('fullName')
          .eq('id', user.id)
          .single();
        
        if (profile?.fullName) {
          setUserName(profile.fullName.split(' ')[0]);
        }

        // Fetch Meetings
        try {
           const res = await fetch('/api/meetings');
           const data = await res.json();
           if (Array.isArray(data)) {
              setMeetings(data);
           }
        } catch (err) {
           console.error('Error fetching data:', err);
        } finally {
           setIsLoading(false);
        }
      }
    };
    fetchInitialData();
  }, [supabase]);

  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="space-y-12">
      
      {/* 2-Column Hero & Upcoming Grid (Standard sizes) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Side: Greeting & Small CTA */}
        <section className="lg:col-span-12 xl:col-span-7 space-y-8 pr-0 lg:pr-12">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
               <motion.span 
                 animate={{ opacity: [1, 0.4, 1] }} 
                 transition={{ repeat: Infinity, duration: 2 }} 
                 className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#84FF33]" 
               />
               <span className="text-primary font-outfit font-black text-[10px] tracking-widest uppercase opacity-70">Live Session Status: Idle</span>
            </div>
            {/* Reduced from text-8xl to text-5xl-6xl for professionalism */}
            <h1 className="text-white font-outfit font-black text-5xl lg:text-6xl tracking-tight leading-[1.1]">
               Good Morning, {userName}
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl font-medium max-w-lg leading-relaxed">
               Ready to curate your professional journey? Start a recording or import a file to begin.
            </p>
          </motion.div>

          {/* Record CTA Block - More compact padding */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Link href="/record">
                <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-black flex flex-col items-center justify-center gap-4 py-8 rounded-[2rem] shadow-neon group relative overflow-hidden"
                >
                    {/* Background icon removed as per user request */}
                    <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center shrink-0">
                       <Mic className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="font-outfit font-black text-xl lg:text-2xl uppercase tracking-tighter">Start Recording</span>
                </motion.button>
             </Link>
             
             <button className="w-full bg-white/5 border border-white/5 flex flex-col items-center justify-center gap-4 py-8 rounded-[2rem] transition-all hover:bg-white/10 hover:border-white/20 group">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                   <Plus className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
                </div>
                <span className="font-outfit font-bold text-lg text-white/50 tracking-tight group-hover:text-white transition-all uppercase">Import Archive</span>
             </button>
          </div>
        </section>

        {/* Right Side: Upcoming Schedule (Clean list) */}
        <section className="lg:col-span-12 xl:col-span-5 space-y-6">
           <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <h2 className="text-white font-outfit font-bold text-xl lg:text-2xl tracking-tight">Today&apos;s Schedule</h2>
              <div className="flex items-center gap-2 group cursor-pointer">
                 <Calendar className="w-4 h-4 text-primary opacity-50 group-hover:opacity-100 transition-opacity" />
                 <span className="text-primary font-outfit font-black text-[10px] tracking-widest uppercase border-b border-primary/20 hover:border-primary transition-all pb-0.5">May 28</span>
              </div>
           </div>

           <div className="space-y-4">
              {isLoading ? (
                <LoadingState type="skeleton" className="py-12" />
              ) : meetings.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground text-xs font-black uppercase tracking-widest bg-white/5 rounded-3xl border border-white/5">
                   No sessions archived yet.
                </div>
              ) : (
                meetings.map((meeting, i) => (
                  <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="block">
                    <motion.div 
                      key={meeting.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + (i * 0.1) }}
                      className={cn(
                        "p-6 rounded-[2rem] border transition-all duration-300 group cursor-pointer relative overflow-hidden",
                        meeting.status === 'Live' 
                            ? "glass-card border-primary/20 bg-primary/5 shadow-lg" 
                            : "bg-white/[0.03] border-white/10 hover:border-primary/40 hover:bg-white/[0.06] shadow-sm"
                      )}
                    >
                      <div className="flex justify-between items-center gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3 text-primary font-black text-[10px] tracking-widest uppercase opacity-60">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(meeting.date).toLocaleDateString()} · {meeting.duration || '0m'}
                            </div>
                            <h3 className="text-white font-outfit font-bold text-lg lg:text-xl group-hover:text-primary transition-colors">{meeting.title}</h3>
                          </div>
                          
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors shrink-0">
                            <ArrowUpRight className="w-5 h-5 text-white/20 group-hover:text-black transition-all" />
                          </div>
                      </div>
                    </motion.div>
                  </Link>
                ))
              )}
           </div>
        </section>

      </div>

      {/* 3-Column Recent Activity Section - Compact Height */}
      <section className="space-y-8 pt-12 border-t border-white/5">
         <div className="flex items-center gap-4">
            <h2 className="text-white font-outfit font-bold text-2xl lg:text-3xl tracking-tight">Recent Activity</h2>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-1.5">
               <Sparkles className="w-3.5 h-3.5 text-primary fill-current shadow-neon" />
               <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Curated by AI</span>
            </div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {meetings.slice(0, 3).map((summary, i) => (
               <Link key={summary.id} href={`/meetings/${summary.id}`}>
                 <motion.div 
                   key={summary.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.5 + (i * 0.1) }}
                   className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-primary/20 group cursor-pointer transition-all duration-300 flex flex-col justify-between h-[280px] hover:-translate-y-1 shadow-md hover:shadow-xl"
                 >
                    <div className="space-y-6">
                       <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors shadow-inner">
                          <TrendingUp className="w-6 h-6 text-primary group-hover:text-black transition-colors" />
                       </div>
                       <div className="space-y-2">
                          <h4 className="text-white font-outfit font-bold text-xl group-hover:text-primary transition-colors leading-tight tracking-tight">{summary.title}</h4>
                          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed opacity-60 group-hover:opacity-100 transition-opacity">{summary.summary || 'Summary pending...'}</p>
                       </div>
                    </div>
                    <div className="flex items-center justify-between pt-5 border-t border-white/5">
                       <span className="text-[10px] font-black text-primary/30 group-hover:text-primary/60 uppercase tracking-widest font-outfit transition-colors">{new Date(summary.date).toLocaleDateString()}</span>
                       <PlayCircle className="w-5 h-5 text-white/5 group-hover:text-primary transition-all" />
                    </div>
                 </motion.div>
               </Link>
            ))}
         </div>
         
         <div className="flex justify-center pt-8">
            <Link href="/library">
               <button className="px-10 py-4 rounded-full border border-white/5 bg-white/5 text-white/40 font-outfit font-black uppercase tracking-widest text-[10px] hover:bg-white/10 hover:border-primary/20 hover:text-white transition-all shadow-premium">
                  View Interaction Archive
               </button>
            </Link>
         </div>
      </section>

    </div>
  );
}
