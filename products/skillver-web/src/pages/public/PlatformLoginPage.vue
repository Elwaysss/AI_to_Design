<script setup lang="ts">
import { useDemoAuth } from '../../composables/useDemoAuth'

const { loginAs, loginAsSuperAdmin } = useDemoAuth()
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background px-6">
    <div class="w-full max-w-sm rounded-card sv-card p-8 leading-[1.2]">
      <h1 class="sv-h1">平台运营登录</h1>
      <button type="button" class="sv-btn sv-btn-primary mt-6 w-full" @click="loginAs('operator')">
        运营账号（Console）
      </button>
      <button
        type="button"
        class="sv-btn mt-3 w-full border border-gray-300 bg-surface"
        @click="loginAsSuperAdmin"
      >
        Super Admin（含 KAE 复核台）
      </button>
    </div>
  </div>
</template>
