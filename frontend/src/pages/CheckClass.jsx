import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_URL } from "./Subject";
import CheckClassRow from "../components/check-class-row";
import axios from "axios";
import { ArrowLeft, Loader2, AlertCircle, BookOpen, User as UserIcon, Hash } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

const CheckClass = () => {
  const { classId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourses] = useState(null);
  const [student, setStudents] = useState([]);
  const [error, setError] = useState("");

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/get-subject/${classId}`);
      const data = await response.json();
      setCourses(data.data);
    } catch (error) {
      setError("ไม่สามารถโหลดข้อมูลวิชาได้");
    } finally {
      setLoading(false);
    }
  };

  const getAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      const uniqueStudents = Array.from(
        new Map(res.data.data.map((std) => [std.fullname, std])).values(),
      );
      setStudents(uniqueStudents);
    } catch (error) {
      console.error(error);
      setError("ไม่สามารถโหลดข้อมูลนักศึกษาได้");
    }
  };

  useEffect(() => {
    fetchCourses();
    getAll();
  }, []);

  if (loading) {
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
      <div className="max-w-5xl mx-auto mt-20">
        {/* Back Button */}
        <Link
          to={"/crud/subject"}
          className="flex items-center gap-2 w-fit px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-all mb-6 border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
          <p className="font-medium text-gray-700">กลับ</p>
        </Link>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              📋 เช็คชื่อเข้าเรียน
            </h1>
            <p className="text-blue-100">
              {new Date().toLocaleDateString("th-TH", {
                day: "numeric",
                month: "long",
                year: "numeric",
                weekday: "long",
              })}
            </p>
          </div>

          {/* Course Info */}
          <div className="p-6 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <BookOpen className="w-4 h-4" />
                  <p className="text-sm font-medium">ชื่อวิชา</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {course?.course_name || "-"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Hash className="w-4 h-4" />
                  <p className="text-sm font-medium">รหัสวิชา</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {course?.course_id || "-"}
                </p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <UserIcon className="w-4 h-4" />
                  <p className="text-sm font-medium">ผู้สอน</p>
                </div>
                <p className="text-lg font-semibold text-gray-800">
                  {course?.teacher_name || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Student List Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                👥 รายชื่อผู้เข้าเรียน
              </h2>
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                {student.length} คน
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ชื่อ - นามสกุล
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    เช็คชื่อ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {student.length === 0 ? (
                  <tr>
                    <td colSpan="2" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium text-gray-500">
                          ไม่มีรายชื่อนักเรียน
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  student.map((s, index) => (
                    <CheckClassRow
                      key={s.student_id || index}
                      data={s}
                      index={index + 1}
                      classId={classId}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 กรุณาตรวจสอบรายชื่อให้ถูกต้องก่อนบันทึก
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckClass;