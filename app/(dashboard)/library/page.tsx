"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Search, Calendar, Clock, Sparkles, Mic, Brain, Video, ArrowRight, FolderArchive, ArrowUpRight, BarChart2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

const filters = ["All", "Product", "Client", "Design", "Brainstorm"];

export default function MeetingLibrary() {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/meetings');
        const data = await res.json();
        if (Array.isArray(data)) {
          setMeetings(data);
        }
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const filteredMeetings = useMemo(() => {
    return meetings.filter((meeting) => {
      const type = meeting.type || "Product";
      const matchesFilter = activeFilter === "All" || type.includes(activeFilter);
      const matchesSearch = 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (meeting.summary && meeting.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [meetings, activeFilter, searchTerm]);

  // Helper to get icon based on type
  const getIcon = (type: string) => {
    switch (type) {
      case 'Design': return Brain;
      case 'Client': return Video;
      case 'Brainstorm': return Sparkles;
      default: return Mic;
    }
  };

  return (
    <div className="space-y-10">
      {/* Search & Header Section */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-2">
        <div className="space-y-4">
          <p className="font-outfit text-primary font-bold text-[10px] tracking-[0.4em] uppercase opacity-60">Intelligence Vault</p>
          <h1 className="font-outfit text-5xl font-black text-white tracking-tighter leading-tight">Your Archive</h1>
        </div>
        
        <div className="relative group w-full lg:max-w-md">
           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40 group-focus-within:text-primary transition-colors" />
           <input 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-white/5 border border-white/10 rounded-full py-4 pl-12 pr-6 text-white focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all placeholder:text-muted-foreground/30 text-base shadow-sm" 
             placeholder="Search transcripts or summaries..." 
             type="text"
           />
        </div>
      </section>

      {/* Filter Chips */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-hide no-scrollbar -mx-6 px-6">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shrink-0">
           <Filter size={16} className="text-primary/60" />
        </div>
        {filters.map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={cn(
               "whitespace-nowrap px-8 py-3 rounded-full font-bold text-xs tracking-widest transition-all uppercase",
               activeFilter === filter 
                  ? "bg-primary text-black shadow-neon" 
                  : "bg-white/5 text-muted-foreground border border-transparent hover:border-white/10 hover:text-white"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Meeting Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
         
         <AnimatePresence mode="popLayout">
            {isLoading ? (
               <div className="lg:col-span-12 py-32 text-center animate-pulse">
                  <p className="text-primary font-black tracking-widest uppercase text-xs">Accessing Encrypted Vault...</p>
               </div>
            ) : filteredMeetings.map((meeting, i) => {
               const Icon = getIcon(meeting.type || 'Product');
               const isFeatured = i === 0 && activeFilter === 'All' && searchTerm === "";

               return (
                <Link key={meeting.id} href={`/meetings/${meeting.id}`} className={cn(
                  "group cursor-pointer transition-all duration-300",
                  isFeatured
                     ? "lg:col-span-12" 
                     : "lg:col-span-6"
                )}>
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={cn(
                       "h-full flex flex-col justify-between",
                       isFeatured
                          ? "bg-white/5 rounded-[3rem] p-8 lg:p-12 border border-white/10 relative overflow-hidden min-h-[420px] shadow-lg" 
                          : "bg-white/5 rounded-[2.5rem] p-8 border border-white/5 hover:border-primary/20 min-h-[300px] shadow-sm hover:shadow-xl"
                    )}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 right-0 p-8">
                         <span className="bg-primary text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-neon flex items-center gap-2">
                            <Sparkles className="w-3.5 h-3.5 fill-current" />
                            Latest Insight
                         </span>
                      </div>
                    )}

                    <div className="space-y-6">
                       <div className="flex items-center gap-2 text-primary font-black text-[9px] tracking-widest uppercase opacity-40 group-hover:opacity-100 transition-opacity">
                          <Calendar size={14} />
                          {new Date(meeting.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · {meeting.duration || '0m'}
                       </div>
                       <div className="space-y-3">
                          <h3 className={cn(
                              "font-outfit font-black text-white group-hover:text-primary transition-colors leading-[1.1] tracking-tighter",
                              isFeatured ? "text-4xl lg:text-5xl" : "text-2xl"
                          )}>
                             {meeting.title}
                          </h3>
                          <p className={cn(
                              "text-muted-foreground leading-relaxed",
                              isFeatured ? "text-lg lg:text-xl max-w-2xl" : "text-sm line-clamp-2"
                          )}>
                             {meeting.summary || "Transcript processed. AI Summary pending..."}
                          </p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-white/5 mt-4">
                       <div className="flex items-center -space-x-3">
                          <div className="w-10 h-10 rounded-full border-4 border-[#080808] bg-white/10 flex items-center justify-center text-primary/40">
                              <Icon size={18} />
                          </div>
                       </div>

                       <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-primary/30 uppercase tracking-widest group-hover:text-primary transition-colors">
                             {meeting.actionItems?.length || 0} Action Items
                          </span>
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary transition-colors">
                              <ArrowUpRight size={18} className="text-white/20 group-hover:text-black transition-colors" />
                          </div>
                       </div>
                    </div>
                  </motion.div>
                </Link>
               );
            })}
         </AnimatePresence>

         {!isLoading && filteredMeetings.length === 0 && (
            <div className="lg:col-span-12 py-32 text-center space-y-4">
               <div className="w-20 h-20 bg-white/5 border border-dashed border-white/10 rounded-3xl mx-auto flex items-center justify-center text-muted-foreground/20">
                  <Search size={32} />
               </div>
               <p className="text-white/30 font-bold tracking-widest uppercase text-sm">No matches in your vault</p>
            </div>
         )}
      </div>

      {/* Simplified Footer */}
      <section className="pt-12 flex justify-center">
         <button className="px-10 py-5 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary hover:text-black hover:border-primary shadow-premium transition-all">
            Securely Load More Archive
         </button>
      </section>

    </div>
  );
}
