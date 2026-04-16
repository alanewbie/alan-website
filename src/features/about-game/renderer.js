import {
  AIRPORT_ZONE,
  HOSPITAL,
  INDONESIA_TERRACES,
  MELBOURNE_ROAD_END_OFFSET,
  PORTAL,
  STAGES,
} from './config'

const airportImage = new Image()
airportImage.src = new URL('../../assets/game/airport.png', import.meta.url).href
const hospitalImage = new Image()
hospitalImage.src = new URL('../../assets/game/Hospital.png', import.meta.url).href
const terracesImage = new Image()
terracesImage.src = new URL('../../assets/game/terraces.png', import.meta.url).href
const terracesStoryImage = new Image()
terracesStoryImage.src = new URL('../../assets/game/terracespic.png', import.meta.url).href
const schoolImage = new Image()
schoolImage.src = new URL('../../assets/game/school.png', import.meta.url).href
const schoolStoryImage = new Image()
schoolStoryImage.src = new URL('../../assets/game/schoolpic.png', import.meta.url).href
const ntuImage = new Image()
ntuImage.src = new URL('../../assets/game/ntu.png', import.meta.url).href
const ntuStoryImage = new Image()
ntuStoryImage.src = new URL('../../assets/game/ntupic.png', import.meta.url).href
const militaryImage = new Image()
militaryImage.src = new URL('../../assets/game/military.png', import.meta.url).href
const militaryStoryImage = new Image()
militaryStoryImage.src = new URL('../../assets/game/militarypic.png', import.meta.url).href
const companyImage = new Image()
companyImage.src = new URL('../../assets/game/company.png', import.meta.url).href
const companyStoryImage = new Image()
companyStoryImage.src = new URL('../../assets/game/companypic.png', import.meta.url).href
const monashImage = new Image()
monashImage.src = new URL('../../assets/game/monash.png', import.meta.url).href
const monash2Image = new Image()
monash2Image.src = new URL('../../assets/game/monash2.png', import.meta.url).href
const monashStoryImage = new Image()
monashStoryImage.src = new URL('../../assets/game/monashpic.png', import.meta.url).href
const questionImage = new Image()
questionImage.src = new URL('../../assets/game/question.png', import.meta.url).href

const taiwanFlagImage = new Image()
taiwanFlagImage.src = new URL('../../assets/game/Taiwan.png', import.meta.url).href
const indonesiaFlagImage = new Image()
indonesiaFlagImage.src = new URL('../../assets/game/Indonesia.png', import.meta.url).href
const australiaFlagImage = new Image()
australiaFlagImage.src = new URL('../../assets/game/Australia.png', import.meta.url).href

let taiwanFlagFlippedImage = null
let australiaFlagFlippedImage = null
const FOCUS_STAGE_ID = null
const INDONESIA_SCHOOL = {
  xOffset: 700,
  width: 280,
  height: 200,
  yOffset: -50,
}
const TAIWAN_NTU = {
  xOffset: 330,
  width: 260,
  height: 180,
  yOffset: 20,
}
const TAIWAN_MILITARY = {
  xOffset: 740,
  width: 250,
  height: 200,
  yOffset: 55,
}
const TAIWAN_COMPANY = {
  xOffset: 1120,
  width: 280,
  height: 200,
  yOffset: -5,
}
const NEXT_JOURNEY_MARKER_OFFSET = 345
const MELBOURNE_STUDY = {
  xOffset: 470,
  width: 260,
}

const ISO = {
  xScale: 0.58,
  yScale: 0.24,
  depthX: 1.0,
  depthY: 0.5,
  originX: 140,
  originYRatio: 0.8,
  laneDepth: 165,
}

function isPhoneLikeCamera(camera) {
  return Math.min(camera.w, camera.h) <= 500 && Math.max(camera.w, camera.h) <= 1100
}

function getSceneScale(camera) {
  const widthScale = camera.w / 1600
  const heightScale = camera.h / 980
  const rawScale = Math.min(widthScale, heightScale) * 0.9
  const baseScale = Math.max(0.7, Math.min(0.9, rawScale))
  const mobileScaleFactor = isPhoneLikeCamera(camera) ? 4 / 5 : 1
  return baseScale * mobileScaleFactor
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
    y: camera.h * ISO.originYRatio - dx * ISO.yScale + worldZ * ISO.depthY - worldY - camera.y,
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

function lerpPoint(a, b, t) {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
  }
}

