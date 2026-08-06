// main.js - Public facing logic with REST API & UI Enhancements
const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS Animation Library
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out-cubic',
    });

    // Initialize core functions
    startCountdown();
    loadSettings();
    loadAnnouncements();
    setupContactForm();
});

// --- Countdown Timer Logic ---
function startCountdown() {
    // Set target day to next Friday at 19:00 (7 PM) Cairo time
    function getNextFriday() {
        const now = new Date();
        const resultDate = new Date(now);
        
        resultDate.setHours(19, 0, 0, 0); // 7:00 PM

        // Calculate days to next Friday (Friday is 5)
        let daysToFriday = (5 - now.getDay() + 7) % 7;
        
        // If today is Friday but past 7 PM, target next week's Friday
        if (daysToFriday === 0 && now.getHours() >= 19) {
            daysToFriday = 7;
        }
        
        resultDate.setDate(now.getDate() + daysToFriday);
        return resultDate;
    }

    const targetDate = getNextFriday().getTime();

    const updateTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            // Meeting is happening now or we miscalculated slightly, reset for next week
            clearInterval(updateTimer);
            document.getElementById("cd-days").innerText = "00";
            document.getElementById("cd-hours").innerText = "00";
            document.getElementById("cd-minutes").innerText = "00";
            document.getElementById("cd-seconds").innerText = "00";
            setTimeout(startCountdown, 60000); // Restart calculation after 1 minute
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Pad with zero
        document.getElementById("cd-days").innerText = days < 10 ? '0' + days : days;
        document.getElementById("cd-hours").innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById("cd-minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById("cd-seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
        
    }, 1000);
}

// --- Fetch Settings ---
async function loadSettings() {
    try {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        
        const settings = await response.json();
        
        // Update Friday Time
        const fridayTimeEl = document.getElementById('friday-time');
        if (fridayTimeEl && settings.friday_time) {
            fridayTimeEl.innerHTML = `<i class="far fa-clock ms-2"></i>${settings.friday_time}`;
        }
        
        // Update Sunday Schedule
        const sundayScheduleEl = document.getElementById('sunday-schedule');
        if (sundayScheduleEl && settings.sunday_schedule) {
            const scheduleLines = settings.sunday_schedule.split('\\n');
            let html = '';
            
            scheduleLines.forEach(line => {
                const parts = line.split('-').map(p => p.trim());
                if (parts.length >= 3) {
                    html += `
                        <tr>
                            <td class="fw-bold fs-5">${parts[0]}</td>
                            <td class="text-primary fw-bold fs-5">${parts[1]}</td>
                            <td class="text-start text-muted">${parts.slice(2).join(' - ')}</td>
                        </tr>
                    `;
                }
            });
            
            if (html) {
                sundayScheduleEl.innerHTML = html;
            } else {
                sundayScheduleEl.innerHTML = `<tr><td colspan="3" class="text-center text-muted">لم يتم إضافة جدول بعد.</td></tr>`;
            }
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// --- Fetch Announcements ---
async function loadAnnouncements() {
    try {
        const response = await fetch(`${API_URL}/announcements`);
        if (!response.ok) throw new Error('Failed to fetch announcements');
        
        const announcements = await response.json();
        const container = document.getElementById('dynamic-updates');
        
        if (!container) return;
        
        if (announcements.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center text-white-50 py-5">
                    <i class="far fa-calendar-times fs-1 mb-3"></i>
                    <p>لا توجد أخبار أو نشاطات في الوقت الحالي.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        announcements.forEach((ann, index) => {
            // Stagger animations based on index
            const delay = (index % 3) * 150;
            html += `
                <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${delay}">
                    <div class="update-card text-start">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="badge bg-accent text-dark rounded-pill px-3 py-2 fw-bold"><i class="far fa-calendar-alt me-1"></i> ${ann.date}</span>
                        </div>
                        <h4 class="mb-3 text-white fw-bold">${ann.title}</h4>
                        <p class="text-white-50 mb-0" style="line-height: 1.8;">${ann.description}</p>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
        
    } catch (error) {
        console.error('Error loading announcements:', error);
        const container = document.getElementById('dynamic-updates');
        if (container) {
            container.innerHTML = `<div class="col-12 text-center text-danger">حدث خطأ أثناء تحميل الأخبار. يرجى المحاولة لاحقاً.</div>`;
        }
    }
}

// --- Setup Contact Form with Success Modal Animation ---
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitBtn.disabled = true;
        
        const name = document.getElementById('name').value;
        const hymnRequest = document.getElementById('hymn').value;
        const message = document.getElementById('message').value;
        
        try {
            const response = await fetch(`${API_URL}/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, hymnRequest, message })
            });
            
            if (!response.ok) throw new Error('Failed to submit form');
            
            // Hide form and show success alert in the modal
            form.classList.add('d-none');
            const successAlert = document.getElementById('success-alert');
            successAlert.classList.remove('d-none');
            
            // Optional: Auto close modal after 3 seconds
            setTimeout(() => {
                const qaModalEl = document.getElementById('qaModal');
                const modal = bootstrap.Modal.getInstance(qaModalEl);
                if (modal) {
                    modal.hide();
                }
                
                // Reset form for future opens
                setTimeout(() => {
                    form.reset();
                    form.classList.remove('d-none');
                    successAlert.classList.add('d-none');
                }, 500);
            }, 3000);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('عذراً، حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة لاحقاً.');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}
