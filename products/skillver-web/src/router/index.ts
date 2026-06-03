import { createRouter, createWebHistory } from 'vue-router'
import { getDemoRole } from '../composables/useDemoAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../layouts/PublicLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('../pages/public/HomePage.vue') },
        { path: 'terms', name: 'terms', component: () => import('../pages/public/LegalPage.vue'), props: { kind: 'terms' } },
        { path: 'privacy', name: 'privacy', component: () => import('../pages/public/LegalPage.vue'), props: { kind: 'privacy' } },
        { path: 'about', name: 'about', component: () => import('../pages/public/LegalPage.vue'), props: { kind: 'about' } },
        { path: 'nda', name: 'nda', component: () => import('../pages/public/NdaPage.vue') }
      ]
    },
    { path: '/login/jobseeker', redirect: '/?role=talent' },
    { path: '/login/enterprise', redirect: '/?role=enterprise' },
    { path: '/login/platform', name: 'platform-login', component: () => import('../pages/public/PlatformLoginPage.vue') },
    {
      path: '/talent',
      component: () => import('../layouts/TalentLayout.vue'),
      meta: { requiresRole: 'talent' },
      children: [
        { path: '', name: 'talent-copilot', component: () => import('../pages/talent/TalentCopilotPage.vue') },
        { path: 'settings', name: 'talent-settings', component: () => import('../pages/talent/TalentSettingsPage.vue') },
        { path: 'target-job', name: 'talent-target-job', component: () => import('../pages/talent/TalentTargetJobPage.vue') },
        { path: 'verification', name: 'talent-verification', component: () => import('../pages/talent/TalentVerificationPage.vue') },
        { path: 'reports', name: 'talent-reports', component: () => import('../pages/talent/TalentReportsPage.vue') },
        { path: 'reports/:reportId', name: 'talent-report-detail', component: () => import('../pages/talent/TalentReportDetailPage.vue') },
        { path: 'communications', name: 'talent-communications', component: () => import('../pages/talent/TalentCommunicationsPage.vue') }
      ]
    },
    {
      path: '/talent/interview/:sessionId',
      name: 'talent-interview',
      component: () => import('../layouts/InterviewLayout.vue'),
      meta: { requiresRole: 'talent' },
      children: [{ path: '', component: () => import('../pages/talent/TalentInterviewPage.vue') }]
    },
    {
      path: '/enterprise',
      component: () => import('../layouts/EnterpriseLayout.vue'),
      meta: { requiresRole: 'enterprise' },
      children: [
        { path: '', name: 'enterprise-copilot', component: () => import('../pages/enterprise/EnterpriseCopilotPage.vue') },
        { path: 'jobs', name: 'enterprise-jobs', component: () => import('../pages/enterprise/EnterpriseJobsPage.vue') },
        { path: 'jobs/:jobId', name: 'enterprise-job-detail', component: () => import('../pages/enterprise/EnterpriseJobDetailPage.vue') },
        { path: 'talent-matching', name: 'enterprise-matching', component: () => import('../pages/enterprise/EnterpriseMatchingPage.vue') },
        { path: 'talents/:talentId', name: 'enterprise-talent-detail', component: () => import('../pages/enterprise/EnterpriseTalentDetailPage.vue') },
        { path: 'communications', name: 'enterprise-communications', component: () => import('../pages/enterprise/EnterpriseCommunicationsPage.vue') }
      ]
    },
    {
      path: '/console',
      component: () => import('../layouts/ConsoleLayout.vue'),
      meta: { requiresRole: ['operator', 'super_admin'] },
      children: [
        { path: '', name: 'console-overview', component: () => import('../pages/console/ConsoleOverviewPage.vue') },
        { path: 'operations', name: 'console-operations', component: () => import('../pages/console/ConsolePlaceholderPage.vue'), props: { title: '用户运营' } },
        { path: 'ai-monitor', name: 'console-ai-monitor', component: () => import('../pages/console/ConsolePlaceholderPage.vue'), props: { title: 'AI 性能监控' } },
        { path: 'verification-ops', name: 'console-verification', component: () => import('../pages/console/ConsoleVerificationOpsPage.vue') },
        { path: 'hiring-ops', name: 'console-hiring', component: () => import('../pages/console/ConsoleHiringOpsPage.vue') },
        { path: 'invitations', name: 'console-invitations', component: () => import('../pages/console/ConsolePlaceholderPage.vue'), props: { title: '邀请码发放' } },
        {
          path: 'kae-reviews',
          name: 'console-kae',
          meta: { requiresSuperAdmin: true },
          component: () => import('../pages/console/ConsoleKaeReviewsPage.vue')
        },
        { path: 'feedback', name: 'console-feedback', component: () => import('../pages/console/ConsoleFeedbackPage.vue') }
      ]
    }
  ]
})

router.beforeEach((to) => {
  const roleRequired = to.matched.find((r) => r.meta.requiresRole)?.meta.requiresRole
  if (roleRequired) {
    const role = getDemoRole()
    const allowed = Array.isArray(roleRequired) ? roleRequired : [roleRequired]
    if (!allowed.includes(role) && !(role === 'super_admin' && allowed.includes('operator'))) {
      return { path: '/', query: { redirect: to.fullPath } }
    }
  }
  if (to.meta.requiresSuperAdmin && getDemoRole() !== 'super_admin') {
    return { path: '/console' }
  }
  return true
})

export { router }
