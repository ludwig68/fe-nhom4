<template>
  <div class="min-h-screen bg-stone-50 px-6 py-10">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
          <span>&larr;</span> Về trang chủ
        </RouterLink>
      </div>

      <div class="mb-8">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">Hệ thống chi nhánh</p>
        <h2 class="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Danh sách các chi nhánh của Hotel Luxe</h2>
        <p class="mt-4 text-stone-500 max-w-2xl">Mạng lưới khách sạn trải dài khắp cả nước, mang đến cho bạn trải nghiệm lưu trú hoàn hảo dù bạn ở bất cứ đâu.</p>
      </div>

      <div v-if="loading" class="mt-6 text-center text-stone-500">
        Đang tải danh sách chi nhánh...
      </div>

      <div v-else-if="branches.length === 0" class="mt-6 text-center text-stone-500">
        Hiện tại chưa có chi nhánh nào.
      </div>

      <div v-else class="grid gap-6 lg:grid-cols-3">
        <article v-for="branch in branches" :key="branch.branchId" class="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1">
          <div class="h-56 bg-[linear-gradient(135deg,#f5f5f4,#e7e5e4,#fafaf9)] flex items-center justify-center">
            <span class="text-stone-400">Ảnh chi nhánh</span>
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-stone-900">{{ branch.branchName }}</h3>
                <p class="mt-2 text-sm text-stone-500">{{ branch.address }}</p>
              </div>
              <span v-if="branch.is_active" class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">Đang hoạt động</span>
              <span v-else class="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">Tạm ngưng</span>
            </div>
            <p class="mt-4 text-sm leading-7 text-stone-600 line-clamp-3">{{ branch.description || 'Chưa có mô tả' }}</p>
            <div class="mt-5 flex items-center justify-between text-sm">
              <span class="text-stone-500">{{ branch.phone || 'Chưa cập nhật SĐT' }}</span>
              <RouterLink :to="'/branches/' + branch.branchId" class="font-medium text-stone-900 transition hover:text-stone-600">Xem chi tiết</RouterLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { branchService } from '@/services/branch.service'

const branches = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const res = await branchService.getAllBranches()
    branches.value = res.data?.data || []
  } catch (err) {
    console.error('Lỗi tải danh sách chi nhánh', err)
  } finally {
    loading.value = false
  }
})
</script>
