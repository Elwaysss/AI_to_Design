import { ref } from 'vue'

/** Demo: 未通关时侧栏「能力核验」显示橙色呼吸灯 */
const needsAttention = ref(true)

export function useTalentVerificationHint() {
  function markCleared() {
    needsAttention.value = false
  }
  return { needsAttention, markCleared }
}
