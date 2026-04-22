<template>
  <div class="mx-auto mt-10 max-w-2xl rounded-lg bg-white p-8 shadow-md border border-stone-200">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-stone-800">Đăng ký tài khoản</h1>
      <RouterLink to="/" class="text-sm font-medium text-stone-500 hover:text-stone-900">
        Về trang chủ
      </RouterLink>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Tên đăng nhập:</label>
          <input 
            v-model.trim="form.username" 
            type="text" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Họ và tên:</label>
          <input 
            v-model.trim="form.fullName" 
            type="text" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Email:</label>
          <input 
            v-model.trim="form.email" 
            type="email" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Số điện thoại:</label>
          <input 
            v-model.trim="form.phone" 
            type="tel" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div class="md:col-span-2">
          <label class="mb-1 block text-sm font-medium text-stone-700">Địa chỉ:</label>
          <input 
            v-model.trim="form.address" 
            type="text" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Mật khẩu:</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-stone-700">Xác nhận mật khẩu:</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          />
        </div>
      </div>

      <div v-if="message" class="rounded-md bg-emerald-50 p-3 text-sm text-emerald-600 border border-emerald-200">
        {{ message }}
      </div>
      <div v-if="errorMessage" class="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
        {{ errorMessage }}
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="mt-4 w-full rounded-md bg-stone-800 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
      >
        {{ loading ? 'Đang xử lý...' : 'Đăng ký tài khoản' }}
      </button>

      <div class="mt-4 text-center text-sm text-stone-500">
        Đã có tài khoản?
        <RouterLink to="/login" class="font-medium text-stone-800 hover:underline">
          Đăng nhập
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { parseApiError } from '@/utils/api-error'
import { validateRegisterForm } from '@/validators/auth.validator'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const message = ref('')
const errorMessage = ref('')

let redirectTimer = null

const form = reactive({
  username: '',
  fullName: '',
  email: '',
  phone: '',
  address: '',
  password: '',
  confirmPassword: ''
})

const resetForm = () => {
  form.username = ''
  form.fullName = ''
  form.email = ''
  form.phone = ''
  form.address = ''
  form.password = ''
  form.confirmPassword = ''
}

const handleRegister = async () => {
  message.value = ''
  errorMessage.value = ''

  const validationError = validateRegisterForm(form)
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  loading.value = true

  try {
    await authStore.register({
      username: form.username.trim(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      password: form.password
    })

    message.value = 'Đăng ký thành công, đang chuyển đến trang đăng nhập...'
    resetForm()
    redirectTimer = window.setTimeout(() => router.push('/login'), 1000)
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Đăng ký thất bại')
  } finally {
    loading.value = false
  }
}

onBeforeUnmount(() => {
  if (redirectTimer) {
    window.clearTimeout(redirectTimer)
  }
})
</script>
