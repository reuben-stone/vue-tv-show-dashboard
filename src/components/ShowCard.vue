<template>
  <div
    class="w-[160px] cursor-pointer hover:scale-105 transition-transform duration-200"
    @click="$router.push(`/show/${show.id}`)"
  >
    <img :src="show.image?.medium" alt="show.name" class="rounded shadow mb-2 w-full h-auto" />
    <p class="text-sm font-semibold">{{ show.name }}</p>
    <p class="text-xs text-gray-500">Rating: {{ show.rating?.average || 'N/A' }}</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
const { show } = defineProps<{ show: any }>()
</script>