<script setup>
import { onMounted  } from "vue";
import { useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const irALogin = () => {router.push("/login")};

// Función para enviar correo con el usuario
onMounted(async () => {
  const token = route.params.token;

  try {
    const response = await fetch(`https://x2t3hd44-3000.brs.devtunnels.ms/api/activate/${token}`);
    if (!response.ok) throw new Error("Fallo la activación");
    
    // Redireccionar a la página de éxito si todo va bien
    router.push('/activatedUser');
  } catch (error) {
    console.error("Error al activar la cuenta:", error);
    router.push('/activationFailed');
  }
});
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="only-cars">
        <div class="logo">
          <img src="../assets/images/mapache.png" alt="Logo" />
          <h2>RaccoonPay</h2>
        </div>
          <label for="correo">Su usuario fue activado correctamente.</label>
          <div class="input-field">
          </div>
          <div class="buttonActivate">
            <button @click="irALogin" class="button">Aceptar</button>
          </div>
      </div>
    </div>
  </div>
</template>

<style>
@import "../assets/styles/login.css";
</style>
