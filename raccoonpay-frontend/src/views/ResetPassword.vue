<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const token = route.query.token;

const nuevaContrasena = ref('');
const confirmarnuevaContrasena = ref('');
const mensaje = ref('');
const mostrarModal = ref(false);
const esExito = ref(false);
const cargando = ref(false);

const enviarNuevaContrasena = async () => {
  if (cargando.value) return;
  cargando.value = true;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        nuevaContrasena: nuevaContrasena.value,
        confirmarnuevaContrasena: confirmarnuevaContrasena.value,
      }),
    });

    const data = await response.json();
    mensaje.value = data.message;
    esExito.value = response.ok;
    mostrarModal.value = true;
  } catch (error) {
    console.error("Error:", error);
    mensaje.value = "Error al conectar con el servidor.";
    esExito.value = false;
    mostrarModal.value = true;
  } finally {
    cargando.value = false;
  }
};

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
            <form @submit.prevent="enviarNuevaContrasena">
                <div class="input-field">
                    <label for="correo">Ingrese la nueva contraseaña.</label>
                </div>
                <div class="input-field">
                    <input type="password" v-model="nuevaContrasena" placeholder="Nueva contraseña" required />
                    </div>
                    <div class="input-field">
                    <input type="password" v-model="confirmarnuevaContrasena" placeholder="Confirmar contraseña" required />
                </div>
                <div class="buttons">
                    <button type="submit" class="button" :disabled="cargando">
                    <span v-if="cargando" class="loader"></span>
                    <span v-else>Cambiar Contraseña</span>
                    </button>
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
@import "@/assets/styles/login.css";
.buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
    align-items: center;
    margin-bottom: 30px;
}
.buttons button {
    width: 200px;
    padding: 12px;
    background: #3cb371;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
}
.buttons button:hover {
    background: #2e8b57;
}
</style>
