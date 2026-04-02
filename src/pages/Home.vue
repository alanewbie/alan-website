<template>
  <div class="min-h-screen">
    <!-- Hero Section (Full screen image) -->
    <section class="relative w-full">
      <div class="relative w-full overflow-hidden min-h-[32.5rem] h-[70vh] max-h-[45rem]">
        <div
          class="absolute inset-0 bg-fixed bg-no-repeat bg-top"
          :style="{ backgroundImage: `url(${heroUrl})`, backgroundSize: '100% auto' }"
        ></div>
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="relative z-10 flex items-start justify-center text-center text-white pt-16">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold mb-1">Hello, this is</h1>
            <h1 class="text-4xl sm:text-5xl md:text-6xl font-bold mb-3">Alan Tseng</h1>
            <p class="text-xl sm:text-2xl md:text-3xl">
              AI / SaaS {{ typedText }}<span class="cursor">|</span>
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Personal Information -->
    <section class="aboutme-section-bg pt-20 pb-20 border-t text-white">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-semibold mb-8">Tech Stack</h2>
        <div class="aboutme-slides">
          <div
            v-for="(slide, index) in aboutSlides"
            :key="slide.id"
            :ref="(el) => setRevealEl(el)"
            :class="['reveal', 'aboutme-slide', slide.widthClass]"
            :style="{ transitionDelay: `${index * 180}ms` }"
          >
            <p class="aboutme-slide-title">{{ slide.title }}</p>
            <p class="aboutme-slide-desc">{{ slide.description }}</p>
            <div
              :ref="(el) => setAboutMarqueeMaskRef(slide.id, el)"
              class="aboutme-marquee-mask"
              :class="{ 'aboutme-marquee-mask--dragging': isAboutSlideDragging(slide.id) }"
              @pointerdown="(e) => onAboutMarqueePointerDown(e, slide.id)"
            >
              <div
                class="aboutme-marquee-track"
                :style="{ transform: `translateX(${getAboutSlideOffset(slide.id)}px)` }"
              >
                <div
                  v-for="(logo, i) in slide.loop"
                  :key="`${slide.id}-${logo.name}-${i}`"
                  class="aboutme-logo-item"
                >
                  <img
                    :src="logo.src"
                    :alt="logo.name"
                    class="aboutme-logo-image"
                    loading="lazy"
                    draggable="false"
                    @dragstart.prevent
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Certificates / Highlights -->
    <section class="py-20 border-t bg-black text-white">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-3xl font-semibold text-center mb-10">Certificates & Highlights</h2>

        <div class="grid sm:grid-cols-2 gap-7">
          <article
            v-for="(item, i) in highlights"
            :key="item.title"
            :ref="(el) => setRevealEl(el)"
            class="reveal group overflow-hidden rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            <!-- image -->
            <button
              type="button"
              class="relative block w-full text-left cursor-pointer"
              @click="openLightbox(item, i)"
            >
              <img
                :src="item.src"
                :alt="item.title"
                class="h-70 w-full object-cover object-top"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition"></div>
            </button>

            <!-- content -->
            <div class="p-6">
              <h3 class="text-lg font-semibold leading-snug">{{ item.title }}</h3>
              <p class="mt-2 text-sm text-white/70 leading-relaxed">
                {{ item.description }}
              </p>

              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  v-for="tag in item.tags"
                  :key="tag"
                  class="text-xs rounded-full bg-white/10 px-3 py-1 text-white/80"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
      <!-- Lightbox Modal -->
      <div
        v-if="lightbox.open"
        class="fixed inset-0 z-[999] bg-black/30 backdrop-blur-sm"
        @click.self="closeLightbox"
      >
        <div class="absolute inset-0 flex items-center justify-center p-4">
          <div
            class="relative w-full max-w-6xl max-h-[85vh] rounded-2xl bg-black/60 border border-white/10 overflow-hidden"
          >
            <!-- top bar -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div class="min-w-0">
                <p class="truncate font-medium">{{ lightbox.title }}</p>
                <p class="truncate text-xs text-white/60">{{ lightbox.description }}</p>
              </div>
              <!-- Close -->
              <button
                type="button"
                class="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-gray-200 cursor-pointer"
                @click="closeLightbox"
                aria-label="Close"
              >
                X
              </button>

              <!-- Prev -->
              <button
                class="absolute left-4 top-1/2 z-10 -translate-y-1/2 h-12 w-12 rounded-full bg-white text-black shadow-lg hover:bg-gray-200 flex items-center justify-center text-2xl cursor-pointer"
                @click.stop="prevImage"
                aria-label="Previous"
              >
                <
              </button>

              <!-- Next -->
              <button
                class="absolute right-4 top-1/2 z-10 -translate-y-1/2 h-12 w-12 rounded-full bg-white text-black shadow-lg hover:bg-gray-200 flex items-center justify-center text-2xl cursor-pointer"
                @click.stop="nextImage"
                aria-label="Next"
              >
                >
              </button>
            </div>
            <div
              class="max-h-[calc(85vh-3.25rem)] overflow-auto p-4 flex items-center justify-center"
            >
              <img
                :src="lightbox.src"
                :alt="lightbox.title"
                class="w-auto max-w-full max-h-[calc(85vh-3.25rem-2rem)] object-contain"
                draggable="false"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- Footer -->
    <footer class="border-t py-8 text-center text-gray-500 text-sm">
      © {{ new Date().getFullYear() }} Alan Tseng. All rights reserved.
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const desktopHeroUrl = new URL('../assets/hero.png', import.meta.url).href
const smartphoneHeroUrl = new URL('../assets/smartphonehero.png', import.meta.url).href
const heroUrl = ref(desktopHeroUrl)
const roles = ['Technical Presales', 'Software Developer', 'Business Development']
const aboutLogoModules = import.meta.glob('../assets/aboutme/**/*.{png,jpg,jpeg,webp,svg}', {
  eager: true,
  import: 'default',
})
const aboutLogoEntries = Object.entries(aboutLogoModules).map(([path, src]) => {
  const match = path.match(/\.\.\/assets\/aboutme\/([^/]+)\/([^/]+)\.[^.]+$/)
  if (!match) return null
  return {
    folder: match[1],
    name: match[2],
    src,
  }
})

