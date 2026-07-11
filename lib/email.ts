import { Resend } from 'resend';
import { formatMoney } from '@/lib/catalog';

type OrderEmailItem = {
  name: string;
  quantity: number;
  unit_price_minor: number;
};

type OrderEmailData = {
  email: string;
  full_name: string;
  reference: string;
  total_minor: number;
  currency: string;
  order_items: OrderEmailItem[];
};

type ContactEmailData = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const client = () => (process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null);

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#039;',
      '"': '&quot;',
    };
    return map[character];
  });
}

export async function sendOrderEmail(order: OrderEmailData) {
  const resend = client();
  if (!resend) return;

  const rows = order.order_items
    .map(
      (item) => `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #eee">${escapeHtml(item.name)} × ${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #eee;text-align:right">${formatMoney(item.unit_price_minor * item.quantity, order.currency)}</td>
      </tr>`,
    )
    .join('');

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'FRUTÉO <onboarding@resend.dev>',
    to: order.email,
    subject: `FRUTÉO order ${order.reference} confirmed`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto;color:#24301f">
      <h1 style="color:#ef6a12">Payment received</h1>
      <p>Hello ${escapeHtml(order.full_name)}, your order <strong>${escapeHtml(order.reference)}</strong> is confirmed.</p>
      <table style="width:100%;border-collapse:collapse">${rows}</table>
      <p style="font-size:18px"><strong>Total: ${formatMoney(order.total_minor, order.currency)}</strong></p>
      <p>We will email you again when the order status changes.</p>
    </div>`,
  });
}

export async function sendContactEmail(input: ContactEmailData) {
  const resend = client();
  const recipient = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!resend || !recipient) return;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || 'FRUTÉO <onboarding@resend.dev>',
    to: recipient,
    replyTo: input.email,
    subject: `Website message: ${input.subject}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:auto">
      <h2>${escapeHtml(input.subject)}</h2>
      <p><strong>${escapeHtml(input.fullName)}</strong> (${escapeHtml(input.email)})</p>
      <p>${escapeHtml(input.message).replace(/\n/g, '<br>')}</p>
    </div>`,
  });
}
