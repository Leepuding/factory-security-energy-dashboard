<template>
  <button class="map-point" :class="[point.type, point.tone]" :style="position" :title="point.label">
    <AutoIcon :name="point.icon" :tone="point.tone" />
    <span>{{ point.label }}</span>
  </button>
</template>

<script setup>
import { computed } from "vue";
import AutoIcon from "./AutoIcon.vue";

const props = defineProps({
  point: { type: Object, required: true },
});

const position = computed(() => ({
  left: `${props.point.x}%`,
  top: `${props.point.y}%`,
}));
</script>
