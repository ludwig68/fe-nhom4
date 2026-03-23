<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm text-stone-500">Tạo tài khoản mới</p>
          <h1 class="mt-2 text-3xl font-semibold text-stone-900">Đăng ký tài khoản</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Form này bám theo validator hiện tại của backend: username tối thiểu 3 ký tự, họ tên tối thiểu
            2 ký tự, email hợp lệ và mật khẩu tối thiểu 6 ký tự.
          </p>
        </div>

        <RouterLink
          to="/"
          class="inline-flex rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
        >
          Về trang chủ
        </RouterLink>
      </div>

      <form class="mt-8 grid gap-5 sm:grid-cols-2" @submit.prevent="handleRegister">
        <div>
          <label class="mb-2 block text-sm text-stone-600" for="username">Tên đăng nhập</label>
          <input
            id="username"
            v-model.trim="form.username"
            type="text"
            autocomplete="username"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="itnhat3kytu"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600" for="full-name">Họ và tên</label>
          <input
            id="full-name"
            v-model.trim="form.fullName"
            type="text"
            autocomplete="name"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600" for="email">Email</label>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            autocomplete="email"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="name@example.com"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600" for="phone">Số điện thoại</label>
          <input
            id="phone"
            v-model.trim="form.phone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="0912345678"
          />
        </div>

        <div class="sm:col-span-2">
          <label class="mb-2 block text-sm text-stone-600" for="address">Địa chỉ</label>
          <input
            id="address"
            v-model.trim="form.address"
            type="text"
            autocomplete="street-address"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Tùy chọn"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600" for="password">Mật khẩu</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="new-password"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Tối thiểu 6 ký tự"
          />
        </div>

        <div>
          <label class="mb-2 block text-sm text-stone-600" for="confirm-password">Xác nhận mật khẩu</label>
          <input
            id="confirm-password"
            v-model="form.confirmPassword"
            type="password"
            autocomplete="new-password"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none transition focus:border-stone-500"
            placeholder="Nhập lại mật khẩu"
          />
        </div>

        <p
          v-if="message"
          class="sm:col-span-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200"
        >
          {{ message }}
        </p>
        <p
          v-if="errorMessage"
          class="sm:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200"
        >
          {{ errorMessage }}
        </p>

        <div class="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <RouterLink to="/login" class="text-sm text-stone-600 hover:text-stone-900">
            Đã có tài khoản? Đăng nhập
          </RouterLink>

          <button
            type="submit"
            :disabled="loading"
            class="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-6 py-3 font-medium text-white transition hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ loading ? 'Đang xử lý...' : 'Đăng ký tài khoản' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

const getErrorMessage = (error, fallback) => {
  const messageText = error?.response?.data?.message
  const errors = error?.response?.data?.errors

  if (messageText && messageText !== 'Dữ liệu không hợp lệ') {
    return messageText
  }

  if (Array.isArray(errors) && errors.length > 0) {
    return errors[0]
  }

  return messageText || fallback
}

const validateRegister = () => {
  if (form.username.trim().length < 3) {
    return 'Tên đăng nhập phải có ít nhất 3 ký tự'
  }

  if (form.fullName.trim().length < 2) {
    return 'Họ và tên phải có ít nhất 2 ký tự'
  }

  if (!emailPattern.test(form.email.trim())) {
    return 'Email không hợp lệ'
  }

  if (form.phone && !/^[0-9]{9,15}$/.test(form.phone.trim())) {
    return 'Số điện thoại không hợp lệ'
  }

  if (form.password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự'
  }

  if (form.password !== form.confirmPassword) {
    return 'Mật khẩu xác nhận không khớp'
  }

  return ''
}

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

  const validationError = validateRegister()
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

    message.value = 'Đăng ký thành công, đang chuyển sang đăng nhập...'
    resetForm()
    redirectTimer = window.setTimeout(() => router.push('/login'), 1000)
  } catch (error) {
    errorMessage.value = getErrorMessage(error, 'Đăng ký thất bại')
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
