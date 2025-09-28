# SKVChatGB - Powerful AI Business Consultant

A modern, country-aware AI chatbot platform built with Next.js 14, TypeScript, and Tailwind CSS. Provides expert business consultation across UAE, India, Hungary, and UK markets.

## 🚀 Features

### Core Capabilities
- **Country-Aware Intelligence**: Specialized business advice for UAE, India, Hungary, and UK
- **Real-time Chat Interface**: Modern, responsive chat UI with typing indicators
- **Multi-Country Support**: Dynamic content based on subdomain or user selection
- **Modern UI/UX**: Beautiful dark theme with glassmorphism effects
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Technical Features
- **Next.js 14**: App Router, Server Components, API Routes
- **TypeScript**: Full type safety and IntelliSense support
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Theme Support**: Dark/light mode with system preference detection
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds

### Business Intelligence
- **Expert Knowledge Base**: Business formation, tax compliance, regulations
- **Country-Specific Guidance**: Localized business advice and requirements
- **Multi-Channel Support**: Web interface with WhatsApp integration
- **Professional Consultation**: Expert-level responses for business queries

## 🛠 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **API**: RESTful API routes with Next.js
- **Theme**: next-themes for dark/light mode
- **Icons**: Custom SVG icons and components
- **Deployment**: Optimized for Vercel deployment

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sunil020179/skvchatgb.git
   cd skvchatgb
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   OPENAI_API_KEY=your_openai_api_key
   OPENAI_MODEL=gpt-4o-mini
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Build for production**
   ```bash
   pnpm build
   pnpm start
   ```

## 🌍 Country Configuration

The platform supports four countries with specialized business knowledge:

### United Arab Emirates (AE)
- **Specialization**: VAT (5%), Freezone/Mainland setup, corporate tax, visas/PRO
- **Contact**: +971-50-123-4567, support-ae@skvchatgb.com
- **WhatsApp**: +971501234567

### India (IN)
- **Specialization**: GST, MCA incorporation, MSME/UDYAM, IEC, FSSAI, compliance
- **Contact**: +91-98-7654-3210, support-in@skvchatgb.com
- **WhatsApp**: +919876543210

### Hungary (HU)
- **Specialization**: Kft. setup, EU VAT, corporate tax, permits/residency, banking
- **Contact**: +36-20-123-4567, support-hu@skvchatgb.com
- **WhatsApp**: +36201234567

### United Kingdom (GB)
- **Specialization**: LTD setup, Companies House, HMRC, VAT, PAYE
- **Contact**: +44-7444-123456, support-uk@skvchatgb.com
- **WhatsApp**: +447444123456

## 🔧 API Endpoints

### Chat API
- **Endpoint**: `POST /api/chat-country`
- **Purpose**: Process chat messages with country-specific AI responses
- **Parameters**:
  ```json
  {
    "user": "Your message here",
    "country": "AE" // Country code (AE, IN, HU, GB)
  }
  ```
- **Response**:
  ```json
  {
    "message": "AI response text",
    "country": "AE",
    "timestamp": "2025-01-11T10:30:00Z"
  }
  ```

### Health Check
- **Endpoint**: `GET /api/chat-country`
- **Purpose**: API status and version information

## 📱 Usage Examples

### Basic Chat Integration
```typescript
const response = await fetch('/api/chat-country', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user: 'How do I set up a company in UAE?',
    country: 'AE'
  })
})

const data = await response.json()
console.log(data.message)
```

### Country Detection
```typescript
import { getCountryFromSubdomain } from '@/lib/countries'

// Auto-detect from subdomain (ae.skvchatgb.com → AE)
const country = getCountryFromSubdomain(window.location.hostname)
```

## 🎨 Design System

### Color Palette
- **Primary**: `hsl(199, 89%, 48%)` - Bright blue for CTAs and highlights
- **Background**: `hsl(210, 40%, 7%)` - Dark navy for main background
- **Card**: `hsl(210, 40%, 9%)` - Slightly lighter for cards and surfaces
- **Muted**: `hsl(215, 20%, 65%)` - Gray for secondary text

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights with tight letter spacing
- **Body**: Regular weight with optimized line height

### Components
- **Glass Effect**: Backdrop blur with semi-transparent backgrounds
- **Feature Cards**: Hover effects with subtle shadows and borders
- **Chat Bubbles**: Rounded corners with user/assistant styling
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
pnpm build
pnpm start
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3000
CMD ["pnpm", "start"]
```

## 🧪 Testing

### API Testing with cURL
```bash
# Test chat functionality
curl -X POST http://localhost:3000/api/chat-country \
  -H "Content-Type: application/json" \
  -d '{"user": "How to start a business in UAE?", "country": "AE"}' \
  | jq '.'

# Test health endpoint
curl http://localhost:3000/api/chat-country | jq '.'
```

## 📄 License

MIT License - see LICENSE file for details.

## 👥 Support

- **Email**: support@skvchatgb.com
- **Website**: https://skvchatgb.com
- **Documentation**: https://docs.skvchatgb.com

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**SKV Business Service LLC** - Building the future of AI-powered business consultation.