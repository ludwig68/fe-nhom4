<template>
  <div class="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-stone-800">Đặt phòng</h1>
      <div class="flex gap-4">
        <RouterLink to="/" class="text-sm font-medium text-stone-500 hover:text-stone-900">Về trang chủ</RouterLink>
        <RouterLink to="/rooms" class="text-sm font-medium text-stone-500 hover:text-stone-900">Xem danh sách phòng</RouterLink>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
      
      <!-- CỘT TRÁI: Tìm kiếm & Chọn phòng -->
      <div class="lg:col-span-4 space-y-6">
        
        <!-- Bước 1 -->
        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-stone-800">Bước 1: Tìm phòng trống</h2>
          <form @submit.prevent="searchAvailableRooms" class="space-y-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-stone-700">Ngày nhận phòng:</label>
              <input v-model="searchForm.checkIn" type="date" required class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-stone-700">Ngày trả phòng:</label>
              <input v-model="searchForm.checkOut" type="date" required class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
            </div>

            <div>
              <label class="mb-1 block text-sm font-medium text-stone-700">Chi nhánh:</label>
              <select v-model="searchForm.branchId" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500">
                <option value="">Tất cả chi nhánh</option>
                <option v-for="branch in meta.branches" :key="branch.branchId" :value="String(branch.branchId)">
                  {{ branch.branchName }}
                </option>
              </select>
            </div>

            <div class="flex gap-2 pt-2">
              <button type="submit" :disabled="loadingRooms" class="w-full rounded-md bg-stone-800 py-2 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50">
                {{ loadingRooms ? 'Đang tìm...' : 'Xem phòng trống' }}
              </button>
              <button type="button" @click="resetSearch" class="whitespace-nowrap rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50">
                Làm mới
              </button>
            </div>
          </form>
        </div>

        <!-- Bước 2 -->
        <div class="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
          <h2 class="mb-4 text-lg font-semibold text-stone-800">Bước 2: Danh sách kết quả</h2>
          
          <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {{ errorMessage }}
          </div>
          
          <div v-if="availableRooms.length === 0" class="rounded-md border border-stone-100 bg-stone-50 p-4 text-center text-sm text-stone-500">
            Hãy chọn ngày và bấm "Xem phòng trống"
          </div>
          
          <div v-else class="max-h-[400px] space-y-3 overflow-y-auto pr-2">
            <label v-for="room in availableRooms" :key="room.roomId" class="block cursor-pointer rounded-md border border-stone-200 p-3 hover:bg-stone-50 has-[:checked]:border-stone-500 has-[:checked]:bg-stone-50">
              <div class="flex items-start gap-3">
                <input 
                  type="radio" 
                  :value="String(room.roomId)" 
                  v-model="selectedRoomId" 
                  @change="quote = null; successMessage = ''"
                  class="mt-1 border-stone-300 text-stone-800 focus:ring-stone-500"
                />
                <div>
                  <div class="font-medium text-stone-900">Phòng {{ room.roomNumber }} ({{ room.roomType }})</div>
                  <div class="text-sm text-stone-500">{{ room.branchName }}</div>
                  <div class="mt-1 font-semibold text-stone-800">{{ formatPrice(room.pricePerNight) }} / đêm</div>
                </div>
              </div>
            </label>
          </div>
        </div>

      </div>

      <!-- CỘT PHẢI: Điền thông tin -->
      <div class="lg:col-span-8">
        <div class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h2 class="mb-6 text-xl font-bold text-stone-800">Bước 3: Thông tin đặt phòng</h2>
          
          <form @submit.prevent="submitBooking" class="space-y-6">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label class="mb-1 block text-sm font-medium text-stone-700">Họ và tên:</label>
                <input v-model.trim="bookingForm.customerName" type="text" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
              </div>

              <div>
                <label class="mb-1 block text-sm font-medium text-stone-700">Số điện thoại:</label>
                <input v-model.trim="bookingForm.customerPhone" type="tel" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-sm font-medium text-stone-700">Email:</label>
                <input v-model.trim="bookingForm.customerEmail" type="email" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" />
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-sm font-medium text-stone-700">Ghi chú:</label>
                <textarea v-model.trim="bookingForm.note" rows="3" class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"></textarea>
              </div>
            </div>

            <div>
              <h3 class="mb-3 text-sm font-semibold text-stone-800 uppercase tracking-wide">Dịch vụ đi kèm</h3>
              <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 border border-stone-200 rounded-md p-4 bg-stone-50">
                <label v-for="service in services" :key="service.serviceId" class="flex items-center gap-2 text-sm text-stone-700">
                  <input v-model="bookingForm.serviceIds" type="checkbox" :value="service.serviceId" class="rounded border-stone-300 text-stone-800 focus:ring-stone-500" />
                  <span>{{ service.serviceName }}</span>
                  <span class="ml-auto font-medium">{{ formatPrice(service.unitPrice) }}</span>
                </label>
              </div>
            </div>

            <div class="border-t border-stone-200 pt-6">
              <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button type="button" @click="calculateQuote" :disabled="loadingQuote || !selectedRoomId" class="w-full sm:w-auto rounded-md border border-stone-300 bg-white px-6 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-50 disabled:opacity-50">
                  {{ loadingQuote ? 'Đang tính...' : 'Tính tổng tiền' }}
                </button>

                <div v-if="quote" class="w-full sm:w-auto text-right text-sm">
                  <p class="text-stone-600">Tiền phòng: <span class="font-medium text-stone-900">{{ formatPrice(quote.price.roomCost) }}</span></p>
                  <p class="text-stone-600">Phí dịch vụ: <span class="font-medium text-stone-900">{{ formatPrice(quote.price.servicesCost) }}</span></p>
                  <p class="mt-1 text-lg font-bold text-stone-900">Tổng cộng: {{ formatPrice(quote.price.totalCost) }}</p>
                </div>
              </div>
            </div>

            <div v-if="successMessage" class="rounded-md bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200 bg-opacity-70">
              {{ successMessage }}
            </div>

            <button type="submit" :disabled="submitting || !quote" class="w-full rounded-md bg-stone-900 py-3.5 text-base font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ submitting ? 'Đang gửi yêu cầu...' : 'Xác nhận đặt phòng' }}
            </button>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { bookingService } from '@/services/booking.service'
