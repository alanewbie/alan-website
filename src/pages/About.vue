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

    <div v-if="showVirtualControls && !mustRotatePhone" class="absolute left-4 bottom-5 z-30">
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

    <div
      v-if="showKeyboardHint && !showVirtualControls && !mustRotatePhone"
      class="keyboard-hint absolute left-1/2 bottom-8 z-20 -translate-x-1/2"
    >
      <p class="keyboard-hint__title">Keyboard Controls</p>
      <div class="keyboard-hint__keys" aria-label="Use arrow keys to move">
        <span class="keyboard-hint__spacer"></span>
        <span class="keyboard-hint__key">↑</span>
        <span class="keyboard-hint__spacer"></span>
        <span class="keyboard-hint__key">←</span>
        <span class="keyboard-hint__key">↓</span>
        <span class="keyboard-hint__key">→</span>
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
const showKeyboardHint = ref(false)

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
  showKeyboardHint.value = !showVirtualControls.value
  updateMobileOrientationState()
  window.addEventListener('resize', updateMobileOrientationState)
  window.addEventListener('orientationchange', updateMobileOrientationState)
  Swal.fire({
    title: 'Welcome to the Journey',
    html: 'Press start to explore my life like a game.',
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
.keyboard-hint {
  min-width: 13rem;
  padding: 0.72rem 0.9rem 0.8rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.22);
  background: rgba(4, 10, 26, 0.66);
  backdrop-filter: blur(8px);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.36),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  pointer-events: none;
}

.keyboard-hint__title {
  margin: 0 0 0.45rem;
  font-size: 0.74rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(228, 241, 255, 0.92);
  text-align: center;
}

.keyboard-hint__keys {
  display: grid;
  grid-template-columns: repeat(3, 2.25rem);
  grid-template-rows: repeat(2, 2.25rem);
  gap: 0.28rem;
  justify-content: center;
}

.keyboard-hint__spacer {
  width: 2.25rem;
  height: 2.25rem;
}

.keyboard-hint__key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.48rem;
  font-size: 1.08rem;
  font-weight: 700;
  color: rgba(249, 252, 255, 0.97);
  border: 1px solid rgba(197, 228, 255, 0.4);
  background:
    linear-gradient(180deg, rgba(170, 210, 255, 0.28) 0%, rgba(31, 51, 76, 0.22) 55%),
    rgba(8, 16, 33, 0.88);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.32),
    0 6px 10px rgba(0, 0, 0, 0.28);
}

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
