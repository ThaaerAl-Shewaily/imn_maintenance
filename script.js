document.addEventListener('DOMContentLoaded', () => {
    loadData();
    showSection('dashboard');
    
    // تفعيل القائمة للموبايل
    const menuToggle = document.getElementById("menu-toggle");
    if(menuToggle) {
        menuToggle.addEventListener("click", function() {
            document.getElementById("wrapper").classList.toggle("toggled");
        });
    }
});

/* -------------------------------------------------------------------------- */
/* 1. قواعد البيانات (الهيكلية + المعرفة + الحلول)           */
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

// قاعدة المعرفة (التشخيص)
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

// --- جديد: قاعدة بيانات الحلول والإجراءات الشائعة ---
const commonSolutions = {
    "حاسبة": [
        "تمت فرمتة الحاسبة وتنصيب ويندوز 10 مع البرامج",
        "تم تنظيف الجهاز من الغبار واستبدال المعجون الحراري",
        "تم استبدال القرص الصلب التالف بـ SSD جديد",
        "تم استبدال الرام (RAM) التالفة",
        "تم تنصيب حزمة التعريفات كاملة",
        "تم إزالة الفيروسات وتحديث النظام",
        "تم صيانة مزود الطاقة (Power Supply)"
    ],
    "طابعة": [
        "تم استبدال علبة الحبر (Toner)",
        "تم إجراء تنظيف لرأس الطباعة (Head Cleaning)",
        "تم إخراج الورق المحشور وتنظيف الرولات",
        "تم تعريف الطابعة على حاسبة المستفيد",
        "تم صيانة ساحبة الورق"
    ],
    "ups": [
        "تم استبدال البطارية الداخلية (12V/7AH)",
        "تم استبدال البطارية الداخلية (12V/9AH)",
        "تم تبديل الفيوز الداخلي وتشغيل الجهاز",
        "تم صيانة البورد الإلكتروني"
    ],
    "network": [
        "تم إعادة توجيه النانو ستيشن وضبط الإشارة",
        "تم استبدال كيبل الشبكة UTP",
        "تم تغيير رأسية الكيبل (RJ45)",
        "تم معالجة تضارب الآيبيات (IP Conflict)",
        "تم استبدال جهاز السويتش (Switch)"
    ]
};

/* -------------------------------------------------------------------------- */
/* 2. إدارة الحالة                                             */
/* -------------------------------------------------------------------------- */

let tickets = JSON.parse(localStorage.getItem('imn_tickets')) || [];
let technicians = JSON.parse(localStorage.getItem('imn_technicians')) || ["فني صيانة 1"]; 
let myChartInstance = null;
let editingTicketId = null;

/* -------------------------------------------------------------------------- */
/* 3. التوجيه                                                  */
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

