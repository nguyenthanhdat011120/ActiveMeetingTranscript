"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Scissors, 
  ArrowUpRight, 
  Sparkles, 
  ChevronLeft, 
  FileAudio, 
  Play, 
  BarChart2, 
  Download, 
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { processAudioFile, resampleAudio, sliceAudioBuffer, encodeWAV } from "@/lib/audio-processor";

export default function SmartSlicer() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [chunkDuration, setChunkDuration] = useState(10); // Default 10 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);
  const [chunks, setChunks] = useState<{ id: number; status: 'waiting' | 'done' | 'error' }[]>([]);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [isFinishing, setIsFinishing] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setChunks([]);
      setFinalTranscript("");
      setStatus("File Loaded");
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(2);

    try {
      // Phase 1: Decoding
      setStatus("Step 1: Decoding Audio Stream...");
      const fullBuffer = await processAudioFile(file);
      setProgress(20);

      // Phase 2: Resampling
      setStatus("Step 2: Resampling for AI Efficiency (16kHz Mono)...");
      const resampledBuffer = await resampleAudio(fullBuffer, 16000);
      setProgress(40);

      // Phase 3: Slicing
      setStatus("Step 3: Calculating Temporal Segments...");
      const segments = sliceAudioBuffer(resampledBuffer, chunkDuration * 60);
      const newChunks = segments.map((_, i) => ({ id: i, status: 'waiting' as const }));
      setChunks(newChunks);
      setProgress(50);

      let accumulatedText = "";

      // Phase 4: Digestion
      for (let i = 0; i < segments.length; i++) {
        setStatus(`Step 4: Digesting Fragment ${i+1}/${segments.length}...`);
        setChunks(prev => prev.map(c => c.id === i ? { ...c, status: 'waiting' } : c));
        const wavBlob = encodeWAV(segments[i]);

        const res = await fetch('/api/transcribe', {
          method: 'POST',
          body: wavBlob,
          headers: { 'Content-Type': 'application/octet-stream', 'X-File-Name': `digest_part_${i}.wav` }
        });
        const data = await res.json();
        
        if (res.ok && data.text) {
          accumulatedText += data.text + " ";
          setChunks(prev => prev.map(c => c.id === i ? { ...c, status: 'done' } : c));
        } else {
          setChunks(prev => prev.map(c => c.id === i ? { ...c, status: 'error' } : c));
          throw new Error(data.detail || "Transcription failed");
        }
        setProgress(50 + Math.round(((i + 1) / segments.length) * 40));
      }

      // Phase 5: Synthesis (NEW)
      setIsSynthesizing(true);
      setStatus("Step 5: AI Synthesis & Global Diarization...");
      const synthesisRes = await fetch('/api/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: accumulatedText })
      });
      const synthesisData = await synthesisRes.json();
      
      setFinalTranscript(synthesisData.script || accumulatedText);
      setStatus("Intelligent Signal Processing Complete");
      setProgress(100);
      alert("AI Script Synthesis Finished!");
    } catch (error: any) {
      console.error("Pipeline Error:", error);
      setStatus("Error: " + error.message);
      alert("Pipeline failure: " + error.message);
    } finally {
      setIsProcessing(false);
      setIsSynthesizing(false);
    }
  };

  const saveToArchive = async () => {
    if (!finalTranscript) return;
    setIsFinishing(true);

    try {
      const sessionData = {
        title: `Digest: ${file?.name.split('.')[0]}`,
        transcript: { data: finalTranscript },
        duration: "Large File Digest",
      };

      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData),
      });

      const newMeeting = await res.json();
      if (newMeeting.id) {
         // Auto-analyze
         await fetch(`/api/meetings/${newMeeting.id}/analyze`, { method: 'POST' });
         router.push(`/meetings/${newMeeting.id}`);
      }
    } catch (error) {
      console.error("Save Error:", error);
    } finally {
      setIsFinishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-4">
        <div className="space-y-4">
          <Link href="/library" className="group flex items-center gap-2 text-primary">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Return to Vault</span>
          </Link>
          <h1 className="text-5xl font-black text-white tracking-tighter">Intelligent Slicer</h1>
          <p className="text-muted-foreground/60 max-w-lg leading-relaxed text-sm">
            Break down massive meeting archives (MP4/MP3) into AI-digestible chunks. Perfect for 1-hour sessions over 25MB.
          </p>
        </div>

        <div className="p-1.5 rounded-[2rem] bg-white/5 border border-white/10 flex items-center">
            <div className="px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-neon" />
               <span className="text-[10px] font-black uppercase tracking-widest">Active Core: Llama 3 v3</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload Section */}
        <div className="lg:col-span-7 space-y-8">
           <div className={cn(
              "relative group bg-white/5 border-2 border-dashed rounded-[3.5rem] p-12 lg:p-20 transition-all",
              file ? "border-primary/40 bg-primary/5" : "border-white/5 hover:border-white/10",
              isProcessing && "opacity-50 pointer-events-none"
           )}>
              <input 
                type="file" 
                accept="audio/*,video/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={handleFileSelect}
              />
              
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                 <div className="w-24 h-24 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:shadow-neon-lg transition-all">
                    {file ? <FileAudio size={40} /> : <Scissors size={40} className="rotate-[-45deg]" />}
                 </div>
                 <div className="space-y-2">
                    <h2 className="text-xl font-black text-white">{file ? file.name : "Target File for Slicing"}</h2>
                    <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/40">
                      {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB Detected` : "Drop MP4, MP3, or WAV Archives"}
                    </p>
                 </div>
              </div>
           </div>

           {/* Manual Precision Control - Updated to Duration */}
           {file && !isProcessing && !finalTranscript && (
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Slicing Precision (Duration)</p>
                      <p className="text-[9px] text-muted-foreground/40 uppercase font-medium">Slicing by time is safer for audio integrity</p>
                   </div>
                   <div className="bg-primary text-black px-4 py-2 rounded-xl font-black text-xs shadow-neon">
                      {chunkDuration} Min / Part
                   </div>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="20" 
                  step="1"
                  value={chunkDuration}
                  onChange={(e) => setChunkDuration(Number(e.target.value))}
                  className="w-full accent-primary bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer"
                />
             </div>
           )}

           {file && !isProcessing && !finalTranscript && (
             <motion.button 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               onClick={processFile}
               className="w-full bg-primary text-black font-black py-5 rounded-[2rem] shadow-neon uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all"
             >
                <Sparkles size={18} />
                Initiate Intelligent Decomposition
             </motion.button>
           )}

           {isProcessing && (
              <div className="space-y-4 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest animate-pulse">{status}</span>
                    <span className="text-[10px] font-mono text-white/40">{progress}%</span>
                 </div>
                 <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${progress}%` }}
                       className="h-full bg-primary shadow-neon" 
                    />
                 </div>
                 <div className="flex flex-wrap gap-2 pt-4">
                    {chunks.map(chunk => (
                       <div key={chunk.id} className={cn(
                          "w-3 h-3 rounded-full transition-all duration-500",
                          chunk.status === 'done' ? "bg-primary shadow-neon scale-110" : 
                          chunk.status === 'error' ? "bg-red-500 shadow-red-500/50" : "bg-white/10"
                       )} />
                    ))}
                 </div>
              </div>
           )}

           {finalTranscript && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                 <div className="bg-background border border-white/10 rounded-[2.5rem] p-8 space-y-4">
                    <div className="flex items-center justify-between opacity-40">
                       <span className="text-[10px] font-black uppercase tracking-widest">Decoded Sequence Output</span>
                       <CheckCircle2 className="text-primary" size={16} />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto text-sm text-foreground/80 leading-relaxed custom-scrollbar pr-4">
                       {finalTranscript}
                    </div>
                 </div>

                 <button 
                   onClick={saveToArchive}
                   disabled={isFinishing}
                   className="w-full bg-white/5 border border-primary/20 text-primary font-black py-5 rounded-[2.5rem] uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-primary hover:text-black transition-all"
                 >
                   {isFinishing ? (
                        <div className="w-4 h-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                     ) : <Save size={18} />}
                   {isFinishing ? "Indexing..." : "Push to Vault & Perform Analysis"}
                 </button>
              </motion.div>
           )}
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-5 space-y-8">
           <div className="p-8 lg:p-10 bg-white/5 rounded-[3rem] border border-white/5 space-y-8">
              <div className="space-y-2">
                 <h3 className="text-white font-black text-sm uppercase tracking-widest">Protocol Rules</h3>
                 <div className="h-0.5 w-12 bg-primary/40 rounded-full" />
              </div>

              <div className="space-y-6">
                 {[
                    { icon: AlertCircle, title: "Size Limit Bypass", desc: "Automatically slices files larger than 25MB into valid Whisper sequences." },
                    { icon: BarChart2, title: "Sequential Processing", desc: "Transcribes parts one-by-one to maintain context and integrity." },
                    { icon: Sparkles, title: "AI Re-assembly", desc: "Merges transcript segments and performs a unified deep-scan analysis." }
                 ].map((rule, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-8 h-8 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                          <rule.icon className="text-primary" size={14} />
                       </div>
                       <div className="space-y-1">
                          <p className="text-[11px] font-bold text-white uppercase">{rule.title}</p>
                          <p className="text-[10px] text-muted-foreground/60 leading-relaxed">{rule.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>

              <div className="pt-4">
                 <div className="p-6 rounded-[2rem] bg-black/40 border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <Play size={12} className="fill-current" />
                       </div>
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">Ready to Shred</span>
                    </div>
                    <ArrowUpRight size={14} className="text-primary" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
