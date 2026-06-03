<script setup lang="ts">
import { computed, ref } from 'vue'
import PageHeading from '../../components/ui/PageHeading.vue'
import type { EnterpriseCommTab, InterviewFlowStatus } from '../../types/communications'

const flowStatus = ref<InterviewFlowStatus>('INVITED')
const tab = ref<EnterpriseCommTab>('final')

const tabs: { id: EnterpriseCommTab; label: string }[] = [
  { id: 'final', label: '终面安排' },
  { id: 'bid', label: '出价管理' },
  { id: 'contract', label: '合同归档' }
]

const bidLocked = computed(() => flowStatus.value !== 'COMPLETED_PASS')
const contractLocked = computed(() => flowStatus.value !== 'COMPLETED_PASS')

function selectTab(id: EnterpriseCommTab) {
  if (id === 'bid' && bidLocked.value) return
  if (id === 'contract' && contractLocked.value) return
  tab.value = id
}
</script>

<template>
  <div class="mx-auto w-full max-w-4xl px-6 py-8">
    <PageHeading title="人才沟通" />

    <div class="mt-4 flex gap-1 border-b border-gray-200">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        class="px-4 py-2 text-sm leading-[1.2]"
        :class="[
          tab === t.id ? 'border-b-2 border-primary font-medium text-primary' : 'text-gray-600',
          (t.id === 'bid' && bidLocked) || (t.id === 'contract' && contractLocked)
            ? 'cursor-not-allowed opacity-40'
            : ''
        ]"
        @click="selectTab(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="mt-4 flex flex-wrap gap-2 text-xs">
      <span class="text-gray-400">演示:</span>
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

    <div v-if="tab === 'final'" class="mt-6 overflow-hidden rounded-card sv-card">
      <table class="w-full text-left text-sm leading-[1.2]">
        <thead class="bg-background text-gray-500">
          <tr>
            <th class="px-4 py-2">人才</th>
            <th class="px-4 py-2">状态</th>
            <th class="px-4 py-2">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-t border-gray-100">
            <td class="px-4 py-3">候选人 A</td>
            <td class="px-4 py-3">
              <span v-if="flowStatus === 'COMPLETED_CHEAT'" class="text-status-error">作弊/异常</span>
              <span v-else-if="flowStatus === 'COMPLETED_FAIL'" class="text-status-error">未通过</span>
              <span v-else-if="flowStatus === 'COMPLETED_PASS'" class="text-status-success">已通过</span>
              <span v-else-if="flowStatus === 'CANCELLED'" class="text-status-neutral">已取消</span>
              <span v-else>待参加</span>
            </td>
            <td class="px-4 py-3">
              <template v-if="flowStatus === 'INVITED'">
                <button type="button" class="mr-2 text-primary">取消邀请</button>
                <button type="button" class="text-primary">填写面试结果</button>
              </template>
              <template v-else-if="flowStatus === 'CANCELLED'">
                <button type="button" class="text-primary">重新发起邀约</button>
              </template>
              <template v-else-if="flowStatus === 'COMPLETED_PASS'">
                <button type="button" class="sv-btn sv-btn-primary text-xs">去发起出价</button>
              </template>
              <template v-else-if="flowStatus === 'COMPLETED_CHEAT'">
                <span class="text-status-error">检测到作弊/异常行为</span>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="tab === 'bid'" class="mt-6 text-sm text-gray-600">出价管理（G4 占位）</div>
    <div v-else class="mt-6 text-sm text-gray-600">合同归档（G4 占位）</div>
  </div>
</template>
