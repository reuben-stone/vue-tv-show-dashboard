<template>
  <div class="p-4">
    <div class="flex flex-col sm:flex-col sm:items-center sm:gap-4 mb-4">
      <SearchBar @search="handleSearch" class="flex-1 w-full" />

      <div class="w-full sm:gap-4 mb-4">
        <GenreFilterDropdown
          v-model:selectedGenres="selectedGenres"
          :allGenres="allGenres"
          class="mb-4"
        />
        <SortControl v-model:sortOrder="sortOrder"/>
      </div>
    </div>

    <p class="text-sm text-gray-500 mb-2 text-right" v-if="!isLoading">
      Showing {{ filteredShows.length }} shows
    </p>

    <div v-if="filteredShows.length === 0 && !isLoading" class="text-center text-gray-500">
      No shows found.
    </div>

    <!-- Loading Spinner -->
    <LoadingSpinner v-if="isLoading && filteredShows.length === 0" />       

    <div v-else class="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 py-4">
        <ShowCard
            v-for="show in filteredShows"
            :key="show.id"
            :show="show"
        />
    </div>

    <div class="flex justify-center mt-6" v-if="filteredShows.length > 0">
        <button
            v-if="hasMore"
            @click="loadMore"
            :disabled="isLoading"
            class="cursor-pointer px-4 py-2 bg-yellow-200 text-black rounded hover:bg-yellow-400 transition transition-transform duration-300 disabled:opacity-50 flex items-center gap-2"
        >
            <svg
                v-if="isLoading"
                class="animate-spin h-5 w-5 text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
            <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
            />
            <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
            </svg>
            <span>{{ isLoading ? 'Loading...' : 'Load More' }}</span>
        </button>
        </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useShowsStore } from '../stores/shows'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ShowCard from '../components/ShowCard.vue'
import SearchBar from '../components/SearchBar.vue'
import GenreFilterDropdown from '../components/GenreFilterDropdown.vue'
import SortControl from '../components/SortControl.vue'

const store = useShowsStore()

const searchQuery = ref('')
const isLoading = ref(false)
const hasMore = ref(true)

const selectedGenres = ref<string[]>([])
const sortOrder = ref<'asc' | 'desc'>('desc')

async function loadMore() {
  if (isLoading.value) return
  isLoading.value = true
  const loaded = await store.loadMoreShows(20)
  isLoading.value = false
  hasMore.value = loaded
}

onMounted(() => {
  loadMore()
})

// Combine buffer + displayed to get all available genres
const allGenres = computed(() => {
  const genreSet = new Set<string>()
  ;[...store.displayedShows, ...store.apiBuffer].forEach(show => {
    show.genres?.forEach((g: string) => genreSet.add(g))
  })
  return Array.from(genreSet).sort()
})

// Filter shows by search + genres
const filteredShows = computed(() => {
  const filtered = store.displayedShows.filter(show => {
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

function handleSearch(query: string) {
  searchQuery.value = query
}

const dropdownOpen = ref(false)

// Optional: close dropdown on click outside
function closeDropdown(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.relative')) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>
