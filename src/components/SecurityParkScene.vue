<template>
  <div ref="containerRef" class="security-park-scene">
    <div class="security-park-scene__legend" aria-label="安防点位图例">
      <strong>图例</strong>
      <span v-for="item in legendItems" :key="item.type">
        <i :style="{ '--legend-color': item.color }"></i>
        {{ item.label }}
      </span>
    </div>

    <div class="security-park-scene__view-actions">
      <button type="button" @click="resetView">鸟瞰</button>
      <button type="button" @click="focusAlarm">告警</button>
    </div>

    <div ref="canvasWrapRef" class="security-park-scene__canvas">
      <div
        v-for="label in visibleLabels"
        :key="label.id"
        class="security-park-scene__label"
        :class="{ alarm: label.tone === 'alarm' }"
        :style="{ left: `${label.x}px`, top: `${label.y}px` }"
      >
        {{ label.text }}
      </div>

      <button
        v-for="hotspot in visibleHotspots"
        :key="`${hotspot.id}-hotspot`"
        type="button"
        class="security-park-scene__hotspot"
        :style="{ left: `${hotspot.x}px`, top: `${hotspot.y + 22}px` }"
        :aria-label="hotspot.point.name"
        @mouseenter="showPoint(hotspot.point, $event)"
        @pointerenter="showPoint(hotspot.point, $event)"
        @mousemove="moveTooltip($event)"
        @pointermove="moveTooltip($event)"
        @mouseleave="clearHover"
        @click="selectPoint(hotspot.point, $event)"
      ></button>

      <button
        v-for="hotspot in visibleBuildingHotspots"
        :key="`${hotspot.id}-building-hotspot`"
        type="button"
        class="security-park-scene__building-hotspot"
        :style="{ left: `${hotspot.x}px`, top: `${hotspot.y + 24}px` }"
        :aria-label="`${hotspot.building.name}下钻`"
        @click="openBuilding(hotspot.building)"
      ></button>

      <div
        v-if="hoveredPoint"
        class="security-park-scene__tooltip"
        :style="{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }"
      >
        <strong>{{ hoveredPoint.name }}</strong>
        <span>{{ hoveredPoint.status }}</span>
        <p>{{ hoveredPoint.desc }}</p>
      </div>
    </div>

    <div class="security-park-scene__selected">
      <span>当前选中</span>
      <strong>{{ selectedBuilding?.name || selectedPoint?.name || "北侧防区-周界入侵告警" }}</strong>
      <em>{{ selectedBuilding ? "建筑下钻视图" : selectedPoint?.status || "高危告警待处置" }}</em>
    </div>

    <div v-if="selectedBuilding" class="security-park-scene__drilldown">
      <div class="security-park-scene__drilldown-head">
        <span>建筑下钻</span>
        <button type="button" @click="closeBuilding">返回园区</button>
      </div>
      <strong>{{ selectedBuilding.name }}</strong>
      <p>{{ selectedBuilding.desc }}</p>
      <div class="security-park-scene__drilldown-grid">
        <article v-for="item in selectedBuilding.areas" :key="item.name" :class="item.tone">
          <span>{{ item.name }}</span>
          <b>{{ item.value }}</b>
          <small>{{ item.desc }}</small>
        </article>
      </div>
    </div>

    <div class="security-park-scene__metrics" aria-label="安防态势数据">
      <article v-for="item in metricItems" :key="item.label" :class="item.tone">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <small>{{ item.sub }}</small>
      </article>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const containerRef = ref(null);
const canvasWrapRef = ref(null);
const hoveredPoint = ref(null);
const selectedPoint = ref(null);
const selectedBuilding = ref(null);
const tooltip = ref({ x: 0, y: 0 });
const labels = ref([]);

// 后续改园区指标时，只需要调整这里的静态模拟数据。
const metricItems = [
  { label: "视频监控", value: "95.8%", sub: "在线 184 / 故障 8", tone: "normal" },
  { label: "周界防区", value: "4 / 4", sub: "北侧告警 2 处", tone: "danger" },
  { label: "门禁管理", value: "12", sub: "今日异常次数", tone: "warn" },
  { label: "人闸道闸", value: "1,852", sub: "今日通行次数", tone: "success" },
  { label: "警戒球机", value: "32", sub: "在线 31 / 告警 3", tone: "normal" },
];

