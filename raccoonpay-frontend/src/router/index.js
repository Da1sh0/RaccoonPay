import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue"; 
import Register from "../views/Register.vue"; 
import Login from "../views/Login.vue"; 
import Dashboard from "../views/Dashboard.vue";
import ForgotUser from "../views/ForgotUser.vue"
import ForgotPassword from "../views/ForgotPassword.vue";
import ResetPassword from "../views/ResetPassword.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/register", component: Register }, 
  { path: "/login", component: Login }, 
  { path: "/dashboard", component: Dashboard},
  { path: "/forgotUser", component: ForgotUser},
  { path: "/forgotPassword", component: ForgotPassword},
  { path: "/resetPassword", component: ResetPassword},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
