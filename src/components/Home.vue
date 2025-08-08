<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-vue-next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { onMounted, onUnmounted, ref } from 'vue';

// Import images
import img1 from '@/assets/img/img.jpg';
import img2 from '@/assets/img/img2.jpg';
import img3 from '@/assets/img/img3.jpg';
import img4 from '@/assets/img/img4.jpg';
import img5 from '@/assets/img/img5.jpg';
import img6 from '@/assets/img/img6.jpg';


const carouselRef = ref<any>(null);
const autoplayInterval = ref<NodeJS.Timeout>();

const startAutoplay = () => {
  stopAutoplay();
  
  autoplayInterval.value = setInterval(() => {
    if (carouselRef.value?.scrollNext) {
      carouselRef.value.scrollNext();
    }
  }, 2500); 
};

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value);
    autoplayInterval.value = undefined;
  }
};

onMounted(() => {
  setTimeout(() => {
    startAutoplay();
  }, 2500);
}); 

onUnmounted(() => {
  stopAutoplay();
});
</script>

<template>
  <section class="container">
    <div class="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto py-20 md:py-32">
      <div class="text-center space-y-8">
        <div class="max-w-screen-md mx-auto text-center text-5xl md:text-6xl font-bold">
          <h1>
            Trabajamos para tu 
            <span class="text-transparent bg-gradient-to-r from-[#1A8ACC] to-[#9C27B0] bg-clip-text"> beneficio
            </span>
            y el de tu vivienda.
          </h1>
        </div>

        <p class="max-w-screen-sm mx-auto text-xl text-muted-foreground">
          Conectamos diseño, confort y calidad en cada detalle para crear espacios únicos que elevan tu estilo de vida y te brindan el bienestar que mereces.
        </p>

        <div class="space-y-4 md:space-y-0 md:space-x-4">
          <Button class="w-5/6 md:w-1/4 font-bold group/arrow bg-[#1A8ACC] hover:bg-[#1A8ACC]/80">
            <a href="#benefits" target="">Sobre nosotros</a>
            <ArrowRight class="size-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" />
          </Button>

          <Button as-child variant="secondary" class="w-5/6 md:w-1/4 font-bold">
            <a href="https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información."
             target="_blank">Contáctanos</a>
          </Button>
        </div>
      </div>

      <div class="relative group mt-14">
        <!-- gradient shadow -->
        <div
          class="absolute -top-6 right-12 w-[90%] h-12 lg:h-[80%] blur-3xl rounded-full img-shadow-animation"
          style="background-color: #1A8ACC;">
        </div>

        <Carousel 
          ref="carouselRef"
          class="w-full max-w-6xl mx-auto px-4"
          :opts="{
            align: 'start',
            loop: true,
            slidesToScroll: 2,
            containScroll: 'keepSnaps',
            dragFree: false,
            startIndex: 0
          }"
        >
          <CarouselContent class="-ml-4">
            <CarouselItem class="pl-4 basis-1/2">
              <div class="p-1 h-full">
                <div class="aspect-w-16 aspect-h-9 w-full h-full">
                  <img
                    class="w-full h-full object-cover rounded-lg border border-t-2 border-t-[#1A8ACC] img-border-animation bg-black/5"
                    :src="img4"
                    alt="Imagen de vivienda 1" />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem class="pl-4 basis-1/2">
              <div class="p-1 h-full">
                <div class="aspect-w-16 aspect-h-9 w-full h-full">
                  <img
                    class="w-full h-full object-cover rounded-lg border border-t-2 border-t-[#1A8ACC] img-border-animation bg-black/5"
                    :src="img2"
                    alt="Imagen de vivienda 2" />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem class="pl-4 basis-1/2">
              <div class="p-1 h-full">
                <div class="aspect-w-16 aspect-h-9 w-full h-full">
                  <img
                    class="w-full h-full object-cover rounded-lg border border-t-2 border-t-[#1A8ACC] img-border-animation bg-black/5"
                    :src="img3"
                    alt="Imagen de vivienda 3" />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem class="pl-4 basis-1/2">
              <div class="p-1 h-full">
                <div class="aspect-w-16 aspect-h-9 w-full h-full">
                  <img
                    class="w-full h-full object-cover rounded-lg border border-t-2 border-t-[#1A8ACC] img-border-animation bg-black/5"
                    :src="img1"
                    alt="Imagen de vivienda 4" />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem class="pl-4 basis-1/2">
              <div class="p-1 h-full">
                <div class="aspect-w-16 aspect-h-9 w-full h-full">
                  <img
                    class="w-full h-full object-cover rounded-lg border border-t-2 border-t-[#1A8ACC] img-border-animation bg-black/5"
                    :src="img5"
                    alt="Imagen de vivienda 5" />
                </div>
              </div>
            </CarouselItem>
            <CarouselItem class="pl-4 basis-1/2">
              <div class="p-1 h-full">
                <div class="aspect-w-16 aspect-h-9 w-full h-full">
                  <img
                    class="w-full h-full object-cover rounded-lg border border-t-2 border-t-[#1A8ACC] img-border-animation bg-black/5"
                    :src="img6"
                    alt="Imagen de vivienda 6" />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="left-4" />
          <CarouselNext class="right-4" />
        </Carousel>

        <!-- gradient effect img -->
        <div
          class="absolute bottom-0 left-0 w-full h-20 md:h-28 bg-gradient-to-b from-background/0 via-background/50 to-background rounded-lg">
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.img-shadow-animation {
  animation-name: img-shadow-animation;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-direction: alternate;
}

.img-border-animation {
  animation-name: img-border-animation;
  animation-iteration-count: infinite;
  animation-duration: 2s;
  animation-timing-function: linear;
  animation-direction: alternate;
}

@keyframes img-shadow-animation {
  from {
    opacity: 0.5;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes img-border-animation {
  from {
    border-top-color: #1A8ACC;
  }

  to {
    border-top-color: #1A8ACC;
  }
}
</style>
