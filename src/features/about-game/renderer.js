import { AIRPORT_ZONE, HOSPITAL, INDONESIA_TERRACES, PORTAL, STAGES } from './config'

const airportImage = new Image()
airportImage.src = new URL('../../assets/game/airport.png', import.meta.url).href
const hospitalImage = new Image()
hospitalImage.src = new URL('../../assets/game/Hospital.png', import.meta.url).href
const terracesImage = new Image()
terracesImage.src = new URL('../../assets/game/terraces.png', import.meta.url).href
const schoolImage = new Image()
schoolImage.src = new URL('../../assets/game/school.png', import.meta.url).href
const ntuImage = new Image()
ntuImage.src = new URL('../../assets/game/ntu.png', import.meta.url).href
const militaryImage = new Image()
militaryImage.src = new URL('../../assets/game/military.png', import.meta.url).href
const companyImage = new Image()
companyImage.src = new URL('../../assets/game/company.png', import.meta.url).href
const monashImage = new Image()
monashImage.src = new URL('../../assets/game/monash.png', import.meta.url).href

const taiwanFlagImage = new Image()
taiwanFlagImage.src = new URL('../../assets/game/Taiwan.png', import.meta.url).href
const indonesiaFlagImage = new Image()
indonesiaFlagImage.src = new URL('../../assets/game/Indonesia.png', import.meta.url).href
const australiaFlagImage = new Image()
australiaFlagImage.src = new URL('../../assets/game/Australia.png', import.meta.url).href

let taiwanFlagFlippedImage = null
let australiaFlagFlippedImage = null
const FOCUS_STAGE_ID = null

const ISO = {
  xScale: 0.58,
  yScale: 0.24,
  depthX: 1.0,
  depthY: 0.5,
  originX: 140,
  originYRatio: 0.8,
  laneDepth: 165,
}

function createFlippedFlagImage(image) {
  if (!image.complete || image.naturalWidth === 0) return null
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(image, 0, 0)
  return canvas
}

function getFlippedFlagImage(stageId) {
  if (stageId === 'melbourne-master') {
    if (!australiaFlagFlippedImage) {
      australiaFlagFlippedImage = createFlippedFlagImage(australiaFlagImage)
    }
    return australiaFlagFlippedImage || australiaFlagImage
  }

  if (stageId !== 'indonesia') {
    if (!taiwanFlagFlippedImage) {
      taiwanFlagFlippedImage = createFlippedFlagImage(taiwanFlagImage)
    }
    return taiwanFlagFlippedImage || taiwanFlagImage
  }

  return indonesiaFlagImage
}

function projectPoint(worldX, worldZ, worldY, camera) {
  const dx = worldX - camera.x
  return {
    x: ISO.originX + dx * ISO.xScale + worldZ * ISO.depthX,
    y: camera.h * ISO.originYRatio - dx * ISO.yScale + worldZ * ISO.depthY - worldY,
  }
}

function isStageVisible(stageId, mode) {
  if (mode === 'intro') return stageId === 'space'
  if (!FOCUS_STAGE_ID) return true
  return stageId === FOCUS_STAGE_ID
}

function drawQuad(ctx, a, b, c, d, color, stroke = null) {
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.lineTo(c.x, c.y)
  ctx.lineTo(d.x, d.y)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()

  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1.2
    ctx.stroke()
  }
}

