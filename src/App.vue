<template>
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
  </div>
</template>

<script setup>
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
}
</style>
