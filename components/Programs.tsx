'use client';

import { useState, useEffect } from 'react';
import { Settings } from '@/types';

interface ProgramsProps {
  initialSettings?: Settings;
}

export default function Programs({ initialSettings }: ProgramsProps) {
  const [activeTab, setActiveTab] = useState<'friday' | 'sunday'>('friday');
  const [settings, setSettings] = useState<Settings>(initialSettings || {});
  const [loading, setLoading] = useState(!initialSettings);

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) return;

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
                    <i className="fas fa-cross me-2 text-accent"></i> اجتماع يوم
                    الجمعة
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'sunday' ? 'active' : ''}`}
                    type="button"
                    onClick={() => setActiveTab('sunday')}
                  >
                    <i className="fas fa-sun me-2 text-accent"></i> النشاط الصيفي
                    (الأحد)
                  </button>
                </li>
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
                      <p className="text-muted">
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
                            <p className="text-muted mb-0">
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
                            <p className="text-muted mb-0">
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
                            <p className="text-muted mb-0">
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
                            <p className="text-muted mb-0">
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
                      <p className="text-muted">
                        برنامج يجمع بين المعرفة اللاهوتية وتطوير المهارات.
                      </p>
                    </div>
                    <div className="table-responsive rounded-3 border">
                      <table className="table table-custom mb-0 text-center">
                        <tbody id="sunday-schedule">
                          {loading ? (
                            <tr>
                              <td
                                colSpan={3}
                                className="text-muted text-center py-4"
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
                                <tr key={idx}>
                                  <td className="fw-bold fs-5">{parts[0]}</td>
                                  <td className="text-primary fw-bold fs-5">
                                    {parts[1]}
                                  </td>
                                  <td className="text-start text-muted">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
