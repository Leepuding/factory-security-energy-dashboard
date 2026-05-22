<template>
  <section class="dashboard-panel" :class="className">
    <svg class="panel-frame" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path class="panel-frame__line" d="M2 10 L9 2 H91 L98 10 V90 L91 98 H9 L2 90 Z" />
      <path class="panel-frame__glow" d="M5 13 L12 5 H48" />
      <path class="panel-frame__glow right" d="M52 5 H88 L95 13" />
      <path class="panel-frame__base" d="M7 94 H38" />
      <path class="panel-frame__base right" d="M62 94 H93" />
    </svg>
    <div class="panel-corner lt"></div>
    <div class="panel-corner rb"></div>
    <header class="panel-header">
      <div class="panel-title-tab">
        <span class="panel-title-mark"></span>
        <h2>{{ title }}</h2>
      </div>
      <span>{{ sub }}</span>
    </header>
    <div class="panel-body">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  sub: { type: String, default: "更多 >" },
  className: { type: String, default: "" },
});
</script>
