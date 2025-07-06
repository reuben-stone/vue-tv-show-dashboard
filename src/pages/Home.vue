<template>
  <div class="p-4">
    <div class="flex flex-col sm:flex-row sm:items-center sm:gap-4 mb-4">
        <SearchBar @search="handleSearch" class="flex-1" />
        <div class="mt-2 sm:mt-0 flex flex-wrap gap-2 max-w-md">
            <label
                v-for="genre in allGenres"
                :key="genre"
                class="inline-flex items-center space-x-2 cursor-pointer"
            >
                <input
                    type="checkbox"
                    :value="genre"
                    v-model="selectedGenres"
                    class="form-checkbox h-5 w-5 text-blue-600"
                />
                <span class="select-none">{{ genre }}</span>
            </label>
        </div>
    </div>

    <div v-if="filteredShows.length === 0" class="text-center text-gray-500">
      No shows found.
    </div>

    <div v-else class="overflow-x-auto whitespace-nowrap py-2">
      <ShowCard
        v-for="show in filteredShows"
        :key="show.id"
        :show="show"
        class="inline-block mr-4"
      />
    </div>

    <div class="flex justify-center mt-6">
      <button
        v-if="hasMore"
        @click="loadMore"
        :disabled="isLoading"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        <span v-if="isLoading">Loading...</span>
        <span v-else>Load More</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useShowsStore } from '../stores/shows'
import ShowCard from '../components/ShowCard.vue'
import SearchBar from '../components/SearchBar.vue'

const store = useShowsStore()

const searchQuery = ref('')
const selectedGenres = ref<string[]>([])

const isLoading = ref(false)
const hasMore = ref(true)

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

// Compute all genres from currently displayed shows
const allGenres = computed(() => {
  const genreSet = new Set<string>()
  store.displayedShows.forEach(show => {
    show.genres?.forEach((g: string) => genreSet.add(g))
  })
  return Array.from(genreSet).sort()
})

// Filter displayedShows by search and genres
const filteredShows = computed(() => {
  return store.displayedShows.filter(show => {
    const matchesSearch = searchQuery.value
      ? show.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      : true

    const matchesGenre =
      selectedGenres.value.length === 0 ||
      show.genres.some((g: string) => selectedGenres.value.includes(g))

    return matchesSearch && matchesGenre
  })
})

function handleSearch(query: string) {
  searchQuery.value = query
}
</script>
