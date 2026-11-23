<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['cerrar', 'completar'])
const nivel = ref(1)
const comandos = ref([])
const robot = ref({ fila: 4, columna: 0, rumbo: 0 })
const ejecutando = ref(false)
const intentos = ref(0)
const mensaje = ref('')
const repeticiones = ref(4)
const meta = computed(() => nivel.value === 1 ? { fila: 1, columna: 4 } : { fila: 0, columna: 4 })
const obstaculos = computed(() => nivel.value === 1
  ? ['3-1', '2-3', '3-4']
  : ['3-1', '2-1', '1-1', '1-3', '2-3'])
const instrucciones = computed(() => comandos.value.flatMap(b => b.tipo === 'repetir'
  ? Array.from({ length: b.cantidad }, () => b.accion)
  : [b.tipo]))
const enMeta = computed(() => robot.value.fila === meta.value.fila && robot.value.columna === meta.value.columna)
const direccion = computed(() => ['→', '↓', '←', '↑'][robot.value.rumbo])
const reducirMovimiento = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const pausa = ms => new Promise(resolve => window.setTimeout(resolve, reducirMovimiento() ? 30 : ms))

const cambiarNivel = numero => {
  if (ejecutando.value) return
  nivel.value = numero
  reiniciar()
}
const agregar = tipo => {
  if (ejecutando.value) return
  comandos.value.push(tipo === 'repetir'
    ? { tipo, accion: 'avanzar', cantidad: repeticiones.value }
    : { tipo })
  mensaje.value = ''
}
const quitar = indice => comandos.value.splice(indice, 1)
const reiniciar = () => {
  if (ejecutando.value) return
  robot.value = { fila: 4, columna: 0, rumbo: 0 }
  comandos.value = []
  mensaje.value = ''
}
const pista = () => {
  mensaje.value = nivel.value === 1
    ? 'Pista: rodea los obstáculos usando avanzar, girar y vuelve a avanzar.'
    : 'Pista: el bloque repetir puede avanzar varias casillas en una misma dirección.'
}
const ejecutar = async () => {
  if (ejecutando.value) return
  if (!instrucciones.value.length) {
    mensaje.value = 'Añade algunos bloques antes de ejecutar el algoritmo.'
    return
  }
  intentos.value++
  ejecutando.value = true
  mensaje.value = 'El robot está siguiendo tus instrucciones…'
  let paso = 0
  for (const accion of instrucciones.value) {
    paso++
    await pausa(430)
    if (accion === 'izquierda') robot.value.rumbo = (robot.value.rumbo + 3) % 4
    else if (accion === 'derecha') robot.value.rumbo = (robot.value.rumbo + 1) % 4
    else {
      const avance = [
        { fila: 0, columna: 1 },
        { fila: 1, columna: 0 },
        { fila: 0, columna: -1 },
        { fila: -1, columna: 0 }
      ][robot.value.rumbo]
      const fila = robot.value.fila + avance.fila
      const columna = robot.value.columna + avance.columna
      if (fila < 0 || fila > 4 || columna < 0 || columna > 4 || obstaculos.value.includes(`${fila}-${columna}`)) {
        mensaje.value = `¡Uy! El robot encontró un obstáculo en el paso ${paso}. Ajusta esa instrucción y vuelve a probar.`
        ejecutando.value = false
        return
      }
      robot.value.fila = fila
      robot.value.columna = columna
    }
    if (enMeta.value) {
      mensaje.value = '¡Lo lograste! El robot llegó a la estrella. ¿Puedes hacerlo con menos pasos?'
      ejecutando.value = false
      emit('completar', intentos.value === 1 ? 3 : intentos.value <= 3 ? 2 : 1)
      return
    }
  }
  ejecutando.value = false
  mensaje.value = `El robot terminó la secuencia en la casilla ${robot.value.fila + 1}, ${robot.value.columna + 1}. Prueba otro algoritmo para llegar a la estrella.`
}
</script>

