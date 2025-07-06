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

    <div class="flex justify-between items-center mb-2">
        <p class="text-sm text-gray-500  text-right" v-if="!isLoading">
        Showing {{ filteredShows.length }} shows
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

    <div
      v-if="filteredShows.length === 0 && !isLoading"
      key="no-shows"
      class="text-center text-gray-500"
    >
      No shows found.
    </div>

    <LoadingSpinner
      v-if="isLoading && filteredShows.length === 0"
      class="mx-auto my-12"
    />

    <!-- Carousel container -->
    <div>
      <div
        ref="carousel"
        class="relative flex gap-6 overflow-x-auto py-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-transparent"
        @scroll="handleScroll"
      >
        <transition-group
          name="fade"
          tag="div"
          class="flex gap-4"
        >
          <ShowCard
            v-for="show in filteredShows"
            :key="show.id"
            :show="show"
            class="snap-start flex-shrink-0"
            :style="{ width: cardWidth + 'px' }"
          />
        </transition-group>
      </div>
    </div>

    <!-- Load More Button -->
    <div v-if="filteredShows.length > 0 && hasMore" class="flex justify-center mt-6">
    <button
        @click="loadMore"
        :disabled="isLoading"
        class="cursor-pointer rounded-full border border-green-500 bg-white text-green-700 px-6 py-2 text-sm font-semibold hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
        {{ isLoading ? 'Loading...' : 'Load More' }}
    </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useShowsStore } from '../stores/shows'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ShowCard from '../components/ShowCard.vue'
import SearchBar from '../components/SearchBar.vue'
import GenreFilterDropdown from '../components/GenreFilterDropdown.vue'
import SortControl from '../components/SortControl.vue'

const store = useShowsStore()

const searchQuery = ref('')
const isLoading = ref(false)
const hasMore = ref(true) // unused but kept

const selectedGenres = ref<string[]>([])
const sortOrder = ref<'asc' | 'desc'>('desc')

const carousel = ref<HTMLElement | null>(null)

const cardWidth = 256 // fixed width per card
const gap = 24 // gap-6 = 1.5rem = 24px

const isAtStart = ref(true)
const isAtEnd = ref(false)

watch(selectedGenres, async () => {
  if (carousel.value && typeof carousel.value.scrollTo === 'function') {
    carousel.value.scrollTo({ left: 0, behavior: 'smooth' })
  }
})

// Load initial 20 shows on mount (no load more)
onMounted(async () => {
  isLoading.value = true
  await store.loadMoreShows(20)
  isLoading.value = false
  await nextTick()
  updateScrollButtons()
})

async function loadMore() {
  if (isLoading.value) return
  isLoading.value = true
  const loaded = await store.loadMoreShows(20)
  isLoading.value = false
  hasMore.value = loaded
  await nextTick()
  updateScrollButtons()
}

// Combine buffer + displayed to get all available genres
interface Show {
    id: number
    name: string
    genres: string[]
    rating?: {
        average?: number
    }
    [key: string]: any
}

const allGenres = computed<string[]>(() => {
    const genreSet = new Set<string>()
    ;[...(store.displayedShows as Show[]), ...(store.apiBuffer as Show[])].forEach((show: Show) => {
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

function handleScroll() {
  updateScrollButtons()
}

function updateScrollButtons() {
  if (!carousel.value) return

  isAtStart.value = carousel.value.scrollLeft <= 0
  // Scroll width minus client width is max scrollLeft
  isAtEnd.value = carousel.value.scrollLeft >= carousel.value.scrollWidth - carousel.value.clientWidth - 1
}

function scrollLeft() {
  if (!carousel.value) return
  carousel.value.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' })
}

function scrollRight() {
  if (!carousel.value) return
  carousel.value.scrollBy({ left: cardWidth + gap, behavior: 'smooth' })
}
</script>

<style scoped>
/* Scrollbar styling */
.scrollbar-thin::-webkit-scrollbar {
  height: 8px;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(34, 197, 94, 0.7); /* green-500 */
  border-radius: 9999px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

/* Fade transition-group */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
