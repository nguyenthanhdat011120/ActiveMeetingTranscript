import { motion } from "framer-motion";
import Link from "next/link";

export const HeroSection = () => {
    return (
        <section id="hero" className="relative pt-24 pb-32 flex flex-col items-center text-center overflow-hidden">
            {/* High-end Neon Glow Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

            <div className="container max-w-6xl mx-auto px-6 flex flex-col items-center">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-bold text-primary mb-10 glow-neon"
                >
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    Trusted by 30,000+ teams worldwide
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-6xl lg:text-9xl font-outfit font-bold tracking-tighter mb-8 leading-[0.85] text-white"
                >
                    Capture Every <br />
                    <span className="text-primary italic">Conversation</span>.
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-slate-400 text-lg lg:text-2xl max-w-3xl mb-12 leading-relaxed"
                >
                    WorkFlowLoop adapts to any meeting setup with full control and zero vendor lock-in. Real-time transcription, insights, and zero friction.
                </motion.p>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-6 items-center"
                >
                    <Link href="/signup" className="h-16 px-12 rounded-2xl kinetic-gradient shadow-premium glow-neon font-bold text-xl text-black active:scale-95 transition-all text-center flex items-center justify-center">
                        Start for Free
                    </Link>
                    <button className="h-16 px-12 rounded-2xl border border-white/10 glass-card font-bold text-xl text-white hover:bg-white/5 transition-all">
                        Request a demo
                    </button>
                </motion.div>

                {/* Logo Wall (MeetGeek Style) */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-24 w-full"
                >
                    <p className="text-slate-500 text-sm font-semibold mb-10 uppercase tracking-widest">Integrating with your stack</p>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 items-center">
                        {['Zoom', 'Meet', 'Teams', 'Slack', 'Notion', 'Jira'].map((logo) => (
                            <div key={logo} className="font-outfit font-black text-2xl text-white tracking-tighter">
                                {logo}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
