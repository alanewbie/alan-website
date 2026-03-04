<template>
  <div class="min-h-screen">
    <!-- Hero Section (Full screen image) -->
    <section class="relative w-full">
      <div class="relative h-[600px] w-full overflow-hidden">
        <!-- Image -->
        <img src="../assets/hero.png" class="absolute inset-0 w-full h-full object-cover" />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/30"></div>
        <!-- Text -->
        <div class="relative z-10 flex items-start justify-center text-center text-white pt-16">
          <div>
            <h1 class="text-5xl font-bold mb-3">Alan Tseng</h1>
            <p class="text-xl">Technical Presales · AI / SaaS · Australia</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Personal Information -->
    <section class="py-20 border-t">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl font-semibold mb-6">Some personal information</h2>

        <p class="text-gray-600 leading-relaxed mb-6">
          Write a short intro here. Example: I build AI-enabled products, design RAG pipelines, and
          support enterprise integrations across cloud + SaaS.
        </p>

        <ul class="space-y-2 text-gray-700">
          <li>• Based in Melbourne</li>
          <li>• Interests: AI, RAG, Cloud, Product</li>
          <li>• Open to: Solution Consulting / Engineering</li>
        </ul>
      </div>
    </section>

    <!-- Certificates / Pictures -->
    <section class="py-20 border-t">
      <div class="max-w-5xl mx-auto px-6">
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
