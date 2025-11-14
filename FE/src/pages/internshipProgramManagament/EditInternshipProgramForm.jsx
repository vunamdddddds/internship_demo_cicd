import React, { useState } from "react";
import { X } from "lucide-react";
import { editInternshipProgram } from "~/services/InternshipProgramService";

const EditInternshipProgramModal = ({
  onClose,
  internshipProgram,
  convertToISO,
}) => {
  const convertToDatetimeLocal = (dateString) => {
    if (!dateString) return "";
    const [day, month, yearAndTime] = dateString.split("-");
    const [year, time] = yearAndTime.split(" ");
    return `${year}-${month}-${day}T${time}`;
  };

  const [formData, setFormData] = useState({
    id: internshipProgram.id,
    name: internshipProgram.name,
    endPublishedTime: convertToDatetimeLocal(
      internshipProgram.endPublishedTime
    ),
    endReviewingTime: convertToDatetimeLocal(
      internshipProgram.endReviewingTime
    ),
    timeStart: convertToDatetimeLocal(internshipProgram.timeStart),
  });

  const handleChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      endPublishedTime: convertToISO(formData.endPublishedTime),
      endReviewingTime: convertToISO(formData.endReviewingTime),
      timeStart: convertToISO(formData.timeStart),
    };

    const data = await editInternshipProgram(submitData);
    if (data) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>Sửa kỳ thực tập</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Tên kỳ thực tập</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Nhập tên kỳ thực tập..."
              required
            />
          </div>

          <div className="form-group">
            <label>Hạn nộp hồ sơ</label>
            <input
              type="datetime-local"
              value={formData.endPublishedTime}
              onChange={(e) => handleChange("endPublishedTime", e.target.value)}
              required
              disabled={
                new Date(
                  convertToDatetimeLocal(internshipProgram.endPublishedTime)
                ) < new Date()
              }
            />
          </div>

          <div className="form-group">
            <label>Hạn duyệt hồ sơ</label>
            <input
              type="datetime-local"
              value={formData.endReviewingTime}
              onChange={(e) => handleChange("endReviewingTime", e.target.value)}
              required
              disabled={
                new Date(
                  convertToDatetimeLocal(internshipProgram.endReviewingTime)
                ) < new Date()
              }
            />
          </div>

          <div className="form-group">
            <label>Thời gian bắt đầu</label>
            <input
              type="datetime-local"
              value={formData.timeStart}
              onChange={(e) => handleChange("timeStart", e.target.value)}
              required
              disabled={
                new Date(convertToDatetimeLocal(internshipProgram.timeStart)) <
                new Date()
              }
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn btn-save">
              Lưu
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
              }}
              className="btn btn-cancel"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditInternshipProgramModal;
