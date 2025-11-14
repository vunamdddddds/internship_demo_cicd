// pages/diligenceHr/components/DiligenceFilters.jsx
import Select from "react-select";

const months = [
  { value: "10", label: "Tháng 10/2025" },
  { value: "9", label: "Tháng 9/2025" },
  { value: "8", label: "Tháng 8/2025" },
];

// Tạo 10 nhóm
const groups = [
  { value: "ALL", label: "Tất cả" },
  ...Array.from({ length: 10 }, (_, i) => ({
    value: `nhom${i + 1}`,
    label: `Nhóm ${i + 1}`,
  })),
];

const DiligenceFilters = ({ filters, onChange }) => {
  return (
    <div className="filter-container">
      <div className="filter-grid">
        <div className="filter-item">
          <label className="filter-label">Tháng</label>
          <Select
            options={months}
            value={months.find(m => m.value === filters.month)}
            onChange={opt => onChange("month", opt.value)}
            className="custom-select"
          />
        </div>
        <div className="filter-item">
          <label className="filter-label">Nhóm thực tập</label>
          <Select
            options={groups}
            value={groups.find(g => g.value === filters.group)}
            onChange={opt => onChange("group", opt.value)}
            className="custom-select"
          />
        </div>
      </div>
    </div>
  );
};

export default DiligenceFilters;