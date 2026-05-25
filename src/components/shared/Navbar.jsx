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

  const {
    data: session,
  } = authClient.useSession()

  const user = session?.user;

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <nav className="w-full border-b border-gray-200 bg-white dark:bg-[#0f172a] dark:border-gray-800 transition-all duration-300">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <BookOpen className="text-white w-5 h-5" />
            </div>

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
              className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
            >
              Home
            </NavLink>

            <NavLink
              href="/tutors"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 transition"
            >
              Tutors
            </NavLink>

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

              Booked
            </NavLink>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Sign In */}
            {
              user ?
                <>
                <CustomTrigger/>
                </>
                :
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
            }

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;