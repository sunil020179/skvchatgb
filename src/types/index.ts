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

// Invoice System Types
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
  taxable: boolean
}

export interface TaxCalculation {
  taxType: string
  rate: number
  amount: number
  description: string
}

export interface CompanyInfo {
  name: string
  address: string[]
  email: string
  phone: string
  website?: string
  logo?: string
  taxNumber?: string
  registrationNumber?: string
}

export interface ClientInfo {
  name: string
  company?: string
  email: string
  address: string[]
  taxNumber?: string
  country: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  issueDate: Date
  
  // Company and client information
  company: CompanyInfo
  client: ClientInfo
  
  // Invoice details
  items: InvoiceItem[]
  subtotal: number
  taxes: TaxCalculation[]
  totalTax: number
  total: number
  
  // Payment and status
  currency: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  paymentTerms: string
  notes?: string
  
  // Country-specific
  country: string
  locale: string
  
  // Audit trail
  createdAt: Date
  updatedAt: Date
  createdBy?: string
}

export interface CountryTaxConfig {
  country: string
  currency: string
  locale: string
  taxes: {
    vat?: {
      rate: number
      name: string
      description: string
    }
    gst?: {
      cgst: number
      sgst: number
      igst: number
      name: string
      description: string
    }
    corporateTax?: {
      rate: number
      name: string
      description: string
    }
    serviceCharge?: {
      rate: number
      name: string
      description: string
    }
  }
  paymentTerms: string
  legalRequirements: string[]
}