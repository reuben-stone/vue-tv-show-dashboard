<template>
  <div
    class="w-full cursor-pointer flex flex-col mb-4"
    @click="$router.push(`/show/${show.id}`)"
  >
    <div class="group overflow-hidden rounded-lg shadow-lg hover:shadow-xl flex mb-2">
        <img :src="show.image?.medium" alt="show.name" class="rounded shadow mb-2 w-full h-auto group-hover:scale-105 transition-transform duration-300 h-full w-full object-cover" />
    </div>
    <p class="text-lg font-semibold">{{ show.name }}</p>
    <p class="text-md text-gray-500">Rating: {{ show.rating?.average || 'N/A' }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const { show } = defineProps<{ show: any }>()
</script>