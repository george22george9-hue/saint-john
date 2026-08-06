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

      if (!response.ok) throw new Error('Failed to submit');

      setIsSubmitted(true);

      setTimeout(() => {
        onClose();
        setTimeout(() => {
          setName('');
          setHymnRequest('');
          setMessage('');
          setIsSubmitted(false);
        }, 300);
      }, 3000);
    } catch (err) {
      console.error(err);
      setErrorMsg('عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.');
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
            <h4 className="modal-title fw-bold text-primary">
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
            <p className="text-muted mb-4">
              في سرية تامة، اترك سؤالك الروحي، العقيدي، أو اقتراح للخدمة، وسنجيب
              عليه بحب.
            </p>

            {errorMsg && (
              <div className="alert alert-danger mb-3" role="alert">
                {errorMsg}
              </div>
            )}

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="الاسم"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <label htmlFor="name">الاسم (اختياري للسرية)</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="hymn"
                    placeholder="ترنيمة"
                    value={hymnRequest}
                    onChange={(e) => setHymnRequest(e.target.value)}
                  />
                  <label htmlFor="hymn">تحب نقول ترنيمة إيه سوا؟</label>
                </div>
                <div className="form-floating mb-4">
                  <textarea
                    className="form-control"
                    id="message"
                    placeholder="السؤال"
                    style={{ height: '120px' }}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                  <label htmlFor="message">
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
                <i className="fas fa-check-circle fs-2 mb-2"></i>
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