function drawLineWaveSeaSurface(ctx, a, b, c, d, time, stroke = null) {
  const minX = Math.min(a.x, b.x, c.x, d.x)
  const maxX = Math.max(a.x, b.x, c.x, d.x)
  const minY = Math.min(a.y, b.y, c.y, d.y)
  const maxY = Math.max(a.y, b.y, c.y, d.y)

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.lineTo(c.x, c.y)
  ctx.lineTo(d.x, d.y)
  ctx.closePath()
  ctx.clip()

  const bg = ctx.createLinearGradient(minX, minY, maxX, maxY)
  bg.addColorStop(0, '#2f7ebc')
  bg.addColorStop(0.5, '#2a72ad')
  bg.addColorStop(1, '#25679d')
  ctx.fillStyle = bg
  ctx.fillRect(minX, minY, maxX - minX, maxY - minY)

  const lineCount = 7
  for (let row = 0; row < lineCount; row += 1) {
    const rowRatio = (row + 1) / (lineCount + 1)
    const baseY = minY + (maxY - minY) * rowRatio
    const amp = 3.4 + row * 0.45
    const phase = time * 2 + row * 0.82
    const freq = 0.025 + row * 0.0016

    ctx.beginPath()
    for (let x = minX - 8; x <= maxX + 8; x += 6) {
      const y = baseY + Math.sin(x * freq + phase) * amp
      if (x === minX - 8) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }

    ctx.strokeStyle = `rgba(190,235,255,${Math.max(0.12, 0.28 - row * 0.024)})`
    ctx.lineWidth = row % 2 === 0 ? 1.5 : 1.15
    ctx.stroke()
  }

  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1.2
    ctx.stroke()
  }

  ctx.restore()
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(/\s+/).filter(Boolean)
  if (!words.length) return 0

  let line = words[0]
  let lineCount = 0

  for (let i = 1; i < words.length; i += 1) {
    const testLine = `${line} ${words[i]}`
    if (ctx.measureText(testLine).width <= maxWidth) {
      line = testLine
    } else {
      ctx.fillText(line, x, y + lineCount * lineHeight)
      line = words[i]
      lineCount += 1
    }
  }

  ctx.fillText(line, x, y + lineCount * lineHeight)
  return lineCount + 1
}

function drawStoryCardChrome(ctx, x, y, w, h, alpha, time, phase = 0) {
  const liftIn = (1 - alpha) * 14
  const bob = Math.sin(time * 3.4 + phase) * 1.4 * alpha
  const cardY = y - liftIn - bob

  ctx.fillStyle = `rgba(255,255,255,${0.97 * alpha})`
  ctx.strokeStyle = `rgba(22,26,36,${0.7 * alpha})`
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(x, cardY, w, h, 12)
  ctx.fill()
  ctx.stroke()

  // Subtle top accent + moving sparkle for a fancier appearance.
  ctx.fillStyle = `rgba(255,255,255,${0.2 * alpha})`
  ctx.fillRect(x + 18, cardY + 10, w - 36, 3)
  const sparkleX = x + 22 + ((time * 130 + phase * 57) % Math.max(1, w - 44))
  ctx.beginPath()
  ctx.arc(sparkleX, cardY + 11.5, 1.7, 0, Math.PI * 2)
  ctx.fillStyle = `rgba(255,255,255,${0.4 * alpha})`
  ctx.fill()

  return cardY
}

function drawStoryImageWithOutline(ctx, image, x, y, w, h, alpha) {
  ctx.save()
  ctx.globalAlpha = alpha

  if (image?.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, x, y, w, h)
  } else {
    ctx.strokeStyle = 'rgba(124,132,151,0.92)'
    ctx.setLineDash([6, 4])
    ctx.strokeRect(x, y, w, h)
    ctx.setLineDash([])
  }

  ctx.setLineDash([])
  ctx.lineWidth = 1
  ctx.strokeStyle = 'rgba(0,0,0,0.9)'
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
  ctx.restore()
}

function getStoryCardScale(camera) {
  if (isPhoneLikeCamera(camera)) {
    return Math.max(0.35, Math.min(0.6, getSceneScale(camera)))
  }
  return Math.max(0.52, Math.min(0.9, getSceneScale(camera)))
}

