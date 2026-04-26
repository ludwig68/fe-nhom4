import axios from "axios";

const api = axios.create({
  // Đã thêm /api vào cuối đường link
  baseURL: "https://be-quan-ly-booking-ks-1.onrender.com/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const handleData = (response) => response.data?.data || response.data;

export const login = (payload) =>
  api.post("/auth/login", payload).then(handleData);
export const register = (payload) =>
  api.post("/auth/register", payload).then(handleData);
export const fetchMe = () => api.get("/auth/me").then(handleData);
export const fetchBranches = () => api.get("/branches").then(handleData);
export const fetchBranch = (id) => api.get(`/branches/${id}`).then(handleData);
export const fetchBranchBookings = (branchId) =>
  api.get(`/staff/branches/${branchId}/bookings`).then(handleData);
export const searchBookings = (branchId, q) =>
  api
    .get(`/staff/branches/${branchId}/bookings/search`, { params: { q } })
    .then(handleData);
export const fetchTodayBookings = (branchId) =>
  api.get(`/staff/branches/${branchId}/bookings/today`).then(handleData);
export const fetchCurrentGuests = (branchId) =>
  api.get(`/staff/branches/${branchId}/guests/current`).then(handleData);
export const fetchRooms = (branchId) =>
  api.get(`/staff/branches/${branchId}/rooms`).then(handleData);
export const fetchStats = (branchId) =>
  api.get(`/staff/branches/${branchId}/rooms/stats`).then(handleData);
export const createBooking = (branchId, payload) =>
  api.post(`/staff/branches/${branchId}/bookings`, payload).then(handleData);
export const updateBooking = (id, payload) =>
  api.put(`/staff/bookings/${id}`, payload).then(handleData);
export const confirmBooking = (id) =>
  api.post(`/staff/bookings/${id}/confirm`).then(handleData);
export const rejectBooking = (id) =>
  api.post(`/staff/bookings/${id}/reject`).then(handleData);
export const checkInBooking = (id) =>
  api.post(`/staff/bookings/${id}/checkin`).then(handleData);
export const checkOutBooking = (id) =>
  api.post(`/staff/bookings/${id}/checkout`).then(handleData);
export const cancelBooking = (id) =>
  api.post(`/staff/bookings/${id}/cancel`).then(handleData);
export const updateRoomStatus = (id, status) =>
  api.patch(`/staff/rooms/${id}/status`, { status }).then(handleData);
export const updateRoomNote = (id, note) =>
  api.patch(`/staff/rooms/${id}/note`, { note }).then(handleData);
export const addBookingService = (id, payload) =>
  api.post(`/staff/bookings/${id}/services`, payload).then(handleData);
export const changeStaffPassword = (payload) =>
  api.post("/staff/change-password", payload).then(handleData);
export const logout = () => api.post("/auth/logout").then(handleData);
