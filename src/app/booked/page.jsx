"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { 
  CalendarDays, Trash2, ShieldAlert, ArrowRight, 
  GraduationCap, Loader2, CheckCircle2, AlertTriangle, X 
} from "lucide-react";
import { Button, Card } from "@heroui/react";
import { toast } from "react-hot-toast";

const BookedSessionsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Set dynamic title
  useEffect(() => {
    document.title = "My Booked Sessions | TutorFlux";
  }, []);

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

  // Protect route
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view your booked sessions.");
      router.push("/login?callbackUrl=%2Fbooked");
    }
  }, [session, isPending, router]);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`https://tutorflux-serve-2.onrender.com/my-bookings?email=${user.email}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
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

  // Cancel booking handler
  const handleCancelBooking = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://tutorflux-serve-2.onrender.com/booking/${cancelTarget}/cancel`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        toast.success("Booking cancelled successfully!");
        setCancelTarget(null);
        fetchBookings(); // Refresh bookings list immediately without reload
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
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your bookings...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] py-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            My Booked Sessions
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Track and manage your upcoming classes
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <Card className="border-0 shadow-lg p-12 text-center bg-white dark:bg-gray-900 max-w-2xl mx-auto rounded-3xl">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Booked Sessions Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              You haven&apos;t booked any learning sessions yet. Browse our verified tutors to find the right guide for your studies!
            </p>
            <Button
              onPress={() => router.push("/tutors")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl px-8 py-6 shadow-xl shadow-blue-500/25"
            >
              Browse Tutors <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Card>
        ) : (
          /* Bookings Table */
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-gray-800 bg-slate-50/55 dark:bg-gray-900/50">
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Tutor</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Student Details</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Email</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Status</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {bookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/30 dark:hover:bg-gray-800/30 transition-colors">
                      {/* Tutor Name */}
                      <td className="p-5">
                        <span className="font-semibold text-slate-900 dark:text-white text-base block">
                          {booking.tutorName}
                        </span>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          ID: {booking.tutorId}
                        </span>
                      </td>

                      {/* Student details */}
                      <td className="p-5">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-slate-950 dark:text-slate-200">
                            {booking.studentName}
                          </span>
                          <span className="text-xs text-slate-400">
                            {booking.studentPhone || "No Phone"}
                          </span>
                        </div>
                      </td>

                      {/* Student Email */}
                      <td className="p-5 text-slate-600 dark:text-slate-300 text-sm">
                        {booking.studentEmail}
                      </td>

                      {/* Booking status */}
                      <td className="p-5">
                        {booking.status === "cancelled" ? (
                          <span className="px-3 py-1 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full border border-red-100/50 dark:border-red-800/50">
                            Cancelled
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full border border-green-100/50 dark:border-green-800/50 flex items-center gap-1.5 w-fit">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Booked
                          </span>
                        )}
                      </td>

                      {/* Cancel Button */}
                      <td className="p-5 text-right">
                        {booking.status !== "cancelled" ? (
                          <Button
                            onPress={() => setCancelTarget(booking._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/50 rounded-xl font-medium transition-all"
                            size="sm"
                          >
                            Cancel Session
                          </Button>
                        ) : (
                          <span className="text-sm text-slate-400 font-medium select-none pr-3">
                            No Action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {cancelTarget && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={(e) => e.target === e.currentTarget && setCancelTarget(null)}
          >
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col p-6 border border-slate-200 dark:border-zinc-800">
              
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 rounded-full">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Cancel Booking
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Are you sure you want to cancel this tutor booking session? The status will be set to cancelled.
                  </p>
                </div>
                <button
                  onClick={() => setCancelTarget(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="light"
                  onPress={() => setCancelTarget(null)}
                  disabled={cancelling}
                  className="font-semibold text-slate-500 hover:text-slate-700"
                >
                  No, Keep
                </Button>
                <Button
                  onClick={handleCancelBooking}
                  isLoading={cancelling}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg shadow-red-500/25"
                >
                  {cancelling ? "Cancelling..." : "Yes, Cancel Session"}
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BookedSessionsPage;