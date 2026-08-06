'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Announcement, Inquiry } from '@/types';

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activities, setActivities] = useState<Announcement[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [fridayTime, setFridayTime] = useState('');
  const [sundaySchedule, setSundaySchedule] = useState('');

  // Add activity form state
  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Settings form state
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Test fetching protected inquiries to check if user is authenticated via cookie
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const inqData = await res.json();
        setInquiries(inqData);
        setIsLoggedIn(true);

        // Fetch announcements & settings
        loadActivities();
        loadSettings();
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
  };

  const loadActivities = async () => {
    try {
      const res = await fetch('/api/announcements');
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (err) {
      console.error('Failed to load activities', err);
    }
  };

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.friday_time) setFridayTime(data.friday_time);
        if (data.sunday_schedule) setSundaySchedule(data.sunday_schedule);
      }
    } catch (err) {
      console.error('Failed to load settings', err);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        loadDashboardData();
      } else {
        setLoginError(data.error || 'فشل تسجيل الدخول');
      }
    } catch {
      setLoginError('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } finally {
      setIsLoggedIn(false);
    }
  };

  const handleAddActivity = async (e: FormEvent) => {
    e.preventDefault();
    if (!actTitle || !actDate) return;

    setIsAdding(true);
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: actTitle,
          date: actDate,
          description: actDesc,
        }),
      });

      if (res.ok) {
        setActTitle('');
        setActDate('');
        setActDesc('');
        loadActivities();
        alert('تم إضافة النشاط بنجاح!');
      } else {
        alert('حدث خطأ أثناء الإضافة');
      }
    } catch {
      alert('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteActivity = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا النشاط؟')) return;

    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        loadActivities();
      } else {
        alert('حدث خطأ أثناء الحذف');
      }
    } catch {
      alert('حدث خطأ في الاتصال بالسيرفر');
    }
  };

  const handleSaveSettings = async (e: FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          friday_time: fridayTime,
          sunday_schedule: sundaySchedule,
        }),
      });

      if (res.ok) {
        alert('تم حفظ الإعدادات بنجاح! ستظهر التعديلات على الموقع مباشرة.');
      } else {
        alert('حدث خطأ أثناء حفظ الإعدادات');
      }
    } catch {
      alert('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <header className="admin-header shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="شعار"
                width="40"
                height="40"
                className="me-3 rounded-circle bg-white p-1"
                style={{ objectFit: 'cover' }}
              />
            </Link>
            <h4 className="mb-0 text-white">
              <i className="fas fa-cogs me-2"></i> لوحة تحكم الأنشطة
            </h4>
          </div>
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              className="btn btn-outline-light btn-sm"
            >
              تسجيل الخروج
            </button>
          )}
        </div>
      </header>

      <div className="container pb-5">
        {!isLoggedIn ? (
          /* Login Section */
          <div className="row justify-content-center">
            <div className="col-md-5">
              <div className="admin-card card p-4 mt-5">
                <h3 className="text-center mb-4 text-primary fw-bold">
                  تسجيل الدخول
                </h3>
                {loginError && (
                  <div className="alert alert-danger" role="alert">
                    {loginError}
                  </div>
                )}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">البريد الإلكتروني</label>
                    <input
                      type="email"
                      className="form-control"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">كلمة المرور</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 mt-2 py-2 fw-bold"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'جاري الدخول...' : 'دخول'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          /* Dashboard Section */
          <div className="row">
            {/* Add New Activity Form */}
            <div className="col-md-5 mb-4">
              <div className="admin-card card p-4">
                <h5 className="mb-4 text-primary fw-bold">
                  <i className="fas fa-plus-circle me-2"></i> إضافة نشاط جديد
                </h5>
                <form onSubmit={handleAddActivity}>
                  <div className="mb-3">
                    <label className="form-label">
                      العنوان (مثل: ندوة حوارية)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={actTitle}
                      onChange={(e) => setActTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      التاريخ (مثل: الجمعة، 15 أغسطس)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={actDate}
                      onChange={(e) => setActDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">الوصف / التفاصيل</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={actDesc}
                      onChange={(e) => setActDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold py-2"
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i> جاري
                        الإضافة...
                      </>
                    ) : (
                      'إضافة النشاط'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* List of Activities */}
            <div className="col-md-7 mb-4">
              <div className="admin-card card p-4">
                <h5 className="mb-4 text-primary fw-bold">
                  <i className="fas fa-list me-2"></i> الأنشطة الحالية المضافة
                  للموقع
                </h5>
                <div className="list-group">
                  {activities.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      لا توجد أنشطة مضافة حالياً.
                    </div>
                  ) : (
                    activities.map((act) => (
                      <div
                        key={act.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <h6 className="mb-1 fw-bold">
                            {act.title}{' '}
                            <span className="badge bg-secondary ms-2">
                              {act.date}
                            </span>
                          </h6>
                          <small className="text-muted">
                            {act.description.substring(0, 50)}...
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteActivity(act.id)}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Feedbacks Section */}
            <div className="col-md-12 mb-4">
              <div className="admin-card card p-4">
                <h5 className="mb-4 text-primary fw-bold">
                  <i className="fas fa-envelope-open-text me-2"></i> رسائل
                  وأسئلة الشباب (الفيدباك)
                </h5>
                <div className="table-responsive">
                  <table className="table table-bordered table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>الاسم</th>
                        <th>اقتراح ترنيمة</th>
                        <th>الرسالة / السؤال</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="text-center text-muted py-4"
                          >
                            لا توجد رسائل حالياً.
                          </td>
                        </tr>
                      ) : (
                        inquiries.map((f) => (
                          <tr key={f.id}>
                            <td>{f.name || 'مجهول'}</td>
                            <td>{f.hymnRequest || '-'}</td>
                            <td>
                              <p
                                className="mb-0"
                                style={{ whiteSpace: 'pre-wrap' }}
                              >
                                {f.message}
                              </p>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Site Settings Section */}
            <div className="col-md-12">
              <div className="admin-card card p-4 border-primary border-top border-3">
                <h5 className="mb-4 text-primary fw-bold">
                  <i className="fas fa-sliders-h me-2"></i> إعدادات الموقع
                  الأساسية
                </h5>
                <form onSubmit={handleSaveSettings}>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label fw-bold">
                        ميعاد اجتماع الجمعة
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="مثال: كل يوم جمعة الساعة 7:00 مساءً"
                        value={fridayTime}
                        onChange={(e) => setFridayTime(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-12 mb-3">
                      <label className="form-label fw-bold">
                        جدول النشاط الصيفي (يوم الأحد)
                      </label>
                      <div className="form-text text-muted mb-2">
                        اكتب كل فقرة في سطر منفصل، وافصل بين (الوقت) و (الفقرة)
                        و (التفاصيل) بعلامة الشرطة ( - ).
                      </div>
                      <textarea
                        className="form-control text-end"
                        rows={8}
                        dir="rtl"
                        placeholder={`مثال:\n5 دقائق - صلاة الافتتاح - البدء بالصلاة وطلب بركة الروح القدس.\n15 دقيقة - فقرة تنشيطية - لعب سوا لخلق جو من البهجة.`}
                        value={sundaySchedule}
                        onChange={(e) => setSundaySchedule(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary px-5 py-2 fw-bold"
                    disabled={isSavingSettings}
                  >
                    {isSavingSettings ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i> جاري
                        الحفظ...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i> حفظ الإعدادات في
                        الموقع
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
