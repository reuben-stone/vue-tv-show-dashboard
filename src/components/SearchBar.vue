<template>
  <div class="mb-2">
    <input
      type="text"
      placeholder="Search TV shows..."
      class="w-full p-2 border border-gray-300 rounded"
      v-model="query"
      @input="emitSearch"
    />
  </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    const emit = defineEmits(['search'])
    const query = ref('')

    function emitSearch() {
        emit('search', query.value)
    }
</script>