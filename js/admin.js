// admin.js - Admin Dashboard logic using REST API with JWT Auth
const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Login Form Submit
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout Button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Add Activity Form
    const addActivityForm = document.getElementById('add-activity-form');
    if (addActivityForm) {
        addActivityForm.addEventListener('submit', handleAddActivity);
    }
    
    // Settings Form
    const settingsForm = document.getElementById('settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleUpdateSettings);
    }
});

// Authentication Check
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (token) {
        // Show dashboard, hide login
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('dashboard-section').style.display = 'flex';
        document.getElementById('logout-btn').style.display = 'block';
        
        loadDashboardData();
    } else {
        // Show login, hide dashboard
        document.getElementById('login-section').style.display = 'flex';
        document.getElementById('dashboard-section').style.display = 'none';
        document.getElementById('logout-btn').style.display = 'none';
    }
}

// Handle Login
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('login-error');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'جاري الدخول...';
    errorDiv.classList.add('d-none');
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            localStorage.setItem('adminToken', data.token);
            checkAuth();
        } else {
            errorDiv.textContent = data.error || 'فشل تسجيل الدخول';
            errorDiv.classList.remove('d-none');
        }
    } catch (error) {
        errorDiv.textContent = 'حدث خطأ في الاتصال بالسيرفر';
        errorDiv.classList.remove('d-none');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'دخول';
    }
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('adminToken');
    checkAuth();
}

// Helper to get Auth Headers
function getAuthHeaders() {
    const token = localStorage.getItem('adminToken');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    };
}

// Load Dashboard Data (Announcements, Inquiries, Settings)
function loadDashboardData() {
    loadActivities();
    loadFeedbacks();
    loadSettingsData();
}

// Load Activities
async function loadActivities() {
    try {
        const response = await fetch(`${API_URL}/announcements`);
        const activities = await response.json();
        const list = document.getElementById('activities-list');
        
        if (activities.length === 0) {
            list.innerHTML = `<div class="text-center py-4 text-muted">لا توجد أنشطة مضافة حالياً.</div>`;
            return;
        }
        
        list.innerHTML = activities.map(act => `
            <div class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-1">${act.title} <span class="badge bg-secondary ms-2">${act.date}</span></h6>
                    <small class="text-muted">${act.description.substring(0, 50)}...</small>
                </div>
                <button class="btn btn-sm btn-danger" onclick="deleteActivity(${act.id})"><i class="fas fa-trash"></i></button>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load activities', error);
    }
}

// Load Feedbacks
async function loadFeedbacks() {
    try {
        const response = await fetch(`${API_URL}/admin/inquiries`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 401) handleLogout();
            throw new Error('Unauthorized');
        }
        
        const feedbacks = await response.json();
        const tbody = document.getElementById('feedbacks-list');
        
        if (feedbacks.length === 0) {
            tbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted">لا توجد رسائل حالياً.</td></tr>`;
            return;
        }
        
        tbody.innerHTML = feedbacks.map(f => `
            <tr>
                <td>${f.name || 'مجهول'}</td>
                <td>${f.hymnRequest || '-'}</td>
                <td><p class="mb-0" style="white-space: pre-wrap;">${f.message}</p></td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load feedbacks', error);
    }
}

// Load Settings Data into form
async function loadSettingsData() {
    try {
        const response = await fetch(`${API_URL}/settings`);
        const settings = await response.json();
        
        if (settings.friday_time) {
            document.getElementById('setting-friday-time').value = settings.friday_time;
        }
        if (settings.sunday_schedule) {
            document.getElementById('setting-sunday-schedule').value = settings.sunday_schedule;
        }
    } catch (error) {
        console.error('Failed to load settings', error);
    }
}

// Handle Add Activity
async function handleAddActivity(e) {
    e.preventDefault();
    
    const title = document.getElementById('act-title').value;
    const date = document.getElementById('act-date').value;
    const description = document.getElementById('act-desc').value;
    const btn = document.getElementById('add-btn');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
    
    try {
        const response = await fetch(`${API_URL}/admin/announcements`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ title, date, description })
        });
        
        if (!response.ok) {
            if (response.status === 401) handleLogout();
            throw new Error('Failed to add activity');
        }
        
        e.target.reset();
        loadActivities(); // Reload list
        alert('تم إضافة النشاط بنجاح!');
        
    } catch (error) {
        alert('حدث خطأ أثناء الإضافة');
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'إضافة النشاط';
    }
}

// Global function to delete activity
window.deleteActivity = async function(id) {
    if (!confirm('هل أنت متأكد من حذف هذا النشاط؟')) return;
    
    try {
        const response = await fetch(`${API_URL}/admin/announcements/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            if (response.status === 401) handleLogout();
            throw new Error('Failed to delete');
        }
        
        loadActivities(); // Reload list
    } catch (error) {
        alert('حدث خطأ أثناء الحذف');
    }
}

// Handle Update Settings
async function handleUpdateSettings(e) {
    e.preventDefault();
    
    const friday_time = document.getElementById('setting-friday-time').value;
    const sunday_schedule = document.getElementById('setting-sunday-schedule').value;
    const btn = document.getElementById('save-settings-btn');
    
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
    
    try {
        const response = await fetch(`${API_URL}/admin/settings`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({ friday_time, sunday_schedule })
        });
        
        if (!response.ok) {
            if (response.status === 401) handleLogout();
            throw new Error('Failed to update settings');
        }
        
        alert('تم حفظ الإعدادات بنجاح! ستظهر التعديلات على الموقع مباشرة.');
    } catch (error) {
        alert('حدث خطأ أثناء حفظ الإعدادات');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-save me-2"></i> حفظ الإعدادات في الموقع';
    }
}
