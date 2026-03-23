<template>
  <RouterView v-if="!isHomeRoute" />

  <div v-else class="min-h-screen bg-stone-50 text-stone-800">
    <header class="sticky top-0 z-50 bg-transparent">
      <div class="mx-auto max-w-7xl px-6 py-4 lg:px-8">
        <div class="flex items-center justify-between gap-6 rounded-[28px] border border-stone-300/70 bg-white/65 px-4 py-3 shadow-sm shadow-stone-200/30 backdrop-blur-[3px]">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-900 text-sm font-semibold tracking-[0.2em] text-white">
              HL
            </div>
            <div>
              <p class="text-lg font-semibold tracking-[0.08em] text-stone-900">HOTEL LUXE</p>
              <p class="text-xs text-stone-500">Hệ thống đặt phòng khách sạn</p>
            </div>
          </div>

          <nav class="hidden items-center gap-2 rounded-full bg-white/60 px-2 py-2 text-sm text-stone-600 ring-1 ring-stone-200/80 lg:flex">
            <a href="#gioi-thieu" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Giới thiệu</a>
            <RouterLink to="/branches" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Chi nhánh</RouterLink>
            <a href="#phong" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Phòng</a>
            <a href="#dat-phong" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Đặt phòng</a>
            <a href="#danh-gia" class="rounded-full px-4 py-2 transition hover:bg-white hover:text-stone-900">Đánh giá</a>
          </nav>

          <div class="hidden items-center gap-3 lg:flex">
            <a href="#lien-he" class="rounded-full px-4 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900">
              Liên hệ
            </a>

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
            <button class="rounded-2xl bg-stone-900 px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90">
              Tìm phòng ngay
            </button>
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
                <input type="date" class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm text-stone-500">Ngày trả phòng</label>
                <input type="date" class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500" />
              </div>
              <div>
                <label class="mb-2 block text-sm text-stone-500">Chi nhánh</label>
                <select class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500">
                  <option>Chọn chi nhánh</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Đà Nẵng</option>
                  <option>Hà Nội</option>
                </select>
              </div>
              <div>
                <label class="mb-2 block text-sm text-stone-500">Số người</label>
                <select class="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-stone-500">
                  <option>Chọn số người</option>
                  <option>2 người</option>
                  <option>4 người</option>
                  <option>6 người</option>
                </select>
              </div>
            </div>

            <div class="mt-6 grid gap-3 sm:grid-cols-3">
              <div class="rounded-2xl bg-white p-4 ring-1 ring-stone-200">
                <p class="text-xs uppercase tracking-[0.2em] text-stone-400">Giá từ</p>
                <p class="mt-2 text-lg font-semibold text-stone-900">850.000đ</p>
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

            <button class="mt-6 w-full rounded-2xl bg-stone-900 px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90">
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
        <article v-for="branch in branches" :key="branch.branch_id" class="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1">
          <div class="h-56 bg-[linear-gradient(135deg,#f5f5f4,#e7e5e4,#fafaf9)]"></div>
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-stone-900">{{ branch.branch_name }}</h3>
                <p class="mt-2 text-sm text-stone-500">{{ branch.address }}</p>
              </div>
              <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                Chi nhánh
              </span>
            </div>
            <p class="mt-4 text-sm leading-7 text-stone-600 line-clamp-3">{{ branch.description }}</p>
            <div class="mt-5 flex items-center justify-between text-sm">
              <span class="text-stone-500">{{ branch.phone || 'Chưa cập nhật số điện thoại' }}</span>
              <button @click="router.push('/branches/' + branch.branch_id)" class="font-medium text-stone-900 transition hover:text-stone-600">Xem chi tiết</button>
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
        <input type="text" placeholder="Tìm theo tên phòng hoặc chi nhánh" class="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none lg:col-span-2" />
        <select class="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none">
          <option>Loại phòng</option>
          <option>Standard</option>
          <option>Deluxe</option>
          <option>Suite</option>
        </select>
        <select class="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm outline-none">
          <option>Mức giá</option>
          <option>Dưới 1 triệu</option>
          <option>1 - 2 triệu</option>
          <option>Trên 2 triệu</option>
        </select>
        <button class="rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Lọc phòng
        </button>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <article v-for="room in rooms" :key="room.name" class="overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-1">
          <div class="h-56 bg-[linear-gradient(135deg,#fafaf9,#e7e5e4,#f5f5f4)]"></div>
          <div class="p-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h3 class="text-xl font-semibold text-stone-900">{{ room.name }}</h3>
                <p class="mt-2 text-sm text-stone-500">{{ room.branch }}</p>
              </div>
              <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                {{ room.status }}
              </span>
            </div>

            <div class="mt-4 flex flex-wrap gap-2 text-xs">
              <span v-for="tag in room.tags" :key="tag" class="rounded-full bg-stone-100 px-3 py-2 text-stone-700">
                {{ tag }}
              </span>
            </div>

            <div class="mt-5 flex items-end justify-between">
              <div>
                <p class="text-sm text-stone-500">Giá / đêm</p>
                <p class="text-2xl font-semibold text-stone-900">{{ room.price }}</p>
              </div>
              <button class="rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-900 transition hover:bg-stone-100">
                Chi tiết phòng
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section id="dat-phong" class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div class="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
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
        </div>

        <div class="rounded-[32px] bg-white p-7 shadow-sm ring-1 ring-stone-200">
          <div class="flex items-center justify-between gap-4">
            <div>
              <p class="text-sm text-stone-500">Thông tin đơn đặt phòng</p>
              <h3 class="text-2xl font-semibold text-stone-900">Tổng tiền hiển thị rõ ràng</h3>
            </div>
            <span class="rounded-full bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 ring-1 ring-amber-200">
              Chờ xác nhận
            </span>
          </div>

          <div class="mt-6 space-y-4 rounded-3xl bg-stone-50 p-5 ring-1 ring-stone-200">
            <div class="flex items-center justify-between text-sm text-stone-700">
              <span>Phòng Deluxe Ocean View</span>
              <span>1.450.000đ</span>
            </div>
            <div class="flex items-center justify-between text-sm text-stone-700">
              <span>2 đêm lưu trú</span>
              <span>2.900.000đ</span>
            </div>
            <div class="flex items-center justify-between text-sm text-stone-700">
              <span>Ăn sáng buffet</span>
              <span>250.000đ</span>
            </div>
            <div class="flex items-center justify-between text-sm text-stone-700">
              <span>Massage thư giãn</span>
              <span>500.000đ</span>
            </div>
            <div class="border-t border-stone-200 pt-4">
              <div class="flex items-center justify-between">
                <span class="text-base font-semibold text-stone-900">Tổng cộng</span>
                <span class="text-3xl font-semibold text-stone-900">3.650.000đ</span>
              </div>
            </div>
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-3xl bg-stone-50 p-5 ring-1 ring-stone-200">
              <p class="text-sm text-stone-500">Mã đặt phòng</p>
              <p class="mt-2 text-lg font-semibold text-stone-900">BK-2026-00125</p>
            </div>
            <div class="rounded-3xl bg-stone-50 p-5 ring-1 ring-stone-200">
              <p class="text-sm text-stone-500">Trạng thái</p>
              <p class="mt-2 text-lg font-semibold text-emerald-700">Đã gửi yêu cầu đặt phòng</p>
            </div>
          </div>

          <button class="mt-6 w-full rounded-2xl bg-stone-900 px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90">
            Xác nhận đặt phòng
          </button>
        </div>
      </div>
    </section>

    <section id="danh-gia" class="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div class="mb-8 max-w-2xl">
        <p class="text-sm font-medium uppercase tracking-[0.25em] text-stone-500">Đánh giá</p>
        <h2 class="mt-3 text-3xl font-semibold text-stone-900 sm:text-4xl">Đánh giá từ khách đã sử dụng dịch vụ</h2>
      </div>

      <div class="grid gap-6 lg:grid-cols-3">
        <article v-for="review in reviews" :key="review.name" class="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div class="mb-4 flex items-center gap-1 text-amber-500">
            <span v-for="n in 5" :key="n">★</span>
          </div>
          <p class="text-sm leading-7 text-stone-600">“{{ review.content }}”</p>
          <div class="mt-6 flex items-center justify-between">
            <div>
              <p class="font-semibold text-stone-900">{{ review.name }}</p>
              <p class="text-sm text-stone-500">{{ review.room }}</p>
            </div>
            <span class="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">{{ review.score }}/5</span>
          </div>
        </article>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { branchService } from '@/services/branch.service'

// Khởi tạo các hook của vue-router để lấy thông tin đường dẫn và điều hướng
const route = useRoute()
const router = useRouter()
// Khởi tạo store quản lý tài khoản để dùng cho hiển thị đăng nhập/đăng xuất
const authStore = useAuthStore()
// Biến lưu danh sách chi nhánh lấy từ API
const branches = ref([])

// Biến logic kiểm tra xem có đang ở trang chủ không (Tên route là 'home')
const isHomeRoute = computed(() => route.name === 'home')

// Hook chạy ngay khi giao diện (App.vue) được gắn vào màn hình
onMounted(async () => {
  // 1. Kiểm tra nếu có token trong máy nhưng dữ liệu user trống thì gọi API lấy user
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch (error) {
      console.error(error)
    }
  }
  
  // 2. Gọi API lấy danh sách chi nhánh khách sạn để hiển thị ở trang chủ
  try {
    const res = await branchService.getAllBranches()
    branches.value = res.data?.data || []
  } catch (err) {
    console.error('Lỗi tải chi nhánh', err)
  }
})

// Hàm xử lý khi người dùng bấm nút Đăng xuất
const handleLogout = async () => {
  await authStore.logout() // Xoá token và user
  // Nếu đang ở trang phụ thì đẩy về lại trang chủ
  if (route.name !== 'home') {
    router.push('/')
  }
}

