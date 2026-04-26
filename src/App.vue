<template>
<<<<<<< HEAD
  <div class="app-shell">
    <header class="topbar">
      <div class="brand">Booking Manager</div>
      <nav>
        <router-link to="/branches" v-if="isAuthenticated"
          >Chi nhánh</router-link
        >
        <router-link to="/login" v-if="!isAuthenticated">Đăng nhập</router-link>
        <button
          class="link-button"
          @click="handleLogout"
          v-if="isAuthenticated"
        >
          Đăng xuất
        </button>
      </nav>
    </header>

    <main class="page-container">
      <router-view />
    </main>
=======
  <div class="min-h-screen bg-stone-50 text-stone-800">
    <header class="sticky top-0 z-50 bg-transparent">
      <div class="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div class="flex items-center justify-between gap-6 rounded-[28px] border border-stone-300/70 bg-white/65 px-4 py-3 shadow-sm shadow-stone-200/30 backdrop-blur-[3px]">
          <RouterLink
            to="/"
            class="group flex items-center gap-3 rounded-2xl px-1 py-1 transition hover:bg-stone-100/70"
            aria-label="Về trang chủ"
          >
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-sm font-semibold tracking-[0.2em] text-white transition group-hover:bg-stone-700">
              HL
            </div>
            <div>
              <p class="text-lg font-semibold tracking-[0.08em] text-stone-900">HOTEL LUXE</p>
              <p class="text-xs text-stone-500">Hệ thống đặt phòng khách sạn</p>
            </div>
          </RouterLink>

          <nav class="hidden items-center gap-2 rounded-full bg-white/60 px-2 py-2 text-sm text-stone-600 ring-1 ring-stone-200/80 lg:flex">
            <RouterLink :to="{ name: 'home', hash: '#gioi-thieu' }" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Giới thiệu</RouterLink>
            <RouterLink to="/branches" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Chi nhánh</RouterLink>
            <RouterLink to="/rooms" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Phòng</RouterLink>
            <RouterLink to="/booking" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Đặt phòng</RouterLink>
            <RouterLink
              v-if="authStore.isAuthenticated"
              to="/my-bookings"
              class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900"
            >
              Đơn của tôi
            </RouterLink>
            <RouterLink :to="{ name: 'home', hash: '#danh-gia' }" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Đánh giá</RouterLink>
          </nav>

          <div class="hidden items-center gap-3 lg:flex">
            <RouterLink
              :to="{ name: 'home', hash: '#lien-he' }"
              class="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
            >
              Liên hệ
            </RouterLink>

            <template v-if="authStore.isAuthenticated">
              <RouterLink
                to="/profile"
                class="rounded-full border border-stone-300/80 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white"
              >
                Tài khoản
              </RouterLink>
              <button
                type="button"
                @click="handleLogout"
                class="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Đăng xuất
              </button>
            </template>

            <template v-else>
              <RouterLink
                to="/login"
                class="rounded-full border border-stone-300/80 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-white"
              >
                Đăng nhập
              </RouterLink>
              <RouterLink
                to="/register"
                class="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Đăng ký
              </RouterLink>
            </template>
          </div>

          <button class="flex h-11 w-11 items-center justify-center rounded-2xl border border-stone-300/80 bg-white/70 text-stone-700 lg:hidden">
            <span class="text-lg">☰</span>
          </button>
        </div>
      </div>
    </header>

    <RouterView v-if="!isHomeRoute" />
    
    <main v-else>
      <section id="gioi-thieu" class="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
      <div class="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-stone-600 shadow-sm ring-1 ring-stone-200">
            <span class="h-2 w-2 rounded-full bg-amber-500"></span>
            Website đặt phòng đơn giản, dễ dùng và dễ theo dõi
          </div>

          <h1 class="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-stone-900 sm:text-5xl xl:text-6xl">
            Đặt phòng khách sạn
            <span class="text-stone-500">nhanh chóng, rõ ràng và dễ theo dõi</span>
          </h1>

          <p class="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
            Người dùng có thể xem chi nhánh, tìm phòng còn trống, chọn dịch vụ đi kèm,
            gửi yêu cầu đặt phòng và theo dõi lịch sử đặt phòng trên cùng một website.
          </p>

          <div class="mt-8 flex flex-col gap-4 sm:flex-row">
            <RouterLink to="/rooms" class="inline-flex items-center justify-center rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90">
              Tìm phòng ngay
            </RouterLink>
            <RouterLink to="/branches" class="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white px-6 py-4 text-sm font-semibold text-stone-800 transition hover:bg-stone-100">
              Xem chi nhánh
            </RouterLink>
          </div>

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <p class="text-2xl font-semibold text-stone-900">12+</p>
              <p class="mt-2 text-sm leading-6 text-stone-500">Chi nhánh tại nhiều khu vực</p>
            </div>
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <p class="text-2xl font-semibold text-stone-900">100+</p>
              <p class="mt-2 text-sm leading-6 text-stone-500">Phòng với nhiều mức giá khác nhau</p>
            </div>
            <div class="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
              <p class="text-2xl font-semibold text-stone-900">24/7</p>
              <p class="mt-2 text-sm leading-6 text-stone-500">Hỗ trợ khách hàng mỗi ngày</p>
            </div>
          </div>
        </div>

        <div class="rounded-[32px] bg-white p-5 shadow-xl shadow-stone-200/60 ring-1 ring-stone-200">
          <div class="rounded-[28px] bg-stone-50 p-5 ring-1 ring-stone-200">
            <div class="flex items-center justify-between gap-4">
              <div>
                <p class="text-sm text-stone-500">Tìm phòng</p>
                <h3 class="text-2xl font-semibold text-stone-900">Tìm phòng phù hợp chỉ trong vài bước</h3>
              </div>
              <span class="rounded-full bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                Còn phòng
              </span>
            </div>

            <div class="mt-6 grid gap-4 md:grid-cols-2">
              <div>
                <label class="mb-2 block text-sm text-stone-500">Ngày nhận phòng</label>
                <input v-model="searchForm.checkIn" type="date" class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm text-stone-500">Ngày trả phòng</label>
                <input v-model="searchForm.checkOut" type="date" class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm text-stone-500">Chi nhánh</label>
                <select v-model="searchForm.branchId" class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500">
                  <option value="">Chọn chi nhánh</option>
                  <option v-for="branch in branches" :key="branch.branchId" :value="branch.branchId">
                    {{ branch.branchName }}
                  </option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm text-stone-500">Số người</label>
                <select v-model="searchForm.capacity" class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500">
                  <option value="">Chọn số người</option>
                  <option value="1">1 người</option>
                  <option value="2">2 người</option>
                  <option value="3">3 người</option>
                  <option value="4">4 người</option>
                  <option value="5">5 người</option>
                  <option value="6">6 người</option>
                </select>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <p class="text-xs uppercase tracking-[0.2em] text-stone-400">Giá từ</p>
                <p class="mt-2 text-lg font-semibold text-stone-900">{{ formatCurrency(minimumPrice) }}</p>
              </div>
              <div class="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <p class="text-xs uppercase tracking-[0.2em] text-stone-400">Dịch vụ</p>
                <p class="mt-2 text-lg font-semibold text-stone-900">Ăn sáng, massage</p>
              </div>
              <div class="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <p class="text-xs uppercase tracking-[0.2em] text-stone-400">Xác nhận</p>
                <p class="mt-2 text-lg font-semibold text-stone-900">Nhanh chóng</p>
              </div>
            </div>

            <button @click="handleSearch" type="button" class="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-stone-900 px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90">
              Tìm phòng ngay
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div v-for="group in featureGroups" :key="group.title" class="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-100 text-xl">{{ group.icon }}</div>
          <h3 class="mt-5 text-xl font-semibold text-stone-900">{{ group.title }}</h3>
          <p class="mt-3 text-sm leading-7 text-stone-500">{{ group.description }}</p>
          <ul class="mt-5 space-y-3 text-sm text-stone-700">
            <li v-for="item in group.items" :key="item" class="flex items-start gap-3 leading-6">
              <span class="mt-2 h-2 w-2 rounded-full bg-amber-500"></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section id="chi-nhanh" class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div class="mb-8 max-w-2xl">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">Chi nhánh</p>
        <h2 class="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Xem thông tin từng chi nhánh một cách rõ ràng</h2>
        <p class="mt-4 text-stone-500">Khách có thể xem địa chỉ, mô tả, liên hệ và danh sách phòng của từng nơi.</p>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <article v-for="branch in branches" :key="branch.branchId" class="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1">
          <div class="h-56 bg-[linear-gradient(135deg,#f5f5f4,#e7e5e4,#fafaf9)]"></div>
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-stone-900">{{ branch.branchName }}</h3>
                <p class="mt-2 text-sm text-stone-500">{{ branch.address }}</p>
              </div>
              <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                Chi nhánh
              </span>
            </div>
            <p class="mt-4 text-sm leading-7 text-stone-600 line-clamp-3">{{ branch.description }}</p>
            <div class="mt-5 flex items-center justify-between text-sm">
              <span class="text-stone-500">{{ branch.phone || 'Chưa cập nhật số điện thoại' }}</span>
              <button @click="router.push('/branches/' + branch.branchId)" class="font-medium text-stone-900 transition hover:text-stone-600">Xem chi tiết</button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="phong" class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div class="mb-8 max-w-2xl">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">Phòng khách sạn</p>
        <h2 class="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Tìm kiếm phòng, lọc phòng và xem phòng còn trống</h2>
      </div>

      <div class="mb-6 grid gap-4 rounded-[28px] bg-white p-5 shadow-sm ring-1 ring-stone-200 lg:grid-cols-5">
        <input v-model="quickFilter.keyword" type="text" placeholder="Tìm theo tên phòng hoặc chi nhánh" class="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none lg:col-span-2" />
        <select v-model="quickFilter.type" class="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none">
          <option value="">Loại phòng</option>
          <option v-for="t in uniqueRoomTypes" :key="t" :value="t">{{ t }}</option>
        </select>
        <select v-model="quickFilter.priceRange" class="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none">
          <option value="">Mức giá</option>
          <option value="under1">Dưới 1 triệu</option>
          <option value="1to2">1 - 2 triệu</option>
          <option value="over2">Trên 2 triệu</option>
        </select>
        <button @click="handleQuickSearch" type="button" class="rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Lọc phòng
        </button>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <article v-for="room in rooms.slice(0, 3)" :key="room.roomId" class="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1">
          <div class="h-56 bg-[linear-gradient(135deg,#fafaf9,#e7e5e4,#f5f5f4)]">
            <img v-if="room.images?.[0]?.imageUrl" :src="room.images[0].imageUrl" :alt="`Khách sạn ${room.roomNumber}`" class="h-full w-full object-cover">
          </div>
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-stone-900">Phòng {{ room.roomNumber }}</h3>
                <p class="mt-2 text-sm text-stone-500">{{ room.branchName }}</p>
              </div>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                {{ getRoomStatusText(room.status) }}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              <span v-if="room.roomType" class="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                {{ room.roomType }}
              </span>
              <span v-if="room.capacity" class="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                {{ room.capacity }} người
              </span>
            </div>

            <div class="mt-6 flex items-center justify-between border-t border-stone-100 pt-4">
              <div>
                <p class="text-xs font-medium text-stone-500 uppercase tracking-widest">Giá mỗi đêm</p>
                <p class="text-lg font-bold text-stone-900">{{ formatCurrency(room.pricePerNight) }}/đêm</p>
              </div>
              <RouterLink v-if="room.isAvailable" :to="{ path: '/booking', query: { roomId: room.roomId } }" class="inline-flex items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700">
                Đặt ngay
              </RouterLink>
              <button v-else disabled class="inline-flex items-center justify-center rounded-xl bg-stone-300 px-4 py-2.5 text-sm font-semibold text-stone-500 cursor-not-allowed">
                Tạm hết
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="dat-phong" class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-1 max-w-4xl mx-auto">
        <div class="rounded-[32px] bg-white p-7 shadow-sm ring-1 ring-stone-200">
          <p class="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">Các bước đặt phòng</p>
          <h2 class="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Đơn giản, rõ ràng và dễ theo dõi</h2>
          <div class="mt-8 space-y-5">
            <div v-for="(step, index) in bookingSteps" :key="step.title" class="flex gap-4 rounded-3xl bg-stone-50 p-5 ring-1 ring-stone-200">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-stone-900 text-lg font-semibold text-white">
                {{ index + 1 }}
              </div>
              <div>
                <h3 class="text-lg font-semibold text-stone-900">{{ step.title }}</h3>
                <p class="mt-2 text-sm leading-7 text-stone-500">{{ step.description }}</p>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-center">
            <RouterLink to="/rooms" class="inline-flex w-full md:w-auto items-center justify-center rounded-2xl bg-stone-900 px-8 py-4 text-sm font-semibold text-white transition hover:opacity-90">
              Bắt đầu tìm phòng
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section id="danh-gia" class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div class="mb-8 max-w-2xl">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">Đánh giá</p>
        <h2 class="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Đánh giá từ khách đã sử dụng dịch vụ</h2>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <div v-if="loadingReviews" class="rounded-[28px] bg-white px-6 py-8 text-center text-sm text-stone-500 shadow-sm ring-1 ring-stone-200 lg:col-span-3">
          Đang tải đánh giá từ khách hàng...
        </div>
        <p v-else-if="reviewsError" class="rounded-[28px] bg-rose-50 px-6 py-4 text-sm text-rose-600 ring-1 ring-rose-200 lg:col-span-3">
          {{ reviewsError }}
        </p>
        <div v-else-if="reviews.length === 0" class="rounded-[28px] bg-white px-6 py-8 text-center text-sm text-stone-500 shadow-sm ring-1 ring-stone-200 lg:col-span-3">
          Chưa có đánh giá nào từ khách hàng.
        </div>
        <template v-else>
          <article v-for="review in reviews" :key="review.feedbackId" class="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div class="mb-4 text-lg text-amber-500">
            {{ '\u2605'.repeat(review.rating) }}{{ '\u2606'.repeat(5 - review.rating) }}
          </div>
          <p class="text-sm leading-7 text-stone-600">"{{ review.content }}"</p>
          <div class="mt-6 flex items-center justify-between gap-4">
            <div>
              <p class="font-semibold text-stone-900">{{ review.name }}</p>
              <p class="text-sm text-stone-500">{{ review.room || 'Khách đã lưu trú' }}</p>
            </div>
            <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">{{ review.score }}/5</span>
          </div>
        </article>
        </template>
      </div>
    </section>

    <section class="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <div class="rounded-[36px] bg-white p-8 text-center shadow-sm ring-1 ring-stone-200 sm:p-12">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">Bắt đầu ngay</p>
        <h2 class="mt-4 text-3xl font-semibold text-stone-900 sm:text-5xl">Trang chủ đơn giản, rõ ràng và đủ chức năng cần thiết</h2>
        <p class="mx-auto mt-5 max-w-3xl text-base leading-8 text-stone-500 sm:text-lg">
          Trang chủ có thể dẫn sang các màn hình như đăng ký, đăng nhập, thông tin cá nhân,
          phòng, đơn đặt phòng, lịch sử đặt phòng và đánh giá sau khi sử dụng dịch vụ.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <RouterLink
            to="/register"
            class="rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Đăng ký ngay
          </RouterLink>
          <RouterLink
            to="/login"
            class="rounded-2xl border border-stone-300 bg-white px-6 py-4 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            Đăng nhập tài khoản
          </RouterLink>
          <RouterLink
            to="/forgot-password"
            class="rounded-2xl border border-stone-300 bg-white px-6 py-4 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
          >
            Quên mật khẩu
          </RouterLink>
        </div>
      </div>
    </section>
    </main>

    <footer id="lien-he" class="border-t border-stone-200 bg-white">
      <div class="mx-auto grid max-w-7xl gap-8 px-6 py-10 text-sm text-stone-500 lg:grid-cols-4 lg:px-8">
        <div>
          <p class="text-lg font-semibold text-stone-900">Hotel Luxe</p>
          <p class="mt-3 leading-7">Website đặt phòng khách sạn đơn giản, dễ dùng và có thể phát triển thành hệ thống hoàn chỉnh.</p>
        </div>
        <div>
          <p class="font-semibold text-stone-900">Tài khoản</p>
          <ul class="mt-4 space-y-3">
            <li>
              <RouterLink to="/register" class="transition hover:text-stone-900">Đăng ký</RouterLink>
              /
              <RouterLink to="/login" class="transition hover:text-stone-900">Đăng nhập</RouterLink>
            </li>
            <li>
              <RouterLink to="/forgot-password" class="transition hover:text-stone-900">Quên mật khẩu</RouterLink>
            </li>
            <li>
              <RouterLink to="/change-password" class="transition hover:text-stone-900">Đổi mật khẩu</RouterLink>
            </li>
            <li>
              <RouterLink to="/profile" class="transition hover:text-stone-900">Cập nhật thông tin cá nhân</RouterLink>
            </li>
          </ul>
        </div>
        <div>
          <p class="font-semibold text-stone-900">Đặt phòng</p>
          <ul class="mt-4 space-y-3">
            <li>Tìm kiếm và lọc phòng</li>
            <li>Xem phòng còn trống</li>
            <li>Chọn dịch vụ đi kèm</li>
            <li>Theo dõi đơn đặt phòng</li>
          </ul>
        </div>
        <div>
          <p class="font-semibold text-stone-900">Liên hệ</p>
          <ul class="mt-4 space-y-3">
            <li>Hotline: 1900 6868</li>
            <li>Email: support@hotelluxe.vn</li>
            <li>Địa chỉ: Hệ thống chi nhánh toàn quốc</li>
          </ul>
        </div>
      </div>
    </footer>
>>>>>>> 1d408ad14e9f80697ad4155be407b8e65c4528a5
  </div>
</template>

<script setup>
<<<<<<< HEAD
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isAuthenticated = computed(() => !!localStorage.getItem("token"));

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<style>
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family:
    Inter,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  background: #f4f6fb;
  color: #1f2937;
}
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.topbar {
  background: #2563eb;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem;
}
.topbar .brand {
  font-weight: 700;
  font-size: 1.2rem;
}
.topbar nav {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}
.topbar a,
.link-button {
  color: white;
  text-decoration: none;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  padding: 0.55rem 1rem;
  border-radius: 999px;
  cursor: pointer;
}
.link-button {
  border: none;
}
.page-container {
  padding: 2rem 1.5rem;
  flex: 1;
=======
import { ref, computed, onMounted, reactive } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { branchService } from '@/services/branch.service'
import { feedbackService } from '@/services/feedback.service'
import { roomService } from '@/services/room.service'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const branches = ref([])
const rooms = ref([])
const reviews = ref([])
const loadingReviews = ref(true)
const reviewsError = ref('')

const searchForm = reactive({
  checkIn: '',
  checkOut: '',
  branchId: '',
  capacity: ''
})

const quickFilter = reactive({
  keyword: '',
  type: '',
  priceRange: ''
})

const handleSearch = () => {
  const query = {}
  if (searchForm.checkIn) query.checkIn = searchForm.checkIn
  if (searchForm.checkOut) query.checkOut = searchForm.checkOut
  if (searchForm.branchId) query.branchId = searchForm.branchId
  if (searchForm.capacity) query.capacity = searchForm.capacity
  router.push({ path: '/rooms', query })
}

const handleQuickSearch = () => {
  const query = {}
  if (quickFilter.keyword) query.keyword = quickFilter.keyword
  if (quickFilter.type) query.typeId = quickFilter.type
  if (quickFilter.priceRange === 'under1') query.maxPrice = 1000000
  if (quickFilter.priceRange === '1to2') {
    query.minPrice = 1000000
    query.maxPrice = 2000000
  }
  if (quickFilter.priceRange === 'over2') query.minPrice = 2000000
  router.push({ path: '/rooms', query })
}

const minimumPrice = computed(() => {
  if (!rooms.value || rooms.value.length === 0) return 850000
  return Math.min(...rooms.value.map(r => r.price_per_night || 850000))
})

const uniqueRoomTypes = computed(() => {
  if (!rooms.value) return []
  const types = new Set(rooms.value.map(r => r.roomType).filter(Boolean))
  return Array.from(types)
})

const isHomeRoute = computed(() => route.name === 'home')

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'Liên hệ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount).replace('₫', 'đ')
}

const getRoomStatusText = (status) => {
  const statusMap = {
    'Available': 'Còn trống',
    'Maintenance': 'Đang bảo trì',
    'Booked': 'Đã đặt',
    'Occupied': 'Đang sử dụng'
  }
  return statusMap[status] || status || 'Không rõ'
}

const getRoomStatusClass = (status) => {
  if (status === 'Available') return 'Còn trống'
  return 'Tạm hết'
}

const buildReviewRoomLabel = (review) => {
  const roomParts = [
    review.roomType || '',
    review.roomNumber ? `Phòng ${review.roomNumber}` : '',
    review.branchName || ''
  ].filter(Boolean)

  return roomParts.join(' · ')
}

const mapHomeReview = (review) => {
  const rating = Math.min(Math.max(Number(review?.rating || 0), 0), 5)

  return {
    feedbackId: review?.feedbackId || `${review?.bookingCode || 'feedback'}-${rating}`,
    name: review?.customerName || 'Khách hàng',
    room: buildReviewRoomLabel(review),
    rating,
    score: rating.toFixed(1),
    content: review?.comment?.trim() || `Khách hàng đã chấm ${rating.toFixed(1)}/5 sau khi lưu trú.`
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch (error) {
      console.error(error)
    }
  }

  const [branchesResult, roomsResult, reviewsResult] = await Promise.allSettled([
    branchService.getAllBranches(),
    roomService.getAllRooms(),
    feedbackService.getPublicFeedbacks({ limit: 6 })
  ])

  if (branchesResult.status === 'fulfilled') {
    branches.value = branchesResult.value.data?.data || []
  } else {
    console.error('Lỗi tải chi nhánh:', branchesResult.reason)
  }

  if (roomsResult.status === 'fulfilled') {
    rooms.value = roomsResult.value.data?.data || []
  } else {
    console.error('Lỗi tải phòng:', roomsResult.reason)
  }

  if (reviewsResult.status === 'fulfilled') {
    const reviewRows = reviewsResult.value.data?.data || []
    reviews.value = reviewRows.map(mapHomeReview)
    reviewsError.value = ''
  } else {
    reviews.value = []
    reviewsError.value = 'Không thể tải đánh giá từ hệ thống.'
    console.error('Lỗi tải đánh giá:', reviewsResult.reason)
  }

  loadingReviews.value = false
})

