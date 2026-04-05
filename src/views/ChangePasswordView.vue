<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto w-full max-w-xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm text-stone-500">Bảo mật tài khoản</p>
          <h1 class="mt-2 text-3xl font-semibold text-stone-900">Đổi mật khẩu</h1>
          <p class="mt-3 text-sm leading-7 text-stone-600">
            Route này yêu cầu đăng nhập. Backend kiểm tra mật khẩu cũ, mật khẩu mới tối thiểu 6 ký tự
            và không được trùng mật khẩu hiện tại.
          </p>
        </div>

        <RouterLink
          to="/profile"
          class="inline-flex rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
        >
          Hồ sơ
        </RouterLink>
      </div>

      <form class="mt-8 space-y-5" @submit.prevent="handleChangePassword">
        <div>
          <label class="mb-2 block text-sm text-stone-600" for="old-password">Mật khẩu cũ</label>
          <input
            id="old-password"
            v-model="form.oldPassword"
            type="password"
            autocomplete="current-password"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Nhập mật khẩu hiện tại"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600" for="new-password">Mật khẩu mới</label>
          <input
            id="new-password"
            v-model="form.newPassword"
            type="password"
            autocomplete="new-password"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Tối thiểu 6 ký tự"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600" for="confirm-password">Xác nhận mật khẩu mới</label>
          <input
            id="confirm-password"
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Nhập lại mật khẩu mới"
          />
        </div>

        <p
          v-if="successMessage"
          class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200"
        >
          {{ successMessage }}
        </p>
        <p
          v-if="errorMessage"
          class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200"
        >
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-2xl bg-stone-900 px-5 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ loading ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
        </button>
      </form>

      <div class="mt-6 flex items-center justify-between text-sm">
        <RouterLink to="/" class="text-stone-600 hover:text-stone-900">Quay lại trang chủ</RouterLink>
        <RouterLink to="/profile" class="text-stone-900 hover:text-stone-600">Xem hồ sơ</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { authService } from '@/services/auth.service'
import { parseApiError } from '@/utils/api-error'

const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleChangePassword = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (!form.oldPassword) {
    errorMessage.value = 'Mật khẩu cũ là bắt buộc'
    return
  }

  if (form.newPassword.length < 6) {
    errorMessage.value = 'Mật khẩu mới phải có ít nhất 6 ký tự'
    return
  }

  if (form.oldPassword === form.newPassword) {
    errorMessage.value = 'Mật khẩu mới không được trùng mật khẩu cũ'
    return
  }

  if (form.newPassword !== form.confirmPassword) {
    errorMessage.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  loading.value = true

  try {
    const res = await authService.changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword
    })

    successMessage.value = res.data?.message || 'Đổi mật khẩu thành công'
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Đổi mật khẩu thất bại')
  } finally {
    loading.value = false
  }
}
</script>
