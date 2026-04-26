<template>
  <div class="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-stone-800">Tìm kiếm và lọc phòng</h1>
      <RouterLink to="/" class="text-sm font-medium text-stone-500 hover:text-stone-900">
        Về trang chủ
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
      <!-- Cột Bộ lọc -->
      <div class="lg:col-span-1 rounded-lg border border-stone-200 bg-white p-5 shadow-sm h-fit">
        <h2 class="mb-4 text-lg font-semibold text-stone-800">Bộ lọc</h2>
        
        <form @submit.prevent="handleSearch" class="space-y-4">
          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">Ngày nhận phòng:</label>
            <input v-model="filters.checkIn" type="date" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">Ngày trả phòng:</label>
            <input v-model="filters.checkOut" type="date" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">Chi nhánh:</label>
            <select v-model="filters.branchId" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500">
              <option value="">Tất cả chi nhánh</option>
              <option v-for="branch in meta.branches" :key="branch.branchId" :value="String(branch.branchId)">
                {{ branch.branchName }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">Loại phòng:</label>
            <select v-model="filters.typeId" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500">
              <option value="">Tất cả loại phòng</option>
              <option v-for="type in meta.roomTypes" :key="type.typeId" :value="String(type.typeId)">
                {{ type.typeName }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-stone-700">Sức chứa tối thiểu:</label>
            <input v-model="filters.capacity" type="number" min="1" placeholder="Số người" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="mb-1 block text-sm font-medium text-stone-700">Giá từ:</label>
              <input v-model="filters.minPrice" type="number" min="0" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
            </div>
            <div>
              <label class="mb-1 block text-sm font-medium text-stone-700">Đến giá:</label>
              <input v-model="filters.maxPrice" type="number" min="0" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
            </div>
          </div>

          <div>
            <label class="mb-2 block text-sm font-medium text-stone-700">Tiện nghi:</label>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-2">
              <label v-for="amenity in meta.amenities" :key="amenity.amenityId" class="flex items-center gap-2 text-sm text-stone-600">
                <input
                  type="checkbox"
                  v-model="filters.amenityIds"
                  :value="String(amenity.amenityId)"
                  class="rounded border-stone-300 text-stone-800 focus:ring-stone-500"
                />
                {{ amenity.amenityName }}
              </label>
            </div>
          </div>

          <div v-if="errorMessage" class="rounded-md bg-red-50 p-2 text-sm text-red-600 border border-red-200">
            {{ errorMessage }}
          </div>

          <div class="flex flex-col gap-2 pt-2">
            <button type="submit" :disabled="loading" class="w-full rounded-md bg-stone-800 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50">
              {{ loading ? 'Đang tìm...' : 'Lọc phòng' }}
            </button>
            <button type="button" @click="resetFilters" class="w-full rounded-md border border-stone-300 bg-white py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">
              Xóa bộ lọc
            </button>
          </div>
        </form>
      </div>

      <!-- Cột Danh sách Phòng -->
      <div class="lg:col-span-3">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-stone-800">Kết quả: {{ rooms.length }} phòng</h2>
        </div>

        <div v-if="loading" class="flex h-40 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500">
          Đang tải dữ liệu...
        </div>
        <div v-else-if="rooms.length === 0" class="flex h-40 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500">
          Không tìm thấy phòng nào phù hợp với bộ lọc.
        </div>
        
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-for="room in rooms" :key="room.roomId" class="group flex flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:shadow-md hover:border-stone-300">
            <div class="relative h-48 w-full overflow-hidden bg-stone-100">
              <img v-if="room.images?.[0]?.imageUrl" :src="room.images[0].imageUrl" :alt="room.roomNumber" class="h-full w-full object-cover transition duration-300 group-hover:scale-105">
              <div v-else class="flex h-full w-full items-center justify-center text-sm font-medium text-stone-400">Không có ảnh</div>
              <span class="absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm" :class="room.status === 'trống' ? 'bg-emerald-100/90 text-emerald-800 backdrop-blur-sm' : 'bg-amber-100/90 text-amber-800 backdrop-blur-sm'">
                {{ room.status }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <div class="mb-2">
                <h3 class="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">Phòng {{ room.roomNumber }}</h3>
                <p class="text-sm text-stone-500">{{ room.branchName }}</p>
              </div>
              <div class="mb-4 flex flex-wrap gap-2 text-xs text-stone-600">
                <span class="rounded-full bg-stone-100 px-2 py-1">{{ room.roomType }}</span>
                <span class="rounded-full bg-stone-100 px-2 py-1">{{ room.capacity }} người</span>
              </div>

              <p class="mb-4 text-sm text-stone-600 line-clamp-2">
                <span class="font-medium text-stone-800">Tiện nghi: </span>
                <span v-for="(amenity, index) in room.amenities" :key="amenity.amenityId">
                  {{ amenity.amenityName }}{{ index < room.amenities.length - 1 ? ', ' : '' }}
                </span>
                <span v-if="!room.amenities || room.amenities.length === 0">Đang cập nhật</span>
              </p>

            <div class="mt-auto pt-4 border-t border-stone-100 flex items-center justify-between">
              <p class="text-lg font-bold text-stone-900">{{ formatPrice(room.pricePerNight) }}</p>
              <div class="flex gap-2">
                <RouterLink :to="`/rooms/${room.roomId}`" class="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50">
                  Chi tiết
                </RouterLink>
                <RouterLink v-if="room.isAvailable" :to="{ path: '/booking', query: { roomId: room.roomId } }" class="rounded-md bg-stone-800 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-stone-700">
                  Đặt ngay
                </RouterLink>
                <button v-else disabled class="rounded-md bg-stone-300 px-3 py-1.5 text-sm font-medium text-stone-500 cursor-not-allowed">
                  Tạm hết
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>

      </div>
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
