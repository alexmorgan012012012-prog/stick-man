import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body Parser with ample limit for SVG/base64 logo vectors
  app.use(express.json({ limit: '15mb' }));

  // Middleware: Admin Authorization Guard
  const requireAdminAuth = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Admin authentication token required.' });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!db.verifyAdminToken(token)) {
      res.status(401).json({ error: 'Unauthorized: Invalid or expired admin session token.' });
      return;
    }
    next();
  };

  // --- PUBLIC API ROUTES ---

  // Site Content & Settings
  app.get('/api/site-content', (_req: Request, res: Response) => {
    res.json(db.getSiteContent());
  });

  // Products
  app.get('/api/products', (req: Request, res: Response) => {
    let products = db.getProducts();
    const { category, gender, search, featured, bestSeller, newArrival, sort } = req.query;

    if (category && category !== 'All') {
      products = products.filter((p) => p.category.toLowerCase() === String(category).toLowerCase());
    }
    if (gender && gender !== 'All') {
      products = products.filter(
        (p) => p.gender.toLowerCase() === String(gender).toLowerCase() || p.gender === 'Unisex'
      );
    }
    if (featured === 'true') {
      products = products.filter((p) => p.featured);
    }
    if (bestSeller === 'true') {
      products = products.filter((p) => p.bestSeller);
    }
    if (newArrival === 'true') {
      products = products.filter((p) => p.newArrival);
    }
    if (search) {
      const q = String(search).toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-asc') products.sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') products.sort((a, b) => b.price - a.price);
    else if (sort === 'newest') products.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));

    res.json(products);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json(product);
  });

  // Validate Discount Code
  app.post('/api/discounts/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    if (!code) {
      res.status(400).json({ error: 'Code is required.' });
      return;
    }
    const result = db.validateDiscount(code, Number(subtotal) || 0);
    res.json(result);
  });

  // Submit Order
  app.post('/api/orders', (req: Request, res: Response) => {
    try {
      const order = db.createOrder(req.body);
      res.status(201).json({ success: true, order });
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to place order.' });
    }
  });

  // Track Order
  app.get('/api/orders/:idOrNumber', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.idOrNumber);
    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    res.json(order);
  });

  // Custom & Manufacturing Inquiries
  app.post('/api/custom-inquiries', (req: Request, res: Response) => {
    try {
      const inquiry = db.createCustomInquiry(req.body);
      res.status(201).json({ success: true, inquiry });
    } catch (e: any) {
      res.status(400).json({ error: e.message || 'Failed to save custom inquiry.' });
    }
  });

  // Contact Form Submission
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Name, email, and message are required.' });
      return;
    }
    const saved = db.addContactMessage(name, email, subject || 'General Inquiry', message);
    res.status(201).json({ success: true, messageId: saved.id });
  });

  // Customer Authentication
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 6) {
      res.status(400).json({ error: 'Name, valid email, and password (min 6 chars) required.' });
      return;
    }
    const result = db.createCustomer(name, email, password);
    if (result.error) {
      res.status(400).json({ error: result.error });
      return;
    }
    res.status(201).json({ success: true, customer: result.customer });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password required.' });
      return;
    }
    const result = db.verifyCustomerLogin(email, password);
    if (result.error) {
      res.status(401).json({ error: result.error });
      return;
    }
    res.json({ success: true, customer: result.customer });
  });

  app.post('/api/customers/:id/wishlist', (req: Request, res: Response) => {
    const { productId } = req.body;
    if (!productId) {
      res.status(400).json({ error: 'ProductId required.' });
      return;
    }
    const wishlist = db.updateCustomerWishlist(req.params.id, productId);
    res.json({ success: true, wishlist });
  });

  // --- ADMIN AUTH & STATUS ---

  app.get('/api/admin/status', (_req: Request, res: Response) => {
    res.json(db.getAdminConfig());
  });

  app.post('/api/admin/setup', (req: Request, res: Response) => {
    const { password } = req.body;
    const config = db.getAdminConfig();
    if (config.isConfigured) {
      res.status(403).json({ error: 'Administrator credentials have already been configured.' });
      return;
    }
    if (!password || password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      return;
    }
    db.setupAdminPassword(password);
    const login = db.verifyAdminLogin(password);
    res.status(201).json({ success: true, token: login.token });
  });

  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { password } = req.body;
    if (!password) {
      res.status(400).json({ error: 'Password is required.' });
      return;
    }
    const result = db.verifyAdminLogin(password);
    if (!result.success) {
      res.status(401).json({ error: 'Invalid administrator credentials.' });
      return;
    }
    res.json({ success: true, token: result.token });
  });

  app.post('/api/admin/logout', requireAdminAuth, (_req: Request, res: Response) => {
    db.adminLogout();
    res.json({ success: true });
  });

  // --- PROTECTED ADMIN ROUTES ---

  app.get('/api/admin/dashboard', requireAdminAuth, (_req: Request, res: Response) => {
    const products = db.getProducts();
    const orders = db.getOrders();
    const inquiries = db.getCustomInquiries();
    const customers = db.getCustomers();
    const messages = db.getContactMessages();

    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'Pending' || o.status === 'Processing').length;
    const completedOrders = orders.filter((o) => o.status === 'Delivered').length;
    const confirmedRevenue = orders
      .filter((o) => o.paymentStatus === 'confirmed' && o.status !== 'Cancelled' && o.status !== 'Refunded')
      .reduce((sum, o) => sum + o.total, 0);

    const lowStockProducts = products.filter((p) => p.stockQuantity <= 10);

    res.json({
      totalOrders,
      pendingOrders,
      completedOrders,
      confirmedRevenue,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      customInquiriesCount: inquiries.filter((i) => i.type === 'design_studio').length,
      wholesaleInquiriesCount: inquiries.filter((i) => i.type === 'wholesale').length,
      customerAccountsCount: customers.length,
      contactMessagesCount: messages.length,
      recentOrders: orders.slice(0, 5),
      lowStockProducts,
    });
  });

  // Admin Products Management
  app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
    const created = db.addProduct(req.body);
    res.status(201).json({ success: true, product: created });
  });

  app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json({ success: true, product: updated });
  });

  app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
    const deleted = db.deleteProduct(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }
    res.json({ success: true });
  });

  // Admin Orders Management
  app.get('/api/admin/orders', requireAdminAuth, (_req: Request, res: Response) => {
    res.json(db.getOrders());
  });

  app.put('/api/admin/orders/:id/status', requireAdminAuth, (req: Request, res: Response) => {
    const { status, internalNotes, trackingNumber } = req.body;
    const updated = db.updateOrderStatus(req.params.id, status, internalNotes, trackingNumber);
    if (!updated) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }
    res.json({ success: true, order: updated });
  });

  // Admin Inquiries Management
  app.get('/api/admin/custom-inquiries', requireAdminAuth, (_req: Request, res: Response) => {
    res.json(db.getCustomInquiries());
  });

  app.put('/api/admin/custom-inquiries/:id', requireAdminAuth, (req: Request, res: Response) => {
    const updated = db.updateCustomInquiry(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Inquiry not found.' });
      return;
    }
    res.json({ success: true, inquiry: updated });
  });

  // Admin Customers
  app.get('/api/admin/customers', requireAdminAuth, (_req: Request, res: Response) => {
    res.json(db.getCustomers());
  });

  // Admin Discounts
  app.get('/api/admin/discounts', requireAdminAuth, (_req: Request, res: Response) => {
    res.json(db.getDiscountCodes());
  });

  app.post('/api/admin/discounts', requireAdminAuth, (req: Request, res: Response) => {
    const discount = db.addDiscountCode(req.body);
    res.status(201).json({ success: true, discount });
  });

  // Admin Content Management
  app.put('/api/admin/site-content', requireAdminAuth, (req: Request, res: Response) => {
    const updated = db.updateSiteContent(req.body);
    res.json({ success: true, siteContent: updated });
  });

  // Admin Contact Messages
  app.get('/api/admin/contact-messages', requireAdminAuth, (_req: Request, res: Response) => {
    res.json(db.getContactMessages());
  });

  // --- VITE DEV MIDDLEWARE / STATIC PROD SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MK SPORTS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
  process.exit(1);
});
