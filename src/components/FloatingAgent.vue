<template>
  <div class="floating-agent" :class="{ open: isOpen }">
    <button
      v-if="!isOpen"
      class="floating-agent__launcher"
      type="button"
      @click="openAgent"
      :aria-label="`打开${currentAgent.name}`"
    >
      <span class="floating-agent__signal" aria-hidden="true">
        <i></i>
        <i></i>
        <i></i>
      </span>
      <span class="floating-agent__launcher-icon">
        <AutoIcon :name="currentAgent.icon" :tone="currentAgent.tone" />
      </span>
      <span class="floating-agent__launcher-copy">
        <strong>{{ currentAgent.name }}</strong>
        <em>{{ activeTab }} · 静态知识库在线</em>
      </span>
    </button>

    <section v-else class="floating-agent__panel" :aria-label="currentAgent.name">
      <header class="floating-agent__header">
        <div class="floating-agent__identity">
          <span class="floating-agent__avatar" aria-hidden="true">
            <AutoIcon :name="currentAgent.icon" :tone="currentAgent.tone" />
          </span>
          <div>
            <strong>{{ currentAgent.name }}</strong>
            <span>{{ activeTab }} · {{ currentAgent.short }}</span>
          </div>
        </div>
        <div class="floating-agent__actions">
          <button type="button" @click="resetMessages">清空</button>
          <button type="button" @click="isOpen = false">收起</button>
        </div>
      </header>

      <div class="floating-agent__prompt-section">
        <div class="floating-agent__section-title">
          <span>建议追问</span>
        </div>
        <div class="floating-agent__questions" aria-label="预设问题">
          <button
            v-for="question in currentAgent.questions"
            :key="question.id"
          type="button"
          @click="askPreset(question)"
        >
            <span>{{ question.label }}</span>
          </button>
        </div>
      </div>

      <div ref="messageList" class="floating-agent__messages">
        <article
          v-for="message in messages"
          :key="message.id"
          class="floating-agent__message"
          :class="`floating-agent__message--${message.role}`"
        >
          <span class="floating-agent__role">
            {{ message.role === "user" ? "我的问题" : currentAgent.name }}
          </span>
          <div class="floating-agent__bubble">
            <p>{{ message.content.text }}</p>
            <div v-if="message.content.bullets?.length" class="floating-agent__bullets">
              <span v-for="item in message.content.bullets" :key="item">{{ item }}</span>
            </div>

            <div v-if="message.content.cards?.length" class="floating-agent__cards">
              <div
                v-for="card in message.content.cards"
                :key="card.label"
                class="floating-agent__card"
                :class="card.tone"
              >
                <span>{{ card.label }}</span>
                <strong>{{ card.value }}<em>{{ card.unit }}</em></strong>
                <small>{{ card.sub }}</small>
              </div>
            </div>

            <div v-if="message.content.bars?.length" class="floating-agent__bars">
              <div
                v-for="bar in message.content.bars"
                :key="bar.label"
                class="floating-agent__bar"
                :class="bar.tone"
              >
                <span>{{ bar.label }}</span>
                <div><i :style="{ width: `${bar.percent}%` }"></i></div>
                <strong>{{ bar.value }}</strong>
              </div>
            </div>

            <div v-if="message.content.trend?.points?.length" class="floating-agent__trend">
              <div class="floating-agent__trend-head">
                <span>{{ message.content.trend.title }}</span>
                <strong>{{ message.content.trend.summary }}</strong>
              </div>
              <div class="floating-agent__sparkline">
                <i
                  v-for="point in trendPoints(message.content.trend.points)"
                  :key="point.index"
                  :style="{ height: `${point.height}%` }"
                ></i>
              </div>
              <div class="floating-agent__trend-labels">
                <span
                  v-for="label in message.content.trend.labels"
                  :key="label"
                >
                  {{ label }}
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>

      <form class="floating-agent__input" @submit.prevent="submitQuestion">
        <label>
          <input
            v-model.trim="draft"
            type="text"
            placeholder="输入问题，或点击上方预设问题"
            aria-label="输入智能体问题"
          />
        </label>
        <button type="submit">发送</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from "vue";
import AutoIcon from "./AutoIcon.vue";

const props = defineProps({
  activeTab: { type: String, required: true },
  agents: { type: Object, required: true },
});

const fallbackText = "当前静态知识库暂无该问题对应数据。可尝试选择上方预设问题，或后续接入业务知识库与实时数据接口。";
const isOpen = ref(false);
const draft = ref("");
const messages = ref([]);
const messageList = ref(null);
let messageId = 0;

const currentAgent = computed(() => props.agents?.[props.activeTab] || props.agents?.["综合态势"] || {
  name: "驾驶舱智能助手",
  short: "静态问答",
  icon: "data",
  tone: "normal",
  tags: ["智能问答"],
  welcome: "当前页面可进行静态问答演示。",
  questions: [],
});

watch(currentAgent, () => {
  resetMessages();
}, { immediate: true });

function openAgent() {
  isOpen.value = true;
  scrollToBottom();
}

function resetMessages() {
  draft.value = "";
  messages.value = [{
    id: nextMessageId(),
    role: "assistant",
    content: { text: currentAgent.value.welcome },
  }];
  scrollToBottom();
}

function askPreset(question) {
  appendUserMessage(question.label);
  appendAssistantMessage(question.answer);
}

function submitQuestion() {
  if (!draft.value) return;
  const text = draft.value;
  draft.value = "";
  appendUserMessage(text);
  const question = matchQuestion(text);
  appendAssistantMessage(question?.answer || { text: fallbackText });
}

function matchQuestion(text) {
  return currentAgent.value.questions?.find((question) => {
    if (question.id === text) return true;
    return question.keywords?.some((keyword) => text.includes(keyword));
  });
}

function appendUserMessage(text) {
  messages.value.push({
    id: nextMessageId(),
    role: "user",
    content: { text },
  });
  scrollToBottom();
}

function appendAssistantMessage(content) {
  messages.value.push({
    id: nextMessageId(),
    role: "assistant",
    content,
  });
  scrollToBottom();
}

function nextMessageId() {
  messageId += 1;
  return messageId;
}

function trendPoints(points) {
  const max = Math.max(...points, 1);
  return points.map((value, index) => ({
    index,
    height: Math.max(14, Math.round((value / max) * 100)),
  }));
}

async function scrollToBottom() {
  await nextTick();
  if (!messageList.value) return;
  messageList.value.scrollTop = messageList.value.scrollHeight;
}
</script>
