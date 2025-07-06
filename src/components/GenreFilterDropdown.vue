<template>
  <div class="relative flex flex-row gap-4 w-full text-left">
    <button
      @click="dropdownOpen = !dropdownOpen"
      class="cursor-pointer w-full border border-gray-300 rounded px-4 py-2 bg-white text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
    >
      <span v-if="props.selectedGenres.length === 0" class="text-gray-400">Select genres</span>
      <span v-else>{{ props.selectedGenres.join(', ') }}</span>
    </button>

    <div
      v-if="dropdownOpen"
      class="absolute z-10 mt-12 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto"
    >
      <div v-for="genre in allGenres" :key="genre" class="px-4 py-2 hover:bg-gray-50">
        <label class="inline-flex gap-2 cursor-pointer w-full">
          <input
            type="checkbox"
            :value="genre"
            :checked="props.selectedGenres.includes(genre)"
            @change="toggleGenre(genre)"
            class="form-checkbox text-blue-600"
          />
          <span>{{ genre }}</span>
        </label>
      </div>
    </div>
    <!-- Clear button -->
    <div class="" v-if="props.selectedGenres.length > 0">
        <button
            @click="clearGenres"
            class="text-md cursor-pointer py-2 text-black rounded focus:outline-none cursor-pointer"
        >
            Clear
        </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  allGenres: string[]
  selectedGenres: string[]
}>()

const emit = defineEmits<(e: 'update:selectedGenres', genres: string[]) => void>()

const dropdownOpen = ref(false)

function toggleGenre(genre: string) {
  const newSelection = [...props.selectedGenres]
  const index = newSelection.indexOf(genre)
  index > -1 ? newSelection.splice(index, 1) : newSelection.push(genre)
  emit('update:selectedGenres', newSelection)
}

function closeDropdown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', closeDropdown))
onUnmounted(() => document.removeEventListener('click', closeDropdown))

function clearGenres() {
  emit('update:selectedGenres', [])
}
</script>
