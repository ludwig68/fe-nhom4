<template>
  <div class="mx-auto mt-10 max-w-lg rounded-lg bg-white p-8 shadow-md border border-stone-200">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-stone-800">Đổi mật khẩu</h1>
      <RouterLink to="/profile" class="text-sm font-medium text-stone-500 hover:text-stone-900">
        Hồ sơ của tôi
      </RouterLink>
    </div>

    <form @submit.prevent="handleChangePassword" class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Mật khẩu cũ:</label>
        <input 
          v-model="form.oldPassword" 
          type="password" 
          class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Mật khẩu mới:</label>
        <input 
          v-model="form.newPassword" 
          type="password" 
          class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
        />
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Xác nhận mật khẩu mới:</label>
        <input 
          v-model="form.confirmPassword" 
          type="password" 
          class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
        />
      </div>

      <div v-if="successMessage" class="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-200">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
        {{ errorMessage }}
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="mt-4 w-full rounded-md bg-stone-800 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
      >
        {{ loading ? 'Đang cập nhật...' : 'Đổi mật khẩu' }}
      </button>

      <div class="mt-4 text-center text-sm">
        <RouterLink to="/" class="text-stone-500 hover:text-stone-900 hover:underline">
          Về trang chủ
        </RouterLink>
      </div>
    </form>
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
