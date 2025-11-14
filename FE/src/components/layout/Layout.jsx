import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import ChangePassword from "../ChangePassword";
import { getInfo } from "~/services/UserService";
import UserInfo from "../UserInfo";
import {
  Menu,
  X,
  UserCheck,
  Bell,
  FileText,
  Award,
  LogOut,
  User,
  KeyRound,
  MessageSquare,
  Users,
  Calendar,
  ClipboardList, // Import a suitable icon for Task Management
} from "lucide-react";
import "./Layout.css";
import path from "path";

  const rolePermissions = {
    ADMIN: [
      "/user",
      "/intern",
      "/internshipApplication",
      "/internshipProgram",
      "/chat",
      "/mentor",
      "/team",
      "/scheduleManagement",
            "/diligenceHr",
      "/browseLeave",	 
    ],
    MENTOR: ["/mentor/tasks"], // Added /mentor/tasks for MENTOR role
    INTERN: ["/myCalendar", "/onLeave", "/workProgress", "/my-work"],
    HR: [
      "/intern",
      "/user",
      "/internshipProgram",
      "/chat",
      "/scheduleManagement",
      "/admin/team-schedule",
      "/diligenceHr",
      "/browseLeave",
    ],
    VISITOR: [],
  };

  const menuItems = [
    { path: "/user", icon: UserCheck, label: "Quản lý người dùng" },
    { path: "/intern", icon: UserCheck, label: "Quản lý thực tập sinh" },
    { path: "/mentor", icon: UserCheck, label: "Quản lý Mentor" },
    { path: "/team", icon: Users, label: "Quản lý nhóm" },
    {
      path: "/internshipApplication",
      icon: FileText,
      label: "Quản lý đơn xin thực tập",
    },
    { path: "/myCalendar", icon: Calendar, label: "Lịch của tôi" },
    { path: "/my-work", icon: ClipboardList, label: "My Work" },
    {
      path: "/scheduleManagement",
      icon: Calendar,
      label: "Quản lí lịch thực tập",
    },
    { path: "/internshipProgram", icon: Award, label: "Quản lý kỳ thực tập" },
    { path: "/chat", icon: MessageSquare, label: "Tin nhắn" },
    { path: "/schedule", icon: Calendar, label: "Lịch" },
    { path: "/browseLeave", icon: FileText, label: "Duyệt đơn nghỉ phép" },
    { path : "/onLeave", icon: FileText, label: "Nghỉ phép" },
    { path: "/workProgress", icon: FileText, label: "Tiến độ thực tập" },
    { path: "/diligenceHr", icon: FileText, label: "Quản lý chuyên cần"},
    { path: "/mentor/tasks", icon: ClipboardList, label: "Quản lý công việc" }, // Added Task Management
  ];
const Layout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [role, setRole] = useState(null);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [user, setUser] = useState([]);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const toggleUserMenu = () => setShowMenu(!showMenu);

  useEffect(() => {
    const token = localStorage.getItem("AccessToken");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.scope);
    } else {
      navigate("/auth/login");
    }
  }, []);

  const fetchUser = async () => {
    const data = await getInfo({});
    setUser(data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Frontend route protection
  useEffect(() => {
    if (role && location.pathname !== '/auth/login' && location.pathname !== '/verify') { // Don't protect auth/verify pages
      const allowedPaths = rolePermissions[role] || [];
      // Check if the current path (or its base path if it's a detail page like /diligenceHr/detail/1) is allowed
      const isPathAllowed = allowedPaths.some(allowedPath => {
        if (allowedPath.includes(':')) { // Handle dynamic routes like /diligenceHr/detail/:internId
          const regex = new RegExp(`^${allowedPath.replace(/:\w+/g, '[^/]+')}$`);
          return regex.test(location.pathname);
        }
        return location.pathname.startsWith(allowedPath);
      });

      if (!isPathAllowed) {
        // If the current path is not allowed for the user's role, redirect to home or an unauthorized page
        navigate("/"); 
      }
    }
  }, [role, location.pathname, navigate]);


  useEffect(() => {
    if (role) {
      const allowedPaths = rolePermissions[role] || [];
      setFilteredMenu(
        menuItems.filter((item) => allowedPaths.includes(item.path))
      );
    }
  }, [role]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear("AccessToken");
    navigate("/auth/login");
  };

  return (
    <>
      <div className="layout-container">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <div className="sidebar-header">
            {sidebarOpen && (
              <div className="logo">
                <div className="logo-icon">IS</div>
                <span className="logo-text">INTERNSHIP</span>
              </div>
            )}
            {!sidebarOpen && <div className="logo-icon">IS</div>}
          </div>

          <nav className="sidebar-nav">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  title={!sidebarOpen ? item.label : ""}
                >
                  <Icon className="nav-icon" size={20} />
                  {sidebarOpen && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="main-wrapper">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <button className="menu-toggle" onClick={toggleSidebar}>
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>

            <div className="header-actions">
              <button className="icon-button">
                <Bell size={20} />
                <span className="notification-badge"></span>
              </button>
              <div
                className={`user-profile ${showMenu ? "active" : ""}`}
                onClick={() => toggleUserMenu()}
              >
                <div className="avatar">
                  <img src={user.avatarUrl || "src/assets/avatarDefault.jpg"} />
                </div>
                <span className="user-name">{user.fullName}</span>

                {showMenu && (
                  <div className="user-dropdown">
                    <button
                      className="dropdown-item"
                      onClick={() => setShowInfo(true)}
                    >
                      <User size={18} style={{ marginRight: 8 }} />
                      Thông tin tài khoản
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => setShowChangePassword(true)}
                    >
                      <KeyRound size={18} style={{ marginRight: 8 }} />
                      Đổi mật khẩu
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={handleLogout}
                      style={{ color: "#dc2626" }}
                    >
                      <LogOut size={18} style={{ marginRight: 8 }} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="main-content">
            <Outlet context={{ user }} />
          </main>
        </div>
      </div>

      {showInfo && (
        <UserInfo
          user={user}
          setUser={setUser}
          onClose={() => setShowInfo(false)}
        />
      )}
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
};

export default Layout;