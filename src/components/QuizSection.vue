<script setup>
import { computed, ref } from 'vue'
import PhotoCard from './PhotoCard.vue'
import { useProgreso } from '../composables/useProgreso'
import { preguntasEvaluacion } from '../data/preguntasQuiz'
defineEmits(['ir'])
const { progreso, guardarQuiz, reiniciarQuiz } = useProgreso()
const preguntas=ref([...preguntasEvaluacion])
const iniciada=ref(false); const indice=ref(0); const seleccion=ref(null); const respondida=ref(false); const aciertos=ref(0)
const progresoQuiz=computed(()=>iniciada.value?(indice.value+(respondida.value?1:0))/preguntas.value.length*100:0)
const estrellas=computed(()=>progreso.estrellasQuiz)
const mezclar=lista=>{const copia=[...lista];for(let i=copia.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copia[i],copia[j]]=[copia[j],copia[i]]}return copia}
const responder=i=>{if(respondida.value)return;seleccion.value=i;respondida.value=true;if(i===preguntas.value[indice.value].r)aciertos.value++}
const siguiente=()=>{if(indice.value<preguntas.value.length-1){indice.value++;seleccion.value=null;respondida.value=false}else{guardarQuiz(aciertos.value);iniciada.value=false}}
const iniciar=()=>{preguntas.value=mezclar(preguntasEvaluacion);indice.value=0;seleccion.value=null;respondida.value=false;aciertos.value=0;iniciada.value=true}
const reiniciar=()=>{iniciada.value=false;indice.value=0;seleccion.value=null;respondida.value=false;aciertos.value=0;reiniciarQuiz()}
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>¿Cuánto aprendiste?</h2>
      <p class="lead">Repasa las ideas clave del pensamiento computacional.</p>
      <p class="revision">Borrador pedagógico · para revisión docente</p>
    </div>
    <div class="visual-seccion">
      <div class="fila">
        <PhotoCard src="/media/quiz-repaso.jpg" alt="Personas conversando sobre un tema frente a sus computadoras" caption="Repasa los conceptos" />
        <div class="glass panel">
          <div class="est" role="img" :aria-label="`${estrellas} de cinco estrellas`"><span v-for="n in 5" :key="n" :class="{on:n<=estrellas}">★</span></div>
          <template v-if="iniciada">
            <div class="barra" role="progressbar" :aria-valuenow="Math.round(progresoQuiz)" aria-valuemin="0" aria-valuemax="100" :aria-label="`Progreso de la evaluación: ${Math.round(progresoQuiz)}%`"><span :style="{width:progresoQuiz+'%'}"></span></div>
            <p class="estado">{{ preguntas[indice].q }}</p>
            <div class="opciones"><button v-for="(o,i) in preguntas[indice].o" :key="o" type="button" class="gbtn suave" :disabled="respondida" :class="{bien:respondida&&i===preguntas[indice].r,malo:respondida&&seleccion===i&&i!==preguntas[indice].r}" @click="responder(i)">{{ o }}</button></div>
            <p v-if="respondida" class="feedback" aria-live="polite"><b>{{ seleccion===preguntas[indice].r?'¡Bien!':'Buen intento.' }}</b> {{ preguntas[indice].e }}</p>
            <button v-if="respondida" class="gbtn" type="button" @click="siguiente">{{ indice<preguntas.length-1?'Siguiente':'Ver resultado' }}</button>
          </template>
          <template v-else>
            <p class="estado">{{ progreso.quizRealizado?`Resultado: ${progreso.puntaje}/10 — ¡seguimos pensando!`:'Pensamiento computacional' }}</p>
            <p v-if="progreso.quizRealizado">{{ progreso.puntaje>=9?'Eres una estrella NOX.':progreso.puntaje>=7?'¡Muy buen viaje de resolución!':progreso.puntaje>=5?'Vamos bien; cada intento mejora el algoritmo.':'Un error también es información. ¡Repasemos!' }}</p>
            <div class="acc">
              <button class="gbtn" type="button" v-ripple @click="iniciar">Iniciar evaluación</button>
              <button class="gbtn suave" type="button" v-ripple @click="reiniciar">Reiniciar</button>
              <button v-if="progreso.quizRealizado&&progreso.puntaje<10" class="gbtn suave" type="button" @click="$emit('ir',1)">Repasar conceptos fallados</button>
            </div>
          </template>
        </div>
        <PhotoCard src="/media/quiz-prueba.jpg" alt="Equipo compartiendo ideas en una reunión de trabajo" caption="Pon a prueba tus ideas" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.fila{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,2.2fr) minmax(0,.8fr);gap:.75rem;align-items:center;justify-items:center;width:100%;margin:0 auto}
.panel{padding:2rem;text-align:center;width:100%}
.est span{font-size:clamp(2.2rem,8vw,3.6rem);color:rgba(255,255,255,.25);display:inline-block;transition:color .4s}
.est .on{color:var(--sol);text-shadow:0 0 18px rgba(255,210,63,.8);animation:pop .6s var(--rebote)}
.estado{font-size:1.4rem;font-weight:700;margin:.6rem 0 1.2rem}
.acc{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.revision{text-align:center;margin-top:.35rem;font-size:.72rem;letter-spacing:.04em;color:#bed0ff;opacity:.72}
.barra{height:10px;border-radius:99px;background:rgba(255,255,255,.12);overflow:hidden;margin:.5rem 0 1rem}.barra span{display:block;height:100%;background:linear-gradient(90deg,var(--menta),var(--sol));transition:width .3s}.opciones{display:grid;gap:.6rem}.opciones .bien{background:rgba(46,230,166,.65)}.opciones .malo{background:rgba(255,95,162,.65)}.feedback{margin:.8rem 0}
@keyframes pop{from{transform:scale(0) rotate(-120deg)}}
@media(max-width:900px){.fila{grid-template-columns:1fr;max-width:620px}.fila>:nth-child(2){order:-1}}
</style>
