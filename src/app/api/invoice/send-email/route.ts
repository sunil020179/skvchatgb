import { NextRequest, NextResponse } from 'next/server'
import { Invoice } from '@/types'
import { formatCurrency, formatDate } from '@/lib/invoice-utils'

export async function POST(request: NextRequest) {
  try {
    const { invoice, recipientEmail } = await request.json()
    
    if (!invoice || !recipientEmail) {
      return NextResponse.json(
        { error: 'Invoice data and recipient email are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(recipientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // In a real implementation, you would use an email service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Resend
    
    // For demo purposes, we'll simulate the email sending process
    await simulateEmailSending(invoice, recipientEmail)
    
    // Log the email sending attempt (in production, use proper logging)
    console.log(`Invoice ${invoice.invoiceNumber} sent to ${recipientEmail}`)
    
    return NextResponse.json({
      success: true,
      message: 'Invoice sent successfully',
      details: {
        invoiceNumber: invoice.invoiceNumber,
        recipient: recipientEmail,
        sentAt: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Email sending error:', error)
    return NextResponse.json(
      { error: 'Failed to send invoice email' },
      { status: 500 }
    )
  }
}

async function simulateEmailSending(invoice: Invoice, recipientEmail: string) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Generate email content
  const emailContent = generateEmailContent(invoice)
  
  // In a real implementation, you would send the email here
  // Example with Nodemailer:
  /*
  const transporter = nodemailer.createTransporter({
    service: 'gmail', // or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  
  await transporter.sendMail({
    from: invoice.company.email,
    to: recipientEmail,
    subject: `Invoice ${invoice.invoiceNumber} from ${invoice.company.name}`,
    html: emailContent
  })
  */
  
  // For demo, we'll just log what would be sent
  console.log('Email would be sent with content:', {
    to: recipientEmail,
    from: invoice.company.email,
    subject: `Invoice ${invoice.invoiceNumber} from ${invoice.company.name}`,
    contentLength: emailContent.length
  })
  
  return true
}

function generateEmailContent(invoice: Invoice): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoiceNumber}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .company-logo {
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .invoice-summary {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
        }
        .total-row {
            border-top: 2px solid #007bff;
            font-weight: bold;
            font-size: 18px;
            color: #007bff;
            margin-top: 15px;
            padding-top: 15px;
        }
        .button {
            display: inline-block;
            background: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 10px 5px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-logo">S</div>
            <h1>New Invoice from ${invoice.company.name}</h1>
        </div>
        
        <p>Dear ${invoice.client.name},</p>
        
        <p>We hope this email finds you well. Please find attached your invoice for the services provided.</p>
        
        <div class="invoice-summary">
            <h3>Invoice Summary</h3>
            <div class="summary-row">
                <span><strong>Invoice Number:</strong></span>
                <span>${invoice.invoiceNumber}</span>
            </div>
            <div class="summary-row">
                <span><strong>Invoice Date:</strong></span>
                <span>${formatDate(invoice.date, invoice.locale)}</span>
            </div>
            <div class="summary-row">
                <span><strong>Due Date:</strong></span>
                <span>${formatDate(invoice.dueDate, invoice.locale)}</span>
            </div>
            <div class="summary-row">
                <span><strong>Subtotal:</strong></span>
                <span>${formatCurrency(invoice.subtotal, invoice.currency, invoice.locale)}</span>
            </div>
            ${invoice.taxes.map(tax => `
                <div class="summary-row">
                    <span><strong>${tax.description}:</strong></span>
                    <span>${formatCurrency(tax.amount, invoice.currency, invoice.locale)}</span>
                </div>
            `).join('')}
            <div class="summary-row total-row">
                <span><strong>Total Amount:</strong></span>
                <span>${formatCurrency(invoice.total, invoice.currency, invoice.locale)}</span>
            </div>
        </div>

        <div style="text-align: center; margin: 30px 0;">
            <a href="#" class="button">View Invoice Online</a>
            <a href="#" class="button" style="background: #28a745;">Download PDF</a>
        </div>

        <div style="background: #fff3cd; border: 1px solid #ffeeba; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4 style="margin-top: 0; color: #856404;">Payment Information:</h4>
            <p style="margin-bottom: 0;">${invoice.paymentTerms}</p>
        </div>

        ${invoice.notes ? `
            <div>
                <h4>Additional Notes:</h4>
                <p>${invoice.notes}</p>
            </div>
        ` : ''}

        <p>If you have any questions about this invoice, please don't hesitate to contact us:</p>
        <ul>
            <li><strong>Email:</strong> ${invoice.company.email}</li>
            <li><strong>Phone:</strong> ${invoice.company.phone}</li>
        </ul>

        <p>Thank you for choosing ${invoice.company.name} for your business needs.</p>

        <p>Best regards,<br>
        <strong>${invoice.company.name}</strong><br>
        Business Services Team</p>

        <div class="footer">
            <p><strong>${invoice.company.name}</strong></p>
            ${invoice.company.address.map(line => `<p>${line}</p>`).join('')}
            <p>${invoice.company.email} | ${invoice.company.phone}</p>
            ${invoice.company.taxNumber ? `<p>Tax Registration Number: ${invoice.company.taxNumber}</p>` : ''}
            <p style="margin-top: 15px;">© 2025 ${invoice.company.name}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
  `.trim()
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    message: 'Invoice email service is running',
    version: '1.0.0',
    features: [
      'Professional email templates',
      'Invoice summary in email',
      'Automatic PDF attachment (when implemented)',
      'Country-specific formatting'
    ]
  })
}