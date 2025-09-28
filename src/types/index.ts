export interface Country {
  code: string
  name: string
  language: string
  contact: {
    phone: string
    email: string
    whatsapp: string
  }
  system: string
  model: string
}

export interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  country?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  country: string
  userId?: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
  country?: string
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    notifications: boolean
  }
  createdAt: Date
  lastLogin: Date
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ChatAnalytics {
  totalMessages: number
  totalSessions: number
  averageSessionLength: number
  popularCountries: Array<{
    country: string
    count: number
  }>
  dailyStats: Array<{
    date: string
    messages: number
    sessions: number
  }>
}

export interface SystemSettings {
  openaiApiKey: string
  openaiModel: string
  maxTokens: number
  temperature: number
  rateLimits: {
    messagesPerMinute: number
    sessionsPerHour: number
  }
  emailConfig: {
    provider: string
    apiKey: string
    fromEmail: string
  }
}

export interface FileUpload {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  url: string
  uploadedBy?: string
  uploadedAt: Date
}

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'status' | 'error'
  payload: any
  sessionId?: string
  userId?: string
  timestamp: Date
}