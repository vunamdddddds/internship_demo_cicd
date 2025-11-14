// pages/DiligenceHr/components/ExportButtons.jsx
import { Download } from "lucide-react";

const ExportButtons = ({ onExport }) => {
  return (
    <div className="flex gap-3">
      <button onClick={() => onExport("pdf")} className="btn btn-search">
        <Download size={16} /> Xuất PDF
      </button>
      <button onClick={() => onExport("excel")} className="btn btn-add">
        <Download size={16} /> Xuất Excel
      </button>
    </div>
  );
};

export default ExportButtons;