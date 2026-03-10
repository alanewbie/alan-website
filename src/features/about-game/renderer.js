import { AIRPORT_ZONE, PLATFORMS, PORTAL, STAGES } from './config'

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
  for (let i = 1; i < STAGES.length - 1; i += 1) {
    const oceanStart = STAGES[i].end
    const oceanEnd = STAGES[i + 1].start
    const x = oceanStart - camera.x
    const w = oceanEnd - oceanStart

    ctx.fillStyle = '#2f7ebc'
    ctx.fillRect(x, world.groundY, w, camera.h - world.groundY)

    ctx.strokeStyle = 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 2
    for (let row = 0; row < 3; row += 1) {
      const y = world.groundY + 10 + row * 16
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

    ctx.fillStyle = 'rgba(50,50,50,0.9)'
    ctx.fillRect(sx, groundY - 28, AIRPORT_ZONE, 28)

    ctx.fillStyle = 'rgba(255,255,255,0.9)'
    ctx.font = '12px system-ui'
    ctx.fillText(i === currentStageIndex ? 'Airport: board now' : 'Airport', sx + 10, groundY - 10)

    ctx.strokeStyle = 'rgba(255,255,255,0.75)'
    ctx.setLineDash([8, 8])
    ctx.beginPath()
    ctx.moveTo(sx + 8, groundY - 14)
    ctx.lineTo(sx + AIRPORT_ZONE - 8, groundY - 14)
    ctx.stroke()
    ctx.setLineDash([])
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
  ctx.fillText('Jump into the circle to be born', px + 64, py + 6)
}

function drawCharacter(ctx, player, camera, sprite, label, characterKey) {
  const scale = characterKey === 'spirit' ? 1 : 1.35
  const drawW = player.w * scale
  const drawH = player.h * scale
  const offsetX = (drawW - player.w) / 2
  const offsetY = drawH - player.h

  const sx = player.x - camera.x
  const sy = player.y - camera.y

  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(sx + player.w / 2, sy + player.h + 8, 22, 7, 0, 0, Math.PI * 2)
  ctx.fill()

  if (sprite?.complete && sprite.naturalWidth > 0) {
    ctx.drawImage(sprite, sx - offsetX, sy - offsetY, drawW, drawH)
  } else {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(sx, sy, player.w, player.h)
  }

  ctx.fillStyle = 'rgba(255,255,255,0.92)'
  ctx.font = '13px system-ui'
  ctx.fillText(label, sx + 2, sy - 8)
}

function drawAirplane(ctx, travel, camera) {
  if (!travel.active) return
}

export function renderScene(ctx, state) {
  const { camera, world, mode, portal, player, currentStageIndex, sprites, characterKey, travel } = state
  const stageIndex = Math.max(currentStageIndex, 0)
  const stage = STAGES[stageIndex]

  const gradient = ctx.createLinearGradient(0, 0, 0, camera.h)
  gradient.addColorStop(0, stage.skyTop)
  gradient.addColorStop(1, stage.skyBottom)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, camera.w, camera.h)

  for (const block of STAGES) {
    const x = block.start - camera.x
    const w = block.end - block.start
    ctx.fillStyle = block.ground
    ctx.fillRect(x, world.groundY, w, camera.h - world.groundY)
    drawStars(ctx, block, camera, world.groundY)
  }

  drawOceans(ctx, camera, world)

  if (mode === 'intro') drawPortal(ctx, camera, portal)

  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  for (const platform of PLATFORMS) {
    const sx = platform.x - camera.x
    const sy = platform.y - camera.y
    ctx.fillRect(sx, sy, platform.w, platform.h)
  }

  drawAirports(ctx, camera, world, currentStageIndex, mode)
  drawAirplane(ctx, travel, camera)
  drawCharacter(ctx, player, camera, sprites[characterKey], 'Alan', characterKey)

  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = '16px system-ui'
  ctx.fillText(stage.title, 24, 36)
}
