"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Mic, Search, Clock, Sparkles, Bookmark, StopCircle, Play, Pause, ChevronLeft, Volume2, Shield, Settings2, MoreHorizontal, User, Share2, Save, Trash2, MonitorSpeaker } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";
import Link from "next/link";
import { useRouter } from "next/navigation";

const initialTranscript: { id: number; initials?: string; name: string; time: string; text: string; isAI: boolean; }[] = [
    { id: 1, initials: "JD", name: "Jordan Doe", time: "00:15", text: "The current velocity shows that we can finish the API integration by Friday, but we need the frontend assets.", isAI: false },
    { id: 2, initials: "SC", name: "Sarah Chen", time: "00:45", text: "I've sent the Figma links over. We should prioritize the mobile-responsive views first to ensure consistency across devices.", isAI: false },
];

const mockTranscriptStream = [
    { id: 4, initials: "AK", name: "Alex Kumar", time: "01:12", text: "Agreed. I'll start mapping the API endpoints to the new design specs by tonight.", isAI: false },
    { id: 5, initials: "JD", name: "Jordan Doe", time: "01:25", text: "Perfect. Let's touch base tomorrow morning at 9 AM for a quick sync.", isAI: false },
    { id: 6, initials: "SC", name: "Sarah Chen", time: "01:45", text: "Wait, do we have the final specs for the search component? That's critical for the library view.", isAI: false },
];

