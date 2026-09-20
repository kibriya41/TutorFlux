"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { EditTutor } from "@/components/EditTutor";
import { DeleteTutor } from "@/components/DeleteTutor";
import {
  Building2,
  MapPin,
  Monitor,
  Clock,
  CalendarDays,
  DollarSign,
  ArrowRight,
  PlusCircle,
  GraduationCap,
  Loader2,
  Search,
  X,
  BookOpen,
  Zap,
  Eye,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

const MyTutorsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Set dynamic page title
  useEffect(() => {
    document.title = "My Tutor Profiles | TutorFlux";
  }, []);

  // Protect route: redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view your tutor profiles.");
      router.push("/login?callbackUrl=%2Fmy-tutors");
    }
  }, [session, isPending, router]);

  // Fetch tutors created by current user
  const fetchMyTutors = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://tutorflux-serve-2.onrender.com/my-tutors?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setTutors(Array.isArray(data) ? data : []);
      } else {
        const errorData = await res.json();
        console.error("Failed to fetch tutors:", errorData);
      }
    } catch (err) {
      console.error("Error fetching tutors:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      fetchMyTutors();
    }
  }, [user, fetchMyTutors]);

  const filteredTutors = tutors.filter((t) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      t.tutorName?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.location?.toLowerCase().includes(q)
    );
  });

  if (isPending || (session && loading && tutors.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
          Loading your tutor profiles...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 py-10 sm:py-14 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Tutor Profile Manager</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              My Tutor Profiles
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage and update the tutor listings you have created on TutorFlux
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/add-tutor")}
            className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 transition-all self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Tutor</span>
          </button>
        </div>

        {/* Empty State — No tutors in account at all */}
        {tutors.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Tutor Profiles Created Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              You haven&apos;t created any tutor listings yet. Set up a profile to share your expertise, availability, and hourly rate with students looking for help!
            </p>
            <button
              type="button"
              onClick={() => router.push("/add-tutor")}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Your First Tutor Profile</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Search control */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Showing{" "}
                <strong className="text-blue-600 dark:text-blue-400">
                  {filteredTutors.length}
                </strong>{" "}
                of {tutors.length} tutor profile{tutors.length !== 1 ? "s" : ""}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by name, subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {filteredTutors.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-10 text-center">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No Matching Profiles
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto mb-4">
                  No tutor profiles matched your search query.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <X className="w-3.5 h-3.5" /> Clear Search
                </button>
              </div>
            ) : (
              <>
                {/* ─── Desktop Table (md+) ─── */}
                <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                          {["Tutor Profile", "Subject", "Mode & Location", "Availability", "Hourly Fee & Slots", "Actions"].map(
                            (heading) => (
                              <th
                                key={heading}
                                className={`py-4 px-5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 ${
                                  heading === "Actions" ? "text-right" : ""
                                }`}
                              >
                                {heading}
                              </th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredTutors.map((tutor) => {
                          const slotsLeft = parseInt(tutor.totalSlot) || 0;
                          const isFullyBooked = slotsLeft <= 0;
                          const [institution] = (tutor.institutionExperience || "Independent").split(",");

                          return (
                            <tr
                              key={tutor._id}
                              className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                            >
                              {/* Tutor Profile Cell */}
                              <td className="py-4 px-5">
                                <div className="flex items-center gap-3.5">
                                  <div className="relative shrink-0">
                                    <img
                                      src={
                                        tutor.photo ||
                                        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"
                                      }
                                      alt={tutor.tutorName}
                                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                                      style={{ objectPosition: "center 20%" }}
                                    />
                                    <span
                                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                                        isFullyBooked ? "bg-rose-500" : "bg-emerald-500"
                                      }`}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 dark:text-white text-sm block">
                                      {tutor.tutorName}
                                    </span>
                                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate max-w-[180px]">
                                      {institution}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* Subject Badge */}
                              <td className="py-4 px-5">
                                <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-xl border border-blue-200/60 dark:border-blue-800/60">
                                  {tutor.subject || "General"}
                                </span>
                              </td>

                              {/* Mode & Location */}
                              <td className="py-4 px-5">
                                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                  <span className="flex items-center gap-1.5 font-semibold">
                                    <Monitor className="w-3.5 h-3.5 text-blue-500" />
                                    {tutor.teachingMode || "Online"}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-slate-400">
                                    <MapPin className="w-3 h-3" />
                                    {tutor.location || "Remote"}
                                  </span>
                                </div>
                              </td>

                              {/* Availability */}
                              <td className="py-4 px-5">
                                <div className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                                  <span className="flex items-center gap-1.5 font-semibold">
                                    <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                                    {tutor.availableDays || "Flexible"}
                                  </span>
                                  <span className="flex items-center gap-1.5 text-slate-400">
                                    <Clock className="w-3 h-3" />
                                    {tutor.availableTime || "Flexible Hours"}
                                  </span>
                                </div>
                              </td>

                              {/* Fee & Slots */}
                              <td className="py-4 px-5">
                                <div className="space-y-1">
                                  <div className="flex items-baseline gap-0.5">
                                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="font-black text-slate-900 dark:text-white text-sm">
                                      {tutor.hourlyFee}
                                    </span>
                                    <span className="text-[11px] text-slate-400">/hr</span>
                                  </div>
                                  <span
                                    className={`text-[11px] font-bold flex items-center gap-1 ${
                                      isFullyBooked
                                        ? "text-rose-600 dark:text-rose-400"
                                        : "text-emerald-600 dark:text-emerald-400"
                                    }`}
                                  >
                                    <Zap className="w-3 h-3" />
                                    {isFullyBooked
                                      ? "Fully Booked"
                                      : `${slotsLeft} slots open`}
                                  </span>
                                </div>
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-5">
                                <div className="flex items-center justify-end gap-2">
                                  <Link
                                    href={`/tutors/${tutor._id}`}
                                    title="View public profile"
                                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors"
                                    aria-label="View public tutor profile"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Link>
                                  <EditTutor tutor={tutor} onUpdate={fetchMyTutors} />
                                  <DeleteTutor tutor={tutor} onDeleted={fetchMyTutors} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ─── Mobile Cards (< md) ─── */}
                <div className="md:hidden space-y-4">
                  {filteredTutors.map((tutor) => {
                    const slotsLeft = parseInt(tutor.totalSlot) || 0;
                    const isFullyBooked = slotsLeft <= 0;
                    const [institution] = (tutor.institutionExperience || "Independent").split(",");

                    return (
                      <div
                        key={tutor._id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
                      >
                        {/* Card Header */}
                        <div className="flex items-center gap-4">
                          <div className="relative shrink-0">
                            <img
                              src={
                                tutor.photo ||
                                "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"
                              }
                              alt={tutor.tutorName}
                              className="w-14 h-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-700"
                              style={{ objectPosition: "center 20%" }}
                            />
                            <span
                              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                                isFullyBooked ? "bg-rose-500" : "bg-emerald-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                              {tutor.tutorName}
                            </h3>
                            <p className="text-xs text-slate-400 truncate">{institution}</p>
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                              {tutor.subject}
                            </span>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Mode</span>
                            <span className="flex items-center gap-1 font-semibold">
                              <Monitor className="w-3 h-3 text-blue-500" /> {tutor.teachingMode}
                            </span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Location</span>
                            <span className="flex items-center gap-1 font-semibold">
                              <MapPin className="w-3 h-3 text-blue-500" /> {tutor.location || "Remote"}
                            </span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Rate</span>
                            <span className="font-black text-slate-900 dark:text-white">
                              ${tutor.hourlyFee}<span className="font-normal text-slate-400 text-[10px]">/hr</span>
                            </span>
                          </div>
                          <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl">
                            <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Slots</span>
                            <span
                              className={`font-bold text-xs ${
                                isFullyBooked
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-emerald-600 dark:text-emerald-400"
                              }`}
                            >
                              {isFullyBooked ? "Fully Booked" : `${slotsLeft} open`}
                            </span>
                          </div>
                        </div>

                        {/* Action Row */}
                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                          <Link
                            href={`/tutors/${tutor._id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-400 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Public Profile
                          </Link>
                          <div className="flex items-center gap-2">
                            <EditTutor tutor={tutor} onUpdate={fetchMyTutors} />
                            <DeleteTutor tutor={tutor} onDeleted={fetchMyTutors} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTutorsPage;