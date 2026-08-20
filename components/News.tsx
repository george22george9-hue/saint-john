'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Announcement } from '@/types';
import { formatTextWithLinks } from '@/lib/formatTextWithLinks';

interface NewsProps {
  initialAnnouncements?: Announcement[];
}

export default function News({ initialAnnouncements }: NewsProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(
    initialAnnouncements || []
  );
  const [loading, setLoading] = useState(!initialAnnouncements);
  const [error, setError] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (initialAnnouncements && initialAnnouncements.length > 0) return;

    fetch('/api/announcements', { cache: 'no-store' })
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
        <h2 className="section-title gsap-fade-up">أحدث الإعلانات والمنشورات</h2>
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
              حدث خطأ أثناء تحميل المنشورات. يرجى المحاولة لاحقاً.
            </div>
          ) : announcements.length === 0 ? (
            <div className="col-12 text-center text-muted dark:text-gray-300 py-5">
              <i className="far fa-newspaper fs-1 mb-3"></i>
              <p>لا توجد منشورات أو إعلانات في الوقت الحالي.</p>
            </div>
          ) : (
            announcements.map((ann, index) => {
              const delay = (index % 3) * 150;
              const hasImage = !!ann.image_url;
              const hasTitle = !!ann.title && ann.title.trim().length > 0;
              const hasDescription = !!ann.description && ann.description.trim().length > 0;

              return (
                <div
                  key={ann.id || index}
                  className="col-md-6 col-lg-4"
                  data-aos="fade-up"
                  data-aos-delay={delay}
                >
                  <div className="update-card text-start d-flex flex-column h-100 p-0 overflow-hidden">
                    {/* Optional Post Image */}
                    {hasImage && (
                      <div
                        className="position-relative overflow-hidden cursor-pointer"
                        style={{ height: '220px', backgroundColor: 'rgba(0,0,0,0.2)' }}
                        onClick={() => setLightboxImage(ann.image_url || null)}
                      >
                        <Image
                          src={ann.image_url!}
                          alt={ann.title || 'صورة المنشور'}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="hover-zoom"
                          style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
                        />
                        <div
                          className="position-absolute bottom-0 end-0 m-2 badge bg-dark text-white rounded-circle p-2"
                          style={{ opacity: 0.8 }}
                          title="عرض بحجم كامل"
                        >
                          <i className="fas fa-search-plus"></i>
                        </div>
                      </div>
                    )}

                    {/* Card Content Body */}
                    <div className="p-4 d-flex flex-column flex-grow-1">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-accent text-dark rounded-pill px-3 py-2 fw-bold">
                          <i className="far fa-calendar-alt me-1"></i> {ann.date}
                        </span>
                      </div>

                      {hasTitle && (
                        <h4
                          className="mb-3 fw-bold"
                          style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                        >
                          {formatTextWithLinks(ann.title)}
                        </h4>
                      )}

                      {hasDescription && (
                        <p
                          className="text-muted dark:text-gray-300 mb-0 flex-grow-1"
                          style={{
                            lineHeight: '1.8',
                            whiteSpace: 'pre-wrap',
                            overflowWrap: 'anywhere',
                            wordBreak: 'break-word',
                          }}
                        >
                          {formatTextWithLinks(ann.description)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', zIndex: 10000 }}
          onClick={() => setLightboxImage(null)}
        >
          <div className="modal-dialog modal-dialog-centered modal-xl" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content bg-transparent border-0 text-center">
              <div className="modal-header border-0 justify-content-end p-2">
                <button
                  type="button"
                  className="btn-close btn-close-white fs-4"
                  aria-label="إغلاق"
                  onClick={() => setLightboxImage(null)}
                ></button>
              </div>
              <div className="modal-body p-2 d-flex justify-content-center align-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={lightboxImage}
                  alt="معاينة المكبرة"
                  className="img-fluid rounded-3 shadow-lg"
                  style={{ maxHeight: '85vh', objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
