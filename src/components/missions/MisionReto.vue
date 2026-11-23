<script setup>
import { computed, ref } from 'vue'
import { decisionesReto } from '../../data/misiones'

const emit = defineEmits(['cerrar', 'completar'])
const paso = ref(0)
const puntos = ref(0)
const seleccion = ref(null)
const respondida = ref(false)
const final = ref(false)
const enviado = ref(false)
const mensajeFinal = computed(() => puntos.value >= 3
  ? `¡Reto resuelto! Aplicaste ${puntos.value} de los 4 superpoderes para mejorar la fila.`
  : `Con ${puntos.value} de 4 decisiones, todavía no hay una solución sólida. Vuelve a analizar el reto.`)

const elegir = opcion => {
  if (respondida.value) return
  seleccion.value = opcion
  respondida.value = true
  if (opcion.bien) puntos.value++
}
const siguiente = () => {
  if (paso.value < decisionesReto.length - 1) {
    paso.value++
    seleccion.value = null
    respondida.value = false
  } else final.value = true
}
const reintentar = () => {
  paso.value = 0
  puntos.value = 0
  seleccion.value = null
  respondida.value = false
  final.value = false
  enviado.value = false
}
const guardar = () => {
  if (puntos.value >= 3 && !enviado.value) {
    enviado.value = true
    emit('completar', puntos.value === 4 ? 3 : 2)
  }
}
</script>

<template>
  <div class="contenido">
    <header class="encabezado">
      <span class="chip">HISTORIA INTERACTIVA</span>
      <h3>La fila de la tienda</h3>
      <p>Ayuda al equipo a encontrar una solución usando los cuatro superpoderes.</p>
    </header>
    <div class="escena" aria-hidden="true">
      <div class="tienda"><span>TIENDA</span><i></i><i></i><i></i></div>
      <div class="fila-personas"><b>●</b><b>●</b><b>●</b><b>●</b><b>●</b><b>●</b></div>
      <div class="caja">▤</div>
    </div>
    <div class="barra-progreso" role="progressbar" :aria-valuenow="final?4:paso+1" aria-valuemin="0" aria-valuemax="4" :aria-label="`Decisión ${final?4:paso+1} de 4`">
      <span :style="{width:`${(final?4:paso+1)*25}%`}"></span>
    </div>
    <template v-if="!final">
      <div class="etiqueta-pilar"><span>{{ decisionesReto[paso].pilar }}</span><span>{{ paso+1 }} / 4</span></div>
      <section class="pregunta">
        <h4>{{ decisionesReto[paso].pregunta }}</h4>
        <div class="opciones">
          <button v-for="o in decisionesReto[paso].opciones" :key="o.texto" type="button" class="opcion glass" :disabled="respondida" :class="{correcta:respondida&&o.bien,incorrecta:respondida&&seleccion===o&&!o.bien}" @click="elegir(o)">
            <span class="bullet">{{ respondida&&o.bien?'✓':'›' }}</span>{{ o.texto }}
          </button>
        </div>
        <p v-if="respondida" class="explicacion" :class="{positiva:seleccion.bien}" aria-live="polite">
          <b>{{ seleccion.bien?'¡Bien pensado!':'Una pista para la próxima:' }}</b> {{ seleccion.razon }}
        </p>
      </section>
      <button v-if="respondida" class="gbtn siguiente" type="button" @click="siguiente">{{ paso<3?'Siguiente decisión':'Ver resultado' }} →</button>
    </template>
    <section v-else class="resultado" aria-live="polite">
      <span class="medalla">{{ puntos>=3?'🏆':'🧭' }}</span>
      <h4>{{ mensajeFinal }}</h4>
      <p>{{ puntos>=3?'¡Tus decisiones pueden hacer que la fila avance mejor!':'Repasa las pistas y prueba otra estrategia. Equivocarse también es parte de resolver.' }}</p>
      <button v-if="puntos>=3&&!enviado" class="gbtn" type="button" @click="guardar">Guardar estrellas</button>
      <button v-if="puntos<3" class="gbtn" type="button" @click="reintentar">Intentar de nuevo</button>
      <button class="salir" type="button" @click="emit('cerrar')">{{ enviado?'Continuar':'Salir de la misión' }}</button>
    </section>
  </div>
</template>

