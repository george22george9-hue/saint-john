/**
 * Helper utility to build pre-filled Arabic WhatsApp URLs for PAIZO orders
 * Target WhatsApp Number: 201202074649
 */

export const PAIZO_WHATSAPP_NUMBER = '201202074649';
export const PAIZO_WHATSAPP_DISPLAY_NUMBER = '01202074649';

export interface PaizoDesignFormData {
  name: string;
  phone: string;
  requestType: string;
  eventName?: string;
  description: string;
  targetDate?: string;
  notes?: string;
}

export function buildPaizoWhatsAppUrl(
  type: 'game' | 'study' | 'workshop' | 'infographic' | 'design' | 'custom' | 'form',
  itemNameOrForm?: string | PaizoDesignFormData
): string {
  let messageLines: string[] = [];

  if (type === 'form' && typeof itemNameOrForm === 'object') {
    const data = itemNameOrForm as PaizoDesignFormData;
    messageLines = [
      'مرحبًا فريق PAIZO 👋',
      'أريد تقديم طلب تصميم/تنفيذ جديد.',
      '',
      `الاسم: ${data.name || 'غير محدد'}`,
      `رقم التواصل: ${data.phone || 'غير محدد'}`,
      `نوع الطلب: ${data.requestType || 'غير محدد'}`,
      data.eventName ? `اسم المناسبة: ${data.eventName}` : null,
      `وصف المطلوب: ${data.description || 'غير محدد'}`,
      data.targetDate ? `الموعد المطلوب: ${data.targetDate}` : null,
      data.notes ? `ملاحظات: ${data.notes}` : null,
      '',
      '🚚 أريد معرفة تفاصيل الشحن والتوصيل.',
    ].filter((line): line is string => line !== null);
  } else {
    const name = typeof itemNameOrForm === 'string' ? itemNameOrForm : '';
    switch (type) {
      case 'game':
        messageLines = [
          'مرحبًا فريق PAIZO 👋',
          `أريد طلب لعبة: ${name}`,
          'الطلب من خلال موقع اجتماع مارجرجس بسندبيس.',
        ];
        break;
      case 'study':
        messageLines = [
          'مرحبًا فريق PAIZO 👋',
          `أريد طلب دراسة كتابية: ${name}`,
          'الطلب من خلال موقع اجتماع مارجرجس بسندبيس.',
        ];
        break;
      case 'workshop':
        messageLines = [
          'مرحبًا فريق PAIZO 👋',
          `أريد الاستفسار/الحجز في ورشة: ${name}`,
          'الطلب من خلال موقع اجتماع مارجرجس بسندبيس.',
        ];
        break;
      case 'infographic':
        messageLines = [
          'مرحبًا فريق PAIZO 👋',
          `أريد الاستفسار عن: ${name}`,
          'الطلب من خلال موقع اجتماع مارجرجس بسندبيس.',
        ];
        break;
      case 'design':
        messageLines = [
          'مرحبًا فريق PAIZO 👋',
          'أريد تقديم طلب تصميم/تنفيذ جديد من PAIZO.',
          'الطلب من خلال موقع اجتماع مارجرجس بسندبيس.',
        ];
        break;
      default:
        messageLines = [
          'مرحبًا فريق PAIZO 👋',
          `أريد الاستفسار أو الطلب من PAIZO${name ? `: ${name}` : ''}`,
          'الطلب من خلال موقع اجتماع مارجرجس بسندبيس.',
        ];
    }
  }

  const fullText = messageLines.join('\n');
  return `https://wa.me/${PAIZO_WHATSAPP_NUMBER}?text=${encodeURIComponent(fullText)}`;
}
