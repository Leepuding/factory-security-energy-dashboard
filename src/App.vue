<template>
  <div class="viewport">
    <div class="dashboard-shell" :style="shellStyle">
      <header class="topbar">
        <div class="brand">
          <div class="brand-shield">◇</div>
          <h1>智慧工厂安防与能耗驾驶舱</h1>
        </div>
        <nav class="nav-tabs" aria-label="平台导航">
          <button v-for="item in data.nav" :key="item" class="nav-tab" :class="{ active: item === '首页' }">{{ item }}</button>
        </nav>
        <div class="top-status">
          <span class="run-dot"></span>
          <span>系统运行正常</span>
          <span class="weather">多云&nbsp;&nbsp;26℃</span>
          <strong>{{ clock }}</strong>
          <span>2025-05-20 星期二</span>
        </div>
      </header>

      <main class="dashboard">
        <div class="screen-grid">
          <aside class="left-column">
            <DashboardPanel title="安防事件闭环">
              <div class="security-summary">
                <DataCard v-for="item in data.securitySummary" :key="item.label" v-bind="item" />
              </div>
              <SceneTag label="高危告警 TOP5" icon="alarm" tone="high" />
              <AlarmList :items="data.alarms" />
            </DashboardPanel>

            <DashboardPanel title="通行与人员管控">
              <div class="access-grid">
                <MiniMetricCard
                  v-for="item in data.access"
                  :key="item.name"
                  :title="item.name"
                  :icon="item.icon"
                  :tone="item.tone"
                  :line1-label="item.desc"
                  :line1-value="item.value"
                  :line2="item.total"
                />
              </div>
            </DashboardPanel>
          </aside>

          <main class="center-column">
            <DashboardPanel title="安防精细化态势图" sub="园区三维态势 / 点位联动" class-name="map-panel">
              <CampusMap :kpis="data.mapKpis" :points="data.mapPoints" :legend="data.mapLegend" />
            </DashboardPanel>
          </main>

          <aside class="right-column">
            <DashboardPanel title="能耗与新能源" sub="数据更新时间：2025-05-20 10:24:30">
              <SceneTag label="能源分类总览" icon="energy" tone="cyan" />
              <EnergyResourceList :items="data.energyResources" />
              <EnergyLineChart :data="data.energyLine" />
            </DashboardPanel>

            <DashboardPanel title="能源预警">
              <table class="warning-table">
                <thead>
                  <tr>
                    <th>预警类型</th>
                    <th>监测对象</th>
                    <th>当前值</th>
                    <th>阈值</th>
                    <th>等级</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in data.energyWarnings" :key="`${item.type}-${item.target}`">
                    <td>{{ item.type }}</td>
                    <td>{{ item.target }}</td>
                    <td>{{ item.current }}</td>
                    <td>{{ item.limit }}</td>
                    <td><StatusTag :label="levelLabel(item.level)" :tone="item.level" /></td>
                    <td>{{ item.status }}</td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>
          </aside>

          <footer class="bottom-column">
            <DashboardPanel title="安防设备接入清单">
              <BottomMetricGrid :items="data.deviceAssets" class-name="asset-list" />
            </DashboardPanel>
            <DashboardPanel title="安防颗粒度指标（今日）">
              <SecurityOverviewChart :data="data.securityOverview" />
            </DashboardPanel>
          </footer>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import AlarmList from "./components/AlarmList.vue";
import AutoIcon from "./components/AutoIcon.vue";
import BottomMetricGrid from "./components/BottomMetricGrid.vue";
import CampusMap from "./components/CampusMap.vue";
import DashboardPanel from "./components/DashboardPanel.vue";
import DataCard from "./components/DataCard.vue";
import EnergyLineChart from "./components/EnergyLineChart.vue";
import EnergyResourceList from "./components/EnergyResourceList.vue";
import MiniMetricCard from "./components/MiniMetricCard.vue";
import SceneTag from "./components/SceneTag.vue";
import SecurityOverviewChart from "./components/SecurityOverviewChart.vue";
import StatusTag from "./components/StatusTag.vue";
import { dashboardData as data } from "./data/dashboardData";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const clock = ref("--:--:--");
const scale = ref(1);
const compact = ref(false);
let timer;

const shellStyle = computed(() => compact.value ? {} : {
  transform: `scale(${scale.value})`,
  marginBottom: `${DESIGN_HEIGHT * (scale.value - 1)}px`,
});

function tickClock() {
  clock.value = new Date().toLocaleTimeString("zh-CN", { hour12: false });
}

function measure() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  compact.value = width < 1280 || height > width;
  if (!compact.value) {
    scale.value = width / DESIGN_WIDTH;
  }
}

function levelLabel(tone) {
  if (tone === "high") return "高危";
  if (tone === "medium") return "中危";
  return "一般";
}

onMounted(() => {
  tickClock();
  measure();
  timer = window.setInterval(tickClock, 1000);
  window.addEventListener("resize", measure);
});

onBeforeUnmount(() => {
  window.clearInterval(timer);
  window.removeEventListener("resize", measure);
});
</script>
