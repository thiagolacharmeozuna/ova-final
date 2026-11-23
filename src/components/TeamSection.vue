<script setup>
const integrantes = [
  { nombre: 'Isaac Miranda', imagen: '/media/isaac-miranda.jpeg' },
  { nombre: 'Alejandro Kelsey', imagen: '/media/alejandro-kelsey.jpeg' },
  { nombre: 'Thiago Lacharme', imagen: '/media/thiago-lacharme.jpeg' },
  { nombre: 'Luis Ricardo', imagen: '/media/luis-ricardo.jpeg' }
]
</script>

<template>
  <section class="team-section" aria-labelledby="integrantes-titulo">
    <header class="team-heading">
      <p class="team-kicker">NOX · Equipo creativo</p>
      <h2 id="integrantes-titulo">Integrantes</h2>
      <p class="lead">Las personas detrás de esta experiencia de aprendizaje.</p>
    </header>

    <div class="team-grid">
      <article v-for="integrante in integrantes" :key="integrante.nombre" class="member-card glass">
        <div class="member-photo">
          <img :src="integrante.imagen" :alt="`Retrato de ${integrante.nombre}`" />
        </div>
        <div class="member-info">
          <span class="member-line"></span>
          <h3>{{ integrante.nombre }}</h3>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.team-section{max-width:1200px;margin:0 auto}
.team-heading{text-align:center;margin-bottom:2rem}
.team-kicker{display:inline-block;margin-bottom:.65rem;padding:.25rem .85rem;border:1px solid rgba(124,230,200,.38);border-radius:999px;background:rgba(124,230,200,.09);color:#aeeed7;font-size:.72rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase}
.team-heading .lead{margin-bottom:0}
.team-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:1.25rem}
.member-card{border-radius:24px;padding:.6rem;overflow:hidden}
.member-photo{position:relative;width:min(100%,220px);aspect-ratio:1;margin:.6rem auto 0;border:2px solid rgba(124,230,200,.55);border-radius:50%;overflow:hidden;background:radial-gradient(circle at 35% 20%,rgba(124,230,200,.24),rgba(79,123,255,.14) 52%,rgba(7,11,36,.8));box-shadow:0 0 24px rgba(79,123,255,.2),inset 0 0 18px rgba(124,230,200,.15)}
.member-photo img{width:100%;height:100%;display:block;object-fit:cover;object-position:center 24%;filter:saturate(.95) contrast(1.04)}
.member-info{padding:.9rem .75rem .75rem}
.member-line{display:block;width:42px;height:3px;margin-bottom:.55rem;border-radius:999px;background:linear-gradient(90deg,var(--nar),var(--rosa));box-shadow:0 0 12px rgba(255,138,31,.35)}
.member-info h3{font-size:1.05rem;text-align:left;letter-spacing:.01em}
@media(max-width:980px){.team-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:720px;margin:auto}}
@media(max-width:520px){.team-grid{grid-template-columns:1fr;max-width:330px}.team-heading{margin-bottom:1.35rem}}
</style>
