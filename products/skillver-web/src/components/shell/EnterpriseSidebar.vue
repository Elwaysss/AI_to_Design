<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import { useDemoAuth } from '../../composables/useDemoAuth'

const route = useRoute()
const { logout } = useDemoAuth()

const nav = [
  { to: '/enterprise/jobs', label: '岗位管理' },
  { to: '/enterprise/talent-matching', label: '人才管理' },
  { to: '/enterprise/communications', label: '人才沟通' }
]

function active(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<template>
  <aside class="glass-panel-strong flex w-sidebar-enterprise shrink-0 flex-col m-3 mr-0 rounded-card">
    <div class="px-4 py-4">
      <RouterLink to="/enterprise" class="font-semibold text-primary">Skillver</RouterLink>
      <p class="sv-h3 mt-1">企业工作台</p>
    </div>

    <nav class="flex flex-1 flex-col gap-1 px-3" aria-label="工作台导航">
      <RouterLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="rounded-button px-3 py-2 text-sm leading-[1.2] transition-all"
        :class="active(item.to) ? 'glass-nav-active' : 'text-slate-300 glass-nav-item'"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <footer class="p-3">
      <button type="button" class="text-sm leading-[1.2] text-slate-400 glass-nav-item rounded-button px-2 py-1.5" @click="logout">
        安全登出
      </button>
    </footer>
  </aside>
</template>
