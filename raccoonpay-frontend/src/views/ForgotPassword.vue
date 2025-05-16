<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const irALogin = () => {router.push("/login")};
const correo = ref("");
const mensaje = ref("");
const mostrarModal = ref(false);
const esExito = ref(false);
const cargando = ref(false); // Agregada para manejar el estado de carga

// Función para enviar correo con el usuario
const olvidoContra = async () => {
  if (cargando.value) return; // Evita múltiples clics
  cargando.value = true; // Activa el estado de carga
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/recovery-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo: correo.value }),
    });
    const data = await response.json();
    mensaje.value = data.message;
    esExito.value = response.ok;
    mostrarModal.value = true;
  } catch (error) {
    console.error("Error en la recuperación:", error);
    mensaje.value = "Error en el servidor.";
    esExito.value = false;
    mostrarModal.value = true;
  } finally {
    cargando.value = false; // Desactiva el estado de carga al finalizar
  }
};

// Cierra la modal y redirige si la respuesta fue exitosa
const cerrarModal = () => {
  mostrarModal.value = false;
  if (esExito.value) {
    router.push("/login");
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="only-cars">
        <div class="logo">
          <img src="../assets/images/mapache.png" alt="Logo" />
          <h2>RaccoonPay</h2>
        </div>
        <form class="form" @submit.prevent="olvidoContra">
          <div class="input-field">
            <label for="correo">Ingrese el correo registrado <br>para restablecer su contraseña.</label>
          </div>
          <div class="input-field">
            <input v-model="correo" type="email" placeholder="Correo" required />
          </div>
          <div class="buttons-links">
            <button type="submit" class="button" :disabled="cargando">
              <span v-if="cargando" class="loader"></span> 
              <span v-else>Recordar</span>
            </button>
            <button @click="irALogin" class="button">Volver</button>
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
