<template>
  <div ref="containerRef" class="factory-twin-scene">
    <div class="factory-twin-scene__hud">
      <div>
        <span>模型来源</span>
        <strong>threejs-digital-twin / phoenix</strong>
      </div>
      <div>
        <span>交互</span>
        <strong>拖拽旋转 / 滚轮缩放 / 双击聚焦</strong>
      </div>
    </div>

    <div class="factory-twin-scene__status" :class="{ loaded: !loading && !errorMessage }">
      <strong v-if="loading">{{ progressText }}</strong>
      <strong v-else-if="errorMessage">{{ errorMessage }}</strong>
      <strong v-else>3D 车间在线</strong>
      <span>{{ selectedName || "菲尼克斯电气厂房模型" }}</span>
    </div>

    <div class="factory-twin-scene__actions">
      <button
        v-for="view in viewTargets"
        :key="view.name"
        type="button"
        @click="focusView(view)"
      >
        {{ view.name }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const containerRef = ref(null);
const loading = ref(true);
const progressText = ref("3D 模型加载中");
const errorMessage = ref("");
const selectedName = ref("");

const viewTargets = [
  { name: "总览", position: [4.5, 22, 16], target: [0, 1.4, 0] },
  { name: "产线", position: [-10, 9, 10], target: [-1.8, 1.2, 0] },
  { name: "设备", position: [8, 7, -9], target: [1.5, 1.4, -1.6] },
];

let renderer;
let scene;
let camera;
let controls;
let animationId = 0;
let resizeObserver;
let modelRoot;
let frame = 0;
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const highlighted = [];

function clearHighlight() {
  while (highlighted.length) {
    const mesh = highlighted.pop();
    if (mesh.material?.emissive && mesh.userData.originalEmissive !== undefined) {
      mesh.material.emissive.setHex(mesh.userData.originalEmissive);
    }
  }
}

function highlightObject(object) {
  clearHighlight();
  const root = findNamedRoot(object);
  selectedName.value = root?.userData?.name || root?.name || object.name || "设备单元";
  root?.traverse((item) => {
    if (item.isMesh && item.material?.emissive) {
      item.userData.originalEmissive = item.material.emissive.getHex();
      item.material.emissive.setHex(0x136d75);
      highlighted.push(item);
    }
  });
}

function findNamedRoot(object) {
  let current = object;
  while (current?.parent && current.parent !== modelRoot) {
    if (current.userData?.name || /zhusuji|chongyaji|kongyaji|bofenghan/i.test(current.name || "")) {
      return current;
    }
    current = current.parent;
  }
  return current;
}

function focusView(view) {
  if (!camera || !controls) return;
  camera.position.set(...view.position);
  controls.target.set(...view.target);
  controls.update();
}

function handlePointerMove(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(modelRoot?.children || [], true);
  if (intersects[0]?.object) {
    renderer.domElement.style.cursor = "pointer";
    highlightObject(intersects[0].object);
  } else {
    renderer.domElement.style.cursor = "grab";
    selectedName.value = "";
    clearHighlight();
  }
}

function handleDoubleClick() {
  if (!highlighted[0]) return;
  const box = new THREE.Box3().setFromObject(findNamedRoot(highlighted[0]));
  const center = box.getCenter(new THREE.Vector3());
  camera.position.set(center.x + 5, center.y + 4, center.z + 5);
  controls.target.copy(center);
  controls.update();
}

function initRenderer() {
  scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.Fog(0x061723, 26, 72);

  camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(...viewTargets[0].position);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  containerRef.value.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 7;
  controls.maxDistance = 60;
  controls.target.set(...viewTargets[0].target);
  controls.update();

  const ambient = new THREE.AmbientLight(0x6fd9ff, 0.9);
  const hemi = new THREE.HemisphereLight(0xe8fbff, 0x12313f, 1.4);
  const key = new THREE.DirectionalLight(0xffffff, 3.4);
  key.position.set(8, 18, 11);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  scene.add(ambient, hemi, key);

  const grid = new THREE.GridHelper(52, 26, 0x30e6ef, 0x145866);
  grid.material.transparent = true;
  grid.material.opacity = 0.22;
  scene.add(grid);
}

function resize() {
  const el = containerRef.value;
  if (!el || !renderer || !camera) return;
  const width = el.clientWidth;
  const height = el.clientHeight;
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
}

async function loadModel() {
  const draco = new DRACOLoader();
  draco.setDecoderPath("/draco/gltf/");
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  const gltf = await loader.loadAsync("/models/phoenix/scene.glb", (event) => {
    if (!event.total) return;
    progressText.value = `3D 模型加载中 ${Math.round((event.loaded / event.total) * 100)}%`;
  });

  modelRoot = gltf.scene;
  modelRoot.name = "phoenix";
  modelRoot.scale.setScalar(0.9);
  modelRoot.position.set(0, 0, 0);
  modelRoot.traverse((item) => {
    if (item.isMesh) {
      item.castShadow = true;
      item.receiveShadow = true;
      if (item.material) {
        item.material = item.material.clone();
        item.material.envMapIntensity = 0.7;
      }
    }
  });
  scene.add(modelRoot);
}

function animate() {
  animationId = requestAnimationFrame(animate);
  frame += 0.01;
  if (modelRoot) {
    modelRoot.rotation.y = Math.sin(frame) * 0.015;
  }
  controls?.update();
  renderer.render(scene, camera);
}

onMounted(async () => {
  await nextTick();
  try {
    initRenderer();
    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerRef.value);
    renderer.domElement.addEventListener("pointermove", handlePointerMove);
    renderer.domElement.addEventListener("dblclick", handleDoubleClick);
    await loadModel();
    loading.value = false;
    animate();
  } catch (error) {
    loading.value = false;
    errorMessage.value = "3D 模型加载失败";
    console.error(error);
  }
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  resizeObserver?.disconnect();
  renderer?.domElement?.removeEventListener("pointermove", handlePointerMove);
  renderer?.domElement?.removeEventListener("dblclick", handleDoubleClick);
  controls?.dispose();
  scene?.traverse((item) => {
    if (item.isMesh) {
      item.geometry?.dispose();
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
