# Frontend

React frontend for the Local Sentiment backend.

## Setup

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

The app runs at:

```text
http://localhost:5173
```

## Environment

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Pages

- `/` - Public home page for users who are not logged in
- `/login` - Business login
- `/signup` - Business signup
- `/dashboard` - Business dashboard with rating, sentiment chart, trend alerts, and AI report
- `/products` - Product list for selected shop, with QR review link copy button
- `/products/add` - Create shop and add product
- `/insights` - Positives, negatives, and suggestions from the AI report
- `/qr/:productId` - Customer-only QR review page for one product
- `/review/product/:productId` - Alias for customer-only product review page

Business pages are protected. If no token exists in `localStorage`, they redirect to `/`.

The QR review page is separate from the business app. It only allows the customer to give stars, write a comment, enter phone/email, and submit.

## API Integration

The API calls live in:

```text
src/services/api.js
```

Main endpoints used:

```js
api.getProductAnalytics(productId); // GET /products/:id/analytics
api.getProductSentiment(productId); // GET /products/:id/sentiment
api.getProductReport(productId); // GET /products/:id/report
api.getProductTrends(productId); // GET /products/:id/trends
api.getShopProducts(shopId); // GET /shop/:shopId/products
api.createShop(payload); // POST /shops
api.createProduct(payload); // POST /products
api.submitReview(payload); // POST /reviews
```

Business pages use JWT. Login stores the token in `localStorage`.
