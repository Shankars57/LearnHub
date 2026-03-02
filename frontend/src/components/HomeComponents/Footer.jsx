import React from "react";
import { BookOpen, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: "https://github.com/Shankars57", label: "GitHub" },
    { icon: Twitter, href: "https://x.com", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:bonamgshankar@gmail.com", label: "Email" },
  ];

  const quickLinks = [
    { label: "About Us", href: "/about" },
    { label: "Playlists", href: "/playlist" },
    { label: "Materials", href: "/materials" },
  ];

  const supportLinks = [
    { label: "Contact", href: "/contact" },
    { label: "Cheatsheets", href: "/cheatsheets" },
    { label: "Roadmaps", href: "/roadmaps" },
    { label: "Resume Templates", href: "/resumes" },
  ];

  return (
    <footer className="theme-surface border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                LearnHub
              </span>
            </div>

            <p className="theme-muted mb-6 max-w-md leading-relaxed">
              Empowering learners worldwide with collaborative education, AI
              assistance, and comprehensive study resources. Join our community
              and accelerate your learning journey.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 theme-btn-secondary rounded-lg flex items-center justify-center theme-muted hover:theme-text transition-all duration-300 hover:scale-110"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold theme-text mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="theme-muted hover:text-blue-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold theme-text mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="theme-muted hover:text-purple-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="theme-text">
            Please contact me if any issues occur.{" "}
            <a href="tel:9110560147" className="text-blue-600 hover:underline">
              +91 9110560147
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-color)]">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="theme-muted text-sm mb-4 md:mb-0">
              Copyright {currentYear} LearnHub. All rights reserved.
            </div>
            <div className="flex items-center theme-muted text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 animate-pulse" />
              <span>for learners everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
