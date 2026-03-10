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

function drawStars(ctx, stage, camera, groundY) {
  if (stage.scenery !== 'stars') return

  const baseX = stage.start - camera.x
  const width = stage.end - stage.start

  ctx.fillStyle = 'rgba(255,255,255,0.75)'
  for (let i = 0; i < 34; i += 1) {
    const x = baseX + ((i * 97) % width)
    const y = 40 + ((i * 61) % Math.max(120, groundY - 230))
    ctx.beginPath()
    ctx.arc(x, y, i % 3 === 0 ? 2.1 : 1.3, 0, Math.PI * 2)
    ctx.fill()
  }
}

function drawOceans(ctx, camera, world) {
  const oceanTop = world.groundY + 34

  for (let i = 1; i < STAGES.length - 1; i += 1) {
    const oceanStart = STAGES[i].end
    const oceanEnd = STAGES[i + 1].start
    const x = oceanStart - camera.x
    const w = oceanEnd - oceanStart

    ctx.fillStyle = '#2f7ebc'
    ctx.fillRect(x, oceanTop, w, camera.h - oceanTop)

    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 2
    for (let row = 0; row < 3; row += 1) {
      const y = oceanTop + 10 + row * 16
      ctx.beginPath()
      for (let k = 0; k <= 12; k += 1) {
        const px = x + (k * w) / 12
        const py = y + Math.sin((k + row) * 0.8) * 2
        if (k === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.stroke()
    }
  }
}

function drawAirports(ctx, camera, world, currentStageIndex, mode) {
  if (mode !== 'play') return

  const groundY = world.groundY
  for (let i = 1; i < STAGES.length - 1; i += 1) {
    const stage = STAGES[i]
    const runwayX = stage.end - AIRPORT_ZONE
    const sx = runwayX - camera.x
    const imgW = AIRPORT_ZONE
    const imgH = 150
    const imgX = sx - 10
    const imgY = groundY - imgH

    if (airportImage.complete && airportImage.naturalWidth > 0) {
      ctx.drawImage(airportImage, imgX, imgY, imgW, imgH)
    }
  }
}

function drawHospital(ctx, camera, world) {
  const x = HOSPITAL.x - camera.x
  const y = world.groundY - HOSPITAL.height + HOSPITAL.groundOffset

  if (hospitalImage.complete && hospitalImage.naturalWidth > 0) {
    ctx.drawImage(hospitalImage, x, y, HOSPITAL.width, HOSPITAL.height)
  }
}

function drawIndonesiaTerraces(ctx, camera, world) {
  const width = INDONESIA_TERRACES.width
  const height = INDONESIA_TERRACES.height
  const x = INDONESIA_TERRACES.x - camera.x
  const y = world.groundY - height + INDONESIA_TERRACES.groundOffset

  if (terracesImage.complete && terracesImage.naturalWidth > 0) {
    ctx.drawImage(terracesImage, x, y, width, height)
  }
}

function drawIndonesiaSchool(ctx, camera, world) {
  const indonesiaStage = STAGES.find((stage) => stage.id === 'indonesia')
  if (!indonesiaStage) return

  const width = 250
  const height = 200
  const x = indonesiaStage.start + 720 - camera.x
  const y = world.groundY - 130

  if (schoolImage.complete && schoolImage.naturalWidth > 0) {
    ctx.drawImage(schoolImage, x, y, width, height)
  }
}

function drawTaiwanNTU(ctx, camera, world) {
  const taiwanStage = STAGES.find((stage) => stage.id === 'taiwan-return')
  if (!taiwanStage) return

  const width = 260
  const height = 200
  const x = taiwanStage.start + 150 - camera.x
  const y = world.groundY - 170

  if (ntuImage.complete && ntuImage.naturalWidth > 0) {
    ctx.drawImage(ntuImage, x, y, width, height)
  }
}

function drawTaiwanMilitary(ctx, camera, world) {
  const taiwanStage = STAGES.find((stage) => stage.id === 'taiwan-return')
  if (!taiwanStage) return

  const width = 230
  const height = 165
  const x = taiwanStage.start + 520 - camera.x
  const y = world.groundY - 133

  if (militaryImage.complete && militaryImage.naturalWidth > 0) {
    ctx.drawImage(militaryImage, x, y, width, height)
  }
}

function drawTaiwanCompany(ctx, camera, world) {
  const taiwanStage = STAGES.find((stage) => stage.id === 'taiwan-return')
  if (!taiwanStage) return

  const width = 300
  const height = 180
  const x = taiwanStage.start + 840 - camera.x
  const y = world.groundY - 165

  if (companyImage.complete && companyImage.naturalWidth > 0) {
    ctx.drawImage(companyImage, x, y, width, height)
  }
}

function drawAustraliaMonash(ctx, camera, world) {
  const australiaStage = STAGES.find((stage) => stage.id === 'melbourne-master')
  if (!australiaStage) return

  const width = 340
  const height = 210
  const x = australiaStage.start + 150 - camera.x
  const y = world.groundY - 160

  if (monashImage.complete && monashImage.naturalWidth > 0) {
    ctx.drawImage(monashImage, x, y, width, height)
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

function drawWavingFlag(ctx, poleX, poleBottomY, time, flagConfig) {
  const poleHeight = 108
  const flagWidth = flagConfig.width
  const flagHeight = flagConfig.height
  const waveStrength = flagConfig.wave
  const flagImage = flagConfig.image
  const reverseSample = flagConfig.reverseSample
  const srcWidth = flagImage?.naturalWidth ?? flagImage?.width ?? 0
  const srcHeight = flagImage?.naturalHeight ?? flagImage?.height ?? 0
  const isDrawable = srcWidth > 0 && srcHeight > 0
  const poleTopY = poleBottomY - poleHeight

  ctx.fillStyle = '#4c4c4c'
  ctx.fillRect(poleX, poleTopY, 4, poleHeight)

  const baseX = poleX
  const baseY = poleTopY + 6

  const strips = 18
  for (let i = 0; i < strips; i += 1) {
    const ratio = i / (strips - 1)
    const wave = Math.sin(ratio * 8 - time * 5.5) * (waveStrength - ratio * 2.1)
    const x = baseX - ratio * flagWidth
    const y = baseY + wave
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

function drawFlags(ctx, camera, world, time) {
  const poleBottomY = world.groundY
  for (let i = 1; i < STAGES.length; i += 1) {
    const stage = STAGES[i]
    const poleX = stage.start + 92 - camera.x
    const flagConfig = getFlagConfig(stage.id)
    drawWavingFlag(ctx, poleX, poleBottomY, time + i * 0.6, flagConfig)
  }
}

function drawPortal(ctx, camera, portal) {
  const px = portal.x - camera.x
  const py = portal.y - camera.y

  ctx.beginPath()
  ctx.arc(px, py, PORTAL.radius + 26, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.1)'
  ctx.fill()

  ctx.beginPath()
  ctx.arc(px, py, PORTAL.radius, 0, Math.PI * 2)
  ctx.lineWidth = 5
  ctx.strokeStyle = 'rgba(255,255,255,0.95)'
  ctx.stroke()

  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.font = '14px system-ui'
  ctx.fillText('Move into the circle to be born', px + 64, py + 6)
}

function drawCharacter(ctx, player, camera, sprite, label, characterKey) {
  const scale = characterKey === 'spirit' ? 1 : 1.35
  const drawW = player.w * scale
  const drawH = player.h * scale
  const offsetX = (drawW - player.w) / 2
  const offsetY = drawH - player.h
  const groundShift =
    characterKey === 'child' || characterKey === 'student' || characterKey === 'master' ? 10 : 0

  const sx = player.x - camera.x
  const sy = player.y - camera.y

  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(sx + player.w / 2, sy + player.h + 8, 22, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, sx - offsetX, sy - offsetY + groundShift, drawW, drawH)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(sx, sy, player.w, player.h)
  }

  if (label) {
    ctx.fillStyle = 'rgba(255,255,255,0.92)'
    ctx.font = '700 18px system-ui'
    ctx.fillStyle = '#0f0f0f'
    ctx.fillText(label, sx + 2, sy - 24)
  }
}

function drawAirplane(ctx, travel, camera) {
  if (!travel.active) return
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
    travel,
    time,
  } = state
  const stageIndex = Math.max(currentStageIndex, 0)
  const stage = STAGES[stageIndex]

  const gradient = ctx.createLinearGradient(0, 0, 0, camera.h)
  gradient.addColorStop(0, stage.skyTop)
  gradient.addColorStop(1, stage.skyBottom)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, camera.w, camera.h)

  const visibleBlocks = mode === 'intro' ? [STAGES[0]] : STAGES
  for (const block of visibleBlocks) {
    const x = block.start - camera.x
    const w = block.end - block.start
    ctx.fillStyle = block.ground
    ctx.fillRect(x, world.groundY, w, camera.h - world.groundY)
    drawStars(ctx, block, camera, world.groundY)
  }

  if (mode === 'intro') {
    drawPortal(ctx, camera, portal)
  } else {
    drawOceans(ctx, camera, world)
    drawHospital(ctx, camera, world)
    drawFlags(ctx, camera, world, time)
    drawTaiwanNTU(ctx, camera, world)
    drawTaiwanMilitary(ctx, camera, world)
    drawTaiwanCompany(ctx, camera, world)
    drawAustraliaMonash(ctx, camera, world)
    drawIndonesiaTerraces(ctx, camera, world)
    drawIndonesiaSchool(ctx, camera, world)
  }

  const label = characterKey === 'traveler' ? '' : 'Alan'

  drawAirports(ctx, camera, world, currentStageIndex, mode)
  drawAirplane(ctx, travel, camera)
  drawCharacter(ctx, player, camera, sprites[characterKey], label, characterKey)

  const isSpaceStage = stage.id === 'space'
  ctx.fillStyle = isSpaceStage ? 'rgba(255,255,255,0.95)' : '#0f0f0f'
  ctx.font = '700 22px system-ui'
  ctx.fillText(stage.title, 24, 36)
}
