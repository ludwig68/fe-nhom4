<template>
  <div class="min-h-screen bg-stone-50 text-stone-900">
    <header class="border-b border-stone-200 bg-white">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500">Fourgroup Hotel</p>
          <h1 class="mt-1 text-2xl font-semibold">Dat phong voi du lieu thuc</h1>
        </div>

        <nav class="flex flex-wrap items-center gap-2">
          <RouterLink to="/branches"
            class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
            Chi nhanh
          </RouterLink>
          <RouterLink to="/rooms"
            class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
            Tim phong
          </RouterLink>
          <RouterLink to="/booking"
            class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700">
            Dat phong
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/my-bookings"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
              Don cua toi
            </RouterLink>
            <button type="button" @click="handleLogout"
              class="rounded-xl border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50">
              Dang xuat
            </button>
          </template>

          <template v-else>
            <RouterLink to="/login"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
              Dang nhap
            </RouterLink>
            <RouterLink to="/register"
              class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700">
              Dang ky
            </RouterLink>
          </template>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-10">
      <section class="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
        <article class="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-stone-200">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-stone-500">Tong quan he thong</p>
          <h2 class="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">
            Du lieu chi nhanh, phong va dich vu dang duoc tai truc tiep tu API
          </h2>
          <p class="mt-3 text-sm leading-7 text-stone-600">
            Home view nay da khong dung data demo. Tat ca thong tin ben duoi duoc lay tu database qua backend.
          </p>

          <div class="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-2xl bg-stone-100 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-stone-500">Chi nhanh</p>
              <p class="mt-2 text-2xl font-semibold text-stone-900">{{ stats.totalBranches }}</p>
            </div>
            <div class="rounded-2xl bg-stone-100 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-stone-500">Loai phong</p>
              <p class="mt-2 text-2xl font-semibold text-stone-900">{{ stats.totalRoomTypes }}</p>
            </div>
            <div class="rounded-2xl bg-stone-100 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-stone-500">Phong trong hom nay</p>
              <p class="mt-2 text-2xl font-semibold text-stone-900">{{ stats.availableToday }}</p>
            </div>
            <div class="rounded-2xl bg-stone-100 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-stone-500">Dich vu kem theo</p>
              <p class="mt-2 text-2xl font-semibold text-stone-900">{{ stats.totalServices }}</p>
            </div>
          </div>

          <div class="mt-6 flex flex-wrap gap-3">
            <RouterLink to="/rooms"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
              Xem tat ca phong
            </RouterLink>
            <RouterLink to="/branches"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
              Xem chi nhanh
            </RouterLink>
            <RouterLink to="/booking"
              class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700">
              Bat dau dat phong
            </RouterLink>
          </div>
        </article>

        <aside class="rounded-3xl bg-stone-900 p-7 text-stone-100 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.22em] text-stone-400">Session</p>
          <h3 class="mt-3 text-2xl font-semibold">
            {{ authStore.isAuthenticated ? 'Da dang nhap' : 'Chua dang nhap' }}
          </h3>
          <p class="mt-2 text-sm leading-7 text-stone-300">{{ sessionMessage }}</p>

          <div class="mt-6 space-y-3">
            <div class="rounded-2xl border border-stone-700 bg-stone-950/40 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-stone-400">Nguoi dung</p>
              <p class="mt-1 text-base font-medium text-white">{{ displayName }}</p>
            </div>
            <div class="rounded-2xl border border-stone-700 bg-stone-950/40 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-stone-400">Vai tro</p>
              <p class="mt-1 text-base font-medium text-white">{{ displayRole }}</p>
            </div>
            <div class="rounded-2xl border border-stone-700 bg-stone-950/40 p-4">
              <p class="text-xs uppercase tracking-[0.16em] text-stone-400">Token</p>
              <p class="mt-1 text-sm font-medium text-white">
                {{ authStore.accessToken ? 'Da luu trong localStorage' : 'Chua co token' }}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <p v-if="loadError" class="mt-6 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-200">
        {{ loadError }}
      </p>

      <section class="mt-8">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-stone-900">Chi nhanh noi bat</h3>
          <RouterLink to="/branches" class="text-sm font-medium text-stone-600 hover:text-stone-900">
            Xem tat ca
          </RouterLink>
        </div>

        <div v-if="loading" class="grid gap-4 md:grid-cols-3">
          <div v-for="n in 3" :key="`branch-skeleton-${n}`" class="h-44 rounded-2xl bg-stone-200/80" />
        </div>

        <div v-else-if="topBranches.length === 0"
          class="rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
          Chua co du lieu chi nhanh.
        </div>

        <div v-else class="grid gap-4 md:grid-cols-3">
          <article v-for="branch in topBranches" :key="branch.branchId"
            class="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <h4 class="text-lg font-semibold text-stone-900">{{ branch.branchName }}</h4>
            <p class="mt-2 line-clamp-2 text-sm text-stone-600">{{ branch.address || 'Chua cap nhat dia chi' }}</p>
            <p class="mt-2 text-sm text-stone-500">{{ branch.phone || 'Chua cap nhat SDT' }}</p>
            <RouterLink :to="`/branches/${branch.branchId}`"
              class="mt-4 inline-flex rounded-xl border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
              Xem chi tiet
            </RouterLink>
          </article>
        </div>
      </section>

      <section class="mt-8">
        <div class="mb-4 flex items-center justify-between">
          <h3 class="text-xl font-semibold text-stone-900">Phong goi y dang trong</h3>
          <RouterLink to="/rooms" class="text-sm font-medium text-stone-600 hover:text-stone-900">
            Tim them phong
          </RouterLink>
        </div>

        <div v-if="loading" class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div v-for="n in 6" :key="`room-skeleton-${n}`" class="h-64 rounded-2xl bg-stone-200/80" />
        </div>

        <div v-else-if="featuredRooms.length === 0"
          class="rounded-2xl bg-white px-6 py-8 text-center text-stone-500 ring-1 ring-stone-200">
          Chua co phong trong phu hop.
        </div>

        <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <article v-for="room in featuredRooms" :key="room.roomId"
            class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200">
            <div class="h-44 bg-stone-100">
              <img v-if="room.images?.[0]?.imageUrl" :src="room.images[0].imageUrl" :alt="`Phong ${room.roomNumber}`"
                class="h-full w-full object-cover" />
              <div v-else class="flex h-full items-center justify-center text-sm text-stone-500">
                Chua co hinh anh
              </div>
            </div>

            <div class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <h4 class="text-lg font-semibold text-stone-900">Phong {{ room.roomNumber }}</h4>
                  <p class="mt-1 text-sm text-stone-500">{{ room.branchName }}</p>
                </div>
                <span
                  class="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  {{ room.status }}
                </span>
              </div>

              <p class="mt-3 text-sm text-stone-600">{{ room.roomType }} · {{ room.capacity }} nguoi</p>
              <p class="mt-1 text-lg font-semibold text-stone-900">{{ formatPrice(room.pricePerNight) }}/dem</p>

              <div class="mt-3 flex flex-wrap gap-2">
                <span v-for="amenity in (room.amenities || []).slice(0, 3)" :key="`${room.roomId}-${amenity.amenityId}`"
                  class="rounded-full bg-stone-100 px-2 py-1 text-xs text-stone-700">
                  {{ amenity.amenityName }}
                </span>
              </div>

              <div class="mt-4 grid grid-cols-2 gap-2">
                <RouterLink :to="`/rooms/${room.roomId}`"
                  class="inline-flex items-center justify-center rounded-xl border border-stone-300 px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100">
                  Chi tiet
                </RouterLink>
                <RouterLink :to="{ path: '/booking', query: { roomId: room.roomId } }"
                  class="inline-flex items-center justify-center rounded-xl bg-stone-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-stone-700">
                  Dat ngay
                </RouterLink>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <div class="mb-4 flex items-center justify-between gap-4">
          <h3 class="text-xl font-semibold text-stone-900">Dich vu kem theo</h3>
          <RouterLink to="/booking" class="text-sm font-medium text-stone-600 hover:text-stone-900">
            Dat phong + dich vu
          </RouterLink>
        </div>

        <div v-if="loading" class="grid gap-3 sm:grid-cols-3">
          <div v-for="n in 3" :key="`service-skeleton-${n}`" class="h-24 rounded-2xl bg-stone-200/80" />
        </div>

        <div v-else-if="services.length === 0" class="rounded-2xl bg-stone-50 px-4 py-6 text-center text-stone-500">
          Chua co dich vu kem theo.
        </div>

        <div v-else class="grid gap-3 sm:grid-cols-3">
          <article v-for="service in services" :key="service.serviceId"
            class="rounded-2xl border border-stone-200 bg-stone-50 p-4">
            <p class="text-base font-semibold text-stone-900">{{ service.serviceName }}</p>
            <p class="mt-2 line-clamp-2 text-sm text-stone-600">{{ service.description || 'Khong co mo ta' }}</p>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { branchService } from '@/services/branch.service';
