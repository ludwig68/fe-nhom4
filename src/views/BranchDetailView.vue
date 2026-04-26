<template>
<<<<<<< HEAD
  <section>
    <div class="header-row">
      <div>
        <h1>
          Chi nhánh {{ branch.branch_name || branch.name || branch.branch_id }}
        </h1>
        <p>
          Địa chỉ:
          {{ branch.address || branch.location || "Không có thông tin" }}
        </p>
      </div>
      <router-link to="/branches" class="button">Quay lại</router-link>
    </div>

    <div class="grid-two">
      <div class="panel">
        <h2>Thống kê phòng</h2>
        <div class="stat-row">
          <div class="stat-card">
            <strong>{{ stats.total_rooms }}</strong>
            <span>Tổng phòng</span>
          </div>
          <div class="stat-card">
            <strong>{{ stats.empty_rooms }}</strong>
            <span>Phòng trống</span>
          </div>
          <div class="stat-card">
            <strong>{{ stats.occupied_rooms }}</strong>
            <span>Phòng đang thuê</span>
          </div>
        </div>
      </div>

      <div class="panel">
        <h2>Tìm booking</h2>
        <div class="search-row">
          <input v-model="query" placeholder="Mã, tên khách, số điện thoại" />
          <button @click="search">Tìm</button>
          <button @click="loadBookings" class="ghost">Tải lại</button>
        </div>
      </div>
    </div>

    <div class="panel">
      <h2>Quản lý chi nhánh</h2>
      <div class="tab-row">
        <button
          :class="{ active: activeTab === 'bookings' }"
          @click="activeTab = 'bookings'"
        >
          Booking
        </button>
        <button
          :class="{ active: activeTab === 'current' }"
          @click="activeTab = 'current'"
        >
          Khách đang ở
        </button>
        <button
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          Tạo booking
        </button>
        <button
          :class="{ active: activeTab === 'services' }"
          @click="activeTab = 'services'"
        >
          Dịch vụ
        </button>
        <button
          :class="{ active: activeTab === 'password' }"
          @click="activeTab = 'password'"
        >
          Đổi mật khẩu
        </button>
      </div>

      <div v-if="activeTab === 'bookings'">
        <div v-if="bookingError" class="alert error">{{ bookingError }}</div>
        <div v-if="bookings.length === 0" class="empty-state">
          Không có booking
        </div>
        <div class="list">
          <article
            v-for="booking in bookings"
            :key="booking.booking_id"
            class="item-card"
          >
            <div class="item-main">
              <div>
                <h3>{{ booking.booking_code }}</h3>
                <p>
                  <strong>Khách:</strong>
                  {{ booking.customer_name || "Khách lạ" }} ·
                  {{ booking.phone || "Không có" }}
                </p>
                <p>
                  <strong>Phòng:</strong> {{ booking.room_id || "Chưa gán" }} ·
                  <strong>Trạng thái:</strong> {{ booking.status }}
                </p>
                <p>
                  <strong>Check-in:</strong>
                  {{ booking.checkin_date || "..." }} ·
                  <strong>Check-out:</strong>
                  {{ booking.checkout_date || "..." }}
                </p>
                <p>
                  <strong>Ghi chú:</strong> {{ booking.note || "Không có" }}
                </p>
              </div>
              <div class="tag">{{ booking.status }}</div>
            </div>
            <div class="actions">
              <button @click="openEditModal(booking)">Chỉnh sửa</button>
              <button @click="handleAction('confirm', booking.booking_id)">
                Xác nhận
              </button>
              <button
                @click="handleAction('reject', booking.booking_id)"
                class="danger"
              >
                Từ chối
              </button>
              <button
                @click="handleAction('checkin', booking.booking_id)"
                class="success"
              >
                Check-in
              </button>
              <button
                @click="handleAction('checkout', booking.booking_id)"
                class="warning"
              >
                Check-out
              </button>
              <button
                @click="handleAction('cancel', booking.booking_id)"
                class="danger"
              >
                Hủy
              </button>
            </div>
            <div class="service-form">
              <h4>Thêm dịch vụ</h4>
              <div class="service-row">
                <input
                  v-model="serviceForm[booking.booking_id].service_name"
                  placeholder="Tên dịch vụ"
                />
                <input
                  type="number"
                  step="1000"
                  v-model.number="serviceForm[booking.booking_id].amount"
                  placeholder="Số tiền"
                />
                <button @click="submitService(booking.booking_id)">
                  Ghi nhận
                </button>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div v-if="activeTab === 'current'">
        <div v-if="currentError" class="alert error">{{ currentError }}</div>
        <div v-if="currentGuests.length === 0" class="empty-state">
          Không có khách đang ở
        </div>
        <div class="list">
          <article
            v-for="guest in currentGuests"
            :key="guest.booking_id"
            class="item-card"
          >
            <h3>{{ guest.customer_name || "Khách lạ" }}</h3>
            <p><strong>Phòng:</strong> {{ guest.room_id || "Chưa gán" }}</p>
            <p>
              <strong>Check-in thực tế:</strong> {{ guest.checkin_at || "..." }}
            </p>
            <p>
              <strong>Check-out dự kiến:</strong>
              {{ guest.checkout_date || "..." }}
            </p>
            <p><strong>Ghi chú:</strong> {{ guest.note || "Không có" }}</p>
          </article>
        </div>
      </div>

      <div v-if="activeTab === 'create'">
        <div class="create-panel">
          <h3>Tạo booking mới</h3>
          <div class="form-row">
            <label>
              Phòng
              <select v-model.number="bookingForm.room_id">
                <option value="" disabled>Chọn phòng</option>
                <option
                  v-for="room in rooms"
                  :key="room.room_id"
                  :value="room.room_id"
                >
                  {{ room.room_number }} -
                  {{ room.type_name || room.type_id }} ({{ room.status }})
                </option>
              </select>
            </label>
            <label>
              Khách hàng
              <input
                v-model="bookingForm.customer_name"
                placeholder="Họ tên khách"
              />
            </label>
            <label>
              Số điện thoại
              <input v-model="bookingForm.phone" placeholder="0123456789" />
            </label>
            <label>
              Ngày check-in
              <input v-model="bookingForm.checkin_date" type="date" />
            </label>
            <label>
              Ngày check-out
              <input v-model="bookingForm.checkout_date" type="date" />
            </label>
            <label>
              Giá phòng
              <input
                v-model.number="bookingForm.total_amount"
                type="number"
                placeholder="1500000"
                readonly
              />
            </label>
            <label class="full-width">
              Ghi chú
              <textarea
                v-model="bookingForm.note"
                placeholder="Yêu cầu thêm..."
              ></textarea>
            </label>
          </div>
          <div class="form-actions">
            <button @click="submitBooking">Tạo booking</button>
          </div>
          <div v-if="createMessage" class="alert success">
            {{ createMessage }}
          </div>
          <div v-if="createError" class="alert error">{{ createError }}</div>
        </div>
      </div>

      <div v-if="activeTab === 'services'">
        <div v-if="servicesError" class="alert error">{{ servicesError }}</div>
        <div v-if="services.length === 0" class="empty-state">
          Không có dịch vụ nào
        </div>
        <div class="list">
          <article
            v-for="service in services"
            :key="service.id"
            class="item-card"
          >
            <h3>{{ service.service_name }}</h3>
            <p>
              <strong>Booking:</strong>
              {{ service.booking_code || service.booking_id }}
            </p>
            <p><strong>Số tiền:</strong> {{ service.amount }} VND</p>
            <p><strong>Thời gian:</strong> {{ service.created_at }}</p>
          </article>
        </div>
      </div>

      <div v-if="activeTab === 'password'">
        <div class="create-panel">
          <h3>Đổi mật khẩu</h3>
          <div class="form-row">
            <label>
              Mật khẩu cũ
              <input
                v-model="passwordForm.oldPassword"
                type="password"
                placeholder="Nhập mật khẩu cũ"
              />
            </label>
            <label>
              Mật khẩu mới
              <input
                v-model="passwordForm.newPassword"
                type="password"
                placeholder="Nhập mật khẩu mới"
              />
            </label>
            <label>
              Xác nhận mật khẩu mới
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
              />
            </label>
          </div>
          <div class="form-actions">
            <button @click="changePassword">Đổi mật khẩu</button>
          </div>
          <div v-if="passwordMessage" class="alert success">
            {{ passwordMessage }}
          </div>
          <div v-if="passwordError" class="alert error">
            {{ passwordError }}
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <h2>Phòng</h2>
      <div v-if="roomError" class="alert error">{{ roomError }}</div>
      <div v-if="rooms.length === 0" class="empty-state">Không có phòng</div>
      <div class="list">
        <article v-for="room in rooms" :key="room.room_id" class="item-card">
          <div>
            <h3>Phòng {{ room.room_number || room.room_id }}</h3>
            <p>
              <strong>Loại:</strong> {{ room.type_name || "..." }} ·
              <strong>Giá:</strong> {{ room.price || "..." }}
            </p>
            <p><strong>Trạng thái:</strong> {{ room.status || "..." }}</p>
            <p><strong>Ghi chú:</strong> {{ room.note || "Không có" }}</p>
          </div>
          <div class="room-actions">
            <select v-model="statusMap[room.room_id]">
              <option value="trống">trống</option>
              <option value="đã đặt">đã đặt</option>
              <option value="đang dọn">đang dọn</option>
            </select>
            <button @click="saveRoomStatus(room.room_id)">
              Lưu trạng thái
            </button>
            <textarea
              v-model="noteMap[room.room_id]"
              placeholder="Ghi chú"
            ></textarea>
            <button @click="saveRoomNote(room.room_id)">Lưu ghi chú</button>
          </div>
        </article>
      </div>
    </div>

    <!-- Modal chỉnh sửa booking -->
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal-content" @click.stop>
        <h3>Chỉnh sửa booking</h3>
        <div class="form-row">
          <label>
            Phòng ID
            <input v-model="editForm.room_id" type="number" />
          </label>
          <label>
            Ngày check-in
            <input v-model="editForm.checkin_date" type="date" />
          </label>
          <label>
            Ngày check-out
            <input v-model="editForm.checkout_date" type="date" />
          </label>
          <label>
            Tổng tiền
            <input v-model.number="editForm.total_amount" type="number" />
          </label>
          <label>
            Trạng thái
            <select v-model="editForm.status">
              <option value="pending">Chờ xác nhận</option>
              <option value="confirmed">Đã xác nhận</option>
              <option value="checked_in">Đã check-in</option>
              <option value="checked_out">Đã check-out</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </label>
          <label class="full-width">
            Ghi chú
            <textarea v-model="editForm.note"></textarea>
          </label>
        </div>
        <div class="modal-actions">
          <button @click="submitEditBooking">Lưu</button>
          <button @click="closeEditModal" class="ghost">Hủy</button>
        </div>
        <div v-if="editError" class="alert error">{{ editError }}</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import {
  fetchBranch,
  fetchBranchBookings,
  fetchCurrentGuests,
  fetchRooms,
  fetchStats,
  searchBookings,
  createBooking,
  addBookingService,
  confirmBooking,
  rejectBooking,
  checkInBooking,
  checkOutBooking,
  cancelBooking,
  updateBooking,
  updateRoomStatus as apiUpdateRoomStatus,
  updateRoomNote as apiUpdateRoomNote,
  changeStaffPassword,
} from "../services/api";

