<script setup>
import { computed, ref } from 'vue'
import { procesosOrden } from '../../data/misiones'

const emit = defineEmits(['cerrar', 'completar'])
const proceso = ref(0)
const orden = ref([...procesosOrden[0].mezcla])
const intentos = ref(0)
const intentosTotal = ref(0)
const incorrectos = ref([])
const arrastrado = ref(null)
const mensaje = ref('Reordena los pasos. Usa las flechas o arrastra una tarjeta.')
const terminado = ref(false)
const malPosicionados = computed(() => incorrectos.value)
const pistaDisponible = computed(() => intentos.value >= 2)
const solucionDisponible = computed(() => intentos.value >= 3)

const intercambiar = (desde, hasta) => {
  if (desde === hasta || desde === null || hasta < 0 || hasta >= orden.value.length) return
  const copia = [...orden.value]
  ;[copia[desde], copia[hasta]] = [copia[hasta], copia[desde]]
  orden.value = copia
  incorrectos.value = []
}
const mover = (indice, cambio) => intercambiar(indice, indice + cambio)
const validar = () => {
  intentos.value++
  intentosTotal.value++
  incorrectos.value = orden.value.map((paso, i) => paso === procesosOrden[proceso.value].pasos[i] ? -1 : i).filter(i => i >= 0)
  if (!incorrectos.value.length) {
    if (proceso.value === 0) {
      proceso.value = 1
      orden.value = [...procesosOrden[1].mezcla]
      intentos.value = 0
      mensaje.value = '¡Bien ordenado! Ahora resuelve otro proceso cotidiano.'
    } else {
      terminado.value = true
      mensaje.value = '¡Dos procesos en orden! Usaste una secuencia clara de instrucciones.'
      emit('completar', intentosTotal.value <= 2 ? 3 : intentosTotal.value <= 5 ? 2 : 1)
    }
  } else {
    mensaje.value = `¡Vas avanzando! ${incorrectos.value.length} ${incorrectos.value.length === 1 ? 'posición necesita' : 'posiciones necesitan'} revisión. Prueba otra vez.`
    if (pistaDisponible.value) mensaje.value += ' Pista: piensa qué acción debe ocurrir primero y cuál solo puede ocurrir al final.'
    if ('vibrate' in navigator) navigator.vibrate?.(30)
  }
}
const verSolucion = () => {
  orden.value = [...procesosOrden[proceso.value].pasos]
  incorrectos.value = []
  mensaje.value = 'Aquí está una secuencia posible. Revísala y pulsa «Comprobar» para continuar.'
}
const alSoltar = indice => {
  if (arrastrado.value !== null) intercambiar(arrastrado.value, indice)
  arrastrado.value = null
}
</script>

<template>
  <div class="contenido">
    <header class="encabezado">
      <span class="chip">SECUENCIA EN MOVIMIENTO</span>
      <h3>Ordena los pasos</h3>
      <p>Las instrucciones correctas también necesitan el orden correcto.</p>
    </header>
    <div class="progreso">
      <span v-for="(p,i) in procesosOrden" :key="p.titulo" :class="{actual:proceso===i,hecho:proceso>i}"><i>{{ proceso>i?'✓':i+1 }}</i>{{ p.titulo }}</span>
    </div>
    <section class="escenario">
      <div class="escenario-icono" aria-hidden="true">{{ proceso===0?'🥪':'🚦' }}</div>
      <div><small>RETO {{ proceso+1 }} DE 2</small><h4>{{ procesosOrden[proceso].titulo }}</h4><p>Arrastra las tarjetas o usa ↑ y ↓ para ordenarlas.</p></div>
    </section>
    <ol class="lista-pasos" aria-label="Ordena las instrucciones">
      <li v-for="(paso,i) in orden" :key="paso" draggable="true" :class="{mal:malPosicionados.includes(i),bien:terminado}" @dragstart="arrastrado=i" @dragover.prevent @drop.prevent="alSoltar(i)">
        <span class="numero">{{ i+1 }}</span>
        <span class="texto-paso">{{ paso }}</span>
        <span class="mover">
          <button type="button" :disabled="i===0" :aria-label="`Subir ${paso}`" @click="mover(i,-1)">↑</button>
          <button type="button" :disabled="i===orden.length-1" :aria-label="`Bajar ${paso}`" @click="mover(i,1)">↓</button>
        </span>
      </li>
    </ol>
    <p class="feedback" aria-live="polite">{{ mensaje }}</p>
    <div class="acciones">
      <button class="gbtn suave" type="button" @click="emit('cerrar')">{{ terminado?'Continuar':'Salir de la misión' }}</button>
      <button v-if="solucionDisponible&&!terminado" class="gbtn suave" type="button" @click="verSolucion">Ver solución</button>
      <button v-if="!terminado" class="gbtn" type="button" @click="validar">Comprobar orden</button>
    </div>
  </div>
