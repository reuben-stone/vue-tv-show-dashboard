<template>
  <div class="flex items-center gap-2 text-sm relative">
    <div class="relative">
      <select
        id="sort"
        v-model="selected"
        class="appearance-none rounded-full border border-green-400 bg-green-100 text-green-800 pl-4 pr-8 py-1 transition hover:bg-green-200 focus:outline-none cursor-pointer"
      >
        <option value="desc">Highest rated first</option>
        <option value="asc">Lowest rated first</option>
      </select>

      <span class="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-green-600">
        <Chevron direction="down" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Chevron from './icons/Chevron.vue'

const props = defineProps<{
  sortOrder: 'asc' | 'desc'
}>()

const emit = defineEmits<(e: 'update:sortOrder', value: 'asc' | 'desc') => void>()

const selected = ref(props.sortOrder)

watch(selected, (val) => emit('update:sortOrder', val))
</script>
