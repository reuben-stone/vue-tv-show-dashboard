<template>
  <div class="flex items-center gap-2">
    <label for="sort" class="text-sm font-medium text-gray-700">Sort by rating:</label>
    <select
      id="sort"
      :value="sortOrder"
      @change="emit('update:sortOrder', ($event.target as HTMLSelectElement).value as 'asc' | 'desc')"
      class="border border-gray-300 rounded px-2 py-1 text-sm"
    >
      <option value="desc">Highest first</option>
      <option value="asc">Lowest first</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<(e: 'update:sortOrder', value: 'asc' | 'desc') => void>()
</script>