import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack } from 'lucide-react';

interface VideoPlayerProps {
  title: string;
  watermark?: string;
}

export function VideoPlayer({ title, watermark = 'NullTrace Academy' }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(35);
  const [showControls, setShowControls] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-surface-900 rounded-xl overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => playing && setShowControls(false)}
    >
      {/* Video placeholder */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-800 to-surface-900">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center mx-auto mb-3">
            <Play className="w-6 h-6 text-accent-cyan ml-1" />
          </div>
          <p className="text-body-sm text-slate-500">Video content placeholder</p>
        </div>
      </div>

      {/* Floating watermark */}
      <motion.div
        animate={{ x: [0, 20, 0, -20, 0], y: [0, -10, 0, 10, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-4 right-4 text-caption text-white/[0.06] font-heading font-semibold select-none pointer-events-none"
      >
        {watermark}
      </motion.div>

      {/* Keyboard shortcut blocker overlay */}
      <div
        className="absolute inset-0"
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* Controls overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
      >
        {/* Progress bar */}
        <div className="px-4 mb-2 pointer-events-auto">
          <div className="w-full h-1 bg-white/10 rounded-full cursor-pointer group/progress"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setProgress(((e.clientX - rect.left) / rect.width) * 100);
            }}
          >
            <div
              className="h-full bg-accent-cyan rounded-full relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent-cyan opacity-0 group-hover/progress:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between px-4 pb-4 pointer-events-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => setPlaying(!playing)} className="text-white hover:text-accent-cyan transition-colors">
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <button onClick={() => setMuted(!muted)} className="text-slate-400 hover:text-white transition-colors">
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-caption text-slate-400 ml-2">12:35 / 25:00</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-caption text-slate-400 hidden sm:block">{title}</span>
            <button className="text-slate-400 hover:text-white transition-colors">
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
