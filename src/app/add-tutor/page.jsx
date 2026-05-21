"use client"

import { FieldError, Input, Label, TextField, Select, ListBox, TextArea, Button, Card } from "@heroui/react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, ImageIcon, BookOpen, Monitor, MapPin, Building2,
  CalendarDays, Clock, DollarSign, Hash, Calendar,
  FileText, Sparkles, ChevronDown, Check, X, UploadCloud,
  GraduationCap, Award, Star, Zap, ArrowRight, AlertCircle
} from "lucide-react";

const AddTutorPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [previewImage, setPreviewImage] = useState("");
  const [formProgress, setFormProgress] = useState(0);

  // Controlled form state
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
    { value: "Mathematics", icon: "∑", color: "from-blue-500 to-cyan-400" },
    { value: "Physics", icon: "⚛", color: "from-purple-500 to-pink-400" },
    { value: "Chemistry", icon: "🧪", color: "from-green-500 to-emerald-400" },
    { value: "Biology", icon: "🧬", color: "from-rose-500 to-orange-400" },
    { value: "English", icon: "✎", color: "from-amber-500 to-yellow-400" },
    { value: "Programming", icon: "</>", color: "from-indigo-500 to-violet-400" },
    { value: "History", icon: "🏛", color: "from-stone-500 to-orange-300" },
    { value: "Economics", icon: "📈", color: "from-teal-500 to-cyan-400" }
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

  // Handle input changes
  const handleChange = (field, value) => {
    setFormValues(prev => {
      const updated = { ...prev, [field]: value };
      // Calculate progress
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
            <p className="font-semibold text-red-800">Please fill in all required fields</p>
            <p className="text-sm text-red-600 mt-1">
              Missing: {emptyFields.join(", ")}
            </p>
          </div>
        </div>,
        {
          duration: 4000,
          style: {
            borderRadius: '16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
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

  const validateAllFields = () => {
    const allFields = sections.flatMap(s => s.fields);
    const emptyFields = [];

    allFields.forEach(fieldName => {
      const val = formValues[fieldName];
      if (!val || (typeof val === 'string' && !val.trim())) {
        emptyFields.push(fieldLabels[fieldName]);
      }
    });

    if (emptyFields.length > 0) {
      const firstEmptyField = allFields.find(fieldName => {
        const val = formValues[fieldName];
        return !val || (typeof val === 'string' && !val.trim());
      });
      const sectionIndex = sections.findIndex(s => s.fields.includes(firstEmptyField));
      if (sectionIndex !== -1 && sectionIndex !== activeSection) {
        setActiveSection(sectionIndex);
      }

      toast.error(
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">Please complete all required fields</p>
            <p className="text-sm text-red-600 mt-1">
              Missing: {emptyFields.join(", ")}
            </p>
          </div>
        </div>,
        {
          duration: 5000,
          style: {
            borderRadius: '16px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            padding: '16px 20px',
            maxWidth: '400px'
          }
        }
      );
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const tutor = formValues;
    console.log(tutor);

    const res = await fetch('http://localhost:7000/tutor', {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(tutor)
    })
const data = await res.json()
console.log(data)
  toast.success("Tutor profile created successfully!");
    router.push("/my-tutors");

  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-150 h-150 bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/30 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      </div>

      <div className="relative z-10 py-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm mb-6">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-indigo-900">Create Your Teaching Profile</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">TutorFlux Tutor</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Share your expertise with thousands of eager students. Complete your profile below.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Profile Completion</span>
            <span className="text-sm font-bold text-indigo-600">{Math.round(formProgress)}%</span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
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
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-300 shadow-sm ${activeSection === idx
                  ? 'bg-white border-indigo-200 text-indigo-900 shadow-md shadow-indigo-100'
                  : 'bg-white/80 border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-700'
                  }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${activeSection === idx ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                  {section.icon}
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">{section.title}</div>
                  <div className="text-xs text-slate-400">{section.fields.length} fields</div>
                </div>
                {activeSection === idx && (
                  <motion.div layoutId="activeIndicator" className="w-2 h-2 rounded-full bg-indigo-500 ml-2" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        <Card className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-xl shadow-slate-200/50">
          <form onSubmit={onSubmit} className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {/* ====== BASIC INFORMATION ====== */}
              {activeSection === 0 && (
                <motion.div
                  key="basic"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100">
                      <User className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Basic Information</h2>
                      <p className="text-slate-500 text-sm">Tell us about yourself and your expertise</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tutor Name */}
                    <TextField name="tutorName" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <User className="w-4 h-4" />
                        Tutor Name
                      </Label>
                      <Input
                        value={formValues.tutorName}
                        onChange={(e) => handleChange("tutorName", e.target.value)}
                        placeholder="Dr. Sarah Johnson"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300"
                      />
                      <FieldError />
                    </TextField>

                    {/* Photo URL */}
                    <TextField name="photo" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <ImageIcon className="w-4 h-4" />
                        Profile Photo URL
                      </Label>
                      <div className="relative">
                        <Input
                          type="url"
                          value={formValues.photo}
                          onChange={(e) => {
                            handleChange("photo", e.target.value);
                            setPreviewImage(e.target.value);
                          }}
                          placeholder="https://example.com/photo.jpg"
                          className="w-full px-5 py-4 pr-16 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300"
                        />
                        {previewImage ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                          >
                            <img src={previewImage} alt="preview" className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-200 shadow-sm" />
                          </motion.div>
                        ) : (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-100 text-slate-400">
                            <UploadCloud className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <FieldError />
                    </TextField>

                    {/* Subject Select - FREE HEROUI v3 API */}
                    <div>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <BookOpen className="w-4 h-4" />
                        Subject / Category
                      </Label>
                      <Select
                        value={formValues.subject}
                        onChange={(value) => handleChange("subject", value)}
                        placeholder="Select your expertise"
                        className="w-full"
                      >
                        <Select.Trigger className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300">
                          <Select.Value />
                          <Select.Indicator>
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          </Select.Indicator>
                        </Select.Trigger>
                        <Select.Popover className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-2">
                          <ListBox className="space-y-1">
                            {subjects.map((subject) => (
                              <ListBox.Item
                                key={subject.value}
                                id={subject.value}
                                textValue={subject.value}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-all group/item"
                              >
                                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subject.color} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                  {subject.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{subject.value}</div>
                                </div>
                                <Check className="w-4 h-4 text-indigo-600 opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity" />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Teaching Mode Select - FREE HEROUI v3 API */}
                    <div>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <Monitor className="w-4 h-4" />
                        Teaching Mode
                      </Label>
                      <Select
                        value={formValues.teachingMode}
                        onChange={(value) => handleChange("teachingMode", value)}
                        placeholder="How you'll teach"
                        className="w-full"
                      >
                        <Select.Trigger className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300">
                          <Select.Value />
                          <Select.Indicator>
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          </Select.Indicator>
                        </Select.Trigger>
                        <Select.Popover className="bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-2">
                          <ListBox className="space-y-1">
                            {teachingModes.map((mode) => (
                              <ListBox.Item
                                key={mode.value}
                                id={mode.value}
                                textValue={mode.value}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 cursor-pointer transition-all group/item"
                              >
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                                  {mode.icon}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium">{mode.value}</div>
                                  <div className="text-xs text-slate-400">{mode.desc}</div>
                                </div>
                                <Check className="w-4 h-4 text-indigo-600 opacity-0 group-data-[selected=true]/item:opacity-100 transition-opacity" />
                              </ListBox.Item>
                            ))}
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </div>

                    {/* Location */}
                    <TextField name="location" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        value={formValues.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        placeholder="New York, USA"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300"
                      />
                      <FieldError />
                    </TextField>

                    {/* Institution & Experience */}
                    <TextField name="institutionExperience" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <Building2 className="w-4 h-4" />
                        Institution & Experience
                      </Label>
                      <Input
                        value={formValues.institutionExperience}
                        onChange={(e) => handleChange("institutionExperience", e.target.value)}
                        placeholder="MIT, 8 Years Experience"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 hover:border-slate-300"
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
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-shadow"
                    >
                      Next Step
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ====== SESSION INFORMATION ====== */}
              {activeSection === 1 && (
                <motion.div
                  key="session"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100">
                      <CalendarDays className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Session Information</h2>
                      <p className="text-slate-500 text-sm">Configure your availability and pricing</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Available Days */}
                    <TextField name="availableDays" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <Calendar className="w-4 h-4" />
                        Available Days
                      </Label>
                      <Input
                        value={formValues.availableDays}
                        onChange={(e) => handleChange("availableDays", e.target.value)}
                        placeholder="Sun - Thu"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 hover:border-slate-300"
                      />
                      <FieldError />
                    </TextField>

                    {/* Available Time */}
                    <TextField name="availableTime" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <Clock className="w-4 h-4" />
                        Available Time
                      </Label>
                      <Input
                        value={formValues.availableTime}
                        onChange={(e) => handleChange("availableTime", e.target.value)}
                        placeholder="5:00 PM - 8:00 PM"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 hover:border-slate-300"
                      />
                      <FieldError />
                    </TextField>

                    {/* Hourly Fee */}
                    <TextField name="hourlyFee" type="number" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <DollarSign className="w-4 h-4" />
                        Hourly Fee
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={formValues.hourlyFee}
                          onChange={(e) => handleChange("hourlyFee", e.target.value)}
                          placeholder="25"
                          min="0"
                          className="w-full px-5 py-4 pl-12 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 hover:border-slate-300"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                      </div>
                      <FieldError />
                    </TextField>

                    {/* Total Slots */}
                    <TextField name="totalSlot" type="number" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <Hash className="w-4 h-4" />
                        Available Slots
                      </Label>
                      <Input
                        type="number"
                        value={formValues.totalSlot}
                        onChange={(e) => handleChange("totalSlot", e.target.value)}
                        placeholder="10"
                        min="1"
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 hover:border-slate-300"
                      />
                      <FieldError />
                    </TextField>

                    {/* Session Start Date */}
                    <TextField name="sessionStartDate" type="date" isRequired className="md:col-span-2">
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <CalendarDays className="w-4 h-4" />
                        Session Start Date
                      </Label>
                      <Input
                        type="date"
                        value={formValues.sessionStartDate}
                        onChange={(e) => handleChange("sessionStartDate", e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all duration-300 hover:border-slate-300"
                      />
                      <FieldError />
                    </TextField>
                  </div>

                  <div className="flex justify-between pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(0)}
                      className="px-8 py-4 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
                    >
                      Back
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-2xl shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-shadow"
                    >
                      Next Step
                      <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* ====== TUTOR DESCRIPTION ====== */}
              {activeSection === 2 && (
                <motion.div
                  key="description"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                      <FileText className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Tutor Description</h2>
                      <p className="text-slate-500 text-sm">Showcase your teaching style and achievements</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Description */}
                    <TextField name="description" isRequired>
                      <Label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <GraduationCap className="w-4 h-4" />
                        About Me
                      </Label>
                      <TextArea
                        value={formValues.description}
                        onChange={(e) => handleChange("description", e.target.value)}
                        placeholder="Write about your teaching style, experience, achievements, and what makes you unique..."
                        className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 hover:border-slate-300 min-h-[160px] resize-y leading-relaxed"
                      />
                      <FieldError />
                    </TextField>

                    {/* Preview Card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-200">
                      <div className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        Preview how students will see your profile
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-2xl shadow-lg shadow-indigo-200 overflow-hidden">
                          {previewImage ? (
                            <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="text-slate-900 font-semibold text-lg">
                            {formValues.tutorName || "Your Name"}
                          </div>
                          <div className="text-slate-500 text-sm flex items-center gap-2">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            {formValues.subject || "New Tutor"}
                          </div>
                          {formValues.institutionExperience && (
                            <div className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                              <Building2 className="w-3 h-3" />
                              {formValues.institutionExperience}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-slate-100">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveSection(1)}
                      className="px-8 py-4 text-slate-500 font-semibold hover:text-slate-700 transition-colors"
                    >
                      Back
                    </motion.button>

                    <div className="flex items-center gap-4">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => router.push("/my-tutors")}
                        className="px-6 py-4 text-slate-500 font-semibold hover:text-slate-700 transition-colors flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </motion.button>

                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="submit"
                          isDisabled={loading}
                          className="relative px-10 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-xl shadow-purple-200 hover:shadow-purple-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
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
                                <Sparkles className="w-5 h-5" />
                                Create Tutor Profile
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm text-slate-500">
            <Award className="w-4 h-4 text-amber-500" />
            Join 1,000+ expert tutors on TutorFlux
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AddTutorPage;