<template>
  <div class="mx-auto mt-10 max-w-lg rounded-lg bg-white p-8 shadow-md border border-stone-200">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-stone-800">Quên mật khẩu</h1>
      <RouterLink to="/login" class="text-sm font-medium text-stone-500 hover:text-stone-900">
        Quay lại đăng nhập
      </RouterLink>
    </div>

    <!-- Bước 1 -->
    <div class="mb-8 rounded-md border border-stone-100 bg-stone-50 p-5">
      <h2 class="mb-4 text-lg font-semibold text-stone-800">Bước 1: Nhận mã xác minh</h2>
      <form @submit.prevent="handleRequestCode" class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Email đã đăng ký:</label>
          <input 
            v-model.trim="requestForm.email" 
            type="email" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm bg-white focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
            placeholder="Nhập email của bạn"
          />
        </div>

        <div v-if="requestSuccess" class="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-200">
          {{ requestSuccess }}
        </div>
        <div v-if="requestError" class="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {{ requestError }}
        </div>

        <div v-if="demoCode" class="rounded-md bg-amber-50 p-3 text-sm text-amber-700 border border-amber-200">
          Mã xác minh DEMO của bạn là: <b class="text-lg">{{ demoCode }}</b>
        </div>

        <button 
          type="submit" 
          :disabled="loadingRequest"
          class="w-full rounded-md bg-stone-700 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-600 disabled:opacity-50"
        >
          {{ loadingRequest ? 'Đang gửi...' : 'Gửi mã xác minh' }}
        </button>
      </form>
    </div>

    <!-- Bước 2 -->
    <div class="rounded-md border border-stone-100 bg-stone-50 p-5">
      <h2 class="mb-4 text-lg font-semibold text-stone-800">Bước 2: Đặt lại mật khẩu</h2>
      <form @submit.prevent="handleResetPassword" class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Email:</label>
          <input 
            v-model.trim="resetForm.email" 
            type="email" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm bg-white focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Mã xác minh (từ Bước 1):</label>
          <input 
            v-model.trim="resetForm.code" 
            type="text" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm bg-white focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Mật khẩu mới:</label>
          <input 
            v-model="resetForm.newPassword" 
            type="password" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm bg-white focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Xác nhận mật khẩu mới:</label>
          <input 
            v-model="resetForm.confirmPassword" 
            type="password" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm bg-white focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div v-if="resetSuccess" class="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-200">
          {{ resetSuccess }}
        </div>
        <div v-if="resetError" class="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
          {{ resetError }}
        </div>

        <button 
          type="submit" 
          :disabled="loadingReset"
          class="w-full rounded-md bg-stone-800 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
        >
          {{ loadingReset ? 'Đang lưu...' : 'Lưu mật khẩu mới' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { authService } from '@/services/auth.service'
import { parseApiError } from '@/utils/api-error'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const loadingRequest = ref(false)
const loadingReset = ref(false)
const requestSuccess = ref('')
const requestError = ref('')
const resetSuccess = ref('')
const resetError = ref('')
const demoCode = ref('')
const demoExpiry = ref('')

const requestForm = reactive({
  email: ''
})

const resetForm = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const handleRequestCode = async () => {
  requestSuccess.value = ''
  requestError.value = ''
  demoCode.value = ''
  demoExpiry.value = ''

  if (!emailPattern.test(requestForm.email.trim())) {
    requestError.value = 'Email không hợp lệ'
    return
  }

  loadingRequest.value = true

  try {
    const res = await authService.forgotPasswordRequest({
      email: requestForm.email.trim()
    })

    requestSuccess.value = res.data?.message || 'Mã xác minh đã được gửi'
    demoCode.value = res.data?.data?.code_confirm || ''
    demoExpiry.value = res.data?.data?.expired_at || ''
    resetForm.email = requestForm.email.trim()
    resetForm.code = demoCode.value
  } catch (error) {
    requestError.value = parseApiError(error, 'Không thể gửi mã xác minh')
  } finally {
    loadingRequest.value = false
  }
}

const handleResetPassword = async () => {
  resetSuccess.value = ''
  resetError.value = ''

  if (!emailPattern.test(resetForm.email.trim())) {
    resetError.value = 'Email không hợp lệ'
    return
  }

  if (!resetForm.code.trim()) {
    resetError.value = 'Mã xác minh là bắt buộc'
    return
  }

  if (resetForm.newPassword.length < 6) {
    resetError.value = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    return
  }

  if (resetForm.newPassword !== resetForm.confirmPassword) {
    resetError.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  loadingReset.value = true

  try {
    const res = await authService.forgotPasswordReset({
      email: resetForm.email.trim(),
      code: resetForm.code.trim(),
      newPassword: resetForm.newPassword
    })

    resetSuccess.value = res.data?.message || 'Đặt lại mật khẩu thành công'
    resetForm.code = ''
    resetForm.newPassword = ''
    resetForm.confirmPassword = ''
  } catch (error) {
    resetError.value = parseApiError(error, 'Đặt lại mật khẩu thất bại')
  } finally {
    loadingReset.value = false
  }
}
</script>
