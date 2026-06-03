<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useDemoAuth } from '../../composables/useDemoAuth'
import { useTalentVerificationHint } from '../../composables/useTalentVerificationHint'

const route = useRoute()
const { logout } = useDemoAuth()
const { needsAttention } = useTalentVerificationHint()

const showSessionSlot = computed(
  () => route.name === 'talent-copilot' && route.path === '/talent'
)

const nav = [
  { to: '/talent/target-job', label: '目标岗位' },
  { to: '/talent/verification', label: '能力核验', pulse: true },
  { to: '/talent/reports', label: '我的报告' },
  { to: '/talent/communications', label: '企业沟通' }
]

const sessions = [
  { id: 's1', title: '核验与目标岗咨询' },
  { id: 's2', title: '报告解读' }
]

function active(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside class="glass-panel-strong flex w-sidebar-talent shrink-0 flex-col border-r-0 m-3 mr-0 rounded-card">
    <div class="px-4 py-4">
      <RouterLink to="/talent" class="font-semibold text-primary">Skillver</RouterLink>
      <p class="sv-h3 mt-1">人才工作台</p>
    </div>

    <section
      v-show="showSessionSlot"
      class="glass-input mx-3 mb-2 rounded-card p-3"
      aria-label="会话历史"
    >
      <RouterLink
        to="/talent"
        class="mb-2 block w-full rounded-button py-2 text-center text-sm leading-[1.2] glass-nav-item"
      >
        + 新建对话
      </RouterLink>
      <ul class="max-h-40 space-y-1 overflow-y-auto">
        <li v-for="s in sessions" :key="s.id">
          <RouterLink
            to="/talent"
            class="block truncate rounded-button px-2 py-1.5 text-sm leading-[1.2] text-slate-300 glass-nav-item"
          >
            {{ s.title }}
          </RouterLink>
        </li>
      </ul>
    </section>

    <nav class="flex flex-1 flex-col gap-1 px-3" aria-label="工作台导航">
      <RouterLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="flex items-center justify-between rounded-button px-3 py-2 text-sm leading-[1.2] transition-all"
        :class="active(item.to) ? 'glass-nav-active' : 'text-slate-300 glass-nav-item'"
      >
        <span>{{ item.label }}</span>
        <span
          v-if="item.pulse && needsAttention"
          class="h-2 w-2 rounded-full bg-status-orange sv-pulse-orange"
          aria-label="待完成核验"
        />
      </RouterLink>
    </nav>

    <footer class="space-y-1 p-3 text-sm leading-[1.2]">
      <RouterLink to="/talent/settings" class="block rounded-button px-2 py-1.5 text-slate-400 glass-nav-item">
        账户设置
      </RouterLink>
      <a href="/about" class="block rounded-button px-2 py-1.5 text-slate-400 glass-nav-item">帮助中心</a>
      <button type="button" class="w-full rounded-button px-2 py-1.5 text-left text-slate-400 glass-nav-item" @click="logout">
        安全登出
      </button>
    </footer>
  </aside>
</template>