// 后续改图例时，只需要调整类型、名称和颜色。
const legendItems = [
  { type: "camera", label: "摄像头", color: "#38bdf8" },
  { type: "sphere", label: "警戒球机", color: "#2dd4bf" },
  { type: "access", label: "门禁设备", color: "#4ade80" },
  { type: "turnstile", label: "人闸", color: "#22c55e" },
  { type: "barrier", label: "道闸", color: "#60a5fa" },
  { type: "perimeterAlarm", label: "周界告警", color: "#ff4d61" },
];

// 后续改建筑时，只需要调整 name、position、size、color、areas。
const buildingItems = [
  {
    id: "factory-main",
    name: "厂房",
    desc: "主体厂房下钻视图，重点展示东侧门禁、消防通道、屋面周界和车间内部视频巡检。",
    position: [-3.7, 1.75, -0.8],
    size: [6.7, 3.5, 18.8],
    color: 0x17547f,
    areas: [
      { name: "东侧门禁", value: "在线", desc: "门禁 / 摄像头联动", tone: "success" },
      { name: "消防通道", value: "1 处", desc: "车辆占道预警", tone: "warn" },
      { name: "屋面周界", value: "布防", desc: "越界与攀爬识别", tone: "danger" },
      { name: "车间内部", value: "12 路", desc: "视频巡检点位", tone: "normal" },
    ],
  },
  {
    id: "factory-annex",
    name: "厂房附楼",
    desc: "附楼下钻视图，展示辅助门禁、设备间和消防疏散口状态。",
    position: [-1.1, 1.05, -8.2],
    size: [1.9, 2.1, 3.3],
    color: 0x164463,
    areas: [
      { name: "设备间", value: "正常", desc: "门磁与视频在线", tone: "success" },
      { name: "疏散口", value: "2 个", desc: "通行状态正常", tone: "normal" },
    ],
  },
  {
    id: "north-room",
    name: "北侧辅房",
    desc: "北侧辅房靠近周界防区，重点联动北侧绿化带告警。",
    position: [2.8, 0.95, -8.5],
    size: [2.8, 1.9, 3.4],
    color: 0x1a5a75,
    areas: [
      { name: "北侧视频", value: "4 路", desc: "覆盖绿化带边界", tone: "normal" },
      { name: "防区联动", value: "布防", desc: "联动周界告警", tone: "danger" },
    ],
  },
  {
    id: "office",
    name: "办公楼",
    desc: "办公楼下钻视图，展示访客、人闸、门禁和异常通行记录。",
    position: [5.6, 1.35, 7.0],
    size: [3.8, 2.7, 4.7],
    rotation: -0.18,
    color: 0x1e638e,
    areas: [
      { name: "访客大厅", value: "在线", desc: "人闸 / 访客核验", tone: "success" },
      { name: "办公入口", value: "3 路", desc: "门禁与视频联动", tone: "normal" },
      { name: "异常通行", value: "2 次", desc: "今日复核记录", tone: "warn" },
    ],
  },
  {
    id: "guard",
    name: "门卫岗亭",
    desc: "门卫岗亭下钻视图，展示车辆入口、访客登记和保安值守点。",
    position: [3.3, 0.55, 10.5],
    size: [1.8, 1.1, 1.15],
    color: 0x1e7490,
    areas: [
      { name: "车牌识别", value: "在线", desc: "入口车辆核验", tone: "success" },
      { name: "值守人员", value: "2 人", desc: "南侧入口值守", tone: "normal" },
    ],
  },
];

// 后续改道路时，只需要调整中心点、宽高和旋转角度。
const roadItems = [
  { position: [-8.2, 0.035, -0.5], size: [21.5, 1.15], rotation: Math.PI / 2 },
  { position: [-2.1, 0.036, -10.4], size: [12.2, 1.15], rotation: 0 },
  { position: [-1.5, 0.037, 10.4], size: [13.2, 1.15], rotation: 0 },
  { position: [4.6, 0.038, -1.3], size: [17.9, 1.05], rotation: Math.PI / 2 },
  { position: [6.6, 0.039, 6.4], size: [5.8, 1.0], rotation: Math.PI / 2 },
  { position: [5.8, 0.04, 9.9], size: [5.5, 1.0], rotation: 0 },
  { position: [8.3, 0.041, 2.6], size: [11.8, 0.9], rotation: Math.PI / 2 },
  { position: [9.9, 0.042, 6.0], size: [6.2, 0.9], rotation: Math.PI / 2 },
];