const handleLogout = async () => {
  await authStore.logout()
  if (route.name !== 'home') {
    router.push('/')
  }
}

const featureGroups = [
  {
    icon: '👤',
    title: 'Tài khoản người dùng',
    description: 'Người dùng có thể tạo tài khoản, đăng nhập và quản lý thông tin cá nhân.',
    items: [
      'Đăng ký, đăng nhập, đăng xuất',
      'Quên mật khẩu',
      'Đổi mật khẩu',
      'Cập nhật thông tin cá nhân'
    ]
  },
  {
    icon: '🏨',
    title: 'Chi nhánh',
    description: 'Thông tin từng chi nhánh được trình bày rõ ràng và dễ theo dõi.',
    items: [
      'Xem danh sách chi nhánh',
      'Xem địa chỉ, mô tả, liên hệ',
      'Xem danh sách phòng theo chi nhánh',
      'Đi tới chi tiết phòng'
    ]
  },
  {
    icon: '🛏️',
    title: 'Phòng',
    description: 'Hỗ trợ tìm phòng theo nhu cầu và xem thông tin trước khi đặt.',
    items: [
      'Tìm theo ngày nhận và trả phòng',
      'Lọc theo loại phòng, giá, tiện nghi, sức chứa',
      'Xem chi tiết phòng',
      'Hiển thị phòng còn trống'
    ]
  },
  {
    icon: '📄',
    title: 'Đặt phòng',
    description: 'Các bước đặt phòng rõ ràng, dễ hiểu và dễ theo dõi.',
    items: [
      'Đặt phòng và nhập thông tin người đặt',
      'Chọn dịch vụ đi kèm, tính tổng tiền',
      'Xác nhận và lưu lịch sử đặt phòng',
      'Xem chi tiết đơn, hủy đơn, theo dõi trạng thái, gửi đánh giá'
    ]
  }
]

const bookingSteps = [
  {
    title: 'Chọn phòng phù hợp',
    description: 'Khách hàng xem chi nhánh, ngày ở, loại phòng, số người và tình trạng còn phòng trước khi đặt.'
  },
  {
    title: 'Thêm dịch vụ cần thiết',
    description: 'Có thể chọn thêm bữa sáng, massage, ăn tối hoặc ghi chú cho khách sạn.'
  },
  {
    title: 'Xem tổng chi phí',
    description: 'Hệ thống hiển thị rõ giá phòng, số đêm lưu trú và các dịch vụ đã chọn.'
  },
  {
    title: 'Theo dõi đơn đặt phòng',
    description: 'Người dùng có thể xem lịch sử đặt phòng, mã đơn, trạng thái và đánh giá sau khi sử dụng.'
  }
]

</script>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
>>>>>>> 1d408ad14e9f80697ad4155be407b8e65c4528a5
}
</style>
