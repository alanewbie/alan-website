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
      class="absolute left-4 bottom-5 z-30"
    >
      <div
        class="joystick"
        @pointerdown.prevent="onJoystickPointerDown"
        @pointermove.prevent="onJoystickPointerMove"
        @pointerup.prevent="onJoystickPointerEnd"
        @pointercancel.prevent="onJoystickPointerEnd"
      >
        <div class="joystick__ring"></div>
        <div class="joystick__thumb" :style="joystickThumbStyle"></div>
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
const joystickX = ref(0)
const joystickY = ref(0)
const activePointerId = ref(null)

const { restartGame, setControlKey } = useAboutGame(canvasRef)

const controlKeys = ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
const joystickRadius = 42
const joystickDeadZone = 14
const activeJoystickKeys = new Set()
const joystickThumbStyle = ref({ transform: 'translate(0px, 0px)' })

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
    resetJoystick()
  }
}

function applyJoystickKeys(nextKeys) {
  controlKeys.forEach((key) => {
    const shouldPress = nextKeys.has(key)
    const isPressed = activeJoystickKeys.has(key)
    if (shouldPress && !isPressed) {
      setControlKey(key, true)
      activeJoystickKeys.add(key)
    } else if (!shouldPress && isPressed) {
      setControlKey(key, false)
      activeJoystickKeys.delete(key)
    }
  })
}

function updateJoystickThumb() {
  joystickThumbStyle.value = {
    transform: `translate(${Math.round(joystickX.value)}px, ${Math.round(joystickY.value)}px)`,
  }
}

function setJoystickFromPointer(e) {
  const el = e.currentTarget
  if (!el) return
  const rect = el.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const dx = e.clientX - centerX
  const dy = e.clientY - centerY
  const dist = Math.hypot(dx, dy)
  const clamped = dist > joystickRadius ? joystickRadius / dist : 1

  joystickX.value = dx * clamped
  joystickY.value = dy * clamped
  updateJoystickThumb()

  const nextKeys = new Set()
  const absX = Math.abs(joystickX.value)
  const absY = Math.abs(joystickY.value)
  const verticalDominant = absY > absX * 1.15

  if (absX > joystickDeadZone) {
    nextKeys.add(joystickX.value > 0 ? 'ArrowRight' : 'ArrowLeft')
  }

  if (absY > joystickDeadZone && verticalDominant) {
    nextKeys.add(joystickY.value < 0 ? 'ArrowUp' : 'ArrowDown')
  }

  applyJoystickKeys(nextKeys)
}

function resetJoystick() {
  joystickX.value = 0
  joystickY.value = 0
  updateJoystickThumb()
  applyJoystickKeys(new Set())
  activePointerId.value = null
}

function onJoystickPointerDown(e) {
  if (mustRotatePhone.value) return
  activePointerId.value = e.pointerId
  e.currentTarget?.setPointerCapture?.(e.pointerId)
  setJoystickFromPointer(e)
}

function onJoystickPointerMove(e) {
  if (activePointerId.value !== e.pointerId) return
  setJoystickFromPointer(e)
}

function onJoystickPointerEnd(e) {
  if (activePointerId.value !== e.pointerId) return
  e.currentTarget?.releasePointerCapture?.(e.pointerId)
  resetJoystick()
}

onMounted(() => {
  showVirtualControls.value = shouldShowVirtualControls()
  updateMobileOrientationState()
  window.addEventListener('resize', updateMobileOrientationState)
  window.addEventListener('orientationchange', updateMobileOrientationState)
  Swal.fire({
    title: 'Welcome to the Journey',
    html: 'Use <b>↑ ← →</b> on keyboard or the joystick on mobile.<br><br>Spend 1 minute to explore the highlights of my life.',
    icon: 'info',
    confirmButtonText: 'Start',
    confirmButtonColor: '#1f477a',
    background: '#f8fafc',
  })
})

onBeforeUnmount(() => {
  resetJoystick()
  window.removeEventListener('resize', updateMobileOrientationState)
  window.removeEventListener('orientationchange', updateMobileOrientationState)
})
</script>

<style scoped>
.joystick {
  position: relative;
  width: 7.2rem;
  height: 7.2rem;
  touch-action: none;
  user-select: none;
}

.joystick__ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 30% 30%, rgba(123, 222, 255, 0.34), rgba(30, 64, 83, 0.12) 44%),
    radial-gradient(circle, rgba(12, 17, 26, 0.78) 0%, rgba(8, 13, 22, 0.92) 65%);
  border: 2px solid rgba(153, 234, 255, 0.28);
  box-shadow:
    inset 0 2px 9px rgba(166, 244, 255, 0.24),
    inset 0 -4px 12px rgba(2, 9, 18, 0.72),
    0 5px 20px rgba(0, 0, 0, 0.44);
}

.joystick__thumb {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 3.1rem;
  height: 3.1rem;
  margin-left: -1.55rem;
  margin-top: -1.55rem;
  border-radius: 9999px;
  background:
    radial-gradient(circle at 30% 30%, rgba(175, 247, 255, 0.72), rgba(49, 103, 130, 0.2) 35%),
    radial-gradient(circle, rgba(10, 18, 31, 0.88) 0%, rgba(6, 12, 20, 0.97) 75%);
  border: 2px solid rgba(155, 232, 255, 0.52);
  box-shadow:
    0 1px 4px rgba(171, 245, 255, 0.5),
    0 7px 14px rgba(0, 0, 0, 0.55);
  transition: transform 45ms linear;
}
</style>
