<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-x-hidden">
    <header class="p-4 shadow-sm bg-white text-black">
      <RouterLink to="/" class="inline-block">
        <h1 class="text-lg font-bold opacity-80 relative flex items-center">
            <img src="/vite.svg" alt="RS TV" class="inline-block h-8 mr-2 max-w-[60px]" />
            <span class="text-sm text-gray-800 absolute top-0 left-[4rem]">TV</span>
        </h1>
      </RouterLink>
    </header>
    <main class="p-4 max-w-7xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
    import { RouterView } from 'vue-router'
</script>
