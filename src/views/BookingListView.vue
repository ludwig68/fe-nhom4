<!--
  =============================================================
  FILE: frontend/src/views/BookingListView.vue
  MÔ TẢ: Trang lịch sử đặt phòng của user
  ROUTE: /my-bookings (requiresAuth)
  
  CHỨC NĂNG:
  - Hiển thị danh sách booking của user hiện tại
  - Lọc theo trạng thái (tất cả, chờ xác nhận, đã xác nhận, ...)
  - Bấm vào từng booking → chuyển sang trang chi tiết
  - Có nút hủy đơn (nếu trạng thái cho phép)
  =============================================================
-->

<template>
  <div class="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white px-4 py-10">
    <div class="mx-auto max-w-5xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <RouterLink to="/" class="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-900 hover:text-white hover:ring-stone-900">
          <span class="transition group-hover:-translate-x-0.5">←</span>
          Về trang chủ
        </RouterLink>
        <RouterLink to="/booking" class="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-stone-300/50 transition hover:bg-stone-700 hover:shadow-lg">
          <span>+</span> Đặt phòng mới
        </RouterLink>
      </div>

      <!-- Title -->
      <div class="mb-6">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-xl text-white">📋</div>
          <div>
            <h1 class="text-2xl font-semibold text-stone-900">Lịch sử đặt phòng</h1>
            <p class="text-sm text-stone-500">Xem và quản lý các đơn đặt phòng của bạn</p>
          </div>
        </div>
      </div>

      <!-- Latest booking banner -->
      <div
        v-if="latestBooking"
        class="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-50/50 px-5 py-4 shadow-sm"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg">🎉</div>
          <div>
            <p class="text-sm text-emerald-700">Mã đơn vừa tạo:</p>
            <p class="text-lg font-bold text-emerald-800">{{ latestBooking.bookingCode }}</p>
          </div>
        </div>
        <RouterLink :to="buildDetailPath(latestBooking)" class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
          Xem chi tiết →
        </RouterLink>
      </div>

      <!-- Status filter tabs -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          @click="selectedStatus = opt.value; fetchBookings()"
          :class="[
            'rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200',
            selectedStatus === opt.value
              ? 'bg-stone-900 text-white shadow-md shadow-stone-300/50'
              : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-50 hover:ring-stone-300'
          ]"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200">
        <div class="text-3xl">⏳</div>
        <p class="mt-3 text-sm text-stone-500">Đang tải danh sách đơn đặt phòng...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="bookings.length === 0" class="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200">
        <div class="text-4xl">📭</div>
        <p class="mt-3 text-lg font-medium text-stone-700">Chưa có đơn đặt phòng nào</p>
        <p class="mt-2 text-sm text-stone-500">Hãy đặt phòng để bắt đầu trải nghiệm!</p>
        <RouterLink
          to="/booking"
          class="mt-5 inline-flex items-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-stone-300/50 transition hover:bg-stone-700"
        >
          🛏️ Đặt phòng ngay
        </RouterLink>
      </div>

      <!-- Booking List -->
      <div v-else class="space-y-4">
        <article
          v-for="booking in bookings"
          :key="booking.bookingId"
          class="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition-all duration-300 hover:shadow-md"
        >
          <div class="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
            <!-- Main Info -->
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-3">
                <h3 class="text-lg font-bold text-stone-900">
                  {{ booking.bookingCode }}
                </h3>
                <span :class="statusBadgeClass(booking.status)">
                  {{ booking.status }}
                </span>
              </div>

              <div class="mt-4 grid gap-3 text-sm text-stone-600 sm:grid-cols-2">
                <div class="flex items-center gap-2">
                  <span class="text-base">🏢</span>
                  <div>
                    <span class="font-medium text-stone-700">Chi nhánh:</span>
                    {{ booking.branch.branchName }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base">🛏️</span>
                  <div>
                    <span class="font-medium text-stone-700">Phòng:</span>
                    {{ booking.roomType.typeName }} · {{ booking.room?.roomNumber || 'Chưa phân phòng' }}
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base">📅</span>
                  <div>
                    <span class="font-medium text-stone-700">Nhận phòng:</span>
                    {{ formatDate(booking.checkIn) }} ({{ booking.checkInTime }})
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base">📅</span>
                  <div>
                    <span class="font-medium text-stone-700">Trả phòng:</span>
                    {{ formatDate(booking.checkOut) }} ({{ booking.checkOutTime }})
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base">💰</span>
                  <div>
                    <span class="font-medium text-stone-700">Tổng tiền:</span>
                    <span class="text-base font-bold text-stone-900">{{ formatPrice(booking.totalPrice) }}</span>
                  </div>
                </div>
                <div v-if="booking.services.length > 0" class="flex items-center gap-2">
                  <span class="text-base">🛎️</span>
                  <div>
                    <span class="font-medium text-stone-700">Dịch vụ:</span>
                    {{ booking.services.map(s => s.serviceName).join(', ') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex flex-shrink-0 gap-2 sm:flex-col">
              <RouterLink
                :to="buildDetailPath(booking)"
                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-stone-300 px-4 py-2.5 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-900 hover:text-white hover:ring-stone-900"
              >
                Chi tiết →
              </RouterLink>
              <button
                v-if="canCancel(booking.status)"
                @click="handleCancel(booking.bookingId, booking.bookingCode)"
                :disabled="cancellingId === booking.bookingId"
                class="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-center text-sm font-medium text-rose-600 transition hover:bg-rose-100 disabled:opacity-60"
              >
                {{ cancellingId === booking.bookingId ? '⏳ Đang hủy...' : '✕ Hủy đơn' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Messages -->
      <p v-if="successMessage" class="mt-5 flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
        <span>✅</span> {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="mt-5 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
        <span>⚠️</span> {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { bookingService } from '@/services/booking.service';
import { parseApiError } from '@/utils/api-error';

const authStore = useAuthStore();
const loading = ref(true);
const bookings = ref([]);
const selectedStatus = ref('');
const successMessage = ref('');
const errorMessage = ref('');
const cancellingId = ref(null);
const latestBookingCode = ref(localStorage.getItem('latestBookingCode') || '');

const latestBooking = computed(() => {
  if (!latestBookingCode.value) {
    return null;
  }
  return bookings.value.find((item) => item.bookingCode === latestBookingCode.value) || null;
});

// Các tùy chọn lọc trạng thái
const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'chờ xác nhận', label: 'Chờ xác nhận' },
  { value: 'đã xác nhận', label: 'Đã xác nhận' },
  { value: 'đã check-in', label: 'Đã check-in' },
  { value: 'đã check-out', label: 'Đã check-out' },
  { value: 'đã hủy', label: 'Đã hủy' }
];

/**
 * Kiểm tra booking có thể hủy không
 * - USER: chỉ hủy được đơn 'chờ xác nhận'
 * - STAFF/ADMIN: hủy được đơn 'chờ xác nhận' và 'đã xác nhận'
 */
const canCancel = (status) => {
  const role = authStore.user?.role_name;
  if (role === 'ADMIN' || role === 'STAFF') {
    return status === 'chờ xác nhận' || status === 'đã xác nhận';
  }
  return status === 'chờ xác nhận';
};

/**
 * CSS class cho badge trạng thái
 */
const statusBadgeClass = (status) => {
  const base = 'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1';
  const map = {
    'chờ xác nhận': 'bg-amber-50 text-amber-700 ring-amber-200',
    'đã xác nhận': 'bg-blue-50 text-blue-700 ring-blue-200',
    'đã check-in': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    'đã check-out': 'bg-stone-100 text-stone-600 ring-stone-200',
    'đã hủy': 'bg-rose-50 text-rose-700 ring-rose-200'
  };
  return `${base} ${map[status] || 'bg-stone-100 text-stone-600 ring-stone-200'}`;
};

/**
 * Format ngày: 2026-04-05 → 05/04/2026
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

/**
 * Format giá tiền
 */
const formatPrice = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString('vi-VN') + 'đ';
};

const buildDetailPath = (booking) => {
  const id = booking?.bookingCode || booking?.bookingId;
  return `/my-bookings/${encodeURIComponent(String(id || ''))}`;
};

/**
 * Lấy danh sách booking
 */
const fetchBookings = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    const params = {};
    if (selectedStatus.value) {
      params.status = selectedStatus.value;
    }
    const res = await bookingService.getMyBookings(params);
    bookings.value = res.data?.data || [];

    if (latestBookingCode.value) {
      const stillExists = bookings.value.some((item) => item.bookingCode === latestBookingCode.value);
      if (!stillExists) {
        latestBookingCode.value = '';
        localStorage.removeItem('latestBookingCode');
      }
    }
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Không thể tải lịch sử đặt phòng');
  } finally {
    loading.value = false;
  }
};

/**
 * Xử lý hủy đơn
 */
const handleCancel = async (bookingId, bookingCode) => {
  if (!confirm(`Bạn có chắc muốn hủy đơn ${bookingCode}?`)) {
    return;
  }

  cancellingId.value = bookingId;
  errorMessage.value = '';
  successMessage.value = '';

  try {
    const res = await bookingService.cancelBooking(bookingId);
    successMessage.value = res.data?.message || 'Hủy đơn thành công';
    // Refresh danh sách
    await fetchBookings();
  } catch (error) {
    errorMessage.value = parseApiError(error, 'Hủy đơn thất bại');
  } finally {
    cancellingId.value = null;
  }
};

onMounted(() => {
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.fetchMe().finally(() => fetchBookings());
  } else {
    fetchBookings();
  }
});
</script>
