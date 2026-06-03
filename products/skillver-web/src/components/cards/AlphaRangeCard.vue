<script setup lang="ts">
import { computed, ref } from 'vue'

/** V2.1 §4.3 G5 占位 — 出价区间谈判 */
const round = ref(0)
const entMin = 35
const entMax = 45
const talMin = 40
const talMax = 50

const overlap = computed(() => {
  const lo = Math.max(entMin, talMin)
  const hi = Math.min(entMax, talMax)
  return lo <= hi ? { lo, hi } : null
})

const expired = computed(() => round.value >= 3 && !overlap.value)
const matched = computed(() => overlap.value !== null && round.value >= 3)

const ctaLabel = computed(() => {
  if (expired.value) return '流程已终止'
  if (matched.value) return '生成并查看录用合同'
  if (round.value === 0) return '发起首轮出价'
  if (round.value === 1) return '提交期望薪资'
  if (round.value === 2) return '发送最终确定价'
  return '确认'
})

function submit() {
  if (expired.value) return
  if (matched.value) return
  if (round.value < 3) round.value += 1
}
</script>

<template>
  <div class="relative rounded-card sv-card p-4 leading-[1.2]" :class="expired ? 'opacity-60' : ''">
    <span
      class="absolute right-2 top-2 rounded bg-status-neutral/15 px-1.5 py-0.5 text-[10px] text-status-neutral"
    >
      规划 · G5
    </span>
    <p class="sv-h2 pr-16">薪资出价区间</p>
    <p class="mt-2 text-sm text-gray-600">
      企业 [{{ entMin }}, {{ entMax }}]k · 人才 [{{ talMin }}, {{ talMax }}]k
    </p>
    <div class="mt-3 h-2 rounded-full bg-gray-200">
      <div
        v-if="overlap"
        class="h-full rounded-full bg-status-success"
        :style="{
          marginLeft: `${(overlap.lo / 60) * 100}%`,
          width: `${((overlap.hi - overlap.lo) / 60) * 100}%`
        }"
      />
    </div>
    <p v-if="overlap" class="mt-1 text-xs text-status-success">交集区间已高亮 ✓</p>
    <p v-if="expired" class="mt-3 text-sm font-medium text-status-error">
      三轮出价未达成一致，流程已自动终止
    </p>
    <button
      type="button"
      class="sv-btn sv-btn-primary mt-4"
      :disabled="expired"
      @click="submit"
    >
      {{ ctaLabel }}
    </button>
    <p class="mt-2 text-xs text-gray-400">current_round: {{ round }}</p>
  </div>
</template>
