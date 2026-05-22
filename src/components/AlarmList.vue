<template>
  <div class="alarm-list">
    <div v-for="item in items" :key="`${item.time}-${item.title}`" class="alarm-row" :class="item.tone">
      <AutoIcon :name="item.icon" :tone="item.tone" />
      <div>
        <strong>{{ item.title }}</strong>
        <span>{{ item.place }}</span>
      </div>
      <time>{{ item.time }}</time>
      <StatusTag :label="levelLabel(item.tone)" :tone="item.tone" />
    </div>
  </div>
</template>

<script setup>
import AutoIcon from "./AutoIcon.vue";
import StatusTag from "./StatusTag.vue";

defineProps({
  items: { type: Array, required: true },
});

function levelLabel(tone) {
  if (tone === "high") return "高危";
  if (tone === "medium") return "中危";
  return "一般";
}
</script>
