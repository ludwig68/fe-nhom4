<template>
  <div class="min-h-screen bg-stone-50 px-6 py-10">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
          <span>&larr;</span> Quay về trang chủ
        </RouterLink>
      </div>

      <div v-if="loading" class="rounded-3xl bg-white p-8 text-center text-stone-500 shadow-sm ring-1 ring-stone-200">
        Đang tải thông tin chi nhánh...
      </div>
      <div v-else-if="branch" class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
        <div class="h-64 bg-[linear-gradient(135deg,#f5f5f4,#e7e5e4,#fafaf9)] flex items-center justify-center">
          <span class="text-stone-400">Ảnh chi nhánh</span>
        </div>
        <div class="p-8">
          <span v-if="branch.is_active" class="mb-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">Đang hoạt động</span>
          <span v-else class="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">Ngừng hoạt động</span>
          
          <h1 class="text-3xl font-bold text-stone-900">{{ branch.branch_name }}</h1>
          
          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 class="text-sm font-medium uppercase tracking-wider text-stone-500">Địa chỉ</h3>
              <p class="mt-2 text-stone-900">{{ branch.address }}</p>
            </div>
            
            <div>
              <h3 class="text-sm font-medium uppercase tracking-wider text-stone-500">Liên hệ</h3>
              <div class="mt-2 space-y-2 text-stone-900">
                <p>Điện thoại: {{ branch.phone || 'Chưa cập nhật' }}</p>
                <p>Email: {{ branch.email || 'Chưa cập nhật' }}</p>
              </div>
            </div>
            
            <div class="md:col-span-2">
              <h3 class="text-sm font-medium uppercase tracking-wider text-stone-500">Mô tả</h3>
              <p class="mt-2 leading-relaxed text-stone-600">{{ branch.description || 'Chưa có mô tả' }}</p>
            </div>
          </div>
          
          <div class="mt-8 border-t border-stone-100 pt-8">
            <h3 class="text-xl font-semibold text-stone-900">Danh sách phòng (Sắp tới)</h3>
            <p class="mt-2 text-stone-500">Phần này sẽ hiển thị các loại phòng của chi nhánh này.</p>
          </div>
        </div>
      </div>
      <div v-else class="rounded-3xl bg-white p-8 text-center text-red-500 shadow-sm ring-1 ring-stone-200">
        Không tìm thấy chi nhánh
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { branchService } from '@/services/branch.service'

// Công cụ lấy ID chi nhánh thông qua URL đang mở (vd: /branches/1 => lấy được số 1)
const route = useRoute()

// Biến lưu trữ
const branchInfo = ref(null) // Biến dự phòng
const branch = ref(null)     // Chứa cụm dữ liệu object của chi nhánh sau khi API trả về
const loading = ref(true)    // Hiển thị khung Skeleton loading

// Chạy khi giao diện gắn vào
onMounted(async () => {
  try {
    // Truyền tham số id lấy từ URL cho branchService để gửi xuống Backend lấy data
    const res = await branchService.getBranchById(route.params.id)
    // Gán dữ liệu nhận được vào giao diện Vue tự vẽ lại
    branch.value = res.data?.data
  } catch (err) {
    console.error(err)
  } finally {
    // Tắt loading spinner
    loading.value = false
  }
})
</script>
