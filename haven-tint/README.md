# Haven Tint Kenya - Static Site

A fast, responsive static website for Haven Tint Kenya featuring interactive tint previews, instant pricing, and WhatsApp booking.

## Features
- Interactive SVG tint preview for vehicles (multiple angles) and buildings
- Instant pricing calculator with brand, vehicle size, and window count
- WhatsApp booking with prefilled message
- SEO: meta tags, JSON-LD, robots.txt, sitemap.xml
- Responsive, black-and-gold premium theme

## Run Locally
Any static server works. Examples:

```bash
# Python
python3 -m http.server 5173 --directory .

# Node (http-server)
npm i -g http-server
http-server -p 5173 .
```
Then open `http://localhost:5173/index.html`.

## Deploy
- Netlify/Render/Vercel (Static): deploy the folder as-is.
- GitHub Pages: push contents to `gh-pages` branch or enable Pages from `main` and set root to `/`.

## Customization
- Update phone in `app.js` if needed (WhatsApp E.164 without leading 0).
- Replace SVG car/building visuals with high-res renders or 3D snapshots; target the same window overlay structure.
- Update pricing multipliers in `app.js` (`BASE_PRICES`, `VEHICLE_MULTIPLIER`).
- Edit SEO: `index.html` `<meta>` tags, JSON-LD, and `sitemap.xml`.

## Notes
This build ships with scalable SVG placeholders for previews. Swap in branded 3D images as they become available.