<style scoped>
.contenido{display:grid;gap:.85rem}
.encabezado{text-align:center}.encabezado h3{margin:.4rem 0;font-size:1.75rem}.encabezado p{font-size:.84rem;opacity:.8}
.chip{display:inline-block;padding:.22rem .7rem;border:1px solid rgba(255,95,162,.45);border-radius:999px;color:#ffc4dc;font-size:.67rem;letter-spacing:.13em}
.escena{position:relative;height:95px;overflow:hidden;border:1px solid rgba(255,255,255,.15);border-radius:18px;background:linear-gradient(180deg,rgba(79,123,255,.25),rgba(7,11,36,.65));box-shadow:inset 0 1px rgba(255,255,255,.12)}
.tienda{position:absolute;left:8%;top:12px;width:42%;height:43px;display:grid;grid-template-columns:repeat(3,1fr);align-items:end;padding:.25rem .4rem;border:1px solid rgba(255,210,63,.45);border-radius:9px 9px 2px 2px;background:linear-gradient(145deg,#9459c9,#5148a1);box-shadow:0 6px 0 rgba(0,0,0,.2)}
.tienda span{position:absolute;left:50%;top:-9px;transform:translateX(-50%);padding:0 .4rem;border-radius:4px;background:var(--nar);font-size:.52rem;font-weight:800;letter-spacing:.08em}
.tienda i{height:17px;margin:0 2px;border-radius:3px 3px 0 0;background:linear-gradient(90deg,#7ce6c8,#315992);box-shadow:inset 0 1px rgba(255,255,255,.45)}
.fila-personas{position:absolute;left:8%;right:15%;bottom:10px;display:flex;justify-content:space-around;color:#ffc2dc;text-shadow:0 3px 0 #863b73,0 6px 5px rgba(0,0,0,.45);font-size:1.25rem}
.fila-personas b:nth-child(even){transform:translateY(-3px);color:#92d9ff}
.caja{position:absolute;right:9%;bottom:12px;display:grid;place-items:center;width:34px;height:32px;border-radius:7px;background:linear-gradient(145deg,#ffbd54,#e87925);box-shadow:0 5px 0 #984b20;color:#543018;font-size:1.15rem}
.barra-progreso{height:8px;overflow:hidden;border-radius:99px;background:rgba(255,255,255,.12)}.barra-progreso span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--rosa),var(--nar),var(--sol));box-shadow:0 0 10px rgba(255,138,31,.45);transition:width .3s ease}
.etiqueta-pilar{display:flex;justify-content:space-between;color:#ffd2e4;font-size:.74rem}.pregunta h4{margin:.1rem 0 .7rem;font-size:1.05rem;line-height:1.35}
.opciones{display:grid;gap:.55rem}.opcion{display:flex;align-items:flex-start;gap:.55rem;width:100%;padding:.7rem .8rem;border-radius:15px;color:inherit;text-align:left;font:inherit;font-size:.82rem;cursor:pointer;transition:transform .18s,border-color .18s}.opcion:hover:not(:disabled){transform:translateY(-2px);border-color:rgba(124,230,200,.55)}.opcion:disabled{opacity:1;cursor:default}
.bullet{display:grid;place-items:center;width:22px;height:22px;flex:none;border-radius:50%;background:rgba(79,123,255,.28);color:#d9e3ff;font-weight:800}
.opcion.correcta{border-color:rgba(46,230,166,.62);background:linear-gradient(120deg,rgba(46,230,166,.2),rgba(255,255,255,.05))}.opcion.correcta .bullet{background:var(--menta);color:#082c2a}
.opcion.incorrecta{border-color:rgba(255,95,162,.55);background:rgba(255,95,162,.1)}
.explicacion{padding:.7rem .8rem;border-left:3px solid var(--rosa);border-radius:0 12px 12px 0;background:rgba(255,95,162,.08);font-size:.82rem}.explicacion.positiva{border-color:var(--menta);background:rgba(46,230,166,.08)}
.siguiente{justify-self:end;padding:.6rem 1rem;font-size:.84rem}
.resultado{display:grid;justify-items:center;gap:.6rem;padding:.7rem;text-align:center}.medalla{font-size:2.5rem;filter:drop-shadow(0 5px 8px rgba(255,210,63,.3))}.resultado h4{font-size:1.15rem}.resultado p{max-width:45ch;opacity:.82;font-size:.83rem}.salir{border:0;background:transparent;color:#d4dcf0;text-decoration:underline;text-underline-offset:3px;font:inherit;font-size:.78rem;cursor:pointer}
@media(prefers-reduced-motion:reduce){.barra-progreso span,.opcion{transition:none}}
</style>
