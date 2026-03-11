<template>
  <section class="w-full h-[calc(100vh-64px)] bg-black relative overflow-hidden">
    <canvas ref="canvasRef" class="w-full h-full block"></canvas>

    <button
      type="button"
      class="absolute top-4 right-4 z-20 rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black cursor-pointer"
      @click="restartGame"
    >
      Restart
    </button>

    <div class="pointer-events-none absolute left-4 bottom-4 text-white/80 text-sm space-y-1">
      <p>Use ↑ ↓ ← → to control</p>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAboutGame } from '../features/about-game/useAboutGame'

const canvasRef = ref(null)

const { restartGame } = useAboutGame(canvasRef)
</script>
