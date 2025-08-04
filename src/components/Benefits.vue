<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X } from 'lucide-vue-next';
import img1 from "../assets/img/img7.jpg";
import img2 from "../assets/img/img8.jpg";
import img3 from "../assets/img/img9.jpg";
import img4 from "../assets/img/img10.jpg";

// Estado para controlar el modal
const showModal = ref(false);
const currentImage = ref('');
const currentTitle = ref('');
 

// Función para abrir el modal con la imagen seleccionada
const openModal = (image: string, title: string) => {
  currentImage.value = image;
  currentTitle.value = title;
  showModal.value = true;
  document.body.style.overflow = 'hidden'; // Evitar scroll cuando el modal está abierto
};

// Función para cerrar el modal
const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = 'auto'; // Restaurar scroll
};

interface BenefitsProps {
  image: string;
  title: string;
  description: string;
}


const benefitList: BenefitsProps[] = [
  {
    image: img1,
    title: "Acabados Profesionales",
    description:
      "Transformamos espacios con estucos, pinturas y texturizados de alta calidad que realzan el estilo de tu hogar.",
  },
  {
    image: img2,
    title: "Aumenta el Valor de tu Vivienda",
    description:
      "Una remodelación bien hecha incrementa el valor de tu propiedad y mejora su atractivo visual y funcional.",
  },
  {
    image: img3,
    title: "Inversión Inteligente",
    description:
      "Ofrecemos soluciones duraderas que optimizan tus recursos y reducen mantenimientos futuros.",
  },
  {
    image: img4,
    title: "Espacios a tu Medida",
    description:
      "Diseñamos clósets, muebles y divisiones funcionales en WPC, lámina UV y más para aprovechar cada rincón.",
  },
];
</script>

<template>
  <section id="benefits" class="container py-20 sm:py-28 bg-[#1A8ACC] bg-opacity-60">
    <div class="grid lg:grid-cols-2 place-items-center lg:gap-24">
      <!-- Texto principal -->
      <div>
        <h2 class="text-sm sm:text-base text-white mb-2 tracking-wider uppercase">
          ¿Por qué elegirnos?
        </h2>

        <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">
          Remodelamos tu hogar con estilo y calidad
        </h2>

        <p class="text-base md:text-lg text-white mb-8">
          Ofrecemos soluciones personalizadas en pintura, diseño, instalación de cielo raso, mobiliario en WPC y más para que tu casa se sienta como nueva.
        </p>
      </div>

      <!-- Lista de beneficios -->
      <div class="grid lg:grid-cols-2 gap-4 w-full">
        <Card
          v-for="({ image, title, description }, index) in benefitList"
          :key="title"
          class="bg-muted/50 dark:bg-card hover:bg-background dark:hover:bg-background transition-all delay-75 group/benefit"
        >
          <CardHeader>
            <div class="flex justify-between items-center mb-4">
              <div class="relative group">
                <img
                  :src="image"
                  :alt="title"
                  class="w-20 h-20 rounded object-cover border cursor-pointer hover:opacity-90 transition-opacity"
                  @click="openModal(image, title)"
                />
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded cursor-pointer" @click="openModal(image, title)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <span
                class="text-4xl text-muted-foreground/15 font-semibold transition-all delay-75 group-hover/benefit:text-muted-foreground/30"
              >
                0{{ index + 1 }}
              </span>
            </div>
            <CardTitle class="text-base sm:text-lg font-semibold text-gray-800">
              {{ title }}
            </CardTitle>
          </CardHeader>

          <CardContent class="text-sm text-muted-foreground">
            {{ description }}
          </CardContent>
        </Card>
      </div>
    </div>
  </section>

  <!-- Modal para mostrar la imagen en grande -->
  <div v-if="showModal" 
       class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 transition-opacity"
       @click.self="closeModal">
    <div class="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-lg overflow-hidden shadow-2xl">
      <!-- Botón de cerrar -->
      <button 
        @click="closeModal"
        class="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-gray-100 transition-colors shadow-lg"
        aria-label="Cerrar">
        <X class="h-6 w-6 text-gray-800" />
      </button>
      
      <!-- Contenido del modal -->
      <div class="h-full flex flex-col">
        <div class="flex-1 flex items-center justify-center p-4 overflow-auto">
          <img 
            :src="currentImage" 
            :alt="currentTitle" 
            class="max-w-full max-h-[70vh] object-contain"
          />
        </div>
        
        <!-- Título de la imagen -->
        <div class="p-4 border-t bg-gray-50">
          <h3 class="text-lg font-semibold text-gray-900 text-center">
            {{ currentTitle }}
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>