const route = useRoute();
const branchId = route.params.id;
const branch = reactive({});
const bookings = reactive([]);
const currentGuests = reactive([]);
const rooms = reactive([]);
const stats = reactive({ total_rooms: 0, empty_rooms: 0, occupied_rooms: 0 });
const query = ref("");
const activeTab = ref("bookings");
const bookingError = ref("");
const currentError = ref("");
const createError = ref("");
const createMessage = ref("");
const roomError = ref("");
const showEditModal = ref(false);
const editError = ref("");
const services = reactive([]);
const servicesError = ref("");
const statusMap = reactive({});
const noteMap = reactive({});
const serviceForm = reactive({});
const bookingForm = reactive({
  room_id: null,
  customer_name: "",
  phone: "",
  checkin_date: "",
  checkout_date: "",
  total_amount: 0,
  note: "",
  type_room: null,
});
const editForm = reactive({
  booking_id: null,
  room_id: null,
  checkin_date: "",
  checkout_date: "",
  total_amount: 0,
  status: "",
  note: "",
});
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordError = ref("");
const passwordMessage = ref("");
const selectedRoom = computed(() =>
  rooms.find((room) => room.room_id === bookingForm.room_id),
);

const getBookingNights = () => {
  if (!bookingForm.checkin_date || !bookingForm.checkout_date) return 0;
  const checkin = new Date(bookingForm.checkin_date);
  const checkout = new Date(bookingForm.checkout_date);
  if (Number.isNaN(checkin.getTime()) || Number.isNaN(checkout.getTime()))
    return 0;

  const diffDays = Math.ceil(
    (checkout.getTime() - checkin.getTime()) / (1000 * 60 * 60 * 24),
  );
  return diffDays <= 0 ? 1 : diffDays;
};

