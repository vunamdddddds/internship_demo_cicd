// src/pages/workProgress/TaskTable.jsx
import React, { useState } from "react";

const statusOptions = ["To do", "In progress", "In review", "Done"];

const TaskTable = ({ tasks, loading, onTaskClick, onStatusChange }) => {
  const [editingStatusId, setEditingStatusId] = useState(null);

  if (loading) {
    return (
      <div className="table-container text-center">Đang tải...</div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="table-container text-center">Không có dữ liệu</div>
    );
  }

  const getStatusClass = (status) => {
    return status
      .toLowerCase()
      .replace(/ /g, "-");
  };

  const handleBadgeClick = (taskId) => {
    setEditingStatusId(taskId);
  };

  const handleStatusChange = (taskId, newStatus) => {
    onStatusChange(taskId, newStatus);
    setEditingStatusId(null);
  };

  return (
    <div className="table-container">
      <div className="table-wrapper">
        <table className="intern-table">
          <thead>
            <tr>
              <th>Tiêu đề nhiệm vụ</th>
              <th>Ngày giao</th>
              <th>Hạn hoàn thành</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const statusKey = getStatusClass(task.status);
              const isEditing = editingStatusId === task.id;

              return (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.assignedDate}</td>
                  <td>{task.deadline}</td>
                  <td>
                    {isEditing ? (
                      <select
                        className="status-select-inline"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        onBlur={() => setEditingStatusId(null)}
                        autoFocus
                        style={{
                          padding: "4px 8px",
                          fontSize: "12px",
                          borderRadius: "9999px",
                          border: "1px solid #d1d5db",
                          outline: "none",
                          minWidth: "100px",
                        }}
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span
                        className={`status-badge ${statusKey}`}
                        onClick={() => handleBadgeClick(task.id)}
                        style={{ cursor: "pointer" }}
                      >
                        {task.status}
                      </span>
                    )}
                  </td>
                  <td style={{ display: "flex", justifyContent: "center", alignItems: "center",}}>
                    <button
                      className="btn btn-search"
                      style={{ padding: "6px 12px", fontSize: "13px" }}
                      onClick={() => onTaskClick(task)}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;