function storyFont(weight, size, scale) {
  const minSize = scale < 0.65 ? 8 : 11
  return `${weight} ${Math.max(minSize, Math.round(size * scale))}px system-ui`
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

    if (stage.scenery !== 'stars' && stage.id !== 'taiwan-born') {
      const beachWidth = 55
      const beachA = projectPoint(stage.start, 0, 0, camera)
      const beachB = projectPoint(stage.start + beachWidth, 0, 0, camera)
      const beachC = projectPoint(stage.start + beachWidth, ISO.laneDepth, 0, camera)
      const beachD = projectPoint(stage.start, ISO.laneDepth, 0, camera)
      drawQuad(ctx, beachA, beachB, beachC, beachD, '#d9c48b', 'rgba(255,255,255,0.16)')
    }

    if (stage.scenery !== 'stars') {
      const roadCenterZ = 110
      const roadHalfWidth = 22
      const roadLiftY = 30
      let roadStartX = stage.start
      let roadEndX = stage.end
      if (stage.id === 'taiwan-born') {
        roadStartX = HOSPITAL.x + HOSPITAL.width / 2
      } else if (stage.id === 'indonesia') {
        roadStartX = INDONESIA_TERRACES.x + INDONESIA_TERRACES.width / 2
      } else if (stage.id === 'melbourne-master') {
        roadEndX = stage.end - MELBOURNE_ROAD_END_OFFSET
      }

      const roadStartA = projectPoint(roadStartX, roadCenterZ - roadHalfWidth, roadLiftY, camera)
      const roadStartB = projectPoint(roadEndX, roadCenterZ - roadHalfWidth, roadLiftY, camera)
      const roadEndB = projectPoint(roadEndX, roadCenterZ + roadHalfWidth, roadLiftY, camera)
      const roadEndA = projectPoint(roadStartX, roadCenterZ + roadHalfWidth, roadLiftY, camera)

      drawQuad(
        ctx,
        roadStartA,
        roadStartB,
        roadEndB,
        roadEndA,
        'rgba(81,89,99,0.94)',
        'rgba(0,0,0,0.2)',
      )

      const laneMarkHalf = 2.2
      const laneMarkLength = 52
      const laneGap = 82
      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      for (let x = roadStartX + 36; x < roadEndX - laneMarkLength; x += laneMarkLength + laneGap) {
        const mA = projectPoint(x, roadCenterZ - laneMarkHalf, roadLiftY, camera)
        const mB = projectPoint(x + laneMarkLength, roadCenterZ - laneMarkHalf, roadLiftY, camera)
        const mC = projectPoint(x + laneMarkLength, roadCenterZ + laneMarkHalf, roadLiftY, camera)
        const mD = projectPoint(x, roadCenterZ + laneMarkHalf, roadLiftY, camera)
        drawQuad(ctx, mA, mB, mC, mD, 'rgba(255,255,255,0.72)')
      }
    }

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

function drawOceans(ctx, camera, mode, time) {
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

    drawLineWaveSeaSurface(ctx, a, b, c, d, time, 'rgba(255,255,255,0.2)')
    const cb = { x: c.x, y: c.y + oceanFrontDrop }
    const db = { x: d.x, y: d.y + oceanFrontDrop }

    // Side face: deep-water base.
    drawQuad(ctx, d, c, cb, db, 'rgba(58,110,146,0.86)', 'rgba(255,255,255,0.08)')

    // Smooth beach-to-deep slope overlay, clipped to the side face.
    ctx.save()
    ctx.beginPath()
    ctx.moveTo(d.x, d.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(cb.x, cb.y)
    ctx.lineTo(db.x, db.y)
    ctx.closePath()
    ctx.clip()

    // Left smooth slope (beach tone fading into blue center).
    const leftTopInner = lerpPoint(d, c, 0.22)
    const leftBottomInner = lerpPoint(db, cb, 0.34)
    const leftGrad = ctx.createLinearGradient(
      (d.x + db.x) * 0.5,
      (d.y + db.y) * 0.5,
      (leftTopInner.x + leftBottomInner.x) * 0.5,
      (leftTopInner.y + leftBottomInner.y) * 0.5,
    )
    leftGrad.addColorStop(0, 'rgba(196,174,122,0.94)')
    leftGrad.addColorStop(0.6, 'rgba(185,166,118,0.45)')
    leftGrad.addColorStop(1, 'rgba(185,166,118,0)')
    ctx.beginPath()
    ctx.moveTo(d.x, d.y)
    ctx.lineTo(leftTopInner.x, leftTopInner.y)
    ctx.lineTo(leftBottomInner.x, leftBottomInner.y)
    ctx.lineTo(db.x, db.y)
    ctx.closePath()
    ctx.fillStyle = leftGrad
    ctx.fill()

    // Right smooth slope (beach tone fading into blue center).
    const rightTopInner = lerpPoint(d, c, 0.78)
    const rightBottomInner = lerpPoint(db, cb, 0.66)
    const rightGrad = ctx.createLinearGradient(
      (c.x + cb.x) * 0.5,
      (c.y + cb.y) * 0.5,
      (rightTopInner.x + rightBottomInner.x) * 0.5,
      (rightTopInner.y + rightBottomInner.y) * 0.5,
    )
    rightGrad.addColorStop(0, 'rgba(196,174,122,0.94)')
    rightGrad.addColorStop(0.6, 'rgba(185,166,118,0.45)')
    rightGrad.addColorStop(1, 'rgba(185,166,118,0)')
    ctx.beginPath()
    ctx.moveTo(rightTopInner.x, rightTopInner.y)
    ctx.lineTo(c.x, c.y)
    ctx.lineTo(cb.x, cb.y)
    ctx.lineTo(rightBottomInner.x, rightBottomInner.y)
    ctx.closePath()
    ctx.fillStyle = rightGrad
    ctx.fill()
    ctx.restore()

    const fishCount = 4
    for (let fish = 0; fish < fishCount; fish += 1) {
      const seed = ((i + 1) * 101 + (fish + 1) * 67) % 1000
      const phase = seed * 0.019
      const swimDir = seed % 2 === 0 ? 1 : -1
      const speed = 0.07 + ((seed % 29) / 1000) * 3
      const drift = (0.2 + ((seed % 530) / 1000) + time * speed * swimDir + 10) % 1
      // Keep fish in deeper middle zone, away from sandy slope near shoreline.
      const t = 0.3 + drift * 0.4
      const depth = 0.45 + ((Math.sin(time * 1.4 + phase) + 1) * 0.5) * 0.5
      const topX = d.x + (c.x - d.x) * t
      const topY = d.y + (c.y - d.y) * t
      const sideX = topX + Math.sin(time * 2.8 + phase) * 6
      const sideY = topY + 34 + depth * 64 + Math.cos(time * 3.2 + phase) * 4
      const fishW = 16 + depth * 10
      const fishH = 6 + depth * 4

      ctx.fillStyle = 'rgba(167,227,255,0.72)'
      ctx.beginPath()
      ctx.ellipse(sideX, sideY, fishW * 0.5, fishH * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()

      const tailDir = swimDir > 0 ? -1 : 1
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
  const scale = opts.scale ?? 1
  const worldZ = opts.worldZ ?? 108
  const worldY = opts.worldY ?? 0
  const yOffset = opts.yOffset ?? 0

  const p = projectPoint(worldX, worldZ, worldY, camera)
  const drawW = width * scale
  const drawH = height * scale
  const x = p.x - drawW / 2
  const y = p.y - drawH + yOffset * scale

  if (image?.complete && image.naturalWidth > 0) {
    ctx.drawImage(image, x, y, drawW, drawH)
  }
}

function drawLandmarks(ctx, camera, world, sceneScale) {
  if (isStageVisible('taiwan-born', 'play')) {
    drawBillboard(
      ctx,
      hospitalImage,
      camera,
      HOSPITAL.x + HOSPITAL.width / 2,
      HOSPITAL.width,
      HOSPITAL.height,
      {
        yOffset: -35,
        scale: sceneScale,
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
      { yOffset: INDONESIA_TERRACES.groundOffset - 20, scale: sceneScale },
    )
    drawBillboard(
      ctx,
      schoolImage,
      camera,
      indonesia.start + INDONESIA_SCHOOL.xOffset,
      INDONESIA_SCHOOL.width,
      INDONESIA_SCHOOL.height,
      { yOffset: INDONESIA_SCHOOL.yOffset + 30, scale: sceneScale * 1.35 },
    )
  }

  const taiwanReturn = STAGES.find((s) => s.id === 'taiwan-return')
  if (taiwanReturn && isStageVisible('taiwan-return', 'play')) {
    drawBillboard(
      ctx,
      ntuImage,
      camera,
      taiwanReturn.start + TAIWAN_NTU.xOffset,
      TAIWAN_NTU.width,
      TAIWAN_NTU.height,
      { yOffset: TAIWAN_NTU.yOffset - 70, scale: sceneScale * 0.95 },
    )
    drawBillboard(
      ctx,
      militaryImage,
      camera,
      taiwanReturn.start + TAIWAN_MILITARY.xOffset,
      TAIWAN_MILITARY.width,
      TAIWAN_MILITARY.height,
      { yOffset: TAIWAN_MILITARY.yOffset - 70, scale: sceneScale * 0.95 },
    )
    drawBillboard(
      ctx,
      companyImage,
      camera,
      taiwanReturn.start + TAIWAN_COMPANY.xOffset,
      TAIWAN_COMPANY.width,
      TAIWAN_COMPANY.height,
      { yOffset: TAIWAN_COMPANY.yOffset - 15, scale: sceneScale * 1.3 },
    )
  }

  const melbourne = STAGES.find((s) => s.id === 'melbourne-master')
  if (melbourne && isStageVisible('melbourne-master', 'play')) {
    drawBillboard(ctx, monash2Image, camera, melbourne.start + 390, 320, 235, {
      yOffset: -45,
      scale: sceneScale * 0.8,
    })
    drawBillboard(ctx, monashImage, camera, melbourne.start + 175, 330, 250, {
      yOffset: -45,
      scale: sceneScale * 0.8,
    })
  }
}

function drawNextJourneyHint(ctx, camera, mode, time) {
  if (mode !== 'play') return

  const lastStage = STAGES[STAGES.length - 1]
  if (!lastStage || !isStageVisible(lastStage.id, mode)) return
  const s = getStoryCardScale(camera)

  const markerX = lastStage.end - NEXT_JOURNEY_MARKER_OFFSET
  const bob = Math.sin(time * 3.3) * 9
  const markerLift = 180 * s + bob

  drawBillboard(ctx, questionImage, camera, markerX, 96 * s, 150 * s, {
    worldY: markerLift,
    yOffset: 8,
  })
}

function drawNextJourneyStoryCard(ctx, camera, player, currentStageIndex, travel, time) {
  if (travel?.active) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'melbourne-master') return

  const playerCenterX = player.x + player.w / 2
  const markerX = stage.end - NEXT_JOURNEY_MARKER_OFFSET
  const centerBandHalf = 100
  const fadeMargin = 190
  const dx = Math.abs(playerCenterX - markerX)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX, 110, 0, camera)
  const cardW = 300 * s
  const cardH = 40 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 130 * s - 50
  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 1.55)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  ctx.font = storyFont(700, 18, s)
  ctx.textAlign = 'center'
  ctx.fillText("What's the next journey?", x + cardW / 2, cardY + 28 * s)
  ctx.textAlign = 'left'
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

function drawWavingFlag(ctx, camera, poleWorldX, poleWorldZ, time, flagConfig, sceneScale) {
  const poleHeight = 108 * sceneScale
  const flagWidth = flagConfig.width * sceneScale
  const flagHeight = flagConfig.height * sceneScale
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

function drawFlags(ctx, camera, mode, time, sceneScale) {
  if (mode !== 'play') return
  const flagEdgeOffset = 12
  const flagTopDepth = 8

  for (let i = 1; i < STAGES.length; i += 1) {
    const stage = STAGES[i]
    if (!isStageVisible(stage.id, mode)) continue
    const poleWorldX = stage.start + flagEdgeOffset
    const flagConfig = getFlagConfig(stage.id)
    drawWavingFlag(ctx, camera, poleWorldX, flagTopDepth, time + i * 0.6, flagConfig, sceneScale)
  }
}

function drawAirports(ctx, camera, mode, sceneScale) {
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
      worldX - 45,
      AIRPORT_ZONE * airportScale,
      100 * airportScale,
      { yOffset: -55, scale: sceneScale },
    )
  }
}

function drawPortal(ctx, camera, portal, world, sceneScale) {
  const lift = world.groundY - portal.y
  const p = projectPoint(portal.x, 98, lift, camera)
  const radius = PORTAL.radius * sceneScale

  ctx.beginPath()
  ctx.arc(p.x, p.y, radius + 26 * sceneScale, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
  ctx.lineWidth = 5 * sceneScale
  ctx.strokeStyle = 'rgba(255,255,255,0.95)'
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = storyFont(500, 14, sceneScale)
  ctx.fillText('Move into the circle to be born', p.x + 64 * sceneScale, p.y + 6 * sceneScale)
}

function drawPortalHintArrow(ctx, camera, portal, world, time, sceneScale) {
  const lift = world.groundY - portal.y
  const p = projectPoint(portal.x, 98, lift, camera)
  const bob = Math.sin(time * 4.2) * 6 * sceneScale
  const tipX = p.x
  const tipY = p.y - PORTAL.radius * sceneScale - 14 * sceneScale + bob
  const baseY = tipY - 18 * sceneScale

  ctx.fillStyle = '#ff2b2b'
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - 12 * sceneScale, baseY)
  ctx.lineTo(tipX + 12 * sceneScale, baseY)
  ctx.closePath()
  ctx.fill()
}

function drawAirportHintArrow(ctx, camera, currentStageIndex, time, travel, sceneScale) {
  if (travel?.active) return
  if (currentStageIndex < 1 || currentStageIndex >= STAGES.length - 1) return
  const stage = STAGES[currentStageIndex]
  const airportWorldX = stage.end - AIRPORT_ZONE - 40
  const airportBase = projectPoint(airportWorldX, 108, 0, camera)
  const bob = Math.sin(time * 4.4) * 6 * sceneScale
  const tipX = airportBase.x
  const tipY = airportBase.y - 276 * sceneScale + bob
  const stemTopY = tipY - 22 * sceneScale

  ctx.strokeStyle = '#ff2b2b'
  ctx.lineWidth = 5 * sceneScale
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(tipX, stemTopY)
  ctx.lineTo(tipX, tipY - 2)
  ctx.stroke()

  ctx.fillStyle = '#ff2b2b'
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - 13 * sceneScale, tipY - 18 * sceneScale)
  ctx.lineTo(tipX + 13 * sceneScale, tipY - 18 * sceneScale)
  ctx.closePath()
  ctx.fill()
}

function drawCharacter(ctx, player, camera, sprite, label, characterKey, world) {
  const sceneScale = getSceneScale(camera)
  const scale = (characterKey === 'spirit' ? 1 : 1.35) * sceneScale
  const drawW = player.w * scale
  const drawH = player.h * scale
  const groundShift =
    characterKey === 'child' || characterKey === 'student' || characterKey === 'master' ? 10 : 0

  const playerCenterX = player.x + player.w / 2
  const playerLift = world.groundY - player.h - player.y
  const base = projectPoint(playerCenterX, 110, playerLift, camera)

  const shadow = projectPoint(playerCenterX, 110, 28, camera)
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(
    shadow.x,
    shadow.y + 4 * sceneScale,
    22 * sceneScale,
    7 * sceneScale,
    0,
    0,
    Math.PI * 2,
  )
  ctx.fill()

  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, base.x - drawW / 2, base.y - drawH + groundShift, drawW, drawH)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(base.x - player.w / 2, base.y - player.h, player.w, player.h)
  }

  if (label) {
    ctx.fillStyle = '#0f0f0f'
    ctx.font = storyFont(700, 18, sceneScale)
    ctx.fillText(label, base.x - 18 * sceneScale, base.y - drawH - 10 * sceneScale)
  }
}

