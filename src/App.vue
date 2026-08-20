<template>
  <div class="viewport">
    <div class="dashboard-shell" :style="shellStyle">
      <header class="topbar">
        <div class="brand">
          <div class="brand-copy">
            <h1>智慧工厂总控平台</h1>
            <span>Intelligent factory visual command center</span>
          </div>
        </div>
        <nav class="nav-tabs" aria-label="平台导航">
          <button
            v-for="item in data.nav"
            :key="item"
            class="nav-tab"
            :class="{ active: activeTab === item }"
            type="button"
            @click="activeTab = item"
          >
            {{ item }}
          </button>
        </nav>
        <div class="top-status">
          <span class="run-dot"></span>
          <span>系统运行正常</span>
          <span class="weather">多云&nbsp;&nbsp;26℃</span>
          <strong>{{ clock }}</strong>
          <span>{{ displayDate }}</span>
        </div>
      </header>

      <main class="dashboard">
        <div v-if="activeTab === '综合态势'" class="screen-grid">
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
              <SecurityParkScene />
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
                  <tr
                    v-for="item in data.energyWarnings"
                    :key="`${item.type}-${item.target}`"
                    class="clickable-record"
                    @click="openRecordDetail('能源预警', item)"
                  >
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
            <DashboardPanel title="安防颗粒度指标（今日）" sub="设备总览 / 综合安防">
              <SecurityOverviewChart :data="data.securityOverview" />
            </DashboardPanel>
          </footer>
        </div>

        <div v-else-if="activeTab === '综合安防'" class="security-management-grid">
          <section class="security-kpi-row">
            <DataCard v-for="item in data.securityManagement.kpis" :key="item.label" v-bind="item" />
          </section>

          <aside class="security-left-stack">
            <DashboardPanel title="实时告警处置">
              <div class="security-toolbar">
                <span v-for="item in data.securityManagement.alarmFilters" :key="item" :class="{ active: item === '全部' }">{{ item }}</span>
              </div>
              <AlarmList :items="data.securityManagement.realtimeAlarms" />
            </DashboardPanel>

            <DashboardPanel title="处置工单队列">
              <table class="warning-table security-work-table">
                <thead>
                  <tr>
                    <th>工单</th>
                    <th>事件</th>
                    <th>处置人</th>
                    <th>时限</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in data.securityManagement.workOrders"
                    :key="item.id"
                    class="clickable-record"
                    @click="openRecordDetail('处置工单事件', item)"
                  >
                    <td>{{ item.id }}</td>
                    <td>{{ item.event }}</td>
                    <td>{{ item.owner }}</td>
                    <td>{{ item.sla }}</td>
                    <td><StatusTag :label="item.status" :tone="item.tone" /></td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>
          </aside>

          <main class="security-center">
            <DashboardPanel title="安防管理一张图" sub="视频 / 门禁 / 周界 / 工单联动" class-name="map-panel">
              <SecurityParkScene />
            </DashboardPanel>
          </main>

          <aside class="security-right-stack">
            <DashboardPanel title="防区与点位状态">
              <div class="security-zone-list">
                <div v-for="item in data.securityManagement.zones" :key="item.name" class="security-zone-card" :class="item.tone">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.scope }}</span>
                  </div>
                  <b>{{ item.online }}</b>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
            </DashboardPanel>

            <DashboardPanel title="设备健康与在线">
              <BottomMetricGrid :items="data.securityManagement.deviceHealth" />
            </DashboardPanel>
          </aside>

          <footer class="security-bottom-row">
            <DashboardPanel title="通行管控明细">
              <table class="warning-table security-detail-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>人员/车辆</th>
                    <th>通行点</th>
                    <th>核验方式</th>
                    <th>结果</th>
                    <th>联动动作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in data.securityManagement.accessEvents"
                    :key="`${item.time}-${item.target}`"
                    class="clickable-record"
                    @click="openRecordDetail('通行管控事件', item)"
                  >
                    <td>{{ item.time }}</td>
                    <td>{{ item.target }}</td>
                    <td>{{ item.gate }}</td>
                    <td>{{ item.method }}</td>
                    <td><StatusTag :label="item.result" :tone="item.tone" /></td>
                    <td>{{ item.action }}</td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>

            <DashboardPanel title="巡更与值守">
              <div class="security-duty-grid">
                <div v-for="item in data.securityManagement.duty" :key="item.name">
                  <AutoIcon :name="item.icon" :tone="item.tone" />
                  <strong>{{ item.value }}</strong>
                  <span>{{ item.name }}</span>
                  <em>{{ item.desc }}</em>
                </div>
              </div>
            </DashboardPanel>

            <DashboardPanel title="告警趋势与类型">
              <SecurityOverviewChart :data="data.securityManagement.overview" />
            </DashboardPanel>
          </footer>
        </div>

        <div v-else-if="activeTab === '生产驾驶舱'" class="module-dashboard-grid production-page">
          <section class="module-kpi-row">
            <DataCard v-for="item in data.productionDashboard.kpis" :key="item.label" v-bind="item" />
          </section>

          <aside class="module-left-stack">
            <DashboardPanel title="产线运行状态" sub="A/B/C 线与关键约束">
              <div class="access-grid access-grid--wide">
                <MiniMetricCard
                  v-for="item in data.productionDashboard.lines"
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

            <DashboardPanel title="生产工单进度">
              <table class="warning-table module-table">
                <thead>
                  <tr>
                    <th>工单</th>
                    <th>批次</th>
                    <th>产线</th>
                    <th>计划</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in data.productionDashboard.orders" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.event }}</td>
                    <td>{{ item.owner }}</td>
                    <td>{{ item.sla }}</td>
                    <td><StatusTag :label="item.status" :tone="item.tone" /></td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>
          </aside>

          <main class="module-main-panel">
            <DashboardPanel title="车间流水线可视化" sub="平面工艺进度 / 3D 车间联动" class-name="production-visual-panel">
              <div class="production-view-switch" aria-label="生产流水线视图切换">
                <button
                  type="button"
                  :class="{ active: productionVisualMode === 'flat' }"
                  @click="productionVisualMode = 'flat'"
                >
                  平面进度
                </button>
                <button
                  type="button"
                  :class="{ active: productionVisualMode === 'three' }"
                  @click="productionVisualMode = 'three'"
                >
                  3D 车间
                </button>
              </div>

              <div class="production-visual" :class="`production-visual--${productionVisualMode}`">
                <FactoryTwinScene v-if="productionVisualMode === 'three'" />
                <div v-if="productionVisualMode === 'three'" class="production-visual__dock">
                  <div v-for="item in data.productionDashboard.stations.slice(0, 4)" :key="item.name" :class="item.tone">
                    <span>{{ item.name }}</span>
                    <strong>{{ item.percent }}%</strong>
                    <StatusTag :label="item.status" :tone="item.tone" />
                  </div>
                </div>

                <div
                  v-if="productionVisualMode === 'flat'"
                  ref="productionScroller"
                  class="production-visual__scroller production-visual__scroller--plan"
                  @pointerdown="startProductionDrag"
                  @pointermove="moveProductionDrag"
                  @pointerup="stopProductionDrag"
                  @pointercancel="stopProductionDrag"
                  @pointerleave="stopProductionDrag"
                >
                  <img :src="productionLinePlanSrc" alt="车间流水线平面工艺图" draggable="false" />
                </div>
              </div>
            </DashboardPanel>
          </main>

          <aside class="module-right-stack">
            <DashboardPanel title="质量与返工">
              <div class="security-zone-list">
                <div v-for="item in data.productionDashboard.quality" :key="item.name" class="security-zone-card" :class="item.tone">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.scope }}</span>
                  </div>
                  <b>{{ item.online }}</b>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
            </DashboardPanel>

            <DashboardPanel title="瓶颈与物料约束">
              <div class="ranking-list">
                <div v-for="item in data.productionDashboard.bottlenecks" :key="item.name" :class="item.tone">
                  <span>{{ item.name }}</span>
                  <div><i :style="{ width: `${item.percent}%` }"></i></div>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
              <div class="energy-control-strip compact">
                <div v-for="item in data.productionDashboard.materials" :key="item.label" :class="item.tone">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </DashboardPanel>
          </aside>
        </div>

        <div v-else-if="activeTab === '智慧通行'" class="module-dashboard-grid access-page">
          <section class="module-kpi-row">
            <DataCard v-for="item in data.accessPage.kpis" :key="item.label" v-bind="item" />
          </section>

          <aside class="module-left-stack">
            <DashboardPanel title="通行点位状态" sub="门禁 / 人闸 / 道闸">
              <div class="access-grid access-grid--wide">
                <MiniMetricCard
                  v-for="item in data.accessPage.gates"
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

            <DashboardPanel title="实时通行流水">
              <table class="warning-table module-table">
                <thead>
                  <tr>
                    <th>时间</th>
                    <th>对象</th>
                    <th>通行点</th>
                    <th>方式</th>
                    <th>结果</th>
                    <th>动作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in data.accessPage.realtime"
                    :key="`${item.time}-${item.target}`"
                    class="clickable-record"
                    @click="openRecordDetail('实时通行事件', item)"
                  >
                    <td>{{ item.time }}</td>
                    <td>{{ item.target }}</td>
                    <td>{{ item.gate }}</td>
                    <td>{{ item.method }}</td>
                    <td><StatusTag :label="item.result" :tone="item.tone" /></td>
                    <td>{{ item.action }}</td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>
          </aside>

          <main class="module-main-panel">
            <DashboardPanel title="通行态势一张图" sub="人车通行 / 异常拦截 / 点位联动" class-name="map-panel">
              <SecurityParkScene />
            </DashboardPanel>
          </main>

          <aside class="module-right-stack">
            <DashboardPanel title="通行趋势与点位排行">
              <SecurityOverviewChart :data="data.accessPage.overview" />
            </DashboardPanel>

            <DashboardPanel title="访客与车辆处置">
              <div class="compact-command-list">
                <div v-for="item in data.accessPage.riskQueue" :key="item.name" :class="item.tone">
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.scope }} / {{ item.online }}</span>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
              <div class="energy-control-strip compact">
                <div v-for="item in data.accessPage.laneStatus" :key="item.label" :class="item.tone">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </DashboardPanel>
          </aside>
        </div>

        <div v-else-if="activeTab === '能源驾驶舱'" class="module-dashboard-grid energy-page energy-combined-page">
          <section class="module-kpi-row">
            <DataCard v-for="item in data.energySituation.kpis" :key="item.label" v-bind="item" />
          </section>

          <aside class="module-left-stack">
            <DashboardPanel title="能源分类总览">
              <EnergyResourceList :items="data.energyResources" />
            </DashboardPanel>

            <DashboardPanel title="高耗能设备排行">
              <div class="ranking-list">
                <div v-for="item in data.energyAnalysis.ranking" :key="item.name" :class="item.tone">
                  <span>{{ item.name }}</span>
                  <div><i :style="{ width: `${item.percent}%` }"></i></div>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
            </DashboardPanel>
          </aside>

          <main class="module-main-panel">
            <DashboardPanel title="能源态势与分析" sub="负荷趋势 / 光储协同 / 能耗结构">
              <EnergyLineChart :data="data.energyLine" />
              <SecurityOverviewChart :data="data.energyAnalysis.overview" />
              <div class="energy-control-strip">
                <div v-for="item in data.remoteControls" :key="item.label" :class="item.tone">
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}</strong>
                </div>
              </div>
              <div class="security-zone-list energy-strategy-list">
                <div v-for="item in data.energySituation.strategies" :key="item.name" class="security-zone-card" :class="item.tone">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.scope }}</span>
                  </div>
                  <b>{{ item.online }}</b>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
            </DashboardPanel>
          </main>

          <aside class="module-right-stack">
            <DashboardPanel title="分区负荷与光储状态">
              <div class="pv-status-grid">
                <div v-for="item in data.energySituation.loadBalance" :key="item.label" :class="item.tone">
                  <AutoIcon :name="item.icon" />
                  <span>{{ item.label }}</span>
                  <strong>{{ item.value }}<em>{{ item.unit }}</em></strong>
                </div>
              </div>
              <div class="security-zone-list compact-zone-list">
                <div v-for="item in data.energyAnalysis.shiftCompare" :key="item.name" class="security-zone-card" :class="item.tone">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.scope }}</span>
                  </div>
                  <b>{{ item.online }}</b>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
            </DashboardPanel>

            <DashboardPanel title="能源预警与优化建议">
              <table class="warning-table module-table">
                <thead>
                  <tr>
                    <th>对象</th>
                    <th>问题</th>
                    <th>建议</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in data.energyAnalysis.suggestions"
                    :key="item.item"
                    class="clickable-record"
                    @click="openRecordDetail('能源优化预警', item)"
                  >
                    <td>{{ item.item }}</td>
                    <td>{{ item.issue }}</td>
                    <td>{{ item.action }}</td>
                    <td>{{ item.saving }}</td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>
          </aside>
        </div>

        <div v-else-if="activeTab === '设备总览'" class="module-dashboard-grid device-page">
          <section class="module-kpi-row">
            <DataCard v-for="item in data.deviceOverview.kpis" :key="item.label" v-bind="item" />
          </section>

          <aside class="module-left-stack">
            <DashboardPanel title="设备分类在线">
              <BottomMetricGrid :items="data.deviceAssets" />
            </DashboardPanel>
            <DashboardPanel title="运维工单">
              <table class="warning-table module-table">
                <thead>
                  <tr>
                    <th>工单</th>
                    <th>事件</th>
                    <th>负责人</th>
                    <th>时限</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in data.deviceOverview.maintenance"
                    :key="item.id"
                    class="clickable-record"
                    @click="openRecordDetail('设备运维事件', item)"
                  >
                    <td>{{ item.id }}</td>
                    <td>{{ item.event }}</td>
                    <td>{{ item.owner }}</td>
                    <td>{{ item.sla }}</td>
                    <td><StatusTag :label="item.status" :tone="item.tone" /></td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>
          </aside>

          <main class="module-main-panel">
            <DashboardPanel title="设备总览一张图" sub="视频 / 门禁 / 周界 / 能源采集">
              <div class="device-overview-layout">
                <div class="security-zone-list">
                  <div v-for="item in data.deviceOverview.groups" :key="item.name" class="security-zone-card" :class="item.tone">
                    <div>
                      <strong>{{ item.name }}</strong>
                      <span>{{ item.scope }}</span>
                    </div>
                    <b>{{ item.online }}</b>
                    <StatusTag :label="item.status" :tone="item.tone" />
                  </div>
                </div>
                <SecurityOverviewChart :data="data.deviceOverview.overview" />
              </div>
            </DashboardPanel>
          </main>

          <aside class="module-right-stack">
            <DashboardPanel title="平台基础能力">
              <div class="foundation-grid">
                <div v-for="item in data.foundation" :key="item.name">
                  <AutoIcon :name="item.icon" />
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.label1 }} {{ item.value1 }}</span>
                  <em>{{ item.label2 }} {{ item.value2 }}</em>
                </div>
              </div>
            </DashboardPanel>
            <DashboardPanel title="生命周期提醒">
              <div class="security-zone-list">
                <div v-for="item in data.deviceOverview.lifecycle" :key="item.name" class="security-zone-card" :class="item.tone">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.scope }}</span>
                  </div>
                  <b>{{ item.online }}</b>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
            </DashboardPanel>
          </aside>
        </div>

        <div v-else-if="activeTab === '联动指挥'" class="module-dashboard-grid command-page">
          <section class="module-kpi-row">
            <DataCard v-for="item in data.commandCenter.kpis" :key="item.label" v-bind="item" />
          </section>

          <aside class="module-left-stack">
            <DashboardPanel title="联动事件队列">
              <AlarmList :items="data.commandCenter.incidents" />
            </DashboardPanel>
          </aside>

          <main class="module-main-panel">
            <DashboardPanel title="指挥调度一张图" sub="事件 / 队伍 / 处置态势" class-name="map-panel">
              <SecurityParkScene />
            </DashboardPanel>
          </main>

          <aside class="module-right-stack">
            <DashboardPanel title="队伍在线与派遣">
              <div class="security-zone-list">
                <div v-for="item in data.commandCenter.teams" :key="item.name" class="security-zone-card" :class="item.tone">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.scope }}</span>
                  </div>
                  <b>{{ item.online }}</b>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
              <div class="security-zone-list compact-zone-list">
                <div v-for="item in data.commandCenter.resources" :key="item.name" class="security-zone-card" :class="item.tone">
                  <div>
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.scope }}</span>
                  </div>
                  <b>{{ item.online }}</b>
                  <StatusTag :label="item.status" :tone="item.tone" />
                </div>
              </div>
            </DashboardPanel>
            <DashboardPanel title="联动趋势与类型">
              <SecurityOverviewChart :data="data.commandCenter.overview" />
              <table class="warning-table module-table command-timeline-table">
                <tbody>
                  <tr
                    v-for="item in data.commandCenter.timeline"
                    :key="`${item.time}-${item.target}`"
                    class="clickable-record"
                    @click="openRecordDetail('联动指挥事件', item)"
                  >
                    <td>{{ item.time }}</td>
                    <td>{{ item.target }}</td>
                    <td>{{ item.method }}</td>
                    <td><StatusTag :label="item.result" :tone="item.tone" /></td>
                    <td>{{ item.action }}</td>
                  </tr>
                </tbody>
              </table>
            </DashboardPanel>
          </aside>
        </div>

        <div v-else class="module-placeholder">
          <DashboardPanel :title="`${activeTab}建设中`" sub="待接入业务数据">
            <div class="placeholder-content">
              <div class="module-menu-grid">
                <button
                  v-for="item in data.moduleMenus"
                  :key="item.name"
                  class="module-menu-card"
                  :class="{ active: activeTab === item.name }"
                  type="button"
                  @click="activeTab = item.name"
                >
                  <AutoIcon :name="item.icon" :tone="item.tone" />
                  <span>{{ item.name }}</span>
                  <em>{{ item.desc }}</em>
                </button>
              </div>
              <strong>{{ activeTab }}</strong>
              <span>当前模块保留导航入口，后续接入业务看板与联动流程。</span>
            </div>
          </DashboardPanel>
        </div>
      </main>
    </div>
    <DetailDrilldownModal :detail="activeDetailPanel" @close="closePanelDetail" />
    <FloatingAgent
      v-if="enableFloatingAgent"
      :active-tab="activeTab"
      :agents="data.aiAgents"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import AlarmList from "./components/AlarmList.vue";
