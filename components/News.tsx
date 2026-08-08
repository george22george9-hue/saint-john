'use client';

import { useEffect, useState } from 'react';
import { Announcement } from '@/types';

interface NewsProps {
  initialAnnouncements?: Announcement[];
}

export default function News({ initialAnnouncements }: NewsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    initialAnnouncements || []
  );
  const [loading, setLoading] = useState(!initialAnnouncements);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (initialAnnouncements && initialAnnouncements.length > 0) return;

    fetch('/api/announcements')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching announcements:', err);
        setError(true);
        setLoading(false);
      });
  }, [initialAnnouncements]);

  return (
    <section id="news" className="section-padding news-section relative-z">
      <div className="container">
        <h2 className="section-title gsap-fade-up">أحدث الإعلانات والنشاطات</h2>
        <p className="text-center text-muted dark:text-gray-300 mb-5 gsap-fade-up">
          عيش معانا لحظة بلحظة
        </p>

        <div className="row g-4" id="dynamic-updates">
          {loading ? (
            <div className="col-12 text-center py-5">
              <div
                className="spinner-border text-accent"
                style={{ width: '3rem', height: '3rem' }}
                role="status"
              ></div>
            </div>
          ) : error ? (
            <div className="col-12 text-center text-danger">
              حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة لاحقاً.
            </div>
          ) : announcements.length === 0 ? (
            <div className="col-12 text-center text-muted dark:text-gray-300 py-5">
              <i className="far fa-calendar-times fs-1 mb-3"></i>
              <p>لا توجد أخبار أو نشاطات في الوقت الحالي.</p>
            </div>
          ) : (
            announcements.map((ann, index) => {
              const delay = (index % 3) * 150;
              return (
                <div
                  key={ann.id || index}
                  className="col-md-6 col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay={delay}
                >
                  <div className="update-card text-start">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="badge bg-accent text-dark rounded-pill px-3 py-2 fw-bold">
                        <i className="far fa-calendar-alt me-1"></i> {ann.date}
                      </span>
                    </div>
                    <h4 className="mb-3 fw-bold">{ann.title}</h4>
                    <p
                      className="text-muted dark:text-gray-300 mb-0"
                      style={{ lineHeight: '1.8' }}
                    >
                      {ann.description}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
