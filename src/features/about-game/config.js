export const STAGES = [
  {
    id: 'space',
    title: 'Spirit Space',
    start: 0,
    end: 1100,
    skyTop: '#04050a',
    skyBottom: '#11142b',
    ground: '#171a35',
    accent: '#9bc5ff',
    scenery: 'stars',
  },
  {
    id: 'taiwan-born',
    title: '1992 - Born in Taiwan',
    start: 1200,
    end: 1900,
    skyTop: '#99dcff',
    skyBottom: '#d8f2ff',
    ground: '#71b26b',
    accent: '#f4b400',
    scenery: 'plain',
  },
  {
    id: 'indonesia',
    title: '1993 - Base in Indonesia',
    start: 2550,
    end: 3950,
    skyTop: '#f5c989',
    skyBottom: '#ffe8bc',
    ground: '#4f8d4d',
    accent: '#1a936f',
    scenery: 'plain',
  },
  {
    id: 'taiwan-return',
    title: '2010 - Back to Taiwan',
    start: 4550,
    end: 6100,
    skyTop: '#b8d8ff',
    skyBottom: '#f2f8ff',
    ground: '#6ca07d',
    accent: '#3f6db2',
    scenery: 'plain',
  },
  {
    id: 'melbourne-master',
    title: '2024 - Move to Melbourne for Master',
    start: 6550,
    end: 7500,
    skyTop: '#8fc8ff',
    skyBottom: '#dbeeff',
    ground: '#6f9f7a',
    accent: '#1f477a',
    scenery: 'plain',
  },
]

export const WORLD = {
  width: STAGES[STAGES.length - 1].end + 120,
  height: 900,
  groundPadding: 180,
}

export const PHYSICS = {
  gravity: 2200,
  maxFall: 1800,
  frictionGround: 0.82,
  frictionAir: 0.98,
}

export const PLAYER = {
  width: 50,
  height: 66,
  speed: 330,
  jumpVelocity: 720,
}

export const PORTAL = {
  x: 950,
  radius: 52,
}

export const AIRPORT_ZONE = 160

export const HOSPITAL = {
  x: STAGES[1].start,
  width: 340,
  height: 260,
  groundOffset: 8,
}

export const INDONESIA_TERRACES = {
  x: STAGES[2].start + 200,
  width: 280,
  height: 200,
  groundOffset: 70,
  peakLift: 50,
}

export const PLATFORMS = [
  { x: 1320, y: 560, w: 180, h: 24 },
  { x: 1620, y: 500, w: 180, h: 24 },
  { x: 2620, y: 560, w: 180, h: 24 },
  { x: 2910, y: 500, w: 180, h: 24 },
  { x: 3920, y: 555, w: 180, h: 24 },
  { x: 4200, y: 500, w: 180, h: 24 },
  { x: 5220, y: 560, w: 180, h: 24 },
  { x: 5500, y: 500, w: 180, h: 24 },
]

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function findStageIndexByX(x) {
  return STAGES.findIndex((stage) => x >= stage.start && x < stage.end)
}

export function findNextPlayableStage(currentStageIndex) {
  if (currentStageIndex < 1) return 1
  return Math.min(currentStageIndex + 1, STAGES.length - 1)
}
