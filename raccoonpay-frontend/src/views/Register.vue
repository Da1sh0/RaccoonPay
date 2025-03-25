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
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    mensaje.value = "Error al registrar usuario";
  }
};
</script>

<template>
  <div>
    <button @click="irAHome" class="btn">Volver</button>
    <h2>Registro de Usuario</h2>
    <form @submit.prevent="registrarUsuario">
      <label>Nombres:</label>
      <input v-model="nombres" placeholder="Nombres" required />

      <label>Apellidos:</label>
      <input v-model="apellidos" placeholder="Apellidos" required />

      <label>Identificación:</label>
      <input v-model="identificacion" placeholder="Identificación" required />

      <label for="tipo_identificacion">Tipo de Identificación:</label>
      <select v-model="tipo_identificacion" id="tipo_identificacion" required>
        <option value="" disabled>Seleccione un tipo</option>
        <option
          v-for="tipo in tiposIdentificacion"
          :key="tipo.id_tipo_identificacion"
          :value="tipo.id_tipo_identificacion"
        >
          {{ tipo.nombre_tipo }}
        </option>
      </select>

      <label>Celular:</label>
      <input v-model="celular" placeholder="Celular" required />

      <label>Correo:</label>
      <input v-model="correo" type="email" placeholder="Correo" required />

      <label>Cargo:</label>
      <input v-model="cargo" placeholder="Cargo" required />

      <label>Usuario:</label>
      <input v-model="login" placeholder="Usuario" required />

      <label>Contraseña:</label>
      <input v-model="contrasenna" type="password" placeholder="Contraseña" required />

      <button type="submit">Registrarse</button>
    </form>
    <button @click="irALogin" class="btn">Inciar sesion</button>

    <p>{{ mensaje }}</p>
  </div>
</template>