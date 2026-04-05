<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto max-w-6xl">
      <div class="mb-6 flex items-center justify-between gap-3">
        <RouterLink to="/rooms" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Quay lại danh sách phòng
        </RouterLink>
        <RouterLink v-if="room?.branchId" :to="`/branches/${room.branchId}`" class="text-sm text-stone-600 hover:text-stone-900">
          Xem chi nhánh
        </RouterLink>
      </div>

      <div v-if="loading" class="rounded-3xl bg-white p-8 text-center text-stone-500 ring-1 ring-stone-200">
        Đang tải chi tiết phòng...
      </div>

      <div v-else-if="errorMessage" class="rounded-3xl bg-rose-50 p-8 text-center text-rose-600 ring-1 ring-rose-200">
        {{ errorMessage }}
      </div>

      <div v-else-if="room" class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
          <div class="h-72 bg-stone-100">
            <img
              v-if="room.images?.[0]?.imageUrl"
              :src="room.images[0].imageUrl"
              :alt="`Phòng ${room.roomNumber}`"
              class="h-full w-full object-cover"
            />
            <div v-else class="flex h-full items-center justify-center text-stone-500">
              Chưa có ảnh đại diện
            </div>
          </div>

          <div class="grid gap-3 p-5 sm:grid-cols-3">
            <div
              v-for="image in room.images?.slice(1)"
              :key="image.imageId"
              class="h-28 overflow-hidden rounded-2xl bg-stone-100"
            >
              <img :src="image.imageUrl" alt="Ảnh phòng" class="h-full w-full object-cover" />
            </div>
            <div
              v-if="!room.images || room.images.length <= 1"
              class="col-span-full rounded-2xl border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500"
            >
              Chưa có thêm hình ảnh cho loại phòng này
            </div>
          </div>
        </section>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">{{ room.branchName }}</p>
          <h1 class="mt-2 text-3xl font-semibold text-stone-900">Phòng {{ room.roomNumber }}</h1>
          <p class="mt-2 text-stone-600">{{ room.roomType }} · {{ room.capacity }} người</p>

          <div class="mt-4 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
            {{ room.status }}
          </div>

          <RouterLink
            :to="{ path: '/booking', query: { roomId: room.roomId } }"
            class="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Đặt phòng này
          </RouterLink>

          <div class="mt-6 grid gap-3">
            <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
              <p class="text-xs uppercase tracking-[0.2em] text-stone-500">Giá cơ bản / đêm</p>
              <p class="mt-2 text-xl font-semibold text-stone-900">{{ formatPrice(room.basePrice) }}</p>
            </div>
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                <p class="text-xs text-stone-500">Giá CN thường</p>
                <p class="mt-1 font-medium text-stone-900">{{ formatPrice(room.sundayPrice) }}</p>
              </div>
              <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                <p class="text-xs text-stone-500">Giá mùa cao điểm</p>
                <p class="mt-1 font-medium text-stone-900">{{ formatPrice(room.peakSeasonPrice) }}</p>
              </div>
              <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                <p class="text-xs text-stone-500">Giá CN cao điểm</p>
                <p class="mt-1 font-medium text-stone-900">{{ formatPrice(room.peakSundayPrice) }}</p>
              </div>
              <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
                <p class="text-xs text-stone-500">Giá theo giờ</p>
                <p class="mt-1 font-medium text-stone-900">{{ formatPrice(room.hourlyPrice) }}</p>
              </div>
            </div>
          </div>
        </section>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200 lg:col-span-2">
          <h2 class="text-xl font-semibold text-stone-900">Mô tả phòng</h2>
          <p class="mt-3 leading-7 text-stone-600">{{ room.description || 'Chưa có mô tả phòng' }}</p>

          <h3 class="mt-8 text-lg font-semibold text-stone-900">Tiện nghi</h3>
          <div v-if="room.amenities?.length" class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="amenity in room.amenities"
              :key="amenity.amenityId"
              class="rounded-full bg-stone-100 px-3 py-2 text-sm text-stone-700"
            >
              {{ amenity.amenityName }}
            </span>
          </div>
          <p v-else class="mt-3 text-sm text-stone-500">Chưa có dữ liệu tiện nghi.</p>

          <div class="mt-8 border-t border-stone-100 pt-8">
            <div class="flex items-center justify-between gap-3">
              <h3 class="text-lg font-semibold text-stone-900">Đánh giá phòng</h3>
              <p class="text-sm text-stone-500">
                {{ room.reviewStats?.averageRating ?? 'N/A' }} / 5 · {{ room.reviewStats?.totalReviews || 0 }} đánh giá
              </p>
            </div>

            <div v-if="room.reviews?.length" class="mt-4 space-y-3">
              <article
                v-for="review in room.reviews"
                :key="review.feedbackId"
                class="rounded-2xl border border-stone-200 bg-stone-50 p-4"
              >
                <div class="flex items-center justify-between gap-3">
                  <p class="font-medium text-stone-900">{{ review.customerName }}</p>
                  <p class="text-sm text-amber-600">★ {{ review.rating }}/5</p>
                </div>
                <p class="mt-2 text-sm leading-6 text-stone-600">{{ review.comment || 'Không có nội dung.' }}</p>
              </article>
            </div>
            <p v-else class="mt-3 text-sm text-stone-500">Chưa có đánh giá cho phòng này.</p>
          </div>
        </section>
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