const updateBookingTotal = () => {
  if (!selectedRoom.value) {
    bookingForm.total_amount = 0;
    return;
  }
  const nights = getBookingNights() || 1;
  bookingForm.total_amount = (selectedRoom.value.price || 0) * nights;
  bookingForm.type_room = selectedRoom.value.type_id || bookingForm.type_room;
};

watch(
  [
    () => bookingForm.checkin_date,
    () => bookingForm.checkout_date,
    selectedRoom,
  ],
  updateBookingTotal,
  { immediate: true },
);

const normalizeDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const loadBranch = async () => {
  try {
    const data = await fetchBranch(branchId);
    Object.assign(branch, data || {});
  } catch (err) {
    bookingError.value =
      err.response?.data?.message || err.message || "Lỗi tải chi nhánh";
  }
};

const loadBookings = async () => {
  bookingError.value = "";
  try {
    const data = await fetchBranchBookings(branchId);
    bookings.splice(0, bookings.length, ...(data || []));
    for (const booking of bookings) {
      if (!serviceForm[booking.booking_id]) {
        serviceForm[booking.booking_id] = { service_name: "", amount: 0 };
      }
    }
  } catch (err) {
    bookingError.value =
      err.response?.data?.message || err.message || "Lỗi tải booking";
  }
};

