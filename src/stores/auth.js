import { defineStore } from 'pinia'
import { authService } from '@/services/auth.service'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || '',
    loading: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },

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
        const res = await authService.login(payload)
        const token = res.data?.data?.accessToken || ''
        const user = res.data?.data?.user || null

        this.accessToken = token
        this.user = user
        localStorage.setItem('accessToken', token)

        return res.data
      } finally {
        this.loading = false
      }
    },

    async fetchMe() {
      if (!this.accessToken) return null
      this.loading = true
      try {
        const res = await authService.getMe()
        this.user = res.data?.data || null
        return res.data
      } catch (error) {
        this.clearAuth()
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await authService.logout()
      } catch (error) {
        // local vẫn cho logout kể cả API lỗi
      } finally {
        this.clearAuth()
      }
    },

    clearAuth() {
      this.user = null
      this.accessToken = ''
      localStorage.removeItem('accessToken')
    }
  }
})