import { roomService } from '@/services/room.service';
import { bookingService } from '@/services/booking.service';
import { parseApiError } from '@/utils/api-error';

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(true);
const loadError = ref('');

const branches = ref([]);
const rooms = ref([]);
const roomMeta = ref({ roomTypes: [] });
const services = ref([]);
const availableTodayRooms = ref([]);

const formatPrice = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString('vi-VN') + 'd';
};

const toDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const topBranches = computed(() => branches.value.slice(0, 3));

const featuredRooms = computed(() =>
  [...rooms.value]
    .sort((a, b) => Number(a.pricePerNight || 0) - Number(b.pricePerNight || 0))
    .slice(0, 6)
);

const stats = computed(() => ({
  totalBranches: branches.value.length,
  totalRoomTypes: roomMeta.value?.roomTypes?.length || 0,
  availableToday: availableTodayRooms.value.length,
  totalServices: services.value.length
}));

const displayName = computed(() => {
  const user = authStore.user;
  if (!user) return 'Khach';
  return user.full_name || user.username || user.email || 'Nguoi dung';
});

const displayRole = computed(() => {
  return authStore.user?.role_name || 'Chua dang nhap';
});

const sessionMessage = computed(() => {
  if (authStore.isAuthenticated) {
    return 'Ban co the theo doi lich su dat phong, chi tiet booking va gui danh gia sau check-out.';
  }
  return 'Dang nhap de dat phong, quan ly don va su dung day du cac tinh nang ca nhan.';
});

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login');
};

const loadHomeData = async () => {
  loading.value = true;
  loadError.value = '';

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  try {
    const [branchesRes, roomsRes, roomMetaRes, servicesRes, availableRes] = await Promise.all([
      branchService.getAllBranches(),
      roomService.searchRooms({ availableOnly: true }),
      roomService.getRoomSearchMeta(),
      bookingService.getServiceCatalog(),
      bookingService.getAvailableRooms({
        checkIn: toDateInputValue(today),
        checkOut: toDateInputValue(tomorrow)
      })
    ]);

    branches.value = branchesRes.data?.data || [];
    rooms.value = roomsRes.data?.data || [];
    roomMeta.value = roomMetaRes.data?.data || { roomTypes: [] };
    services.value = servicesRes.data?.data || [];
    availableTodayRooms.value = availableRes.data?.data || [];
  } catch (error) {
    loadError.value = parseApiError(error, 'Khong the tai du lieu trang chu');
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchMe();
    } catch (error) {
      // ignore auth refresh error, home data can still load as public
    }
  }

  await loadHomeData();
});
</script>