function drawSpiritPortalGuideArrow(ctx, player, camera, portal, world, sceneScale, time) {
  const playerCenterX = player.x + player.w / 2
  const playerLift = world.groundY - player.h - player.y
  const spiritBase = projectPoint(playerCenterX, 110, playerLift, camera)
  const portalLift = world.groundY - portal.y
  const portalPoint = projectPoint(portal.x, 98, portalLift, camera)

  const dx = portalPoint.x - spiritBase.x
  const dy = portalPoint.y - spiritBase.y
  const len = Math.hypot(dx, dy) || 1
  const ux = dx / len
  const uy = dy / len

  const startX = spiritBase.x + ux * 26 * sceneScale
  const startY = spiritBase.y - 20 * sceneScale + uy * 26 * sceneScale
  const arrowLen = 30 * sceneScale
  const floatOffset = Math.sin(time * 5.2) * 6 * sceneScale
  const tipX = startX + ux * (arrowLen + floatOffset)
  const tipY = startY + uy * (arrowLen + floatOffset)
  const px = -uy
  const py = ux
  const head = 8.5 * sceneScale

  ctx.save()
  ctx.shadowColor = 'rgba(255,235,140,0.55)'
  ctx.shadowBlur = 6 * sceneScale
  ctx.strokeStyle = 'rgba(255,235,140,0.95)'
  ctx.lineWidth = 4.2 * sceneScale
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(startX, startY)
  ctx.lineTo(tipX, tipY)
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,235,140,0.95)'
  ctx.beginPath()
  ctx.moveTo(tipX, tipY)
  ctx.lineTo(tipX - ux * head + px * head * 0.7, tipY - uy * head + py * head * 0.7)
  ctx.lineTo(tipX - ux * head - px * head * 0.7, tipY - uy * head - py * head * 0.7)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawTerraceStoryCard(ctx, camera, player, world, currentStageIndex, travel, time) {
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

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX - 20, 110, 0, camera)
  const cardW = 480 * s
  const cardH = 370 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 500 * s - 30

  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 0.15)

  const imageW = 350 * s
  const imageH = 240 * s
  const contentTop = cardY + 16 * s
  const titleY = contentTop + 24 * s
  const bodyLine1Y = contentTop + 58 * s
  const bodyLine2Y = contentTop + 86 * s
  const imageX = x + (cardW - imageW) / 2
  const imageY = contentTop + 98 * s
  drawStoryImageWithOutline(ctx, terracesStoryImage, imageX, imageY, imageW, imageH, alpha)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  ctx.font = storyFont(700, 26, s)
  ctx.textAlign = 'center'
  ctx.fillText('A New Home', x + cardW / 2, titleY)
  ctx.font = storyFont(600, 19, s)
  ctx.fillText('Relocated to Indonesia with my family,', x + cardW / 2, bodyLine1Y)
  ctx.fillText('where I spent my growing-up years.', x + cardW / 2, bodyLine2Y)
  ctx.textAlign = 'left'
}

