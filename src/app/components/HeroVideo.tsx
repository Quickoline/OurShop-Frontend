import { useCallback, useEffect, useRef, useState } from 'react';
import { Volume2 } from 'lucide-react';

const VIDEO_ID = 'asG7cwxi1sA';

function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const finish = () => {
      if (window.YT?.Player) resolve();
    };

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      finish();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
    }

    const interval = window.setInterval(() => {
      if (window.YT?.Player) {
        window.clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

export function HeroVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YT.Player | null>(null);
  const isReadyRef = useRef(false);
  const pendingUnmuteRef = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [needsUnmute, setNeedsUnmute] = useState(true);

  const tryUnmute = useCallback(() => {
    const player = playerRef.current;
    if (!player || typeof player.unMute !== 'function') {
      pendingUnmuteRef.current = true;
      return;
    }

    player.unMute();
    player.setVolume(100);
    pendingUnmuteRef.current = false;
    setNeedsUnmute(false);
  }, []);

  useEffect(() => {
    let mounted = true;
    isReadyRef.current = false;
    pendingUnmuteRef.current = false;
    playerRef.current = null;
    setIsReady(false);

    loadYouTubeApi().then(() => {
      if (!mounted || !containerRef.current) return;

      new YT.Player(containerRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          playsinline: 1,
          loop: 1,
          playlist: VIDEO_ID,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
        },
        events: {
          onReady: (event) => {
            if (!mounted) return;

            playerRef.current = event.target;
            isReadyRef.current = true;
            setIsReady(true);
            event.target.playVideo();

            if (pendingUnmuteRef.current) {
              tryUnmute();
            }
          },
        },
      });
    });

    return () => {
      mounted = false;
      isReadyRef.current = false;

      const player = playerRef.current;
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
      playerRef.current = null;
    };
  }, [tryUnmute]);

  useEffect(() => {
    if (!needsUnmute || !isReady) return;

    const onInteraction = () => tryUnmute();

    document.addEventListener('click', onInteraction, { once: true });
    document.addEventListener('touchstart', onInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener('click', onInteraction);
      document.removeEventListener('touchstart', onInteraction);
    };
  }, [needsUnmute, isReady, tryUnmute]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {needsUnmute && (
        <button
          type="button"
          onClick={tryUnmute}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/40 text-white backdrop-blur-[2px] transition-opacity hover:bg-black/50"
          aria-label="Tap for sound"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 ring-1 ring-white/30">
            <Volume2 size={22} />
          </span>
          <span className="text-sm font-semibold tracking-wide">
            {isReady ? 'Tap for sound' : 'Loading video…'}
          </span>
        </button>
      )}
    </div>
  );
}
