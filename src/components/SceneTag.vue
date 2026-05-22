<template>
  <div class="scene-tag" :class="`scene-tag--${tone}`">
    <AutoIcon v-if="icon" :name="icon" :tone="tone" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup>
import AutoIcon from "./AutoIcon.vue";

defineProps({
  label: { type: String, required: true },
  icon: { type: String, default: "" },
  tone: { type: String, default: "cyan" },
});
</script>
