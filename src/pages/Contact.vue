<template>
  <main class="min-h-[calc(100vh-4rem)] bg-black text-white">
    <section class="mx-auto w-full max-w-6xl px-6 py-14">
      <div
        class="grid gap-10 rounded-3xl border border-white/10 bg-white/5 p-7 md:grid-cols-[17.5rem_1fr] md:p-10"
      >
        <div class="flex flex-col items-center text-center md:items-start md:text-left">
          <img
            src="../assets/profile.png"
            alt="Alan Tseng"
            class="h-40 w-40 rounded-full border-4 border-white/80 object-cover shadow-2xl md:h-48 md:w-48"
          />
          <h1 class="mt-5 text-3xl font-bold">Get In Touch</h1>
          <p class="mt-2 text-sm text-white/70">
            Open to Software Engineer, Solution Engineer, Consulting, and Presales roles, spanning
            both technical development and client-facing functions.
          </p>
        </div>

        <div class="space-y-7">
          <div>
            <h2 class="text-xl font-semibold">Contact Channels</h2>
            <p class="mt-1 text-sm text-white/65">Fastest response: email or LinkedIn message.</p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            <a
              class="rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:border-white/35 hover:bg-white/10"
            >
              <p class="text-xs uppercase tracking-wide text-white/55">Email</p>
              <p class="mt-1 break-all text-base font-semibold">yuanjen.tseng@gmail.com</p>
            </a>

            <a
              class="rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:border-white/35 hover:bg-white/10"
            >
              <p class="text-xs uppercase tracking-wide text-white/55">Phone (AU)</p>
              <p class="mt-1 text-base font-semibold">0451-468-437</p>
            </a>
          </div>

          <a
            href="https://www.linkedin.com/in/alan-tseng-9a198a1b3/"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-2xl border border-white/15 bg-white/5 p-4 transition hover:border-white/35 hover:bg-white/10"
          >
            <p class="text-xs uppercase tracking-wide text-white/55">LinkedIn</p>
            <p class="mt-1 break-all text-base font-semibold">
              linkedin.com/in/alan-tseng-9a198a1b3
            </p>
          </a>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-white/55">More Info</p>
            <p class="mt-2 text-sm text-white/75">Location: Melbourne, Australia</p>
            <p class="mt-1 text-sm text-white/75">Preferred employment type: Full-time</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
