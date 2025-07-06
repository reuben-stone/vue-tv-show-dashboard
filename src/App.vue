<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
    <header class="p-4 shadow-md bg-blue-600 text-white">
      <h1 class="text-2xl font-bold">TV Show Dashboard</h1>
    </header>
    <main class="p-4 max-w-7xl mx-auto">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
    import { RouterView } from 'vue-router'
</script>
