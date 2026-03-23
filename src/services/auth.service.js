// Kế thừa hệ thống gọi API axios đã cấu hình sẵn trong src/services/http.js (nếu có)
import http from './http'

// Tập hợp các hàm gọi Backend API riêng biệt cho đối tượng Authentication (Đăng nhập, bảo mật)
export const authService = {
  // Gửi POST request tới server để đăng ký tài khoản với tham số (payload)
  register(payload) {
    return http.post('/api/auth/register', payload)
  },

  // Đăng nhập
  login(payload) {
    return http.post('/api/auth/login', payload)
  },

  // Đăng xuất (Có thể cần token trong Header phía http auth)
  logout() {
    return http.post('/api/auth/logout')
  },

  // Yêu cầu nhận mã khôi phục vô mail
  forgotPasswordRequest(payload) {
    return http.post('/api/auth/forgot-password/request', payload)
  },

  // Đặt lại pass từ mã khôi phục đó
  forgotPasswordReset(payload) {
    return http.post('/api/auth/forgot-password/reset', payload)
  },

  // Tự đổi pass
  changePassword(payload) {
    return http.post('/api/auth/change-password', payload)
  },

  // Lấy dữ liệu token -> tài khoản profile (Thường dùng làm bước sync ở đầu file Vue/App)
  getMe() {
    return http.get('/api/auth/me')
  },

  // Chỉnh sửa profile Update -> phương thức PUT
  updateProfile(payload) {
    return http.put('/api/auth/profile', payload)
  }
}