<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db, signInWithEmailAndPassword } from '@/lib/firebase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Estado del formulario
const form = ref({
  name: '',
  phone: '',
  selectedNumbers: [] as number[]
});

// Configuración
const availableNumbers = ref(Array.from({ length: 1000 }, (_, i) => i + 1));
const takenNumbers = ref<number[]>([]);
const isLoading = ref(false);
const ticketPrice = 10000; // 10,000 COP por número
const showAdminPanel = ref(true); // Cambiar a true para mostrar el panel de admin

// Variables para el panel de administrador
const adminNumbersInput = ref('');
const isAdminAuthenticated = ref(false);
const adminCredentials = ref({
  email: '',
  password: ''
});
const participants = ref<any[]>([]);
const searchTerm = ref('');

// Datos de contacto del administrador
const adminData = ref({
  phone: '3125919606',
  messageTemplate: 'Hola, quiero participar en la rifa con los siguientes datos:'
});

// Precio total calculado
const totalPrice = computed(() => {
  return form.value.selectedNumbers.length * ticketPrice;
});

// Validaciones
const isValidPhone = (phone: string) => /^[0-9]{10,15}$/.test(phone);

// Generar número de boleta único
const generateTicketNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RIFA-${timestamp}-${randomNum}`;
};

// Cargar números ocupados desde Firebase
const loadTakenNumbers = async () => {
  try {
    isLoading.value = true;
    const docRef = doc(db, "raffle", "takenNumbers");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      takenNumbers.value = docSnap.data().numbers || [];
    }
  } catch (error) {
    console.error("Error cargando números ocupados:", error);
    const savedNumbers = localStorage.getItem('takenNumbers');
    if (savedNumbers) {
      takenNumbers.value = JSON.parse(savedNumbers);
    }
  } finally {
    isLoading.value = false;
  }
};

const loadParticipants = async () => {
  if (!isAdminAuthenticated.value) return;

  try {
    isLoading.value = true;
    const querySnapshot = await getDocs(collection(db, "participants"));
    participants.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'No especificado',
        phone: data.phone || 'No especificado',
        numbers: data.numbers || [],
        totalAmount: data.totalAmount || 0,
        ticketNumber: data.ticketNumber || 'N/A',
        paymentConfirmed: data.paymentConfirmed || false,
        createdAt: data.createdAt || new Date().toISOString(),
        confirmedAt: data.confirmedAt || null
      };
    });
  } catch (error) {
    console.error("Error cargando participantes:", error);
    alert("Error al cargar participantes");
  } finally {
    isLoading.value = false;
  }
};

// Guardar números ocupados en Firebase
const saveTakenNumbers = async () => {
  try {
    isLoading.value = true;
    const docRef = doc(db, "raffle", "takenNumbers");
    await setDoc(docRef, {
      numbers: takenNumbers.value,
      lastUpdated: new Date().toISOString()
    });
    localStorage.setItem('takenNumbers', JSON.stringify(takenNumbers.value));
  } catch (error) {
    console.error("Error guardando números ocupados:", error);
    localStorage.setItem('takenNumbers', JSON.stringify(takenNumbers.value));
  } finally {
    isLoading.value = false;
  }
};

// Guardar participante en Firebase
const saveParticipant = async () => {
  try {
    isLoading.value = true;
    const ticketNumber = generateTicketNumber();
    const participantData = {
      name: form.value.name,
      phone: form.value.phone,
      numbers: form.value.selectedNumbers,
      totalAmount: totalPrice.value,
      ticketNumber,
      paymentConfirmed: false,
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, "participants"), participantData);
    return ticketNumber;
  } catch (error) {
    console.error("Error guardando participante:", error);
    throw error;
  } finally {
    isLoading.value = false;
  }
};

// Autenticación de administrador
const loginAdmin = async () => {
  try {
    await signInWithEmailAndPassword(
      auth,
      adminCredentials.value.email,
      adminCredentials.value.password
    );
    isAdminAuthenticated.value = true;
    await loadParticipants();
    alert("Autenticación exitosa");
  } catch (error) {
    console.error("Error de autenticación:", error);
    alert("Credenciales incorrectas");
  }
};

// Toggle para selección de números
const toggleNumberSelection = (number: number) => {
  const index = form.value.selectedNumbers.indexOf(number);

  if (index === -1) {
    if (!takenNumbers.value.includes(number)) {
      form.value.selectedNumbers.push(number);
    }
  } else {
    form.value.selectedNumbers.splice(index, 1);
  }
};

// Generar enlace de WhatsApp con los datos del formulario
const generateWhatsAppLink = (ticketNumber: string) => {
  if (form.value.selectedNumbers.length === 0) return '';

  const numbersList = form.value.selectedNumbers.join(', ');

  const message = `${adminData.value.messageTemplate}
  
