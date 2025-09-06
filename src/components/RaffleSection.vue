<template>
  <section id="rifa" class="container py-20 md:py-32">
    <div class="grid place-items-center lg:max-w-screen-xl gap-8 mx-auto">
      <!-- Encabezado y descripción -->
      <div class="text-center space-y-8">
        <div class="max-w-screen-md mx-auto text-center text-4xl md:text-5xl font-bold">
          <h1>
            Participa en nuestra
            <span class="text-transparent bg-gradient-to-r from-[#1A8ACC] to-[#9C27B0] bg-clip-text">gran rifa
            </span>
          </h1>
        </div>

        <p class="max-w-screen-sm mx-auto text-xl text-muted-foreground">
          Elige tus números de la suerte y participa para ganar increíbles premios. ¡Cada número cuesta $20,000 COP!
        </p>

        <div class="bg-yellow-100 border-l-4 border-yellow-500 p-4 text-left max-w-screen-sm mx-auto">
          <p class="font-bold text-yellow-700">Instrucciones para participar:</p>
          <ol class="list-decimal list-inside text-yellow-700 space-y-1 mt-2">
            <li>Selecciona uno o más números (cada uno vale $20,000 COP)</li>
            <li>Completa tus datos personales</li>
            <li>Sube tu comprobante de pago directamente en esta página</li>
            <li>Recibirás tu boleta por WhatsApp una vez confirmemos el pago</li>
            <li>Asegúrate de tener WhatsApp activo en tu teléfono</li>
          </ol>
        </div>
      </div>

      <!-- Formulario principal -->
      <div class="w-full max-w-6xl bg-white/90 dark:bg-card p-6 md:p-8 rounded-lg shadow-lg">
        <div class="space-y-6">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</label>
            <Input v-model="form.name" placeholder="Ingresa tu nombre completo" class="w-full" :disabled="isLoading" />
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de teléfono (con
              WhatsApp)</label>
            <Input v-model="form.phone" placeholder="Ingresa tu teléfono (10-15 dígitos)" type="tel" class="w-full"
              :disabled="isLoading" />
            <p class="text-sm text-muted-foreground mt-1">Este teléfono debe tener WhatsApp activo para recibir tu
              boleta</p>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-center">Elige tus números de la suerte (1-1000)</h3>
            <p class="text-center text-sm">$20,000 COP por número - Seleccionados: {{ form.selectedNumbers.length }}</p>

            <div class="overflow-auto max-h-[500px] border rounded-lg p-2">
              <div class="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1 sm:gap-2">
                <button v-for="number in availableNumbers" :key="number" @click="toggleNumberSelection(number)"
                  class="h-10 sm:h-12 w-full flex items-center justify-center rounded-md border transition-colors text-xs sm:text-sm"
                  :class="getNumberClass(number)" :disabled="isLoading || !isNumberAvailable(number)"
                  :title="getNumberTitle(number)">
                  {{ number }}
                  <span v-if="isNumberReserved(number)" class="ml-1 text-xs">⏱️</span>
                </button>
              </div>
            </div>

            <div v-if="form.selectedNumbers.length > 0" class="mt-4 p-3 bg-blue-50 rounded-lg">
              <p class="font-semibold text-blue-800">Resumen de selección:</p>
              <p class="text-sm">Números elegidos: {{ form.selectedNumbers.join(', ') }}</p>
              <p class="font-bold mt-1">Total a pagar: ${{ totalPrice.toLocaleString('es-CO') }} COP</p>
              <p v-if="temporaryReservationId" class="text-xs text-blue-600 mt-2">
                ⏱️ Tus números están reservados por 15 minutos para que completes el pago
              </p>
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
                  <p><span class="font-medium">Titular:</span> MEQUICIDETH TOBIAS NAVARRO</p>
                  <p><span class="font-medium">Tipo de cuenta:</span> AHORROS</p>
                  <p><span class="font-medium">Número:</span> 91285870530</p>
                  <p><span class="font-medium">Valor:</span> $20,000 COP por número</p>
                </div>
              </div>

              <div class="bg-white p-3 rounded-lg border border-blue-200">
                <h5 class="font-semibold text-blue-700 mb-2">Pago por Nequi</h5>
                <div class="space-y-1 text-sm">
                  <p><span class="font-medium">Número:</span> 312 591 9606</p>
                  <p><span class="font-medium">Nombre:</span> MEQUICIDETH TOBIAS NAVARRO</p>
                  <p><span class="font-medium">Valor exacto:</span> ${{ totalPrice.toLocaleString('es-CO') }} COP</p>
                </div>
              </div>
            </div>

            <div class="mt-3 bg-blue-100 p-2 rounded text-sm text-blue-800">
              <p class="font-medium">⚠️ Importante:</p>
              <p>Envía el pago exacto y sube el comprobante en esta página.</p>
              <p class="mt-1">Los números se reservan solo después de confirmado el pago.</p>
            </div>
          </div>

          <!-- Botón para abrir modal de comprobante -->
          <Button @click="openReceiptModal"
            class="w-full font-bold group/arrow bg-[#1A8ACC] hover:bg-[#1A8ACC]/80 mt-6 py-6 text-lg"
            :disabled="isLoading || !canSubmit">
            <span>Subir Comprobante de Pago</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </Button>

          <div class="bg-green-50 p-4 rounded-lg border border-green-200" v-if="form.selectedNumbers.length > 0">
            <h4 class="font-bold text-green-800 mb-2">¡Importante!</h4>
            <p class="text-green-700">Por favor envía el pago exacto de <strong>${{ totalPrice.toLocaleString('es-CO')
                }} COP</strong> correspondiente a {{ form.selectedNumbers.length }} número(s).</p>
            <p class="text-green-700 mt-1">Sube el comprobante en el formulario y recibirás tu boleta por WhatsApp.</p>
          </div>

          <p class="text-xs text-center text-gray-500 dark:text-gray-400">
            Al participar aceptas nuestros términos y condiciones. Los números se reservan solo después de confirmado el
            pago.
          </p>
        </div>
      </div>

      <!-- Modal para subir comprobante -->
      <div v-if="showReceiptModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Subir Comprobante de Pago</h2>

          <div class="mb-4 p-4 bg-blue-50 rounded-lg">
            <p class="font-semibold text-blue-800">Resumen de tu compra:</p>
            <p class="text-sm">Números: {{ form.selectedNumbers.join(', ') }}</p>
            <p class="font-bold">Total: ${{ totalPrice.toLocaleString('es-CO') }} COP</p>
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Selecciona tu comprobante:</label>
            <input type="file" accept="image/*" @change="handleReceiptUpload"
              class="w-full px-3 py-2 border border-gray-300 rounded-md">

            <div v-if="receiptPreview" class="mt-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
              <img :src="receiptPreview" alt="Vista previa del comprobante"
                class="max-w-full max-h-40 object-contain border rounded">
            </div>
          </div>

          <div class="mb-4 p-4 bg-yellow-50 rounded-lg">
            <p class="text-sm text-yellow-700">
              <span class="font-bold">Importante:</span> Tu boleta será enviada por WhatsApp al número que registraste
              una vez validemos el pago.
              Asegúrate de tener WhatsApp activo en este teléfono.
            </p>
          </div>

          <div class="flex justify-end space-x-3">
            <Button @click="closeReceiptModal" variant="outline">
              Cancelar
            </Button>
            <Button @click="submitForm" :disabled="!receiptFile" class="bg-[#1A8ACC] hover:bg-[#1A8ACC]/80">
              Enviar Comprobante
            </Button>
          </div>
        </div>
      </div>

      <!-- Modal para ver comprobante -->
      <div v-if="showReceiptViewer" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Comprobante de Pago</h2>

          <div class="mb-4">
            <p class="text-sm text-gray-600 mb-2">Participante: {{ currentParticipant?.name }}</p>
            <img :src="currentReceiptUrl" alt="Comprobante de pago" class="w-full h-auto max-h-96 object-contain">
          </div>

          <div class="flex justify-end">
            <Button @click="closeReceiptViewer" class="bg-[#1A8ACC] hover:bg-[#1A8ACC]/80">
              Cerrar
            </Button>
          </div>
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
            <h4 class="font-bold text-lg mb-3">Reservas Temporales</h4>
            <div class="overflow-x-auto mb-6">
              <table class="min-w-full bg-white rounded-lg overflow-hidden">
                <thead class="bg-gray-200">
                  <tr>
                    <th class="py-2 px-4 text-left">ID Reserva</th>
                    <th class="py-2 px-4 text-left">Números</th>
                    <th class="py-2 px-4 text-left">Tiempo Restante</th>
                    <th class="py-2 px-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="reservation in temporaryReservations" :key="reservation.participantId">
                    <td class="py-2 px-4">{{ reservation.participantId.slice(0, 8) }}...</td>
                    <td class="py-2 px-4">{{ reservation.numbers.join(', ') }}</td>
                    <td class="py-2 px-4">{{ Math.max(0, Math.floor((reservationTimeout - (Date.now() -
                      reservation.timestamp)) / 60000)) }} minutos</td>
                    <td class="py-2 px-4">
                      <Button @click="releaseReservation(reservation.participantId)" size="sm"
                        class="bg-red-600 hover:bg-red-700">
                        Liberar
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-if="temporaryReservations.length === 0" class="text-center py-4 text-gray-500">
                No hay reservas temporales activas
              </p>
            </div>

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
                    <th class="py-2 px-4 text-left">Comprobante</th>
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
                      <Button v-if="participant.receiptUrl" @click="viewReceipt(participant)" variant="outline"
                        size="sm">
                        Ver comprobante
                      </Button>
                      <span v-else class="text-gray-400 text-sm">Sin comprobante</span>
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
                      <Button @click="deleteParticipant(participant.id)" size="sm" class="bg-red-600 hover:bg-red-700">
                        Eliminar
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

