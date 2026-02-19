import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";
import { API_URL } from "../pages/Subject";

const CheckClassRow = ({ data, classId, fetch }) => {
  console.log("🚀 ~ CheckClassRow ~ data:", data);
  const [load, setLoad] = useState(false);

  const checkClass = async (status, student, stdId) => {
    const { isConfirmed } = await Swal.fire({
      title: status,
      text: `ยืนยันการเข้าเรียนของ ${student}`,
      confirmButtonText: "ยืนยัน",
      showDenyButton: true,
      denyButtonText: "ยกเลิก",
      icon: "question",
      confirmButtonColor: "#4F46E5",
      denyButtonColor: "#6B7280",
    });
    if (!isConfirmed) return;

    setLoad(true);
    try {
      const res = await axios.post(API_URL + `/check-class`, {
        status,
        classId,
        stdId,
      });
      if (res.status === 200) {
        Swal.fire({
          title: "เช็คชื่อแล้ว",
          text: `บันทึก ${status} สำเร็จ`,
          icon: "success",
          confirmButtonColor: "#4F46E5",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถบันทึกข้อมูลได้",
        icon: "error",
        confirmButtonColor: "#DC2626",
      });
    } finally {
      setLoad(false);
    }
  };

  // Status badge colors
  const getStatusStyle = (status) => {
    const styles = {
      มาเรียน: "bg-green-100 text-green-800 border-green-200",
      ขาดเรียน: "bg-red-100 text-red-800 border-red-200",
      ลา: "bg-amber-100 text-amber-800 border-amber-200",
      มาสาย: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-150">
      {load ? (
        <td colSpan="2" className="p-4">
          <div className="flex items-center justify-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            <p className="text-gray-600 font-medium">กำลังบันทึกข้อมูล...</p>
          </div>
        </td>
      ) : (
        <>
          {/* Student Info Column */}
          <td className="p-4">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">
                  {data?.fullname?.charAt(0) || "?"}
                </span>
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <p className="text-base font-semibold text-gray-900">
                  {data?.fullname || "ไม่ระบุชื่อ"}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  รหัส: {data?.std_class_id || data?.student_id || "-"}
                </p>
              </div>
            </div>
          </td>

          {/* Action/Status Column */}
          <td className="p-4">
            <div className="flex justify-center items-center gap-2">
              {data?.status ? (
                // Already checked in - show status badge
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 ${getStatusStyle(
                    data.status
                  )} shadow-sm`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-sm">{data.status}</span>
                    <span className="text-xs opacity-75">
                      {new Date(data.checkin_time).toLocaleTimeString("th-TH", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ) : (
                // Not checked in yet - show action buttons
                <div className="flex gap-2">
                  <button
                    disabled={load}
                    onClick={() =>
                      checkClass("มาเรียน", data?.fullname, data?.student_id)
                    }
                    className="group relative px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    มาเรียน
                  </button>

                  <button
                    disabled={load}
                    onClick={() =>
                      checkClass("ขาดเรียน", data?.fullname, data?.student_id)
                    }
                    className="group relative px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ขาด
                  </button>

                  <button
                    disabled={load}
                    onClick={() =>
                      checkClass("ลา", data?.fullname, data?.student_id)
                    }
                    className="group relative px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    ลา
                  </button>

                  <button
                    disabled={load}
                    onClick={() =>
                      checkClass("มาสาย", data?.fullname, data?.student_id)
                    }
                    className="group relative px-4 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    มาสาย
                  </button>
                </div>
              )}
            </div>
          </td>
        </>
      )}
    </tr>
  );
};

export default CheckClassRow;
