<script setup>
import { onMounted, ref } from 'vue'
import VideoSlot from './VideoSlot.vue'
import PhotoCard from './PhotoCard.vue'
defineEmits(['ir'])
const paso = ref(0)
const videoDisponible = ref(false)
const pasos = [
  { t: 'El problema', d: 'Queremos organizar una fiesta sorpresa y lograr que la celebración salga bien sin olvidar nada importante.' },
  { t: 'Descomponer', d: 'Dividimos el trabajo en partes: invitados, comida, decoración y la sorpresa.' },
  { t: 'Encontrar patrones', d: 'Revisamos la lista del cumpleaños del año pasado y reutilizamos lo que funcionó.' },
  { t: 'Abstraer', d: 'Nos quedamos con los datos necesarios: fecha, hora, lugar y presupuesto.' },
  { t: 'Crear el algoritmo', d: '1. Elegir fecha y lugar. 2. Invitar. 3. Preparar comida y decoración. 4. Organizar la sorpresa.' }
]
onMounted(async () => {
  try {
    const respuesta = await fetch('/media/ejemplo.mp4', { method: 'HEAD' })
    videoDisponible.value = respuesta.ok
  } catch {
    videoDisponible.value = false
  }
})
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Mira cómo funciona</h2>
      <p class="lead">Observa cómo se organiza un problema paso a paso.</p>
      <p class="revision">Borrador pedagógico · para revisión docente</p>
    </div>
    <div class="visual-seccion">
      <div class="fila">
        <PhotoCard src="/media/ejemplo-equipo.jpg" alt="Equipo colaborando para analizar un problema de programación" caption="Resolver en equipo" />
        <div class="glass tv">
          <VideoSlot v-if="videoDisponible" src="/media/ejemplo.mp4" poster="/media/ejemplo-analisis.jpg" title="Ejemplo guiado: organizar una fiesta sorpresa" />
          <div v-else class="stepper">
            <span class="etiqueta">EJEMPLO GUIADO · {{ String(paso+1).padStart(2,'0') }}/05</span>
            <h3 aria-live="polite">{{ pasos[paso].t }}</h3>
            <p>{{ pasos[paso].d }}</p>
            <div class="barra" role="progressbar" :aria-valuenow="paso+1" aria-valuemin="1" :aria-valuemax="pasos.length" :aria-label="`Paso ${paso+1} de ${pasos.length}`"><span :style="{width:`${(paso+1)/pasos.length*100}%`}"></span></div>
            <div class="pasos" aria-label="Pasos del ejemplo"><span v-for="(x,i) in pasos" :key="i" :class="{on:i===paso,hecho:i<paso}">{{ i<paso?'✓':i+1 }}</span></div>
            <div class="controles"><button class="gbtn suave" type="button" :disabled="paso===0" @click="paso--">Anterior</button><button class="gbtn" type="button" :disabled="paso===pasos.length-1" @click="paso++">Siguiente</button></div>
          </div>
        </div>
        <PhotoCard src="/media/ejemplo-analisis.jpg" alt="Equipo de trabajo revisando información en sus computadoras" caption="Analizar y probar" />
      </div>
      <button class="gbtn ir-misiones" type="button" v-ripple @click="$emit('ir', 3)">Ir a las actividades</button>
    </div>
  </section>
</template>
<style scoped>
.fila{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,2.2fr) minmax(0,.8fr);gap:.75rem;align-items:center;justify-items:center;width:100%;margin:0 auto}
.tv{padding:12px;width:100%}
.stepper{min-height:290px;padding:1.35rem;display:grid;align-content:center;gap:1rem;text-align:center;border-radius:22px;background:radial-gradient(circle at 20% 5%,rgba(124,230,200,.22),transparent 36%),linear-gradient(135deg,#182a68,#6942a3)}
.etiqueta{color:#c3ffe9;font-size:.67rem;font-weight:700;letter-spacing:.14em}.barra{height:8px;border-radius:99px;background:rgba(255,255,255,.17);overflow:hidden}.barra span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--menta),var(--sol));transition:width .3s}.pasos{display:flex;justify-content:center;gap:.5rem}.pasos span{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:rgba(255,255,255,.2)}.pasos .on{background:var(--sol);color:#17205c;box-shadow:0 0 15px rgba(255,210,63,.38)}.pasos .hecho{background:var(--menta);color:#092b35}
.controles{display:flex;justify-content:center;gap:.7rem}.ir-misiones{display:block;margin:1.5rem auto 0}
.revision{margin-top:.4rem;font-size:.72rem;letter-spacing:.04em;color:#bed0ff;opacity:.72}
@media(max-width:900px){.fila{grid-template-columns:1fr;max-width:620px}.fila>:nth-child(2){order:-1}}
</style>
