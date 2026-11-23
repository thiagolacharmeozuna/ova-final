<script setup>
import { computed } from 'vue'
import { useProgreso } from '../composables/useProgreso'
defineEmits(['ir'])
const { progreso } = useProgreso()
const misiones= computed(()=>progreso.misiones.filter(Boolean).length)
const conceptos=computed(()=>progreso.conceptos.length)
const r = [
  { n: 'Code.org', u: 'https://code.org/', src: '/media/programacion.jpg', alt: 'Código fuente en una pantalla', d: 'Cursos guiados y actividades para aprender a programar jugando.', nivel: 'Básica · 8 a 14 años' },
  { n: 'Scratch', u: 'https://scratch.mit.edu/', src: '/media/computacion-colaborativa.jpg', alt: 'Persona usando una computadora', d: 'Crea historias, juegos y animaciones mediante bloques visuales.', nivel: 'Media básica · 9 a 16 años' },
  { n: 'CS Unplugged', u: 'https://csunplugged.org/en/', src: '/media/equipo-pensando.jpg', alt: 'Equipo colaborando en un reto', d: 'Aprende ideas de informática con juegos y retos sin computadora.', nivel: 'Básica y media · 7 a 15 años' }
]
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Sigue explorando</h2>
      <p class="lead">Pídele a tu profe que elija la actividad según tu edad y tu wifi.</p>
      <p class="revision">Borrador pedagógico · para revisión docente</p>
    </div>
    <div class="visual-seccion">
      <div class="fila">
        <a v-for="x in r" :key="x.n" :href="x.u" target="_blank" rel="noopener" class="glass enlace" v-ripple>
          <img :src="x.src" :alt="x.alt" loading="lazy" decoding="async" />
          <span><strong>{{ x.n }}</strong><small>{{ x.d }}</small><em>{{ x.nivel }}</em></span>
        </a>
      </div>
      <div class="cierre glass">
        <h3>Tu recorrido NOX</h3>
        <p>{{ conceptos }} de 4 conceptos vistos · {{ misiones }} de 4 misiones completadas · {{ progreso.quizRealizado ? progreso.puntaje+'/10 en la evaluación' : 'evaluación pendiente' }}</p>
        <button class="gbtn" type="button" v-ripple @click="$emit('ir',0)">Volver al inicio</button>
      </div>
    </div>
  </section>
</template>
<style scoped>
.fila{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;align-items:stretch}
.enlace{display:flex;align-items:center;gap:.9rem;padding:.7rem;color:#fff;text-decoration:none;font-weight:600;overflow:hidden;transition:transform .3s var(--rebote)}
.enlace:hover{transform:translateY(-6px) scale(1.04)}
.enlace img{width:80px;height:64px;flex:none;border-radius:20px;object-fit:cover}
.enlace span{display:grid}.enlace small{font-size:.78rem;font-weight:400;opacity:.82}.enlace em{font-size:.72rem;font-style:normal;color:var(--sol)}
.cierre{margin-top:1.2rem;padding:1.2rem;text-align:center;display:grid;justify-items:center;gap:.7rem}
.revision{margin-top:.4rem;font-size:.72rem;letter-spacing:.04em;color:#bed0ff;opacity:.72}
@media(max-width:560px){.fila{grid-template-columns:1fr}}
</style>
