<!--
  =============================================================
  FILE: frontend/src/views/HomeView.vue
  MÔ TẢ: Trang chủ (trang tổng quan)
  ROUTE: / (public - ai cũng vào được)
  
  CHỨC NĂNG:
  - Hiển thị thông tin tổng quan về hệ thống
  - Hiển thị trạng thái đăng nhập (đã login / chưa login)
  - Các nút điều hướng nhanh: Đăng ký, Đăng nhập, Quên MK, Đổi MK
  - Sidebar hiển thị session info (user name, token status)
  =============================================================
-->

<template>
  <div class="min-h-screen bg-stone-100 text-stone-900">
    <!-- =============================================================
         HEADER: Thanh điều hướng trên cùng
         ============================================================= -->
    <header class="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <!-- Logo + Title -->
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">Hotel Auth Demo</p>
          <h1 class="mt-2 text-2xl font-semibold">Khach san auth module</h1>
        </div>

        <!-- Các nút điều hướng bên phải -->
        <div class="flex items-center gap-3">
          <!-- HIỂN THỊ KHI ĐÃ ĐĂNG NHẬP -->
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/profile"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Ho so
            </RouterLink>
            <RouterLink
              to="/change-password"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Doi mat khau
            </RouterLink>
            <button
              type="button"
              @click="handleLogout"
              class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Dang xuat
            </button>
          </template>

          <!-- HIỂN THỊ KHI CHƯA ĐĂNG NHẬP -->
          <template v-else>
            <RouterLink
              to="/login"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Dang nhap
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Dang ky
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <!-- =============================================================
         MAIN CONTENT
         ============================================================= -->
    <main class="mx-auto max-w-6xl px-6 py-12">
      <section class="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <!-- Cột trái: Giới thiệu + nút điều hướng -->
        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Auth module</p>
          <h2 class="mt-4 text-4xl font-semibold leading-tight text-stone-900">
            Dang ky, dang nhap, quen mat khau va doi mat khau tren localhost
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-8 text-stone-600">
            Day la man hinh tong quan de kiem tra luong xac thuc truoc khi gan vao landing page chinh.
            Home view nay duoc noi truc tiep voi router va auth store hien tai.
          </p>

          <!-- 4 nút điều hướng nhanh -->
          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <RouterLink
              to="/register"
              class="rounded-2xl bg-stone-900 px-5 py-4 text-center text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Tao tai khoan
            </RouterLink>
            <RouterLink
              to="/login"
              class="rounded-2xl border border-stone-300 px-5 py-4 text-center text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Dang nhap
            </RouterLink>
            <RouterLink
              to="/forgot-password"
              class="rounded-2xl border border-stone-300 px-5 py-4 text-center text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Quen mat khau
            </RouterLink>
            <RouterLink
              to="/change-password"
              class="rounded-2xl border border-stone-300 px-5 py-4 text-center text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Doi mat khau
            </RouterLink>
          </div>
        </div>

        <!-- Cột phải: Sidebar hiển thị session info -->
        <aside class="rounded-3xl bg-stone-900 p-8 text-stone-100 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">Session</p>
          <h3 class="mt-4 text-2xl font-semibold">
            {{ authStore.isAuthenticated ? 'Da dang nhap' : 'Chua dang nhap' }}
          </h3>
          <p class="mt-3 text-sm leading-7 text-stone-300">
            {{ sessionMessage }}
          </p>

          <!-- Thông tin user -->
          <dl class="mt-8 space-y-5 text-sm">
            <div class="rounded-2xl border border-stone-800 bg-stone-950/40 p-4">
              <dt class="text-stone-400">Nguoi dung</dt>
              <dd class="mt-1 text-base font-medium text-white">{{ displayName }}</dd>
            </div>
            <div class="rounded-2xl border border-stone-800 bg-stone-950/40 p-4">
              <dt class="text-stone-400">Access token</dt>
              <dd class="mt-1 break-all text-base font-medium text-white">
                {{ authStore.accessToken ? 'Da luu trong localStorage' : 'Chua co token' }}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup>
// =============================================================
// IMPORTS
// =============================================================
import { computed, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// =============================================================
// STATE
// =============================================================
const authStore = useAuthStore();
const router = useRouter();

/**
 * computed: giá trị tính toán tự động cập nhật khi state thay đổi
 * 
 * displayName: hiển thị tên user
 * - Ưu tiên: full_name → username → email → mặc định
 * - Tự động refresh khi authStore.user thay đổi
 */
const displayName = computed(() => {
  const user = authStore.user;

  if (!user) {
    return 'Khach';
  }

  // Lưu ý: backend trả về full_name (snake_case), không phải fullName
  return user.full_name || user.username || user.email || 'Nguoi dung da dang nhap';
});

/**
 * sessionMessage: thông báo tùy theo trạng thái đăng nhập
 */
const sessionMessage = computed(() => {
  if (authStore.isAuthenticated) {
    return 'Ban co the vao trang ho so, doi mat khau hoac dang xuat de test luong auth.';
  }

  return 'Hay dang ky hoac dang nhap de kiem tra route guard, token storage va API auth.';
});

// =============================================================
// LIFECYCLE
// =============================================================

/**
 * onMounted: chạy khi component được gắn vào DOM
 * 
 * Nếu user đã có token (từ localStorage) nhưng chưa có user info
 * → gọi fetchMe() để đồng bộ thông tin user từ server
 */
onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchMe();
    } catch (error) {
      console.error(error);
    }
  }
});

// =============================================================
// METHODS
// =============================================================

/**
 * Xử lý đăng xuất
 * 
 * LUỒNG:
 * 1. Gọi authStore.logout() → xóa token + user
 * 2. Router.push('/login') → chuyển về trang đăng nhập
 */
const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};
</script>
