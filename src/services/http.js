/**
 * =============================================================
 * FILE: frontend/src/services/http.js
 * MÔ TẢ: Cấu hình Axios instance để gọi API backend
 * 
 * AXIOS LÀ GÌ?
 * - Thư viện HTTP client cho trình duyệt
 * - Tương tự fetch() nhưng tiện hơn: tự parse JSON, timeout, interceptor, ...
 * 
 * INTERCEPTOR LÀ GÌ?
 * - Là hàm chạy TỰ ĐỘNG trước mỗi request hoặc sau mỗi response
 * - Dùng để: gắn token, xử lý lỗi chung, logging, ...
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tạo axios instance với baseURL + headers mặc định
 * 2. Gắn request interceptor → tự động thêm Authorization header
 * 3. Export instance → các service khác import và dùng
 * =============================================================
 */

import axios from 'axios';

/**
 * Tạo axios instance với cấu hình mặc định
 * 
 * baseURL: URL gốc của backend API
 * - Mọi request sẽ tự động thêm prefix này
 * - Ví dụ: http.get('/api/auth/login') → http://localhost:3000/api/auth/login
 * 
 * headers: headers mặc định cho mọi request
 * - Content-Type: application/json → backend biết parse body dạng JSON
 */
const http = axios.create({
  baseURL: 'http://localhost:3000', // URL backend API
  headers: {
    'Content-Type': 'application/json' // Mặc định gửi JSON
  }
});

/**
 * Request Interceptor: chạy TRƯỚC mỗi request
 * 
 * Mục đích: tự động gắn JWT token vào header Authorization
 * 
 * LUỒNG:
 * 1. Lấy token từ localStorage (nơi lưu sau khi login)
 * 2. Nếu có token → gắn vào header: Authorization: Bearer <token>
 * 3. Trả config → axios gửi request
 * 
 * Ví dụ:
 * - Trước interceptor: request không có header Authorization
 * - Sau interceptor: request có header "Authorization: Bearer eyJhbGci..."
 * 
 * Tại sao dùng interceptor?
 * - Không cần manually thêm token vào mỗi request
 * - Tự động hóa → ít lỗi quên
 * - Tập trung 1 chỗ → dễ maintain
 */
http.interceptors.request.use((config) => {
  // Lấy access token đã lưu trong localStorage sau khi login
  const token = localStorage.getItem('accessToken');

  // Nếu có token → gắn vào header Authorization
  // Format chuẩn: "Bearer <token>" (OAuth 2.0)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Trả config → axios tiếp tục gửi request
  return config;
});

// Export instance để các service khác import và sử dụng
export default http;
