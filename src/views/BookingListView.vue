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
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto max-w-5xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <RouterLink to="/" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Về trang chủ
        </RouterLink>
        <RouterLink to="/booking" class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700">
          Đặt phòng mới
        </RouterLink>
      </div>

      <h1 class="text-2xl font-semibold text-stone-900">Lịch sử đặt phòng</h1>
      <p class="mt-2 text-sm text-stone-500">Xem và quản lý các đơn đặt phòng của bạn</p>

      <div
        v-if="latestBooking"
        class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800 ring-1 ring-emerald-200"
      >
        <p>
          Mã đơn vừa tạo:
          <span class="font-semibold">{{ latestBooking.bookingCode }}</span>
        </p>
        <RouterLink :to="buildDetailPath(latestBooking)" class="font-medium underline">
          Xem chi tiết
        </RouterLink>
      </div>

      <!-- Bộ lọc trạng thái -->
      <div class="mt-6 flex flex-wrap gap-2">
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          @click="selectedStatus = opt.value; fetchBookings()"
          :class="[
            'rounded-full px-4 py-2 text-sm font-medium transition',
            selectedStatus === opt.value
              ? 'bg-stone-900 text-white'
              : 'bg-white text-stone-600 ring-1 ring-stone-300 hover:bg-stone-100'
          ]"
        >
          {{ opt.label }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="mt-6 rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
        Đang tải danh sách đơn đặt phòng...
      </div>

      <!-- Không có đơn nào -->
      <div v-else-if="bookings.length === 0" class="mt-6 rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
        <p class="text-lg font-medium">Chưa có đơn đặt phòng nào</p>
        <p class="mt-2 text-sm">Hãy đặt phòng để bắt đầu trải nghiệm!</p>
        <RouterLink
          to="/booking"
          class="mt-4 inline-block rounded-xl bg-stone-900 px-5 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Đặt phòng ngay
        </RouterLink>
      </div>

      <!-- Danh sách booking -->
      <div v-else class="mt-6 space-y-4">
        <article
          v-for="booking in bookings"
          :key="booking.bookingId"
          class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:shadow-md"
        >
          <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <!-- Thông tin chính -->
            <div class="flex-1">
              <div class="flex flex-wrap items-center gap-3">
                <h3 class="text-lg font-semibold text-stone-900">
                  {{ booking.bookingCode }}
                </h3>
                <span :class="statusBadgeClass(booking.status)">
                  {{ booking.status }}
                </span>
              </div>

              <div class="mt-3 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
                <p>
                  <span class="font-medium text-stone-700">Chi nhánh:</span>
                  {{ booking.branch.branchName }}
                </p>
                <p>
                  <span class="font-medium text-stone-700">Phòng:</span>
                  {{ booking.roomType.typeName }} · {{ booking.room?.roomNumber || 'Chưa phân phòng' }}
                </p>
                <p>
                  <span class="font-medium text-stone-700">Nhận phòng:</span>
                  {{ formatDate(booking.checkIn) }} ({{ booking.checkInTime }})
                </p>
                <p>
                  <span class="font-medium text-stone-700">Trả phòng:</span>
                  {{ formatDate(booking.checkOut) }} ({{ booking.checkOutTime }})
                </p>
                <p>
                  <span class="font-medium text-stone-700">Tổng tiền:</span>
                  <span class="text-stone-900 font-semibold">{{ formatPrice(booking.totalPrice) }}</span>
                </p>
                <p v-if="booking.services.length > 0">
                  <span class="font-medium text-stone-700">Dịch vụ:</span>
                  {{ booking.services.map(s => s.serviceName).join(', ') }}
                </p>
              </div>
            </div>

            <!-- Nút hành động -->
            <div class="flex flex-shrink-0 gap-2 sm:flex-col">
              <RouterLink
                :to="buildDetailPath(booking)"
                class="rounded-xl border border-stone-300 px-4 py-2 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-100"
              >
                Chi tiết
              </RouterLink>
              <button
                v-if="canCancel(booking.status)"
                @click="handleCancel(booking.bookingId, booking.bookingCode)"
                :disabled="cancellingId === booking.bookingId"
                class="rounded-xl border border-rose-300 px-4 py-2 text-center text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {{ cancellingId === booking.bookingId ? 'Đang hủy...' : 'Hủy đơn' }}
              </button>
            </div>
          </div>
        </article>
      </div>

      <!-- Thông báo -->
      <p v-if="successMessage" class="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
        {{ successMessage }}
      </p>
      <p v-if="errorMessage" class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
        {{ errorMessage }}
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
  const base = 'rounded-full px-2 py-1 text-xs font-medium ring-1';
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
