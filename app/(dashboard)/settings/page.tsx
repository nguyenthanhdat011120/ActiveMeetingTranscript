"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  Rocket, 
  ShieldCheck, 
  Cpu,
  RefreshCw,
  Layout,
  MessageSquare,
  Terminal,
  Hash
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";

// Custom Toast (Simplified for settings)
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
    className={cn(
      "fixed bottom-8 right-8 z-50 p-4 rounded-2xl border backdrop-blur-xl flex items-center gap-3",
      type === 'success' ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-red-500/10 border-red-500/20 text-red-400"
    )}
  >
    {type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
    <span className="text-sm font-bold">{message}</span>
  </motion.div>
);

export default function SettingsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setIsLoading(false);
      });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      if (res.ok) {
        setToast({ message: "Settings updated successfully!", type: "success" });
      } else {
        setToast({ message: "Update failed. Please try again.", type: "error" });
      }
    } catch (err) {
      setToast({ message: "System error during update.", type: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, [field]: value }));
  };

  if (isLoading) return <LoadingState type="page" message="Loading System Vault" />;

  return (
    <div className="space-y-10 pb-20 relative">
      <AnimatePresence>
        {isSaving && (
          <LoadingState type="fullscreen" message="Securing System Configuration" />
        )}
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="space-y-4">
        <p className="font-outfit text-primary font-bold text-[10px] tracking-[0.4em] uppercase opacity-60">System Configuration</p>
        <h1 className="font-outfit text-5xl font-black text-white tracking-tighter leading-tight">Settings</h1>
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Profile Section */}
        <section className="lg:col-span-12 xl:col-span-7 space-y-10">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 space-y-8 hover:border-primary/20 transition-all">
             <div className="flex items-center gap-4 text-white font-outfit font-black text-xl uppercase tracking-widest opacity-40">
                <User size={20} className="text-primary" />
                Personal Profile
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                   <input 
                      type="text" value={profile.fullName || ""} onChange={(e) => handleInputChange('fullName', e.target.value)}
                      className="w-full bg-black border border-white/5 p-4 rounded-2xl text-white font-bold focus:border-primary/40 focus:outline-none transition-all"
                      placeholder="Your Full Name"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                   <input 
                      type="email" value={profile.email} disabled
                      className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl text-white/40 font-bold cursor-not-allowed"
                   />
                </div>
             </div>
          </div>

          {/* Integration Hub */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 lg:p-10 space-y-10 hover:border-primary/20 transition-all">
             <div className="flex items-center gap-4 text-white font-outfit font-black text-xl uppercase tracking-widest opacity-40 border-b border-white/5 pb-6">
                <Cpu size={20} className="text-primary" />
                Integration Intelligence
             </div>

             {/* Notion Settings */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-black rounded-xl border border-white/5 flex items-center justify-center">
                         <Layout size={20} className="text-white" />
                      </div>
                      <div>
                         <h3 className="text-white font-bold text-lg">Notion Workplace</h3>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Automation Sink</p>
                      </div>
                   </div>
                   <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border", profile.notionToken ? "bg-green-500/10 border-green-500/20 text-green-400" : "bg-white/5 border-white/10 text-white/20")}>
                      {profile.notionToken ? "CONNECTED" : "DISCONNECTED"}
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Internal Integration Token</label>
                         <input 
                            type="password" value={profile.notionToken || ""} onChange={(e) => handleInputChange('notionToken', e.target.value)}
                            className="w-full bg-black border border-white/5 p-4 rounded-2xl text-white font-bold focus:border-primary/40 focus:outline-none transition-all secure"
                            placeholder="secret_..."
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Parent Page ID</label>
                         <input 
                            type="text" value={profile.notionPageId || ""} onChange={(e) => handleInputChange('notionPageId', e.target.value)}
                            className="w-full bg-black border border-white/5 p-4 rounded-2xl text-white font-bold focus:border-primary/40 focus:outline-none transition-all"
                            placeholder="332ab611..."
                         />
                      </div>
                   </div>
                </div>
             </div>

             {/* Slack Settings */}
             <div className="space-y-6 pt-6 border-t border-white/5">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-[#4A154B]/20 rounded-xl border border-[#4A154B]/30 flex items-center justify-center">
                      <Hash size={20} className="text-[#4A154B]" />
                   </div>
                   <div>
                      <h3 className="text-white font-bold text-lg">Slack Channel</h3>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Instant Notifications</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Incoming Webhook URL</label>
                      <input 
                         type="text" value={profile.slackWebhookUrl || ""} onChange={(e) => handleInputChange('slackWebhookUrl', e.target.value)}
                         className="w-full bg-black border border-white/5 p-4 rounded-2xl text-white font-bold focus:border-primary/40 focus:outline-none transition-all"
                         placeholder="https://hooks.slack.com/services/..."
                      />
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Action Sidebar */}
        <aside className="lg:col-span-12 xl:col-span-5 space-y-8">
           <div className="bg-background border border-white/10 rounded-[3rem] p-8 lg:p-10 space-y-8 shadow-2xl relative sticky top-28">
              <header className="space-y-4">
                 <div className="w-16 h-16 rounded-[2rem] bg-primary/20 border border-primary/20 flex items-center justify-center text-primary shadow-neon mb-6">
                    <Rocket size={32} />
                 </div>
                 <h3 className="font-outfit font-black text-2xl text-white uppercase tracking-tighter">Save Changes</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">System updates will take effect across all modules. Authentication keys are encrypted for security.</p>
              </header>

              <div className="space-y-6">
                 <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <ShieldCheck className="text-green-500 w-5 h-5" />
                    <p className="text-xs font-bold text-white/60 leading-tight">Your data is stored securely using Supabase RLS policies.</p>
                 </div>
                 <div className="flex items-center gap-4 p-5 bg-white/5 border border-white/5 rounded-2xl">
                    <RefreshCw className="text-primary w-5 h-5 animate-pulse-slow" />
                    <p className="text-xs font-bold text-white/60 leading-tight">Integrations are validated in real-time during use.</p>
                 </div>
              </div>

              <button 
                type="submit" disabled={isSaving}
                className="w-full bg-primary text-black font-black py-6 rounded-[2rem] text-xs uppercase tracking-widest shadow-neon hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                 {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save size={20} />}
                 {isSaving ? "Updating System..." : "Apply Configuration"}
              </button>
           </div>
        </aside>
      </form>
    </div>
  );
}