</template>

<style scoped>
.contenido{display:grid;gap:.8rem}
.encabezado{text-align:center}.encabezado h3{margin:.4rem 0;font-size:1.8rem}.encabezado p{font-size:.86rem;opacity:.8}
.chip{display:inline-block;padding:.22rem .7rem;border:1px solid rgba(79,123,255,.55);border-radius:999px;color:#bed0ff;font-size:.67rem;letter-spacing:.13em}
.progreso{display:flex;justify-content:center;gap:.5rem;flex-wrap:wrap}.progreso span{display:flex;align-items:center;gap:.35rem;padding:.3rem .55rem;border-radius:999px;background:rgba(255,255,255,.08);font-size:.68rem;opacity:.65}.progreso i{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:rgba(255,255,255,.15);font-style:normal}.progreso .actual{opacity:1;background:rgba(79,123,255,.23);color:#e2eaff}.progreso .actual i{background:var(--azul)}.progreso .hecho{opacity:1;color:#a8ffe5}.progreso .hecho i{background:var(--menta);color:#082c2a}
.escenario{display:flex;align-items:center;gap:.8rem;padding:.85rem 1rem;border:1px solid rgba(255,210,63,.22);border-radius:18px;background:linear-gradient(120deg,rgba(255,210,63,.12),rgba(255,138,31,.06))}.escenario-icono{display:grid;place-items:center;flex:none;width:52px;height:52px;border-radius:16px;background:rgba(255,255,255,.1);font-size:1.7rem;box-shadow:inset 0 1px rgba(255,255,255,.2)}.escenario small{color:#ffe28c;font-size:.63rem;letter-spacing:.13em}.escenario h4{margin:.1rem 0;font-size:1rem}.escenario p{font-size:.74rem;opacity:.75}
.lista-pasos{display:grid;gap:.45rem;list-style:none;padding:0;counter-reset:none}
.lista-pasos li{display:flex;align-items:center;gap:.65rem;min-height:46px;padding:.42rem .55rem;border:1px solid rgba(255,255,255,.14);border-radius:14px;background:linear-gradient(110deg,rgba(255,255,255,.12),rgba(255,255,255,.045));box-shadow:inset 0 1px rgba(255,255,255,.1),0 4px 10px rgba(0,0,0,.12);cursor:grab;transition:transform .18s,border-color .18s,background .18s}
.lista-pasos li:active{cursor:grabbing}.lista-pasos li:hover{border-color:rgba(124,230,200,.42);transform:translateX(2px)}
.lista-pasos li.mal{border-color:rgba(255,95,162,.56);background:rgba(255,95,162,.09)}.lista-pasos li.bien{border-color:rgba(46,230,166,.55);background:rgba(46,230,166,.08)}
.numero{display:grid;place-items:center;width:27px;height:27px;flex:none;border-radius:9px;background:linear-gradient(145deg,#4f7bff,#3343a3);box-shadow:inset 0 1px rgba(255,255,255,.3);font-size:.76rem;font-weight:700}
.texto-paso{flex:1;font-size:.84rem}.mover{display:flex;gap:.25rem}.mover button{width:32px;height:32px;border:1px solid rgba(255,255,255,.18);border-radius:9px;background:rgba(255,255,255,.1);color:white;font-size:1rem;cursor:pointer}.mover button:disabled{opacity:.3;cursor:default}
.feedback{min-height:2.5rem;padding:.65rem .8rem;border-left:3px solid var(--menta);border-radius:0 12px 12px 0;background:rgba(46,230,166,.08);font-size:.84rem}
.acciones{display:flex;justify-content:center;gap:.6rem;flex-wrap:wrap}.acciones .gbtn{padding:.55rem .85rem;font-size:.82rem}
@media(max-width:440px){.escenario{padding:.7rem}.escenario-icono{width:42px;height:42px}.texto-paso{font-size:.77rem}.mover button{width:29px;height:29px}}
@media(prefers-reduced-motion:reduce){.lista-pasos li{transition:none}}
</style>
