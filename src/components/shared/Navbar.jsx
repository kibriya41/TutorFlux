
import React from "react";
import Link from "next/link";
import { Moon, Bell } from "lucide-react";
import { Avatar } from "@heroui/react";
import NavLink from "./NavLink";
import ThemeToggle from "./ThemeToggleBtn";

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              M
            </div>

            <h1 className="text-2xl font-bold">
              Tutor<span className="text-blue-600 font-semibold">Flux</span>
            </h1>
          </Link>

          {/* Left Side */}
          <div className="flex items-center gap-12">


            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">

              <NavLink
                href="/"
                className="hover:text-blue-600 transition-colors"
              >
                Home
              </NavLink>

              <NavLink
                href="/tutors"
                className="hover:text-blue-600 transition-colors"
              >
                Tutors
              </NavLink>

              <NavLink
                href="/add-tutor"
                className="hover:text-blue-600 transition-colors"
              >
                Add Tutor
              </NavLink>

              <NavLink
                href="/my-tutors"
                className="hover:text-blue-600 transition-colors"
              >
                My Tutors
              </NavLink>

              <NavLink
                href="/my-booked-sessions"
                className="hover:text-blue-600 transition-colors"
              >
                My Booked Sessions
              </NavLink>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            {/* Dark Mode Icon */}

            <ThemeToggle />


            {/* Sign In Button */}
            <Link
              href="/login"
              className=" font-medium hover:text-blue-600 transition-colors duration-200"
            >
              Sign In
            </Link>

            {/* Get Started Button */}
            <Link
              href="/register"
              className="bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-blue-400 transition-all duration-200 shadow-sm"
            >
              Get Started
            </Link>

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;