<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Button } from './ui/button'
import { Card, CardHeader, CardContent, CardFooter } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { Textarea } from './ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import { AlertCircle, Building2, Phone, Mail, Clock } from 'lucide-vue-next'

interface ContactFormProps {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}

const contactForm = reactive<ContactFormProps>({
  firstName: '',
  lastName: '',
  email: '',
  subject: 'Consulta general',
  message: ''
})

const invalidInputForm = ref(false)

const handleSubmit = () => {
  const { firstName, lastName, email, subject, message } = contactForm

  // Validación simple
  if (!firstName || !lastName || !email || !message) {
    invalidInputForm.value = true
    return
  }

  invalidInputForm.value = false

  const mailToLink = `mailto:Joseagomar2009@hotmail.com?subject=${encodeURIComponent(subject)}&body=Hola, soy ${firstName} ${lastName}, mi correo es ${email}.%0D%0A%0D%0A${encodeURIComponent(message)}`
  window.location.href = mailToLink
}
</script>

<template>
  <section id="contact" class="container py-24 sm:py-32">
    <section class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Información -->
      <div>
        <div class="mb-4">
          <h2 class="text-lg text-primary mb-2 tracking-wider">Contacto</h2>
          <h2 class="text-3xl md:text-4xl font-bold">Conectate con nosotros</h2>
        </div>
        <p class="mb-8 text-muted-foreground lg:w-5/6">
          ¿Tienes dudas o querés iniciar un proyecto? Estamos listos para escucharte y ayudarte a avanzar con tus ideas. Contactanos.
        </p>

        <div class="flex flex-col gap-4 text-sm">
          <div>
            <div class="flex gap-2 mb-1">
              <Building2 />
              <span class="font-bold">Ubicación</span>
            </div>
            <p>La Jagua de ibirico, Cesar - Colombia</p>
          </div>

          <div>
            <div class="flex gap-2 mb-1">
              <Phone />
              <span class="font-bold">Teléfono</span>
            </div>
            <p>+57 321 697 8975</p>
          </div>

          <div>
            <div class="flex gap-2 mb-1">
              <Mail />
              <span class="font-bold">Email</span>
            </div>
            <p>Joseagomar2009@hotmail.com</p>
            <p>enyerelpoeta@gmail.com</p>
          </div>

          <div>
            <div class="flex gap-2 mb-1">
              <Clock />
              <span class="font-bold">Horario</span>
            </div>
            <p>Siempre disponible (24/7)</p>
          </div>
        </div>
      </div>

      <!-- Formulario -->
      <Card class="bg-muted/60 dark:bg-card">
        <CardHeader class="text-primary text-2xl font-semibold">Escribenos</CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="grid gap-4">
            <div class="flex flex-col md:flex-row gap-8">
              <div class="flex flex-col w-full gap-1.5">
                <Label for="first-name">Nombre</Label>
                <Input id="first-name" type="text" placeholder="Ej. Juan" v-model="contactForm.firstName" />
              </div>
              <div class="flex flex-col w-full gap-1.5">
                <Label for="last-name">Apellido</Label>
                <Input id="last-name" type="text" placeholder="Ej. Pérez" v-model="contactForm.lastName" />
              </div>
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="email">Correo electrónico</Label>
              <Input id="email" type="email" placeholder="ejemplo@correo.com" v-model="contactForm.email" />
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="subject">Motivo</Label>
              <Select v-model="contactForm.subject">
                <SelectTrigger>
                  <SelectValue placeholder="Seleccioná un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Consulta general">Consulta general</SelectItem>
                    <SelectItem value="Precios">Precios</SelectItem>
                    <SelectItem value="Contacto">Contacto</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="flex flex-col gap-1.5">
              <Label for="message">Mensaje</Label>
              <Textarea id="message" rows="5" placeholder="Contanos más..." v-model="contactForm.message" />
            </div>

            <Alert v-if="invalidInputForm" variant="destructive">
              <AlertCircle class="w-4 h-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Completá todos los campos obligatorios para continuar.
              </AlertDescription>
            </Alert>

            <Button class="mt-4" type="submit">Enviar mensaje</Button>
          </form>
        </CardContent>
        <CardFooter />
      </Card>
    </section>
  </section>
</template>
