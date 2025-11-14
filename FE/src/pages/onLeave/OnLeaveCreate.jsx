import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Calendar, XCircle, RotateCcw, Send, Loader, AlertCircle } from "lucide-react";
import "./OnLeaveCreate.css";
import leaveRequestApi from "../../api/diligenceApi";

const OnLeaveCreate = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    type: "ON_LEAVE", // Match backend enum
    date: "",
    reason: "",
    attachedFile: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "attachedFile") {
      setFormData({ ...formData, attachedFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleReset = () => {
    setFormData({
      type: "ON_LEAVE",
      date: "",
      reason: "",
      attachedFile: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError("");

    const data = new FormData();
    data.append("type", formData.type);
    data.append("date", formData.date);
    data.append("reason", formData.reason);
    if (formData.attachedFile) {
      data.append("attachedFile", formData.attachedFile);
    }

    try {
      await leaveRequestApi.createLeaveRequest(data);
      alert("Đơn nghỉ phép đã được gửi thành công!");
      navigate("/onLeave");
    } catch (err) {
      setError(err.response?.data?.message || "Gửi đơn thất bại. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="onleave-create-container">
      <form className="onleave-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <FileText size={22} />
          <h2>Tạo đơn xin nghỉ phép</h2>
        </div>

        {error && <div className="error-message"><AlertCircle size={16} /> {error}</div>}

        <div className="form-group">
          <label>Loại đơn *</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="ON_LEAVE">Nghỉ phép</option>
            <option value="LATE">Xin đi muộn</option>
            <option value="EARLY_LEAVE">Xin về sớm</option>
          </select>
        </div>

        <div className="form-group">
          <label>Ngày *</label>
          <div className="date-input">
            <Calendar size={18} />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Lý do *</label>
          <textarea
            name="reason"
            rows="4"
            placeholder="Nhập lý do..."
            value={formData.reason}
            onChange={handleChange}
            maxLength={500}
            required
          ></textarea>
          <p className="char-count">{formData.reason.length}/500 ký tự</p>
        </div>

        <div className="form-group">
          <label>File đính kèm (không bắt buộc)</label>
          <input
            type="file"
            name="attachedFile"
            accept=".pdf,.jpg,.png,.jpeg"
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/onLeave")}
            disabled={isLoading}
          >
            <XCircle size={16} /> Hủy
          </button>
          <button type="button" className="btn-reset" onClick={handleReset} disabled={isLoading}>
            <RotateCcw size={16} /> Làm mới
          </button>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
            {isLoading ? "Đang gửi..." : "Gửi đơn"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnLeaveCreate;
