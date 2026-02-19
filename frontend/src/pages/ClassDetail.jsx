import axios from "axios";
import { useEffect, useState } from "react";
import { API_URL } from "./Subject";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, BookOpen, User as UserIcon, Calendar, Clock, TrendingUp } from "lucide-react";
import Header from "../components/header";
import Footer from "../components/footer";

const StudentAttendanceDetail = () => {
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const [studentData, setStudentData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [dates, setDates] = useState([]);
  const [stats, setStats] = useState();

  const getData = async () => {
    try {
      const res = await axios.get(
        API_URL + `/get-class-detail/${params.classId}/${params.stdId}`,
      );
      const data = res.data;
      
      setDates(data?.data);
      setStats(data?.statistics[0]);
      setCourseData({
        course_id: data?.data[0]?.course_id,
        course_name: data?.data[0]?.course_name,
        teacher_name: data?.data[0]?.teacher_name,
      });
      setStudentData({
        student_id: data?.data[0]?.std_class_id,
        fullname: data?.data[0]?.fullname,
        major: data?.data[0]?.major,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getStatusStyle = (status) => {
    const styles = {
      มาเรียน: "bg-emerald-50 text-emerald-700 border-emerald-200",
      ขาดเรียน: "bg-red-50 text-red-700 border-red-200",
      ลา: "bg-amber-50 text-amber-700 border-amber-200",
      มาสาย: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "มาเรียน":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "ขาดเรียน":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "ลา":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "มาสาย":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const percentage = stats?.total > 0 ? ((stats?.present / stats?.total) * 100).toFixed(1) : 0;

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
      <div className="max-w-6xl mx-auto mt-20">
        {/* Back Button */}
        <Link
          to={"/crud/subject"}
          className="flex items-center gap-2 w-fit px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-all mb-6 border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600" />
          <p className="font-medium text-gray-700">กลับ</p>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              📊 รายละเอียดการเข้าเรียน
            </h1>
          </div>
        </div>

        {/* Course and Teacher Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            ข้อมูลรายวิชา
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">ชื่อวิชา</p>
              <p className="text-lg font-semibold text-gray-900">
                {courseData?.course_name}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">รหัสวิชา</p>
              <p className="text-lg font-semibold text-gray-900">
                {courseData?.course_id}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">ผู้สอน</p>
              <p className="text-lg font-semibold text-gray-900">
                {courseData?.teacher_name}
              </p>
            </div>
          </div>
        </div>

        {/* Student Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <UserIcon className="w-6 h-6 text-blue-600" />
            ข้อมูลนักศึกษา
          </h2>
          <div className="flex items-start gap-6">
            <div className="flex-shrink-0 h-24 w-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-4xl">
                {studentData?.fullname?.charAt(0)}
              </span>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">ชื่อ - นามสกุล</p>
                <p className="text-lg font-semibold text-gray-900">
                  {studentData?.fullname}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">รหัสนักศึกษา</p>
                <p className="text-lg font-semibold text-gray-900">
                  {studentData?.student_id}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">คณะ</p>
                <p className="text-base text-gray-700">{studentData?.major}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-blue-500">
            <p className="text-sm text-gray-600 mb-1">ทั้งหมด</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.total || 0}</p>
            <p className="text-xs text-gray-500">ครั้ง</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-emerald-500">
            <p className="text-sm text-gray-600 mb-1">มาเรียน</p>
            <p className="text-3xl font-bold text-emerald-600">{stats?.present || 0}</p>
            <p className="text-xs text-gray-500">ครั้ง</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <p className="text-sm text-gray-600 mb-1">มาสาย</p>
            <p className="text-3xl font-bold text-orange-600">{stats?.late || 0}</p>
            <p className="text-xs text-gray-500">ครั้ง</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-red-500">
            <p className="text-sm text-gray-600 mb-1">ขาดเรียน</p>
            <p className="text-3xl font-bold text-red-600">{stats?.absent || 0}</p>
            <p className="text-xs text-gray-500">ครั้ง</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-amber-500">
            <p className="text-sm text-gray-600 mb-1">ลา</p>
            <p className="text-3xl font-bold text-amber-600">{stats?.leave || 0}</p>
            <p className="text-xs text-gray-500">ครั้ง</p>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              เปอร์เซ็นต์การเข้าเรียน
            </h3>
            <span className="text-3xl font-bold text-blue-600">
              {percentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-3"
              style={{ width: `${percentage}%` }}
            >
              {percentage > 10 && (
                <span className="text-white text-xs font-semibold">
                  {percentage}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              บันทึกการเข้าเรียน
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ครั้งที่
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    วันที่
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    เวลา
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    สถานะ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {dates.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="text-lg font-medium text-gray-500">
                          ไม่มีบันทึกการเข้าเรียน
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dates.map((record, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {new Date(record.checkin_time).toLocaleDateString(
                              "th-TH",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {record.checkin_time ? (
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {new Date(record.checkin_time).toLocaleTimeString(
                                "th-TH",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}{" "}
                              น.
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <span
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-semibold text-sm ${getStatusStyle(
                              record.status,
                            )}`}
                          >
                            {getStatusIcon(record.status)}
                            {record.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StudentAttendanceDetail;