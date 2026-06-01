# Beauty Queens

Beauty Queens is a Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL e-commerce app with separate customer and admin authentication flows.

## Features

- Customer registration and login
- Separate admin login at `/admin/login`
- Product catalog with images, categories, stock, prices, and descriptions
- Cart, checkout, and customer order history
- Stripe-hosted checkout for third-party payment processing
- Admin dashboard with product CRUD, secure local image uploads, order viewing, and status updates
- Role-based route and API protection
- Dark and light mode
- Seeded demo products using the included local images

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create an environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL connection string and a long random `JWT_SECRET`.

4. Add Stripe test keys to `.env`:

```text
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

5. Create the database tables and seed demo data:

```bash
npm run prisma:migrate -- --name init
npm run prisma:seed
```

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Demo Accounts

Customer:

```text
customer@beautyqueens.test
Customer123!
```

Admin:

```text
admin@beautyqueens.test
Admin123!
```

## Image Uploads

Admin product uploads are stored locally in `public/uploads` for development. For production, swap `app/api/uploads/route.ts` to upload to S3, Cloudinary, or another cloud storage provider and save the returned URL on the product.

## Security Notes

- Passwords are hashed with bcrypt.
- Sessions use signed JWTs in HTTP-only cookies.
- Customer payments are handled by Stripe Checkout, so raw card numbers never touch this app.
- Admin pages and admin API routes require the `ADMIN` role.
- Customer checkout requires a customer account.
- Product uploads only accept JPG, PNG, or WebP files under 3MB.

## Stripe Webhooks

For local webhook testing, install the Stripe CLI and forward events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` value into `STRIPE_WEBHOOK_SECRET`. The webhook marks paid orders as `PROCESSING` and decrements inventory after Stripe confirms payment.
