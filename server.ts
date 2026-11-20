import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {GoogleGenAI} from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure no default API key collides with keyless Vertex AI ADC authentication
delete process.env.GEMINI_API_KEY;
delete process.env.GOOGLE_API_KEY;

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT || 'intrepid-axe-515214-a4',
  location: 'global',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const MODEL_NAME = 'gemini-3.5-flash-lite';
const MAX_USER_CHARS = 400;
const MAX_OUTPUT_TOKENS = 250;
const RATE_LIMIT_MAX_REQUESTS = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(clientKey: string): {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
} {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const timestamps = (rateLimitStore.get(clientKey) ?? []).filter(
    (ts) => ts > windowStart,
  );

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const oldest = timestamps[0] ?? now;
    const retryAfterSec = Math.max(
      1,
      Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000),
    );
    rateLimitStore.set(clientKey, timestamps);
    return {allowed: false, remaining: 0, retryAfterSec};
  }

  timestamps.push(now);
  rateLimitStore.set(clientKey, timestamps);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - timestamps.length,
    retryAfterSec: 0,
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({limit: '32kb'}));

  app.post('/api/pizzero', async (req, res) => {
    const forwardedFor = req.headers['x-forwarded-for'];
    const clientIp =
      typeof forwardedFor === 'string'
        ? forwardedFor.split(',')[0].trim()
        : req.ip || 'local';

    const rate = checkRateLimit(clientIp);
    if (!rate.allowed) {
      res.setHeader('Retry-After', String(rate.retryAfterSec));
      return res.status(429).json({
        error: `Has alcanzado el máximo de ${RATE_LIMIT_MAX_REQUESTS} consultas por minuto. Espera ${rate.retryAfterSec} s antes de volver a preguntar.`,
      });
    }

    const body = (req.body ?? {}) as {
      message?: unknown;
      pizzaSummary?: unknown;
    };

    const rawMessage = typeof body.message === 'string' ? body.message : '';
    const sanitizedMessage = rawMessage.trim().slice(0, MAX_USER_CHARS);

    if (!sanitizedMessage) {
      return res.status(400).json({
        error: 'Escribe una pregunta para el maestro pizzero.',
      });
    }

    const rawContext =
      typeof body.pizzaSummary === 'string' ? body.pizzaSummary : '';
    const sanitizedContext = rawContext.trim().slice(0, 320);

    const prompt = sanitizedContext
      ? `Pizza actual en la pala del cliente: ${sanitizedContext}\n\nConsulta del cliente: ${sanitizedMessage}`
      : `Consulta del cliente: ${sanitizedMessage}`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
        config: {
          maxOutputTokens: MAX_OUTPUT_TOKENS,
          systemInstruction:
            'Eres Marco Bellini, maestro pizzero italiano de Forno Vivo, experto en fermentación lenta (72h), horno de leña a 450 °C, equilibrio de sabores, nutrición y maridajes. Responde siempre en español natural y cercano, con algún término italiano breve si aporta valor (cornicione, impasto, fior di latte). Sé conciso y práctico: máximo 3 o 4 frases claras adaptadas a la pizza actual del cliente.',
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        return res.status(502).json({
          error:
            'El maestro pizzero no pudo responder en este momento. Inténtalo de nuevo.',
        });
      }

      return res.json({
        reply,
        remainingRequests: rate.remaining,
      });
    } catch (error) {
      console.error('Error calling Vertex AI Gemini:', error);
      const errObj = error as {status?: number; message?: string};
      const status = typeof errObj.status === 'number' ? errObj.status : 500;
      const details = errObj.message || 'Error desconocido al consultar Vertex AI.';

      if (status === 403) {
        return res.status(403).json({
          error:
            'Permiso denegado en Vertex AI (403). Verifica que la service account del entorno tenga acceso al proyecto configurado.',
          details,
        });
      }

      return res.status(status >= 400 && status < 600 ? status : 500).json({
        error:
          'No se pudo conectar con el servicio de Gemini en Vertex AI. Revisa la configuración del proyecto o inténtalo en unos segundos.',
        details,
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
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
    console.log(`Forno Vivo server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
