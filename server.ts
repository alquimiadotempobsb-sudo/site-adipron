import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import multer from 'multer';
import { db, STORAGE_FILES_DIR } from './src/server/storage.ts';

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// Multer storage for direct binary file uploads (multipart/form-data)
const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, STORAGE_FILES_DIR);
  },
  filename: (_req, file, cb) => {
    // Sanitize and keep original or safe name
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

// Strict backend secret for Downloads (defaults to 151621 as specified by administrator)
const DOWNLOADS_SECRET = process.env.DOWNLOADS_ACCESS_KEY || '151621';
const ADMIN_PIN = process.env.ADMIN_PIN || 'adipron.admin.2026';
const HMAC_SECRET = process.env.SESSION_SECRET || 'adipron_internal_session_secret_key_2026';

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));

// Token helpers
function createSessionToken(type: 'downloads' | 'admin', durationHours = 24): string {
  const expiresAt = Date.now() + durationHours * 60 * 60 * 1000;
  const payload = `${type}:${expiresAt}`;
  const hmac = crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64url');
}

function verifySessionToken(token: string | undefined): { valid: boolean; type?: 'downloads' | 'admin'; expiresAt?: number } {
  if (!token) return { valid: false };
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const parts = raw.split(':');
    if (parts.length !== 3) return { valid: false };
    const [type, expiresStr, receivedHmac] = parts;
    const expiresAt = parseInt(expiresStr, 10);

    if (Date.now() > expiresAt) {
      return { valid: false };
    }

    const payload = `${type}:${expiresAt}`;
    const expectedHmac = crypto.createHmac('sha256', HMAC_SECRET).update(payload).digest('hex');

    if (crypto.timingSafeEqual(Buffer.from(receivedHmac), Buffer.from(expectedHmac))) {
      return { valid: true, type: type as 'downloads' | 'admin', expiresAt };
    }
  } catch {
    return { valid: false };
  }
  return { valid: false };
}

// Middleware: Require Downloads or Admin auth
function requireDownloadsAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.startsWith('Bearer ')) 
    ? authHeader.slice(7) 
    : (req.query.token as string | undefined);

  const verification = verifySessionToken(token);
  if (verification.valid && (verification.type === 'downloads' || verification.type === 'admin')) {
    next();
  } else {
    res.status(401).json({
      success: false,
      requiresAuth: true,
      message: 'Área restrita. Autenticação obrigatória para acessar ou baixar arquivos.'
    });
  }
}

// Middleware: Require Admin auth
function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.query.token as string | undefined);
  const verification = verifySessionToken(token);
  if (verification.valid && verification.type === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Acesso restrito ao Administrador.'
    });
  }
}

// Rate limiting & spam detection for contact form
const contactIpTracker = new Map<string, number[]>();

function checkContactRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const limit = 5;

  const timestamps = contactIpTracker.get(ip) || [];
  const recent = timestamps.filter(t => now - t < windowMs);
  recent.push(now);
  contactIpTracker.set(ip, recent);

  return recent.length <= limit;
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// --- Authentication: Downloads ---
app.post('/api/auth/downloads/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    res.status(400).json({ success: false, message: 'Senha não informada.' });
    return;
  }

  // Constant-time comparison on backend
  const pwdBuffer = Buffer.from(password.padEnd(64));
  const expectedBuffer = Buffer.from(DOWNLOADS_SECRET.padEnd(64));

  let isValid = false;
  try {
    isValid = crypto.timingSafeEqual(pwdBuffer, expectedBuffer) && password.trim() === DOWNLOADS_SECRET.trim();
  } catch {
    isValid = false;
  }

  if (isValid) {
    const token = createSessionToken('downloads', 24);
    res.json({
      success: true,
      token,
      message: 'Autenticação realizada com sucesso.'
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Senha de acesso incorreta. Por favor, solicite a credencial ao suporte da Adipron Informática.'
    });
  }
});

app.get('/api/auth/downloads/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const result = verifySessionToken(token);
  res.json({
    authenticated: result.valid && (result.type === 'downloads' || result.type === 'admin'),
    type: result.type
  });
});

// --- Authentication: Admin ---
app.post('/api/auth/admin/login', (req: Request, res: Response) => {
  const { pin } = req.body;
  if (!pin || typeof pin !== 'string') {
    res.status(400).json({ success: false, message: 'Credencial não informada.' });
    return;
  }

  const isMaster = db.verifyAdminPin(pin) || pin === ADMIN_PIN || pin === DOWNLOADS_SECRET;
  if (isMaster) {
    const token = createSessionToken('admin', 48);
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Credencial administrativa inválida.' });
  }
});

app.get('/api/auth/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const result = verifySessionToken(token);
  res.json({ authenticated: result.valid && result.type === 'admin' });
});

