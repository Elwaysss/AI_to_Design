<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeading from '../../components/ui/PageHeading.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import AlphaRangeCard from '../../components/cards/AlphaRangeCard.vue'
import type { InterviewFlowStatus, TalentCommTab } from '../../types/communications'

const flowStatus = ref<InterviewFlowStatus>('INVITED')
const tab = ref<TalentCommTab>('final')

const tabs: { id: TalentCommTab; label: string }[] = [
  { id: 'final', label: '终面邀请' },
  { id: 'salary', label: '薪资' },
  { id: 'offer', label: '录取' }
]

const salaryLocked = computed(
  () => !['COMPLETED_PASS'].includes(flowStatus.value)
)
const offerLocked = computed(
  () => !['COMPLETED_PASS'].includes(flowStatus.value)
)

function selectTab(id: TalentCommTab) {
  if (id === 'salary' && salaryLocked.value) return
  if (id === 'offer' && offerLocked.value) return
  tab.value = id
}

const banner = computed(() => {
  switch (flowStatus.value) {
    case 'INVITED':
      return { text: '待参加', tone: 'neutral' as const }
    case 'CANCELLED':
      return { text: '企业已取消本次终面安排', tone: 'neutral' as const }
    case 'COMPLETED_PASS':
      return { text: '终面已通过，等待企业出价', tone: 'success' as const }
    case 'COMPLETED_FAIL':
      return { text: '终面未通过', tone: 'error' as const }
    case 'COMPLETED_CHEAT':
      return { text: '核验异常，触发平台审计', tone: 'lock' as const }
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-6 py-8">
    <PageHeading title="企业沟通" />

    <div class="mt-4 flex gap-1 border-b border-gray-200">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="px-4 py-2 text-sm leading-[1.2]"
        :class="[
          tab === t.id ? 'border-b-2 border-primary font-medium text-primary' : 'text-gray-600',
          (t.id === 'salary' && salaryLocked) || (t.id === 'offer' && offerLocked)
            ? 'cursor-not-allowed opacity-40'
            : ''
        ]"
        :disabled="(t.id === 'salary' && salaryLocked) || (t.id === 'offer' && offerLocked)"
        @click="selectTab(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="mt-4 flex flex-wrap gap-2 text-xs">
      <span class="text-gray-400">演示状态:</span>
      <button
        v-for="s in ['INVITED', 'CANCELLED', 'COMPLETED_PASS', 'COMPLETED_FAIL', 'COMPLETED_CHEAT']"
        :key="s"
        type="button"
        class="rounded border px-2 py-0.5"
        @click="flowStatus = s as InterviewFlowStatus"
      >
        {{ s }}
      </button>
    </div>

    <div v-if="tab === 'final'" class="mt-6 rounded-card sv-card p-4">
      <StatusBadge :label="banner.text" :tone="banner.tone" />
      <p class="mt-3 text-sm text-gray-600">终面邀约详情（只读占位）</p>
    </div>
    <div v-else-if="tab === 'salary'" class="mt-6">
      <AlphaRangeCard />
    </div>
    <div v-else class="mt-6 rounded-card sv-card p-4 text-sm text-gray-600">
      录取与合同流程占位（终面通过后解锁）
    </div>
  </div>
</template>
