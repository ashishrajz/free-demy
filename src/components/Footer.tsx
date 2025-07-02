"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Image
            src="/freedemylogowhite.png" // Make sure your logo exists at /public/logo.png
            alt="Logo"
            width={160}
            height={160}
            className="rounded"
          />
        </div>

        {/* Social Links */}
        <div className="flex space-x-6 text-xl">
          <Link href="https://github.com/your-repo" target="_blank" aria-label="GitHub">
            <FaGithub className="hover:text-blue-400 transition-colors" />
          </Link>
          <Link href="https://twitter.com/yourhandle" target="_blank" aria-label="Twitter">
            <FaTwitter className="hover:text-blue-400 transition-colors" />
          </Link>
          <Link href="https://linkedin.com/in/yourprofile" target="_blank" aria-label="LinkedIn">
            <FaLinkedin className="hover:text-blue-400 transition-colors" />
          </Link>
        </div>

        {/* Credit and Copyright */}
        <div className="text-center text-sm text-gray-400">
          Created by <span className="text-white font-medium">Ashish</span> <br />
          &copy; {new Date().getFullYear()} All rights reserved.
        </div>
      </div>
    </footer>
  );
}
