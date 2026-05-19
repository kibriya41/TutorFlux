// components/Footer.jsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  FaXTwitter, 
  FaFacebookF, 
  FaLinkedinIn, 
  FaInstagram,
  FaChevronDown
} from 'react-icons/fa6';
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn 
} from 'react-icons/md';

const Footer = () => {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tutors', href: '/tutors' },
    { name: 'My Tutors', href: '/my-tutors' },
    { name: 'My Booked Sessions', href: '/my-booked-sessions' },
  ];

  const learningServices = [
    { name: 'Online Tutoring', href: '/services/online-tutoring' },
    { name: 'Exam Preparation', href: '/services/exam-preparation' },
    { name: 'Homework Help', href: '/services/homework-help' },
    { name: 'Career Guidance', href: '/services/career-guidance' },
    { name: 'Language Learning', href: '/services/language-learning' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'FAQ', href: '/faq' },
  ];

  const socialLinks = [
    { icon: FaXTwitter, href: 'https://twitter.com/mediqueue', label: 'Twitter' },
    { icon: FaFacebookF, href: 'https://facebook.com/mediqueue', label: 'Facebook' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com/company/mediqueue', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://instagram.com/mediqueue', label: 'Instagram' },
  ];

  const LinkSection = ({ title, links, sectionKey }) => (
    <div className="border-b border-gray-700 md:border-none pb-4 md:pb-0">
      {/* Mobile: Clickable header */}
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex items-center justify-between w-full md:hidden py-3"
      >
        <h3 className="text-white font-semibold">{title}</h3>
        <FaChevronDown 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            openSections[sectionKey] ? 'rotate-180' : ''
          }`} 
        />
      </button>
      
      {/* Desktop: Static header */}
      <h3 className="hidden md:block text-white font-semibold mb-4">{title}</h3>
      
      {/* Links - Collapsible on mobile */}
      <ul className={`space-y-3 md:block ${
        openSections[sectionKey] ? 'block' : 'hidden'
      }`}>
        {links.map((link) => (
          <li key={link.name}>
            <Link 
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-200 block py-1 md:py-0"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer className="bg-[#1a1f2e] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Mobile: Stacked layout with collapsible sections */}
        {/* Tablet/Desktop: 2-5 column grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 md:gap-8">
          
          {/* Brand Column - Always visible, full width on mobile */}
          <div className="md:col-span-2 lg:col-span-1 mb-6 md:mb-0 pb-6 md:pb-0 border-b border-gray-700 md:border-none">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg 
                  className="w-5 h-5 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white">MediQueue</span>
            </div>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed max-w-xs">
              Your smart solution for finding tutors and booking sessions with ease
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 md:w-9 md:h-9 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-500 transition-colors duration-200 active:scale-95"
                >
                  <social.icon className="w-5 h-5 md:w-4 md:h-4 text-white" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <LinkSection 
            title="Quick Links" 
            links={quickLinks} 
            sectionKey="quickLinks" 
          />

          {/* Learning Services */}
          <LinkSection 
            title="Learning Services" 
            links={learningServices} 
            sectionKey="learningServices" 
          />

          {/* Support */}
          <LinkSection 
            title="Support" 
            links={supportLinks} 
            sectionKey="support" 
          />

          {/* Contact Us - Special handling for icons */}
          <div className="border-b border-gray-700 md:border-none pb-4 md:pb-0">
            <button
              onClick={() => toggleSection('contact')}
              className="flex items-center justify-between w-full md:hidden py-3"
            >
              <h3 className="text-white font-semibold">Contact Us</h3>
              <FaChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  openSections['contact'] ? 'rotate-180' : ''
                }`} 
              />
            </button>
            
            <h3 className="hidden md:block text-white font-semibold mb-4">Contact Us</h3>
            
            <ul className={`space-y-4 md:block ${
              openSections['contact'] ? 'block' : 'hidden'
            }`}>
              <li className="flex items-start gap-3">
                <MdEmail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="mailto:support@mediqueue.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200 break-all"
                >
                  support@mediqueue.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MdPhone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <a 
                  href="tel:+8801856567890"
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
                >
                  +880 1856-567890
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MdLocationOn className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  Dhaka, Bangladesh
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-6">
          <p className="text-xs md:text-sm text-gray-500 text-center">
            © 2024 MediQueue. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;