// 后续改点位时，只需要调整坐标、类型、中文名称、状态和描述。
const pointItems = [
  { id: "cam-west-north", type: "camera", name: "厂房西北角摄像头", label: "摄像头", status: "在线", desc: "覆盖厂房西侧环形道路北段。", position: [-8.1, 0, -8.6] },
  { id: "alarm-north", type: "perimeterAlarm", name: "北侧绿化带周界入侵", label: "周界入侵", status: "高危告警待处置", desc: "北侧绿化带靠近厂房区域触发周界入侵。", position: [-2.2, 0, -11.0] },
  { id: "sphere-east", type: "sphere", name: "东侧主入口警戒球机", label: "警戒球机", status: "在线巡航", desc: "覆盖东侧主出入口、外部道路和厂区侧门。", position: [7.6, 0, -1.0] },
  { id: "access-factory-east", type: "access", name: "厂房东侧门禁", label: "门禁", status: "在线", desc: "厂房东侧人员出入口门禁。", position: [3.7, 0, -2.6] },
  { id: "barrier-east-gate", type: "barrier", name: "东侧车辆道闸", label: "道闸", status: "在线", desc: "东侧车辆入口道闸，连接外部道路。", position: [8.7, 0, -0.2] },
  { id: "access-office", type: "access", name: "办公楼门禁设备", label: "门禁", status: "在线", desc: "办公楼入口门禁，接入人员通行记录。", position: [4.6, 0, 6.3] },
  { id: "turnstile-office", type: "turnstile", name: "办公楼人闸", label: "人闸", status: "在线", desc: "办公楼访客与员工通行核验点。", position: [5.0, 0, 8.9] },
  { id: "barrier-south", type: "barrier", name: "南侧停车区道闸", label: "道闸", status: "在线", desc: "南侧停车区与内部环路交汇处道闸。", position: [-4.2, 0, 11.1] },
  { id: "cam-south-parking", type: "camera", name: "南侧停车区摄像头", label: "摄像头", status: "在线", desc: "覆盖南侧停车位、门卫岗亭和厂房南侧道路。", position: [-6.2, 0, 10.8] },
  { id: "alarm-east", type: "perimeterAlarm", name: "东侧外路周界告警", label: "周界入侵", status: "高危告警待处置", desc: "东侧靠外部道路围界触发异常越界。", position: [10.1, 0, 3.0] },
];

const visibleLabels = computed(() => labels.value.filter((item) => item.visible));
const visibleHotspots = computed(() => labels.value.filter((item) => item.visible && item.point));
const visibleBuildingHotspots = computed(() => labels.value.filter((item) => item.visible && item.building));

let renderer;
let scene;
let camera;
let controls;
let resizeObserver;
let animationId = 0;
let frame = 0;
let selectedMarker = null;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const pickableMeshes = [];
const pickableBuildings = [];
const markerGroups = [];
const buildingMeshes = new Map();
const animatedRings = [];
const labelTargets = [];

function markerColor(type) {
  if (type === "perimeterAlarm") return 0xff4d61;
  if (type === "access" || type === "turnstile") return 0x37e879;
  if (type === "sphere") return 0x2dd4bf;
  return 0x38bdf8;
}

function resetView() {
  if (!camera) return;
  camera.position.set(21, 20, 23);
  if (controls) {
    controls.target.set(0, 0, 0);
    controls.update();
  }
}

function focusAlarm() {
  if (!camera || !controls) return;
  const point = pointItems.find((item) => item.type === "perimeterAlarm");
  if (!point) return;
  camera.position.set(point.position[0] + 8, 9, point.position[2] + 8);
  controls.target.set(point.position[0], 0.8, point.position[2]);
  controls.update();
}

function createMaterial(color, opacity = 1, emissiveIntensity = 0.25) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity,
    roughness: 0.46,
    metalness: 0.28,
    transparent: opacity < 1,
    opacity,
  });
}

function addBuilding(item) {
  const material = createMaterial(item.color, 0.95, 0.18);
  const geometry = new THREE.BoxGeometry(...item.size);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...item.position);
  mesh.rotation.y = item.rotation || 0;
  mesh.userData.building = item;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add(mesh);
  pickableBuildings.push(mesh);
  buildingMeshes.set(item.id, mesh);

  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(geometry),
    new THREE.LineBasicMaterial({ color: 0x50d7ff, transparent: true, opacity: 0.42 }),
  );
  edges.position.copy(mesh.position);
  edges.rotation.copy(mesh.rotation);
  scene.add(edges);

  const [width, height, depth] = item.size;
  for (let side = -1; side <= 1; side += 2) {
    for (let row = 0; row < Math.max(1, Math.floor(height)); row += 1) {
      for (let col = 0; col < Math.max(2, Math.floor(width)); col += 1) {
        const win = new THREE.Mesh(
          new THREE.PlaneGeometry(0.38, 0.12),
          new THREE.MeshBasicMaterial({ color: 0x8ee8ff, transparent: true, opacity: 0.56 }),
        );
        win.position.set(
          item.position[0] - width / 2 + 0.8 + col * 1.05,
          item.position[1] - height / 2 + 0.8 + row * 0.75,
          item.position[2] + side * (depth / 2 + 0.012),
        );
        win.rotation.y = (item.rotation || 0) + (side < 0 ? Math.PI : 0);
        scene.add(win);
      }
    }
  }

  addFloatingText(item.name, new THREE.Vector3(item.position[0], item.position[1] + item.size[1] / 2 + 0.7, item.position[2]), "normal", item);
}

