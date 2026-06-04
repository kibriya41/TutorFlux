"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  BookOpen,
  Moon,
  Sun,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import NavLink from "./NavLink";
import { CustomTrigger } from "./CustomTrigger";

const Navbar = () => {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [darkMode, setDarkMode] = useState(false);

  // Sync theme with localStorage and classList on mount and changes
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Automatically fetch JWT from backend and store in localStorage when user session exists
  useEffect(() => {
    if (user?.email) {
      const existingToken = localStorage.getItem("token");
      if (!existingToken) {
        fetch("http://localhost:7000/jwt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.token) {
              localStorage.setItem("token", data.token);
            }
          })
          .catch((err) => console.error("JWT fetch error", err));
      }
    } else {
      localStorage.removeItem("token");
    }
  }, [user]);

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:bg-[#0f172a] dark:border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="TutorFlux" className="w-11 h-11 rounded-xl object-cover shadow-lg" />

            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Tutor<span className="text-blue-600">Flux</span>
              </h1>

              <p className="text-[11px] tracking-widest text-gray-500 dark:text-gray-400 uppercase">
                Learn. Grow. Excel.
              </p>
            </div>
          </Link>

          {/* Menu */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            >
              Home
            </NavLink>

            <NavLink
              href="/tutors"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            >
              Tutors
            </NavLink>

            {user && (
              <>
                <NavLink
                  href="/add-tutor"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
                >
                  Add Tutor
                </NavLink>

                <NavLink
                  href="/my-tutors"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
                >
                  My Tutors
                </NavLink>

                <NavLink
                  href="/booked"
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
                >
                  My Booked Sessions
                </NavLink>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Sign In / Profile */}
            {user ? (
              <CustomTrigger />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 font-medium transition"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
