<script setup lang="ts">
import AuthPanel from '../../components/auth/AuthPanel.vue'
</script>

<template>
  <div class="mx-auto grid max-w-4xl flex-1 gap-8 px-6 py-10 lg:grid-cols-2 lg:items-start">
    <section class="leading-[1.2]">
      <h1 class="sv-h1">Skillver</h1>
      <p class="mt-3 text-sm text-gray-600">AI 时代的人才 copilot · V2.1 文档即设计</p>
      <ul class="mt-6 space-y-2 text-sm text-gray-700">
        <li>人才端：暗色叙事已移除，统一 V2.1 Token</li>
        <li>企业端：招聘助手为默认首页</li>
        <li>运营端：纯表格看板，无 Copilot</li>
      </ul>
    </section>
    <AuthPanel />
  </div>
  <footer class="mx-4 mb-6 rounded-card glass-panel py-6 text-center text-sm text-slate-400">
    <a href="/about" class="text-primary">关于我们</a>
    · 沪ICP备2026081662号 ·
    <a href="/privacy" class="text-primary">隐私政策</a>
  </footer>
</template>
