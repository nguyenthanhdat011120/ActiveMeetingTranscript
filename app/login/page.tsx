"use client";

import { motion } from "framer-motion";
import { Mic, ArrowRight, ShieldCheck, Hexagon, Smartphone, Lock, Mail, AlertTriangle, CheckCircle2, ShieldAlert, Fingerprint } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Alert, AlertTitle, AlertDescription, AlertIcon } from "@/components/ui/alert";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const msg = searchParams.get("message");
    if (msg) setMessage(msg);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);
    
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
    } else {
      setMessage("Access Granted: Redirecting to your workspace...");
      setIsLoading(false);
      
      // Delay slightly to show the success message and ensure cookies are set
      setTimeout(() => {
        window.location.href = "/meetings";
      }, 800);
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
              <p className="text-muted-foreground text-sm font-medium">Continue to your AI Curation workspace</p>
           </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-10 rounded-[3rem] shadow-2xl space-y-8">
           
           {/* Message/Error Alerts */}
           {(error || message) && (
              <div className="space-y-4">
                 {error && (
                    <Alert variant="destructive">
                       <AlertIcon>
                          <ShieldAlert className="w-5 h-5 text-red-500" />
                       </AlertIcon>
                       <div className="flex flex-col">
                          <AlertTitle className="text-red-500">Access Denied</AlertTitle>
                          <AlertDescription>{error}</AlertDescription>
                       </div>
                    </Alert>
                 )}
                 {message && (
                    <Alert variant="vortex">
                       <AlertIcon showPing>
                          <Fingerprint className="w-5 h-5 text-primary" />
                       </AlertIcon>
                       <div className="flex flex-col">
                          <AlertTitle>System Intel</AlertTitle>
                          <AlertDescription>{message}</AlertDescription>
                       </div>
                    </Alert>
                 )}
              </div>
           )}

           {/* Social Logins */}
           <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all group">
                 <Hexagon size={20} className="text-white/40 group-hover:text-white transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">Github</span>
              </button>
              <button className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 hover:bg-white/10 transition-all group">
                 <Smartphone size={20} className="text-white/40 group-hover:text-white transition-colors" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-white">Apple</span>
              </button>
           </div>

           <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10" /></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.4em]"><span className="bg-[#0c0c0c] px-4 text-muted-foreground/30">Or Protocol</span></div>
           </div>

           <form onSubmit={handleSubmit} className="space-y-6">
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
                       placeholder="••••••••••••" 
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
                       Establish Connection <ArrowRight size={16} />
                    </>
                 )}
              </button>
           </form>
           
           <div className="text-center">
              <p className="text-muted-foreground/40 text-[10px] font-bold uppercase tracking-widest">
                 First assignment? <Link href="/signup" className="text-primary hover:underline underline-offset-4 ml-1">Secure an account</Link>
              </p>
           </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-muted-foreground/20">
           <ShieldCheck size={16} />
           <span className="text-[9px] font-bold uppercase tracking-[0.4em]">End-to-End Encrypted Workspace</span>
        </div>

      </motion.div>
    </div>
  );
}
