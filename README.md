# Local Sentiment App

Full-stack local sentiment app with a Node.js backend, Flask ML sentiment service, GenAI reporting, trend alerts, and a React dashboard frontend.

## Project Structure

```text
local-sentiment-app/
  backend/       Node.js + Express + Prisma API
  ml-service/    Flask sentiment analysis service
  frontend/      React + Vite + Tailwind dashboard
```

## Where To Keep Your ML Model

Keep your model files here:

```text
ml-service/models/sentiment-model/
```

Put these files inside that folder:

```text
ml-service/models/sentiment-model/model.safetensors
ml-service/models/sentiment-model/config.json
ml-service/models/sentiment-model/special_tokens_map.json
ml-service/models/sentiment-model/tokenizer.json
ml-service/models/sentiment-model/tokenizer_config.json
ml-service/models/sentiment-model/training_args.bin
ml-service/models/sentiment-model/vocab.txt
```

The current ML service uses VADER, which is simple and lightweight. Your saved model files are safe to keep in the folder above, but they are not loaded by the current `app.py` yet. To use that model instead of VADER, the ML service should be upgraded to use `transformers` and load from `ml-service/models/sentiment-model`.

Large model files are ignored by Git, so they stay local on your machine.

## Requirements

- Node.js 20+
- Python 3.10+
- PostgreSQL database
- npm

## Full Project Startup Order

Start the project in this order:

1. Start the ML service on `http://localhost:8000`
2. Start the backend on `http://localhost:5000`
3. Start the frontend on `http://localhost:5173`

Keep all three terminals open while testing the full app.

## Backend Setup

Open a terminal in:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
copy .env.example .env
```

Update `.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE_NAME
JWT_SECRET=your_secret_here
ML_SERVICE_URL=http://localhost:8000
OPENAI_API_KEY=your_openai_api_key_here
LLM_MODEL=gpt-4o-mini
LLM_API_URL=https://api.openai.com/v1/chat/completions
```

Apply the Prisma schema to your database:

```bash
npx prisma db push
```

Generate Prisma client:

```bash
npx prisma generate
```

Start the backend:

```bash
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

## Frontend Setup

Open a third terminal in:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example`:

```bash
copy .env.example .env
```

Update `.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

## Frontend Pages

Dashboard:

```text
http://localhost:5173/dashboard
```

Use this page for the business view. It shows:

- Average weighted rating
- Sentiment pie chart
- Rating distribution chart
- Trend alerts
- AI-generated report
- Shop and product selection

Home:

```text
http://localhost:5173/
```

This is the public landing page for users who are not logged in. It links to login and signup.

Login:

```text
http://localhost:5173/login
```

Signup:

```text
http://localhost:5173/signup
```

Products:

```text
http://localhost:5173/products
```

Use this page to list products for a selected shop and copy the customer QR review link.

Add product:

```text
http://localhost:5173/products/add
```

Use this page to create a shop if needed and add products under a shop.

Insights:

```text
http://localhost:5173/insights
```

Use this page to view:

- Positives
- Negatives
- Suggestions

Customer QR review page:

```text
http://localhost:5173/qr/PRODUCT_ID
```

Example:

```text
http://localhost:5173/qr/3
```

This page is intentionally separate from the business dashboard. Customers can only give stars, write a comment, enter phone/email, and submit the review for that product.

## Frontend Login Notes

The Dashboard and Insights pages can load your shops using the backend JWT auth API.

Use an existing backend account to log in. The frontend calls:

```http
POST http://localhost:5000/auth/login
```

After login, the token is stored in browser `localStorage` and sent automatically with protected requests like:

```http
GET http://localhost:5000/shops
```

Business pages are protected. If you are not logged in, opening `/dashboard`, `/products`, `/products/add`, or `/insights` redirects back to the home page.

## Frontend API Integration

Frontend API calls are defined in:

```text
frontend/src/services/api.js
```

Important calls:

```js
api.signup(payload); // POST /auth/signup
api.login(payload); // POST /auth/login
api.getShops(); // GET /shops
api.createShop(payload); // POST /shops
api.createProduct(payload); // POST /products
api.getProductAnalytics(productId); // GET /products/:id/analytics
api.getProductSentiment(productId); // GET /products/:id/sentiment
api.getProductReport(productId); // GET /products/:id/report
api.getProductTrends(productId); // GET /products/:id/trends
api.getShopProducts(shopId); // GET /shop/:shopId/products
api.submitReview(payload); // POST /reviews
```

To test a production build:

```bash
cd frontend
npm run build
```

## ML Service Setup

Open a second terminal in:

