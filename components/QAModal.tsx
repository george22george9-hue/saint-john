'use client';

import { useState, FormEvent } from 'react';

interface QAModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QAModal({ isOpen, onClose }: QAModalProps) {
  const [name, setName] = useState('');
  const [hymnRequest, setHymnRequest] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, hymnRequest, message }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.details || 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.'
        );
      }

      setIsSubmitted(true);
      setName('');
      setHymnRequest('');
      setMessage('');

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setIsSubmitted(false);
        }, 300);
      }, 3000);
    } catch (err: any) {
      console.error('[QAModal Error]:', err);
      setErrorMsg(err.message || 'عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 p-2">
          <div className="modal-header border-0 pb-0">
            <h4 className="modal-title fw-bold text-primary dark:text-white">
              <i className="fas fa-envelope-open-text me-2 text-accent"></i>{' '}
              شاركونا أسئلتكم واقتراحاتكم
            </h4>
            <button
              type="button"
              className="btn-close hover-magnet"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body px-4 pb-4 pt-3">
            <p className="text-muted dark:text-gray-300 mb-4">
              في سرية تامة، اترك سؤالك الروحي، العقيدي، أو اقتراح للخدمة، وسنجيب
              عليه بحب.
            </p>

            {errorMsg && (
              <div className="alert alert-danger mb-3 text-start" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {errorMsg}
              </div>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    id="name"
                    placeholder="الاسم"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="name" className="text-gray-600 dark:text-gray-300">
                    الاسم (اختياري للسرية)
                  </label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    id="hymn"
                    placeholder="ترنيمة"
                    value={hymnRequest}
                    onChange={(e) => setHymnRequest(e.target.value)}
                  />
                  <label htmlFor="hymn" className="text-gray-600 dark:text-gray-300">
                    تحب نقول ترنيمة إيه سوا؟
                  </label>
                </div>
                <div className="form-floating mb-4">
                  <textarea
                    className="form-control text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                    id="message"
                    placeholder="السؤال"
                    style={{ height: '120px' }}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <label htmlFor="message" className="text-gray-600 dark:text-gray-300">
                    عندك سؤال عقيدي أو شخصي أو اقتراح للخدمة؟ *
                  </label>
                </div>

                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn btn-primary-custom py-3 fs-5 hover-magnet"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i> جاري
                        الإرسال...
                      </>
                    ) : (
                      <>
                        إرسال <i className="fas fa-paper-plane ms-2"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div
                className="alert alert-success mt-4 text-center rounded-3 border-0 shadow-sm"
                role="alert"
              >
                <i className="fas fa-check-circle fs-2 mb-2 text-success"></i>
                <br />
                <strong>تم إرسال رسالتك بنجاح!</strong>
                <br /> شكراً لتواصلك معانا.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
