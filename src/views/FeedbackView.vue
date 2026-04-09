<!--
  =============================================================
  FILE: frontend/src/views/FeedbackView.vue
  MÔ TẢ: Trang gửi đánh giá + xem danh sách đánh giá
  ROUTE: /feedbacks (requiresAuth), /feedbacks?bookingId=X
  
  CHỨC NĂNG:
  - Tab 1: Gửi đánh giá mới (chọn booking đã check-out chưa đánh giá)
  - Tab 2: Xem lịch sử đánh giá của mình
  =============================================================
-->

<template>
  <div class="min-h-screen bg-stone-50 px-4 py-10">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <RouterLink to="/my-bookings" class="text-sm font-medium text-stone-600 hover:text-stone-900">
          ← Về đơn đặt phòng
        </RouterLink>
      </div>

      <h1 class="text-2xl font-semibold text-stone-900">Đánh giá & Phản hồi</h1>

      <!-- Tabs -->
      <div class="mt-6 flex gap-2 border-b border-stone-200">
        <button
          @click="activeTab = 'submit'"
          :class="[
            'px-4 py-2 text-sm font-medium transition',
            activeTab === 'submit'
              ? 'border-b-2 border-stone-900 text-stone-900'
              : 'text-stone-500 hover:text-stone-700'
          ]"
        >
          Gửi đánh giá
        </button>
        <button
          @click="activeTab = 'history'"
          :class="[
            'px-4 py-2 text-sm font-medium transition',
            activeTab === 'history'
              ? 'border-b-2 border-stone-900 text-stone-900'
              : 'text-stone-500 hover:text-stone-700'
          ]"
        >
          Lịch sử đánh giá
        </button>
      </div>

      <!-- =============================================================
           TAB 1: GỬI ĐÁNH GIÁ
           ============================================================= -->
      <div v-if="activeTab === 'submit'" class="mt-6">
        <!-- Danh sách booking chưa đánh giá -->
        <div v-if="!selectedBooking">
          <h2 class="text-lg font-semibold text-stone-900">Booking chưa được đánh giá</h2>
          <p class="mt-1 text-sm text-stone-500">Chọn một đơn để gửi đánh giá</p>

          <div v-if="loadingEligible" class="mt-4 rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
            Đang tải...
          </div>

          <div v-else-if="eligibleBookings.length === 0" class="mt-4 rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
            <p>Tất cả đơn đã được đánh giá hoặc chưa có đơn nào đủ điều kiện.</p>
          </div>

          <div v-else class="mt-4 space-y-3">
            <article
              v-for="bk in eligibleBookings"
              :key="bk.bookingId"
              class="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-stone-200"
            >
              <div>
                <p class="font-medium text-stone-900">{{ bk.bookingCode }}</p>
                <p class="text-sm text-stone-500">{{ bk.branchName }} · {{ bk.roomType }} · Phòng {{ bk.roomNumber || '—' }}</p>
                <p class="text-xs text-stone-400">{{ bk.checkOut }} (check-out)</p>
              </div>
              <button
                @click="selectBooking(bk)"
                class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
              >
                Đánh giá
              </button>
            </article>
          </div>
        </div>

        <!-- Form đánh giá -->
        <div v-else class="mt-4 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <button
            @click="selectedBooking = null; form.rating = 0; form.comment = ''"
            class="mb-4 text-sm text-stone-500 hover:text-stone-700"
          >
            ← Chọn booking khác
          </button>

          <h2 class="text-lg font-semibold text-stone-900">Đánh giá đơn {{ selectedBooking.bookingCode }}</h2>
          <p class="mt-1 text-sm text-stone-500">{{ selectedBooking.branchName }} · {{ selectedBooking.roomType }}</p>

          <form class="mt-6 space-y-5" @submit.prevent="handleSubmitFeedback">
            <!-- Rating sao -->
            <div>
              <label class="mb-2 block text-sm font-medium text-stone-700">Điểm đánh giá</label>
              <div class="flex gap-1">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="form.rating = star"
                  class="text-3xl transition"
                  :class="star <= form.rating ? 'text-amber-400' : 'text-stone-300'"
                >
                  ★
                </button>
              </div>
              <p v-if="form.rating > 0" class="mt-1 text-sm text-stone-500">
                {{ ratingLabel(form.rating) }}
              </p>
            </div>

            <!-- Comment -->
            <div>
              <label class="mb-2 block text-sm font-medium text-stone-700">Nhận xét (tùy chọn)</label>
              <textarea
                v-model="form.comment"
                rows="4"
                maxlength="1000"
                placeholder="Chia sẻ trải nghiệm của bạn..."
                class="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none transition focus:border-stone-500"
              ></textarea>
              <p class="mt-1 text-xs text-stone-400">{{ form.comment.length }}/1000 ký tự</p>
            </div>

            <!-- Nút gửi -->
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="submitting || form.rating === 0"
                class="rounded-xl bg-amber-500 px-6 py-3 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
              >
                {{ submitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
              </button>
              <button
                type="button"
                @click="selectedBooking = null; form.rating = 0; form.comment = ''"
                class="rounded-xl border border-stone-300 px-4 py-3 text-sm text-stone-600 hover:bg-stone-100"
              >
                Hủy
              </button>
            </div>
          </form>

          <p v-if="successMsg" class="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 ring-1 ring-emerald-200">
            {{ successMsg }}
          </p>
          <p v-if="errorMsg" class="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
            {{ errorMsg }}
          </p>
        </div>
      </div>

      <!-- =============================================================
           TAB 2: LỊCH SỬ ĐÁNH GIÁ
           ============================================================= -->
      <div v-if="activeTab === 'history'" class="mt-6">
        <div v-if="loadingHistory" class="rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
          Đang tải...
        </div>

        <div v-else-if="myFeedbacks.length === 0" class="rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
          <p>Bạn chưa có đánh giá nào.</p>
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="fb in myFeedbacks"
            :key="fb.feedbackId"
            class="rounded-2xl bg-white p-5 ring-1 ring-stone-200"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-lg font-semibold text-stone-900">{{ fb.bookingCode }}</span>
                  <span class="text-amber-400">{{ '★'.repeat(fb.rating) }}{{ '☆'.repeat(5 - fb.rating) }}</span>
                </div>
                <p class="mt-1 text-sm text-stone-500">{{ fb.branchName }} · {{ fb.roomType }} · Phòng {{ fb.roomNumber || '—' }}</p>
                <p class="text-xs text-stone-400">Check-out: {{ fb.checkOut }}</p>
              </div>
              <button
                @click="handleDeleteFeedback(fb.feedbackId)"
                class="text-xs text-rose-400 hover:text-rose-600"
              >
                Xóa
              </button>
            </div>
            <p v-if="fb.comment" class="mt-3 text-sm leading-6 text-stone-600">{{ fb.comment }}</p>
            <p class="mt-2 text-xs text-stone-400">{{ formatDate(fb.createdAt) }}</p>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { feedbackService } from '@/services/feedback.service';
import { parseApiError } from '@/utils/api-error';

const route = useRoute();

const activeTab = ref('submit');
const loadingEligible = ref(true);
const loadingHistory = ref(true);
const eligibleBookings = ref([]);
const myFeedbacks = ref([]);
const selectedBooking = ref(null);
const submitting = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const form = reactive({
  rating: 0,
  comment: ''
});

const ratingLabels = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Tuyệt vời'];
const ratingLabel = (r) => ratingLabels[r] || '';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('vi-VN');
};

/**
 * Load danh sách booking chưa đánh giá
 */
const loadEligible = async () => {
  loadingEligible.value = true;
  try {
    const res = await feedbackService.getEligibleBookings();
    eligibleBookings.value = res.data?.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loadingEligible.value = false;
  }
};

/**
 * Load lịch sử đánh giá
 */
const loadHistory = async () => {
  loadingHistory.value = true;
  try {
    const res = await feedbackService.getMyFeedbacks();
    myFeedbacks.value = res.data?.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loadingHistory.value = false;
  }
};

/**
 * Chọn booking để đánh giá
 */
const selectBooking = (bk) => {
  selectedBooking.value = bk;
  form.rating = 0;
  form.comment = '';
  successMsg.value = '';
  errorMsg.value = '';
};

/**
 * Gửi đánh giá
 */
const handleSubmitFeedback = async () => {
  if (form.rating === 0) {
    errorMsg.value = 'Vui lòng chọn điểm đánh giá';
    return;
  }

  submitting.value = true;
  errorMsg.value = '';
  successMsg.value = '';

  try {
    const res = await feedbackService.createFeedback({
      bookingId: selectedBooking.value.bookingId,
      rating: form.rating,
      comment: form.comment.trim() || undefined
    });

    successMsg.value = res.data?.message || 'Cảm ơn bạn đã đánh giá!';
    form.rating = 0;
    form.comment = '';
    selectedBooking.value = null;

    // Refresh danh sách
    await loadEligible();
    await loadHistory();
  } catch (error) {
    errorMsg.value = parseApiError(error, 'Gửi đánh giá thất bại');
  } finally {
    submitting.value = false;
  }
};

/**
 * Xóa đánh giá
 */
const handleDeleteFeedback = async (feedbackId) => {
  if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

  try {
    await feedbackService.deleteFeedback(feedbackId);
    await loadHistory();
  } catch (error) {
    alert(parseApiError(error, 'Xóa đánh giá thất bại'));
  }
};

onMounted(() => {
  // Nếu có bookingId trong query -> load danh sách trước rồi auto select
  const bookingId = Number(route.query.bookingId);
  if (bookingId) {
    const loadAndSelect = async () => {
      await Promise.all([loadEligible(), loadHistory()]);
      const bk = eligibleBookings.value.find((b) => b.bookingId === bookingId);
      if (bk) selectBooking(bk);
    };
    loadAndSelect();
    return;
  }

  loadEligible();
  loadHistory();
});
</script>
