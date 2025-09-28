import { CountryTaxConfig, CompanyInfo } from '@/types'

// SKV Global Business Services Company Information
export const SKV_COMPANY_INFO: CompanyInfo = {
  name: 'S K V GLOBAL BUSINESS SERVICES L.L.C',
  address: [
    'Office 101, Al Daghaya,',
    'Gold Souq Deira, Dubai',
    'United Arab Emirates'
  ],
  email: 'Info@skvchatgb.com',
  phone: '+971-50-123-4567',
  website: 'https://skvchatgb.com',
  taxNumber: '100044161600003',
  registrationNumber: 'CN-1234567'
}

// Country-specific tax configurations
export const TAX_CONFIGS: Record<string, CountryTaxConfig> = {
  AE: {
    country: 'United Arab Emirates',
    currency: 'AED',
    locale: 'en-AE',
    taxes: {
      vat: {
        rate: 5,
        name: 'VAT',
        description: 'Value Added Tax (5%)'
      }
    },
    paymentTerms: 'Payment due within 30 days of invoice date',
    legalRequirements: [
      'This invoice is subject to UAE VAT regulations',
      'TRN: 100044161600003',
      'All amounts are in UAE Dirhams (AED)'
    ]
  },
  
  IN: {
    country: 'India',
    currency: 'INR',
    locale: 'en-IN',
    taxes: {
      gst: {
        cgst: 9,
        sgst: 9,
        igst: 18,
        name: 'GST',
        description: 'Goods and Services Tax'
      }
    },
    paymentTerms: 'Payment due within 30 days of invoice date',
    legalRequirements: [
      'This invoice is subject to Indian GST regulations',
      'GSTIN: 07AAACH7409R1Z5',
      'All amounts are in Indian Rupees (INR)',
      'This is a computer generated invoice'
    ]
  },
  
  HU: {
    country: 'Hungary',
    currency: 'EUR',
    locale: 'hu-HU',
    taxes: {
      vat: {
        rate: 27,
        name: 'ÁFA',
        description: 'Általános Forgalmi Adó (27%)'
      }
    },
    paymentTerms: 'Fizetési határidő: 30 nap',
    legalRequirements: [
      'This invoice complies with Hungarian VAT regulations',
      'EU VAT Number: HU12345678',
      'All amounts are in Euros (EUR)',
      'Magyar számla / Hungarian Invoice'
    ]
  },
  
  GB: {
    country: 'United Kingdom',
    currency: 'GBP',
    locale: 'en-GB',
    taxes: {
      vat: {
        rate: 20,
        name: 'VAT',
        description: 'Value Added Tax (20%)'
      }
    },
    paymentTerms: 'Payment due within 30 days of invoice date',
    legalRequirements: [
      'This invoice is subject to UK VAT regulations',
      'VAT Registration Number: GB123456789',
      'All amounts are in British Pounds (GBP)',
      'Company Registration Number: 12345678'
    ]
  }
}

// Service categories with default pricing
export const SERVICE_CATEGORIES = {
  'company-formation': {
    name: 'Company Formation Services',
    services: {
      AE: [
        { name: 'Mainland Company Setup', price: 5000, taxable: true },
        { name: 'Freezone Company Setup', price: 4000, taxable: true },
        { name: 'Offshore Company Setup', price: 6000, taxable: true },
        { name: 'Business License Renewal', price: 1500, taxable: true },
        { name: 'Visa Processing', price: 2000, taxable: true }
      ],
      IN: [
        { name: 'Private Limited Company', price: 15000, taxable: true },
        { name: 'LLP Formation', price: 12000, taxable: true },
        { name: 'GST Registration', price: 5000, taxable: true },
        { name: 'MSME Registration', price: 3000, taxable: true },
        { name: 'IEC Code', price: 4000, taxable: true }
      ],
      HU: [
        { name: 'Kft. Company Formation', price: 2000, taxable: true },
        { name: 'EU VAT Registration', price: 800, taxable: true },
        { name: 'Work Permit Processing', price: 1500, taxable: true },
        { name: 'Bank Account Opening', price: 1000, taxable: true },
        { name: 'Residence Permit', price: 2500, taxable: true }
      ],
      GB: [
        { name: 'Limited Company Formation', price: 500, taxable: true },
        { name: 'VAT Registration', price: 300, taxable: true },
        { name: 'PAYE Setup', price: 400, taxable: true },
        { name: 'Bank Account Opening', price: 800, taxable: true },
        { name: 'Companies House Filing', price: 200, taxable: true }
      ]
    }
  },
  
  'compliance': {
    name: 'Compliance & Tax Services',
    services: {
      AE: [
        { name: 'VAT Return Filing', price: 800, taxable: true },
        { name: 'Corporate Tax Compliance', price: 1200, taxable: true },
        { name: 'Audit Support', price: 2000, taxable: true },
        { name: 'ESR Filing', price: 1000, taxable: true }
      ],
      IN: [
        { name: 'GST Return Filing', price: 3000, taxable: true },
        { name: 'Income Tax Filing', price: 5000, taxable: true },
        { name: 'TDS Compliance', price: 2000, taxable: true },
        { name: 'ROC Compliance', price: 4000, taxable: true }
      ],
      HU: [
        { name: 'Monthly VAT Returns', price: 300, taxable: true },
        { name: 'Corporate Tax Filing', price: 800, taxable: true },
        { name: 'Annual Reports', price: 600, taxable: true },
        { name: 'Statistical Reports', price: 400, taxable: true }
      ],
      GB: [
        { name: 'VAT Returns', price: 200, taxable: true },
        { name: 'Corporation Tax', price: 400, taxable: true },
        { name: 'Annual Confirmation', price: 150, taxable: true },
        { name: 'PAYE Processing', price: 300, taxable: true }
      ]
    }
  },
  
  'consultation': {
    name: 'Business Consultation',
    services: {
      AE: [
        { name: 'Business Setup Consultation', price: 500, taxable: true },
        { name: 'Tax Advisory', price: 800, taxable: true },
        { name: 'Legal Consultation', price: 1000, taxable: true }
      ],
      IN: [
        { name: 'Business Setup Consultation', price: 2000, taxable: true },
        { name: 'Tax Advisory', price: 3000, taxable: true },
        { name: 'Legal Consultation', price: 4000, taxable: true }
      ],
      HU: [
        { name: 'Business Setup Consultation', price: 200, taxable: true },
        { name: 'Tax Advisory', price: 300, taxable: true },
        { name: 'Legal Consultation', price: 400, taxable: true }
      ],
      GB: [
        { name: 'Business Setup Consultation', price: 150, taxable: true },
        { name: 'Tax Advisory', price: 250, taxable: true },
        { name: 'Legal Consultation', price: 300, taxable: true }
      ]
    }
  }
}

export function getTaxConfig(countryCode: string): CountryTaxConfig {
  return TAX_CONFIGS[countryCode] || TAX_CONFIGS.AE
}

export function getServicesByCountry(countryCode: string) {
  const services = []
  for (const category of Object.values(SERVICE_CATEGORIES)) {
    if (category.services[countryCode as keyof typeof category.services]) {
      services.push({
        category: category.name,
        items: category.services[countryCode as keyof typeof category.services]
      })
    }
  }
  return services
}