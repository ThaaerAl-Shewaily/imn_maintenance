// **********************************************************
// رابط الاتصال بقاعدة بيانات Google Sheets
const API_URL = "https://script.google.com/macros/s/AKfycbwHo1zsnMUt94ixdOnRbdVAbO_v_BUV7SnRmgTmTbTltduddYeBDzX5crYhFg3AgruG/exec"; 
// **********************************************************

document.addEventListener('DOMContentLoaded', () => {
    loadData(); // جلب البيانات عند بدء التشغيل
    showSection('dashboard');
    
    // تفعيل القائمة الجانبية للموبايل
    const menuToggle = document.getElementById("menu-toggle");
    if(menuToggle) {
        menuToggle.addEventListener("click", function() {
            document.getElementById("wrapper").classList.toggle("toggled");
        });
    }
});

/* -------------------------------------------------------------------------- */
/* 1. البيانات الثابتة (المديريات + النظام الخبير)           */
/* -------------------------------------------------------------------------- */

const departments = [
    "مكتب رئيس الشبكة", "مكتب مجلس الأمناء", "مديرية التخطيط والإحصاء",
    "مديرية التدقيق والرقابة الداخلية", "الدائرة القانونية", "مديرية العلاقات والإعلام",
    "قناة العراقية العامة", "قناة العراقية الإخبارية", "قناة العراقية الرياضية",
    "قناة العراقية الكردية", "قناة العراقية التركمانية", "قناة العراقية السريانية",
    "قناة العراقية التربوية", "مديرية إذاعة جمهورية العراق", "إذاعة القرآن الكريم",
    "راديو العراقية / الفرقان", "إذاعة شهرزاد", "إذاعة الجيل", "مديرية جريدة الصباح",
    "مجلة الشبكة العراقية", "وكالة الأنباء العراقية (واع)", "مديرية تكنولوجيا المعلومات (IT)",
    "مديرية الشؤون الهندسية", "مديرية الشؤون الإدارية", "مديرية الشؤون المالية",
    "مديرية الشؤون التجارية", "مديرية المطابع", "مديرية الأرشيف الوطني",
    "معهد التدريب الإعلامي", "مديرية الخدمات والنقل", "مديرية أمن الشبكة"
];

const expertLogic = {
    "حاسبة": {
        "بطيء": "تحقق من برامج بدء التشغيل، افحص الفيروسات، أو اقترح ترقية الهارد إلى SSD.",
        "تعليق": "تجمّد النظام قد يكون بسبب تلف ملفات النظام أو باد سكتور في الهارد.",
        "حرارة": "نظف مراوح التبريد، واستبدل المعجون الحراري للمعالج.",
        "انطفاء": "افحص مزود الطاقة (PSU) وتأكد من عدم ارتفاع حرارة المعالج.",
        "ريستارت": "غالباً بسبب تضارب التعريفات أو خلل في الرام (RAM).",
        "شاشة زرقاء": "BSOD: قم بتحديث التعريفات، افحص الرام، وتأكد من سلامة الهارد.",
        "شاشة سوداء": "تأكد من كابلات الشاشة، نظف الرام، أو افحص كرت الشاشة.",
        "صوت عالي": "صوت الضجيج يصدر عادة من المراوح التالفة.",
        "تكتكة": "صوت نقر من الهارد ديسك يعني تلفه ميكانيكياً.",
        "انترنت": "تأكد من تعريف كرت الشبكة واعدادات IP و DNS."
    },
    "طابعة": {
        "خطوط": "تنظيف رأس الطباعة (Head Cleaning) أو استبدال الحبر.",
        "حشر": "التحقق من مسار الورق وتنظيف الرولات المطاطية.",
        "تعريف": "إعادة تثبيت التعريف من السيرفر.",
        "باهت": "مستوى الحبر منخفض أو وضع توفير الحبر مفعل."
    },
    "ups": {
        "صوت": "البطارية تالفة أو حمل زائد.",
        "إطفاء": "الفيوز الداخلي محترق أو اللوحة الإلكترونية تالفة.",
        "بطارية": "الجهاز لا يحفظ الشحن. يجب استبدال البطاريات."
    },
    "network": {
        "إشارة": "توجيه النانو ستيشن أو وجود عوائق.",
        "ايب": "تضارب في العناوين (IP Conflict)."
    }
};

