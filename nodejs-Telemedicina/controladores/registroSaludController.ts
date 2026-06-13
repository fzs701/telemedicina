import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { enviarAlertaCritico } from '../servicios/emailService';

const prisma = new PrismaClient();

export const crearRegistroSalud = async (req: Request, res: Response): Promise<any> => {
  try {
    const { usuarioId, nivelDolor, sintomas, presionArterial, pulso, temperatura, observaciones } = req.body;

    // Validaciones datos obligatorios 
    if (!usuarioId || nivelDolor === undefined || !sintomas || !presionArterial || !pulso || !temperatura) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'Faltan datos clínicos obligatorios en el formulario.' 
      });
    }

    let estadoCalculado = 'Estable';
    if (temperatura >= 38.0 || pulso >= 100 || nivelDolor >= 8) {
      estadoCalculado = 'Crítico';
    }

    // Guardar usando Prisma
    const nuevoRegistro = await prisma.registroSalud.create({
      data: {
        usuarioId,
        nivelDolor: Number(nivelDolor),
        sintomas,
        presionArterial,
        pulso: Number(pulso),
        temperatura: Number(temperatura),
        observaciones,
        estado: estadoCalculado
      }
    });

    // Enviar email si estado es Crítico
    if (estadoCalculado === 'Crítico') {
      const paciente = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        include: { medico: { select: { correo: true, nombre: true } } }
      }) as any;

      if (paciente?.medico?.correo) {
        await enviarAlertaCritico(paciente.nombre, sintomas, paciente.medico.correo);
      }
    }

    res.status(201).json({
      ok: true,
      mensaje: 'Registro de salud guardado con éxito.',
      data: nuevoRegistro
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error interno en el servidor al procesar los signos vitales.' 
    });
  }
};

export const obtenerRegistrosPorPaciente = async (req: Request, res: Response): Promise<any> => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId || typeof usuarioId !== 'string') {
      return res.status(400).json({ ok: false, mensaje: 'El ID del usuario no es válido.' });
    }

    const registros = await prisma.registroSalud.findMany({
      where: { usuarioId },
      orderBy: { fechaCreacion: 'desc' }
    });

    const ultimoRegistro = registros.length > 0 ? registros[0] : null;

    res.status(200).json({
      ok: true,
      historial: registros,       
      ultimo: ultimoRegistro      
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      ok: false, 
      mensaje: 'Error al obtener el historial médico.' 
    });
  }
};