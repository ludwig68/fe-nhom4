<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto w-full max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-sm text-stone-500">Tạo tài khoản mới</p>
          <h1 class="mt-2 text-3xl font-semibold text-stone-900">Đăng ký tài khoản</h1>
          <p class="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
            Chảo mừng bạn đến với hệ thống đặt phòng khách sạn! Hãy tạo tài khoản để trải nghiệm việc đặt phòng dễ dàng và nhanh chóng.
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
            placeholder="Tối thiểu 3 ký tự"
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
            placeholder="tenban@example.com"
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
            placeholder="Nhập số điện thoại"
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
            placeholder="Nhập địa chỉ của bạn"
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
