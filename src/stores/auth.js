/**
 * =============================================================
 * FILE: frontend/src/stores/auth.js
 * MÔ TẢ: Pinia store quản lý trạng thái xác thực (Auth State)
 * 
 * PINIA LÀ GÌ?
 * - Thư viện quản lý state (trạng thái) toàn cục cho Vue 3
 * - Tương tự Vuex nhưng đơn giản hơn, dùng Composition API
 * - State = dữ liệu chung, getters = computed, actions = methods
 * 
 * TẠI SAO DÙNG STORE THAY VÌ COMPONENT STATE?
 * - Thông tin user + token cần dùng ở NHIỀU component
 *   (header, profile, booking, ...)
 * - Nếu mỗi component tự quản lý → khó đồng bộ
 * - Store = nguồn dữ liệu duy nhất (single source of truth)
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. User login → gọi action login() → lưu token + user vào store
 * 2. Token lưu cả vào localStorage → reload không mất
 * 3. Component đọc state.isAuthenticated → biết đã login chưa
 * 4. User logout → action logout() → xóa token + user
 * =============================================================
 */

import { defineStore } from 'pinia';
import { authService } from '@/services/auth.service';

/**
 * defineStore: tạo 1 store module
 * 
 * Tham số:
 * - 'auth': tên store (duy nhất, dùng để debug)
 * - object: chứa state, getters, actions
 */
export const useAuthStore = defineStore('auth', {

  // =============================================================
  // STATE: Dữ liệu (tương tự data() trong Vue component)
  // =============================================================
  state: () => ({
    /**
     * user: Thông tin user hiện tại
     * Format: { user_id, username, full_name, email, phone, address, role_id, role_name }
     * null = chưa login hoặc chưa load
     */
    user: null,

    /**
     * accessToken: JWT token
     * Lấy từ localStorage khi khởi động → reload không mất token
     * '' = chưa login
     */
    accessToken: localStorage.getItem('accessToken') || '',

    /**
     * loading: Cờ báo đang xử lý API
     * Dùng để hiển thị spinner/loading UI
     */
    loading: false
  }),

  // =============================================================
  // GETTERS: Giá trị tính toán từ state (tương tự computed)
  // =============================================================
  getters: {
    /**
     * Kiểm tra user đã đăng nhập chưa
     * 
     * !!accessToken: ép accessToken thành boolean
     * - accessToken = '' → false
     * - accessToken = 'eyJ...' → true
     * 
     * Dùng trong template:
     *   v-if="authStore.isAuthenticated" → hiện nút logout
     *   v-else → hiện nút login
     */
    isAuthenticated: (state) => !!state.accessToken
  },

  // =============================================================
  // ACTIONS: Phương thức thay đổi state (tương tự methods)
  // Có thể async (gọi API)
  // =============================================================
  actions: {
    /**
     * ĐĂNG KÝ TÀI KHOẢN
     * 
     * @param {object} payload - { username, password, fullName, email, phone?, address? }
     * @returns {object} Dữ liệu từ API
     * 
     * LUỒNG:
     * 1. Set loading = true → UI hiện spinner
     * 2. Gọi API register
     * 3. finally: loading = false → tắt spinner
     * 
     * Sau khi đăng ký thành công:
     * - User phải tự đăng nhập (không auto login)
     * - Store KHÔNG thay đổi (user vẫn null, token vẫn '')
     */
    async register(payload) {
      this.loading = true;
      try {
        const res = await authService.register(payload);
        return res.data;
      } finally {
        // finally: chạy DÙ thành công hay lỗi
        this.loading = false;
      }
    },

    /**
     * ĐĂNG NHẬP
     * 
     * @param {object} payload - { username, password }
     * @returns {object} Dữ liệu từ API
     * 
     * LUỒNG:
     * 1. Gọi API login → nhận { accessToken, user }
     * 2. Lưu token + user vào store
     * 3. Lưu token vào localStorage (để reload không mất)
     * 
     * Sau khi login:
     * - authStore.isAuthenticated = true
     * - Component header chuyển từ "Đăng nhập" → "Hồ sơ" + "Đăng xuất"
     */
    async login(payload) {
      this.loading = true;
      try {
        // Gọi API đăng nhập
        const res = await authService.login(payload);

        // Trích xuất token và user từ response
        // Cấu trúc response: res.data.data = { accessToken, user }
        const token = res.data?.data?.accessToken || '';
        const user = res.data?.data?.user || null;

        // Lưu vào store state
        this.accessToken = token;
        this.user = user;

        // Lưu vào localStorage → reload F5 không mất session
        localStorage.setItem('accessToken', token);

        return res.data;
      } finally {
        this.loading = false;
      }
    },

    /**
     * LẤY THÔNG TIN USER HIỆN TẠI (/me)
     * 
     * Dùng khi:
     * - User reload trang → token còn trong localStorage nhưng user = null
     * - Cần sync lại thông tin user từ server
     * 
     * Nếu token hết hạn → API lỗi → tự động logout
     */
    async fetchMe() {
      // Nếu không có token → không thể gọi /me
      if (!this.accessToken) return null;

      this.loading = true;
      try {
        const res = await authService.getMe();
        this.user = res.data?.data || null;
        return res.data;
      } catch (error) {
        // Token hết hạn hoặc sai → xóa session
        this.clearAuth();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * CẬP NHẬT PROFILE
     * 
     * @param {object} payload - { full_name?, email?, phone?, address? }
     * @returns {object} Dữ liệu từ API
     * 
     * Sau khi update thành công:
     * - Cập nhật user trong store → UI tự refresh
     */
    async updateProfile(payload) {
      this.loading = true;
      try {
        const res = await authService.updateProfile(payload);
        // Cập nhật user trong store
        this.user = res.data?.data || this.user;
        return res.data;
      } catch (error) {
        throw error;
      } finally {
        this.loading = false;
      }
    },

    /**
     * ĐĂNG XUẤT
     * 
     * LUỒNG:
     * 1. Gọi API logout (optional, vì JWT stateless)
     * 2. Dù API lỗi → vẫn xóa token ở client
     * 3. clearAuth() → xóa state + localStorage
     * 
     * Sau khi logout:
     * - authStore.isAuthenticated = false
     * - Router guard → chuyển về trang login hoặc home
     */
    async logout() {
      try {
        await authService.logout();
      } catch (error) {
        // Vẫn clear token ở client kể cả khi API lỗi
        // Vì JWT stateless → server không cần biết logout
      } finally {
        this.clearAuth();
      }
    },

    /**
     * XÓA TOÀN BỘ AUTH DATA
     * 
     * Hàm nội bộ, gọi bởi logout() và fetchMe() (khi lỗi)
     * 
     * Xóa:
     * - user trong store
     * - accessToken trong store
     * - accessToken trong localStorage
     */
    clearAuth() {
      this.user = null;
      this.accessToken = '';
      localStorage.removeItem('accessToken');
    }
  }
});
