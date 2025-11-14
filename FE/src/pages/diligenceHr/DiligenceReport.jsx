import { useState, useEffect } from "react";
import { getDiligenceReport, exportDiligenceReport } from "~/services/DiligenceHrService";
import DiligenceFilters from "./DiligenceFilters";
import DiligenceCharts from "./DiligenceCharts";
import InternTable from "./InternTable";

const DiligenceHr = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ month: "11", group: "ALL" }); // Đổi department → group

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await getDiligenceReport(filters);
	  //console.log(result)
      setData(result);
    } catch (err) {
      // toast đã xử lý trong service
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  const handleExport = async (format) => {
    await exportDiligenceReport(format);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Quản lý chuyên cần</h1>
        </div>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <button onClick={() => handleExport("pdf")} className="btn btn-search">
            Xuất PDF
          </button>
          <button onClick={() => handleExport("excel")} className="btn btn-add">
            Xuất Excel
          </button>
        </div>
      </div>

      <DiligenceFilters filters={filters} onChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))} />

      {loading ? (
        <div className="text-center py-10">Đang tải...</div>
      ) : (
        <>
		
          <DiligenceCharts data={data} />
          <InternTable data={data} month={filters.month} />
        </>
      )}
    </div>
  );
};

export default DiligenceHr;