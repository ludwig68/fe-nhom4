<template>
  <div class="min-h-screen bg-stone-50 px-6 py-10">
    <div class="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm text-stone-500">Tài khoản</p>
          <h1 class="text-3xl font-semibold text-stone-900">Thông tin cá nhân</h1>
        </div>
        <RouterLink to="/" class="rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-700">
          Về trang chủ
        </RouterLink>
      </div>

      <div v-if="loading" class="mt-6 text-stone-500">Đang tải...</div>

      <div v-else-if="user" class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Username</p>
          <p class="mt-2 font-medium text-stone-900">{{ user.username }}</p>
        </div>
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Họ tên</p>
          <p class="mt-2 font-medium text-stone-900">{{ user.full_name }}</p>
        </div>
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Email</p>
          <p class="mt-2 font-medium text-stone-900">{{ user.email }}</p>
        </div>
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Số điện thoại</p>
          <p class="mt-2 font-medium text-stone-900">{{ user.phone || 'Chưa cập nhật' }}</p>
        </div>
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200 sm:col-span-2">
          <p class="text-sm text-stone-500">Địa chỉ</p>
          <p class="mt-2 font-medium text-stone-900">{{ user.address || 'Chưa cập nhật' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(true)
const user = ref(null)

onMounted(async () => {
  try {
    const res = await authStore.fetchMe()
    user.value = res?.data || authStore.user
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>