// Khai báo mảng dữ liệu tĩnh (hardcode) dùng cho phần hiển thị giao diện mẫu
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



const rooms = [
  {
    name: 'Deluxe Ocean View',
    branch: 'Chi nhánh Đà Nẵng',
    status: 'Còn trống',
    price: '1.450.000đ',
    tags: ['2 người', 'View đẹp', 'Ăn sáng', 'Ban công']
  },
  {
    name: 'Family Premium',
    branch: 'Chi nhánh Sài Gòn',
    status: 'Sẵn sàng đặt',
    price: '2.100.000đ',
    tags: ['4 người', 'Rộng rãi', 'Phù hợp gia đình', 'Bồn tắm']
  },
  {
    name: 'Suite Signature',
    branch: 'Chi nhánh Hà Nội',
    status: 'Còn 1 phòng',
    price: '3.800.000đ',
    tags: ['Không gian riêng', 'Sang trọng', 'Dịch vụ tốt', 'Yên tĩnh']
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

const reviews = [
  {
    name: 'Nguyễn Minh Anh',
    room: 'Deluxe Ocean View',
    score: '5.0',
    content: 'Mọi thứ hiển thị rõ ràng, dễ thao tác và cảm giác rất dễ chịu khi sử dụng.'
  },
  {
    name: 'Trần Khánh Vy',
    room: 'Family Premium',
    score: '4.9',
    content: 'Phần đặt phòng và theo dõi đơn đặt phòng rất gọn, không bị rối và nhìn khá sang.'
  },
  {
    name: 'Phạm Đức Long',
    room: 'Suite Signature',
    score: '5.0',
    content: 'Giao diện nhẹ nhàng, trang trọng và phù hợp với một website khách sạn thực tế.'
  }
]
</script>

<style scoped>
:global(html) {
  scroll-behavior: smooth;
}
</style>
