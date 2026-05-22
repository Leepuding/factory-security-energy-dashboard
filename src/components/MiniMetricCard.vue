<template>
  <article class="mini-metric-card" :class="tone">
    <img class="mini-metric-card__frame" src="/assets/metric-mini-frame.svg" alt="" aria-hidden="true" />
    <AutoIcon class="mini-metric-card__icon" :name="icon" :tone="tone" />
    <span class="mini-metric-card__title">{{ title }}</span>
    <span v-if="online || offline" class="mini-metric-card__line mini-metric-card__line--primary mini-metric-card__ratio">
      <strong class="mini-metric-card__online">{{ online }}</strong>
      <i>/</i>
      <strong class="mini-metric-card__offline">{{ offline }}</strong>
    </span>
    <span v-else class="mini-metric-card__line mini-metric-card__line--primary">
      {{ line1Label }}
      <strong>{{ line1Value }}</strong>
    </span>
    <span v-if="line2" class="mini-metric-card__line mini-metric-card__line--secondary">
      {{ line2 }}
    </span>
  </article>
</template>

<script setup>
import AutoIcon from "./AutoIcon.vue";

defineProps({
  title: { type: String, required: true },
  icon: { type: String, default: "default" },
  tone: { type: String, default: "normal" },
  line1Label: { type: String, default: "" },
  line1Value: { type: String, default: "" },
  line2: { type: String, default: "" },
  online: { type: String, default: "" },
  offline: { type: String, default: "" },
});
</script>
