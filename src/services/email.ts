import nodemailer from 'nodemailer';

export default async ({
    from, to, subject, text, html }: {
        from: string, to: string, subject: string, text: string, html: string
    }) => {

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    });

    console.log(transporter);

    const info = await transporter.sendMail({
        from: `inShare <${from}>`,
        to, subject, text, html
    });

    console.log(info);
};
