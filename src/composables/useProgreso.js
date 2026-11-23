import { reactive, watch } from 'vue'

const clave = 'nox-piensa-bit-progreso'
const inicial = {
  conceptos: [],
  misiones: [false, false, false, false],
  estrellasMisiones: [0, 0, 0, 0],
  quizRealizado: false,
  puntaje: 0,
  estrellasQuiz: 0
}

const leer = () => {
  try {
    const guardado = JSON.parse(localStorage.getItem(clave))
    if (!guardado) return { ...inicial, conceptos: [], misiones: [...inicial.misiones], estrellasMisiones: [...inicial.estrellasMisiones] }
    return {
      conceptos: Array.isArray(guardado.conceptos) ? guardado.conceptos : [],
      misiones: Array.isArray(guardado.misiones) ? [...inicial.misiones, ...guardado.misiones].slice(0, 4) : [...inicial.misiones],
      estrellasMisiones: Array.isArray(guardado.estrellasMisiones) ? [...inicial.estrellasMisiones, ...guardado.estrellasMisiones].slice(0, 4) : [...inicial.estrellasMisiones],
      quizRealizado: Boolean(guardado.quizRealizado),
      puntaje: Number.isFinite(guardado.puntaje) ? guardado.puntaje : 0,
      estrellasQuiz: Number.isFinite(guardado.estrellasQuiz) ? guardado.estrellasQuiz : 0
    }
  } catch {
    return { ...inicial, conceptos: [], misiones: [...inicial.misiones], estrellasMisiones: [...inicial.estrellasMisiones] }
  }
}

const progreso = reactive(leer())

watch(progreso, () => {
  try { localStorage.setItem(clave, JSON.stringify(progreso)) } catch {}
}, { deep: true })

export function useProgreso() {
  const marcarConcepto = nombre => {
    if (!progreso.conceptos.includes(nombre)) progreso.conceptos.push(nombre)
  }
  const completarMision = (indice, estrellas) => {
    progreso.misiones[indice] = true
    progreso.estrellasMisiones[indice] = Math.max(progreso.estrellasMisiones[indice], Math.max(1, Math.min(3, estrellas)))
  }
  const guardarQuiz = puntaje => {
    progreso.quizRealizado = true
    progreso.puntaje = puntaje
    progreso.estrellasQuiz = puntaje <= 2 ? 1 : puntaje <= 4 ? 2 : puntaje <= 6 ? 3 : puntaje <= 8 ? 4 : 5
  }
  const reiniciar = () => {
    progreso.conceptos.splice(0)
    progreso.misiones.splice(0, 4, false, false, false, false)
    progreso.estrellasMisiones.splice(0, 4, 0, 0, 0, 0)
    progreso.quizRealizado = false
    progreso.puntaje = 0
    progreso.estrellasQuiz = 0
  }
  const reiniciarQuiz = () => {
    progreso.quizRealizado = false
    progreso.puntaje = 0
    progreso.estrellasQuiz = 0
  }
  return { progreso, marcarConcepto, completarMision, guardarQuiz, reiniciar, reiniciarQuiz }
}
