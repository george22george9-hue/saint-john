'use client';

import { useState, FormEvent } from 'react';
import { buildPaizoWhatsAppUrl } from '@/lib/paizoWhatsApp';

export default function DesignRequestForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [requestType, setRequestType] = useState('شهادة تقدير');
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');

  const [submittedMsg, setSubmittedMsg] = useState<string | null>(null);

  const directWhatsappUrl = buildPaizoWhatsAppUrl('design');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmittedMsg(null);

    // Build WhatsApp message strictly from string values (NEVER pass Event objects)
    const whatsappUrl = buildPaizoWhatsAppUrl('form', {
      name,
      phone,
      requestType,
      eventName,
      description,
      targetDate,
      notes,
    });

    // Open WhatsApp directly without any database or network request
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    setSubmittedMsg('تم تجهيز طلبك وسيفتح الواتساب مباشرة لإرسال البيانات كرسالة جاهزة! 🚀');
  };

  return (
    <div className="space-y-8">
      {/* WhatsApp Quick Order & Shipping Banner */}
      <div className="rounded-3xl p-6 md:p-8 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden text-center md:text-start">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="row align-items-center g-4 relative-z">
          <div className="col-lg-8">
            <div className="flex flex-wrap items-center justify-center justify-lg-start gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm">
                🚚 متاح الشحن
              </span>
              <span className="text-slate-300 text-xs font-bold">
                متاح الشحن لتوصيل طلبك بسهولة لأي مكان.
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
              الطلب المباشر عبر واتساب
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-0">
              يقوم فريق PAIZO بتصاميم وتنفيذ الشهادات، البوسترات، وتصاميم الفعاليات والسوشيال ميديا مع إمكانية الشحن والتوصيل.
            </p>

            {/* Supported Design Types Pills */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center justify-lg-start">
              {['شهادات تقدير', 'بوسترات', 'تصميمات فعاليات', 'تصميمات سوشيال ميديا', 'تصميمات مخصصة', 'تنفيذ الطلبات'].map((item, idx) => (
                <span key={idx} className="px-3 py-1 rounded-lg bg-slate-800/90 text-slate-200 text-xs font-semibold border border-slate-700">
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          <div className="col-lg-4 text-center flex flex-col items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-gold">
              <span>🚚 متاح الشحن</span>
            </div>

            <a
              href={directWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="paizo-whatsapp-btn w-full no-underline"
              style={{ textDecoration: 'none' }}
            >
              <i className="fab fa-whatsapp text-2xl"></i>
              <span>اطلب الآن عبر واتساب</span>
            </a>
          </div>
        </div>
      </div>

      {/* Design Details Form - Submits directly to WhatsApp */}
      <div className="glass-card p-6 md:p-8 rounded-3xl border border-amber-400/30 bg-slate-900/80 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold border border-amber-500/40">
            <i className="fas fa-magic"></i>
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">تفاصيل طلب التصميم</h3>
            <p className="text-slate-400 text-sm mb-0">اكتب بيانات طلبك وسيتم فتح الواتساب مباشرة محمل بالتفاصيل</p>
          </div>
        </div>

        {/* Notice regarding images */}
        <div className="p-3.5 mb-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
          <i className="fas fa-info-circle text-amber-400 fs-6"></i>
          <span>بعد فتح الواتساب، يمكنك إرفاق الصور أو الملفات المرجعية مع الرسالة بسهولة.</span>
        </div>

        {submittedMsg && (
          <div className="p-4 mb-6 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2">
            <i className="fas fa-check-circle fs-5"></i>
            {submittedMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                الاسم الكامل <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: يوحنا عادل"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                رقم التواصل / الواتساب <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="012XXXXXXXX"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                نوع الطلب <span className="text-rose-400">*</span>
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-amber-400 text-sm transition-all"
              >
                <option value="شهادة تقدير">شهادة تقدير</option>
                <option value="بوستر">بوستر / ملصق إعلاني</option>
                <option value="تصميم سوشيال ميديا">تصميم سوشيال ميديا (فيسبوك / إنستغرام)</option>
                <option value="تصميم فعالية">تصميم فعالية / مؤتمر كامل</option>
                <option value="تصميم مخصص">تصميم مخصص</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                اسم المناسبة / الاجتماع
              </label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="مثال: مؤتمر الشباب الصيفي / اجتماع الجمعة"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-bold mb-2">
              وصف المطلوب بالتفصيل <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب النصوص المطلوبة، الألوان المفضلة، الفكرة العامة للتصميم..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                الموعد المطلوب لتسلم التصميم
              </label>
              <input
                type="text"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                placeholder="مثال: الجمعة القادمة / خلال 3 أيام"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-bold mb-2">
                ملاحظات إضافية
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي تفاصيل أخرى ترغب في إضافتها..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="paizo-whatsapp-btn w-full mt-4"
          >
            <i className="fab fa-whatsapp text-2xl"></i>
            <span>إرسال الطلب عبر واتساب</span>
          </button>
        </form>
      </div>
    </div>
  );
}
