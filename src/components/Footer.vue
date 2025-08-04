<script setup lang="ts">
import imgLogo from "@/assets/img/loga1.jpg";
import Separator from "./ui/separator/Separator.vue";
</script>

<template>
  <footer
    id="footer"
    class="container py-24 pb-16 sm:py-32 sm:pb-24"
  >
    <div class="p-10 bg-muted/50 dark:bg-card border rounded-2xl">
      <div
        class="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-12 gap-y-8"
      >
        <div class="col-span-full xl:col-span-2">
          <a
            href="#"
            class="flex font-bold items-center"
          >
            <img :src="imgLogo" alt="" style="width: 60px; height: 60px;">

            <h3 class="text-xl">Renueva tu Vivienda</h3>
          </a>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">Contact</h3>
          <div>
            <a
              href="https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información."
              class="opacity-60 hover:opacity-100"
            >
              Whatsapp
            </a>
          </div>

          <div>
            <a
              href="https://www.facebook.com/renuevavivienda?mibextid=wwXIfr&rdid=jqw1E2QmiRXDKq0e&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1AR8qphvEx%2F%3Fmibextid%3DwwXIfr#"
              class="opacity-60 hover:opacity-100"
            >
              facebook
            </a>
          </div>

          <div>
            <a
              href="https://www.instagram.com/"
              class="opacity-60 hover:opacity-100"
            >
              Instagram
            </a>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">Platforms</h3>
          <div>
            <a
              href="#"
              class="opacity-60 hover:opacity-100"
            >
              iOS
            </a>
          </div>

          <div>
            <a
              href="#"
              class="opacity-60 hover:opacity-100"
            >
              Android
            </a>
          </div>

          <div>
            <a
              href="#"
              class="opacity-60 hover:opacity-100"
            >
              Web
            </a>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-lg">Help</h3>
          <div>
            <a
              href="https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información."
              class="opacity-60 hover:opacity-100"
            >
              Contáctanos 
            </a>
          </div>

          <div>
            <a
              href="#"
              class="opacity-60 hover:opacity-100"
            >
              FAQ
            </a>
          </div>

          <div>
            <a
              href="#"
              class="opacity-60 hover:opacity-100"
            >
              Feedback
            </a>
          </div>
        </div>


      </div>

      <Separator class="my-6" />
      <section className="">
        <h3 class="">
          &copy; 2025 Tu hogar, nuestra pasión · Hecho con ❤️ por
          <a
            target="_blank"
            href=""
            className="text-primary transition-all border-primary hover:border-b-2"
          >
            Renueva tu Vivienda
          </a>
        </h3>
      </section>
    </div>
  </footer>
</template>