```bash
cd ml-service
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the ML service:

```bash
python app.py
```

ML service runs at:

```text
http://localhost:8000
```

## Test The ML Service

Send:

```http
POST http://localhost:8000/analyze
Content-Type: application/json

{
  "reviews": ["This product is great", "Very bad quality"]
}
```

Expected response:

```json
[
  { "sentiment": "positive" },
  { "sentiment": "negative" }
]
```

## Review Flow

When a review is created:

1. Backend calculates trust score and spam status.
2. Backend sends the review comment to the ML service.
3. ML service returns `positive`, `neutral`, or `negative`.
4. Backend stores the sentiment in `Review.sentiment`.
5. If ML service is down, the review is still saved with `sentiment: null`.

## Important APIs

Create review:

```http
POST http://localhost:5000/reviews
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "comment": "Excellent product",
  "userIdentifier": "user-123"
}
```

Product sentiment analytics:

```http
GET http://localhost:5000/products/1/sentiment
```

Response:

```json
{
  "positive": 10,
  "neutral": 2,
  "negative": 1
}
```

Product GenAI report:

```http
GET http://localhost:5000/products/1/report
```

Response:

```json
{
  "productId": 1,
  "productName": "Classic Hoodie",
  "cached": false,
  "source": "llm",
  "generatedAt": "2026-05-05T11:20:00.000Z",
  "report": {
    "summary": "Customers generally like the product quality and packaging, but some mention pricing and delivery speed as concerns.",
    "positives": ["Good product quality", "Nice packaging"],
    "negatives": ["Pricing feels high", "Delivery can be slow"],
    "suggestions": [
      "Review pricing against similar products",
      "Improve delivery communication during delays"
    ]
  }
}
```

Product trends:

```http
GET http://localhost:5000/products/1/trends
```

Response:

```json
{
  "productId": 1,
  "productName": "Classic Hoodie",
  "ratingChange": -12.5,
  "negativeTrend": 20,
  "positiveTrend": -10,
  "reviewVolumeChange": 125,
  "reviewSpike": true,
  "alerts": [
    "Negative feedback is rising",
    "Review volume has spiked unusually"
  ]
}
```

Shop analytics:

```http
GET http://localhost:5000/shops/1/analytics
```

Response includes:

```json
{
  "sentimentBreakdown": {
    "positive": 30,
    "neutral": 8,
    "negative": 4
  }
}
```

Shop trends:

```http
GET http://localhost:5000/shops/1/trends
```

Response:

```json
{
  "shopId": 1,
  "shopName": "Local Store",
  "ratingChange": -18.2,
  "negativeTrend": 22.5,
  "positiveTrend": -14,
  "reviewVolumeChange": 80,
  "reviewSpike": false,
  "alerts": [
    "Customer satisfaction is decreasing",
    "Negative feedback is rising"
  ]
}
```

Shop GenAI report:

```http
GET http://localhost:5000/shops/1/report
```

Response:

```json
{
  "shopId": 1,
  "shopName": "Local Store",
  "cached": false,
  "source": "llm",
  "generatedAt": "2026-05-05T11:25:00.000Z",
  "report": {
    "summary": "The shop has mostly positive customer sentiment, with strong feedback on product quality and recurring concerns around service speed.",
    "positives": ["Strong product quality", "Helpful packaging"],
    "negatives": ["Slow service", "Price concerns"],
    "topIssues": ["Slow service", "Price concerns"],
    "suggestions": [
      "Improve service speed during peak hours",
      "Promote best-rated products more visibly"
    ],
    "topPerformingProducts": [
      {
        "id": 3,
        "name": "Classic Hoodie",
        "averageRating": 4.8,
        "reviewCount": 12
      }
    ],
    "trendInsights": {
      "ratingChange": -18.2,
      "negativeTrend": 22.5,
      "positiveTrend": -14,
      "reviewSpike": false,
      "alerts": [
        "Customer satisfaction is decreasing",
        "Negative feedback is rising"
      ]
    },
    "topReviewedProducts": [
      {
        "id": 3,
        "name": "Classic Hoodie",
        "reviewsCount": 12
      }
    ]
  }
}
```

Reports are cached in the database. A report is reused until a new review is added for that product or shop. If the LLM request fails or `OPENAI_API_KEY` is missing, the backend returns a rule-based fallback report.

## Daily Start Commands

Terminal 1:

```bash
cd ml-service
.venv\Scripts\activate
python app.py
```

Terminal 2:

```bash
cd backend
npm run dev
```

Terminal 3:

```bash
cd frontend
npm run dev
```

Open:

```text
http://localhost:5173
```
