<template>
  <div class="p-4 max-w-4xl mx-auto">
    <!-- Back button -->
    <button
      @click="goBack"
      class="cursor-pointer inline-flex items-center gap-1 mb-8 rounded-full border border-green-400 bg-green-100 text-green-800 px-4 py-1 transition hover:bg-green-200 focus:outline-none"
    >
      <Chevron direction="right" />
      <span>Back</span>
    </button>

    <transition name="fade">
      <div v-if="showLoaded">
        <h1 class="text-2xl font-bold mb-2">{{ show?.name }}</h1>
        <p v-html="show?.summary" class="mb-4" />
        <p><strong>Genres:</strong> {{ show?.genres.join(', ') }}</p>
        <p><strong>Rating:</strong> {{ show?.rating?.average || 'N/A' }}</p>
        <p><strong>Schedule:</strong> {{ show?.schedule?.days.join(', ') }} at {{ show?.schedule?.time }}</p>
        <img :src="show?.image?.original" alt="Show" class="rounded shadow mt-4" />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getShowById } from '../services/tvmaze'
import Chevron from '../components/icons/Chevron.vue'

const route = useRoute()
const router = useRouter()
const show = ref<any>(null)
const showLoaded = ref(false)

function goBack() {
  router.back()
}

onMounted(async () => {
  let id = route.params.id
  if (Array.isArray(id)) {
    id = id[0]
  }
  show.value = await getShowById(id)
  showLoaded.value = true
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