const loadRooms = async () => {
  roomError.value = "";
  try {
    const data = await fetchRooms(branchId);
    rooms.splice(0, rooms.length, ...(data || []));
    for (const room of rooms) {
      statusMap[room.room_id] = room.status || "trống";
      noteMap[room.room_id] = room.note || "";
    }
  } catch (err) {
    roomError.value =
      err.response?.data?.message || err.message || "Lỗi tải phòng";
  }
};

const loadCurrentGuests = async () => {
  currentError.value = "";
  try {
    const data = await fetchCurrentGuests(branchId);
    currentGuests.splice(0, currentGuests.length, ...(data || []));
  } catch (err) {
    currentError.value =
      err.response?.data?.message || err.message || "Lỗi tải khách đang ở";
  }
};

const resetBookingForm = () => {
  bookingForm.room_id = null;
  bookingForm.checkin_date = "";
  bookingForm.checkout_date = "";
  bookingForm.total_amount = 0;
  bookingForm.note = "";
  bookingForm.type_room = 1;
};

const submitBooking = async () => {
  createError.value = "";
  createMessage.value = "";
  try {
    await createBooking(branchId, {
      branch_id: branchId,
      room_id: bookingForm.room_id,
      customer_name: bookingForm.customer_name,
      phone: bookingForm.phone,
      checkin_date: bookingForm.checkin_date,
      checkout_date: bookingForm.checkout_date,
      total_amount: bookingForm.total_amount,
      note: bookingForm.note,
      type_room: bookingForm.type_room,
    });
    createMessage.value = "Tạo booking thành công.";
    resetBookingForm();
    await loadBookings();
    await loadStats();
  } catch (err) {
    createError.value =
      err.response?.data?.message || err.message || "Tạo booking thất bại";
  }
};

const submitService = async (bookingId) => {
  bookingError.value = "";
  try {
    const service = serviceForm[bookingId] || { service_name: "", amount: 0 };
    await addBookingService(bookingId, {
      service_name: service.service_name,
      amount: service.amount,
    });
    serviceForm[bookingId] = { service_name: "", amount: 0 };
    await loadBookings();
    createMessage.value = "Ghi nhận dịch vụ thành công.";
  } catch (err) {
    bookingError.value =
      err.response?.data?.message || err.message || "Ghi nhận dịch vụ thất bại";
  }
};

