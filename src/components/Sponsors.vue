<script setup lang="ts">
import { Marquee } from "@selemondev/vue3-marquee";
import "@selemondev/vue3-marquee/dist/style.css";

import {
  PaintRoller,
  Home,
  Layers,
  Tv,
  Hammer,
  Wrench,
  Ruler,
} from "lucide-vue-next";

interface ServiceProps {
  icon: string;
  name: string;
}

const services: ServiceProps[] = [
  { icon: "paint", name: "Pintura y estuco" },
  { icon: "home", name: "Remodelación de cocinas y fachadas" },
  { icon: "layers", name: "Cielo raso (Drywall, PVC, icopor, etc.)" },
  { icon: "tv", name: "Muebles de TV y clósets en WPC y lámina UV" },
  { icon: "hammer", name: "Decoración y acabados especiales" },
  { icon: "ruler", name: "Diseño de interiores" },
  { icon: "wrench", name: "Soluciones personalizadas" },
];

const iconMap: Record<
  string,
  | typeof PaintRoller
  | typeof Home
  | typeof Layers
  | typeof Tv
  | typeof Hammer
  | typeof Ruler
  | typeof Wrench
> = {
  paint: PaintRoller,
  home: Home,
  layers: Layers,
  tv: Tv,
  hammer: Hammer,
  ruler: Ruler,
  wrench: Wrench,
};
</script>

<template>
  <section id="servicios" class="max-w-[75%] mx-auto pb-20 sm:pb-24">
    <h2 class="text-sm sm:text-lg md:text-3xl text-center font-semibold text-gray-800 mb-12">
      Nuestros Servicios Destacados
    </h2>

    <div class="mx-auto">
      <Marquee
        class="gap-6"
        :pauseOnHover="true"
        :fade="true"
        innerClassName="gap-6"
      >
        <div
          v-for="{ icon, name } in services"
          :key="name"
          class="px-4 py-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div class="flex items-center space-x-2 text-xs sm:text-sm font-medium text-gray-600">
            <component
              :is="iconMap[icon]"
              class="w-6 h-6 text-[#1A8ACC]"
              stroke-width="1.5"
              style="width: 42px; height: 42px;"
            />
            <span class="whitespace-nowrap text-lg">{{ name }}</span>
          </div>
        </div>
      </Marquee>
    </div>
  </section>
</template>