function drawSchoolStoryCard(ctx, camera, player, world, currentStageIndex, travel, time) {
  if (travel?.active) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'indonesia') return

  const playerCenterX = player.x + player.w / 2
  const schoolCenter = stage.start + INDONESIA_SCHOOL.xOffset
  const centerBandHalf = INDONESIA_SCHOOL.width * 0.1
  const fadeMargin = 170
  const dx = Math.abs(playerCenterX - schoolCenter)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX, 110, 0, camera)
  const cardW = 530 * s
  const cardH = 390 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 470 * s - 40

  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 0.35)

  const imageW = 380 * s
  const imageH = 250 * s
  const imageX = x + (cardW - imageW) / 2
  const imageY = cardY + 120 * s
  drawStoryImageWithOutline(ctx, schoolStoryImage, imageX, imageY, imageW, imageH, alpha)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  ctx.font = storyFont(700, 26, s)
  ctx.textAlign = 'center'
  ctx.fillText('School Years in Indonesia', x + cardW / 2, cardY + 50 * s)
  ctx.font = storyFont(600, 19, s)
  ctx.fillText('Studied from kindergarten to Grade 12,', x + cardW / 2, cardY + 84 * s)
  ctx.fillText('Guess which one is me!', x + cardW / 2, cardY + 112 * s)
  ctx.textAlign = 'left'
}