const loadServices = async () => {
  servicesError.value = "";
  try {
    // Giả định API lấy tất cả dịch vụ của chi nhánh
    // Vì backend chưa có, tạm thời để trống hoặc lấy từ bookings
    services.splice(0, services.length);
    // Có thể thêm logic để lấy từ bookings nếu có
  } catch (err) {
    servicesError.value =
      err.response?.data?.message || err.message || "Lỗi tải dịch vụ";
  }
};

const openEditModal = (booking) => {
  editForm.booking_id = booking.booking_id;
  editForm.room_id = booking.room_id;
  editForm.checkin_date = normalizeDate(booking.checkin_date);
  editForm.checkout_date = normalizeDate(booking.checkout_date);
  editForm.total_amount = booking.total_amount;
  editForm.status = booking.status;
  editForm.note = booking.note;
  editError.value = "";
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const submitEditBooking = async () => {
  editError.value = "";
  try {
    await updateBooking(editForm.booking_id, {
      room_id: editForm.room_id,
      checkin_date: editForm.checkin_date,
      checkout_date: editForm.checkout_date,
      total_amount: editForm.total_amount,
      status: editForm.status,
      note: editForm.note,
    });
    await loadBookings();
    await loadStats();
    showEditModal.value = false;
    createMessage.value = "Cập nhật booking thành công.";
  } catch (err) {
    editError.value =
      err.response?.data?.message || err.message || "Cập nhật booking thất bại";
  }
};

const loadStats = async () => {
  try {
    const data = await fetchStats(branchId);
    Object.assign(stats, data || {});
  } catch (err) {
    // ignore stats load error
  }
};

const search = async () => {
  if (!query.value.trim()) {
    return loadBookings();
  }
  bookingError.value = "";
  try {
    const data = await searchBookings(branchId, query.value);
    bookings.splice(0, bookings.length, ...(data || []));
  } catch (err) {
    bookingError.value =
      err.response?.data?.message || err.message || "Lỗi tìm kiếm booking";
  }
};

const handleAction = async (action, id) => {
  bookingError.value = "";
  try {
    if (action === "confirm") await confirmBooking(id);
    if (action === "reject") await rejectBooking(id);
    if (action === "checkin") await checkInBooking(id);
    if (action === "checkout") await checkOutBooking(id);
    if (action === "cancel") await cancelBooking(id);
    await loadBookings();
    await loadStats();
  } catch (err) {
    bookingError.value =
      err.response?.data?.message || err.message || "Thao tác thất bại";
  }
};

const saveRoomStatus = async (roomId) => {
  roomError.value = "";
  try {
    await apiUpdateRoomStatus(roomId, statusMap[roomId]);
    await loadRooms();
    await loadStats();
  } catch (err) {
    roomError.value =
      err.response?.data?.message ||
      err.message ||
      "Cập nhật trạng thái phòng thất bại";
  }
};

const saveRoomNote = async (roomId) => {
  roomError.value = "";
  try {
    await apiUpdateRoomNote(roomId, noteMap[roomId]);
    await loadRooms();
  } catch (err) {
    roomError.value =
      err.response?.data?.message ||
      err.message ||
      "Cập nhật ghi chú phòng thất bại";
  }
};

const changePassword = async () => {
  passwordError.value = "";
  passwordMessage.value = "";

  if (
    !passwordForm.oldPassword ||
    !passwordForm.newPassword ||
    !passwordForm.confirmPassword
  ) {
    passwordError.value = "Vui lòng điền đầy đủ thông tin";
    return;
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordError.value = "Mật khẩu xác nhận không khớp";
    return;
  }

  if (passwordForm.newPassword.length < 6) {
    passwordError.value = "Mật khẩu mới phải có ít nhất 6 ký tự";
    return;
  }

  try {
    await changeStaffPassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });
    passwordMessage.value = "Đổi mật khẩu thành công";
    passwordForm.oldPassword = "";
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  } catch (err) {
    passwordError.value =
      err.response?.data?.message || err.message || "Đổi mật khẩu thất bại";
  }
};

onMounted(async () => {
  await loadBranch();
  await loadBookings();
  await loadRooms();
  await loadStats();
  await loadCurrentGuests();
  await loadServices();
});
</script>

