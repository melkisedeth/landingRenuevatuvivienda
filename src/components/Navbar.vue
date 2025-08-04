<script lang="ts" setup>
import { ref } from "vue";

import { useColorMode } from "@vueuse/core";
const mode = useColorMode();
mode.value = "light";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  // SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";

import { ChevronsDown, Menu } from "lucide-vue-next";
// import ToggleTheme from "./ToggleTheme.vue";
import WhatsAppIcon from "@/icons/WhatsAppIcon.vue";
import InstagramIcon from "@/icons/InstagramIcon.vue";
import FacebookIcon from "@/icons/FacebookIcon.vue";

interface RouteProps {
  href: string;
  label: string;
}

interface FeatureProps {
  title: string;
  description: string;
}

const routeList: RouteProps[] = [
  {
    href: "#servicios",
    label: "Servicios",
  },
  {
    href: "#contact",
    label: "Contacto",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
  {
    href: "#cursos",
    label: "Cursos",
  }
];

const featureList: FeatureProps[] = [
 {
   title: "Diseño Personalizado",
   description: "Creamos espacios únicos que reflejan tu estilo y se adaptan perfectamente a tus necesidades.",
 },
 {
   title: "Calidad Garantizada",
   description: "Trabajamos con materiales premium y profesionales certificados para resultados duraderos.",
 },
 {
   title: "Proyecto Completo",
   description: "Desde el diseño 3D hasta la entrega final, nos encargamos de cada detalle de tu renovación.",
 },
];

const isOpen = ref<boolean>(false);
</script>

<template>
  <header
    :class="{
      // 'shadow-light': mode === 'light',
      // 'shadow-dark': mode === 'dark',
      'w-[90%] md:w-[70%] lg:w-[75%] lg:max-w-screen-xl top-5 mx-auto sticky border z-40 rounded-2xl flex justify-between items-center p-2 bg-card shadow-md': true,
    }"
  >
  <a href="/" class="logo" style="display: flex; align-items: center; gap: 8px;">
  <img src="../assets/img/logo1.ico" alt="Logo"
       style="height: 40px; width: 40px; border-radius: 8px; object-fit: cover;" />
  <span style="font-weight: bold;" :class="mode === 'light' ? 'text-transparent bg-gradient-to-r from-[#1A8ACC] to-[#9C27B0] bg-clip-text' : 'text-transparent bg-gradient-to-r from-[#1A8ACC] to-white bg-clip-text'"
  >Renueva tu Vivienda</span>
</a>

    <!-- Mobile -->
    <div class="flex items-center lg:hidden">
      <Sheet v-model:open="isOpen">
        <SheetTrigger as-child>
          <Menu
            @click="isOpen = true"
            class="cursor-pointer"
          />
        </SheetTrigger>

        <SheetContent
          side="left"
          class="flex flex-col justify-between rounded-tr-2xl rounded-br-2xl bg-card"
        >
          <div>
            <SheetHeader class="mb-4 ml-4">
              <SheetTitle class="flex items-center">
                <a
                  href="/"
                  class="flex items-center"
                >
                  <ChevronsDown
                    class="bg-gradient-to-tr from-primary/70 via-primary to-primary/70 rounded-lg size-9 mr-2 border text-white"
                  />
                  Renueva tu Vivienda
                </a>
              </SheetTitle>
            </SheetHeader>

            <div class="flex flex-col gap-2">
              <Button
                v-for="{ href, label } in routeList"
                :key="label"
                as-child
                variant="ghost"
                class="justify-start text-base"
                :class="{
                  'animate-zoom-in-out': label === 'Cursos',
                  'text-white font-semibold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400': label === 'Cursos',
                  'hover:shadow-lg hover:shadow-amber-400/30': label === 'Cursos',
                  'transition-all duration-300': label === 'Cursos'
                }"
              >
                <a
                  @click="isOpen = false"
                  :href="href"
                >
                  {{ label }}
                </a>
              </Button>
            </div>
          </div>

          <!-- <SheetFooter class="flex-col sm:flex-col justify-start items-start">
            <Separator class="mb-2" />

            <ToggleTheme />
          </SheetFooter> -->
        </SheetContent>
      </Sheet>
    </div>

    <!-- Desktop -->
    <NavigationMenu class="hidden lg:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger class="bg-card text-base">
            Soluciones
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div class="grid w-[600px] grid-cols-2 gap-5 p-4">
              <img
                src="../assets/img/img4.jpg"
                alt="Beach"
                class="h-full w-full rounded-md object-cover"
              />
              <ul class="flex flex-col gap-2">
                <li
                  v-for="{ title, description } in featureList"
                  :key="title"
                  class="rounded-md p-2 text-sm hover:bg-muted"
                >
                  <p class="mb-1 font-semibold leading-none text-foreground">
                    {{ title }}
                  </p>
                  <p class="text-muted-foreground leading-relaxed">
                    {{ description }}
                  </p>
                </li>
              </ul>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem v-for="{ href, label } in routeList" :key="label">
          <NavigationMenuLink asChild>
            <Button
              as-child
              variant="ghost"
              class="justify-start text-base"
              :class="{
                'animate-zoom-in-out': label === 'Cursos',
                'text-white font-semibold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400': label === 'Cursos',
                'hover:shadow-lg hover:shadow-amber-400/30': label === 'Cursos',
                'transition-all duration-300': label === 'Cursos'
              }"
            >
              <a :href="href">
                {{ label }}
              </a>
            </Button>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>

    <div class="hidden lg:flex">
      <!-- <ToggleTheme /> -->

      <Button
        as-child
        size="sm"
        variant="ghost"
        aria-label="View on WhatsApp"
      >
        <a
          aria-label="View on WhatsApp"
          href="https://www.facebook.com/renuevavivienda?mibextid=wwXIfr&rdid=mfBGumZv9Wb8R46H&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AR8qphvEx%2F%3Fmibextid%3DwwXIfr#"
          target="_blank"
        >
          <FacebookIcon class="size-5" />
        </a>
      </Button>
      <Button
        as-child
        size="sm"
        variant="ghost"
        aria-label="View on WhatsApp"
      >
        <a
          aria-label="View on WhatsApp"
          href="https://www.instagram.com/renueva_tu_vivienda?igsh=MTR6d3EzanJsdndqZA=="
          target="_blank"
        >
          <InstagramIcon class="size-5" />
        </a>
      </Button>
      <Button
        as-child
        size="sm"
        variant="ghost"
        aria-label="View on WhatsApp"
      >
        <a
          aria-label="View on WhatsApp"
          href="https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información."
          target="_blank"
        >
          <WhatsAppIcon class="size-5" />
        </a>
      </Button>
    </div>
  </header>
</template>

<style scoped>
.shadow-light {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.085);
}

.shadow-dark {
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.141);
}

@keyframes zoom-in-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.animate-zoom-in-out {
  animation: zoom-in-out 2s infinite;
  display: inline-block;
  font-weight: 600;
}
</style>
