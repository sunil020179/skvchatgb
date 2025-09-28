'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { DEFAULT_COUNTRY, getCountryByCode, getCountryFromSubdomain, getAllCountries } from '@/lib/countries'
import { ChatMessage } from '@/types'
import { cn, generateId } from '@/lib/utils'

export default function HomePage() {
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_COUNTRY)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      text: "Hi! I am SKVChatGB, your AI business consultant. How can I help you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  // Auto-detect country from subdomain
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const country = getCountryFromSubdomain(window.location.hostname)
      setSelectedCountry(country)
    }
  }, [])

  const currentCountry = getCountryByCode(selectedCountry)

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: generateId(),
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
      country: selectedCountry
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat-country', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userMessage.text,
          country: selectedCountry
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const responseData = await response.json()
      
      setIsTyping(false)
      
      const assistantMessage: ChatMessage = {
        id: generateId(),
        text: responseData.message || 'Sorry, I could not generate a response.',
        isUser: false,
        timestamp: new Date(),
        country: selectedCountry
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setIsTyping(false)
      const errorMessage: ChatMessage = {
        id: generateId(),
        text: 'Sorry, I encountered an error. Please try again later.',
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToDemo = () => {
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 glass-effect sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold">SKVChatGB</h1>
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                  v2.0 NEW
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#demo" className="text-muted-foreground hover:text-foreground transition-colors">
                Demo
              </a>
              <a href="/invoice" className="text-muted-foreground hover:text-foreground transition-colors">
                Invoice
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Build delightful chat experiences with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                  SKVChatGB
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A powerful, secure & country-aware AI chatbot for your business. 
                Get expert consultation on company formation, tax compliance, and business regulations 
                across UAE, India, Hungary, and UK. No technical knowledge required.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="text-base px-8 py-6 h-auto"
                onClick={scrollToDemo}
              >
                Try Live Demo
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-base px-8 py-6 h-auto"
                onClick={() => window.open(`https://wa.me/${currentCountry.contact.whatsapp}`, '_blank')}
              >
                WhatsApp Us
              </Button>
            </div>

            {/* Country Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="feature-card">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Support</div>
                  <div className="font-medium">
                    {currentCountry.contact.phone} • {currentCountry.contact.email}
                  </div>
                </CardContent>
              </Card>
              <Card className="feature-card">
                <CardContent className="p-4">
                  <div className="text-sm text-muted-foreground">Selected Country</div>
                  <div className="font-medium">
                    {currentCountry.name} ({currentCountry.code})
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Chat Demo */}
          <div className="order-first lg:order-last">
            <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-card/95 backdrop-blur-xl" id="demo">
              <CardHeader className="border-b border-border/50">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Live Demo</CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Country</span>
                    <Select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-auto min-w-[120px] h-8 text-sm"
                    >
                      {getAllCountries().map((country) => (
                        <SelectOption key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </SelectOption>
                      ))}
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Chat Messages */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-muted/20">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        'flex',
                        message.isUser ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'chat-bubble',
                          message.isUser ? 'user' : 'assistant'
                        )}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="chat-bubble assistant">
                        <div className="typing-indicator">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-border/50">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      onClick={sendMessage} 
                      disabled={!inputMessage.trim() || isLoading}
                      size="sm"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-24">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced AI-powered business consultation with country-specific expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="feature-card text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-primary"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Country-Aware Intelligence</h3>
                <p className="text-muted-foreground">
                  Specialized business advice tailored for UAE, India, Hungary, and UK markets
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-secondary/20 to-secondary/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-secondary"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-time Consultation</h3>
                <p className="text-muted-foreground">
                  Instant responses to your business queries with expert-level accuracy
                </p>
              </CardContent>
            </Card>

            <Card className="feature-card text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-green-500"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Invoice System</h3>
                <p className="text-muted-foreground">
                  Professional invoice generation with country-specific tax calculations
                </p>
                <a href="/invoice" className="inline-block mt-2 text-primary hover:underline text-sm font-medium">
                  Try Invoice Generator →
                </a>
              </CardContent>
            </Card>

            <Card className="feature-card text-center">
              <CardContent className="pt-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-accent"></div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Multi-Channel Support</h3>
                <p className="text-muted-foreground">
                  Available on web and WhatsApp for seamless business communication
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 SKV Business Service LLC. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}