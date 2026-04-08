/**
 * =============================================================
 * FILE: frontend/src/services/feedback.service.js
 * MÔ TẢ: Service gọi API backend cho module Đánh giá
 * =============================================================
 */

import http from './http';

export const feedbackService = {
  /**
   * POST /api/feedbacks
   * Gửi đánh giá
   * @param {object} payload - { bookingId, rating (1-5), comment? }
   */
  createFeedback(payload) {
    return http.post('/api/feedbacks', payload);
  },

  /**
   * GET /api/feedbacks/my-feedbacks
   * Lấy danh sách đánh giá của user hiện tại
   */
  getMyFeedbacks() {
    return http.get('/api/feedbacks/my-feedbacks');
  },

  /**
   * GET /api/feedbacks/eligible
   * Lấy danh sách booking chưa được đánh giá (gợi ý)
   */
  getEligibleBookings() {
    return http.get('/api/feedbacks/eligible');
  },

  /**
   * GET /api/feedbacks/:id
   * Lấy chi tiết 1 đánh giá
   * @param {number} id - feedbackId
   */
  getFeedbackDetail(id) {
    return http.get(`/api/feedbacks/${id}`);
  },

  /**
   * PUT /api/feedbacks/:id
   * Sửa đánh giá
   * @param {number} id - feedbackId
   * @param {object} payload - { comment }
   */
  updateFeedback(id, payload) {
    return http.put(`/api/feedbacks/${id}`, payload);
  },

  /**
   * DELETE /api/feedbacks/:id
   * Xóa đánh giá
   * @param {number} id - feedbackId
   */
  deleteFeedback(id) {
    return http.delete(`/api/feedbacks/${id}`);
  }
};
