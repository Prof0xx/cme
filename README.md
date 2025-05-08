# Crypto Marketing Services Explorer (CME)

A dynamic React+Express web application designed for crypto marketing professionals to explore, customize, and package marketing services with seamless Telegram integration.

Crypto Marketing Explorer is an agency for crypto marketing that provides a comprehensive suite of marketing services for blockchain and cryptocurrency projects.

## Features

- **Service Exploration**: Browse services by category with pricing information
- **Strategy Board**: Build a customized marketing strategy by adding services to your board
- **Package Selection**: Choose from pre-configured packages for different budgets
- **Lead Collection**: Submit your selection with Telegram contact information
- **Custom Service Requests**: Request specific services not listed in the catalog
- **Telegram Integration**: Real-time notifications when leads are submitted

## Tech Stack

- **Frontend**: React, TailwindCSS, Shadcn UI Components
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Notifications**: Telegram Bot API
- **Deployment**: GitHub + Glitch

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Telegram Bot (for notifications)

### Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL=your_postgresql_connection_string
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Prof0xx/cme.git
   cd cme
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run database migrations:
   ```
   npm run db:push
   ```

4. Start the development server:
   ```
   npm run dev
   ```

Visit `http://localhost:5000` to view the application.
