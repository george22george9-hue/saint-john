import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace with your actual Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyCBjTPMq7Fqrl0xxEgguDu7v5qO5b_JTTY",
  authDomain: "saint-john-meeting.firebaseapp.com",
  projectId: "saint-john-meeting",
  storageBucket: "saint-john-meeting.firebasestorage.app",
  messagingSenderId: "530031879944",
  appId: "1:530031879944:web:9e06f7ab4ee3a0653f2ebd",
  measurementId: "G-QTP71DBPFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const logoutBtn = document.getElementById('logout-btn');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const addActivityForm = document.getElementById('add-activity-form');
const activitiesList = document.getElementById('activities-list');
const feedbacksList = document.getElementById('feedbacks-list');
const settingsForm = document.getElementById('settings-form');
const fridayTimeInput = document.getElementById('setting-friday-time');
const sundayScheduleInput = document.getElementById('setting-sunday-schedule');

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'flex';
        logoutBtn.style.display = 'block';
        loadActivities();
        loadFeedbacks();
        loadSettings();
    } else {
        // User is signed out
        loginSection.style.display = 'flex';
        dashboardSection.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
});

// Login Form Submit
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            loginError.classList.add('d-none');
            loginForm.reset();
        })
        .catch((error) => {
            console.error("Error signing in", error);
            loginError.textContent = "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
            loginError.classList.remove('d-none');
        });
});

// Logout Button
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch((error) => console.error("Error signing out", error));
});

// Add New Activity
addActivityForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('add-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'جاري الإضافة...';
    btn.disabled = true;
    
    const title = document.getElementById('act-title').value;
    const date = document.getElementById('act-date').value;
    const description = document.getElementById('act-desc').value;
    
    try {
        await addDoc(collection(db, "activities"), {
            title: title,
            date: date,
            description: description,
            createdAt: serverTimestamp()
        });
        
        addActivityForm.reset();
        loadActivities(); // Refresh the list
    } catch (e) {
        console.error("Error adding document: ", e);
        alert("حدث خطأ أثناء إضافة النشاط.");
    } finally {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});

// Load and Display Activities
async function loadActivities() {
    activitiesList.innerHTML = '<div class="text-center py-4"><span class="spinner-border text-primary"></span></div>';
    
    try {
        const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        activitiesList.innerHTML = ''; // Clear loading
        
        if (querySnapshot.empty) {
            activitiesList.innerHTML = '<div class="text-center py-4 text-muted">لا توجد أنشطة حالياً.</div>';
            return;
        }
        
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            
            const item = document.createElement('div');
            item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center mb-2 rounded border';
            
            item.innerHTML = `
                <div>
                    <h6 class="mb-1 fw-bold">${data.title} <span class="badge bg-secondary ms-2">${data.date}</span></h6>
                    <small class="text-muted">${data.description}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${docSnap.id}">
                    <i class="fas fa-trash-alt"></i> حذف
                </button>
            `;
            
            activitiesList.appendChild(item);
        });
        
        // Add delete event listeners
        const deleteBtns = document.querySelectorAll('.delete-btn');
        deleteBtns.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                if (confirm("هل أنت متأكد من حذف هذا النشاط؟")) {
                    const id = e.currentTarget.getAttribute('data-id');
                    try {
                        await deleteDoc(doc(db, "activities", id));
                        loadActivities(); // Refresh list
                    } catch (err) {
                        console.error("Error deleting", err);
                        alert("حدث خطأ أثناء الحذف");
                    }
                }
            });
        });
        
    } catch (error) {
        console.error("Error loading activities: ", error);
        activitiesList.innerHTML = `
            <div class="alert alert-warning">
                فشل في تحميل البيانات. يرجى التأكد من أنك قمت بإضافة Firebase Config الخاص بك الصحيح.
            </div>
        `;
    }
}

// Load and Display Feedbacks
async function loadFeedbacks() {
    feedbacksList.innerHTML = '<tr><td colspan="3" class="text-center text-muted"><span class="spinner-border spinner-border-sm"></span> جاري التحميل...</td></tr>';
    
    try {
        const q = query(collection(db, "feedbacks"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        feedbacksList.innerHTML = '';
        
        if (querySnapshot.empty) {
            feedbacksList.innerHTML = '<tr><td colspan="3" class="text-center text-muted">لا توجد رسائل حالياً.</td></tr>';
            return;
        }
        
        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${data.name || 'فاعل خير'}</td>
                <td>${data.hymn || '-'}</td>
                <td>${data.message || '-'}</td>
            `;
            feedbacksList.appendChild(row);
        });
        
    } catch (error) {
        console.error("Error loading feedbacks:", error);
        feedbacksList.innerHTML = '<tr><td colspan="3" class="text-center text-danger">حدث خطأ أثناء تحميل الرسائل.</td></tr>';
    }
}

// Load Settings
async function loadSettings() {
    try {
        const docRef = doc(db, "settings", "main");
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.fridayTime) fridayTimeInput.value = data.fridayTime;
            if (data.sundaySchedule) sundayScheduleInput.value = data.sundaySchedule;
        } else {
            // Default initial text if doc doesn't exist
            fridayTimeInput.value = "كل يوم جمعة الساعة 7:00 مساءً";
            sundayScheduleInput.value = "5 دقائق - صلاة الافتتاح - البدء بالصلاة وطلب بركة وقيادة الروح القدس لليوم.\n15 دقيقة - فقرة تنشيطية - لعب سوا وكسر الجليد لخلق جو من البهجة والترابط.\n60 دقيقة - محاضرة عقيدية - محاضرة في العقيدة والدفاعيات للإجابة عن التساؤلات العقيدية وإرساء الإيمان.\n30 دقيقة - ورشة عمل - تطبيق ومناقشة عميقة وتفاعلية على المحاضرة لضمان الفهم والتثبيت.\n15 دقيقة - استراحة (بريك) - وقت محبة وتواصل وشركة بين الشباب (أغابي).\n30 دقيقة - تطوير المهارات - تدريب عملي على أساسيات برامج (Microsoft Office) لتطوير المهارات المهنية.\n15 دقيقة - فقرة ختامية - فقرة ترفيهية ختامية والصلاة الختامية.";
        }
    } catch (error) {
        console.error("Error loading settings:", error);
    }
}

// Save Settings
settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('save-settings-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> جاري الحفظ...';
    btn.disabled = true;
    
    try {
        await setDoc(doc(db, "settings", "main"), {
            fridayTime: fridayTimeInput.value,
            sundaySchedule: sundayScheduleInput.value,
            updatedAt: serverTimestamp()
        });
        
        btn.innerHTML = '<i class="fas fa-check me-2"></i> تم الحفظ بنجاح!';
        btn.classList.replace('btn-primary', 'btn-success');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.replace('btn-success', 'btn-primary');
            btn.disabled = false;
        }, 3000);
    } catch (error) {
        console.error("Error saving settings:", error);
        alert("حدث خطأ أثناء حفظ الإعدادات.");
        btn.innerHTML = originalText;
        btn.disabled = false;
    }
});
