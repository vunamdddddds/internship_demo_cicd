import React from "react";
import "./BrowseLeaveDetail.css";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Clock3, CheckCircle2, XCircle } from "lucide-react";

const BrowseLeaveDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // ✅ Dữ liệu mẫu (sau này có thể thay bằng API)
  const request = {
    id: id,
    internName: "Nguyễn Văn A",
    type: "Nghỉ phép",
    date: "03/11/2025",
    reason: "Về quê thăm gia đình",
    status: "Chờ duyệt",
    submittedDate: "31/10/2025",
    updatedDate: "31/10/2025",
    hr: "Nguyễn Thị HR",
  };

  const getStatusTag = (status) => {
    if (status === "Chờ duyệt")
      return (
        <span className="status pending">
          <Clock3 size={15} /> Chờ duyệt
        </span>
      );
    if (status === "Đã duyệt")
      return (
        <span className="status approved">
          <CheckCircle2 size={15} /> Đã duyệt
        </span>
      );
    if (status === "Từ chối")
      return (
        <span className="status rejected">
          <XCircle size={15} /> Từ chối
        </span>
      );
  };

  return (
    <div className="browseleave-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Quay lại
      </button>

      <div className="detail-card">
        <div className="detail-header">
          <h2>Đơn {request.type.toLowerCase()} #{request.id}</h2>
          {getStatusTag(request.status)}
        </div>

        <div className="detail-info">
          <div className="info-group">
            <div>
              <p className="label">Người nộp đơn</p>
              <p className="value">{request.internName}</p>
            </div>
            <div>
              <p className="label">Loại đơn</p>
              <p className="value">{request.type}</p>
            </div>
          </div>

          <div className="info-group">
            <div>
              <p className="label">Ngày</p>
              <p className="value">{request.date}</p>
            </div>
            <div>
              <p className="label">HR phụ trách</p>
              <p className="value">{request.hr}</p>
            </div>
          </div>

          <div className="info-reason">
            <p className="label">Lý do</p>
            <div className="reason-box">{request.reason}</div>
          </div>

          <div className="info-footer">
            <p>Ngày nộp: {request.submittedDate}</p>
            <p>Cập nhật lần cuối: {request.updatedDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseLeaveDetail;
