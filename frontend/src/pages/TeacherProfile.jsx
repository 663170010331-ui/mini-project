import { useEffect, useState } from "react";
import {
  User,
  Save,
  Edit2,
  Home,
  Phone,
  CreditCard,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
  X,
  Mail,
  Briefcase,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export default function TeacherProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({});
  const [load, setLoad] = useState(true);
  
  // Profile Image States
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const getData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("loginToken")).data;
      if (!data) {
        location.href = "/";
        return;
      }
      const res = await axios.get(API_URL + `/get-professor/${data?.id}`);
      setFormData({
        id: res.data?.data?.id,
        fullname: res.data?.data?.fullname,
        tel: res.data?.data?.tel,
        username: res.data?.data?.username,
      });
      
      // Load saved profile image from localStorage
      const savedImage = localStorage.getItem(`profile_teacher_${data?.id}`);
      if (savedImage) {
        setPreviewUrl(savedImage);
      }
    } catch (error) {
      console.error(error);
      setError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("ขนาดไฟล์ต้องไม่เกิน 5MB");
        return;
      }

      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        // Save to localStorage
        const data = JSON.parse(localStorage.getItem("loginToken")).data;
        localStorage.setItem(`profile_teacher_${data?.id}`, reader.result);
        setSuccess("อัพโหลดรูปภาพสำเร็จ!");
        setTimeout(() => setSuccess(""), 3000);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewUrl("");
    const data = JSON.parse(localStorage.getItem("loginToken")).data;
    localStorage.removeItem(`profile_teacher_${data?.id}`);
    setSuccess("ลบรูปภาพสำเร็จ!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const validateForm = () => {
    const errors = {};

    // Validate Fullname
    if (!formData.fullname || !formData.fullname.trim()) {
      errors.fullname = "กรุณากรอกชื่อ-นามสกุล";
    } else if (formData.fullname.trim().length < 3) {
      errors.fullname = "ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร";
    } else if (formData.fullname.trim().length > 100) {
      errors.fullname = "ชื่อ-นามสกุลต้องไม่เกิน 100 ตัวอักษร";
    } else if (!/^[ก-๙a-zA-Z\s]+$/.test(formData.fullname)) {
      errors.fullname = "ชื่อ-นามสกุลต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น";
    }

    // Validate Phone
    if (!formData.tel || !formData.tel.trim()) {
      errors.tel = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d+$/.test(formData.tel)) {
      errors.tel = "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น";
    } else if (formData.tel.length !== 10) {
      errors.tel = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccess("");
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear errors
    setError("");
    setSuccess("");
    setFieldErrors({});

    // Validate
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await axios.put(
        `${API_URL}/update-professor/${formData.id}`,
        {
          fullname: formData.fullname,
          tel: formData.tel,
          username: formData.username,
          password: formData.password || "unchanged", // ถ้าไม่เปลี่ยนรหัสผ่าน
        }
      );
      
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setSuccess("บันทึกข้อมูลสำเร็จ!");
        setIsEditing(false);
        getData();
        
        // ซ่อนข้อความสำเร็จหลัง 3 วินาที
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (load) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <Header />
      <div className="max-w-3xl mx-auto">
        {/* Header with Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/crud/subject"
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all shadow-md border border-gray-200"
          >
            <Home className="w-5 h-5 text-emerald-600" />
            <span className="font-medium">กลับหน้าหลัก</span>
          </Link>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <Edit2 className="w-5 h-5" />
              <span className="font-medium">แก้ไขข้อมูล</span>
            </button>
          )}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-600 h-32">
            {/* Profile Avatar */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative group">
                <div 
                  className="w-32 h-32 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center border-4 border-white shadow-xl cursor-pointer transition-transform hover:scale-105"
                  onClick={() => previewUrl && setShowImageModal(true)}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-5xl font-bold">
                      {formData?.fullname?.charAt(0) || "?"}
                    </span>
                  )}
                </div>
                
                {/* Camera Button */}
                <label 
                  htmlFor="profile-upload" 
                  className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 hover:bg-emerald-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all group-hover:scale-110"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="pt-20 px-8 pb-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                ข้อมูลโปรไฟล์อาจารย์
              </h1>
              <p className="text-gray-500 text-sm">
                จัดการข้อมูลส่วนตัวของคุณ
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-800 font-medium">
                  {success}
                </p>
              </div>
            )}

            {/* General Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">
                  {error}
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Teacher ID */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <CreditCard className="w-5 h-5 text-emerald-600" />
                  รหัสอาจารย์
                </label>
                <div className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-gray-800 font-medium">
                    T{String(formData.id).padStart(5, '0')}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * ไม่สามารถแก้ไขรหัสอาจารย์ได้
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  ชื่อผู้ใช้
                </label>
                <div className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <p className="text-gray-800 font-medium">
                    {formData.username}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * ไม่สามารถแก้ไขชื่อผู้ใช้ได้
                </p>
              </div>

              {/* Full Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <User className="w-5 h-5 text-emerald-600" />
                  ชื่อ-นามสกุล {isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname || ""}
                      onChange={handleChange}
                      className={`w-full px-4 py-3.5 bg-white border-2 ${
                        fieldErrors.fullname ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"
                      } rounded-xl focus:ring-4 transition-all outline-none text-gray-800 font-medium`}
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                    {fieldErrors.fullname && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.fullname}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-gray-800 font-medium">
                      {formData.fullname}
                    </p>
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Phone className="w-5 h-5 text-emerald-600" />
                  เบอร์โทรศัพท์ {isEditing && <span className="text-red-500">*</span>}
                </label>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      name="tel"
                      value={formData.tel || ""}
                      onChange={handleChange}
                      maxLength="10"
                      className={`w-full px-4 py-3.5 bg-white border-2 ${
                        fieldErrors.tel ? "border-red-300 focus:ring-red-100 focus:border-red-500" : "border-gray-300 focus:ring-emerald-100 focus:border-emerald-500"
                      } rounded-xl focus:ring-4 transition-all outline-none text-gray-800 font-medium`}
                      placeholder="กรอกเบอร์โทรศัพท์ 10 หลัก"
                    />
                    {fieldErrors.tel && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.tel}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl">
                    <p className="text-gray-800 font-medium">
                      {formData.tel}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setError("");
                      setSuccess("");
                      setFieldErrors({});
                      getData();
                    }}
                    className="flex-1 px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium border border-gray-300"
                    disabled={loading}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        บันทึกข้อมูล
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                ข้อมูลสำหรับอาจารย์
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                คุณสามารถแก้ไขข้อมูลส่วนตัวของคุณได้ที่นี่ เช่น ชื่อ-นามสกุล และเบอร์โทรศัพท์ 
                หากต้องการเปลี่ยนรหัสผ่าน กรุณาติดต่อผู้ดูแลระบบ
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            คลิกที่ไอคอนกล้องเพื่อเปลี่ยนรูปโปรไฟล์ (รองรับไฟล์ภาพ สูงสุด 5MB)
          </p>
        </div>
      </div>

      {/* Image Preview Modal */}
      {showImageModal && previewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={previewUrl} 
              alt="Profile Preview" 
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <button
              onClick={handleRemoveImage}
              className="mt-4 w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all shadow-lg font-medium"
            >
              ลบรูปภาพ
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}