export default function ActiveMeeting() {
  const router = useRouter();
  const [timer, setTimer] = useState(0); 
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<{ id: string; name: string; time: string; text: string; isAI: boolean; initials?: string }[]>([]);
  const [highlights, setHighlights] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState("Meeting Sync (" + new Date().toLocaleDateString() + ")");
  const [isSaving, setIsSaving] = useState(false);
  
  // Audio state
  const [isSystemAudio, setIsSystemAudio] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const lastChunkIndexRef = useRef(0);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    let interval: any;
    if (isRecording && !isFinished) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, isFinished]);

  // Handle Audio Recording Start/Stop
  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
    return () => stopRecording();
  }, [isRecording]);

  const startRecording = async () => {
    try {
      let finalStream: MediaStream;

      if (isSystemAudio) {
        // Meeting Integration: Mix Mic + System/Tab Audio (Google Meet)
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
           audio: { echoCancellation: true, noiseSuppression: true },
           video: true // Browser requires video for getDisplayMedia, but we'll only use audio
        });

        const audioCtx = new AudioContext();
        audioContextRef.current = audioCtx;
        const dest = audioCtx.createMediaStreamDestination();

        const micSource = audioCtx.createMediaStreamSource(micStream);
        const screenSource = audioCtx.createMediaStreamSource(screenStream);

        micSource.connect(dest);
        screenSource.connect(dest);

        finalStream = dest.stream;
      } else {
        // Solo Mode: Just Microphone
        finalStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      const recorder = new MediaRecorder(finalStream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          if (audioChunksRef.current.length % 5 === 0) {
             transcribeCurrentChunks();
          }
        }
      };

      recorder.start(1000); // 1-second chunks
      console.log('Recording started', isSystemAudio ? '(Meeting Mode)' : '(Solo Mode)');
    } catch (err) {
      console.error('Failed to start recording', err);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      transcribeCurrentChunks(true); 
    }
  };

  const transcribeCurrentChunks = async (isFinal = false) => {
    if (audioChunksRef.current.length === 0) return;
    
    // For MVP: Send the whole recorded blob so far
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    const formData = new FormData();
    formData.append('file', audioBlob, 'meeting.webm');

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.text && !data.error) {
        // Simple update: replace or append
        // For now, let's treat it as a single growing transcript entry
        setTranscript([{ 
          id: 'live-transcript', 
          name: 'Attendee', 
          time: formatTime(timer), 
          text: data.text, 
          isAI: false,
          initials: 'YOU'
        }]);
      }
    } catch (err) {
      console.error('Transcription error:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsRecording(false);
    setIsFinished(true);
  };

  const handleSave = async () => {
     setIsSaving(true);
     
     // 1. Prepare raw transcript from recorded chunks
     const combinedTranscript = transcript.map(t => `${t.name}: ${t.text}`).join('\n');
     
     const sessionData = {
        title: meetingTitle || "Untitled Session",
        transcript: { data: combinedTranscript },
        duration: formatTime(timer),
     };

     try {
        // Step 1: Save the meeting to DB
        const res = await fetch('/api/meetings', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(sessionData)
        });
        
        const newMeeting = await res.json();
        
        if (res.ok && newMeeting.id) {
           // Step 2: Trigger AI Deep-Scan (Diarization + Summary + Action Items)
           // We'll let the user see it real-time in the insights page
           fetch(`/api/meetings/${newMeeting.id}/analyze`, { method: 'POST' });
           
           // Redirect to the new insights page
           router.push(`/insights/${newMeeting.id}`);
        } else {
           console.error('Failed to save session');
           alert("Lưu thất bại. Vui lòng thử lại.");
        }
     } catch (err) {
        console.error('Save error:', err);
        alert("Lỗi hệ thống khi lưu cuộc họp.");
     } finally {
        setIsSaving(false);
     }
  };

  return (
    <>
      <AnimatePresence>
        {isSaving && (
          <LoadingState type="fullscreen" message="Optimizing Meeting Intelligence" />
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full relative">
        {/* Main Recording & Transcript Area (Left/Center) */}
        <section className="lg:col-span-12 xl:col-span-8 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
           <div className="space-y-4">
              <Link href="/meetings" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group">
                 <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Abort Protocol</span>
              </Link>
              <h1 className="font-outfit text-3xl lg:text-4xl font-black text-white tracking-tighter leading-tight">Live Recording Workspace</h1>
           </div>
           
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 shadow-neon">
                 <motion.span 
                    animate={{ opacity: isRecording ? [1, 0.4, 1] : 1 }} 
                    transition={{ repeat: Infinity, duration: 1.5 }} 
                    className="w-2.5 h-2.5 rounded-full bg-red-500" 
                 />
                 <span className="text-sm font-black tracking-widest font-mono uppercase">{formatTime(timer)}</span>
              </div>
           </div>
        </div>

        {/* Real-time Waveform Visualization (Dynamic) */}
        <div className="bg-white/5 rounded-[3rem] p-8 lg:p-10 border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
           <div className="flex items-center justify-between mb-8 opacity-40">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-neon" />
                 <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">Audio Channel: Encrypted</span>
              </div>
              <Volume2 className="w-4 h-4 text-primary" />
           </div>
           <div className="flex items-end justify-center h-20 gap-1 lg:gap-1.5 w-full">
             {[...Array(40)].map((_, i) => (
               <motion.div 
                   key={i}
                   animate={{ 
                       height: isRecording ? [`${20 + Math.random() * 60}%`, `${30 + Math.random() * 70}%`, `${20 + Math.random() * 60}%`] : "4px" 
                   }}
                   transition={{ repeat: Infinity, duration: 0.3 + Math.random() * 0.4 }}
                   className={cn(
                       "w-1 md:w-1.5 rounded-full transition-colors duration-500",
                       i % 4 === 0 ? "bg-primary shadow-neon" : "bg-white/10"
                   )}
               />
             ))}
           </div>
        </div>

        {/* Live Transcript Flow */}
        <div className="space-y-8 pt-4 pb-20">
           <AnimatePresence>
             {transcript.map((msg, i) => (
               <motion.div 
                 key={msg.id}
                 initial={{ opacity: 0, x: -5 }}
                 animate={{ opacity: 1, x: 0 }}
                 className="flex gap-6 max-w-4xl"
               >
                 <div className={cn(
                     "flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center font-black text-[10px] border transition-all shadow-md mt-1",
                     msg.isAI ? "bg-primary text-black border-primary shadow-neon" : "bg-white/5 text-white border-white/10"
                 )}>
                   {msg.isAI ? <Sparkles className="w-5 h-5 fill-current" /> : msg.initials}
                 </div>
                 <div className="flex-1 space-y-2">
                   <div className="flex items-center justify-between">
                      <span className={cn("font-bold text-xs", msg.isAI ? "text-primary uppercase tracking-[0.2em]" : "text-white opacity-60")}>{msg.name}</span>
                      <span className="text-[9px] font-black tracking-widest text-muted-foreground/30">{msg.time}</span>
                   </div>
                   <div className={cn(
                       "p-5 rounded-[2rem] rounded-tl-none border transition-all leading-relaxed relative group",
                       msg.isAI ? "bg-primary/5 border-primary/20 shadow-inner" : "bg-background border-white/5"
                   )}>
                     <p className={cn("text-sm lg:text-base", msg.isAI ? "text-primary/70 italic font-medium" : "text-foreground/90")}>
                         {msg.text}
                     </p>
                     {!msg.isAI && (
                        <button className="absolute -right-2 -bottom-2 w-8 h-8 bg-white/5 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all opacity-0 group-hover:opacity-100 shadow-xl">
                           <Bookmark size={14} />
                        </button>
                     )}
                   </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>
           
           {isRecording && (
              <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center gap-3 pl-16 text-primary/40 text-[10px] font-black uppercase tracking-[0.3em]"
              >
                 <Sparkles size={12} className="animate-spin-slow" />
                 AI Synthesis in progress...
              </motion.div>
           )}
        </div>
      </section>

      {/* Intelligence & Summary Panel (Right Side - Desktop) */}
      <aside className="lg:col-span-12 xl:col-span-4 h-full">
         <div className="sticky top-28 space-y-6">
            
            {/* Editable Title Section */}
            <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-3 shadow-lg group focus-within:border-primary/30 transition-all">
                <label className="text-[9px] font-black text-primary/40 uppercase tracking-[0.3em] font-outfit px-2">Session Identity</label>
                <input 
                    type="text"
                    value={meetingTitle}
                    onChange={(e) => setMeetingTitle(e.target.value)}
                    className="w-full bg-transparent border-none text-white font-outfit font-black text-xl lg:text-2xl tracking-tighter focus:outline-none placeholder:text-white/10 px-2"
                    placeholder="Describe this vortex session..."
                />
            </div>

            {/* AI Intelligence Block - Updated automatically */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
               <div className="space-y-6 relative z-10">
                  <header className="space-y-1">
                     <h2 className="text-white font-outfit font-black text-2xl tracking-tighter uppercase">AI Insight Hub</h2>
                     <p className="text-primary/40 text-[9px] font-black tracking-widest uppercase">Encryption: AES-256</p>
                  </header>
                  
                  <div className="space-y-6">
                     <h3 className="text-white text-[10px] font-black opacity-30 flex items-center gap-2 uppercase tracking-widest">
                        <Bookmark size={12} className="text-primary" />
                        Live Highlights
                     </h3>
                     <div className="space-y-3 max-h-[300px] overflow-y-auto no-scrollbar">
                        <AnimatePresence initial={false}>
                          {highlights.map((h, i) => (
                             <motion.div 
                                key={h} 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 bg-background rounded-2xl border border-white/5 text-[13px] font-medium text-white/70 flex items-center gap-3 hover:border-primary/20 transition-all shadow-inner"
                             >
                                <div className="w-1 h-1 rounded-full bg-primary shadow-neon" />
                                {h}
                             </motion.div>
                          ))}
                        </AnimatePresence>
                     </div>
                  </div>
               </div>

               <div className={cn(
                  "pt-8 border-t border-white/5 relative z-10 flex flex-col gap-3 transition-opacity duration-500",
                  !isFinished && "opacity-20 pointer-events-none"
               )}>
                  <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-primary text-black font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-neon hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      ) : <Save size={16} />}
                      {isSaving ? "Saving..." : "Secure Save to Library"}
                   </button>
                  <button 
                  onClick={() => router.push('/meetings')}
                  className="w-full bg-white/5 text-red-500 font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest border border-red-500/10 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
                     <Trash2 size={16} />
                     Discard Session
                  </button>
               </div>
            </div>

            {/* Transcription Integrity Stats */}
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-6">
               <div className="flex items-center justify-between opacity-40">
                  <h3 className="text-white font-bold text-sm tracking-widest uppercase">System Stats</h3>
                  <Settings2 size={16} />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-2xl p-4 border border-white/5 text-center">
                     <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Latency</p>
                     <p className="text-xl font-black text-primary">14ms</p>
                  </div>
                  <div className="bg-background rounded-2xl p-4 border border-white/5 text-center">
                     <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Privacy</p>
                     <Shield size={16} className="mx-auto text-primary opacity-60 mt-1" />
                  </div>
               </div>
            </div>

         </div>
      </aside>

      {/* Control HUD (Compact Center) */}
      <div className="fixed bottom-10 left-0 right-0 md:left-auto md:right-auto md:left-1/2 md:-translate-x-1/2 z-50 flex justify-center px-4 pointer-events-none">
         <div className="pointer-events-auto bg-background/80 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-4 flex items-center gap-8 shadow-2xl">
            {/* System Audio Toggle */}
            <button 
               onClick={() => setIsSystemAudio(!isSystemAudio)}
               disabled={isRecording}
               className={cn(
                  "p-3 rounded-full transition-all flex items-center gap-2",
                  isSystemAudio 
                    ? "bg-primary text-black shadow-neon" 
                    : "text-white/20 hover:text-white/40"
               )}
               title={isSystemAudio ? "Meeting Mode (Mic + System)" : "Solo Mode (Mic Only)"}
            >
               <MonitorSpeaker size={20} className={isSystemAudio ? "animate-pulse" : ""} />
            </button>

            <div className="flex items-center gap-4">
               {!isFinished ? (
                 <>
                   <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsRecording(!isRecording)}
                      className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl",
                        isRecording ? "bg-white text-black hover:bg-primary" : "bg-primary text-black"
                      )}
                   >
                      {isRecording ? <Pause size={24} /> : <Play size={24} className="ml-1 fill-current" />}
                   </motion.button>
                   <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleStop}
                      className="w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-all"
                   >
                      <StopCircle size={24} />
                   </motion.button>
                 </>
               ) : (
                  <div className="px-6 py-2 rounded-full bg-primary/20 text-primary border border-primary/40 text-[10px] font-black uppercase tracking-[0.2em]">
                     Processing Session
                  </div>
               )}
            </div>
            <div className="flex items-center gap-1.5 antialiased px-6">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Signal: Verified</span>
            </div>
         </div>
      </div>

    </div>
    </>
  );
}