const aboutLogosByFolder = aboutLogoEntries.filter(Boolean).reduce((acc, item) => {
  if (!acc[item.folder]) acc[item.folder] = []
  acc[item.folder].push({ name: item.name, src: item.src })
  return acc
}, {})

Object.values(aboutLogosByFolder).forEach((logos) =>
  logos.sort((a, b) => a.name.localeCompare(b.name)),
)

const aboutSlideConfig = {
  cloud: {
    title: 'Cloud',
    description: 'Deploying and integrating services across Azure, AWS, and GCP.',
    widthClass: 'max-w-2xl',
  },
  'ai-data': {
    title: 'AI / Data',
    description: 'Using AI and data tools for intelligent workflows, modeling, and analysis.',
    widthClass: 'max-w-5xl',
  },
  backend: {
    title: 'Backend',
    description: 'Building scalable backend services and APIs with modern engineering practices.',
    widthClass: 'max-w-5xl',
  },
  frontend: {
    title: 'Frontend',
    description: 'Creating responsive interfaces with modern JavaScript frameworks and UI tools.',
    widthClass: 'max-w-5xl',
  },
}

const aboutFolderOrder = ['ai-data', 'backend', 'frontend']
const aboutFolders = Object.keys(aboutLogosByFolder)
  .filter((folder) => aboutFolderOrder.includes(folder))
  .sort((a, b) => {
    const ai = aboutFolderOrder.indexOf(a)
    const bi = aboutFolderOrder.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })

const aboutSlides = aboutFolders
  .map((folder) => {
    const cfg = aboutSlideConfig[folder] ?? {
      title: folder.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      description: 'Tools and technologies in this area.',
      widthClass: 'max-w-6xl',
    }
    const logos = aboutLogosByFolder[folder] ?? []
    return {
      id: folder,
      title: cfg.title,
      description: cfg.description,
      widthClass: cfg.widthClass,
      logos,
      loop: [...logos, ...logos],
    }
  })
  .filter((slide) => slide.logos.length > 0)

const aboutMarqueeMasks = ref({})
const aboutSlideStates = reactive({})
let marqueeRaf = null
let lastMarqueeTs = 0
const marqueeAutoSpeed = 30

function ensureAboutSlideState(id) {
  if (!aboutSlideStates[id]) {
    aboutSlideStates[id] = {
      dragging: false,
      pointerId: null,
      startX: 0,
      startOffset: 0,
      offset: 0,
      halfWidth: 0,
    }
  }
  return aboutSlideStates[id]
}

function setAboutMarqueeMaskRef(id, el) {
  if (el) aboutMarqueeMasks.value[id] = el
  else delete aboutMarqueeMasks.value[id]
}

function normalizeAboutOffset(id, value) {
  const half = ensureAboutSlideState(id).halfWidth
  if (!half) return value
  let next = value
  while (next <= -half) next += half
  while (next > 0) next -= half
  return next
}

