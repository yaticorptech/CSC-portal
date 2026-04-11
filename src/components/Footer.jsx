import React from "react";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

const socials = [
  { Icon: Facebook,  href: "https://www.facebook.com/people/YATICORP/61563083972053/?sk=about", label: "Facebook" },
  { Icon: Instagram, href: "https://www.instagram.com/yaticorp/", label: "Instagram" },
  { Icon: Youtube,   href: "https://youtube.com/@yaticorp-sg5bw", label: "YouTube" },
  { Icon: Linkedin,  href: "https://in.linkedin.com/company/yaticorp-india-pvt-ltd", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Brand */}
        <div className="flex items-start gap-3">
          <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-white text-xs font-bold">CC</span>
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">CSC Center Portal</p>
            <p className="text-blue-300 text-xs">Powered by Yaticorp</p>
            <p className="text-blue-200 text-xs mt-1 leading-relaxed max-w-xs">
              Empowering CSC centers to deliver AI education across India.
            </p>
            <div className="flex gap-2 mt-2">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}
                  className="w-6 h-6 rounded-md bg-white/10 hover:bg-white/25 flex items-center justify-center transition">
                  <Icon size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs font-semibold text-white border-b border-white/20 pb-1 mb-2">Contact Us</p>
          <ul className="space-y-1.5 text-xs text-blue-200">
            <li className="flex items-start gap-1.5">
              <MapPin size={11} className="mt-0.5 shrink-0 text-blue-400" />
              <span>Kottara Chowki, Mangalore, Karnataka – 575006</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Phone size={11} className="shrink-0 text-blue-400" />
              <a href="tel:+919606977984" className="hover:text-white transition">+91 9606977984</a>
            </li>
            <li className="flex items-center gap-1.5">
              <Mail size={11} className="shrink-0 text-blue-400" />
              <a href="mailto:contact@yaticorp.com" className="hover:text-white transition">contact@yaticorp.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 bg-black/20 text-center py-2 text-xs text-blue-300">
        © {new Date().getFullYear()} <span className="font-semibold text-white">Yaticorp India Pvt Ltd</span>. All rights reserved.
      </div>
    </footer>
  );
}
