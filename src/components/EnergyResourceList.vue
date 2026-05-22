<template>
  <div class="energy-resource-list">
    <article v-for="item in items" :key="item.name" class="energy-resource-row">
      <img class="energy-resource-row__frame" src="/assets/energy-row-frame.svg" alt="" aria-hidden="true" />
      <AutoIcon class="energy-resource-row__icon" :name="item.icon" :tone="item.tone" />
      <strong class="energy-resource-row__name">{{ item.name }}</strong>
      <div class="energy-resource-row__metric energy-resource-row__metric--day">
        <b>{{ item.day }}</b>
        <span>{{ item.dayLabel }}</span>
      </div>
      <div class="energy-resource-row__metric energy-resource-row__metric--month">
        <b>{{ item.month }}</b>
        <span>{{ item.monthLabel }}</span>
      </div>
    </article>
  </div>
</template>

<script setup>
import AutoIcon from "./AutoIcon.vue";

defineProps({
  items: { type: Array, required: true },
});
</script>
