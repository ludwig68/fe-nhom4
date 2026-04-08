/**
 * =============================================================
 * FILE: frontend/src/router/index.js
 * MÔ TẢ: Cấu hình Vue Router (quản lý chuyển trang)
 * 
 * VUE ROUTER LÀ GÌ?
 * - Thư viện quản lý routing (đường dẫn URL) cho Vue.js
 * - Mapping: URL → Component Vue
 * - Hỗ trợ: history mode, navigation guards, lazy loading, ...
 * 
 * HISTORY MODE:
 * - URL đẹp: /profile thay vì /#/profile
 * - Dùng HTML5 History API (pushState, replaceState)
 * - Cần cấu hình server fallback (cho SPA)
 * =============================================================
 */

// Import hàm tạo router từ Vue Router
import { createRouter, createWebHistory } from 'vue-router';

// Import các component view (trang) tương ứng với mỗi route
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import ForgotPasswordView from '@/views/ForgotPasswordView.vue';
import ChangePasswordView from '@/views/ChangePasswordView.vue';
import ProfileView from '@/views/ProfileView.vue';
import BranchesView from '@/views/BranchesView.vue';
import BranchDetailView from '@/views/BranchDetailView.vue';
import RoomSearchView from '@/views/RoomSearchView.vue';
import RoomDetailView from '@/views/RoomDetailView.vue';
import BookingView from '@/views/BookingView.vue';
import BookingListView from '@/views/BookingListView.vue';
import BookingDetailView from '@/views/BookingDetailView.vue';
import FeedbackView from '@/views/FeedbackView.vue';

// Import hàm tạo route có guard
import { createGuardedRoute, resolveAuthRedirect } from './guard';

/**
 * Khởi tạo router instance
 * 
 * history: createWebHistory() → dùng HTML5 history mode (URL đẹp)
 * routes: mảng các route config
 */
const router = createRouter({
  // History mode: URL không có dấu #
  // Ví dụ: http://localhost:5173/profile (thay vì /#/profile)
  history: createWebHistory(),

  // Danh sách các route
  routes: [
    // =============================================================
    // TRANG CHỦ (public - ai cũng vào được)
    // =============================================================
    {
      path: '/',            // URL: http://localhost:5173/
      name: 'home',         // Tên route (dùng cho router.push({ name: 'home' }))
      component: HomeView   // Component hiển thị
    },

    // =============================================================
    // TRANG AUTH (guestOnly - chỉ người chưa login mới vào)
    // =============================================================
    createGuardedRoute({
      path: '/login',
      name: 'login',
      component: LoginView
    }, 'guestOnly'), // Đã login → redirect về /

    createGuardedRoute({
      path: '/register',
      name: 'register',
      component: RegisterView
    }, 'guestOnly'),

    createGuardedRoute({
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView
    }, 'guestOnly'),

    // =============================================================
    // TRANG CẦN ĐĂNG NHẬP (requiresAuth)
    // =============================================================
    createGuardedRoute({
      path: '/change-password',
      name: 'change-password',
      component: ChangePasswordView
    }, 'requiresAuth'), // Chưa login → redirect /login

    createGuardedRoute({
      path: '/profile',
      name: 'profile',
      component: ProfileView
    }, 'requiresAuth'),

    // =============================================================
    // TRANG CHI NHÁNH (public)
    // =============================================================
    {
      path: '/branches',
      name: 'branches',
      component: BranchesView
    },
    {
      // :id = route parameter (dynamic)
      // Ví dụ: /branches/1 → route.params.id = '1'
      path: '/branches/:id',
      name: 'branch-detail',
      component: BranchDetailView
    },

    // =============================================================
    // TRANG PHÒNG (public)
    // =============================================================
    {
      path: '/rooms',
      name: 'rooms',
      component: RoomSearchView
    },
    {
      path: '/rooms/:id',
      name: 'room-detail',
      component: RoomDetailView
    },

    // =============================================================
    // TRANG ĐẶT PHÒNG (requiresAuth)
    // =============================================================
    createGuardedRoute({
      path: '/booking',
      name: 'booking',
      component: BookingView
    }, 'requiresAuth'),

    // =============================================================
    // QUẢN LÝ ĐƠN ĐẶT PHÒNG (requiresAuth)
    // =============================================================
    createGuardedRoute({
      path: '/my-bookings',
      name: 'my-bookings',
      component: BookingListView
    }, 'requiresAuth'),

    createGuardedRoute({
      // :id có thể là bookingId (số) hoặc bookingCode (string)
      path: '/my-bookings/:id',
      name: 'booking-detail',
      component: BookingDetailView
    }, 'requiresAuth'),

    // =============================================================
    // ĐÁNH GIÁ / PHẢN HỒI (requiresAuth)
    // =============================================================
    createGuardedRoute({
      path: '/feedbacks',
      name: 'feedbacks',
      component: FeedbackView
    }, 'requiresAuth')
  ],

  // Mỗi khi chuyển trang → scroll lên đầu trang
  // Tạo trải nghiệm giống load trang mới
  scrollBehavior() {
    return { top: 0 };
  }
});

/**
 * NAVIGATION GUARD TOÀN CỤC (beforeEach)
 * 
 * Chạy TRƯỚC MỖI LẦN chuyển trang
 * 
 * @param {object} to - Route đích (điểm đến)
 * @returns {string|true} Đường dẫn redirect hoặc true (cho phép đi tiếp)
 * 
 * LUỒNG:
 * 1. Lấy token từ localStorage
 * 2. Gọi resolveAuthRedirect() kiểm tra có cần redirect không
 * 3. Nếu cần → trả đường dẫn redirect
 * 4. Nếu không → trả true (cho phép đi tiếp)
 * 
 * Lưu ý: Vue Router 4 khuyến khích trả về giá trị thay vì gọi next()
 * - next() vẫn hoạt động nhưng deprecated
 * - Trả về string → redirect
 * - Trả về true → cho phép
 * - Trả về false → hủy navigation
 */
router.beforeEach((to) => {
  // Lấy token từ localStorage
  const token = localStorage.getItem('accessToken');

  // Kiểm tra có cần chuyển hướng không
  const redirectPath = resolveAuthRedirect(to, token);
  if (redirectPath) {
    return redirectPath; // Redirect đến trang khác
  }

  // Không cần redirect → cho phép đi tiếp
  return true;
});

// Export router để main.js sử dụng
export default router;
