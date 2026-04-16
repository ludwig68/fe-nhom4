<template>
  <div class="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white px-4 py-10">
    <div class="mx-auto max-w-7xl">
      <!-- Breadcrumb -->
      <div class="mb-6 flex items-center justify-between">
        <RouterLink to="/" class="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-900 hover:text-white hover:ring-stone-900">
          <span class="transition group-hover:-translate-x-0.5">←</span>
          Về trang chủ
        </RouterLink>
        <RouterLink to="/rooms" class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-900 hover:text-white hover:ring-stone-900">
          Xem chi tiết phòng
          <span class="transition group-hover:translate-x-0.5">→</span>
        </RouterLink>
      </div>

      <!-- Progress Steps -->
      <div class="mb-8 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 items-center">
            <div :class="['flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300', availableRooms.length > 0 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600']">1</div>
            <span class="ml-2 hidden text-sm font-medium text-stone-700 sm:inline">Tìm phòng</span>
          </div>
          <div class="mx-2 h-px flex-1 bg-stone-200"></div>
          <div class="flex flex-1 items-center">
            <div :class="['flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300', selectedRoomId ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600']">2</div>
            <span class="ml-2 hidden text-sm font-medium text-stone-700 sm:inline">Chọn phòng</span>
          </div>
          <div class="mx-2 h-px flex-1 bg-stone-200"></div>
          <div class="flex flex-1 items-center">
            <div :class="['flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300', quote ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600']">3</div>
            <span class="ml-2 hidden text-sm font-medium text-stone-700 sm:inline">Xác nhận</span>
          </div>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <!-- Left Panel: Search & Rooms -->
        <section class="space-y-6">
          <!-- Search Card -->
          <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <div class="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-lg text-white">🔍</div>
                <div>
                  <h1 class="text-xl font-semibold text-stone-900">Đặt phòng</h1>
                  <p class="text-sm text-stone-500">Tìm phòng trống theo ngày, chọn phòng phù hợp, thêm dịch vụ và xác nhận đặt phòng.</p>
                </div>
              </div>
            </div>

            <form class="p-6" @submit.prevent="searchAvailableRooms">
              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <!-- Ngày nhận -->
                <div class="group">
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">📅</span> Ngày nhận phòng
                  </label>
                  <input
                    v-model="searchForm.checkIn"
                    type="date"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                <!-- Ngày trả -->
                <div class="group">
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">📅</span> Ngày trả phòng
                  </label>
                  <input
                    v-model="searchForm.checkOut"
                    type="date"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                <!-- Chi nhánh -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">🏢</span> Chi nhánh
                  </label>
                  <select
                    v-model="searchForm.branchId"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  >
                    <option value="">Tất cả</option>
                    <option v-for="branch in meta.branches" :key="branch.branchId" :value="String(branch.branchId)">
                      {{ branch.branchName }}
                    </option>
                  </select>
                </div>

                <!-- Loại phòng -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">🛏️</span> Loại phòng
                  </label>
                  <select
                    v-model="searchForm.typeId"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  >
                    <option value="">Tất cả</option>
                    <option v-for="type in meta.roomTypes" :key="type.typeId" :value="String(type.typeId)">
                      {{ type.typeName }}
                    </option>
                  </select>
                </div>

                <!-- Sức chứa -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">👥</span> Sức chứa
                  </label>
                  <input
                    v-model="searchForm.capacity"
                    type="number"
                    min="1"
                    placeholder="Ví dụ: 2"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                <!-- Giá từ -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">💰</span> Giá từ
                  </label>
                  <input
                    v-model="searchForm.minPrice"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                <!-- Đến giá -->
                <div>
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">💰</span> Đến giá
                  </label>
                  <input
                    v-model="searchForm.maxPrice"
                    type="number"
                    min="0"
                    class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                  />
                </div>

                <!-- Buttons -->
                <div class="flex items-end gap-2">
                  <button
                    type="submit"
                    :disabled="loadingRooms"
                    class="w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-md shadow-stone-300/50 transition hover:bg-stone-700 hover:shadow-lg disabled:opacity-60"
                  >
                    {{ loadingRooms ? '⏳ Đang tìm...' : '🔍 Xem phòng trống' }}
                  </button>
                  <button
                    type="button"
                    @click="resetSearch"
                    class="rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-700 transition hover:bg-stone-100"
                  >
                    Reset
                  </button>
                </div>

                <!-- Tiện nghi -->
                <div class="sm:col-span-2 lg:col-span-4">
                  <label class="mb-2 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                    <span class="text-base">✨</span> Tiện nghi mong muốn
                  </label>
                  <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    <label
                      v-for="amenity in meta.amenities"
                      :key="amenity.amenityId"
                      class="flex cursor-pointer items-center gap-2.5 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 transition hover:border-stone-400 hover:bg-white"
                    >
                      <input
                        v-model="searchForm.amenityIds"
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
          </div>

          <!-- Error -->
          <p v-if="errorMessage" class="flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
            <span class="text-base">⚠️</span> {{ errorMessage }}
          </p>

          <!-- Available Rooms -->
          <div>
            <div class="mb-4 flex items-center justify-between">
              <h2 class="flex items-center gap-2 text-lg font-semibold text-stone-900">
                <span class="text-xl">🏨</span> Phòng trống
              </h2>
              <span class="rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">{{ availableRooms.length }} phòng</span>
            </div>

            <div v-if="availableRooms.length === 0" class="rounded-2xl border-2 border-dashed border-stone-200 px-6 py-12 text-center">
              <div class="text-4xl">🏠</div>
              <p class="mt-3 text-sm font-medium text-stone-500">Chưa có kết quả</p>
              <p class="mt-1 text-xs text-stone-400">Hãy chọn ngày và bấm "Xem phòng trống".</p>
            </div>

            <div v-else class="grid gap-4 lg:grid-cols-2">
              <article
                v-for="room in availableRooms"
                :key="room.roomId"
                @click="selectRoom(room)"
                :class="[
                  'group cursor-pointer rounded-2xl border-2 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md',
                  selectedRoomId === String(room.roomId)
                    ? 'border-stone-900 bg-stone-50 shadow-md ring-1 ring-stone-900/10'
                    : 'border-stone-200 bg-white hover:border-stone-400'
                ]"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <div class="flex items-center gap-2">
                      <h3 class="font-semibold text-stone-900">Phòng {{ room.roomNumber }}</h3>
                      <span v-if="selectedRoomId === String(room.roomId)" class="flex h-5 w-5 items-center justify-center rounded-full bg-stone-900 text-xs text-white">✓</span>
                    </div>
                    <p class="mt-1 text-sm text-stone-500">{{ room.branchName }}</p>
                  </div>
                  <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                    <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    {{ room.status }}
                  </span>
                </div>

                <p class="mt-3 text-sm text-stone-600">{{ room.roomType }} · {{ room.capacity }} người</p>
                <p class="mt-1 text-xl font-bold text-stone-900">{{ formatPrice(room.pricePerNight) }}<span class="text-sm font-normal text-stone-400">/đêm</span></p>

                <div class="mt-3 flex flex-wrap gap-1.5">
                  <span
                    v-for="amenity in (room.amenities || []).slice(0, 4)"
                    :key="amenity.amenityId"
                    class="rounded-lg bg-stone-100 px-2 py-1 text-xs text-stone-600"
                  >
                    {{ amenity.amenityName }}
                  </span>
                </div>

                <button
                  type="button"
                  @click.stop="selectRoom(room)"
                  :class="[
                    'mt-4 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    selectedRoomId === String(room.roomId)
                      ? 'bg-stone-900 text-white'
                      : 'border border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white'
                  ]"
                >
                  {{ selectedRoomId === String(room.roomId) ? '✓ Đã chọn phòng này' : 'Chọn phòng này' }}
                </button>
              </article>
            </div>
          </div>
        </section>

        <!-- Right Panel: Booking Form -->
        <section class="space-y-6">
          <!-- Customer Info -->
          <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <div class="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-lg text-white">👤</div>
                <h2 class="text-lg font-semibold text-stone-900">Thông tin người đặt</h2>
              </div>
            </div>

            <div class="space-y-4 p-6">
              <div>
                <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                  <span>👤</span> Họ và tên
                </label>
                <input
                  v-model.trim="bookingForm.customerName"
                  type="text"
                  class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                  <span>📞</span> Số điện thoại
                </label>
                <input
                  v-model.trim="bookingForm.customerPhone"
                  type="tel"
                  class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                  <span>✉️</span> Email
                </label>
                <input
                  v-model.trim="bookingForm.customerEmail"
                  type="email"
                  class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label class="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-stone-600">
                  <span>📝</span> Ghi chú
                </label>
                <textarea
                  v-model.trim="bookingForm.note"
                  rows="3"
                  placeholder="Yêu cầu đặc biệt, ghi chú cho khách sạn..."
                  class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Services -->
          <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <div class="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-lg text-white">🛎️</div>
                <h3 class="text-lg font-semibold text-stone-900">Chọn dịch vụ kèm theo</h3>
              </div>
            </div>

            <div class="space-y-2 p-4">
              <label
                v-for="service in services"
                :key="service.serviceId"
                :class="[
                  'flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition-all',
                  bookingForm.serviceIds.includes(service.serviceId)
                    ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900/10'
                    : 'border-stone-200 hover:border-stone-400 hover:bg-stone-50'
                ]"
              >
                <div class="flex items-center gap-3">
                  <input
                    v-model="bookingForm.serviceIds"
                    type="checkbox"
                    :value="service.serviceId"
                    class="h-4 w-4 rounded accent-stone-900"
                  />
                  <span class="font-medium text-stone-700">{{ service.serviceName }}</span>
                </div>
                <span class="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-700">{{ formatPrice(service.unitPrice) }}</span>
              </label>
            </div>
          </div>

          <!-- Quote / Total -->
          <div class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
            <div class="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white px-6 py-5">
              <div class="flex items-center gap-3">
                <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-stone-900 text-lg text-white">🧾</div>
                <h4 class="text-sm font-semibold uppercase tracking-widest text-stone-500">Tổng tiền</h4>
              </div>
            </div>

            <div class="p-6">
              <div v-if="!quote" class="rounded-xl bg-stone-50 px-4 py-6 text-center">
                <div class="text-2xl">💳</div>
                <p class="mt-2 text-sm text-stone-500">Chọn phòng và bấm "Tính tổng tiền".</p>
              </div>

              <div v-else class="space-y-3 text-sm">
                <div class="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-stone-700">
                  <span>🛏️ Phòng {{ quote.room.roomNumber }} ({{ quote.nights }} đêm)</span>
                  <span class="font-medium">{{ formatPrice(quote.price.roomCost) }}</span>
                </div>
                <div class="flex items-center justify-between rounded-lg bg-stone-50 px-3 py-2 text-stone-700">
                  <span>🛎️ Dịch vụ kèm theo</span>
                  <span class="font-medium">{{ formatPrice(quote.price.servicesCost) }}</span>
                </div>
                <div class="border-t-2 border-dashed border-stone-200 pt-3">
                  <div class="flex items-center justify-between">
                    <span class="text-base font-bold text-stone-900">Tổng cộng</span>
                    <span class="text-2xl font-bold text-stone-900">{{ formatPrice(quote.price.totalCost) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              type="button"
              @click="calculateQuote"
              :disabled="loadingQuote || !selectedRoomId"
              class="w-full rounded-xl border-2 border-stone-300 px-4 py-3.5 text-sm font-semibold text-stone-700 transition hover:border-stone-500 hover:bg-stone-50 disabled:opacity-50"
            >
              {{ loadingQuote ? '⏳ Đang tính...' : '🧮 Tính tổng tiền' }}
            </button>
            <button
              type="button"
              @click="submitBooking"
              :disabled="submitting || !quote"
              class="w-full rounded-xl bg-stone-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-stone-300/50 transition hover:bg-stone-700 hover:shadow-xl disabled:opacity-50"
            >
              {{ submitting ? '⏳ Đang đặt...' : '✅ Đặt phòng' }}
            </button>
          </div>

          <!-- Success -->
          <p v-if="successMessage" class="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
            <span>🎉</span> {{ successMessage }}
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
