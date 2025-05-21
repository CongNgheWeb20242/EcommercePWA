// Tạm thời comment lại Resend email service
/*
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendResetPasswordEmail = async (toEmail, resetUrl) => {
  return await resend.emails.send({
    from: 'EcommercePWA <onboarding@resend.dev>',
    to: toEmail,
    subject: 'Đặt lại mật khẩu',
    html: `<p>Vui lòng bấm vào liên kết sau để đặt lại mật khẩu:</p>
        <a href="${resetUrl}">Đặt lại mật khẩu</a>`,
  });
};
*/