// --- ب. نموذج البلاغ (مع القوائم الذكية للأعطال والحلول) ---
function renderNewTicketForm(container) {
    let deptOptions = departments.map(d => `<option value="${d}">${d}</option>`).join('');
    let techOptions = technicians.map(t => `<option value="${t}">`).join('');

    let formTitle = "تسجيل بلاغ صيانة جديد";
    let btnText = "حفظ البلاغ";
    let btnClass = "btn-primary";
    let currentData = {};

    if (editingTicketId) {
        const t = tickets.find(x => x.id === editingTicketId);
        if (t) {
            currentData = t;
            formTitle = `تعديل البلاغ رقم: ${t.id}`;
            btnText = "حفظ التعديلات";
            btnClass = "btn-warning text-dark";
        }
    }

    container.innerHTML = `
        <h2 class="mb-4">${formTitle}</h2>
        <div class="card p-4 shadow-sm">
            <form id="ticketForm" onsubmit="saveTicket(event)">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">الجهة المستفيدة</label>
                        <select class="form-select" id="dept" required>
                            <option value="">-- اختر --</option>
                            ${deptOptions}
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">نوع الجهاز</label>
                        <select class="form-select" id="deviceType" onchange="updateLists()" required>
                            <option value="حاسبة">حاسبة (PC/Laptop)</option>
                            <option value="طابعة">طابعة / سكنر</option>
                            <option value="ups">جهاز UPS</option>
                            <option value="network">أجهزة شبكات</option>
                        </select>
                    </div>
                </div>
                
                <div class="mb-3">
                    <label class="form-label">وصف العطل (اختر أو اكتب)</label>
                    <input type="text" class="form-control" id="description" list="issues-list" onkeyup="checkExpert()" placeholder="مثال: شاشة زرقاء، بطيء..." required autocomplete="off">
                    <datalist id="issues-list"></datalist>
                    <div id="expertArea" class="expert-suggestion"></div>
                </div>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">الإجراء المتخذ (الحل)</label>
                        <input type="text" class="form-control" id="action" list="solutions-list" placeholder="اختر حلاً أو اكتب تفاصيل..." autocomplete="off">
                        <datalist id="solutions-list"></datalist>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">اسم الفني</label>
                        <input type="text" class="form-control" id="technician" list="tech-list" placeholder="ابحث أو اكتب اسم جديد..." required autocomplete="off">
                        <datalist id="tech-list">
                            ${techOptions}
                        </datalist>
                    </div>
                </div>
                
                <div class="d-flex gap-2">
                    <button type="submit" class="btn ${btnClass} btn-lg flex-grow-1"><i class="fas fa-save"></i> ${btnText}</button>
                    ${editingTicketId ? `<button type="button" class="btn btn-secondary btn-lg" onclick="cancelEdit()">إلغاء</button>` : ''}
                </div>
            </form>
        </div>
    `;

    // تعبئة البيانات عند التعديل
    if (editingTicketId && currentData.id) {
        document.getElementById('dept').value = currentData.dept;
        document.getElementById('deviceType').value = currentData.device;
        document.getElementById('description').value = currentData.desc;
        document.getElementById('action').value = currentData.action === "لا يوجد" ? "" : currentData.action;
        document.getElementById('technician').value = currentData.technician;
    }
    
    // تحديث القوائم عند التحميل
    updateLists();
}

// دالة موحدة لتحديث قائمة الأعطال وقائمة الحلول بناءً على الجهاز
function updateLists() {
    const type = document.getElementById('deviceType').value;
    
    // 1. تحديث قائمة الأعطال
    const issuesList = document.getElementById('issues-list');
    issuesList.innerHTML = '';
    if (expertLogic[type]) {
        Object.keys(expertLogic[type]).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            issuesList.appendChild(option);
        });
    }

    // 2. تحديث قائمة الحلول (الجديدة)
    const solutionsList = document.getElementById('solutions-list');
    solutionsList.innerHTML = '';
    if (commonSolutions[type]) {
        commonSolutions[type].forEach(solution => {
            const option = document.createElement('option');
            option.value = solution;
            solutionsList.appendChild(option);
        });
    }

    checkExpert(); // إعادة فحص الخبير
}

function saveTicket(e) {
    e.preventDefault();
    const dept = document.getElementById('dept').value;
    const device = document.getElementById('deviceType').value;
    const desc = document.getElementById('description').value;
    const actionVal = document.getElementById('action').value;
    const techName = document.getElementById('technician').value.trim();
    
    if (techName && !technicians.includes(techName)) {
        technicians.push(techName);
        localStorage.setItem('imn_technicians', JSON.stringify(technicians));
    }

    if (editingTicketId) {
        const index = tickets.findIndex(t => t.id === editingTicketId);
        if (index !== -1) {
            tickets[index].dept = dept;
            tickets[index].device = device;
            tickets[index].desc = desc;
            tickets[index].action = actionVal || "لا يوجد";
            tickets[index].technician = techName;
            tickets[index].status = actionVal ? 'تم الإنجاز' : 'قيد الانتظار';
        }
        alert('تم تعديل البيانات بنجاح ✅');
        editingTicketId = null;
    } else {
        const newTicket = {
            id: Date.now(),
            date: new Date().toLocaleDateString('ar-IQ'),
            dept: dept,
            device: device,
            desc: desc,
            action: actionVal || "لا يوجد",
            technician: techName,
            status: actionVal ? 'تم الإنجاز' : 'قيد الانتظار'
        };
        tickets.unshift(newTicket);
        alert('تم حفظ البلاغ في الأرشيف ✅');
    }

    localStorage.setItem('imn_tickets', JSON.stringify(tickets));
    showSection('archive');
}

