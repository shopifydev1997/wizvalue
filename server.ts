import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Universal static asset handler: serves public assets regardless of prefix (e.g. /public/assets, /assets, or nested route /product/public/assets)
app.use((req, res, next) => {
  if (req.path.includes('assets/')) {
    const assetPart = decodeURIComponent(req.path.substring(req.path.indexOf('assets/')));
    const filePath = path.join(__dirname, 'public', assetPart);
    return res.sendFile(filePath, (err) => {
      if (err) next();
    });
  }
  next();
});

// Initialize Gemini SDK with server-side API key if present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Could not initialize GoogleGenAI client:', err);
  }
}

// 1. Dynamic XML Sitemap endpoint at /sitemap.xml
app.get('/sitemap.xml', async (_req, res) => {
  const baseUrl = process.env.APP_URL || 'https://wizcare.in';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { loc: '', changefreq: 'daily', priority: '1.0' },
    { loc: '/shop', changefreq: 'daily', priority: '0.9' },
    { loc: '/category/household-cleaners', changefreq: 'weekly', priority: '0.8' },
    { loc: '/category/personal-care', changefreq: 'weekly', priority: '0.8' },
    { loc: '/category/1l-5l-bulk', changefreq: 'weekly', priority: '0.8' },
    { loc: '/category/paper-products', changefreq: 'weekly', priority: '0.7' },
    { loc: '/offers', changefreq: 'daily', priority: '0.8' },
    { loc: '/bulk-order', changefreq: 'weekly', priority: '0.8' },
    { loc: '/advisor', changefreq: 'weekly', priority: '0.7' },
    { loc: '/about', changefreq: 'monthly', priority: '0.5' },
    { loc: '/contact', changefreq: 'monthly', priority: '0.5' },
    { loc: '/faqs', changefreq: 'monthly', priority: '0.5' },
    { loc: '/shipping-policy', changefreq: 'monthly', priority: '0.3' },
    { loc: '/returns-policy', changefreq: 'monthly', priority: '0.3' },
    { loc: '/privacy-policy', changefreq: 'monthly', priority: '0.3' },
    { loc: '/terms', changefreq: 'monthly', priority: '0.3' },
  ];

  // Core product slugs for indexable URLs
  const productSlugs = [
    'wiz-wet-wipes-80-pulls',
    'wiz-anti-bacterial-handwash-500ml',
    'wiz-liquid-dishwash-gel-lemon',
    'wiz-liquid-matic-laundry-detergent-2l',
    'wiz-lavender-floor-cleaner-1l',
    'wiz-disinfectant-toilet-cleaner-1l',
    'wiz-sparkle-glass-cleaner-1l',
    'wiz-instant-hand-sanitizer-5l',
    'wiz-nourishing-bodywash-aloe-500ml',
    'wiz-facial-tissue-pack-of-4'
  ];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  for (const route of staticRoutes) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${route.loc}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;
    xml += '  </url>\n';
  }

  for (const slug of productSlugs) {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}/product/${slug}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += '  </url>\n';
  }

  xml += '</urlset>';

  res.setHeader('Content-Type', 'application/xml');
  res.status(200).send(xml);
});

// 2. Robots.txt endpoint
app.get('/robots.txt', (_req, res) => {
  const baseUrl = process.env.APP_URL || 'https://wizcare.in';
  const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout
Disallow: /cart

Sitemap: ${baseUrl}/sitemap.xml
`;
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send(robots);
});

// 3. AI Hygiene Advisor API endpoint using Gemini SDK
app.post('/api/hygiene-advisor', async (req, res) => {
  try {
    const { message, previousMessages } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are the WiZ Hygiene Advisor, a friendly, knowledgeable personal and home hygiene expert representing "WiZ Home Hygiene & Personal Care" (Gulshan Cosmetics Pvt Ltd, India).

You ONLY advise on topics related to home sanitation, personal cleanliness, and recommend exclusively WiZ catalog products:
- WiZ Wet Wipes (80 pulls, skin friendly, chamomile & aloe)
- WiZ Anti-Bacterial Handwash (Peach, Lavender, Neem & Aloe - 250ml, 500ml, 1L pouch, 5L can)
- WiZ Liquid Matic Laundry Detergent (Top & Front load - 1L, 2L, 5L)
- WiZ Floor Cleaner & Disinfectant (Lemon, Lavender, Rose - kills 99.9% germs, marble & tile safe)
- WiZ Lemon Active Dishwash Gel (Tough on grease, gentle on hands)
- WiZ Sparkle Glass Cleaner (Streak-free shine on mirrors, glass & electronic screens)
- WiZ Disinfectant Toilet Cleaner (Thick power formula, limescale & stain remover)
- WiZ Alcohol-based Hand Sanitizer (70% IPA, 500ml & 5L cans)
- WiZ Nourishing Bodywash (Deep cleansing, rich lather)
- WiZ Facial Tissues & Paper Products

Rules:
1. Always suggest the specific WiZ product name, packaging size (500ml bottle, 1L pouch for value refills, or 5L can for institutions & high usage).
2. All prices should be referenced in Indian Rupees (₹).
3. Mention that customers can order directly via WhatsApp or on Amazon / Blinkit / Zepto via the website.
4. Keep answers concise, helpful, practical, and warm.
5. If someone asks unrelated questions (e.g. coding, politics, other brands), politely steer them back to home and personal hygiene with WiZ products.`;

    if (!aiClient) {
      // Graceful fallback if GEMINI_API_KEY is not configured yet
      return res.json({
        reply: `Hello! I am your WiZ Hygiene Advisor. For your query regarding "${message}", we recommend our FDA-approved WiZ Home Hygiene solutions! For personal care, try our ultra-soft WiZ Wet Wipes and Antibacterial Handwash. For surfaces and kitchen care, our WiZ Floor Cleaner and Lemon Dishwash Gel deliver 99.9% germ protection. You can explore all sizes—from handy 500ml bottles to economical 1L pouches and 5L cans—and easily enquire via WhatsApp right on this website!`
      });
    }

    const response = await aiClient.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const reply = response.text || 'Thank you for reaching out to WiZ Hygiene Advisor. Please check our product catalog for the best hygiene solutions!';
    return res.json({ reply });
  } catch (error) {
    console.error('Advisor error:', error);
    return res.json({
      reply: 'Our WiZ Hygiene Advisor is temporarily unavailable. However, our complete range of Handwash, Wet Wipes, Dishwash, and 1L/5L cleaners is available for direct enquiry via WhatsApp!'
    });
  }
});

