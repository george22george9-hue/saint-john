'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import { Announcement, Inquiry } from '@/types';
import {
  validateImageFile,
  compressAndOptimizeImage,
} from '@/lib/clientImageOptimizer';

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

  // Add post / activity form state
  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Edit Modal State
  const [editingPost, setEditingPost] = useState<Announcement | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Settings form state
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const inqData = await res.json();
        setInquiries(inqData);
        setIsLoggedIn(true);

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

  // Image File Picker Change Handler
  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    setImageError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setImageError(validation.error || 'صورة غير صالحة');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
  };

  const handleRemoveSelectedImage = () => {
    setSelectedFile(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    setImageError(null);
  };

  const handleAddActivity = async (e: FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim() && !actDesc.trim() && !selectedFile) {
      alert('يرجى كتابة عنوان أو تفاصيل أو إرفاق صورة للمنشور');
      return;
    }

    setIsAdding(true);
    setImageError(null);

    try {
      let fileToUpload = selectedFile;
      if (fileToUpload) {
        fileToUpload = await compressAndOptimizeImage(fileToUpload);
      }

      const formData = new FormData();
      formData.append('title', actTitle);
      formData.append('date', actDate);
      formData.append('description', actDesc);
      if (fileToUpload) {
        formData.append('image', fileToUpload);
      }

      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setActTitle('');
        setActDate('');
        setActDesc('');
        handleRemoveSelectedImage();
        loadActivities();
        alert('تم نشر المنشور بنجاح!');
      } else {
        alert(data.error || 'حدث خطأ أثناء إضافة المنشور');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteActivity = async (post: Announcement) => {
    const confirmMsg = post.image_url
      ? 'هل أنت متأكد من حذف هذا المنشور؟ سيتم حذف الصورة نهائياً أيضاً.'
      : 'هل أنت متأكد من حذف هذا المنشور؟';

    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/announcements/${post.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        loadActivities();
        alert(data.message || 'تم الحذف بنجاح');
      } else {
        alert(data.error || 'حدث خطأ أثناء الحذف');
      }
    } catch {
      alert('حدث خطأ في الاتصال بالسيرفر');
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (post: Announcement) => {
    setEditingPost(post);
    setEditTitle(post.title || '');
    setEditDate(post.date || '');
    setEditDesc(post.description || '');
    setEditFile(null);
    setEditImagePreview(null);
    setRemoveExistingImage(false);
  };

  const handleCloseEdit = () => {
    setEditingPost(null);
    setEditFile(null);
    if (editImagePreview) {
      URL.revokeObjectURL(editImagePreview);
      setEditImagePreview(null);
    }
  };

  const handleEditFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setEditFile(file);
    setRemoveExistingImage(false);
    const objectUrl = URL.createObjectURL(file);
    setEditImagePreview(objectUrl);
  };

  const handleSaveEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setIsSavingEdit(true);
    try {
      let fileToUpload = editFile;
      if (fileToUpload) {
        fileToUpload = await compressAndOptimizeImage(fileToUpload);
      }

      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('date', editDate);
      formData.append('description', editDesc);
      if (removeExistingImage) {
        formData.append('remove_image', 'true');
      }
      if (fileToUpload) {
        formData.append('image', fileToUpload);
      }

      const res = await fetch(`/api/admin/announcements/${editingPost.id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        handleCloseEdit();
        loadActivities();
        alert('تم تحديث المنشور بنجاح!');
      } else {
        alert(data.error || 'حدث خطأ أثناء التحديث');
      }
    } catch {
      alert('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsSavingEdit(false);
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
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh' }}>
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
              <i className="fas fa-cogs me-2"></i> لوحة تحكم الخدام والمنشورات
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
            {/* Create Post / Activity Form */}
            <div className="col-md-5 mb-4">
              <div className="admin-card card p-4">
                <h5 className="mb-4 text-primary fw-bold">
                  <i className="fas fa-plus-circle me-2"></i> إنشاء منشور / إعلان جديد
                </h5>
                <form onSubmit={handleAddActivity}>
                  <div className="mb-3">
                    <label className="form-label">
                      عنوان المنشور (اختياري)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="مثال: مؤتمر الشباب الصيفي"
                      value={actTitle}
                      onChange={(e) => setActTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      التاريخ / التوقيت (اختياري - سيُنشأ تلقائياً إذا تُرك فارغاً)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="مثال: الجمعة، 15 أغسطس"
                      value={actDate}
                      onChange={(e) => setActDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">محتوى المنشور / التفاصيل</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="اكتب تفاصيل المنشور هنا..."
                      value={actDesc}
                      onChange={(e) => setActDesc(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Image Attachment & Preview */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">
                      <i className="fas fa-image me-1"></i> إرفاق صورة (اختياري)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageSelect}
                    />
                    <div className="form-text text-muted">
                      الصيغ المدعومة: JPG, PNG, WEBP (الحد الأقصى 5 ميجابايت). سيتم ضغط الصورة تلقائياً لحفظ المساحة.
                    </div>

                    {imageError && (
                      <div className="alert alert-danger mt-2 py-2" role="alert">
                        {imageError}
                      </div>
                    )}

                    {imagePreview && (
                      <div className="mt-3 position-relative d-inline-block border rounded-3 p-2 bg-dark">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imagePreview}
                          alt="معاينة"
                          style={{ maxHeight: '180px', borderRadius: '8px', objectFit: 'contain' }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle"
                          onClick={handleRemoveSelectedImage}
                          title="إزالة الصورة"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 fw-bold py-2 mt-2"
                    disabled={isAdding}
                  >
                    {isAdding ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i> جاري النشر والضغط...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i> نشر المنشور
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* List of Posts */}
            <div className="col-md-7 mb-4">
              <div className="admin-card card p-4">
                <h5 className="mb-4 text-primary fw-bold">
                  <i className="fas fa-list me-2"></i> المنشورات الحالية على الموقع
                </h5>
                <div className="list-group">
                  {activities.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      لا توجد منشورات مضافة حالياً.
                    </div>
                  ) : (
                    activities.map((act) => (
                      <div
                        key={act.id}
                        className="list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2 py-3"
                      >
                        <div className="d-flex align-items-center gap-3">
                          {act.image_url ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={act.image_url}
                              alt="مصغرة"
                              width="60"
                              height="60"
                              className="rounded-3"
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              className="rounded-3 bg-secondary text-white d-flex align-items-center justify-content-center"
                              style={{ width: '60px', height: '60px' }}
                            >
                              <i className="fas fa-file-alt fs-4"></i>
                            </div>
                          )}

                          <div>
                            <h6 className="mb-1 fw-bold">
                              {act.title || 'منشور بدون عنوان'}{' '}
                              <span className="badge bg-secondary ms-2">
                                {act.date}
                              </span>
                            </h6>
                            <small className="text-muted d-block text-truncate" style={{ maxWidth: '300px' }}>
                              {act.description || (act.image_url ? '[منشور صورة فقط]' : '')}
                            </small>
                          </div>
                        </div>

                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleOpenEdit(act)}
                            title="تعديل"
                          >
                            <i className="fas fa-edit me-1"></i> تعديل
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteActivity(act)}
                            title="حذف"
                          >
                            <i className="fas fa-trash me-1"></i> حذف
                          </button>
                        </div>
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
                  <i className="fas fa-envelope-open-text me-2"></i> رسائل وأسئلة الشباب (الفيدباك)
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
                          <td colSpan={3} className="text-center text-muted py-4">
                            لا توجد رسائل حالياً.
                          </td>
                        </tr>
                      ) : (
                        inquiries.map((f) => (
                          <tr key={f.id}>
                            <td>{f.name || 'مجهول'}</td>
                            <td>{f.hymnRequest || '-'}</td>
                            <td>
                              <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
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
                  <i className="fas fa-sliders-h me-2"></i> إعدادات الموقع الأساسية
                </h5>
                <form onSubmit={handleSaveSettings}>
                  <div className="row">
                    <div className="col-md-12 mb-3">
                      <label className="form-label fw-bold">ميعاد اجتماع الجمعة</label>
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
                      <label className="form-label fw-bold">جدول النشاط الصيفي (يوم الأحد)</label>
                      <div className="form-text text-muted mb-2">
                        اكتب كل فقرة في سطر منفصل، وافصل بين (الوقت) و (الفقرة) و (التفاصيل) بعلامة الشرطة ( - ).
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
                        <i className="fas fa-spinner fa-spin me-2"></i> جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i> حفظ الإعدادات في الموقع
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Post Modal */}
      {editingPost && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-primary">
                  <i className="fas fa-edit me-2 text-accent"></i> تعديل المنشور
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseEdit}></button>
              </div>
              <form onSubmit={handleSaveEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">العنوان</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">التاريخ</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">المحتوى / التفاصيل</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                    ></textarea>
                  </div>

                  {/* Current Image & Replacement Controls */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">الصورة المرفقة</label>
                    {editingPost.image_url && !removeExistingImage && !editImagePreview && (
                      <div className="d-flex align-items-center gap-3 mb-2 p-2 border rounded-3 bg-dark">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editingPost.image_url}
                          alt="الصورة الحالية"
                          style={{ maxHeight: '120px', borderRadius: '6px', objectFit: 'contain' }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => setRemoveExistingImage(true)}
                        >
                          <i className="fas fa-trash me-1"></i> إزالة الصورة الحالية
                        </button>
                      </div>
                    )}

                    {removeExistingImage && (
                      <div className="alert alert-warning py-2 small mb-2">
                        سيتم حذف الصورة الحالية نهائياً عند حفظ التعديلات.
                        <button
                          type="button"
                          className="btn btn-link btn-sm p-0 ms-2 text-decoration-none"
                          onClick={() => setRemoveExistingImage(false)}
                        >
                          تراجع
                        </button>
                      </div>
                    )}

                    <div className="mt-2">
                      <label className="form-label small text-muted">اختر صورة جديدة لاستبدال الصورة الحالية أو لإضافتها:</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleEditFileSelect}
                      />
                    </div>

                    {editImagePreview && (
                      <div className="mt-2 position-relative d-inline-block border rounded-3 p-2 bg-dark">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={editImagePreview}
                          alt="معاينة جديدة"
                          style={{ maxHeight: '140px', borderRadius: '6px', objectFit: 'contain' }}
                        />
                        <span className="badge bg-success position-absolute top-0 end-0 m-1">صورة جديدة</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEdit}>
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-primary fw-bold" disabled={isSavingEdit}>
                    {isSavingEdit ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-1"></i> جاري الحفظ...
                      </>
                    ) : (
                      'حفظ التعديلات'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
