import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const enviarAlertaCritico = async (nombrePaciente: string, sintomas: string, medicoCorreo: string) => {
  try {
    await transporter.sendMail({
      from: `"Telemedicina" <${process.env.EMAIL_USER}>`,
      to: medicoCorreo,
      subject: `⚠️ Alerta: Paciente ${nombrePaciente} en Estado Crítico`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #e53935; border-radius: 10px;">
          <h2 style="color: #e53935;">⚠️ Alerta de Estado Crítico</h2>
          <p><strong>Paciente:</strong> ${nombrePaciente}</p>
          <p><strong>Síntomas reportados:</strong> ${sintomas}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES')}</p>
          <hr/>
          <p style="color: #666; font-size: 12px;">Sistema de Telemedicina Santo Domingo</p>
        </div>
      `
    });
    console.log(`Email de alerta enviado a ${medicoCorreo}`);
  } catch (error) {
    console.error('Error al enviar email:', error);
  }
};