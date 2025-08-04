<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Ruler,
  Hammer,
  Smile,
} from 'lucide-vue-next';
import type { Component } from 'vue'; 


interface HowItWorksProps {
  badgeTitle: string;
  title: string;
  description: string;
  // image: string;
  icon: Component;
}

const HowItWorksList: HowItWorksProps[] = [
  {
    badgeTitle: "Paso 1",
    title: "Diagnóstico y asesoría inicial",
    description:
      "Agendamos una visita o videollamada para conocer tu espacio, tus gustos y necesidades.",
    icon: Home,
  },
  {
    badgeTitle: "Paso 2",
    title: "Diseño personalizado",
    description:
      "Creamos una propuesta visual que incluye materiales, acabados, colores y mobiliario.",
    icon: Ruler,
  },
  {
    badgeTitle: "Paso 3",
    title: "Ejecución del proyecto",
    description:
      "Transformamos tu espacio con materiales de alta calidad y atención al detalle.",
    icon: Hammer,
  },
  {
    badgeTitle: "Paso 4",
    title: "Entrega y satisfacción",
    description:
      "Te entregamos un hogar renovado y garantizamos que estés 100% satisfecho.",
    icon: Smile,
  },
];


</script>

<template>
  <section id="features" class="container py-24 sm:py-32">
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">
        Cómo Trabajamos
      </h2>

      <h2 class="text-3xl md:text-4xl text-center font-bold">
        Nuestro proceso paso a paso
      </h2>

    </div>

    <div class="lg:w-[80%] mx-auto relative">
      <div v-for="(
{ badgeTitle, title, description, icon }, index
        ) in HowItWorksList" :key="title" :class="[
          'flex mb-8 items-center',
          { ' flex-row-reverse': index % 2 !== 0 },
        ]">
        <Card class="h-full bg-transparent border-0 shadow-none">
          <CardHeader>
            <div class="pb-4">
              <Badge>{{ badgeTitle }}</Badge>
            </div>

            <CardTitle>
              {{ title }}
            </CardTitle>
          </CardHeader>

          <CardContent class="text-muted-foreground w-[80%]">
            {{ description }}
          </CardContent>
        </Card>

        <component :is="icon" class="w-16 h-16 text-primary mx-auto" />

        <div :class="[
          '-z-10 absolute right-0 w-44 h-72  lg:w-64 lg:h-80 rounded-full bg-primary/15 dark:bg-primary/10 blur-3xl',
          {
            'left-0': index % 2 !== 0,
          },
        ]"></div>
      </div>
    </div>
  </section>
</template>
