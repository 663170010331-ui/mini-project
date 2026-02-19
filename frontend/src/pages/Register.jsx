import { useState } from "react";
import { Lock, User, GraduationCap, AlertCircle, CheckCircle, CreditCard, Phone, Users } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Subject";

function Register() {
  const [role, setRole] = useState("student"); // "student" or "teacher"
  const [formData, setFormData] = useState({
    fullName: "",
    studentId: "",
    tel: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};

    // Validate Full Name
    if (!formData.fullName.trim()) {
      errors.fullName = "กรุณากรอกชื่อ-นามสกุล";
    } else if (formData.fullName.trim().length < 3) {
      errors.fullName = "ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร";
    } else if (formData.fullName.trim().length > 100) {
      errors.fullName = "ชื่อ-นามสกุลต้องไม่เกิน 100 ตัวอักษร";
    } else if (!/^[ก-๙a-zA-Z\s]+$/.test(formData.fullName)) {
      errors.fullName = "ชื่อ-นามสกุลต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น";
    }

    // Validate Student ID (เฉพาะนักเรียน)
    if (role === "student") {
      if (!formData.studentId.trim()) {
        errors.studentId = "กรุณากรอกรหัสนักเรียน";
      } else if (!/^\d+$/.test(formData.studentId)) {
        errors.studentId = "รหัสนักเรียนต้องเป็นตัวเลขเท่านั้น";
      } else if (formData.studentId.length < 8) {
        errors.studentId = "รหัสนักเรียนต้องมีอย่างน้อย 8 หลัก";
      } else if (formData.studentId.length > 15) {
        errors.studentId = "รหัสนักเรียนต้องไม่เกิน 15 หลัก";
      }
    }

    // Validate Phone Number (เฉพาะครู)
    if (role === "teacher") {
      if (!formData.tel.trim()) {
        errors.tel = "กรุณากรอกเบอร์โทรศัพท์";
      } else if (!/^\d+$/.test(formData.tel)) {
        errors.tel = "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น";
      } else if (formData.tel.length !== 10) {
        errors.tel = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
      }
    }

    // Validate Username
    if (!formData.username.trim()) {
      errors.username = "กรุณากรอกชื่อผู้ใช้";
    } else if (formData.username.length < 3) {
      errors.username = "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร";
    } else if (formData.username.length > 50) {
      errors.username = "ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร";
    } 

    // Validate Password
    if (!formData.password.trim()) {
      errors.password = "กรุณากรอกรหัสผ่าน";
    } else if (formData.password.length < 6) {
      errors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    } else if (formData.password.length > 50) {
      errors.password = "รหัสผ่านต้องไม่เกิน 50 ตัวอักษร";
    }

    // Validate Confirm Password
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError("");
    setFieldErrors({ ...fieldErrors, [field]: "" });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setError("");
    setFieldErrors({});
    // รีเซ็ตฟอร์มเมื่อเปลี่ยนโรล
    setFormData({
      fullName: "",
      studentId: "",
      tel: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleRegister = async () => {
    // Clear errors
    setError("");
    setFieldErrors({});

    // Validate
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let res;
      if (role === "student") {
        res = await axios.post(`${API_URL}/create-std`, {
          fullName: formData.fullName,
          studentId: formData.studentId,
          username: formData.username,
          password: formData.password,
        });
      } else {
        res = await axios.post(`${API_URL}/create-professor`, {
          fullname: formData.fullName,
          tel: formData.tel,
          username: formData.username,
          password: formData.password,
        });
      }

      if (res.data.err) {
        setError(res.data.err);
        return;
      }
      if (res.status === 200 && (res.data.ok || res.data.message)) {
        setSuccess(true);
        setFormData({
          fullName: "",
          studentId: "",
          tel: "",
          username: "",
          password: "",
          confirmPassword: "",
        });
        // Redirect หลัง 2 วินาที
        setTimeout(() => {
          location.href = "/";
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setError("เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleRegister();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-12">
      {/* Main Container */}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-10 pb-8 text-center">
            {/* Logo */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-6">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              ลงทะเบียนผู้ใช้ใหม่
            </h1>
            <p className="text-sm text-gray-500">
              สร้างบัญชีเพื่อเข้าใช้งานระบบ
            </p>
          </div>

          {/* Form Section */}
          <div className="px-8 pb-10">
            <div className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  ประเภทผู้ใช้ <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("student")}
                    disabled={isLoading || success}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      role === "student"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <GraduationCap className="w-5 h-5" />
                    <span>นักเรียน</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("teacher")}
                    disabled={isLoading || success}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      role === "teacher"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Users className="w-5 h-5" />
                    <span>อาจารย์</span>
                  </button>
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-emerald-800 font-medium">
                      ลงทะเบียนสำเร็จ! กำลังนำคุณไปหน้าเข้าสู่ระบบ...
                    </p>
                  </div>
                </div>
              )}

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

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อ-นามสกุล <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.fullName ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                    placeholder="นายสมชาย ใจดี"
                    disabled={isLoading || success}
                  />
                </div>
                {fieldErrors.fullName && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.fullName}
                  </p>
                )}
              </div>

              {/* Student ID (แสดงเฉพาะนักเรียน) */}
              {role === "student" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสนักเรียน <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(e) => handleChange("studentId", e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                        fieldErrors.studentId ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                      } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                      placeholder="663170010324"
                      disabled={isLoading || success}
                    />
                  </div>
                  {fieldErrors.studentId && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.studentId}
                    </p>
                  )}
                </div>
              )}

              {/* Phone Number (แสดงเฉพาะครู) */}
              {role === "teacher" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.tel}
                      onChange={(e) => handleChange("tel", e.target.value)}
                      onKeyPress={handleKeyPress}
                      className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                        fieldErrors.tel ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                      } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                      placeholder="0812345678"
                      disabled={isLoading || success}
                      maxLength="10"
                    />
                  </div>
                  {fieldErrors.tel && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {fieldErrors.tel}
                    </p>
                  )}
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ชื่อผู้ใช้ <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.username ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                    placeholder="username123"
                    disabled={isLoading || success}
                  />
                </div>
                {fieldErrors.username && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.password ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                    placeholder="อย่างน้อย 6 ตัวอักษร"
                    disabled={isLoading || success}
                  />
                </div>
                {fieldErrors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    onKeyPress={handleKeyPress}
                    className={`block w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                      fieldErrors.confirmPassword ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-200 focus:ring-emerald-100 focus:border-emerald-500"
                    } rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition`}
                    placeholder="กรอกรหัสผ่านอีกครั้ง"
                    disabled={isLoading || success}
                  />
                </div>
                {fieldErrors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <button
                onClick={handleRegister}
                disabled={isLoading || success}
                className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-medium py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>กำลังลงทะเบียน...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>ลงทะเบียนสำเร็จ</span>
                  </>
                ) : (
                  <>
                    {role === "student" ? <GraduationCap className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    <span>ลงทะเบียน{role === "student" ? "นักเรียน" : "อาจารย์"}</span>
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  มีบัญชีอยู่แล้ว?{" "}
                  <Link
                    to="/"
                    className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline"
                  >
                    เข้าสู่ระบบ
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

export default Register;