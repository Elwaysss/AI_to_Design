<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import PageHeading from '../../components/ui/PageHeading.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'
import OverlayDrawer from '../../components/layout/OverlayDrawer.vue'
import { useTalentVerificationHint } from '../../composables/useTalentVerificationHint'
import type { VerificationUiStatus } from '../../types/verification'

const router = useRouter()
const { markCleared } = useTalentVerificationHint()

const status = ref<VerificationUiStatus>('SELECTED')
const attempt = ref(1)
const token = ref<string | null>(null)
const pluginOpen = ref(false)

const jobTitle = computed(() => (status.value === 'EMPTY' ? null : 'Golang 后端开发工程师'))

const badge = computed(() => {
  const m: Record<VerificationUiStatus, { label: string; tone: 'warning' | 'orange' | 'success' | 'error' | 'lock' }> = {
    EMPTY: { label: '—', tone: 'warning' },
    SELECTED: { label: '待开始', tone: 'warning' },
    VERIFYING: { label: '核验中', tone: 'orange' },
    IN_POOL: { label: '已入库', tone: 'success' },
    FAILED_RETRY: { label: '未通过', tone: 'error' },
    FAILED_LOCK: { label: '同岗锁定', tone: 'lock' }
  }
  return m[status.value]
})

const cta = computed(() => {
  switch (status.value) {
    case 'EMPTY':
      return { label: '选择目标岗位', disabled: false }
    case 'SELECTED':
      return { label: '开始核验', disabled: false }
    case 'VERIFYING':
      return { label: '继续核验', disabled: false }
    case 'IN_POOL':
      return { label: '查看人才报告', disabled: false }
    case 'FAILED_RETRY':
      return { label: '再次发起核验', disabled: false }
    case 'FAILED_LOCK':
      return { label: '再次发起核验', disabled: true }
    default:
      return { label: '—', disabled: true }
  }
})

function onCta() {
  if (status.value === 'EMPTY') {
    router.push('/talent/target-job')
    return
  }
  if (status.value === 'SELECTED') {
    status.value = 'VERIFYING'
    token.value = 'vt_alphanum123demo'
    return
  }
  if (status.value === 'VERIFYING') {
    router.push('/talent/interview/sess_demo_001')
    return
  }
  if (status.value === 'IN_POOL') {
    router.push('/talent/reports/rpt_001')
    return
  }
  if (status.value === 'FAILED_RETRY') {
    status.value = 'VERIFYING'
    token.value = 'vt_retry_' + Date.now()
    return
  }
}

function demoPass() {
  status.value = 'IN_POOL'
  markCleared()
}

function demoFail() {
  if (attempt.value < 2) {
    attempt.value += 1
    status.value = 'FAILED_RETRY'
    token.value = null
  } else {
    status.value = 'FAILED_LOCK'
    token.value = null
  }
}

function demoEmpty() {
  status.value = 'EMPTY'
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-6 py-8 leading-[1.2]">
    <PageHeading title="能力核验" />

    <template v-if="status === 'EMPTY'">
      <div class="mt-8 rounded-card sv-card p-8 text-center">
        <p class="text-sm text-gray-600">请先选择目标岗位，再开始 7D 战力核验。</p>
        <RouterLink to="/talent/target-job" class="sv-btn sv-btn-primary mt-4 inline-flex items-center">
          前往目标岗位
        </RouterLink>
      </div>
      <button type="button" class="mt-4 text-xs text-gray-400" @click="status = 'SELECTED'">演示：已有目标岗</button>
    </template>

    <template v-else>
      <div
        class="mt-6 space-y-6 rounded-card sv-card p-6"
        :class="status === 'FAILED_LOCK' ? 'neo-inset ring-2 ring-status-lock/30' : ''"
      >
        <div class="flex flex-wrap items-center gap-2 text-sm">
          <StatusBadge :label="badge.label" :tone="badge.tone" />
          <span class="font-medium">{{ jobTitle }}</span>
          <span class="text-gray-500">核验次数: {{ attempt }}/2</span>
        </div>

        <div>
          <p class="sv-h2 mb-2">技能检查清单</p>
          <ul class="space-y-1 text-sm text-gray-700">
            <li>[x] Skill_A (L3)</li>
            <li>[x] Skill_B (L2)</li>
            <li>[ ] Skill_C (L3)</li>
          </ul>
        </div>

        <p class="text-sm text-gray-600">门槛通道：IDE 编码插件核验 + AI 模拟面试</p>

        <div
          v-if="status === 'FAILED_RETRY'"
          class="rounded-button border border-status-error/30 bg-status-error/10 px-4 py-3 text-sm text-status-error"
        >
          第 1 次核验未通过，剩余重试次数: 1 次
        </div>
        <div
          v-if="status === 'FAILED_LOCK'"
          class="rounded-button border border-status-lock bg-status-lock/10 px-4 py-3 text-sm text-status-lock"
        >
          该岗位核验次数已用尽。请更换其他目标岗位。
        </div>
        <div
          v-if="status === 'IN_POOL'"
          class="rounded-button border border-status-success/30 bg-status-success/10 px-4 py-3 text-sm text-status-success"
        >
          核验成功，已纳入人才库。
        </div>

        <div v-if="status === 'VERIFYING' && token" class="rounded-button neo-inset p-4 text-sm">
          <p>
            密钥: <code class="font-mono text-primary">{{ token }}</code>
            <button type="button" class="ml-2 text-primary">复制</button>
          </p>
          <p class="mt-1 text-gray-500">过期时间: 06-10 18:00</p>
          <button type="button" class="mt-2 text-sm text-primary underline" @click="pluginOpen = true">
            查看 VS Code 插件安装及操作说明 →
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            type="button"
            class="sv-btn sv-btn-primary"
            :disabled="cta.disabled"
            @click="onCta"
          >
            {{ cta.label }}
          </button>
          <template v-if="status === 'IN_POOL'">
            <RouterLink to="/talent/communications" class="sv-btn border border-gray-300 bg-surface">
              前往企业沟通
            </RouterLink>
          </template>
          <RouterLink
            v-if="status === 'FAILED_LOCK'"
            to="/talent/target-job"
            class="sv-btn sv-btn-primary"
          >
            更换其他目标岗位
          </RouterLink>
        </div>

        <div class="flex gap-2 pt-4 text-xs text-gray-400">
          <span>演示:</span>
          <button type="button" @click="demoPass">通过入库</button>
          <button type="button" @click="demoFail">失败</button>
          <button type="button" @click="demoEmpty">无目标岗</button>
        </div>
      </div>
    </template>

    <OverlayDrawer :open="pluginOpen" title="VS Code 插件安装说明" @close="pluginOpen = false">
      <ol class="list-decimal space-y-2 pl-4 text-sm leading-[1.2] text-gray-700">
        <li>下载 Skillver 内测插件 VSIX</li>
        <li>在 VS Code 扩展面板选择「从 VSIX 安装」</li>
        <li>粘贴上方 Token 并开始 IDE 行为采样</li>
      </ol>
    </OverlayDrawer>
  </div>
</template>