import { roomService } from '@/services/room.service'
import { parseApiError } from '@/utils/api-error'

const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

const loadingRooms = ref(false)
const loadingQuote = ref(false)
const submitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const meta = reactive({
  branches: [],
  roomTypes: [],
  amenities: []
})

const services = ref([])
const availableRooms = ref([])
const selectedRoomId = ref('')
const quote = ref(null)

const searchForm = reactive({
  checkIn: '',
  checkOut: '',
  branchId: '',
  typeId: '',
  capacity: '',
  minPrice: '',
  maxPrice: '',
  amenityIds: []
})

const bookingForm = reactive({
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  note: '',
  serviceIds: []
})

const formatPrice = (value) => {
  const amount = Number(value || 0)
  return amount.toLocaleString('vi-VN') + 'đ'
}

const buildAvailableRoomParams = () => {
  const params = {
    checkIn: searchForm.checkIn,
    checkOut: searchForm.checkOut
  }

  if (searchForm.branchId) params.branchId = searchForm.branchId
  if (searchForm.typeId) params.typeId = searchForm.typeId
  if (searchForm.capacity) params.capacity = searchForm.capacity
  if (searchForm.minPrice) params.minPrice = searchForm.minPrice
  if (searchForm.maxPrice) params.maxPrice = searchForm.maxPrice
  if (searchForm.amenityIds.length > 0) {
    params.amenityIds = searchForm.amenityIds.join(',')
  }

  return params
}

const searchAvailableRooms = async () => {
  if (!searchForm.checkIn || !searchForm.checkOut) {
    errorMessage.value = 'Vui lòng chọn đủ ngày nhận và trả phòng'
    return
  }

  loadingRooms.value = true
  errorMessage.value = ''
  successMessage.value = ''
  quote.value = null

  try {
    const res = await bookingService.getAvailableRooms(buildAvailableRoomParams())
    availableRooms.value = res.data?.data || []

    if (selectedRoomId.value) {
      const exists = availableRooms.value.some((room) => String(room.roomId) === selectedRoomId.value)
      if (!exists) {
        selectedRoomId.value = ''
      }
    }
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Không thể lấy danh sách phòng trống')
  } finally {
    loadingRooms.value = false
  }
}

