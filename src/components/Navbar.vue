<template>
  <nav class="fixed top-0 left-0 w-full bg-slate-900 text-white z-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <h1 class="text-xl font-bold">Alan's Website</h1>

        <div class="space-x-6">
          <router-link to="/" class="hover:text-blue-400">Home</router-link>
          <router-link to="/about" class="hover:text-blue-400">About</router-link>
          <router-link to="/contact" class="hover:text-blue-400">Contact</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
