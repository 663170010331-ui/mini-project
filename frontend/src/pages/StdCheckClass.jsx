import React, { useEffect, useState } from "react";
import {
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  ArrowLeft,
  Loader2,
  AlertCircle,
  BookOpen,
  User as UserIcon,
  Hash,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import { Link, useParams } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export default function StdCheckClass() {
  const [load, setLoad] = useState(true);
  const [course, setCourses] = useState(null);
  const params = useParams();
  const [stdData, setStdData] = useState();
  const [status, setStatus] = useState("");
  const [leaveDocument, setLeaveDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_URL}/get-subject/${params.classId}`);
      const data = await response.json();
      setCourses(data.data);
    } catch (error) {
      setError("ไม่สามารถโหลดข้อมูลวิชาได้");
    }
  };

  const getData = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("loginToken")).data;
      if (!data) {
        location.href = "/";
        return;
      }
      const res = await axios.get(API_URL + `/students/${data?.student_id}`);
      setStdData({
        stundent_id: res.data?.data?.student_id,
        fullname: res.data?.data?.fullname,
        major: res.data?.data?.major,
        std_class_id: res?.data?.data?.std_class_id,
      });
    } catch (error) {
      console.error(error);
      setError("ไม่สามารถโหลดข้อมูลนักศึกษาได้");
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getData();
    fetchCourses();
  }, []);

  const statusOptions = [
    {
      value: "มาเรียน",
      label: "เข้าเรียนปกติ",
      icon: CheckCircle,
      color: "from-green-500 to-emerald-600",
      hoverColor: "hover:from-green-600 hover:to-emerald-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-700",
    },
    {
      value: "ลา",
      label: "ลา",
      icon: FileText,
      color: "from-blue-500 to-indigo-600",
      hoverColor: "hover:from-blue-600 hover:to-indigo-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-700",
    },
    {
      value: "ขาด",
      label: "ขาด",
      icon: XCircle,
      color: "from-red-500 to-rose-600",
      hoverColor: "hover:from-red-600 hover:to-rose-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-700",
    },
    {
      value: "สาย",
      label: "มาสาย",
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      hoverColor: "hover:from-amber-600 hover:to-orange-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-700",
    },
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setLeaveDocument(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setError("");
    } else {
      setError("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
    }
  };

  const checkClass = async (selectedStatus, stdId) => {
    if (!selectedStatus) {
      setError("กรุณาเลือกสถานะการเข้าเรียน");
      return;
    }

    if (selectedStatus === "ลา" && !leaveDocument) {
      setError("กรุณาแนบใบลา");
      return;
    }

    setLoad(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("status", selectedStatus);
      formData.append("classId", params.classId);
      formData.append("stdId", stdId);
      if (selectedStatus === "ลา") {
        formData.append("leavDoc", leaveDocument);
      }

      const res = await axios.post(API_URL + `/check-class`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          location.href = `/class-detail/${params.classId}/${params.stdId}`;
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoad(false);
    }
  };

  if (load && !stdData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <Header />
      <div className="max-w-2xl mx-auto mt-20">
        {/* Back Button */}
        <Link
          to={"/crud/subject"}
          className="flex items-center gap-2 w-fit px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-all mb-6 border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
          <p className="font-medium text-gray-700">กลับ</p>
        </Link>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center">
              ระบบเช็คชื่อเข้าเรียน
            </h1>
            <p className="text-blue-100 text-center mt-2">
              กรุณาบันทึกสถานะการเข้าเรียนของคุณ
            </p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-emerald-800 font-medium">
                    เช็คชื่อสำเร็จ! กำลังนำคุณไปหน้ารายละเอียด...
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Course Info */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">วิชา</p>
                      <p className="font-semibold text-gray-800">
                        {course?.course_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">อาจารย์ผู้สอน</p>
                      <p className="font-semibold text-gray-800">
                        {course?.teacher_name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Student Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    value={stdData?.fullname}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รหัสนักเรียน
                  </label>
                  <input
                    type="text"
                    value={stdData?.std_class_id}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  สถานะการเข้าเรียน
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = status === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setStatus(option.value);
                          setError("");
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg scale-105`
                            : `${option.bgColor} ${option.borderColor} ${option.textColor} hover:scale-105`
                        }`}
                      >
                        <Icon className="mx-auto mb-2" size={28} />
                        <span className="font-semibold text-sm">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Leave Document Upload */}
              {status === "ลา" && (
                <div className="bg-blue-50 p-6 rounded-xl border-2 border-blue-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    แนบใบลา (รูปภาพเท่านั้น)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-blue-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition">
                      {previewUrl ? (
                        <div className="relative w-full h-full p-2">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-12 h-12 mb-3 text-blue-500" />
                          <p className="mb-2 text-sm text-gray-600">
                            <span className="font-semibold">
                              คลิกเพื่ออัพโหลด
                            </span>{" "}
                            หรือลากไฟล์มาวาง
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG (สูงสุด 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {leaveDocument && (
                    <p className="mt-2 text-sm text-gray-600">
                      ไฟล์: {leaveDocument.name}
                    </p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={() => checkClass(status, params.stdId)}
                disabled={load || success}
                className="w-full py-4 rounded-xl font-bold text-white text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                {load ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    กำลังบันทึก...
                  </span>
                ) : success ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle className="w-6 h-6" />
                    บันทึกเรียบร้อย
                  </span>
                ) : (
                  "บันทึกการเช็คชื่อ"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>กรุณาเช็คชื่อทุกครั้งก่อนเข้าเรียน</p>
          <p className="mt-1">หากมีปัญหาการใช้งาน กรุณาติดต่ออาจารย์ผู้สอน</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}