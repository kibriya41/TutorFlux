"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── Animation Variants ─── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const statsCounter = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, type: "spring", stiffness: 200 },
  }),
};

/* ─── Component ─── */
const TutorsPage = () => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [favorites, setFavorites] = useState(new Set());
  const [hoveredCard, setHoveredCard] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef(null);

  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "Programming", "History", "Economics", "Statistics"];

  /* ─── Intersection Observer for Stats ─── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
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
      if (search) queryParams.push(`search=${search}`);
      if (startDate) queryParams.push(`startDate=${startDate}`);
      if (endDate) queryParams.push(`endDate=${endDate}`);
      if (queryParams.length > 0) url += `?${queryParams.join("&")}`;

      const res = await fetch(url);
      const data = await res.json();
      setTutors(data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }, [search, startDate, endDate]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  /* ─── Debounced Search ─── */
  useEffect(() => {
    const timer = setTimeout(() => fetchTutors(), 400);
    return () => clearTimeout(timer);
  }, [search, startDate, endDate, fetchTutors]);

  /* ─── Filter & Sort ─── */
  const filteredTutors = tutors
    .filter((t) => subjectFilter === "All" || t.subject === subjectFilter)
    .sort((a, b) => {
      if (sortBy === "price-low") return (parseInt(a.hourlyFee) || 0) - (parseInt(b.hourlyFee) || 0);
      if (sortBy === "price-high") return (parseInt(b.hourlyFee) || 0) - (parseInt(a.hourlyFee) || 0);
      if (sortBy === "rating") return (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0);
      if (sortBy === "experience") return (parseInt(b.experience) || 0) - (parseInt(a.experience) || 0);
      return 0;
    });

  /* ─── Toggle Favorite ─── */
  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  /* ─── Clear All Filters ─── */
  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setSubjectFilter("All");
    setSortBy("recommended");
  };

  const hasActiveFilters = search || startDate || endDate || subjectFilter !== "All";

  /* ─── Stats Data ─── */
  const stats = [
    { icon: Users, value: tutors.length, label: "Expert Tutors", color: "from-violet-500 to-purple-600" },
    { icon: TrendingUp, value: "98%", label: "Success Rate", color: "from-emerald-500 to-teal-600" },
    { icon: Award, value: "4.9", label: "Avg. Rating", color: "from-amber-500 to-orange-600" },
    { icon: Sparkles, value: "20K+", label: "Sessions Booked", color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0a0e1a]">
      {/* ═══ Hero Section ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 dark:from-violet-900 dark:via-purple-900 dark:to-indigo-950">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white/90 text-sm font-medium">Discover 500+ Expert Tutors</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Find Your Perfect{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-amber-400 bg-clip-text text-transparent">
                Tutor
              </span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Connect with verified expert tutors for personalized online learning.
              Book sessions, get digital tokens, and learn without scheduling conflicts.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="max-w-4xl mx-auto mt-10"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-2 shadow-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchTutors();
                }}
                className="grid grid-cols-1 md:grid-cols-12 gap-2"
              >
                <div className="md:col-span-5 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by tutor name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm text-base placeholder:text-gray-400"
                  />
                </div>

                <div className="md:col-span-3 relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm text-base"
                  />
                </div>

                <div className="md:col-span-3 relative">
                  <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-gray-900 text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-violet-400 border-0 shadow-sm text-base"
                  />
                </div>

                <button
                  type="submit"
                  className="md:col-span-1 h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-violet-500/25 flex items-center justify-center group"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f8f9fc"
              className="dark:fill-[#0a0e1a]"
            />
          </svg>
        </div>
      </section>

      {/* ═══ Stats Section ═══ */}
      <section ref={statsRef} className="max-w-7xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={statsVisible ? "visible" : "hidden"}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statsCounter}
              className="bg-white dark:bg-[#111827] rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ═══ Main Content ═══ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Available Tutors
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {filteredTutors.length} {filteredTutors.length === 1 ? "tutor" : "tutors"} found
              {hasActiveFilters && <span className="text-violet-600 dark:text-violet-400 ml-1">with filters applied</span>}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Subject Pills */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {subjects.slice(0, 5).map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubjectFilter(sub)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    subjectFilter === sub
                      ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 scale-105"
                      : "bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-400 hover:text-violet-600"
                  }`}
                >
                  {sub}
                </button>
              ))}
              {subjects.length > 5 && (
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-violet-400 flex items-center gap-1"
                  >
                    More <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                  </button>
                </div>
              )}
            </div>

            {/* View Toggle */}
            <div className="flex items-center bg-white dark:bg-[#111827] rounded-xl border border-gray-200 dark:border-gray-700 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-violet-100 dark:bg-violet-900/30 text-violet-600" : "text-gray-400 hover:text-gray-600"}`}
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-violet-400 transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Sort
                <ChevronDown className={`w-4 h-4 transition-transform ${showSortDropdown ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden"
                  >
                    {[
                      { key: "recommended", label: "Recommended" },
                      { key: "rating", label: "Highest Rated" },
                      { key: "price-low", label: "Price: Low to High" },
                      { key: "price-high", label: "Price: High to Low" },
                      { key: "experience", label: "Most Experienced" },
                    ].map((opt) => (
                      <button
                        key={opt.key}
                        onClick={() => {
                          setSortBy(opt.key);
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-colors flex items-center justify-between ${
                          sortBy === opt.key
                            ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                      >
                        {opt.label}
                        {sortBy === opt.key && <CheckCircle2 className="w-4 h-4" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                showFilters
                  ? "bg-violet-600 text-white"
                  : "bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Active Filters */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap items-center gap-2 mb-6 overflow-hidden"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm">
                  Search: {search}
                  <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {subjectFilter !== "All" && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-full text-sm">
                  {subjectFilter}
                  <button onClick={() => setSubjectFilter("All")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {startDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  From: {startDate}
                  <button onClick={() => setStartDate("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                  To: {endDate}
                  <button onClick={() => setEndDate("")}><X className="w-3 h-3" /></button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600 font-medium ml-2"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-violet-200 dark:border-violet-900 border-t-violet-600 rounded-full"
            />
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-gray-500 dark:text-gray-400 font-medium"
            >
              Finding the best tutors for you...
            </motion.p>
          </div>
        ) : filteredTutors.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No tutors found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
              We couldn&apos;t find any tutors matching your criteria. Try adjusting your search or filters.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-all inline-flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Clear Filters
            </button>
          </motion.div>
        ) : viewMode === "grid" ? (
          /* ═══ GRID VIEW - FIXED IMAGE POSITIONING ═══ */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredTutors.map((tutor, index) => (
              <motion.div
                key={tutor._id}
                variants={cardVariants}
                layout
                onMouseEnter={() => setHoveredCard(tutor._id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative"
              >
                <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-violet-500/10 dark:hover:shadow-violet-900/20 transition-all duration-500">
                  {/* ═══ FIXED IMAGE CONTAINER ═══ */}
                  <div className="relative h-72 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {/* 
                      KEY FIX: object-position: center 20% 
                      This positions the image to show the upper portion (face/head) 
                      instead of cropping from the top
                    */}
                    <motion.img
                      src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop"}
                      alt={tutor.tutorName}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center 20%" }}
                      animate={{ scale: hoveredCard === tutor._id ? 1.08 : 1 }}
                      transition={{ duration: 0.6 }}
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Subject Badge */}
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="absolute top-4 left-4"
                    >
                      <span className="px-3 py-1.5 bg-violet-600 text-white text-xs font-bold rounded-full shadow-lg">
                        {tutor.subject || "General"}
                      </span>
                    </motion.div>

                    {/* Favorite Button */}
                    <motion.button
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => toggleFavorite(tutor._id, e)}
                      className="absolute top-4 right-4 w-10 h-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Heart
                        className={`w-5 h-5 transition-colors ${
                          favorites.has(tutor._id)
                            ? "fill-rose-500 text-rose-500"
                            : "text-gray-500 hover:text-rose-500"
                        }`}
                      />
                    </motion.button>

                    {/* Quick Actions Overlay */}
                    <AnimatePresence>
                      {hoveredCard === tutor._id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute bottom-4 left-4 right-4 flex gap-2"
                        >
                          <Link href={`/tutors/${tutor._id}`} className="flex-1 py-2.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl text-sm font-medium text-gray-800 dark:text-white hover:bg-white transition-colors flex items-center justify-center gap-2">
                            <Eye className="w-4 h-4" /> Quick View
                          </Link>
                          <button className="w-10 h-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-white transition-colors">
                            <Share2 className="w-4 h-4 text-gray-600" />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                          {tutor.tutorName || "Unknown Tutor"}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {tutor.institution || "Independent Tutor"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                          {tutor.rating || "4.8"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 line-clamp-2 leading-relaxed">
                      {tutor.description || `Expert ${tutor.subject || "subject"} tutor with ${tutor.experience || "several"} years of experience helping students achieve their academic goals.`}
                    </p>

                    {/* Info Grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                        <MapPin className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="truncate">{tutor.location || "Online"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                        <Clock3 className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="truncate">{tutor.institutionExperience || "0"} yrs exp.</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                        <CalendarDays className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="truncate">{tutor.availableDays || "Mon-Fri"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2">
                        <BookOpen className="w-4 h-4 text-violet-500 shrink-0" />
                        <span className="truncate">{tutor.teachingMode || "Online"}</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                            ${tutor.hourlyFee || "0"}
                          </span>
                          <span className="text-sm text-gray-400">/hour</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Zap className="w-3 h-3 text-emerald-500" />
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            {parseInt(tutor.totalSlot) > 0 ? `${tutor.totalSlot} slots left` : "Fully Booked"}
                          </span>
                        </div>
                      </div>

                      <Link href={`/tutors/${tutor._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05, x: 3 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 h-11 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all flex items-center gap-2 group/btn"
                        >
                          Book Now
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* ═══ LIST VIEW - FIXED IMAGE POSITIONING ═══ */
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {filteredTutors.map((tutor) => (
              <motion.div
                key={tutor._id}
                variants={cardVariants}
                layout
                className="group bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* ═══ FIXED LIST IMAGE ═══ */}
                  <div className="relative w-full md:w-56 h-56 md:h-auto shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <motion.img
                      src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop"}
                      alt={tutor.tutorName}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center 20%" }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.4 }}
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-violet-600 text-white text-xs font-bold rounded-full">
                      {tutor.subject || "General"}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tutor.tutorName || "Unknown Tutor"}</h3>
                        <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-lg">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{tutor.rating || "4.8"}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{tutor.institution || "Independent Tutor"}</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {tutor.location || "Online"}</span>
                        <span className="flex items-center gap-1"><Clock3 className="w-3.5 h-3.5" /> {tutor.experience || "0"} yrs</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {tutor.teachingMode || "Online"}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 md:border-l md:border-gray-100 dark:md:border-gray-800 md:pl-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">${tutor.hourlyFee || "0"}</div>
                        <div className="text-xs text-gray-400">/hour</div>
                      </div>
                      <Link href={`/tutors/${tutor._id}`}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 h-11 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold shadow-lg transition-all"
                        >
                          Book
                        </motion.button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ═══ CTA Section ═══ */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-3xl p-8 md:p-12 overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Can&apos;t find the right tutor?
              </h3>
              <p className="text-white/70">
                Browse all subjects or post a request for tutors to find you.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 bg-white text-violet-600 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              Browse All Subjects <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default TutorsPage;