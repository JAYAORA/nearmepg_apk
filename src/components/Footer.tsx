"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin-portal")) return null;

  return (
    <footer className="bg-white py-8 px-6 border-t border-gray-200 shadow-inner shadow-black/10 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10">
          {/* Branding */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 text-xs md:text-base md:w-8 md:h-8 rounded-full bg-linear-to-br from-indigo-700 to-indigo-900 flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              
              <div className="inline-flex gap-0.5 font-display font-bold text-xl tracking-tight text-slate-800">
                <span>

                Near<span className="text-amber-600">Me</span>PG
                </span>
                <span className="text-[9px]">TM</span>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              India&apos;s most trusted PG booking platform for students and
              professionals.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:col-span-4 gap-8">
            {/* Company */}
            <div>
              <h4 className="font-bold text-gray-900 mb-5">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:text-orange-500 transition-colors cursor-pointer">
                  <Link href="/about">About Us</Link>
                </li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">
                  <Link href="/blog">Blog</Link>
                </li>
                {/* <li className="hover:text-orange-500 transition-colors cursor-pointer">
                  <Link href="/posts">Community</Link>
                </li> */}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-gray-900 mb-5">
                <Link
                  href="/contact"
                  className="hover:text-orange-500 transition-colors"
                >
                  Support
                </Link>
              </h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:text-orange-500 transition-colors cursor-pointer">
                  <Link href="/contact">Contact Us</Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="col-span-2 md:col-span-1">
              <h4 className="font-bold text-gray-900 mb-5">Legal</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li className="hover:text-orange-500 transition-colors cursor-pointer">
                  <Link href="/terms-conditions">Terms &amp; Conditions</Link>
                </li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </li>
                <li className="hover:text-orange-500 transition-colors cursor-pointer">
                  <Link href="/refund-policy">Refund Policy</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            &copy; 2026 NearMePG. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <span>A product of</span>
            <a
              href="https://www.jayaora.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gray-600 hover:text-orange-500 transition-colors"
            >
              JAYAORA Solutions &amp; Management
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
