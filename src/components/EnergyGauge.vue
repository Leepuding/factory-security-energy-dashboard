<template>
  <div class="energy-gauge">
    <div ref="chartEl" class="gauge-chart"></div>
    <strong>{{ value }}<em>{{ unit }}</em></strong>
    <span>{{ title }}</span>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  title: { type: String, required: true },
  value: { type: Number, required: true },
  max: { type: Number, default: 100 },
  unit: { type: String, default: "" },
  tone: { type: String, default: "cyan" },
});

const chartEl = ref(null);
let chart;

const palette = {
  cyan: ["#24dfff", "rgba(36,223,255,.12)"],
  green: ["#38f2a5", "rgba(56,242,165,.12)"],
  orange: ["#ff9f32", "rgba(255,159,50,.12)"],
  red: ["#ff5364", "rgba(255,83,100,.12)"],
};

const option = computed(() => {
  const [color, track] = palette[props.tone] || palette.cyan;
  return {
    animation: false,
    series: [{
      type: "gauge",
      radius: "94%",
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: props.max,
      axisLine: { lineStyle: { width: 8, color: [[1, track]] } },
      progress: { show: true, width: 8, itemStyle: { color } },
      pointer: { show: false },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      detail: { show: false },
      title: { show: false },
      data: [{ value: props.value }],
    }],
  };
});

function resize() {
  chart?.resize();
}

onMounted(() => {
  chart = echarts.init(chartEl.value, null, { renderer: "canvas" });
  chart.setOption(option.value, true);
  window.addEventListener("resize", resize);
});

watch(option, (next) => chart?.setOption(next, true));

onBeforeUnmount(() => {
  window.removeEventListener("resize", resize);
  chart?.dispose();
});
</script>
