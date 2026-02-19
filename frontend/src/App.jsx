import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Subject from "./pages/Subject";
import Myprofile from "./pages/Myprofile";
import TeacherProfile from "./pages/TeacherProfile";
import Users from "./pages/Users";
import CheckClass from "./pages/CheckClass";
import StudentAttendanceDetail from "./pages/ClassDetail";
import StdCheckClass from "./pages/StdCheckClass";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/register" element={<Register />} />
        <Route path="/crud/subject" element={<Subject />} />
        <Route path="/my-profile" element={<Myprofile />} />
        <Route path="/teacher-profile" element={<TeacherProfile />} />
        <Route path="/users" element={<Users />} />
        <Route path="/check-class/:classId" element={<CheckClass />} />
        <Route
          path="/class-detail/:classId/:stdId"
          element={<StudentAttendanceDetail />}
        />
        <Route
          path="/check-manual/:classId/:stdId"
          element={<StdCheckClass />}
        />
      </Routes>
    </Router>
  );
}

export default App;