function cancelEdit() { editingTicketId = null; showSection('archive'); }

// --- ج. الأرشيف والطباعة ---
function renderArchive(container) {
    let rows = tickets.map(t => `
        <tr>
            <td>${t.id}</td>
            <td>${t.dept}</td>
            <td>${t.device}</td>
            <td class="text-truncate" style="max-width: 150px;">${t.desc}</td>
            <td>${t.technician || '-'}</td>
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
        <h2 class="mb-4">أرشيف الصيانة</h2>
        <div class="card p-3 shadow-sm">
            <div class="table-responsive">
                <table class="table table-hover align-middle">
                    <thead class="table-dark">
                        <tr>
                            <th>رقم الوصل</th>
                            <th>الجهة</th>
                            <th>الجهاز</th>
                            <th>العطل</th>
                            <th>الفني</th>
                            <th>الحالة</th>
                            <th>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>${rows || '<tr><td colspan="7" class="text-center">لا توجد سجلات حالياً</td></tr>'}</tbody>
                </table>
            </div>
        </div>
    `;
}

function editTicket(id) { editingTicketId = id; showSection('new-ticket'); }
function deleteTicket(id) {
    if(confirm('هل أنت متأكد من حذف هذا السجل نهائياً؟')) {
        tickets = tickets.filter(t => t.id !== id);
        localStorage.setItem('imn_tickets', JSON.stringify(tickets));
        renderArchive(document.getElementById('main-content'));
    }
}

function checkExpert() {
    const type = document.getElementById('deviceType').value;
    const desc = document.getElementById('description').value.toLowerCase();
    const expertDiv = document.getElementById('expertArea');
    let suggestions = [];
    
    let keys = expertLogic[type] || {};
    for (const [key, solution] of Object.entries(keys)) {
        if (desc.includes(key)) {
            suggestions.push(solution);
        }
    }

    if (suggestions.length > 0) {
        expertDiv.innerHTML = "💡 <strong>اقتراح النظام الخبير:</strong> " + suggestions.join("<br>");
        expertDiv.style.display = 'block';
    } else {
        expertDiv.style.display = 'none';
    }
}

function printTicket(id) {
    const t = tickets.find(ticket => ticket.id === id);
    if (!t) return;
    const printArea = document.getElementById('print-area');
    printArea.innerHTML = `
        <div class="receipt-box">
            <div class="receipt-header">
                <h2>شبكة الإعلام العراقي (IMN)</h2>
                <h4>مديرية تكنولوجيا المعلومات / قسم الصيانة</h4>
                <h5>استمارة صيانة ودعم فني</h5>
            </div>
            <div class="row mt-4" style="direction: rtl;">
                <div class="col-6"><strong>رقم الوصل:</strong> ${t.id}</div>
                <div class="col-6 text-start"><strong>التاريخ:</strong> ${t.date}</div>
            </div>
            <hr>
            <div style="direction: rtl; text-align: right;">
                <p><strong>الجهة المستفيدة:</strong> ${t.dept}</p>
                <p><strong>نوع الجهاز:</strong> ${t.device}</p>
                <p><strong>وصف العطل:</strong><br>${t.desc}</p>
                <p><strong>الإجراء الفني المتخذ:</strong><br>${t.action}</p>
            </div>
            <hr>
            <div class="row mt-5" style="direction: rtl;">
                <div class="col-6 text-center"><p><strong>توقيع الفني المنفذ</strong></p><br><p>${t.technician}</p></div>
                <div class="col-6 text-center"><p><strong>استلام الجهة المستفيدة</strong></p><br><p>.................................</p></div>
            </div>
            <div class="text-center mt-4 small text-muted">تم استخراج هذا الوصل آلياً من نظام الدعم الفني الذكي</div>
        </div>
    `;
    window.print();
}

function loadData() { console.log("System Ready"); }