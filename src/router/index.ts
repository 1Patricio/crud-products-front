import { createRouter, createWebHistory } from "vue-router";
import ProductView from "../components/ProductView.vue";
import ProductList from "../components/ProductList.vue";
import { useAuthStore } from "../stores/authStore";
import Login from "../components/Login.vue";
import Register from "../components/Register.vue";

const routes = [
  { path: "/", component: ProductList, name: "home" },
  { path: "/produto/:id", component: ProductView, name: "product-view" },
  { path: "/login", component: Login, name: "login" },
  { path: "/register", component: Register, name: "register" },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const isAuth = auth.isAuthenticated();

  if (!isAuth) {
    if (to.name === "login" || to.name === "register") {
      return next(); 
    }

    return next({ name: "login" });
  }

  if (isAuth && to.name === "login") {
    return next({ name: "home" });
  }

  return next();
});