<style scoped>
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}
.grid-two {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.panel {
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.08);
}
.stat-row {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
.stat-card {
  flex: 1;
  min-width: 140px;
  padding: 1rem;
  background: #eef2ff;
  border-radius: 14px;
}
.search-row {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 0.75rem;
  align-items: center;
}
.search-row input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
}
.search-row button {
  padding: 0.85rem 1rem;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
.search-row .ghost {
  background: #e5e7eb;
  color: #111827;
}
.tab-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}
.tab-row button {
  padding: 0.75rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: #f8fafc;
  color: #111827;
  cursor: pointer;
}
.tab-row button.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
.service-form {
  margin-top: 1rem;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}
.service-form h4 {
  margin: 0 0 0.75rem;
}
.service-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 0.75rem;
  align-items: center;
}
.service-row input {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
}
.create-panel {
  display: grid;
  gap: 1rem;
}
.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.form-row label {
  display: grid;
  gap: 0.5rem;
  font-weight: 600;
}
.form-row input,
.form-row select,
.form-row textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  border: 1px solid #d1d5db;
}
.form-row textarea {
  min-height: 120px;
  resize: vertical;
}
.full-width {
  grid-column: 1 / -1;
}
.form-actions {
  display: flex;
  justify-content: flex-start;
}
.form-actions button {
  border: none;
  border-radius: 12px;
  padding: 0.85rem 1.2rem;
  background: #16a34a;
  color: white;
  cursor: pointer;
}
.list {
  display: grid;
  gap: 1rem;
}
.item-card {
  padding: 1.25rem;
  background: white;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
}
.item-main {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
}
.item-main h3 {
  margin: 0 0 0.5rem;
}
.tag {
  padding: 0.5rem 0.8rem;
  border-radius: 999px;
  background: #f8fafc;
  color: #111827;
  font-weight: 600;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}
.actions button {
  border: none;
  border-radius: 12px;
  padding: 0.65rem 0.9rem;
  cursor: pointer;
  background: #3b82f6;
  color: white;
}
.actions button.danger {
  background: #ef4444;
}
.actions button.success {
  background: #16a34a;
}
.actions button.warning {
  background: #f59e0b;
}
.room-actions {
  display: grid;
  gap: 0.75rem;
  margin-top: 1rem;
}
.room-actions select,
.room-actions textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 1rem;
}
.room-actions textarea {
  min-height: 80px;
  resize: vertical;
}
.room-actions button {
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  color: white;
  background: #2563eb;
  text-decoration: none;
}
.alert.error {
  margin-bottom: 1rem;
  color: #b91c1c;
}
.empty-state {
  padding: 1.5rem;
  margin-top: 1rem;
  background: #f8fafc;
  border-radius: 16px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 18px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}
