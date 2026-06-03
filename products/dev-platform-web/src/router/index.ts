import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'design-module',
      component: () => import('../pages/DesignModulePage.vue')
    },
    {
      path: '/preview/dashboard',
      name: 'preview-dashboard',
      component: () => import('../components/preview/GenericPreviewPage.vue')
    },
    {
      path: '/example/dashboard',
      name: 'example-dashboard',
      component: () => import('../pages/ExampleDashboardPage.vue')
    }
  ]
})
