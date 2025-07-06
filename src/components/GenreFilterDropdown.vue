<template>
  <div class="w-full flex flex-wrap gap-2 mb-4">
    <button
      v-for="genre in allGenres"
      :key="genre"
      @click="toggleGenre(genre)"
      class="px-3 py-1 rounded-full border text-sm transition-all duration-200 cursor-pointer"
      :class="{
        'bg-green-200 text-green-900 border-green-400': selectedGenres.includes(genre),
        'bg-white text-gray-700 border-gray-300 hover:bg-gray-100': !selectedGenres.includes(genre),
      }"
    >
      {{ genre }}
    </button>

    <!-- Clear button -->
    <button
      v-if="selectedGenres.length > 0"
      @click="clearGenres"
      class="cursor-pointer px-3 py-1 rounded-full border border-red-400 text-red-600 bg-red-50 text-sm hover:bg-red-100 transition-all duration-200"
    >
      Clear
    </button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  allGenres: string[]
  selectedGenres: string[]
}>()

const emit = defineEmits<(e: 'update:selectedGenres', genres: string[]) => void>()

function toggleGenre(genre: string) {
  const newSelection = [...props.selectedGenres]
  const index = newSelection.indexOf(genre)
  index > -1 ? newSelection.splice(index, 1) : newSelection.push(genre)
  emit('update:selectedGenres', newSelection)
}

function clearGenres() {
  emit('update:selectedGenres', [])
}
</script>
