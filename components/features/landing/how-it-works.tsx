"use client";

import { motion } from "framer-motion";

const steps = [
    {
        title: "Record",
        description: "Connect your calendar context or simply start recording from your phone or browser in one touch.",
        icon: "🎙️",
        tag: "Input"
    },
    {
        title: "Transcribe",
        description: "Our AI engine distills the meeting in real-time, extracting highlights, decisions, and action items instantly.",
        icon: "🧠",
        tag: "Processing"
    },
    {
        title: "Share",
        description: "Decisions and tasks are pushed to Slack, Notion, or Jira. No manual follow-up required — ever.",
        icon: "🚀",
        tag: "Output"
    }
];

export const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="px-6 py-20 lg:py-32 bg-background relative overflow-hidden">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-24">
                    <h2 className="text-4xl lg:text-7xl font-outfit font-bold tracking-tighter mb-6 text-white leading-none">Your Loop <span className="text-primary italic">Automated</span>.</h2>
                    <p className="text-slate-400 text-lg lg:text-xl max-w-xl mx-auto leading-relaxed">From audio capture to completed task – automatically.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                    {/* Animated Connector Line (Desktop only) */}
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 hidden md:block" />

                    {steps.map((step, index) => (
                        <motion.div 
                            key={index} 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex flex-col items-center text-center relative z-10 group"
                        >
                            <div className="w-24 h-24 rounded-3xl glass-card border border-white/5 flex items-center justify-center text-4xl mb-8 shadow-premium group-hover:scale-110 group-hover:border-primary/50 transition-all duration-500">
                                {step.icon}
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">{step.tag}</span>
                            <h3 className="text-2xl font-bold font-outfit mb-4 text-white">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm lg:text-base px-4">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
