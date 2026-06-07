"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Search,
  ArrowLeft,
  Compass,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  RefreshCw,
  Trophy,
  ArrowRight
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [tokenPosition, setTokenPosition] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [particles, setParticles] = useState([]);
  const [isHoveringToken, setIsHoveringToken] = useState(false);
  const [gameDifficulty, setGameDifficulty] = useState("stable"); // 'stable' or 'flux' (runs away!)
  
  const gameAreaRef = useRef(null);

  // Set mounted and random initial token position on client load
  useEffect(() => {
    setMounted(true);
    randomizeTokenPosition();
  }, []);

  // Handle automatic drifting of the token
  useEffect(() => {
    if (!mounted || hasWon) return;

    const interval = setInterval(() => {
      // In stable mode, it drifts if not hovered. In flux mode, it drifts constantly.
      if (gameDifficulty === "flux" || !isHoveringToken) {
        randomizeTokenPosition();
      }
    }, gameDifficulty === "flux" ? 1400 : 2000);

    return () => clearInterval(interval);
  }, [mounted, hasWon, isHoveringToken, gameDifficulty]);

  const randomizeTokenPosition = () => {
    // Keep it within 15% to 85% of the container to prevent overflow
    const nextX = Math.floor(Math.random() * 70) + 15;
    const nextY = Math.floor(Math.random() * 70) + 15;
    setTokenPosition({ x: nextX, y: nextY });
  };

  const handleTokenHover = () => {
    setIsHoveringToken(true);
    // In 'flux' mode, the token teleports away when you try to hover it!
    if (gameDifficulty === "flux" && !hasWon) {
      randomizeTokenPosition();
    }
  };

  const handleTokenClick = (e) => {
    e.stopPropagation();
    if (hasWon) return;

    // Capture click coordinate relative to game area
    if (gameAreaRef.current) {
      const rect = gameAreaRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      triggerParticles(clickX, clickY);
    }

    const nextScore = score + 1;
    setScore(nextScore);

    if (nextScore >= 3) {
      setHasWon(true);
    } else {
      randomizeTokenPosition();
    }
  };

  const triggerParticles = (x, y) => {
    const newParticles = Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 360) / 16 + (Math.random() * 15 - 7.5);
      const speed = Math.random() * 80 + 60;
      const radians = (angle * Math.PI) / 180;
      
      return {
        id: Date.now() + i + Math.random(),
        x,
        y,
        targetX: Math.cos(radians) * speed,
        targetY: Math.sin(radians) * speed,
        color: ["#3b82f6", "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"][Math.floor(Math.random() * 6)],
        size: Math.random() * 6 + 4,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);
    // Cleanup particles
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.find((np) => np.id === p.id)));
    }, 1000);
  };

  const resetGame = () => {
    setScore(0);
    setHasWon(false);
    randomizeTokenPosition();
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tutors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  if (!mounted) {
    return null; // Avoid hydration flash
  }

  return (
    <div className="min-h-[85vh] bg-[#f8fafc] dark:bg-[#0a0e1a] relative overflow-hidden transition-colors duration-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* SEO Document Elements */}
      <title>404 - Page Not Found | TutorFlux</title>
      <meta name="description" content="The page you are looking for has drifted out of orbit in the scheduling flux. Search for verified expert tutors on TutorFlux." />
      
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -50, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-400/20 dark:bg-blue-900/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 40, 0],
            y: [0, 40, -50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 sm:w-108 sm:h-108 bg-purple-400/20 dark:bg-purple-900/10 rounded-full blur-[120px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(99,102,241,0.08)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-6xl w-full grid lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Navigation & Search */}
        <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
          
          {/* Glassmorphic Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm mb-6 backdrop-blur-sm"
          >
            <HelpCircle className="w-4 h-4 text-indigo-500 animate-bounce" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Lost in the Flux</span>
          </motion.div>

          {/* Glitch-like Heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            <h1 className="text-8xl sm:text-9xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-500 drop-shadow-[0_4px_12px_rgba(99,102,241,0.15)] leading-none select-none">
              404
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mt-4 tracking-tight"
          >
            Oops! You've drifted out of orbit.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-slate-500 dark:text-slate-400 mt-3 max-w-lg text-base sm:text-lg leading-relaxed"
          >
            This page has vanished into the scheduling flux. Let's get you back to your learning journey, or search for your next tutor right here.
          </motion.p>

          {/* Tutor Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full max-w-md mt-8"
          >
            <form onSubmit={handleSearchSubmit} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                id="not-found-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by tutor name or subject..."
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-4 pl-12 pr-28 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all shadow-md group-hover:border-slate-300 dark:group-hover:border-slate-700"
              />
              <button
                id="not-found-search-submit"
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 text-sm"
              >
                Search
              </button>
            </form>
          </motion.div>

          {/* Navigation Shortcuts */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-8 w-full"
          >
            <button
              id="not-found-back-btn"
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold px-5 py-3 rounded-2xl transition-all shadow-sm active:scale-98 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>

            <Link href="/" className="w-full sm:w-auto">
              <button
                id="not-found-home-btn"
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold px-5 py-3 rounded-2xl transition-all shadow-sm active:scale-98 text-sm"
              >
                <Home className="w-4 h-4" />
                Take Me Home
              </button>
            </Link>

            <Link href="/tutors" className="w-full sm:w-auto">
              <button
                id="not-found-tutors-btn"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 text-sm"
              >
                <Compass className="w-4 h-4" />
                Browse Tutors
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Right Column: Interactive Micro-Game */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-sm bg-white/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-2xl backdrop-blur-md"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500 animate-pulse" />
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Lost Token Catch</h3>
              </div>
              <div className="flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <Trophy className="w-3.5 h-3.5 fill-indigo-100 dark:fill-none" />
                Score: {score}/3
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 text-center">
              {hasWon
                ? "Excellent! System parameters fully restored."
                : "Help secure this runaway digital token. Catch it 3 times to open a portal shortcut!"}
            </p>

            {/* Difficulty Selector */}
            {!hasWon && (
              <div className="flex justify-center gap-2 mb-4">
                <button
                  id="not-found-game-difficulty-stable"
                  onClick={() => setGameDifficulty("stable")}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                    gameDifficulty === "stable"
                      ? "bg-slate-800 dark:bg-white text-white dark:text-slate-900 border-slate-800 dark:border-white shadow-sm"
                      : "bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Normal Mode
                </button>
                <button
                  id="not-found-game-difficulty-flux"
                  onClick={() => {
                    setGameDifficulty("flux");
                    randomizeTokenPosition();
                  }}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border transition-all ${
                    gameDifficulty === "flux"
                      ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white border-transparent shadow-sm"
                      : "bg-transparent text-slate-500 border-slate-200 dark:border-slate-800 hover:text-slate-700 dark:hover:text-slate-300"
                  }`}
                >
                  Flux Mode (Flee on Hover)
                </button>
              </div>
            )}

            {/* Game Screen Area */}
            <div
              ref={gameAreaRef}
              className="relative w-full h-48 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-hidden bg-slate-950/5 dark:bg-slate-950/40 backdrop-blur-sm select-none"
            >
              {/* Futuristic Scan Lines Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#3b82f612_1px,transparent_1px),linear-gradient(to_bottom,#3b82f612_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              
              {/* Dynamic Scanning Wave */}
              <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent pointer-events-none"
              />

              <AnimatePresence>
                {!hasWon ? (
                  /* Floating Token Badge */
                  <motion.div
                    key="token"
                    id="not-found-game-token"
                    style={{
                      left: `${tokenPosition.x}%`,
                      top: `${tokenPosition.y}%`,
                      position: "absolute",
                    }}
                    animate={{
                      x: "-50%",
                      y: "-50%",
                      scale: isHoveringToken ? 1.08 : 1,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: gameDifficulty === "flux" ? 220 : 120,
                      damping: gameDifficulty === "flux" ? 18 : 12,
                    }}
                    onMouseEnter={handleTokenHover}
                    onMouseLeave={() => setIsHoveringToken(false)}
                    onClick={handleTokenClick}
                    className="cursor-crosshair z-20"
                    whileTap={{ scale: 0.9 }}
                  >
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 10px rgba(99, 102, 241, 0.4)",
                          "0 0 20px rgba(99, 102, 241, 0.7)",
                          "0 0 10px rgba(99, 102, 241, 0.4)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-3 py-2 rounded-xl border border-white/20 text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 fill-white text-white" />
                      <span>FLUX_TOKEN</span>
                    </motion.div>
                  </motion.div>
                ) : (
                  /* Success Grid State */
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-emerald-500/10 dark:bg-emerald-500/5 z-20 text-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-3"
                    >
                      <Shield className="w-6 h-6 text-white fill-white" />
                    </motion.div>
                    <h4 className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                      Connection Restored!
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                      Shortcut portal unlocked. Click below to warp back to safety.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Particle Explosions Canvas */}
              {particles.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: p.x, y: p.y, scale: 1, opacity: 1 }}
                  animate={{
                    x: p.x + p.targetX,
                    y: p.y + p.targetY,
                    scale: 0.1,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: p.size,
                    height: p.size,
                    borderRadius: "50%",
                    backgroundColor: p.color,
                    pointerEvents: "none",
                    zIndex: 30,
                  }}
                />
              ))}
            </div>

            {/* Action/Reset button */}
            <div className="mt-5 flex items-center gap-3">
              {hasWon ? (
                <>
                  <Link href="/" className="flex-1">
                    <button
                      id="not-found-game-teleport-btn"
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold px-4 py-3 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-lg shadow-emerald-500/25 active:scale-98"
                    >
                      Teleport Home <ArrowRight className="w-4 h-4" />
                    </button>
                  </Link>
                  <button
                    id="not-found-game-reset-btn"
                    onClick={resetGame}
                    className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl transition-all shadow-sm active:scale-95"
                    title="Play Again"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  id="not-found-game-realign-btn"
                  onClick={randomizeTokenPosition}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-4 py-3 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-sm"
                >
                  <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                  Re-align Flux Grid
                </button>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
