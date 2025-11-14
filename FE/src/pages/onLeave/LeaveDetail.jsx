import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock3, CheckCircle2 } from "lucide-react";
import "./LeaveDetail.css";

const mockData = {
  1: {
    id: 1,
    status: "Chờ duyệt",
    title: "Nghỉ phép",
    applicant: "Nguyễn Văn A",
    hr: "Nguyễn Thị HR",
    date: "03/11/2025",
    reason: "Về quê thăm gia đình",
    submitted: "31/10/2025",
    updated: "31/10/2025",
  },
  3: {
    id: 3,
    status: "Đã duyệt",
    title: "Về sớm",
    applicant: "Nguyễn Văn A",
    hr: "Nguyễn Thị HR",
    date: "30/10/2025",
    reason: "Có việc gia đình gấp",
    note: "Đã duyệt",
    submitted: "29/10/2025",
    updated: "30/10/2025",
  },
};

const LeaveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const leave = mockData[id];

  const getStatusTag = (status) => {
    switch (status) {
      case "Chờ duyệt":
        return (
          <div className="status pending">
            <Clock3 size={16} />
            <span>Chờ duyệt</span>
          </div>
        );
      case "Đã duyệt":
        return (
          <div className="status approved">
            <CheckCircle2 size={16} />
            <span>Đã duyệt</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="leave-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <h2>Đơn nghỉ phép #{`req-${leave.id}`}</h2>
          {getStatusTag(leave.status)}
        </div>

        <div className="detail-grid">
          <div>
            <p className="label">Người nộp đơn</p>
            <p className="value">{leave.applicant}</p>
          </div>
          <div>
            <p className="label">Loại đơn</p>
            <p className="value">{leave.title}</p>
          </div>
          <div>
            <p className="label">Ngày</p>
            <p className="value">{leave.date}</p>
          </div>
          <div>
            <p className="label">HR phụ trách</p>
            <p className="value">{leave.hr}</p>
          </div>
        </div>

        <div className="detail-section">
          <p className="label">Lý do</p>
          <div className="reason-box">{leave.reason}</div>
        </div>

        {leave.note && (
          <div className="detail-section">
            <p className="label">Ghi chú từ HR</p>
            <div className="note-box">{leave.note}</div>
          </div>
        )}

        <div className="footer-info">
          <p>Ngày nộp: {leave.submitted}</p>
          <p>Cập nhật lần cuối: {leave.updated}</p>
        </div>

        {leave.status === "Chờ duyệt" ? (
          <button className="cancel-btn">❌ Hủy đơn</button>
        ) : (
          <button className="download-btn">⬇️ Tải PDF</button>
        )}
      </div>
    </div>
  );
};

export default LeaveDetail;
