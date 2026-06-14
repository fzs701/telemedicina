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

router.get('/medico', async (req, res) => {
  try {
    const medicos = await prisma.usuario.findMany({
      where: {
        rol: 'medico' 
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        rol: true
      }
    });

    return res.status(200).json({
      ok: true,
      medico: medicos
    });
  } catch (error) {
    console.error("Error al obtener médicos de Prisma:", error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno al obtener los médicos.'
    });
  }
});

router.post('/citas', async (req, res) => {
  try {
    const { usuarioId, medicoId, fecha, hora, estado } = req.body;

    if (!usuarioId || !medicoId || !fecha || !hora) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan datos obligatorios.' });
    }

    const crypto = require('crypto');
    const nuevoId = crypto.randomUUID();
    const estadoFinal = estado || 'programada';
    const fechaAhora = new Date();

    await prisma.$executeRawUnsafe(
      `INSERT INTO Cita (id, usuarioId, medicoId, fecha, hora, estado, fechaCreacion) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      nuevoId, usuarioId, medicoId, fecha, hora, estadoFinal, fechaAhora
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Cita guardada con éxito en MySQL usando query directo'
    });

  } catch (error: any) {
    console.error("Error al guardar:", error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error en el servidor: ' + error.message
    });
  }
});

router.get('/citas/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const citasPaciente = await prisma.$queryRawUnsafe(
      `SELECT * FROM Cita WHERE usuarioId = ? ORDER BY fecha ASC, hora ASC`,
      id
    );

    const citasConNombreMedico = await Promise.all(
      (citasPaciente as any[]).map(async (cita) => {
        const medico = await prisma.usuario.findUnique({
          where: { id: cita.medicoId },
          select: { nombre: true }
        });
        return {
          ...cita,
          medico_nombre: medico ? medico.nombre : 'Médico Especialista'
        };
      })
    );

    return res.status(200).json({
      ok: true,
      citas: citasConNombreMedico
    });

  } catch (error: any) {
    console.error("Error al obtener citas del usuario:", error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno en servidor al obtener historial: ' + error.message
    });
  }
});

router.post('/recetas', async (req, res) => {
  try {
    const { usuarioId, medicoNombre, medicamentos, observaciones } = req.body;

    if (!usuarioId || !medicoNombre || !medicamentos) {
      return res.status(400).json({ ok: false, mensaje: 'Faltan datos obligatorios para la receta.' });
    }

    const crypto = require('crypto');
    const nuevoId = crypto.randomUUID();
    const fechaAhora = new Date();

    await prisma.$executeRawUnsafe(
      `INSERT INTO Receta (id, usuarioId, medicoNombre, medicamentos, observaciones, fechaCreacion) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      nuevoId, usuarioId, medicoNombre, medicamentos, observaciones || '', fechaAhora
    );

    return res.status(201).json({
      ok: true,
      mensaje: 'Receta médica creada con éxito.'
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ ok: false, mensaje: 'Error al crear receta: ' + error.message });
  }
});

router.get('/recetas/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const recetasPaciente = await prisma.$queryRawUnsafe(
      `SELECT * FROM Receta WHERE usuarioId = ? ORDER BY fechaCreacion DESC`,
      id
    );

    return res.status(200).json({
      ok: true,
      recetas: recetasPaciente
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ ok: false, mensaje: 'Error al obtener recetas: ' + error.message });
  }
});

router.post('/examenes', async (req, res) => {
  try {
    const { usuarioId, tipoExamen, resultado, medicoNombre } = req.body;
    const crypto = require('crypto');
    await prisma.$executeRawUnsafe(
      `INSERT INTO Examen (id, usuarioId, tipoExamen, resultado, medicoNombre, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?)`,
      crypto.randomUUID(), usuarioId, tipoExamen, resultado, medicoNombre, new Date()
    );
    res.status(201).json({ ok: true, mensaje: 'Examen subido con éxito' });
  } catch (e: any) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/examenes/usuario/:id', async (req, res) => {
  try {
    const datos = await prisma.$queryRawUnsafe(`SELECT * FROM Examen WHERE usuarioId = ? ORDER BY fechaCreacion DESC`, req.params.id);
    res.status(200).json({ ok: true, examenes: datos });
  } catch (e: any) { res.status(500).json({ ok: false, error: e.message }); }
});

// Guardar respuesta del paciente
router.post('/seguimiento', async (req, res) => {
  try {
    const { usuarioId, indicacion, cumplio } = req.body;
    const crypto = require('crypto');
    await prisma.$executeRawUnsafe(
      `INSERT INTO Seguimiento (id, usuarioId, indicacion, cumplio, fechaRegistro) VALUES (?, ?, ?, ?, ?)`,
      crypto.randomUUID(), usuarioId, indicacion, cumplio, new Date()
    );
    res.status(201).json({ ok: true, mensaje: 'Seguimiento guardado en el historial' });
  } catch (e: any) { res.status(500).json({ ok: false, error: e.message }); }
});

