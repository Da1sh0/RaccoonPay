import { createRouter, createWebHistory } from "vue-router";
import Register from "../views/Register.vue"; 
import Login from "../views/Login.vue"; 
import Dashboard from "../views/Dashboard.vue";
import ForgotUser from "../views/ForgotUser.vue"
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";
import Activate from "../views/Activate.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/register", component: Register }, 
  { path: "/login", component: Login }, 
  { path: "/dashboard", component: Dashboard},
  { path: "/forgotUser", component: ForgotUser},
  { path: "/forgotPassword", component: ForgotPassword},
  { path: "/resetPassword", component: ResetPassword},
  { path: "/activate", component: Activate},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
