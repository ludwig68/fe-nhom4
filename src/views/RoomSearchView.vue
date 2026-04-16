<template>
  <div class="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white px-4 py-10">
    <div class="mx-auto max-w-7xl">
      <!-- Breadcrumb -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <RouterLink to="/" class="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-900 hover:text-white hover:ring-stone-900">
          <span class="transition group-hover:-translate-x-0.5">←</span>
          Về trang chủ
        </RouterLink>
        <p class="flex items-center gap-2 text-sm text-stone-500">
          <span>🔍</span> Tìm kiếm và lọc phòng
        </p>
      </div>

      <!-- Search Section -->
      <section class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
        <div class="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white px-6 py-6">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-xl text-white">🛏️</div>
            <div>
              <h1 class="text-2xl font-semibold text-stone-900">Tìm phòng theo ngày và bộ lọc</h1>
              <p class="mt-1 text-sm text-stone-500">
                Chọn ngày nhận/trả phòng để tìm phòng trống, sau đó lọc thêm theo loại phòng, giá, tiện nghi và sức chứa.
              </p>
            </div>
          </div>
        </div>

        <form class="p-6" @submit.prevent="handleSearch">
          <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>📅</span> Ngày nhận phòng
              </label>
              <input
                v-model="filters.checkIn"
                type="date"
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>

            <div>
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>📅</span> Ngày trả phòng
              </label>
              <input
                v-model="filters.checkOut"
                type="date"
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>

            <div>
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>🏢</span> Chi nhánh
              </label>
              <select
                v-model="filters.branchId"
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              >
                <option value="">Tất cả chi nhánh</option>
                <option v-for="branch in meta.branches" :key="branch.branchId" :value="String(branch.branchId)">
                  {{ branch.branchName }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>🛏️</span> Loại phòng
              </label>
              <select
                v-model="filters.typeId"
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              >
                <option value="">Tất cả loại phòng</option>
                <option v-for="type in meta.roomTypes" :key="type.typeId" :value="String(type.typeId)">
                  {{ type.typeName }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>👥</span> Sức chứa tối thiểu
              </label>
              <input
                v-model="filters.capacity"
                type="number"
                min="1"
                placeholder="Ví dụ: 2"
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>

            <div>
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>💰</span> Giá từ
              </label>
              <input
                v-model="filters.minPrice"
                type="number"
                min="0"
                placeholder="0"
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>

            <div>
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>💰</span> Đến giá
              </label>
              <input
                v-model="filters.maxPrice"
                type="number"
                min="0"
                placeholder="2000000"
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              />
            </div>

            <div class="flex items-end gap-3">
              <button
                type="submit"
                :disabled="loading"
                class="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-md shadow-stone-300/50 transition hover:bg-stone-700 hover:shadow-lg disabled:opacity-60"
              >
                {{ loading ? '⏳ Đang tìm...' : '🔍 Tìm/Lọc phòng' }}
              </button>
              <button
                type="button"
                @click="resetFilters"
                class="rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-100"
              >
                Reset
              </button>
            </div>

            <!-- Tiện nghi -->
            <div class="md:col-span-2 xl:col-span-4">
              <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                <span>✨</span> Tiện nghi
              </label>
              <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <label
                  v-for="amenity in meta.amenities"
                  :key="amenity.amenityId"
                  class="flex cursor-pointer items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 transition hover:border-stone-400 hover:bg-white"
                >
                  <input
                    v-model="filters.amenityIds"
                    type="checkbox"
                    :value="String(amenity.amenityId)"
                    class="h-4 w-4 rounded accent-stone-900"
                  />
                  <span>{{ amenity.amenityName }}</span>
                </label>
              </div>
            </div>
          </div>
        </form>

        <p v-if="errorMessage" class="mx-6 mb-6 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
          <span>⚠️</span> {{ errorMessage }}
        </p>
      </section>

      <!-- Results -->
      <section class="mt-8">
        <div class="mb-5 flex items-center justify-between gap-3">
          <h2 class="flex items-center gap-2 text-xl font-semibold text-stone-900">
            <span>🏨</span> Kết quả phòng
          </h2>
          <span class="rounded-full bg-stone-100 px-3 py-1.5 text-sm font-medium text-stone-600">{{ rooms.length }} phòng phù hợp</span>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-stone-200">
          <div class="text-3xl">⏳</div>
          <p class="mt-3 text-sm text-stone-500">Đang tải danh sách phòng...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="rooms.length === 0" class="rounded-2xl bg-white px-6 py-12 text-center ring-1 ring-stone-200">
          <div class="text-4xl">🏠</div>
          <p class="mt-3 text-base font-medium text-stone-600">Không có phòng phù hợp</p>
          <p class="mt-1 text-sm text-stone-400">Thử thay đổi bộ lọc để tìm kết quả khác.</p>
        </div>

        <!-- Room Grid -->
        <div v-else class="grid gap-5 lg:grid-cols-3">
          <article
            v-for="room in rooms"
            :key="room.roomId"
            class="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <!-- Image -->
            <div class="relative h-48 overflow-hidden bg-stone-100">
              <img
                v-if="room.images?.[0]?.imageUrl"
                :src="room.images[0].imageUrl"
                :alt="`Phòng ${room.roomNumber}`"
                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div v-else class="flex h-full items-center justify-center">
                <div class="text-center">
                  <div class="text-3xl">🛏️</div>
                  <p class="mt-1 text-xs text-stone-400">Chưa có ảnh phòng</p>
                </div>
              </div>
              <!-- Price Badge -->
              <div class="absolute bottom-3 right-3 rounded-lg bg-stone-900/90 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm">
                {{ formatPrice(room.pricePerNight) }}<span class="text-xs font-normal opacity-70">/đêm</span>
              </div>
            </div>

            <div class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-lg font-semibold text-stone-900">Phòng {{ room.roomNumber }}</h3>
                  <p class="mt-1 text-sm text-stone-500">{{ room.branchName }}</p>
                </div>
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {{ room.status }}
                </span>
              </div>

              <p class="mt-3 text-sm text-stone-600">
                {{ room.roomType }} · {{ room.capacity }} người
              </p>

              <div class="mt-3 flex flex-wrap gap-1.5">
                <span
                  v-for="amenity in (room.amenities || []).slice(0, 4)"
                  :key="amenity.amenityId"
                  class="rounded-lg bg-stone-100 px-2 py-1 text-xs text-stone-600"
                >
                  {{ amenity.amenityName }}
                </span>
              </div>

              <div class="mt-4 grid gap-2 sm:grid-cols-2">
                <RouterLink
                  :to="`/rooms/${room.roomId}`"
                  class="inline-flex items-center justify-center rounded-xl border border-stone-300 px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Chi tiết
                </RouterLink>
                <RouterLink
                  :to="{ path: '/booking', query: { roomId: room.roomId } }"
                  class="inline-flex items-center justify-center rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-700"
                >
                  Đặt phòng
                </RouterLink>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { roomService } from '@/services/room.service'
import { parseApiError } from '@/utils/api-error'

const loading = ref(false)
const errorMessage = ref('')
const rooms = ref([])

const meta = reactive({
  branches: [],
  roomTypes: [],
  amenities: []
})

const filters = reactive({
  checkIn: '',
  checkOut: '',
  branchId: '',
  typeId: '',
  capacity: '',
  minPrice: '',
  maxPrice: '',
  amenityIds: []
})

const formatPrice = (value) => {
  const amount = Number(value)
  if (Number.isNaN(amount)) return 'Liên hệ'
  return amount.toLocaleString('vi-VN') + 'đ'
}

const buildQueryParams = () => {
  const params = {}

  if (filters.checkIn) params.checkIn = filters.checkIn
  if (filters.checkOut) params.checkOut = filters.checkOut
  if (filters.branchId) params.branchId = filters.branchId
  if (filters.typeId) params.typeId = filters.typeId
  if (filters.capacity) params.capacity = filters.capacity
  if (filters.minPrice) params.minPrice = filters.minPrice
  if (filters.maxPrice) params.maxPrice = filters.maxPrice
  if (filters.amenityIds.length > 0) {
    params.amenityIds = filters.amenityIds.join(',')
  }

  return params
}

const handleSearch = async () => {
  if ((filters.checkIn && !filters.checkOut) || (!filters.checkIn && filters.checkOut)) {
    errorMessage.value = 'Vui lòng chọn đủ ngày nhận và ngày trả phòng'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const res = await roomService.searchRooms(buildQueryParams())
    rooms.value = res.data?.data || []
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Không thể tải danh sách phòng')
  } finally {
    loading.value = false
  }
}

const resetFilters = async () => {
  filters.checkIn = ''
  filters.checkOut = ''
  filters.branchId = ''
  filters.typeId = ''
  filters.capacity = ''
  filters.minPrice = ''
  filters.maxPrice = ''
  filters.amenityIds = []
  await handleSearch()
}

onMounted(async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const [metaRes, roomsRes] = await Promise.all([
      roomService.getRoomSearchMeta(),
      roomService.searchRooms()
    ])

    meta.branches = metaRes.data?.data?.branches || []
    meta.roomTypes = metaRes.data?.data?.roomTypes || []
    meta.amenities = metaRes.data?.data?.amenities || []
    rooms.value = roomsRes.data?.data || []
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Không thể tải dữ liệu tìm phòng')
  } finally {
    loading.value = false
  }
})
</script>