<script setup lang="ts">
import { ref, onMounted, computed, watch, onUnmounted } from 'vue';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { doc, getDoc, setDoc, collection, addDoc, getDocs, updateDoc, deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage, signInWithEmailAndPassword } from '@/lib/firebase';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from 'emailjs-com';

// Estado del formulario
const form = ref({
  name: '',
  phone: '',
  selectedNumbers: [] as number[]
});

// Configuración
const availableNumbers = ref(Array.from({ length: 1000 }, (_, i) => i + 1));
const takenNumbers = ref<number[]>([]);
const temporaryReservations = ref<{ numbers: number[], timestamp: number, participantId: string }[]>([]);
const temporaryReservationId = ref<string | null>(null);
const isLoading = ref(false);
const ticketPrice = 20000; // 20,000 COP por número
const showAdminPanel = ref(true);
const reservationTimeout = 15 * 60 * 1000; // 15 minutos para completar el pago

// Variables para el panel de administrador
const adminNumbersInput = ref('');
const isAdminAuthenticated = ref(false);
const adminCredentials = ref({
  email: '',
  password: ''
});
const participants = ref<any[]>([]);
const searchTerm = ref('');

// Variables para el comprobante
const showReceiptModal = ref(false);
const receiptFile = ref<File | null>(null);
const receiptPreview = ref<string | null>(null);
const showReceiptViewer = ref(false);
const currentReceiptUrl = ref('');
const currentParticipant = ref<any>(null);