<template>
  <div class="contenido">
    <header class="encabezado">
      <span class="chip">LABORATORIO DE ALGORITMOS</span>
      <h3>Crea tu algoritmo</h3>
      <p>Programa al robot para llegar a la estrella. Cada bloque es una instrucción.</p>
    </header>

    <div class="niveles" role="group" aria-label="Selecciona nivel">
      <button type="button" :aria-pressed="nivel===1" :class="{ activo:nivel===1 }" @click="cambiarNivel(1)">Nivel 1 · Ruta</button>
      <button type="button" :aria-pressed="nivel===2" :class="{ activo:nivel===2 }" @click="cambiarNivel(2)">Nivel 2 · Patrones</button>
    </div>

    <div class="zona-juego">
      <div class="tablero-marco">
        <div class="tablero" role="img" :aria-label="`Cuadrícula 5 por 5. Robot en fila ${robot.fila+1}, columna ${robot.columna+1}, orientación ${direccion}. Meta en fila ${meta.fila+1}, columna ${meta.columna+1}.`">
          <div v-for="celda in 25" :key="celda" class="celda" :class="{
            obstaculo:obstaculos.includes(`${Math.floor((celda-1)/5)}-${(celda-1)%5}`),
            meta:meta.fila===Math.floor((celda-1)/5)&&meta.columna===(celda-1)%5,
            inicio:celda===21
          }">
            <span v-if="obstaculos.includes(`${Math.floor((celda-1)/5)}-${(celda-1)%5}`)" aria-hidden="true">▰</span>
            <span v-else-if="meta.fila===Math.floor((celda-1)/5)&&meta.columna===(celda-1)%5" class="destello" aria-hidden="true">★</span>
            <span v-else-if="celda===21" class="bandera-inicio" aria-hidden="true">INICIO</span>
          </div>
          <div class="robot" :style="{ '--fila':robot.fila, '--columna':robot.columna }" aria-hidden="true">
            <div class="robot-modelo" :style="{ '--giro':`${robot.rumbo*90}deg` }">
              <span class="robot-cara"><i></i><b></b></span>
              <span class="robot-techo"></span>
              <span class="robot-lado"></span>
            </div>
          </div>
        </div>
      </div>
      <p class="estado-robot" aria-live="polite"><span>●</span> Orientación {{ direccion }} · Casilla {{ robot.fila+1 }}, {{ robot.columna+1 }}</p>
    </div>

    <section class="editor" aria-label="Editor del algoritmo">
      <div class="editor-titulo"><strong>Bloques de código</strong><small>Elige las instrucciones para tu robot</small></div>
      <div class="bloques">
        <button class="bloque avanzar" type="button" :disabled="ejecutando" @click="agregar('avanzar')"><span>↑</span> Avanzar</button>
        <button class="bloque giro" type="button" :disabled="ejecutando" @click="agregar('izquierda')"><span>↶</span> Girar izquierda</button>
        <button class="bloque giro" type="button" :disabled="ejecutando" @click="agregar('derecha')"><span>↷</span> Girar derecha</button>
        <label v-if="nivel===2" class="repite">
          <span>Repetir</span>
          <select v-model.number="repeticiones" :disabled="ejecutando" aria-label="Cantidad de repeticiones">
            <option :value="2">2 veces</option><option :value="3">3 veces</option><option :value="4">4 veces</option>
          </select>
          <button class="bloque repetir" type="button" :disabled="ejecutando" @click="agregar('repetir')">↻ Agregar</button>
        </label>
      </div>

      <div class="secuencia">
        <div class="editor-titulo"><strong>Tu algoritmo <span class="contador">{{ instrucciones.length }} pasos</span></strong></div>
        <ol v-if="comandos.length" class="lista-comandos">
          <li v-for="(b,i) in comandos" :key="i">
            <span class="numero">{{ i+1 }}</span>
            <span>{{ b.tipo==='repetir' ? `Repetir ${b.cantidad} veces: avanzar` : ({avanzar:'Avanzar',izquierda:'Girar izquierda',derecha:'Girar derecha'}[b.tipo]) }}</span>
            <button type="button" :disabled="ejecutando" :aria-label="`Quitar bloque ${i+1}`" @click="quitar(i)">×</button>
          </li>
        </ol>
        <p v-else class="vacio">Añade bloques para construir una ruta ✨</p>
      </div>
    </section>

    <p class="feedback" aria-live="polite">{{ mensaje || 'Piensa el recorrido antes de pulsar ejecutar.' }}</p>
    <div class="acciones">
      <button class="gbtn suave" type="button" :disabled="ejecutando" @click="reiniciar">↺ Reiniciar</button>
      <button class="gbtn suave" type="button" :disabled="ejecutando" @click="pista">✦ Pista</button>
      <button class="gbtn ejecutar" type="button" :disabled="ejecutando" @click="ejecutar">{{ ejecutando?'Robot en movimiento…':'▶ Ejecutar' }}</button>
    </div>
    <button class="cerrar" type="button" :disabled="ejecutando" @click="emit('cerrar')">Salir de la misión</button>
  </div>
