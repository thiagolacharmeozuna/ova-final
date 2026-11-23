# OVA – Pensamiento computacional

```sh
npm install
npm run dev
```

Las fotografías temáticas se guardan en `public/media` para que la interfaz no dependa de un servicio de imágenes externo. Se descargaron de Unsplash: [computación colaborativa](https://images.unsplash.com/photo-1516321318423-f06f85e504b3), [equipo programando](https://images.unsplash.com/photo-1522071820081-009f0129c71c), [código](https://images.unsplash.com/photo-1515879218367-8466d910aaa4), [espacio de trabajo](https://images.unsplash.com/photo-1498050108023-c5249f4df085), [mesa de computadoras](https://images.unsplash.com/photo-1519389950473-47ba0277781c), [circuitos](https://images.unsplash.com/photo-1518770660439-4636190af475), [planificación](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40), [oficina](https://images.unsplash.com/photo-1524758631624-e2822e304c36), [estudiantes colaborando](https://images.unsplash.com/photo-1522202176988-66273c2fd55f), [computadora portátil](https://images.unsplash.com/photo-1531297484001-80022131f5a1), [programación en equipo](https://images.unsplash.com/photo-1531482615713-2afd69097998), [tecnología retro](https://images.unsplash.com/photo-1550745165-9bc0b252726f), [equipo de trabajo](https://images.unsplash.com/photo-1521737711867-e3b97375f902), [espacio colaborativo](https://images.unsplash.com/photo-1504384308090-c894fdcc538d), [reunión](https://images.unsplash.com/photo-1553877522-43269d4ea984) y [trabajo en equipo](https://images.unsplash.com/photo-1556761175-b413da4baf72).

Para agregar un video a la sección de ejemplo, colócalo en `public/media` y pásalo a `VideoSlot` con una ruta como `/media/ejemplo.mp4`.

## Actividades interactivas

Las misiones están en `src/components/missions/` y se abren desde Actividades. El robot de «Crea tu algoritmo» se mueve paso a paso sobre una cuadrícula 5×5; el nivel extra introduce bloques de repetición. Las actividades se pueden usar con ratón, pantalla táctil y teclado. El avance y las estrellas se guardan en el navegador; si el almacenamiento local está bloqueado, la experiencia sigue siendo usable durante la sesión.

El contenido pedagógico de conceptos, ejemplos, misiones y evaluación es un **borrador para revisión docente** antes de entregar el OVA.

### Cómo ampliar el contenido

- **Preguntas:** edita `preguntasEvaluacion` en `src/data/preguntasQuiz.js`. Cada pregunta tiene `q` (enunciado), `o` (opciones), `r` (índice de la respuesta correcta) y `e` (explicación).
- **Conceptos:** edita los ejemplos y mini-retos en `src/data/conceptos.js`.
- **Misiones:** el contenido de las parejas, procesos y decisiones está en `src/data/misiones.js`. Para agregar un tipo de misión, crea su componente en `src/components/missions/`, regístralo en `src/components/MissionsSection.vue` y emite `completar` con 1–3 estrellas al resolverla.
- **Video:** copia el archivo como `public/media/ejemplo.mp4`. La vista detecta el archivo y activa `VideoSlot` automáticamente; si no está disponible, conserva el ejemplo interactivo. El póster usa una imagen local ya incluida.

### Pruebas manuales recomendadas

1. Abrir Conceptos, navegar las tarjetas con Tab/Enter y probar una pregunta de cada mini-demostración.
2. En «Une los conceptos», seleccionar primero cada concepto y después su definición; comprobar el acierto y el intento incorrecto.
3. En «Ordena los pasos», usar las flechas y arrastrar tarjetas; probar las dos secuencias, las pistas y la solución.
4. En «Resuelve el reto», contestar las cuatro decisiones y verificar explicación, progreso y resultado.
5. En «Crea tu algoritmo», recorrer el camino sin obstáculos, intentar chocar, probar la pista, y completar los dos niveles (el segundo con «Repetir»).
6. Completar las 10 preguntas del quiz; comprobar avance, explicación, puntaje y estrellas; recargar para verificar persistencia.
7. Completar una misión y revisar la estrella y el resumen en Recursos; revisar el diseño a 360 px, 768 px y escritorio, además de `prefers-reduced-motion`.
8. Ejecutar `npm run build` y `npm run preview`.
