/**
 * Intelligent Audio Processing Utility
 * This tool performs browser-side Resampling (16kHz Mono) to massively reduce file size
 * while maintaining 100% accuracy for AI Transcription (Whisper standard).
 */

export async function processAudioFile(file: File): Promise<AudioBuffer> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const arrayBuffer = await file.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

export async function resampleAudio(audioBuffer: AudioBuffer, targetSampleRate: number = 16000): Promise<AudioBuffer> {
  const offlineCtx = new OfflineAudioContext(
    1, // Mono is enough for Whisper and 50% smaller
    audioBuffer.duration * targetSampleRate,
    targetSampleRate
  );

  const source = offlineCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(offlineCtx.destination);
  source.start();

  return await offlineCtx.startRendering();
}

/**
 * Encodes an AudioBuffer into a valid WAV file (Blob)
 */
export function encodeWAV(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;
  
  const samples = audioBuffer.getChannelData(0); // Assuming Mono
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* file length */
  view.setUint32(4, 32 + samples.length * 2, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * numChannels * 2, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, numChannels * 2, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * 2, true);

  // Write PCM samples
  let offset = 44;
  for (let i = 0; i < samples.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }

  return new Blob([view], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

/**
 * Slices an AudioBuffer into N segments based on duration
 */
export function sliceAudioBuffer(audioBuffer: AudioBuffer, segmentDurationSeconds: number): AudioBuffer[] {
  const sampleRate = audioBuffer.sampleRate;
  const totalSamples = audioBuffer.length;
  const samplesPerSegment = segmentDurationSeconds * sampleRate;
  const segments: AudioBuffer[] = [];

  for (let i = 0; i < totalSamples; i += samplesPerSegment) {
    const segmentLength = Math.min(samplesPerSegment, totalSamples - i);
    const segmentBuffer = new AudioBuffer({
        length: segmentLength,
        numberOfChannels: 1,
        sampleRate: sampleRate,
    });
    
    const data = audioBuffer.getChannelData(0).slice(i, i + segmentLength);
    segmentBuffer.copyToChannel(data, 0);
    segments.push(segmentBuffer);
  }

  return segments;
}
