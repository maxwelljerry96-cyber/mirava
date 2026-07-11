# FRUTÉO — Full-Stack Fruit Elixir Store

A production-structured, multi-page fruit juice and elixir store built with Next.js, Supabase, Paystack, Resend and Vercel.

## What is included

### Customer website
- Home, products, individual product pages, story, ingredients, benefits, shop and contact
- Search, product filtering and sorting
- Persistent cart stored in the browser
- Quantity controls and stock-aware cart behaviour
- Guest checkout and signed-in checkout
- Customer registration, login and logout
- Customer order history and order detail pages
- Order tracking by reference and checkout email
- Newsletter sign-up and contact form
- FAQ, shipping, returns, privacy and terms pages
- Responsive layouts and high-resolution local image assets
- Subtle reveal and interaction movement without bouncing animations

### Store operations
- Product and bundle databases with prices, ingredients, component quantities, images, active status and stock
- Server-side price, stock, coupon and shipping validation
- Paystack checkout initialization
- Paystack transaction verification
- Signed Paystack webhook handling
- Atomic order fulfilment and stock deduction, including component stock inside bundles
- Contact-message and newsletter storage
- Order-confirmation emails through Resend
- Admin dashboard for products, images, stock, orders, messages and subscribers
- Row-level security policies for customer data

## Technology
- Next.js App Router
- React and TypeScript
- Supabase Auth, Postgres and Storage
- Paystack payments
- Resend transactional email
- Vercel deployment

## Local setup

1. Install Node.js 20.9 or newer.
2. Copy `.env.example` to `.env.local`.
3. Fill in the environment values described in `SETUP.md`.
4. Run the SQL migration in Supabase:

   `supabase/migrations/001_initial.sql`

5. Install dependencies:

   `npm install`

6. Start development:

   `npm run dev`

7. Open `http://localhost:3000`.

## Production build

`npm run build`

The supplied source passes the Next.js production build.

## Important activation note

The code contains the complete integrations, but live database access, real payments and real email delivery require credentials from the owner's Supabase, Paystack and Resend accounts. Secret keys are deliberately not included in the repository.
