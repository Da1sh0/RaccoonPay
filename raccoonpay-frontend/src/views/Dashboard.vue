<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userData = ref(null);
const errorMessage = ref("");
const isLoading = ref(true);
// Función para cerrar sesión
const logout = () => {
  localStorage.removeItem("token"); // Elimina el token
  router.push("/login"); // Redirige al login
};
// Función para obtener los datos del usuario
const fetchUserData = async () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    errorMessage.value = "No tienes acceso. Inicia sesión.";
    router.push("/login");
    return;
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/data-user`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json", // Asegura que la respuesta esperada sea JSON
        "Content-Type": "application/json"
      },
    });

    const responseText = await response.text();
    console.log("Respuesta del servidor:", responseText);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${responseText}`);
    }

    const data = JSON.parse(responseText); // Intenta parsear el JSON

    if (!data || Object.keys(data).length === 0) {
      errorMessage.value = "No se encontraron datos.";
    } else {
      userData.value = data;
    }
  } catch (error) {
    console.error("Error al obtener datos:", error);
    errorMessage.value = "Error al cargar los datos.";
  } finally {
    isLoading.value = false;
  }
};

// Cargar los datos al montar el componente
onMounted(fetchUserData);
</script>

<template>
  <div class="contenedor">
    <nav class="barra-navegacion">
      <h2>Dashboard</h2>
      <button @click="logout" class="boton">Cerrar sesión</button>
    </nav>

    <section class="seccion-principal">
      <h2 class="titulo">Bienvenido al Dashboard</h2>

      <div v-if="errorMessage" class="mensaje-error">
        <p>{{ errorMessage }}</p>
      </div>

      <div v-if="isLoading">
        <p class="descripcion">Cargando datos...</p>
      </div>

      <div v-else-if="userData" class="perfil-usuario">
        <h2 class="subtitulo">Perfil de Usuario</h2>
        <p><strong>Nombre:</strong> {{ userData.nombres }} {{ userData.apellidos }}</p>
        <p><strong>Tipo de Identificación:</strong> {{ userData.nombre_tipo }}</p>
        <p><strong>Celular:</strong> {{ userData.celular }}</p>
        <p><strong>Correo:</strong> {{ userData.correo }}</p>
        <p><strong>Cargo:</strong> {{ userData.cargo }}</p>
      </div>
    </section>

    <footer class="pie-pagina">
      © 2025 RaccoonPay - Todos los derechos reservados.
    </footer>
  </div>
</template>
<style>
  @import "@/assets/styles/styles.css";
</style>