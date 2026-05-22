<template>
  <div ref="chartEl" class="security-overview-chart"></div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  data: { type: Object, required: true },
});

const chartEl = ref(null);
let chart;

const option = computed(() => ({
  animation: false,
  tooltip: {
    trigger: "item",
    backgroundColor: "rgba(4,17,29,.94)",
    borderColor: "rgba(57,202,255,.42)",
    textStyle: { color: "#dff8ff" },
  },
  grid: [
    { left: 44, right: "58%", top: 42, bottom: 34 },
    { left: "52%", right: 20, top: 42, bottom: 34 },
  ],
  legend: {
    right: 18,
    top: 4,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { color: "#9bbbd0", fontSize: 11 },
  },
  xAxis: [
    {
      gridIndex: 0,
      type: "category",
      data: props.data.trend.labels,
      axisLine: { lineStyle: { color: "rgba(125,183,215,.28)" } },
      axisTick: { show: false },
      axisLabel: { color: "#86acc3", fontSize: 10 },
    },
    {
      gridIndex: 1,
      type: "value",
      splitLine: { lineStyle: { color: "rgba(125,183,215,.12)" } },
      axisLabel: { color: "#86acc3", fontSize: 10 },
    },
  ],
  yAxis: [
    {
      gridIndex: 0,
      type: "value",
      splitLine: { lineStyle: { color: "rgba(125,183,215,.12)" } },
      axisLabel: { color: "#86acc3", fontSize: 10 },
    },
    {
      gridIndex: 1,
      type: "category",
      inverse: true,
      data: props.data.categories.map((item) => item.name),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: "#b6d2e3", fontSize: 11 },
    },
  ],
  series: [
    {
      name: "告警数",
      type: "line",
      xAxisIndex: 0,
      yAxisIndex: 0,
      smooth: true,
      symbol: "circle",
      symbolSize: 5,
      data: props.data.trend.alarms,
      lineStyle: { width: 2, color: "#ff9f32" },
      itemStyle: { color: "#ff9f32" },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "rgba(255,159,50,.24)" },
          { offset: 1, color: "rgba(255,159,50,.02)" },
        ]),
      },
    },
    {
      name: "闭环数",
      type: "line",
      xAxisIndex: 0,
      yAxisIndex: 0,
      smooth: true,
      symbol: "circle",
      symbolSize: 5,
      data: props.data.trend.closed,
      lineStyle: { width: 2, color: "#38f2a5" },
      itemStyle: { color: "#38f2a5" },
    },
    {
      name: "类型分布",
      type: "bar",
      xAxisIndex: 1,
      yAxisIndex: 1,
      barWidth: 10,
      data: props.data.categories.map((item) => ({
        value: item.value,
        itemStyle: { color: item.color },
      })),
      label: {
        show: true,
        position: "right",
        color: "#d9f1fd",
        fontSize: 11,
      },
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
