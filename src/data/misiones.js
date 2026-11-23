export const conceptosMision = [
  { id: 'des', nombre: 'Descomposición', icono: '🧩' },
  { id: 'pat', nombre: 'Patrones', icono: '🔁' },
  { id: 'abs', nombre: 'Abstracción', icono: '🔎' },
  { id: 'alg', nombre: 'Algoritmos', icono: '⚡' }
]

export const definicionesMision = [
  { id: 'alg', texto: 'Una lista de instrucciones claras y en orden.' },
  { id: 'abs', texto: 'Quedarse con la información que sí importa.' },
  { id: 'des', texto: 'Dividir un problema grande en partes pequeñas.' },
  { id: 'pat', texto: 'Encontrar lo que se repite o se parece.' }
]

export const procesosOrden = [
  {
    titulo: 'Preparar un sándwich',
    pasos: ['Lavarse las manos', 'Sacar los ingredientes', 'Añadir queso', 'Añadir jamón', 'Tapar el sándwich', 'Cortar', 'Servir'],
    mezcla: ['Cortar', 'Sacar los ingredientes', 'Servir', 'Lavarse las manos', 'Añadir jamón', 'Tapar el sándwich', 'Añadir queso']
  },
  {
    titulo: 'Cruzar la calle',
    pasos: ['Detenerse en la acera', 'Mirar a ambos lados', 'Esperar a que sea seguro', 'Cruzar con atención', 'Llegar al otro lado'],
    mezcla: ['Cruzar con atención', 'Mirar a ambos lados', 'Llegar al otro lado', 'Detenerse en la acera', 'Esperar a que sea seguro']
  }
]

export const decisionesReto = [
  {
    pilar: '1 · Descomposición',
    pregunta: 'Hay una fila enorme en la tienda escolar. ¿Cómo investigamos dónde se demora?',
    opciones: [
      { texto: 'Separar el proceso: pedir, preparar, pagar y entregar.', bien: true, razon: '¡Buena estrategia! Al dividir la fila en etapas podemos encontrar cuál causa la demora.' },
      { texto: 'Contar a todas las personas sin mirar qué ocurre.', bien: false, razon: 'Contar ayuda, pero no muestra en qué parte de la atención se forma el retraso.' }
    ]
  },
  {
    pilar: '2 · Patrones',
    pregunta: 'Descubrimos que muchos estudiantes piden lo mismo. ¿Qué patrón podemos aprovechar?',
    opciones: [
      { texto: 'Preparar combos de sándwich y jugo que se repiten.', bien: true, razon: '¡Sí! Reutilizar una combinación frecuente puede agilizar el pedido.' },
      { texto: 'Preparar todos los productos posibles antes de escuchar pedidos.', bien: false, razon: 'Hacer de todo puede desperdiciar comida. Conviene usar un patrón observado en los pedidos.' }
    ]
  },
  {
    pilar: '3 · Abstracción',
    pregunta: 'Para organizar los pedidos, ¿qué datos son realmente importantes?',
    opciones: [
      { texto: 'Producto, cantidad y curso.', bien: true, razon: '¡Exacto! Esos datos permiten preparar y entregar cada pedido.' },
      { texto: 'Producto, cantidad, curso y equipo de fútbol favorito.', bien: false, razon: 'El equipo favorito no ayuda a preparar el pedido. La abstracción deja fuera ese detalle.' }
    ]
  },
  {
    pilar: '4 · Algoritmos',
    pregunta: '¿En qué orden debe atenderse cada pedido?',
    opciones: [
      { texto: 'Pedir → pagar → recoger.', bien: true, razon: '¡Orden claro! Cada paso ocurre antes del siguiente.' },
      { texto: 'Recoger → pedir → pagar.', bien: false, razon: 'Para recoger un pedido, primero hay que hacerlo y luego pagarlo.' }
    ]
  }
]
