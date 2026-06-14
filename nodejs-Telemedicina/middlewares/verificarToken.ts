import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_pucv_2026';

export const verificarToken = (req: Request, res: Response, next: NextFunction): any => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ ok: false, mensaje: 'Token requerido.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).usuario = decoded;
    next();
  } catch {
    return res.status(401).json({ ok: false, mensaje: 'Token inválido o expirado.' });
  }
};