const commonSolutions = {
    "حاسبة": ["تمت فرمتة الحاسبة وتنصيب ويندوز 10", "تم تنظيف الجهاز واستبدال المعجون الحراري", "تم استبدال القرص الصلب بـ SSD", "تم استبدال الرام (RAM)", "تم تنصيب حزمة التعريفات", "تم إزالة الفيروسات", "تم صيانة مزود الطاقة (PSU)"],
    "طابعة": ["تم استبدال علبة الحبر", "تم تنظيف رأس الطباعة", "تم إخراج الورق المحشور", "تم تعريف الطابعة", "تم صيانة ساحبة الورق"],
    "ups": ["تم استبدال البطارية (12V/7AH)", "تم استبدال البطارية (12V/9AH)", "تم تبديل الفيوز الداخلي", "تم صيانة البورد الإلكتروني"],
    "network": ["تم توجيه النانو ستيشن", "تم استبدال كيبل الشبكة", "تم تغيير رأسية الكيبل (RJ45)", "تم معالجة تضارب الآيبيات", "تم استبدال السويتش"]
};

/* -------------------------------------------------------------------------- */
/* 2. المتغيرات العامة                                         */
/* -------------------------------------------------------------------------- */

let tickets = []; // سيتم ملؤها من الشيت
let technicians = JSON.parse(localStorage.getItem('imn_technicians')) || ["فني صيانة 1"]; 
let myChartInstance = null;
let editingTicketId = null;

/* -------------------------------------------------------------------------- */
/* 3. التوجيه (Routing)                                        */
/* -------------------------------------------------------------------------- */

function showSection(sectionId) {
    if (sectionId !== 'new-ticket') editingTicketId = null;
    const contentDiv = document.getElementById('main-content');
    
    document.querySelectorAll('.list-group-item').forEach(el => el.classList.remove('active'));
    const activeBtn = document.querySelector(`[onclick="showSection('${sectionId}')"]`);
    if(activeBtn) activeBtn.classList.add('active');

    if (sectionId === 'dashboard') renderDashboard(contentDiv);
    else if (sectionId === 'new-ticket') renderNewTicketForm(contentDiv);
    else if (sectionId === 'archive') renderArchive(contentDiv);
}

// --- دالة جلب البيانات (GET) ---
async function loadData() {
    const contentDiv = document.getElementById('main-content');
    // مؤشر تحميل بسيط إذا كنا في لوحة المعلومات أو الأرشيف
    const isDashboard = document.querySelector('[onclick="showSection(\'dashboard\')"]').classList.contains('active');
    
    if(isDashboard && contentDiv) {
        contentDiv.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">جاري الاتصال بالسجل المركزي...</p></div>';
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // التحقق من أن البيانات مصفوفة
        if (Array.isArray(data)) {
            tickets = data.reverse(); // الأحدث أولاً
        }
        
        // تحديث العرض إذا كنا في لوحة المعلومات
        if(isDashboard) {
            renderDashboard(contentDiv);
        }
    } catch (error) {
        console.error("Error loading data:", error);
        // في حال الخطأ نعرض البيانات المحلية القديمة إن وجدت أو رسالة
        if(isDashboard && contentDiv) {
            contentDiv.innerHTML = `<div class="alert alert-warning text-center">فشل جلب البيانات من السيرفر. تأكد من الاتصال بالإنترنت.<br><small>${error}</small></div>`;
        }
    }
}

/* -------------------------------------------------------------------------- */
/* 4. الوظائف الرئيسية (لوحة المعلومات، النموذج، الأرشيف)     */
/* -------------------------------------------------------------------------- */

