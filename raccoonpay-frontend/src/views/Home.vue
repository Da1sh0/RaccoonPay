<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const irARegistro = () => { router.push("/register"); };
const irALogin = () => { router.push("/login"); };
</script>

<template>
  <div class="contenedor">
    <!-- Encabezado -->
    <header class="barra-navegacion">
      <div class="logo">RaccoonPay</div>
      <nav>
        <button @click="irARegistro" class="boton">Registrarse</button>
        <button @click="irALogin" class="boton">Iniciar sesión</button>
      </nav>
    </header>

    <!-- Sección Principal -->
    <section class="seccion-principal">
      <div class="contenido">
        <h1 class="titulo">Gestión de Pagos Fácil y Segura</h1>
        <p class="descripcion">
          Simplificamos la administración de sueldos y pagos con una plataforma intuitiva y eficiente.
        </p>
        <button @click="irARegistro" class="boton-destacado">Comenzar Ahora</button>
      </div>
    </section>

    <!-- Sección de Servicios -->
    <section class="seccion-servicios">
      <h2 class="subtitulo">Nuestros Servicios</h2>
      <div class="servicios">
        <div class="tarjeta-servicio">Gestión de Nómina</div>
        <div class="tarjeta-servicio">Control de Gastos</div>
        <div class="tarjeta-servicio">Reportes y Análisis</div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="seccion-testimonios">
      <h2 class="subtitulo">Lo que dicen nuestros clientes</h2>
      <div class="testimonios">
        <p class="testimonio">"RaccoonPay ha transformado la forma en que administramos nuestros pagos."</p>
        <p class="testimonio">"Fácil de usar y altamente eficiente."</p>
      </div>
    </section>

    <!-- Pie de Página -->
    <footer class="pie-pagina">
      <p>&copy; 2025 RaccoonPay. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>
<style scoped>
  @import "@/assets/styles/styles.css";
</style>