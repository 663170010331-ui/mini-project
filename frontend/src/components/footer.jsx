import React from "react";
import { Heart } from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left - Brand */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">📘 ระบบเช็คชื่อเข้าเรียน</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              v1.0
            </span>
          </div>

          {/* Center - Status */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>สถานะระบบ:</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Online
            </span>
          </div>

          {/* Right - Copyright */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>© {year} Attendance System.</span>
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-gray-200"></div>

        {/* Bottom - Additional Info */}
        <div className="text-center text-xs text-gray-400">
          <p>ระบบจัดการการเข้าเรียนออนไลน์ | สำหรับสถาบันการศึกษา</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;