function drawNtuStoryCard(ctx, camera, player, world, currentStageIndex, travel, time) {
  if (travel?.active) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'taiwan-return') return

  const playerCenterX = player.x + player.w / 2
  const ntuCenter = stage.start + TAIWAN_NTU.xOffset
  const centerBandHalf = TAIWAN_NTU.width * 0.1
  const fadeMargin = 170
  const dx = Math.abs(playerCenterX - ntuCenter)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX, 110, 0, camera)
  const cardW = 530 * s
  const cardH = 390 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 470 * s - 40

  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 0.55)

  const imageW = 380 * s
  const imageH = 250 * s
  const imageX = x + (cardW - imageW) / 2
  const imageY = cardY + 120 * s
  drawStoryImageWithOutline(ctx, ntuStoryImage, imageX, imageY, imageW, imageH, alpha)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  ctx.font = storyFont(700, 24, s)
  ctx.textAlign = 'center'
  ctx.fillText('Back in Taiwan for University', x + cardW / 2, cardY + 50 * s)
  ctx.font = storyFont(600, 19, s)
  ctx.fillText("Pursued a Bachelor's in Landscape Architecture", x + cardW / 2, cardY + 84 * s)
  ctx.fillText('at National Taiwan University.', x + cardW / 2, cardY + 112 * s)
  ctx.textAlign = 'left'
}

