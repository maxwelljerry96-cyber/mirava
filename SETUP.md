# FRUTÉO Production Setup

## 1. Create the Supabase project

Create a Supabase project and open the SQL Editor. Run the complete file:

`supabase/migrations/001_initial.sql`

The migration creates:
- customer profiles
- products, bundles, bundle components and inventory
- coupons
- orders and order items
- inventory movements
- newsletter subscribers
- contact messages
- customer-access policies
- the secure paid-order fulfilment function
- the public product image bucket
- initial products and the `FRUIT10` coupon

## 2. Copy Supabase credentials

In Supabase project settings, copy:
- Project URL
- Publishable key
- Service-role key

Add them to `.env.local` and Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code or commit it to GitHub.

## 3. Create the first admin

1. Register a normal customer account through `/auth/register`.
2. Confirm the email when email confirmation is enabled.
3. In Supabase SQL Editor, run:

```sql
update public.profiles
set role = 'admin'
where id = (
  select id from auth.users where email = 'YOUR_ADMIN_EMAIL'
);
```

That user can then open `/admin`.

## 4. Configure Paystack

Copy the Paystack secret key into:

```env
PAYSTACK_SECRET_KEY=
PAYSTACK_CURRENCY=EGP
```

The checkout uses server-side transaction initialization. Do not place the secret key in any `NEXT_PUBLIC_` variable.

After deploying, add this webhook in the Paystack dashboard:

`https://YOUR_DOMAIN/api/paystack/webhook`

The webhook signature is checked before an order is fulfilled. The verification route also checks the payment amount and currency against the stored order.

## 5. Configure Resend

Verify a sending domain in Resend and add:

```env
RESEND_API_KEY=
RESEND_FROM_EMAIL=FRUTÉO <orders@YOUR_DOMAIN>
ADMIN_NOTIFICATION_EMAIL=YOUR_SUPPORT_EMAIL
```

Paid-order confirmations go to customers. Contact-form notifications go to `ADMIN_NOTIFICATION_EMAIL`.

## 6. Configure the application URL

For local development:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production:

```env
NEXT_PUBLIC_APP_URL=https://YOUR_DOMAIN
```

This URL is used for payment callbacks, sitemap URLs and other server-generated links.

## 7. Deploy to Vercel

1. Upload the project to GitHub.
2. Import the repository into Vercel.
3. Vercel will detect Next.js automatically.
4. Add every environment variable from `.env.example`.
5. Deploy.
6. Add the final Paystack webhook URL after the first deployment.

No custom output directory is required.

## 8. Final business details

Before accepting public orders, replace the fictional contact details with the real business email, phone number, address, delivery coverage, food-label information and operating policies.
