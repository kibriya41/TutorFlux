"use client";

import { FieldError, Input, Label, TextField, Select, ListBox, TextArea, Button, Card } from "@heroui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, ImageIcon, BookOpen, Monitor, MapPin, Building2,
  CalendarDays, Clock, DollarSign, Hash, Calendar,
  FileText, Sparkles, ChevronDown, Check, X, UploadCloud,
  GraduationCap, Award, Star, Zap, ArrowRight, AlertCircle
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
const AddTutorPage = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [formProgress, setFormProgress] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Auto-detect dark mode from Navbar toggle
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (!isPending && !session) {
      toast.error("Please sign in to add a tutor profile.");
      router.push("/login?callbackUrl=%2Fadd-tutor");
    }
  }, [session, isPending, router]);

  const [formValues, setFormValues] = useState({
    tutorName: "",
    photo: "",
    subject: null,
    teachingMode: null,
    location: "",
    institutionExperience: "",
    availableDays: "",
    availableTime: "",
    hourlyFee: "",
    totalSlot: "",
    sessionStartDate: "",
    description: ""
  });

  const subjects = [
    { value: "Mathematics", icon: "∑", color: "from-blue-500 to-cyan-400", darkColor: "from-blue-600 to-cyan-500" },
    { value: "Physics", icon: "⚛", color: "from-purple-500 to-pink-400", darkColor: "from-purple-600 to-pink-500" },
    { value: "Chemistry", icon: "🧪", color: "from-green-500 to-emerald-400", darkColor: "from-green-600 to-emerald-500" },
    { value: "Biology", icon: "🧬", color: "from-rose-500 to-orange-400", darkColor: "from-rose-600 to-orange-500" },
    { value: "English", icon: "✎", color: "from-amber-500 to-yellow-400", darkColor: "from-amber-600 to-yellow-500" },
    { value: "Programming", icon: "</>", color: "from-indigo-500 to-violet-400", darkColor: "from-indigo-600 to-violet-500" },
    { value: "History", icon: "🏛", color: "from-stone-500 to-orange-300", darkColor: "from-stone-600 to-orange-400" },
    { value: "Economics", icon: "📈", color: "from-teal-500 to-cyan-400", darkColor: "from-teal-600 to-cyan-500" }
  ];

  const teachingModes = [
    { value: "Online", icon: <Monitor className="w-4 h-4" />, desc: "Virtual sessions via video call" },
    { value: "Offline", icon: <MapPin className="w-4 h-4" />, desc: "In-person at your location" },
    { value: "Both", icon: <Zap className="w-4 h-4" />, desc: "Flexible online or offline" }
  ];

  const sections = [
    { title: "Basic Information", icon: <User className="w-5 h-5" />, fields: ["tutorName", "photo", "subject", "teachingMode", "location", "institutionExperience"] },
    { title: "Session Information", icon: <CalendarDays className="w-5 h-5" />, fields: ["availableDays", "availableTime", "hourlyFee", "totalSlot", "sessionStartDate"] },
    { title: "Tutor Description", icon: <FileText className="w-5 h-5" />, fields: ["description"] }
  ];

  const fieldLabels = {
    tutorName: "Tutor Name",
    photo: "Profile Photo URL",
    subject: "Subject / Category",
    teachingMode: "Teaching Mode",
    location: "Location",
    institutionExperience: "Institution & Experience",
    availableDays: "Available Days",
    availableTime: "Available Time",
    hourlyFee: "Hourly Fee",
    totalSlot: "Available Slots",
    sessionStartDate: "Session Start Date",
    description: "About Me"
  };

  const handleChange = (field, value) => {
    setFormValues(prev => {
      const updated = { ...prev, [field]: value };
      const filledCount = Object.values(updated).filter(v => {
        if (v === null || v === undefined) return false;
        return v.toString().trim().length > 0;
      }).length;
      setFormProgress(Math.min((filledCount / 12) * 100, 100));
      return updated;
    });
  };

  const validateSection = (sectionIndex) => {
    const currentFields = sections[sectionIndex].fields;
    const emptyFields = [];

    currentFields.forEach(fieldName => {
      const val = formValues[fieldName];
      if (!val || (typeof val === 'string' && !val.trim())) {
        emptyFields.push(fieldLabels[fieldName]);
      }
    });

    if (emptyFields.length > 0) {
      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800 dark:text-red-200">Please fill in all required fields</p>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Missing: {emptyFields.join(", ")}
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            borderRadius: '16px',
            background: isDark ? '#1a1a2e' : '#fef2f2',
            border: isDark ? '1px solid #7f1d1d' : '1px solid #fecaca',
            color: isDark ? '#fca5a5' : '#991b1b',
            padding: '16px 20px',
            maxWidth: '400px'
          }
        }
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateSection(activeSection)) {
      setActiveSection(prev => prev + 1);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const tutor = {
      ...formValues,
      email: user?.email
    };
    console.log(tutor);

    setLoading(true);
    try {
      const res = await fetch('http://localhost:7000/tutor', {
        method: "POST",
        headers: { 
          "content-type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tutor)
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast.success("Tutor profile created successfully!", {
          style: {
            borderRadius: '16px',
            background: isDark ? '#064e3b' : '#f0fdf4',
            border: isDark ? '1px solid #059669' : '1px solid #86efac',
            color: isDark ? '#6ee7b7' : '#166534',
            padding: '16px 20px'
          }
        });
        router.push("/my-tutors");
      } else {
        toast.error(data.message || "Failed to create tutor profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dynamic classes based on dark mode
  const themeClasses = {
    pageBg: isDark ? "bg-[#0a0e1a]" : "bg-[#f8fafc]",
    cardBg: isDark ? "bg-gray-900/80 border-gray-800" : "bg-white border-slate-200",
    inputBg: isDark ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-500" : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400",
    inputFocus: isDark ? "focus:border-blue-500 focus:ring-blue-900/30" : "focus:border-indigo-400 focus:ring-indigo-100",
    textPrimary: isDark ? "text-white" : "text-slate-900",
    textSecondary: isDark ? "text-gray-400" : "text-slate-500",
    textMuted: isDark ? "text-gray-500" : "text-slate-400",
    sectionActive: isDark ? "bg-gray-800/80 border-blue-800 text-blue-400" : "bg-white border-indigo-200 text-indigo-900",
    sectionInactive: isDark ? "bg-gray-800/40 border-gray-700 text-gray-500 hover:border-blue-800 hover:text-blue-400" : "bg-white/80 border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-700",
    iconActive: isDark ? "bg-blue-900/30 text-blue-400" : "bg-indigo-50 text-indigo-600",
    iconInactive: isDark ? "bg-gray-700 text-gray-400" : "bg-slate-100 text-slate-400",
    gradientText: "text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500",
    progressBg: isDark ? "bg-gray-800" : "bg-slate-200",
    previewBg: isDark ? "bg-gray-800/50 border-gray-700" : "bg-slate-50 border-slate-200",
    buttonSecondary: isDark ? "text-gray-400 hover:text-gray-200" : "text-slate-500 hover:text-slate-700"
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] flex flex-col items-center justify-center gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-200 dark:border-blue-900 border-t-blue-600 rounded-full"
        />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Checking authentication...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className={`min-h-screen ${themeClasses.pageBg} relative overflow-hidden transition-colors duration-500`}>
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] ${isDark ? 'bg-blue-900/20' : 'bg-blue-100/50'}`}
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className={`absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px] ${isDark ? 'bg-purple-900/20' : 'bg-purple-100/50'}`}
        />
        <div className={`absolute inset-0 bg-[radial-gradient(circle,${isDark ? '#1e293b' : '#e2e8f0'}_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 transition-colors duration-500`} />
      </div>

      <div className="relative z-10 py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-10 text-center"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm mb-6 ${isDark ? 'bg-gray-800/80 border-blue-800' : 'bg-white border-indigo-100'}`}>
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-indigo-600'}`} />
            <span className={`text-sm font-medium ${isDark ? 'text-blue-300' : 'text-indigo-900'}`}>Create Your Teaching Profile</span>
          </div>

          <h1 className={`text-4xl md:text-5xl font-bold mb-4 tracking-tight ${themeClasses.textPrimary}`}>
            Become a <span className={themeClasses.gradientText}>TutorFlux Tutor</span>
          </h1>
          <p className={`text-lg max-w-2xl mx-auto ${themeClasses.textSecondary}`}>
            Share your expertise with thousands of eager students. Complete your profile below.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-sm font-medium ${themeClasses.textSecondary}`}>Profile Completion</span>
            <span className={`text-sm font-bold ${isDark ? 'text-blue-400' : 'text-indigo-600'}`}>{Math.round(formProgress)}%</span>
          </div>
          <div className={`h-3 rounded-full overflow-hidden ${themeClasses.progressBg}`}>
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 rounded-full"
              animate={{ width: `${formProgress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
        </motion.div>

        {/* Section Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-3">
            {sections.map((section, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSection(idx)}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 shadow-sm ${
                  activeSection === idx ? themeClasses.sectionActive : themeClasses.sectionInactive
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeSection === idx ? themeClasses.iconActive : themeClasses.iconInactive}`}>
                  {section.icon}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">{section.title}</div>
                  <div className={`text-xs ${themeClasses.textMuted}`}>{section.fields.length} fields</div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Main Form Card */}
        <Card className={`max-w-4xl mx-auto ${themeClasses.cardBg} shadow-xl transition-colors duration-500`}>
          <form onSubmit={onSubmit} className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* ====== BASIC INFORMATION ====== */}
              {activeSection === 0 && (
                <motion.div key="basic" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl border ${isDark ? 'bg-blue-900/20 border-blue-800' : 'bg-indigo-50 border-indigo-100'}`}>
                      <User className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-indigo-600'}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${themeClasses.textPrimary}`}>Basic Information</h2>
                      <p className={themeClasses.textSecondary}>Tell us about yourself and your expertise</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tutor Name */}
                    <TextField name="tutorName" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <User className="w-4 h-4" /> Tutor Name
                      </Label>
                      <Input
                        value={formValues.tutorName}
                        onChange={(e) => handleChange("tutorName", e.target.value)}
                        placeholder="Dr. Sarah Johnson"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 hover:border-opacity-80 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>

                    {/* Photo URL */}
                    <TextField name="photo" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <ImageIcon className="w-4 h-4" /> Profile Photo URL
                      </Label>
                      <div className="relative">
                        <Input
                          type="url"
                          value={formValues.photo}
                          onChange={(e) => { handleChange("photo", e.target.value); setPreviewImage(e.target.value); }}
                          placeholder="https://example.com/photo.jpg"
                          className={`w-full px-5 py-4 pr-16 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                        />
                        {previewImage ? (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-3 top-1/2 -translate-y-1/2">
                            <img src={previewImage} alt="preview" className="w-10 h-10 rounded-xl object-cover border-2 border-blue-500 shadow-sm" />
                          </motion.div>
                        ) : (
                          <div className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl ${isDark ? 'bg-gray-700 text-gray-500' : 'bg-slate-100 text-slate-400'}`}>
                            <UploadCloud className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <FieldError />
                    </TextField>

                    {/* Subject Select */}
                    <div>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <BookOpen className="w-4 h-4" /> Subject / Category
                      </Label>
                      <Select
                        value={formValues.subject}
                        onChange={(value) => handleChange("subject", value)}
                        placeholder="Select your expertise"
                        className="w-full"
                      >
                        <Select.Trigger className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}>
                          <Select.Value />
                          <Select.Indicator><ChevronDown className={`w-5 h-5 ${themeClasses.textMuted}`} /></Select.Indicator>
                        </Select.Trigger>
                        <Select.Popover className={`border rounded-2xl shadow-xl p-2 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
                          <ListBox className="space-y-1">
                            {subjects.map((subject) => (
                              <ListBox.Item
                                key={subject.value}
                                id={subject.value}
                                textValue={subject.value}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group/item ${isDark ? 'text-gray-300 hover:bg-blue-900/30 hover:text-blue-400' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
                              >
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${isDark ? subject.darkColor : subject.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                  {subject.icon}
                                </div>
                                <div className="flex-1 font-medium">{subject.value}</div>
                                <Check className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-indigo-600'} opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity`} />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Teaching Mode */}
                    <div>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Monitor className="w-4 h-4" /> Teaching Mode
                      </Label>
                      <Select
                        value={formValues.teachingMode}
                        onChange={(value) => handleChange("teachingMode", value)}
                        placeholder="How you'll teach"
                        className="w-full"
                      >
                        <Select.Trigger className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}>
                          <Select.Value />
                          <Select.Indicator><ChevronDown className={`w-5 h-5 ${themeClasses.textMuted}`} /></Select.Indicator>
                        </Select.Trigger>
                        <Select.Popover className={`border rounded-2xl shadow-xl p-2 ${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-slate-200'}`}>
                          <ListBox className="space-y-1">
                            {teachingModes.map((mode) => (
                              <ListBox.Item
                                key={mode.value}
                                id={mode.value}
                                textValue={mode.value}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all group/item ${isDark ? 'text-gray-300 hover:bg-blue-900/30 hover:text-blue-400' : 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700'}`}
                              >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-blue-900/30 text-blue-400 border border-blue-800' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
                                  {mode.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{mode.value}</div>
                                  <div className={`text-xs ${themeClasses.textMuted}`}>{mode.desc}</div>
                                </div>
                                <Check className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-indigo-600'} opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity`} />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Location */}
                    <TextField name="location" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <MapPin className="w-4 h-4" /> Location
                      </Label>
                      <Input
                        value={formValues.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="New York, USA"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>

                    {/* Institution */}
                    <TextField name="institutionExperience" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Building2 className="w-4 h-4" /> Institution & Experience
                      </Label>
                      <Input
                        value={formValues.institutionExperience}
                        onChange={(e) => handleChange("institutionExperience", e.target.value)}
                        placeholder="MIT, 8 Years Experience"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  <div className="flex justify-end pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
                    >
                      Next Step <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ====== SESSION INFORMATION ====== */}
              {activeSection === 1 && (
                <motion.div key="session" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl border ${isDark ? 'bg-amber-900/20 border-amber-800' : 'bg-amber-50 border-amber-100'}`}>
                      <CalendarDays className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${themeClasses.textPrimary}`}>Session Information</h2>
                      <p className={themeClasses.textSecondary}>Configure your availability and pricing</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <TextField name="availableDays" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Calendar className="w-4 h-4" /> Available Days
                      </Label>
                      <Input
                        value={formValues.availableDays}
                        onChange={(e) => handleChange("availableDays", e.target.value)}
                        placeholder="Sun - Thu"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="availableTime" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Clock className="w-4 h-4" /> Available Time
                      </Label>
                      <Input
                        value={formValues.availableTime}
                        onChange={(e) => handleChange("availableTime", e.target.value)}
                        placeholder="5:00 PM - 8:00 PM"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="hourlyFee" type="number" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <DollarSign className="w-4 h-4" /> Hourly Fee
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={formValues.hourlyFee}
                          onChange={(e) => handleChange("hourlyFee", e.target.value)}
                          placeholder="25"
                          className={`w-full px-5 py-4 pl-12 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                        />
                        <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-semibold ${themeClasses.textMuted}`}>$</span>
                      </div>
                      <FieldError />
                    </TextField>

                    <TextField name="totalSlot" type="number" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <Hash className="w-4 h-4" /> Available Slots
                      </Label>
                      <Input
                        type="number"
                        value={formValues.totalSlot}
                        onChange={(e) => handleChange("totalSlot", e.target.value)}
                        placeholder="10"
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>

                    <TextField name="sessionStartDate" type="date" isRequired className="md:col-span-2">
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <CalendarDays className="w-4 h-4" /> Session Start Date
                      </Label>
                      <Input
                        type="date"
                        value={formValues.sessionStartDate}
                        onChange={(e) => handleChange("sessionStartDate", e.target.value)}
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  <div className="flex justify-between pt-4">
                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveSection(0)} className={`px-8 py-4 font-semibold transition-colors ${themeClasses.buttonSecondary}`}>
                      Back
                    </motion.button>
                    <motion.button type="button" whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }} onClick={handleNext} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all">
                      Next Step <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ====== TUTOR DESCRIPTION ====== */}
              {activeSection === 2 && (
                <motion.div key="description" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className={`p-3 rounded-2xl border ${isDark ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-100'}`}>
                      <FileText className={`w-6 h-6 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${themeClasses.textPrimary}`}>Tutor Description</h2>
                      <p className={themeClasses.textSecondary}>Showcase your teaching style and achievements</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <TextField name="description" isRequired>
                      <Label className={`flex items-center gap-2 text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                        <GraduationCap className="w-4 h-4" /> About Me
                      </Label>
                      <TextArea
                        value={formValues.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Write about your teaching style, experience, achievements, and what makes you unique..."
                        className={`w-full px-5 py-4 rounded-2xl border transition-all duration-300 min-h-[160px] resize-y leading-relaxed ${themeClasses.inputBg} ${themeClasses.inputFocus} focus:outline-none focus:ring-4`}
                      />
                      <FieldError />
                    </TextField>

                    {/* Preview Card */}
                    <div className={`p-6 rounded-2xl border ${themeClasses.previewBg}`}>
                      <div className={`flex items-center gap-2 mb-4 text-sm ${themeClasses.textSecondary}`}>
                        <Sparkles className="w-4 h-4 text-amber-500" /> Preview how students will see your profile
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-2xl shadow-lg overflow-hidden">
                          {previewImage ? (
                            <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div>
                          <div className={`font-semibold text-lg ${themeClasses.textPrimary}`}>
                            {formValues.tutorName || "Your Name"}
                          </div>
                          <div className={`text-sm flex items-center gap-2 ${themeClasses.textSecondary}`}>
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            {formValues.subject || "New Tutor"}
                          </div>
                          {formValues.institutionExperience && (
                            <div className={`text-xs mt-1 flex items-center gap-1 ${themeClasses.textMuted}`}>
                              <Building2 className="w-3 h-3" /> {formValues.institutionExperience}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-opacity-20 border-slate-200 dark:border-gray-700">
                    <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setActiveSection(1)} className={`px-8 py-4 font-semibold transition-colors ${themeClasses.buttonSecondary}`}>
                      Back
                    </motion.button>

                    <div className="flex items-center gap-4">
                      <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => router.push("/my-tutors")} className={`px-6 py-4 font-semibold transition-colors flex items-center gap-2 ${themeClasses.buttonSecondary}`}>
                        <X className="w-4 h-4" /> Cancel
                      </motion.button>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          isDisabled={loading}
                          className="relative px-10 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                          <span className="relative flex items-center gap-2">
                            {loading ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating Profile...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-5 h-5" /> Create Tutor Profile
                              </>
                            )}
                          </span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </Card>

        {/* Footer */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-4xl mx-auto mt-8 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm text-sm ${isDark ? 'bg-gray-800/80 border-gray-700 text-gray-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            <Award className="w-4 h-4 text-amber-500" /> Join 1,000+ expert tutors on TutorFlux
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddTutorPage;