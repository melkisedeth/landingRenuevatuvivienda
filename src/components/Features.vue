<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Paintbrush,
  MessageCircle,
  TabletSmartphone,
  BadgeCheck,
  Goal,
  PictureInPicture,
  MousePointerClick,
  Newspaper,
} from "lucide-vue-next";

interface FeaturesProps {
  icon: string;
  title: string;
  description: string;
}

const featureList: FeaturesProps[] = [
  {
    icon: "paintbrush",
    title: "Diseño personalizado",
    description: "Cada espacio se adapta a tus gustos, estilo de vida y necesidades específicas.",
  },
  {
    icon: "badgeCheck",
    title: "Acabados de alta calidad",
    description: "Usamos materiales duraderos y modernos que realzan la estética de tu hogar.",
  },
  {
    icon: "goal",
    title: "Funcionalidad y estética",
    description: "Combinamos diseño y utilidad para que cada mueble o elemento cumpla un propósito.",
  },
  {
    icon: "pictureInPicture",
    title: "Detalles que transforman",
    description: "La iluminación LED, los paneles decorativos y los acabados finos marcan la diferencia.",
  },
  {
    icon: "mousePointerClick",
    title: "Atención personalizada",
    description: "Te acompañamos en cada paso: asesoría, diseño, fabricación e instalación.",
  },
  {
    icon: "tabletSmartphone",
    title: "Portafolio real en redes",
    description: "Puedes ver nuestros trabajos anteriores en video y redes sociales, con clientes reales.",
  },
];


const iconMap: Record<
  string,
  | typeof TabletSmartphone
  | typeof BadgeCheck
  | typeof Goal
  | typeof PictureInPicture
  | typeof Paintbrush
  | typeof MousePointerClick
  | typeof MessageCircle
  | typeof Newspaper
> = {
  tabletSmartphone: TabletSmartphone,
  badgeCheck: BadgeCheck,
  goal: Goal,
  pictureInPicture: PictureInPicture,
  paintbrush: Paintbrush,
  mousePointerClick: MousePointerClick,
  messageCircle: MessageCircle,
  newspaper: Newspaper,
};
</script>

<template>
  <section id="features" class="container py-24 sm:py-32">
    <h2 class="text-3xl md:text-4xl text-center font-bold mb-4">
      ¿Por qué elegirnos?
    </h2>

    <h3 class="md:w-1/2 mx-auto text-xl text-center text-muted-foreground mb-8">
      Nos especializamos en transformar espacios con acabados modernos, funcionales y elegantes que reflejan tu estilo.
    </h3>


    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="{ icon, title, description } in featureList" :key="title">
        <Card class="h-full bg-background border-0 shadow-none">
          <CardHeader class="flex justify-center items-center">
            <div class="bg-primary/20 p-2 rounded-full ring-8 ring-primary/10 mb-4">
              <component :is="iconMap[icon]" class="size-6 text-primary" />
            </div>

            <CardTitle>
              {{ title }}
            </CardTitle>
          </CardHeader>

          <CardContent class="text-muted-foreground text-center">
            {{ description }}
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<style lang="less" scoped></style>
