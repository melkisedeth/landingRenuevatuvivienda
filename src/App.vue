<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import Home from "./components/Home.vue";
import Benefits from "./components/Benefits.vue";
import Features from "./components/Features.vue";
import Services from "./components/Services.vue";
import HowItWorks from "./components/HowItWorks.vue";
import Sponsors from "./components/Sponsors.vue";
import Team from "./components/Team.vue";
import Contact from "./components/Contact.vue";
import FAQ from "./components/FAQ.vue";
import Footer from "./components/Footer.vue";
import Cursos from "./components/Cursos.vue";
import Sorteo from "./components/RaffleSection.vue";
</script>

<template>
  <Navbar />
  <Sorteo />
  <Home />
  <Sponsors />
  <Benefits />
  <Features />
  <Team />
  <Services />
  <HowItWorks />
  <Cursos id="cursos" />
  <Contact />
  <FAQ />
  <Footer />
</template>