function drawMilitaryStoryCard(ctx, camera, player, world, currentStageIndex, travel, time) {
  if (travel?.active) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'taiwan-return') return

  const playerCenterX = player.x + player.w / 2
  const militaryCenter = stage.start + TAIWAN_MILITARY.xOffset
  const centerBandHalf = TAIWAN_MILITARY.width * 0.1
  const fadeMargin = 170
  const dx = Math.abs(playerCenterX - militaryCenter)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX, 110, 0, camera)
  const cardW = 520 * s
  const cardH = 360 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 440 * s - 50

  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 0.75)

  const imageW = 230 * s
  const imageH = 300 * s
  const imageX = x + 24 * s
  const imageY = cardY + 30 * s
  drawStoryImageWithOutline(ctx, militaryStoryImage, imageX, imageY, imageW, imageH, alpha)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  const textX = imageX + imageW + 30 * s
  const textMaxW = cardW - (textX - x) - 26 * s
  ctx.font = storyFont(700, 24, s)
  ctx.fillText('Military Service Year', textX, cardY + 70 * s, textMaxW)
  ctx.font = storyFont(600, 19, s)
  drawWrappedText(
    ctx,
    "Completed one year of mandatory military service, and was selected for the honor guard at Taiwan's garrison points.",
    textX,
    cardY + 112 * s,
    textMaxW,
    Math.max(18, Math.round(30 * s)),
  )
}

function drawCompanyStoryCard(ctx, camera, player, world, currentStageIndex, travel, time) {
  if (travel?.active) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'taiwan-return') return

  const playerCenterX = player.x + player.w / 2
  const companyCenter = stage.start + TAIWAN_COMPANY.xOffset
  const centerBandHalf = TAIWAN_COMPANY.width * 0.1
  const fadeMargin = 170
  const dx = Math.abs(playerCenterX - companyCenter)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX, 110, 0, camera)
  const cardW = 520 * s
  const cardH = 390 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 470 * s - 40

  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 0.95)

  const imageW = 350 * s
  const imageH = 250 * s
  const imageX = x + (cardW - imageW) / 2
  const imageY = cardY + 120 * s
  drawStoryImageWithOutline(ctx, companyStoryImage, imageX, imageY, imageW, imageH, alpha)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  ctx.font = storyFont(700, 26, s)
  ctx.textAlign = 'center'
  ctx.fillText('Tech Career Chapter', x + cardW / 2, cardY + 50 * s)
  ctx.font = storyFont(600, 19, s)
  ctx.fillText('Worked in software and tech for nearly five years,', x + cardW / 2, cardY + 84 * s)
  ctx.fillText(
    'blending technical execution with B2B collaboration.',
    x + cardW / 2,
    cardY + 112 * s,
  )
  ctx.textAlign = 'left'
}

function drawMonashStoryCard(ctx, camera, player, world, currentStageIndex, travel, time) {
  if (travel?.active) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'melbourne-master') return

  const playerCenterX = player.x + player.w / 2
  const monashCenter = stage.start + MELBOURNE_STUDY.xOffset
  const centerBandHalf = MELBOURNE_STUDY.width * 0.1
  const fadeMargin = 170
  const dx = Math.abs(playerCenterX - monashCenter)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX, 110, 0, camera)
  const cardW = 530 * s
  const cardH = 330 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 430 * s - 50

  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 1.15)

  const imageW = 200 * s
  const imageH = 300 * s
  const imageX = x + 20 * s
  const imageY = cardY + 16 * s
  drawStoryImageWithOutline(ctx, monashStoryImage, imageX, imageY, imageW, imageH, alpha)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  const textX = imageX + imageW + 28 * s
  const textMaxW = cardW - (textX - x) - 24 * s
  ctx.font = storyFont(700, 24, s)
  ctx.fillText("Master's in IT at Monash", textX, cardY + 40 * s, textMaxW)
  ctx.font = storyFont(600, 19, s)
  drawWrappedText(
    ctx,
    'Pursuing a Master of IT to strengthen my software career, graduating with the Thesis stream and Distinction, while also participating in peer mentor and volunteer programs.',
    textX,
    cardY + 80 * s,
    textMaxW,
    Math.max(18, Math.round(30 * s)),
  )
}

function drawHospitalStoryCard(
  ctx,
  camera,
  player,
  world,
  currentStageIndex,
  travel,
  birthDropActive,
  time,
) {
  if (travel?.active || birthDropActive) return
  const stage = STAGES[currentStageIndex]
  if (!stage || stage.id !== 'taiwan-born') return

  const playerCenterX = player.x + player.w / 2
  const hospitalStart = HOSPITAL.x
  const hospitalEnd = HOSPITAL.x + HOSPITAL.width
  const hospitalCenter = (hospitalStart + hospitalEnd) / 2
  const centerBandHalf = (hospitalEnd - hospitalStart) * 0.1
  const fadeMargin = 170
  const dx = Math.abs(playerCenterX - hospitalCenter)

  if (dx > centerBandHalf + fadeMargin) return

  let alpha = 0
  if (dx <= centerBandHalf) {
    alpha = 1
  } else {
    const fadeOut = 1 - (dx - centerBandHalf) / fadeMargin
    alpha = Math.max(0, Math.min(1, fadeOut))
  }
  if (alpha <= 0.01) return

  const s = getStoryCardScale(camera)
  const anchor = projectPoint(playerCenterX, 110, 0, camera)
  const cardW = 430 * s
  const cardH = 70 * s
  const x = anchor.x - cardW / 2
  const y = anchor.y - 208 * s

  const cardY = drawStoryCardChrome(ctx, x, y, cardW, cardH, alpha, time, 1.35)

  ctx.fillStyle = `rgba(24,24,24,${0.96 * alpha})`
  ctx.font = storyFont(700, 22, s)
  ctx.textAlign = 'center'
  ctx.fillText('Born in Taiwan, Hsinchu, 1992', x + cardW / 2, cardY + 45 * s)
  ctx.textAlign = 'left'
}

