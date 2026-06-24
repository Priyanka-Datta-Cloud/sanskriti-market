# 🪔 Sanskriti Market v2.0
### Handcrafted in India. Treasured Worldwide.

A production-ready Indian handcraft marketplace — your direct competitor to Etsy for authentic Indian crafts.

---

## 🚀 What's New in v2.0

| Feature | Status |
|---|---|
| Razorpay Payment Integration | ✅ Complete |
| Cloudinary Image Uploads | ✅ Complete |
| Nodemailer Email System | ✅ Complete |
| Product Reviews & Star Ratings | ✅ Complete |
| Forgot/Reset Password | ✅ Complete |
| Interactive India Craft Map | ✅ Complete |
| Heritage Knowledge Hub | ✅ Complete |
| Order Success Page with Confetti | ✅ Complete |
| Dynamic Sitemap + SEO | ✅ Complete |

---

## 📋 STEP-BY-STEP SETUP (Free, Zero Cost)

### STEP 1 — MongoDB Atlas (Free Database)
1. Go to https://cloud.mongodb.com
2. Click "Try Free" → Create account
3. Create a free **M0** cluster (select any region)
4. Click "Connect" → "Connect your application"
5. Copy the connection string — looks like:
   `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
6. Add `/sanskriti_market` at the end
7. Paste into your `.env` as `MONGODB_URI`

### STEP 2 — Cloudinary (Free Image Hosting)
1. Go to https://cloudinary.com → Sign up free
2. Go to Dashboard → copy:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
3. Paste into `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```

### STEP 3 — Razorpay (Free Payment Gateway)
1. Go to https://razorpay.com → Sign up free
2. Complete KYC (required for live mode, not for testing)
3. Go to Settings → API Keys → Generate Key
4. Copy **Key ID** and **Key Secret**
5. Paste into `.env`:
   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret
   ```
6. **TEST mode** works without KYC — use `rzp_test_` prefix keys

### STEP 4 — Gmail Email Setup (Free)
1. Use any Gmail account
2. Go to Google Account → Security → **2-Step Verification** (enable it)
3. Go to Security → **App Passwords**
4. Generate password for "Mail" → "Other device" → name it "Sanskriti Market"
5. Copy the 16-character app password
6. Paste into `.env`:
   ```
   EMAIL_USER=your.gmail@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   EMAIL_FROM=Sanskriti Market <your.gmail@gmail.com>
   ```

### STEP 5 — Gemini AI (Free)
1. Go to https://aistudio.google.com
2. Click "Get API Key" → Create API Key
3. Paste into `.env` as `GEMINI_API_KEY`

### STEP 6 — Create Your .env File
Copy `.env.example` to `.env` and fill all values:
```bash
cp .env.example .env
# Now edit .env with your actual values
```

### STEP 7 — Install & Run Locally
```bash
npm install
npm run seed    # Creates demo data, admin account
npm run dev     # Starts development server
```
Open http://localhost:5000

**Default admin login:**
- Email: `admin@sanskritimarket.com`
- Password: `Admin@123456`

---

## 🌐 DEPLOY TO RENDER (Free, Live URL)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Sanskriti Market v2.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sanskriti-market.git
git push -u origin main
```

### Step 2 — Deploy on Render
1. Go to https://render.com → Sign up with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo
4. Settings:
   - **Name**: sanskriti-market
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click **"Environment"** tab → Add all your `.env` variables
6. Also add: `CLIENT_URL = https://your-app.onrender.com`
7. Click **"Create Web Service"**
8. Wait 2-3 minutes → your site is LIVE!

### Step 3 — Seed Production Database
In Render dashboard → your service → **Shell** tab:
```bash
npm run seed
```

---

## 🔍 GET ON GOOGLE (SEO Steps)

### Step 1 — Google Search Console
1. Go to https://search.google.com/search-console
2. Add property → URL prefix → enter your Render URL
3. Verify with HTML tag method (add meta tag to index.html `<head>`)
4. Submit sitemap: `https://your-app.onrender.com/sitemap.xml`

### Step 2 — Google Business Profile
1. Go to https://business.google.com
2. Create free listing → add your website URL
3. Takes 3-5 days to appear in search

### Step 3 — Bing Webmaster Tools
1. Go to https://www.bing.com/webmasters
2. Add your site → submit sitemap
3. Free traffic from Bing & DuckDuckGo

---

## 📁 Project Structure

