import { GraduationCap, LogOut, User, BookOpen, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [token, setToken] = useState();

  const getToken = () => {
    const token = JSON.parse(localStorage.getItem("loginToken"));
    if (!token) {
      location.href = "/";
      return;
    }
    setToken(token?.data);
  };

  useEffect(() => {
    getToken();
  }, []);

  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      localStorage.removeItem("loginToken");
      location.href = "/";
    }
  };

  return (
    <nav className="bg-white fixed top-0 z-50 w-full shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo & Brand */}
          <Link to={token?.role === "3" ? "/dashboard" : "/crud/subject"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                ระบบเช็คชื่อเข้าเรียน
              </h1>
              <p className="text-xs text-gray-500">
                Attendance Management System
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {/* Admin Menu */}
            {token?.role === "3" && (
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
              >
                <Users className="w-5 h-5" />
                <span>หน้าหลัก</span>
              </Link>
            )}

            {/* Student Menu */}
            {token?.role === "1" && (
              <Link
                to="/my-profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
              >
                <User className="w-5 h-5" />
                <span>ข้อมูลส่วนตัว</span>
              </Link>
            )}

            {/* Teacher Menu - Profile */}
            {token?.role === "2" && (
              <Link
                to="/teacher-profile"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all font-medium"
              >
                <User className="w-5 h-5" />
                <span>ข้อมูลส่วนตัว</span>
              </Link>
            )}

            {/* Common Menu - Subject */}
            <Link
              to="/crud/subject"
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
            >
              <BookOpen className="w-5 h-5" />
              <span>{token?.role === "1" ? "เช็คชื่อ" : "จัดการรายวิชา"}</span>
            </Link>

            {/* Teacher & Admin Menu */}
            {(token?.role === "3" || token?.role === "2") && (
              <Link
                to="/users"
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
              >
                <Users className="w-5 h-5" />
                <span>จัดการนักศึกษา</span>
              </Link>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white px-6 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;