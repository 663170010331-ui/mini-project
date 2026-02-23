import { useState, useEffect } from "react";
import { Lock, User, LogIn, GraduationCap, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    // ตรวจสอบว่ามี token อยู่แล้วหรือไม่
    const token = localStorage.getItem("loginToken");
    if (token) {
      try {
        const data = JSON.parse(token).data;
        if (data?.role === "3") {
          location.href = "/dashboard";
        } else if (data?.role === "2") {
          location.href = "/crud/subject";
        } else if (data?.role === "1") {
          location.href = "/my-profile";
        }
      } catch (e) {
        localStorage.removeItem("loginToken");
      }
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    
    // Validate Username
    if (!username.trim()) {
      errors.username = "กรุณากรอกชื่อผู้ใช้";
    } else if (username.length < 3) {
      errors.username = "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร";
    } else if (username.length > 50) {
      errors.username = "ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร";
    } 

    // Validate Password
    if (!password.trim()) {
      errors.password = "กรุณากรอกรหัสผ่าน";
    } else if (password.length < 4) {
      errors.password = "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    // Clear previous errors
    setError("");
    setFieldErrors({});

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // ตรวจสอบว่าเป็น Admin
      if (username === "admin" && password === "1234") {
        const token = {
          data: { role: "3", signInDate: new Date(), username: "admin" },
        };
        localStorage.setItem("loginToken", JSON.stringify(token));
        location.href = "/dashboard";
        return;
      }

      // ลองเข้าสู่ระบบในฐานะนักเรียน
      const studentRes = await fetch(`http://localhost:5000/login?type=1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (studentRes.ok) {
        const studentData = await studentRes.json();
        if (!studentData.err) {
          localStorage.setItem("loginToken", JSON.stringify(studentData));
          location.href = "/my-profile";
          return;
        }
      }

      // ลองเข้าสู่ระบบในฐานะอาจารย์
      const professorRes = await fetch(`http://localhost:5000/login?type=2`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (professorRes.ok) {
        const professorData = await professorRes.json();
        if (!professorData.err) {
          localStorage.setItem("loginToken", JSON.stringify(professorData));
          location.href = "/teacher-dashboard"; // เปลี่ยนจาก /crud/subject
          return;
        }
      }

      // ถ้าไม่มีบัญชีที่ตรงกัน
      setError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    } catch (error) {
      console.error(error);
      
      // ตรวจสอบว่าเป็น Network Error หรือไม่
      if (error.message === 'Failed to fetch' || !navigator.onLine) {
        setError("ไม่สามารถเชื่อมต่ออินเทอร์เน็ตได้ กรุณาตรวจสอบการเชื่อมต่อของคุณ");
      } else {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-10 pb-8 text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              เข้าสู่ระบบ
            </h1>
            <p className="text-sm text-gray-500">
              ระบบเช็คชื่อเข้าเรียน
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10">
            <div className="space-y-5">
              {/* General Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-800 font-medium">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Username Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้ใช้
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                      setFieldErrors({ ...fieldErrors, username: "" });
                    }}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.username ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                    placeholder="กรอกชื่อผู้ใช้"
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสผ่าน
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                      setFieldErrors({ ...fieldErrors, password: "" });
                    }}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.password ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-blue-100 focus:border-blue-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                    placeholder="กรอกรหัสผ่าน"
                    disabled={isLoading}
                  />
                </div>
                {fieldErrors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>เข้าสู่ระบบ</span>
                  </>
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  ยังไม่มีบัญชี?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    ลงทะเบียน
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          © {new Date().getFullYear()} ระบบเช็คชื่อเข้าเรียน
        </p>
      </div>
    </div>
  );
}