<script setup>
import { ref, onMounted} from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const irALogin = () => {router.push("/login")};
const irAHome = () => {router.push("/")};

// Variables reactivas para los inputs
const nombres = ref("");
const apellidos = ref("");
const identificacion = ref("");
const tipo_identificacion = ref("");
const celular = ref("");
const correo = ref("");
const cargo = ref("");
const login = ref("");
const contrasenna = ref("");
const mensaje = ref("");
const cargando = ref(false);
const mostrarModal = ref(false);

const cerrarModal = () => {
  mostrarModal.value = false;
};

// Variable para almacenar los tipos de identificación
const tiposIdentificacion = ref([]);
// Función para obtener los tipos de identificación desde el backend
const fetchTiposIdentificacion = async () => {
  try {
    const response = await fetch("https://x2t3hd44-3000.brs.devtunnels.ms/api/types-identification");
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    tiposIdentificacion.value = data; // Guarda los datos en la variable reactiva
  } catch (error) {
    console.error("Error al obtener tipos de identificación:", error);
  }
};
// Ejecutar la función cuando se monta el componente
onMounted(fetchTiposIdentificacion);
// Función para registrar usuario
const registrarUsuario = async () => {
  cargando.value = true;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombres: nombres.value,
        apellidos: apellidos.value,
        identificacion: identificacion.value,
        tipo_identificacion: tipo_identificacion.value,
        celular: celular.value,
        correo: correo.value,
        cargo: cargo.value,
        login: login.value,
        contrasenna: contrasenna.value,
        perfil: 2,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    const data = await response.json();
    console.log("Respuesta del servidor:", data);
    mensaje.value = data.message || "Registro exitoso";
    mostrarModal.value = true;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    mensaje.value = "Error al registrar usuario";
    mostrarModal.value = true;
  } finally {
    cargando.value = false; // desactivar loader
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-left">
        <h2>Registrate en RaccoonPay</h2>
        <p>
          Administra tus finanzas de manera fácil, rápida y segura.  
          Con RaccoonPay, tienes el control total de tus ingresos y gastos en un solo lugar.💵
        </p>
        <ul>
          <li>📊 Visualiza y organiza tus transacciones.</li>
          <li>🔒 Seguridad garantizada para tu información.</li>
          <li>⚡ Rápido, intuitivo y sin complicaciones.</li>
        </ul>
        <p>¿Ya te encuetras registrado? ¡Inicia sesion y continua tomadno el control de tus finanzas!📈</p>
        <div>
          <button @click="irALogin">Iniciar sesion</button>
          <button @click="irAHome">Volver</button>
        </div>
      </div>
      <div class="register-right">
        <div class="logo">
          <img src="../assets/images/mapache.png" alt="Logo" />
          <h2>RaccoonPay</h2>
        </div>
        <form @submit.prevent="registrarUsuario" class="form">
          <div class="input-field">
            <input v-model="nombres" placeholder="Nombres" required />
          </div>
          <div class="input-field">
            <input v-model="apellidos" placeholder="Apellidos" required />
          </div>
          <div class="input-field">
            <input v-model="identificacion" placeholder="Identificación" required />
          </div>
          <div class="input-field">
            <select v-model="tipo_identificacion" id="tipo_identificacion" required>
              <option value="" disabled>Tipo Identificación</option>
              <option
                v-for="tipo in tiposIdentificacion"
                :key="tipo.id_tipo_identificacion"
                :value="tipo.id_tipo_identificacion"
              >
                {{ tipo.nombre_tipo }}
              </option>
            </select>
          </div>
          <div class="input-field">
            <input v-model="celular" placeholder="Celular" required />
          </div>
          <div class="input-field">
            <input v-model="correo" type="email" placeholder="Correo" required />
          </div>
          <div class="input-field">
            <input v-model="cargo" placeholder="Cargo" required />
          </div>
          <div class="input-field">
            <input v-model="login" placeholder="Usuario" required />
          </div>
          <div class="input-field">
            <input v-model="contrasenna" type="password" placeholder="Contraseña" required />
          </div>
          <div class="buttons-linksR">
            <button type="submit" class="button" :disabled="cargando">
              <span v-if="cargando" class="loader"></span>
              <span v-else>Registrarse</span>
            </button>
          </div>
        </form>
        <p class="mensaje">{{ mensaje }}</p>
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
</style>