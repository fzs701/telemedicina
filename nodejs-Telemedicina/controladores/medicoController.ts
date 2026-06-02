import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const obtenerPacientesCriticos = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = req.params.id as string;

    //Buscamos a los pacientes 
    const pacientesBD = await prisma.usuario.findMany({
      where: {
        medicoId: id,
        rol: 'paciente'
      },
      select: {
        id: true,
        rut: true,
        nombre: true,
        registros: {
          orderBy: {
            fechaCreacion: 'desc' 
          },
          take: 1 
        }
      }
    });

    //  estado REAL calculado en la base de dato
    const pacientesFormateados = pacientesBD.map(p => {
      const ultimoControl = p.registros[0];
      return {
        id: p.id,
        rut: p.rut,
        nombre: p.nombre,
        // Si no tiene registros, asumimos 'Estable' por defecto
        estado: ultimoControl ? ultimoControl.estado : 'Estable', 
        fechaCita: 'Sin registrar'
      };
    });

    pacientesFormateados.sort((a, b) => {
      if (a.estado === 'Crítico' && b.estado !== 'Crítico') return -1;
      if (a.estado !== 'Crítico' && b.estado === 'Crítico') return 1;
      return 0;
    });

    return res.status(200).json({
      ok: true,
      pacientes: pacientesFormateados
    });

  } catch (error) {
    console.error("Error real en la base de datos:", error);
    return res.status(500).json({
      ok: false,
      mensaje: 'Error interno del servidor al obtener el dashboard dinámico.'
    });
  }
};