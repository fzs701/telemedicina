import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import autenticacionRutas from './rutas/autenticacion';
import registrosRutas from './rutas/registros';
import medicoRutas from './rutas/medico';


const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);


// Helmet
app.use(helmet());

// CORS seguro: solo permite el frontend
app.use(cors({
  origin: (origin, callback) => {
    const allowed = [
      /^http:\/\/localhost:\d+$/,
      /\.app\.github\.dev$/,
      /\.github\.dev$/
    ];
    if (!origin || allowed.some(pattern => pattern.test(origin))) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { ok: false, mensaje: 'Demasiadas solicitudes. Intenta más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// Rate limiting más estricto 
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { ok: false, mensaje: 'Demasiados intentos de login. Espera 15 minutos.' }
});
app.use('/api/login', loginLimiter);

app.use(express.json({ limit: '10mb' }));

app.use('/api', autenticacionRutas);
app.use('/api', registrosRutas);
app.use('/api', medicoRutas);

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Servidor de Telemedicina corriendo correctamente'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});