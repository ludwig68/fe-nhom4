<!--
  =============================================================
  FILE: frontend/src/views/LoginView.vue
  MÔ TẢ: Trang đăng nhập
  ROUTE: /login (guestOnly - chỉ người chưa login mới vào)
  
  LUỒNG HOẠT ĐỘNG:
  1. User nhập username + password
  2. Bấm "Đăng nhập" → gọi authStore.login()
  3. Nếu thành công → redirect về trang chủ (/)
  4. Nếu lỗi → hiện thông báo lỗi
  
  AUTH FLOW:
  - authStore.login() gọi API → nhận token + user
  - Token lưu vào localStorage → reload không mất
  - Router guard nhận ra đã login → cho phép vào trang private
  =============================================================
--><template>
  <div class="mx-auto mt-10 max-w-md rounded-lg bg-white p-6 shadow-md border border-stone-200">
    <h1 class="mb-6 text-2xl font-bold text-stone-800 text-center">Đăng nhập tài khoản</h1>
    
    <form @submit.prevent="handleLogin" class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Tên đăng nhập:</label>
        <input 
          v-model="form.username" 
          type="text" 
          class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          placeholder="Nhập tên đăng nhập"
        />
      </div>
      
      <div>
        <label class="mb-1 block text-sm font-medium text-stone-700">Mật khẩu:</label>
        <input 
          v-model="form.password" 
          type="password" 
          class="w-full rounded-md border border-stone-300 p-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500" 
          placeholder="Nhập mật khẩu"
        />
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

      <button 
        type="submit" 
        :disabled="loading" 
        class="w-full rounded-md bg-stone-800 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700 disabled:opacity-50"
      >
        {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
      </button>
    </form>

    <div class="mt-6 flex flex-col items-center gap-2 text-sm">
      <RouterLink to="/forgot-password" class="text-stone-600 hover:text-stone-900 hover:underline">
        Quên mật khẩu?
      </RouterLink>
      <div class="text-stone-500">
        Chưa có tài khoản?
        <RouterLink to="/register" class="font-medium text-stone-800 hover:underline">
          Tạo tài khoản
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// =============================================================
// IMPORTS
// =============================================================
import { reactive, ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { parseApiError } from '@/utils/api-error';

// =============================================================
// STATE & REFS
// =============================================================
// useRouter: để chuyển trang sau khi login thành công
const router = useRouter();

// useAuthStore: lấy store quản lý auth (login, logout, user info)
const authStore = useAuthStore();

// loading: cờ báo đang xử lý API → hiện spinner, disable nút
const loading = ref(false);

// errorMessage: thông báo lỗi hiển thị cho user
const errorMessage = ref('');

// form: object chứa dữ liệu form đăng nhập
// reactive: Vue 3 reactivity → thay đổi form → UI tự cập nhật
const form = reactive({
  username: '',
  password: ''
});

// =============================================================
// METHODS
// =============================================================

/**
 * Xử lý đăng nhập
 * 
 * LUỒNG:
 * 1. Set loading = true → disable nút, hiện "Đang xử lý..."
 * 2. Xóa lỗi cũ
 * 3. Gọi authStore.login(form) → gọi API backend
 * 4. Nếu thành công → redirect về trang chủ
 * 5. Nếu lỗi → parse lỗi → hiển thị
 * 6. finally → loading = false → enable nút
 */
const handleLogin = async () => {
  loading.value = true;
  errorMessage.value = '';

  try {
    // Gọi action login của store
    // Store sẽ: gọi API → lưu token vào localStorage + store state
    await authStore.login(form);

    // Đăng nhập thành công → chuyển về trang chủ
    router.push('/');
  } catch (error) {
    // Parse lỗi từ API response → lấy thông báo dễ hiểu
    errorMessage.value = parseApiError(error, 'Đăng nhập thất bại');
  } finally {
    // Dù thành công hay lỗi → tắt loading
    loading.value = false;
  }
};
</script>
