
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import autenticacionRutas from './rutas/autenticacion';
import registrosRutas from './rutas/registros'
import medicoRutas from './rutas/medico';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;


app.use(cors()); 
app.use(express.json());


app.use('/api', autenticacionRutas); 
app.use('/api', registrosRutas);
app.use('/api', medicoRutas);


app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Servidor de Telemedicina corriendo perfectamente'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en: http://localhost:${PORT}`);
});