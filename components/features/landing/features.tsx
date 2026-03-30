"use client";

import { motion } from "framer-motion";

export const FeaturesSection = () => {
    return (
        <section id="features" className="px-6 py-20 lg:py-32 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-24 px-4">
                    <h2 className="text-4xl lg:text-7xl font-outfit font-bold tracking-tighter mb-6 text-white leading-[0.9]">Capture Every Conversation. <br /><span className="text-primary italic">From Anywhere.</span></h2>
                    <p className="text-slate-400 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">Bot or No-bot — WorkFlowLoop adapts to any meeting setup with full control and zero vendor lock-in.</p>
                </div>

                {/* Two Column Bento (MeetGeek Main Sections) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Meeting Agent Copilot */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="group relative h-[480px] lg:h-[520px] rounded-3xl overflow-hidden glass-card border border-white/5 p-10 flex flex-col justify-between shadow-premium hover:border-primary/50 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[96px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/40 transition-colors" />
                        
                        <div className="relative z-10">
                            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/20 text-[10px] uppercase font-bold tracking-widest mb-6 inline-block">Bot-Driven Intelligence</span>
                            <h3 className="text-3xl lg:text-4xl font-bold font-outfit text-white mb-4 leading-tight">Meeting Agent Copilot</h3>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-md">Your AI meeting agent joins automatically, records, transcribes, and summarizes every call — no setup needed.</p>
                        </div>

                        <div className="relative z-10 w-full h-[200px] bg-black/40 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                             {/* Fake Dashboard Layout */}
                             <div className="p-4 flex gap-4">
                                <div className="w-12 h-12 rounded-full kinetic-gradient glow-neon flex items-center justify-center font-bold text-black shadow-lg">R</div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 w-3/4 bg-white/20 rounded-full animate-pulse" />
                                    <div className="h-3 w-1/2 bg-white/10 rounded-full animate-pulse" />
                                </div>
                             </div>
                             <div className="px-4 py-2 space-y-2">
                                <div className="h-3 w-full bg-white/5 rounded-full" />
                                <div className="h-3 w-5/6 bg-white/5 rounded-full" />
                                <div className="h-3 w-2/3 bg-white/5 rounded-full text-primary font-bold">● Summary extracting...</div>
                             </div>
                        </div>
                    </motion.div>

                    {/* Mobile App */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="group relative h-[480px] lg:h-[520px] rounded-3xl overflow-hidden glass-card border border-white/5 p-10 flex flex-col justify-between shadow-premium hover:border-primary/50 transition-all duration-500"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[96px] -translate-y-1/2 translate-x-1/2" />
                        
                        <div className="relative z-10">
                            <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/10 text-[10px] uppercase font-bold tracking-widest mb-6 inline-block">Offline & Mobile</span>
                            <h3 className="text-3xl lg:text-4xl font-bold font-outfit text-white mb-4 leading-tight">Native Mobile Apps</h3>
                            <p className="text-slate-400 text-lg leading-relaxed max-w-md">Record in-person conversations, calls, or interviews directly from your phone — and access results instantly.</p>
                        </div>

                        <div className="relative z-10 flex justify-center">
                             <div className="w-[180px] h-[240px] bg-black/80 rounded-t-3xl border-t border-x border-white/20 p-4 shadow-glass">
                                <div className="w-full h-2 bg-white/10 rounded-full mb-4" />
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="aspect-square bg-white/5 rounded-xl" />
                                    <div className="aspect-square bg-white/5 rounded-xl" />
                                    <div className="col-span-2 h-10 kinetic-gradient rounded-xl" />
                                </div>
                             </div>
                        </div>
                    </motion.div>
                </div>

                {/* Three Column Features Grid Below */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    {[
                        { title: "One-Click Sync", desc: "Automate your workflow: Send summaries directly to Slack, Notion, or Trello.", tag: "Connect" },
                        { title: "Deep Semantic Search", desc: "Instantly find key decisions across months of meetings with AI search.", tag: "Search" },
                        { title: "Team Accountability", desc: "Track tasks and due dates extracted from conversations in a shared view.", tag: "Manage" }
                    ].map((item, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                            className="p-8 rounded-3xl glass-card border border-white/5 shadow-premium hover:border-primary/50 transition-all duration-300 group"
                        >
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">{item.tag}</span>
                            <h4 className="text-xl font-bold font-outfit text-white mb-3">{item.title}</h4>
                            <p className="text-slate-400 leading-relaxed text-sm lg:text-base">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