const selectRoom = (room) => {
  selectedRoomId.value = String(room.roomId)
  quote.value = null
  successMessage.value = ''
}

const calculateQuote = async () => {
  if (!selectedRoomId.value) {
    errorMessage.value = 'Vui lòng chọn phòng trước'
    return
  }

  loadingQuote.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await bookingService.getQuote({
      roomId: Number(selectedRoomId.value),
      checkIn: searchForm.checkIn,
      checkOut: searchForm.checkOut,
      serviceIds: bookingForm.serviceIds
    })

    quote.value = res.data?.data || null
  } catch (error) {
    quote.value = null
    errorMessage.value = parseApiError(error, 'Không thể tính tổng tiền')
  } finally {
    loadingQuote.value = false
  }
}

const submitBooking = async () => {
  if (!quote.value) {
    errorMessage.value = 'Vui lòng tính tổng tiền trước khi đặt phòng'
    return
  }

  submitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const res = await bookingService.createBooking({
      roomId: Number(selectedRoomId.value),
      checkIn: searchForm.checkIn,
      checkOut: searchForm.checkOut,
      serviceIds: bookingForm.serviceIds,
      customerName: bookingForm.customerName,
      customerPhone: bookingForm.customerPhone,
      customerEmail: bookingForm.customerEmail,
      note: bookingForm.note
    })

    const bookingData = res.data?.data
    successMessage.value = `Đặt phòng thành công. Mã đơn: ${bookingData?.bookingCode || 'N/A'}`

    if (bookingData?.bookingCode) {
      localStorage.setItem('latestBookingCode', bookingData.bookingCode)
    }

    const detailId = bookingData?.bookingCode || bookingData?.bookingId
    if (detailId) {
      // Sau 2 giây → chuyển sang trang chi tiết booking vừa tạo
      setTimeout(() => {
        router.push({ name: 'booking-detail', params: { id: detailId } })
      }, 2000)
    }

    await searchAvailableRooms()
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Đặt phòng thất bại')
  } finally {
    submitting.value = false
  }
}

const resetSearch = () => {
  searchForm.checkIn = ''
  searchForm.checkOut = ''
  searchForm.branchId = ''
  searchForm.typeId = ''
  searchForm.capacity = ''
  searchForm.minPrice = ''
  searchForm.maxPrice = ''
  searchForm.amenityIds = []
  selectedRoomId.value = ''
  quote.value = null
  availableRooms.value = []
  errorMessage.value = ''
  successMessage.value = ''
}

watch(
  () => [...bookingForm.serviceIds, selectedRoomId.value, searchForm.checkIn, searchForm.checkOut],
  () => {
    quote.value = null
    successMessage.value = ''
  }
)

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch (error) {
      // ignore
    }
  }

  bookingForm.customerName = authStore.user?.full_name || ''
  bookingForm.customerPhone = authStore.user?.phone || ''
  bookingForm.customerEmail = authStore.user?.email || ''

  try {
    const [metaRes, servicesRes] = await Promise.all([
      roomService.getRoomSearchMeta(),
      bookingService.getServiceCatalog()
    ])

    meta.branches = metaRes.data?.data?.branches || []
    meta.roomTypes = metaRes.data?.data?.roomTypes || []
    meta.amenities = metaRes.data?.data?.amenities || []
    services.value = servicesRes.data?.data || []
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Không thể tải dữ liệu đặt phòng')
  }

  const presetRoomId = String(route.query.roomId || '').trim()
  if (presetRoomId) {
    selectedRoomId.value = presetRoomId
  }

  const presetCheckIn = String(route.query.checkIn || '').trim()
  const presetCheckOut = String(route.query.checkOut || '').trim()

  if (DATE_PATTERN.test(presetCheckIn)) {
    searchForm.checkIn = presetCheckIn
  }

  if (DATE_PATTERN.test(presetCheckOut)) {
    searchForm.checkOut = presetCheckOut
  }

  if (searchForm.checkIn && searchForm.checkOut) {
    await searchAvailableRooms()
  }
})
</script>