function renderDashboard(container) {
    const total = tickets.length;
    const pending = tickets.filter(t => t.status === 'قيد الانتظار').length;
    const completed = tickets.filter(t => t.status === 'تم الإنجاز').length;

    container.innerHTML = `
        <h2 class="mb-4">لوحة المعلومات</h2>
        <div class="row g-4">
            <div class="col-md-4"><div class="card bg-primary text-white p-3 shadow"><h3>${total}</h3><p>إجمالي البلاغات</p></div></div>
            <div class="col-md-4"><div class="card bg-warning text-dark p-3 shadow"><h3>${pending}</h3><p>قيد الانتظار</p></div></div>
            <div class="col-md-4"><div class="card bg-success text-white p-3 shadow"><h3>${completed}</h3><p>تمت الصيانة</p></div></div>
        </div>
        <div class="row mt-5">
            <div class="col-md-8 mx-auto"><div class="card p-4 shadow-sm"><h4 class="mb-3">إحصائيات الأعطال</h4><canvas id="myChart"></canvas></div></div>
        </div>
    `;
    setTimeout(renderChart, 100);
}

function renderChart() {
    const ctx = document.getElementById('myChart');
    if (!ctx) return;
    const deviceCounts = { 'حاسبة': 0, 'طابعة': 0, 'ups': 0, 'network': 0 };
    tickets.forEach(t => { if (deviceCounts[t.device] !== undefined) deviceCounts[t.device]++; });
    
    if (myChartInstance) myChartInstance.destroy();
    if (typeof Chart !== 'undefined') {
        myChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(deviceCounts),
                datasets: [{ label: 'عدد الأجهزة', data: Object.values(deviceCounts), backgroundColor: ['#0d6efd', '#dc3545', '#ffc107', '#198754'] }]
            },
            options: { responsive: true }
        });
    }
}

function renderNewTicketForm(container) {
    let deptOptions = departments.map(d => `<option value="${d}">${d}</option>`).join('');
    let techOptions = technicians.map(t => `<option value="${t}">`).join('');
    
    container.innerHTML = `
        <h2 class="mb-4">تسجيل بلاغ صيانة جديد</h2>
        <div class="card p-4 shadow-sm">
            <form id="ticketForm" onsubmit="saveTicket(event)">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">الجهة المستفيدة</label>
                        <select class="form-select" id="dept" required><option value="">-- اختر --</option>${deptOptions}</select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">نوع الجهاز</label>
                        <select class="form-select" id="deviceType" onchange="updateLists()" required>
                            <option value="حاسبة">حاسبة</option><option value="طابعة">طابعة</option>
                            <option value="ups">UPS</option><option value="network">شبكات</option>
                        </select>
                    </div>
                </div>
                <div class="mb-3">
                    <label class="form-label">وصف العطل</label>
                    <input type="text" class="form-control" id="description" list="issues-list" onkeyup="checkExpert()" required autocomplete="off">
                    <datalist id="issues-list"></datalist>
                    <div id="expertArea" class="expert-suggestion"></div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">الإجراء المتخذ</label>
                        <input type="text" class="form-control" id="action" list="solutions-list" autocomplete="off">
                        <datalist id="solutions-list"></datalist>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">اسم الفني</label>
                        <input type="text" class="form-control" id="technician" list="tech-list" required autocomplete="off">
                        <datalist id="tech-list">${techOptions}</datalist>
                    </div>
                </div>
                <div class="d-grid">
                    <button type="submit" id="saveBtn" class="btn btn-primary btn-lg"><i class="fas fa-paper-plane"></i> حفظ وإرسال للتدقيق</button>
                </div>
            </form>
        </div>
    `;
    updateLists();
}

function updateLists() {
    const type = document.getElementById('deviceType').value;
    const issuesList = document.getElementById('issues-list');
    const solutionsList = document.getElementById('solutions-list');
    issuesList.innerHTML = ''; solutionsList.innerHTML = '';
    
    if (expertLogic[type]) Object.keys(expertLogic[type]).forEach(k => issuesList.innerHTML += `<option value="${k}">`);
    if (commonSolutions[type]) commonSolutions[type].forEach(s => solutionsList.innerHTML += `<option value="${s}">`);
    checkExpert();
}

