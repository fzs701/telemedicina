import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_pucv_2026';

// registro
export const registrarUsuario = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rut, nombre, correo, contrasena, rol, region, comuna, medicoId } = req.body;

    // Validación básica de campos obligatorios 
    if (!rut || !nombre || !correo || !contrasena || !rol) {
      return res.status(400).json({ ok: false, mensaje: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el correo o rut ya existen en MySQL
    const usuarioExiste = await prisma.usuario.findFirst({
      where: { OR: [{ correo }, { rut }] }
    });

    if (usuarioExiste) {
      return res.status(400).json({ ok: false, mensaje: 'El RUT o el correo ya están registrados.' });
    }

    // Encriptar la contraseña
    const sal = await bcrypt.genSalt(10);
    const contrasenaEncriptada = await bcrypt.hash(contrasena, sal);

    // Buscar primer médico disponible para asignar al paciente
    const primerMedico = await prisma.usuario.findFirst({
      where: { rol: 'medico' }
    });

    // Guardar en la base de datos 
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        rut,
        nombre,
        correo,
        contrasena: contrasenaEncriptada,
        rol, // Puede ser "paciente" o "medico"
        region: region || null,   
        comuna: comuna || null,  
         medicoId: rol === 'paciente' ? (primerMedico?.id || null) : null
      }
    });

    res.status(201).json({
      ok: true,
      mensaje: 'Usuario registrado con éxito',
      data: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, mensaje: 'Error interno al registrar usuario.' });
  }
};

// LOGICA DE LOGIN
export const iniciarSesion = async (req: Request, res: Response): Promise<any> => {
  try {
    const { rut, contrasena } = req.body;

    if (!rut || !contrasena) {
      return res.status(400).json({ ok: false, mensaje: 'RUT y contraseña requeridos.' });
    }

    // Buscar al usuario en MySQL
    const usuario = await prisma.usuario.findUnique({ where: { rut } });
    if (!usuario) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas.' });
    }

    // Verificar si la contraseña coincide con el hash guardado
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!contrasenaValida) {
      return res.status(401).json({ ok: false, mensaje: 'Credenciales inválidas.' });
    }

    // Generar Token firmado incluyendo el rol para el control de accesos
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol, nombre: usuario.nombre },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    const usuarioIdSeguro = (usuario as any).id;

    const ultimoReg = await prisma.registroSalud.findFirst({
      where: { usuarioId: usuarioIdSeguro },
      orderBy: { fechaCreacion: 'desc' }
    }) as any;

    // Retornamos una única respuesta limpia con todo lo que tu Home necesita
    return res.status(200).json({
      ok: true,
      mensaje: 'Login correcto, ¡bienvenido!',
      token,
      usuario: { 
        nombre: (usuario as any).nombre, 
        rol: (usuario as any).rol, 
        id: usuarioIdSeguro 
      },
      clinicoEstado: ultimoReg?.estado || 'No registrado',
      clinicoSintomas: ultimoReg?.sintomas || 'Sin síntomas registrados',
      clinicoDolor: ultimoReg?.nivelDolor !== undefined && ultimoReg?.nivelDolor !== null
        ? `Nivel ${ultimoReg.nivelDolor}` 
        : 'No registrado',
      clinicoCita: 'Sin registrar',
      clinicoMensaje: ultimoReg?.estado === 'Crítico' 
        ? `${(usuario as any).nombre}, detectamos signos críticos. Registra tu presión seguido.` 
        : 'No tienes mensajes nuevos.'
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, mensaje: 'Error interno en el servidor durante el login.' });
  }
};