Nombre: ${form.value.name}
Teléfono: ${form.value.phone}
Números seleccionados: ${numbersList}
Total a pagar: $${totalPrice.value.toLocaleString('es-CO')} COP
Número de boleta: ${ticketNumber}

Por favor enviaré el comprobante de pago en seguida.`;

  return `https://wa.me/${adminData.value.phone}?text=${encodeURIComponent(message)}`;
};

// Marcar números como ocupados
const markNumbersAsTaken = async (numbers: number[]) => {
  try {
    isLoading.value = true;
    const newNumbers = [...new Set([...takenNumbers.value, ...numbers])];
    takenNumbers.value = newNumbers;

    const docRef = doc(db, "raffle", "takenNumbers");
    await setDoc(docRef, {
      numbers: newNumbers,
      lastUpdated: new Date().toISOString()
    });

    localStorage.setItem('takenNumbers', JSON.stringify(newNumbers));
  } catch (error) {
    console.error("Error marcando números como ocupados:", error);
    alert("Error al marcar números como ocupados");
    throw error;
  } finally {
    isLoading.value = false;
  }
};

// Función para que el admin marque números como ocupados
const markAdminNumbers = async () => {
  if (!isAdminAuthenticated.value) {
    alert("Debes autenticarte como administrador primero");
    return;
  }

  const numbersToMark = adminNumbersInput.value
    .split(',')
    .map(num => parseInt(num.trim()))
    .filter(num => !isNaN(num) && num >= 1 && num <= 1000);

  if (numbersToMark.length > 0) {
    await markNumbersAsTaken(numbersToMark);
    adminNumbersInput.value = '';
    alert(`Números marcados como ocupados: ${numbersToMark.join(', ')}`);
  } else {
    alert('Ingresa números válidos separados por comas (ej: 5, 12, 34)');
  }
};

// Limpiar todos los números ocupados
const clearAllTakenNumbers = async () => {
  if (!isAdminAuthenticated.value) {
    alert("Debes autenticarte como administrador primero");
    return;
  }

  if (confirm("¿Estás seguro de que quieres limpiar TODOS los números ocupados?")) {
    takenNumbers.value = [];
    await saveTakenNumbers();
    alert("Todos los números han sido liberados");
  }
};

