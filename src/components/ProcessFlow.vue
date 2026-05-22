<template>
  <div class="process-flow">
    <span v-for="item in items" :key="item">{{ item }}</span>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, required: true },
});
</script>