.modal-actions button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
}
.modal-actions .ghost {
  background: #e5e7eb;
  color: #111827;
}
</style>
=======
  <div class="min-h-screen bg-stone-50 px-6 py-10">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
          <span>&larr;</span> Quay về trang chủ
        </RouterLink>
      </div>

      <div v-if="loading" class="rounded-3xl bg-white p-8 text-center text-stone-500 shadow-sm ring-1 ring-stone-200">
        Đang tải thông tin chi nhánh...
      </div>
      <div v-else-if="branch" class="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200">
        <div class="h-64 bg-[linear-gradient(135deg,#f5f5f4,#e7e5e4,#fafaf9)] flex items-center justify-center">
          <span class="text-stone-400">Ảnh chi nhánh</span>
        </div>
        <div class="p-8">
          <span v-if="branch.is_active" class="mb-4 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">Đang hoạt động</span>
          <span v-else class="mb-4 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700 ring-1 ring-red-200">Ngừng hoạt động</span>
          
          <h1 class="text-3xl font-bold text-stone-900">{{ branch.branchName }}</h1>

          <div class="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 class="text-sm font-medium uppercase tracking-wider text-stone-500">Địa chỉ</h3>
              <p class="mt-2 text-stone-900">{{ branch.address }}</p>
            </div>

            <div>
              <h3 class="text-sm font-medium uppercase tracking-wider text-stone-500">Liên hệ</h3>
              <div class="mt-2 space-y-2 text-stone-900">
                <p>Điện thoại: {{ branch.phone || 'Chưa cập nhật' }}</p>
                <p>Email: {{ branch.email || 'Chưa cập nhật' }}</p>
              </div>
            </div>

            <div class="md:col-span-2">
              <h3 class="text-sm font-medium uppercase tracking-wider text-stone-500">Mô tả</h3>
              <p class="mt-2 leading-relaxed text-stone-600">{{ branch.description || 'Chưa có mô tả' }}</p>
            </div>
          </div>
          
          <div class="mt-8 border-t border-stone-100 pt-8">
            <h3 class="text-xl font-semibold text-stone-900">Danh sách phòng theo chi nhánh</h3>

            <p v-if="loadingRooms" class="mt-2 text-stone-500">Đang tải danh sách phòng...</p>
            <p v-else-if="roomsError" class="mt-2 text-red-500">{{ roomsError }}</p>
            <p v-else-if="rooms.length === 0" class="mt-2 text-stone-500">Chi nhánh này hiện chưa có phòng hoạt động.</p>

            <div v-else class="mt-6 grid gap-4 sm:grid-cols-2">
              <article
                v-for="room in rooms"
                :key="room.roomId"
                class="rounded-2xl border border-stone-200 bg-stone-50 p-5"
              >
                <div class="flex items-center justify-between gap-3">
                  <h4 class="text-lg font-semibold text-stone-900">Phòng {{ room.roomNumber || room.roomName }}</h4>
                  <span class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                    {{ room.status }}
                  </span>
                </div>
                <p class="mt-2 text-sm text-stone-600">Loại phòng: {{ room.roomType }}</p>
                <p class="mt-1 text-sm text-stone-600">Sức chứa: {{ room.capacity }} người</p>
                <p class="mt-1 text-sm font-medium text-stone-900">
                  Giá/đêm: {{ formatPrice(room.pricePerNight) }}
                </p>
                <p class="mt-2 text-sm text-stone-500">
                  {{ room.description || 'Chưa có mô tả phòng' }}
                </p>
                <div class="mt-3 flex gap-2">
                  <RouterLink
                    :to="`/rooms/${room.roomId}`"
                    class="inline-flex rounded-xl border border-stone-300 px-3 py-2 text-xs font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
                  >
                    Xem chi tiết
                  </RouterLink>
                  <RouterLink
                    :to="{ path: '/booking', query: { roomId: room.roomId } }"
                    class="inline-flex rounded-xl bg-stone-900 px-3 py-2 text-xs font-medium text-white transition hover:opacity-90"
                  >
                    Đặt phòng
                  </RouterLink>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="rounded-3xl bg-white p-8 text-center text-red-500 shadow-sm ring-1 ring-stone-200">
        Không tìm thấy chi nhánh
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { branchService } from '@/services/branch.service'
import { roomService } from '@/services/room.service'
import { parseApiError } from '@/utils/api-error'

// Công cụ lấy ID chi nhánh thông qua URL đang mở (vd: /branches/1 => lấy được số 1)
const route = useRoute()

// Biến lưu trữ
const branch = ref(null)     // Chứa cụm dữ liệu object của chi nhánh sau khi API trả về
const rooms = ref([])        // Danh sách phòng theo chi nhánh
const loading = ref(true)    // Hiển thị khung Skeleton loading chi nhánh
const loadingRooms = ref(false)
const roomsError = ref('')

const formatPrice = (value) => {
  if (value === undefined || value === null || Number.isNaN(Number(value))) {
    return 'Liên hệ'
  }

  return Number(value).toLocaleString('vi-VN') + 'đ'
}

// Chạy khi giao diện gắn vào
onMounted(async () => {
  const branchId = Number(route.params.id)

  try {
    // Truyền tham số id lấy từ URL cho branchService để gửi xuống Backend lấy data
    const res = await branchService.getBranchById(route.params.id)
    // Gán dữ liệu nhận được vào giao diện Vue tự vẽ lại
    branch.value = res.data?.data
  } catch (err) {
    console.error(err)
  } finally {
    // Tắt loading spinner
    loading.value = false
  }

  if (!branchId || Number.isNaN(branchId)) {
    roomsError.value = 'Chi nhánh không hợp lệ'
    return
  }

  loadingRooms.value = true
  roomsError.value = ''

  try {
    const res = await roomService.getRoomsByBranchId(branchId)
    rooms.value = res.data?.data || []
  } catch (err) {
    roomsError.value = parseApiError(err, 'Không thể tải danh sách phòng')
  } finally {
    loadingRooms.value = false
  }
})
</script>
>>>>>>> 1d408ad14e9f80697ad4155be407b8e65c4528a5