import AutoIcon from "./components/AutoIcon.vue";
import BottomMetricGrid from "./components/BottomMetricGrid.vue";
import CampusMap from "./components/CampusMap.vue";
import DashboardPanel from "./components/DashboardPanel.vue";
import DataCard from "./components/DataCard.vue";
import DetailDrilldownModal from "./components/DetailDrilldownModal.vue";
import EnergyLineChart from "./components/EnergyLineChart.vue";
import EnergyResourceList from "./components/EnergyResourceList.vue";
import FactoryTwinScene from "./components/FactoryTwinScene.vue";
import FloatingAgent from "./components/FloatingAgent.vue";
import MiniMetricCard from "./components/MiniMetricCard.vue";
import SceneTag from "./components/SceneTag.vue";
import SecurityParkScene from "./components/SecurityParkScene.vue";
import SecurityOverviewChart from "./components/SecurityOverviewChart.vue";
import StatusTag from "./components/StatusTag.vue";
import { dashboardData as data } from "./data/dashboardData";

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const clock = ref("--:--:--");
const scale = ref(1);
const compact = ref(false);
const enableFloatingAgent = import.meta.env.VITE_ENABLE_FLOATING_AGENT !== "false";
const activeTab = ref("综合态势");
const activeDetailTitle = ref("");
const activeRecordDetail = ref(null);
const productionVisualMode = ref("flat");
const productionScroller = ref(null);
const productionLinePlanSrc = "./visuals/production-line-plan.svg";
let timer;
let productionDrag = null;
const weekdayLabels = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

