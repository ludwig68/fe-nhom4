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
   * @param {object} params - { checkIn, checkOut, branchId, typeId, ... }
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
   * @param {object} payload - { roomId, checkIn, checkOut, serviceIds[] }
   */
  getQuote(payload) {
    return http.post('/api/bookings/quote', payload);
  },

  /**
   * POST /api/bookings
   * Tạo đơn đặt phòng (cần đăng nhập)
   * @param {object} payload - { roomId, checkIn, checkOut, serviceIds[], customerName, customerPhone, customerEmail, note }
   */
  createBooking(payload) {
    return http.post('/api/bookings', payload);
  }
};
