<template>
  <div class="bottom-metric-grid" :class="className">
    <MiniMetricCard
      v-for="item in items"
      :key="item.name"
      :title="item.name"
      :icon="item.icon"
      :tone="item.tone"
      :line1-label="item.line1Label || ''"
      :line1-value="item.main || item.online"
      :line2="item.main ? item.sub : ''"
      :online="item.main ? '' : item.online"
      :offline="item.main ? '' : item.offline"
    />
  </div>
</template>

<script setup>
import MiniMetricCard from "./MiniMetricCard.vue";

defineProps({
  items: { type: Array, required: true },
  className: { type: String, default: "" },
});
</script>
