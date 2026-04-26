import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import BranchesView from "../views/BranchesView.vue";
import BranchDetailView from "../views/BranchDetailView.vue";

const routes = [
  { path: "/", redirect: "/branches" },
  { path: "/login", component: LoginView, meta: { guest: true } },
  { path: "/branches", component: BranchesView, meta: { requiresAuth: true } },
  {
    path: "/branches/:id",
    component: BranchDetailView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/login");
  }

  if (to.meta.guest && token) {
    return next("/branches");
  }

  next();
});

export default router;
