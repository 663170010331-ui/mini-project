import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Trash2, UserPlus } from "lucide-react";

function Profile() {
  const [profiles, setProfiles] = useState([]);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("loginToken");
    if (!token) return (location.href = "/");
  }, []);

  const addProfile = () => {
    if (!name.trim()) return alert("กรุณากรอกชื่อ-นามสกุล");
    if (!studentId.trim()) return alert("กรุณากรอกรหัสนักเรียน");

    setProfiles([
      ...profiles,
      {
        id: Date.now(),
        name,
        studentId,
        createdAt: new Date().toLocaleString("th-TH"),
      },
    ]);
    setName("");
    setStudentId("");

  };

  const deleteProfile = (id) => {
    if (confirm("คุณต้องการลบข้อมูลนี้ใช่หรือไม่?")) {
      setProfiles(profiles.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 text-white">
      {/* Navbar */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">กลับหน้าหลัก</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold">จัดการข้อมูลนักเรียน</h1>
          </div>
          <div className="w-24"></div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-2xl">
                👥
              </div>
              <div>
                <p className="text-white/70 text-sm">นักเรียนทั้งหมด</p>
                <p className="text-2xl font-bold">{profiles.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center text-2xl">
                ✅
              </div>
              <div>
                <p className="text-white/70 text-sm">เพิ่มวันนี้</p>
                <p className="text-2xl font-bold">
                  {
                    profiles.filter(
                      (p) =>
                        new Date(p.createdAt).toDateString() ===
                        new Date().toDateString()
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            เพิ่มข้อมูลนักเรียนใหม่
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="text"
              className="p-3 rounded-lg bg-white/90 text-black outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="ชื่อ - นามสกุล"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              className="p-3 rounded-lg bg-white/90 text-black outline-none focus:ring-2 focus:ring-purple-400 transition"
              placeholder="รหัสนักเรียน"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />
          </div>

          <button
            onClick={addProfile}
            className="w-full px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition rounded-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            เพิ่มข้อมูลนักเรียน
          </button>
        </div>

        {/* List */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            📋 รายชื่อนักเรียนทั้งหมด
          </h3>

          {profiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white/30" />
              </div>
              <p className="text-white/60 text-lg">ยังไม่มีข้อมูลนักเรียน</p>
              <p className="text-white/40 text-sm mt-2">
                เริ่มต้นโดยเพิ่มข้อมูลนักเรียนใหม่ด้านบน
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {profiles.map((p) => (
                <div
                  key={p.id}
                  className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg">{p.name}</h4>
                        <div className="flex gap-4 text-sm text-white/60 mt-1">
                          <span>🆔 {p.studentId}</span>
                          <span>📚 {p.classRoom}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteProfile(p.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 transition rounded-lg border border-red-400/30 flex items-center gap-2 group-hover:scale-105 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
