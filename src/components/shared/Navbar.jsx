"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
  BookOpen,
  PlusCircle,
  CalendarCheck,
  GraduationCap,
  Moon,
  Sun,
  Bell,
  Search,
} from "lucide-react";
import { Avatar, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── NavLink Component ─── */
const NavLink = ({ href, children, icon: Icon }) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`relative group flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
        isActive
          ? "text-blue-600 bg-blue-50/80 dark:bg-blue-900/20"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50"
      }`}
    >
      {Icon && <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"}`} />}
      <span>{children}</span>
      
      {/* Active Indicator */}
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

/* ─── Mobile NavLink ─── */
const MobileNavLink = ({ href, children, icon: Icon, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
      }`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </Link>
  );
};

/* ─── Main Navbar ─── */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [notifications] = useState(3); // Demo notification count
  const [user] = useState(null); // Set to user object when logged in

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // Initialize theme
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) setTheme("dark");
  }, []);

  const navLinks = [
    { href: "/", label: "Home", icon: null },
    { href: "/tutors", label: "Tutors", icon: Search },
    { href: "/add-tutor", label: "Add Tutor", icon: PlusCircle },
    { href: "/my-tutors", label: "My Tutors", icon: GraduationCap },
    { href: "/my-booked-sessions", label: "Booked", icon: CalendarCheck },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-gray-200/20 dark:shadow-black/20 border-b border-gray-200/50 dark:border-gray-800/50"
            : "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* ═══ Logo ═══ */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30"
              >
                <BookOpen className="w-5 h-5" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-none">
                  Tutor<span className="text-blue-600">Flux</span>
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium tracking-widest uppercase">
                  Learn. Grow. Excel.
                </span>
              </div>
            </Link>

            {/* ═══ Desktop Navigation ═══ */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink key={link.href} href={link.href} icon={link.icon}>
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* ═══ Right Side Actions ═══ */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <AnimatePresence mode="wait">
                  {theme === "light" ? (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sun"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <Badge
                    content={notifications}
                    color="danger"
                    size="sm"
                    className="absolute -top-1 -right-1"
                  />
                )}
              </motion.button>

              {/* Auth Section */}
              {user ? (
                /* Logged In - Profile Dropdown */
                <Dropdown>
                  <DropdownTrigger>
                    <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <Avatar
                        src={user.photo || "https://i.pravatar.cc/150?img=32"}
                        size="sm"
                        className="w-8 h-8"
                      />
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions">
                    <DropdownItem key="profile" startContent={<User className="w-4 h-4" />}>
                      My Profile
                    </DropdownItem>
                    <DropdownItem key="settings" startContent={<BookOpen className="w-4 h-4" />}>
                      Settings
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      className="text-danger"
                      color="danger"
                      startContent={<LogOut className="w-4 h-4" />}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              ) : (
                /* Not Logged In - Auth Buttons */
                <div className="hidden sm:flex items-center gap-2 ml-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ═══ Mobile Menu ═══ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-16 lg:hidden z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.href}
                  href={link.href}
                  icon={link.icon}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </MobileNavLink>
              ))}

              {/* Mobile Auth */}
              <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-4 h-4" /> Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};

export default Navbar;