<script setup lang="ts">
import { ref } from 'vue'
import PageHeading from '../../components/ui/PageHeading.vue'

const filter = ref<'all' | 'open' | 'closed'>('all')
const confirmOpen = ref(false)

const rows = [
  { id: 'fb_1', user: 't_001', status: 'open', summary: '插件 Token 过期提示不清晰' },
  { id: 'fb_2', user: 'e_02', status: 'closed', summary: '匹配列表加载慢' }
]

const visible = () =>
  rows.filter((r) => filter.value === 'all' || r.status === filter.value)
</script>

<template>
  <div>
    <PageHeading title="用户反馈审计" />
    <div class="mt-4 flex gap-2">
      <button
        v-for="f in ['all', 'open', 'closed']"
        :key="f"
        type="button"
        class="rounded-button px-3 py-1 text-sm"
        :class="filter === f ? 'bg-primary text-white' : 'bg-surface border border-gray-200'"
        @click="filter = f as typeof filter"
      >
        {{ f }}
      </button>
    </div>
    <table class="mt-6 w-full rounded-card sv-card text-left text-sm leading-[1.2]">
      <thead class="border-b border-gray-200 bg-background text-gray-500">
        <tr>
          <th class="px-4 py-3">ID</th>
          <th class="px-4 py-3">用户</th>
          <th class="px-4 py-3">状态</th>
          <th class="px-4 py-3">摘要</th>
          <th class="px-4 py-3">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in visible()" :key="r.id" class="border-t border-gray-100">
          <td class="px-4 py-3">{{ r.id }}</td>
          <td class="px-4 py-3">{{ r.user }}</td>
          <td class="px-4 py-3">{{ r.status }}</td>
          <td class="px-4 py-3">{{ r.summary }}</td>
          <td class="px-4 py-3">
            <button
              v-if="r.status === 'open'"
              type="button"
              class="text-primary"
              @click="confirmOpen = true"
            >
              关闭反馈
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="confirmOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      @click.self="confirmOpen = false"
    >
      <div class="w-full max-w-sm rounded-card bg-surface p-6 shadow-overlay">
        <p class="font-medium">确认关单？</p>
        <div class="mt-4 flex justify-end gap-2">
          <button type="button" class="sv-btn border border-gray-300" @click="confirmOpen = false">取消</button>
          <button type="button" class="sv-btn sv-btn-primary" @click="confirmOpen = false">确认关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>
