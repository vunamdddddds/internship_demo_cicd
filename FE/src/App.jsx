import { Routes, Route, Navigate } from "react-router-dom";
import Login from "~/pages/auth/Login";
import Register from "~/pages/auth/Register";
import ForgotPassword from "~/pages/auth/ForgotPassword";
import Verify from "~/pages/auth/Verify";
import AuthLayout from "~/components/authLayout/AuthLayout";
import Layout from "./components/layout/Layout";
import InternManagement from "./pages/internManagement/InternManagement";
import MentorManagement from "./pages/mentorManagement/MentorManagement";
import UserManagement from "./pages/userManagement/UserManagement";
import TeamManagement from "./pages/teamManagement/TeamManagement";
import InternshipApplicationManagement from "./pages/internshipApplicationManagement/InternshipApplicationManagement";
import ChatManagement from "./pages/chatManagement/ChatManagement";
import MyCalendar from "~/pages/myCalendar/MyCalendar";
import MyWorkPage from "~/pages/intern/MyWorkPage";
import TaskManagementPage from "~/pages/mentor/TaskManagementPage";

import ScheduleManagement from "./pages/scheduleManagement/ScheduleManagement";
import WorkProgress from "./pages/workProgress/WorkProgress";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InternshipProgramManagament from "./pages/internshipProgramManagament/InternshipProgramManagament";
import OnLeaveIntern from "./pages/onLeave/OnLeave";
import LeaveDetail from "./pages/onLeave/LeaveDetail";
import OnLeaveCreate from "./pages/onLeave/OnLeaveCreate";
import BrowseLeave from "./pages/browseLeave/BrowseLeave";
import BrowseLeaveDetail from "./pages/browseLeave/BrowseLeaveDetail";



import DiligenceReport from "./pages/diligenceHr/DiligenceReport";
import DiligenceDetail from "~/pages/diligenceHr/DiligenceDetail";

function App() {
  return (
    <>
      {/* Thông báo toast toàn app */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Routes>
        {/* ✅ Toàn bộ phần Auth */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        
          <Route index element={<Navigate to="/auth/login" />} />
        </Route>

        {/* ✅ Thêm route rút gọn để không báo lỗi khi vào /forgot-password */}
        <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" />} />

        {/* ✅ Trang xác thực email */}
        <Route path="/verify" element={<Verify />} />

        {/* ✅ Các trang chính sau khi đăng nhập */}
        <Route path="/" element={<Layout />}>
          <Route path="intern" element={<InternManagement />} />
          <Route path="user" element={<UserManagement />} />
          <Route path="mentor" element={<MentorManagement />} />
          <Route path="team" element={<TeamManagement />} />
          <Route path="myCalendar" element={<MyCalendar />} />
          <Route path="my-work" element={<MyWorkPage />} />
          <Route path="scheduleManagement" element={<ScheduleManagement />} />
          <Route path="onLeave" element={<OnLeaveIntern />} />
          <Route path="onLeave/create" element={<OnLeaveCreate />} />
          <Route path="onLeave/:id" element={<LeaveDetail />} />
          <Route path="browseLeave" element={<BrowseLeave />} />
          <Route path="browseLeave/:id" element={<BrowseLeaveDetail />} />
          <Route path="workProgress" element={<WorkProgress />} />
          <Route path="diligenceHr" element={<DiligenceReport />} />
          <Route path="/diligenceHr/detail/:internId" element={<DiligenceDetail />} />
          <Route path="mentor/tasks" element={<TaskManagementPage />} />
          <Route
            path="internshipProgram"
            element={<InternshipProgramManagament />}
          />
          <Route
            path="internshipApplication"
            element={<InternshipApplicationManagement />}
          />
<Route path="chat" element={<ChatManagement />} />
          {/* <Route index element={<Navigate to="/intern" />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;