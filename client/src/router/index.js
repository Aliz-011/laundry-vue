import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Pesanan from "../views/Pesanan.vue";
import Paket from "../views/Paket.vue";
import Detail from "../views/Detail.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      title: "Register",
    },
  },
  {
    path: "/pesanan",
    name: "Pesanan",
    component: Pesanan,
    meta: {
      title: "Pesanan",
    },
  },
  {
    path: "/paket",
    name: "Paket",
    component: Paket,

    meta: {
      title: "Paket",
    },
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: Detail,
    props: true,
    meta: {
      title: "Detail",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} Page | Laundry`;
  next();
});

export default router;
