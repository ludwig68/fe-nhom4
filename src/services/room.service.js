/**
 * =============================================================
 * FILE: frontend/src/services/room.service.js
 * MÔ TẢ: Service gọi API backend cho module Phòng
 * =============================================================
 */

import http from './http';

export const roomService = {
  /**
   * GET /api/rooms
   * Lấy danh sách phòng (có lọc theo query params)
   * @param {object} params - { branchId, typeId, capacity, minPrice, maxPrice, ... }
   */
  getAllRooms(params = {}) {
    return http.get('/api/rooms', { params });
  },

  /**
   * GET /api/rooms
   * Tìm kiếm phòng (alias của getAllRooms)
   * @param {object} params - { checkIn, checkOut, branchId, typeId, ... }
   */
  searchRooms(params = {}) {
    return http.get('/api/rooms', { params });
  },

  /**
   * GET /api/rooms/meta
   * Lấy metadata cho bộ lọc (branches, roomTypes, amenities, statuses)
   */
  getRoomSearchMeta() {
    return http.get('/api/rooms/meta');
  },

  /**
   * GET /api/rooms?branchId=X
   * Lấy phòng theo chi nhánh
   * @param {string|number} branchId - ID chi nhánh
   */
  getRoomsByBranchId(branchId) {
    return http.get('/api/rooms', {
      params: { branchId }
    });
  },

  /**
   * GET /api/rooms/:id
   * Lấy chi tiết 1 phòng
   * @param {string|number} id - ID phòng
   */
  getRoomById(id) {
    return http.get(`/api/rooms/${id}`);
  },

  /**
   * GET /api/rooms/:id
   * Alias của getRoomById
   */
  getRoomDetail(id) {
    return http.get(`/api/rooms/${id}`);
  },

  /**
   * POST /api/rooms
   * Tạo phòng mới (cần đăng nhập)
   */
  createRoom(payload) {
    return http.post('/api/rooms', payload);
  },

  /**
   * PUT /api/rooms/:id
   * Cập nhật phòng (cần đăng nhập)
   */
  updateRoom(id, payload) {
    return http.put(`/api/rooms/${id}`, payload);
  },

  /**
   * DELETE /api/rooms/:id
   * Xóa phòng (cần đăng nhập)
   */
  deleteRoom(id) {
    return http.delete(`/api/rooms/${id}`);
  }
};