// Datos de contacto del administrador
const adminData = ref({
  phone: '3125919606',
  messageTemplate: 'Hola, he subido mi comprobante de pago para la rifa con los siguientes datos:'
});

// Precio total calculado
const totalPrice = computed(() => {
  return form.value.selectedNumbers.length * ticketPrice;
});

// Validar si se puede enviar el formulario
const canSubmit = computed(() => {
  return form.value.name.trim() &&
    isValidPhone(form.value.phone) &&
    form.value.selectedNumbers.length > 0;
});

// Validaciones
const isValidPhone = (phone: string) => /^[0-9]{10,15}$/.test(phone);

// Generar ID único para reserva temporal
const generateTemporaryId = () => {
  return `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Generar número de boleta único
const generateTicketNumber = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `RIFA-${timestamp}-${randomNum}`;
};

// Verificar disponibilidad de número
const isNumberAvailable = (number: number): boolean => {
  // Verificar si el número está permanentemente ocupado
  if (takenNumbers.value.includes(number)) {
    return false;
  }

  // Verificar si el número está reservado temporalmente
  const isReserved = temporaryReservations.value.some(reservation =>
    reservation.numbers.includes(number) &&
    (Date.now() - reservation.timestamp) < reservationTimeout
  );

  return !isReserved;
};

// Verificar si un número está reservado temporalmente
const isNumberReserved = (number: number): boolean => {
  return temporaryReservations.value.some(reservation =>
    reservation.numbers.includes(number) &&
    (Date.now() - reservation.timestamp) < reservationTimeout
  );
};

// Obtener clase CSS para número
const getNumberClass = (number: number) => {
  if (form.value.selectedNumbers.includes(number)) {
    return 'bg-[#1A8ACC] text-white border-[#1A8ACC]';
  } else if (takenNumbers.value.includes(number)) {
    return 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed border-red-500';
  } else if (isNumberReserved(number)) {
    return 'bg-yellow-100 border-yellow-500 cursor-not-allowed';
  } else {
    return 'border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';
  }
};

// Obtener título para número
const getNumberTitle = (number: number): string => {
  if (takenNumbers.value.includes(number)) {
    return 'Número ya seleccionado';
  } else if (isNumberReserved(number)) {
    return 'Número reservado temporalmente';
  } else {
    return `Seleccionar número ${number}`;
  }
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

// Cargar reservas temporales desde Firebase
const loadTemporaryReservations = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "temporaryReservations"));
    const now = Date.now();

    temporaryReservations.value = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = new Date(data.timestamp).getTime();

      // Solo cargar reservas que aún no han expirado
      if ((now - timestamp) < reservationTimeout) {
        temporaryReservations.value.push({
          numbers: data.numbers || [],
          timestamp: timestamp,
          participantId: doc.id
        });
      } else {
        // Eliminar reservas expiradas
        deleteDoc(doc.ref);
      }
    });
  } catch (error) {
    console.error("Error cargando reservas temporales:", error);
  }
};

// Suscribirse a cambios en tiempo real de reservas temporales
const subscribeToTemporaryReservations = () => {
  const q = query(collection(db, "temporaryReservations"));

  return onSnapshot(q, (querySnapshot) => {
    const now = Date.now();
    temporaryReservations.value = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const timestamp = new Date(data.timestamp).getTime();

      if ((now - timestamp) < reservationTimeout) {
        temporaryReservations.value.push({
          numbers: data.numbers || [],
          timestamp: timestamp,
          participantId: doc.id
        });
      }
    });
  });
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
        receiptUrl: data.receiptUrl || '',
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

// Enviar notificación por correo electrónico
// Enviar notificación por correo electrónico cuando se sube comprobante
const sendPaymentConfirmationEmail = async (name: string, phone: string, numbers: number[], totalAmount: number, ticketNumber: string, receiptUrl: string = '') => {
  try {
    // Configurar EmailJS
    emailjs.init("uo0IOtQXwDo0wtN5D");
    
    const templateParams = {
      to_email: "melkytobias10@gmail.com",
      from_name: "Sistema de Rifa",
      name: name,
      phone: phone,
      numbers: numbers.join(', '), // Convertir array a string
      numbersCount: numbers.length,
      totalAmount: totalAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      ticketNumber: ticketNumber,
      time: new Date().toLocaleString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      receiptUrl: receiptUrl,
      year: new Date().getFullYear(),
      message: `Nuevo comprobante de pago recibido de ${name} (${phone}) para los números: ${numbers.join(', ')}`
    };

    await emailjs.send(
      "service_x08uwpo",
      "template_t6eoyqm", // Asegúrate de que esta plantilla use {{numbers}} en lugar del loop {{#each numbers}}
      templateParams
    );
    
    console.log("Correo de notificación de comprobante enviado exitosamente");
  } catch (error) {
    console.error("Error enviando correo de notificación:", error);
  }
};

// Reservar números temporalmente
const reserveNumbersTemporarily = async (numbers: number[], participantId: string) => {
  try {
    // Guardar la reserva temporal en Firestore
    const reservationRef = doc(db, "temporaryReservations", participantId);
    await setDoc(reservationRef, {
      numbers: numbers,
      timestamp: new Date().toISOString(),
      expiresAt: new Date(Date.now() + reservationTimeout).toISOString()
    });

    // Actualizar estado local
    temporaryReservations.value.push({
      numbers,
      timestamp: Date.now(),
      participantId
    });

    // Programar limpieza automática
    setTimeout(() => {
      releaseExpiredReservation(participantId);
    }, reservationTimeout);

  } catch (error) {
    console.error("Error reservando números:", error);
    throw new Error("No se pudieron reservar los números");
  }
};

// Liberar reserva expirada
const releaseExpiredReservation = async (participantId: string) => {
  try {
    // Eliminar de Firestore
    const reservationRef = doc(db, "temporaryReservations", participantId);
    await deleteDoc(reservationRef);

    // Eliminar del estado local
    const index = temporaryReservations.value.findIndex(r => r.participantId === participantId);
    if (index !== -1) {
      temporaryReservations.value.splice(index, 1);
    }
  } catch (error) {
    console.error("Error liberando reserva:", error);
  }
};

// Liberar reserva manualmente (para admin)
const releaseReservation = async (participantId: string) => {
  try {
    await releaseExpiredReservation(participantId);
    alert("Reserva liberada correctamente");
  } catch (error) {
    console.error("Error liberando reserva:", error);
    alert("Error al liberar la reserva");
  }
};

// Subir comprobante a Firebase Storage
const uploadReceipt = async (file: File, ticketNumber: string): Promise<string> => {
  try {
    const fileRef = storageRef(storage, `receipts/${ticketNumber}_${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error subiendo comprobante:", error);
    throw new Error("No se pudo subir el comprobante");
  }
};