// --- دالة الحفظ والإرسال (POST) ---
async function saveTicket(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    
    // تغيير حالة الزر لمنع التكرار
    const originalBtnText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> جاري الإرسال للسيرفر...';
    saveBtn.disabled = true;

    const newTicket = {
        id: Date.now(),
        date: new Date().toLocaleDateString('ar-IQ'),
        dept: document.getElementById('dept').value,
        device: document.getElementById('deviceType').value,
        desc: document.getElementById('description').value,
        action: document.getElementById('action').value || "لا يوجد",
        technician: document.getElementById('technician').value,
        status: document.getElementById('action').value ? 'تم الإنجاز' : 'قيد الانتظار'
    };
    
    // حفظ اسم الفني محلياً للمستقبل
    if (!technicians.includes(newTicket.technician)) {
        technicians.push(newTicket.technician);
        localStorage.setItem('imn_technicians', JSON.stringify(technicians));
    }

    try {
        // الإرسال بطريقة no-cors (تطلق الطلب ولا تنتظر قراءة الرد لتجنب مشاكل المتصفح)
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTicket)
        });

        // بما أننا نستخدم no-cors، نفترض النجاح إذا لم يحدث خطأ في الشبكة
        alert('✅ تم حفظ البيانات في السجل المركزي بنجاح!');
        
        // تحديث القائمة المحلية فوراً ليرى المستخدم النتيجة
        tickets.unshift(newTicket);
        showSection('archive');
        
    } catch (error) {
        console.error("Error saving:", error);
        alert("❌ حدث خطأ أثناء الاتصال بالسيرفر! يرجى المحاولة مجدداً.");
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnText;
    }
}

function renderArchive(container) {
    let rows = tickets.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.dept}</td>
            <td>${t.device}</td>
            <td class="text-truncate" style="max-width: 150px;">${t.desc}</td>
            <td>${t.technician}</td>
            <td><span class="badge ${t.status === 'تم الإنجاز' ? 'bg-success' : 'bg-warning'}">${t.status}</span></td>
            <td><button class="btn btn-sm btn-info text-white" onclick="printTicket(${t.id})"><i class="fas fa-print"></i></button></td>
        </tr>
    `).join('');

    container.innerHTML = `
        <h2 class="mb-4">أرشيف الصيانة المركزي</h2>
        <div class="card p-3 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark"><tr><th>رقم الوصل</th><th>الجهة</th><th>الجهاز</th><th>العطل</th><th>الفني</th><th>الحالة</th><th>طباعة</th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="7" class="text-center">جاري جلب البيانات من السجل...</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
}

function checkExpert() {
    const type = document.getElementById('deviceType').value;
    const desc = document.getElementById('description').value.toLowerCase();
    const expertDiv = document.getElementById('expertArea');
    let suggestions = [];
    if (expertLogic[type]) {
        for (const [key, solution] of Object.entries(expertLogic[type])) {
            if (desc.includes(key)) suggestions.push(solution);
        }
    }
    expertDiv.innerHTML = suggestions.length > 0 ? "💡 <strong>النظام الخبير:</strong> " + suggestions.join("<br>") : "";
    expertDiv.style.display = suggestions.length > 0 ? 'block' : 'none';
}

function printTicket(id) {
    const t = tickets.find(ticket => ticket.id == id);
    if (!t) return;
    document.getElementById('print-area').innerHTML = `
        <div class="receipt-box">
            <div class="receipt-header"><h2>شبكة الإعلام العراقي</h2><h4>النظام المركزي للعمليات التقنية</h4></div>
            <div class="row mt-4" style="direction: rtl;"><div class="col-6"><strong>رقم الوصل:</strong> ${t.id}</div><div class="col-6 text-start"><strong>التاريخ:</strong> ${t.date}</div></div><hr>
            <div style="direction: rtl; text-align: right;"><p><strong>الجهة:</strong> ${t.dept}</p><p><strong>الجهاز:</strong> ${t.device}</p><p><strong>العطل:</strong><br>${t.desc}</p><p><strong>الإجراء:</strong><br>${t.action}</p></div><hr>
            <div class="row mt-5" style="direction: rtl;"><div class="col-6 text-center"><p><strong>الفني المنفذ</strong></p><br><p>${t.technician}</p></div><div class="col-6 text-center"><p><strong>استلام الجهة</strong></p><br><p>....................</p></div></div>
        </div>`;
    window.print();
}