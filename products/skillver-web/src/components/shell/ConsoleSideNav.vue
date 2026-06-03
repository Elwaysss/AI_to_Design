<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useDemoAuth } from '../../composables/useDemoAuth'

const route = useRoute()
const { logout, isSuperAdmin } = useDemoAuth()

const groups = [
  {
    label: '概览',
    items: [{ to: '/console', label: '概览看板', exact: true }]
  },
  {
    label: '运营',
    items: [
      { to: '/console/operations', label: '用户运营' },
      { to: '/console/ai-monitor', label: 'AI 性能监控' }
    ]
  },
  {
    label: '业务链路',
    items: [
      { to: '/console/verification-ops', label: '核验入库' },
      { to: '/console/hiring-ops', label: '招聘撮合' },
      { to: '/console/kae-reviews', label: 'KAE 复核台', superOnly: true }
    ]
  },
  {
    label: '平台工具',
    items: [
      { to: '/console/invitations', label: '邀请码发放' },
      { to: '/console/feedback', label: '用户反馈审计' }
    ]
  }
]

const visibleGroups = computed(() =>
  groups.map((g) => ({
    ...g,
    items: g.items.filter((i) => !('superOnly' in i && i.superOnly) || isSuperAdmin.value)
  }))
)

function active(to: string, exact?: boolean) {
  if (exact) return route.path === to
  return route.path.startsWith(to)
}
</script>

<template>
  <aside class="glass-panel-strong flex w-56 shrink-0 flex-col m-3 mr-0 rounded-card">
    <div class="px-4 py-4 font-semibold text-slate-100">运营后台</div>
    <nav class="flex-1 overflow-y-auto px-2 pb-4">
      <div v-for="group in visibleGroups" :key="group.label" class="mb-4">
        <p class="px-2 py-1 text-xs font-medium uppercase tracking-wide text-status-neutral">
          {{ group.label }}
        </p>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="mb-0.5 block rounded-button px-3 py-2 text-sm leading-[1.2] transition-all"
          :class="
            active(item.to, 'exact' in item && item.exact)
              ? 'glass-nav-active'
              : 'text-slate-400 glass-nav-item'
          "
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>
    <button type="button" class="m-3 text-left text-sm text-slate-400 glass-nav-item rounded-button px-2 py-1.5" @click="logout">
      退出
    </button>
  </aside>
</template>
