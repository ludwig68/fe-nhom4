<template>
  <section class="panel">
    <h1>Đăng ký</h1>
    <form @submit.prevent="submitRegister">
      <label>
        Username
        <input v-model="form.username" placeholder="user01" />
      </label>
      <label>
        Mật khẩu
        <input type="password" v-model="form.password" placeholder="Mật khẩu" />
      </label>
      <label>
        Họ và tên
        <input v-model="form.fullName" placeholder="Nguyen Van A" />
      </label>
      <label>
        Email
        <input v-model="form.email" placeholder="email@example.com" />
      </label>
      <label>
        Số điện thoại
        <input v-model="form.phone" placeholder="0123456789" />
      </label>
      <label>
        Địa chỉ
        <input v-model="form.address" placeholder="Hanoi" />
      </label>
      <button type="submit">Đăng ký</button>
      <p class="helper">
        Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
      </p>
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { register } from "../services/api";

const router = useRouter();
const form = reactive({
  username: "",
  password: "",
  fullName: "",
  email: "",
  phone: "",
  address: "",
});
const error = ref("");
const success = ref("");

const submitRegister = async () => {
  error.value = "";
  success.value = "";
  try {
    await register({
      username: form.username,
      password: form.password,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
    });
    success.value = "Đăng ký thành công! Vui lòng đăng nhập.";
    setTimeout(() => router.push("/login"), 1200);
  } catch (err) {
    error.value =
      err.response?.data?.message || err.message || "Đăng ký không thành công";
  }
};
</script>

<style scoped>
.panel {
  max-width: 520px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
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
  background: #16a34a;
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
.success {
  margin-top: 1rem;
  color: #047857;
}
</style>
