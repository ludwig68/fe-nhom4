<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto max-w-5xl">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm text-stone-500">Khôi phục mật khẩu</p>
          <h1 class="mt-2 text-3xl font-semibold text-stone-900">Quên mật khẩu</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Nhập email đã đăng ký để nhận mã xác minh và đặt lại mật khẩu cho tài khoản của bạn.
          </p>
        </div>

        <RouterLink
          to="/login"
          class="inline-flex rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
        >
          Quay lại đăng nhập
        </RouterLink>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <section class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Bước 1</p>
          <h2 class="mt-3 text-2xl font-semibold text-stone-900">Nhận mã xác minh</h2>
          <p class="mt-3 text-sm leading-7 text-stone-600">
            Nhập email đã đăng ký. Nếu tài khoản tồn tại, hệ thống sẽ gửi mã xác minh để bạn tiếp tục.
          </p>

          <form class="mt-6 space-y-5" @submit.prevent="handleRequestCode">
            <div>
              <label class="mb-2 block text-sm text-stone-600" for="request-email">Email</label>
              <input
                id="request-email"
                v-model.trim="requestForm.email"
                type="email"
                autocomplete="email"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
                placeholder="name@example.com"
              />
            </div>

            <p
              v-if="requestSuccess"
              class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200"
            >
              {{ requestSuccess }}
            </p>
            <p
              v-if="requestError"
              class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200"
            >
              {{ requestError }}
            </p>

            <div
              v-if="demoCode"
              class="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-4 text-sm text-stone-700"
            >
              <p class="text-stone-500">Mã xác minh</p>
              <p class="mt-2 text-xl font-semibold tracking-[0.3em] text-stone-900">{{ demoCode }}</p>
              <p v-if="demoExpiry" class="mt-2 text-xs text-stone-500">Có hiệu lực đến: {{ demoExpiry }}</p>
            </div>

            <button
              type="submit"
              :disabled="loadingRequest"
              class="w-full rounded-2xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ loadingRequest ? 'Đang gửi mã...' : 'Gửi mã xác minh' }}
            </button>
          </form>
        </section>

        <section class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Bước 2</p>
          <h2 class="mt-3 text-2xl font-semibold text-stone-900">Đặt lại mật khẩu</h2>
          <p class="mt-3 text-sm leading-7 text-stone-600">
            Nhập email, mã xác minh và mật khẩu mới để hoàn tất việc khôi phục tài khoản.
          </p>

          <form class="mt-6 space-y-5" @submit.prevent="handleResetPassword">
            <div>
              <label class="mb-2 block text-sm text-stone-600" for="reset-email">Email</label>
              <input
                id="reset-email"
                v-model.trim="resetForm.email"
                type="email"
                autocomplete="email"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600" for="reset-code">Mã xác minh</label>
              <input
                id="reset-code"
                v-model.trim="resetForm.code"
                type="text"
                inputmode="numeric"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
                placeholder="6 chữ số"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600" for="new-password">Mật khẩu mới</label>
              <input
                id="new-password"
                v-model="resetForm.newPassword"
                type="password"
                autocomplete="new-password"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
                placeholder="Tối thiểu 6 ký tự"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600" for="confirm-new-password">Xác nhận mật khẩu mới</label>
              <input
                id="confirm-new-password"
                v-model="resetForm.confirmPassword"
                type="password"
                autocomplete="new-password"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <div
              v-if="resetSuccess"
              class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200"
            >
              {{ resetSuccess }}
            </div>
            <div
              v-if="resetError"
              class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200"
            >
              {{ resetError }}
            </div>

            <button
              type="submit"
              :disabled="loadingReset"
              class="w-full rounded-2xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {{ loadingReset ? 'Đang đặt lại...' : 'Đặt lại mật khẩu' }}
            </button>
          </form>
        </section>
      </div>
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
