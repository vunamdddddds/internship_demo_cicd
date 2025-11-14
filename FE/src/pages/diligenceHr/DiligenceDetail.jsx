import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { getDiligenceDetail, getDiligenceLeaveHistory } from "~/services/DiligenceHrService"; // SỬA
import { ArrowLeft } from "lucide-react";

const DiligenceDetail = () => {
  const { internId } = useParams();
  const [searchParams] = useSearchParams();
  const month = searchParams.get("month") || "10";
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [d, h] = await Promise.all([
          getDiligenceDetail(internId, month),
          getDiligenceLeaveHistory(internId), // SỬA
        ]);
        setDetail(d);
        setHistory(h);
      } catch (err) {
        // toast đã xử lý trong service
      }
    };
    load();
  }, [internId, month]);

  if (!detail) return <div>Đang tải...</div>;

  return (
    <div className="p-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4 text-blue-600">
        <ArrowLeft size={20} /> Quay lại
      </button>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-2">Chi tiết chuyên cần - Tháng {month}</h2>
        <p className="text-gray-600 mb-6">Tổng giờ làm: {detail.totalHours} giờ</p>

        <h3 className="font-semibold mb-3">Lịch sử check-in/out</h3>
        <div className="table-container mb-8">
          <table className="intern-table">
            <thead>
              <tr><th>Ngày</th><th>Check-in</th><th>Check-out</th><th>Loại</th><th>Ghi chú</th></tr>
            </thead>
            <tbody>
              {detail.records.map((r, i) => (
                <tr key={i}>
                  <td>{r.date}</td>
                  <td>{r.in}</td>
                  <td>{r.out}</td>
                  <td>
                    <span className={`status-badge ${r.type === 'work' ? 'done' : r.type === 'leave' ? 'in-review' : 'in-progress'}`}>
                      {r.type === 'work' ? 'Làm việc' : r.type === 'leave' ? 'Nghỉ phép' : 'Đi muộn'}
                    </span>
                  </td>
                  <td>{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="font-semibold mb-3">Lịch sử duyệt nghỉ phép</h3>
        <div className="table-container">
          <table className="intern-table">
            <thead>
              <tr><th>Ngày</th><th>Loại</th><th>Lý do</th><th>Trạng thái</th><th>Người duyệt</th></tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i}>
                  <td>{h.date}</td>
                  <td>{h.type}</td>
                  <td>{h.reason}</td>
                  <td>
                    <span className={`status-badge ${h.status === 'APPROVED' ? 'approved' : 'rejected'}`}>
                      {h.status === 'APPROVED' ? 'Duyệt' : 'Từ chối'}
                    </span>
                  </td>
                  <td>{h.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiligenceDetail;