<script setup>
import { ref, onMounted} from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const irARegistro = () => {router.push("/register")};
const irAForgotUser = () => {router.push("/forgotUser")};
const irAForgotPassword = () => {router.push("/forgotPassword")};
// const irAHome = () => {router.push("/")};

const login = ref("");
const contrasenna = ref("");
const mensaje = ref("");
const cargando = ref(false);
const mostrarModal = ref(false);

const cerrarModal = () => {
  mostrarModal.value = false;
};
// Función para Iniciar sesion
const iniciarSesion = async () => {
  if (cargando.value) return;
  cargando.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`,{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        login: login.value,
        contrasenna: contrasenna.value,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    // Guardar el token en el almacenamiento local
    localStorage.setItem("token", data.token);
    localStorage.setItem("id_usuario", data.id_usuario);
    mensaje.value = "Inicio de sesión exitoso";
    // Redirigir a la página principal después de iniciar sesión
    router.push("/dashboard"); 
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    mensaje.value = "Usuario o contraseña incorrectas. Valide nuvamente con las credenciales correctas";
    mostrarModal.value = true;
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-left">
        <h2>Incia sesion en RaccoonPay</h2>
        <p>
          Administra tus finanzas de manera fácil, rápida y segura.  
          Con RaccoonPay, tienes el control total de tus ingresos y gastos en un solo lugar.💵
        </p>
        <ul>
          <li>📊 Visualiza y organiza tus transacciones.</li>
          <li>🔒 Seguridad garantizada para tu información.</li>
          <li>⚡ Rápido, intuitivo y sin complicaciones.</li>
        </ul>
        <p>¿Aún no tienes cuenta? ¡Regístrate ahora y toma el control de tus finanzas!📈</p>
        <div>
          <button @click="irARegistro">Registrarse</button>
          <!-- <button @click="irAHome">Volver</button> -->
        </div>
      </div>
      <div class="login-right">
        <div class="logo">
          <img src="../assets/images/mapache.png" alt="Logo" />
          <h2>RaccoonPay</h2>
        </div>
        <form class="form" @submit.prevent="iniciarSesion">
          <div class="input-field">
            <input id="usuario" v-model="login" placeholder="Usuario" required />
          </div>
            <div class="input-field">
            <input id="contrasena" v-model="contrasenna" type="password" placeholder="Contraseña" required/>
          </div>
          <div class="buttons-links">
            <a @click="irAForgotUser" class="links">Olvidaste tu usuario?</a>
            <button type="submit" class="button" :disabled="cargando">
              <span v-if="cargando" class="loader"></span>
              <span v-else>Iniciar sesión</span>
            </button>
            <a @click="irAForgotPassword" class="links">Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>
    </div>
  </div>
  <!-- MODAL PERSONALIZADA -->
  <div v-if="mostrarModal" class="modal-overlay">
    <div class="modal">
      <h2>RaccoonPay</h2>
      <p>{{ mensaje }}</p>
      <button @click="cerrarModal" class="modal-button">Cerrar</button>
    </div>
  </div>
</template>

<style>
@import "../assets/styles/login.css";
</style>