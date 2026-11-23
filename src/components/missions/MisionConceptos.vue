<script setup>
import { computed, ref } from 'vue'
import { conceptosMision, definicionesMision } from '../../data/misiones'

const emit = defineEmits(['cerrar', 'completar'])
const conceptoActivo = ref(null)
const definicionActiva = ref(null)
const parejas = ref([])
const intentos = ref(0)
const mensaje = ref('Toca un concepto y después elige su definición.')
const error = ref(false)
const completada = computed(() => parejas.value.length === conceptosMision.length)

const elegirConcepto = id => {
  if (parejas.value.includes(id)) return
  conceptoActivo.value = id
  comprobarPareja()
}
const elegirDefinicion = id => {
  if (parejas.value.includes(id)) return
  definicionActiva.value = id
  comprobarPareja()
}
const comprobarPareja = () => {
  if (!conceptoActivo.value || !definicionActiva.value) return
  intentos.value++
  if (conceptoActivo.value === definicionActiva.value) {
    parejas.value.push(conceptoActivo.value)
    mensaje.value = `¡Pareja encontrada! ${parejas.value.length} de 4 conceptos unidos.`
    error.value = false
    if (parejas.value.length === conceptosMision.length) {
      mensaje.value = '¡Misión cumplida! Relacionaste los cuatro superpoderes.'
      emit('completar', intentos.value <= 4 ? 3 : intentos.value <= 7 ? 2 : 1)
    }
  } else {
    mensaje.value = 'Casi. Piensa qué describe cada palabra y vuelve a intentarlo.'
    error.value = true
    if ('vibrate' in navigator) navigator.vibrate?.(35)
  }
  window.setTimeout(() => {
    conceptoActivo.value = null
    definicionActiva.value = null
    error.value = false
  }, 650)
}
</script>

<template>
  <div class="contenido">
    <header class="encabezado">
      <span class="chip">RETO DE CONEXIONES</span>
      <h3>Une los conceptos</h3>
      <p>Toca una tarjeta de cada columna y crea las parejas correctas.</p>
    </header>
    <div class="marcador" aria-live="polite">
      <span>✦ {{ parejas.length }}/4 parejas</span>
      <span class="puntos"><i v-for="p in conceptosMision" :key="p.id" :class="{hecho:parejas.includes(p.id)}"></i></span>
    </div>
    <div class="columnas">
      <div class="columna">
        <h4>Superpoderes</h4>
        <button v-for="p in conceptosMision" :key="p.id" type="button" class="tarjeta concepto" :class="{seleccionada:conceptoActivo===p.id, acertada:parejas.includes(p.id), error:error&&conceptoActivo===p.id}" :disabled="parejas.includes(p.id)" :aria-label="p.nombre" :aria-pressed="conceptoActivo===p.id" @click="elegirConcepto(p.id)">
          <span class="icono">{{ p.icono }}</span><span>{{ p.nombre }}</span><span v-if="parejas.includes(p.id)" class="check">✓</span>
        </button>
      </div>
      <div class="conector" aria-hidden="true">⟷</div>
      <div class="columna">
        <h4>¿Qué significa?</h4>
        <button v-for="p in definicionesMision" :key="p.id" type="button" class="tarjeta definicion" :class="{seleccionada:definicionActiva===p.id, acertada:parejas.includes(p.id), error:error&&definicionActiva===p.id}" :disabled="parejas.includes(p.id)" :aria-label="p.texto" :aria-pressed="definicionActiva===p.id" @click="elegirDefinicion(p.id)">
          {{ p.texto }}<span v-if="parejas.includes(p.id)" class="check">✓</span>
        </button>
      </div>
    </div>
    <p class="feedback" :class="{incorrecto:error}" aria-live="polite">{{ mensaje }}</p>
    <button class="cerrar" type="button" @click="emit('cerrar')">{{ completada ? 'Continuar' : 'Salir de la misión' }}</button>
  </div>
</template>

<style scoped>
.contenido{display:grid;gap:.85rem}
.encabezado{text-align:center}.encabezado h3{margin:.4rem 0;font-size:1.8rem}.encabezado p{font-size:.9rem;opacity:.8}
.chip{display:inline-block;padding:.22rem .7rem;border:1px solid rgba(255,210,63,.42);border-radius:999px;color:#ffe58a;font-size:.67rem;letter-spacing:.13em}
.marcador{display:flex;align-items:center;justify-content:space-between;font-size:.78rem;color:#c9dcff}
.puntos{display:flex;gap:.35rem}.puntos i{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.2)}.puntos i.hecho{background:var(--menta);box-shadow:0 0 9px var(--menta)}
.columnas{display:grid;grid-template-columns:1fr 30px 1fr;gap:.45rem;align-items:center}.columna{display:grid;gap:.45rem}.columna h4{margin-bottom:.1rem;color:#c9dcff;font-size:.83rem}
.conector{text-align:center;color:var(--menta);font-size:1.4rem}
.tarjeta{position:relative;min-height:62px;display:flex;align-items:center;gap:.5rem;padding:.6rem .65rem;border:1px solid rgba(255,255,255,.2);border-radius:15px;color:#f4f7ff;background:linear-gradient(140deg,rgba(255,255,255,.12),rgba(255,255,255,.045));box-shadow:inset 0 1px rgba(255,255,255,.16),0 5px 12px rgba(0,0,0,.13);font:inherit;font-size:.77rem;line-height:1.25;text-align:left;cursor:pointer;transition:transform .2s,border-color .2s,background .2s}
.tarjeta:hover:not(:disabled){transform:translateY(-2px);border-color:rgba(124,230,200,.65)}
.tarjeta.seleccionada{border-color:var(--sol);background:rgba(255,210,63,.15);box-shadow:0 0 14px rgba(255,210,63,.18)}
.tarjeta.acertada{border-color:rgba(46,230,166,.7);background:linear-gradient(135deg,rgba(46,230,166,.24),rgba(46,230,166,.09));color:#caffeb}
.tarjeta.error{animation:reboteError .18s ease-in-out 2;border-color:var(--rosa)}
.tarjeta:disabled{cursor:default}
.icono{font-size:1.1rem}.check{margin-left:auto;color:#80ffd2;font-weight:900}
.feedback{min-height:2.4rem;padding:.65rem .8rem;border-left:3px solid var(--menta);border-radius:0 12px 12px 0;background:rgba(46,230,166,.08);font-size:.85rem}.feedback.incorrecto{border-color:var(--rosa);background:rgba(255,95,162,.09)}
.cerrar{justify-self:center;border:0;background:transparent;color:#d4dcf0;text-decoration:underline;text-underline-offset:3px;font:inherit;font-size:.78rem;cursor:pointer}
@keyframes reboteError{50%{transform:translateX(4px)}}
@media(max-width:500px){.columnas{grid-template-columns:1fr}.conector{transform:rotate(90deg);height:15px}.tarjeta{min-height:50px}}
@media(prefers-reduced-motion:reduce){.tarjeta,.tarjeta.error{animation:none!important;transition:none!important}}
</style>
