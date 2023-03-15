const nodemailer= require("nodemailer");

const emailRegistro= async (datos)=>{
    const {email, nombre, token}= datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info= await transport.sendMail({
        from: ' "Panaderia - blablabla" <cuentas@panaderia.com>',
        to: email,
        subject: "Panaderia - Comprueba tu Cuenta",
        text: "Comprueba tu cuenta en Panaderia",
        html: `
        <p>Hola: ${nombre} Comprueba tu cuenta</p>
        <p>Tu cuenta ya esta casi lista, solo debes comprobarla en el siguiente enlace:</p>
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Validar Cuenta</a>
        <p>Si tu no creaste esta cuenta, porfavor has caso omiso</p>
        `,
    });
};

const emailOlvidePassword= async (datos)=>{
    const {email, nombre, token}= datos;

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const info= await transport.sendMail({
        from: ' "Panaderia - blablabla" <cuentas@panaderia.com>',
        to: email,
        subject: "Panaderia - Reestablece tu Password",
        text: "Reestablece tu Password",
        html: `
        <p>Hola: ${nombre} Has solicitado reestablecer tu Password</p>
        <p>Da click en el siguiente enlace para generar un nuevo Password enlace:</p>
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a>
        <p>Si tu no solicitaste esto, porfavor has caso omiso</p>
        `,
    });
};

module.exports= {emailRegistro, emailOlvidePassword}