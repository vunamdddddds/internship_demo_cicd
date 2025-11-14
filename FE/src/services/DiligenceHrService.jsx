import { toast } from "react-toastify";
// The import is changed to a default import to get the new API object
import leaveRequestApi from "../api/diligenceApi";
import attendanceApi from "../api/AttendanceApi";

// This function now maps to the new getAllLeaveRequests API
export const getDiligenceReport = async (filters) => {
  try {
    // The new API expects params like `keyword`, `type`, `page`, `size`
    const data = await attendanceApi.getAttendance(filters);
    return data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Lấy báo cáo thất bại";
    toast.error(errorMessage);
    throw err;
  }
};

// This function now maps to getLeaveRequestById
export const getDiligenceDetail = async (id) => {
  try {
    const data = await leaveRequestApi.getLeaveRequestById(id);
    return data;
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Lấy chi tiết thất bại";
    toast.error(errorMessage);
    throw err;
  }
};

// This function, which caused the error, is now mapped to getAllLeaveRequests filtered by intern name
export const getDiligenceLeaveHistory = async (internName) => {
  try {
    const params = { keyword: internName };
    const data = await leaveRequestApi.getAllLeaveRequests(params);
    return data.data; // The response is paginated, return the content
  } catch (err) {
    const errorMessage = err.response?.data?.message || "Lấy lịch sử nghỉ phép thất bại";
    toast.error(errorMessage);
    throw err;
  }
};

// This function has no backend equivalent and is now disabled.
export const exportDiligenceReport = async (format) => {
  toast.warn("Chức năng xuất báo cáo chưa được hỗ trợ.");
  // try {
  //   const result = await exportFile(format);
  //   toast.success(`Đã xuất báo cáo dưới dạng ${format.toUpperCase()}!`);
  //   return result;
  // } catch (err) {
  //   toast.error("Xuất báo cáo thất bại");
  //   throw err;
  // }
  return Promise.resolve();
};