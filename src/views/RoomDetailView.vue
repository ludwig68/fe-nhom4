<template>
  <div class="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-stone-800">Chi tiết phòng</h1>
      <RouterLink to="/rooms" class="text-sm font-medium text-stone-500 hover:text-stone-900">
        Quay lại danh sách
      </RouterLink>
    </div>

    <div v-if="loading" class="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 shadow-sm">
      Đang tải thông tin...
    </div>
    
    <div v-else-if="errorMessage" class="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
      {{ errorMessage }}
    </div>

    <div v-else-if="room" class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- Cột Trái: Thông tin chính -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Bộ ảnh phòng -->
        <div v-if="room.images?.length" class="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm ring-1 ring-stone-900/5">
          <div class="h-80 w-full md:h-[400px]">
            <img :src="room.images[0].imageUrl" :alt="`Phòng ${room.roomNumber}`" class="h-full w-full object-cover transition duration-300 hover:scale-105">
          </div>
          <div v-if="room.images.length > 1" class="grid grid-cols-4 gap-2 bg-stone-50 p-2">
            <div v-for="(img, idx) in room.images.slice(1, 5)" :key="img.imageId" class="relative h-24 w-full overflow-hidden rounded-md">
              <img :src="img.imageUrl" :alt="`Khung cảnh ${idx}`" class="h-full w-full object-cover transition duration-300 hover:scale-110 cursor-pointer">
              <div v-if="idx === 3 && room.images.length > 5" class="absolute inset-0 flex items-center justify-center bg-stone-900/50 text-font-bold text-white cursor-pointer">
                +{{ room.images.length - 5 }}
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-start justify-between">
            <div>
              <h2 class="text-2xl font-bold text-stone-900">Phòng {{ room.roomNumber }} - {{ room.branchName }}</h2>
              <div class="mt-2 flex flex-wrap gap-2 text-sm text-stone-600">
                <span class="rounded-full bg-stone-100 px-3 py-1">{{ room.roomType }}</span>
                <span class="rounded-full bg-stone-100 px-3 py-1">Sức chứa: {{ room.capacity }} người</span>
              </div>
            </div>
            <span class="rounded-full px-3 py-1 text-sm font-semibold" :class="room.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'">
              {{ room.status }}
            </span>
          </div>

          <div class="prose prose-sm max-w-none text-stone-600">
            <h3 class="text-lg font-semibold text-stone-800">Mô tả phòng</h3>
            <p>{{ room.description || 'Chưa có mô tả chi tiết cho phòng này.' }}</p>
          </div>
        </div>

        <div class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-semibold text-stone-800">Tiện nghi</h3>
          <ul v-if="room.amenities?.length" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <li v-for="amenity in room.amenities" :key="amenity.amenityId" class="flex items-center gap-2 text-sm text-stone-600">
              <span class="h-1.5 w-1.5 rounded-full bg-stone-400"></span>
              {{ amenity.amenityName }}
            </li>
          </ul>
          <p v-else class="text-sm text-stone-500">Chưa cập nhật tiện nghi.</p>
        </div>

        <div class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-stone-800">Đánh giá</h3>
            <div class="text-sm">
              <span class="font-bold text-amber-500">{{ room.reviewStats?.averageRating ?? 'N/A' }} / 5</span>
              <span class="text-stone-500"> ({{ room.reviewStats?.totalReviews || 0 }} đánh giá)</span>
            </div>
          </div>
          
          <div v-if="room.reviews?.length" class="space-y-4 divide-y divide-stone-100">
            <div v-for="review in room.reviews" :key="review.feedbackId" class="pt-4 first:pt-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium text-stone-900">{{ review.customerName }}</span>
                <span class="text-sm font-bold text-amber-500">{{ review.rating }}/5</span>
              </div>
              <p class="text-sm text-stone-600">{{ review.comment }}</p>
            </div>
          </div>
          <p v-else class="text-sm text-stone-500">Chưa có đánh giá nào.</p>
        </div>
      </div>

      <!-- Cột Phải: Bảng giá & Đặt phòng -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-lg font-semibold text-stone-800">Bảng giá</h3>
          
          <ul class="space-y-3 text-sm divide-y divide-stone-100">
            <li class="flex justify-between pt-3 first:pt-0">
              <span class="text-stone-600">Giá cơ bản / đêm</span>
              <span class="font-medium text-stone-900">{{ formatPrice(room.basePrice) }}</span>
            </li>
            <li class="flex justify-between pt-3">
              <span class="text-stone-600">Giá Chủ nhật</span>
              <span class="font-medium text-stone-900">{{ formatPrice(room.sundayPrice) }}</span>
            </li>
            <li class="flex justify-between pt-3">
              <span class="text-stone-600">Giá mùa cao điểm</span>
              <span class="font-medium text-stone-900">{{ formatPrice(room.peakSeasonPrice) }}</span>
            </li>
            <li class="flex justify-between pt-3">
              <span class="text-stone-600">CN mùa cao điểm</span>
              <span class="font-medium text-stone-900">{{ formatPrice(room.peakSundayPrice) }}</span>
            </li>
            <li class="flex justify-between pt-3">
              <span class="text-stone-600">Giá theo giờ</span>
              <span class="font-medium text-stone-900">{{ formatPrice(room.hourlyPrice) }}</span>
            </li>
          </ul>

          <div class="mt-8">
            <RouterLink v-if="room.status === 'trống'" :to="{ path: '/booking', query: { roomId: room.roomId } }" class="flex w-full items-center justify-center rounded-md bg-stone-900 py-3 text-sm font-semibold text-white transition hover:bg-stone-800">
              Đặt phòng ngay
            </RouterLink>
            <button v-else disabled class="flex w-full items-center justify-center rounded-md bg-stone-300 py-3 text-sm font-semibold text-stone-500 cursor-not-allowed">
              Phòng đang được sử dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { roomService } from '@/services/room.service'
import { parseApiError } from '@/utils/api-error'

const route = useRoute()
const loading = ref(true)
const errorMessage = ref('')
const room = ref(null)

const formatPrice = (value) => {
  const amount = Number(value)
  if (Number.isNaN(amount)) return 'Liên hệ'
  return amount.toLocaleString('vi-VN') + 'đ'
}

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await roomService.getRoomDetail(route.params.id)
    room.value = res.data?.data || null
    if (!room.value) {
      errorMessage.value = 'Không tìm thấy phòng'
    }
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Không thể tải chi tiết phòng')
  } finally {
    loading.value = false
  }
})
</script>
