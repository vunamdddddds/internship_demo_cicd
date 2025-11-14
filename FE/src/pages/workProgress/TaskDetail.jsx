// src/pages/workProgress/TaskDetail.jsx
import React, { useState } from "react";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import Select from "react-select";
import {
  addSubtask,
  updateSubtask,
  deleteSubtask,
  updateTaskStatus,
} from "~/services/TaskService";

const priorityOptions = [
  { value: "Cao", label: "Cao" },
  { value: "Trung bình", label: "Trung bình" },
  { value: "Thấp", label: "Thấp" },
];

const statusOptions = [
  { value: "To do", label: "To do" },
  { value: "In progress", label: "In progress" },
  { value: "In review", label: "In review" },
  { value: "Done", label: "Done" },
];

const TaskDetail = ({ task, onBack, onTaskUpdate }) => {
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [newAssignee, setNewAssignee] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);

  const clearForm = () => {
    setNewSubtaskName("");
    setNewAssignee("");
  };

  // === THÊM SUBTASK ===
  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskName.trim()) return toast.error("Nhập tên task con!");

    setLoading(true);
    try {
      const newSub = {
        name: newSubtaskName,
        priority: "Trung bình",
        hours: 0,
        status: "To do",
        assignee: newAssignee.trim() || "Bạn",
      };
      const added = await addSubtask(task.id, newSub);
      onTaskUpdate(task.id, { type: "addSubtask", subtask: added });
      clearForm();
      toast.success("Thêm thành công!");
    } catch {
      toast.error("Thêm thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // === CẬP NHẬT / XÓA SUBTASK ===
  const updateSub = (subId, field, value) =>
    updateSubtask(task.id, subId, { [field]: value })
      .then(() => onTaskUpdate(task.id, { type: "updateSubtask", subId, field, value }))
      .catch(() => toast.error("Cập nhật thất bại!"));

  const deleteSub = (subId) =>
    deleteSubtask(task.id, subId)
      .then(() => {
        onTaskUpdate(task.id, { type: "deleteSubtask", subId });
        toast.success("Xóa thành công!");
      })
      .catch(() => toast.error("Xóa thất bại!"));

  // === CẬP NHẬT TRẠNG THÁI TASK CHÍNH ===
  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateTaskStatus(task.id, newStatus);
      onTaskUpdate(task.id, { type: "updateStatus", status: updated.status });
      toast.success("Cập nhật trạng thái!");
    } catch {
      toast.error("Cập nhật thất bại!");
    } finally {
      setEditingStatus(false);
    }
  };

  const statusKey = task.status.toLowerCase().replace(/ /g, "-");

  return (
    <div className="main-content">
      {/* NÚT QUAY LẠI */}
      <button className="back-btn" onClick={onBack}>
        <ChevronLeft size={18} /> Quay lại
      </button>

      <h1 className="page-title">{task.title}</h1>

      {/* THÔNG TIN CƠ BẢN */}
      <div className="filter-container" style={{ padding: "16px" }}>
        <div className="filter-grid">
          <div className="filter-item">
            <div className="label">Người giao</div>
            <div className="value">{task.assignedBy}</div>
          </div>
          <div className="filter-item">
            <div className="label">Ngày giao</div>
            <div className="value">{task.assignedDate}</div>
          </div>
          <div className="filter-item">
            <div className="label">Hạn hoàn thành</div>
            <div className="value">{task.deadline}</div>
          </div>
        </div>
      </div>

      {/* TRẠNG THÁI TASK CHÍNH - DÙNG STATUS BADGE */}
      <div className="filter-container" style={{ marginTop: "16px" }}>
        <div className="filter-grid">
          <div className="filter-item">
            <div className="label">Trạng thái</div>
            {editingStatus ? (
              <Select
                options={statusOptions}
                value={statusOptions.find((o) => o.value === task.status)}
                onChange={(opt) => handleStatusChange(opt.value)}
                className="custom-select"
                menuPortalTarget={document.body}
                autoFocus
                onBlur={() => setEditingStatus(false)}
              />
            ) : (
              <span
                className={`status-badge ${statusKey}`}
                onClick={() => setEditingStatus(true)}
                style={{ cursor: "pointer", display: "inline-block" }}
              >
                {task.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* DANH SÁCH SUBTASK */}
      <div className="filter-container" style={{ marginTop: "16px" }}>
        <h1 style={{ margin: "0 0 16px 0" }}>Danh sách task con</h1>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <form onSubmit={handleAddSubtask} style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              className="search-input"
              placeholder="Tên task con..."
              value={newSubtaskName}
              onChange={(e) => setNewSubtaskName(e.target.value)}
              disabled={loading}
              required
            />
            <input
              type="text"
              className="search-input"
              placeholder="Người nhận..."
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              disabled={loading}
              style={{ width: "160px" }}
            />
            <button type="submit" className="btn btn-add" disabled={loading}>
              <Plus size={16} /> {loading ? "Đang thêm..." : "Thêm"}
            </button>
          </form>
        </div>

        <div className="table-container">
          <table className="intern-table">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Tên task</th>
                <th style={{ width: "15%" }}>Người nhận</th>
                <th style={{ width: "15%" }}>Trạng thái</th>
                <th style={{ width: "15%" }}>Ưu tiên</th>
                <th style={{ width: "5%" }}>Số giờ</th>
                <th style={{ width: "10%" }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {task.subtasks.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">Chưa có task con</td>
                </tr>
              ) : (
                task.subtasks.map((sub) => (
                  <tr key={sub.id}>
                    <td>{sub.name}</td>
                    <td>
                      <input
                        type="text"
                        className="search-input"
                        value={sub.assignee || ""}
                        onChange={(e) => updateSub(sub.id, "assignee", e.target.value)}
                        placeholder="Bạn"
                        style={{ width: "100%", textAlign: "center" }}
                      />
                    </td>
                    <td>
                      <Select
                        options={statusOptions}
                        value={statusOptions.find((s) => s.value === sub.status)}
                        onChange={(opt) => updateSub(sub.id, "status", opt.value)}
                        className="custom-select"
                        menuPortalTarget={document.body}
                      />
                    </td>
                    <td>
                      <Select
                        options={priorityOptions}
                        value={priorityOptions.find((p) => p.value === sub.priority)}
                        onChange={(opt) => updateSub(sub.id, "priority", opt.value)}
                        className="custom-select"
                        menuPortalTarget={document.body}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={sub.hours}
                        onChange={(e) => updateSub(sub.id, "hours", parseFloat(e.target.value) || 0)}
                        style={{ width: "60px", textAlign: "center" }}
                      />
                    </td>
                    <td className="text-center">
                      <button className="icon-btn" onClick={() => deleteSub(sub.id)}>
                        <Trash2 size={16} style={{ color: "#dc2626" }} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {task.subtasks.length > 0 && (
          <div style={{ textAlign: "right", marginTop: "12px", fontWeight: "600" }}>
            Tổng số giờ: {task.subtasks.reduce((sum, s) => sum + s.hours, 0)} giờ
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;