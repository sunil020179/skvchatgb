import { Country } from '@/types'

export const COUNTRIES: Record<string, Country> = {
  AE: {
    code: 'AE',
    name: 'United Arab Emirates',
    language: 'en',
    contact: {
      phone: '+971-50-123-4567',
      email: 'support-ae@skvchatgb.com',
      whatsapp: '971501234567'
    },
    system: 'You are an expert business consultant for SKV Business Services in the UAE. Focus on VAT (5%), Freezone and Mainland company setup, corporate tax regulations, visa processing and PRO services. Provide accurate, up-to-date information about UAE business regulations, licensing requirements, and compliance procedures. Be professional, helpful, and specific in your responses.',
    model: 'gpt-4o-mini'
  },
  IN: {
    code: 'IN',
    name: 'India',
    language: 'hi',
    contact: {
      phone: '+91-98-7654-3210',
      email: 'support-in@skvchatgb.com',
      whatsapp: '919876543210'
    },
    system: 'You are an expert business consultant for SKV Business Services in India. Focus on GST regulations, MCA company incorporation, MSME and UDYAM registration, Import Export Code (IEC), FSSAI licensing, and compliance requirements. Provide detailed guidance on Indian business laws, registration processes, and regulatory compliance. Be knowledgeable about state-specific requirements and recent policy changes.',
    model: 'gpt-4o-mini'
  },
  HU: {
    code: 'HU',
    name: 'Hungary',
    language: 'en',
    contact: {
      phone: '+36-20-123-4567',
      email: 'support-hu@skvchatgb.com',
      whatsapp: '36201234567'
    },
    system: 'You are an expert business consultant for SKV Business Services in Hungary. Focus on Kft. (limited liability company) setup, EU VAT regulations, corporate tax requirements, work permits and residency procedures, and business banking in Hungary. Provide comprehensive information about Hungarian business environment, EU regulations, and local compliance requirements.',
    model: 'gpt-4o-mini'
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom (London)',
    language: 'en',
    contact: {
      phone: '+44-7444-123456',
      email: 'support-uk@skvchatgb.com',
      whatsapp: '447444123456'
    },
    system: 'You are an expert business consultant for SKV Business Services in the UK (London). Focus on Limited Company (LTD) registration, Companies House filings, HMRC compliance, VAT registration, PAYE systems, and post-Brexit business regulations. Provide detailed guidance on UK business formation, tax obligations, and regulatory requirements.',
    model: 'gpt-4o-mini'
  }
}

export const DEFAULT_COUNTRY = 'AE'

export function getCountryByCode(code: string): Country {
  return COUNTRIES[code] || COUNTRIES[DEFAULT_COUNTRY]
}

export function getCountryFromSubdomain(hostname: string): string {
  const subdomain = hostname.split('.')[0]?.toUpperCase()
  return COUNTRIES[subdomain] ? subdomain : DEFAULT_COUNTRY
}

export function getAllCountries(): Country[] {
  return Object.values(COUNTRIES)
}