<template>
  <section class="w-full h-[calc(100vh-4rem)] bg-black relative overflow-hidden">
    <canvas ref="canvasRef" class="w-full h-full block"></canvas>

    <div
      v-if="mustRotatePhone"
      class="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/88 px-6 text-center text-white"
    >
      <div class="max-w-md">
        <p class="text-2xl font-semibold">Rotate Your Phone</p>
        <p class="mt-3 text-base text-white/80">
          This interactive journey is designed for landscape mode. Turn your phone sideways to
          continue.
        </p>
      </div>
    </div>

    <div
      v-if="showVirtualControls && !mustRotatePhone"
      class="absolute left-3 top-1/2 z-30 -translate-y-1/2"
    >
      <div class="grid grid-cols-3 gap-2">
        <span></span>
        <button
          type="button"
          class="virtual-btn"
          @pointerdown.prevent="pressControl('ArrowUp')"
          @pointerup.prevent="releaseControl('ArrowUp')"
          @pointercancel.prevent="releaseControl('ArrowUp')"
          @pointerleave.prevent="releaseControl('ArrowUp')"
        >
          ↑
        </button>
        <span></span>

        <button
          type="button"
          class="virtual-btn"
          @pointerdown.prevent="pressControl('ArrowLeft')"
          @pointerup.prevent="releaseControl('ArrowLeft')"
          @pointercancel.prevent="releaseControl('ArrowLeft')"
          @pointerleave.prevent="releaseControl('ArrowLeft')"
        >
          ←
        </button>
        <button
          type="button"
          class="virtual-btn"
          @pointerdown.prevent="pressControl('ArrowDown')"
          @pointerup.prevent="releaseControl('ArrowDown')"
          @pointercancel.prevent="releaseControl('ArrowDown')"
          @pointerleave.prevent="releaseControl('ArrowDown')"
        >
          ↓
        </button>
        <button
          type="button"
          class="virtual-btn"
          @pointerdown.prevent="pressControl('ArrowRight')"
          @pointerup.prevent="releaseControl('ArrowRight')"
          @pointercancel.prevent="releaseControl('ArrowRight')"
          @pointerleave.prevent="releaseControl('ArrowRight')"
        >
          →
        </button>
      </div>
    </div>

    <button
      type="button"
      class="absolute top-4 right-4 z-20 rounded-md bg-white/90 px-4 py-2 text-sm font-semibold text-black cursor-pointer"
      @click="restartGame"
    >
      Restart
    </button>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import { useAboutGame } from '../features/about-game/useAboutGame'

const canvasRef = ref(null)
const showVirtualControls = ref(false)
const mustRotatePhone = ref(false)

const { restartGame, setControlKey } = useAboutGame(canvasRef)

const controlKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']

function shouldShowVirtualControls() {
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const narrowViewport = window.matchMedia('(max-width: 1024px)').matches
  const hasTouch = navigator.maxTouchPoints > 0
  return hasTouch && (coarsePointer || narrowViewport)
}

function isPhoneLikeViewport() {
  return window.matchMedia('(max-width: 1024px)').matches
}

function updateMobileOrientationState() {
  const hasTouch = navigator.maxTouchPoints > 0
  const isLandscape = window.matchMedia('(orientation: landscape)').matches
  mustRotatePhone.value = hasTouch && isPhoneLikeViewport() && !isLandscape
  if (mustRotatePhone.value) {
    controlKeys.forEach((key) => setControlKey(key, false))
  }
}

function pressControl(key) {
  if (mustRotatePhone.value) return
  setControlKey(key, true)
}

function releaseControl(key) {
  setControlKey(key, false)
}

onMounted(() => {
  showVirtualControls.value = shouldShowVirtualControls()
  updateMobileOrientationState()
  window.addEventListener('resize', updateMobileOrientationState)
  window.addEventListener('orientationchange', updateMobileOrientationState)
  Swal.fire({
    title: 'Welcome to the Journey',
    html: 'Use <b>↑ ↓ ← →</b> to move.<br><br>Spend 1 minute to explore the highlights of my life.',
    icon: 'info',
    confirmButtonText: 'Start',
    confirmButtonColor: '#1f477a',
    background: '#f8fafc',
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateMobileOrientationState)
  window.removeEventListener('orientationchange', updateMobileOrientationState)
})
</script>

<style scoped>
.virtual-btn {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.55);
  background: rgba(15, 23, 42, 0.62);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  touch-action: none;
  user-select: none;
}
</style>
