// **********************************************************
// رابط الاتصال بقاعدة بيانات Google Sheets (API)
const API_URL = "https://script.google.com/macros/s/AKfycbzEX0NqliSPUGjCgA_cBnPHpJdCTusGYzCIdJ58kG0vXrmTDsCH21VYv_Td4ZfKSfR9/exec"; 
// كلمة المرور الخاصة بالحذف
const DELETE_PASSWORD = "imnitpc18";
// **********************************************************

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showSection('dashboard');
    
    const menuToggle = document.getElementById("menu-toggle");
    if(menuToggle) {
        menuToggle.addEventListener("click", function() {
            document.getElementById("wrapper").classList.toggle("toggled");
        });
    }
});

/* -------------------------------------------------------------------------- */
/* 1. البيانات الثابتة                                                       */
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
/* 2. المتغيرات العامة                                                       */
/* -------------------------------------------------------------------------- */

let tickets = [];
let technicians = JSON.parse(localStorage.getItem('imn_technicians')) || ["فني صيانة 1"]; 
let myChartInstance = null;
let editingTicketId = null;

/* -------------------------------------------------------------------------- */
/* 3. التوجيه (Routing)                                                      */
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

// --- دالة جلب البيانات ---
async function loadData() {
    const contentDiv = document.getElementById('main-content');
    const isDashboard = document.querySelector('[onclick="showSection(\'dashboard\')"]').classList.contains('active');
    
    if(isDashboard && contentDiv) {
        contentDiv.innerHTML = '<div class="text-center mt-5"><div class="spinner-border text-primary" role="status"></div><p class="mt-2 text-muted">جاري الاتصال بالسجل المركزي...</p></div>';
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (Array.isArray(data)) {
            tickets = data.reverse();
        }
        
        if(isDashboard) {
            renderDashboard(contentDiv);
        }
    } catch (error) {
        console.error("Error loading data:", error);
        if(isDashboard && contentDiv) {
            contentDiv.innerHTML = `<div class="alert alert-warning text-center">فشل جلب البيانات. تأكد من الإنترنت.<br><small>${error}</small></div>`;
        }
    }
}

/* -------------------------------------------------------------------------- */
/* 4. وظائف الواجهات                                                        */
/* -------------------------------------------------------------------------- */

// --- أ. لوحة المعلومات ---
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

// --- ب. نموذج البلاغ (مع التاريخ القابل للتعديل) ---
function renderNewTicketForm(container) {
    let deptOptions = departments.map(d => `<option value="${d}">${d}</option>`).join('');
    let techOptions = technicians.map(t => `<option value="${t}">`).join('');
    
    // إعدادات الوضع (جديد أو تعديل)
    let formTitle = "تسجيل بلاغ صيانة جديد";
    let btnText = "حفظ وإرسال للتدقيق";
    let btnIcon = "fa-paper-plane";
    let btnClass = "btn-primary";
    
    // التاريخ الافتراضي: اليوم (بصيغة YYYY-MM-DD لمدخل الـ input date)
    let defaultDate = new Date().toISOString().split('T')[0];

    // إذا كنا في وضع التعديل
    if (editingTicketId) {
        const t = tickets.find(x => x.id === editingTicketId);
        if (t) {
            formTitle = `تعديل البلاغ رقم: ${t.id}`;
            btnText = "حفظ التعديلات";
            btnIcon = "fa-save";
            btnClass = "btn-warning text-dark";
            
            // محاولة تحويل تاريخ البلاغ (dd/mm/yyyy) إلى (yyyy-mm-dd) ليعرض في الحقل
            // ملاحظة: إذا كان التاريخ محفوظاً بصيغة أخرى قد يحتاج معالجة، هنا نفترض التنسيق القياسي
            if (t.date) {
               // إذا كان التاريخ مخزناً بالفعل بصيغة متوافقة، نستخدمه. 
               // إذا كان بصيغة عربية محلية قد لا يظهر في الـ Input date مباشرة، لذا نستخدم المنطق البسيط:
               // نحاول استخدامه، إذا لم يعمل سيعود لتاريخ اليوم أو يبقى فارغاً
               // لتحسين الدقة: سنقوم بحفظ التاريخ بصيغة قياسية في الحفظ، وتنسيقه عند العرض فقط.
               
               // سنقوم بتحويل التاريخ من التنسيق المحلي للعرض في الحقل (تخمين التنسيق)
               // الأفضل: سنعتمد على أن البيانات الجديدة ستكون قياسية.
               // للبيانات القديمة: قد لا يظهر التاريخ في الحقل، لذا سيأخذ تاريخ اليوم افتراضياً.
               
               // سنحاول استخراج التاريخ بطريقة بسيطة إذا كان مخزناً كنص
               // (هذا الجزء يعتمد على كيفية تخزين التاريخ سابقاً، سنفترض أنه نص)
               
               // الحل العملي: سنستخدم defaultDate كتاريخ اليوم، إلا إذا استطعنا قراءة تاريخ التذكرة
               // في النسخ السابقة كنا نحفظه LocaleString.
            }
        }
    }

    container.innerHTML = `
        <h2 class="mb-4">${formTitle}</h2>
        <div class="card p-4 shadow-sm">
            <form id="ticketForm" onsubmit="saveTicket(event)">
                
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">تاريخ البلاغ</label>
                        <input type="date" class="form-control" id="ticketDate" required value="${defaultDate}">
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">الجهة المستفيدة</label>
                        <select class="form-select" id="dept" required><option value="">-- اختر --</option>${deptOptions}</select>
                    </div>
                </div>

                <div class="mb-3">
                     <label class="form-label">نوع الجهاز</label>
                     <select class="form-select" id="deviceType" onchange="updateLists()" required>
                        <option value="حاسبة">حاسبة</option><option value="طابعة">طابعة</option>
                        <option value="ups">UPS</option><option value="network">شبكات</option>
                     </select>
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
                
                <div class="d-flex gap-2">
                    <button type="submit" id="saveBtn" class="btn ${btnClass} btn-lg flex-grow-1"><i class="fas ${btnIcon}"></i> ${btnText}</button>
                    ${editingTicketId ? `<button type="button" class="btn btn-secondary btn-lg" onclick="cancelEdit()">إلغاء</button>` : ''}
                </div>
            </form>
        </div>
    `;
    
    // تعبئة البيانات في حالة التعديل
    if (editingTicketId) {
        const t = tickets.find(x => x.id === editingTicketId);
        if (t) {
            document.getElementById('dept').value = t.dept;
            document.getElementById('deviceType').value = t.device;
            document.getElementById('description').value = t.desc;
            document.getElementById('action').value = t.action === "لا يوجد" ? "" : t.action;
            document.getElementById('technician').value = t.technician;
            
            // محاولة ضبط التاريخ في الحقل
            // نقوم بقلب التاريخ من DD/MM/YYYY إلى YYYY-MM-DD ليعمل الـ input date
            if (t.date.includes('/')) {
                const parts = t.date.split('/'); // assuming d/m/y or m/d/y depending on locale
                // نظرًا لأننا استخدمنا ar-IQ سابقاً، فهو غالباً yyyy/m/d أو d/m/yyyy.
                // لتجنب التعقيد، إذا كان التنسيق غير متوافق، سيبقى الحقل يعرض تاريخ اليوم.
                // الحل الأفضل مستقبلاً هو توحيد صيغة الحفظ.
                
                // هنا سنحاول تحويل التنسيق العراقي (يوم/شهر/سنة)
                if (parts.length === 3) {
                     // محاولة ذكية: إذا كانت السنة هي الجزء الأخير (202X)
                     if (parts[2].length === 4) {
                         const d = parts[0].padStart(2, '0');
                         const m = parts[1].padStart(2, '0');
                         const y = parts[2];
                         document.getElementById('ticketDate').value = `${y}-${m}-${d}`;
                     }
                     // إذا كانت السنة هي الجزء الأول
                     else if (parts[0].length === 4) {
                          const y = parts[0];
                          const m = parts[1].padStart(2, '0');
                          const d = parts[2].padStart(2, '0');
                          document.getElementById('ticketDate').value = `${y}-${m}-${d}`;
                     }
                }
            }
        }
    }

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

// --- ج. حفظ وإرسال البيانات (مع التاريخ المخصص) ---
async function saveTicket(e) {
    e.preventDefault();
    const saveBtn = document.getElementById('saveBtn');
    
    const originalBtnText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> جاري المعالجة...';
    saveBtn.disabled = true;

    // الحصول على التاريخ من الحقل وتحويله للصيغة المطلوبة للعرض (يوم/شهر/سنة)
    const dateInput = document.getElementById('ticketDate').value; // YYYY-MM-DD
    let formattedDate = dateInput;
    if (dateInput) {
        const [y, m, d] = dateInput.split('-');
        formattedDate = `${d}/${m}/${y}`; // تحويل إلى DD/MM/YYYY
    }

    const ticketData = {
        id: editingTicketId || Date.now(), // استخدام المعرف القديم عند التعديل
        date: formattedDate, // استخدام التاريخ المختار
        dept: document.getElementById('dept').value,
        device: document.getElementById('deviceType').value,
        desc: document.getElementById('description').value,
        action: document.getElementById('action').value || "لا يوجد",
        technician: document.getElementById('technician').value,
        status: document.getElementById('action').value ? 'تم الإنجاز' : 'قيد الانتظار'
    };
    
    // حفظ اسم الفني
    if (!technicians.includes(ticketData.technician)) {
        technicians.push(ticketData.technician);
        localStorage.setItem('imn_technicians', JSON.stringify(technicians));
    }

    try {
        await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ticketData)
        });

        // تحديث البيانات محلياً
        if (editingTicketId) {
            const index = tickets.findIndex(t => t.id === editingTicketId);
            if (index !== -1) tickets[index] = ticketData;
            alert('✅ تم تعديل البلاغ بنجاح!');
            editingTicketId = null;
        } else {
            tickets.unshift(ticketData);
            alert('✅ تم حفظ البيانات بنجاح!');
        }
        
        showSection('archive');
        
    } catch (error) {
        console.error("Error saving:", error);
        alert("❌ حدث خطأ أثناء الاتصال بالسيرفر!");
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalBtnText;
    }
}

function cancelEdit() {
    editingTicketId = null;
    showSection('archive');
}

// --- د. الأرشيف (مع أزرار التعديل والحذف المشروط) ---
function renderArchive(container) {
    let rows = tickets.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.dept}</td>
            <td>${t.device}</td>
            <td class="text-truncate" style="max-width: 150px;">${t.desc}</td>
            <td>${t.technician}</td>
            <td><span class="badge ${t.status === 'تم الإنجاز' ? 'bg-success' : 'bg-warning'}">${t.status}</span></td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-warning" onclick="editTicket(${t.id})" title="تعديل"><i class="fas fa-pen"></i></button>
                    <button class="btn btn-sm btn-info text-white" onclick="printTicket(${t.id})" title="طباعة وصل"><i class="fas fa-print"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTicket(${t.id})" title="حذف"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>أرشيف الصيانة المركزي</h2>
            <button class="btn btn-dark" onclick="promptMonthlyReport()">
                <i class="fas fa-file-pdf me-2"></i> استخراج تقرير شهري
            </button>
        </div>
        
        <div class="card p-3 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark"><tr><th>رقم الوصل</th><th>الجهة</th><th>الجهاز</th><th>العطل</th><th>الفني</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="7" class="text-center">جاري جلب البيانات...</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
}

// دالة بدء التعديل
function editTicket(id) {
    editingTicketId = id;
    showSection('new-ticket');
}

// دالة الحذف المشروط بكلمة سر
function deleteTicket(id) {
    const password = prompt("⚠️ إجراء حساس: أدخل كلمة المرور لحذف هذا التقرير:");
    
    if (password === DELETE_PASSWORD) {
        if(confirm('هل أنت متأكد تماماً؟ سيتم حذف السجل من العرض الحالي.')) {
            // حذف من المصفوفة المحلية
            tickets = tickets.filter(t => t.id !== id);
            renderArchive(document.getElementById('main-content'));
            
            // ملاحظة: الحذف من Google Sheets يتطلب تعديلاً خاصاً في Apps Script لدعم دالة الحذف
            // حالياً سيختفي من واجهتك فقط.
        }
    } else if (password !== null) {
        alert("⛔ كلمة المرور غير صحيحة! لا تمتلك صلاحية الحذف.");
    }
}