function addRoad(item) {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(item.size[0], item.size[1]),
    new THREE.MeshBasicMaterial({ color: 0x16334a, transparent: true, opacity: 0.86 }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.rotation.z = item.rotation;
  mesh.position.set(...item.position);
  scene.add(mesh);

  const line = new THREE.Mesh(
    new THREE.PlaneGeometry(item.size[0], 0.035),
    new THREE.MeshBasicMaterial({ color: 0x29dfff, transparent: true, opacity: 0.42 }),
  );
  line.rotation.copy(mesh.rotation);
  line.position.set(item.position[0], item.position[1] + 0.015, item.position[2]);
  scene.add(line);
}

function addSegment(start, end, color, radius, opacity) {
  const from = new THREE.Vector3(start[0], start[1], start[2]);
  const to = new THREE.Vector3(end[0], end[1], end[2]);
  const direction = new THREE.Vector3().subVectors(to, from);
  const length = direction.length();
  const geometry = new THREE.CylinderGeometry(radius, radius, length, 10);
  const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(from).add(to).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  scene.add(mesh);
  return mesh;
}

function addPerimeter() {
  const corners = [
    [-9.7, 0.18, -12.0],
    [3.4, 0.18, -11.8],
    [7.6, 0.18, -8.6],
    [9.9, 0.18, 8.5],
    [5.1, 0.18, 11.9],
    [-8.4, 0.18, 11.7],
    [-9.7, 0.18, -12.0],
  ];

  for (let i = 0; i < corners.length - 1; i += 1) {
    addSegment(corners[i], corners[i + 1], 0x20dfff, 0.035, 0.9);
    addSegment([corners[i][0], 0.85, corners[i][2]], [corners[i + 1][0], 0.85, corners[i + 1][2]], 0x1e8cff, 0.018, 0.62);
    const start = new THREE.Vector3(...corners[i]);
    const end = new THREE.Vector3(...corners[i + 1]);
    const distance = start.distanceTo(end);
    const count = Math.max(2, Math.floor(distance / 1.35));
    for (let j = 0; j <= count; j += 1) {
      const postPosition = start.clone().lerp(end, j / count);
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.72, 0.08),
        new THREE.MeshBasicMaterial({ color: 0x49dfff, transparent: true, opacity: 0.5 }),
      );
      post.position.set(postPosition.x, 0.48, postPosition.z);
      scene.add(post);
    }
  }

  addFloatingText("北侧防区", new THREE.Vector3(-2.4, 1.2, -12.0), "normal");
}

function addNorthDefenseZone() {
  const zone = new THREE.Mesh(
    new THREE.PlaneGeometry(11.2, 2.2),
    new THREE.MeshBasicMaterial({ color: 0x095c9f, transparent: true, opacity: 0.24 }),
  );
  zone.rotation.x = -Math.PI / 2;
  zone.position.set(-2.4, 0.055, -10.8);
  scene.add(zone);

  const edge = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(11.2, 0.04, 2.2)),
    new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 }),
  );
  edge.position.set(-2.4, 0.08, -10.8);
  scene.add(edge);
}

