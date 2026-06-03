export type CopilotMessage = {
  id: string
  role: 'assistant' | 'user' | 'system'
  content: string
  emoji?: string
}

export const talentCopilotSeed: CopilotMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      '嗨，我是你的 **求职助手**。\n\n你的人才档案已就绪，下面开始 7D 战力核验，一共 3 步：\n1. 下载并安装 Skillver 内测插件\n2. 在 VS Code 里编码完成 IDE 行为采样\n3. 系统通知你后参加多模态 AI 面试',
    emoji: '👋'
  },
  {
    id: '2',
    role: 'assistant',
    content: '需要插件时直接说「下载插件」，或前往核验页创建会话。'
  }
]

export const enterpriseCopilotSeed: CopilotMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content:
      '您好，我是 **招聘助手** —— 您可以把我当成 24 小时在线的 HR 搭档。\n\n我能帮您：发岗位、看匹配、约终面、谈薪资。\n\n试试直接说：**「帮我发一个后端岗位」**。'
  }
]
