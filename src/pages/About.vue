<template>
  <section class="w-full h-[calc(100vh-64px)] bg-black relative overflow-hidden">
    <canvas ref="canvasRef" class="w-full h-full block"></canvas>

    <div class="pointer-events-none absolute left-4 bottom-4 text-white/80 text-sm space-y-1">
      <p>{{ modeLabel }}</p>
      <p>{{ stageLabel }}</p>
      <p>{{ helperLabel }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAboutGame } from '../features/about-game/useAboutGame'

const canvasRef = ref(null)

const { stageLabel, helperLabel, modeLabel } = useAboutGame(canvasRef)
</script>
