/**
 * =============================================================
 * FILE: frontend/src/services/branch.service.js
 * MÔ TẢ: Service gọi API backend cho module Chi nhánh
 * =============================================================
 */

import http from './http';

export const branchService = {
  /**
   * GET /api/branches
   * Lấy danh sách tất cả chi nhánh đang hoạt động
   */
  getAllBranches() {
    return http.get('/api/branches');
  },

  /**
   * GET /api/branches/:id
   * Lấy chi tiết 1 chi nhánh theo ID
   * @param {string|number} id - ID chi nhánh
   */
  getBranchById(id) {
    return http.get(`/api/branches/${id}`);
  }
};
