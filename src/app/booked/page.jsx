"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import {
  CalendarDays,
  Trash2,
  ShieldCheck,
  ArrowRight,
  GraduationCap,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  X,
  Search,
  Copy,
  Check,
  RotateCcw,
  Calendar,
  Phone,
  Mail,
  User,
  ExternalLink,
} from "lucide-react";
import { toast } from "react-hot-toast";

const BookedSessionsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedToken, setCopiedToken] = useState(null);

  // Dynamic title
  useEffect(() => {
    document.title = "My Booked Sessions | TutorFlux";
  }, []);

  // Protect route
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view your booked sessions.");
      router.push("/login?callbackUrl=%2Fbooked");
    }
  }, [session, isPending, router]);

  // Handle escape key to close cancel modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && cancelTarget) {
        setCancelTarget(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cancelTarget]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://tutorflux-serve-2.onrender.com/my-bookings?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } else {
        const errData = await res.json();
        console.error("Failed to fetch bookings:", errData);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user, fetchBookings]);

  // Copy token helper
  const copySessionToken = (tokenStr) => {
    navigator.clipboard.writeText(tokenStr);
    setCopiedToken(tokenStr);
    toast.success("Session Token copied to clipboard!");
    setTimeout(() => setCopiedToken(null), 2000);
  };

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const isCancelled = b.status === "cancelled";
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && !isCancelled) ||
        (statusFilter === "cancelled" && isCancelled);

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        b.tutorName?.toLowerCase().includes(query) ||
        b.studentName?.toLowerCase().includes(query) ||
        b._id?.toLowerCase().includes(query) ||
        b.tutorId?.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, statusFilter, searchQuery]);

  // Cancel booking handler
  const handleCancelBooking = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `https://tutorflux-serve-2.onrender.com/booking/${cancelTarget._id}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        toast.success("Booking cancelled successfully!");
        setCancelTarget(null);
        fetchBookings(); // Refresh bookings list immediately
      } else {
        const errData = await res.json();
        toast.error(errData.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setCancelling(false);
    }
  };

  if (isPending || (session && loading && bookings.length === 0)) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">
          Loading your booked sessions...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const activeCount = bookings.filter((b) => b.status !== "cancelled").length;
  const cancelledCount = bookings.filter((b) => b.status === "cancelled").length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 py-10 sm:py-14 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-bold mb-2">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Student Learning Schedule</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              My Booked Sessions
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your upcoming 1-on-1 tutor appointments and session tokens
            </p>
          </div>

          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all self-start md:self-auto"
          >
            <span>Book New Tutor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Global Empty State (Zero bookings in account) */}
        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs">
              <CalendarDays className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Booked Sessions Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              You haven&apos;t scheduled any learning sessions yet. Find verified expert tutors and book 1-on-1 sessions instantly.
            </p>
            <Link
              href="/tutors"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              <span>Explore Verified Tutors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter Controls & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setStatusFilter("all")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    statusFilter === "all"
                      ? "bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All ({bookings.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("active")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    statusFilter === "active"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter("cancelled")}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    statusFilter === "cancelled"
                      ? "bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Cancelled ({cancelledCount})
                </button>
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by tutor or student..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Filtered Empty State */}
            {filteredBookings.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-10 text-center">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  No Matching Sessions Found
                </h4>
                <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto mb-4">
                  No booked sessions matched your current filter criteria.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
                </button>
              </div>
            ) : (
              <>
                {/* ═══ Desktop / Tablet Data Table (Hidden on small mobile) ═══ */}
                <div className="hidden md:block bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Tutor & Profile
                          </th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Student Info
                          </th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Digital Session Token
                          </th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Status
                          </th>
                          <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredBookings.map((booking) => {
                          const isCancelled = booking.status === "cancelled";
                          return (
                            <tr
                              key={booking._id}
                              className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors"
                            >
                              {/* Tutor Info */}
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-blue-100/60 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 font-bold text-sm">
                                    {booking.tutorName?.charAt(0) || "T"}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 dark:text-white text-sm block">
                                      {booking.tutorName}
                                    </span>
                                    {booking.tutorId && (
                                      <Link
                                        href={`/tutors/${booking.tutorId}`}
                                        className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium mt-0.5"
                                      >
                                        <span>View Tutor Page</span>
                                        <ExternalLink className="w-3 h-3" />
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Student Info */}
                              <td className="py-4 px-6">
                                <div className="flex flex-col text-xs space-y-0.5">
                                  <span className="font-bold text-slate-900 dark:text-slate-100">
                                    {booking.studentName}
                                  </span>
                                  <span className="text-slate-500 dark:text-slate-400">
                                    {booking.studentEmail}
                                  </span>
                                  <span className="text-slate-400 text-[11px]">
                                    {booking.studentPhone || "No phone provided"}
                                  </span>
                                </div>
                              </td>

                              {/* Token ID with Copy Button */}
                              <td className="py-4 px-6">
                                <div className="inline-flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                                  <code className="text-xs font-mono text-slate-700 dark:text-slate-300 font-bold">
                                    {booking._id.slice(0, 10)}...
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() => copySessionToken(booking._id)}
                                    title="Copy full token ID"
                                    className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                  >
                                    {copiedToken === booking._id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </td>

                              {/* Status Badge */}
                              <td className="py-4 px-6">
                                {isCancelled ? (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-full border border-rose-200/60 dark:border-rose-800/60">
                                    <X className="w-3 h-3" /> Cancelled
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                                    <CheckCircle2 className="w-3 h-3" /> Confirmed
                                  </span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-4 px-6 text-right">
                                {!isCancelled ? (
                                  <button
                                    type="button"
                                    onClick={() => setCancelTarget(booking)}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200/60 dark:border-rose-900/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Cancel Session</span>
                                  </button>
                                ) : (
                                  <span className="text-xs font-medium text-slate-400 italic pr-2">
                                    Cancelled
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ═══ Mobile Card Layout (Active on < md screens) ═══ */}
                <div className="md:hidden space-y-4">
                  {filteredBookings.map((booking) => {
                    const isCancelled = booking.status === "cancelled";
                    return (
                      <div
                        key={booking._id}
                        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-slate-400 uppercase">Tutor</span>
                            <h4 className="font-bold text-base text-slate-900 dark:text-white">
                              {booking.tutorName}
                            </h4>
                          </div>

                          {isCancelled ? (
                            <span className="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-bold rounded-full border border-rose-200/60 dark:border-rose-800/60">
                              Cancelled
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
                              Confirmed
                            </span>
                          )}
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span>Student: {booking.studentName}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                            <span className="truncate">{booking.studentEmail}</span>
                          </div>
                          {booking.studentPhone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span>{booking.studentPhone}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-slate-500 font-semibold">
                              Token: {booking._id.slice(0, 8)}...
                            </span>
                            <button
                              type="button"
                              onClick={() => copySessionToken(booking._id)}
                              className="p-1 text-slate-400 hover:text-blue-600"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {!isCancelled ? (
                            <button
                              type="button"
                              onClick={() => setCancelTarget(booking)}
                              className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 text-xs font-bold"
                            >
                              Cancel Session
                            </button>
                          ) : (
                            <span className="text-slate-400 italic">No action</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* ═══ Danger Cancellation Confirmation Modal ═══ */}
        {cancelTarget && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
            onClick={(e) => e.target === e.currentTarget && setCancelTarget(null)}
          >
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 border border-slate-200 dark:border-slate-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-2xl shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 id="cancel-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                    Cancel Booking Session?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    Are you sure you want to cancel the session with{" "}
                    <strong className="text-slate-900 dark:text-white">{cancelTarget.tutorName}</strong>? This will free up the tutor&apos;s slot.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCancelTarget(null)}
                  disabled={cancelling}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  No, Keep Session
                </button>

                <button
                  type="button"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-rose-500/25 transition disabled:opacity-60"
                >
                  {cancelling ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Yes, Cancel Session</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedSessionsPage;