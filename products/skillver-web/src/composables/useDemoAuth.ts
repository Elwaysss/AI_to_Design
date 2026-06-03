import { computed } from 'vue'
import { useRouter } from 'vue-router'

export type DemoRole = 'guest' | 'talent' | 'enterprise' | 'operator' | 'super_admin'

const KEY = 'skillver-demo-role'

export function getDemoRole(): DemoRole {
  return (sessionStorage.getItem(KEY) as DemoRole) || 'guest'
}

export function setDemoRole(role: DemoRole) {
  if (role === 'guest') sessionStorage.removeItem(KEY)
  else sessionStorage.setItem(KEY, role)
}

export function useDemoAuth() {
  const router = useRouter()
  const role = computed(() => getDemoRole())
  const isSuperAdmin = computed(() => getDemoRole() === 'super_admin')

  function loginAs(next: Exclude<DemoRole, 'guest'>) {
    setDemoRole(next)
    if (next === 'talent') router.push('/talent')
    else if (next === 'enterprise') router.push('/enterprise')
    else router.push('/console')
  }

  function loginAsSuperAdmin() {
    setDemoRole('super_admin')
    router.push('/console')
  }

  function logout() {
    setDemoRole('guest')
    router.push('/')
  }

  return { role, isSuperAdmin, loginAs, loginAsSuperAdmin, logout }
}
