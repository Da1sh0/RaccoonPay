<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const irARegistro = () => { router.push("/register"); };
const irALogin = () => { router.push("/login"); };
</script>

<template>
  <div class="login-container">
    <div class="login-card">

      <!-- Sección Izquierda -->
      <div class="login-left">
        <h2>RaccoonPay</h2>
        <h3>Gestione su sueldo de manera fácil y segura</h3>
        <p>
          Optimiza la administración de tu sueldo, pagos y gastos con nuestra plataforma intuitiva y eficiente.
          Lleva un registro detallado de tus gastos de manera fácil y segura. Adaptado a tus necesidades.
        </p>
        <div class="buttons-links">
          <button @click="irALogin">Iniciar sesión</button>
          <button @click="irARegistro">Comenzar Ahora</button>
        </div>
      </div>

      <!-- Sección Derecha -->
      <div class="login-right">
        <div class="logo">
          <h2>Nuestros Servicios</h2>
        </div>
        <div class="only-cars">
          <p class="input-field">Gestión de su Sueldo</p>
          <p class="input-field">Control de Gastos</p>
          <p class="input-field">Reportes y Análisis</p>
        </div>
        <div class="logo">
          <h2>Lo que dicen nuestros clientes</h2>
        </div>
        <div class="only-cars">
          <p class="input-field">"RaccoonPay ha transformado la forma en que administro mi sueldo."</p>
          <p class="input-field">"Fácil de usar y altamente eficiente."</p>
          <p class="input-field">"Muy útil al momento de gestionar mi sueldo y saber qué gastos tengo."</p>
        </div>
        <footer class="only-cars">
          <p>&copy; 2025 RaccoonPay. Todos los derechos reservados.</p>
        </footer>
      </div>

    </div>
  </div>
</template>

<style>
@import "@/assets/styles/login.css";
</style> 