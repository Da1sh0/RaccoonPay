<script setup>
import { ref, onMounted} from "vue";
import { useRouter } from "vue-router";


const router = useRouter();
const irARegistro = () => {router.push("/register")};
const irAHome = () => {router.push("/")};

const login = ref("");
const contrasenna = ref("");
const mensaje = ref("");

// Función para Iniciar sesion
const iniciarSesion = async () => {
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
      throw new Error(`Error ${response.status}: ${await response.text()}`);
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
    mensaje.value = "Error al iniciar sesión. Verifique sus credenciales.";
  }
};
</script>

<template>
  <div class="contenedor">
    <nav class="barra-navegacion">
      <button @click="irAHome" class="boton">Volver</button>
    </nav>

    <section class="seccion-principal">
      <h2 class="titulo">Inicio de Sesión</h2>
      <p class="descripcion">Ingrese sus credenciales para acceder a su cuenta.</p>

      <form @submit.prevent="iniciarSesion" class="formulario">
        <label for="usuario">Usuario:</label>
        <input id="usuario" v-model="login" placeholder="Ingrese su usuario" required />

        <label for="contrasena">Contraseña:</label>
        <input id="contrasena" v-model="contrasenna" type="password" placeholder="Ingrese su contraseña" required />

        <button type="submit" class="boton-destacado">Iniciar sesión</button>
      </form>

      <p class="mensaje">{{ mensaje }}</p>

      <button @click="irARegistro" class="boton-destacado">Registrarse</button>
    </section>

    <footer class="pie-pagina">
      © 2025 RaccoonPay - Todos los derechos reservados.
    </footer>
  </div>
</template>
<style scoped>
  @import "@/assets/styles/styles.css";
</style>