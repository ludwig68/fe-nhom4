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
  <div class="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-stone-800">Lịch sử đặt phòng</h1>
        <div class="mt-2 flex gap-4 text-sm">
          <RouterLink to="/" class="font-medium text-stone-500 hover:text-stone-900">Về trang chủ</RouterLink>
          <span class="text-stone-300">|</span>
          <RouterLink to="/booking" class="font-medium text-stone-500 hover:text-stone-900">Đặt phòng mới</RouterLink>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <label class="text-sm font-medium text-stone-700">Trạng thái:</label>
        <select v-model="selectedStatus" @change="fetchBookings()" class="rounded-md border border-stone-300 bg-white py-1.5 pl-3 pr-8 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500">
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Thông báo lỗi/thành công -->
    <div v-if="successMessage" class="mb-4 rounded-md bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
      {{ errorMessage }}
    </div>

    <div v-if="loading" class="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 shadow-sm">
      Đang tải danh sách...
    </div>
    <div v-else-if="bookings.length === 0" class="flex h-64 flex-col items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 shadow-sm">
      <p>Chưa có đơn đặt phòng nào.</p>
      <RouterLink to="/rooms" class="mt-4 rounded-md bg-stone-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-700">
        Tìm phòng ngay
      </RouterLink>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="booking in bookings" :key="booking.bookingId" class="flex flex-col rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div class="mb-3 flex items-start justify-between">
          <div>
            <span class="text-xs font-semibold text-stone-500 uppercase tracking-widest">Mã đơn</span>
            <h3 class="text-lg font-bold text-stone-900">{{ booking.bookingCode }}</h3>
          </div>
          <span :class="statusBadgeClass(booking.status)">
            {{ booking.status }}
          </span>
        </div>

        <div class="mb-4 space-y-2 text-sm text-stone-600">
          <div class="flex justify-between border-b border-stone-100 pb-2">
            <span>Chi nhánh:</span>
            <span class="font-medium text-stone-900">{{ booking.branch.branchName }}</span>
          </div>
          <div class="flex justify-between border-b border-stone-100 pb-2">
            <span>Phòng:</span>
            <span class="font-medium text-stone-900">
              <span v-if="booking.room">{{ booking.roomType.typeName }} - {{ booking.room.roomNumber }}</span>
              <span v-else>{{ booking.roomType.typeName }} (Chưa phân)</span>
            </span>
          </div>
          <div class="flex justify-between border-b border-stone-100 pb-2">
            <span>Thời gian lưu trú:</span>
            <span class="font-medium text-stone-900">{{ formatDate(booking.checkIn) }} ➔ {{ formatDate(booking.checkOut) }}</span>
          </div>
          <div class="flex justify-between pt-1">
            <span class="font-medium text-stone-900">Tổng tiền:</span>
            <span class="text-base font-bold text-stone-900">{{ formatPrice(booking.totalPrice) }}</span>
          </div>
        </div>

        <div class="mt-auto pt-4 border-t border-stone-100 flex items-center gap-2">
          <RouterLink :to="buildDetailPath(booking)" class="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 text-center text-sm font-medium text-stone-700 transition hover:bg-stone-50">
            Xem chi tiết
          </RouterLink>
          
          <button 
            v-if="canCancel(booking.status)" 
            @click="handleCancel(booking.bookingId, booking.bookingCode)"
            :disabled="cancellingId === booking.bookingId"
            class="flex-1 rounded-md bg-red-50 text-red-700 border border-red-200 px-3 py-2 text-sm font-medium transition hover:bg-red-100 disabled:opacity-50"
          >
            {{ cancellingId === booking.bookingId ? 'Đang hủy...' : 'Hủy đơn' }}
          </button>
        </div>
      </div>
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
