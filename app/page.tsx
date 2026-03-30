"use client";

import { HeroSection } from "@/components/features/landing/hero";
import { FeaturesSection } from "@/components/features/landing/features";
import { HowItWorksSection } from "@/components/features/landing/how-it-works";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden">
      {/* Navigation (Sticky Header) */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/assets/images/logo.png" alt="Logo" className="w-8 h-8 object-cover rounded-full border border-white/10" />
            <span className="font-outfit font-black text-xs leading-none text-white tracking-widest hidden sm:inline-block">ACTIVE MEETING<br/>TRANSCRIPT</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Workflow</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold hidden sm:inline-block text-white hover:text-primary transition-colors">Log in</Link>
            <Link href="/signup" className="h-10 px-5 rounded-xl kinetic-gradient shadow-premium glow-neon font-bold text-sm text-black flex items-center justify-center">Start Free</Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />

        {/* Use Cases Section (Simplified for MVP) */}
        <section className="px-6 py-20 lg:py-32 bg-card/20 relative">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl lg:text-5xl font-outfit font-bold tracking-tight mb-8 text-white border-b-4 border-primary/20 inline-block pb-2">Built for Remote Teams.</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {['Standups', 'Sprint Planning', 'Retrospectives', '1:1 Meetings', 'Global Syncs', 'Product Strategy'].map((tag) => (
                <span key={tag} className="px-5 py-2 glass-card rounded-full font-semibold shadow-premium text-white/90 border border-white/10 hover:border-primary/50 transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section (Bottom) */}
        <section className="px-6 py-24 bg-primary text-black text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[96px] -translate-y-1/2 translate-x-1/2" />
             <div className="max-w-3xl mx-auto relative z-10">
                <h2 className="text-3xl lg:text-6xl font-outfit font-bold tracking-tight mb-6">Start your <span className="underline decoration-black/40 underline-offset-8">Accountability Loop</span> today.</h2>
                <p className="text-black/80 text-lg lg:text-2xl mb-12">No more lost decisions. No more forgotten tasks.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/signup" className="h-16 px-10 rounded-2xl bg-black text-primary font-bold text-xl shadow-premium active:scale-95 transition-transform flex items-center justify-center">
                        Get Started Free
                    </Link>
                    <button className="h-16 px-10 rounded-2xl border-2 border-black text-black font-bold text-xl hover:bg-black/10 transition-colors">
                        Book demo
                    </button>
                </div>
             </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-12 border-t bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
             <div className="flex items-center gap-3">
                <img src="/assets/images/logo.png" alt="Logo" className="w-8 h-8 object-cover rounded-full border border-white/10" />
                <span className="font-outfit font-black text-xs leading-none text-white tracking-widest">ACTIVE MEETING<br/>TRANSCRIPT</span>
             </div>
             <p className="text-muted-foreground text-sm max-w-xs text-center md:text-left">The premium intelligence layer for high-performance internal remote teams.</p>
          </div>
          
          <div className="flex gap-8 text-sm font-semibold">
              <span className="text-muted-foreground">© 2026 ACTIVE MEETING TRANSCRIPT</span>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Status</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