function addSitePlanDetails() {
  const greenMaterial = new THREE.MeshBasicMaterial({ color: 0x2eff75, transparent: true, opacity: 0.28 });
  const parkingMaterial = new THREE.MeshBasicMaterial({ color: 0x8ee8ff, transparent: true, opacity: 0.45 });
  const externalRoadMaterial = new THREE.MeshBasicMaterial({ color: 0x172536, transparent: true, opacity: 0.72 });

  const eastRoad = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 24), externalRoadMaterial);
  eastRoad.rotation.x = -Math.PI / 2;
  eastRoad.rotation.z = -0.16;
  eastRoad.position.set(11.8, 0.03, -0.1);
  scene.add(eastRoad);

  const southParkingBase = new THREE.Mesh(new THREE.PlaneGeometry(6.2, 1.15), externalRoadMaterial);
  southParkingBase.rotation.x = -Math.PI / 2;
  southParkingBase.position.set(-5.3, 0.045, 11.35);
  scene.add(southParkingBase);

  for (let index = 0; index < 13; index += 1) {
    const stall = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.9), parkingMaterial);
    stall.rotation.x = -Math.PI / 2;
    stall.position.set(-8.0 + index * 0.43, 0.07, 11.35);
    scene.add(stall);
  }

  const greenBelts = [
    { x: -6.3, z: -11.3, w: 7.5, h: 0.75 },
    { x: -9.2, z: -0.2, w: 0.55, h: 19.5 },
    { x: 8.2, z: 7.8, w: 1.0, h: 4.8 },
    { x: -5.6, z: 12.1, w: 6.8, h: 0.55 },
  ];

  greenBelts.forEach((belt) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(belt.w, belt.h), greenMaterial);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(belt.x, 0.06, belt.z);
    scene.add(mesh);
  });
}

function addMarkerShape(group, item, color) {
  const material = createMaterial(color, 1, item.type === "perimeterAlarm" ? 1.35 : 0.75);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), material);
  head.position.y = 0.92;
  head.userData.point = item;
  group.add(head);
  pickableMeshes.push(head);

  const hitArea = new THREE.Mesh(
    new THREE.SphereGeometry(0.58, 16, 10),
    new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
  );
  hitArea.position.y = 0.92;
  hitArea.userData.point = item;
  group.add(hitArea);
  pickableMeshes.push(hitArea);

  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.8, 12), material);
  pole.position.y = 0.42;
  group.add(pole);

  if (item.type === "barrier") {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.08), material);
    arm.position.set(0.32, 0.78, 0);
    group.add(arm);
  } else if (item.type === "turnstile") {
    const gate = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.12), material);
    gate.position.y = 0.72;
    group.add(gate);
  } else if (item.type === "access") {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.12), material);
    panel.position.y = 0.76;
    group.add(panel);
  } else if (item.type === "sphere") {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.025, 8, 32), material);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.92;
    group.add(ring);
  }

  const halo = new THREE.Mesh(
    new THREE.RingGeometry(0.28, 0.48, 40),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, side: THREE.DoubleSide }),
  );
  halo.rotation.x = -Math.PI / 2;
  halo.position.y = 0.05;
  group.add(halo);

  if (item.type === "perimeterAlarm") {
    for (let index = 0; index < 3; index += 1) {
      const alarmRing = new THREE.Mesh(
        new THREE.RingGeometry(0.5, 0.56, 48),
        new THREE.MeshBasicMaterial({ color: 0xff4d61, transparent: true, opacity: 0.65, side: THREE.DoubleSide }),
      );
      alarmRing.rotation.x = -Math.PI / 2;
      alarmRing.position.y = 0.08 + index * 0.01;
      alarmRing.userData.phase = index * 0.33;
      group.add(alarmRing);
      animatedRings.push(alarmRing);
    }
  }
}

function addSecurityPoint(item) {
  const color = markerColor(item.type);
  const group = new THREE.Group();
  group.position.set(item.position[0], 0, item.position[2]);
  group.userData.point = item;
  addMarkerShape(group, item, color);
  scene.add(group);
  markerGroups.push(group);
  labelTargets.push({
    id: item.id,
    text: item.label,
    tone: item.type === "perimeterAlarm" ? "alarm" : "normal",
    target: new THREE.Vector3(item.position[0], 1.55, item.position[2]),
    point: item,
  });
}

function addFloatingText(id, target, tone, building = null) {
  labelTargets.push({ id, text: id, tone, target, building });
}