// Confirmar pago de participante
// Confirmar pago de participante y marcar números como ocupados
const confirmPayment = async (participantId: string) => {
  if (!isAdminAuthenticated.value) return;

  try {
    // Encontrar el participante en la lista
    const participant = participants.value.find(p => p.id === participantId);
    if (!participant) {
      alert("Participante no encontrado");
      return;
    }

    // Verificar si alguno de los números ya está ocupado
    const alreadyTakenNumbers = participant.numbers.filter((num: number) => takenNumbers.value.includes(num));
    if (alreadyTakenNumbers.length > 0) {
      alert(`No se puede confirmar el pago. Los siguientes números ya están ocupados: ${alreadyTakenNumbers.join(', ')}`);
      return;
    }

    if (confirm(`¿Confirmar que el pago ha sido recibido y marcar los números ${participant.numbers.join(', ')} como ocupados?`)) {
      // Primero marcar los números como ocupados
      await markNumbersAsTaken(participant.numbers);

      // Luego actualizar el estado del participante
      const participantRef = doc(db, "participants", participantId);
      await updateDoc(participantRef, {
        paymentConfirmed: true,
        confirmedAt: new Date().toISOString()
      });

      // Recargar los datos
      await loadParticipants();
      alert("Pago confirmado y números marcados como ocupados correctamente");
    }
  } catch (error) {
    console.error("Error confirmando pago:", error);
    alert("Error al confirmar el pago");
  }
};
// Generar PDF de la boleta
const generateTicketPDF = async (participant: any) => {
  try {
    // Crear elemento HTML para la boleta
    const ticketElement = document.createElement('div');
    ticketElement.style.width = '600px';
    ticketElement.style.padding = '20px';
    ticketElement.style.backgroundColor = '#ffffff';
    ticketElement.style.border = '2px solid #1A8ACC';
    ticketElement.style.borderRadius = '10px';
    ticketElement.style.fontFamily = 'Arial, sans-serif';

    ticketElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <h1 style="color: #1A8ACC; margin-bottom: 5px;">Rifa de Beneficencia</h1>
        <h2 style="color: #333; margin-top: 0;">Boleta de Participación</h2>
      </div>
      
      <div style="margin-bottom: 15px;">
        <p style="margin: 5px 0;"><strong>Número de boleta:</strong> ${participant.ticketNumber}</p>
        <p style="margin: 5px 0;"><strong>Fecha:</strong> ${new Date(participant.createdAt).toLocaleDateString()}</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
        <h3 style="margin-top: 0; color: #1A8ACC;">Datos del Participante</h3>
        <p style="margin: 5px 0;"><strong>Nombre:</strong> ${participant.name}</p>
        <p style="margin: 5px 0;"><strong>Teléfono:</strong> ${participant.phone}</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
        <h3 style="margin-top: 0; color: #1A8ACC;">Números Seleccionados</h3>
        <p style="margin: 5px 0;">${participant.numbers.join(', ')}</p>
      </div>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
        <h3 style="margin-top: 0; color: #1A8ACC;">Detalles de Pago</h3>
        <p style="margin: 5px 0;"><strong>Total pagado:</strong> $${participant.totalAmount.toLocaleString('es-CO')} COP</p>
        <p style="margin: 5px 0;"><strong>Estado:</strong> ${participant.paymentConfirmed ? 'CONFIRMADO' : 'PENDIENTE'}</p>
        ${participant.paymentConfirmed ? `<p style="margin: 5px 0;"><strong>Fecha confirmación:</strong> ${new Date(participant.confirmedAt).toLocaleDateString()}</p>` : ''}
      </div>
      
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #666;">
        <p>Esta boleta es el comprobante de participación en la rifa.</p>
        <p>Consérvela para reclamar premios en caso de ser ganador.</p>
      </div>
      
      <div style="margin-top: 20px; text-align: center;">
        <div style="display: inline-block; padding: 10px 20px; background-color: #1A8ACC; color: white; border-radius: 5px;">
          ¡Gracias por participar!
        </div>
      </div>
    `;

    document.body.appendChild(ticketElement);

    // Convertir a canvas y luego a PDF
    const canvas = await html2canvas(ticketElement);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`boleta_rifa_${participant.ticketNumber}.pdf`);

    document.body.removeChild(ticketElement);
  } catch (error) {
    console.error("Error generando PDF:", error);
    alert("Error al generar el PDF de la boleta");
  }
};

// Buscar participantes
const searchParticipants = computed(() => {
  if (!searchTerm.value) return participants.value;
  const term = searchTerm.value.toLowerCase();
  return participants.value.filter(p =>
    p.name.toLowerCase().includes(term) ||
    p.phone.includes(term) ||
    p.ticketNumber.toLowerCase().includes(term)
  );
});

// Validar y redirigir a WhatsApp
const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    alert("Por favor ingresa tu nombre");
    return;
  }

  if (!form.value.phone || !isValidPhone(form.value.phone)) {
    alert("Teléfono inválido (debe tener 10-15 dígitos)");
    return;
  }

  if (form.value.selectedNumbers.length === 0) {
    alert("Selecciona al menos un número para participar");
    return;
  }

  const alreadyTaken = form.value.selectedNumbers.filter(num => takenNumbers.value.includes(num));
  if (alreadyTaken.length > 0) {
    alert(`Los siguientes números ya están ocupados: ${alreadyTaken.join(', ')}`);
    return;
  }

  try {
    const ticketNumber = await saveParticipant();
    window.open(generateWhatsAppLink(ticketNumber), '_blank');

    alert(`¡Perfecto! Se abrirá WhatsApp para que envíes tus datos. 
    
IMPORTANTE:
1. Envía el mensaje que se generó automáticamente
2. Luego envía una foto del comprobante de transferencia
3. Tus números serán reservados una vez validemos el pago

Total a pagar: $${totalPrice.value.toLocaleString('es-CO')} COP
Número de boleta: ${ticketNumber}`);
  } catch (error) {
    alert("Ocurrió un error al procesar tu participación. Por favor intenta nuevamente.");
  }
};

// Cargar números y participantes al iniciar
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
          Elige tus números de la suerte y participa para ganar increíbles premios. ¡Cada número cuesta $10,000 COP!
        </p>

        <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-left max-w-screen-sm mx-auto">
          <p class="font-bold text-yellow-700">Instrucciones para participar:</p>
          <ol class="list-decimal list-inside text-yellow-700 space-y-1 mt-2">
            <li>Selecciona uno o más números (cada uno vale $10,000 COP)</li>
            <li>Completa tus datos personales</li>
            <li>Te redirigiremos a WhatsApp para confirmar</li>
            <li>Envía el comprobante de transferencia por el total</li>
            <li>Validaremos tu pago y reservaremos tus números</li>
          </ol>
        </div>
      </div>

      <div class="w-full max-w-6xl bg-white/90 dark:bg-card p-6 md:p-8 rounded-lg shadow-lg">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
            <Input v-model="form.name" placeholder="Ingresa tu nombre completo" class="w-full" :disabled="isLoading" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de teléfono</label>
            <Input v-model="form.phone" placeholder="Ingresa tu teléfono (10-15 dígitos)" type="tel" class="w-full"
              :disabled="isLoading" />
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-center">Elige tus números de la suerte (1-1000)</h3>
            <p class="text-center text-sm">$10,000 COP por número - Seleccionados: {{ form.selectedNumbers.length }}</p>

            <div class="overflow-auto max-h-[500px] border rounded-lg p-2">
              <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 sm:gap-2">
                <button v-for="number in availableNumbers" :key="number" @click="toggleNumberSelection(number)"
                  class="h-10 sm:h-12 w-full flex items-center justify-center rounded-md border transition-colors text-xs sm:text-sm"
                  :class="{
                    'bg-[#1A8ACC] text-white border-[#1A8ACC]': form.selectedNumbers.includes(number),
                    'border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800': !form.selectedNumbers.includes(number) && !takenNumbers.includes(number),
                    'bg-gray-200 dark:bg-gray-700 cursor-not-allowed': takenNumbers.includes(number),
                    'border-red-500': takenNumbers.includes(number)
                  }" :disabled="isLoading || takenNumbers.includes(number)"
                  :title="takenNumbers.includes(number) ? 'Número ya seleccionado' : `Seleccionar número ${number}`">
                  {{ number }}
                </button>
              </div>
            </div>

            <div v-if="form.selectedNumbers.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg">
              <p class="font-semibold text-blue-800">Resumen de selección:</p>
              <p class="text-sm">Números elegidos: {{ form.selectedNumbers.join(', ') }}</p>
              <p class="font-bold mt-1">Total a pagar: ${{ totalPrice.toLocaleString('es-CO') }} COP</p>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg border-2 border-blue-300 shadow-sm">
            <h4 class="font-bold text-blue-800 text-lg mb-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fill-rule="evenodd"
                  d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
                  clip-rule="evenodd" />
              </svg>
              Información de pago
            </h4>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-white p-3 rounded-lg border border-blue-200">
                <h5 class="font-semibold text-blue-700 mb-2">Transferencia Bancolombia</h5>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">Titular:</span> Nombre del Administrador</p>
                  <p><span class="font-medium">Tipo de cuenta:</span> Ahorros</p>
                  <p><span class="font-medium">Número:</span> 123-456-789</p>
                  <p><span class="font-medium">Valor:</span> $10,000 COP por número</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-lg border border-blue-200">
                <h5 class="font-semibold text-blue-700 mb-2">Pago por Nequi</h5>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">Número:</span> 312 591 9606</p>
                  <p><span class="font-medium">Nombre:</span> Nombre del Administrador</p>
                  <p><span class="font-medium">Valor exacto:</span> ${{ totalPrice.toLocaleString('es-CO') }} COP</p>
                  <p class="text-xs text-red-600 mt-2">* Incluye referencia con tu nombre</p>
                </div>
              </div>
            </div>

            <div class="mt-3 bg-blue-100 p-2 rounded text-sm text-blue-800">
              <p class="font-medium">⚠️ Importante:</p>
              <p>Envía el comprobante de pago por WhatsApp con el mensaje generado automáticamente.</p>
              <p class="mt-1">Los números se reservan solo después de confirmado el pago.</p>
            </div>
          </div>

          <Button @click="handleSubmit"
            class="w-full font-bold group/arrow bg-[#1A8ACC] hover:bg-[#1A8ACC]/80 mt-6 py-6 text-lg"
            :disabled="isLoading">
            <span>Continuar a WhatsApp</span>
            <svg xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 ml-2 group-hover/arrow:translate-x-1 transition-transform" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </Button>

          <div class="bg-green-50 p-4 rounded-lg border border-green-200" v-if="form.selectedNumbers.length > 0">
            <h4 class="font-bold text-green-800 mb-2">¡Importante!</h4>
            <p class="text-green-700">Por favor envía el pago exacto de <strong>${{ totalPrice.toLocaleString('es-CO')
                }} COP</strong> correspondiente a {{ form.selectedNumbers.length }} número(s).</p>
            <p class="text-green-700 mt-1">Incluye en el mensaje de WhatsApp el número de referencia de tu
              transferencia.</p>
          </div>

          <p class="text-xs text-center text-gray-500 dark:text-gray-400">
            Al participar aceptas nuestros términos y condiciones. Los números se reservan solo después de confirmado el
            pago.
          </p>
        </div>
      </div>

      <!-- Sección para administrador -->
      <div class="w-full max-w-6xl bg-gray-100 p-4 rounded-lg mt-8" v-if="showAdminPanel">
        <h3 class="font-bold text-lg mb-3">Panel de Administrador</h3>

        <div v-if="!isAdminAuthenticated" class="space-y-4 p-4 bg-white rounded-lg mb-4">
          <h4 class="font-medium">Autenticación requerida</h4>
          <div class="space-y-2">
            <Input v-model="adminCredentials.email" placeholder="Correo electrónico" type="email" />
            <Input v-model="adminCredentials.password" placeholder="Contraseña" type="password" />
            <Button @click="loginAdmin" class="w-full bg-blue-600 hover:bg-blue-700">
              Iniciar sesión
            </Button>
          </div>
        </div>

        <div v-if="isAdminAuthenticated" class="space-y-6">
          <div class="bg-green-50 p-2 rounded text-green-800 text-sm mb-3">
            Autenticado como administrador
          </div>

          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Marcar números como ocupados:</label>
              <Input v-model="adminNumbersInput" placeholder="Ej: 5, 12, 34" class="w-full mb-2" />
              <Button @click="markAdminNumbers" class="bg-green-600 hover:bg-green-700">
                Marcar como ocupados
              </Button>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">Números ocupados actuales ({{ takenNumbers.length
                }}):</label>
              <p class="text-sm overflow-auto max-h-[100px] border p-2 bg-white rounded">{{ takenNumbers.join(', ') ||
                'Ninguno' }}</p>
              <Button @click="clearAllTakenNumbers" class="bg-red-600 hover:bg-red-700 mt-2">
                Limpiar todos los números ocupados
              </Button>
            </div>
          </div>

          <div class="mt-6">
            <h4 class="font-bold text-lg mb-3">Participantes</h4>
            <Input v-model="searchTerm" placeholder="Buscar por nombre, teléfono o número de boleta"
              class="w-full mb-3" />

            <div class="overflow-x-auto">
              <table class="min-w-full bg-white rounded-lg overflow-hidden">
                <thead class="bg-gray-200">
                  <tr>
                    <th class="py-2 px-4 text-left">Boleta</th>
                    <th class="py-2 px-4 text-left">Nombre</th>
                    <th class="py-2 px-4 text-left">Teléfono</th>
                    <th class="py-2 px-4 text-left">Números</th>
                    <th class="py-2 px-4 text-left">Total</th>
                    <th class="py-2 px-4 text-left">Estado</th>
                    <th class="py-2 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="participant in searchParticipants" :key="participant.id">
                    <td class="py-2 px-4">{{ participant.ticketNumber }}</td>
                    <td class="py-2 px-4">{{ participant.name }}</td>
                    <td class="py-2 px-4">{{ participant.phone }}</td>
                    <td class="py-2 px-4">
                      <template v-if="participant.numbers && participant.numbers.length > 0">
                        <span v-for="num in participant.numbers" :key="num" :class="{
                          'inline-block mr-1 mb-1 px-2 py-1 rounded text-xs': true,
                          'bg-green-100 text-green-800': !takenNumbers.includes(num),
                          'bg-red-100 text-red-800 line-through': takenNumbers.includes(num) && !participant.paymentConfirmed,
                          'bg-blue-100 text-blue-800': takenNumbers.includes(num) && participant.paymentConfirmed
                        }" :title="takenNumbers.includes(num) ? 'Número ocupado' : 'Número disponible'">
                          {{ num }}
                          <span v-if="takenNumbers.includes(num) && !participant.paymentConfirmed"
                            class="ml-1">⚠️</span>
                        </span>
                      </template>
                      <span v-else class="text-gray-400">N/A</span>
                    </td>
                    <td class="py-2 px-4">
                      {{ participant.totalAmount?.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) ||
                      '$0' }}
                    </td>
                    <td class="py-2 px-4">
                      <span :class="{
                        'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs': !participant.paymentConfirmed,
                        'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs': participant.paymentConfirmed
                      }">
                        {{ participant.paymentConfirmed ? 'CONFIRMADO' : 'PENDIENTE' }}
                      </span>
                    </td>
                    <td class="py-2 px-4 space-x-2">
                      <Button v-if="!participant.paymentConfirmed" @click="confirmPayment(participant.id)" size="sm"
                        class="bg-green-600 hover:bg-green-700">
                        Confirmar Pago
                      </Button>
                      <Button @click="generateTicketPDF(participant)" size="sm" class="bg-blue-600 hover:bg-blue-700">
                        Generar Boleta
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p v-if="searchParticipants.length === 0" class="text-center py-4 text-gray-500">
                No se encontraron participantes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>