<template>
  <div class="min-h-screen bg-stone-50 px-6 py-10">
    <div class="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
      <div class="flex items-center justify-between gap-4">
        <div>
          <p class="text-sm text-stone-500">Tài khoản</p>
          <h1 class="text-3xl font-semibold text-stone-900">Thông tin cá nhân</h1>
        </div>
        <div class="flex items-center gap-2">
          <button v-if="user && !isEditing" @click="startEdit" class="rounded-xl bg-stone-800 px-4 py-2 text-sm text-white">Chỉnh sửa</button>
          <RouterLink to="/" class="rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-700">Về trang chủ</RouterLink>
        </div>
      </div>

      <div v-if="loading" class="mt-6 text-stone-500">Đang tải...</div>

      <div v-else-if="user" class="mt-8 grid gap-4 sm:grid-cols-2">
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Username</p>
          <p class="mt-2 text-stone-900">{{ user.username }}</p>
        </div>
        
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Họ tên</p>
          <input v-if="isEditing" v-model="editForm.full_name" type="text" class="mt-2 w-full rounded border px-2 py-1" />
          <p v-else class="mt-2 font-medium text-stone-900">{{ user.full_name || 'Chưa cập nhật' }}</p>
        </div>
        
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Email</p>
          <input v-if="isEditing" v-model="editForm.email" type="email" class="mt-2 w-full rounded border px-2 py-1" />
          <p v-else class="mt-2 text-stone-900">{{ user.email }}</p>
        </div>
        
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200">
          <p class="text-sm text-stone-500">Số điện thoại</p>
          <input v-if="isEditing" v-model="editForm.phone" type="text" class="mt-2 w-full rounded border px-2 py-1" />
          <p v-else class="mt-2 font-medium text-stone-900">{{ user.phone || 'Chưa cập nhật' }}</p>
        </div>
        
        <div class="rounded-2xl bg-stone-50 p-4 ring-1 ring-stone-200 sm:col-span-2">
          <p class="text-sm text-stone-500">Địa chỉ</p>
          <textarea v-if="isEditing" v-model="editForm.address" rows="2" class="mt-2 w-full rounded border px-2 py-1"></textarea>
          <p v-else class="mt-2 font-medium text-stone-900">{{ user.address || 'Chưa cập nhật' }}</p>
        </div>
        
        <div v-if="isEditing" class="sm:col-span-2 flex justify-end gap-2 mt-4">
          <button @click="cancelEdit" class="rounded-xl border border-stone-300 px-4 py-2 text-sm text-stone-700">Hủy</button>
          <button @click="saveProfile" class="rounded-xl bg-stone-800 px-4 py-2 text-sm text-white">Lưu thay đổi</button>
        </div>
        <p v-if="message" class="sm:col-span-2 mt-2 text-sm text-green-600">{{ message }}</p>
        <p v-if="errorMsg" class="sm:col-span-2 mt-2 text-sm text-red-600">{{ errorMsg }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Khởi tạo store quản lý trạng thái tài khoản
const authStore = useAuthStore()

// Các biến trạng thái logic của trang
const loading = ref(true)    // Đợi tải dữ liệu lần đầu
const user = ref(null)       // Chứa thông tin user để hiển thị lên UI
const isEditing = ref(false) // Trạng thái mở/tắt form chỉnh sửa
const editForm = ref({ full_name: '', email: '', phone: '', address: '' }) // Object gửi form API
const message = ref('')      // Hiển thị thông báo thành công
const errorMsg = ref('')     // Hiển thị thông báo lỗi nếu API báo móp

// Hàm bật form chỉnh sửa: tự động điền sẵn data cũ vào ô text
const startEdit = () => {
  editForm.value = {
    full_name: user.value?.full_name || '',
    email: user.value?.email || '',
    phone: user.value?.phone || '',
    address: user.value?.address || ''
  }
  isEditing.value = true
  message.value = ''
  errorMsg.value = ''
}

const cancelEdit = () => {
  isEditing.value = false
}

const saveProfile = async () => {
  try {
    errorMsg.value = ''
    const res = await authStore.updateProfile(editForm.value)
    user.value = res.data
    isEditing.value = false
    message.value = 'Cập nhật thành công!'
    setTimeout(() => message.value = '', 3000)
  } catch (err) {
    errorMsg.value = err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'
  }
}

onMounted(async () => {
  try {
    const res = await authStore.fetchMe()
    user.value = res?.data || authStore.user
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>