function measureAboutMarquee() {
  aboutSlides.forEach((slide) => {
    const maskEl = aboutMarqueeMasks.value[slide.id]
    if (!maskEl) return
    const trackEl = maskEl.querySelector('.aboutme-marquee-track')
    if (!trackEl) return
    const state = ensureAboutSlideState(slide.id)
    state.halfWidth = trackEl.scrollWidth / 2
    state.offset = normalizeAboutOffset(slide.id, state.offset)
  })
}

function tickAboutMarquee(ts) {
  if (!lastMarqueeTs) lastMarqueeTs = ts
  const dt = (ts - lastMarqueeTs) / 1000
  lastMarqueeTs = ts

  aboutSlides.forEach((slide) => {
    const state = ensureAboutSlideState(slide.id)
    if (!state.dragging) {
      state.offset = normalizeAboutOffset(slide.id, state.offset - marqueeAutoSpeed * dt)
    }
  })

  marqueeRaf = window.requestAnimationFrame(tickAboutMarquee)
}

function onAboutMarqueePointerMove(e) {
  aboutSlides.forEach((slide) => {
    const state = ensureAboutSlideState(slide.id)
    if (!state.dragging || e.pointerId !== state.pointerId) return
    const dx = e.clientX - state.startX
    state.offset = normalizeAboutOffset(slide.id, state.startOffset + dx)
  })
}

function onAboutMarqueePointerUp(e) {
  aboutSlides.forEach((slide) => {
    const state = ensureAboutSlideState(slide.id)
    if (!state.dragging || e.pointerId !== state.pointerId) return
    state.dragging = false
    state.pointerId = null
  })
}

function onAboutMarqueePointerDown(e, slideId) {
  if (e.button !== 0) return
  const state = ensureAboutSlideState(slideId)
  state.dragging = true
  state.pointerId = e.pointerId
  state.startX = e.clientX
  state.startOffset = state.offset
}

function getAboutSlideOffset(id) {
  return ensureAboutSlideState(id).offset
}

function isAboutSlideDragging(id) {
  return ensureAboutSlideState(id).dragging
}

// typing
const typedText = ref('')
let roleIndex = 0
let charIndex = 0
let deleting = false
let typingTimer = null

function typeEffect() {
  const current = roles[roleIndex]

  if (!deleting) typedText.value = current.substring(0, charIndex++)
  else typedText.value = current.substring(0, charIndex--)

  let speed = deleting ? 50 : 100

  if (!deleting && charIndex === current.length + 1) {
    speed = 1500
    deleting = true
  } else if (deleting && charIndex === 0) {
    deleting = false
    roleIndex = (roleIndex + 1) % roles.length
  }

  typingTimer = window.setTimeout(typeEffect, speed)
}

// reveal
const revealEls = new Set()
const setRevealEl = (el) => {
  if (el) revealEls.add(el)
}

let observer = null

function isSmartphoneViewport() {
  const ua = navigator.userAgent || ''
  const isIPhoneOrIPod = /\b(iPhone|iPod)\b/i.test(ua)
  const isAndroidPhone = /\bAndroid\b/i.test(ua) && /\bMobile\b/i.test(ua)
  const isPhoneByUA = isIPhoneOrIPod || isAndroidPhone

  const isPortrait = window.matchMedia('(orientation: portrait)').matches
  return isPhoneByUA && isPortrait
}

function updateHeroForViewport() {
  heroUrl.value = isSmartphoneViewport() ? smartphoneHeroUrl : desktopHeroUrl
}

// highlights
const highlights = [
  {
    title: 'Azure Fundamentals (AZ-900)',
    description: 'Microsoft Azure fundamentals certification.',
    src: new URL('../assets/Azure Fundamentals - AZ900.png', import.meta.url).href,
    tags: ['Azure', 'Cloud'],
  },
  {
    title: 'CommBank Job Simulation',
    description: 'Virtual experience program (job simulation certificate).',
    src: new URL('../assets/CommBank Job Simulation Certificate.png', import.meta.url).href,
    tags: ['Consulting', 'Industry'],
  },
  {
    title: 'Monash IT Postgraduate Mentoring',
    description: 'Mentoring program participation / contribution.',
    src: new URL('../assets/Monash Mentoring Certificate.png', import.meta.url).href,
    tags: ['Leadership', 'Mentoring'],
  },
  {
    title: 'Monash Student Association Volunteering',
    description: 'Volunteering and community contribution.',
    src: new URL('../assets/MSA Volunteering Certificate.png', import.meta.url).href,
    tags: ['Volunteering', 'Community'],
  },
  {
    title: 'Azure OpenAI Workshop',
    description:
      'Represented company to deliver Azure OpenAI workshop and share chatbot use cases.',
    src: new URL('../assets/Azure OpenAI workshop.png', import.meta.url).href,
    tags: ['Azure OpenAI', 'Workshop', 'Speaking'],
  },
  {
    title: 'Smart City Expo Pitch',
    description: 'Represented company to introduce our chatbot product (online + offline).',
    src: new URL('../assets/2021SmartCityExpo.png', import.meta.url).href,
    tags: ['Pitch', 'Chatbot', 'Product'],
  },
]

