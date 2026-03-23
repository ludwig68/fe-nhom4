// Import các module cấu hình router của VueJS
import { createRouter, createWebHistory } from 'vue-router'

// Import giao diện cho từng trang tương ứng
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
import ChangePasswordView from '@/views/ChangePasswordView.vue'
import ProfileView from '@/views/ProfileView.vue'
import BranchesView from '@/views/BranchesView.vue'
import BranchDetailView from '@/views/BranchDetailView.vue'

// Khởi tạo đối tượng router với lịch sử duyệt web do trình duyệt quản lý
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true } // Đánh dấu route này chỉ dành cho khách (chưa đăng nhập)
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true }
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordView,
      meta: { guestOnly: true }
    },
    {
      path: '/change-password',
      name: 'change-password',
      component: ChangePasswordView,
      meta: { requiresAuth: true } // Đánh dấu route yêu cầu đã đăng nhập (cần Token)
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true }
    },
    {
      path: '/branches',
      name: 'branches',
      component: BranchesView
    },
    {
      path: '/branches/:id',
      name: 'branch-detail',
      component: BranchDetailView
    }
  ],
  // Mỗi khi chuyển trang, tự chuyển lên khu vực trên cùng (scroll lên top)
  scrollBehavior() {
    return { top: 0 }
  }
})

// Chặn route bằng Hook beforeEach: Chạy đoạn code này trước mỗi lúc muốn chuển trang
router.beforeEach((to, from, next) => {
  // Lấy token trong kho lưu trữ của trình duyệt
  const token = localStorage.getItem('accessToken')

  // Nếu người dùng đòi vào trang "yêu cầu bảo mật" nhưng không có Token -> Đẩy về đăng nhập
  if (to.meta.requiresAuth && !token) {
    return next('/login')
  }

  // Nếu người dùng đòi vào trang "Login/Register" nhưng đã có Token -> Đẩy về trang chủ
  if (to.meta.guestOnly && token) {
    return next('/')
  }

  // Ok, thỏa điều kiện trên thì cho phép đi tới trang đích bình thường
  next()
})

// Xuất Router cho tệp App.vue sử dụng
export default router
