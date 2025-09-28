import { Invoice, InvoiceItem, TaxCalculation, ClientInfo } from '@/types'
import { getTaxConfig, SKV_COMPANY_INFO } from './tax-config'
import { generateId } from './utils'

export function calculateItemTotal(item: InvoiceItem): number {
  return item.quantity * item.unitPrice
}

export function calculateSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
}

export function calculateTaxes(items: InvoiceItem[], countryCode: string): TaxCalculation[] {
  const taxConfig = getTaxConfig(countryCode)
  const taxes: TaxCalculation[] = []
  
  const taxableAmount = items
    .filter(item => item.taxable)
    .reduce((sum, item) => sum + calculateItemTotal(item), 0)

  if (taxableAmount === 0) {
    return taxes
  }

  switch (countryCode) {
    case 'AE': {
      if (taxConfig.taxes.vat) {
        const vatAmount = (taxableAmount * taxConfig.taxes.vat.rate) / 100
        taxes.push({
          taxType: 'VAT',
          rate: taxConfig.taxes.vat.rate,
          amount: vatAmount,
          description: `${taxConfig.taxes.vat.description}`
        })
      }
      break
    }

    case 'IN': {
      if (taxConfig.taxes.gst) {
        // For simplicity, using IGST (integrated GST) for all transactions
        const gstAmount = (taxableAmount * taxConfig.taxes.gst.igst) / 100
        taxes.push({
          taxType: 'GST',
          rate: taxConfig.taxes.gst.igst,
          amount: gstAmount,
          description: `${taxConfig.taxes.gst.description} (IGST ${taxConfig.taxes.gst.igst}%)`
        })
      }
      break
    }

    case 'HU': {
      if (taxConfig.taxes.vat) {
        const vatAmount = (taxableAmount * taxConfig.taxes.vat.rate) / 100
        taxes.push({
          taxType: 'ÁFA',
          rate: taxConfig.taxes.vat.rate,
          amount: vatAmount,
          description: `${taxConfig.taxes.vat.description}`
        })
      }
      break
    }

    case 'GB': {
      if (taxConfig.taxes.vat) {
        const vatAmount = (taxableAmount * taxConfig.taxes.vat.rate) / 100
        taxes.push({
          taxType: 'VAT',
          rate: taxConfig.taxes.vat.rate,
          amount: vatAmount,
          description: `${taxConfig.taxes.vat.description}`
        })
      }
      break
    }
  }

  return taxes
}

export function calculateTotal(subtotal: number, taxes: TaxCalculation[]): number {
  const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0)
  return subtotal + totalTax
}

export function generateInvoiceNumber(countryCode: string): string {
  const year = new Date().getFullYear()
  const month = (new Date().getMonth() + 1).toString().padStart(2, '0')
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0')
  
  return `SKV-${countryCode}-${year}${month}-${random}`
}

export function createInvoice(
  items: InvoiceItem[],
  client: ClientInfo,
  countryCode: string,
  notes?: string
): Invoice {
  const taxConfig = getTaxConfig(countryCode)
  const subtotal = calculateSubtotal(items)
  const taxes = calculateTaxes(items, countryCode)
  const totalTax = taxes.reduce((sum, tax) => sum + tax.amount, 0)
  const total = subtotal + totalTax
  
  const now = new Date()
  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + 30) // 30 days payment terms

  return {
    id: generateId(),
    invoiceNumber: generateInvoiceNumber(countryCode),
    date: now,
    dueDate,
    issueDate: now,
    company: SKV_COMPANY_INFO,
    client,
    items,
    subtotal,
    taxes,
    totalTax,
    total,
    currency: taxConfig.currency,
    status: 'draft',
    paymentTerms: taxConfig.paymentTerms,
    notes,
    country: countryCode,
    locale: taxConfig.locale,
    createdAt: now,
    updatedAt: now
  }
}

export function formatCurrency(amount: number, currency: string, locale: string): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)
}

export function formatDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}

export function formatShortDate(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date)
}

export function validateInvoiceItems(items: InvoiceItem[]): string[] {
  const errors: string[] = []
  
  if (items.length === 0) {
    errors.push('At least one item is required')
  }
  
  items.forEach((item, index) => {
    if (!item.description?.trim()) {
      errors.push(`Item ${index + 1}: Description is required`)
    }
    if (item.quantity <= 0) {
      errors.push(`Item ${index + 1}: Quantity must be greater than 0`)
    }
    if (item.unitPrice < 0) {
      errors.push(`Item ${index + 1}: Unit price cannot be negative`)
    }
  })
  
  return errors
}

export function validateClientInfo(client: ClientInfo): string[] {
  const errors: string[] = []
  
  if (!client.name?.trim()) {
    errors.push('Client name is required')
  }
  if (!client.email?.trim()) {
    errors.push('Client email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
    errors.push('Valid email address is required')
  }
  if (!client.address || client.address.length === 0) {
    errors.push('Client address is required')
  }
  if (!client.country?.trim()) {
    errors.push('Client country is required')
  }
  
  return errors
}