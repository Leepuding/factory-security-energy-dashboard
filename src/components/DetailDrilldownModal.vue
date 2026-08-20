<template>
  <Teleport to="body">
    <div v-if="detail" class="detail-modal-layer" role="presentation" @click.self="$emit('close')">
      <section
        class="detail-modal"
        :class="detail.layout || 'standard'"
        role="dialog"
        aria-modal="true"
        :aria-label="`${detail.title}下钻详情`"
      >
        <header class="detail-modal__header">
          <div>
            <span>{{ detail.page || "业务模块" }}</span>
            <h3>{{ detail.title }}</h3>
          </div>
          <button class="detail-modal__close" type="button" aria-label="关闭下钻详情" @click="$emit('close')">×</button>
        </header>

        <div class="detail-modal__body">
          <section class="detail-modal__metrics" aria-label="关键指标">
            <article v-for="item in detail.metrics" :key="item.label" :class="item.tone">
              <span>{{ item.label }}</span>
              <strong>{{ item.value }}<em>{{ item.unit }}</em></strong>
              <small>{{ item.sub }}</small>
            </article>
          </section>

          <section class="detail-modal__content">
            <div class="detail-table-wrap">
              <table v-if="detail.rows?.length" class="detail-table">
                <thead>
                  <tr>
                    <th v-for="column in detail.columns" :key="column.key">{{ column.label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(row, index) in detail.rows" :key="row.id || index">
                    <td v-for="column in detail.columns" :key="column.key">
                      <span v-if="column.toneKey" class="detail-pill" :class="row[column.toneKey]">{{ row[column.key] }}</span>
                      <template v-else>{{ row[column.key] }}</template>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-else class="detail-empty">暂无下钻数据</div>
            </div>

            <aside class="detail-modal__aside">
              <div class="detail-modal__block">
                <h4>关联对象</h4>
                <div class="detail-related-list">
                  <div v-for="item in detail.related" :key="item.name" :class="item.tone">
                    <strong>{{ item.name }}</strong>
                    <span>{{ item.value }}</span>
                  </div>
                </div>
              </div>

              <div class="detail-modal__block">
                <h4>分析建议</h4>
                <ul class="detail-insights">
                  <li v-for="item in detail.insights" :key="item">{{ item }}</li>
                </ul>
              </div>
            </aside>
          </section>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup>
defineEmits(["close"]);

defineProps({
  detail: { type: Object, default: null },
});
</script>
