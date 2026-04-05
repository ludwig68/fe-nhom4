<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex items-center justify-between gap-4">
        <RouterLink to="/" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Về trang chủ
        </RouterLink>
        <p class="text-sm text-stone-500">Tìm kiếm và lọc phòng</p>
      </div>

      <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h1 class="text-2xl font-semibold text-stone-900">Tìm phòng theo ngày và bộ lọc</h1>
        <p class="mt-2 text-sm text-stone-500">
          Chọn ngày nhận/trả phòng để tìm phòng trống, sau đó lọc thêm theo loại phòng, giá, tiện nghi và sức chứa.
        </p>

        <form class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4" @submit.prevent="handleSearch">
          <div>
            <label class="mb-2 block text-sm text-stone-600">Ngày nhận phòng</label>
            <input
              v-model="filters.checkIn"
              type="date"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-stone-600">Ngày trả phòng</label>
            <input
              v-model="filters.checkOut"
              type="date"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-stone-600">Chi nhánh</label>
            <select
              v-model="filters.branchId"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
            >
              <option value="">Tất cả chi nhánh</option>
              <option v-for="branch in meta.branches" :key="branch.branchId" :value="String(branch.branchId)">
                {{ branch.branchName }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm text-stone-600">Loại phòng</label>
            <select
              v-model="filters.typeId"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
            >
              <option value="">Tất cả loại phòng</option>
              <option v-for="type in meta.roomTypes" :key="type.typeId" :value="String(type.typeId)">
                {{ type.typeName }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-2 block text-sm text-stone-600">Sức chứa tối thiểu</label>
            <input
              v-model="filters.capacity"
              type="number"
              min="1"
              placeholder="Ví dụ: 2"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-stone-600">Giá từ</label>
            <input
              v-model="filters.minPrice"
              type="number"
              min="0"
              placeholder="0"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div>
            <label class="mb-2 block text-sm text-stone-600">Đến giá</label>
            <input
              v-model="filters.maxPrice"
              type="number"
              min="0"
              placeholder="2000000"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
            />
          </div>

          <div class="flex items-end gap-3">
            <button
              type="submit"
              :disabled="loading"
              class="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-60"
            >
              {{ loading ? 'Đang tìm...' : 'Tìm/Lọc phòng' }}
            </button>
            <button
              type="button"
              @click="resetFilters"
              class="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:border-stone-400"
            >
              Reset
            </button>
          </div>

          <div class="md:col-span-2 xl:col-span-4">
            <label class="mb-2 block text-sm text-stone-600">Tiện nghi</label>
            <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <label
                v-for="amenity in meta.amenities"
                :key="amenity.amenityId"
                class="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700"
              >
                <input
                  v-model="filters.amenityIds"
                  type="checkbox"
                  :value="String(amenity.amenityId)"
                  class="h-4 w-4 accent-stone-900"
                />
                <span>{{ amenity.amenityName }}</span>
              </label>
            </div>
          </div>
        </form>

        <p v-if="errorMessage" class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
          {{ errorMessage }}
        </p>
      </section>

      <section class="mt-6">
        <div class="mb-4 flex items-center justify-between gap-3">
          <h2 class="text-xl font-semibold text-stone-900">Kết quả phòng</h2>
          <p class="text-sm text-stone-500">{{ rooms.length }} phòng phù hợp</p>
        </div>

        <div v-if="loading" class="rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
          Đang tải danh sách phòng...
        </div>

        <div v-else-if="rooms.length === 0" class="rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
          Không có phòng phù hợp với bộ lọc hiện tại.
        </div>

        <div v-else class="grid gap-4 lg:grid-cols-3">
          <article
            v-for="room in rooms"
            :key="room.roomId"
            class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
          >
            <div class="h-44 bg-stone-100">
              <img
                v-if="room.images?.[0]?.imageUrl"
                :src="room.images[0].imageUrl"
                :alt="`Phòng ${room.roomNumber}`"
                class="h-full w-full object-cover"
              />
              <div v-else class="flex h-full items-center justify-center text-sm text-stone-500">
                Chưa có ảnh phòng
              </div>
            </div>

            <div class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h3 class="text-lg font-semibold text-stone-900">Phòng {{ room.roomNumber }}</h3>
                  <p class="mt-1 text-sm text-stone-500">{{ room.branchName }}</p>
                </div>
                <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  {{ room.status }}
                </span>
              </div>

              <p class="mt-3 text-sm text-stone-600">
                {{ room.roomType }} · {{ room.capacity }} người
              </p>
              <p class="mt-1 text-lg font-semibold text-stone-900">{{ formatPrice(room.pricePerNight) }}/đêm</p>

              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="amenity in (room.amenities || []).slice(0, 4)"
                  :key="amenity.amenityId"
                  class="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700"
                >
                  {{ amenity.amenityName }}
                </span>
              </div>

              <div class="mt-4 grid gap-2 sm:grid-cols-2">
                <RouterLink
                  :to="`/rooms/${room.roomId}`"
                  class="inline-flex items-center justify-center rounded-2xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-800 transition hover:bg-stone-100"
                >
                  Chi tiết
                </RouterLink>
                <RouterLink
                  :to="{ path: '/booking', query: { roomId: room.roomId } }"
                  class="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
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
