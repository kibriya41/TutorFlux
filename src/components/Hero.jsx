"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { 
  FaArrowRight, 
  FaChevronLeft, 
  FaChevronRight,
  FaGraduationCap,
  FaUsers,
  FaCalendarAlt,
  FaStar,
  FaVideo,
  FaShieldAlt,
  FaClock
} from "react-icons/fa";

// --- Animation Variants ---

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const floatAnimation = {
  y: [0, -12, 0],
  transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
};

// --- Components ---

const AnimatedCounter = ({ value, suffix = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);
  
  const numericValue = parseInt(value.replace(/\\D/g, ""));
  
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const increment = numericValue / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
};

const FloatingCard = ({ icon: Icon, title, subtitle, color, delay, position }) => {
  return (
    <motion.div
      className={`absolute ${position} bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 flex items-center gap-3 z-20 border border-white/50`}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5, transition: { duration: 0.2 } }}
    >
      <motion.div 
        className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}
        animate={{ rotate: [0, 5, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: delay + 1 }}
      >
        <Icon className="w-5 h-5 text-white" />
      </motion.div>
      <div>
        <p className="text-sm font-bold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </motion.div>
  );
};

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const totalSlides = 5;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: FaGraduationCap, value: "2K", suffix: "+", label: "Expert Tutors", iconBg: "bg-blue-50", iconColor: "text-blue-600" },
    { icon: FaUsers, value: "15K", suffix: "+", label: "Students", iconBg: "bg-purple-50", iconColor: "text-purple-600" },
    { icon: FaCalendarAlt, value: "25K", suffix: "+", label: "Sessions Booked", iconBg: "bg-indigo-50", iconColor: "text-indigo-600" },
    { icon: FaStar, value: "4.9", suffix: "/5", label: "Student Ratings", iconBg: "bg-amber-50", iconColor: "text-amber-500" },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen w-full overflow-hidden bg-[#f8f7ff]">
      
      {/* ===== FULL WIDTH COVER IMAGE BACKGROUND ===== */}
      <motion.div 
        className="absolute inset-0 w-full h-full"
        style={{ y: smoothY, scale }}
      >
        {/* Main background image - full width cover */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/images/hero-bg.jpg"
            alt="Background"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f8f7ff] via-[#f8f7ff]/95 to-[#f8f7ff]/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#f8f7ff]" />
        </div>

        {/* Animated background shapes */}
        <motion.div 
          className="absolute top-20 right-[15%] w-72 h-72 bg-purple-200/40 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-32 left-[10%] w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute top-1/2 right-[5%] w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* ===== MAIN CONTENT ===== */}
      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 md:pt-28 lg:pt-32 pb-8"
        style={{ opacity }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[70vh]">
          
          {/* Left Content */}
          <motion.div 
            className="relative z-10 max-w-xl"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full mb-8 shadow-sm border border-purple-100"
              variants={fadeInUp}
              custom={0}
            >
              <motion.span 
                className="w-2 h-2 bg-purple-500 rounded-full mr-2"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-sm font-semibold text-purple-700">Learn With Experts</span>
            </motion.div>

            {/* Heading with character animation */}
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] mb-6"
              variants={fadeInUp}
              custom={1}
            >
              Find The Perfect Tutor
              <br />
              <motion.span 
                className="text-[#4f46e5] inline-block"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{
                  background: "linear-gradient(90deg, #4f46e5, #7c3aed, #4f46e5)",
                  backgroundSize: "200% auto",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                Book & Learn Smarter
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-base sm:text-lg text-gray-500 leading-relaxed mb-10 max-w-lg"
              variants={fadeInUp}
              custom={2}
            >
              MediQueue connects you with expert tutors for personalized online learning. 
              Book sessions, get digital tokens & learn without schedule conflicts.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-12"
              variants={fadeInUp}
              custom={3}
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/tutors"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-[#4f46e5] text-white font-bold rounded-xl hover:bg-[#4338ca] transition-colors duration-300 shadow-lg shadow-indigo-500/25"
                >
                  Browse Tutors
                  <motion.span
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <FaArrowRight className="w-4 h-4" />
                  </motion.span>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  href="/become-tutor"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-sm text-[#4f46e5] font-bold rounded-xl border-2 border-[#4f46e5]/20 hover:border-[#4f46e5] hover:bg-white transition-all duration-300"
                >
                  Become a Tutor
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Image & Floating Cards */}
          <motion.div 
            className="relative hidden lg:block h-[500px]"
            variants={slideInRight}
            initial="hidden"
            animate="visible"
          >
            {/* Main hero image */}
            <motion.div 
              className="relative z-10 w-full h-full"
              animate={floatAnimation}
            >
              <Image
                src="/images/hero-student.png"
                alt="Student learning online"
                fill
                className="object-contain object-center"
                priority
              />
            </motion.div>

            {/* Floating feature cards */}
            <FloatingCard 
              icon={FaVideo} 
              title="Live Classes" 
              subtitle="Interactive Learning" 
              color="bg-blue-500" 
              delay={0.8}
              position="top-[5%] right-[10%]"
            />
            <FloatingCard 
              icon={FaShieldAlt} 
              title="Digital Token" 
              subtitle="Secure & Unique" 
              color="bg-teal-500" 
              delay={1.2}
              position="top-[32%] left-[0%]"
            />
            <FloatingCard 
              icon={FaClock} 
              title="Smart Booking" 
              subtitle="No Conflicts" 
              color="bg-purple-500" 
              delay={1.6}
              position="bottom-[15%] left-[5%]"
            />

            {/* Decorative dots */}
            <motion.div 
              className="absolute top-16 right-20 w-3 h-3 bg-purple-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-32 left-16 w-2 h-2 bg-blue-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/2 right-0 w-2.5 h-2.5 bg-indigo-400 rounded-full"
              animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </motion.div>
        </div>

        {/* Slider Navigation */}
        <motion.div 
          className="flex items-center justify-between mt-8 lg:mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <div className="flex gap-3">
            <motion.button 
              onClick={() => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)}
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 hover:text-[#4f46e5] hover:shadow-xl transition-all duration-200 border border-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous slide"
            >
              <FaChevronLeft className="w-4 h-4" />
            </motion.button>
            <motion.button 
              onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
              className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center text-gray-600 hover:text-[#4f46e5] hover:shadow-xl transition-all duration-200 border border-gray-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next slide"
            >
              <FaChevronRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="flex gap-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  currentSlide === index 
                    ? "bg-[#4f46e5] w-8" 
                    : "bg-gray-300 w-2.5 hover:bg-gray-400"
                }`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* ===== STATS BAR ===== */}
        <motion.div 
          className="mt-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-white/60 p-6 sm:p-8"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7, ease: "easeOut" }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div 
                  className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </motion.div>
                <div>
                  <p className="text-2xl font-extrabold text-gray-900">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;