<template>
  <div class="energy-trend">
    <div class="energy-trend__header">
      <strong>负荷趋势</strong>
      <span>今日 / 昨日对比</span>
      <em>当前 {{ currentLoad }} kW</em>
      <em>峰值 {{ peakLoad }} kW</em>
    </div>
    <div ref="chartEl" class="energy-line"></div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: { type: Object, required: true },
});

const chartEl = ref(null);
let chart;

const currentLoad = computed(() => props.data.today.at(-1)?.toLocaleString("zh-CN") || "--");
const peakLoad = computed(() => Math.max(...props.data.today).toLocaleString("zh-CN"));

const option = computed(() => ({
  animation: false,
  legend: {
    top: 0,
    right: 8,
    itemWidth: 10,
    itemHeight: 6,
    textStyle: { color: "#9bbbd0", fontSize: 10 },
  },
  grid: { left: 34, right: 18, top: 24, bottom: 24 },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(4,17,29,.94)",
    borderColor: "rgba(57,202,255,.42)",
    textStyle: { color: "#dff8ff" },
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: props.data.labels,
    axisLine: { lineStyle: { color: "rgba(125,183,215,.28)" } },
    axisTick: { show: false },
    axisLabel: { color: "#86acc3", fontSize: 10 },
  },
  yAxis: {
    type: "value",
    splitLine: { lineStyle: { color: "rgba(125,183,215,.13)" } },
    axisLabel: { color: "#86acc3", fontSize: 10 },
  },
  series: [
    {
      name: "今日负荷",
      type: "line",
      smooth: true,
      symbol: "none",
      data: props.data.today,
      lineStyle: { width: 2, color: "#2fd2ff" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(47,210,255,.28)" },
          { offset: 1, color: "rgba(47,210,255,.02)" },
        ]),
      },
    },
    {
      name: "昨日负荷",
      type: "line",
      smooth: true,
      symbol: "none",
      data: props.data.yesterday,
      lineStyle: { width: 2, color: "#38f2a5" },
    },
  ],
}));

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
