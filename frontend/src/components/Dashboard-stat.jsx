import { Book, Pen, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API_URL } from "../pages/Subject";
import Swal from "sweetalert2";
import axios from "axios";

const DashboardStat = () => {
  const [stats, setStats] = useState([]);

  const getStats = async () => {
    try {
      const res = await axios.get(API_URL + "/get-dashboard-stats");
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
      Swal.fire("ตรวจสอบเครือข่าย");
    }
  };
  useEffect(() => {
    getStats();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100">
        <div
          className={`w-14 h-14 bg-gradient-to-br bg-blue-100 rounded-xl flex items-center justify-center mb-4 shadow-md`}
        >
          <Users2 className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-gray-600 text-sm mb-1">นักศึกษา</p>
        <p className="text-4xl font-bold text-gray-800">
          {stats?.totalStudents}
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100">
        <div
          className={`w-14 h-14 bg-gradient-to-br bg-green-100 rounded-xl flex items-center justify-center mb-4 shadow-md`}
        >
          <Pen className="w-8 h-8 text-green-500" />
        </div>
        <p className="text-gray-600 text-sm mb-1">อาจารย์</p>
        <p className="text-4xl font-bold text-gray-800">
          {stats?.totalProfessors}
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-blue-100">
        <div
          className={`w-14 h-14 bg-gradient-to-br bg-oranage-100 rounded-xl flex items-center justify-center mb-4 shadow-md`}
        >
          <Book className="w-8 h-8 text-orange-500" />
        </div>
        <p className="text-gray-600 text-sm mb-1">วิชา</p>
        <p className="text-4xl font-bold text-gray-800">
          {stats?.totalCourses}
        </p>
      </div>
    </div>
  );
};
export default DashboardStat;
