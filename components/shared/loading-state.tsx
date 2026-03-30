"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

interface LoadingStateProps {
  type?: 'fullscreen' | 'skeleton' | 'inline' | 'page';
  message?: string;
  className?: string;
}

export function LoadingState({ type = 'page', message, className }: LoadingStateProps) {
  
  if (type === 'fullscreen' || type === 'page') {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center min-h-[40vh] w-full space-y-8",
        type === 'fullscreen' && "fixed inset-0 z-[200] bg-background/80 backdrop-blur-2xl px-6",
        className
      )}>
        <div className="relative">
          {/* Animated Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 rounded-full border-t-2 border-primary/20 border-r-2 border-primary/40"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 w-24 h-24 rounded-full border-b-2 border-secondary/20 border-l-2 border-secondary/40"
          />
          
          {/* Core Logo/Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-neon"
            >
              <Sparkles className="text-primary w-6 h-6" />
            </motion.div>
          </div>
        </div>

        <div className="space-y-2 text-center">
          <p className="font-outfit font-black text-xs uppercase tracking-[0.4em] text-primary animate-pulse">
            {message || "Synchronizing Intelligence"}
          </p>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/20">
            Accessing System Vault
          </p>
        </div>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={cn("space-y-4 w-full", className)}>
        <div className="h-12 w-3/4 bg-white/5 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 bg-white/5 rounded-[2rem] animate-pulse" />
          <div className="h-40 bg-white/5 rounded-[2rem] animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/5 rounded-full animate-pulse" />
          <div className="h-4 w-5/6 bg-white/5 rounded-full animate-pulse" />
          <div className="h-4 w-4/6 bg-white/5 rounded-full animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3 text-primary", className)}>
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-[10px] font-black uppercase tracking-widest">{message || "Working..."}</span>
    </div>
  );
}
