"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Button,
  Card,
  TextField,
  Label,
  FieldError,
} from "@heroui/react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Star,
  BookOpen,
  Monitor,
  CalendarDays,
  GraduationCap,
  Users,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  User,
} from "lucide-react";

const TutorDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    studentName: "",
    phone: "",
    date: "",
  });

  // Fetch tutor details
  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await fetch(`http://localhost:7000/tutor/${id}`);
        const data = await res.json();
        console.log("%c[FETCHED TUTOR DETAILS]", "color: #6366f1; font-weight: bold;", data);
        setTutor(data);
      } catch (error) {
        console.error("%c[FETCH ERROR]", "color: #ef4444; font-weight: bold;", error);
        toast.error("Failed to load tutor details");
      } finally {
        setLoading(false);
      }
    };

    // Get logged in user from localStorage or context
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setBookingForm((prev) => ({
        ...prev,
        studentName: parsedUser.name || "",
      }));
    }

    fetchTutor();
  }, [id]);

  // Check if booking is allowed
  const checkBookingEligibility = () => {
    if (!tutor) return { allowed: false, message: "Loading..." };

    // Check slots
    if (tutor.totalSlot <= 0) {
      return { allowed: false, message: "No available slots left." };
    }

    // Check session start date
    const sessionDate = new Date(tutor.sessionStartDate);
    const currentDate = new Date();
    if (currentDate < sessionDate) {
      return {
        allowed: false,
        message: "Booking is not available yet for this tutor.",
      };
    }

    return { allowed: true, message: "" };
  };

  const eligibility = checkBookingEligibility();

  const handleBookingChange = (name, value) => {
    setBookingForm((prev) => {
      const updated = { ...prev, [name]: value };
      console.log(`[Booking Form Update] ${name}:`, value);
      return updated;
    });
  };

  const handleBookSession = async (e) => {
    e.preventDefault();

    if (!eligibility.allowed) {
      toast.error(eligibility.message);
      return;
    }

    if (!bookingForm.studentName || !bookingForm.phone || !bookingForm.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bookingData = {
      tutorId: tutor._id,
      tutorName: tutor.tutorName,
      studentName: bookingForm.studentName,
      studentEmail: user?.email || "",
      phone: bookingForm.phone,
      date: bookingForm.date,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("%c[BOOKING DATA - SUBMITTING]", "color: #6366f1; font-size: 14px; font-weight: bold;");
    console.log(bookingData);
    console.log("%c[JSON Stringified]", "color: #10b981; font-weight: bold;");
    console.log(JSON.stringify(bookingData, null, 2));

    setBookingLoading(true);

    try {
      const res = await fetch("http://localhost:7000/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();
      console.log("%c[SERVER RESPONSE]", "color: #f59e0b; font-weight: bold;", data);

      if (res.ok) {
        toast.success("Session booked successfully!");
        router.push("/my-booked-sessions");
      } else {
        toast.error(data.message || "Failed to book session");
      }
    } catch (error) {
      console.error("%c[BOOKING ERROR]", "color: #ef4444; font-weight: bold;", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#6366f1] animate-spin" />
          <p className="text-gray-500 font-medium">Loading tutor details...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tutor not found
          </h3>
          <Button
            onPress={() => router.push("/tutors")}
            className="rounded-xl bg-[#6366f1] text-white mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tutors
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/tutors")}
            className="inline-flex items-center text-gray-600 hover:text-[#6366f1] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Tutors
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tutor Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Card */}
            <Card className="border-0 shadow-lg shadow-gray-200/50 overflow-hidden">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={tutor.photoUrl || "/default-avatar.png"}
                  alt={tutor.tutorName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-white/90 backdrop-blur-sm text-[#6366f1] mb-2">
                        {tutor.subject}
                      </span>
                      <h1 className="text-2xl md:text-3xl font-bold text-white">
                        {tutor.tutorName}
                      </h1>
                    </div>
                    <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-bold text-gray-900">
                        {tutor.rating || "4.8"}
                      </span>
                      <span className="text-xs text-gray-500">({tutor.reviewCount || "120"} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-[#6366f1] mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{tutor.experience}+</p>
                    <p className="text-xs text-gray-500">Years Exp.</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Users className="w-5 h-5 text-[#6366f1] mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{tutor.totalSlot || 0}</p>
                    <p className="text-xs text-gray-500">Slots Left</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <DollarSign className="w-5 h-5 text-[#6366f1] mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">${tutor.hourlyFee}</p>
                    <p className="text-xs text-gray-500">Per Hour</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <BookOpen className="w-5 h-5 text-[#6366f1] mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-900">{tutor.subject}</p>
                    <p className="text-xs text-gray-500">Subject</p>
                  </div>
                </div>

                {/* About Section */}
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#6366f1]" />
                    About Me
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{tutor.description}</p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Institution</p>
                      <p className="font-medium text-gray-900">{tutor.institution}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{tutor.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <Monitor className="w-5 h-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Teaching Mode</p>
                      <p className="font-medium text-gray-900">{tutor.teachingMode}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <CalendarDays className="w-5 h-5 text-[#6366f1]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Available Days</p>
                      <p className="font-medium text-gray-900">{tutor.availableDays}</p>
                    </div>
                  </div>
                </div>

                {/* Time Slot */}
                <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                  <Clock className="w-5 h-5 text-[#6366f1]" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">
                      Available Time: {tutor.availableTimeSlot}
                    </p>
                    <p className="text-xs text-indigo-600">
                      Session starts on {new Date(tutor.sessionStartDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <Card className="border-0 shadow-lg shadow-gray-200/50">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    Book a Session
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Fill in your details to book
                  </p>

                  {/* Slot Status */}
                  {!eligibility.allowed && (
                    <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700 font-medium">
                        {eligibility.message}
                      </p>
                    </div>
                  )}

                  {eligibility.allowed && tutor.totalSlot > 0 && (
                    <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-green-700 font-medium">
                          {tutor.totalSlot} slots available
                        </p>
                        <p className="text-xs text-green-600 mt-0.5">
                          Book now before they fill up!
                        </p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleBookSession} className="space-y-5">
                    {/* Student Name */}
                    <TextField
                      name="studentName"
                      isRequired
                      value={bookingForm.studentName}
                      onChange={(e) => handleBookingChange("studentName", e.target.value)}
                    >
                      <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                        <User className="w-4 h-4 text-[#6366f1]" />
                        Student Name
                      </Label>
                      <Input
                        placeholder="Enter your name"
                        className="rounded-xl border-gray-200 focus:border-[#6366f1] focus:ring-[#6366f1]/20 mt-1.5"
                      />
                      <FieldError />
                    </TextField>

                    {/* Phone */}
                    <TextField
                      name="phone"
                      isRequired
                      value={bookingForm.phone}
                      onChange={(e) => handleBookingChange("phone", e.target.value)}
                    >
                      <Label className="text-gray-700 font-medium text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#6366f1]" />
                        Phone Number
                      </Label>
                      <Input
                        type="tel"
                        placeholder="+1 234 567 890"
                        className="rounded-xl border-gray-200 focus:border-[#6366f1] focus:ring-[#6366f1]/20 mt-1.5"
                      />
                      <FieldError />
                    </TextField>

                    {/* Tutor Info (Read-only) */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1.5">
                          <BookOpen className="w-4 h-4 text-[#6366f1]" />
                          Tutor
                        </label>
                        <input
                          type="text"
                          value={tutor.tutorName}
                          readOnly
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1.5">
                          <Mail className="w-4 h-4 text-[#6366f1]" />
                          Student Email
                        </label>
                        <input
                          type="email"
                          value={user?.email || "Not logged in"}
                          readOnly
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                        />
                      </div>
                    </div>

                    {/* Session Date */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1.5">
                        <CalendarDays className="w-4 h-4 text-[#6366f1]" />
                        Session Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={bookingForm.date}
                        onChange={(e) => handleBookingChange("date", e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 focus:outline-none transition-all"
                      />
                    </div>

                    {/* Price Summary */}
                    <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Hourly Rate</span>
                        <span className="font-medium text-gray-900">${tutor.hourlyFee}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium text-gray-900">1 hour</span>
                      </div>
                      <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                        <span className="font-medium text-gray-900">Total</span>
                        <span className="text-lg font-bold text-[#6366f1]">${tutor.hourlyFee}</span>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      isLoading={bookingLoading}
                      isDisabled={!eligibility.allowed}
                      className={`w-full rounded-xl py-3 font-medium transition-all ${
                        eligibility.allowed
                          ? "bg-[#6366f1] text-white hover:bg-[#5558e0] shadow-lg shadow-indigo-200"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      {bookingLoading ? "Booking..." : "Book Session"}
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailsPage;
