<script setup lang="ts">
import PageHeading from '../../components/ui/PageHeading.vue'
import ConsoleDataTable from '../../components/console/ConsoleDataTable.vue'

const columns = ['talent_id', 'job_name', 'status', 'attempt', '耗时']
const rows = [
  { talent_id: 't_001', job_name: 'Golang 后端', status: 'IN_POOL', attempt: 1, 耗时: '42m' },
  { talent_id: 't_002', job_name: 'RAG 应用', status: 'VERIFYING', attempt: 1, 耗时: '12m' }
]
</script>

<template>
  <div>
    <PageHeading title="核验入库看板" />
    <p class="sv-h3 mt-1">只读 DataTable，无行内编辑</p>
    <ConsoleDataTable class="mt-6" :columns="columns" :rows="rows" />
  </div>
</template>
