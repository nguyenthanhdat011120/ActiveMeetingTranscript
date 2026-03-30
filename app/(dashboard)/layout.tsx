"use client";

import { cn } from "@/lib/utils";
import { LayoutDashboard, Mic, BarChart3, Library, Search, LogOut, Settings, User, Scissors } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { label: "Meetings", icon: LayoutDashboard, href: "/meetings" },
  { label: "Record", icon: Mic, href: "/record" },
  { label: "Insights", icon: BarChart3, href: "/insights" },
  { label: "Library", icon: Library, href: "/library" },
  { label: "Tools", icon: Scissors, href: "/tools/slicer" },
];

import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [profile, setProfile] = useState<{ fullName: string | null; avatarUrl: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('Profile')
          .select('fullName, avatarUrl')
          .eq('id', user.id)
          .single();
        
        if (!error && data) {
          setProfile(data);
        }
      }
    };
    fetchProfile();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      
      {/* Desktop & Tablet Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex flex-col w-20 lg:w-72 border-r border-white/5 bg-background h-screen sticky top-0 z-50 transition-all duration-300">
        <div className="flex items-center gap-4 px-6 h-20 border-b border-white/5 overflow-hidden">
          <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden border border-white/10">
             <img src="/assets/images/logo.png" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <span className="hidden lg:block font-outfit font-black text-sm tracking-tight text-white leading-none">
            ACTIVE MEETING<br/>TRANSCRIPT
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 rounded-2xl transition-all group overflow-hidden",
                  isActive 
                    ? "bg-primary text-black shadow-neon" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5 shrink-0", isActive && "fill-current")} />
                <span className="hidden lg:block font-outfit font-black text-[11px] uppercase tracking-widest ml-4 whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
           <Link href="/settings" className="flex items-center px-4 py-3 rounded-2xl text-muted-foreground hover:bg-white/5 hover:text-white transition-all group">
             <Settings className="w-5 h-5 shrink-0" />
             <span className="hidden lg:block font-bold text-sm ml-4">Settings</span>
           </Link>
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-3 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all font-outfit font-black text-[11px] uppercase tracking-widest mt-auto group"
            >
              <LogOut className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="hidden lg:block ml-4">Sign Out</span>
            </button>
        </div>
      </aside>

      {/* Main Content & Mobile Layout */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto no-scrollbar relative">
        
        {/* Top bar for Search & Profile (Consistent across all devices) */}
        <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 h-20 shrink-0">
          <div className="md:hidden flex items-center gap-3">
             <img src="/assets/images/logo.png" alt="Logo" className="w-8 h-8 object-cover rounded-full border border-white/10" />
             <span className="font-outfit font-black text-xs text-white leading-none">ACTIVE MEETING<br/>TRANSCRIPT</span>
          </div>
          
          <div className="relative flex-1 max-w-xl hidden md:block group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
             <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white/10 transition-all"
             />
          </div>

          <div className="flex items-center gap-4">
             <button className="md:hidden text-foreground/60 p-2">
                <Search className="w-5 h-5" />
             </button>
             <div className="flex items-center gap-3 bg-white/5 rounded-full pl-2 pr-4 py-1.5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                   {profile?.avatarUrl ? (
                     <img src={profile.avatarUrl} alt="User" />
                   ) : (
                     <User className="w-4 h-4 text-white/20" />
                   )}
                </div>
                <div className="hidden lg:block">
                   <p className="text-xs font-bold text-white group-hover:text-primary transition-colors">
                      {profile?.fullName || "Commander"}
                   </p>
                   <p className="text-[10px] text-muted-foreground">Premium Plan</p>
                </div>
             </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto px-6 pt-6 pb-10 md:pt-8 md:pb-16">
            {children}
          </div>
        </main>

        {/* Mobile-Only Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-20 px-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-all duration-300 px-4 py-2 rounded-2xl",
                  isActive 
                    ? "text-primary bg-primary/10 border border-primary/20 shadow-neon scale-105" 
                    : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-6 h-6", isActive && "fill-primary/20")} />
                <span className="text-[10px] font-black uppercase tracking-widest scale-90">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      
    </div>
  );
}
