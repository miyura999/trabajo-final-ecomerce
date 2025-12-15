// resend.config.js
const { Resend } = require('resend');

// Inicializar Resend con tu API key
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Configuración de correos
 */
const emailConfig = {
  from: 'Acme <onboarding@resend.dev>',
  fromName: 'Ecommerce',
  replyTo: 'ecommerce.exampletosend@gmail.com',
};

/**
 * Enviar correo de recuperación de contraseña
 */
async function sendPasswordResetEmail(origin, email, resetToken) {
  try {
    const resetLink = `${origin}/reset-password/${resetToken}`;

    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to: [...email],
      subject: 'Recuperación de contraseña',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperación de contraseña</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    
                    <!-- Header con color indigo -->
                    <tr>
                      <td style="background-color: #4f46e5; padding: 40px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
                          Recuperación de contraseña
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Contenido -->
                    <tr>
                      <td style="padding: 40px 40px 20px 40px;">
                        <p style="color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                          Hola,
                        </p>
                        <p style="color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">
                          Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.
                        </p>
                        <p style="color: #374151; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">
                          Para restablecer tu contraseña, haz clic en el siguiente botón:
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Botón -->
                    <tr>
                      <td style="padding: 0 40px 30px 40px; text-align: center;">
                        <a href="${resetLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.3);">
                          Restablecer contraseña
                        </a>
                      </td>
                    </tr>
                    
                    <!-- Link alternativo -->
                    <tr>
                      <td style="padding: 0 40px 30px 40px;">
                        <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0 0 10px 0;">
                          Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:
                        </p>
                        <p style="color: #4f46e5; font-size: 14px; line-height: 20px; margin: 0; word-break: break-all;">
                          ${resetLink}
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Advertencia de seguridad -->
                    <tr>
                      <td style="padding: 0 40px 30px 40px; background-color: #fef3c7; border-left: 4px solid #f59e0b; margin: 20px;">
                        <p style="color: #92400e; font-size: 14px; line-height: 20px; margin: 15px 0;">
                          ⚠️ <strong>Importante:</strong> Este enlace expirará en 1 hora por motivos de seguridad.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                        <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin: 0 0 10px 0; text-align: center;">
                          Este correo fue enviado desde <strong>Tu App</strong>
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; line-height: 18px; margin: 0; text-align: center;">
                          Si tienes alguna pregunta, contáctanos en soporte@tudominio.com
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
      // Versión de texto plano alternativa
      text: `
Recuperación de contraseña

Hola,

Recibimos una solicitud para restablecer la contraseña de tu cuenta. Si no realizaste esta solicitud, puedes ignorar este correo de forma segura.

Para restablecer tu contraseña, copia y pega el siguiente enlace en tu navegador:
${resetLink}

⚠️ Importante: Este enlace expirará en 1 hora por motivos de seguridad.

---
Este correo fue enviado desde Tu App
Si tienes alguna pregunta, contáctanos en soporte@tudominio.com
      `.trim(),
    });

    if (error) {
      console.error('Error al enviar correo:', error);
      return { success: false, error };
    }

    console.log('Correo enviado exitosamente:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error al enviar correo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función genérica para enviar cualquier correo
 */
async function sendEmail({ to, subject, html, text }) {
  try {
    const { data, error } = await resend.emails.send({
      from: emailConfig.from,
      to,
      subject,
      html,
      text,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendPasswordResetEmail, sendEmail
};