function buildScene() {
  scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.Fog(0x04101d, 28, 58);

  camera = new THREE.PerspectiveCamera(43, 1, 0.1, 1000);
  resetView();

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  canvasWrapRef.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 9;
  controls.maxDistance = 42;
  controls.maxPolarAngle = Math.PI * 0.48;
  controls.target.set(0, 0, 0);
  controls.update();

  scene.add(new THREE.AmbientLight(0x5bd8ff, 0.95));
  const hemi = new THREE.HemisphereLight(0xcff8ff, 0x061629, 1.35);
  scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(6, 18, 10);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(key);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 28),
    new THREE.MeshStandardMaterial({ color: 0x071521, roughness: 0.82, metalness: 0.18 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const grid = new THREE.GridHelper(28, 28, 0x29dfff, 0x15516b);
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  scene.add(grid);

  roadItems.forEach(addRoad);
  addSitePlanDetails();
  addNorthDefenseZone();
  addPerimeter();
  buildingItems.forEach(addBuilding);
  pointItems.forEach(addSecurityPoint);

  renderer.domElement.addEventListener("pointermove", handlePointerMove);
  renderer.domElement.addEventListener("click", handleClick);
  renderer.domElement.addEventListener("pointerleave", clearHover);
}

function resize() {
  const el = canvasWrapRef.value;
  if (!el || !renderer || !camera) return;
  const width = el.clientWidth;
  const height = el.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  tooltip.value = {
    x: Math.min(rect.width - 250, Math.max(18, event.clientX - rect.left + 16)),
    y: Math.min(rect.height - 118, Math.max(18, event.clientY - rect.top + 14)),
  };
}

function handlePointerMove(event) {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(pickableMeshes, true)[0];
  if (hit?.object?.userData?.point) {
    hoveredPoint.value = hit.object.userData.point;
    renderer.domElement.style.cursor = "pointer";
  } else if (raycaster.intersectObjects(pickableBuildings, true)[0]?.object?.userData?.building) {
    renderer.domElement.style.cursor = "pointer";
  } else {
    clearHover();
  }
}

function handleClick() {
  raycaster.setFromCamera(pointer, camera);
  const buildingHit = raycaster.intersectObjects(pickableBuildings, true)[0];
  if (buildingHit?.object?.userData?.building) {
    openBuilding(buildingHit.object.userData.building);
    return;
  }
  if (hoveredPoint.value) selectPoint(hoveredPoint.value);
}

function clearHover() {
  hoveredPoint.value = null;
  if (renderer?.domElement) renderer.domElement.style.cursor = "grab";
}

function showPoint(point, event) {
  hoveredPoint.value = point;
  moveTooltip(event);
}

function selectPoint(point, event) {
  selectedBuilding.value = null;
  selectedPoint.value = point;
  hoveredPoint.value = point;
  if (event) moveTooltip(event);
  selectedMarker = markerGroups.find((group) => group.userData.point?.id === point.id);
}

function openBuilding(building) {
  selectedBuilding.value = building;
  selectedPoint.value = null;
  hoveredPoint.value = null;
  selectedMarker = null;
  buildingMeshes.forEach((mesh, id) => {
    const source = buildingItems.find((item) => item.id === id);
    if (!mesh.material?.emissive || !source) return;
    mesh.material.emissive.setHex(source.color);
    mesh.material.emissiveIntensity = id === building.id ? 0.72 : 0.18;
  });
  if (camera && controls) {
    camera.position.set(building.position[0] + 7, 8.5, building.position[2] + 7);
    controls.target.set(building.position[0], building.position[1], building.position[2]);
    controls.update();
  }
}

function closeBuilding() {
  selectedBuilding.value = null;
  buildingMeshes.forEach((mesh, id) => {
    const source = buildingItems.find((item) => item.id === id);
    if (!mesh.material?.emissive || !source) return;
    mesh.material.emissive.setHex(source.color);
    mesh.material.emissiveIntensity = 0.18;
  });
  resetView();
}

function moveTooltip(event) {
  const rect = canvasWrapRef.value.getBoundingClientRect();
  tooltip.value = {
    x: Math.min(rect.width - 250, Math.max(18, event.clientX - rect.left + 16)),
    y: Math.min(rect.height - 118, Math.max(18, event.clientY - rect.top + 14)),
  };
}

function updateLabels() {
  const wrap = canvasWrapRef.value;
  if (!wrap || !camera) return;
  const width = wrap.clientWidth;
  const height = wrap.clientHeight;
  labels.value = labelTargets.map((item) => {
    const point = item.target.clone().project(camera);
    return {
      id: item.id,
      text: item.text,
      tone: item.tone,
      point: item.point,
      building: item.building,
      visible: point.z < 1,
      x: (point.x * 0.5 + 0.5) * width,
      y: (-point.y * 0.5 + 0.5) * height,
    };
  });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  frame += 0.012;
  markerGroups.forEach((group) => {
    const baseScale = selectedMarker === group ? 1.24 : 1;
    group.scale.setScalar(baseScale + Math.sin(frame * 4) * 0.035);
  });
  animatedRings.forEach((ring) => {
    const progress = (frame * 0.65 + ring.userData.phase) % 1;
    ring.scale.setScalar(1 + progress * 2.8);
    ring.material.opacity = 0.68 * (1 - progress);
  });
  controls?.update();
  updateLabels();
  renderer.render(scene, camera);
}

onMounted(async () => {
  await nextTick();
  buildScene();
  resize();
  resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvasWrapRef.value);
  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  resizeObserver?.disconnect();
  renderer?.domElement?.removeEventListener("pointermove", handlePointerMove);
  renderer?.domElement?.removeEventListener("click", handleClick);
  renderer?.domElement?.removeEventListener("pointerleave", clearHover);
  controls?.dispose();
  scene?.traverse((item) => {
    if (item.isMesh || item.isLineSegments) {
      item.geometry?.dispose?.();
      if (Array.isArray(item.material)) {
        item.material.forEach((material) => material.dispose?.());
      } else {
        item.material?.dispose?.();
      }
    }
  });
  renderer?.dispose();
});
</script>

