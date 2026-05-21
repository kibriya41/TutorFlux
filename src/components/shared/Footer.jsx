"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  ArrowUpRight,
  Heart,
  GraduationCap,
  Clock,
  Users,
  Award,
} from "lucide-react";

const Footer = () => {
  const [openSections, setOpenSections] = useState({});
  const [email, setEmail] = useState("");

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert("Thanks for subscribing to TutorFlux!");
      setEmail("");
    }
  };

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Find Tutors", href: "/tutors" },
    { name: "Add Tutor", href: "/add-tutor" },
    { name: "My Tutors", href: "/my-tutors" },
    { name: "My Booked Sessions", href: "/my-booked-sessions" },
  ];

  const learningServices = [
    { name: "Online Tutoring", href: "/services/online-tutoring", icon: GraduationCap },
    { name: "Exam Preparation", href: "/services/exam-preparation", icon: Award },
    { name: "Homework Help", href: "/services/homework-help", icon: Clock },
    { name: "Career Guidance", href: "/services/career-guidance", icon: Users },
    { name: "Language Learning", href: "/services/language-learning", icon: BookOpen },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "FAQ", href: "/faq" },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      href: "https://twitter.com/tutorflux",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com/tutorflux",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/tutorflux",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/tutorflux",
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
  ];

  const LinkSection = ({ title, links, sectionKey, isIcon = false }) => (
    <div className="border-b border-gray-800/50 md:border-none pb-4 md:pb-0">
      {/* Mobile: Clickable header */}
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full md:hidden py-3"
      >
        <h3 className="text-white font-semibold text-sm uppercase tracking-wider">{title}</h3>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${
            openSections[sectionKey] ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Desktop: Static header */}
      <h3 className="hidden md:block text-white font-semibold text-sm uppercase tracking-wider mb-5">
        {title}
      </h3>

      {/* Links - Collapsible on mobile */}
      <ul
        className={`space-y-3 md:block ${
          openSections[sectionKey] ? "block" : "hidden"
        }`}
      >
        {links.map((link) => (
          <li key={link.name}>
            <Link
              href={link.href}
              className="group flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-all duration-200 py-1 md:py-0"
            >
              {isIcon && link.icon && (
                <link.icon className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
              )}
              <span className="group-hover:translate-x-1 transition-transform duration-200">
                {link.name}
              </span>
              {!isIcon && (
                <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200 text-blue-400" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-[#0f172a] dark:bg-[#020617] text-gray-300 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />

      {/* Newsletter Section */}
      <div className="relative border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Stay Ahead in Your Learning Journey
              </h3>
              <p className="text-gray-400 text-sm md:text-base max-w-lg">
                Get weekly tutor recommendations, study tips, and exclusive offers delivered to your inbox.
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto gap-3"
            >
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all whitespace-nowrap"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
          {/* Brand Column */}
          <div className="lg:col-span-4 mb-6 md:mb-0 pb-6 md:pb-0 border-b border-gray-800/50 md:border-none">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30"
              >
                <BookOpen className="w-5 h-5" />
              </motion.div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight">
                  Tutor<span className="text-blue-500">Flux</span>
                </span>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase">
                  Learn. Grow. Excel.
                </p>
              </div>
            </Link>

            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-sm">
              Your smart platform for finding expert tutors and booking personalized learning sessions. Join thousands of students achieving their academic goals.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href="mailto:support@tutorflux.com"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <Mail className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
                </div>
                support@tutorflux.com
              </a>
              <a
                href="tel:+8801856567890"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center group-hover:bg-blue-600/20 transition-colors">
                  <Phone className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
                </div>
                +880 1856-567890
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-gray-800/50 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                Dhaka, Bangladesh
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <LinkSection
              title="Quick Links"
              links={quickLinks}
              sectionKey="quickLinks"
            />
          </div>

          {/* Learning Services */}
          <div className="lg:col-span-3">
            <LinkSection
              title="Learning Services"
              links={learningServices}
              sectionKey="learningServices"
              isIcon
            />
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <LinkSection
              title="Support & Legal"
              links={supportLinks}
              sectionKey="support"
            />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              © {new Date().getFullYear()} TutorFlux. Made with{" "}
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for
              learners worldwide.
            </p>

            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link
                href="/terms"
                className="hover:text-white transition-colors"
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="hover:text-white transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="hover:text-white transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;