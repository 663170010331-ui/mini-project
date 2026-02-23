import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  BookOpen,
  Loader2,
  CheckCircle,
  FileText,
  Home,
  AlertCircle,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";

export const API_URL = import.meta.env.VITE_API;

export default function CourseCRUD() {
  const token = JSON.parse(localStorage.getItem("loginToken"))?.data;

  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    course_id: "",
    course_name: "",
    teacher_name: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/get-all-subjects`);
      const data = await response.json();
      setCourses(data.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.course_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.teacher_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async () => {
    if (!formData.course_id || !formData.course_name || !formData.teacher_name) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    try {
      setLoading(true);
      setError("");

      if (editingCourse) {
        // Update existing course
        const response = await fetch(
          `${API_URL}/update-subject/${editingCourse.course_id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              course_name: formData.course_name,
              teacher_name: formData.teacher_name,
            }),
          },
        );

        if (response.ok) {
          await fetchCourses();
          resetForm();
        } else {
          const errorData = await response.json();
          setError(errorData.error || "เกิดข้อผิดพลาด");
        }
      } else {
        // Add new course
        const response = await fetch(`${API_URL}/create-subject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          await fetchCourses();
          resetForm();
        } else {
          const errorData = await response.json();
          setError(errorData.error || "เกิดข้อผิดพลาด");
        }
      }
    } catch (error) {
      console.error("Error saving:", error);
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      course_id: course.course_id,
      course_name: course.course_name,
      teacher_name: course.teacher_name,
    });
    setError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm("คุณต้องการลบรายวิชานี้หรือไม่?")) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/delete-subject/${courseId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCourses();
      } else {
        setError("ไม่สามารถลบข้อมูลได้");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setError("ไม่สามารถลบข้อมูลได้");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ course_id: "", course_name: "", teacher_name: "" });
    setEditingCourse(null);
    setIsModalOpen(false);
    setError("");
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <Header />
      <Link 
        className="mb-4 flex items-center gap-2 w-fit px-4 py-2 bg-white hover:bg-gray-50 rounded-xl shadow-md transition-all border border-gray-200" 
        to={token?.role === "1" ? "/my-profile" : "/dashboard"}
      >
        <Home className="w-5 h-5 text-blue-600" />
        <p className="font-medium text-gray-700">หน้าหลัก</p>
      </Link>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {token?.role === "1" ? "เช็คชื่อ" : "ระบบจัดการรายวิชา"}
                </h1>
                {token?.role !== "1" && (
                  <p className="text-gray-500 mt-1">
                    จัดการข้อมูลรายวิชาและอาจารย์ผู้สอน
                  </p>
                )}
              </div>
            </div>
            {token?.role !== "1" && (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  setError("");
                }}
                disabled={loading}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <Plus className="w-5 h-5" />
                เพิ่มรายวิชา
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && !isModalOpen && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Search Bar */}
        {courses.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหารายวิชา รหัสวิชา หรือชื่ออาจารย์..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="ล้างการค้นหา"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {searchTerm ? (
                <>
                  พบ <strong className="text-blue-600">{filteredCourses.length}</strong> รายวิชา
                  จากการค้นหา "<strong className="text-blue-600">{searchTerm}</strong>"
                </>
              ) : (
                <>
                  แสดง <strong className="text-blue-600">{filteredCourses.length}</strong> รายวิชา
                </>
              )}
            </p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading && courses.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mr-3" />
              <span className="text-gray-600">กำลังโหลดข้อมูล...</span>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                ยังไม่มีรายวิชา กรุณาเพิ่มรายวิชาใหม่
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">ลำดับ</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">รหัสวิชา</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">ชื่อรายวิชา</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">อาจารย์ผู้สอน</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCourses.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12">
                        <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-lg font-medium">
                          ไม่พบรายวิชาที่ค้นหา
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          ลองค้นหาด้วยคำอื่น หรือ
                          <button
                            onClick={() => setSearchTerm("")}
                            className="text-blue-600 hover:underline ml-1"
                          >
                            ล้างการค้นหา
                          </button>
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredCourses.map((course, index) => (
                    <tr
                      key={course.course_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">
                          {course.course_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {token?.role === "1" ? (
                          <Link
                            to={`/check-manual/${course.course_id}/${
                              JSON.parse(localStorage.getItem("loginToken")).data?.student_id
                            }`}
                            className="hover:text-blue-600 hover:underline"
                          >
                            {course.course_name}
                          </Link>
                        ) : (
                          <p>{course.course_name}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {course.teacher_name}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          {token?.role === "2" || token?.role === "3" ? (
                            <>
                              <button
                                onClick={() => handleEdit(course)}
                                disabled={loading}
                                className="flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                title="แก้ไข"
                              >
                                <Edit2 className="w-4 h-4" />
                                <span className="text-sm">แก้ไข</span>
                              </button>
                              <button
                                onClick={() => handleDelete(course.course_id)}
                                disabled={loading}
                                className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                title="ลบ"
                              >
                                <Trash2 className="w-4 h-4" />
                                <span className="text-sm">ลบ</span>
                              </button>
                            </>
                          ) : (
                            <Link
                              className="flex items-center gap-2 p-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
                              to={`/class-detail/${course.course_id}/${token?.student_id}`}
                            >
                              <FileText size={18} />
                              รายละเอียด
                            </Link>
                          )}
                          {token?.role === "2" && (
                            <Link
                              className="flex items-center gap-2 p-2 rounded-lg text-white bg-emerald-500 hover:bg-emerald-600 transition-colors"
                              to={`/check-class/${course.course_id}`}
                            >
                              <CheckCircle size={18} />
                              เช็คชื่อ
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {courses.length > 0 && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {searchTerm ? (
                  <>
                    พบ{" "}
                    <span className="font-semibold text-blue-600">
                      {filteredCourses.length}
                    </span>{" "}
                    รายวิชา จากการค้นหา (ทั้งหมด {courses.length} รายวิชา)
                  </>
                ) : (
                  <>
                    แสดงทั้งหมด{" "}
                    <span className="font-semibold text-blue-600">
                      {courses.length}
                    </span>{" "}
                    รายวิชา
                  </>
                )}
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">
                  {editingCourse ? "แก้ไขรายวิชา" : "เพิ่มรายวิชาใหม่"}
                </h2>
                <button
                  onClick={resetForm}
                  disabled={loading}
                  className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800 font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    รหัสวิชา
                  </label>
                  <input
                    type="text"
                    name="course_id"
                    value={formData.course_id}
                    onChange={handleInputChange}
                    disabled={editingCourse !== null || loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                    placeholder="เช่น CS101"
                  />
                  {editingCourse && (
                    <p className="text-xs text-gray-500 mt-1">
                      * ไม่สามารถแก้ไขรหัสวิชาได้
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ชื่อรายวิชา
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                    placeholder="เช่น การเขียนโปรแกรมคอมพิวเตอร์"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    อาจารย์ผู้สอน
                  </label>
                  <input
                    type="text"
                    name="teacher_name"
                    value={formData.teacher_name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors disabled:opacity-50"
                    placeholder="เช่น อาจารย์สมชาย"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        กำลังบันทึก...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {editingCourse ? "บันทึก" : "เพิ่ม"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}