<style scoped>
.security-park-scene {
  position: relative;
  height: 100%;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(55, 216, 255, 0.18);
  background:
    radial-gradient(circle at 55% 45%, rgba(20, 125, 255, 0.24), transparent 36%),
    linear-gradient(145deg, rgba(4, 22, 39, 0.95), rgba(0, 8, 18, 0.96));
  box-shadow: inset 0 0 50px rgba(41, 223, 255, 0.08), inset 0 0 130px rgba(0, 0, 0, 0.45);
}

.security-park-scene::before {
  position: absolute;
  inset: 0;
  z-index: 2;
  content: "";
  background:
    linear-gradient(90deg, rgba(1, 8, 18, 0.76), transparent 18%, transparent 82%, rgba(1, 8, 18, 0.65)),
    linear-gradient(180deg, rgba(1, 8, 18, 0.28), transparent 24%, transparent 78%, rgba(1, 8, 18, 0.72));
  pointer-events: none;
}

.security-park-scene__canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.security-park-scene__canvas :deep(canvas) {
  display: block;
  width: 100%;
  height: 100%;
}

.security-park-scene__legend {
  position: absolute;
  left: 14px;
  top: 14px;
  z-index: 5;
  display: grid;
  gap: 9px;
  width: 136px;
  padding: 12px 12px 13px;
  border: 1px solid rgba(41, 223, 255, 0.25);
  background: linear-gradient(180deg, rgba(3, 18, 35, 0.92), rgba(5, 28, 49, 0.82));
  box-shadow: 0 0 24px rgba(0, 0, 0, 0.35), inset 0 0 18px rgba(41, 223, 255, 0.06);
}

.security-park-scene__legend strong {
  color: #e6fbff;
  font-size: 13px;
  letter-spacing: 0;
}

.security-park-scene__legend span {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #b8d8e8;
  font-size: 12px;
  line-height: 1.1;
}

.security-park-scene__legend i {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--legend-color);
  box-shadow: 0 0 12px var(--legend-color), 0 0 0 5px color-mix(in srgb, var(--legend-color) 18%, transparent);
}

.security-park-scene__view-actions {
  position: absolute;
  right: 14px;
  top: 14px;
  z-index: 5;
  display: flex;
  gap: 8px;
}

.security-park-scene__view-actions button {
  min-width: 54px;
  height: 28px;
  border: 1px solid rgba(41, 223, 255, 0.3);
  background: linear-gradient(180deg, rgba(15, 58, 92, 0.92), rgba(4, 21, 38, 0.9));
  color: #d9f7ff;
  font-size: 12px;
  cursor: pointer;
}

.security-park-scene__label {
  position: absolute;
  z-index: 4;
  min-width: 42px;
  padding: 5px 9px;
  border: 1px solid rgba(80, 215, 255, 0.42);
  border-radius: 4px;
  background: linear-gradient(180deg, rgba(12, 74, 132, 0.88), rgba(5, 28, 58, 0.9));
  color: #e5fbff;
  font-size: 12px;
  line-height: 1;
  text-align: center;
  text-shadow: 0 0 9px rgba(75, 207, 255, 0.8);
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -100%);
  box-shadow: 0 0 18px rgba(41, 156, 255, 0.24);
}

.security-park-scene__label.alarm {
  border-color: rgba(255, 77, 97, 0.62);
  background: linear-gradient(180deg, rgba(132, 25, 45, 0.9), rgba(58, 7, 18, 0.92));
  box-shadow: 0 0 22px rgba(255, 77, 97, 0.36);
}

