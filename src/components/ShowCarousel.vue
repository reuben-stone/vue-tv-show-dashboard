<template>
  <div>
    <!-- Header slot with counts and scroll buttons -->
    <slot
      name="header"
      :showsCount="shows.length"
      :isAtStart="isAtStart"
      :isAtEnd="isAtEnd"
      :scrollLeft="scrollLeft"
      :scrollRight="scrollRight"
    >
      <div class="flex justify-between items-center mb-2">
        <p class="text-sm text-gray-500 text-right">
          Showing {{ shows.length }} shows
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
    </slot>

    <div v-if="shows.length === 0 && !isLoading" class="text-center text-gray-500">
      No shows found.
    </div>

    <LoadingSpinner
      v-if="isLoading && shows.length === 0"
      class="mx-auto my-12"
    />

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
            v-for="show in shows"
            :key="show.id"
            :show="show"
            class="snap-start flex-shrink-0"
            :style="{ width: cardWidth + 'px' }"
          />
        </transition-group>
      </div>
    </div>

    <div v-if="shows.length > 0 && hasMore" class="flex justify-center mt-6">
      <button
        @click="$emit('load-more')"
        :disabled="isLoading"
        class="cursor-pointer rounded-full border border-green-500 bg-white text-green-700 px-6 py-2 text-sm font-semibold hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {{ isLoading ? 'Loading...' : 'Load More' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, defineExpose } from 'vue'
import ShowCard from '../components/ShowCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

interface Show {
  id: number | string
  // Add other fields as needed
}

const props = defineProps<{
  shows: Show[],
  cardWidth?: number,
  isLoading?: boolean,
  hasMore?: boolean,
}>()

const emits = defineEmits(['load-more'])

const carousel = ref<HTMLElement | null>(null)
const gap = 24
const isAtStart = ref(true)
const isAtEnd = ref(false)

function updateScrollButtons() {
  if (!carousel.value) return
  isAtStart.value = carousel.value.scrollLeft <= 0
  isAtEnd.value = carousel.value.scrollLeft >= carousel.value.scrollWidth - carousel.value.clientWidth - 1
}

function handleScroll() {
  updateScrollButtons()
}

function scrollLeft() {
  if (!carousel.value) return
  const width = props.cardWidth ?? 240
  carousel.value.scrollBy({ left: -(width + gap), behavior: 'smooth' })
}

function scrollRight() {
  if (!carousel.value) return
  const width = props.cardWidth ?? 240
  carousel.value.scrollBy({ left: width + gap, behavior: 'smooth' })
}

// Expose scroll methods so tests can call them
defineExpose({ scrollLeft, scrollRight })

// Reset scroll & update buttons when shows list changes
watch(() => props.shows, () => {
  if (carousel.value) {
    carousel.value.scrollTo({ left: 0, behavior: 'smooth' })
  }
  nextTick(() => updateScrollButtons())
})

onMounted(() => {
  updateScrollButtons()
})
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
