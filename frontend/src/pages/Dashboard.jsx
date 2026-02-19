import { useEffect, useState } from "react";
import {
  User,
  BookOpen,
  GraduationCap,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Loader2,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import DashboardStat from "../components/Dashboard-stat";
import DashboardStudentRow from "../components/dashboars-student-row";
import DashboardProfessorRow from "../components/dashboard-professor-row";
import DashboardSubjectRow from "../components/dashboard-subject-row";
import Header from "../components/header";
import Footer from "../components/footer";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("students");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadAll, setLoadAll] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formData, setFormData] = useState({});

  const getAllList = async () => {
    try {
      const studentsRes = await axios.get(API_URL + "/students");
      setStudents(studentsRes.data.data);

      const professorsRes = await axios.get(API_URL + "/get-all-professors");
      setTeachers(professorsRes.data.data);

      const courseRes = await axios.get(API_URL + "/get-all-subjects");
      setSubjects(courseRes.data.data);

      if (activeTab === "students") {
        setTableData(studentsRes.data.data);
      } else if (activeTab === "teachers") {
        setTableData(professorsRes.data.data);
      } else if (activeTab === "subjects") {
        setTableData(courseRes.data.data);
      }
    } catch (error) {
      console.error(error);
      setError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
      setLoadAll(false);
    }
  };

  useEffect(() => {
    getAllList();
  }, []);

  useEffect(() => {
    if (activeTab === "students") {
      setTableData(students);
    } else if (activeTab === "teachers") {
      setTableData(teachers);
    } else {
      setTableData(subjects);
    }
  }, [activeTab]);

  const validateForm = () => {
    const errors = {};

    if (activeTab === "teachers") {
      // Validate Username
      if (!formData.username || !formData.username.trim()) {
        errors.username = "กรุณากรอกชื่อผู้ใช้งาน";
      } else if (formData.username.length < 3) {
        errors.username = "ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร";
      } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
        errors.username = "ชื่อผู้ใช้ต้องเป็นตัวอักษร ตัวเลข และ _ เท่านั้น";
      }

      // Validate Password
      if (!formData.password || !formData.password.trim()) {
        errors.password = "กรุณากรอกรหัสผ่าน";
      } else if (formData.password.length < 4) {
        errors.password = "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร";
      }

      // Validate Fullname
      if (!formData.fullname || !formData.fullname.trim()) {
        errors.fullname = "กรุณากรอกชื่อ-นามสกุล";
      } else if (formData.fullname.trim().length < 3) {
        errors.fullname = "ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร";
      } else if (!/^[ก-๙a-zA-Z\s]+$/.test(formData.fullname)) {
        errors.fullname = "ชื่อ-นามสกุลต้องเป็นตัวอักษรไทยหรืออังกฤษเท่านั้น";
      }

      // Validate Tel
      if (!formData.tel || !formData.tel.trim()) {
        errors.tel = "กรุณากรอกเบอร์โทรศัพท์";
      } else if (!/^0\d{9}$/.test(formData.tel)) {
        errors.tel = "เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 และมี 10 หลัก)";
      }
    } else if (activeTab === "subjects") {
      // Validate Course ID
      if (!formData.course_id || !formData.course_id.trim()) {
        errors.course_id = "กรุณากรอกรหัสวิชา";
      } else if (formData.course_id.length < 2) {
        errors.course_id = "รหัสวิชาต้องมีอย่างน้อย 2 ตัวอักษร";
      }

      // Validate Course Name
      if (!formData.course_name || !formData.course_name.trim()) {
        errors.course_name = "กรุณากรอกชื่อวิชา";
      } else if (formData.course_name.trim().length < 3) {
        errors.course_name = "ชื่อวิชาต้องมีอย่างน้อย 3 ตัวอักษร";
      }

      // Validate Teacher Name
      if (!formData.teacher_name || !formData.teacher_name.trim()) {
        errors.teacher_name = "กรุณากรอกชื่ออาจารย์ผู้สอน";
      }
    } else if (activeTab === "students") {
      // Validate Fullname
      if (!formData.fullname || !formData.fullname.trim()) {
        errors.fullname = "กรุณากรอกชื่อ-นามสกุล";
      } else if (formData.fullname.trim().length < 3) {
        errors.fullname = "ชื่อ-นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร";
      }

      // Validate Major
      if (!formData.major || !formData.major.trim()) {
        errors.major = "กรุณากรอกสาขาวิชา";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({});
    setError("");
    setFieldErrors({});
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData(item);
    setError("");
    setFieldErrors({});
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้?")) return;

    let api = "";
    if (activeTab === "students") {
      api = `/students/${item?.student_id}`;
    } else if (activeTab === "teachers") {
      api = `/delete-professor/${item?.id}`;
    } else {
      api = `/delete-subject/${item?.course_id}`;
    }

    try {
      const res = await axios.delete(API_URL + api);
      if (res.status === 200) {
        getAllList();
      }
    } catch (error) {
      console.error(error);
      setError("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const handleSave = async () => {
    // Clear errors
    setError("");
    setFieldErrors({});

    // Validate
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    let api = "";
    if (editingItem) {
      // Update
      if (activeTab === "students") {
        api = `/students/${formData?.student_id}`;
      } else if (activeTab === "teachers") {
        api = `/update-professor/${formData?.id}`;
      } else {
        api = `/update-subject/${formData?.course_id}`;
      }
    } else {
      // Create
      if (activeTab === "teachers") {
        api = "/create-professor";
      } else {
        api = "/create-subject";
      }
    }

    try {
      let res = null;
      if (editingItem) {
        res = await axios.put(API_URL + api, formData);
      } else {
        res = await axios.post(API_URL + api, formData);
      }

      if (res.status === 200 || res.status === 201) {
        getAllList();
        setShowModal(false);
        setFormData({});
        setFieldErrors({});
      }
    } catch (error) {
      console.error(error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } finally {
      setSaving(false);
    }
  };

  const filteredData = tableData.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError("");
    setFieldErrors({ ...fieldErrors, [field]: "" });
  };

  if (loadAll) {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8 mt-20">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            ยินดีต้อนรับ, Admin
          </h2>
          <p className="text-gray-600">
            จัดการข้อมูลนักศึกษา อาจารย์ และรายวิชา
          </p>
        </div>

        {/* Stats Grid */}
        <DashboardStat />

        {/* Management Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab("students")}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === "students"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <GraduationCap className="w-5 h-5" />
                นักศึกษา
              </div>
            </button>
            <button
              onClick={() => setActiveTab("teachers")}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === "teachers"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                อาจารย์
              </div>
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`flex-1 py-4 px-6 font-semibold transition-all ${
                activeTab === "subjects"
                  ? "bg-white text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5" />
                รายวิชา
              </div>
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                />
              </div>
              {activeTab !== "students" && (
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-medium"
                >
                  <Plus className="w-5 h-5" />
                  เพิ่มข้อมูล
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {activeTab === "students" && (
                    <>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        รหัสนักศึกษา
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ชื่อ-นามสกุล
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        สาขาวิชา
                      </th>
                    </>
                  )}
                  {activeTab === "teachers" && (
                    <>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        รหัสอาจารย์
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ชื่อ-นามสกุล
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        เบอร์โทรศัพท์
                      </th>
                    </>
                  )}
                  {activeTab === "subjects" && (
                    <>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        รหัสวิชา
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        ชื่อวิชา
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                        อาจารย์ผู้สอน
                      </th>
                    </>
                  )}
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">ไม่พบข้อมูล</p>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {activeTab === "students" && (
                        <DashboardStudentRow item={item} />
                      )}
                      {activeTab === "teachers" && (
                        <DashboardProfessorRow item={item} />
                      )}
                      {activeTab === "subjects" && (
                        <DashboardSubjectRow item={item} />
                      )}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredData.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                แสดง {filteredData.length} รายการ
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">
                {editingItem ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setFieldErrors({});
                  setError("");
                }}
                className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              )}

              {activeTab === "teachers" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ชื่อผู้ใช้งาน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.username || ""}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.username ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      placeholder="teacher01"
                    />
                    {fieldErrors.username && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.username}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      รหัสผ่าน <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.password || ""}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.password ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      placeholder="teacher1234"
                    />
                    {fieldErrors.password && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullname || ""}
                      onChange={(e) => handleInputChange("fullname", e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.fullname ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      placeholder="อาจารย์สมชาย"
                    />
                    {fieldErrors.fullname && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.fullname}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.tel || ""}
                      onChange={(e) => handleInputChange("tel", e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.tel ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      placeholder="0812345678"
                    />
                    {fieldErrors.tel && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.tel}
                      </p>
                    )}
                  </div>
                </>
              )}

              {activeTab === "subjects" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      รหัสวิชา <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.course_id || ""}
                      onChange={(e) => handleInputChange("course_id", e.target.value)}
                      disabled={editingItem !== null}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.course_id ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed`}
                      placeholder="CS101"
                    />
                    {fieldErrors.course_id && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.course_id}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ชื่อวิชา <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.course_name || ""}
                      onChange={(e) => handleInputChange("course_name", e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.course_name ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      placeholder="การเขียนโปรแกรม"
                    />
                    {fieldErrors.course_name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.course_name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      อาจารย์ผู้สอน <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.teacher_id || ""}
                      onChange={(e) => {
                        const teacherId = e.target.value;
                        const teacher = teachers.find(t => t.id == teacherId);
                        handleInputChange("teacher_id", teacherId);
                        if (teacher) {
                          handleInputChange("teacher_name", teacher.fullname);
                        }
                      }}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.teacher_name ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                    >
                      <option value="">เลือกอาจารย์</option>
                      {teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.fullname}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.teacher_name && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.teacher_name}
                      </p>
                    )}
                  </div>
                </>
              )}

              {activeTab === "students" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      รหัสนักศึกษา
                    </label>
                    <input
                      type="text"
                      value={formData.std_class_id || ""}
                      readOnly
                      className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      * ไม่สามารถแก้ไขรหัสนักศึกษาได้
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ชื่อ-นามสกุล <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullname || ""}
                      onChange={(e) => handleInputChange("fullname", e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.fullname ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      placeholder="นายสมชาย ใจดี"
                    />
                    {fieldErrors.fullname && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.fullname}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      สาขาวิชา <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.major || ""}
                      onChange={(e) => handleInputChange("major", e.target.value)}
                      className={`w-full px-4 py-3 bg-gray-50 border ${
                        fieldErrors.major ? "border-red-300" : "border-gray-200"
                      } rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all`}
                      placeholder="วิทยาการคอมพิวเตอร์"
                    />
                    {fieldErrors.major && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {fieldErrors.major}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFieldErrors({});
                    setError("");
                  }}
                  className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all font-medium"
                  disabled={saving}
                >
                  ยกเลิก
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg font-medium disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      บันทึก
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Dashboard;