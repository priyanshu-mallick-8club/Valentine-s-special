"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Heart } from "lucide-react";

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Attempt to auto-play on mount
    const tryPlay = () => {
      if (audioRef.current) {
        audioRef.current.volume = 0.4;
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.log("Auto-play prevented:", error);
              setIsPlaying(false);
              // Add one-time listener for user interaction to start music
              document.addEventListener('click', handleUserInteraction, { once: true });
            });
        }
      }
    };

    const handleUserInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(e => console.error("Play failed even after interaction:", e));
      }
    };

    tryPlay();

    return () => {
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      <audio ref={audioRef} src="/bg-music.mp3" loop />
      
      {/* Main Button */}
      <button
        onClick={togglePlay}
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 rounded-full shadow-2xl hover:shadow-pink-500/50 hover:scale-110 transition-all duration-300 group overflow-hidden"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full"></div>
        
        {/* Heart decoration in background */}
        <Heart 
          className="absolute w-8 h-8 sm:w-10 sm:h-10 text-white/10 fill-white/10 rotate-12" 
        />
        
        {/* Play/Pause icon */}
        <div className="relative z-10">
          {isPlaying ? (
            <Pause className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white drop-shadow-lg" />
          ) : (
            <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white fill-white drop-shadow-lg ml-0.5" />
          )}
        </div>
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </button>
      
      {/* Animated effects when playing */}
      {isPlaying && (
        <>
          {/* Pulsing rings */}
          <span className="absolute inset-0 inline-flex rounded-full bg-pink-400 opacity-30 animate-ping"></span>
          <span className="absolute inset-0 inline-flex rounded-full bg-rose-400 opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></span>
          
          {/* Floating hearts */}
          <span className="absolute top-0 left-0 animate-float-up" style={{ animationDelay: '0s' }}>
            <Heart className="w-3 h-3 text-pink-400 fill-pink-400 opacity-60" />
          </span>
          <span className="absolute top-0 right-0 animate-float-up" style={{ animationDelay: '0.7s' }}>
            <Heart className="w-2 h-2 text-rose-400 fill-rose-400 opacity-60" />
          </span>
          <span className="absolute top-2 left-2 animate-float-up" style={{ animationDelay: '1.4s' }}>
            <Heart className="w-2.5 h-2.5 text-red-400 fill-red-400 opacity-60" />
          </span>
        </>
      )}
      
      {/* Custom CSS for floating hearts animation */}
      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0.6;
          }
          100% {
            transform: translateY(-80px) scale(0.3);
            opacity: 0;
          }
        }
        .animate-float-up {
          animation: float-up 3s ease-in infinite;
        }
      `}</style>
    </div>
  );
}
