<script setup lang="ts">
const props = defineProps<{
  direction?: 'up' | 'down' | 'left' | 'right'
}>()

// Default direction is down
const rotationDegrees = {
  down: '0',
  up: '180',
  left: '-90',
  right: '90',
}

const rotation = rotationDegrees[props.direction ?? 'down']
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :style="{ transform: `rotate(${rotation}deg)` }"
    class="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    stroke-width="2"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 9l6 6 6-6" />
  </svg>
</template>
