# Sanskriti Market

**Handcrafted in India. Treasured Worldwide.**

A complete production-ready full-stack marketplace for authentic Indian handcrafted products. Connects master artisans with discerning collectors worldwide.

## Features

- **Product Marketplace** — Browse curated handcrafted products across 8+ categories
- **Creator Stores** — Individual artisan storefronts with stories and portfolios
- **JWT Authentication** — Secure login for customers, sellers, and admins
- **Seller Dashboard** — Manage products, orders, and store settings
- **Admin Dashboard** — Platform management, user control, featured products
- **AI Chatbot** — Gemini-powered shopping assistant
- **AI Recommendations** — Personalized product suggestions
- **Product Stories** — Rich narratives about artisans and craft heritage
- **Search** — Full-text search across products and stores
- **Cart & Wishlist** — Complete shopping experience
- **SEO Optimized** — Sitemap, robots.txt, meta tags, Lighthouse-ready
- **Responsive Design** — Mobile-first, premium luxury UI

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript, Bootstrap 5 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Auth | JWT |
| AI | Google Gemini API |
| Hosting | Vercel (frontend), Render (backend) |

## Project Structure

```
├── frontend/          # HTML, CSS, JavaScript pages
├── backend/           # Express server entry point
├── controllers/       # Route controllers
├── models/            # Mongoose schemas
├── routes/            # API routes
├── middleware/        # Auth, validation, error handling
├── services/          # Gemini AI, recommendations, email
├── config/            # Database, JWT, Gemini config
├── utils/             # Helpers, API responses, SEO
├── database/          # Seed data, indexes
├── assets/            # Static images and media
├── public/            # robots.txt, sitemap.xml
├── package.json
├── vercel.json
├── render.yaml
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key (optional, for AI features)

### Installation

```bash
# Clone or extract the project
cd sanskriti-market

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, and Gemini API key

# Seed the database
npm run seed

# Start development server
npm run dev
```

Visit `http://localhost:5000`

### Demo Accounts (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sanskritimarket.com | Admin@123456 |
| Customer | customer@demo.com | Customer@123 |
| Seller | priya@craftstudio.in | Seller@123 |

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get profile
- `PUT /api/auth/profile` — Update profile

### Products
- `GET /api/products` — List products (filters: category, price, sort)
- `GET /api/products/slug/:slug` — Get product by slug
- `POST /api/products` — Create product (seller)
- `GET /api/products/story/:productId` — Get product story

### Cart & Wishlist
- `GET /api/cart` — Get cart
- `POST /api/cart/add` — Add to cart
- `GET /api/wishlist` — Get wishlist
- `POST /api/wishlist/add` — Add to wishlist

### Orders
- `POST /api/orders` — Place order
- `GET /api/orders` — List orders

### AI
- `POST /api/ai/chat` — Chatbot
- `GET /api/ai/recommendations` — Personalized recommendations
- `GET /api/ai/trending` — Trending products

### Search
- `GET /api/search?q=query` — Search products and stores
- `GET /api/search/categories` — List categories

## Deployment

### Vercel (Frontend + API)

```bash
npm i -g vercel
vercel
```

Set environment variables in Vercel dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `GEMINI_API_KEY`
- `CLIENT_URL`

### Render (Backend API)

1. Connect your GitHub repository to Render
2. Render will use `render.yaml` for configuration
3. Set environment variables in Render dashboard
4. Deploy

### MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user
3. Whitelist IP addresses (0.0.0.0/0 for development)
4. Copy connection string to `MONGODB_URI`

## Environment Variables

See `.env.example` for all required variables.

## License

MIT License — Sanskriti Market © 2026
