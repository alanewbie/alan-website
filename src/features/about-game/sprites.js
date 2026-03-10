const spriteUrls = {
  spirit: new URL('../../assets/game/character-spirit.svg', import.meta.url).href,
  baby: new URL('../../assets/game/character-baby.png', import.meta.url).href,
  child: new URL('../../assets/game/character-child.png', import.meta.url).href,
  student: new URL('../../assets/game/character-student.png', import.meta.url).href,
  master: new URL('../../assets/game/character-master.png', import.meta.url).href,
  traveler: new URL('../../assets/game/character-traveler.png', import.meta.url).href,
}

export function loadCharacterSprites() {
  const sprites = {}

  for (const [key, src] of Object.entries(spriteUrls)) {
    const image = new Image()
    image.src = src
    sprites[key] = image
  }

  return sprites
}
