<template>
  <div class="p-4 max-w-7xl mx-auto">
    <div class="flex flex-col sm:flex-col sm:items-center sm:gap-4 mb-4">
      <SearchBar @search="handleSearch" class="flex-1 w-full" />

      <div class="w-full sm:gap-4 mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <GenreFilterDropdown
          v-model:selectedGenres="selectedGenres"
          :allGenres="allGenres"
          class="mb-4 sm:mb-0"
        />
        <SortControl v-model:sortOrder="sortOrder" />
      </div>
    </div>

    <ShowCarousel
      :shows="filteredShows"
      :isLoading="isLoading"
      :hasMore="hasMore"
      :cardWidth="cardWidth"
      @load-more="loadMore"
    >
      <template #header="{ showsCount, isAtStart, isAtEnd, scrollLeft, scrollRight }">
        <div class="flex justify-between items-center mb-2">
          <p class="text-sm text-gray-500 text-right" v-if="!isLoading">
            Showing {{ showsCount }} shows
          </p>
          <div class="flex justify-end gap-2 mt-2">
            <button
              @click="scrollLeft"
              :disabled="isAtStart"
              class="rounded-full border border-green-500 bg-white text-green-700 px-4 py-1 text-sm font-semibold cursor-pointer hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Scroll left"
            >
              ‹
            </button>
            <button
              @click="scrollRight"
              :disabled="isAtEnd"
              class="rounded-full border border-green-500 bg-white text-green-700 px-4 py-1 text-sm font-semibold cursor-pointer hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              aria-label="Scroll right"
            >
              ›
            </button>
          </div>
        </div>
      </template>
    </ShowCarousel>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useShowsStore } from '../stores/shows'
import SearchBar from '../components/SearchBar.vue'
import GenreFilterDropdown from '../components/GenreFilterDropdown.vue'
import SortControl from '../components/SortControl.vue'
import ShowCarousel from '../components/ShowCarousel.vue'

interface Show {
  id: number
  name: string
  genres: string[]
  rating?: {
    average?: number
  }
  [key: string]: any
}

const store = useShowsStore()

const searchQuery = ref('')
const isLoading = ref(false)
const hasMore = ref(true)

const selectedGenres = ref<string[]>([])
const sortOrder = ref<'asc' | 'desc'>('desc')

const cardWidth = 256

const allGenres = computed(() => {
  const genreSet = new Set<string>()
  ;[...store.displayedShows, ...store.apiBuffer].forEach((show: Show) => {
    show.genres?.forEach((g: string) => genreSet.add(g))
  })
  return Array.from(genreSet).sort()
})

const filteredShows = computed(() => {
  const filtered = store.displayedShows.filter((show: Show) => {
    const matchesSearch = searchQuery.value
      ? show.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true
    const matchesGenres =
      selectedGenres.value.length === 0 ||
      show.genres.some((g: string) => selectedGenres.value.includes(g))
    return matchesSearch && matchesGenres
  })

  return filtered.sort((a, b) => {
    const ratingA = a.rating?.average ?? 0
    const ratingB = b.rating?.average ?? 0
    return sortOrder.value === 'asc' ? ratingA - ratingB : ratingB - ratingA
  })
})

onMounted(async () => {
  isLoading.value = true
  await store.loadMoreShows(20)
  isLoading.value = false
})

async function loadMore() {
  if (isLoading.value) return
  isLoading.value = true
  const loaded = await store.loadMoreShows(20)
  isLoading.value = false
  hasMore.value = loaded
}

function handleSearch(query: string) {
  searchQuery.value = query
}
</script>

