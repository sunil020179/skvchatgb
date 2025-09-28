import { NextRequest, NextResponse } from 'next/server'
import { Invoice } from '@/types'
import { formatCurrency, formatDate } from '@/lib/invoice-utils'
import { getTaxConfig } from '@/lib/tax-config'

export async function POST(request: NextRequest) {
  try {
    const invoice: Invoice = await request.json()
    
    if (!invoice || !invoice.id) {
      return NextResponse.json(
        { error: 'Invalid invoice data' },
        { status: 400 }
      )
    }

    // In a real implementation, you would use a library like Puppeteer or jsPDF
    // For now, we'll return a simple HTML response that can be used for PDF generation
    const taxConfig = getTaxConfig(invoice.country)
    
    const htmlContent = generateInvoiceHTML(invoice, taxConfig)
    
    // For demo purposes, return the HTML content
    // In production, you would convert this to PDF using libraries like:
    // - Puppeteer (headless Chrome)
    // - jsPDF
    // - Playwright
    // - html-pdf
    
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${invoice.invoiceNumber}.html"`
      }
    })

  } catch (error) {
    console.error('PDF Generation Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}

function generateInvoiceHTML(invoice: Invoice, taxConfig: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            line-height: 1.6;
        }
        .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border: 1px solid #ddd;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
        }
        .invoice-title {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            margin: 0;
        }
        .invoice-number {
            font-size: 18px;
            margin: 5px 0;
            font-weight: 600;
        }
        .company-info {
            text-align: right;
        }
        .company-name {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .company-details {
            font-size: 14px;
            line-height: 1.4;
        }
        .invoice-details {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
        }
        .bill-to, .invoice-info {
            width: 48%;
        }
        .bill-to h3, .invoice-info h3 {
            font-size: 16px;
            margin-bottom: 10px;
            color: #007bff;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background-color: #f8f9fa;
            padding: 12px;
            text-align: left;
            border: 1px solid #dee2e6;
            font-weight: 600;
        }
        .items-table td {
            padding: 12px;
            border: 1px solid #dee2e6;
        }
        .items-table th:nth-child(2),
        .items-table td:nth-child(2) {
            text-align: center;
        }
        .items-table th:nth-child(3),
        .items-table td:nth-child(3),
        .items-table th:nth-child(4),
        .items-table td:nth-child(4) {
            text-align: right;
        }
        .totals {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
        }
        .totals-table {
            width: 300px;
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
        }
        .total-final {
            border-top: 2px solid #007bff;
            font-weight: bold;
            font-size: 18px;
            padding-top: 10px;
            margin-top: 10px;
        }
        .footer-section {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .footer-section h4 {
            margin-bottom: 8px;
            color: #007bff;
        }
        .legal-text {
            font-size: 12px;
            color: #666;
            margin: 5px 0;
        }
        @media print {
            body { margin: 0; }
            .invoice-container { 
                box-shadow: none; 
                border: none; 
                padding: 20px; 
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header">
            <div>
                <h1 class="invoice-title">INVOICE</h1>
                <div class="invoice-number">${invoice.invoiceNumber}</div>
            </div>
            <div class="company-info">
                <div class="company-name">${invoice.company.name}</div>
                <div class="company-details">
                    ${invoice.company.address.map(line => `<div>${line}</div>`).join('')}
                    <div>${invoice.company.email}</div>
                    <div>${invoice.company.phone}</div>
                    ${invoice.company.taxNumber ? `<div><strong>TRN:</strong> ${invoice.company.taxNumber}</div>` : ''}
                </div>
            </div>
        </div>

        <!-- Invoice Details -->
        <div class="invoice-details">
            <div class="bill-to">
                <h3>Bill To:</h3>
                <div><strong>${invoice.client.name}</strong></div>
                ${invoice.client.company ? `<div>${invoice.client.company}</div>` : ''}
                ${invoice.client.address.map(line => line ? `<div>${line}</div>` : '').join('')}
                <div>${invoice.client.email}</div>
                ${invoice.client.taxNumber ? `<div>Tax Number: ${invoice.client.taxNumber}</div>` : ''}
            </div>
            <div class="invoice-info">
                <h3>Invoice Information:</h3>
                <div><strong>Invoice Date:</strong> ${formatDate(invoice.date, invoice.locale)}</div>
                <div><strong>Due Date:</strong> ${formatDate(invoice.dueDate, invoice.locale)}</div>
                <div><strong>Currency:</strong> ${invoice.currency}</div>
                <div><strong>Country:</strong> ${taxConfig.country}</div>
            </div>
        </div>

        <!-- Items Table -->
        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${invoice.items.map(item => `
                    <tr>
                        <td>${item.description}</td>
                        <td>${item.quantity}</td>
                        <td>${formatCurrency(item.unitPrice, invoice.currency, invoice.locale)}</td>
                        <td>${formatCurrency(item.totalPrice, invoice.currency, invoice.locale)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <!-- Totals -->
        <div class="totals">
            <div class="totals-table">
                <div class="totals-row">
                    <span>Subtotal:</span>
                    <span>${formatCurrency(invoice.subtotal, invoice.currency, invoice.locale)}</span>
                </div>
                ${invoice.taxes.map(tax => `
                    <div class="totals-row">
                        <span>${tax.description}:</span>
                        <span>${formatCurrency(tax.amount, invoice.currency, invoice.locale)}</span>
                    </div>
                `).join('')}
                <div class="totals-row total-final">
                    <span>Total Amount:</span>
                    <span>${formatCurrency(invoice.total, invoice.currency, invoice.locale)}</span>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer-section">
            <h4>Payment Terms:</h4>
            <p>${invoice.paymentTerms}</p>
            
            ${invoice.notes ? `
                <h4>Notes:</h4>
                <p>${invoice.notes}</p>
            ` : ''}
            
            <h4>Legal Information:</h4>
            ${taxConfig.legalRequirements.map((req: string) => `<p class="legal-text">${req}</p>`).join('')}
        </div>

        <!-- Footer Company Info -->
        <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p><strong>S K V GLOBAL BUSINESS SERVICES L.L.C</strong></p>
            <p>Office 101, Al Daghaya, Gold Souq Deira, Dubai | TRN 100044161600003</p>
            <p>Email: Info@skvchatgb.com | Phone: +971-50-123-4567</p>
            <p style="margin-top: 10px;">© 2025 SKV Global Business Services L.L.C. All rights reserved.</p>
        </div>
    </div>

    <script>
        // Auto-print functionality for PDF generation
        window.onload = function() {
            // Uncomment the line below to auto-print when the page loads
            // window.print();
        }
    </script>
</body>
</html>
  `.trim()
}