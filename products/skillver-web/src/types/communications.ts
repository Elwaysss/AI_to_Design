/** V2.1 §4.2 — 终面联动状态 */
export type InterviewFlowStatus =
  | 'INVITED'
  | 'CANCELLED'
  | 'COMPLETED_PASS'
  | 'COMPLETED_FAIL'
  | 'COMPLETED_CHEAT'

export type TalentCommTab = 'final' | 'salary' | 'offer'
export type EnterpriseCommTab = 'final' | 'bid' | 'contract'
