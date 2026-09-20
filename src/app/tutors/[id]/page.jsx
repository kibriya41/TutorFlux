"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DeleteTutor } from "@/components/DeleteTutor";
import { EditTutor } from "@/components/EditTutor";
import {
  Star,
  MapPin,
  Clock,
  GraduationCap,
  BookOpen,
  Calendar,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  X,
  AlertTriangle,
  Info,
  ArrowLeft,
  ShieldCheck,
  Zap,
  CalendarCheck,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

const TutorDetailPage = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [tutor, setTutor] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [copiedContact, setCopiedContact] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    studentName: "",
    phone: "",
  });

  // Fetch tutor details
  useEffect(() => {
    fetch(`https://tutorflux-serve-2.onrender.com/tutor/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Tutor not found");
        return res.json();
      })
      .then((data) => {
        setTutor(data);
        setLoadingTutor(false);
      })
      .catch((err) => {
        console.error(err);
        setLoadingTutor(false);
      });
  }, [id]);

  // Dynamic document title
  useEffect(() => {
    if (tutor?.tutorName) {
      document.title = `${tutor.tutorName} - Verified Tutor Profile | TutorFlux`;
    } else {
      document.title = "Tutor Profile Details | TutorFlux";
    }
  }, [tutor]);

  // Protect route
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view tutor profile and book sessions.");
      router.push(`/login?callbackUrl=${encodeURIComponent(`/tutors/${id}`)}`);
    }
  }, [session, isPending, router, id]);

  // Auto fill booking fields once session is loaded
  useEffect(() => {
    if (user) {
      setBookingForm((prev) => ({
        ...prev,
        studentName: user.name || "",
      }));
    }
  }, [user]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const copyContactEmail = () => {
    if (tutor?.email) {
      navigator.clipboard.writeText(tutor.email);
      setCopiedContact(true);
      toast.success("Tutor email copied to clipboard!");
      setTimeout(() => setCopiedContact(false), 2000);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to book a session.");
      return;
    }

    // 1. Verify slot limit
    const totalSlot = parseInt(tutor.totalSlot) || 0;
    if (totalSlot <= 0) {
      toast.error("No available slots left for this tutor.");
      return;
    }

    // 2. Verify Session Date Restriction
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const sessionDate = new Date(tutor.sessionStartDate);
    sessionDate.setHours(0, 0, 0, 0);
    if (currentDate < sessionDate) {
      toast.error("Booking is not available yet. Please wait until the start date.");
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://tutorflux-serve-2.onrender.com/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tutorId: tutor._id,
          tutorName: tutor.tutorName,
          studentName: bookingForm.studentName || user.name,
          studentEmail: user.email,
          studentPhone: bookingForm.phone,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Session booked successfully! Token generated.");
        setIsModalOpen(false);
        // Decrease slots locally
        setTutor((prev) => ({
          ...prev,
          totalSlot: Math.max(0, parseInt(prev.totalSlot) - 1),
        }));
      } else {
        toast.error(data.message || "Failed to book session");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (isPending || loadingTutor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-500 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
          Loading tutor profile details...
        </p>
      </div>
    );
  }

  if (!session || !tutor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Tutor Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            The tutor listing you are looking for might have been removed or does not exist.
          </p>
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Tutors
          </Link>
        </div>
      </div>
    );
  }

  // Parse institution & experience
  const [institution, experienceYears] = (tutor.institutionExperience || "Independent,0").split(",");
  const experience = `${experienceYears || "0"} Years Experience`;

  // Booking Checks
  const totalSlotsLeft = parseInt(tutor.totalSlot) || 0;
  const isFullyBooked = totalSlotsLeft <= 0;

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  const sessionDate = new Date(tutor.sessionStartDate);
  sessionDate.setHours(0, 0, 0, 0);
  const isNotAvailableYet = currentDate < sessionDate;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 pb-16 transition-colors duration-300">
      {/* ═══ Breadcrumb & Navigation Bar ═══ */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tutors</span>
          </Link>

          <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:inline-block">
            Tutor ID: {tutor._id}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ═══ Left Column: Main Profile & Details ═══ */}
          <div className="lg:col-span-8 space-y-8">
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-start">
                {/* Profile Image with badge */}
                <div className="relative shrink-0 mx-auto sm:mx-0">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shadow-lg border-2 border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={
                        tutor.photo ||
                        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop"
                      }
                      alt={tutor.tutorName}
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center 20%" }}
                    />
                  </div>
                  <div
                    className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:-right-2 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md flex items-center gap-1 ${
                      isFullyBooked ? "bg-rose-600" : "bg-emerald-600"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>{isFullyBooked ? "Fully Booked" : "Available Now"}</span>
                  </div>
                </div>

                {/* Info Header */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div>
                      <span className="inline-block bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-3 py-1 rounded-full mb-2">
                        {tutor.subject || "Academic Mentor"}
                      </span>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        {tutor.tutorName}
                      </h1>
                    </div>

                    {/* Owner Edit & Delete Buttons */}
                    {user?.email === tutor.email && (
                      <div className="flex items-center gap-2 justify-center sm:justify-start">
                        <EditTutor
                          tutor={tutor}
                          onUpdate={() => {
                            fetch(`https://tutorflux-serve-2.onrender.com/tutor/${id}`)
                              .then((r) => r.json())
                              .then((data) => setTutor(data));
                          }}
                        />
                        <DeleteTutor tutor={tutor} onDeleted={() => router.push("/my-tutors")} />
                      </div>
                    )}
                  </div>

                  {/* Rating & Stats row */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-800/50 px-2.5 py-1 rounded-xl">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        {tutor.rating || "4.9"}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">(140+ reviews)</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{experience}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{tutor.location || "Online"}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      Mode: {tutor.teachingMode || "Online"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-purple-500" />
                      {tutor.availableDays || "Flexible Schedule"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking CTA Bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-blue-400">
                      ${tutor.hourlyFee || "35"}
                    </span>
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      / hour per session
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {totalSlotsLeft > 0
                      ? `${totalSlotsLeft} active booking slots remaining`
                      : "Zero slots left for the current batch"}
                  </p>
                </div>

                {isFullyBooked ? (
                  <div className="inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>No available slots left. Check back later!</span>
                  </div>
                ) : isNotAvailableYet ? (
                  <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold">
                    <Info className="w-4 h-4 shrink-0" />
                    <span>
                      Booking starts on{" "}
                      {new Date(tutor.sessionStartDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <Zap className="w-5 h-5" />
                    <span>Book a Session Now</span>
                  </button>
                )}
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                About the Tutor
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base whitespace-pre-line">
                {tutor.description ||
                  `Dedicated academic tutor with years of teaching experience. Specializes in building core foundational concepts, exam preparation strategies, and personalized study schedules designed for student success.`}
              </p>

              {/* Highlight Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  {
                    icon: GraduationCap,
                    label: "Institution / Background",
                    value: institution || "Verified Academic Institution",
                  },
                  {
                    icon: Clock,
                    label: "Daily Available Time",
                    value: tutor.availableTime || "Flexible Time Slots",
                  },
                  {
                    icon: Calendar,
                    label: "Available Teaching Days",
                    value: tutor.availableDays || "Monday - Friday",
                  },
                  {
                    icon: BookOpen,
                    label: "Total Session Slots",
                    value: `${tutor.totalSlot || "0"} Sessions Allocated`,
                  },
                  {
                    icon: CalendarCheck,
                    label: "Session Start Date",
                    value: new Date(tutor.sessionStartDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }),
                  },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={index}
                      className="flex gap-4 p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all"
                    >
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-100/60 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                          {item.label}
                        </p>
                        <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mt-0.5">
                          {item.value}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═══ Right Column: Contact & Safety Sidebar ═══ */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 sticky top-24">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">
                Tutor Information
              </h3>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <User className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="font-medium text-slate-900 dark:text-white">{tutor.tutorName}</span>
                </div>

                <div className="flex items-center justify-between gap-2 text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3 truncate">
                    <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                    <span className="truncate">{tutor.email || "Contact via platform"}</span>
                  </div>
                  {tutor.email && (
                    <button
                      type="button"
                      onClick={copyContactEmail}
                      className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Copy email"
                      aria-label="Copy tutor email"
                    >
                      {copiedContact ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{tutor.phone || "+880 1XXX-XXXXXX"}</span>
                </div>

                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>{tutor.location || "Online"}</span>
                </div>
              </div>

              {/* Safety Pledge Card */}
              <div className="mt-6 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>TutorFlux Student Guarantee</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Every booking generates a verifiable digital session token. Verified tutors with background review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Accessible Booking Modal ═══ */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="booking-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                    Confirm Session Booking
                  </h3>
                  <p className="text-xs text-slate-400">Step 1 of 1 • 100% Secure</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                aria-label="Close booking modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Session Summary Card */}
            <div className="px-6 pt-5">
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      tutor.photo ||
                      "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"
                    }
                    alt={tutor.tutorName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">
                      {tutor.subject}
                    </span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {tutor.tutorName}
                    </h4>
                    <span className="text-xs text-slate-400 block">{tutor.teachingMode} Session</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    ${tutor.hourlyFee}
                  </span>
                  <span className="text-xs text-slate-400 block">/ hour</span>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="px-6 py-5 space-y-4">
              {/* Student Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={bookingForm.studentName}
                  onChange={(e) =>
                    setBookingForm((prev) => ({ ...prev, studentName: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Student Email */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Registered Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-sm font-medium cursor-not-allowed"
                />
              </div>

              {/* Student Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Contact Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={bookingForm.phone}
                  onChange={(e) =>
                    setBookingForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={bookingLoading}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition disabled:opacity-60"
                >
                  {bookingLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorDetailPage;