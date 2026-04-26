<template>
  <section>
    <h1>Danh sách chi nhánh</h1>
    <div v-if="error" class="alert error">{{ error }}</div>
    <div v-if="branches.length === 0" class="empty-state">
      Không có chi nhánh nào
    </div>
    <div class="cards">
      <article v-for="branch in branches" :key="branch.branch_id" class="card">
        <h2>{{ branch.branch_name || branch.name || "Chi nhánh" }}</h2>
        <p>Địa chỉ: {{ branch.address || branch.location || "..." }}</p>
        <router-link :to="`/branches/${branch.branch_id}`" class="button"
          >Chi tiết</router-link
        >
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { fetchBranches } from "../services/api";

const branches = reactive([]);
const error = ref("");

const loadBranches = async () => {
  error.value = "";
  try {
    const data = await fetchBranches();
    branches.splice(0, branches.length, ...(data || []));
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Lỗi khi tải chi nhánh";
  }
};

onMounted(loadBranches);
</script>

<style scoped>
section {
  max-width: 980px;
  margin: 0 auto;
}
h1 {
  margin-bottom: 1.2rem;
}
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}
.card {
  padding: 1.4rem;
  background: white;
  border-radius: 18px;
  box-shadow: 0 16px 32px rgba(15, 23, 42, 0.06);
}
.card h2 {
  margin: 0 0 0.5rem;
}
.button {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #2563eb;
  color: white;
  border-radius: 999px;
  text-decoration: none;
}
.empty-state {
  padding: 2rem;
  background: white;
  border-radius: 18px;
}
.alert.error {
  margin-bottom: 1rem;
  color: #b91c1c;
}
</style>