const shellStyle = computed(() => compact.value ? {} : {
  transform: `scale(${scale.value})`,
  marginBottom: `${DESIGN_HEIGHT * (scale.value - 1)}px`,
});

const displayDate = computed(() => {
  const now = new Date();
  const date = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\//g, "-");
  return `${date} ${weekdayLabels[now.getDay()]}`;
});

const activeDetailPanel = computed(() => {
  if (activeRecordDetail.value) return activeRecordDetail.value;
  if (!activeDetailTitle.value) return null;
  const detail = data.panelDetails?.[activeDetailTitle.value];
  if (detail) return detail;
  return {
    title: activeDetailTitle.value,
    page: activeTab.value,
    metrics: [
      { label: "数据状态", value: "待接入", unit: "", sub: "当前模块暂无模拟明细", tone: "medium" },
    ],
    columns: [
      { key: "item", label: "对象" },
      { key: "status", label: "状态", toneKey: "tone" },
      { key: "desc", label: "说明" },
    ],
    rows: [
      { item: activeDetailTitle.value, status: "待接入", desc: "后续可绑定接口或补充模拟明细", tone: "medium" },
    ],
    related: [
      { name: activeTab.value, value: "当前页面", tone: "success" },
    ],
    insights: ["当前模块已保留下钻入口，可在数据文件中补充更细字段。"],
  };
});