router.get('/seguimiento/usuario/:id', async (req, res) => {
  try {
    const datos = await prisma.$queryRawUnsafe(`SELECT * FROM Seguimiento WHERE usuarioId = ? ORDER BY fechaRegistro DESC`, req.params.id);
    res.status(200).json({ ok: true, historial: datos });
  } catch (e: any) { res.status(500).json({ ok: false, error: e.message }); }
});
router.get('/citas/medico/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const citas = await prisma.$queryRawUnsafe(
      `SELECT c.*, u.nombre as paciente_nombre, u.rut as paciente_rut 
       FROM Cita c 
       JOIN Usuario u ON c.usuarioId = u.id
       WHERE c.medicoId = ? 
       ORDER BY c.fecha ASC, c.hora ASC`,
      id
    );

    return res.status(200).json({ ok: true, citas });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});

  router.get('/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: { id: true, nombre: true, rut: true, correo: true, region: true, comuna: true, rol: true }
    });
    if (!usuario) return res.status(404).json({ ok: false, mensaje: 'Usuario no encontrado' });
    return res.status(200).json({ ok: true, usuario });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});
// Obtener mensajes de un usuario
router.get('/mensajes/usuario/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const mensajes = await prisma.$queryRawUnsafe(
      `SELECT * FROM Mensaje WHERE usuarioId = ? ORDER BY fecha ASC`, id
    );
    
    // Buscar médico asignado
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { medico: { select: { nombre: true } } }
    }) as any;

    return res.status(200).json({
      ok: true,
      mensajes,
      medicoNombre: usuario?.medico?.nombre || null
    });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});

// Enviar mensaje
router.post('/mensajes/enviar', async (req, res) => {
  try {
    const { usuarioId, remitente_tipo, texto } = req.body;
    const crypto = require('crypto');
    await prisma.$executeRawUnsafe(
      `INSERT INTO Mensaje (id, usuarioId, remitente_tipo, texto, leido, fecha) VALUES (?, ?, ?, ?, false, ?)`,
      crypto.randomUUID(), usuarioId, remitente_tipo, texto, new Date()
    );
    return res.status(201).json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});

// Médico obtiene todos sus pacientes con último mensaje
router.get('/mensajes/medico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pacientes = await prisma.usuario.findMany({
      where: { medicoId: id, rol: 'paciente' },
      select: { id: true, nombre: true, rut: true }
    });

    const pacientesConMensaje = await Promise.all(
      pacientes.map(async (p) => {
        const mensajes = await prisma.$queryRawUnsafe(
          `SELECT * FROM Mensaje WHERE usuarioId = ? ORDER BY fecha DESC LIMIT 1`, p.id
        ) as any[];
        return {
          ...p,
          ultimoMensaje: mensajes[0]?.texto || null,
          fechaUltimo: mensajes[0]?.fecha || null,
          remitente: mensajes[0]?.remitente_tipo || null
        };
      })
    );

    return res.status(200).json({ ok: true, pacientes: pacientesConMensaje });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});

// Médico envía mensaje a paciente
router.post('/mensajes/medico/enviar', async (req, res) => {
  try {
    const { usuarioId, texto } = req.body;
    const crypto = require('crypto');
    await prisma.$executeRawUnsafe(
      `INSERT INTO Mensaje (id, usuarioId, remitente_tipo, texto, leido, fecha) VALUES (?, ?, ?, ?, false, ?)`,
      crypto.randomUUID(), usuarioId, 'medico', texto, new Date()
    );
    return res.status(201).json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});
// Médico envía recomendación/indicación a paciente
router.post('/seguimiento/medico/enviar', async (req, res) => {
  try {
    const { usuarioId, indicacion } = req.body;
    const crypto = require('crypto');
    await prisma.$executeRawUnsafe(
      `INSERT INTO Seguimiento (id, usuarioId, indicacion, cumplio, fechaRegistro) VALUES (?, ?, ?, ?, ?)`,
      crypto.randomUUID(), usuarioId, indicacion, false, new Date()
    );
    return res.status(201).json({ ok: true });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});
router.delete('/recetas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.$executeRawUnsafe(`DELETE FROM Receta WHERE id = ?`, id);
    return res.status(200).json({ ok: true, mensaje: 'Receta eliminada correctamente' });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});
router.get('/recetas/medico/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Buscar recetas donde medicoNombre coincide con el nombre del médico
    const medico = await prisma.usuario.findUnique({
      where: { id: req.params.id },
      select: { nombre: true }
    });
    if (!medico) return res.status(404).json({ ok: false });

    const recetas = await prisma.$queryRawUnsafe(
      `SELECT * FROM Receta WHERE medicoNombre = ? ORDER BY fechaCreacion DESC`,
      medico.nombre
    );
    return res.status(200).json({ ok: true, recetas });
  } catch (error: any) {
    return res.status(500).json({ ok: false, mensaje: error.message });
  }
});
export default router;