// Guardar participante en Firebase
const saveParticipant = async (receiptUrl: string = '') => {
  try {
    isLoading.value = true;
    const ticketNumber = generateTicketNumber();
    const participantData = {
      name: form.value.name,
      phone: form.value.phone,
      numbers: form.value.selectedNumbers,
      totalAmount: totalPrice.value,
      ticketNumber,
      receiptUrl,
      paymentConfirmed: false,
      createdAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, "participants"), participantData);
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
    await loadTemporaryReservations();
  } catch (error) {
    console.error("Error de autenticación:", error);
    alert("Credenciales incorrectas");
  }
};

// Toggle para selección de números
const toggleNumberSelection = (number: number) => {
  // Verificar disponibilidad
  if (!isNumberAvailable(number)) {
    alert("Este número ya ha sido seleccionado por otro participante. Por favor elige otro.");
    return;
  }

  const index = form.value.selectedNumbers.indexOf(number);
  if (index === -1) {
    form.value.selectedNumbers.push(number);
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
Total pagado: $${totalPrice.value.toLocaleString('es-CO')} COP
Número de boleta: ${ticketNumber}

Por favor confírmenme cuando hayan validado el pago.`;

  return `https://wa.me/${adminData.value.phone}?text=${encodeURIComponent(message)}`;
};

// Marcar números como ocupados
const markNumbersAsTaken = async (numbers: number[]) => {
  try {
    isLoading.value = true;

    // Filtrar números que ya no están en takenNumbers
    const newNumbers = numbers.filter(num => !takenNumbers.value.includes(num));

    if (newNumbers.length > 0) {
      // Agregar solo los números nuevos
      takenNumbers.value = [...takenNumbers.value, ...newNumbers];

      const docRef = doc(db, "raffle", "takenNumbers");
      await setDoc(docRef, {
        numbers: takenNumbers.value,
        lastUpdated: new Date().toISOString()
      });

      localStorage.setItem('takenNumbers', JSON.stringify(takenNumbers.value));
    }
  } catch (error) {
    console.error("Error guardando números ocupados:", error);
    localStorage.setItem('takenNumbers', JSON.stringify(takenNumbers.value));
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

// Reiniciar formulario después de enviar
const resetForm = () => {
  form.value = {
    name: '',
    phone: '',
    selectedNumbers: []
  };
  receiptFile.value = null;
  receiptPreview.value = null;
  temporaryReservationId.value = null;
};

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

    // Verificar si alguno de los números ya está ocupado por OTRO participante
    const alreadyTakenNumbers = participant.numbers.filter((num: number) => {
      // Verificar si el número está en takenNumbers pero NO pertenece a este participante
      if (takenNumbers.value.includes(num)) {
        // Buscar si algún otro participante confirmado tiene este número
        const otherParticipantWithSameNumber = participants.value.find(p =>
          p.id !== participantId &&
          p.paymentConfirmed &&
          p.numbers.includes(num)
        );
        return otherParticipantWithSameNumber !== undefined;
      }
      return false;
    });

    if (alreadyTakenNumbers.length > 0) {
      alert(`No se puede confirmar el pago. Los siguientes números ya están ocupados por otros participantes: ${alreadyTakenNumbers.join(', ')}`);
      return;
    }

    if (confirm(`¿Confirmar que el pago ha sido recibido y marcar los números ${participant.numbers.join(', ')} como ocupados?`)) {
      // Primero marcar los números como ocupados (si no lo están ya)
      const numbersToMark = participant.numbers.filter((num: number) =>
        !takenNumbers.value.includes(num)
      );

      if (numbersToMark.length > 0) {
        await markNumbersAsTaken(numbersToMark);
      }

      // Luego actualizar el estado del participante
      const participantRef = doc(db, "participants", participantId);
      await updateDoc(participantRef, {
        paymentConfirmed: true,
        confirmedAt: new Date().toISOString()
      });

      // Liberar cualquier reserva temporal que exista para este participante
      try {
        const reservationRef = doc(db, "temporaryReservations", participantId);
        await deleteDoc(reservationRef);
      } catch (error) {
        console.log("No había reserva temporal o ya fue eliminada");
      }

      // Recargar los datos
      await loadParticipants();
      alert("Pago confirmado y números marcados como ocupados correctamente");
    }
  } catch (error) {
    console.error("Error confirmando pago:", error);
    alert("Error al confirmar el pago");
  }
};

// Eliminar participante y liberar sus números
const deleteParticipant = async (participantId: string) => {
  if (!isAdminAuthenticated.value) return;

  if (confirm("¿Estás seguro de que quieres eliminar este participante y liberar sus números?")) {
    try {
      // Encontrar el participante para obtener sus números
      const participant = participants.value.find(p => p.id === participantId);
      if (!participant) {
        alert("Participante no encontrado");
        return;
      }

      // Liberar números ocupados
      if (participant.numbers && participant.numbers.length > 0) {
        // Filtrar los números del participante
        takenNumbers.value = takenNumbers.value.filter(num =>
          !participant.numbers.includes(num)
        );

        // Guardar en Firebase
        await saveTakenNumbers();
      }

      // Eliminar reserva temporal si existe
      try {
        const reservationRef = doc(db, "temporaryReservations", participantId);
        await deleteDoc(reservationRef);
      } catch (error) {
        console.log("No había reserva temporal o ya fue eliminada");
      }

      // Finalmente eliminar al participante
      await deleteDoc(doc(db, "participants", participantId));
      await loadParticipants();

      alert("Participante eliminado y números liberados correctamente");
    } catch (error) {
      console.error("Error eliminando participante:", error);
      alert("Error al eliminar el participante");
    }
  }
};

// Generar PDF de la boleta
const generateTicketPDF = async (participant: any) => {
  try {
    // Crear elemento HTML para la boleta con diseño profesional
    const ticketElement = document.createElement('div');
    ticketElement.style.width = '600px';
    ticketElement.style.padding = '30px';
    ticketElement.style.backgroundColor = '#ffffff';
    ticketElement.style.border = '2px solid #1A8ACC';
    ticketElement.style.borderRadius = '10px';
    ticketElement.style.fontFamily = "'Arial', sans-serif";
    ticketElement.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
    ticketElement.style.position = 'fixed';
    ticketElement.style.left = '-9999px'; // Mover fuera de pantalla

    // Formatear la fecha
    const date = new Date(participant.createdAt);
    const formattedDate = date.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Contenido HTML de la boleta
    ticketElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 24px; font-weight: bold; color: #1A8ACC; margin-bottom: 5px;">RIFA TELEVISOR</div>
        <div style="font-size: 14px; color: #666;">Boleta Virtual - N° ${participant.ticketNumber}</div>
        <div style="height: 2px; background: linear-gradient(to right, #1A8ACC, #9C27B0); margin: 15px 0;"></div>
      </div>
      
      <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
        <div style="flex: 1;">
          <div style="font-size: 12px; color: #666; margin-bottom: 3px;">FECHA DE REGISTRO</div>
          <div style="font-size: 14px; font-weight: bold;">${formattedDate}</div>
        </div>
        <div style="flex: 1; text-align: right;">
          <div style="font-size: 12px; color: #666; margin-bottom: 3px;">ESTADO</div>
          <div style="font-size: 14px; font-weight: bold; color: ${participant.paymentConfirmed ? '#28a745' : '#ffc107'}">
            ${participant.paymentConfirmed ? 'PAGO CONFIRMADO' : 'PENDIENTE DE PAGO'}
          </div>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <div style="display: flex; margin-bottom: 10px;">
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">PARTICIPANTE</div>
            <div style="font-size: 16px; font-weight: bold;">${participant.name}</div>
          </div>
          <div style="flex: 1;">
            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">TELÉFONO</div>
            <div style="font-size: 16px; font-weight: bold;">${participant.phone}</div>
          </div>
        </div>
      </div>
      
     <div style="margin-bottom: 20px;">
  <div style="font-size: 14px; font-weight: bold; margin-bottom: 10px; color: #1A8ACC;">NÚMEROS SELECCIONADOS</div>
  <div style="display: flex; flex-wrap: wrap; gap: 8px;">
    ${participant.numbers.map((num: number) => `
      <div style="
        width: 40px; 
        height: 40px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        background: ${takenNumbers.value.includes(num) ? '#1A8ACC' : '#f8f9fa'};
        color: ${takenNumbers.value.includes(num) ? 'white' : '#333'};
        border: 1px solid #ddd;
        border-radius: 4px;
        font-weight: bold;
        line-height: 1; /* Asegura que no haya espacio extra */
        ${takenNumbers.value.includes(num) && !participant.paymentConfirmed ? 'position: relative;' : ''}
      ">
        <span style="display: inline-block; margin: 0; padding: 0;">${num}</span>
        ${takenNumbers.value.includes(num) && !participant.paymentConfirmed ?
        '<div style="position: absolute; bottom: -5px; right: 0; left: 0; text-align: center; font-size: 10px; color: red;">⚠️</div>' : ''}
      </div>
    `).join('')}
  </div>
</div>
      
      <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">VALOR TOTAL</div>
            <div style="font-size: 24px; font-weight: bold; color: #1A8ACC;">
              ${participant.totalAmount.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
            </div>
          </div>
          ${participant.paymentConfirmed ? `
            <div style="text-align: right;">
              <div style="font-size: 12px; color: #666; margin-bottom: 3px;">FECHA DE CONFIRMACIÓN</div>
              <div style="font-size: 14px; font-weight: bold;">
                ${new Date(participant.confirmedAt).toLocaleDateString('es-CO')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
      
      <div style="border-top: 1px dashed #ddd; padding-top: 15px; margin-bottom: 20px;">
        <div style="font-size: 12px; color: #666; margin-bottom: 10px;">INSTRUCCIONES:</div>
        <ol style="font-size: 12px; color: #333; padding-left: 15px; margin: 0;">
          <li style="margin-bottom: 5px;">Esta boleta es tu comprobante de participación.</li>
          <li style="margin-bottom: 5px;">Los números se reservan solo después de confirmado el pago.</li>
          <li style="margin-bottom: 5px;">Presenta esta boleta para reclamar premios.</li>
        </ol>
      </div>
      
      <div style="text-align: center; font-size: 10px; color: #999; margin-top: 20px;">
        <div style="margin-bottom: 5px;">© ${new Date().getFullYear()} Rifa Televisor - Todos los derechos reservados</div>
        <div>Boleta generada automáticamente el ${new Date().toLocaleDateString('es-CO')}</div>
      </div>
      
      <div style="position: absolute; bottom: 10px; right: 10px; opacity: 0.1;">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="#1A8ACC">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z"/>
        </svg>
      </div>
    `;

    document.body.appendChild(ticketElement);

    // Convertir a canvas y luego a PDF
    const canvas = await html2canvas(ticketElement, {
      scale: 2, // Mayor resolución
      logging: false,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Centrar la boleta en el PDF
    const xPos = 0; // Margen izquierdo
    const yPos = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;

    pdf.addImage(imgData, 'PNG', xPos, yPos, pdfWidth, pdfHeight);
    pdf.save(`Boleta_Rifa_${participant.ticketNumber}.pdf`);

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

// Abrir modal para subir comprobante
const openReceiptModal = async () => {
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

  // Reservar números temporalmente
  try {
    isLoading.value = true;
    temporaryReservationId.value = generateTemporaryId();
    await reserveNumbersTemporarily(form.value.selectedNumbers, temporaryReservationId.value);
    showReceiptModal.value = true;
  } catch (error) {
    console.error("Error reservando números:", error);
    alert("No se pudieron reservar los números. Por favor intenta nuevamente.");
  } finally {
    isLoading.value = false;
  }
};

// Cerrar modal de comprobante
const closeReceiptModal = () => {
  showReceiptModal.value = false;
  receiptFile.value = null;
  receiptPreview.value = null;

  // Liberar reserva temporal si existe
  if (temporaryReservationId.value) {
    releaseExpiredReservation(temporaryReservationId.value);
    temporaryReservationId.value = null;
  }
};

// Manejar subida de comprobante
const handleReceiptUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    receiptFile.value = target.files[0];

    // Crear vista previa
    const reader = new FileReader();
    reader.onload = (e) => {
      receiptPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(receiptFile.value);
  }
};

// Ver comprobante
const viewReceipt = (participant: any) => {
  currentReceiptUrl.value = participant.receiptUrl;
  currentParticipant.value = participant;
  showReceiptViewer.value = true;
};

// Cerrar visor de comprobante
const closeReceiptViewer = () => {
  showReceiptViewer.value = false;
  currentReceiptUrl.value = '';
  currentParticipant.value = null;
};

// Enviar formulario con comprobante
const submitForm = async () => {
  if (!receiptFile.value) {
    alert("Por favor selecciona un comprobante de pago");
    return;
  }

  try {
    isLoading.value = true;

    // Subir comprobante a Firebase Storage
    const ticketNumber = generateTicketNumber();
    const receiptUrl = await uploadReceipt(receiptFile.value, ticketNumber);

    // Guardar participante con URL del comprobante
    await saveParticipant(receiptUrl);

    // ENVIAR CORREO ELECTRÓNICO CON LA INFORMACIÓN DEL COMPROBANTE
    await sendPaymentConfirmationEmail(
      form.value.name,
      form.value.phone,
      form.value.selectedNumbers,
      totalPrice.value,
      ticketNumber,
      receiptUrl // Asegúrate de pasar la URL del comprobante
    );

    // Marcar números como permanentemente ocupados
    await markNumbersAsTaken(form.value.selectedNumbers);

    // Liberar reserva temporal
    if (temporaryReservationId.value) {
      await releaseExpiredReservation(temporaryReservationId.value);
    }

    // Mostrar mensaje de confirmación
    alert(`¡Perfecto! Hemos recibido tu comprobante de pago. 
    
IMPORTANTE:
1. Tu boleta será enviada por WhatsApp una vez validemos el pago
2. Asegúrate de tener WhatsApp activo en el teléfono: ${form.value.phone}
3. Tus números han sido reservados exitosamente

Total pagado: $${totalPrice.value.toLocaleString('es-CO')} COP
Número de boleta: ${ticketNumber}`);

    // Cerrar modal y reiniciar formulario
    closeReceiptModal();
    resetForm();

  } catch (error) {
    console.error("Error al procesar el formulario:", error);
    alert("Ocurrió un error al procesar tu participación. Por favor intenta nuevamente.");
  } finally {
    isLoading.value = false;
  }
};

// Cargar números y participantes al iniciar
onMounted(() => {
  loadTakenNumbers();
  loadTemporaryReservations();
  const unsubscribe = subscribeToTemporaryReservations();

  // Limpiar suscripción cuando el componente se desmonte
  onUnmounted(() => {
    unsubscribe();
  });
});
</script>