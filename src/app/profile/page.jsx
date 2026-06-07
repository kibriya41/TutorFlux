"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  User,
  Mail,
  Calendar,
  Shield,
  BookOpen,
  GraduationCap,
  Clock,
  Edit3,
  Save,
  X,
  Camera,
  Loader2,
  CheckCircle2,
  Star,
  TrendingUp,
  Award,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [myTutors, setMyTutors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);

  // Profile edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editImage, setEditImage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Preset avatars for profile images
  const PRESET_AVATARS = [
    {
      name: "Alex (Student)",
      url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Sarah (Math)",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Jessica (Science)",
      url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "David (History)",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Ryan (Coding)",
      url: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Elena (Language)",
      url: "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?w=150&h=150&fit=crop&crop=face",
    },
  ];

  // Set page title
  useEffect(() => {
    document.title = "My Profile | TutorFlux";
  }, []);

  // Detect dark mode
  useEffect(() => {
    const checkDark = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  // Route guard
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view your profile.");
      router.push("/login?callbackUrl=%2Fprofile");
    }
  }, [session, isPending, router]);

  // Sync edit states with user
  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditImage(user.image || "");
    }
  }, [user, isEditModalOpen]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.email) return;
      setLoadingData(true);
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [bookingsRes, tutorsRes] = await Promise.allSettled([
          fetch(`https://tutorflux-serve-2.onrender.com/my-bookings?email=${user.email}`, { headers }),
          fetch(`https://tutorflux-serve-2.onrender.com/my-tutors?email=${user.email}`, { headers }),
        ]);

        if (bookingsRes.status === "fulfilled" && bookingsRes.value.ok) {
          const data = await bookingsRes.value.json();
          setBookings(data);
        }
        if (tutorsRes.status === "fulfilled" && tutorsRes.value.ok) {
          const data = await tutorsRes.value.json();
          setMyTutors(data);
        }
      } catch (err) {
        console.error("Stats fetch error:", err);
      } finally {
        setLoadingData(false);
      }
    };
    fetchStats();
  }, [user]);

  const handleSaveName = async () => {
    if (!editName.trim() || editName.trim() === user.name) {
      setIsEditing(false);
      return;
    }
    setSavingName(true);
    try {
      await authClient.updateUser({ name: editName.trim() });
      toast.success("Name updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update name.");
    } finally {
      setSavingName(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSavingProfile(true);
    try {
      await authClient.updateUser({
        name: editName.trim(),
        image: editImage.trim() || null,
      });
      toast.success("Profile updated successfully!");
      setIsEditModalOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const activeBookings = bookings.filter((b) => b.status !== "cancelled").length;
  const cancelledBookings = bookings.filter((b) => b.status === "cancelled").length;

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] transition-colors duration-500">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 h-52 md:h-64">
        {/* Animated blobs */}
        <div
          className="absolute -top-10 -left-10 w-64 h-64 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #fff 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-16 right-10 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #a5b4fc 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-10 right-1/3 w-40 h-40 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #818cf8 0%, transparent 70%)" }}
        />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8">
        {/* Profile Card */}
        <div className="relative -mt-20 md:-mt-24 mb-8">
          <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-xl shadow-slate-200/60 dark:shadow-black/30 p-6 md:p-8 border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Avatar */}
              <div 
                className="relative group cursor-pointer" 
                onClick={() => setIsEditModalOpen(true)}
                title="Click to edit profile picture"
              >
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-white dark:ring-[#111827] border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center relative">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white">{initials}</span>
                  )}
                  {/* Camera overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 rounded-2xl">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-2 border-white dark:border-[#111827] flex items-center justify-center shadow-md">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Name & Info */}
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      id="edit-name-input"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                      className="text-xl md:text-2xl font-bold bg-transparent border-b-2 border-blue-500 text-slate-900 dark:text-white outline-none w-full max-w-xs pr-2"
                      autoFocus
                    />
                    <button
                      id="save-name-btn"
                      onClick={handleSaveName}
                      disabled={savingName}
                      className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
                    >
                      {savingName ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      id="cancel-edit-btn"
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(user?.name || "");
                      }}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white truncate">
                      {user?.name}
                    </h1>
                    <button
                      id="edit-name-trigger"
                      onClick={() => setIsEditModalOpen(true)}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-500 hover:text-blue-600 transition"
                      title="Edit profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4 text-blue-500" />
                    {user?.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-500" />
                    Joined {memberSince}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-green-500" />
                    Verified Account
                  </span>
                </div>
              </div>

              {/* Role Badge */}
              <div className="flex flex-col items-end gap-3 shrink-0">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-sm font-semibold">
                  <Star className="w-4 h-4 fill-blue-500 text-blue-500" />
                  TutorFlux Member
                </span>
                <button
                  id="edit-profile-btn"
                  onClick={() => setIsEditModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-semibold shadow-sm transition-all duration-200 active:scale-95 text-sm"
                >
                  <Edit3 className="w-4 h-4 text-blue-500" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              id: "stat-total-bookings",
              icon: <BookOpen className="w-6 h-6" />,
              label: "Total Bookings",
              value: loadingData ? "—" : bookings.length,
              color: "blue",
              gradient: "from-blue-500 to-indigo-500",
              bg: "bg-blue-50 dark:bg-blue-900/20",
              iconColor: "text-blue-600 dark:text-blue-400",
            },
            {
              id: "stat-active-sessions",
              icon: <CheckCircle2 className="w-6 h-6" />,
              label: "Active Sessions",
              value: loadingData ? "—" : activeBookings,
              color: "green",
              gradient: "from-green-500 to-emerald-500",
              bg: "bg-green-50 dark:bg-green-900/20",
              iconColor: "text-green-600 dark:text-green-400",
            },
            {
              id: "stat-my-tutors",
              icon: <GraduationCap className="w-6 h-6" />,
              label: "My Tutors",
              value: loadingData ? "—" : myTutors.length,
              color: "purple",
              gradient: "from-purple-500 to-violet-500",
              bg: "bg-purple-50 dark:bg-purple-900/20",
              iconColor: "text-purple-600 dark:text-purple-400",
            },
            {
              id: "stat-cancelled",
              icon: <Clock className="w-6 h-6" />,
              label: "Cancelled",
              value: loadingData ? "—" : cancelledBookings,
              color: "rose",
              gradient: "from-rose-500 to-pink-500",
              bg: "bg-rose-50 dark:bg-rose-900/20",
              iconColor: "text-rose-600 dark:text-rose-400",
            },
          ].map((stat) => (
            <div
              id={stat.id}
              key={stat.id}
              className="bg-white dark:bg-[#111827] rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div
                className={`w-11 h-11 ${stat.bg} ${stat.iconColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {loadingData ? (
                  <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                ) : (
                  stat.value
                )}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {/* Account Details */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Account Details
              </h2>
            </div>

            <div className="space-y-4">
              {[
                { label: "Full Name", value: user?.name, icon: <User className="w-4 h-4" /> },
                { label: "Email Address", value: user?.email, icon: <Mail className="w-4 h-4" /> },
                {
                  label: "Account ID",
                  value: user?.id ? `#${user.id.slice(-8).toUpperCase()}` : "—",
                  icon: <Shield className="w-4 h-4" />,
                },
                {
                  label: "Member Since",
                  value: memberSince,
                  icon: <Calendar className="w-4 h-4" />,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50"
                >
                  <span className="mt-0.5 text-blue-500 dark:text-blue-400 shrink-0">
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-0.5">
                      {item.label}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {item.value || "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Recent Bookings
              </h2>
            </div>

            {loadingData ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 gap-3 text-slate-400">
                <BookOpen className="w-10 h-10 opacity-40" />
                <p className="text-sm">No bookings yet</p>
                <button
                  id="browse-tutors-btn"
                  onClick={() => router.push("/tutors")}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Browse tutors →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 4).map((booking, i) => (
                  <div
                    key={booking._id || i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {booking.tutorName}
                        </p>
                        <p className="text-xs text-slate-400">{booking.studentName}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ml-2 ${
                        booking.status === "cancelled"
                          ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                          : "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                      }`}
                    >
                      {booking.status === "cancelled" ? "Cancelled" : "Booked"}
                    </span>
                  </div>
                ))}
                {bookings.length > 4 && (
                  <button
                    id="view-all-bookings-btn"
                    onClick={() => router.push("/booked")}
                    className="w-full text-center text-xs text-blue-600 hover:underline font-medium pt-1"
                  >
                    View all {bookings.length} bookings →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Achievement Banner */}
        <div className="mb-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl shadow-indigo-500/20 overflow-hidden relative">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <Award className="w-9 h-9 text-white" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Keep up the great work!</h3>
            <p className="text-blue-100 text-sm mt-1">
              You have{" "}
              <span className="font-bold text-white">
                {loadingData ? "..." : activeBookings}
              </span>{" "}
              active learning{" "}
              {activeBookings === 1 ? "session" : "sessions"} and{" "}
              <span className="font-bold text-white">
                {loadingData ? "..." : myTutors.length}
              </span>{" "}
              {myTutors.length === 1 ? "tutor" : "tutors"} in your network. Stay consistent and excel!
            </p>
          </div>
          <button
            id="explore-more-btn"
            onClick={() => router.push("/tutors")}
            className="md:ml-auto shrink-0 bg-white text-indigo-700 font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition-all duration-200 text-sm"
          >
            Explore More Tutors
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-white dark:bg-[#111827] border border-slate-100 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl relative z-10 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Profile</h3>
                <button
                  id="close-edit-modal-btn"
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label htmlFor="edit-profile-name-input" className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      id="edit-profile-name-input"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Avatar URL Field */}
                <div>
                  <label htmlFor="edit-profile-image-input" className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                    Profile Image URL
                  </label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      id="edit-profile-image-input"
                      type="text"
                      value={editImage}
                      onChange={(e) => setEditImage(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl py-3 pl-10 pr-4 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Preset Avatars Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Or choose a preset avatar
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {PRESET_AVATARS.map((avatar, idx) => (
                      <button
                        key={idx}
                        onClick={() => setEditImage(avatar.url)}
                        className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                          editImage === avatar.url
                            ? "border-blue-500 scale-105 ring-2 ring-blue-500/20"
                            : "border-transparent hover:scale-105"
                        }`}
                        title={avatar.name}
                      >
                        <img src={avatar.url} alt={avatar.name} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  id="edit-profile-cancel-btn"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  id="edit-profile-save-btn"
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {savingProfile ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
