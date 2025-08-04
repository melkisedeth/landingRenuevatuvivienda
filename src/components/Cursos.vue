<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-indigo-800 text-white flex flex-col items-center justify-center p-8 relative overflow-hidden">
    
    <!-- Icono esté relacionado con construcción -->
    <div class="absolute top-10 left-10 animate-bounce">
      <img src="https://cdn-icons-png.flaticon.com/512/2902/2902170.png" alt="Renovación de casas" class="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
      <p class="mt-2 font-bold text-center text-white">Instructor Especializado</p>
    </div>

    <!-- Resto del contenido -->
    <h1 class="text-5xl font-extrabold text-center mb-8 drop-shadow-lg animate-fade-in-up">
      Aprende a Crear tus Propios Productos de Construcción
    </h1>

    <div class="w-full max-w-4xl grid gap-6 md:grid-cols-2 animate-fade-in delay-500">
      <div v-for="(curso, i) in cursos" :key="i" class="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20 hover:scale-105 transition-transform duration-300">
        <h2 class="text-xl font-bold text-yellow-300 mb-2 animate-pulse">{{ curso }}</h2>
        <p class="text-white text-sm opacity-90">Incluye guía paso a paso, materiales y tips profesionales.</p>
      </div>
    </div>

    <div class="mt-12 animate-fade-in-up delay-1000">
      <a href="https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información." class="bg-yellow-400 text-indigo-900 font-bold py-3 px-8 rounded-full shadow-xl hover:bg-yellow-300 hover:scale-105 transition-transform">
        ¡Inscríbete Ahora!
      </a>
    </div>

    <div class="absolute -top-20 -right-20 w-[400px] h-[400px] bg-yellow-300 opacity-20 rounded-full animate-ping"></div>
  </div>
</template>

<script setup>
const cursos = [
  "Cómo hacer pintura tipo 1 y tipo 2",
  "Cómo hacer estuco acrílico exterior e interior",
  "Cómo hacer pega cerámica y de porcelanato",
  "Cómo hacer un anti hongo",
  "Cómo hacer un estuco para piscina",
  "Cómo hacer un impermeabilizante",
  "Cómo hacer un aditivo para pintura",
];
</script>

<style scoped>
@keyframes fade-in-up {
  0% { opacity: 0; transform: translateY(40px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 1s ease-out forwards;
}
</style>
