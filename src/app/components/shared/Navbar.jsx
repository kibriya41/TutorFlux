"use client";

import React from "react";
import Link from "next/link";
import { Moon, Bell } from "lucide-react";
import { Avatar } from "@heroui/react";

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Left Side */}
          <div className="flex items-center gap-12">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                M
              </div>

              <h1 className="text-2xl font-bold text-blue-600">
                MediQueue
              </h1>
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
              
              <Link
                href="/"
                className="relative text-black after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-blue-600"
              >
                Home
              </Link>

              <Link
                href="/tutors"
                className="hover:text-blue-600 transition-colors"
              >
                Tutors
              </Link>

              <Link
                href="/add-tutor"
                className="hover:text-blue-600 transition-colors"
              >
                Add Tutor
              </Link>

              <Link
                href="/my-tutors"
                className="hover:text-blue-600 transition-colors"
              >
                My Tutors
              </Link>

              <Link
                href="/booked-sessions"
                className="hover:text-blue-600 transition-colors"
              >
                My Booked Sessions
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            
            {/* Dark Mode Icon */}
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <Moon size={18} className="text-gray-700" />
            </button>

            {/* Notification */}
            <button className="relative w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition">
              <Bell size={18} className="text-gray-700" />

              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <Avatar
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              className="w-11 h-11"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;