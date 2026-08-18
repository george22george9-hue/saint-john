'use client';

import { useState, useEffect } from 'react';
import { Settings, DynamicActivity } from '@/types';
import { supabase } from '@/lib/supabase';
import { formatTextWithLinks } from '@/lib/formatTextWithLinks';

interface ProgramsProps {
  initialSettings?: Settings;
}

const getCategoryIcon = (category?: string | null) => {
  switch (category) {
    case 'مؤتمر':
      return 'fas fa-bullhorn';
    case 'رحلة':
      return 'fas fa-bus';
    case 'مسابقة':
      return 'fas fa-trophy';
    case 'كورس':
      return 'fas fa-graduation-cap';
    case 'اجتماع خاص':
      return 'fas fa-users';
    case 'نهضة':
      return 'fas fa-fire';
    case 'تنبيه':
      return 'fas fa-bell';
    case 'جدول جديد':
      return 'fas fa-calendar-alt';
    default:
      return 'fas fa-star';
  }
};

export default function Programs({ initialSettings }: ProgramsProps) {
  const [activeTab, setActiveTab] = useState<string>('friday');
  const [settings, setSettings] = useState<Settings>(initialSettings || {});
  const [dynamicActivities, setDynamicActivities] = useState<DynamicActivity[]>([]);
  const [loading, setLoading] = useState(!initialSettings);

  const fetchDynamicActivities = async () => {
    try {
      const res = await fetch('/api/activities', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDynamicActivities(data);
        }
      }
    } catch (err) {
      console.error('Error fetching dynamic activities:', err);
    }
  };

  useEffect(() => {
    if (!initialSettings || Object.keys(initialSettings).length === 0) {
      fetch('/api/settings', { cache: 'no-store' })
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

    fetchDynamicActivities();

    // Supabase Realtime Listener for instant updates without page refresh
    const channel = supabase
      .channel('public:dynamic_activities')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dynamic_activities' },
        () => {
          fetchDynamicActivities();
        }
      )
      .subscribe();

    const handleFocus = () => fetchDynamicActivities();
    window.addEventListener('focus', handleFocus);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('focus', handleFocus);
    };
  }, [initialSettings]);

  // Active Tab Safety Check: Fallback to 'friday' if current dynamic tab is disabled/deleted
  useEffect(() => {
    if (activeTab !== 'friday' && activeTab !== 'sunday') {
      const exists = dynamicActivities.some((act) => act.id.toString() === activeTab);
      if (!exists) {
        setActiveTab('friday');
      }
    }
  }, [dynamicActivities, activeTab]);

  const sundayScheduleLines = settings.sunday_schedule
    ? settings.sunday_schedule.split('\n')
    : [];

  const activeDynamicItem = dynamicActivities.find(
    (act) => act.id.toString() === activeTab
  );

  return (
    <section id="programs" className="section-padding bg-light-gray relative-z">
      <div className="container">
        <h2 className="section-title gsap-fade-up">برامجنا ومواعيدنا</h2>

        <div className="row justify-content-center gsap-fade-up">
          <div className="col-lg-10">
            <div className="glass-card p-0 overflow-hidden">
              {/* Responsive Tab Bar Navigation */}
              <div className="overflow-x-auto">
                <ul
                  className="nav nav-tabs custom-tabs flex-nowrap text-nowrap"
                  id="programTabs"
                  role="tablist"
                  style={{ overflowX: 'auto', flexWrap: 'nowrap' }}
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

                  {/* Dynamic Tabs appended directly inside the SAME tab bar */}
                  {dynamicActivities.map((act) => {
                    const tabKey = act.id.toString();
                    const iconClass = getCategoryIcon(act.category);
                    return (
                      <li className="nav-item" role="presentation" key={act.id}>
                        <button
                          className={`nav-link ${activeTab === tabKey ? 'active' : ''}`}
                          type="button"
                          onClick={() => setActiveTab(tabKey)}
                        >
                          <i className={`${iconClass} me-2 text-accent`}></i> {act.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

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
                            {settings.friday_time || 'كل يوم جمعة الساعة 7:00 مساءً'}
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
                              const parts = line.split('-').map((p) => p.trim());
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

                {/* Dynamic Activity Content */}
                {activeDynamicItem && (
                  <div className="tab-pane fade show active" role="tabpanel">
                    <div className="text-center mb-4">
                      {activeDynamicItem.category && (
                        <span className="badge bg-accent text-dark fw-bold px-3 py-2 rounded-pill fs-6 mb-2">
                          <i className={`${getCategoryIcon(activeDynamicItem.category)} me-1`}></i>{' '}
                          {activeDynamicItem.category}
                        </span>
                      )}

                      <h4 className="text-primary dark:text-white fw-bold mb-2">
                        {activeDynamicItem.title}
                      </h4>

                      {activeDynamicItem.subtitle && (
                        <h6 className="text-accent fw-bold mb-3">
                          {activeDynamicItem.subtitle}
                        </h6>
                      )}

                      <div className="d-flex justify-content-center align-items-center gap-4 text-muted dark:text-gray-300 small fw-bold mt-2">
                        {activeDynamicItem.date && (
                          <span>
                            <i className="far fa-calendar-alt text-accent me-1"></i> {activeDynamicItem.date}
                          </span>
                        )}
                        {activeDynamicItem.time && (
                          <span>
                            <i className="far fa-clock text-accent me-1"></i> {activeDynamicItem.time}
                          </span>
                        )}
                      </div>
                    </div>

                    {activeDynamicItem.content && (
                      <div className="p-4 rounded-3 border bg-white dark:bg-dark-surface shadow-sm">
                        <div
                          className="text-main dark:text-gray-200 fs-5"
                          style={{
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.9',
                            wordBreak: 'break-word',
                            overflowWrap: 'anywhere',
                          }}
                        >
                          {formatTextWithLinks(activeDynamicItem.content)}
                        </div>
                      </div>
                    )}
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
