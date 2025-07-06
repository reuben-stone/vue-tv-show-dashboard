<template>
  <div class="mb-6">
    <h2 class="text-lg font-bold mb-2">{{ genre }}</h2>
    <div class="flex gap-4 overflow-x-auto pb-2">
      <ShowCard v-for="show in shows" :key="show.id" :show="show" />
    </div>
  </div>
</template>

<script setup lang="ts">
    import { defineProps } from 'vue'
    import ShowCard from './ShowCard.vue'
    const { genre, shows } = defineProps<{ genre: string; shows: any[] }>()
</script>