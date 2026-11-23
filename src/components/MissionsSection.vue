<script setup>
import { computed, ref } from 'vue'
import { useProgreso } from '../composables/useProgreso'
import MisionConceptos from './missions/MisionConceptos.vue'
import MisionPasos from './missions/MisionPasos.vue'
import MisionReto from './missions/MisionReto.vue'
import MisionAlgoritmo from './missions/MisionAlgoritmo.vue'
const { progreso, completarMision } = useProgreso()
const activa = ref(null)
const misiones = [
  { t: 'Une los conceptos', h: 'Relaciona las ideas clave', src: '/media/mision-conceptos.jpg', alt: 'Estudiantes colaborando alrededor de una mesa con computadoras', c: MisionConceptos },
  { t: 'Ordena los pasos', h: 'Organiza las instrucciones', src: '/media/mision-pasos.jpg', alt: 'Computadora portátil iluminada en un entorno oscuro', c: MisionPasos },
  { t: 'Resuelve el reto', h: 'Analiza una situación en equipo', src: '/media/mision-reto.jpg', alt: 'Compañeros analizando código juntos en una computadora', c: MisionReto },
  { t: 'Crea tu algoritmo', h: 'Diseña una secuencia de pasos', src: '/media/mision-algoritmo.jpg', alt: 'Computadora retro y dispositivos electrónicos', c: MisionAlgoritmo }
]
const completadas = computed(() => progreso.misiones.filter(Boolean).length)
const completar = estrellas => { if (activa.value !== null) completarMision(activa.value, estrellas) }
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Misiones</h2>
      <p class="lead">Practica los conceptos con estos retos.</p>
    </div>
    <div class="visual-seccion">
      <ul>
        <li v-for="(m, n) in misiones" :key="m.t">
          <button class="mision glass" :class="{ completada:progreso.misiones[n] }" type="button" :aria-label="`${m.t}${progreso.misiones[n] ? `, completada con ${progreso.estrellasMisiones[n]} estrellas` : ''}`" @click="activa=n" v-ripple>
            <img class="mision-foto" :src="m.src" :alt="m.alt" loading="lazy" decoding="async" />
            <span><strong>{{ m.t }}</strong><small>{{ m.h }}</small></span>
            <em>{{ progreso.misiones[n] ? '★' : '☆' }}</em>
          </button>
        </li>
      </ul>
      <p class="marca">Retos · {{ completadas }} de 4 completadas</p>
      <p class="revision">Borrador pedagógico · para revisión docente</p>
    </div>
    <div v-if="activa!==null" class="modal" role="dialog" aria-modal="true" aria-label="Actividad" @click.self="activa=null">
      <div class="panel glass"><button class="cerrar" type="button" aria-label="Cerrar misión" @click="activa=null">×</button><component :is="misiones[activa].c" @cerrar="activa=null" @completar="completar" /></div>
    </div>
  </section>
</template>
<style scoped>
ul{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem;max-width:820px;margin:0 auto}
.mision{font:inherit;color:inherit;width:100%;display:flex;align-items:center;gap:1rem;text-align:left;padding:.8rem;overflow:hidden}
.mision{cursor:pointer;transition:transform .25s var(--rebote),border-color .25s,box-shadow .25s}
.mision:hover{transform:translateY(-4px);border-color:rgba(124,230,200,.55)}
.mision.completada{border-color:rgba(255,210,63,.58);box-shadow:inset 0 1px 3px rgba(255,255,255,.55),0 0 20px rgba(255,210,63,.14),0 18px 40px rgba(0,0,0,.35)}
.mision-foto{width:88px;height:88px;flex:none;border-radius:20px;object-fit:cover}
.mision span{display:grid}.mision small{opacity:.75}
.mision em{margin-left:auto;font-style:normal;font-size:1.8rem;color:var(--sol)}
.mision.completada em{animation:estrella .55s var(--rebote)}
.marca{text-align:center;margin-top:1.5rem;font-size:1.3rem;font-weight:700}
.revision{text-align:center;margin-top:.25rem;font-size:.72rem;letter-spacing:.04em;color:#bed0ff;opacity:.72}
.modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:1rem;background:rgba(3,7,24,.72)}.panel{position:relative;width:min(620px,100%);max-height:85vh;overflow:auto;padding:2rem}.cerrar{position:absolute;right:1rem;top:.8rem;border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:50%;width:42px;height:42px;font-size:1.7rem;cursor:pointer}
@media(max-width:640px){ul{grid-template-columns:1fr}}
@keyframes estrella{from{transform:scale(.3) rotate(-35deg)}to{transform:scale(1) rotate(0)}}
@media(prefers-reduced-motion:reduce){.mision,.mision em{transition:none!important;animation:none!important}}
</style>
