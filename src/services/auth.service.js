import http from './http'

export const authService = {
  register(payload) {
    return http.post('/api/auth/register', payload)
  },

  login(payload) {
    return http.post('/api/auth/login', payload)
  },

  logout() {
    return http.post('/api/auth/logout')
  },

  forgotPasswordRequest(payload) {
    return http.post('/api/auth/forgot-password/request', payload)
  },

  forgotPasswordReset(payload) {
    return http.post('/api/auth/forgot-password/reset', payload)
  },

  changePassword(payload) {
    return http.post('/api/auth/change-password', payload)
  },

  getMe() {
    return http.get('/api/auth/me')
  }
}