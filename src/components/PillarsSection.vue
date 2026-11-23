<script setup>
import { ref } from 'vue'
import PhotoCard from './PhotoCard.vue'
import { useProgreso } from '../composables/useProgreso'
import { pilares } from '../data/conceptos'

const { marcarConcepto } = useProgreso()
const seleccionado = ref(null)
const respuesta = ref(null)

const abrir = p => { seleccionado.value = p; respuesta.value = null; marcarConcepto(p.t) }
</script>
<template>
  <section class="seccion-layout">
    <div class="texto-seccion">
      <h2>Los 4 superpoderes</h2>
      <p class="lead">Cuatro herramientas para pensar y resolver problemas.</p>
      <p class="revision">Borrador pedagógico · para revisión docente</p>
    </div>
    <div class="visual-seccion">
      <div class="rejilla">
        <button v-for="p in pilares" :key="p.t" type="button" class="carta" @click="abrir(p)">
          <PhotoCard :src="p.src" :alt="p.alt" :caption="p.t" />
        </button>
      </div>
    </div>
    <div v-if="seleccionado" class="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-pilar" @click.self="seleccionado=null">
      <div class="panel glass">
        <button class="cerrar" type="button" aria-label="Cerrar" @click="seleccionado=null">×</button>
        <h3 id="titulo-pilar">{{ seleccionado.t }}</h3>
        <p><b>Definición:</b> {{ seleccionado.d }}</p>
        <p><b>Ejemplo cotidiano:</b> {{ seleccionado.e }}</p>
        <p><b>En la computadora:</b> {{ seleccionado.pc }}</p>
        <div class="mini">
          <p><b>Mini-reto:</b> {{ seleccionado.q }}</p>
          <button v-for="(x,i) in seleccionado.opciones" :key="x" class="gbtn suave" type="button" :disabled="respuesta!==null" @click="respuesta=i" v-ripple>{{ x }}</button>
        </div>
        <p class="feedback" aria-live="polite" v-if="respuesta!==null">{{ respuesta === seleccionado.ch ? '¡Bien pensado! Esa opción aplica el concepto.' : 'Buen intento. Piensa qué información o acción ayuda a resolver este problema.' }}</p>
      </div>
    </div>
  </section>
</template>
<style scoped>
.rejilla{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1.25rem;max-width:760px;margin:0 auto}
.carta{display:block;height:220px;position:relative;border:0;padding:0;background:transparent;color:inherit;cursor:pointer}
.modal{position:fixed;inset:0;z-index:50;display:grid;place-items:center;padding:1rem;background:rgba(3,7,24,.72)}
.panel{width:min(560px,100%);max-height:85vh;overflow:auto;padding:2rem;display:grid;gap:1rem}
.panel h3{font-size:2rem}.cerrar{position:absolute;right:1rem;top:.8rem;border:0;background:rgba(255,255,255,.12);color:#fff;border-radius:50%;width:42px;height:42px;font-size:1.7rem;cursor:pointer}
.mini{display:grid;gap:.6rem}.mini .gbtn{text-align:left}.feedback{padding:.8rem;border-radius:16px;background:rgba(46,230,166,.12)}
.revision{margin-top:.4rem;font-size:.72rem;letter-spacing:.04em;color:#bed0ff;opacity:.72}
@media(max-width:560px){.rejilla{grid-template-columns:1fr}}
</style>
