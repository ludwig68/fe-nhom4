/**
 * =============================================================
 * FILE: frontend/src/services/booking.service.js
 * MÔ TẢ: Service gọi API backend cho module Đặt phòng
 * =============================================================
 */

import http from './http';

export const bookingService = {
  /**
   * GET /api/bookings/available-rooms
   * Tìm phòng trống theo ngày + bộ lọc
   */
  getAvailableRooms(params = {}) {
    return http.get('/api/bookings/available-rooms', { params });
  },

  /**
   * GET /api/bookings/services
   * Lấy danh sách dịch vụ kèm theo
   */
  getServiceCatalog() {
    return http.get('/api/bookings/services');
  },

  /**
   * POST /api/bookings/quote
   * Tính tổng tiền đặt phòng
   */
  getQuote(payload) {
    return http.post('/api/bookings/quote', payload);
  },

  /**
   * POST /api/bookings
   * Tạo đơn đặt phòng (cần đăng nhập)
   */
  createBooking(payload) {
    return http.post('/api/bookings', payload);
  },

  // =============================================================
  // API MỚI: Lịch sử, Chi tiết, Xác nhận, Hủy
  // =============================================================

  /**
   * GET /api/bookings/my-bookings
   * Lấy lịch sử đặt phòng của user hiện tại
   * @param {object} params - { status? } - lọc theo trạng thái
   */
  getMyBookings(params = {}) {
    return http.get('/api/bookings/my-bookings', { params });
  },

  /**
   * GET /api/bookings/:id
   * Lấy chi tiết 1 booking
   * @param {string|number} id - bookingId hoặc bookingCode
   */
  getBookingDetail(id) {
    return http.get(`/api/bookings/${id}`);
  },

  /**
   * POST /api/bookings/:id/confirm
   * Xác nhận đơn đặt phòng (chỉ staff/admin)
   * @param {number} bookingId - ID booking cần xác nhận
   */
  confirmBooking(bookingId) {
    return http.post(`/api/bookings/${bookingId}/confirm`);
  },

  /**
   * POST /api/bookings/:id/cancel
   * Hủy đơn đặt phòng
   * @param {number} bookingId - ID booking cần hủy
   */
  cancelBooking(bookingId) {
    return http.post(`/api/bookings/${bookingId}/cancel`);
  },

  /**
   * POST /api/bookings/:id/check-in
   * Check-in đơn đặt phòng (staff/admin)
   * @param {number} bookingId - ID booking
   */
  checkInBooking(bookingId) {
    return http.post(`/api/bookings/${bookingId}/check-in`);
  },

  /**
   * POST /api/bookings/:id/check-out
   * Check-out đơn đặt phòng (staff/admin)
   * @param {number} bookingId - ID booking
   */
  checkOutBooking(bookingId) {
    return http.post(`/api/bookings/${bookingId}/check-out`);
  }
};
