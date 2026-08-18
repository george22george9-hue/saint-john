'use client';

import { useState, useEffect } from 'react';
import { Settings, DynamicActivity } from '@/types';
import { formatTextWithLinks } from '@/lib/formatTextWithLinks';

interface ProgramsProps {
  initialSettings?: Settings;
}

export default function Programs({ initialSettings }: ProgramsProps) {
  const [activeTab, setActiveTab] = useState<'friday' | 'sunday' | 'dynamic'>('friday');
  const [settings, setSettings] = useState<Settings>(initialSettings || {});
  const [dynamicActivities, setDynamicActivities] = useState<DynamicActivity[]>([]);
  const [loading, setLoading] = useState(!initialSettings);

  useEffect(() => {
    // Fetch settings
    if (!initialSettings || Object.keys(initialSettings).length === 0) {
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          setSettings(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching settings:', err);
          setLoading(false);
        });
    }

    // Fetch dynamic active activities
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDynamicActivities(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching dynamic activities:', err);
      });
  }, [initialSettings]);

  const sundayScheduleLines = settings.sunday_schedule
    ? settings.sunday_schedule.split('\n')
    : [];

  return (
    <section id="programs" className="section-padding bg-light-gray relative-z">
      <div className="container">
        <h2 className="section-title gsap-fade-up">برامجنا ومواعيدنا</h2>

        <div className="row justify-content-center gsap-fade-up">
          <div className="col-lg-10">
            <div className="glass-card p-0 overflow-hidden">
              {/* Tabs Navigation */}
              <ul
                className="nav nav-tabs custom-tabs nav-fill"
                id="programTabs"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'friday' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('friday')}
                  >
                    <i className="fas fa-cross me-2 text-accent"></i> اجتماع يوم الجمعة
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'sunday' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('sunday')}
                  >
                    <i className="fas fa-sun me-2 text-accent"></i> النشاط الصيفي (الأحد)
                  </button>
                </li>
                {dynamicActivities.length > 0 && (
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'dynamic' ? 'active' : ''}`}
                      type="button"
                      onClick={() => setActiveTab('dynamic')}
                    >
                      <i className="fas fa-star me-2 text-accent"></i> الأنشطة والفعاليات الخاصة ({dynamicActivities.length})
                    </button>
                  </li>
                )}
              </ul>

              {/* Tabs Content */}
              <div className="tab-content p-4 p-md-5" id="programTabsContent">
                {/* Friday Tab */}
                {activeTab === 'friday' && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="text-center mb-4">
                      <h4 className="text-primary fw-bold" id="friday-time">
                        {loading ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm text-primary me-2"
                              role="status"
                            ></div>
                            جاري التحميل...
                          </>
                        ) : (
                          <>
                            <i className="far fa-clock ms-2"></i>
                            {settings.friday_time ||
                              'كل يوم جمعة الساعة 7:00 مساءً'}
                          </>
                        )}
                      </h4>
                      <p className="text-muted dark:text-gray-300">
                        وقت مخصص للنمو الروحي والشركة المحبة.. مستنيينك!
                      </p>
                    </div>
                    <div className="row g-4 mt-2">
                      <div className="col-md-6">
                        <div className="d-flex hover-lift">
                          <div className="text-accent fs-2 ms-3">
                            <i className="fas fa-music"></i>
                          </div>
                          <div>
                            <h5 className="fw-bold">صلاة وترانيم</h5>
                            <p className="text-muted dark:text-gray-300 mb-0">
                              أوقات صلاة عميقة وترانيم ترفع القلب.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex hover-lift">
                          <div className="text-accent fs-2 ms-3">
                            <i className="fas fa-book-open"></i>
                          </div>
                          <div>
                            <h5 className="fw-bold">كلمة روحية</h5>
                            <p className="text-muted dark:text-gray-300 mb-0">
                              كلمة تمس واقع وتحديات الشباب.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex hover-lift">
                          <div className="text-accent fs-2 ms-3">
                            <i className="fas fa-gamepad"></i>
                          </div>
                          <div>
                            <h5 className="fw-bold">مسابقات وتفاعل</h5>
                            <p className="text-muted dark:text-gray-300 mb-0">
                              ألعاب تفاعلية وجوائز مميزة.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex hover-lift">
                          <div className="text-accent fs-2 ms-3">
                            <i className="fas fa-users"></i>
                          </div>
                          <div>
                            <h5 className="fw-bold">أنشطة وأمسيات</h5>
                            <p className="text-muted dark:text-gray-300 mb-0">
                              فقرات اجتماعية وأيام روحية وحفلات.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sunday Tab */}
                {activeTab === 'sunday' && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="text-center mb-4">
                      <h4 className="text-primary fw-bold">
                        النشاط الصيفي التكاملي (170 دقيقة)
                      </h4>
                      <p className="text-muted dark:text-gray-300">
                        برنامج يجمع بين المعرفة اللاهوتية وتطوير المهارات.
                      </p>
                    </div>
                    <div className="table-responsive rounded-3 border bg-white">
                      <table className="table table-custom mb-0 text-center bg-white">
                        <tbody id="sunday-schedule">
                          {loading ? (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-muted text-center py-4"
                                style={{ color: '#475569' }}
                              >
                                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                جاري تحميل الجدول...
                              </td>
                            </tr>
                          ) : sundayScheduleLines.length === 0 ? (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-center text-muted py-4"
                                style={{ color: '#475569' }}
                              >
                                لم يتم إضافة جدول بعد.
                              </td>
                            </tr>
                          ) : (
                            sundayScheduleLines.map((line, idx) => {
                              const parts = line
                                .split('-')
                                .map((p) => p.trim());
                              if (parts.length < 3) return null;
                              return (
                                <tr key={idx} className="bg-white">
                                  <td className="fw-bold fs-5" style={{ color: '#0f172a' }}>
                                    {parts[0]}
                                  </td>
                                  <td className="fw-bold fs-5" style={{ color: '#0f1c3f' }}>
                                    {parts[1]}
                                  </td>
                                  <td className="text-start" style={{ color: '#475569' }}>
                                    {parts.slice(2).join(' - ')}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Dynamic Activities Tab */}
                {activeTab === 'dynamic' && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="text-center mb-4">
                      <h4 className="text-primary fw-bold">الأنشطة والفعاليات الخاصة القادمة</h4>
                      <p className="text-muted dark:text-gray-300">
                        تابع أحدث الرحلات والمؤتمرات والكورسات والاجتماعات الخاصة
                      </p>
                    </div>
                    <div className="row g-4">
                      {dynamicActivities.map((act) => (
                        <div key={act.id} className="col-md-6">
                          <div className="card h-100 p-4 border-0 shadow-sm rounded-4" style={{ backgroundColor: 'var(--bg-surface)', border: 'var(--glass-border)' }}>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <span className="badge bg-accent text-dark fw-bold px-3 py-2 rounded-pill">
                                {act.category || 'نشاط'}
                              </span>
                              {act.date && (
                                <span className="text-muted small">
                                  <i className="far fa-calendar-alt me-1"></i> {act.date}
                                </span>
                              )}
                            </div>
                            <h5 className="fw-bold text-primary dark:text-white mt-2 mb-1">{act.title}</h5>
                            {act.subtitle && (
                              <h6 className="text-accent small fw-bold mb-3">{act.subtitle}</h6>
                            )}
                            {act.time && (
                              <div className="small text-muted mb-2">
                                <i className="far fa-clock me-1"></i> {act.time}
                              </div>
                            )}
                            {act.content && (
                              <p className="text-muted dark:text-gray-300 mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7' }}>
                                {formatTextWithLinks(act.content)}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

