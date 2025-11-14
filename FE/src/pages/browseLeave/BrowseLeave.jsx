import React, { useState, useEffect, useCallback } from "react";
import "./BrowseLeave.css";
import { FileText, Eye, CheckCircle2, XCircle, X, Loader, AlertCircle } from "lucide-react";
import leaveRequestApi from "../../api/diligenceApi";
import Pagination from "../../components/Pagination"; // Assuming a Pagination component exists
import { useDebounce } from "../../hooks/useDebounce"; // Assuming a debounce hook exists

// Helper functions from OnLeave.jsx can be moved to a shared utility file
const getStatusDetails = (approved) => {
  if (approved === null) return { text: "Chờ duyệt", className: "status pending" };
  if (approved === true) return { text: "Đã duyệt", className: "status approved" };
  if (approved === false) return { text: "Từ chối", className: "status rejected" };
  return { text: "Không xác định", className: "status" };
};

const mapTypeToTitle = (type) => {
  switch (type) {
    case "LATE": return "Xin đi muộn";
    case "EARLY_LEAVE": return "Xin về sớm";
    case "ON_LEAVE": return "Nghỉ phép";
    default: return "Không xác định";
  }
};

const BrowseLeave = () => {
  const [activeTab, setActiveTab] = useState("pending"); // pending | processed
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [filterType, setFilterType] = useState(""); // All types

  // Data and state
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [pagination, setPagination] = useState({ page: 1, size: 10, totalElements: 0, totalPages: 1 });

  // Modals
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Detail Modal
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequestDetail, setSelectedRequestDetail] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const fetchLeaveRequests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        keyword: debouncedSearchTerm,
        type: filterType || null, // Send null if empty
      };

      if (activeTab === 'pending') {
        params.approved = null;
      } else { // 'processed'
        params.approved = true;
      }

      const response = await leaveRequestApi.getAllLeaveRequests(params);
      setLeaveRequests(response.content || []);
      setPagination(prev => ({ ...prev, totalElements: response.totalElements, totalPages: response.totalPages }));
    } catch (err) {
      setError("Không thể tải danh sách đơn. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, debouncedSearchTerm, filterType, activeTab]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const openApproveModal = (req) => {
    setSelectedRequest(req);
    setShowApproveModal(true);
  };

  const openRejectModal = (req) => {
    setSelectedRequest(req);
    setShowRejectModal(true);
  };

  const handleConfirmApprove = async () => {
    if (!selectedRequest) return;
    setIsSubmitting(true);
    try {
      await leaveRequestApi.approveLeaveRequest(selectedRequest.id);
      setShowApproveModal(false);
      setNote("");
      fetchLeaveRequests(); // Refresh data
    } catch (error) {
      alert("Duyệt đơn thất bại: " + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!selectedRequest || !note) {
      alert("Lý do từ chối là bắt buộc.");
      return;
    }
    setIsSubmitting(true);
    try {
      await leaveRequestApi.rejectLeaveRequest({ id: selectedRequest.id, reasonReject: note });
      setShowRejectModal(false);
      setNote("");
      fetchLeaveRequests(); // Refresh data
      setIsSubmitting(false);
    }catch(error){
      console.error("Error in fetchLeaveRequests: ", error);
    }
  };

  const handleViewDetail = async (id) => {
    setIsDetailModalOpen(true);
    setIsDetailLoading(true);
    try {
      const response = await leaveRequestApi.getLeaveRequestById(id);
      setSelectedRequestDetail(response);
    } catch (error) {
      alert("Không thể tải chi tiết đơn: " + (error.response?.data?.message || error.message));
      setIsDetailModalOpen(false); // Close modal on error
    } finally {
      setIsDetailLoading(false);
    }
  };

  return (
    <div className="browseleave-container">
      <div className="browseleave-header">
        <FileText size={22} />
        <div>
          <h2>Duyệt đơn nghỉ phép</h2>
          <p>Quản lý và xử lý đơn nghỉ phép của thực tập sinh</p>
        </div>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          Chờ duyệt
        </button>
        <button
          className={`tab-btn ${activeTab === "processed" ? "active" : ""}`}
          onClick={() => setActiveTab("processed")}
        >
          Đã xử lý
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên thực tập sinh..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="">Tất cả loại đơn</option>
          <option value="ON_LEAVE">Nghỉ phép</option>
          <option value="LATE">Đi muộn</option>
          <option value="EARLY_LEAVE">Về sớm</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Intern</th>
              <th>Loại đơn</th>
              <th>Ngày</th>
              <th>Lý do</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="loading-state"><Loader className="animate-spin" /> Đang tải...</td></tr>
            ) : error ? (
              <tr><td colSpan="6" className="error-state"><AlertCircle /> {error}</td></tr>
            ) : leaveRequests.length > 0 ? (
              leaveRequests.map((req) => {
                const statusDetails = getStatusDetails(req.approved);
                return (
                  <tr key={req.id}>
                    <td><strong>{req.internName}</strong></td>
                    <td>{mapTypeToTitle(req.type)}</td>
                    <td>{new Date(req.date).toLocaleDateString("vi-VN")}</td>
                    <td>{req.reason}</td>
                    <td><span className={statusDetails.className}>{statusDetails.text}</span></td>
                    <td className="actions">
                      <button className="view-btn" onClick={() => handleViewDetail(req.id)}><Eye size={16} /> Xem</button>
                      {req.approved === null && (
                        <>
                          <button className="approve-btn" onClick={() => openApproveModal(req)}><CheckCircle2 size={16} /> Duyệt</button>
                          <button className="reject-btn" onClick={() => openRejectModal(req)}><XCircle size={16} /> Từ chối</button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan="6" className="no-data">Không có đơn nào phù hợp.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination pagination={pagination} filters={{ page: pagination.page }} changePage={handlePageChange} name="đơn" />

      {showApproveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setShowApproveModal(false)}><X size={16} /></button>
            <h3>Xác nhận duyệt đơn</h3>
            <p>Xác nhận duyệt đơn <strong>{mapTypeToTitle(selectedRequest.type)}</strong> của <strong>{selectedRequest.internName}</strong>?</p>
            <div className="modal-actions">
              <button onClick={() => setShowApproveModal(false)} className="cancel-btn" disabled={isSubmitting}>Hủy</button>
              <button onClick={handleConfirmApprove} className="confirm-btn" disabled={isSubmitting}>
                {isSubmitting ? <Loader size={16} className="animate-spin"/> : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="modal-overlay">
          <div className="modal reject">
            <button className="close-btn" onClick={() => setShowRejectModal(false)}><X size={16} /></button>
            <h3>Từ chối đơn</h3>
            <p>Từ chối đơn <strong>{mapTypeToTitle(selectedRequest.type)}</strong> của <strong>{selectedRequest.internName}</strong></p>
            <label>Lý do từ chối *</label>
            <textarea placeholder="Nhập lý do từ chối..." value={note} onChange={(e) => setNote(e.target.value)} />
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)} className="cancel-btn" disabled={isSubmitting}>Hủy</button>
              <button onClick={handleConfirmReject} className="reject-btn-modal" disabled={isSubmitting}>
                {isSubmitting ? <Loader size={16} className="animate-spin"/> : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isDetailModalOpen && (
        <div className="modal-overlay">
          <div className="modal detail">
            <button className="close-btn" onClick={() => setIsDetailModalOpen(false)}><X size={16} /></button>
            <h3>Chi tiết đơn nghỉ phép</h3>
            {isDetailLoading ? (
              <div className="loading-state"><Loader className="animate-spin" /> Đang tải chi tiết...</div>
            ) : selectedRequestDetail ? (
              <div className="leave-detail-content">
                <div className="detail-row">
                  <strong>Thực tập sinh:</strong>
                  <span>{selectedRequestDetail.internName}</span>
                </div>
                <div className="detail-row">
                  <strong>Loại đơn:</strong>
                  <span>{mapTypeToTitle(selectedRequestDetail.type)}</span>
                </div>
                <div className="detail-row">
                  <strong>Ngày:</strong>
                  <span>{new Date(selectedRequestDetail.date).toLocaleDateString("vi-VN")}</span>
                </div>
                <div className="detail-row reason">
                  <strong>Lý do:</strong>
                  <p>{selectedRequestDetail.reason}</p>
                </div>
                <div className="detail-row">
                  <strong>Trạng thái:</strong>
                  <span>
                    {getStatusDetails(selectedRequestDetail.approved).text}
                  </span>
                </div>
                {selectedRequestDetail.approved === false && selectedRequestDetail.reasonReject && (
                  <div className="detail-row reason">
                    <strong>Lý do từ chối:</strong>
                    <p>{selectedRequestDetail.reasonReject}</p>
                  </div>
                )}
                 {selectedRequestDetail.attachedFileUrl && (
                  <div className="detail-row">
                    <strong>File đính kèm:</strong>
                    <a href={selectedRequestDetail.attachedFileUrl} target="_blank" rel="noopener noreferrer">Xem file</a>
                  </div>
                )}
              </div>
            ) : (
              <div className="error-state"><AlertCircle /> Không thể tải dữ liệu.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseLeave;