function fitTextSize(ctx, text, maxWidth, maxHeight, weight = 900) {
  let size = Math.floor(maxHeight)
  while (size > 12) {
    ctx.font = `${weight} ${size}px system-ui`
    const width = ctx.measureText(text).width
    if (width <= maxWidth) return size
    size -= 2
  }
  return 12
}

function drawArrivalSplash(ctx, camera, arrivalSplash) {
  if (!arrivalSplash?.active || !arrivalSplash.year || !arrivalSplash.country) return

  const duration = Math.max(arrivalSplash.duration || 2, 0.01)
  const progress = 1 - Math.max(0, arrivalSplash.timer) / duration
  let alpha = 1
  if (progress < 0.15) alpha = progress / 0.15
  if (progress > 0.8) alpha = (1 - progress) / 0.2
  alpha = Math.max(0, Math.min(1, alpha))
  if (alpha <= 0.01) return

  const yearText = String(arrivalSplash.year)
  const countryText = String(arrivalSplash.country).toUpperCase()

  const widthLimit = camera.w * 0.8
  const halfHeight = camera.h * 0.32
  const yearSize = fitTextSize(ctx, yearText, widthLimit, halfHeight, 900)
  const countrySize = fitTextSize(ctx, countryText, widthLimit, halfHeight, 900)

  ctx.save()
  ctx.globalAlpha = alpha
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(255,255,255,0.98)'
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = Math.max(8, camera.w * 0.015)

  ctx.font = `900 ${yearSize}px system-ui`
  ctx.fillText(yearText, camera.w * 0.5, camera.h * 0.35)

  ctx.font = `900 ${countrySize}px system-ui`
  ctx.fillText(countryText, camera.w * 0.5, camera.h * 0.67)
  ctx.restore()
}

export function renderScene(ctx, state) {
  const {
    camera,
    world,
    mode,
    portal,
    player,
    currentStageIndex,
    sprites,
    characterKey,
    time,
    travel,
    birthDropActive,
    arrivalSplash,
  } = state
  const stageIndex = Math.max(currentStageIndex, 0)
  const stage = STAGES[stageIndex]
  const sceneScale = getSceneScale(camera)

  const gradient = ctx.createLinearGradient(0, 0, 0, camera.h)
  gradient.addColorStop(0, stage.skyTop)
  gradient.addColorStop(1, stage.skyBottom)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, camera.w, camera.h)

  drawStageSurfaces(ctx, camera, mode)
  drawOceans(ctx, camera, mode, time)

  if (mode === 'intro') {
    drawPortal(ctx, camera, portal, world, sceneScale)
    drawPortalHintArrow(ctx, camera, portal, world, time, sceneScale)
  } else {
    drawAirports(ctx, camera, mode, sceneScale)
    drawLandmarks(ctx, camera, world, sceneScale)
    drawNextJourneyHint(ctx, camera, mode, time)
    drawFlags(ctx, camera, mode, time, sceneScale)
    drawAirportHintArrow(ctx, camera, currentStageIndex, time, travel, sceneScale)
  }

  const label = ''
  drawCharacter(ctx, player, camera, sprites[characterKey], label, characterKey, world)
  if (mode === 'intro' && characterKey === 'spirit') {
    drawSpiritPortalGuideArrow(ctx, player, camera, portal, world, sceneScale, time)
  }
  drawHospitalStoryCard(
    ctx,
    camera,
    player,
    world,
    currentStageIndex,
    travel,
    birthDropActive,
    time,
  )
  drawTerraceStoryCard(ctx, camera, player, world, currentStageIndex, travel, time)
  drawSchoolStoryCard(ctx, camera, player, world, currentStageIndex, travel, time)
  drawNtuStoryCard(ctx, camera, player, world, currentStageIndex, travel, time)
  drawMilitaryStoryCard(ctx, camera, player, world, currentStageIndex, travel, time)
  drawCompanyStoryCard(ctx, camera, player, world, currentStageIndex, travel, time)
  drawMonashStoryCard(ctx, camera, player, world, currentStageIndex, travel, time)
  drawNextJourneyStoryCard(ctx, camera, player, currentStageIndex, travel, time)
  drawArrivalSplash(ctx, camera, arrivalSplash)

  const isSpaceStage = stage.id === 'space'
  ctx.fillStyle = isSpaceStage ? 'rgba(255,255,255,0.95)' : '#0f0f0f'
  ctx.font = storyFont(700, 22, sceneScale)
  ctx.fillText(stage.title, 24 * sceneScale, 36 * sceneScale)
}
