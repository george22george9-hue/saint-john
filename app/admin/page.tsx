'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Announcement, Inquiry, DynamicActivity } from '@/types';
import {
  validateImageFile,
  compressAndOptimizeImage,
} from '@/lib/clientImageOptimizer';

type FeedbackFilter = 'الكل' | 'تحت المراجعة' | 'جاري التنفيذ' | 'تم التنفيذ' | 'مرفوض';

interface SupabaseErrorInfo {
  message: string;
  details?: string;
  code?: string;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Posts / Announcements state
  const [activities, setActivities] = useState<Announcement[]>([]);
  
  // Feedback / Inquiries state
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>('الكل');
  const [deletingInquiry, setDeletingInquiry] = useState<Inquiry | null>(null);
  const [isDeletingInquiry, setIsDeletingInquiry] = useState(false);
  const [updatingInquiryId, setUpdatingInquiryId] = useState<number | null>(null);
  const [inquiryError, setInquiryError] = useState<SupabaseErrorInfo | null>(null);

  // Settings state (Friday & Sunday)
  const [fridayTime, setFridayTime] = useState('');
  const [sundaySchedule, setSundaySchedule] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Dynamic Activities state
  const [dynamicActivities, setDynamicActivities] = useState<DynamicActivity[]>([]);
  const [showDynamicModal, setShowDynamicModal] = useState(false);
  const [editingDynamicItem, setEditingDynamicItem] = useState<DynamicActivity | null>(null);
  const [deletingDynamicItem, setDeletingDynamicItem] = useState<DynamicActivity | null>(null);
  const [isDeletingDynamicItem, setIsDeletingDynamicItem] = useState(false);
  const [isSavingDynamicItem, setIsSavingDynamicItem] = useState(false);
  const [dynError, setDynError] = useState<SupabaseErrorInfo | null>(null);
  const [tableMissingWarning, setTableMissingWarning] = useState(false);

  // Dynamic Activity Form state
  const [dynTitle, setDynTitle] = useState('');
  const [dynSubtitle, setDynSubtitle] = useState('');
  const [dynCategory, setDynCategory] = useState('نشاط');
  const [dynContent, setDynContent] = useState('');
  const [dynDate, setDynDate] = useState('');
  const [dynTime, setDynTime] = useState('');
  const [dynIsActive, setDynIsActive] = useState(true);
  const [dynDisplayOrder, setDynDisplayOrder] = useState(0);

