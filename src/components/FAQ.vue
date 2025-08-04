<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "¿Realizan diseños personalizados según mi espacio?",
    answer: "Sí, cada uno de nuestros proyectos es completamente personalizado de acuerdo a tus gustos, necesidades y dimensiones del lugar.",
    value: "item-1",
  },
  {
    question: "¿Qué tipo de acabados ofrecen?",
    answer: "Ofrecemos acabados en madera, mármol sintético, iluminación LED integrada, estructuras metálicas y más. Todo depende del diseño que elijas.",
    value: "item-2",
  },
  {
    question: "¿Los muebles vienen ya armados o los instalan en casa?",
    answer: "Nuestro equipo se encarga de la fabricación, el transporte y la instalación final en tu hogar para garantizar un acabado perfecto.",
    value: "item-3",
  },
  {
    question: "¿Qué tiempo tarda un proyecto desde que lo encargo?",
    answer: "Dependiendo del tamaño y nivel de detalle, los proyectos pueden tardar entre 7 y 21 días hábiles desde la aprobación del diseño.",
    value: "item-4",
  },
  {
    question: "¿Puedo ver ejemplos o videos de trabajos anteriores?",
    answer: "¡Claro! En nuestra galería encontrarás fotos y videos reales de proyectos entregados. También puedes seguirnos en Instagram o Facebook.",
    value: "item-5",
  },
];

</script>

<template>
  <section
    id="faq"
    class="container md:w-[700px] py-24 sm:py-32"
  >
    <div class="text-center mb-8">
      <h2 class="text-lg text-primary text-center mb-2 tracking-wider">FAQS</h2>

      <h2 class="text-3xl md:text-4xl text-center font-bold">
        Preguntas frecuentes
      </h2>
    </div>

    <Accordion
      type="single"
      collapsible
      class="AccordionRoot"
    >
      <AccordionItem
        v-for="{ question, answer, value } in FAQList"
        :key="value"
        :value="value"
      >
        <AccordionTrigger class="text-left"> {{ question }} </AccordionTrigger>

        <AccordionContent>{{ answer }}</AccordionContent>
      </AccordionItem>
    </Accordion>

    <h3 class="font-medium mt-4">
      ¿Todavía tienes preguntas?
      <a
        href="https://wa.me/573216978975?text=Hola%2C%20estoy%20interesado%20en%20renovar%20mi%20vivienda%20y%20quisiera%20más%20información."
        target="_blank"
        class="text-muted-foreground"
      >
        Contáctanos
      </a>
    </h3>
  </section>
</template>
