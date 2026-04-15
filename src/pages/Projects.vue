<template>
  <main class="min-h-screen bg-slate-950 text-white pt-24 pb-16">
    <section class="mx-auto w-full max-w-6xl px-6">
      <p class="text-sm uppercase tracking-[0.24em] text-cyan-200/80">Portfolio</p>
    </section>

    <section class="mx-auto mt-10 grid w-full max-w-6xl gap-7 px-6 md:grid-cols-2">
      <article
        v-for="project in starterProjects"
        :key="project.id"
        class="rounded-2xl border border-white/12 bg-white/5 p-6 shadow-lg shadow-black/20"
      >
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-2xl font-semibold">{{ project.title }}</h2>
          <span
            class="rounded-full border border-cyan-200/45 bg-cyan-200/10 px-3 py-1 text-xs font-medium text-cyan-100"
          >
            {{ project.badge }}
          </span>
        </div>

        <p class="mt-4 text-sm text-slate-300">{{ project.shortIntro }}</p>

        <div
          v-if="project.previewImage"
          class="mt-5 overflow-hidden rounded-xl border border-white/10"
        >
          <button
            type="button"
            class="block w-full cursor-zoom-in"
            @click="openImageModal(project)"
          >
            <img
              :src="project.previewImage"
              :alt="project.previewImageAlt"
              class="h-48 w-full object-cover object-top"
              loading="lazy"
            />
          </button>
        </div>

        <div class="mt-6 space-y-4">
          <div class="rounded-xl border border-white/10 bg-slate-900/40 p-4">
            <p class="text-xs uppercase tracking-[0.14em] text-slate-400">Overview</p>
            <p class="mt-2 text-sm text-slate-200">{{ project.overviewPlaceholder }}</p>
          </div>
        </div>

        <div class="mt-6">
          <p class="text-xs uppercase tracking-[0.14em] text-slate-400">Tech Stack</p>

          <div v-if="project.methodology?.length || project.tools?.length" class="mt-3 space-y-4">
            <div
              v-if="project.methodology?.length"
              class="rounded-xl border border-cyan-200/20 bg-cyan-200/5 p-4"
            >
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200/85">
                Methodology
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="item in project.methodology"
                  :key="`${project.id}-methodology-${item}`"
                  class="rounded-full border border-cyan-200/35 bg-cyan-200/10 px-3 py-1 text-xs text-cyan-50"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <div
              v-if="project.tools?.length"
              class="rounded-xl border border-emerald-200/20 bg-emerald-200/5 p-4"
            >
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-200/90">
                Tools
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="item in project.tools"
                  :key="`${project.id}-tools-${item}`"
                  class="rounded-full border border-emerald-200/35 bg-emerald-200/10 px-3 py-1 text-xs text-emerald-50"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>

          <div v-else-if="project.techSections?.length" class="mt-3 space-y-4">
            <div
              v-for="section in project.techSections"
              :key="`${project.id}-${section.title}`"
              class="rounded-xl border border-white/15 bg-white/5 p-4"
            >
              <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200/90">
                {{ section.title }}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                <span
                  v-for="item in section.items"
                  :key="`${project.id}-${section.title}-${item}`"
                  class="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/90"
                >
                  {{ item }}
                </span>
              </div>
            </div>
          </div>

          <div v-else class="mt-3 flex flex-wrap gap-2">
            <span
              v-for="tech in project.tech"
              :key="`${project.id}-${tech}`"
              class="rounded-full bg-white/10 px-3 py-1 text-xs text-white/85"
            >
              {{ tech }}
            </span>
          </div>
        </div>

        <div v-if="project.id === 'thesis'" class="mt-6 flex w-full items-center justify-between gap-3">
          <a
            :href="project.thesisReaderUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-lg border border-cyan-200/45 bg-cyan-200/15 px-4 py-2 text-sm font-semibold text-cyan-50 hover:bg-cyan-200/25"
          >
            Click here to read the Thesis
          </a>
          <a
            href="https://github.com/alanewbie/Australian-Legal-LLM-Benchmark"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-lg border border-cyan-200/45 bg-cyan-200/15 px-4 py-2 text-sm font-semibold text-cyan-50 hover:bg-cyan-200/25"
          >
            Click here to check the GIT repo
          </a>
        </div>

        <div v-if="project.id === 'taipei-101'" class="mt-6">
          <a
            :href="project.pressReleaseUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-lg border border-cyan-200/45 bg-cyan-200/15 px-4 py-2 text-sm font-semibold text-cyan-50 hover:bg-cyan-200/25"
          >
            Click here to read the Taipei gov press release
          </a>
        </div>
      </article>
    </section>

    <section class="mx-auto mt-8 w-full max-w-6xl px-6">
      <div class="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6">
        <h3 class="text-xl font-semibold">Coming Next</h3>
        <ul class="mt-3 list-disc pl-5 text-slate-300">
          <li>Onging a new project...</li>
        </ul>
      </div>
    </section>

    <div
      v-if="imageModal.open"
      class="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm p-4"
      @click.self="closeImageModal"
    >
      <div class="relative flex h-full w-full items-center justify-center">
        <div class="relative max-h-[90vh] w-full max-w-6xl">
          <button
            type="button"
            class="absolute right-2 top-2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg hover:bg-slate-200"
            aria-label="Close image preview"
            @click="closeImageModal"
          >
            X
          </button>
          <img
            :src="imageModal.src"
            :alt="imageModal.alt"
            class="max-h-[90vh] w-full rounded-xl border border-white/15 bg-black/40 object-contain"
            @click.stop
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { reactive } from 'vue'

