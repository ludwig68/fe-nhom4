<!--
  =============================================================
  FILE: frontend/src/views/LoginView.vue
  MÔ TẢ: Trang đăng nhập
  ROUTE: /login (guestOnly - chỉ người chưa login mới vào)
  
  LUỒNG HOẠT ĐỘNG:
  1. User nhập username + password
  2. Bấm "Đăng nhập" → gọi authStore.login()
  3. Nếu thành công → redirect về trang chủ (/)
  4. Nếu lỗi → hiện thông báo lỗi
  
  AUTH FLOW:
  - authStore.login() gọi API → nhận token + user
  - Token lưu vào localStorage → reload không mất
  - Router guard nhận ra đã login → cho phép vào trang private
  =============================================================
-->

<template>
  <div class="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-10">
    <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <p class="text-sm text-stone-500">Chào mừng trở lại</p>
      <h1 class="mt-2 text-3xl font-semibold text-stone-900">Đăng nhập</h1>

      <!-- Form đăng nhập -->
      <!-- @submit.prevent: chặn reload trang khi submit, gọi handleLogin -->
      <form class="mt-8 space-y-5" @submit.prevent="handleLogin">
        <!-- Input: Tên đăng nhập -->
        <!-- v-model: 2-way binding → form.username tự cập nhật khi user gõ -->
        <div>
          <label class="mb-2 block text-sm text-stone-600">Tên đăng nhập</label>
          <input
            v-model="form.username"
            type="text"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
          />
        </div>

        <!-- Input: Mật khẩu -->
        <div>
          <label class="mb-2 block text-sm text-stone-600">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full rounded-2xl border border-stone-300 px-4 py-3 outline-none"
          />
        </div>

        <!-- Hiển thị lỗi nếu có -->
        <p v-if="errorMessage" class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
          {{ errorMessage }}
        </p>

        <!-- Nút đăng nhập -->
        <!-- :disabled="loading": vô hiệu hóa khi đang xử lý -->
        <!-- {{ loading ? '...' : '...' }}: hiển thị text khác nhau tùy trạng thái -->
        <button
          :disabled="loading"
          class="w-full rounded-2xl bg-stone-900 px-5 py-3 font-medium text-white disabled:opacity-60"
        >
          {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
        </button>
      </form>

      <!-- Links: Quên mật khẩu + Tạo tài khoản -->
      <div class="mt-6 flex items-center justify-between text-sm">
        <RouterLink to="/forgot-password" class="text-stone-600 hover:text-stone-900">Quên mật khẩu?</RouterLink>
        <RouterLink to="/register" class="text-stone-900 hover:text-stone-600">Tạo tài khoản</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// =============================================================
// IMPORTS
// =============================================================
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { parseApiError } from '@/utils/api-error';

// =============================================================
// STATE & REFS
// =============================================================
// useRouter: để chuyển trang sau khi login thành công
const router = useRouter();

// useAuthStore: lấy store quản lý auth (login, logout, user info)
const authStore = useAuthStore();

// loading: cờ báo đang xử lý API → hiện spinner, disable nút
const loading = ref(false);

// errorMessage: thông báo lỗi hiển thị cho user
const errorMessage = ref('');

// form: object chứa dữ liệu form đăng nhập
// reactive: Vue 3 reactivity → thay đổi form → UI tự cập nhật
const form = reactive({
  username: '',
  password: ''
});

// =============================================================
// METHODS
// =============================================================

/**
 * Xử lý đăng nhập
 * 
 * LUỒNG:
 * 1. Set loading = true → disable nút, hiện "Đang xử lý..."
 * 2. Xóa lỗi cũ
 * 3. Gọi authStore.login(form) → gọi API backend
 * 4. Nếu thành công → redirect về trang chủ
 * 5. Nếu lỗi → parse lỗi → hiển thị
 * 6. finally → loading = false → enable nút
 */
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // Gọi action login của store
    // Store sẽ: gọi API → lưu token vào localStorage + store state
    await authStore.login(form);

    // Đăng nhập thành công → chuyển về trang chủ
    router.push('/');
  } catch (error) {
    // Parse lỗi từ API response → lấy thông báo dễ hiểu
    errorMessage.value = parseApiError(error, 'Đăng nhập thất bại');
  } finally {
    // Dù thành công hay lỗi → tắt loading
    loading.value = false;
  }
};
</script>
