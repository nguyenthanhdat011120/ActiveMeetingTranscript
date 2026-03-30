"use client";

import { motion } from "framer-motion";
import { Mic, ArrowRight, ShieldCheck, Mail, Lock, User, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
    } else {
      // Successfully signed up, check if email confirmation is required
      if (data.session) {
         window.location.href = "/meetings";
      } else {
         window.location.href = "/login?message=Check your email to confirm your account";
      }
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center space-y-4">
           <div className="w-16 h-16 bg-black rounded-full mx-auto flex items-center justify-center shadow-neon overflow-hidden border border-white/10">
              <img src="/assets/images/logo.png" alt="Logo" className="w-full h-full object-cover p-1" />
           </div>
           <div className="space-y-1">
              <h1 className="text-white font-outfit font-black text-4xl tracking-tighter">Enter the Vortex</h1>
              <p className="text-muted-foreground text-sm font-medium">Provision your new AI-powered vault</p>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
           
           <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-4">Full Identity</label>
                 <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                       value={fullName}
                       onChange={(e) => setFullName(e.target.value)}
                       className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/20" 
                       placeholder="Commander Sarah Chen" 
                       type="text" 
                       required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-4">Authorized Email</label>
                 <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/20" 
                       placeholder="vault@workflowloop.ai" 
                       type="email" 
                       required
                    />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-4">Security Phrase</label>
                 <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input 
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/20" 
                       placeholder="Create your passkey..." 
                       type="password" 
                       required
                    />
                 </div>
              </div>

              <button 
                disabled={isLoading}
                className={cn(
                   "w-full bg-primary text-black font-black py-5 rounded-2xl text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-2 transform transition-all active:scale-95 shadow-neon",
                   isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"
                )}
              >
                 {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                 ) : (
                    <>
                       Secure Registration <ArrowRight size={16} />
                    </>
                 )}
              </button>
           </form>
           
           <div className="text-center pt-2">
              <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                 Existing clearance found? <Link href="/login" className="text-primary hover:underline underline-offset-4 ml-1">Connect to vault</Link>
              </p>
           </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-muted-foreground/20">
           <ShieldCheck size={16} />
           <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Vault Protection: Active</span>
        </div>

      </motion.div>
    </div>
  );
}
