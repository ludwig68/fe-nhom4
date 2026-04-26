/**
 * =============================================================
 * FILE: frontend/src/services/auth.service.js
 * MÔ TẢ: Service gọi API backend cho module Xác thực
 * 
 * SERVICE LÀ GÌ?
 * - Lớp giữa component Vue và HTTP client (axios)
 * - Đóng gói các lời gọi API thành hàm có tên dễ hiểu
 * - Không chứa logic UI (đó là việc của component/store)
 * 
 * MỐI QUAN HỆ:
 * Component → Pinia Store → Service → Axios (http.js) → Backend API
 * =============================================================
 */

import http from './http';

/**
 * Tập hợp các hàm gọi API Auth
 * 
 * Mỗi hàm tương ứng 1 endpoint backend
 * Trả về Axios Promise → caller có thể await hoặc .then()
 */
export const authService = {
  /**
   * POST /api/auth/register
   * Đăng ký tài khoản mới
   * @param {object} payload - { username, password, fullName, email, phone?, address? }
   */
  register(payload) {
    return http.post('/api/auth/register', payload);
  },

  /**
   * POST /api/auth/login
   * Đăng nhập, nhận token + thông tin user
   * @param {object} payload - { username, password }
   */
  login(payload) {
    return http.post('/api/auth/login', payload);
  },

  /**
   * POST /api/auth/logout
   * Đăng xuất
   */
  logout() {
    return http.post('/api/auth/logout');
  },

  /**
   * POST /api/auth/forgot-password/request
   * Yêu cầu gửi OTP quên mật khẩu
   * @param {object} payload - { email }
   */
  forgotPasswordRequest(payload) {
    return http.post('/api/auth/forgot-password/request', payload);
  },

  /**
   * POST /api/auth/forgot-password/reset
   * Đặt lại mật khẩu bằng OTP
   * @param {object} payload - { email, code, newPassword }
   */
  forgotPasswordReset(payload) {
    return http.post('/api/auth/forgot-password/reset', payload);
  },

  /**
   * POST /api/auth/change-password
   * Đổi mật khẩu (cần đăng nhập)
   * @param {object} payload - { oldPassword, newPassword }
   */
  changePassword(payload) {
    return http.post('/api/auth/change-password', payload);
  },

  /**
   * GET /api/auth/me
   * Lấy thông tin user hiện tại (cần đăng nhập)
   * Token tự động gắn bởi http.js interceptor
   */
  getMe() {
    return http.get('/api/auth/me');
  },

  /**
   * PUT /api/auth/profile
   * Cập nhật thông tin cá nhân (cần đăng nhập)
   * @param {object} payload - { full_name?, email?, phone?, address? }
   */
  updateProfile(payload) {
    return http.put('/api/auth/profile', payload);
  }
};
