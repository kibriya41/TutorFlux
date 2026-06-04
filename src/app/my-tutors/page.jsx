"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { EditTutor } from "@/components/EditTutor";
import { DeleteTutor } from "@/components/DeleteTutor";
import { 
  Building2, MapPin, Monitor, Clock, CalendarDays, 
  DollarSign, ArrowRight, User, PlusCircle, GraduationCap, Loader2 
} from "lucide-react";
import { Button, Card } from "@heroui/react";
import { toast } from "react-hot-toast";

const MyTutorsPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);

  // Set dynamic page title
  useEffect(() => {
    document.title = "My Tutors | TutorFlux";
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

  // Protect route: redirect to login if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to view your tutors.");
      router.push("/login?callbackUrl=%2Fmy-tutors");
    }
  }, [session, isPending, router]);

  // Fetch tutors created by current user
  const fetchMyTutors = useCallback(async () => {
    if (!user?.email) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:7000/my-tutors?email=${user.email}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setTutors(data);
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

  if (isPending || (session && loading && tutors.length === 0)) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your tutors...</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              My Tutors
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Manage the tutor profiles you have created
            </p>
          </div>
          <Button
            onPress={() => router.push("/add-tutor")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <PlusCircle className="w-5 h-5" /> Add New Tutor
          </Button>
        </div>

        {/* Empty State */}
        {tutors.length === 0 ? (
          <Card className="border-0 shadow-lg p-12 text-center bg-white dark:bg-gray-900 max-w-2xl mx-auto rounded-3xl">
            <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              No Tutors Listed Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
              You haven&apos;t created any tutor profiles. Create a profile to share your knowledge and availability with students!
            </p>
            <Button
              onPress={() => router.push("/add-tutor")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl px-8 py-6 shadow-xl shadow-blue-500/25"
            >
              Create Tutor Profile <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Card>
        ) : (
          /* Tutors Table List */
          <div className="bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-gray-800 bg-slate-50/55 dark:bg-gray-900/50">
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Tutor</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Subject</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Mode / Location</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Availability</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Fee & Slots</th>
                    <th className="p-5 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
                  {tutors.map((tutor) => (
                    <tr key={tutor._id} className="hover:bg-slate-50/30 dark:hover:bg-gray-800/30 transition-colors">
                      {/* Name & Photo */}
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={tutor.photo || "https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&h=100&fit=crop"}
                            alt={tutor.tutorName}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-gray-700"
                          />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-white text-base block">
                              {tutor.tutorName}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500 block truncate max-w-[200px]">
                              {tutor.institutionExperience || "Independent"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Subject */}
                      <td className="p-5">
                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full border border-blue-100/50 dark:border-blue-800/50">
                          {tutor.subject || "General"}
                        </span>
                      </td>

                      {/* Mode & Location */}
                      <td className="p-5 text-slate-600 dark:text-slate-300 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 font-medium">
                            <Monitor className="w-3.5 h-3.5 text-slate-400" />
                            {tutor.teachingMode || "Online"}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <MapPin className="w-3 h-3" />
                            {tutor.location || "Online"}
                          </span>
                        </div>
                      </td>

                      {/* Available days & times */}
                      <td className="p-5 text-slate-600 dark:text-slate-300 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 font-medium">
                            <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            {tutor.availableDays || "Sun-Thu"}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            {tutor.availableTime || "Flexible"}
                          </span>
                        </div>
                      </td>

                      {/* Fee & slots left */}
                      <td className="p-5 text-slate-600 dark:text-slate-300 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-slate-900 dark:text-white flex items-center">
                            <DollarSign className="w-3.5 h-3.5 text-green-500" />
                            {tutor.hourlyFee}/hr
                          </span>
                          <span className="text-xs text-slate-400">
                            {tutor.totalSlot} slots remaining
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          <EditTutor tutor={tutor} onUpdate={fetchMyTutors} />
                          <DeleteTutor tutor={tutor} onDeleted={fetchMyTutors} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyTutorsPage;