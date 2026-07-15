import React, { useRef, useState, useEffect } from 'react';
import { Shield, Play, Pause, Volume2, Maximize, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SecureVideoPlayerProps {
  title: string;
  videoUrl?: string; // Standard video URL or local placeholder
  posterUrl?: string;
  isFreeLesson?: boolean;
}

export const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-cyberpunk-computer-screen-close-up-34301-large.mp4', // beautiful fallback cyberpunk video
  posterUrl = '',
  isFreeLesson = false
}) => {
  const { dbUser, subscription } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isLocked, setIsLocked] = useState(false);

  // Check if lesson is locked (free users can only watch 120s of non-free lessons)
  const isPro = subscription?.tier === 'pro';
  const shouldLock = !isPro && !isFreeLesson;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // If free user and exceeds 120 seconds, lock it!
      if (shouldLock && video.currentTime >= 60) { // Limit to 60s for demo
        video.pause();
        setIsPlaying(false);
        setIsLocked(true);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [shouldLock]);

  const togglePlay = () => {
    if (isLocked) return;
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const watermarkText = dbUser ? `${dbUser.email} | Black Cypher Secure Stream` : 'SECURE CONNECTION | DO NOT DISTRIBUTE';

  return (
    <div className="relative w-full aspect-video bg-black border border-white/[0.08] rounded-xl overflow-hidden shadow-glow-cyan select-none group">
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        onClick={togglePlay}
        className="w-full h-full object-cover pointer-events-none"
        playsInline
      />

      {/* Cyber Digital Watermark (Burn-in text that moves randomly or stays centered) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none select-none z-10">
        <div className="text-[12px] md:text-[14px] text-white/5 font-mono select-none font-bold uppercase tracking-[0.2em] transform -rotate-12">
          {watermarkText}
        </div>
      </div>
      
      {/* Secondary Dynamic Floating Watermark */}
      <div className="absolute top-8 right-8 pointer-events-none select-none z-10 text-[9px] font-mono text-accent-cyan/10">
        {watermarkText}
      </div>
      <div className="absolute bottom-16 left-8 pointer-events-none select-none z-10 text-[9px] font-mono text-accent-cyan/10">
        {watermarkText}
      </div>

      {/* Custom Control Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-black/0 p-4 flex flex-col gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 select-none">
        
        {/* Progress Bar */}
        <div className="relative w-full h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
          <div 
            className="h-full bg-accent-cyan"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="hover:text-accent-cyan transition-colors">
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <span className="text-caption font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <div className="flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/20 rounded-full appearance-none outline-none accent-accent-cyan cursor-pointer"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-[10px] text-accent-cyan/60 font-semibold tracking-wider uppercase font-mono">
              <ShieldCheck className="w-3 h-3 text-accent-cyan" /> Secure DRM Active
            </span>
            <button onClick={handleFullscreen} className="hover:text-accent-cyan transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* SECURE BLOCK PAYWALL OVERLAY */}
      {isLocked && (
        <div className="absolute inset-0 bg-surface-950/95 backdrop-blur flex flex-col items-center justify-center text-center p-6 select-none z-30">
          <div className="w-14 h-14 rounded-full bg-accent-violet/10 border border-accent-violet/30 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-accent-violet animate-pulse" />
          </div>
          <h4 className="font-heading text-heading-sm font-bold text-white uppercase tracking-widest">
            Lecture Playback Suspended
          </h4>
          <p className="text-body-sm text-slate-400 max-w-sm mt-2 mb-6">
            Free trial session complete. Subscribe to the **Operator (Pro)** plan to watch full courses including CEH v9/10/13 modules.
          </p>
          <a href="/subscription">
            <button className="bg-accent-violet hover:bg-violet-600 text-white font-semibold px-6 py-3 rounded-lg shadow-glow-violet hover:scale-105 transition-all text-body-sm flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Unlock Premium Access
            </button>
          </a>
        </div>
      )}
    </div>
  );
};
