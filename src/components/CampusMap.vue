<template>
  <div class="campus-map" :class="{ 'campus-map--plain': hideKpis }">
    <div v-if="!hideKpis" class="map-kpi-strip">
      <MiniMetricCard
        v-for="item in kpis"
        :key="item.label"
        :title="item.label"
        :icon="item.icon"
        :tone="item.tone"
        :line1-label="item.metricLabel || '当前值'"
        :line1-value="`${item.value}${item.unit || ''}`"
        :line2="item.sub"
      />
    </div>
    <div class="map-stage" :style="mapStageStyle">
      <img class="campus-map__base" :src="imageSrc" alt="智慧工厂园区静态态势图" />
      <template v-if="showOverlay">
        <MapPoint v-for="point in points" :key="point.label" :point="point" />
      </template>
      <div v-if="showOverlay" class="map-toolbar">
        <button>图层切换</button>
        <button>全景视图</button>
        <button>告警热力</button>
        <button>+</button>
        <button>-</button>
        <button>2D</button>
      </div>
      <div v-if="showOverlay" class="map-legend">
        <span v-for="item in legend" :key="item.label">
          <AutoIcon :name="item.icon" />
          {{ item.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import AutoIcon from "./AutoIcon.vue";
import MapPoint from "./MapPoint.vue";
import MiniMetricCard from "./MiniMetricCard.vue";

const props = defineProps({
  kpis: { type: Array, required: true },
  points: { type: Array, required: true },
  legend: { type: Array, required: true },
  imageSrc: { type: String, default: "./maps/security-campus-map.png" },
  imageFit: { type: String, default: "contain" },
  imagePosition: { type: String, default: "center" },
  hideKpis: { type: Boolean, default: false },
  showOverlay: { type: Boolean, default: false },
});

const mapStageStyle = {
  "--map-image-fit": props.imageFit,
  "--map-image-position": props.imagePosition,
};
</script>