```
sanskriti-market/
├── backend/
│   └── server.js              # Main Express server
├── config/
│   ├── db.js                  # MongoDB connection
│   ├── jwt.js                 # JWT configuration
│   └── cloudinary.js          # Cloudinary + Multer setup ⭐ NEW
├── controllers/
│   ├── authController.js      # Login, register, forgot password ⭐ UPDATED
│   ├── paymentController.js   # Razorpay integration ⭐ NEW
│   ├── reviewController.js    # Product reviews ⭐ NEW
│   └── uploadController.js    # Image upload ⭐ NEW
├── middleware/
│   ├── auth.js                # JWT protect, authorize
│   ├── errorHandler.js        # Global error handler
│   └── validate.js            # express-validator helper
├── models/
│   ├── User.js                # + password reset fields ⭐ UPDATED
│   ├── Product.js             # + region, craftType, giTagged ⭐ UPDATED
│   ├── Order.js               # + Razorpay fields ⭐ UPDATED
│   └── Review.js              # Reviews model
├── routes/
│   ├── authRoutes.js          # + forgot/reset password ⭐ UPDATED
│   ├── paymentRoutes.js       # Razorpay routes ⭐ NEW
│   ├── reviewRoutes.js        # Review CRUD ⭐ NEW
│   └── uploadRoutes.js        # Image upload routes ⭐ NEW
├── services/
│   └── emailService.js        # Nodemailer email ⭐ UPDATED
├── frontend/
│   ├── checkout.html          # Checkout + Razorpay UI ⭐ NEW
│   ├── order-success.html     # Order confirmation ⭐ NEW
│   ├── reset-password.html    # Forgot/reset password ⭐ NEW
│   ├── india-craft-map.html   # Interactive India map ⭐ NEW
│   ├── heritage.html          # Heritage knowledge hub ⭐ NEW
│   └── js/
│       ├── api.js             # API client
│       ├── auth.js            # Auth helpers
│       └── reviews.js         # Reviews widget ⭐ NEW
├── utils/
│   ├── apiResponse.js         # Standardised API responses
│   ├── helpers.js             # Pagination, sanitization
│   └── seo.js                 # Sitemap generator
├── public/
│   └── robots.txt             # SEO robots file
├── .env.example               # Environment template ⭐ UPDATED
├── .gitignore
├── package.json               # All dependencies ⭐ UPDATED
├── render.yaml                # Render deployment config
└── README.md                  # This file
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user/seller |
| POST | /api/auth/login | Login |
| POST | /api/auth/logout | Logout |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/profile | Update profile + avatar |
| POST | /api/auth/forgot-password | Send reset email |
| POST | /api/auth/reset-password/:token | Reset password |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products | List with filters |
| GET | /api/products/:id | Single product |
| POST | /api/products | Create (seller) |
| PUT | /api/products/:id | Update (seller) |

### Reviews ⭐ NEW
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/products/:id/reviews | Get reviews + stats |
| POST | /api/products/:id/reviews | Submit review |
| PUT | /api/products/:id/reviews/:rid | Edit own review |
| DELETE | /api/products/:id/reviews/:rid | Delete review |
| POST | /api/products/:id/reviews/:rid/helpful | Mark helpful |

### Payments ⭐ NEW
| Method | Endpoint | Description |
|---|---|---|
| GET | /api/payment/config | Get Razorpay key |
| POST | /api/payment/create-order | Create Razorpay order |
| POST | /api/payment/verify | Verify payment |
| POST | /api/payment/webhook | Razorpay webhook |

### Uploads ⭐ NEW
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/upload/products | Upload product images (Cloudinary) |
| DELETE | /api/upload/image | Delete image from Cloudinary |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | /api/orders | Create order |
| GET | /api/orders | My orders |
| GET | /api/orders/:id | Single order |

---

## 💳 Test Payments (Razorpay Test Mode)

Use these test card details on checkout:
- **Card**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **OTP**: 1234 (when prompted)

For UPI test: use `success@razorpay`

---

## 🛡️ Security Features

- JWT authentication with HttpOnly cookies
- bcrypt password hashing (12 rounds)
- Rate limiting (200 req/15min)
- Helmet security headers
- Input validation with express-validator
- XSS protection via sanitization
- Razorpay payment signature verification
- Password reset token (SHA-256 hashed, 1hr expiry)

---

## 📈 Your Advantage Over Etsy

| Feature | Etsy | Sanskriti Market |
|---|---|---|
| India-specific craft regions | ❌ | ✅ India Craft Map |
| GI Tag certification badges | ❌ | ✅ Built-in |
| Heritage knowledge pages | ❌ | ✅ 8 craft deep-dives |
| Craft story with every product | ❌ | ✅ Built-in |
| Regional artisan discovery | ❌ | ✅ By state/region |
| AI Heritage Guide (Gemini) | ❌ | ✅ Built-in |
| INR pricing | ❌ | ✅ Native support |
| Indian payment methods | ❌ | ✅ Razorpay (UPI, etc.) |

---

## 📞 Support

Need help? Add an issue on GitHub or email the admin.

**Built with ❤️ for India's artisans**
