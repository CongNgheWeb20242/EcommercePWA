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

export const sendOrderStatusEmail = async (toEmail, orderId, status) => {
  // Chuyển trạng thái sang tiếng Việt
  let statusText = '';
  if (status === 0) statusText = 'Đang chuẩn bị hàng (đơn hàng đã thanh toán thành công, đang được đóng gói/chờ giao)';
  else if (status === 1) statusText = 'Đang giao (đơn hàng đã được chuyển cho đơn vị vận chuyển, đang trên đường giao tới bạn)';
  else if (status === 2) statusText = 'Đã giao (đơn hàng đã được giao thành công tới bạn)';
  else statusText = 'Trạng thái không xác định';

  return await resend.emails.send({
    from: 'EcommercePWA <onboarding@resend.dev>',
    to: toEmail,
    subject: `Cập nhật trạng thái đơn hàng #${orderId}`,
    html: `
      <p>Xin chào,</p>
      <p>Đơn hàng <b>#${orderId}</b> của bạn vừa được cập nhật trạng thái:</p>
      <p><b>${statusText}</b></p>
      <p>Trân trọng,<br/>Đội ngũ EcommercePWA</p>
    `,
  });
};
