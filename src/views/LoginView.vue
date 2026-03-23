<template>
  <div class="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
    <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <p class="text-sm text-stone-500">Chào mừng trở lại</p>
      <h1 class="mt-2 text-3xl font-semibold text-stone-900">Đăng nhập</h1>

      <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
        <div>
          <label class="mb-2 block text-sm text-stone-600">Tên đăng nhập</label>
          <input v-model="form.username" type="text" class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none" />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600">Mật khẩu</label>
          <input v-model="form.password" type="password" class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none" />
        </div>

        <p v-if="errorMessage" class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
          {{ errorMessage }}
        </p>

        <button :disabled="loading" class="w-full rounded-2xl bg-stone-900 px-5 py-3 font-medium text-white disabled:opacity-60">
          {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
        </button>
      </form>

      <div class="mt-6 flex items-center justify-between text-sm">
        <RouterLink to="/forgot-password" class="text-stone-600 hover:text-stone-900">Quên mật khẩu?</RouterLink>
        <RouterLink to="/register" class="text-stone-900 hover:text-stone-600">Tạo tài khoản</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const errorMessage = ref('')

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await authStore.login(form)
    router.push('/')
  } catch (error) {
    errorMessage.value = error?.response?.data?.message || 'Đăng nhập thất bại'
  } finally {
    loading.value = false
  }
}
</script>