function openPanelDetail(detail) {
  activeRecordDetail.value = null;
  activeDetailTitle.value = detail?.title || "";
}

function openRecordDetail(type, item) {
  activeDetailTitle.value = "";
  activeRecordDetail.value = buildRecordDetail(type, item);
}

function closePanelDetail() {
  activeDetailTitle.value = "";
  activeRecordDetail.value = null;
}

function handleKeydown(event) {
  if (event.key === "Escape") closePanelDetail();
}

provide("openPanelDetail", openPanelDetail);
provide("openRecordDetail", openRecordDetail);

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

function buildRecordDetail(type, item) {
  const isEnergy = type.includes("预警") || item.type || item.current || item.limit;
  const isAccess = item.gate || item.method || item.target;
  const isWork = item.id || item.owner || item.sla;
  const isCommand = type.includes("联动") || item.action || item.result;
  const title = item.title || item.type || item.event || item.target || item.item || "事件详情";
  const status = item.status || item.result || levelLabel(item.tone || item.level);
  const tone = item.tone || item.level || "medium";

  if (isEnergy) return buildEnergyRecordDetail(type, item, title, status, tone);
  if (isWork) return buildWorkRecordDetail(type, item, title, status, tone);
  if (isAccess || isCommand) return buildAccessRecordDetail(type, item, title, status, tone);
  return buildAlarmRecordDetail(type, item, title, status, tone);
}

