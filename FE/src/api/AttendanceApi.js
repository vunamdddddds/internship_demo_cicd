import AxiosClient from "./AxiosClient";

const AttendanceApi = {
	  getAttendance: () => {
    return AxiosClient.get("/attendances", { withAuth: true });
  },  
  getMyCalendar: () => {
    return AxiosClient.get("/attendances/me", { withAuth: true });
  },


  getTeamCalendar: (teamId) => {
    return AxiosClient.get(`/attendances/${teamId}`, { withAuth: true });
  },

  checkIn: () => {
    return AxiosClient.post("/attendances/check-in", null, { withAuth: true });
  },

  checkOut: () => {
    return AxiosClient.put("/attendances/check-out", null, { withAuth: true });
  },
};

export default AttendanceApi;
