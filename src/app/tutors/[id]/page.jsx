"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DeleteTutor } from "@/components/DeleteTutor";
import { EditTutor } from "@/components/EditTutor";
import { 
  Star, MapPin, Clock, GraduationCap, BookOpen, 
  Calendar, User, Mail, Phone, CheckCircle, Edit3, 
  Loader2, X, AlertTriangle, Info 
} from "lucide-react";
import Link from "next/link";
import { Button, Input, Card, Label } from "@heroui/react";
import { toast } from "react-hot-toast";

const TutorDetailPage = ({ params }) => {
  const router = useRouter();
  const { id } = React.use(params);
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [tutor, setTutor] = useState(null);
  const [loadingTutor, setLoadingTutor] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    studentName: "",
    phone: "",
  });

  // Fetch tutor details
  useEffect(() => {
    fetch(`http://localhost:7000/tutor/${id}`)
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

  // Set dynamic title
  useEffect(() => {
    if (tutor) {
      document.title = `${tutor.tutorName} - Details | TutorFlux`;
    } else {
      document.title = "Tutor Details | TutorFlux";
    }
  }, [tutor]);

  // Protect route
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view tutor details.");
      router.push(`/login?callbackUrl=${encodeURIComponent(`/tutors/${id}`)}`);
    }
  }, [session, isPending, router, id]);

  // Auto fill booking fields once session is loaded
  useEffect(() => {
    if (user) {
      setBookingForm({
        studentName: user.name || "",
        phone: "",
      });
    }
  }, [user]);

  // Detect dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to book a session.");
      return;
    }

    // 1. Verify slot limit
    const totalSlot = parseInt(tutor.totalSlot) || 0;
    if (totalSlot <= 0) {
      toast.error("No available slots left.");
      return;
    }

    // 2. Verify Session Date Restriction
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const sessionDate = new Date(tutor.sessionStartDate);
    sessionDate.setHours(0, 0, 0, 0);
    if (currentDate < sessionDate) {
      toast.error("Booking is not available yet for this tutor");
      return;
    }

    setBookingLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:7000/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          tutorId: tutor._id,
          tutorName: tutor.tutorName,
          studentName: bookingForm.studentName || user.name,
          studentEmail: user.email,
          studentPhone: bookingForm.phone,
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Session booked successfully!");
        setIsModalOpen(false);
        // Decrease slots locally
        setTutor(prev => ({
          ...prev,
          totalSlot: Math.max(0, parseInt(prev.totalSlot) - 1)
        }));
      } else {
        toast.error(data.message || "Failed to book session");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (isPending || loadingTutor) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading tutor details...</p>
      </div>
    );
  }

  if (!session || !tutor) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] flex items-center justify-center">
        <div className="text-center text-xl text-slate-600 dark:text-slate-400">Tutor not found</div>
      </div>
    );
  }

  // Parse institution & experience
  const [institution, experienceYears] = (tutor.institutionExperience || "Unknown,0").split(",");
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] pb-12 transition-colors duration-500">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link href="/tutors" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 text-sm transition-all duration-200">
          ← Back to Tutors
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">

            {/* Profile Header Card */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl group">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-36 h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden shadow-md transition-transform duration-700 group-hover:scale-105">
                    <img
                      src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&h=300&fit=crop"}
                      alt={tutor.tutorName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      style={{ objectPosition: "center 20%" }}
                    />
                  </div>
                  <div className={`absolute -bottom-2 -right-2 ${isFullyBooked ? 'bg-red-500' : 'bg-green-500'} text-white text-xs px-3 py-1 rounded-full font-medium shadow animate-pulse`}>
                    {isFullyBooked ? "Fully Booked" : "Available Now"}
                  </div>
                </div>

                {/* Tutor Info */}
                <div className="flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                        {tutor.subject}
                      </span>
                      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{tutor.tutorName}</h1>
                    </div>

                    {/* Owner Edit / Delete actions */}
                    {user?.email === tutor.email && (
                      <div className="flex gap-2">
                        <EditTutor tutor={tutor} onUpdate={() => {
                          fetch(`http://localhost:7000/tutor/${id}`)
                            .then(r => r.json())
                            .then(data => setTutor(data));
                        }} />
                        <DeleteTutor tutor={tutor} onDeleted={() => router.push("/my-tutors")} />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-5 mt-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold text-lg text-slate-800 dark:text-slate-200">4.8</span>
                      <span className="text-slate-500 dark:text-slate-400">(124 reviews)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Clock className="w-4 h-4" />
                      <span>{experience}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{institution}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{tutor.location}</span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium px-4 py-2 rounded-2xl">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      {tutor.teachingMode}
                    </span>
                    <span className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-sm font-medium px-4 py-2 rounded-2xl">
                      <Calendar className="w-4 h-4" />
                      {tutor.availableDays}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Booking Restrictions & Actions */}
              <div className="mt-8 pt-6 border-t border-slate-200/50 dark:border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">${tutor.hourlyFee}</span>
                  <span className="text-slate-500 dark:text-slate-400">/hour</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {tutor.totalSlot} slots left for sessions
                  </p>
                </div>

                {isFullyBooked ? (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-4 rounded-2xl text-red-600 dark:text-red-400">
                    <AlertTriangle className="w-5 h-5" />
                    <span className="font-semibold text-sm">No available slots left.</span>
                  </div>
                ) : isNotAvailableYet ? (
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-2xl text-amber-700 dark:text-amber-400">
                    <Info className="w-5 h-5" />
                    <span className="font-semibold text-sm">Booking is not available yet for this tutor</span>
                  </div>
                ) : (
                  <Button
                    onPress={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/25 transition-all"
                  >
                    Book a Session
                  </Button>
                )}
              </div>
            </div>

            {/* About Me */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-gray-800 transition-all">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">About Me</h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[17px]">
                {tutor.description}
              </p>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {[
                  {
                    icon: GraduationCap,
                    color: "blue",
                    label: "Institution",
                    value: institution
                  },
                  {
                    icon: Clock,
                    color: "purple",
                    label: "Available Time",
                    value: tutor.availableTime
                  },
                  {
                    icon: Calendar,
                    color: "amber",
                    label: "Available Days",
                    value: tutor.availableDays
                  },
                  {
                    icon: BookOpen,
                    color: "emerald",
                    label: "Total Slots",
                    value: `${tutor.totalSlot} sessions`
                  },
                  {
                    icon: CheckCircle,
                    color: "pink",
                    label: "Session Starts",
                    value: new Date(tutor.sessionStartDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-5 bg-slate-50 dark:bg-gray-800/50 rounded-2xl group transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100/50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{item.label}</p>
                      <p className="text-slate-600 dark:text-slate-300">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-slate-200/50 dark:border-gray-800 sticky top-6 transition-all hover:shadow-xl">
              <h3 className="font-semibold text-lg mb-5 text-slate-900 dark:text-white">Contact Information</h3>

              <div className="space-y-5">
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <User className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{tutor.tutorName}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="truncate">{tutor.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{tutor.phone || "+880 1XXX-XXXXXX"}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <span>{tutor.location}</span>
                </div>
              </div>

              <button 
                onClick={() => toast("Messaging coming soon!", { icon: "💬" })}
                className="w-full mt-8 bg-slate-900 hover:bg-black dark:bg-gray-800 dark:hover:bg-gray-700 text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105"
              >
                Message Tutor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col p-6 border border-slate-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Book Learning Session
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body / Form */}
            <form onSubmit={handleBookingSubmit} className="flex-1 overflow-y-auto py-5 space-y-4">
              {/* Tutor Info Display */}
              <div className="bg-blue-50/50 dark:bg-blue-950/20 p-4 rounded-2xl flex items-center gap-3">
                <img
                  src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"}
                  alt={tutor.tutorName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 block">Tutor Name</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{tutor.tutorName}</span>
                </div>
              </div>

              {/* Student Name */}
              <div>
                <Label className="text-slate-700 dark:text-gray-300 text-sm font-semibold mb-2 block">
                  Student Name
                </Label>
                <Input
                  value={bookingForm.studentName}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, studentName: e.target.value }))}
                  required
                  placeholder="Your Full Name"
                  className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-950 dark:text-white"
                />
              </div>

              {/* Student Email */}
              <div>
                <Label className="text-slate-700 dark:text-gray-300 text-sm font-semibold mb-2 block">
                  Student Email
                </Label>
                <Input
                  value={user.email}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Tutor ID (Auto-filled & disabled) */}
              <div>
                <Label className="text-slate-700 dark:text-gray-300 text-sm font-semibold mb-2 block">
                  Tutor ID
                </Label>
                <Input
                  value={tutor._id}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border bg-slate-100 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-400 cursor-not-allowed opacity-80"
                />
              </div>

              {/* Phone number */}
              <div>
                <Label className="text-slate-700 dark:text-gray-300 text-sm font-semibold mb-2 block">
                  Phone Number
                </Label>
                <Input
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                  required
                  type="tel"
                  placeholder="e.g. +880 1712-345678"
                  className="w-full px-4 py-3 rounded-xl border bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-950 dark:text-white focus:outline-none"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-zinc-800">
                <Button
                  variant="light"
                  onPress={() => setIsModalOpen(false)}
                  disabled={bookingLoading}
                  className="font-semibold text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  isLoading={bookingLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20"
                >
                  Confirm Booking
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TutorDetailPage;