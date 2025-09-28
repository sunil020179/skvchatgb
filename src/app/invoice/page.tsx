'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectOption } from '@/components/ui/select'
import { Invoice, InvoiceItem, ClientInfo } from '@/types'
import { getAllCountries } from '@/lib/countries'
import { getServicesByCountry, getTaxConfig } from '@/lib/tax-config'
import { 
  createInvoice, 
  formatCurrency, 
  formatDate, 
  validateInvoiceItems, 
  validateClientInfo
} from '@/lib/invoice-utils'
import { generateId } from '@/lib/utils'

export default function InvoiceGeneratorPage() {
  const [selectedCountry, setSelectedCountry] = useState('AE')
  const [clientInfo, setClientInfo] = useState<ClientInfo>({
    name: '',
    company: '',
    email: '',
    address: [''],
    country: 'AE'
  })
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: generateId(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxable: true
    }
  ])
  const [notes, setNotes] = useState('')
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const taxConfig = getTaxConfig(selectedCountry)
  const availableServices = getServicesByCountry(selectedCountry)

  useEffect(() => {
    setClientInfo(prev => ({ ...prev, country: selectedCountry }))
  }, [selectedCountry])

  const addInvoiceItem = () => {
    setInvoiceItems(prev => [...prev, {
      id: generateId(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
      taxable: true
    }])
  }

  const removeInvoiceItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setInvoiceItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice
        }
        return updated
      }
      return item
    }))
  }

  const selectService = (itemId: string, serviceName: string, price: number) => {
    updateInvoiceItem(itemId, 'description', serviceName)
    updateInvoiceItem(itemId, 'unitPrice', price)
  }

  const generateInvoice = async () => {
    setIsGenerating(true)
    setErrors([])

    // Validate client info and items
    const clientErrors = validateClientInfo(clientInfo)
    const itemErrors = validateInvoiceItems(invoiceItems)
    const allErrors = [...clientErrors, ...itemErrors]

    if (allErrors.length > 0) {
      setErrors(allErrors)
      setIsGenerating(false)
      return
    }

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const invoice = createInvoice(invoiceItems, clientInfo, selectedCountry, notes)
      setGeneratedInvoice(invoice)
    } catch (error) {
      setErrors(['Failed to generate invoice. Please try again.'])
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadInvoice = async () => {
    if (!generatedInvoice) return

    try {
      const response = await fetch('/api/invoice/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generatedInvoice)
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${generatedInvoice.invoiceNumber}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  const emailInvoice = async () => {
    if (!generatedInvoice) return

    try {
      const response = await fetch('/api/invoice/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice: generatedInvoice,
          recipientEmail: clientInfo.email
        })
      })

      if (response.ok) {
        alert('Invoice sent successfully!')
      } else {
        alert('Failed to send invoice. Please try again.')
      }
    } catch (error) {
      alert('Failed to send invoice. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10">
      {/* Header */}
      <header className="border-b border-border/50 glass-effect sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">S</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold">SKVChatGB</h1>
                  <p className="text-xs text-muted-foreground">Invoice Generator</p>
                </div>
              </a>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                ← Back to Home
              </a>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Professional Invoice Generator</h1>
          <p className="text-muted-foreground">
            Create country-specific invoices with automatic tax calculations for UAE, India, Hungary, and UK
          </p>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center p-4 feature-card">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">AE</span>
            </div>
            <h3 className="font-semibold text-sm">UAE VAT</h3>
            <p className="text-xs text-muted-foreground">5% VAT calculation</p>
          </Card>
          <Card className="text-center p-4 feature-card">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">IN</span>
            </div>
            <h3 className="font-semibold text-sm">India GST</h3>
            <p className="text-xs text-muted-foreground">18% GST (IGST)</p>
          </Card>
          <Card className="text-center p-4 feature-card">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">HU</span>
            </div>
            <h3 className="font-semibold text-sm">Hungary ÁFA</h3>
            <p className="text-xs text-muted-foreground">27% VAT calculation</p>
          </Card>
          <Card className="text-center p-4 feature-card">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold">GB</span>
            </div>
            <h3 className="font-semibold text-sm">UK VAT</h3>
            <p className="text-xs text-muted-foreground">20% VAT calculation</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Invoice Form */}
          <div className="space-y-6">
            {/* Country Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Country & Tax Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <Select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full"
                  >
                    {getAllCountries().map((country) => (
                      <SelectOption key={country.code} value={country.code}>
                        {country.name} ({country.code})
                      </SelectOption>
                    ))}
                  </Select>
                </div>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-sm">
                    <strong>Currency:</strong> {taxConfig.currency} | 
                    <strong> Tax Rate:</strong> {
                      taxConfig.taxes.vat?.rate || taxConfig.taxes.gst?.igst || 0
                    }%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Client Information */}
            <Card>
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Client Name *</label>
                    <Input
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter client name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <Input
                      value={clientInfo.company || ''}
                      onChange={(e) => setClientInfo(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Enter company name"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="client@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address *</label>
                  <Input
                    value={clientInfo.address[0] || ''}
                    onChange={(e) => setClientInfo(prev => ({ 
                      ...prev, 
                      address: [e.target.value, ...prev.address.slice(1)]
                    }))}
                    placeholder="Enter client address"
                    className="mb-2"
                  />
                  <Input
                    value={clientInfo.address[1] || ''}
                    onChange={(e) => setClientInfo(prev => ({ 
                      ...prev, 
                      address: [prev.address[0], e.target.value, ...prev.address.slice(2)]
                    }))}
                    placeholder="Address line 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tax Number</label>
                  <Input
                    value={clientInfo.taxNumber || ''}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, taxNumber: e.target.value }))}
                    placeholder="Enter tax number (optional)"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Invoice Items */}
            <Card>
              <CardHeader>
                <CardTitle>Invoice Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoiceItems.map((item, index) => (
                  <div key={item.id} className="border border-border/50 p-4 rounded-lg space-y-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {invoiceItems.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeInvoiceItem(item.id)}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Quick Service Selection */}
                    {availableServices.length > 0 && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Quick Select Service</label>
                        <Select
                          onChange={(e) => {
                            const [categoryIndex, serviceIndex] = e.target.value.split('-').map(Number)
                            if (!isNaN(categoryIndex) && !isNaN(serviceIndex)) {
                              const service = availableServices[categoryIndex]?.items[serviceIndex]
                              if (service) {
                                selectService(item.id, service.name, service.price)
                              }
                            }
                          }}
                          className="w-full"
                        >
                          <SelectOption value="">Select a service...</SelectOption>
                          {availableServices.map((category, catIndex) => (
                            <optgroup key={catIndex} label={category.category}>
                              {category.items.map((service, serviceIndex) => (
                                <SelectOption key={serviceIndex} value={`${catIndex}-${serviceIndex}`}>
                                  {service.name} - {formatCurrency(service.price, taxConfig.currency, taxConfig.locale)}
                                </SelectOption>
                              ))}
                            </optgroup>
                          ))}
                        </Select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <Input
                        value={item.description}
                        onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                        placeholder="Service description"
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Quantity</label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Unit Price ({taxConfig.currency})</label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateInvoiceItem(item.id, 'unitPrice', Number(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Total</label>
                        <Input
                          value={formatCurrency(item.totalPrice, taxConfig.currency, taxConfig.locale)}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`taxable-${item.id}`}
                        checked={item.taxable}
                        onChange={(e) => updateInvoiceItem(item.id, 'taxable', e.target.checked)}
                      />
                      <label htmlFor={`taxable-${item.id}`} className="text-sm">
                        Taxable
                      </label>
                    </div>
                  </div>
                ))}

                <Button onClick={addInvoiceItem} variant="outline" className="w-full">
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  className="w-full min-h-24 p-3 border border-input rounded-md bg-background text-foreground"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Additional notes or terms..."
                />
              </CardContent>
            </Card>

            {/* Generate Button */}
            <div className="space-y-4">
              {errors.length > 0 && (
                <Card className="border-destructive">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-destructive mb-2">Please fix the following errors:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-destructive">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={generateInvoice}
                disabled={isGenerating}
                size="lg"
                className="w-full"
              >
                {isGenerating ? 'Generating...' : 'Generate Invoice'}
              </Button>
            </div>
          </div>

          {/* Invoice Preview */}
          <div>
            {generatedInvoice ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>Invoice Preview</CardTitle>
                    <div className="space-x-2">
                      <Button onClick={downloadInvoice} size="sm">
                        Download PDF
                      </Button>
                      <Button onClick={emailInvoice} variant="outline" size="sm">
                        Email Invoice
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <InvoicePreview invoice={generatedInvoice} />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2">Invoice Preview</h3>
                    <p>Fill out the form and click "Generate Invoice" to see the preview</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/20 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold">S K V GLOBAL BUSINESS SERVICES L.L.C</p>
            <p className="text-sm text-muted-foreground">
              Office 101, Al Daghaya, Gold Souq Deira, Dubai | TRN 100044161600003
            </p>
            <p className="text-sm text-muted-foreground">
              Email: Info@skvchatgb.com | Phone: +971-50-123-4567
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              © 2025 SKV Global Business Services L.L.C. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Invoice Preview Component
function InvoicePreview({ invoice }: { invoice: Invoice }) {
  const taxConfig = getTaxConfig(invoice.country)

  return (
    <div className="bg-white text-black p-8 rounded-lg border max-h-96 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">INVOICE</h1>
          <p className="text-lg font-medium">{invoice.invoiceNumber}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-bold">{invoice.company.name}</h2>
          {invoice.company.address.map((line, index) => (
            <p key={index} className="text-sm">{line}</p>
          ))}
          <p className="text-sm">{invoice.company.email}</p>
          <p className="text-sm">{invoice.company.phone}</p>
          {invoice.company.taxNumber && (
            <p className="text-sm font-medium">TRN: {invoice.company.taxNumber}</p>
          )}
        </div>
      </div>

      {/* Invoice Info */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2">Bill To:</h3>
          <p className="font-medium">{invoice.client.name}</p>
          {invoice.client.company && <p>{invoice.client.company}</p>}
          {invoice.client.address.map((line, index) => (
            line && <p key={index} className="text-sm">{line}</p>
          ))}
          <p className="text-sm">{invoice.client.email}</p>
          {invoice.client.taxNumber && (
            <p className="text-sm">Tax Number: {invoice.client.taxNumber}</p>
          )}
        </div>
        
        <div className="text-right">
          <div className="space-y-1">
            <p><strong>Invoice Date:</strong> {formatDate(invoice.date, invoice.locale)}</p>
            <p><strong>Due Date:</strong> {formatDate(invoice.dueDate, invoice.locale)}</p>
            <p><strong>Currency:</strong> {invoice.currency}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Description</th>
              <th className="border border-gray-300 p-2 text-center">Qty</th>
              <th className="border border-gray-300 p-2 text-right">Unit Price</th>
              <th className="border border-gray-300 p-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id}>
                <td className="border border-gray-300 p-2">{item.description}</td>
                <td className="border border-gray-300 p-2 text-center">{item.quantity}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatCurrency(item.unitPrice, invoice.currency, invoice.locale)}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {formatCurrency(item.totalPrice, invoice.currency, invoice.locale)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{formatCurrency(invoice.subtotal, invoice.currency, invoice.locale)}</span>
          </div>
          {invoice.taxes.map((tax) => (
            <div key={tax.taxType} className="flex justify-between">
              <span>{tax.description}:</span>
              <span>{formatCurrency(tax.amount, invoice.currency, invoice.locale)}</span>
            </div>
          ))}
          <div className="border-t pt-2 font-bold text-lg flex justify-between">
            <span>Total:</span>
            <span>{formatCurrency(invoice.total, invoice.currency, invoice.locale)}</span>
          </div>
        </div>
      </div>

      {/* Payment Terms & Notes */}
      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold">Payment Terms:</h4>
          <p>{invoice.paymentTerms}</p>
        </div>
        
        {invoice.notes && (
          <div>
            <h4 className="font-semibold">Notes:</h4>
            <p>{invoice.notes}</p>
          </div>
        )}
        
        <div>
          <h4 className="font-semibold">Legal Requirements:</h4>
          {taxConfig.legalRequirements.map((req, index) => (
            <p key={index} className="text-xs">{req}</p>
          ))}
        </div>
      </div>
    </div>
  )
}