  // Create post / announcement form state
  const [actTitle, setActTitle] = useState('');
  const [actDate, setActDate] = useState('');
  const [actDesc, setActDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Edit Post Modal State
  const [editingPost, setEditingPost] = useState<Announcement | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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
        loadDynamicActivities();
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
      console.error('Failed to load announcements', err);
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

  const loadDynamicActivities = async () => {
    try {
      const res = await fetch('/api/admin/activities');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setDynamicActivities(data);
          setTableMissingWarning(false);
        }
      } else {
        const errorData = await res.json();
        console.warn('Admin activities GET non-ok response:', errorData);
        if (errorData.code === '42P01' || (errorData.error && errorData.error.includes('dynamic_activities'))) {
          setTableMissingWarning(true);
        }
      }
    } catch (err) {
      console.error('Failed to load dynamic activities', err);
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

  // --- Image Handlers ---
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

  // --- Announcement Handlers ---
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

  // --- Feedback / Inquiry Handlers ---
  const handleUpdateInquiryStatus = async (id: number, newStatus: string) => {
    setUpdatingInquiryId(id);
    setInquiryError(null);
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: data.inquiry?.status || newStatus } : item
          )
        );
      } else {
        console.error('[Supabase Inquiry PATCH Error Details]:', data);
        setInquiryError({
          message: data.error || 'حدث خطأ أثناء تحديث حالة الرسالة',
          details: data.details,
          code: data.code,
        });
      }
    } catch (err: any) {
      console.error('[Inquiry Status Catch Error]:', err);
      setInquiryError({ message: 'حدث خطأ في الاتصال بالسيرفر' });
    } finally {
      setUpdatingInquiryId(null);
    }
  };

  const handleDeleteInquiryConfirm = async () => {
    if (!deletingInquiry) return;
    setIsDeletingInquiry(true);
    setInquiryError(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${deletingInquiry.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== deletingInquiry.id));
        setDeletingInquiry(null);
      } else {
        console.error('[Supabase Inquiry DELETE Error Details]:', data);
        setInquiryError({
          message: data.error || 'حدث خطأ أثناء حذف الرسالة',
          details: data.details,
          code: data.code,
        });
      }
    } catch (err: any) {
      console.error('[Delete Inquiry Catch Error]:', err);
      setInquiryError({ message: 'حدث خطأ في الاتصال بالسيرفر' });
    } finally {
      setIsDeletingInquiry(false);
    }
  };

  // --- Settings Handlers ---
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

  // --- Dynamic Activities Handlers ---
  const handleOpenAddDynamicModal = () => {
    setEditingDynamicItem(null);
    setDynTitle('');
    setDynSubtitle('');
    setDynCategory('نشاط');
    setDynContent('');
    setDynDate('');
    setDynTime('');
    setDynIsActive(true);
    setDynDisplayOrder(0);
    setDynError(null);
    setShowDynamicModal(true);
  };

  const handleOpenEditDynamicModal = (item: DynamicActivity) => {
    setEditingDynamicItem(item);
    setDynTitle(item.title || '');
    setDynSubtitle(item.subtitle || '');
    setDynCategory(item.category || 'نشاط');
    setDynContent(item.content || '');
    setDynDate(item.date || '');
    setDynTime(item.time || '');
    setDynIsActive(item.is_active ?? true);
    setDynDisplayOrder(item.display_order || 0);
    setDynError(null);
    setShowDynamicModal(true);
  };

  const handleSaveDynamicActivity = async (e: FormEvent) => {
    e.preventDefault();
    if (!dynTitle.trim()) {
      setDynError({ message: 'يرجى إدخال عنوان القسم أو النشاط' });
      return;
    }

    setDynError(null);
    setIsSavingDynamicItem(true);
    try {
      const payload = {
        title: dynTitle,
        subtitle: dynSubtitle,
        category: dynCategory,
        content: dynContent,
        date: dynDate,
        time: dynTime,
        is_active: dynIsActive,
        display_order: dynDisplayOrder,
      };

      let res: Response;
      if (editingDynamicItem) {
        res = await fetch(`/api/admin/activities/${editingDynamicItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();

      if (res.ok) {
        setShowDynamicModal(false);
        setEditingDynamicItem(null);
        setDynError(null);
        setTableMissingWarning(false);
        loadDynamicActivities();
      } else {
        console.error('[Supabase Dynamic Activity Save Error Details]:', {
          error: data.error,
          code: data.code,
          details: data.details,
          hint: data.hint,
        });

        setDynError({
          message: data.error || 'حدث خطأ أثناء حفظ النشاط',
          details: data.details,
          code: data.code,
        });
      }
    } catch (err: any) {
      console.error('[Save Dynamic Activity Catch Error]:', err);
      setDynError({ message: 'حدث خطأ في الاتصال بالسيرفر' });
    } finally {
      setIsSavingDynamicItem(false);
    }
  };

  const handleToggleDynamicActive = async (item: DynamicActivity) => {
    try {
      const res = await fetch(`/api/admin/activities/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !item.is_active }),
      });

      if (res.ok) {
        setDynamicActivities((prev) =>
          prev.map((act) => (act.id === item.id ? { ...act, is_active: !act.is_active } : act))
        );
      } else {
        const errorData = await res.json();
        console.error('[Toggle Active Error Details]:', errorData);
        alert(errorData.error || 'فشل تغيير حالة التفعيل');
      }
    } catch {
      alert('حدث خطأ في الاتصال بالسيرفر');
    }
  };

  const handleDeleteDynamicConfirm = async () => {
    if (!deletingDynamicItem) return;
    setIsDeletingDynamicItem(true);

    try {
      const res = await fetch(`/api/admin/activities/${deletingDynamicItem.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDynamicActivities((prev) =>
          prev.filter((act) => act.id !== deletingDynamicItem.id)
        );
        setDeletingDynamicItem(null);
      } else {
        const data = await res.json();
        console.error('[Delete Activity Error Details]:', data);
        alert(data.error || 'حدث خطأ أثناء حذف النشاط');
      }
    } catch {
      alert('حدث خطأ في الاتصال بالسيرفر');
    } finally {
      setIsDeletingDynamicItem(false);
    }
  };

  // Filtering Feedback Logic & Statistics
  const getInquiryStatus = (inq: Inquiry): string => {
    return inq.status && inq.status.trim().length > 0 ? inq.status : 'تحت المراجعة';
  };

  const counts = {
    الكل: inquiries.length,
    'تحت المراجعة': inquiries.filter((i) => getInquiryStatus(i) === 'تحت المراجعة').length,
    'جاري التنفيذ': inquiries.filter((i) => getInquiryStatus(i) === 'جاري التنفيذ').length,
    'تم التنفيذ': inquiries.filter((i) => getInquiryStatus(i) === 'تم التنفيذ').length,
    مرفوض: inquiries.filter((i) => getInquiryStatus(i) === 'مرفوض').length,
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (feedbackFilter === 'الكل') return true;
    return getInquiryStatus(inq) === feedbackFilter;
  });

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr) {
      case 'تحت المراجعة':
        return <span className="badge bg-warning text-dark px-3 py-2 fw-bold"><i className="fas fa-hourglass-half me-1"></i> تحت المراجعة</span>;
      case 'جاري التنفيذ':
        return <span className="badge bg-info text-dark px-3 py-2 fw-bold"><i className="fas fa-spinner fa-spin me-1"></i> جاري التنفيذ</span>;
      case 'تم التنفيذ':
        return <span className="badge bg-success px-3 py-2 fw-bold"><i className="fas fa-check-circle me-1"></i> تم التنفيذ</span>;
      case 'مرفوض':
        return <span className="badge bg-danger px-3 py-2 fw-bold"><i className="fas fa-times-circle me-1"></i> مرفوض</span>;
      default:
        return <span className="badge bg-warning text-dark px-3 py-2 fw-bold"><i className="fas fa-hourglass-half me-1"></i> تحت المراجعة</span>;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-main)', minHeight: '100vh' }} dir="rtl">
      <header className="admin-header shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="شعار"
                width={40}
                height={40}
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
              className="btn btn-outline-light btn-sm fw-bold"
            >
              <i className="fas fa-sign-out-alt me-1"></i> تسجيل الخروج
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

            {/* SECTION 1: Dynamic Content & Activities ("إعدادات الموقع الأساسية والأنشطة Dynamic") */}
            <div className="col-md-12 mb-4 mt-4">
              <div className="admin-card card p-4 border-primary border-top border-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                  <div>
                    <h5 className="mb-1 text-primary fw-bold">
                      <i className="fas fa-layer-group me-2"></i> إدارة الأنشطة والأقسام الديناميكية (Dynamic Sections)
                    </h5>
                    <small className="text-muted">
                      أضف أو عدل أي نشاط جديد (اجتماع خاص، مؤتمر، رحلة، نهضة، مسابقة، كورس، جدول جديد) ليتحدث على الموقع مباشرة دون تعديل كود.
                    </small>
                  </div>
                  <button
                    className="btn btn-success fw-bold px-4 py-2"
                    onClick={handleOpenAddDynamicModal}
                  >
                    <i className="fas fa-plus-circle me-1"></i> + إضافة قسم / نشاط جديد
                  </button>
                </div>

                {/* Database Schema Warning Banner */}
                {tableMissingWarning && (
                  <div className="alert alert-warning border-warning d-flex align-items-center gap-3 mb-4 p-3 rounded-3" role="alert">
                    <i className="fas fa-database fs-3 text-warning"></i>
                    <div>
                      <h6 className="fw-bold mb-1">ملاحظة هامة لإعداد قاعدة البيانات (Supabase SQL Migration Required)</h6>
                      <p className="mb-0 small text-dark">
                        يرجى تنفيذ ملف Migration المسمى <code>supabase_migration.sql</code> الموجود في المجلد الرئيسي للمشروع في <strong>Supabase SQL Editor</strong> لإنشاء جدول <code>dynamic_activities</code> وتحديث جدول الرسائل.
                      </p>
                    </div>
                  </div>
                )}

                {/* List of Dynamic Activities */}
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '60px' }}>الترتيب</th>
                        <th>العنوان والنوع</th>
                        <th>التفاصيل والمحتوى</th>
                        <th>الموعد والتوقيت</th>
                        <th>الحالة</th>
                        <th style={{ width: '180px' }}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dynamicActivities.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center text-muted py-4">
                            لا توجد أنشطة ديناميكية مضافة حالياً. اضغط على زر &quot;+ إضافة قسم / نشاط جديد&quot; لإضافة أول نشاط!
                          </td>
                        </tr>
                      ) : (
                        dynamicActivities.map((item) => (
                          <tr key={item.id} className={!item.is_active ? 'opacity-50 bg-light' : ''}>
                            <td className="text-center fw-bold">{item.display_order}</td>
                            <td>
                              <div className="fw-bold">{item.title}</div>
                              {item.subtitle && <small className="text-muted d-block">{item.subtitle}</small>}
                              <span className="badge bg-secondary mt-1">{item.category || 'نشاط'}</span>
                            </td>
                            <td>
                              <p className="mb-0 small" style={{ whiteSpace: 'pre-wrap', maxHeight: '80px', overflowY: 'auto' }}>
                                {item.content || '-'}
                              </p>
                            </td>
                            <td>
                              {item.date && <div className="small"><i className="far fa-calendar-alt me-1 text-primary"></i> {item.date}</div>}
                              {item.time && <div className="small text-muted"><i className="far fa-clock me-1"></i> {item.time}</div>}
                              {!item.date && !item.time && <span className="text-muted small">-</span>}
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`btn btn-sm ${item.is_active ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => handleToggleDynamicActive(item)}
                                title="اضغط لتغيير الحالة"
                              >
                                {item.is_active ? (
                                  <><i className="fas fa-check me-1"></i> مفعل</>
                                ) : (
                                  <><i className="fas fa-ban me-1"></i> غير مفعل</>
                                )}
                              </button>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleOpenEditDynamicModal(item)}
                                  title="تعديل"
                                >
                                  <i className="fas fa-edit me-1"></i> تعديل
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => setDeletingDynamicItem(item)}
                                  title="حذف"
                                >
                                  <i className="fas fa-trash me-1"></i> حذف
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Hardcoded Settings Form (Friday Time & Sunday Schedule preserved) */}
                <hr className="my-4" />
                <h6 className="mb-3 text-primary fw-bold">
                  <i className="fas fa-sliders-h me-2"></i> المواعيد الأساسية الحالية للموقع
                </h6>
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
                        rows={6}
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
                        <i className="fas fa-save me-2"></i> حفظ المواعيد الأساسية
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* SECTION 2: Posts & Announcements ("المنشورات والإعلانات الحالية") */}
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

            {/* SECTION 3: Upgraded Feedback & Inquiries Management System ("رسائل وأسئلة الشباب (الفيدباك)") */}
            <div className="col-md-12 mb-4">
              <div className="admin-card card p-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <h5 className="mb-0 text-primary fw-bold">
                    <i className="fas fa-envelope-open-text me-2"></i> نظام إدارة رسائل وأسئلة الشباب (الفيدباك)
                  </h5>
                  <span className="badge bg-primary fs-6 px-3 py-2">
                    إجمالي الرسائل: {inquiries.length}
                  </span>
                </div>

                {inquiryError && (
                  <div className="alert alert-danger mb-3" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i> {inquiryError.message}
                    {inquiryError.details && <div className="small text-muted mt-1">{inquiryError.details}</div>}
                  </div>
                )}

                {/* Filter Tabs with Live Status Counts */}
                <div className="d-flex flex-wrap gap-2 mb-4 border-bottom pb-3">
                  {(['الكل', 'تحت المراجعة', 'جاري التنفيذ', 'تم التنفيذ', 'مرفوض'] as FeedbackFilter[]).map((tab) => {
                    const isActive = feedbackFilter === tab;
                    const count = counts[tab];
                    return (
                      <button
                        key={tab}
                        type="button"
                        className={`btn btn-sm rounded-pill px-3 py-2 fw-bold d-flex align-items-center gap-2 ${
                          isActive
                            ? 'btn-primary shadow-sm'
                            : 'btn-outline-secondary'
                        }`}
                        onClick={() => setFeedbackFilter(tab)}
                      >
                        <span>{tab}</span>
                        <span className={`badge ${isActive ? 'bg-white text-primary' : 'bg-secondary text-white'}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Feedback Table */}
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: '130px' }}>الاسم</th>
                        <th style={{ width: '150px' }}>اقتراح ترنيمة / ترفيهي</th>
                        <th>الرسالة / السؤال</th>
                        <th style={{ width: '140px' }}>الحالة</th>
                        <th style={{ width: '220px' }}>إدارة الحالة والأوامر</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center text-muted py-4">
                            {feedbackFilter === 'الكل'
                              ? 'لا توجد رسائل حالياً.'
                              : `لا توجد رسائل بحالة "${feedbackFilter}".`}
                          </td>
                        </tr>
                      ) : (
                        filteredInquiries.map((f) => {
                          const currentStatus = getInquiryStatus(f);
                          const isUpdating = updatingInquiryId === f.id;

                          return (
                            <tr key={f.id}>
                              <td className="fw-bold">{f.name || 'مجهول'}</td>
                              <td className="text-muted">{f.hymnRequest || '-'}</td>
                              <td>
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                  {f.message}
                                </p>
                                {f.createdAt && (
                                  <small className="text-muted d-block mt-1">
                                    <i className="far fa-clock me-1"></i>
                                    {new Date(f.createdAt).toLocaleDateString('ar-EG', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </small>
                                )}
                              </td>
                              <td className="text-center">
                                {getStatusBadge(currentStatus)}
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-2">
                                  {/* Quick Status Dropdown */}
                                  <select
                                    className="form-select form-select-sm fw-bold"
                                    value={currentStatus}
                                    disabled={isUpdating}
                                    onChange={(e) => handleUpdateInquiryStatus(f.id, e.target.value)}
                                  >
                                    <option value="تحت المراجعة">تحت المراجعة</option>
                                    <option value="جاري التنفيذ">جاري التنفيذ</option>
                                    <option value="تم التنفيذ">تم التنفيذ</option>
                                    <option value="مرفوض">مرفوض</option>
                                  </select>

                                  {/* Quick Delete Action */}
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm fw-bold w-100"
                                    onClick={() => setDeletingInquiry(f)}
                                  >
                                    <i className="fas fa-trash me-1"></i> حذف نهائي
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* MODAL 1: Edit Post Announcement Modal */}
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

      {/* MODAL 2: Add/Edit Dynamic Activity Modal */}
      {showDynamicModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold text-primary">
                  <i className="fas fa-layer-group me-2 text-accent"></i>
                  {editingDynamicItem ? 'تعديل قسم / نشاط ديناميكي' : '+ إضافة قسم / نشاط جديد'}
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowDynamicModal(false)}></button>
              </div>
              <form onSubmit={handleSaveDynamicActivity}>
                <div className="modal-body">

                  {/* Rich Error Alert Component */}
                  {dynError && (
                    <div className="alert alert-danger p-3 mb-4 rounded-3 border-danger" role="alert">
                      <div className="fw-bold fs-6 mb-1">
                        <i className="fas fa-exclamation-triangle me-2"></i> {dynError.message}
                      </div>
                      {dynError.details && (
                        <div className="small text-muted border-top border-danger pt-2 mt-2 font-monospace text-start dir-ltr">
                          Supabase Error Details: {dynError.details} {dynError.code ? `(Code: ${dynError.code})` : ''}
                        </div>
                      )}
                      {(dynError.code === '42P01' || dynError.message.includes('supabase_migration.sql')) && (
                        <div className="mt-2 p-2 bg-dark text-white rounded-3 small dir-ltr text-start font-monospace">
                          <strong>Fix Action Required:</strong> Run <code>supabase_migration.sql</code> in Supabase SQL Editor.
                        </div>
                      )}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label fw-bold">العنوان الرئيس <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="مثال: مؤتمر الشباب / رحلة العائلات / كورس العقيدة"
                        value={dynTitle}
                        onChange={(e) => setDynTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label fw-bold">النوع / القسم</label>
                      <select
                        className="form-select"
                        value={dynCategory}
                        onChange={(e) => setDynCategory(e.target.value)}
                      >
                        <option value="نشاط الأحد">نشاط الأحد</option>
                        <option value="اجتماع خاص">اجتماع خاص</option>
                        <option value="مؤتمر">مؤتمر</option>
                        <option value="رحلة">رحلة</option>
                        <option value="نهضة">نهضة</option>
                        <option value="مسابقة">مسابقة</option>
                        <option value="كورس">كورس</option>
                        <option value="تنبيه">تنبيه</option>
                        <option value="جدول جديد">جدول جديد</option>
                        <option value="نشاط">نشاط عام</option>
                      </select>
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-bold">العنوان الفرعي (اختياري)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="مثال: تحت رعاية الأنبا... / تفاصيل ومواعيد"
                        value={dynSubtitle}
                        onChange={(e) => setDynSubtitle(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">التاريخ (اختياري)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="مثال: الجمعة 25 سبتمبر 2026"
                        value={dynDate}
                        onChange={(e) => setDynDate(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">الوقت / التوقيت (اختياري)</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="مثال: من 6 مساءً إلى 9 مساءً"
                        value={dynTime}
                        onChange={(e) => setDynTime(e.target.value)}
                      />
                    </div>

                    <div className="col-md-12">
                      <label className="form-label fw-bold">المحتوى / التفاصيل</label>
                      <textarea
                        className="form-control"
                        rows={4}
                        placeholder="اكتب تفاصيل وشروط وساعات هذا النشاط أو البرنامج..."
                        value={dynContent}
                        onChange={(e) => setDynContent(e.target.value)}
                      ></textarea>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-bold">ترتيب العرض</label>
                      <input
                        type="number"
                        className="form-control"
                        value={dynDisplayOrder}
                        onChange={(e) => setDynDisplayOrder(Number(e.target.value))}
                      />
                      <small className="text-muted">الأرقام الأقل تظهر أولاً على الموقع.</small>
                    </div>

                    <div className="col-md-6 d-flex align-items-center">
                      <div className="form-check form-switch mt-3">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="dynActiveSwitch"
                          checked={dynIsActive}
                          onChange={(e) => setDynIsActive(e.target.checked)}
                        />
                        <label className="form-check-input-label fw-bold me-2" htmlFor="dynActiveSwitch">
                          تفعيل وعرض على الموقع الرسمي
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDynamicModal(false)}>
                    إلغاء
                  </button>
                  <button type="submit" className="btn btn-success fw-bold px-4" disabled={isSavingDynamicItem}>
                    {isSavingDynamicItem ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i> جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i> حفظ النشاط
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Deletion Confirmation Dialog for Feedback */}
      {deletingInquiry && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-exclamation-triangle me-2"></i> تأكيد حذف الاقتراح
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDeletingInquiry(null)}></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="fs-5 fw-bold text-dark mb-2">
                  هل أنت متأكد من حذف هذا الاقتراح؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="p-3 bg-light rounded border text-start my-3">
                  <div className="fw-bold text-primary mb-1">صاحب الرسالة: {deletingInquiry.name || 'مجهول'}</div>
                  <div className="small text-muted">{deletingInquiry.message}</div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setDeletingInquiry(null)}
                  disabled={isDeletingInquiry}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold px-4"
                  onClick={handleDeleteInquiryConfirm}
                  disabled={isDeletingInquiry}
                >
                  {isDeletingInquiry ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-1"></i> جاري الحفظ...
                    </>
                  ) : (
                    'تأكيد الحذف النهائي'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Deletion Confirmation Dialog for Dynamic Activity */}
      {deletingDynamicItem && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 10060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title fw-bold">
                  <i className="fas fa-exclamation-triangle me-2"></i> تأكيد حذف النشاط
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setDeletingDynamicItem(null)}></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="fs-5 fw-bold text-dark mb-2">
                  هل أنت متأكد من حذف هذا النشاط؟ لا يمكن التراجع عن هذا الإجراء.
                </p>
                <div className="p-3 bg-light rounded border text-start my-3">
                  <div className="fw-bold text-primary mb-1">{deletingDynamicItem.title}</div>
                  <div className="small text-muted">{deletingDynamicItem.content}</div>
                </div>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary px-4"
                  onClick={() => setDeletingDynamicItem(null)}
                  disabled={isDeletingDynamicItem}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  className="btn btn-danger fw-bold px-4"
                  onClick={handleDeleteDynamicConfirm}
                  disabled={isDeletingDynamicItem}
                >
                  {isDeletingDynamicItem ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-1"></i> جاري الحذف...
                    </>
                  ) : (
                    'تأكيد الحذف النهائي'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