// lightbox
const currentIndex = ref(0)

const lightbox = ref({
  open: false,
  src: '',
  title: '',
  description: '',
})

function openLightboxByIndex(i) {
  currentIndex.value = i
  const item = highlights[i]
  lightbox.value = {
    open: true,
    src: item.src,
    title: item.title,
    description: item.description,
  }
}

function openLightbox(item, i) {
  openLightboxByIndex(i)
}

function closeLightbox() {
  lightbox.value.open = false
}

function nextImage() {
  openLightboxByIndex((currentIndex.value + 1) % highlights.length)
}

function prevImage() {
  openLightboxByIndex((currentIndex.value - 1 + highlights.length) % highlights.length)
}

function onKeydown(e) {
  if (!lightbox.value.open) return
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'Escape') closeLightbox()
}

onMounted(async () => {
  updateHeroForViewport()
  typeEffect()
  await nextTick()
  aboutSlides.forEach((slide) => ensureAboutSlideState(slide.id))
  measureAboutMarquee()
  window.addEventListener('resize', measureAboutMarquee)
  window.addEventListener('pointermove', onAboutMarqueePointerMove)
  window.addEventListener('pointerup', onAboutMarqueePointerUp)
  window.addEventListener('pointercancel', onAboutMarqueePointerUp)
  marqueeRaf = window.requestAnimationFrame(tickAboutMarquee)

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--in')
          observer?.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 },
  )

  revealEls.forEach((el) => observer.observe(el))

  window.addEventListener('keydown', onKeydown)
  window.addEventListener('resize', updateHeroForViewport)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('resize', measureAboutMarquee)
  window.removeEventListener('pointermove', onAboutMarqueePointerMove)
  window.removeEventListener('pointerup', onAboutMarqueePointerUp)
  window.removeEventListener('pointercancel', onAboutMarqueePointerUp)
  window.removeEventListener('resize', updateHeroForViewport)
  observer?.disconnect()
  if (typingTimer) window.clearTimeout(typingTimer)
  if (marqueeRaf) window.cancelAnimationFrame(marqueeRaf)
})
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(0.9rem);
  transition:
    opacity 2000ms ease,
    transform 2000ms ease;
}

.reveal--in {
  opacity: 1;
  transform: translateY(0);
}

.aboutme-slides {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  align-items: center;
}

.aboutme-section-bg {
  background-image:
    linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url('../assets/background.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.aboutme-intro {
  margin: -0.35rem auto 0.65rem;
  max-width: 47.5rem;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  line-height: 1.45;
}

.aboutme-slide {
  width: 100%;
}

.aboutme-slide-title {
  margin-bottom: 0.2rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.aboutme-slide-desc {
  margin: 0 auto 0.42rem;
  max-width: 45rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.88rem;
  line-height: 1.35;
}

.aboutme-marquee-mask {
  width: 100%;
  overflow: hidden;
  position: relative;
  padding: 0.7rem 0.6rem;
  background: #fff;
  border-radius: 1rem;
  cursor: grab;
  touch-action: pan-y;
}

.aboutme-marquee-mask--dragging {
  cursor: grabbing;
}

.aboutme-marquee-mask::before,
.aboutme-marquee-mask::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 4rem;
  z-index: 2;
  pointer-events: none;
}

.aboutme-marquee-mask::before {
  left: 0;
  background: linear-gradient(to right, #000 0%, transparent 100%);
}

.aboutme-marquee-mask::after {
  right: 0;
  background: linear-gradient(to left, #000 0%, transparent 100%);
}

.aboutme-marquee-track {
  display: flex;
  width: max-content;
  gap: 1rem;
  user-select: none;
}

.aboutme-logo-item {
  width: 10.625rem;
  height: 6rem;
  border: 1px solid rgba(17, 24, 39, 0.15);
  border-radius: 0.875rem;
  background: rgba(255, 255, 255, 0.98);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
}

.aboutme-logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(1.02);
  user-select: none;
  -webkit-user-drag: none;
  -webkit-user-select: none;
  pointer-events: none;
}
</style>
