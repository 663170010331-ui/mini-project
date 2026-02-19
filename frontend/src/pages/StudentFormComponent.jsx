import React, { useState } from "react";
import StdList from "../components/std-list";

function StudentForm() {
  const [studentData, setStudentData] = useState([]);
  const [fullname, setFullname] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const e = {};
    if (!fullname.trim()) e.fullname = "กรุณากรอกชื่อ-สกุล";
    if (!studentId.trim()) e.studentId = "กรุณากรอกรหัสนักเรียน";
    else if (!/^\d{4,12}$/.test(studentId.trim()))
      e.studentId = "รหัสนักเรียนต้องเป็นตัวเลข 4-12 หลัก";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      // ตัวอย่างส่งข้อมูลไป API — แทนที่ด้วยการเรียก fetch/axios จริงเมื่อพร้อม
      const payload = {
        fullname,
        studentId,
        isCheck: false,
      };

      setStudentData((prev) =>
        prev.map((p) => p.studentId).includes(studentId)
          ? prev
          : [payload, ...prev]
      );

      setSubmitted(true);
      // เคลียร์ฟอร์ม (ถ้าต้องการ)
      setFullname("");
      setStudentId("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  }

  return (
    <div className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-linear-120 from-indigo-500 to-purple-500 rounded-xl text-white">
          {/* simple user icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A9 9 0 1112 21a9 9 0 01-6.879-3.196z"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            ฟอร์มข้อมูลนักเรียน
          </h2>
          <p className="text-sm text-gray-500">
            กรอกชื่อ-สกุลและรหัสนักเรียนเพื่อบันทึกข้อมูล
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ชื่อ-สกุล
          </label>
          <input
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="เช่น สมชาย ใจดี"
            className={`w-full bg-white rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow " + (errors.fullname ? 'border-red-300' : 'border-gray-200')`}
          />
          {errors.fullname && (
            <p className="mt-1 text-xs text-red-600">{errors.fullname}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            รหัสนักศึกษา
          </label>
          <input
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="เช่น 64230123"
            inputMode="numeric"
            className={`w-full bg-white rounded-xl border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-shadow " + (errors.studentId ? 'border-red-300' : 'border-gray-200')`}
          />
          {errors.studentId && (
            <p className="mt-1 text-xs text-red-600">{errors.studentId}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            className="flex-1 items-center justify-center text-white gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-medium shadow-sm transition-shadow"
          >
            บันทึกข้อมูล
          </button>

          <button
            type="button"
            onClick={() => {
              setFullname("");
              setStudentId("");
              setErrors({});
            }}
            className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-800 hover:bg-red-500  bg-white hover:text-white"
          >
            ล้าง
          </button>
        </div>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-200 w-full flex flex-col gap-2 h-[200px] overflow-auto">
        <span className="flex items-center justify-between mb-2.5">
          <label htmlFor="" className="">
            ข้อมูลการเข้าเรียน
          </label>

          {studentData.length > 0 && (
            <button
              onClick={() => setStudentData([])}
              className="text-sm text-white bg-red-500 p-2 rounded-md shadow-md"
            >
              ล้างข้อมูล
            </button>
          )}
        </span>

        {studentData.map((s, index) => (
          <StdList setStudentData={setStudentData} data={s} key={index} />
        ))}
      </div>

      {submitted && (
        <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
          บันทึกสำเร็จ ✅ ข้อมูลถูกส่งเรียบร้อย
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400">
        * ฟอร์มนี้เป็นตัวอย่าง สามารถเชื่อมต่อ API ได้โดยแก้ handleSubmit
      </p>
    </div>
  );
}

export default StudentForm;
