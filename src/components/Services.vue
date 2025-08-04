<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import img5 from "@/assets/img/img5.jpg";

enum ProService {
  YES = 1,
  NO = 0,
}

interface ServiceProps {
  title: string;
  pro: ProService;
  description: string;
}

// Estado para la posición de desplazamiento
const scrollY = ref(0);
const sectionRef = ref<HTMLElement | null>(null);

// Manejar el scroll
const handleScroll = () => {
  if (!sectionRef.value) return;
  
  const rect = sectionRef.value.getBoundingClientRect();
  const isInView = rect.top <= window.innerHeight && rect.bottom >= 0;
  
  if (isInView) {
    // Calcula el desplazamiento relativo a la sección
    const sectionTop = rect.top + window.scrollY;
    const sectionScroll = window.scrollY - sectionTop;
    scrollY.value = sectionScroll;
  }
};

// Usar requestAnimationFrame para mejor rendimiento
const animate = () => {
  handleScroll();
  requestAnimationFrame(animate);
};

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
    animate();
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
});

const serviceList: ServiceProps[] = [
  {
    title: "Diseño Personalizado",
    description:
      "Creamos espacios únicos que reflejan tu estilo y necesidades, desde la idea inicial hasta el último detalle.",
    pro: 1,
  },
  {
    title: "Asesoría en Materiales",
    description:
      "Te guiamos en la elección de materiales de alta calidad, funcionales y estéticos para cada espacio.",
    pro: 0,
  },
  {
    title: "Remodelaciones Integrales",
    description:
      "Transformamos cocinas, baños y espacios completos con soluciones eficientes y modernas.",
    pro: 1,
  },
  {
    title: "Gestión de Proyectos",
    description:
      "Nos encargamos de todo el proceso de renovación para que tú no tengas que preocuparte por nada.",
    pro: 0,
  },
];

</script>

<template>
  <section ref="sectionRef" id="servicios" class="relative overflow-hidden py-24 sm:py-32 min-h-screen">
    <!-- Fondo con efecto parallax -->
    <div class="absolute inset-0 -z-10 h-full">
      <div 
        ref="parallaxRef"
        class="w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
        :style="{
          backgroundImage: `url(${img5})`,
          transform: `translate3d(0, ${scrollY * 0.8}px, 0)`,
          willChange: 'transform',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }"
      >
        <div class="absolute inset-0 bg-black/50"></div>
      </div>
    </div>
    <div class="relative z-10">
      <h2 class="text-lg text-white text-center mb-2 tracking-wider">
        Servicios
      </h2>
 
    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4 text-white">
      Mejora tu hogar con expertos
    </h2>

    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground text-white mb-8">
      Soluciones personalizadas en diseño, remodelación y acabados para renovar tu espacio y aumentar el valor de tu
      propiedad.
    </h3>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"></div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-[60%] mx-auto">
      <div v-for="{ title, description } in serviceList" :key="title">
        <Card class="bg-muted/60 dark:bg-card h-full relative">
          <CardHeader>
            <CardTitle>{{ title }}</CardTitle>
            <CardDescription>{{ description }}</CardDescription>
          </CardHeader>
        </Card>
      </div>
      </div>
    </div>
  </section>
</template>