// --- هـ. دوال مساعدة ---
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

// --- و. التقرير الشهري ---
function promptMonthlyReport() {
    const currentDate = new Date();
    const input = prompt("أدخل الشهر والسنة للتقرير (مثال: 1/2026):", `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`);
    if (input) {
        const [m, y] = input.split('/');
        if(m && y) generateMonthlyReport(parseInt(m), parseInt(y));
        else alert("تنسيق التاريخ غير صحيح.");
    }
}

function generateMonthlyReport(month, year) {
    const monthlyTickets = tickets.filter(t => {
        // محاولة تحليل التاريخ المخزن كنص (dd/mm/yyyy)
        if (!t.date) return false;
        const parts = t.date.split('/');
        if (parts.length !== 3) return false;
        
        // افتراض التنسيق dd/mm/yyyy
        const d = parseInt(parts[0]);
        const m = parseInt(parts[1]);
        const y = parseInt(parts[2]);
        
        return m === month && y === year;
    });

    if (monthlyTickets.length === 0) {
        alert(`لا توجد بيانات لشهر ${month}/${year}`);
        return;
    }

    const total = monthlyTickets.length;
    const completed = monthlyTickets.filter(t => t.status.includes('تم')).length;
    const pending = total - completed;
    
    const rows = monthlyTickets.map((t, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${t.date}</td>
            <td>${t.dept}</td>
            <td>${t.device}</td>
            <td>${t.desc}</td>
            <td>${t.action}</td>
            <td>${t.technician}</td>
            <td>${t.status}</td>
        </tr>
    `).join('');

    const printArea = document.getElementById('print-area');
    printArea.innerHTML = `
        <div class="report-box" style="direction: rtl; padding: 20px;">
            <div class="text-center mb-5">
                <h4>شبكة الإعلام العراقي (IMN)</h4>
                <h5>مديرية تكنولوجيا المعلومات / قسم الصيانة</h5>
                <hr style="border-top: 2px solid #000;">
                <h2 style="margin-top: 20px; text-decoration: underline;">تقرير الموقف الفني الشهري</h2>
                <p>عن شهر: <strong>${month} / ${year}</strong></p>
            </div>
            <div style="border: 1px solid #000; padding: 15px; margin-bottom: 20px; display: flex; justify-content: space-around; background-color: #f8f9fa;">
                <div><strong>المجموع:</strong> ${total}</div>
                <div><strong>المنجز:</strong> ${completed}</div>
                <div><strong>قيد الانتظار:</strong> ${pending}</div>
            </div>
            <table class="table table-bordered" style="width: 100%; border-collapse: collapse; text-align: right; font-size: 12px;">
                <thead style="background-color: #e9ecef;">
                    <tr>
                        <th style="border: 1px solid #000;">ت</th><th style="border: 1px solid #000;">التاريخ</th>
                        <th style="border: 1px solid #000;">الجهة</th><th style="border: 1px solid #000;">الجهاز</th>
                        <th style="border: 1px solid #000;">العطل</th><th style="border: 1px solid #000;">الإجراء</th>
                        <th style="border: 1px solid #000;">الفني</th><th style="border: 1px solid #000;">الموقف</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
            <div style="margin-top: 60px; display: flex; justify-content: space-between; text-align: center;">
                <div style="width: 30%;"><p><strong>منظم التقرير</strong></p><br><br><p>.........................</p></div>
                <div style="width: 30%;"><p><strong>مدير القسم</strong></p><br><br><p>.........................</p></div>
                <div style="width: 30%;"><p><strong>مدير IT</strong></p><br><br><p>.........................</p></div>
            </div>
            <div style="text-align: center; margin-top: 30px; font-size: 10px; color: #666;">تم استخراج التقرير آلياً من النظام المركزي للعمليات التقنية</div>
        </div>
    `;
    window.print();
}