function drawStars(ctx, stage, camera) {
  if (stage.scenery !== 'stars') return

  const width = stage.end - stage.start
  ctx.fillStyle = 'rgba(255,255,255,0.75)'

  for (let i = 0; i < 34; i += 1) {
    const worldX = stage.start + ((i * 97) % width)
    const pt = projectPoint(worldX, 20 + ((i * 29) % 120), 230 + ((i * 41) % 220), camera)
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, i % 3 === 0 ? 2.1 : 1.3, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawStageSurfaces(ctx, camera, mode) {
  const stages = STAGES.filter((stage) => isStageVisible(stage.id, mode))

  for (const stage of stages) {
    const a = projectPoint(stage.start, 0, 0, camera)
    const b = projectPoint(stage.end, 0, 0, camera)
    const c = projectPoint(stage.end, ISO.laneDepth, 0, camera)
    const d = projectPoint(stage.start, ISO.laneDepth, 0, camera)

    drawQuad(ctx, a, b, c, d, stage.ground, 'rgba(0,0,0,0.12)')

    const frontDrop = 150
    drawQuad(
      ctx,
      d,
      c,
      { x: c.x, y: c.y + frontDrop },
      { x: d.x, y: d.y + frontDrop },
      'rgba(0,0,0,0.18)',
    )

    drawStars(ctx, stage, camera)
  }
}

function drawOceans(ctx, camera, mode) {
  if (mode !== 'play') return
  if (FOCUS_STAGE_ID) return
  const oceanLevelY = 0
  const oceanFrontDrop = 150

  for (let i = 1; i < STAGES.length - 1; i += 1) {
    const oceanStart = STAGES[i].end
    const oceanEnd = STAGES[i + 1].start

    const a = projectPoint(oceanStart, 0, oceanLevelY, camera)
    const b = projectPoint(oceanEnd, 0, oceanLevelY, camera)
    const c = projectPoint(oceanEnd, ISO.laneDepth, oceanLevelY, camera)
    const d = projectPoint(oceanStart, ISO.laneDepth, oceanLevelY, camera)

    drawQuad(ctx, a, b, c, d, '#2f7ebc', 'rgba(255,255,255,0.2)')
    const cb = { x: c.x, y: c.y + oceanFrontDrop }
    const db = { x: d.x, y: d.y + oceanFrontDrop }
    drawQuad(ctx, d, c, cb, db, 'rgba(17,74,119,0.78)', 'rgba(255,255,255,0.08)')

    ctx.strokeStyle = 'rgba(255,255,255,0.34)'
    ctx.lineWidth = 1.4
    for (let row = 0; row < 3; row += 1) {
      const z = 38 + row * 34
      ctx.beginPath()
      for (let k = 0; k <= 12; k += 1) {
        const x = oceanStart + ((oceanEnd - oceanStart) * k) / 12
        const pt = projectPoint(x, z, oceanLevelY + Math.sin((k + row) * 0.7) * 1.4, camera)
        if (k === 0) ctx.moveTo(pt.x, pt.y)
        else ctx.lineTo(pt.x, pt.y)
      }
      ctx.stroke()
    }

    const fishCount = 4
    for (let fish = 0; fish < fishCount; fish += 1) {
      const t = (fish + 1) / (fishCount + 1)
      const depth = (Math.sin((i + fish) * 1.7) + 1) * 0.5
      const topX = d.x + (c.x - d.x) * t
      const topY = d.y + (c.y - d.y) * t
      const sideX = topX
      const sideY = topY + 28 + depth * 62
      const fishW = 16 + depth * 10
      const fishH = 6 + depth * 4

      ctx.fillStyle = 'rgba(167,227,255,0.72)'
      ctx.beginPath()
      ctx.ellipse(sideX, sideY, fishW * 0.5, fishH * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()

      const tailDir = fish % 2 === 0 ? -1 : 1
      ctx.beginPath()
      ctx.moveTo(sideX + tailDir * (fishW * 0.5), sideY)
      ctx.lineTo(sideX + tailDir * (fishW * 0.5 + 7), sideY - 4)
      ctx.lineTo(sideX + tailDir * (fishW * 0.5 + 7), sideY + 4)
      ctx.closePath()
      ctx.fill()
    }
  }
}

function drawBillboard(ctx, image, camera, worldX, width, height, opts = {}) {
  const worldZ = opts.worldZ ?? 108
  const worldY = opts.worldY ?? 0
  const yOffset = opts.yOffset ?? 0

  const p = projectPoint(worldX, worldZ, worldY, camera)
  const x = p.x - width / 2
  const y = p.y - height + yOffset

  if (image?.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, x, y, width, height)
  }
}

function drawLandmarks(ctx, camera, world) {
  if (isStageVisible('taiwan-born', 'play')) {
    drawBillboard(
      ctx,
      hospitalImage,
      camera,
      HOSPITAL.x + HOSPITAL.width / 2,
      HOSPITAL.width,
      HOSPITAL.height,
      {
        yOffset: 10,
      },
    )
  }

  const indonesia = STAGES.find((s) => s.id === 'indonesia')
  if (indonesia && isStageVisible('indonesia', 'play')) {
    drawBillboard(
      ctx,
      terracesImage,
      camera,
      INDONESIA_TERRACES.x + INDONESIA_TERRACES.width / 2,
      INDONESIA_TERRACES.width,
      INDONESIA_TERRACES.height,
      { yOffset: INDONESIA_TERRACES.groundOffset },
    )
    drawBillboard(ctx, schoolImage, camera, indonesia.start + 700, 280, 200, { yOffset: -20 })
  }

  const taiwanReturn = STAGES.find((s) => s.id === 'taiwan-return')
  if (taiwanReturn && isStageVisible('taiwan-return', 'play')) {
    drawBillboard(ctx, ntuImage, camera, taiwanReturn.start + 230, 260, 180, { yOffset: 20 })
    drawBillboard(ctx, militaryImage, camera, taiwanReturn.start + 640, 250, 200, { yOffset: 55 })
    drawBillboard(ctx, companyImage, camera, taiwanReturn.start + 970, 280, 200, { yOffset: -5 })
  }

  const melbourne = STAGES.find((s) => s.id === 'melbourne-master')
  if (melbourne && isStageVisible('melbourne-master', 'play')) {
    drawBillboard(ctx, monashImage, camera, melbourne.start + 250, 330, 250, { yOffset: 55 })
  }
}

function getFlagConfig(stageId) {
  if (stageId === 'indonesia') {
    return {
      image: getFlippedFlagImage(stageId),
      width: 74,
      height: 42,
      wave: 5.8,
      reverseSample: false,
    }
  }
  if (stageId === 'melbourne-master') {
    return {
      image: getFlippedFlagImage(stageId),
      width: 98,
      height: 56,
      wave: 4.2,
      reverseSample: true,
    }
  }
  return {
    image: getFlippedFlagImage(stageId),
    width: 92,
    height: 52,
    wave: 4.2,
    reverseSample: true,
  }
}

function drawWavingFlag(ctx, camera, poleWorldX, poleWorldZ, time, flagConfig) {
  const poleHeight = 108
  const flagWidth = flagConfig.width
  const flagHeight = flagConfig.height
  const waveStrength = flagConfig.wave
  const flagImage = flagConfig.image
  const reverseSample = flagConfig.reverseSample
  const srcWidth = flagImage?.naturalWidth ?? flagImage?.width ?? 0
  const srcHeight = flagImage?.naturalHeight ?? flagImage?.height ?? 0
  const isDrawable = srcWidth > 0 && srcHeight > 0

  const base = projectPoint(poleWorldX, poleWorldZ, 0, camera)
  const poleTop = { x: base.x, y: base.y - poleHeight }
  ctx.fillStyle = '#4c4c4c'
  ctx.fillRect(poleTop.x, poleTop.y, 4, poleHeight)

  const strips = 18
  for (let i = 0; i < strips; i += 1) {
    const ratio = i / (strips - 1)
    const wave = Math.sin(ratio * 8 - time * 5.5) * (waveStrength - ratio * 2.1)
    const x = poleTop.x - ratio * flagWidth
    const y = poleTop.y + 6 + wave
    const sliceW = flagWidth / strips
    const srcIndex = reverseSample ? strips - 1 - i : i
    const srcX = (srcWidth / strips) * srcIndex
    const srcW = srcWidth / strips
    const drawW = sliceW + 1.2

    if (isDrawable) {
      ctx.drawImage(flagImage, srcX, 0, srcW, srcHeight, x - drawW, y, drawW, flagHeight)
    }
  }
}

function drawFlags(ctx, camera, mode, time) {
  if (mode !== 'play') return
  const flagEdgeOffset = 12
  const flagTopDepth = 8

  for (let i = 1; i < STAGES.length; i += 1) {
    const stage = STAGES[i]
    if (!isStageVisible(stage.id, mode)) continue
    const poleWorldX = stage.start + flagEdgeOffset
    const flagConfig = getFlagConfig(stage.id)
    drawWavingFlag(ctx, camera, poleWorldX, flagTopDepth, time + i * 0.6, flagConfig)
  }
}

function drawAirports(ctx, camera, mode) {
  if (mode !== 'play') return
  const airportScale = 2

  for (let i = 1; i < STAGES.length - 1; i += 1) {
    const stage = STAGES[i]
    if (!isStageVisible(stage.id, mode)) continue
    const worldX = stage.end - AIRPORT_ZONE
    drawBillboard(
      ctx,
      airportImage,
      camera,
      worldX - 40,
      AIRPORT_ZONE * airportScale,
      125 * airportScale,
      { yOffset: 10 },
    )
  }
}

function drawPortal(ctx, camera, portal, world) {
  const lift = world.groundY - portal.y
  const p = projectPoint(portal.x, 98, lift, camera)

  ctx.beginPath()
  ctx.arc(p.x, p.y, PORTAL.radius + 26, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(p.x, p.y, PORTAL.radius, 0, Math.PI * 2)
  ctx.lineWidth = 5
  ctx.strokeStyle = 'rgba(255,255,255,0.95)'
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '14px system-ui'
  ctx.fillText('Move into the circle to be born', p.x + 64, p.y + 6)
}

function drawPortalHintArrow(ctx, camera, portal, world, time) {
  const lift = world.groundY - portal.y
  const p = projectPoint(portal.x, 98, lift, camera)
  const bob = Math.sin(time * 4.2) * 6
  const tipX = p.x
  const tipY = p.y - PORTAL.radius - 14 + bob
  const baseY = tipY - 18

  ctx.fillStyle = '#ff2b2b'
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - 12, baseY)
  ctx.lineTo(tipX + 12, baseY)
  ctx.closePath()
  ctx.fill()
}

function drawAirportHintArrow(ctx, camera, currentStageIndex, time, travel) {
  if (travel?.active) return
  if (currentStageIndex < 1 || currentStageIndex >= STAGES.length - 1) return
  const stage = STAGES[currentStageIndex]
  const airportWorldX = stage.end - AIRPORT_ZONE - 40
  const airportBase = projectPoint(airportWorldX, 108, 0, camera)
  const bob = Math.sin(time * 4.4) * 6
  const tipX = airportBase.x
  const tipY = airportBase.y - 276 + bob
  const stemTopY = tipY - 22

  ctx.strokeStyle = '#ff2b2b'
  ctx.lineWidth = 5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(tipX, stemTopY)
  ctx.lineTo(tipX, tipY - 2)
  ctx.stroke()

  ctx.fillStyle = '#ff2b2b'
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - 13, tipY - 18)
  ctx.lineTo(tipX + 13, tipY - 18)
  ctx.closePath()
  ctx.fill()
}

function drawCharacter(ctx, player, camera, sprite, label, characterKey, world) {
  const scale = characterKey === 'spirit' ? 1 : 1.35
  const drawW = player.w * scale
  const drawH = player.h * scale
  const groundShift =
    characterKey === 'child' || characterKey === 'student' || characterKey === 'master' ? 10 : 0

  const playerCenterX = player.x + player.w / 2
  const playerLift = world.groundY - player.h - player.y
  const base = projectPoint(playerCenterX, 110, playerLift, camera)

  const shadow = projectPoint(playerCenterX, 120, 0, camera)
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(shadow.x, shadow.y + 4, 22, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, base.x - drawW / 2, base.y - drawH + groundShift, drawW, drawH)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(base.x - player.w / 2, base.y - player.h, player.w, player.h)
  }

  if (label) {
    ctx.fillStyle = '#0f0f0f'
    ctx.font = '700 18px system-ui'
    ctx.fillText(label, base.x - 18, base.y - drawH - 10)
  }
}

