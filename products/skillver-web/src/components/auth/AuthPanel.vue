<script setup lang="ts">
import { ref } from 'vue'
import { useDemoAuth } from '../../composables/useDemoAuth'

const roleTab = ref<'talent' | 'enterprise'>('talent')
const modeTab = ref<'login' | 'register'>('login')
const { loginAs } = useDemoAuth()
</script>

<template>
  <section class="glass-panel p-6 leading-[1.2]" aria-labelledby="auth-heading">
    <h2 id="auth-heading" class="sv-h2">欢迎</h2>
    <p class="mt-2 text-sm text-slate-400">Glassmorphism Pro · 单页内跳转</p>

    <div class="glass-input mt-4 flex rounded-card p-1">
      <button
        type="button"
        class="flex-1 rounded-button py-2 text-sm transition-all"
        :class="roleTab === 'talent' ? 'glass-nav-active' : 'text-slate-400'"
        @click="roleTab = 'talent'"
      >
        人才
      </button>
      <button
        type="button"
        class="flex-1 rounded-button py-2 text-sm transition-all"
        :class="roleTab === 'enterprise' ? 'glass-nav-active' : 'text-slate-400'"
        @click="roleTab = 'enterprise'"
      >
        企业
      </button>
    </div>

    <div class="mt-4 flex gap-4 text-sm">
      <button type="button" :class="modeTab === 'login' ? 'font-medium text-primary' : 'text-slate-400'" @click="modeTab = 'login'">
        登录
      </button>
      <button type="button" :class="modeTab === 'register' ? 'font-medium text-primary' : 'text-slate-400'" @click="modeTab = 'register'">
        注册
      </button>
    </div>

    <label class="mt-4 block text-sm text-slate-400" for="auth-phone">手机号</label>
    <input id="auth-phone" type="tel" class="glass-input mt-1 h-10 w-full rounded-button px-3" />

    <button type="button" class="sv-btn sv-btn-primary mt-6 w-full" @click="loginAs(roleTab)">
      {{ modeTab === 'login' ? '登录' : '注册并进入' }}
    </button>
  </section>
</template>
