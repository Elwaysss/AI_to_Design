<script setup lang="ts">
import { ref } from 'vue'
import PageHeading from '../../components/ui/PageHeading.vue'
import ConsoleDataTable from '../../components/console/ConsoleDataTable.vue'
import OverlayDrawer from '../../components/layout/OverlayDrawer.vue'

const drawerOpen = ref(false)
const selectedId = ref('')

const columns = ['session_id', 'talent_id', 'job_name', 'kae_status']
const rows = [
  { session_id: 'sess_88', talent_id: 't_009', job_name: 'AI 应用', kae_status: 'PENDING' }
]

function openRow(id: string) {
  selectedId.value = id
  drawerOpen.value = true
}
</script>

<template>
  <div>
    <PageHeading title="KAE 复核台" />
    <p class="sv-h3 mt-1">仅 super_admin 可见此菜单</p>
    <ConsoleDataTable class="mt-6" :columns="columns" :rows="rows" />
    <button type="button" class="mt-4 text-sm text-primary" @click="openRow('sess_88')">演示：打开复核抽屉</button>

    <OverlayDrawer :open="drawerOpen" :title="`复核 ${selectedId}`" @close="drawerOpen = false">
      <p class="mb-4 text-sm text-gray-600">管理员写操作</p>
      <div class="flex gap-3">
        <button type="button" class="sv-btn sv-btn-primary">Override PASS / 强行通过</button>
        <button type="button" class="sv-btn border border-status-error text-status-error">REJECT / 驳回</button>
      </div>
    </OverlayDrawer>
  </div>
</template>