function drawTerraceStoryCard(ctx, camera, player, world, currentStageIndex, travel) {
  if (travel?.active) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'indonesia') return

  const playerCenterX = player.x + player.w / 2
  const terraceStart = INDONESIA_TERRACES.x
  const terraceEnd = INDONESIA_TERRACES.x + INDONESIA_TERRACES.width
  const terraceCenter = (terraceStart + terraceEnd) / 2
  const centerBandHalf = (terraceEnd - terraceStart) * 0.1
  const fadeMargin = 130
  const dx = Math.abs(playerCenterX - terraceCenter)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const playerLift = world.groundY - player.h - player.y
  const anchor = projectPoint(playerCenterX, 110, playerLift, camera)
  const cardW = 560
  const cardH = 176
  const x = anchor.x - cardW / 2
  const y = anchor.y - 286

  ctx.fillStyle = `rgba(255,255,255,${0.97 * alpha})`
  ctx.strokeStyle = `rgba(22,26,36,${0.7 * alpha})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(x, y, cardW, cardH, 12)
  ctx.fill()
  ctx.stroke()

  const imageBoxX = x + 18
  const imageBoxY = y + 18
  const imageBoxW = 132
  const imageBoxH = 132

  ctx.strokeStyle = `rgba(124,132,151,${0.92 * alpha})`
  ctx.setLineDash([6, 4])
  ctx.strokeRect(imageBoxX, imageBoxY, imageBoxW, imageBoxH)
  ctx.setLineDash([])

  ctx.fillStyle = `rgba(110,118,138,${0.9 * alpha})`
  ctx.font = '600 14px system-ui'
  ctx.fillText('Add photo here', imageBoxX + 21, imageBoxY + 72)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  ctx.font = '700 29px system-ui'
  ctx.fillText('1993 - A New Home', x + 176, y + 66)
  ctx.font = '600 23px system-ui'
  ctx.fillText('Relocated to Indonesia with my family,', x + 176, y + 106)
  ctx.fillText('where I spent my growing-up years.', x + 176, y + 138)
}

export function renderScene(ctx, state) {
  const { camera, world, mode, portal, player, currentStageIndex, sprites, characterKey, time, travel } =
    state
  const stageIndex = Math.max(currentStageIndex, 0)
  const stage = STAGES[stageIndex]

  const gradient = ctx.createLinearGradient(0, 0, 0, camera.h)
  gradient.addColorStop(0, stage.skyTop)
  gradient.addColorStop(1, stage.skyBottom)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, camera.w, camera.h)

  drawStageSurfaces(ctx, camera, mode)
  drawOceans(ctx, camera, mode)

  if (mode === 'intro') {
    drawPortal(ctx, camera, portal, world)
    drawPortalHintArrow(ctx, camera, portal, world, time)
  } else {
    drawAirports(ctx, camera, mode)
    drawLandmarks(ctx, camera, world)
    drawFlags(ctx, camera, mode, time)
    drawAirportHintArrow(ctx, camera, currentStageIndex, time, travel)
  }

  const label = characterKey === 'traveler' ? '' : 'Alan'
  drawCharacter(ctx, player, camera, sprites[characterKey], label, characterKey, world)
  drawTerraceStoryCard(ctx, camera, player, world, currentStageIndex, travel)

  const isSpaceStage = stage.id === 'space'
  ctx.fillStyle = isSpaceStage ? 'rgba(255,255,255,0.95)' : '#0f0f0f'
  ctx.font = '700 22px system-ui'
  ctx.fillText(stage.title, 24, 36)
}
