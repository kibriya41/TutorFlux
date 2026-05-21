"use client";

import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap, ArrowRight, BookOpen, Users,
  CalendarCheck, Shield, Star, Zap, ChevronRight,
  Play, CheckCircle2, TrendingUp, Award,
  Sparkles, Clock, Target, Lightbulb
} from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDark, setIsDark] = useState(false);

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

  const slides = [
    {
      title: "Find Expert Tutors",
      subtitle: "Book Your Success",
      description: "Connect with verified tutors for personalized online learning. Book sessions, get your digital token and learn without scheduling conflicts.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      accent: "from-blue-600 via-indigo-600 to-violet-600",
      icon: <GraduationCap className="w-5 h-5" />
    },
    {
      title: "Smart Booking System",
      subtitle: "No More Conflicts",
      description: "Our intelligent scheduling prevents time slot conflicts automatically. Focus on learning, we handle the logistics.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
      accent: "from-violet-600 via-purple-600 to-pink-600",
      icon: <CalendarCheck className="w-5 h-5" />
    },
    {
      title: "Digital Session Tokens",
      subtitle: "Secure & Organized",
      description: "Every booking generates a unique digital token. Manage your classes efficiently with our organized dashboard.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      accent: "from-emerald-600 via-teal-600 to-cyan-600",
      icon: <Shield className="w-5 h-5" />
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Expert Tutors",
      description: "Learn from verified professionals with proven experience",
      color: "from-blue-500 to-indigo-500"
    },
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "AI-powered booking that prevents all conflicts",
      color: "from-violet-500 to-purple-500"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Tokens",
      description: "Digital session tokens for every booking",
      color: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Booking",
      description: "Book a session in under 60 seconds",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "1-on-1 Learning",
      description: "Personalized attention for better results",
      color: "from-rose-500 to-pink-500"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your learning journey with insights",
      color: "from-cyan-500 to-blue-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Engineering Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "TutorFlux helped me find the perfect tutor for my exams. The booking process is so easy!",
      rating: 5,
      subject: "Mathematics"
    },
    {
      name: "Michael Chen",
      role: "High School Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "The tutors are amazing and very supportive. My concepts are now much clearer.",
      rating: 5,
      subject: "Physics"
    },
    {
      name: "Emma Davis",
      role: "College Student",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "Finally a platform that makes tutor booking simple and efficient. Highly recommended!",
      rating: 5,
      subject: "Programming"
    }
  ];

  const stats = [
    { value: "10K+", label: "Students", icon: Users },
    { value: "1K+", label: "Expert Tutors", icon: GraduationCap },
    { value: "20K+", label: "Sessions Booked", icon: CalendarCheck },
    { value: "98%", label: "Satisfaction", icon: Star }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0a0e1a] relative overflow-hidden transition-colors duration-500">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/20 dark:bg-indigo-900/10 rounded-full blur-[150px]"
        />
        <div className={`absolute inset-0 bg-[radial-gradient(circle,${isDark ? '#1e293b' : '#e2e8f0'}_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 transition-colors duration-500`} />
      </div>

      {/* Hero Section with Slider */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800/80 border border-blue-100 dark:border-blue-800 shadow-sm mb-6 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Trusted by 10K+ Students</span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                  {slides[currentSlide].title},{" "}
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slides[currentSlide].accent}`}>
                    {slides[currentSlide].subtitle}
                  </span>
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-lg">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onPress={() => router.push("/register")}
                  className="px-8 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Play className="w-4 h-4 text-blue-600 dark:text-blue-400 ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 sm:gap-8">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.1 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <stat.icon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                    <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2 mt-8">
              {slides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-500 flex items-center gap-2 ${
                    idx === currentSlide
                      ? 'w-10 bg-gradient-to-r from-blue-600 to-indigo-600'
                      : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  {idx === currentSlide && slide.icon}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-200/50 dark:shadow-blue-900/30">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slides[currentSlide].image}
                  alt="Hero"
                  className="w-full h-[400px] sm:h-[500px] object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                />
              </AnimatePresence>

              {/* Overlay Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute bottom-6 left-6 right-6"
              >
                <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 p-4 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 dark:text-white">Session Token</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">MQ-7856-34DF • Active</div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-xl flex flex-col items-center justify-center text-white"
            >
              <Star className="w-5 h-5 fill-white mb-0.5" />
              <span className="font-bold text-lg">4.9</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-slate-100 dark:border-gray-700"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">Verified</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Expert Tutor</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">TutorFlux?</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
            We make learning simple, effective and hassle-free for everyone.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Card className="bg-white dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700/50 p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all duration-500 h-full backdrop-blur-sm">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg flex items-center justify-center text-white mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 rounded-3xl p-12 lg:p-16 text-white overflow-hidden relative"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          />

          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-blue-100 text-lg">Get started in three simple steps</p>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up in seconds with email or Google", icon: <Target className="w-6 h-6" /> },
              { step: "02", title: "Find Tutor", desc: "Browse and filter by subject, price, and availability", icon: <Lightbulb className="w-6 h-6" /> },
              { step: "03", title: "Book Session", desc: "Get your digital token and start learning", icon: <Clock className="w-6 h-6" /> }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center relative"
              >
                {idx < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-white/20">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="h-full bg-white/40 origin-left"
                    />
                  </div>
                )}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl font-bold mb-6 mx-auto shadow-xl"
                >
                  {item.icon}
                </motion.div>
                <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-bold mb-3">Step {item.step}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-blue-100">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            What Our Students Say
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Real feedback from real learners</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white dark:bg-gray-800/50 border border-slate-200 dark:border-gray-700/50 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all h-full backdrop-blur-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 dark:ring-blue-900"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium">
                      {testimonial.subject}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-12 lg:p-16 text-center text-white overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-6 shadow-xl"
            >
              <GraduationCap className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of students learning with expert tutors on TutorFlux.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onPress={() => router.push("/register")}
                  className="px-8 py-6 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onPress={() => router.push("/tutors")}
                  variant="bordered"
                  className="px-8 py-6 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-lg"
                >
                  Browse Tutors
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;