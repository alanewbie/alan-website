<template>
  <div class="min-h-screen">
    <!-- Hero Section (Full screen image) -->
    <section class="relative w-full">
      <div class="relative w-full overflow-hidden min-h-[520px] h-[70vh] max-h-[720px]">
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

      <div class="absolute left-1/2 -bottom-20 sm:-bottom-24 md:-bottom-28 -translate-x-1/2 z-40">
        <img
          src="../assets/profile.png"
          alt="Alan Tseng"
          class="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white"
        />
      </div>
    </section>
    <!-- Personal Information -->
    <section class="pt-36 pb-20 border-t bg-black text-white">
      <div :ref="(el) => setRevealEl(el)" class="reveal max-w-5xl mx-auto px-6 text-center">
        <h2 class="text-4xl font-semibold mb-8">About Me</h2>
        <div class="grid md:grid-cols-3 gap-8 text-left">
          <div>
            <h3 class="text-lg font-semibold mb-3">AI & Engineering</h3>
            <ul class="text-gray-400 space-y-2 text-sm">
              <li>• Java, Python, JavaScript</li>
              <li>• Retrieval-Augmented Generation (RAG)</li>
              <li>• LLM Evaluation & Benchmarking</li>
              <li>• LangChain / OpenAI API</li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-3">Cloud & Platforms</h3>
            <ul class="text-gray-400 space-y-2 text-sm">
              <li>• Azure / AWS / GCP</li>
              <li>• API & SDK Integration</li>
              <li>• Enterprise SaaS Deployment</li>
              <li>• Database & Backend Systems</li>
            </ul>
          </div>
          <div>
            <h3 class="text-lg font-semibold mb-3">Business & Consulting</h3>
            <ul class="text-gray-400 space-y-2 text-sm">
              <li>• Technical Presales & POC</li>
              <li>• Enterprise Client Consulting</li>
              <li>• Cross-functional Collaboration</li>
              <li>• AI Adoption Strategy</li>
            </ul>
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
            <div class="max-h-[calc(85vh-52px)] overflow-auto p-4 flex items-center justify-center">
              <img
                :src="lightbox.src"
                :alt="lightbox.title"
                class="w-auto max-w-full max-h-[calc(85vh-52px-32px)] object-contain"
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
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'

const heroUrl = new URL('../assets/hero.png', import.meta.url).href
const roles = ['Technical Presales', 'Software Developer', 'Business Development Specialist']

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
  typeEffect()
  await nextTick()

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
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  observer?.disconnect()
  if (typingTimer) window.clearTimeout(typingTimer)
})
</script>

<style scoped>
.reveal {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 2000ms ease,
    transform 2000ms ease;
}

.reveal--in {
  opacity: 1;
  transform: translateY(0);
}
</style>