function buildAlarmRecordDetail(type, item, title, status, tone) {
  return {
    title,
    page: `${activeTab.value} / ${type}`,
    layout: "security-layout",
    metrics: [
      { label: "风险等级", value: levelLabel(tone), unit: "", sub: item.place || "联动点位", tone },
      { label: "发生时间", value: item.time || "--:--", unit: "", sub: "今日实时记录", tone: "success" },
      { label: "处置状态", value: status, unit: "", sub: "已生成联动记录", tone },
      { label: "视频联动", value: "已调阅", unit: "", sub: "关联附近点位", tone: "success" },
    ],
    columns: [
      { key: "field", label: "字段" },
      { key: "value", label: "详情" },
    ],
    rows: [
      { field: "事件名称", value: title },
      { field: "发生点位", value: item.place || "园区联动点位" },
      { field: "发生时间", value: item.time || "--:--" },
      { field: "风险等级", value: levelLabel(tone) },
      { field: "处置链路", value: "视频复核 / 工单派发 / 现场反馈 / 闭环归档" },
    ],
    related: [
      { name: item.place || "关联点位", value: "视频复核", tone },
      { name: "处置队伍", value: "安保值班组", tone: "success" },
      { name: "联动方式", value: "短信 / 广播 / 工单", tone: "medium" },
    ],
    insights: ["建议优先查看该点位前后 5 分钟视频。", "若 10 分钟内未反馈现场状态，自动升级为催办。", "同点位重复触发时合并为一条处置链路。"],
  };
}

