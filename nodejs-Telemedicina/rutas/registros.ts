import { Router } from 'express';
import { crearRegistroSalud, obtenerRegistrosPorPaciente } from '../controladores/registroSaludController';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/registro-salud', crearRegistroSalud);
router.get('/registro-salud/:usuarioId', obtenerRegistrosPorPaciente);

router.put('/registro-salud/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { observaciones } = req.body;
    
    const actualizado = await prisma.registroSalud.update({
      where: { id },
      data: { observaciones }
    });
    
    return res.status(200).json({ ok: true, mensaje: 'Registro clínico actualizado', data: actualizado });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error interno al actualizar.' });
  }
});

router.delete('/registro-salud/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.registroSalud.delete({
      where: { id }
    });
    
    return res.status(200).json({ ok: true, mensaje: 'Registro clínico eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ ok: false, mensaje: 'Error interno al eliminar.' });
  }
});

export default router;