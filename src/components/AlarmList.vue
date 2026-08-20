<template>
  <div class="alarm-list">
    <div
      v-for="item in items"
      :key="`${item.time}-${item.title}`"
      class="alarm-row clickable-record"
      :class="item.tone"
      role="button"
      tabindex="0"
      @click="openRecord(item)"
      @keydown.enter.prevent="openRecord(item)"
      @keydown.space.prevent="openRecord(item)"
    >
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
import { inject } from "vue";
import AutoIcon from "./AutoIcon.vue";
import StatusTag from "./StatusTag.vue";

defineProps({
  items: { type: Array, required: true },
});

const openRecordDetail = inject("openRecordDetail", null);

function openRecord(item) {
  openRecordDetail?.("告警事件", item);
}

function levelLabel(tone) {
  if (tone === "high") return "高危";
  if (tone === "medium") return "中危";
  return "一般";
}
</script>
