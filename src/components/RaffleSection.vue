<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Estado del formulario
const form = ref({
  name: '',
  phone: '',
  selectedNumber: null as number | null
});

// Configuración
const availableNumbers = ref(Array.from({length: 100}, (_, i) => i + 1));
const takenNumbers = ref<number[]>([]);
const isLoading = ref(false);
const webAppUrl = ref('https://script.google.com/macros/s/AKfycbzIOqMYhHQ6jC6BHbtjfZXfiPm3uPa2mRKj2xRQFRusCxYkrqW7ZaNj48MnYyPUJwggww/exec');

// Validaciones
const isValidPhone = (phone: string) => /^[0-9]{10,15}$/.test(phone);

// Cargar números ocupados
const loadTakenNumbers = async () => {
  try {
    const response = await fetch(`${webAppUrl.value}?action=getNumbers`);
    if (!response.ok) throw new Error('Error al cargar números');
    const data = await response.json();
    takenNumbers.value = data.takenNumbers || [];
  } catch (error) {
    console.error("Error:", error);
    alert("Error al cargar números ocupados. Recarga la página.");
  }
};

// Enviar formulario
const saveParticipation = async () => {
  isLoading.value = true;
  
  try {
    const response = await fetch(webAppUrl.value, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.value.name,
        phone: form.value.phone,
        selectedNumber: form.value.selectedNumber
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(`¡Registro exitoso! Tu número: ${result.number}`);
      takenNumbers.value.push(form.value.selectedNumber as number);
      form.value = { name: '', phone: '', selectedNumber: null };
    } else {
      throw new Error(result.message || "Error desconocido");
    }
  } catch (error: any) {
    alert(error.message || "Error de conexión. Intenta nuevamente.");
    console.error("Error:", error);
  } finally {
    isLoading.value = false;
  }
};

// Validar y enviar
const handleSubmit = () => {
  // Validaciones básicas
  if (!form.value.name.trim()) {
    alert("Por favor ingresa tu nombre");
    return;
  }

  if (!form.value.phone || !isValidPhone(form.value.phone)) {
    alert("Teléfono inválido (debe tener 10-15 dígitos)");
    return;
  }

  if (!form.value.selectedNumber) {
    alert("Selecciona un número para participar");
    return;
  }

  if (takenNumbers.value.includes(form.value.selectedNumber)) {
    alert("Este número ya está ocupado. Elige otro.");
    return;
  }

  saveParticipation();
};

// Cargar números al iniciar
onMounted(() => {
  loadTakenNumbers();
});
</script>

<template>
  <section id="rifa" class="container py-20 md:py-32">
    <div class="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto">
      <div class="text-center space-y-8">
        <div class="max-w-screen-md mx-auto text-center text-4xl md:text-5xl font-bold">
          <h1>
            Participa en nuestra 
            <span class="text-transparent bg-gradient-to-r from-[#1A8ACC] to-[#9C27B0] bg-clip-text">gran rifa
            </span>
          </h1>
        </div>

        <p class="max-w-screen-sm mx-auto text-xl text-muted-foreground">
          Elige tu número de la suerte y participa para ganar increíbles premios. ¡El sorteo será el 15 de diciembre!
        </p>
      </div>

      <div class="w-full max-w-2xl bg-white/90 dark:bg-card p-6 md:p-8 rounded-lg shadow-lg">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
            <Input 
              v-model="form.name" 
              placeholder="Ingresa tu nombre completo" 
              class="w-full"
              :disabled="isLoading"
            />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de teléfono</label>
            <Input 
              v-model="form.phone" 
              placeholder="Ingresa tu teléfono (10-15 dígitos)" 
              type="tel"
              class="w-full"
              :disabled="isLoading"
            />
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-center">Elige tu número de la suerte (1-100)</h3>
            
            <div class="grid grid-cols-5 sm:grid-cols-10 gap-2">
              <button
                v-for="number in availableNumbers"
                :key="number"
                @click="form.selectedNumber = number"
                class="aspect-square flex items-center justify-center rounded-md border transition-colors"
                :class="{
                  'bg-[#1A8ACC] text-white border-[#1A8ACC]': form.selectedNumber === number,
                  'border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800': form.selectedNumber !== number && !takenNumbers.includes(number),
                  'bg-gray-200 dark:bg-gray-700 cursor-not-allowed': takenNumbers.includes(number),
                  'border-red-500': takenNumbers.includes(number)
                }"
                :disabled="isLoading || takenNumbers.includes(number)"
                :title="takenNumbers.includes(number) ? 'Número ya seleccionado' : `Seleccionar número ${number}`"
              >
                {{ number }}
              </button>
            </div>
            
            <p v-if="form.selectedNumber" class="text-center text-sm mt-2">
              Seleccionado: <span class="font-bold">{{ form.selectedNumber }}</span>
            </p>
          </div>

          <Button 
            @click="handleSubmit"
            class="w-full font-bold group/arrow bg-[#1A8ACC] hover:bg-[#1A8ACC]/80 mt-6"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Participar en la rifa</span>
            <span v-else>Procesando tu registro...</span>
          </Button>
          
          <p class="text-xs text-center text-gray-500 dark:text-gray-400">
            Al participar aceptas nuestros términos y condiciones. Solo un registro por persona.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>