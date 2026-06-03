<script setup lang="ts">
defineProps<{
  columns: string[]
  rows: Record<string, string | number>[]
}>()
</script>

<template>
  <div class="overflow-hidden rounded-card glass-panel">
    <table class="w-full text-left text-sm leading-[1.2]">
      <thead class="text-gray-500">
        <tr>
          <th v-for="col in columns" :key="col" class="px-4 py-3 font-medium">{{ col }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in rows" :key="i" class="border-t border-transparent">
          <td v-for="col in columns" :key="col" class="px-4 py-3 text-gray-800">
            {{ row[col] ?? '—' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
