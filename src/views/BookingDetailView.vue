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
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <RouterLink to="/my-bookings" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Về danh sách đơn
        </RouterLink>
        <RouterLink to="/" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          Về trang chủ
        </RouterLink>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="rounded-3xl bg-white p-8 text-center text-stone-500 ring-1 ring-stone-200">
        Đang tải chi tiết đơn đặt phòng...
      </div>

      <!-- Lỗi -->
      <div v-else-if="errorMessage" class="rounded-3xl bg-rose-50 p-8 text-center text-rose-600 ring-1 ring-rose-200">
        <p class="text-lg font-medium">{{ errorMessage }}</p>
        <RouterLink to="/my-bookings" class="mt-4 inline-block text-sm underline">Về danh sách đơn</RouterLink>
      </div>

      <!-- Chi tiết booking -->
      <div v-else-if="booking" class="space-y-6">
        <!-- Header đơn -->
        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm text-stone-500">Mã đơn đặt phòng</p>
              <h1 class="text-2xl font-semibold text-stone-900">{{ booking.bookingCode }}</h1>
            </div>
            <span :class="statusBadgeClass(booking.status)">
              {{ booking.status }}
            </span>
          </div>
        </section>

        <!-- Thông tin phòng + chi nhánh -->
        <section class="grid gap-6 sm:grid-cols-2">
          <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 class="text-lg font-semibold text-stone-900">Thông tin phòng</h2>
            <div class="mt-4 space-y-3 text-sm">
              <p><span class="font-medium text-stone-500">Chi nhánh:</span> {{ booking.branch.branchName }}</p>
              <p v-if="booking.branch.address"><span class="font-medium text-stone-500">Địa chỉ:</span> {{ booking.branch.address }}</p>
              <p><span class="font-medium text-stone-500">Loại phòng:</span> {{ booking.roomType.typeName }}</p>
              <p><span class="font-medium text-stone-500">Phòng:</span> {{ booking.room?.roomNumber || 'Chưa phân phòng' }}</p>
              <p><span class="font-medium text-stone-500">Sức chứa:</span> {{ booking.roomType.capacity }} người</p>
            </div>
          </div>

          <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 class="text-lg font-semibold text-stone-900">Thời gian lưu trú</h2>
            <div class="mt-4 space-y-3 text-sm">
              <p>
                <span class="font-medium text-stone-500">Nhận phòng:</span>
                {{ formatDate(booking.checkIn) }} lúc {{ booking.checkInTime || '14:00' }}
              </p>
              <p>
                <span class="font-medium text-stone-500">Trả phòng:</span>
                {{ formatDate(booking.checkOut) }} lúc {{ booking.checkOutTime || '12:00' }}
              </p>
              <p class="text-base font-semibold text-stone-900">
                Tổng số đêm: {{ booking.nights }}
              </p>
              <p v-if="booking.actualCheckIn">
                <span class="font-medium text-stone-500">Thực nhận:</span> {{ formatDateTime(booking.actualCheckIn) }}
              </p>
              <p v-if="booking.actualCheckOut">
                <span class="font-medium text-stone-500">Thực trả:</span> {{ formatDateTime(booking.actualCheckOut) }}
              </p>
            </div>
          </div>
        </section>

        <!-- Giá chi tiết -->
        <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 class="text-lg font-semibold text-stone-900">Chi tiết giá</h2>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-stone-600">Giá phòng / đêm</span>
              <span class="font-medium">{{ formatPrice(booking.roomType.basePrice) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-stone-600">Số đêm</span>
              <span class="font-medium">{{ booking.nights }}</span>
            </div>
            <div class="flex justify-between border-t border-stone-100 pt-2">
              <span class="text-stone-600">Thành tiền phòng</span>
              <span class="font-medium">{{ formatPrice(booking.roomType.basePrice * booking.nights) }}</span>
            </div>

            <!-- Dịch vụ -->
            <div v-if="booking.services.length > 0" class="border-t border-stone-100 pt-2">
              <p class="font-medium text-stone-700">Dịch vụ kèm theo:</p>
              <div v-for="svc in booking.services" :key="svc.serviceId" class="ml-4 mt-1 flex justify-between text-stone-600">
                <span>{{ svc.serviceName }} ({{ formatDate(svc.dateToUse) }})</span>
                <span>{{ formatPrice(getServicePrice(svc.serviceId)) }}</span>
              </div>
            </div>

            <!-- Tổng cộng -->
            <div class="flex justify-between border-t border-stone-200 pt-3 text-base font-semibold text-stone-900">
              <span>Tổng cộng</span>
              <span>{{ formatPrice(booking.totalPrice) }}</span>
            </div>
          </div>
        </section>

        <!-- Dịch vụ chi tiết -->
        <section v-if="booking.services.length > 0" class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 class="text-lg font-semibold text-stone-900">Dịch vụ đã chọn</h2>
          <div class="mt-4 space-y-3">
            <div
              v-for="svc in booking.services"
              :key="svc.serviceId"
              class="flex items-center justify-between rounded-xl bg-stone-50 p-4 ring-1 ring-stone-200"
            >
              <div>
                <p class="font-medium text-stone-900">{{ svc.serviceName }}</p>
                <p class="text-sm text-stone-500">{{ svc.serviceDescription || '' }}</p>
                <p class="mt-1 text-xs text-stone-400">
                  Ngày: {{ formatDate(svc.dateToUse) }} · Giờ: {{ svc.timeServiceStart || '09:00' }}
                </p>
              </div>
              <span class="font-semibold text-stone-900">{{ formatPrice(getServicePrice(svc.serviceId)) }}</span>
            </div>
          </div>
        </section>

        <!-- Thông tin khách hàng + nhân viên -->
        <section class="grid gap-6 sm:grid-cols-2">
          <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 class="text-lg font-semibold text-stone-900">Thông tin người đặt</h2>
            <div class="mt-4 space-y-2 text-sm">
              <p><span class="font-medium text-stone-500">Họ tên:</span> {{ booking.customer.name }}</p>
              <p><span class="font-medium text-stone-500">Email:</span> {{ booking.customer.email }}</p>
              <p><span class="font-medium text-stone-500">SĐT:</span> {{ booking.customer.phone }}</p>
            </div>
            <p v-if="booking.note" class="mt-4 text-sm text-stone-500">
              <span class="font-medium">Ghi chú:</span> {{ booking.note }}
            </p>
          </div>

          <div class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 class="text-lg font-semibold text-stone-900">Nhân viên xác nhận</h2>
            <div v-if="booking.staff" class="mt-4 space-y-2 text-sm">
              <p><span class="font-medium text-stone-500">Họ tên:</span> {{ booking.staff.name }}</p>
              <p v-if="booking.staff.email"><span class="font-medium text-stone-500">Email:</span> {{ booking.staff.email }}</p>
            </div>
            <p v-else class="mt-4 text-sm text-stone-500">Chưa có nhân viên xác nhận</p>
          </div>
        </section>

        <!-- Nút hành động -->
        <section class="flex flex-wrap gap-3">
          <!-- Staff/Admin: Xác nhận -->
          <button
            v-if="canConfirm"
            @click="handleConfirm"
            :disabled="processing"
            class="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {{ processing ? 'Đang xử lý...' : '✓ Xác nhận đơn' }}
          </button>
          <!-- Staff/Admin: Check-in -->
          <button
            v-if="canCheckIn"
            @click="handleCheckIn"
            :disabled="processing"
            class="rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {{ processing ? 'Đang xử lý...' : '→ Check-in' }}
          </button>
          <!-- Staff/Admin: Check-out -->
          <button
            v-if="canCheckOut"
            @click="handleCheckOut"
            :disabled="processing"
            class="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {{ processing ? 'Đang xử lý...' : '← Check-out' }}
          </button>
          <!-- Hủy đơn -->
          <button
            v-if="canCancel"
            @click="handleCancel"
            :disabled="processing"
            class="rounded-xl border border-rose-300 px-5 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
          >
            {{ processing ? 'Đang xử lý...' : 'Hủy đơn' }}
          </button>
          <!-- User: Đánh giá (nếu đã check-out) -->
          <RouterLink
            v-if="canReview"
            :to="`/feedbacks?bookingId=${booking.bookingId}`"
            class="rounded-xl bg-amber-500 px-5 py-3 text-sm font-medium text-white hover:bg-amber-600"
          >
            ★ Đánh giá
          </RouterLink>
        </section>

        <!-- Thông báo -->
        <p v-if="successMessage" class="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
          {{ successMessage }}
        </p>
        <p v-if="errorMsg" class="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
          {{ errorMsg }}
        </p>
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
  const base = 'rounded-full px-3 py-1 text-sm font-medium ring-1';
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
