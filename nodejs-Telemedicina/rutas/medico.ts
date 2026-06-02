import { Router } from 'express';
import { obtenerPacientesCriticos } from '../controladores/medicoController';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/medico/:id/dashboard', obtenerPacientesCriticos);

router.put('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;
    const actualizado = await prisma.usuario.update({
      where: { id },
      data: { nombre, correo }
    });
    res.status(200).json({ ok: true, mensaje: 'Usuario actualizado', data: actualizado });
  } catch (error) {
    res.status(500).json({ ok: false, mensaje: 'Error al actualizar' });
  }
});

router.delete('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;

     await prisma.usuario.delete({
      where: { id: id as string }
    });

    return res.status(200).json({ 
      ok: true, 
      mensaje: 'Usuario y sus registros clínicos eliminados con éxito' 
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return res.status(500).json({ 
      ok: false, 
      mensaje: 'Error interno del servidor al eliminar el usuario.' 
    });
  }
});
export default router;