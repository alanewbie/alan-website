import { onBeforeUnmount, onMounted, ref } from 'vue'
import {
  AIRPORT_ZONE,
  HOSPITAL,
  INDONESIA_TERRACES,
  PHYSICS,
  PLAYER,
  PORTAL,
  STAGES,
  WORLD,
  clamp,
  findNextPlayableStage,
  findStageIndexByX,
} from './config'
import { renderScene } from './renderer'
import { loadCharacterSprites } from './sprites'

function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by)
}

function lerp(start, end, t) {
  return start + (end - start) * t
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function getTerraceLiftAtX(playerCenterX, currentStageIndex) {
  if (STAGES[currentStageIndex]?.id !== 'indonesia') return 0

  const start = INDONESIA_TERRACES.x
  const end = INDONESIA_TERRACES.x + INDONESIA_TERRACES.width
  if (playerCenterX <= start || playerCenterX >= end) return 0

  const progress = (playerCenterX - start) / (end - start)
  const slope = progress <= 0.5 ? progress / 0.5 : (1 - progress) / 0.5
  return INDONESIA_TERRACES.peakLift * clamp(slope, 0, 1)
}

function getStoryFocusZone(state) {
  if (state.mode !== 'play' || state.travel.active || state.birthDropActive) return null
  const stage = STAGES[state.currentStageIndex]
  if (!stage) return null

  const playerCenterX = state.player.x + state.player.w / 2

  if (stage.id === 'taiwan-born') {
    const center = HOSPITAL.x + HOSPITAL.width / 2
    const centerBandHalf = HOSPITAL.width * 0.1
    if (Math.abs(playerCenterX - center) <= centerBandHalf) return 'hospital'
    return null
  }

  if (stage.id === 'indonesia') {
    const terraceCenter = INDONESIA_TERRACES.x + INDONESIA_TERRACES.width / 2 + 15
    const terraceBandHalf = INDONESIA_TERRACES.width * 0.1
    if (Math.abs(playerCenterX - terraceCenter) <= terraceBandHalf) return 'terrace'

    const schoolCenter = stage.start + 750
    const schoolBandHalf = 280 * 0.1
    if (Math.abs(playerCenterX - schoolCenter) <= schoolBandHalf) return 'school'
  }

  if (stage.id === 'taiwan-return') {
    const ntuCenter = stage.start + 330
    const ntuBandHalf = 260 * 0.1
    if (Math.abs(playerCenterX - ntuCenter) <= ntuBandHalf) return 'ntu'

    const militaryCenter = stage.start + 740
    const militaryBandHalf = 250 * 0.1
    if (Math.abs(playerCenterX - militaryCenter) <= militaryBandHalf) return 'military'

    const companyCenter = stage.start + 1120
    const companyBandHalf = 280 * 0.1
    if (Math.abs(playerCenterX - companyCenter) <= companyBandHalf) return 'company'
  }

  if (stage.id === 'melbourne-master') {
    const monashStudyCenter = stage.start + 470
    const monashStudyBandHalf = 260 * 0.1
    if (Math.abs(playerCenterX - monashStudyCenter) <= monashStudyBandHalf) return 'monashStudy'
  }

  return null
}

export function useAboutGame(canvasRef) {
  const stageLabel = ref('Spirit Space')
  const helperLabel = ref('Use ↑↓←→ to control')
  const modeLabel = ref('Intro')

  const state = {
    canvas: null,
    ctx: null,
    rafId: null,
    lastTime: 0,
    mode: 'intro',
    currentStageIndex: 0,
    lockedMinX: STAGES[1].start,
    characterKey: 'spirit',
    hintText: '',
    hintTimer: 0,
    time: 0,
    birthDropActive: false,
    birthDropX: 0,
    world: {
      width: WORLD.width,
      height: WORLD.height,
      groundY: 0,
    },
    camera: {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    },
    portal: {
      x: PORTAL.x,
      y: 0,
    },
    player: {
      x: 120,
      y: 160,
      w: PLAYER.width,
      h: PLAYER.height,
      vx: 0,
      vy: 0,
      onGround: false,
    },
    travel: {
      active: false,
      timer: 0,
      duration: 1,
      fromStage: 1,
      toStage: 2,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      planeX: 0,
      planeY: 0,
    },
    storyFocusKey: '',
    autoJumpQueue: 0,
    autoJumpTimer: 0,
    autoJumpLockTimer: 0,
    autoJumpLockX: 0,
    seenAutoJumpZones: {
      hospital: false,
      terrace: false,
      school: false,
      ntu: false,
      military: false,
      company: false,
      monashStudy: false,
    },
    sprites: loadCharacterSprites(),
  }

  const keys = new Set()

  function updateCharacter() {
    if (state.mode === 'intro') {
      state.characterKey = 'spirit'
      return
    }

    if (state.travel.active) {
      state.characterKey = 'traveler'
      return
    }

    if (state.currentStageIndex === 1) state.characterKey = 'baby'
    if (state.currentStageIndex === 2) state.characterKey = 'child'
    if (state.currentStageIndex === 3) state.characterKey = 'student'
    if (state.currentStageIndex >= 4) state.characterKey = 'master'
  }

  function showHint(text, duration = 1.2) {
    state.hintText = text
    state.hintTimer = duration
  }

  function tickHint(dt) {
    if (state.hintTimer <= 0) return
    state.hintTimer = Math.max(0, state.hintTimer - dt)
    if (state.hintTimer === 0) {
      state.hintText = ''
    }
  }

  function syncHud() {
    stageLabel.value = STAGES[state.currentStageIndex].title
    modeLabel.value = state.mode === 'intro' ? 'Intro' : 'Play'

    if (state.mode === 'intro') {
      helperLabel.value = 'Use ↑↓←→ to control'
      return
    }

    if (state.hintText) {
      helperLabel.value = state.hintText
      return
    }

    if (state.travel.active) {
      helperLabel.value = 'Flying across the ocean...'
      return
    }

    if (state.currentStageIndex < STAGES.length - 1) {
      helperLabel.value = 'Reach the airport at land edge to travel.'
      return
    }

    helperLabel.value = 'You reached the current chapter in Melbourne.'
  }

  function resizeCanvas() {
    if (!state.canvas || !state.ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = state.canvas.getBoundingClientRect()

    state.canvas.width = Math.floor(rect.width * dpr)
    state.canvas.height = Math.floor(rect.height * dpr)
    state.ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    state.camera.w = rect.width
    state.camera.h = rect.height
    state.world.groundY = state.world.height - WORLD.groundPadding
    state.portal.x = STAGES[0].end
    state.portal.y = state.world.groundY - 200
  }

  function startIntroMode() {
    state.mode = 'intro'
    state.currentStageIndex = 0
    state.birthDropActive = false
    state.travel.active = false
    state.travel.timer = 0
    state.player.x = 120
    state.player.y = state.world.groundY - state.player.h - 220
    state.player.vx = 0
    state.player.vy = 0
    state.player.onGround = false
    state.storyFocusKey = ''
    state.autoJumpQueue = 0
    state.autoJumpTimer = 0
    state.autoJumpLockTimer = 0
    state.autoJumpLockX = 0
    state.seenAutoJumpZones.hospital = false
    state.seenAutoJumpZones.terrace = false
    state.seenAutoJumpZones.school = false
    state.seenAutoJumpZones.ntu = false
    state.seenAutoJumpZones.military = false
    state.seenAutoJumpZones.company = false
    state.seenAutoJumpZones.monashStudy = false
    updateCharacter()
    syncHud()
  }

  function startPlayMode() {
    state.mode = 'play'
    state.currentStageIndex = 1
    state.lockedMinX = STAGES[1].start
    state.player.x = HOSPITAL.x + HOSPITAL.width / 2 - state.player.w / 2
    state.birthDropX = state.player.x
    state.birthDropActive = true
    state.player.y = state.world.groundY - state.player.h - 260
    state.player.vx = 0
    state.player.vy = 0
    state.player.onGround = false
    state.storyFocusKey = ''
    state.autoJumpQueue = 0
    state.autoJumpTimer = 0
    state.autoJumpLockTimer = 0
    state.autoJumpLockX = 0
    state.seenAutoJumpZones.hospital = false
    state.seenAutoJumpZones.terrace = false
    state.seenAutoJumpZones.school = false
    state.seenAutoJumpZones.ntu = false
    state.seenAutoJumpZones.military = false
    state.seenAutoJumpZones.company = false
    state.seenAutoJumpZones.monashStudy = false
    updateCharacter()
    syncHud()
  }

  function startTravel(toStageIndex) {
    const fromStage = STAGES[state.currentStageIndex]
    const toStage = STAGES[toStageIndex]

    state.travel.active = true
    state.travel.timer = 0
    state.travel.fromStage = state.currentStageIndex
    state.travel.toStage = toStageIndex
    state.travel.startX = fromStage.end - 60
    state.travel.startY = state.world.groundY - 170
    state.travel.endX = toStage.start + 60
    state.travel.endY = state.world.groundY - 170
    state.travel.planeX = state.travel.startX
    state.travel.planeY = state.travel.startY

    state.player.vx = 0
    state.player.vy = 0
    state.player.onGround = false
    state.storyFocusKey = ''
    state.autoJumpQueue = 0
    state.autoJumpTimer = 0
    state.autoJumpLockTimer = 0
    state.autoJumpLockX = 0
    updateCharacter()
    syncHud()
  }

  function completeTravel() {
    state.travel.active = false
    state.currentStageIndex = state.travel.toStage
    state.lockedMinX = STAGES[state.currentStageIndex].start
    state.player.x = STAGES[state.currentStageIndex].start + 90
    state.player.y = state.world.groundY - state.player.h
    state.player.vx = 0
    state.player.vy = 0
    state.player.onGround = true
    state.storyFocusKey = ''
    state.autoJumpQueue = 0
    state.autoJumpTimer = 0
    state.autoJumpLockTimer = 0
    state.autoJumpLockX = 0
    updateCharacter()
    syncHud()
  }

  function updateIntro(dt) {
    const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A')
    const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D')
    const up = keys.has('ArrowUp') || keys.has('w') || keys.has('W')
    const down = keys.has('ArrowDown') || keys.has('s') || keys.has('S')

    const flySpeed = 280
    const introForwardSpeedMultiplier = 2
    let vx = 0
    let vy = 0

    if (left) vx -= flySpeed
    if (right) vx += flySpeed * introForwardSpeedMultiplier
    if (up) vy -= flySpeed
    if (down) vy += flySpeed

    state.player.x += vx * dt
    state.player.y += vy * dt

    const introMaxX = Math.max(
      STAGES[0].end - state.player.w - 40,
      state.portal.x - state.player.w / 2,
    )
    state.player.x = clamp(state.player.x, 40, introMaxX)
    state.player.y = clamp(state.player.y, 30, state.world.groundY - state.player.h - 10)

    const centerX = state.player.x + state.player.w / 2
    const centerY = state.player.y + state.player.h / 2
    if (dist(centerX, centerY, state.portal.x, state.portal.y) <= PORTAL.radius) {
      startPlayMode()
    }
  }

  function updateTravel(dt) {
    state.travel.timer += dt
    const raw = clamp(state.travel.timer / state.travel.duration, 0, 1)
    const progress = easeInOut(raw)

    state.travel.planeX = lerp(state.travel.startX, state.travel.endX, progress)
    state.travel.planeY =
      lerp(state.travel.startY, state.travel.endY, progress) - Math.sin(progress * Math.PI) * 35

    state.player.x = state.travel.planeX - state.player.w * 0.15
    state.player.y = state.travel.planeY - state.player.h * 0.22

    if (raw >= 1) completeTravel()
  }

  function updatePlay(dt) {
    if (state.travel.active) {
      updateTravel(dt)
      return
    }

    if (state.birthDropActive) {
      state.player.vx = 0
      state.player.x = state.birthDropX
      state.player.vy += PHYSICS.gravity * dt
      state.player.vy = Math.min(state.player.vy, PHYSICS.maxFall)
      state.player.y += state.player.vy * dt

      const groundTop = state.world.groundY - state.player.h
      if (state.player.y >= groundTop) {
        state.player.y = groundTop
        state.player.vy = 0
        state.player.onGround = true
        state.birthDropActive = false
      } else {
        state.player.onGround = false
      }

      updateCharacter()
      return
    }

    const left = keys.has('ArrowLeft') || keys.has('a') || keys.has('A')
    const right = keys.has('ArrowRight') || keys.has('d') || keys.has('D')
    const controlsLocked = state.autoJumpLockTimer > 0
    const forwardSpeedMultiplier = 2

    if (controlsLocked) {
      state.autoJumpLockTimer = Math.max(0, state.autoJumpLockTimer - dt)
      state.player.vx = 0
      state.player.x = state.autoJumpLockX
    } else if (left && !right) state.player.vx = -PLAYER.speed
    else if (right && !left) state.player.vx = PLAYER.speed * forwardSpeedMultiplier
    else state.player.vx *= state.player.onGround ? PHYSICS.frictionGround : PHYSICS.frictionAir

    state.player.vy += PHYSICS.gravity * dt
    state.player.vy = Math.min(state.player.vy, PHYSICS.maxFall)

    if (!controlsLocked) {
      state.player.x += state.player.vx * dt
    }

    const playerCenter = state.player.x + state.player.w / 2
    const detectedStageIndex = findStageIndexByX(playerCenter)
    if (detectedStageIndex >= 1) {
      state.currentStageIndex = detectedStageIndex
    }

    const stage = STAGES[state.currentStageIndex]
    const stageMaxX = stage.end - state.player.w

    if (state.player.x <= state.lockedMinX) {
      state.player.x = state.lockedMinX
      if (left) showHint('Life moves on')
    }

    state.player.x = clamp(state.player.x, state.lockedMinX, stageMaxX)

    state.player.y += state.player.vy * dt

    const currentCenterX = state.player.x + state.player.w / 2
    const terraceLift = getTerraceLiftAtX(currentCenterX, state.currentStageIndex)
    const groundTop = state.world.groundY - state.player.h - terraceLift - 30
    if (state.player.y >= groundTop) {
      state.player.y = groundTop
      state.player.vy = 0
      state.player.onGround = true
    } else {
      state.player.onGround = false
    }

    const inAirportZone = state.player.x >= stage.end - AIRPORT_ZONE - 40
    if (
      inAirportZone &&
      state.currentStageIndex < STAGES.length - 1 &&
      state.player.onGround &&
      right
    ) {
      const nextStageIndex = findNextPlayableStage(state.currentStageIndex)
      startTravel(nextStageIndex)
    }

    const focusZone = getStoryFocusZone(state)
    if (
      focusZone &&
      focusZone !== state.storyFocusKey &&
      state.seenAutoJumpZones[focusZone] === false
    ) {
      state.storyFocusKey = focusZone
      state.seenAutoJumpZones[focusZone] = true
      state.autoJumpQueue = 2
      state.autoJumpTimer = 0
      state.autoJumpLockTimer = 0.5
      state.autoJumpLockX = state.player.x
    } else if (!focusZone) {
      state.storyFocusKey = ''
    }

    if (state.autoJumpQueue > 0) {
      state.autoJumpTimer = Math.max(0, state.autoJumpTimer - dt)
      if (state.autoJumpTimer === 0 && state.player.onGround) {
        state.player.vy = -Math.round(PLAYER.jumpVelocity * 0.58)
        state.player.onGround = false
        state.autoJumpQueue -= 1
        state.autoJumpTimer = 0.08
      }
    }

    updateCharacter()
  }

  function updateCamera(dt) {
    const follow = state.mode === 'intro' ? 8 : 11
    const targetX = state.player.x + state.player.w / 2 - state.camera.w / 2
    const targetY =
      state.mode === 'intro' ? state.player.y + state.player.h / 2 - state.camera.h / 2 : 0

    state.camera.x += (targetX - state.camera.x) * Math.min(1, follow * dt)
    state.camera.x = clamp(state.camera.x, 0, Math.max(0, state.world.width - state.camera.w))

    if (state.mode === 'intro') {
      state.camera.y += (targetY - state.camera.y) * Math.min(1, follow * dt)
      state.camera.y = clamp(state.camera.y, 0, Math.max(0, state.world.height - state.camera.h))
    } else {
      state.camera.y = 0
    }
  }

  function loop(t) {
    if (!state.ctx) return

    const dt = Math.min(0.033, (t - state.lastTime) / 1000)
    state.lastTime = t
    state.time += dt

    tickHint(dt)

    if (state.mode === 'intro') updateIntro(dt)
    else updatePlay(dt)

    updateCamera(dt)
    syncHud()
    renderScene(state.ctx, state)

    state.rafId = requestAnimationFrame(loop)
  }

  function onKeyDown(e) {
    const block = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' ']
    if (block.includes(e.key)) e.preventDefault()
    keys.add(e.key)
    const isJumpKey = e.code === 'Space' || e.key === 'ArrowUp'

    if (
      isJumpKey &&
      state.mode === 'play' &&
      !state.travel.active &&
      !state.birthDropActive &&
      state.autoJumpLockTimer <= 0 &&
      state.player.onGround
    ) {
      state.player.vy = -PLAYER.jumpVelocity
      state.player.onGround = false
    }
  }

  function onKeyUp(e) {
    keys.delete(e.key)
  }

  function restartGame() {
    keys.clear()
    state.hintText = ''
    state.hintTimer = 0

    state.travel.active = false
    state.travel.timer = 0

    resizeCanvas()
    startIntroMode()
  }

  onMounted(() => {
    state.canvas = canvasRef.value
    if (!state.canvas) return

    state.ctx = state.canvas.getContext('2d')
    if (!state.ctx) return

    window.addEventListener('keydown', onKeyDown, { passive: false })
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('resize', resizeCanvas)

    resizeCanvas()
    startIntroMode()

    state.lastTime = performance.now()
    state.rafId = requestAnimationFrame(loop)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(state.rafId)
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('resize', resizeCanvas)
  })

  return {
    stageLabel,
    helperLabel,
    modeLabel,
    restartGame,
  }
}
