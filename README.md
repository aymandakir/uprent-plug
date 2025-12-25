# Uprent Plus 🚀

> **An Enhanced Extension for Uprent** — A side project exploring advanced features for the Dutch rental market, built to understand the process and deliver real value.

[![Deploy](https://vercel.com/button)](https://vercel.com/new)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 Overview

**Uprent Plus** is a feature-rich extension built on top of the Uprent platform, designed to fill gaps and explore innovative solutions for the competitive Dutch rental market. This project serves as both a learning experiment and a showcase of potential enhancements that could benefit renters across the Netherlands.

### What Makes This Different?

While Uprent.nl provides excellent core rental search functionality, Uprent Plus adds:

- ⚡ **15-second real-time alerts** from 1,500+ sources
- 🤖 **AI-powered application letters** in 29 languages
- 📱 **Multi-channel notifications** (Email, Push, SMS)
- 🎯 **Advanced matching algorithms** with score-based recommendations
- 📊 **Comprehensive dashboard** with activity tracking
- 🌍 **Multi-language support** (24 languages)
- 📝 **Contract analysis** (AI-powered lease review)
- 🗺️ **Neighborhood insights** and property analytics

## 🎯 Project Goals

This project is built as a **side project for exploration and learning**, with the aim to:

1. **Understand the rental market** — Deep dive into user pain points and competitor offerings
2. **Test innovative features** — Experiment with AI, real-time data, and advanced UX patterns
3. **Deliver real value** — Create features that genuinely improve the rental search experience
4. **Build a portfolio piece** — Showcase full-stack development, design, and product thinking

## ✨ Current Features

### Core Functionality
- ✅ Real-time property monitoring from multiple sources (Funda, Pararius, etc.)
- ✅ AI-powered property matching with customizable search profiles
- ✅ Intelligent notifications (email, push, SMS for Premium users)
- ✅ Multi-language support (24 languages including Dutch, English, German, Arabic, and more)
- ✅ Advanced search filters (location, price, features, utilities, availability)
- ✅ Property detail pages with comprehensive information
- ✅ Saved properties with folder organization

### AI Features
- ✅ **Application Letter Generator** — Personalized letters in 29 languages using GPT-4
- ✅ **Contract Analyzer** — AI-powered lease review with risk assessment (Premium)
- ✅ **Property Recommendations** — Machine learning-based suggestions
- ✅ **Match Scoring** — Intelligent algorithm to rank property relevance

### Dashboard & User Experience
- ✅ Modern, dark-themed dashboard inspired by ElevenLabs design
- ✅ Activity feed with real-time updates
- ✅ Statistics tracking (searches, matches, applications, saved properties)
- ✅ Quick actions panel
- ✅ Responsive design (mobile-first)

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL + PostGIS)
- **Database**: Supabase with Row Level Security (RLS)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 (letter generation, contract analysis)
- **Notifications**: Multi-channel (Email via Resend, Push via Expo, SMS via Twilio)
- **Deployment**: Vercel (web), Railway (scraper)
- **Scraping**: Puppeteer, BullMQ, Redis
- **State Management**: React Server Components + SWR for client data
- **Animations**: Framer Motion
- **Smooth Scroll**: Lenis

## 📱 Roadmap & Future Plans

### Mobile Apps (Q2 2024)
- 📱 **iOS App** — Native Swift/SwiftUI app with push notifications
- 📱 **Android App** — Native Kotlin/Jetpack Compose app
- 🔔 **Cross-platform notifications** via Expo Push Notifications
- 📍 **Location-based alerts** using device GPS
- 💬 **In-app messaging** with landlords

### Enhanced Features
- 🔍 **Map view** — Interactive map with property clustering
- 📸 **Virtual tours** integration
- 💰 **Price drop alerts** — Track favorite properties
- 🏘️ **Neighborhood analytics** — Schools, crime rates, transport scores
- 📊 **Market insights** — Price trends, availability statistics
- 🤝 **Roommate matching** — Find compatible roommates
- 📅 **Viewing scheduler** — Book property viewings in-app
- 💼 **Landlord tools** — For property owners (future expansion)

### Competitive Features
Building features that address gaps in current market offerings:

- **vs. Uprent.nl**: Advanced dashboard, AI letters, contract analysis, multi-language support
- **vs. Funda**: Faster alerts, better filtering, AI recommendations
- **vs. Pararius**: Real-time monitoring, personalized matching, mobile apps
- **vs. Kamernet**: Professional application tools, neighborhood insights
- **vs. Facebook Groups**: Organized search, quality filtering, verified listings

### Technical Improvements
- ⚡ **Performance**: Caching strategies, virtual scrolling, image optimization
- 🔒 **Security**: Enhanced authentication, data encryption
- 📈 **Analytics**: User behavior tracking, conversion optimization
- 🧪 **Testing**: E2E tests with Playwright, unit tests with Vitest
- 🌐 **Internationalization**: Full i18n support for all features

## 🏗️ Project Structure

```
uprent-plus/
├── apps/
│   ├── web/              # Next.js 15 web application
│   ├── mobile/           # React Native app (Expo) — Coming soon
│   └── scraper/          # Property scraping service (Railway)
├── packages/
│   ├── database/         # Supabase migrations & types
│   ├── notifications/    # Multi-channel notification service
│   ├── ai/               # AI services (OpenAI integrations)
│   └── ui/               # Shared UI components
└── docs/                 # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- Supabase account (for database and auth)
- OpenAI API key (for AI features)
- Vercel account (for deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/uprent-plus.git
cd uprent-plus

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase, OpenAI, and other API keys

# Run migrations
# Execute SQL files in packages/database/supabase/migrations/

# Start development server
pnpm dev
```

### Environment Variables

See `ENV_VARIABLES.md` for a complete list of required environment variables.

## 📝 License

MIT License — feel free to use this project for learning and inspiration.

## 🙏 Acknowledgments

- **Uprent.nl** — For the excellent base platform that inspired this extension
- **OpenAI** — For GPT-4 powering AI features
- **Supabase** — For the amazing backend infrastructure
- **Vercel** — For seamless deployment

## 💡 Disclaimer

This is a **demonstration project** built for learning and exploration. It is not officially affiliated with Uprent B.V. or any other rental platform. Built to showcase potential enhancements and understand the rental market better.

---

**Built with ❤️ as a side project to explore, learn, and deliver value to the Dutch rental market.**