function buildEnergyRecordDetail(type, item, title, status, tone) {
  return {
    title,
    page: `${activeTab.value} / ${type}`,
    layout: "energy-layout",
    metrics: [
      { label: "当前值", value: item.current || item.value || "--", unit: "", sub: item.target || item.item || "监测对象", tone },
      { label: "阈值", value: item.limit || "策略阈值", unit: "", sub: "实时规则判断", tone: "medium" },
      { label: "状态", value: status || item.saving || "待处理", unit: "", sub: "能源联动状态", tone },
      { label: "节能建议", value: item.saving || "可优化", unit: "", sub: item.action || "待生成策略", tone: "success" },
    ],
    columns: [
      { key: "field", label: "字段" },
      { key: "value", label: "详情" },
    ],
    rows: [
      { field: "预警类型", value: item.type || title },
      { field: "监测对象", value: item.target || item.item || "能源监测对象" },
      { field: "当前值", value: item.current || "--" },
      { field: "阈值/问题", value: item.limit || item.issue || "--" },
      { field: "建议动作", value: item.action || "复核策略并派发能源运维" },
      { field: "处理状态", value: status },
    ],
    related: [
      { name: "能源回路", value: item.target || item.item || "分项回路", tone },
      { name: "联动策略", value: item.action || "错峰/限载/排查", tone: "success" },
      { name: "运维责任", value: "能源值班组", tone: "medium" },
    ],
    insights: ["建议同步查看近 30 分钟负荷曲线。", "若当前值连续三次越限，自动升级为高优先级工单。", "可与储能放电和光伏自用策略联动降低峰值。"],
  };
}