.security-park-scene__hotspot {
  position: absolute;
  z-index: 5;
  width: 54px;
  height: 54px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.security-park-scene__building-hotspot {
  position: absolute;
  z-index: 5;
  width: 88px;
  height: 46px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.security-park-scene__tooltip {
  position: absolute;
  z-index: 6;
  width: 230px;
  padding: 10px 12px;
  border: 1px solid rgba(41, 223, 255, 0.32);
  background: linear-gradient(180deg, rgba(2, 14, 29, 0.96), rgba(5, 32, 55, 0.94));
  box-shadow: 0 0 26px rgba(0, 0, 0, 0.45), inset 0 0 16px rgba(41, 223, 255, 0.06);
  pointer-events: none;
}

.security-park-scene__tooltip strong {
  display: block;
  margin-bottom: 5px;
  color: #e8fbff;
  font-size: 13px;
}

.security-park-scene__tooltip span {
  display: inline-block;
  margin-bottom: 7px;
  color: #40f3ff;
  font-size: 12px;
}

.security-park-scene__tooltip p {
  margin: 0;
  color: #a8c7d8;
  font-size: 12px;
  line-height: 1.5;
}

.security-park-scene__selected {
  position: absolute;
  left: 165px;
  right: 165px;
  top: 14px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  height: 32px;
  border: 1px solid rgba(41, 223, 255, 0.22);
  background: linear-gradient(90deg, rgba(3, 18, 35, 0), rgba(4, 34, 62, 0.82), rgba(3, 18, 35, 0));
  color: #b9d6e8;
  font-size: 12px;
}

.security-park-scene__selected strong {
  color: #f2fbff;
  font-size: 14px;
}

.security-park-scene__selected em {
  color: #ff6478;
  font-style: normal;
}

.security-park-scene__drilldown {
  position: absolute;
  right: 14px;
  top: 58px;
  z-index: 6;
  width: 238px;
  padding: 12px;
  border: 1px solid rgba(41, 223, 255, 0.28);
  background: linear-gradient(180deg, rgba(2, 14, 29, 0.96), rgba(5, 32, 55, 0.93));
  box-shadow: 0 0 28px rgba(0, 0, 0, 0.42), inset 0 0 18px rgba(41, 223, 255, 0.07);
}

.security-park-scene__drilldown-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #8fc4d8;
  font-size: 12px;
}

.security-park-scene__drilldown-head button {
  height: 24px;
  border: 1px solid rgba(41, 223, 255, 0.26);
  background: rgba(10, 52, 82, 0.82);
  color: #d9f7ff;
  font-size: 12px;
  cursor: pointer;
}

.security-park-scene__drilldown > strong {
  display: block;
  margin-bottom: 6px;
  color: #e8fbff;
  font-size: 15px;
}

.security-park-scene__drilldown p {
  margin: 0 0 9px;
  color: #9ec2d2;
  font-size: 12px;
  line-height: 1.45;
}

.security-park-scene__drilldown-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.security-park-scene__drilldown-grid article {
  min-height: 56px;
  padding: 7px;
  border: 1px solid rgba(41, 223, 255, 0.18);
  background: rgba(7, 34, 58, 0.72);
}

.security-park-scene__drilldown-grid span,
.security-park-scene__drilldown-grid small {
  display: block;
  overflow: hidden;
  color: #95bdcf;
  font-size: 11px;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.security-park-scene__drilldown-grid b {
  display: block;
  margin: 4px 0 3px;
  color: #42e7ff;
  font-size: 16px;
  line-height: 1;
}

.security-park-scene__drilldown-grid .success b { color: #45ec91; }
.security-park-scene__drilldown-grid .warn b { color: #ffc35a; }
.security-park-scene__drilldown-grid .danger b { color: #ff5368; }

.security-park-scene__metrics {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 14px;
  z-index: 5;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.security-park-scene__metrics article {
  min-height: 64px;
  padding: 9px 10px;
  border: 1px solid rgba(41, 223, 255, 0.22);
  background: linear-gradient(180deg, rgba(4, 22, 39, 0.88), rgba(6, 36, 60, 0.78));
  box-shadow: inset 0 0 18px rgba(41, 223, 255, 0.05);
}

.security-park-scene__metrics span,
.security-park-scene__metrics small {
  display: block;
  overflow: hidden;
  color: #93b8ca;
  font-size: 12px;
  line-height: 1.25;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.security-park-scene__metrics strong {
  display: block;
  margin: 4px 0 3px;
  color: #42e7ff;
  font-size: 22px;
  line-height: 1;
}

.security-park-scene__metrics .success strong { color: #45ec91; }
.security-park-scene__metrics .warn strong { color: #ffc35a; }
.security-park-scene__metrics .danger strong { color: #ff5368; }
</style>
