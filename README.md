# Crypto Marketing Services Explorer (CME)

## Overview
CME is a modern web application for crypto project owners and marketing teams to explore, select, and express interest in various marketing services. Built with React, Express, and PostgreSQL, it provides a streamlined experience for discovering and planning marketing strategies.

## Complete User Flow

### 1. Service Discovery & Selection
- User lands on homepage showing 6 main service categories
- Each category displays:
  - Icon
  - Name
  - Description
  - Starting price
- Clicking category reveals detailed service list
- Services show:
  - Name
  - Price
  - "Add to Board" button
- Backend routes:
  - GET `/api/services` - All services
  - GET `/api/services/:category` - Category-specific services

### 2. Strategy Board Management
- Users build marketing plan by adding services
- Real-time calculations for:
  - Subtotal
  - Package discount (15% if package selected)
  - Final total
- Context API (StrategyBoardContext) manages:
  - Selected services state
  - Package selection
  - Price calculations
- Mobile-responsive board shows:
  - Selected services list
  - Remove service option
  - Total cost
  - Express Interest button

### 3. Package Options
Two pre-configured service bundles with 15% discount:

#### Budget Package (~$2,025)
- CoinGecko Listing
- GeckoTerminal Pool Trends
- DEXScreener Boost
- Reddit Campaign
- Bitcointalk Post
- Basic engagement boosting

#### Baller Package (~$20,060+)
- Premium listings (CMC + CoinGecko)
- Top-tier trending placements
- Comprehensive PR package
- Advanced visibility boosting
- Premium engagement services

### 4. Interest Expression Flow
1. User clicks "Express Interest"
2. Form collects:
   - Telegram handle (required, @-prefixed)
   - Optional message
   - Optional referral code
3. Form validation:
   - Zod schema validation
   - Telegram handle format check
   - Referral code verification
4. Backend processing:
   - POST `/api/leads` or `/api/leads-with-referral`
   - Lead stored in PostgreSQL
   - Services serialized to JSON
   - Telegram notification sent

### 5. Referral System
- Input referral code during interest submission
- System validates code via `/api/referral-code/:code`
- If valid:
  - Applies configured discount
  - Tracks referral for commission
  - Notifies referrer via Telegram
- Commission tracking stored in database

### 6. Custom Service Requests
1. User opens request form
2. Provides:
   - Telegram handle
   - Service description
   - Optional referral code
3. Backend:
   - POST `/api/service-requests`
   - Stores request
   - Sends priority notification
   - Tracks referral if applicable

## Technical Implementation

### Frontend Architecture
- React + TypeScript
- TailwindCSS + Shadcn UI
- TanStack Query for data fetching
- Context API for state management
- Mobile-first responsive design

### Backend Architecture
- Express.js server
- PostgreSQL with Drizzle ORM
- RESTful API endpoints
- Telegram Bot integration
- Referral system logic

### Database Schema
```sql
- Users: Admin accounts
- Services: Available services
- Leads: Interest submissions
- ReferralCodes: Active codes
- ReferralTracking: Commission tracking
```

### API Routes
```typescript
GET /api/services - List all services
GET /api/services/:category - Category services
POST /api/leads - Submit interest
POST /api/service-requests - Custom requests
GET /api/referral-code/:code - Validate referral
POST /api/leads-with-referral - Submit with referral
```

### Security & Performance
- Rate limiting on API endpoints
- Data validation with Zod
- Secure admin authentication
- Optimized database queries
- XSS protection

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Telegram Bot token

### Environment Variables
```env
DATABASE_URL=your_postgresql_url
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_CHAT_ID=your_chat_id
```

### Installation
```bash
npm install
npm run db:push
npm run dev
```

Server runs on port 5000, client on port 3000 in development.

## Production Deployment
The application is configured for deployment on Replit with automatic HTTPS and domain configuration.

## Managing Referral Codes

### Development Environment
To add referral codes during development:

1. Edit the codes in `scripts/add-referral-codes.ts`
2. Run:
```bash
npm run add-referral-codes
```

### Production Environment
To add referral codes in production, use the admin API endpoints:

```typescript
// Add a new referral code
POST /api/admin/referral-codes
{
  "code": "NEWCODE",
  "creatorTelegram": "@creator",
  "discountPercent": 5,      // Optional (default: 5)
  "commissionPercent": 10,   // Optional (default: 10)
  "isActive": true          // Optional (default: true)
}

// Get all referral codes
GET /api/admin/referral-codes

// Update a referral code
PUT /api/admin/referral-codes/:id
{
  "discountPercent": 10,
  "commissionPercent": 15,
  "isActive": true
}

// Delete a referral code
DELETE /api/admin/referral-codes/:id

// Get leads by referral code
GET /api/admin/referral-leads/:code
```

### Referral Code Rules
- Code format: 3-20 characters, alphanumeric with `-` and `_`
- Telegram handle must start with `@`
- Discount: 0-50%
- Commission: 0-50%

## Environment Variables
Required environment variables:
```bash
# Database
DATABASE_URL=postgres://username:password@host:port/database

# Session
SESSION_SECRET=your-session-secret

# Telegram (for notifications)
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
```

## Development
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Database Management
```bash
# Push schema changes
npm run db:push

# Seed services
npm run db:seed
```

## API Routes

### Public Routes
- `GET /api/services` - Get all services
- `GET /api/services/:category` - Get services by category
- `GET /api/referral-code/:code` - Validate referral code
- `POST /api/leads` - Submit a lead
- `POST /api/service-requests` - Submit a service request

### Admin Routes (Requires Authentication)
- `POST /api/admin/referral-codes` - Create referral code
- `GET /api/admin/referral-codes` - List all referral codes
- `PUT /api/admin/referral-codes/:id` - Update referral code
- `DELETE /api/admin/referral-codes/:id` - Delete referral code
- `GET /api/admin/referral-leads/:code` - Get leads by referral code

## Deployment
The application is configured for deployment on Vercel:
1. Connect your GitHub repository to Vercel
2. Set up the required environment variables in Vercel dashboard
3. Deploy using Vercel's automatic deployment

## Security Notes
- Admin routes require authentication
- Referral codes are validated server-side
- All user inputs are sanitized and validated
- API rate limiting is implemented
- Session management uses secure cookies