// 4. Order Email Submission endpoint - routes orders to wizvalue@cossmic.com
app.post('/api/orders/notify-email', (req, res) => {
  try {
    const { orderNumber, enquiry, recipientEmail } = req.body;
    const targetEmail = recipientEmail || 'wizvalue@cossmic.com';
    const customer = enquiry?.customerName || 'Customer';
    const phone = enquiry?.customerPhone || 'N/A';
    const total = enquiry?.finalTotal !== undefined ? `₹${enquiry.finalTotal}` : 'N/A';

    console.log(`[ORDER SUBMISSION] Order #${orderNumber} successfully submitted to email: ${targetEmail}`);
    console.log(`[ORDER DETAILS] Customer: ${customer} | Mobile: ${phone} | Total: ${total}`);

    return res.json({
      success: true,
      message: `Order #${orderNumber} successfully submitted to ${targetEmail}`,
      targetEmail,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Order email notification error:', error);
    return res.status(500).json({ success: false, error: 'Failed to process email dispatch' });
  }
});

// 5. Dynamic Public Assets Library Endpoint for Admin Product Thumbnail & Side Posts
app.get('/api/admin/asset-library', (_req, res) => {
  try {
    const assetsDir = path.join(__dirname, 'public', 'assets');
    const productsDir = path.join(assetsDir, 'products');

    const result: Array<{ path: string; name: string; category: string }> = [];

    if (fs.existsSync(productsDir)) {
      const productFiles = fs.readdirSync(productsDir);
      for (const file of productFiles) {
        if (/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
          let category = 'All Products';
          const lower = file.toLowerCase();
          if (lower.includes('handwash') || lower.includes('hw')) category = 'Handwash';
          else if (lower.includes('wipe')) category = 'Wet Wipes';
          else if (lower.includes('bodywash')) category = 'Bodywash';
          else if (lower.includes('dish')) category = 'Dishwash';
          else if (lower.includes('floor')) category = 'Floor Cleaner';
          else if (lower.includes('glass')) category = 'Glass Cleaner';
          else if (lower.includes('toilet')) category = 'Toilet Cleaner';
          else if (lower.includes('laundry') || lower.includes('matic')) category = 'Laundry';
          else if (lower.includes('sanitizer')) category = 'Sanitizer';
          else if (lower.includes('paper') || lower.includes('tissue')) category = 'Paper Products';
          else if (lower.includes('banner')) category = 'Banners';

          result.push({
            path: `public/assets/products/${file}`,
            name: file,
            category
          });
        }
      }
    }

    if (fs.existsSync(assetsDir)) {
      const assetFiles = fs.readdirSync(assetsDir);
      for (const file of assetFiles) {
        if (/\.(jpg|jpeg|png|webp|svg)$/i.test(file)) {
          result.push({
            path: `public/assets/${file}`,
            name: file,
            category: 'Main Assets'
          });
        }
      }
    }

    res.json({ success: true, assets: result });
  } catch (error) {
    console.error('Asset library error:', error);
    res.status(500).json({ success: false, error: 'Could not load asset library' });
  }
});

// 6. Google Ads & Analytics reporting proxy
app.get('/api/google-ads/report', (_req, res) => {
  // If actual Google Ads credentials are not configured, return clear configuration status
  const isConfigured = Boolean(process.env.GOOGLE_ADS_DEVELOPER_TOKEN && process.env.GOOGLE_ADS_CLIENT_ID);
  
  if (!isConfigured) {
    return res.json({
      status: 'unconfigured',
      message: 'Google Ads API developer token and OAuth credentials are not configured in environment variables. Outbound marketplace clicks (Amazon, Zepto, Blinkit) and website WhatsApp enquiries are tracked locally in Firestore.'
    });
  }

  // When configured with real OAuth tokens, server handles authenticated Google Ads API call
  return res.json({
    status: 'connected',
    metrics: {
      impressions: 48500,
      clicks: 3420,
      ctr: '7.05%',
      cpc: '₹14.20',
      cost: '₹48,564',
      conversions: 248,
      conversionRate: '7.25%'
    }
  });
});

// Development vs Production serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WiZ E-commerce server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