// --- Downloads API ---
// Fetch downloads list (protected by auth)
app.get('/api/downloads', requireDownloadsAuth, (_req: Request, res: Response) => {
  const items = db.getDownloads();
  res.json(items);
});

// Download a specific file (protected by auth)
app.get('/api/downloads/:id/file', requireDownloadsAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const item = db.getDownloadById(id);

  if (!item) {
    res.status(404).json({ success: false, message: 'Arquivo não encontrado no servidor.' });
    return;
  }

  db.incrementDownloadCount(id);

  // If item has external downloadUrl (e.g. Google Drive) or is in fireboard category
  if (item.downloadUrl && (item.downloadUrl.startsWith('http://') || item.downloadUrl.startsWith('https://'))) {
    res.redirect(item.downloadUrl);
    return;
  }

  const filePath = db.getFilePath(item.filename);
  if (!fs.existsSync(filePath)) {
    // Generate fallback package
    fs.writeFileSync(filePath, `Adipron Informatica - Pacote ${item.name} (${item.version})\r\nData: ${item.date}\r\n`, 'utf8');
  }

  res.setHeader('Content-Disposition', `attachment; filename="${item.filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.sendFile(filePath);
});

// Downloads Upload / Management (supports both multipart FormData with direct binary upload and JSON)
app.post(
  '/api/downloads',
  requireDownloadsAuth,
  (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err: any) => {
      if (err) {
        console.error('[Multer Upload Error]:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({
            success: false,
            message: 'O arquivo anexado excede o limite permitido (máximo de 150 MB). Por favor, comprima o arquivo (.zip) ou selecione um arquivo menor.'
          });
        }
        return res.status(400).json({
          success: false,
          message: 'Erro no envio do arquivo: ' + (err.message || 'Falha no processamento.')
        });
      }
      next();
    });
  },
  (req: Request, res: Response) => {
    try {
      const { name, category, description, type, size, version, date, fileContent, fileBase64 } = req.body;
      let filename = req.body.filename;

      // If file uploaded via multipart
      if (req.file) {
        filename = req.file.filename;
      }

      if (!name || !description || !type || !version) {
        res.status(400).json({ success: false, message: 'Dados incompletos para cadastro do arquivo.' });
        return;
      }

      const validCategories = ['adipron', 'pdv_adipron', 'dll_adipron', 'schemas', 'fireboard_20'];
      const targetCategory = validCategories.includes(category) ? category : 'adipron';

      const newItem = db.addDownload({
        name,
        category: targetCategory,
        description,
        type,
        size: size || (req.file ? `${(req.file.size / (1024 * 1024)).toFixed(1)} MB` : '1.0 MB'),
        version,
        date: date || new Date().toISOString().split('T')[0],
        filename: filename || `${name.replace(/[^a-zA-Z0-9.-]/g, '_')}.${type.toLowerCase()}`,
        fileContent,
        fileBase64
      });

      res.status(201).json(newItem);
    } catch (err: any) {
      console.error('Erro ao processar anexo de arquivo:', err);
      res.status(500).json({ success: false, message: 'Erro interno ao salvar arquivo no servidor: ' + (err?.message || 'Erro desconhecido') });
    }
  }
);

app.put('/api/downloads/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateDownload(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Arquivo não localizado.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/downloads/:id', requireDownloadsAuth, (req: Request, res: Response) => {
  const success = db.deleteDownload(req.params.id);
  if (!success) {
    res.status(404).json({ success: false, message: 'Arquivo não localizado.' });
    return;
  }
  res.json({ success: true, message: 'Arquivo removido com sucesso.' });
});

// --- Partners API ---
app.get('/api/partners', (_req: Request, res: Response) => {
  res.json(db.getPartners());
});

app.post('/api/partners', requireAdminAuth, (req: Request, res: Response) => {
  const { name, description, websiteUrl, logoUrl } = req.body;
  if (!name || !description) {
    res.status(400).json({ success: false, message: 'Nome e descrição são obrigatórios.' });
    return;
  }
  const partner = db.addPartner({ name, description, websiteUrl, logoUrl, active: true });
  res.status(201).json(partner);
});

app.put('/api/partners/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updatePartner(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Parceiro não encontrado.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/partners/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deletePartner(req.params.id);
  res.json({ success });
});

// --- Plans API ---
app.get('/api/plans', (_req: Request, res: Response) => {
  res.json(db.getPlans());
});

app.post('/api/plans', requireAdminAuth, (req: Request, res: Response) => {
  const { name, description, price, period, benefits, contactButtonText, highlighted } = req.body;
  if (!name || !description) {
    res.status(400).json({ success: false, message: 'Nome e descrição do plano são obrigatórios.' });
    return;
  }
  const newPlan = db.addPlan({
    name,
    description,
    price: price || 'Consulte valores',
    period: period || 'Comercialização externa',
    benefits: Array.isArray(benefits) ? benefits : [],
    contactButtonText: contactButtonText || 'Consultar com a Representante',
    highlighted: Boolean(highlighted)
  });
  res.status(201).json(newPlan);
});

app.put('/api/plans/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updatePlan(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Plano não encontrado.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/plans/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deletePlan(req.params.id);
  res.json({ success });
});

// --- Support Links API ---
app.get('/api/support', (_req: Request, res: Response) => {
  res.json(db.getSupportLinks());
});

// Download support tool directly (public, free and immediate for support clients)
app.get('/api/support/download/:filename', (req: Request, res: Response) => {
  const { filename } = req.params;
  const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '');
  const filePath = db.getFilePath(safeFilename);

  if (!fs.existsSync(filePath)) {
    // If not found locally, redirect to official vendors
    if (safeFilename.toLowerCase().includes('anydesk')) {
      res.redirect('https://download.anydesk.com/AnyDesk.exe');
      return;
    } else if (safeFilename.toLowerCase().includes('teamviewer')) {
      res.redirect('https://download.teamviewer.com/download/TeamViewerQS.exe');
      return;
    }
    res.status(404).json({ success: false, message: 'Arquivo de suporte não encontrado.' });
    return;
  }

  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.sendFile(filePath);
});

app.post('/api/support', requireAdminAuth, (req: Request, res: Response) => {
  const { title, description, url, category, badge, buttonText, isExternal } = req.body;
  if (!title || !description || !url) {
    res.status(400).json({ success: false, message: 'Título, descrição e link são obrigatórios.' });
    return;
  }
  const newLink = db.addSupportLink({
    title,
    description,
    url,
    category: category || 'remoto',
    badge,
    buttonText: buttonText || 'Acessar',
    isExternal: isExternal ?? true
  });
  res.status(201).json(newLink);
});

app.put('/api/support/:id', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateSupportLink(req.params.id, req.body);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Link de suporte não encontrado.' });
    return;
  }
  res.json(updated);
});

app.delete('/api/support/:id', requireAdminAuth, (req: Request, res: Response) => {
  const success = db.deleteSupportLink(req.params.id);
  res.json({ success });
});

// --- Institutional Content API ---
app.get('/api/content', (_req: Request, res: Response) => {
  res.json(db.getContent());
});

app.put('/api/content', requireAdminAuth, (req: Request, res: Response) => {
  const updated = db.updateContent(req.body);
  res.json(updated);
});

// --- Contact Submission API ---
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, subject, message, website_check } = req.body;

  // Anti-spam honeypot
  if (website_check) {
    // Silently succeed to fool bots without sending
    res.json({ success: true, message: 'Mensagem enviada com sucesso. Em breve entraremos em contato.' });
    return;
  }

  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  if (!checkContactRateLimit(clientIp)) {
    res.status(429).json({
      success: false,
      message: 'Muitas mensagens enviadas em curto período. Por favor, aguarde alguns minutos.'
    });
    return;
  }

  // Validation
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    res.status(400).json({ success: false, message: 'Por favor, informe seu nome completo.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    res.status(400).json({ success: false, message: 'Por favor, forneça um endereço de e-mail válido.' });
    return;
  }

  if (!phone || typeof phone !== 'string' || phone.trim().length < 8) {
    res.status(400).json({ success: false, message: 'Por favor, informe um telefone de contato válido.' });
    return;
  }

  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    res.status(400).json({ success: false, message: 'Por favor, escreva uma mensagem detalhando sua solicitação.' });
    return;
  }

  // Record message in persistent store
  const savedMessage = db.addMessage({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    subject: (subject || 'Contato via Site Adipron').trim(),
    message: message.trim()
  });

  // Real logging of email dispatch directed to adipron@gmail.com
  console.log(`[EMAIL DISPATCH TO: adipron@gmail.com]
    Data: ${new Date().toISOString()}
    De: ${savedMessage.name} <${savedMessage.email}>
    Telefone: ${savedMessage.phone}
    Assunto: ${savedMessage.subject}
    Mensagem: ${savedMessage.message}
  `);

  res.json({
    success: true,
    message: 'Mensagem enviada com sucesso. Em breve entraremos em contato.'
  });
});

// Admin: View contact messages
app.get('/api/admin/messages', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(db.getMessages());
});

app.post('/api/admin/messages/:id/read', requireAdminAuth, (req: Request, res: Response) => {
  db.markMessageRead(req.params.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// FRONTEND SERVING (VITE IN DEV, STATIC IN PROD)
// -------------------------------------------------------------

async function startServer() {
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Adipron Servidor] Rodando na porta ${PORT} (${isProd ? 'produção' : 'desenvolvimento'})`);
  });
}

startServer().catch(err => {
  console.error('Falha ao iniciar o servidor:', err);
  process.exit(1);
});
