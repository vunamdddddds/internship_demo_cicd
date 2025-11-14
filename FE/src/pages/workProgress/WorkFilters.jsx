// src/pages/workProgress/WorkFilters.jsx
import React from "react";
import { Search } from "lucide-react";

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "To do", label: "To do" },
  { value: "In progress", label: "In progress" },
  { value: "In review", label: "In review" },
  { value: "Done", label: "Done" },
];

const WorkFilters = ({ filters, onFilterChange, onSearch }) => {
  return (
    <div className="filter-container">
      <div className="filter-grid">
        <div className="filter-item">
          <label className="filter-label">Tìm kiếm nhiệm vụ</label>
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Nhập tên nhiệm vụ..."
              value={filters.keyWord}
              onChange={(e) => onFilterChange("keyWord", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && onSearch()}
            />
          </div>
        </div>
        <div className="filter-item">
          <label className="filter-label">Trạng thái</label>
          <select
            className="search-input"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <button className="btn btn-primary" onClick={onSearch}>
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkFilters;