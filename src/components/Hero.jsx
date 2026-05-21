"use client"

import { Button, Card } from "@heroui/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  GraduationCap, ArrowRight, BookOpen, Users,
  CalendarCheck, Shield, Star, Zap, ChevronRight,
  Play, CheckCircle2, TrendingUp, Award
} from "lucide-react";
import { useState, useEffect } from "react";

const Hero = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Find Expert Tutors",
      subtitle: "Book Your Success",
      description: "Connect with verified tutors for personalized online learning. Book sessions, get your digital token and learn without scheduling conflicts.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
      stats: "10K+ Students"
    },
    {
      title: "Smart Booking System",
      subtitle: "No More Conflicts",
      description: "Our intelligent scheduling prevents time slot conflicts automatically. Focus on learning, we handle the logistics.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
      stats: "20K+ Sessions"
    },
    {
      title: "Digital Session Tokens",
      subtitle: "Secure & Organized",
      description: "Every booking generates a unique digital token. Manage your classes efficiently with our organized dashboard.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop",
      stats: "98% Satisfaction"
    }
  ];

  const features = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Expert Tutors",
      description: "Learn from verified professionals with proven experience"
    },
    {
      icon: <CalendarCheck className="w-6 h-6" />,
      title: "Smart Scheduling",
      description: "AI-powered booking that prevents all conflicts"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Tokens",
      description: "Digital session tokens for every booking"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Booking",
      description: "Book a session in under 60 seconds"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "1-on-1 Learning",
      description: "Personalized attention for better results"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Track Progress",
      description: "Monitor your learning journey with insights"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Engineering Student",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      text: "MediQueue helped me find the perfect tutor for my exams. The booking process is so easy!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "High School Student",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      text: "The tutors are amazing and very supportive. My concepts are now much clearer.",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "College Student",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      text: "Finally a platform that makes tutor booking simple and efficient. Highly recommended!",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-100/50 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/30 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,#e2e8f0_1px,transparent_1px)] bg-[size:24px_24px] opacity-40" />
      </div>

      {/* Hero Section with Slider */}
      <section className="relative z-10 container mx-auto px-6 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-100 shadow-sm mb-6">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-slate-700">Trusted by 10K+ Students</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-4 leading-tight">
                  {slides[currentSlide].title},{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                    {slides[currentSlide].subtitle}
                  </span>
                </h1>
                <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
                  {slides[currentSlide].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onPress={() => router.push("/register")}
                  className=" px-8 py-10 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-200 hover:shadow-2xl transition-all text-lg"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Play className="w-4 h-4 text-indigo-600 ml-0.5" />
                </div>
                Watch Demo
              </motion.button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              {[
                { value: "10K+", label: "Students" },
                { value: "1K+", label: "Expert Tutors" },
                { value: "20K+", label: "Sessions Booked" },
                { value: "98%", label: "Satisfaction" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="flex gap-2 mt-8">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === currentSlide
                      ? 'w-8 bg-indigo-600'
                      : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                />
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
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-200/50">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentSlide}
                  src={slides[currentSlide].image}
                  alt="Hero"
                  className="w-full h-[500px] object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.7 }}
                />
              </AnimatePresence>

              {/* Overlay Card */}
              <div className="absolute bottom-6 left-6 right-6">
                <Card className="bg-white/90 backdrop-blur-xl border border-white/20 p-4 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">Session Token</div>
                      <div className="text-sm text-slate-500">MQ-7856-34DF • Your Session Token</div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500 ml-auto" />
                  </div>
                </Card>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-400 rounded-2xl shadow-xl flex items-center justify-center text-white font-bold text-lg"
            >
              4.9
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">MediQueue?</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            We make learning simple, effective and hassle-free for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 transition-all duration-300 h-full">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 lg:p-16 text-white overflow-hidden relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-indigo-100 text-lg">Get started in three simple steps</p>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Create Account", desc: "Sign up in seconds with email or Google" },
              { step: "02", title: "Find Tutor", desc: "Browse and filter by subject, price, and availability" },
              { step: "03", title: "Book Session", desc: "Get your digital token and start learning" }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl font-bold mb-6 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-indigo-100">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-slate-500 text-lg">Real feedback from real learners</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all h-full">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 lg:p-16 text-center text-white overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Join thousands of students learning with expert tutors on MediQueue.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onPress={() => router.push("/register")}
                className="px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg"
              >
                Get Started Free
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                onPress={() => router.push("/tutors")}
                variant="bordered"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 transition-all text-lg"
              >
                Browse Tutors
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
};

export default Hero;