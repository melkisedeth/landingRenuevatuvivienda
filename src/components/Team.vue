<script setup lang="ts">
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

import WhatsAppIcon from "@/icons/WhatsAppIcon.vue";
import InstagramIcon from "@/icons/InstagramIcon.vue";
import FacebookIcon from "@/icons/FacebookIcon.vue";
import video1 from "../assets/img/video1.mp4";
import video2 from "../assets/img/video2.mp4";
import video3 from "../assets/img/video3.mp4";
import video4 from "../assets/img/video4.mp4";
interface TeamProps {
  videoUrl: string;
  firstName: string;
  lastName: string;
  positions: string[];
  socialNetworks: SocialNetworkProps[];
}

interface SocialNetworkProps {
  name: string;
  url: string;
}

const teamList: TeamProps[] = [
  {
    videoUrl: video1,
    firstName: "Diseño ",
    lastName: "de mueble flotante",
    positions: ["Panel decorativo en mármol con iluminación LED y nichos para licores: elegancia y funcionalidad en un solo diseño."],
    socialNetworks: [
      { name: "Facebook", url: "https://www.facebook.com/share/1AR8qphvEx/?mibextid=wwXIfr" },
      { name: "WhatsApp", url: "https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información." },
      { name: "Instagram", url: "https://www.instagram.com/" },
    ],
  },
  {
    videoUrl: video4,
    firstName: "Minimalismo y elegancia",
    lastName: "en cada rincón",
    positions: ["Estructura de closet/vitrina blanca", "Luces en la parte superior", "Repisas de vidrio", "Marcos blancos", "Diseño limpio y moderno"],
    socialNetworks: [
      { name: "Facebook", url: "https://www.facebook.com/share/1AR8qphvEx/?mibextid=wwXIfr" },
      { name: "WhatsApp", url: "https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información." },
      { name: "Instagram", url: "https://www.instagram.com/" },
    ],
  },
  {
    videoUrl: video3,
    firstName: "Estantería con acabado",
    lastName: " en madera y luces ambientales",
    positions: ["Panel decorativo de listones verticales en acabado madera clara, con iluminación LED cálida integrada. Ideal para espacios modernos que buscan combinar diseño y funcionalidad."],
    socialNetworks: [
      { name: "Facebook", url: "https://www.facebook.com/share/1AR8qphvEx/?mibextid=wwXIfr" },
      { name: "WhatsApp", url: "https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información." },
      { name: "Instagram", url: "https://www.instagram.com/" },
    ],
  },
  {
    videoUrl: video2,
    firstName: "Lámpara de cristal ",
    lastName: "moderna para interiores elegantes",
    positions: ["Lujosa lámpara colgante con detalles en cristal y acabados en negro, perfecta para realzar techos modernos con iluminación ambiental LED"],
    socialNetworks: [
      { name: "Facebook", url: "https://www.facebook.com/share/1AR8qphvEx/?mibextid=wwXIfr" },
      { name: "WhatsApp", url: "https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información." },
      { name: "Instagram", url: "https://www.instagram.com/" },
    ],
  },
];

const socialIcon = (socialName: string) => {
  switch (socialName) {
    case "Instagram":
      return InstagramIcon;
    case "WhatsApp":
      return WhatsAppIcon;
    case "Facebook":
      return FacebookIcon;
  }
};
</script>

<template>
  <section id="team" class="container lg:w-[75%] py-24 sm:py-32">
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary tracking-wider uppercase mb-2">Equipo</h2>
      <h2 class="text-3xl md:text-4xl font-bold">Nuestro Talento Humano</h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <Card v-for="{ videoUrl, firstName, lastName, positions, socialNetworks } in teamList" :key="videoUrl"
        class="bg-muted/60 dark:bg-card flex flex-col h-full overflow-hidden group">
        <CardHeader class="p-0">
          <video :src="videoUrl" autoplay muted loop playsinline
            class="w-full aspect-square object-cover transition-all group-hover:scale-[1.01]" preload="auto" />

          <CardTitle class="py-6 pb-4 px-6">
            {{ firstName }} <span class="text-primary">{{ lastName }}</span>
          </CardTitle>
        </CardHeader>

        <CardContent v-for="(position, index) in positions" :key="index" :class="{
          'pb-0 text-muted-foreground': true,
          'pb-4': index === positions.length - 1,
        }">
          {{ position }}<span v-if="index < positions.length - 1">,</span>
        </CardContent>

        <CardFooter class="space-x-4 mt-auto">
          <a v-for="{ name, url } in socialNetworks" :key="name" :href="url" target="_blank" rel="noopener noreferrer"
            class="hover:opacity-80 transition-all" :aria-label="`Visitar perfil de ${name}`">
            <component :is="socialIcon(name)" />
          </a>
        </CardFooter>
      </Card>
    </div>
  </section>
</template>
