import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy, addDoc, serverTimestamp, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// TODO: Replace with your actual Firebase config object (must match admin.js)
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
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Dark Mode Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeIcon = themeToggleBtn.querySelector('i');
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        // Apply saved theme on load
        if (currentTheme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
        
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.getAttribute('data-theme') === 'dark';
            if (isDark) {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
        });
    }
    
    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '10px 0';
            navbar.style.boxShadow = '0 4px 10px rgba(27, 59, 111, 0.1)';
        } else {
            navbar.style.padding = '15px 0';
            navbar.style.boxShadow = '0 2px 4px rgba(27, 59, 111, 0.05)';
        }
    });

    // --- Dynamic Updates from Firebase Firestore ---
    const updatesContainer = document.getElementById('dynamic-updates');
    
    async function loadPublicActivities() {
        if (!updatesContainer) return;
        
        try {
            const q = query(collection(db, "activities"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                updatesContainer.innerHTML = '<div class="col-12 text-center text-muted py-5">لا توجد أخبار أو نشاطات حديثة في الوقت الحالي.</div>';
                return;
            }
            
            updatesContainer.innerHTML = '';
            querySnapshot.forEach((docSnap) => {
                const data = docSnap.data();
                
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-4 mb-4';
                
                // Generate image HTML if exists
                const imgHtml = data.imageUrl 
                    ? `<img src="${data.imageUrl}" class="card-img-top activity-img" alt="${data.title}">` 
                    : '';
                
                col.innerHTML = `
                    <div class="card update-card h-100">
                        ${imgHtml}
                        <div class="card-body">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="badge bg-secondary">${data.date}</span>
                                <span class="badge bg-primary">نشاط</span>
                            </div>
                            <h5 class="card-title fw-bold text-white">${data.title}</h5>
                            <p class="card-text text-white-50">${data.description}</p>
                        </div>
                    </div>
                `;
                
                updatesContainer.appendChild(col);
            });
        } catch (error) {
            console.error("Error fetching activities:", error);
            // Fallback content or error message
            updatesContainer.innerHTML = `
                <div class="col-12 text-center text-white">
                    <p>يرجى إعداد اتصال قاعدة البيانات Firebase في لوحة التحكم.</p>
                </div>
            `;
        }
    }

    // --- Load Site Settings ---
    async function loadSiteSettings() {
        try {
            const docRef = doc(db, "settings", "main");
            const docSnap = await getDoc(docRef);
            
            const fridayTimeEl = document.getElementById('friday-time');
            const sundayScheduleEl = document.getElementById('sunday-schedule');
            
            if (docSnap.exists()) {
                const data = docSnap.data();
                
                // Update Friday Time
                if (data.fridayTime && fridayTimeEl) {
                    fridayTimeEl.innerHTML = `<i class="far fa-clock ms-2"></i>${data.fridayTime}`;
                }
                
                // Update Sunday Schedule
                if (data.sundaySchedule && sundayScheduleEl) {
                    sundayScheduleEl.innerHTML = ''; // Clear loading
                    const lines = data.sundaySchedule.split('\n');
                    
                    lines.forEach(line => {
                        const parts = line.split('-').map(p => p.trim());
                        if (parts.length >= 2) {
                            const time = parts[0];
                            const title = parts[1];
                            const desc = parts[2] || '';
                            
                            const tr = document.createElement('tr');
                            tr.innerHTML = `
                                <td>${time}</td>
                                <td>${title}</td>
                                <td>${desc}</td>
                            `;
                            sundayScheduleEl.appendChild(tr);
                        }
                    });
                    
                    // Fallback if no valid lines
                    if (sundayScheduleEl.innerHTML === '') {
                         sundayScheduleEl.innerHTML = '<tr><td colspan="3" class="text-center text-muted">الجدول غير متوفر حالياً.</td></tr>';
                    }
                }
            } else {
                if (fridayTimeEl) fridayTimeEl.innerHTML = `<i class="far fa-clock ms-2"></i>كل يوم جمعة الساعة 7:00 مساءً`;
                if (sundayScheduleEl) sundayScheduleEl.innerHTML = '<tr><td colspan="3" class="text-center text-muted">الجدول غير متوفر حالياً.</td></tr>';
            }
        } catch (error) {
            console.error("Error loading settings:", error);
        }
    }

    loadSiteSettings();
    loadPublicActivities();

    // --- Form Submission Handling (Saving to Firebase) ---
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form fields
            const name = document.getElementById('name').value || 'فاعل خير';
            const hymn = document.getElementById('hymn').value || 'لا يوجد ترنيمة';
            const message = document.getElementById('message').value;
            
            // Get submit button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الإرسال...';
            submitBtn.disabled = true;
            
            try {
                // Save to Firebase Firestore "feedbacks" collection
                await addDoc(collection(db, "feedbacks"), {
                    name: name,
                    hymn: hymn,
                    message: message,
                    createdAt: serverTimestamp()
                });
                
                // Hide form and show success message
                contactForm.innerHTML = `
                    <div class="alert alert-success text-center p-4 rounded-3" role="alert">
                        <h4 class="alert-heading mb-3"><i class="fas fa-check-circle text-success" style="font-size: 2rem;"></i></h4>
                        <h4 class="mb-2">تم استلام رسالتك بنجاح!</h4>
                        <p class="mb-0">شكراً لمشاركتك.. بنهتم بكل كلمة بتوصلنا.</p>
                    </div>
                `;
            } catch (error) {
                console.error("Error adding feedback:", error);
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                alert("حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى.");
            }
        });
    }
});
