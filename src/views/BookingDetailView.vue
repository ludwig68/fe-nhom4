<!--
  =============================================================
  FILE: frontend/src/views/BookingDetailView.vue
  MÔ TẢ: Trang chi tiết đơn đặt phòng
  ROUTE: /my-bookings/:id (requiresAuth)
  
  HIỂN THỊ:
  - Mã đơn, trạng thái, ngày giờ nhận/trả phòng
  - Thông tin chi nhánh, loại phòng, số phòng
  - Giá chi tiết (số đêm × giá phòng + dịch vụ)
  - Danh sách dịch vụ kèm theo
  - Thông tin khách hàng, nhân viên xác nhận
  - Nút xác nhận (staff/admin), hủy đơn
  =============================================================
-->

<template>
  <div class="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="mb-6 flex items-center justify-between">
      <h1 class="text-2xl font-bold text-stone-800">Chi tiết đơn đặt phòng</h1>
      <div class="flex gap-4">
        <RouterLink to="/my-bookings" class="text-sm font-medium text-stone-500 hover:text-stone-900">Về danh sách đơn</RouterLink>
        <span class="text-stone-300">|</span>
        <RouterLink to="/" class="text-sm font-medium text-stone-500 hover:text-stone-900">Về trang chủ</RouterLink>
      </div>
    </div>

    <div v-if="loading" class="flex h-64 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-500 shadow-sm">
      Đang tải chi tiết đơn...
    </div>
    
    <div v-else-if="errorMessage" class="rounded-md bg-red-50 p-4 text-sm text-red-600 border border-red-200">
      {{ errorMessage }}
    </div>

    <div v-else-if="booking" class="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <!-- CỘT TRÁI: THÔNG TIN CHI TIẾT -->
      <div class="lg:col-span-2 space-y-6">
        
        <div class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <div class="mb-4 flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span class="text-xs font-semibold text-stone-500 uppercase tracking-widest">Mã đơn đặt phòng</span>
              <h2 class="text-2xl font-bold text-stone-900">{{ booking.bookingCode }}</h2>
            </div>
            <span class="rounded-full px-3 py-1.5 text-sm font-semibold border"
              :class="{
                'bg-amber-50 text-amber-700 border-amber-200': booking.status === 'chờ xác nhận',
                'bg-blue-50 text-blue-700 border-blue-200': booking.status === 'đã xác nhận',
                'bg-emerald-50 text-emerald-700 border-emerald-200': booking.status === 'đã check-in',
                'bg-stone-100 text-stone-600 border-stone-200': booking.status === 'đã check-out',
                'bg-red-50 text-red-700 border-red-200': booking.status === 'đã hủy'
              }"
            >
              {{ booking.status }}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <!-- Cột 1 -->
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-stone-800 uppercase tracking-wide">Thông tin phòng</h3>
                <div class="mt-2 space-y-2 text-sm text-stone-600">
                  <div class="flex justify-between"><span class="text-stone-500">Chi nhánh:</span> <span class="font-medium text-stone-900">{{ booking.branch.branchName }}</span></div>
                  <div class="flex justify-between"><span class="text-stone-500">Loại phòng:</span> <span class="font-medium text-stone-900">{{ booking.roomType.typeName }} (Chứa: {{ booking.roomType.capacity }})</span></div>
                  <div class="flex justify-between"><span class="text-stone-500">Số phòng:</span> <span class="font-medium text-stone-900">{{ booking.room?.roomNumber || 'Chưa phân' }}</span></div>
                </div>
              </div>

              <div>
                <h3 class="text-sm font-semibold text-stone-800 uppercase tracking-wide">Lịch trình ({{ booking.nights }} đêm)</h3>
                <div class="mt-2 rounded-md bg-stone-50 p-3 text-sm text-stone-700 border border-stone-100">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="w-16 font-medium text-stone-500">Nhận:</span>
                    <span class="font-medium">{{ formatDate(booking.checkIn) }}</span>
                    <span class="text-stone-400">lúc</span>
                    <span>{{ booking.checkInTime || '14:00' }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span class="w-16 font-medium text-stone-500">Trả:</span>
                    <span class="font-medium">{{ formatDate(booking.checkOut) }}</span>
                    <span class="text-stone-400">lúc</span>
                    <span>{{ booking.checkOutTime || '12:00' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Cột 2 -->
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-semibold text-stone-800 uppercase tracking-wide">Người đặt</h3>
                <div class="mt-2 space-y-2 text-sm text-stone-600">
                  <div class="flex justify-between"><span class="text-stone-500">Họ tên:</span> <span class="font-medium text-stone-900">{{ booking.customer.name }}</span></div>
                  <div class="flex justify-between"><span class="text-stone-500">SĐT:</span> <span class="font-medium text-stone-900">{{ booking.customer.phone }}</span></div>
                  <div class="flex flex-col"><span class="text-stone-500 mb-1">Email:</span> <span class="font-medium text-stone-900 truncate">{{ booking.customer.email }}</span></div>
                  <div class="flex flex-col mt-2 pt-2 border-t border-stone-100"><span class="text-stone-500 mb-1">Ghi chú:</span> <span class="italic text-stone-800">{{ booking.note || 'Không có ghi chú' }}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- BẢNG GIÁ & DỊCH VỤ -->
        <div class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
          <h3 class="mb-4 text-base font-semibold text-stone-800 uppercase tracking-wide border-b border-stone-100 pb-2">Chi tiết thanh toán</h3>
          
          <div class="space-y-3 text-sm">
            <!-- Các dịch vụ (nếu có) -->
            <div v-if="booking.services.length > 0" class="space-y-2">
              <div v-for="svc in booking.services" :key="svc.serviceId" class="flex justify-between text-stone-600">
                <span>Dịch vụ: {{ svc.serviceName }}</span>
                <span>{{ formatPrice(getServicePrice(svc.serviceId)) }}</span>
              </div>
            </div>
            
            <div class="flex justify-between pt-4 border-t border-stone-200 mt-4">
              <span class="text-base font-semibold text-stone-800">Tổng thanh toán:</span>
              <span class="text-2xl font-bold text-stone-900">{{ formatPrice(booking.totalPrice) }}</span>
            </div>
          </div>
        </div>

      </div>

      <!-- CỘT PHẢI: THAO TÁC -->
      <div class="lg:col-span-1">
        <div class="sticky top-24 space-y-4">
          <div class="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
            <h3 class="mb-4 text-base font-semibold text-stone-800 uppercase tracking-wide">Thao tác</h3>
            
            <div class="flex flex-col gap-3">
              <button v-if="canConfirm" @click="handleConfirm" :disabled="processing" class="w-full rounded-md bg-stone-900 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50">
                Xác nhận đơn
              </button>
              
              <button v-if="canCheckIn" @click="handleCheckIn" :disabled="processing" class="w-full rounded-md bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50">
                Check-in (Nhận phòng)
              </button>
              
              <button v-if="canCheckOut" @click="handleCheckOut" :disabled="processing" class="w-full rounded-md bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50">
                Check-out (Trả phòng)
              </button>
              
              <button v-if="canCancel" @click="handleCancel" :disabled="processing" class="w-full rounded-md border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
                Hủy đơn đặt phòng
              </button>
              
              <RouterLink v-if="canReview" :to="`/feedbacks?bookingId=${booking.bookingId}`" class="flex w-full items-center justify-center rounded-md border border-amber-200 bg-amber-50 py-2.5 text-sm font-semibold text-amber-700 transition hover:bg-amber-100">
                Đánh giá chất lượng
              </RouterLink>

              <div v-if="!canConfirm && !canCheckIn && !canCheckOut && !canCancel && !canReview" class="text-sm text-stone-500 text-center italic">
                Không có thao tác khả dụng ở trạng thái này.
              </div>
            </div>

            <!-- Thông báo thao tác -->
            <div v-if="successMessage" class="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-700 border border-emerald-200">
              {{ successMessage }}
            </div>
            <div v-if="errorMsg" class="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {{ errorMsg }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { bookingService } from '@/services/booking.service';
import { parseApiError } from '@/utils/api-error';

const route = useRoute();
const authStore = useAuthStore();

const loading = ref(true);
const booking = ref(null);
const successMessage = ref('');
const errorMsg = ref('');
const processing = ref(false);

// Bảng giá dịch vụ (giống backend)
const SERVICE_PRICE_MAP = {
  break_fast: 120000,
  dinner: 180000,
  massage: 250000
};

const STATUS_ORDER = ['chờ xác nhận', 'đã xác nhận', 'đã check-in', 'đã check-out'];

const isStatusPassed = (status) => {
  if (booking.value?.status === 'đã hủy') return false;
  const currentIndex = STATUS_ORDER.indexOf(booking.value?.status);
  const checkIndex = STATUS_ORDER.indexOf(status);
  return currentIndex >= checkIndex;
};

/**
 * Kiểm tra có quyền xác nhận không (role STAFF hoặc ADMIN)
 */
const canConfirm = computed(() => {
  const role = authStore.user?.role_name;
  return (role === 'ADMIN' || role === 'STAFF') && booking.value?.status === 'chờ xác nhận';
});

/**
 * Kiểm tra có thể check-in (staff/admin, đơn 'đã xác nhận')
 */
const canCheckIn = computed(() => {
  const role = authStore.user?.role_name;
  return (role === 'ADMIN' || role === 'STAFF') && booking.value?.status === 'đã xác nhận';
});

/**
 * Kiểm tra có thể check-out (staff/admin, đơn 'đã check-in')
 */
const canCheckOut = computed(() => {
  const role = authStore.user?.role_name;
  return (role === 'ADMIN' || role === 'STAFF') && booking.value?.status === 'đã check-in';
});

/**
 * Kiểm tra có thể đánh giá (user thường, đơn 'đã check-out')
 */
const canReview = computed(() => {
  const role = authStore.user?.role_name;
  return role === 'USER' && booking.value?.status === 'đã check-out';
});

/**
 * Kiểm tra có thể hủy đơn không
 */
const canCancel = computed(() => {
  const role = authStore.user?.role_name;
  if (role === 'ADMIN' || role === 'STAFF') {
    return booking.value?.status === 'chờ xác nhận' || booking.value?.status === 'đã xác nhận';
  }
  return booking.value?.status === 'chờ xác nhận';
});

const getServicePrice = (serviceId) => {
  return SERVICE_PRICE_MAP[serviceId] || 0;
};

const statusBadgeClass = (status) => {
  const base = 'inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold ring-1';
  const map = {
    'chờ xác nhận': 'bg-amber-50 text-amber-700 ring-amber-200',
    'đã xác nhận': 'bg-blue-50 text-blue-700 ring-blue-200',
    'đã check-in': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    'đã check-out': 'bg-stone-100 text-stone-600 ring-stone-200',
    'đã hủy': 'bg-rose-50 text-rose-700 ring-rose-200'
  };
  return `${base} ${map[status] || 'bg-stone-100 text-stone-600 ring-stone-200'}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const parts = String(dateStr).split('T')[0].split('-');
  if (parts.length !== 3) return String(dateStr);
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return String(dateStr).replace('T', ' ').slice(0, 16);
};

const formatPrice = (value) => {
  return Number(value || 0).toLocaleString('vi-VN') + 'đ';
};

/**
 * Load chi tiết booking
 */
const fetchDetail = async () => {
  loading.value = true;
  errorMsg.value = '';

  try {
    const res = await bookingService.getBookingDetail(route.params.id);
    booking.value = res.data?.data || null;

    if (!booking.value) {
      errorMsg.value = 'Không tìm thấy đơn đặt phòng';
    }
  } catch (error) {
    errorMsg.value = parseApiError(error, 'Không thể tải chi tiết đơn');
  } finally {
    loading.value = false;
  }
};

/**
 * Xác nhận đơn (staff/admin)
 */
const handleConfirm = async () => {
  if (!confirm('Xác nhận đơn đặt phòng này?')) return;

  processing.value = true;
  errorMsg.value = '';
  successMessage.value = '';

  try {
    const res = await bookingService.confirmBooking(booking.value.bookingId);
    successMessage.value = res.data?.message || 'Xác nhận thành công';
    await fetchDetail(); // Refresh
  } catch (error) {
    errorMsg.value = parseApiError(error, 'Xác nhận thất bại');
  } finally {
    processing.value = false;
  }
};

/**
 * Hủy đơn
 */
const handleCancel = async () => {
  if (!confirm(`Bạn có chắc muốn hủy đơn ${booking.value.bookingCode}?`)) return;

  processing.value = true;
  errorMsg.value = '';
  successMessage.value = '';

  try {
    const res = await bookingService.cancelBooking(booking.value.bookingId);
    successMessage.value = res.data?.message || 'Hủy đơn thành công';
    await fetchDetail();
  } catch (error) {
    errorMsg.value = parseApiError(error, 'Hủy đơn thất bại');
  } finally {
    processing.value = false;
  }
};

/**
 * Check-in (staff/admin)
 */
const handleCheckIn = async () => {
  if (!confirm(`Check-in đơn ${booking.value.bookingCode}?`)) return;

  processing.value = true;
  errorMsg.value = '';
  successMessage.value = '';

  try {
    const res = await bookingService.checkInBooking(booking.value.bookingId);
    successMessage.value = res.data?.message || 'Check-in thành công';
    await fetchDetail();
  } catch (error) {
    errorMsg.value = parseApiError(error, 'Check-in thất bại');
  } finally {
    processing.value = false;
  }
};

/**
 * Check-out (staff/admin)
 */
const handleCheckOut = async () => {
  if (!confirm(`Check-out đơn ${booking.value.bookingCode}?`)) return;

  processing.value = true;
  errorMsg.value = '';
  successMessage.value = '';

  try {
    const res = await bookingService.checkOutBooking(booking.value.bookingId);
    successMessage.value = res.data?.message || 'Check-out thành công';
    await fetchDetail();
  } catch (error) {
    errorMsg.value = parseApiError(error, 'Check-out thất bại');
  } finally {
    processing.value = false;
  }
};

onMounted(() => {
  // Đảm bảo user info đã load (để check role)
  if (authStore.isAuthenticated && !authStore.user) {
    authStore.fetchMe().finally(() => fetchDetail());
  } else {
    fetchDetail();
  }
});
</script>