function buildWorkRecordDetail(type, item, title, status, tone) {
  return {
    title,
    page: `${activeTab.value} / ${type}`,
    layout: "device-layout",
    metrics: [
      { label: "工单编号", value: item.id || "自动生成", unit: "", sub: "事件派单", tone: "success" },
      { label: "负责人", value: item.owner || "值班组", unit: "", sub: "当前处置人", tone: "success" },
      { label: "剩余时限", value: item.sla || "--", unit: "", sub: "SLA 倒计时", tone },
      { label: "状态", value: status, unit: "", sub: "处置进度", tone },
    ],
    columns: [
      { key: "field", label: "字段" },
      { key: "value", label: "详情" },
    ],
    rows: [
      { field: "工单编号", value: item.id || "--" },
      { field: "事件内容", value: item.event || title },
      { field: "负责人", value: item.owner || "值班组" },
      { field: "剩余时限", value: item.sla || "--" },
      { field: "当前状态", value: status },
      { field: "下一步", value: item.action || "现场处置反馈" },
    ],
    related: [
      { name: "处置人", value: item.owner || "值班组", tone: "success" },
      { name: "工单状态", value: status, tone },
      { name: "SLA", value: item.sla || "--", tone: "medium" },
    ],
    insights: ["建议补充现场照片、视频截图和处理结果。", "临近 SLA 的事件自动置顶并推送值班长。", "同类工单可合并到一次巡检路线中处理。"],
  };
}

