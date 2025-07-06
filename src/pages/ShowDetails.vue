<template>
  <div class="p-4 max-w-4xl mx-auto">
    <img :src="show?.image?.original" alt="Show" class="rounded shadow mb-4" />
    <h1 class="text-2xl font-bold mb-2">{{ show?.name }}</h1>
    <p v-html="show?.summary" class="mb-4" />
    <p><strong>Genres:</strong> {{ show?.genres.join(', ') }}</p>
    <p><strong>Rating:</strong> {{ show?.rating?.average || 'N/A' }}</p>
    <p><strong>Schedule:</strong> {{ show?.schedule?.days.join(', ') }} at {{ show?.schedule?.time }}</p>
  </div>
</template>

<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useRoute } from 'vue-router'
    import { getShowById } from '../services/tvmaze'

    const route = useRoute()
    const show = ref<any>(null)

    onMounted(async () => {
        let id = route.params.id
        if (Array.isArray(id)) {
            id = id[0]
        }
        show.value = await getShowById(id)
    })
</script>