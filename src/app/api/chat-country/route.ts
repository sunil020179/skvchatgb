import { NextRequest, NextResponse } from 'next/server'
import { getCountryByCode } from '@/lib/countries'

export async function POST(request: NextRequest) {
  try {
    const { user, country } = await request.json()

    if (!user || typeof user !== 'string') {
      return NextResponse.json(
        { error: '`user` message is required and must be a string' },
        { status: 400 }
      )
    }

    const countryConfig = getCountryByCode(country || 'AE')

    // For now, return a mock response since we don't have OpenAI API key
    // In production, this would make a call to OpenAI or other AI service
    const mockResponses = [
      `Thank you for your inquiry about ${countryConfig.name}! As an expert business consultant for SKV Business Services, I'd be happy to help you with business setup, compliance, and regulations in ${countryConfig.name}.`,
      `I understand you're interested in business services in ${countryConfig.name}. Our team specializes in company formation, tax compliance, and business licensing. What specific aspect of business setup would you like to know more about?`,
      `Great question! In ${countryConfig.name}, there are several business structures and compliance requirements to consider. I can help you understand the registration process, tax obligations, and regulatory requirements. What's your specific business need?`,
      `As your AI business consultant for ${countryConfig.name}, I can provide guidance on various business services including company incorporation, VAT registration, licensing, and compliance. How can I assist you today?`
    ]

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

    return NextResponse.json({ 
      message: randomResponse,
      country: countryConfig.code,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'SKVChatGB API is running',
    version: '2.0.0',
    endpoints: {
      chat: '/api/chat-country (POST)'
    }
  })
}