# MIRAVA — Motion-led product website

A complete static website concept for **MIRAVA / EMBER No. 01**, a fictional botanical sparkling elixir.

## What is included

- Full-screen motion footage that changes as the visitor scrolls
- Cinematic product hero and original MIRAVA product artwork
- Responsive desktop, tablet and mobile layouts
- Interactive botanical ingredient section
- Working pack selector and shopping-bag drawer
- Newsletter interaction
- Reduced-motion fallback for accessibility
- Vercel configuration
- No framework or build step required

## Run locally

Open `index.html` directly, or run a small local server:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy to GitHub and Vercel

1. Create a new GitHub repository.
2. Upload every file and folder from this project.
3. In Vercel, choose **Add New Project** and import the repository.
4. Framework preset: **Other**.
5. Leave the build command and output directory empty.
6. Deploy.

## Motion footage

The page streams four free-to-use Pexels clips from their download endpoints. The original source pages and creators are listed in `CREDITS.md`.

This keeps the project ZIP small while still using real HD footage. For a fully self-contained site, download those clips from the source pages and replace each remote `<source src="...">` in `index.html` with a local file path such as `public/videos/scene-01.mp4`.

## Important

The cart and newsletter are front-end demonstrations. Connect them to Shopify, Stripe, WooCommerce, Formspree, Mailchimp or another backend before accepting real orders or subscribers.
