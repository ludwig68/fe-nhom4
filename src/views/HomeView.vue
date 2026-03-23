<template>
  <div class="min-h-screen bg-stone-100 text-stone-900">
    <header class="border-b border-stone-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">Hotel Auth Demo</p>
          <h1 class="mt-2 text-2xl font-semibold">Khach san auth module</h1>
        </div>

        <div class="flex items-center gap-3">
          <template v-if="authStore.isAuthenticated">
            <RouterLink
              to="/profile"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Ho so
            </RouterLink>
            <RouterLink
              to="/change-password"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Doi mat khau
            </RouterLink>
            <button
              type="button"
              @click="handleLogout"
              class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Dang xuat
            </button>
          </template>

          <template v-else>
            <RouterLink
              to="/login"
              class="rounded-xl border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
            >
              Dang nhap
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Dang ky
            </RouterLink>
          </template>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-6 py-12">
      <section class="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <div class="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-stone-500">Auth module</p>
          <h2 class="mt-4 text-4xl font-semibold leading-tight text-stone-900">
            Dang ky, dang nhap, quen mat khau va doi mat khau tren localhost
          </h2>
          <p class="mt-4 max-w-2xl text-base leading-8 text-stone-600">
            Day la man hinh tong quan de kiem tra luong xac thuc truoc khi gan vao landing page chinh.
            Home view nay duoc noi truc tiep voi router va auth store hien tai.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <RouterLink
              to="/register"
              class="rounded-2xl bg-stone-900 px-5 py-4 text-center text-sm font-medium text-white transition hover:bg-stone-700"
            >
              Tao tai khoan
            </RouterLink>
            <RouterLink
              to="/login"
              class="rounded-2xl border border-stone-300 px-5 py-4 text-center text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Dang nhap
            </RouterLink>
            <RouterLink
              to="/forgot-password"
              class="rounded-2xl border border-stone-300 px-5 py-4 text-center text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Quen mat khau
            </RouterLink>
            <RouterLink
              to="/change-password"
              class="rounded-2xl border border-stone-300 px-5 py-4 text-center text-sm font-medium text-stone-800 transition hover:border-stone-400 hover:bg-stone-50"
            >
              Doi mat khau
            </RouterLink>
          </div>
        </div>

        <aside class="rounded-3xl bg-stone-900 p-8 text-stone-100 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.2em] text-stone-400">Session</p>
          <h3 class="mt-4 text-2xl font-semibold">
            {{ authStore.isAuthenticated ? 'Da dang nhap' : 'Chua dang nhap' }}
          </h3>
          <p class="mt-3 text-sm leading-7 text-stone-300">
            {{ sessionMessage }}
          </p>

          <dl class="mt-8 space-y-5 text-sm">
            <div class="rounded-2xl border border-stone-800 bg-stone-950/40 p-4">
              <dt class="text-stone-400">Nguoi dung</dt>
              <dd class="mt-1 text-base font-medium text-white">{{ displayName }}</dd>
            </div>
            <div class="rounded-2xl border border-stone-800 bg-stone-950/40 p-4">
              <dt class="text-stone-400">Access token</dt>
              <dd class="mt-1 break-all text-base font-medium text-white">
                {{ authStore.accessToken ? 'Da luu trong localStorage' : 'Chua co token' }}
              </dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const displayName = computed(() => {
  const user = authStore.user

  if (!user) {
    return 'Khach'
  }

  return user.name || user.fullName || user.username || user.email || 'Nguoi dung da dang nhap'
})

const sessionMessage = computed(() => {
  if (authStore.isAuthenticated) {
    return 'Ban co the vao trang ho so, doi mat khau hoac dang xuat de test luong auth.'
  }

  return 'Hay dang ky hoac dang nhap de kiem tra route guard, token storage va API auth.'
})

onMounted(async () => {
  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchMe()
    } catch (error) {
      console.error(error)
    }
  }
})

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>
