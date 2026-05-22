<template>
  <article class="data-card" :class="tone">
    <div class="data-card__icon">
      <AutoIcon :name="icon" :tone="tone" />
    </div>
    <div class="data-card__content">
      <span>{{ label }}</span>
      <strong>{{ value }}<em>{{ unit }}</em></strong>
      <small v-if="sub">{{ sub }}</small>
    </div>
  </article>
</template>

<script setup>
import AutoIcon from "./AutoIcon.vue";

defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: "" },
  sub: { type: String, default: "" },
  tone: { type: String, default: "normal" },
  icon: { type: String, default: "alarm" },
});
</script>