</template>

<style scoped>
.contenido{display:grid;gap:1rem}
.encabezado{text-align:center;padding:.5rem 1rem}
.encabezado h3{margin:.45rem 0;font-size:clamp(1.5rem,4vw,2rem)}
.encabezado p{opacity:.82}
.chip{display:inline-block;padding:.25rem .7rem;border:1px solid rgba(124,230,200,.42);border-radius:999px;color:#a8ffe5;font-size:.7rem;letter-spacing:.13em}
.niveles{display:flex;justify-content:center;gap:.55rem;flex-wrap:wrap}
.niveles button{border:1px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:inherit;border-radius:999px;padding:.5rem .85rem;font:inherit;font-size:.85rem;cursor:pointer}
.niveles button.activo{background:rgba(79,123,255,.4);border-color:rgba(124,230,200,.55);box-shadow:0 0 16px rgba(79,123,255,.24)}
.zona-juego{display:grid;justify-items:center;gap:.55rem;padding:.8rem;border:1px solid rgba(124,230,200,.18);border-radius:24px;background:radial-gradient(ellipse at 50% 20%,rgba(79,123,255,.2),transparent 65%),rgba(5,12,35,.56)}
.tablero-marco{width:min(100%,310px);padding:9px;border-radius:22px;background:linear-gradient(145deg,rgba(124,230,200,.38),rgba(79,123,255,.24));box-shadow:0 14px 28px rgba(0,0,0,.32),inset 0 1px rgba(255,255,255,.25)}
.tablero{position:relative;display:grid;grid-template-columns:repeat(5,1fr);aspect-ratio:1;border:1px solid rgba(255,255,255,.18);border-radius:15px;overflow:hidden;background:#101a39;perspective:700px}
.celda{display:grid;place-items:center;position:relative;border:1px solid rgba(173,197,255,.16);background:linear-gradient(145deg,rgba(49,69,117,.72),rgba(22,33,69,.9));box-shadow:inset 0 2px 6px rgba(255,255,255,.045),inset 0 -4px 8px rgba(0,0,0,.22);color:#182345}
.celda.obstaculo{background:linear-gradient(145deg,#465573,#202b47);box-shadow:inset 0 5px 8px rgba(255,255,255,.12),inset 0 -8px 8px rgba(0,0,0,.35)}
.celda.obstaculo span{font-size:clamp(1.2rem,7vw,2rem);color:#a7b5d3;text-shadow:0 3px 1px #121a31;transform:translateY(-2px)}
.celda.inicio{background:linear-gradient(145deg,rgba(46,230,166,.18),rgba(22,33,69,.9))}
.bandera-inicio{font-size:.46rem;color:#83f5cf;font-weight:700;letter-spacing:.04em}
.celda.meta{background:radial-gradient(circle,rgba(255,210,63,.32),rgba(22,33,69,.9) 72%)}
.destello{font-size:clamp(1.2rem,7vw,1.9rem);color:var(--sol);filter:drop-shadow(0 0 10px rgba(255,210,63,.8));animation:latido 1.5s ease-in-out infinite alternate}
.robot{position:absolute;z-index:2;left:calc(var(--columna)*20%);top:calc(var(--fila)*20%);width:20%;height:20%;display:grid;place-items:center;transition:left .34s cubic-bezier(.2,.8,.2,1),top .34s cubic-bezier(.2,.8,.2,1)}
.robot-modelo{position:relative;width:clamp(25px,9vw,38px);height:clamp(25px,9vw,38px);transform:rotate(var(--giro));transition:transform .28s ease;filter:drop-shadow(5px 7px 3px rgba(0,0,0,.5))}
.robot-cara{position:absolute;inset:0;z-index:2;display:flex;align-items:center;justify-content:center;gap:22%;border:1px solid rgba(255,255,255,.75);border-radius:8px;background:linear-gradient(145deg,#91ffe1 0%,#2ee6a6 42%,#138b91 100%);box-shadow:inset 0 3px 5px rgba(255,255,255,.65),inset 0 -5px 6px rgba(0,35,65,.4),0 0 14px rgba(46,230,166,.45)}
.robot-cara i,.robot-cara b{width:15%;height:18%;border-radius:50%;background:#102047;box-shadow:0 0 5px #fff}
.robot-techo{position:absolute;z-index:1;left:10%;top:-19%;width:80%;height:22%;border:1px solid rgba(255,255,255,.5);border-radius:50% 50% 0 0;background:linear-gradient(90deg,#d9fff3,#5ef2c4,#17959d);transform:skewY(-12deg)}
.robot-lado{position:absolute;z-index:1;right:-20%;top:12%;width:20%;height:82%;border-radius:0 5px 6px 0;background:linear-gradient(90deg,#157f91,#10426a);transform:skewY(-24deg);transform-origin:left}
.estado-robot{font-size:.78rem;color:#c5d5ff}.estado-robot span{color:var(--menta)}
.editor{padding:.85rem;border:1px solid rgba(255,255,255,.17);border-radius:20px;background:linear-gradient(140deg,rgba(255,255,255,.1),rgba(255,255,255,.035));box-shadow:inset 0 1px rgba(255,255,255,.1)}
.editor-titulo{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-bottom:.65rem}.editor-titulo small{opacity:.7;font-size:.72rem}
.bloques{display:flex;flex-wrap:wrap;gap:.5rem}
.bloque{display:inline-flex;align-items:center;gap:.38rem;border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:.5rem .7rem;color:#fff;font:inherit;font-size:.8rem;font-weight:600;line-height:1.2;cursor:pointer;box-shadow:inset 0 1px rgba(255,255,255,.22),0 4px 10px rgba(0,0,0,.15);transition:transform .18s,filter .18s}
.bloque:hover:not(:disabled){transform:translateY(-2px);filter:brightness(1.12)}
.bloque span{font-size:1.05rem}
.avanzar{background:linear-gradient(145deg,#3279ef,#2546a5)}
.giro{background:linear-gradient(145deg,#9859df,#6039a4)}
.repite{display:flex;align-items:center;gap:.4rem;padding:.35rem .5rem;border:1px dashed rgba(255,210,63,.6);border-radius:14px;background:rgba(255,210,63,.08);font-size:.76rem}
.repite select{max-width:85px;border:1px solid rgba(255,255,255,.2);border-radius:8px;padding:.3rem;color:#fff;background:#18234a;font:inherit}
.repetir{background:linear-gradient(145deg,#d89326,#a8591d)}
.secuencia{margin-top:.85rem;padding-top:.7rem;border-top:1px solid rgba(255,255,255,.14)}
.contador{margin-left:.3rem;color:#9eefd9;font-size:.73rem;font-weight:500}
.lista-comandos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.4rem;list-style:none;padding:0;max-height:140px;overflow:auto}
.lista-comandos li{display:flex;align-items:center;gap:.45rem;min-width:0;padding:.35rem .45rem;border:1px solid rgba(124,230,200,.2);border-radius:10px;background:rgba(8,18,44,.68);font-size:.74rem}
.lista-comandos li>span:nth-child(2){flex:1}
.numero{display:grid;place-items:center;width:22px;height:22px;flex:none;border-radius:50%;background:rgba(79,123,255,.35);color:#dce7ff;font-size:.65rem}
.lista-comandos li button{border:0;border-radius:7px;background:rgba(255,95,162,.15);color:#ffd3e4;font-size:1rem;cursor:pointer}
.vacio{padding:.4rem;text-align:center;opacity:.65;font-size:.8rem}
.feedback{min-height:2.5rem;margin:.15rem 0;padding:.65rem .85rem;border-left:3px solid var(--menta);border-radius:0 12px 12px 0;background:rgba(46,230,166,.08);font-size:.87rem}
.acciones{display:flex;justify-content:center;gap:.6rem;flex-wrap:wrap}.acciones .gbtn{padding:.55rem .9rem;font-size:.85rem}
.gbtn:disabled,.bloque:disabled{opacity:.65;cursor:wait}
.cerrar{justify-self:center;border:0;background:transparent;color:#d4dcf0;text-decoration:underline;text-underline-offset:3px;font:inherit;font-size:.78rem;cursor:pointer}
@keyframes latido{to{transform:scale(1.13);filter:drop-shadow(0 0 14px rgba(255,210,63,1))}}
@media(max-width:420px){.editor-titulo{align-items:flex-start;flex-direction:column}.lista-comandos{grid-template-columns:1fr}.bloque{font-size:.74rem;padding:.45rem .55rem}}
@media(prefers-reduced-motion:reduce){.robot,.robot-modelo,.destello,.bloque{transition:none!important;animation:none!important}}
</style>
