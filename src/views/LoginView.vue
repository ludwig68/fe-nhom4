<template>
  <section class="panel">
    <h1>Đăng nhập</h1>
    <form @submit.prevent="submitLogin">
      <label>
        Username hoặc Email
        <input
          v-model="form.username"
          placeholder="user01 hoặc email@example.com"
        />
      </label>
      <label>
        Mật khẩu
        <input type="password" v-model="form.password" placeholder="Mật khẩu" />
      </label>
      <button type="submit">Đăng nhập</button>
      <p class="note">
        Nếu bạn chưa có tài khoản, hãy liên hệ quản trị để cấp tài khoản.
      </p>
      <p class="error" v-if="error">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../services/api";

const router = useRouter();
const form = reactive({ username: "", password: "" });
const error = ref("");

const submitLogin = async () => {
  error.value = "";
  try {
    const result = await login({
      username: form.username,
      password: form.password,
    });
    localStorage.setItem("token", result.accessToken);
    localStorage.setItem("user", JSON.stringify(result.user));
    router.push("/branches");
  } catch (err) {
    error.value =
      err.response?.data?.message ||
      err.message ||
      "Đăng nhập không thành công";
  }
};
</script>

<style scoped>
.panel {
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}
h1 {
  margin-top: 0;
}
label {
  display: block;
  margin-bottom: 1rem;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 0.9rem 1rem;
  margin-top: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 12px;
  font-size: 1rem;
}
button {
  width: 100%;
  padding: 0.95rem 1rem;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
.helper {
  margin-top: 1rem;
}
.error {
  margin-top: 1rem;
  color: #b91c1c;
}
</style>
