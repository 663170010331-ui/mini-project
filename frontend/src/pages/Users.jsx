import { useEffect, useState } from "react";
import {
  Trash2,
  Search,
  Home,
  User,
  AlertCircle,
  GraduationCap,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import Header from "../components/header";
import Footer from "../components/footer";
import { Link } from "react-router-dom";

export default function Users() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [load, setLoad] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const getAll = async () => {
    try {
      const res = await axios.get(`${API_URL}/students`);
      setStudents(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getAll();
  }, []);

  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`${API_URL}/students/${studentToDelete.student_id}`);
      getAll();
      setShowDeleteModal(false);
      setStudentToDelete(null);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (load) {
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
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header with Back Button */}
        <div className="mb-6 flex items-center gap-4">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl transition-all shadow-md border border-gray-200"
          >
            <Home className="w-5 h-5 text-blue-600" />
            <span className="font-medium">หน้าหลัก</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                จัดการนักศึกษา
              </h1>
              <p className="text-sm text-gray-600">ดูและจัดการข้อมูลนักศึกษา</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Stats Bar */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                <span className="font-semibold text-lg">
                  นักศึกษาทั้งหมด: {students.length} คน
                </span>
              </div>
              <div className="text-gray-700 bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                แสดง {filteredStudents.length} รายการ
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="ค้นหา รหัสนักศึกษา, ชื่อ, หรือสาขาวิชา..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-800"
              />
            </div>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    รหัสนักศึกษา
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    ชื่อ-นามสกุล
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    สาขาวิชา
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        {student.std_class_id || student?.student_id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {student.fullname?.charAt(0)}
                          </div>
                          {student.fullname}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {student.major}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all shadow-sm hover:shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="font-medium">ลบ</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3 text-gray-500">
                        <AlertCircle className="w-12 h-12 text-gray-400" />
                        <p className="text-lg font-medium">
                          ไม่พบข้อมูลนักศึกษา
                        </p>
                        <p className="text-sm">
                          ลองค้นหาด้วยคำอื่น หรือเพิ่มนักศึกษาใหม่
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          {filteredStudents.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                แสดง{" "}
                <span className="font-semibold text-gray-800">
                  {filteredStudents.length}
                </span>{" "}
                จาก{" "}
                <span className="font-semibold text-gray-800">
                  {students.length}
                </span>{" "}
                รายการ
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-600 px-6 py-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold">ยืนยันการลบ</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <p className="text-gray-700 mb-2">
                คุณต้องการลบนักศึกษาคนนี้ใช่หรือไม่?
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">ชื่อ-นามสกุล</p>
                <p className="font-semibold text-gray-800 mb-3">
                  {studentToDelete?.fullname}
                </p>
                <p className="text-sm text-gray-600 mb-1">รหัสนักศึกษา</p>
                <p className="font-semibold text-gray-800">
                  {studentToDelete?.std_class_id || studentToDelete?.student_id}
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">
                  การดำเนินการนี้ไม่สามารถย้อนกลับได้
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex gap-3">
              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium disabled:opacity-50"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    กำลังลบ...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    ยืนยันการลบ
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}