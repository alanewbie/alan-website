<template>
  <div class="min-h-screen">
    <!-- Hero Section (Full screen image) -->
    <section class="relative w-full">
      <div class="relative h-[640px] w-full overflow-hidden">
        <!-- Fixed background -->
        <div
          class="absolute inset-0 bg-fixed bg-no-repeat bg-top"
          :style="{
            backgroundImage: `url(${heroUrl})`,
            backgroundSize: '100% auto',
          }"
        ></div>
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="relative z-10 flex items-start justify-center text-center text-white pt-16">
          <div>
            <h1 class="text-3xl font-bold mb-1">Hello, this is</h1>
            <h1 class="text-5xl font-bold mb-3">Alan Tseng</h1>
            <p class="text-3xl">AI / SaaS {{ typedText }}<span class="cursor">|</span></p>
          </div>
        </div>
      </div>
      <div class="absolute left-1/2 -bottom-28 -translate-x-1/2 z-40">
        <img
          src="../assets/profile.png"
          alt="Alan Tseng"
          class="w-56 h-56 rounded-full object-cover border-4 border-white"
        />
      </div>
    </section>
    <!-- Personal Information -->
    <section class="pt-36 pb-20 border-t bg-black text-white">
      <div :ref="setRevealEl" class="reveal max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-semibold mb-6">My Story</h2>

        <p class="text-gray-600 leading-relaxed mb-6">
          Write a short intro here. Example: I build AI-enabled products, design RAG pipelines, and
          support enterprise integrations across cloud + SaaS.
        </p>

        <ul class="space-y-2 text-gray-700">
          <li>• Interests: AI, RAG, Cloud, Product</li>
          <li>• Open to: Solution Consulting / Engineering</li>
        </ul>
      </div>
    </section>

    <!-- Certificates / Pictures -->
    <section class="py-20 border-t bg-black text-white">
      <div :ref="setRevealEl" class="reveal max-w-5xl mx-auto px-6">
        <h2 class="text-3xl font-semibold text-center mb-10">Certificates & Highlights</h2>
        <div class="grid md:grid-cols-2 gap-6">
          <div class="border rounded-xl p-6 text-center">
            <div class="h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-gray-400">Certificate</span>
            </div>
            <p class="font-medium">AZ-900 (example)</p>
            <p class="text-sm text-gray-600">Short description here.</p>
          </div>
          <div class="border rounded-xl p-6 text-center">
            <div class="h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <span class="text-gray-400">Pictures</span>
            </div>
            <p class="font-medium">Volunteering / Events</p>
            <p class="text-sm text-gray-600">Short description here.</p>
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

const heroUrl = new URL('../assets/hero.png', import.meta.url).href
const roles = ['Technical Presales', 'Software Developer', 'Business Development Specialist']

const typedText = ref('')
let roleIndex = 0
let charIndex = 0
let deleting = false

function typeEffect() {
  const current = roles[roleIndex]

  if (!deleting) {
    typedText.value = current.substring(0, charIndex++)
  } else {
    typedText.value = current.substring(0, charIndex--)
  }

  let speed = deleting ? 50 : 100

  if (!deleting && charIndex === current.length + 1) {
    speed = 1500
    deleting = true
  } else if (deleting && charIndex === 0) {
    deleting = false
    roleIndex = (roleIndex + 1) % roles.length
  }

  setTimeout(typeEffect, speed)
}

const revealEls = []
const setRevealEl = (el) => {
  if (el) revealEls.push(el)
}

let observer

onMounted(() => {
  typeEffect()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal--in')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.15 },
  )

  revealEls.forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
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
