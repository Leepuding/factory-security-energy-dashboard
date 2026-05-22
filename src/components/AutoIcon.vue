<template>
  <span class="auto-icon" :class="[`auto-icon--${tone}`, `auto-icon--${name}`]" aria-hidden="true">
    <svg viewBox="0 0 24 24" role="img">
      <path v-for="path in paths" :key="path" :d="path" />
    </svg>
  </span>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: { type: String, default: "default" },
  tone: { type: String, default: "normal" },
});

const iconPaths = {
  camera: ["M4 8h4l2-2h5l2 2h3v10H4V8Z", "M12 11.2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"],
  sphere: ["M12 4a6 6 0 0 1 6 6c0 2.7-1.8 5-4.3 5.7L13 20h-2l-.7-4.3A6 6 0 0 1 12 4Z", "M8 10h8"],
  access: ["M6 4h12v16H6V4Z", "M9 7h5v3H9V7Z", "M15 13h1.5v1.5H15V13Z"],
  turnstile: ["M5 5h4v14H5V5Z", "M15 5h4v14h-4V5Z", "M9 12h6"],
  barrier: ["M4 15h16v3H4v-3Z", "M6 9l12-4 1 3-12 4-1-3Z"],
  alarm: ["M12 3 3 20h18L12 3Z", "M11 8h2v6h-2V8Z", "M11 16h2v2h-2v-2Z"],
  face: ["M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z", "M8 10h2v2H8v-2Z", "M14 10h2v2h-2v-2Z", "M8 15c2 2 6 2 8 0"],
  visitor: ["M12 5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z", "M5 21c1-4 13-4 14 0"],
  car: ["M5 10l2-4h10l2 4v7H5v-7Z", "M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z", "M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"],
  guard: ["M6 20V8l6-4 6 4v12H6Z", "M9 20v-6h6v6"],
  lock: ["M6 10h12v10H6V10Z", "M9 10V7a3 3 0 0 1 6 0v3"],
  solar: ["M4 15h16l-2 5H2l2-5Z", "M8 15l2-7h6l2 7", "M12 3v3"],
  battery: ["M4 8h14v8H4V8Z", "M18 10h2v4h-2", "M7 11h7v2H7v-2Z"],
  energy: ["M13 2 5 13h6l-1 9 8-12h-6l1-8Z"],
  switch: ["M6 7h12a4 4 0 0 1 0 8H6a4 4 0 0 1 0-8Z", "M8 11h5", "M16 9v4"],
  perimeter: ["M4 5h16v14H4V5Z", "M8 5v14", "M16 5v14"],
  server: ["M5 4h14v6H5V4Z", "M5 14h14v6H5v-6Z", "M8 7h1", "M8 17h1"],
  screen: ["M4 5h16v12H4V5Z", "M9 21h6", "M12 17v4"],
  route: ["M6 6a2 2 0 1 0 0 .1", "M18 18a2 2 0 1 0 0 .1", "M7 6h6a4 4 0 0 1 0 8h-2a4 4 0 0 0 0 8h7"],
  process: ["M4 6h5v5H4V6Z", "M15 6h5v5h-5V6Z", "M10 8.5h4", "M12 11v4", "M9 15h6v5H9v-5Z"],
  message: ["M4 5h16v12H8l-4 4V5Z"],
  data: ["M12 3c4.4 0 8 1.1 8 2.5S16.4 8 12 8 4 6.9 4 5.5 7.6 3 12 3Z", "M4 8v5c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5V8", "M4 13v5c0 1.4 3.6 2.5 8 2.5s8-1.1 8-2.5v-5"],
  iot: ["M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M12 2v4", "M12 18v4", "M2 12h4", "M18 12h4"],
  default: ["M4 4h16v16H4V4Z", "M8 8h8v8H8V8Z"],
};

const paths = computed(() => iconPaths[props.name] || iconPaths.default);
</script>