const thesisPdfUrl = `${new URL('../assets/portfolio/AlanTseng-Thesis.pdf', import.meta.url).href}#toolbar=0&navpanes=0&scrollbar=1`
const thesisImageUrl = new URL('../assets/portfolio/AlanThesis.png', import.meta.url).href
const thesisCoverImageUrl = new URL('../assets/portfolio/AlanThesisCover.png', import.meta.url).href
const taipei101ImageUrl = new URL('../assets/portfolio/Taipei101.png', import.meta.url).href

const imageModal = reactive({
  open: false,
  src: '',
  alt: '',
})

function openImageModal(project) {
  imageModal.src = project.modalImage || project.previewImage || ''
  imageModal.alt = project.previewImageAlt || project.title || 'Project image'
  imageModal.open = true
}

function closeImageModal() {
  imageModal.open = false
}

const starterProjects = [
  {
    id: 'thesis',
    title: 'My Thesis',
    badge: 'Academic',
    shortIntro: 'Core research project from Monash master degree.',
    overviewPlaceholder:
      'This research develops a benchmark for evaluating LLM and embedding model combinations in Australian contract law, systematically comparing RAG and non-RAG systems to assess legal reasoning, retrieval accuracy, and hallucination.',
    methodology: [
      'Benchmark Design',
      'Semantic Chunking',
      'Prompt Engineering',
      'LLM-as-a-Judge Evaluation',
      'Retrieval-Augmented Generation',
    ],
    tools: [
      'Python',
      'LangChain',
      'FAISS',
      'OpenAI API',
      'text-embedding-3-large',
      'auslaw-embed-v1.0 (HuggingFace)',
    ],
    previewImage: thesisImageUrl,
    previewImageAlt: 'Alan thesis overview',
    modalImage: thesisCoverImageUrl,
    thesisReaderUrl: thesisPdfUrl,
  },
  {
    id: 'taipei-101',
    title: 'Taipei 101 Project',
    badge: 'Applied',
    shortIntro: 'Backend system focusing on Java, SQL, and LINE API',
    overviewPlaceholder:
      "Backend system for Taipei 101's 2022 Christmas campaign, enabling users to collect points and redeem rewards via LINE. Designed to handle high concurrency and real-time validation, supporting large-scale user engagement and business tracking.",
    techSections: [
      {
        title: 'Backend & Platform',
        items: [
          'Java (Spring Boot / Java EE)',
          'RESTful APIs',
          'MySQL',
          'LINE API (LIFF / Messaging)',
          'Microsoft Azure (Deployment)',
        ],
      },
      {
        title: 'System Design',
        items: [
          'QR Code Validation System',
          'Inventory & Redemption System',
          'High-Concurrency Handling',
          'Enum-based State Management',
        ],
      },
    ],
    previewImage: taipei101ImageUrl,
    previewImageAlt: 'Taipei 101 project explanation',
    modalImage: taipei101ImageUrl,
    pressReleaseUrl: 'https://www.tcooc.gov.taipei/cp.aspx?n=C9498570CEBDE71D',
  },
]
</script>
