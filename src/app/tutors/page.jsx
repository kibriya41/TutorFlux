"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  CalendarDays,
  BookOpen,
  MapPin,
  Clock3,
  Star,
  Heart,
  Filter,
  X,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  ArrowRight,
  Zap,
  CheckCircle2,
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  Share2,
  Eye,
  GraduationCap,
  RotateCcw,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 16 },
  },
};

const statsCounter = {
  hidden: { opacity: 0, scale: 0.7 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, type: "spring", stiffness: 180 },
  }),
};

const subjectsList = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Programming",
  "History",
  "Economics",
  "Statistics",
];

const TutorsPage = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [teachingModeFilter, setTeachingModeFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  /* ─── Dynamic Title ─── */
  useEffect(() => {
    document.title = "Find Verified Expert Tutors | TutorFlux";
  }, []);

  /* ─── Intersection Observer for Stats ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  /* ─── Fetch Tutors ─── */
  const fetchTutors = useCallback(async () => {
    try {
      setLoading(true);
      let url = "https://tutorflux-serve-2.onrender.com/tutor";
      const queryParams = [];
      if (search.trim()) queryParams.push(`search=${encodeURIComponent(search.trim())}`);
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

      const res = await fetch(url);
      const data = await res.json();
      const tutorArray = Array.isArray(data) ? data : data.tutors || [];
      setTutors(tutorArray);
    } catch (error) {
      console.error("Failed to fetch tutors:", error);
    } finally {
      setTimeout(() => setLoading(false), 350);
    }
  }, [search, startDate, endDate]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  /* ─── Debounced Search ─── */
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTutors();
    }, 450);
    return () => clearTimeout(timer);
  }, [search, startDate, endDate, fetchTutors]);

  /* ─── Filter & Sort ─── */
  const filteredTutors = tutors
    .filter((t) => {
      const matchSubject = subjectFilter === "All" || t.subject === subjectFilter;
      const matchMode =
        teachingModeFilter === "All" ||
        t.teachingMode?.toLowerCase() === teachingModeFilter.toLowerCase() ||
        t.teachingMode?.toLowerCase() === "both";
      return matchSubject && matchMode;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (parseInt(a.hourlyFee) || 0) - (parseInt(b.hourlyFee) || 0);
      if (sortBy === "price-high") return (parseInt(b.hourlyFee) || 0) - (parseInt(a.hourlyFee) || 0);
      if (sortBy === "rating") return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      if (sortBy === "experience") {
        const expA = parseInt((a.institutionExperience || "0").split(",")[1]) || 0;
        const expB = parseInt((b.institutionExperience || "0").split(",")[1]) || 0;
        return expB - expA;
      }
      return 0;
    });

  /* ─── Toggle Favorite ─── */
  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  /* ─── Clear All Filters ─── */
  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setSubjectFilter("All");
    setTeachingModeFilter("All");
    setSortBy("recommended");
  };

  const hasActiveFilters =
    search || startDate || endDate || subjectFilter !== "All" || teachingModeFilter !== "All";

  /* ─── Stats Data ─── */
  const stats = [
    { icon: Users, value: tutors.length || "150+", label: "Verified Tutors", color: "from-blue-500 to-indigo-600" },
    { icon: TrendingUp, value: "99.2%", label: "Satisfaction Rate", color: "from-emerald-500 to-teal-600" },
    { icon: Award, value: "4.9/5", label: "Average Rating", color: "from-amber-500 to-orange-600" },
    { icon: Sparkles, value: "10K+", label: "Completed Sessions", color: "from-purple-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* ═══ Header Hero Section ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 pt-12 pb-20 md:pt-16 md:pb-28">
        {/* Glow backdrop shapes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/15 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/15 dark:bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">
                Verified Online & In-Person Tutors
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">
              Find Your Ideal{" "}
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-300 bg-clip-text text-transparent">
                Expert Tutor
              </span>
            </h1>

            <p className="text-base sm:text-lg text-blue-100/90 dark:text-slate-300 max-w-2xl mx-auto font-normal">
              Book 1-on-1 personalized sessions with verified academic mentors. Get instant scheduling tokens and achieve your goals.
            </p>
          </motion.div>

          {/* Integrated Search & Date Range Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-4xl mx-auto mt-8 sm:mt-10"
          >
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/40 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-2xl shadow-indigo-950/30">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchTutors();
                }}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
              >
                {/* Search Name Input */}
                <div className="sm:col-span-5 relative">
                  <label htmlFor="tutor-search-input" className="sr-only">
                    Search tutor name or subject
                  </label>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                  <input
                    id="tutor-search-input"
                    type="text"
                    placeholder="Search by tutor name, subject..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-12 sm:h-13 pl-11 pr-4 rounded-xl sm:rounded-2xl bg-slate-100/80 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-slate-200/60 dark:border-slate-700/60"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      aria-label="Clear search text"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Start Date */}
                <div className="sm:col-span-3 relative">
                  <label htmlFor="start-date-input" className="sr-only">
                    Session Start Date
                  </label>
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    id="start-date-input"
                    type="date"
                    title="Filter by session start date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-12 sm:h-13 pl-10 pr-2 rounded-xl sm:rounded-2xl bg-slate-100/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-slate-200/60 dark:border-slate-700/60"
                  />
                </div>

                {/* End Date */}
                <div className="sm:col-span-3 relative">
                  <label htmlFor="end-date-input" className="sr-only">
                    Session End Date
                  </label>
                  <CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                  <input
                    id="end-date-input"
                    type="date"
                    title="Filter by session end date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-12 sm:h-13 pl-10 pr-2 rounded-xl sm:rounded-2xl bg-slate-100/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-slate-200/60 dark:border-slate-700/60"
                  />
                </div>

                {/* Search Action Button */}
                <div className="sm:col-span-1">
                  <button
                    type="submit"
                    aria-label="Search tutors"
                    className="w-full h-12 sm:h-13 rounded-xl sm:rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold transition-all shadow-md shadow-blue-500/30 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Floating Metric Counters ═══ */}
      <section ref={statsRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={statsVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5"
        >
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                custom={i}
                variants={statsCounter}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 shadow-lg shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-slate-800 flex items-center gap-3.5 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shrink-0 shadow-md`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ═══ Main Listings & Controls ═══ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Category Pill Bar & Filter Controls */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Available Tutors
              </h2>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Showing <strong className="text-blue-600 dark:text-blue-400">{filteredTutors.length}</strong> verified tutors
                {hasActiveFilters && " with selected filters"}
              </p>
            </div>

            {/* View Mode & Sort Controls */}
            <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
              {/* Teaching Mode quick filter */}
              <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800 text-xs font-semibold shadow-xs">
                {["All", "Online", "Offline"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTeachingModeFilter(mode)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      teachingModeFilter === mode
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-600"
                    }`}
                  >
                    {mode === "All" ? "All Modes" : mode}
                  </button>
                ))}
              </div>

              {/* View toggle (Grid / List) */}
              <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800 shadow-xs">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid View"
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List View"
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-500 shadow-xs transition-colors"
                >
                  <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Sort By</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {showSortDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-30 py-1.5 overflow-hidden"
                    >
                      {[
                        { key: "recommended", label: "Recommended" },
                        { key: "rating", label: "Highest Rated" },
                        { key: "price-low", label: "Hourly Fee: Low to High" },
                        { key: "price-high", label: "Hourly Fee: High to Low" },
                        { key: "experience", label: "Most Experienced" },
                      ].map((opt) => (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => {
                            setSortBy(opt.key);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors flex items-center justify-between ${
                            sortBy === opt.key
                              ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span>{opt.label}</span>
                          {sortBy === opt.key && <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Subject Pills (Scrollable horizontally on mobile) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
            {subjectsList.map((subject) => {
              const isSelected = subjectFilter === subject;
              return (
                <button
                  key={subject}
                  onClick={() => setSubjectFilter(subject)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 shrink-0 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-[1.02]"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 hover:text-blue-600"
                  }`}
                >
                  {subject}
                </button>
              );
            })}
          </div>

          {/* Active Filter Badges */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Active Filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-200/60 dark:border-blue-800/60">
                  Search: &ldquo;{search}&rdquo;
                  <button onClick={() => setSearch("")} aria-label="Remove search filter">
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {subjectFilter !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-200/60 dark:border-blue-800/60">
                  Subject: {subjectFilter}
                  <button onClick={() => setSubjectFilter("All")} aria-label="Remove subject filter">
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {teachingModeFilter !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium border border-blue-200/60 dark:border-blue-800/60">
                  Mode: {teachingModeFilter}
                  <button onClick={() => setTeachingModeFilter("All")} aria-label="Remove mode filter">
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              {(startDate || endDate) && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700">
                  Dates: {startDate || "Any"} to {endDate || "Any"}
                  <button
                    onClick={() => {
                      setStartDate("");
                      setEndDate("");
                    }}
                    aria-label="Remove date range filter"
                  >
                    <X className="w-3 h-3 hover:text-red-500" />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline ml-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset all
              </button>
            </div>
          )}
        </div>

        {/* ═══ Content Display States ═══ */}
        {loading ? (
          /* Skeleton Loading Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 space-y-4 animate-pulse"
              >
                <div className="h-52 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-1/2" />
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded-md w-20" />
                  <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTutors.length === 0 ? (
          /* Empty Search / Filter State */
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto shadow-sm"
          >
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xs">
              <Search className="w-9 h-9" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No matching tutors found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              We couldn&apos;t find any tutors matching your search keywords or applied filters. Try broadening your criteria or reset filters.
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/25 transition-all"
            >
              <RotateCcw className="w-4 h-4" /> Reset All Filters
            </button>
          </motion.div>
        ) : viewMode === "grid" ? (
          /* ═══ GRID VIEW ═══ */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTutors.map((tutor) => {
              const [institutionName, expYears] = (tutor.institutionExperience || "Independent,0").split(",");
              const slotsLeft = parseInt(tutor.totalSlot) || 0;
              const isAvailable = slotsLeft > 0;

              return (
                <motion.div
                  key={tutor._id}
                  variants={cardVariants}
                  layout
                  onMouseEnter={() => setHoveredCard(tutor._id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-all duration-300"
                >
                  {/* Photo Container */}
                  <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <img
                      src={
                        tutor.photo ||
                        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop"
                      }
                      alt={tutor.tutorName || "Tutor profile"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{ objectPosition: "center 20%" }}
                      loading="lazy"
                    />

                    {/* Gradient shadow for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Subject Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-md">
                        {tutor.subject || "Academic"}
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(tutor._id, e)}
                      aria-label="Save tutor to favorites"
                      className="absolute top-4 right-4 w-9 h-9 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-md text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.has(tutor._id)
                            ? "fill-rose-500 text-rose-500"
                            : "hover:fill-rose-500 hover:text-rose-500"
                        }`}
                      />
                    </button>

                    {/* Bottom Status / Mode Tag on Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md text-white ${
                          isAvailable ? "bg-emerald-600/90" : "bg-rose-600/90"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {isAvailable ? `${slotsLeft} Slots Left` : "Fully Booked"}
                      </span>

                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-semibold rounded-lg">
                        {tutor.teachingMode || "Online"}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Name & Rating */}
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                            {tutor.tutorName || "Expert Tutor"}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 flex items-center gap-1">
                            <GraduationCap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>{institutionName || "Academic Instructor"}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50 px-2 py-0.5 rounded-lg shrink-0">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                            {tutor.rating || "4.9"}
                          </span>
                        </div>
                      </div>

                      {/* Brief Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                        {tutor.description ||
                          `Experienced ${tutor.subject || "subject"} tutor dedicated to helping students understand core principles and achieve exam excellence.`}
                      </p>

                      {/* Info Badges */}
                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-2.5 py-1.5">
                          <Clock3 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{expYears || "3+"} yrs exp.</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 rounded-xl px-2.5 py-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                          <span className="truncate">{tutor.location || "Remote"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Primary CTA */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xl font-black text-slate-900 dark:text-white">
                            ${tutor.hourlyFee || "30"}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">/hr</span>
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate max-w-[120px]">
                          {tutor.availableDays || "Flexible Days"}
                        </span>
                      </div>

                      <Link
                        href={`/tutors/${tutor._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-500/25 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* ═══ LIST VIEW ═══ */
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {filteredTutors.map((tutor) => {
              const [institutionName, expYears] = (tutor.institutionExperience || "Independent,0").split(",");
              const slotsLeft = parseInt(tutor.totalSlot) || 0;
              const isAvailable = slotsLeft > 0;

              return (
                <motion.div
                  key={tutor._id}
                  variants={cardVariants}
                  layout
                  className="group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 p-4 sm:p-5"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                    {/* List Image */}
                    <div className="relative w-full sm:w-44 h-48 sm:h-36 shrink-0 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <img
                        src={
                          tutor.photo ||
                          "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop"
                        }
                        alt={tutor.tutorName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ objectPosition: "center 20%" }}
                      />
                      <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                        {tutor.subject || "General"}
                      </span>
                    </div>

                    {/* List Content */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {tutor.tutorName}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {institutionName} • {expYears || "0"} Years Experience
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50 px-2.5 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-amber-700 dark:text-amber-400">
                            {tutor.rating || "4.9"}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                        {tutor.description}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400 pt-1">
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <MapPin className="w-3 h-3 text-blue-500" /> {tutor.location || "Online"}
                        </span>
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <BookOpen className="w-3 h-3 text-blue-500" /> {tutor.teachingMode || "Online"}
                        </span>
                        <span
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold ${
                            isAvailable
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                              : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          {isAvailable ? `${slotsLeft} slots remaining` : "Fully Booked"}
                        </span>
                      </div>
                    </div>

                    {/* List Price & CTA */}
                    <div className="sm:border-l sm:border-slate-100 dark:sm:border-slate-800 sm:pl-6 flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          ${tutor.hourlyFee || "0"}
                        </span>
                        <span className="text-xs text-slate-400">/hr</span>
                      </div>

                      <Link
                        href={`/tutors/${tutor._id}`}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/25 transition-all"
                      >
                        Book Session
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </main>

      {/* ═══ Bottom Help Banner ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 text-white overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                Can&apos;t find your preferred tutor?
              </h3>
              <p className="text-blue-100 text-sm sm:text-base max-w-xl">
                Try clearing active filters or explore all subjects. New expert tutors join TutorFlux daily!
              </p>
            </div>
            <button
              onClick={clearFilters}
              className="px-6 py-3.5 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 rounded-xl font-bold text-sm shadow-lg transition-all shrink-0"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TutorsPage;