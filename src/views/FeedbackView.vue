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
  <div class="min-h-screen bg-gradient-to-b from-stone-100 via-stone-50 to-white px-4 py-10">
    <div class="mx-auto max-w-4xl">
      <!-- Header -->
      <div class="mb-6 flex items-center justify-between gap-4">
        <RouterLink to="/my-bookings" class="group inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-600 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-900 hover:text-white hover:ring-stone-900">
          <span class="transition group-hover:-translate-x-0.5">←</span>
          Về đơn đặt phòng
        </RouterLink>
      </div>

      <!-- Title -->
      <div class="mb-6 flex items-center gap-3">
        <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-xl text-white">⭐</div>
        <div>
          <h1 class="text-2xl font-semibold text-stone-900">Đánh giá & Phản hồi</h1>
          <p class="text-sm text-stone-500">Chia sẻ trải nghiệm của bạn sau khi lưu trú</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-8 flex gap-1 rounded-xl bg-stone-100 p-1 ring-1 ring-stone-200">
        <button
          @click="activeTab = 'submit'"
          :class="[
            'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
            activeTab === 'submit'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          ]"
        >
          <span>✍️</span> Gửi đánh giá
        </button>
        <button
          @click="activeTab = 'history'"
          :class="[
            'flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200',
            activeTab === 'history'
              ? 'bg-white text-stone-900 shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          ]"
        >
          <span>📜</span> Lịch sử đánh giá
        </button>
      </div>

      <!-- =============================================================
           TAB 1: GỬI ĐÁNH GIÁ
           ============================================================= -->
      <div v-if="activeTab === 'submit'" class="mt-6">
        <!-- Danh sách booking chưa đánh giá -->
        <div v-if="!selectedBooking">
          <div class="mb-4">
            <h2 class="flex items-center gap-2 text-lg font-semibold text-stone-900">
              <span>📋</span> Booking chưa được đánh giá
            </h2>
            <p class="mt-1 text-sm text-stone-500">Chọn một đơn để gửi đánh giá</p>
          </div>

          <div v-if="loadingEligible" class="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200">
            <div class="text-3xl">⏳</div>
            <p class="mt-3 text-sm text-stone-500">Đang tải...</p>
          </div>

          <div v-else-if="eligibleBookings.length === 0" class="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200">
            <div class="text-4xl">✅</div>
            <p class="mt-3 text-base font-medium text-stone-600">Tất cả đơn đã được đánh giá</p>
            <p class="mt-1 text-sm text-stone-400">Hoặc chưa có đơn nào đủ điều kiện.</p>
          </div>

          <div v-else class="space-y-3">
            <article
              v-for="bk in eligibleBookings"
              :key="bk.bookingId"
              class="group flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div class="flex items-center gap-4">
                <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-stone-100 text-lg">🏨</div>
                <div>
                  <p class="font-semibold text-stone-900">{{ bk.bookingCode }}</p>
                  <p class="text-sm text-stone-500">{{ bk.branchName }} · {{ bk.roomType }} · Phòng {{ bk.roomNumber || '—' }}</p>
                  <p class="mt-0.5 text-xs text-stone-400">📅 {{ bk.checkOut }} (check-out)</p>
                </div>
              </div>
              <button
                @click="selectBooking(bk)"
                class="rounded-xl bg-stone-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-stone-700 hover:shadow-md"
              >
                ⭐ Đánh giá
              </button>
            </article>
          </div>
        </div>

        <!-- Form đánh giá -->
        <div v-else class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
          <div class="border-b border-stone-100 bg-gradient-to-r from-stone-50 to-white px-6 py-5">
            <button
              @click="selectedBooking = null; form.rating = 0; form.comment = ''"
              class="mb-3 inline-flex items-center gap-1 text-sm text-stone-500 transition hover:text-stone-700"
            >
              ← Chọn booking khác
            </button>
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-lg">⭐</div>
              <div>
                <h2 class="text-lg font-semibold text-stone-900">Đánh giá đơn {{ selectedBooking.bookingCode }}</h2>
                <p class="text-sm text-stone-500">{{ selectedBooking.branchName }} · {{ selectedBooking.roomType }}</p>
              </div>
            </div>
          </div>

          <form class="space-y-6 p-6" @submit.prevent="handleSubmitFeedback">
            <!-- Rating Stars -->
            <div>
              <label class="mb-3 block text-sm font-medium text-stone-700">Điểm đánh giá</label>
              <div class="flex gap-2">
                <button
                  v-for="star in 5"
                  :key="star"
                  type="button"
                  @click="form.rating = star"
                  @mouseenter="hoverRating = star"
                  @mouseleave="hoverRating = 0"
                  class="text-4xl transition-all duration-200 hover:scale-110"
                  :class="star <= (hoverRating || form.rating) ? 'text-amber-400 drop-shadow-sm' : 'text-stone-200'"
                >
                  ★
                </button>
              </div>
              <p v-if="form.rating > 0" class="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700 ring-1 ring-amber-200">
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
                class="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none transition focus:border-stone-500 focus:bg-white focus:ring-2 focus:ring-stone-200"
              ></textarea>
              <p class="mt-1 text-xs text-stone-400">{{ form.comment.length }}/1000 ký tự</p>
            </div>

            <!-- Submit Buttons -->
            <div class="flex gap-3">
              <button
                type="submit"
                :disabled="submitting || form.rating === 0"
                class="rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-amber-600 hover:shadow-lg disabled:opacity-60"
              >
                {{ submitting ? '⏳ Đang gửi...' : '⭐ Gửi đánh giá' }}
              </button>
              <button
                type="button"
                @click="selectedBooking = null; form.rating = 0; form.comment = ''"
                class="rounded-xl border border-stone-300 px-4 py-3 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
              >
                Hủy
              </button>
            </div>
          </form>

          <!-- Messages -->
          <div class="px-6 pb-6">
            <p v-if="successMsg" class="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200">
              <span>🎉</span> {{ successMsg }}
            </p>
            <p v-if="errorMsg" class="mt-2 flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600 ring-1 ring-rose-200">
              <span>⚠️</span> {{ errorMsg }}
            </p>
          </div>
        </div>
      </div>

      <!-- =============================================================
           TAB 2: LỊCH SỬ ĐÁNH GIÁ
           ============================================================= -->
      <div v-if="activeTab === 'history'" class="mt-6">
        <div v-if="loadingHistory" class="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200">
          <div class="text-3xl">⏳</div>
          <p class="mt-3 text-sm text-stone-500">Đang tải...</p>
        </div>

        <div v-else-if="myFeedbacks.length === 0" class="rounded-2xl bg-white px-6 py-12 text-center shadow-sm ring-1 ring-stone-200">
          <div class="text-4xl">📝</div>
          <p class="mt-3 text-base font-medium text-stone-600">Bạn chưa có đánh giá nào.</p>
          <p class="mt-1 text-sm text-stone-400">Hãy gửi đánh giá sau khi check-out!</p>
        </div>

        <div v-else class="space-y-4">
          <article
            v-for="fb in myFeedbacks"
            :key="fb.feedbackId"
            class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200 transition-all hover:shadow-md"
          >
            <div class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-100 text-lg">🏨</div>
                    <div>
                      <span class="text-lg font-bold text-stone-900">{{ fb.bookingCode }}</span>
                      <div class="flex items-center gap-0.5 text-lg">
                        <span v-for="s in 5" :key="s" :class="s <= fb.rating ? 'text-amber-400' : 'text-stone-200'">★</span>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 text-sm text-stone-500">{{ fb.branchName }} · {{ fb.roomType }} · Phòng {{ fb.roomNumber || '—' }}</p>
                  <p class="text-xs text-stone-400">📅 Check-out: {{ fb.checkOut }}</p>
                </div>
                <button
                  @click="handleDeleteFeedback(fb.feedbackId)"
                  class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-500 transition hover:bg-rose-100 hover:text-rose-600"
                >
                  🗑️ Xóa
                </button>
              </div>
              <div v-if="fb.comment" class="mt-4 rounded-xl bg-stone-50 px-4 py-3 ring-1 ring-stone-100">
                <p class="text-sm leading-6 text-stone-600 italic">"{{ fb.comment }}"</p>
              </div>
              <p class="mt-3 text-xs text-stone-400">📅 Ngày đánh giá: {{ formatDate(fb.createdAt) }}</p>
            </div>
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
const hoverRating = ref(0);

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
