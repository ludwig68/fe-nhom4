// Import hệ thống quản lý trạng thái state trung tâm (nghĩa là thay vì mỗi Component quản lý 1 state độc lập, thì Pinia làm kho chứa chung)
import { defineStore } from 'pinia'
// Import lớp giao tiếp API phía dưới để phục vụ cho các logic đăng nhập, đăng ký
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  // state: Các biến dữ liệu chung sẽ nằm ở đây
  state: () => ({
    user: null, // Lưu cục dữ liệu hồ sơ cá nhân
    accessToken: localStorage.getItem('accessToken') || '', // Token xác thực, nếu reload web sẽ tự lấy từ Disk
    loading: false // Biến điều tiết khi app đang đợi API phản hồi (hiển thị UI loading)
  }),

  // getters: Trả về trạng thái phái sinh mới từ State
  getters: {
    // Nếu token có phần chữ thì hàm này trả về true => Ứng dụng hiểu đã đăng nhập
    isAuthenticated: (state) => !!state.accessToken
  },

  // actions: Những phương thức gọi API thay đổi State
  actions: {
    async register(payload) {
      this.loading = true
      try {
        const res = await authService.register(payload)
        return res.data
      } finally {
        this.loading = false
      }
    },

    async login(payload) {
      this.loading = true
      try {
        // Gửi thông tin (username, pass) cho API login
        const res = await authService.login(payload)
        const token = res.data?.data?.accessToken || ''
        const user = res.data?.data?.user || null

        // Lưu thông tin từ API Backend vào biến hệ thống của bộ nhớ ứng dụng
        this.accessToken = token
        this.user = user
        // Đòng thời nhét vào localStorage ổ cứng để không bị out khi người dùng f5 reload
        localStorage.setItem('accessToken', token)

        return res.data
      } finally {
        this.loading = false
      }
    },

    // Hành động: Cập nhật biến user từ Backend sau reload (Lấy thông tin /me)
    async fetchMe() {
      if (!this.accessToken) return null
      this.loading = true
      try {
        const res = await authService.getMe()
        this.user = res.data?.data || null
        return res.data
      } catch (error) {
        // Token sai / Lỗi Backend -> Đăng xuất người dùng ngay
        this.clearAuth()
        throw error
      } finally {
        this.loading = false
      }
    },

    // Hành động gọi API update hồ sơ
    async updateProfile(payload) {
      this.loading = true
      try {
        const res = await authService.updateProfile(payload)
        this.user = res.data?.data || this.user
        return res.data
      } catch (error) {
        throw error
      } finally {
        this.loading = false
      }
    },

    // Đăng xuất
    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        // Vẫn clear token ở client kể cả khi phía API bị sự cố
      } finally {
        this.clearAuth()
      }
    },

    // Hàm tiện ích: dọn dẹp biến dữ liệu trong phiên hoạt động
    clearAuth() {
      this.user = null
      this.accessToken = ''
      localStorage.removeItem('accessToken')
    }
  }
})