function buildAccessRecordDetail(type, item, title, status, tone) {
  return {
    title,
    page: `${activeTab.value} / ${type}`,
    layout: type.includes("联动") ? "command-layout" : "access-layout",
    metrics: [
      { label: "发生时间", value: item.time || "--:--", unit: "", sub: "实时流水", tone: "success" },
      { label: "对象", value: item.target || title, unit: "", sub: item.gate || "通行/联动对象", tone },
      { label: "结果", value: status, unit: "", sub: item.method || "核验方式", tone },
      { label: "联动动作", value: item.action || "记录", unit: "", sub: "自动处置链路", tone: "medium" },
    ],
    columns: [
      { key: "field", label: "字段" },
      { key: "value", label: "详情" },
    ],
    rows: [
      { field: "时间", value: item.time || "--:--" },
      { field: "对象", value: item.target || title },
      { field: "点位", value: item.gate || item.place || "联动点位" },
      { field: "核验/复核方式", value: item.method || "视频复核" },
      { field: "结果", value: status },
      { field: "联动动作", value: item.action || "记录并通知值班人员" },
    ],
    related: [
      { name: item.gate || "关联点位", value: item.method || "核验", tone: "success" },
      { name: "处置动作", value: item.action || "记录", tone },
      { name: "指挥联动", value: "视频 / 工单 / 通知", tone: "medium" },
    ],
    insights: ["建议查看该对象近 24 小时通行记录。", "异常结果会自动关联视频截图和门禁记录。", "连续异常对象进入重点关注队列。"],
  };
}

function centerProductionVisual() {
  const scroller = productionScroller.value;
  if (!scroller) return;
  scroller.scrollLeft = (scroller.scrollWidth - scroller.clientWidth) / 2;
}

function startProductionDrag(event) {
  const scroller = productionScroller.value;
  if (!scroller) return;
  productionDrag = {
    x: event.clientX,
    y: event.clientY,
    left: scroller.scrollLeft,
    top: scroller.scrollTop,
  };
  scroller.setPointerCapture?.(event.pointerId);
  scroller.classList.add("dragging");
}

function moveProductionDrag(event) {
  const scroller = productionScroller.value;
  if (!scroller || !productionDrag) return;
  scroller.scrollLeft = productionDrag.left - (event.clientX - productionDrag.x);
  scroller.scrollTop = productionDrag.top - (event.clientY - productionDrag.y);
}

function stopProductionDrag() {
  productionDrag = null;
  productionScroller.value?.classList.remove("dragging");
}

watch(activeTab, async (tab) => {
  if (tab !== "生产驾驶舱") return;
  await nextTick();
  centerProductionVisual();
});

watch(productionVisualMode, async (mode) => {
  await nextTick();
  centerProductionVisual();
});

onMounted(() => {
  tickClock();
  measure();
  centerProductionVisual();
  timer = window.setInterval(tickClock, 1000);
  window.addEventListener("resize", measure);
  window.addEventListener("keydown", handleKeydown);
});

onBeforeUnmount(() => {
  window.clearInterval(timer);
  window.removeEventListener("resize", measure);
  window.removeEventListener("keydown", handleKeydown);
});
</script>
