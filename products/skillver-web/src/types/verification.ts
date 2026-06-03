/** V2.1 §4.1 — 能力核验 UI 变体 */
export type VerificationUiStatus =
  | 'EMPTY'
  | 'SELECTED'
  | 'VERIFYING'
  | 'IN_POOL'
  | 'FAILED_RETRY'
  | 'FAILED_LOCK'

export type VerificationBadgeTone =
  | 'warning'
  | 'orange'
  | 'success'
  | 'error'
  | 'lock'
  | 'neutral'
