import React, { useEffect, useState } from "react";
import "./Onleave.css";
import { PlusCircle, Clock3, CheckCircle2, XCircle, Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import leaveRequestApi from "../../api/diligenceApi"; // Adjusted import

// Helper function to map backend status to frontend display text and class
const getStatusDetails = (approved) => {
  if (approved === null) {
    return { text: "Chờ duyệt", className: "status pending", Icon: Clock3 };
  }
  if (approved === true) {
    return { text: "Đã duyệt", className: "status approved", Icon: CheckCircle2 };
  }
  if (approved === false) {
    return { text: "Từ chối", className: "status rejected", Icon: XCircle };
  }
  return { text: "Không xác định", className: "status", Icon: AlertCircle };
};

// Helper function to map backend type to frontend display text
const mapTypeToTitle = (type) => {
  switch (type) {
    case "LATE":
      return "Xin đi muộn";
    case "EARLY_LEAVE":
      return "Xin về sớm";
    case "ON_LEAVE":
      return "Nghỉ phép";
    default:
      return "Không xác định";
  }
};

const OnLeave = () => {
  const navigate = useNavigate();
  const [leaveList, setLeaveList] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        const response = await leaveRequestApi.getMyLeaveRequests();
        
        // The backend response is the full object, let's use it
        setStats({
          total: response.countLeaveApplication || 0,
          pending: response.countPendingApprove || 0,
          approved: response.countApprove || 0,
          rejected: response.countReject || 0,
        });

        setLeaveList(response.leaveApplications || []);

      } catch (err) {
        setError("Không thể tải danh sách đơn nghỉ phép. Vui lòng thử lại.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveRequests();
  }, []);

  return (
    <div className="onleave-container">
      <div className="onleave-content">
        <div className="section-header">
          <h2>Đơn nghỉ phép của tôi</h2>
          <p>Quản lý và theo dõi các đơn nghỉ phép</p>
        </div>

        <div className="leave-stats">
          <div className="stat-card"><p>Tổng đơn</p><p className="stat-value">{stats.total}</p></div>
          <div className="stat-card"><p>Chờ duyệt</p><p className="stat-value">{stats.pending}</p></div>
          <div className="stat-card"><p className="text-green">Đã duyệt</p><p className="stat-value text-green">{stats.approved}</p></div>
          <div className="stat-card"><p className="text-red">Từ chối</p><p className="stat-value text-red">{stats.rejected}</p></div>
        </div>

        <div className="action-bar">
          <button className="btn-new" onClick={() => navigate("/onLeave/create")}>
            <PlusCircle size={18} />
            Tạo đơn mới
          </button>
        </div>

        <div className="leave-list">
          <h3>Danh sách đơn nghỉ</h3>
          {loading ? (
            <div className="loading-state"><Loader className="animate-spin" /> Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="error-state"><AlertCircle /> {error}</div>
          ) : (
            leaveList.map((item) => {
              const statusDetails = getStatusDetails(item.approved);
              const title = mapTypeToTitle(item.type);

              return (
                <div
                  key={item.id}
                  className="leave-item clickable"
                  onClick={() => navigate(`/onLeave/${item.id}`)}
                >
                  <div className="leave-main">
                    <div className="leave-title">
                      <strong>{title}</strong>
                      <span className="dot">•</span>
                      <span>{new Date(item.date).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <p className="leave-reason">{item.reason}</p>
                    {/* Backend doesn't provide submitTime, so we remove it for now */}
                  </div>
                  <div className={statusDetails.className}>
                    <statusDetails.Icon size={16} />
                    <span>{statusDetails.text}</span>
                  </div>
                </div>
              );
            })
          )}
           { !loading && !error && leaveList.length === 0 && <div className='no-data'>Bạn chưa có đơn nghỉ phép nào.</div>}
        </div>
      </div>
    </div>
  );
};

export default OnLeave;


