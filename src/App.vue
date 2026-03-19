<template>
  <div class="min-h-screen bg-gray-50 py-10 px-4 font-sans text-gray-800">
    <div class="max-w-7xl mx-auto flex flex-col xl:flex-row gap-8">
      
      <div class="w-full xl:w-1/3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-10">
          <h2 class="text-2xl font-bold text-indigo-700 mb-6 border-b pb-3">
            {{ isEditing ? 'Sửa thông tin' : 'Thêm người dùng' }}
          </h2>
          
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block text-sm font-semibold mb-1">Họ và Tên (*)</label>
              <input v-model="form.name" type="text" required 
                class="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" 
                placeholder="Nhập họ tên...">
            </div>
            
            <div>
              <label class="block text-sm font-semibold mb-1">Email</label>
              <input v-model="form.email" type="email" 
                class="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" 
                placeholder="email@example.com">
            </div>

            <div>
              <label class="block text-sm font-semibold mb-1">Số điện thoại</label>
              <input v-model="form.phone" type="text" 
                class="w-full rounded-lg border-gray-300 border px-4 py-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" 
                placeholder="0901234567">
            </div>
            
            <div class="flex gap-3 pt-4">
              <button type="submit" class="flex-1 bg-indigo-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-indigo-700 shadow transition">
                {{ isEditing ? 'Cập nhật' : 'Tạo mới' }}
              </button>
              <button v-if="isEditing" @click="resetForm" type="button" class="bg-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-lg hover:bg-gray-300 transition">
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="w-full xl:w-2/3">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          
          <div class="bg-indigo-600 px-6 py-4 flex justify-between items-center">
            <h2 class="text-lg font-bold text-white uppercase tracking-wider">Danh sách Người dùng</h2>
            <span class="bg-white text-indigo-700 font-bold text-sm px-3 py-1 rounded-full">
              Tổng: {{ users.length }}
            </span>
          </div>

          <div class="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span class="text-sm font-semibold text-indigo-800">🛠️ Trình chấm điểm API:</span>
            
            <div class="flex flex-wrap items-center gap-3">
              <a :href="API_URL" target="_blank" rel="noopener noreferrer" 
                 class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-3 py-2 rounded shadow transition flex items-center gap-1">
                <span>🌐 Xem Tất Cả User</span>
              </a>

              <div class="flex items-center shadow-sm">
                <input v-model="searchApiId" type="text" placeholder="Nhập ID (VD: 6)" 
                       class="text-xs px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-green-500 w-28 placeholder-gray-400">
                <button @click="openApiDetail" 
                        class="bg-green-500 hover:bg-green-600 text-white font-medium text-xs px-3 py-2 rounded-r-md transition flex items-center gap-1">
                  <span>🔍 Xem 1 User</span>
                </button>
              </div>
            </div>
          </div>

          <div v-if="loading" class="p-10 text-center text-gray-500">
             Đang tải dữ liệu...
          </div>
          
          <div class="overflow-x-auto" v-else>
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider border-b">
                  <th class="py-4 px-6 font-bold w-20 text-center">STT</th>
                  <th class="py-4 px-6 font-bold">Họ và Tên</th>
                  <th class="py-4 px-6 font-bold">Thông tin liên hệ</th>
                  <th class="py-4 px-6 font-bold text-center w-32">Thao tác</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-if="users.length === 0">
                  <td colspan="4" class="py-10 text-center text-gray-500 italic">Chưa có dữ liệu.</td>
                </tr>
                
                <tr v-for="(user, index) in users" :key="user.id" class="hover:bg-indigo-50 transition">
                  <td class="py-4 px-6 text-center text-indigo-600 font-black text-lg">
                    #{{ index + 1 }}
                  </td>
                  
                  <td class="py-4 px-6">
                    <div class="font-bold text-gray-900 text-base">{{ user.name }}</div>
                    <div class="text-xs text-gray-400 mt-1 font-mono">ID: {{ user.id }}</div>
                  </td>
                  
                  <td class="py-4 px-6 text-sm text-gray-600 space-y-1">
                    <div class="flex items-center gap-2">
                      <span class="text-gray-400">📧</span> {{ user.email || '---' }}
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-gray-400">📞</span> {{ user.phone || '---' }}
                    </div>
                  </td>
                  
                  <td class="py-4 px-6 text-center">
                    <div class="flex justify-center gap-2">
                      <button @click="editUser(user)" class="text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md font-medium transition text-sm">Sửa</button>
                      <button @click="deleteUser(user.id)" class="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-md font-medium transition text-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const API_URL = 'https://api.cnttstu.online/users';

const users = ref([]);
const loading = ref(true);
const isEditing = ref(false);
const form = ref({ id: '', name: '', email: '', phone: '' });

// Biến lưu trữ ID mà người dùng gõ vào ô tìm kiếm API
const searchApiId = ref('');

// Hàm mở API chi tiết theo ID
const openApiDetail = () => {
  if (!searchApiId.value.trim()) {
    alert('Vui lòng nhập số ID (Ví dụ: 6) để xem chi tiết!');
    return;
  }
  // Tự động nối link và mở sang tab mới
  window.open(`${API_URL}/${searchApiId.value.trim()}`, '_blank', 'noopener,noreferrer');
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const res = await fetch(API_URL);
    if(res.ok) users.value = await res.json();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const saveUser = async () => {
  try {
    const method = isEditing.value ? 'PUT' : 'POST';
    const url = isEditing.value ? `${API_URL}/${form.value.id}` : API_URL;
    
    await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        phone: form.value.phone
      })
    });
    
    resetForm();
    await fetchUsers(); 
  } catch (error) {
    alert('Lỗi kết nối đến máy chủ!');
  }
};

const editUser = (user) => {
  isEditing.value = true;
  form.value = { ...user };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const deleteUser = async (id) => {
  if (!confirm('Bạn có chắc muốn xóa?')) return;
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    await fetchUsers();
  } catch (error) {
    alert('Lỗi kết nối khi xóa!');
  }
};

const resetForm = () => {
  isEditing.value = false;
  form.value = { id: '', name: '', email: '', phone: '' };
};

onMounted(() => {
  fetchUsers();
});
</script>