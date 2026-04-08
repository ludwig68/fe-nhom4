<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink to="/" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Về trang chủ
        </RouterLink>
        <RouterLink to="/rooms" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          Xem chi tiết phòng
        </RouterLink>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h1 class="text-2xl font-semibold text-stone-900">Đặt phòng</h1>
          <p class="mt-2 text-sm text-stone-500">
            Tìm phòng trống theo ngày, chọn phòng phù hợp, thêm dịch vụ và xác nhận đặt phòng.
          </p>

          <form class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" @submit.prevent="searchAvailableRooms">
            <div>
              <label class="mb-2 block text-sm text-stone-600">Ngày nhận phòng</label>
              <input
                v-model="searchForm.checkIn"
                type="date"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600">Ngày trả phòng</label>
              <input
                v-model="searchForm.checkOut"
                type="date"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600">Chi nhánh</label>
              <select
                v-model="searchForm.branchId"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              >
                <option value="">Tất cả</option>
                <option v-for="branch in meta.branches" :key="branch.branchId" :value="String(branch.branchId)">
                  {{ branch.branchName }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600">Loại phòng</label>
              <select
                v-model="searchForm.typeId"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              >
                <option value="">Tất cả</option>
                <option v-for="type in meta.roomTypes" :key="type.typeId" :value="String(type.typeId)">
                  {{ type.typeName }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600">Sức chứa</label>
              <input
                v-model="searchForm.capacity"
                type="number"
                min="1"
                placeholder="Ví dụ: 2"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600">Giá từ</label>
              <input
                v-model="searchForm.minPrice"
                type="number"
                min="0"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>

            <div>
              <label class="mb-2 block text-sm text-stone-600">Đến giá</label>
              <input
                v-model="searchForm.maxPrice"
                type="number"
                min="0"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>

            <div class="flex items-end gap-2">
              <button
                type="submit"
                :disabled="loadingRooms"
                class="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-60"
              >
                {{ loadingRooms ? 'Đang tìm...' : 'Xem phòng trống' }}
              </button>
              <button
                type="button"
                @click="resetSearch"
                class="rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700"
              >
                Reset
              </button>
            </div>

            <div class="sm:col-span-2 lg:col-span-4">
              <label class="mb-2 block text-sm text-stone-600">Tiện nghi mong muốn</label>
              <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <label
                  v-for="amenity in meta.amenities"
                  :key="amenity.amenityId"
                  class="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-sm text-stone-700"
                >
                  <input
                    v-model="searchForm.amenityIds"
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

          <div class="mt-6">
            <div class="mb-3 flex items-center justify-between">
              <h2 class="text-lg font-semibold text-stone-900">Phòng trống</h2>
              <span class="text-sm text-stone-500">{{ availableRooms.length }} phòng</span>
            </div>

            <div v-if="availableRooms.length === 0" class="rounded-2xl border border-dashed border-stone-300 px-5 py-8 text-center text-sm text-stone-500">
              Chưa có kết quả. Hãy chọn ngày và bấm “Xem phòng trống”.
            </div>

            <div v-else class="grid gap-4 lg:grid-cols-2">
              <article
                v-for="room in availableRooms"
                :key="room.roomId"
                :class="[
                  'rounded-2xl border p-4 transition',
                  selectedRoomId === String(room.roomId) ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white'
                ]"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <h3 class="font-semibold text-stone-900">Phòng {{ room.roomNumber }}</h3>
                    <p class="mt-1 text-sm text-stone-500">{{ room.branchName }}</p>
                  </div>
                  <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                    {{ room.status }}
                  </span>
                </div>

                <p class="mt-3 text-sm text-stone-600">{{ room.roomType }} · {{ room.capacity }} người</p>
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

                <button
                  type="button"
                  @click="selectRoom(room)"
                  class="mt-4 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100"
                >
                  {{ selectedRoomId === String(room.roomId) ? 'Đã chọn phòng này' : 'Chọn phòng này' }}
                </button>
              </article>
            </div>
          </div>
        </section>

        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 class="text-xl font-semibold text-stone-900">Thông tin người đặt</h2>
          <div class="mt-4 space-y-3">
            <div>
              <label class="mb-1 block text-sm text-stone-600">Họ và tên</label>
              <input
                v-model.trim="bookingForm.customerName"
                type="text"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm text-stone-600">Số điện thoại</label>
              <input
                v-model.trim="bookingForm.customerPhone"
                type="tel"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm text-stone-600">Email</label>
              <input
                v-model.trim="bookingForm.customerEmail"
                type="email"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label class="mb-1 block text-sm text-stone-600">Ghi chú</label>
              <textarea
                v-model.trim="bookingForm.note"
                rows="3"
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-500"
              ></textarea>
            </div>
          </div>

          <h3 class="mt-6 text-lg font-semibold text-stone-900">Chọn dịch vụ kèm theo</h3>
          <div class="mt-3 space-y-2">
            <label
              v-for="service in services"
              :key="service.serviceId"
              class="flex items-center justify-between rounded-xl border border-stone-200 px-3 py-2 text-sm"
            >
              <div class="flex items-center gap-2">
                <input
                  v-model="bookingForm.serviceIds"
                  type="checkbox"
                  :value="service.serviceId"
                  class="h-4 w-4 accent-stone-900"
                />
                <span>{{ service.serviceName }}</span>
              </div>
              <span class="font-medium text-stone-700">{{ formatPrice(service.unitPrice) }}</span>
            </label>
          </div>

          <div class="mt-6 rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
            <h4 class="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Tổng tiền</h4>
            <p v-if="!quote" class="mt-2 text-sm text-stone-500">
              Chọn phòng và bấm “Tính tổng tiền”.
            </p>

            <div v-else class="mt-2 space-y-2 text-sm text-stone-700">
              <div class="flex items-center justify-between">
                <span>Phòng {{ quote.room.roomNumber }} ({{ quote.nights }} đêm)</span>
                <span>{{ formatPrice(quote.price.roomCost) }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span>Dịch vụ kèm theo</span>
                <span>{{ formatPrice(quote.price.servicesCost) }}</span>
              </div>
              <div class="border-t border-stone-200 pt-2">
                <div class="flex items-center justify-between font-semibold text-stone-900">
                  <span>Tổng cộng</span>
                  <span>{{ formatPrice(quote.price.totalCost) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 flex gap-3">
            <button
              type="button"
              @click="calculateQuote"
              :disabled="loadingQuote || !selectedRoomId"
              class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 disabled:opacity-60"
            >
              {{ loadingQuote ? 'Đang tính...' : 'Tính tổng tiền' }}
            </button>
            <button
              type="button"
              @click="submitBooking"
              :disabled="submitting || !quote"
              class="w-full rounded-2xl bg-stone-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {{ submitting ? 'Đang đặt...' : 'Đặt phòng' }}
            </button>
          </div>

          <p v-if="successMessage" class="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
            {{ successMessage }}
          </p>
        </section>
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
