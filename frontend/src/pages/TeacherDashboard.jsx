import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  ClipboardList, 
  TrendingUp,
  Loader2,
  AlertCircle 
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import Header from "../components/header";
import Footer from "../components/footer";

export default function TeacherDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    todayAttendance: 0
  });

  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      
      // ดึงข้อมูลอาจารย์จาก localStorage
      const token = JSON.parse(localStorage.getItem("loginToken"));
      if (!token || token.data.role !== "2") {
        location.href = "/";
        return;
      }

      setTeacherInfo(token.data);

      // ดึงข้อมูลรายวิชาทั้งหมด (ในอนาคตควรกรองเฉพาะวิชาที่สอน)
      const coursesRes = await axios.get(`${API_URL}/get-all-subjects`);
      setCourses(coursesRes.data.data || []);

      // คำนวณสถิติ
      setStats({
        totalCourses: coursesRes.data.total || 0,
        totalStudents: 0, // ในอนาคตควรดึงจำนวนนักศึกษาจริง
        todayAttendance: 0 // ในอนาคตควรดึงการเช็คชื่อวันนี้
      });

    } catch (error) {
      console.error(error);
      setError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <Header />
      
      <div className="max-w-7xl mx-auto mt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            สวัสดี, อาจารย์{teacherInfo?.fullname || teacherInfo?.username} 👋
          </h1>
          <p className="text-gray-600">
            ยินดีต้อนรับสู่ระบบจัดการการเข้าเรียน
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Courses */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-emerald-100">
            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-emerald-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">รายวิชาที่สอน</p>
            <p className="text-4xl font-bold text-gray-800">{stats.totalCourses}</p>
          </div>

          {/* Total Students */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">นักศึกษาทั้งหมด</p>
            <p className="text-4xl font-bold text-gray-800">{stats.totalStudents}</p>
          </div>

          {/* Today Attendance */}
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-indigo-100">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-indigo-500" />
            </div>
            <p className="text-gray-600 text-sm mb-1">เช็คชื่อวันนี้</p>
            <p className="text-4xl font-bold text-gray-800">{stats.todayAttendance}</p>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              รายวิชาที่สอน
            </h2>
          </div>

          <div className="p-6">
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">ยังไม่มีรายวิชา</p>
                <Link
                  to="/crud/subject"
                  className="mt-4 inline-block px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all"
                >
                  จัดการรายวิชา
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map((course) => (
                  <Link
                    key={course.course_id}
                    to={`/check-class/${course.course_id}`}
                    className="group bg-gradient-to-br from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 rounded-xl p-5 border-2 border-emerald-200 hover:border-emerald-400 transition-all shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <TrendingUp className="w-5 h-5 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <h3 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">
                      {course.course_name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      รหัสวิชา: {course.course_id}
                    </p>
                    <p className="text-xs text-gray-500">
                      ผู้สอน: {course.teacher_name}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/crud/subject"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-emerald-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-emerald-700 transition-colors">
                  จัดการรายวิชา
                </h3>
                <p className="text-sm text-gray-600">
                  เพิ่ม แก้ไข หรือลบรายวิชา
                </p>
              </div>
            </div>
          </Link>

          <Link
            to="/users"
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-blue-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">
                  จัดการนักศึกษา
                </h3>
                <p className="text-sm text-gray-600">
                  ดูรายชื่อและจัดการนักศึกษา
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}