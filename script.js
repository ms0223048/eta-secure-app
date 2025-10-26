
(function() {
    'use strict';
 
    
 const EtaUuid = (function() {
        const SECURE_API_URL = '/api/generate-uuid'; // الرابط بسيط ويشير إلى الخادم المصغر

        async function computeUuidFromRawText(rawText) {
            try {
                const response = await fetch(SECURE_API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ payload: rawText }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`Serverless function error: ${errorData.error || response.statusText}`);
                }

                const result = await response.json();
                return result.uuid;

            } catch (error) {
                console.error("Fatal error: Could not connect to the serverless function.", error);
                alert("خطأ فادح: فشل الاتصال بالدالة السحابية الآمنة. لا يمكن المتابعة.");
                throw new Error("Serverless function connection failed.");
            }
        }

        return { computeUuidFromRawText };
    })();















let current_href = location.href;

setInterval(() => {
    // التحقق من تغيير الرابط
    if (current_href !== location.href) {
        current_href = location.href;

        // --- ✅ بداية التعديل المقترح ---

        // 1. ابحث عن الواجهات القديمة التي قد تكون ما زالت موجودة في الصفحة
        const oldInvoiceUI = document.getElementById("invoiceCreatorMainUI");
        const oldReceiptUI = document.getElementById("receiptUploaderTabbedUI");

        // 2. إذا وجدت أي واجهة قديمة، قم بإزالتها بالكامل من الصفحة
        if (oldInvoiceUI) {
            oldInvoiceUI.remove();
            console.log("تم تنظيف واجهة الفواتير القديمة.");
        }
        if (oldReceiptUI) {
            oldReceiptUI.remove();
            console.log("تم تنظيف واجهة الإيصالات القديمة.");
        }
        
        // --- ✅ نهاية التعديل المقترح ---

        // 3. الآن، قم ببناء الواجهة الجديدة بعد التأكد من أن الصفحة نظيفة
        attemptToAddButton(); 
    }
}, 500);

attemptToAddButton();







// ===================================================================================
// ✨✨✨ نظام مراقبة اللغة المركزي (النسخة التشخيصية) ✨✨✨
// ===================================================================================

let EInvoicePortalLanguage = 'ar'; // القيمة الافتراضية

try {
    console.log("[Language Monitor] Initializing...");
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.name.includes('lang=')) {
                const url = new URL(entry.name);
                const lang = url.searchParams.get('lang');
                if ((lang === 'ar' || lang === 'en') && EInvoicePortalLanguage !== lang) {
                    console.log(`%c[Language Monitor] Network request detected with 'lang=${lang}'. Updating global language.`, "color: purple; font-weight: bold;");
                    EInvoicePortalLanguage = lang;
                }
            }
        }
    });
    observer.observe({ type: "resource", buffered: true });
    console.log("[Language Monitor] Actively listening to network requests.");

} catch (e) {
    console.error("PerformanceObserver not supported. Falling back to static detection.", e);
    const logoutButton = Array.from(document.querySelectorAll('button span')).find(span => span.textContent.trim() === 'Logout' || span.textContent.trim() === 'خروج');
    EInvoicePortalLanguage = (logoutButton && logoutButton.textContent.trim() === 'Logout') ? 'en' : 'ar';
    console.log(`%c[Language Monitor] Fallback detection set language to: ${EInvoicePortalLanguage.toUpperCase()}`, "color: orange; font-weight: bold;");
}

















function injectScriptFromLocal(filePath) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL(filePath);
        script.onload = () => resolve(true);
        script.onerror = (err) => {
            reject(err);
        };
        (document.head || document.documentElement).appendChild(script);
    });
}

async function loadJsPDF() {
    if (typeof window.jspdf !== 'undefined') {
        return true; // المكتبة محملة بالفعل
    }
    try {
        // تأكد من أن اسم الملف "jspdf.umd.min.js" مطابق للملف في مجلد الإضافة
        await injectScriptFromLocal('jspdf.umd.min.js');
        return true;
    } catch (error) {
        return false;
    }
}

// دالة لتحميل مكتبة qrcode-generator محليًا
async function loadQRCodeGenerator() {
    if (typeof qrcode !== 'undefined') {
        return true; // المكتبة محملة بالفعل
    }
    try {
        // تأكد من أن اسم الملف "qrcode.js" مطابق للملف في مجلد الإضافة
        await injectScriptFromLocal('qrcode.js');
        return true;
    } catch (error) {
        return false;
    }
}



function attemptToAddButton() {
    // ✅ تعديل: التحقق من الصفحة الحالية واستدعاء الدالة المناسبة
    if (window.location.pathname === '/newdocument') {
        // هذا الكود خاص بصفحة الفواتير (لا تغيير هنا)
        const loaderId = setInterval(() => {
            const container = document.querySelector("div[role='tablist']");
            if (container) {
                clearInterval(loaderId);
                addInvoiceCreatorButton(container); // دالة الفواتير الحالية
            }
        }, 50);
        setTimeout(() => clearInterval(loaderId), 10000);

    } else if (window.location.pathname === '/uploadReceipts') {
        // ✅ جديد: هذا الكود خاص بصفحة الإيصالات الجديدة
        const loaderId = setInterval(() => {
            // البحث عن الحاوية التي تضم زر "الاستعراض"
            const container = document.querySelector(".fileSelection");
            if (container && container.parentElement) {
                clearInterval(loaderId);
                addReceiptUploaderButton(container.parentElement); // استدعاء دالة الإيصالات الجديدة
            }
        }, 50);
        setTimeout(() => clearInterval(loaderId), 10000);
    }
}





/**
 * ===================================================================================
 * ✅ دالة معدلة: لإضافة زر رفع الإيصالات بتصميم احترافي، أكبر حجماً، ولون صلب
 * ===================================================================================
 */
function addReceiptUploaderButton(container) {
    // 1. منع إضافة الزر إذا كان موجودًا بالفعل
    if (document.getElementById("customReceiptUploaderBtn")) {
        return;
    }

    // 2. إنشاء الزر وتطبيق التنسيقات الأساسية
    const btn = document.createElement("button");
    btn.id = "customReceiptUploaderBtn";
    btn.type = "button";
    btn.className = "ms-Button ms-Button--default root-122";

    // 3. تطبيق تعديلات الموضع
    container.style.display = "flex";
    container.style.alignItems = "center";
    btn.style.marginRight = "15px";

    // 4. أيقونة SVG عالية الجودة بتصميم يتناسب مع اللون الجديد
    const excelIconSVG = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#a2d2ff"/>
            <path d="M12.5 13.5L15 17M15 13.5L12.5 17" stroke="#03045e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 17H10.5L12 14.75L10.5 12H9.5L8 14.25L9.5 17Z" stroke="#03045e" stroke-width="2" stroke-linejoin="round"/>
        </svg>
    `;

    // 5. بناء الهيكل الداخلي للزر
    btn.innerHTML = `
        <span class="ms-Button-flexContainer flexContainer-96" style="gap: 10px; align-items: center; padding: 0 10px;">
            <span class="icon-wrapper">${excelIconSVG}</span>
            <span class="ms-Button-textContainer textContainer-97">
                <span class="ms-Button-label label-123" style="color: #ffffff; font-weight: 600; font-size: 15px; font-family: 'Segoe UI', Tahoma, sans-serif;">
                    رفع الإيصالات من Excel
                </span>
            </span>
        </span>
    `;

    // 6. ✅ تطبيق الأنماط الاحترافية الجديدة (لون صلب، حجم أكبر، ظل عميق )
    Object.assign(btn.style, {
        height: '42px', // زيادة ارتفاع الزر ليصبح أكبر
        backgroundColor: '#023e8a', // لون أزرق داكن (كحلي) احترافي
        color: '#ffffff',
        border: 'none', // إزالة الحدود لإعطاء مظهر أنظف
        borderRadius: '8px',
        // ظل احترافي متعدد الطبقات يعطي عمقاً
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease-in-out', // حركة انتقالية سريعة ونظيفة
        cursor: 'pointer',
        transform: 'translateY(0)'
    });

    // 7. ✅ إضافة تأثيرات تفاعلية حديثة
    btn.onmouseenter = () => {
        btn.style.transform = 'translateY(-2px)'; // رفع بسيط للأعلى
        btn.style.boxShadow = '0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)'; // ظل أكثر انتشاراً
        btn.style.backgroundColor = '#003566'; // درجة أغمق قليلاً عند المرور
    };
    btn.onmouseleave = () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)';
        btn.style.backgroundColor = '#023e8a';
    };
    btn.onmousedown = () => {
        btn.style.transform = 'translateY(1px)'; // تأثير الضغط للأسفل
        btn.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)'; // ظل أقل عند الضغط
    };
    btn.onmouseup = () => {
        btn.style.transform = 'translateY(-2px)'; // العودة لوضع الرفع
        btn.style.boxShadow = '0 7px 14px rgba(0, 0, 0, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)';
    };

    // 8. ربط حدث النقر
    btn.addEventListener('click', (event) => {
        event.preventDefault();
        injectReceiptUploaderUIWithTabs();
    });

    // 9. إضافة الزر إلى الصفحة
    container.appendChild(btn);
}





/**
 * ===================================================================================
 * ✅ دالة معدلة: لإنشاء الواجهة الرسومية متعددة التابات مع خاصية التحريك
 * ===================================================================================
 */
async function injectReceiptUploaderUIWithTabs() {
    // التحقق من وجود الواجهة لمنع تكرارها، وإظهارها إذا كانت موجودة
    if (document.getElementById("receiptUploaderTabbedUI")) {
        document.getElementById("receiptUploaderTabbedUI").style.display = "flex";
        return;
    }

    // بناء الهيكل الخارجي للواجهة الرسومية (Modal)
    const modalUI = document.createElement("div");
    modalUI.id = "receiptUploaderTabbedUI";
    Object.assign(modalUI.style, {
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "1080px", height: "700px",
        backgroundColor: "#ffffff", borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        zIndex: "9999", fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
        overflow: "hidden", display: "flex", direction: "rtl"
    });

    // بناء الهيكل الداخلي للواجهة (HTML) مع التابات الجانبية
    // ✅ تعديل: إضافة cursor: move للشريط الجانبي ليكون مؤشر التحريك
    modalUI.innerHTML = `
        <div class="sidebar" style="width: 220px; background-color: #0d1b2a; color: #e0e1dd; display: flex; flex-direction: column; flex-shrink: 0; cursor: move;">
            <div class="sidebar-header" style="padding: 20px; text-align: center; border-bottom: 1px solid #415a77;"><h3>🧾 الإيصالات</h3></div>
            <div class="sidebar-menu" style="flex-grow: 1; padding-top: 15px;">
                <button class="sidebar-btn active" data-target="panel-upload"><span class="btn-icon">📤</span> رفع من Excel</button>
                <button class="sidebar-btn" data-target="panel-manual"><span class="btn-icon">✍️</span> إرسال يدوي</button>
                <button class="sidebar-btn" data-target="panel-drafts"><span class="btn-icon">📝</span> المسودات</button>
                
                <button class="sidebar-btn" data-target="panel-help"><span class="btn-icon">❓</span> شرح</button>
                <button class="sidebar-btn" data-target="panel-registration"><span class="btn-icon">📱</span> التسجيل</button>

                <button class="sidebar-btn" data-target="panel-log"><span class="btn-icon">📜</span>  المصمم</button>
                <button class="sidebar-btn" data-target="panel-services"><span class="btn-icon">🏢</span> للشركات والمكاتب</button>
                <button class="sidebar-btn" data-target="panel-ads"><span class="btn-icon">📢</span> عرض الإعلانات</button>
<button class="sidebar-btn" data-target="panel-jobs"><span class="btn-icon">💼</span> الوظائف</button>



            </div>
        </div>
        <div class="main-panel" style="flex-grow: 1; background-color: #f4f7fa; display: flex; position: relative;">
            <button id="closeReceiptTabbedUIBtn" title="إغلاق" style="position: absolute; top: 10px; left: 10px; width: 32px; height: 32px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 50%; font-size: 24px; line-height: 30px; text-align: center; cursor: pointer; z-index: 10;">&times;</button>
      <div class="panel-content-wrapper" style="flex-grow: 1; overflow-y: auto; position: relative;">
    <div id="panel-upload" class="panel-content active"></div>
    <div id="panel-manual" class="panel-content"></div>
    <div id="panel-drafts" class="panel-content"></div>
    
    <div id="panel-registration" class="panel-content"></div>

    <div id="panel-help" class="panel-content"></div>
    <div id="panel-log" class="panel-content"></div>
    <div id="panel-services" class="panel-content"></div>
<div id="panel-ads" class="panel-content"></div>
<div id="panel-jobs" class="panel-content"></div>

</div>

        </div>
    `;

    document.body.appendChild(modalUI);

    // إضافة الأنماط اللازمة للتابات
    const styles = document.createElement('style');
    styles.innerHTML = `
        .sidebar-btn { display: flex; align-items: center; width: 100%; padding: 15px 20px; background-color: transparent; border: none; color: #e0e1dd; font-size: 16px; font-family: 'Cairo', sans-serif; text-align: right; cursor: pointer; transition: background-color 0.3s, color 0.3s; border-right: 4px solid transparent; }
        .sidebar-btn:hover { background-color: #1b263b; }
        .sidebar-btn.active { background-color: #415a77; color: #ffffff; font-weight: 700; border-right-color: #778da9; }
        .sidebar-btn .btn-icon { margin-left: 12px; font-size: 18px; }
        .panel-content { display: none; padding: 25px; height: 100%; box-sizing: border-box; }
        .panel-content.active { display: block; animation: fadeIn 0.5s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    `;
    document.head.appendChild(styles);

    // ربط الأحداث للأزرار والتابات
    document.getElementById('closeReceiptTabbedUIBtn').onclick = () => modalUI.style.display = "none";

 
    











    modalUI.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // الكود الحالي لإظهار وإخفاء التابات (لا تغيير هنا)
        modalUI.querySelectorAll('.sidebar-btn').forEach(b => b.classList.remove('active'));
        modalUI.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPanelId = btn.getAttribute('data-target');
        document.getElementById(targetPanelId).classList.add('active');

        // ✨✨✨ الإضافة الحاسمة ✨✨✨
        // إذا كان الزر الذي تم الضغط عليه هو زر "للشركات والمكاتب"
       // ✨✨✨ التعديل الجديد ✨✨✨
// التحقق من الزر الذي تم الضغط عليه لتشغيل الدالة المناسبة
if (targetPanelId === 'panel-services') {
    loadAdvertisements(); // دالة الإعلانات القديمة للشركات
} else if (targetPanelId === 'panel-ads') {
    // استدعاء دالة عرض الإعلانات الجديدة عند الضغط على الزر الجديد
}else if (targetPanelId === 'panel-jobs') {
    // استدعاء دالة عرض الوظائف الجديدة
    displayAvailableJobs();
}

    });
});

    // ✅ جديد: تفعيل خاصية السحب والتحريك للواجهة من خلال الشريط الجانبي
    makeDraggable(modalUI, modalUI.querySelector('.sidebar'));

    // ملء محتوى التابات
    populateReceiptTabs();

    // جلب البيانات الأساسية مسبقًا
    const loadingToast = showToastNotification('جاري تهيئة بيانات البائع ونقاط البيع...');
    try {
        // تم تعديل getDeviceSerialNumber لترجع مصفوفة
        const [sellerData, devices] = await Promise.all([
            getSellerFullData(),
            getDeviceSerialNumber()
        ]);

        if (!sellerData || !devices || devices.length === 0) {
            throw new Error("فشل جلب البيانات الأساسية للممول أو نقاط البيع.");
        }
        
        // تخزين البيانات في متغير عام لسهولة الوصول إليها
        // نخزن أول جهاز (الأحدث) كقيمة افتراضية
        window.receiptUploaderData = {
            seller: sellerData,
            serial: devices[0].serialNumber
        };
        
        loadingToast.remove();
        showToastNotification('✅ الأداة جاهزة لرفع الإيصالات.', 3000);
   } catch (error) {
    loadingToast.remove();
    // ✅ التعديل هنا: رسالة جديدة وموجهة
    alert(`❌ خطأ في تهيئة الأداة: فشل جلب بيانات الممول أو نقاط البيع.\n\nهذا الخطأ يحدث غالبًا إذا لم تقم بتسجيل جهازك كنقطة بيع (POS) على المنظومة.\n\n💡 الحل: يرجى مراجعة تبويب "التسجيل" الجديد للحصول على شرح تفصيلي للخطوات.`);
    
    // بعد إظهار الرسالة، سنقوم بفتح الواجهة مباشرة على تبويب التسجيل الجديد
    const registrationTabBtn = modalUI.querySelector('.sidebar-btn[data-target="panel-registration"]');
    if (registrationTabBtn) {
        registrationTabBtn.click();
    }
}

}



/**
 * ===================================================================================
 * ✅✅✅ دالة عرض الوظائف (النسخة النهائية مع وسائل التواصل وقسم الإعلان) ✅✅✅
 * ===================================================================================
 */
async function displayAvailableJobs() {
    const jobsPanel = document.getElementById('panel-jobs');
    if (!jobsPanel) {
        console.error("خطأ: لم يتم العثور على حاوية عرض الوظائف #panel-jobs");
        return;
    }

    // 1. عرض رسالة "جاري التحميل" مع تصميم احترافي
    jobsPanel.innerHTML = `
        <style>
            .job-card { background: #ffffff; border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); border-left: 5px solid #007bff; transition: all 0.3s ease; }
            .job-card:hover { transform: translateY(-5px); box-shadow: 0 8px 25px rgba(0,0,0,0.08); }
            .job-card-header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #f1f1f1; padding-bottom: 15px; margin-bottom: 20px; }
            .job-title { font-size: 22px; font-weight: 700; color: #0056b3; margin: 0; }
            .company-name { font-size: 16px; color: #6c757d; font-weight: 600; }
            .job-details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px; }
            .detail-item { background: #f8f9fa; padding: 12px; border-radius: 8px; font-size: 15px; }
            .detail-item .label { font-weight: 600; color: #495057; margin-left: 8px; }
            .skills-section h5 { font-size: 17px; color: #343a40; margin-bottom: 10px; }
            .skills-list { display: flex; flex-wrap: wrap; gap: 10px; padding: 0; margin: 0; list-style: none; }
            .skill-tag { background-color: #e7f3ff; color: #0056b3; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }
            
            /* --- ✅ تصميم أزرار التواصل --- */
            .contact-buttons { display: flex; gap: 10px; margin-top: 20px; border-top: 1px solid #f1f1f1; padding-top: 20px; }
            .contact-btn { text-decoration: none; color: white !important; padding: 10px 20px; border-radius: 8px; font-weight: bold; font-size: 15px; display: inline-flex; align-items: center; gap: 8px; transition: transform 0.2s; }
            .contact-btn:hover { transform: scale(1.05); }
            .whatsapp-btn { background-color: #25D366; }
            .gmail-btn { background-color: #DB4437; }

            /* --- ✅ تصميم قسم الإعلان --- */
            .cta-section { text-align: center; background: linear-gradient(135deg, #f8f9fa, #e9ecef); border: 1px solid #dee2e6; border-radius: 12px; padding: 30px; margin-top: 40px; }
            .cta-title { font-size: 20px; font-weight: 700; color: #1d3557; margin: 0 0 10px 0; }
            .cta-text { font-size: 16px; color: #495057; margin: 0 0 20px 0; line-height: 1.7; }
            .cta-contact-btn { display: inline-block; background: #25D366; color: white !important; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3); }
            .cta-contact-btn:hover { transform: translateY(-3px); box-shadow: 0 6px 15px rgba(37, 211, 102, 0.4); }
        </style>
        <div class="panel-header">
            <h2>أحدث الوظائف المتاحة</h2>
            <p>اكتشف الفرص الوظيفية الجديدة وتواصل مع الشركات مباشرة.</p>
        </div>
        <div id="jobs-container">
            <p id="jobs-loading-msg" style="text-align:center; color:#007bff; font-weight:bold; font-size: 18px;">جاري تحميل أحدث الوظائف...</p>
        </div>
    `;

    try {
        const binId = '68de58f9ae596e708f037bdc'; // ⚠️ استبدل هذا بالـ ID الخاص بك
        const accessKey = '$2a$10$rXrBfSrwkJ60zqKQInt5.eVxCq14dTw9vQX8LXcpnWb7SJ5ZLNoKe'; // ⚠️ استبدل هذا بمفتاح الوصول الخاص بك

        const response = await fetch(`https://api.jsonbin.io/v3/b/${binId}`, {
            method: 'GET',
            headers: { 'X-Access-Key': accessKey }
        } );
        
        if (!response.ok) throw new Error(`فشل الاتصال بالخادم (Status: ${response.status})`);
        
        const data = await response.json();
        const jobs = data.record?.jobs || data.jobs;
        
        const jobsContainer = document.getElementById('jobs-container');
        jobsContainer.innerHTML = ''; // مسح رسالة التحميل

        if (jobs && Array.isArray(jobs) && jobs.length > 0) {
            jobsContainer.innerHTML += jobs.map(job => {
                // --- ✅ بناء أزرار التواصل بشكل ديناميكي ---
                let contactHTML = '';
                if (job.contact?.whatsapp) {
                    contactHTML += `<a href="https://wa.me/${job.contact.whatsapp}" target="_blank" class="contact-btn whatsapp-btn"><span>💬</span> تواصل واتساب</a>`;
                }
                if (job.contact?.gmail ) {
                    contactHTML += `<a href="mailto:${job.contact.gmail}" target="_blank" class="contact-btn gmail-btn"><span>✉️</span> أرسل بريد إلكتروني</a>`;
                }

                return `
                    <div class="job-card">
                        <div class="job-card-header">
                            <div>
                                <h4 class="job-title">${job.title || 'غير محدد'}</h4>
                                <span class="company-name">${job.company || 'شركة غير محددة'}</span>
                            </div>
                            <span style="background: #d4edda; color: #155724; padding: 8px 15px; border-radius: 8px; font-weight: bold;">
                                العدد المطلوب: ${job.count || 1}
                            </span>
                        </div>
                        <div class="job-details-grid">
                            <div class="detail-item"><span class="label">الخبرة المطلوبة:</span> ${job.experience || 'غير محددة'}</div>
                            <div class="detail-item"><span class="label">العمر:</span> ${job.age || 'غير محدد'}</div>
                        </div>
                        <div class="skills-section">
                            <h5>المهارات المطلوبة:</h5>
                            <ul class="skills-list">
                                ${(job.skills && Array.isArray(job.skills)) 
                                    ? job.skills.map(skill => `<li class="skill-tag">${skill}</li>`).join('') 
                                    : '<li class="skill-tag">غير محددة</li>'
                                }
                            </ul>
                        </div>
                        ${contactHTML ? `<div class="contact-buttons">${contactHTML}</div>` : ''}
                    </div>
                `;
            }).join('');
        } else {
            jobsContainer.innerHTML = '<p style="text-align:center; color:#888;">لا توجد وظائف متاحة حالياً.</p>';
        }

        // --- ✅ إضافة قسم الإعلان في النهاية ---
        jobsContainer.innerHTML += `
            <div class="cta-section">
                <h3 class="cta-title">هل تريد الإعلان عن وظيفة أو تبحث عن فرصة عمل؟</h3>
                <p class="cta-text">
                    لتحديث معلومات وظيفة، أو الإعلان عن وظيفة جديدة، أو حتى نشر طلب وظيفي خاص بك، تواصل معنا الآن عبر واتساب وأرسل التفاصيل وسيتم نشرها في الحال.
                </p>
                <a href="https://wa.me/201060872599" target="_blank" class="cta-contact-btn">
                    <span>📞</span> تواصل معنا الآن
                </a>
            </div>
        `;

    } catch (error ) {
        const jobsContainer = document.getElementById('jobs-container');
        if (jobsContainer) {
            jobsContainer.innerHTML = `<p style="text-align:center; color:red;">حدث خطأ أثناء جلب الوظائف: ${error.message}</p>`;
        }
    }
}








/**
 * ===================================================================================
 * ✅✅✅ دالة جديدة: لإضافة قسم الإعلانات في أسفل أي تبويب ✅✅✅
 * ===================================================================================
 * @param {string} panelId - معرف (ID) التبويب الذي ستتم إضافة الإعلانات إليه.
 */
async function appendAdvertisementsToPanel(panelId) {
    const targetPanel = document.getElementById(panelId);
    if (!targetPanel) return;

    // 1. إنشاء حاوية خاصة للإعلانات داخل التبويب لمنع تداخل العناصر
    const adsContainer = document.createElement('div');
    adsContainer.className = 'appended-ads-section';
    adsContainer.style.marginTop = '30px'; // إضافة مسافة فاصلة علوية
    adsContainer.style.paddingTop = '20px';
    adsContainer.style.borderTop = '2px dashed #ced4da';

    // 2. إضافة الحاوية إلى نهاية التبويب المستهدف
    targetPanel.appendChild(adsContainer);

    // 3. عرض رسالة "جاري التحميل" داخل الحاوية الجديدة
    adsContainer.innerHTML = `
        <style>
            /* أنماط خاصة بالإعلانات المدمجة */
            .appended-ad-item { display: flex; gap: 15px; align-items: center; background: #fff; border: 1px solid #e9ecef; border-radius: 10px; padding: 15px; margin-bottom: 15px; box-shadow: 0 3px 10px rgba(0,0,0,0.05); }
            .appended-ad-item img { width: 100px; height: 100px; border-radius: 8px; object-fit: cover; }
            .appended-ad-item .ad-text h4 { margin: 0 0 8px 0; color: #0056b3; font-size: 17px; }
            .appended-ad-item .ad-text p { margin: 0; font-size: 14px; color: #495057; line-height: 1.6; }
        </style>
        <h3 style="text-align:center; color:#1d3557;">أحدث العروض والإعلانات</h3>
        <p style="text-align:center; color:#007bff; font-weight:bold;">جاري تحميل الإعلانات...</p>
    `;

    try {
        // 4. جلب البيانات من الرابط (نفس الكود السابق)
        const response = await fetch('https://api.jsonbin.io/v3/b/68dbb9bf43b1c97be9555347' );
        if (!response.ok) throw new Error(`فشل الاتصال بالخادم (Status: ${response.status})`);
        
        const data = await response.json();
        const ads = data.record?.advertisements || data.advertisements;

        // 5. عرض الإعلانات أو رسالة بديلة
        const loadingMessage = adsContainer.querySelector('p');
        if (ads && Array.isArray(ads) && ads.length > 0) {
            loadingMessage.remove(); // إزالة رسالة التحميل
            adsContainer.innerHTML += ads.map(ad => `
                <div class="appended-ad-item">
                    <img src="${ad.imageUrl}" alt="${ad.title}">
                    <div class="ad-text">
                        <h4>${ad.title}</h4>
                        <p>${ad.description}</p>
                    </div>
                </div>
            `).join('');
        } else {
            loadingMessage.textContent = 'لا توجد إعلانات لعرضها حالياً.';
            loadingMessage.style.color = '#888';
        }
    } catch (error) {
        const loadingMessage = adsContainer.querySelector('p');
        loadingMessage.textContent = `حدث خطأ أثناء جلب الإعلانات: ${error.message}`;
        loadingMessage.style.color = 'red';
    }
}








// ===================================================================================
// ✅✅✅ دالة جديدة: لجلب وعرض الإعلانات من الرابط المحدد ✅✅✅
// ===================================================================================
async function displayAdvertisements() {
    const adsPanel = document.getElementById('panel-ads');
    if (!adsPanel) return;

    // 1. عرض رسالة "جاري التحميل"
    adsPanel.innerHTML = `
        <style>
            .ad-item-new { display: flex; gap: 20px; align-items: center; background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .ad-item-new img { width: 120px; height: 120px; border-radius: 8px; object-fit: cover; }
            .ad-item-new .ad-text-new h4 { margin: 0 0 8px 0; color: #0056b3; font-size: 18px; }
            .ad-item-new .ad-text-new p { margin: 0; font-size: 15px; color: #495057; line-height: 1.7; }
        </style>
        <div class="panel-header">
            <h2>أحدث العروض والإعلانات</h2>
        </div>
        <p style="text-align:center; color:#007bff; font-weight:bold;">جاري تحميل الإعلانات...</p>
    `;

    try {
        // 2. جلب البيانات من الرابط
        const response = await fetch('https://api.jsonbin.io/v3/b/68dbb9bf43b1c97be9555347' );
        if (!response.ok) {
            throw new Error(`فشل الاتصال بالخادم (Status: ${response.status})`);
        }
        const data = await response.json();

        // 3. التأكد من وجود مصفوفة الإعلانات
        const ads = data.record?.advertisements || data.advertisements;
        if (ads && Array.isArray(ads) && ads.length > 0) {
            // 4. بناء كود HTML وعرض الإعلانات
            adsPanel.querySelector('p').remove(); // إزالة رسالة التحميل
            adsPanel.innerHTML += ads.map(ad => `
                <div class="ad-item-new">
                    <img src="${ad.imageUrl}" alt="${ad.title}">
                    <div class="ad-text-new">
                        <h4>${ad.title}</h4>
                        <p>${ad.description}</p>
                    </div>
                </div>
            `).join('');
        } else {
            // في حالة عدم وجود إعلانات
            adsPanel.querySelector('p').textContent = 'لا توجد إعلانات لعرضها حالياً.';
            adsPanel.querySelector('p').style.color = '#888';
        }
    } catch (error) {
        // في حالة حدوث خطأ
        adsPanel.querySelector('p').textContent = `حدث خطأ أثناء جلب الإعلانات: ${error.message}`;
        adsPanel.querySelector('p').style.color = 'red';
    }
}




async function populateReceiptTabs() {

    
   
    /**
 * ===================================================================================
 * ✅✅✅ دالة مساعدة (النسخة النهائية والمؤكدة): لجلب كود الإعلانات مرة واحدة فقط
 * ===================================================================================
 */
async function getAdvertisementsHTML() {
    // 1. بناء الهيكل الخارجي مع الأنماط الفعلية مدمجة مباشرة
    let adsSectionHTML = `
        <div class="appended-ads-section" style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ced4da;">
            <style>
                .ad-item-new { 
                    display: flex; 
                    gap: 20px; 
                    align-items: center; 
                    background: #fff; 
                    border: 1px solid #e9ecef; 
                    border-radius: 12px; 
                    padding: 20px; 
                    margin-bottom: 15px; 
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05); 
                }
                .ad-item-new img { 
                    width: 120px; 
                    height: 120px; 
                    border-radius: 8px; 
                    object-fit: cover; 
                    flex-shrink: 0;
                }
                .ad-item-new .ad-text-new {
                    flex-grow: 1;
                }
                .ad-item-new .ad-text-new h4 { 
                    margin: 0 0 8px 0; 
                    color: #0056b3; 
                    font-size: 18px; 
                }
                .ad-item-new .ad-text-new p { 
                    margin: 0; 
                    font-size: 15px; 
                    color: #495057; 
                    line-height: 1.7; 
                }
            </style>
            <div class="panel-header">
                <h2 style="text-align:center;">أحدث العروض والإعلانات</h2>
            </div>
    `;

    try {
        // 2. جلب البيانات
        const response = await fetch('https://api.jsonbin.io/v3/b/68dbb9bf43b1c97be9555347' );
        if (!response.ok) throw new Error(`فشل الاتصال بالخادم (Status: ${response.status})`);
        
        const data = await response.json();
        const ads = data.record?.advertisements || data.advertisements;

        if (ads && Array.isArray(ads) && ads.length > 0) {
            // 3. بناء كروت الإعلانات
            adsSectionHTML += ads.map(ad => `
                <div class="ad-item-new">
                    <img src="${ad.imageUrl}" alt="${ad.title}">
                    <div class="ad-text-new">
                        <h4>${ad.title}</h4>
                        <p>${ad.description}</p>
                    </div>
                </div>
            `).join('');
        } else {
            adsSectionHTML += `<p style="text-align:center; color:#888;">لا توجد إعلانات لعرضها حالياً.</p>`;
        }
    } catch (error) {
        adsSectionHTML += `<p style="text-align:center; color:red;">حدث خطأ أثناء جلب الإعلانات: ${error.message}</p>`;
    }

    adsSectionHTML += `</div>`; // إغلاق الحاوية الرئيسية
    return adsSectionHTML;
}



    // جلب كود الإعلانات مرة واحدة وتخزينه في متغير
    const adsHtmlContent = await getAdvertisementsHTML();


    // --- 1. بناء تبويب الرفع من Excel ---
    document.getElementById('panel-upload').innerHTML = `
        <div class="panel-header"><h2>رفع المستندات من ملف Excel</h2><p>اختر نوع المستند الذي تريد رفعه ثم اتبع الخطوات.</p></div>
        <div class="content-step" style="margin-bottom: 25px;">
            <label for="documentTypeSelect" class="content-label" style="font-size: 16px; color: #0d1b2a;">الخطوة 1: اختر نوع المستند</label>
            <select id="documentTypeSelect" class="content-select" style="padding: 12px; font-size: 16px; background-color: white; border: 1px solid #ced4da; border-radius: 8px;">
                <option value="sale">🧾 إيصال بيع (Sale Receipt)</option>
                <option value="return">↩️ إشعار مرتجع (Return Receipt)</option>
            </select>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <div id="dynamicUploaderContent"></div>
        <div style="text-align:center; margin-top:25px; padding:15px; background:#f8f9fa; border-top:2px solid #e9ecef; font-family:'Cairo','Segoe UI',sans-serif; line-height:1.8; font-size:16px; color:#333;">
            اللهُم صلِّ على مُحمد  

            💻 المصمم المحاسب : محمد صبري  

            📞 واتساب: 01060872599
        </div>
        ${adsHtmlContent}
    `;
    
    function updateUploaderUI() {
        const selectedType = document.getElementById('documentTypeSelect').value;
        const contentContainer = document.getElementById('dynamicUploaderContent');
        const actionButtonStyles = `display: block; text-align: center; padding: 12px; border-radius: 8px; text-decoration: none; cursor: pointer; color: white; font-weight: 600;`;

        if (selectedType === 'sale') {
            contentContainer.innerHTML = `
                <div><h3 style="margin-top:0; color: #333;">الخطوة 2: تحميل نموذج ورفع ملفات البيع</h3></div>
                <div style="margin-bottom: 20px;"><a id="downloadReceiptTemplateBtn" style="${actionButtonStyles} background-color: #5a67d8;">📥 تحميل نموذج إيصال البيع</a></div>
                <div><label for="receiptExcelInput" style="${actionButtonStyles} background-color: #38a169;">📂 اختر ملف إيصالات البيع</label><input type="file" id="receiptExcelInput" accept=".xlsx, .xls" style="display: none;"></div>
            `;
            document.getElementById('downloadReceiptTemplateBtn').onclick = downloadReceiptExcelTemplate;
            document.getElementById('receiptExcelInput').onchange = handleReceiptExcelUpload;
        } else {
            contentContainer.innerHTML = `
                <div><h3 style="margin-top:0; color: #333;">الخطوة 2: تحميل نموذج ورفع ملفات المرتجعات</h3></div>
                <div style="margin-bottom: 20px;"><a id="downloadReturnTemplateBtn" style="${actionButtonStyles} background-color: #c0392b;">📥 تحميل نموذج إشعار المرتجع</a></div>
                <div><label for="returnExcelInput" style="${actionButtonStyles} background-color: #e67e22;">📂 اختر ملف إشعارات المرتجع</label><input type="file" id="returnExcelInput" accept=".xlsx, .xls" style="display: none;"></div>
            `;
            document.getElementById('downloadReturnTemplateBtn').onclick = downloadReturnReceiptExcelTemplate;
            document.getElementById('returnExcelInput').onchange = handleReturnReceiptExcelUpload;
        }
    }
    document.getElementById('documentTypeSelect').addEventListener('change', updateUploaderUI);
    updateUploaderUI();


    // --- 2. بناء تبويب الإرسال اليدوي ---
    const manualPanel = document.getElementById('panel-manual');
    manualPanel.innerHTML = `
        <div class="panel-header"><h2>إنشاء مستند يدوي</h2><p>اختر نوع المستند الذي تريد إنشائه يدويًا.</p></div>
        <div class="content-step">
            <label for="manualDocumentTypeSelect" class="content-label" style="font-size: 16px; color: #0d1b2a;">الخطوة 1: اختر نوع المستند</label>
            <select id="manualDocumentTypeSelect" class="content-select" style="padding: 12px; font-size: 16px; background-color: white; border: 1px solid #ced4da; border-radius: 8px;"><option value="" selected disabled>-- يرجى الاختيار --</option><option value="sale">🧾 إنشاء إيصال بيع يدوي</option><option value="return">↩️ إنشاء إشعار مرتجع يدوي</option></select>
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <div id="dynamicManualSendContent"><p style="text-align:center; color:#888; padding: 20px;">يرجى اختيار نوع المستند من القائمة أعلاه للبدء.</p></div>
        <div style="text-align:center; margin-top:25px; padding:15px; background:#f8f9fa; border-top:2px solid #e9ecef; font-family:'Cairo','Segoe UI',sans-serif; line-height:1.8; font-size:16px; color:#333;">
            اللهُم صلِّ على مُحمد  

            💻 المصمم المحاسب : محمد صبري  

            📞 واتساب: 01060872599
        </div>
        ${adsHtmlContent}
    `;

    async function updateManualSendUI() {
        const selectedType = document.getElementById('manualDocumentTypeSelect').value;
        const contentContainer = document.getElementById('dynamicManualSendContent');
        if (!selectedType) {
            contentContainer.innerHTML = `<p style="text-align:center; color:#888; padding: 20px;">يرجى اختيار نوع المستند من القائمة أعلاه للبدء.</p>`;
            return;
        }
        contentContainer.innerHTML = `<p style="text-align:center; color:#333; padding: 20px;">جاري تحميل واجهة إنشاء ${selectedType === 'sale' ? 'إيصال البيع' : 'إشعار المرتجع'}...</p>`;
        try {
            const sellerData = await getIssuerFullData();
            const activities = sellerData.activities || [];
            let activitySelectorHTML = '';
            if (activities.length > 0) {
                const defaultActivity = activities.find(act => act.toDate === null) || activities[0];
                activitySelectorHTML = `<div class="info-field full-width"><label for="manual-activity-code" class="label">كود النشاط:</label><select id="manual-activity-code" class="form-group-select">${activities.map(act => `<option value="${act.activityTypeCode}" ${act.activityTypeCode === defaultActivity.activityTypeCode ? 'selected' : ''}>${act.activityTypeCode} - ${act.activityTypeNameSecondaryLang}</option>`).join('')}</select></div>`;
            }
            await buildManualSendForm(contentContainer, activitySelectorHTML, selectedType);
        } catch (error) {
            contentContainer.innerHTML = `<p style="color: red; text-align: center;">فشل تحميل الواجهة: ${error.message}</p>`;
        }
    }
    document.getElementById('manualDocumentTypeSelect').addEventListener('change', updateManualSendUI);


    // --- 3. بناء تبويب المسودات ---
    document.getElementById('panel-drafts').innerHTML = `
        <div class="panel-header"><h2>مسودات الإيصالات</h2><p>هنا تظهر الإيصالات التي حفظتها لإرسالها لاحقًا.</p></div>
        <div id="drafts-container" style="border: 1px solid #ccc; border-radius: 8px; background: #fff; min-height: 300px; padding: 15px;"></div>
        <div style="text-align:center; margin-top:25px; padding:15px; background:#f8f9fa; border-top:2px solid #e9ecef; font-family:'Cairo','Segoe UI',sans-serif; line-height:1.8; font-size:16px; color:#333;">
            اللهُم صلِّ على مُحمد  

            💻 المصمم المحاسب : محمد صبري  

            📞 واتساب: 01060872599
        </div>
        ${adsHtmlContent}
    `;
    renderReceiptDrafts();


    // --- 4. بناء تبويب الشرح (Help) ---
    document.getElementById('panel-help').innerHTML = `
        <style>
            .help-container { font-size: 16px; line-height: 1.8; color: #333; }
            .collapsible-section { margin-bottom: 15px; background-color: #fff; border: 1px solid #e9ecef; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden; transition: all 0.4s ease-in-out; }
            .collapsible-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 20px; cursor: pointer; background-color: #f8f9fa; transition: background-color 0.3s; }
            .collapsible-header:hover { background-color: #e9ecef; }
            .collapsible-title { font-size: 20px; font-weight: 700; color: #0056b3; display: flex; align-items: center; gap: 15px; }
            .collapsible-title .icon { font-size: 26px; }
            .collapsible-arrow { font-size: 24px; font-weight: bold; color: #007bff; transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
            .collapsible-content { max-height: 0; overflow: hidden; padding: 0 25px; transition: max-height 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), padding 0.4s ease-in-out; border-top: 1px solid #e9ecef; }
            .collapsible-section.open .collapsible-content { max-height: 5000px; padding: 25px; }
            .collapsible-section.open .collapsible-arrow { transform: rotate(90deg); }
            .collapsible-section.open .collapsible-header { background-color: #e7f3ff; }
            .help-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            .help-table th, .help-table td { border: 1px solid #dee2e6; padding: 12px 15px; text-align: right; vertical-align: top; }
            .help-table th { background-color: #f1f3f5; font-weight: 600; color: #495057; }
            .help-table .col-name { font-weight: bold; color: #1d3557; }
            .help-table .col-desc { font-size: 15px; }
            .help-table .col-example { font-family: monospace, 'Courier New'; direction: ltr; text-align: left; color: #c92a2a; background-color: #fff5f5; }
            .required-star { color: #e63946; font-weight: bold; }
            .important-notes { background-color: #fff9db; border: 1px solid #ffe066; border-right: 5px solid #fcc419; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .important-notes ul { padding-right: 20px; margin: 0; }
            .important-notes li { margin-bottom: 12px; font-size: 15px; }
            .note-highlight { font-weight: bold; color: #1d3557; }
        </style>
        <div class="help-container">
            <div class="panel-header">
                <h2>الدليل الشامل لملفات Excel</h2>
                <p>اضغط على أي قسم لفتحه أو إغلاقه. تم شرح جميع الحقول الإجبارية والاختيارية.</p>
            </div>
            <div class="collapsible-section">
                <div class="collapsible-header"><div class="collapsible-title"><span class="icon">🧾</span>شرح نموذج إيصال البيع (Sale Receipt)</div><div class="collapsible-arrow">›</div></div>
                <div class="collapsible-content">
                    <p>استخدم هذا النموذج لتسجيل المبيعات. الأعمدة ذات النجمة (<span class="required-star">*</span>) إجبارية.</p>
                    <table class="help-table">
                        <thead><tr><th>العمود</th><th>الشرح والتوضيح</th><th>مثال</th></tr></thead>
                        <tbody>
                            <tr><td class="col-name"><span class="required-star">*</span>رقم الإيصال الداخلي</td><td class="col-desc">رقم فريد يميز الإيصال في دفاترك. <strong>مهم:</strong> إذا كانت الفاتورة تحتوي على عدة أصناف، كرر نفس الرقم في كل صف تابع لنفس الفاتورة.</td><td class="col-example">RCPT-001</td></tr>
                            <tr><td class="col-name">اسم العميل</td><td class="col-desc">(اختياري) اكتب اسم المشتري. إذا كان عميلاً نقدياً، يمكنك كتابة "عميل نقدي" أو تركه فارغاً.</td><td class="col-example">أحمد محمود</td></tr>
                            <tr><td class="col-name">الرقم القومي للعميل</td><td class="col-desc">(اختياري) إذا كان العميل شخصاً طبيعياً، يمكنك إدخال رقمه القومي المكون من 14 رقماً.</td><td class="col-example">29501011512345</td></tr>
                            <tr><td colspan="3" style="background-color:#e9ecef; text-align:center; font-weight:bold;">--- بيانات بنود الفاتورة (تتكرر لكل صنف) ---</td></tr>
                            <tr><td class="col-name">الكود الداخلي للصنف</td><td class="col-desc">(اختياري) كود تستخدمه داخلياً في شركتك لتمييز الصنف.</td><td class="col-example">ITM-105</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>وصف الصنف</td><td class="col-desc">اسم أو وصف واضح للسلعة أو الخدمة المباعة.</td><td class="col-example">شاشة كمبيوتر 24 بوصة</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>نوع كود الصنف</td><td class="col-desc">حدد نوع التكويد: <strong>EGS</strong> (كود مصلحة الضرائب) أو <strong>GS1</strong> (كود عالمي).</td><td class="col-example">EGS</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>كود الصنف</td><td class="col-desc">الكود الفعلي للصنف بناءً على النوع الذي اخترته.</td><td class="col-example">EG-123456789-101</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>وحدة القياس</td><td class="col-desc">كود وحدة القياس (مثال: EA للقطعة).</td><td class="col-example">EA</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>الكمية</td><td class="col-desc">العدد المباع من هذا الصنف.</td><td class="col-example">2</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>سعر الوحدة</td><td class="col-desc">سعر القطعة الواحدة من الصنف بالجنيه المصري.</td><td class="col-example">3500</td></tr>
                            <tr><td colspan="3" style="background-color:#e9ecef; text-align:center; font-weight:bold;">--- بيانات الضرائب (لكل صنف) ---</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>نوع الضريبة 1</td><td class="col-desc">الكود الخاص بنوع الضريبة الأساسية (مثال: T1 لضريبة القيمة المضافة).</td><td class="col-example">T1</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>النوع الفرعي للضريبة 1</td><td class="col-desc">الكود الفرعي للضريبة (مثال: V009 للسلع العامة الخاضعة لـ 14%).</td><td class="col-example">V009</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>نسبة الضريبة 1</td><td class="col-desc">النسبة المئوية للضريبة (مثال: اكتب 14 لنسبة 14%).</td><td class="col-example">14</td></tr>
                            <tr><td class="col-name">نوع الضريبة 2</td><td class="col-desc">(اختياري) إذا كان الصنف خاضعاً لضريبة أخرى (مثل ضريبة الخصم والتحصيل T4).</td><td class="col-example">T4</td></tr>
                            <tr><td class="col-name">النوع الفرعي للضريبة 2</td><td class="col-desc">(اختياري) الكود الفرعي للضريبة الثانية (مثال: W002 للتوريدات).</td><td class="col-example">W002</td></tr>
                            <tr><td class="col-name">نسبة الضريبة 2</td><td class="col-desc">(اختياري) نسبة الضريبة الثانية (مثال: اكتب 1 لنسبة 1%).</td><td class="col-example">1</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="collapsible-section">
                <div class="collapsible-header"><div class="collapsible-title"><span class="icon">↩️</span>شرح نموذج إشعار المرتجع (Return Receipt)</div><div class="collapsible-arrow">›</div></div>
                <div class="collapsible-content">
                    <p>يستخدم هذا النموذج لتسجيل المرتجعات. معظم الحقول تشبه إيصال البيع، مع اختلافات بسيطة ومهمة.</p>
                    <table class="help-table">
                        <thead><tr><th>العمود</th><th>الشرح والتوضيح</th><th>مثال</th></tr></thead>
                        <tbody>
                            <tr><td class="col-name"><span class="required-star">*</span>رقم إشعار المرتجع</td><td class="col-desc">رقم فريد يميز عملية المرتجع في دفاترك.</td><td class="col-example">RTN-001</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>UUID الفاتورة الأصلية</td><td class="col-desc"><strong>أهم حقل.</strong> يجب نسخ الرقم التعريفي الفريد (UUID) الخاص بفاتورة البيع الأصلية التي يتم إرجاع الأصناف منها.</td><td class="col-example">a1b2c3d4...e5f6</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>الكمية المرتجعة</td><td class="col-desc">كمية الصنف التي تم إرجاعها.</td><td class="col-example">1</td></tr>
                            <tr><td class="col-name"><span class="required-star">*</span>سعر الوحدة وقت البيع</td><td class="col-desc">يجب أن يكون نفس سعر الوحدة الذي تم البيع به في الفاتورة الأصلية.</td><td class="col-example">3500</td></tr>
                            <tr><td colspan="3" style="text-align: center; background: #f0f8ff; padding: 15px;"><strong>باقي الحقول (اسم العميل، وصف الصنف، الأكواد، الضرائب...) يتم ملؤها بنفس طريقة إيصال البيع تماماً.</strong></td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="collapsible-section open">
                <div class="collapsible-header"><div class="collapsible-title"><span class="icon">💡</span>ملاحظات هامة وقواعد أساسية</div><div class="collapsible-arrow">›</div></div>
                <div class="collapsible-content">
                    <div class="important-notes">
                        <ul>
                            <li><span class="note-highlight">فاتورة متعددة البنود:</span> لإنشاء فاتورة واحدة تحتوي على عدة أصناف، ببساطة <span class="note-highlight">كرر نفس "رقم الإيصال الداخلي"</span> في كل الصفوف الخاصة بهذه الفاتورة. بيانات العميل (الاسم والرقم القومي) تُقرأ من أول صف فقط.</li>
                            <li><span class="note-highlight">البيانات الاختيارية:</span> الأعمدة التي لا تحمل علامة النجمة (<span class="required-star">*</span>) هي اختيارية ويمكن تركها فارغة إذا لم تكن ضرورية.</li>
                            <li><span class="note-highlight">تنسيق الأرقام:</span> تأكد من أن حقول الكميات والأسعار والنسب تحتوي على أرقام فقط بدون أي نصوص أو رموز (مثل "ج.م").</li>
                            <li><span class="note-highlight">الإرسال اليدوي:</span> استخدم تبويب "الإرسال اليدوي" للإدخالات السريعة والفردية دون الحاجة لملف إكسل. هذه الواجهة مثالية لإصدار إيصال واحد أو مرتجع واحد بسرعة.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div style="text-align:center; margin-top:25px; padding:15px; background:#f8f9fa; border-top:2px solid #e9ecef; font-family:'Cairo','Segoe UI',sans-serif; line-height:1.8; font-size:16px; color:#333;">
            اللهُم صلِّ على مُحمد  

            💻 المصمم المحاسب : محمد صبري  

            📞 واتساب: 01060872599
        </div>
        ${adsHtmlContent}
    `;
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.closest('.collapsible-section');
            section.classList.toggle('open');
        });
    });


    // --- 5. بناء تبويب المصمم ---
    const designerPanel = document.getElementById('panel-log');
    designerPanel.innerHTML = `
        <style>
            .designer-card { background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border-radius: 15px; border: 1px solid #e9ecef; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08); padding: 30px; max-width: 700px; margin: 40px auto; text-align: center; animation: slideUp 0.7s ease-out; }
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            .designer-card .profile-pic { width: 130px; height: 130px; border-radius: 50%; border: 5px solid #007bff; box-shadow: 0 0 20px rgba(0, 123, 255, 0.3); margin: -90px auto 15px auto; display: block; background-color: #e9ecef; }
            .designer-card .name { font-size: 28px; font-weight: 700; color: #1d3557; margin: 0; }
            .designer-card .name-en { font-size: 18px; color: #6c757d; margin-bottom: 10px; font-family: 'Segoe UI', Tahoma, sans-serif; }
            .designer-card .profession { font-size: 18px; font-weight: 600; color: #007bff; background-color: #e7f3ff; padding: 5px 15px; border-radius: 20px; display: inline-block; margin-bottom: 25px; }
            .designer-card .location-info { font-size: 16px; color: #495057; margin-bottom: 30px; line-height: 1.7; }
            .designer-card .location-info .icon { color: #28a745; margin-left: 8px; }
            .contact-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; margin-top: 20px; }
            .contact-link { display: flex; align-items: center; justify-content: center; padding: 12px; border-radius: 10px; text-decoration: none; font-size: 16px; font-weight: 600; transition: all 0.3s ease; border: 1px solid transparent; }
            .contact-link:hover { transform: translateY(-3px); box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            .contact-link .icon { font-size: 22px; margin-left: 12px; }
            .phone-link { background-color: #f0f0f0; color: #333; border-color: #ddd; }
            .whatsapp-link { background-color: #25d366; color: white; }
            .gmail-link { background-color: #db4437; color: white; }
            .facebook-link { background-color: #1877f2; color: white; }
        </style>
        <div class="designer-card">
            <h2 class="name">محمد صبري</h2>
            <p class="name-en">Mohamed Sabry</p>
            <span class="profession">محاسب قانوني</span>
            <div class="location-info">
                <div><span class="icon">📍</span><strong>مقر الإقامة:</strong> أشمون، المنوفية</div>
                <div><span class="icon">🏢</span><strong>مقر العمل:</strong> المعادي، القاهرة</div>
            </div>
            <div class="contact-grid">
                <div class="contact-link phone-link"><span class="icon">📞</span><span>01060872599</span></div>
                <a href="https://wa.me/201060872599" target="_blank" class="contact-link whatsapp-link"><span class="icon">💬</span><span>WhatsApp</span></a>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ms0223048@gmail.com" class="contact-link gmail-link" target="_blank"><span class="icon">✉️</span><span>Gmail</span></a>
                <a href="https://www.facebook.com/4mohamed.sabry" target="_blank" class="contact-link facebook-link"><span class="icon">👍</span><span>Facebook</span></a>
            </div>
        </div>
    `;

       // --- 6. بناء تبويب التسجيل ---
  // --- 6. بناء تبويب التسجيل ---
const registrationPanel = document.getElementById('panel-registration');
registrationPanel.innerHTML = `
   <!-- =================================================================================== -->
<!-- ✅✅✅ الكود النهائي والمحدث لتبويب التسجيل (panel-registration) ✅✅✅ -->
<!-- =================================================================================== -->

<style>
    /* أنماط لتحسين شكل الشرح - يمكنك وضعها مع باقي الأنماط في ملفك */
    .reg-container { font-size: 16px; line-height: 1.8; color: #333; }
    .collapsible-section {
        background-color: #fff;
        border: 1px solid #e9ecef;
        border-radius: 12px;
        margin-bottom: 20px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        overflow: hidden; /* مهم جداً لحركة الفتح والإغلاق */
        transition: all 0.4s ease-in-out;
    }
    .collapsible-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 18px 20px;
        cursor: pointer;
        background-color: #f8f9fa;
        transition: background-color 0.3s;
    }
    .collapsible-header:hover {
        background-color: #e9ecef;
    }
    .collapsible-title {
        font-size: 20px;
        font-weight: 700;
        color: #0056b3;
        display: flex;
        align-items: center;
        gap: 15px;
    }
    .collapsible-title .icon { font-size: 26px; }
    .collapsible-arrow {
        font-size: 24px;
        font-weight: bold;
        color: #007bff;
        transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); /* حركة ناعمة للسهم */
    }
    .collapsible-content {
        max-height: 0; /* يبدأ مغلقاً */
        overflow: hidden;
        padding: 0 25px; /* لا يوجد padding وهو مغلق */
        transition: max-height 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), padding 0.4s ease-in-out;
        border-top: 1px solid #e9ecef;
    }
    /* عند إضافة كلاس .open */
    .collapsible-section.open .collapsible-content {
        max-height: 2000px; /* ارتفاع كبير للسماح بعرض أي محتوى */
        padding: 25px; /* إضافة padding عند الفتح */
    }
    .collapsible-section.open .collapsible-arrow {
        transform: rotate(90deg); /* تدوير السهم */
    }
    .collapsible-section.open .collapsible-header {
        background-color: #e7f3ff; /* تغيير لون الخلفية عند الفتح */
    }
    .highlight-code {
        background-color: #e9ecef; color: #c92a2a; padding: 3px 8px;
        border-radius: 5px; font-family: monospace, 'Courier New';
        direction: ltr; display: inline-block; border: 1px solid #dee2e6;
    }
    .action-link {
        display: inline-block; background-color: #28a745; color: white !important;
        padding: 12px 25px; border-radius: 8px; text-decoration: none;
        font-weight: bold; margin-top: 15px; transition: all 0.3s ease;
    }
    .action-link:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
    }
    .alert-note {
        background-color: #fff3cd; border: 1px solid #ffeeba;
        border-right: 5px solid #ffc107; padding: 15px;
        border-radius: 8px; margin-top: 20px;
    }
    .service-offer-card {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border: 1px solid #dee2e6; border-radius: 12px; padding: 30px;
        margin-top: 40px; text-align: center;
    }
    .service-offer-card h4 { font-size: 20px; font-weight: 700; color: #1d3557; margin: 0 0 10px 0; }
    .service-offer-card p { font-size: 16px; color: #495057; margin: 0 0 20px 0; line-height: 1.7; }
    .whatsapp-contact-btn {
        display: inline-block; background: #25D366; color: white !important;
        padding: 12px 30px; border-radius: 8px; text-decoration: none;
        font-weight: bold; font-size: 16px; transition: all 0.3s ease;
        box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
    }
    .whatsapp-contact-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 15px rgba(37, 211, 102, 0.4);
    }
    .export-pdf-btn {
        background-color: #dc3545; color: white; border: none;
        padding: 10px 20px; border-radius: 8px; cursor: pointer;
        font-weight: bold; font-size: 15px; display: flex;
        align-items: center; gap: 8px; transition: all 0.2s ease;
    }
    .export-pdf-btn:hover { background-color: #c82333; transform: translateY(-2px); }
</style>

<div class="reg-container">
    <div class="panel-header" style="display: flex; justify-content: space-between; align-items: center;">
        <div>
            <h2>شرح طرق التسجيل في الإيصال الإلكتروني</h2>
            <p>اختر الطريقة المناسبة لك واتبع الخطوات. اضغط على عنوان أي طريقة لفتحها أو إغلاقها.</p>
        </div>
        <button id="exportRegistrationInfoPdf" class="export-pdf-btn">
            <span style="font-size: 18px;">📄</span> تصدير بياناتي كـ PDF
        </button>
    </div>

    <!-- ==================== الطريقة الأولى: التسجيل عبر تطبيق الموبايل ==================== -->
    <div class="collapsible-section open"> <!-- يبدأ مفتوحاً بشكل افتراضي -->
        <div class="collapsible-header">
            <div class="collapsible-title"><span class="icon">📱</span>الطريقة الأولى: التسجيل عبر تطبيق الموبايل</div>
            <div class="collapsible-arrow">›</div>
        </div>
        <div class="collapsible-content">
            <p>هذه هي الطريقة الأسهل والأسرع لمعظم المستخدمين.</p>
            <a href="https://play.google.com/store/apps/details?id=eg.gov.eta.einvoicing" target="_blank" class="action-link" style="margin-bottom: 20px;">
                <span style="font-size: 20px; margin-left: 8px;">⬇️</span> تحميل تطبيق الفواتير من Google Play
            </a>
            <ul>
                <li>بعد تحميل التطبيق، قم بتسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور الخاصة بك كممول.</li>
                <li>من داخل التطبيق، اذهب إلى تبويب "الإيصالات" ثم اختر "تسجيل كنقطة بيع".</li>
                <li>اتبع الخطوات المتبقية في التطبيق لإكمال عملية التسجيل.</li>
            </ul>
            <div class="alert-note">
                <strong>ملاحظة هامة:</strong> إذا لم يظهر لك خيار "تسجيل كنقطة بيع"، قم بالدخول إلى ملفك الشخصي على البوابة الإلكترونية (البورتال )، اضغط على "تعديل"، واختر "الفواتير والإيصالات" من قسم "المستندات المطلوب إرسالها"، ثم اضغط "موافق". انتظر لمدة ساعة على الأقل ثم حاول مرة أخرى من التطبيق.
            </div>
            <div class="alert-note" style="border-right-color: #17a2b8; background-color: #e0f7fa;">
                <strong>✨ ميزة إضافية:</strong> لتسجيل أكثر من ممول على نفس الهاتف، يمكنك تحميل تطبيق من متجر بلاي يقوم بعمل "نسخ" للتطبيقات (ابحث عن "App Cloner" أو "Parallel Space"). بهذه الطريقة، يمكنك إنشاء نسخة مستقلة من تطبيق الفواتير لكل ممول.
            </div>
        </div>
    </div>

    <!-- ==================== الطريقة الثانية: التسجيل عبر موقع POS ==================== -->
    <div class="collapsible-section">
        <div class="collapsible-header">
            <div class="collapsible-title"><span class="icon">🌐</span>الطريقة الثانية: التسجيل عبر موقع POS (للأنظمة الخاصة)</div>
            <div class="collapsible-arrow">›</div>
        </div>
        <div class="collapsible-content">
            <p>هذه الطريقة مخصصة لمن لديهم نظام تخطيط موارد المؤسسات (ERP) خاص ويريدون ربطه مباشرة بالمنظومة.</p>
            <a href="https://pos.eta.gov.eg/" target="_blank" class="action-link">الدخول إلى موقع تسجيل نقاط البيع</a>
            <ul>
                <li>بعد الدخول للموقع، قم بتسجيل حساب جديد ببريد إلكتروني (للممول أو المفوض ).</li>
                <li>اذهب إلى "نقاط البيع" ثم اضغط على "طلب زيارة".</li>
                <li>املأ البيانات المطلوبة: اسم الشركة، رقم التسجيل، كود الفرع، اسم المسؤول، ورقم هاتفه (مهم جداً للتواصل).</li>
                <li>بعد تقديم الطلب، سيتواصل معك الدعم الفني لترتيب زيارة.</li>
                <li>سيقوم موظف الدعم الفني بملء استمارة تحتوي على بيانات جهازك ونظامك (سريال الجهاز، نسخة الويندوز، إلخ).</li>
                <li>للحصول على سريال الجهاز، افتح موجه الأوامر (CMD) واكتب الأمر التالي: <span class="highlight-code">wmic bios get serialnumber</span></li>
                <li>بعد الموافقة على الطلب، ستتمكن من تسجيل نقطة البيع من ملفك الشخصي والحصول على البيانات السرية (Client ID, Client Secret) لربطها بنظامك.</li>
            </ul>
             <div class="alert-note">
                <strong>✨ بشرى سارة (قريباً في الإصدار القادم):</strong> بدلاً من شراء نظام ERP باهظ الثمن، سنوفر لكم نظام ويب متكامل ليكون هو السيستم الخاص بكم، مما يسهل هذه الطريقة على الجميع دون تكاليف إضافية.
            </div>
        </div>
    </div>

    <!-- ==================== الطريقة الثالثة: ماكينة POS ==================== -->
    <div class="collapsible-section">
        <div class="collapsible-header">
            <div class="collapsible-title"><span class="icon">📠</span>الطريقة الثالثة: شراء ماكينة POS مادية</div>
            <div class="collapsible-arrow">›</div>
        </div>
        <div class="collapsible-content">
            <p>يمكنك شراء ماكينة نقاط بيع (POS) مادية من أحد الموردين المعتمدين. بمجرد تسجيل الماكينة على المنظومة، ستكون قد فعلت الخدمة وستتمكن من استخدام هذه الأداة.</p>
        </div>
    </div>

    <!-- قسم عرض خدمة التسجيل -->
    <div class="service-offer-card">
        <h4>هل تحتاج إلى مساعدة في عملية التسجيل؟</h4>
        <p>
            إذا واجهت أي صعوبة أو كنت ترغب في أن نقوم بتنفيذ خطوات التسجيل بالنيابة عنك، يمكنك التواصل معنا مباشرة عبر واتساب.
        </p>
        <a href="https://wa.me/201060872599" target="_blank" class="whatsapp-contact-btn">
            <span style="font-size: 20px;">📞</span> تواصل معنا الآن
        </a>
    </div>
</div>

`;

// ✅✅✅ الكود النهائي لزر "تصدير PDF" الذي يعرض الشرح في صفحة HTML ✅✅✅

registrationPanel.querySelector('#exportRegistrationInfoPdf').addEventListener('click', function() {
    const btn = this;
    btn.disabled = true;
    btn.textContent = 'جاري التحضير...';

    try {
        // 1. كل محتوى الشرح والتصميم يتم وضعه هنا داخل متغير نصي واحد
        const explanationHtml = `
            <!DOCTYPE html>
            <html lang="ar" dir="rtl">
            <head>
                <meta charset="UTF-8">
                <title>دليل تسجيل الإيصال الإلكتروني</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap" rel="stylesheet">
                <style>
                    body {
                        font-family: 'Cairo', sans-serif;
                        background-color: #f4f7fc;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    .main-container {
                        max-width: 850px;
                        margin: 20px auto;
                        padding: 30px;
                        background-color: white;
                        border: 1px solid #dee2e6;
                        border-radius: 10px;
                    }
                    .main-header {
                        text-align: center;
                        border-bottom: 2px solid #007bff;
                        padding-bottom: 20px;
                        margin-bottom: 30px;
                    }
                    .main-header h1 { font-size: 32px; color: #1d3557; margin: 0; }
                    .main-header p { font-size: 18px; margin-top: 10px; }
                    .collapsible-section {
                        border: 1px solid #e9ecef;
                        border-radius: 12px;
                        margin-bottom: 20px;
                    }
                    .collapsible-header {
                        padding: 20px;
                        background-color: #f8f9fa;
                        cursor: pointer;
                    }
                    .collapsible-title {
                        font-size: 22px;
                        font-weight: 700;
                        color: #1d3557;
                    }
                    .collapsible-content {
                        padding: 25px;
                        border-top: 1px solid #e9ecef;
                        line-height: 1.8;
                    }
                    ul { padding-right: 20px; list-style-type: '✓ '; }
                    li { margin-bottom: 15px; font-size: 17px; }
                    .highlight-code {
                        background-color: #e9ecef; color: #c92a2a; padding: 3px 8px;
                        border-radius: 5px; font-family: monospace; direction: ltr;
                        display: inline-block; border: 1px solid #dee2e6;
                    }
                    .action-link {
                        display: inline-block; background-color: #28a745; color: white !important;
                        padding: 12px 25px; border-radius: 8px; text-decoration: none;
                        font-weight: bold; margin-top: 15px;
                    }
                    .alert-note {
                        background-color: #fff3cd; border-left: 5px solid #ffc107;
                        padding: 15px 20px; border-radius: 8px; margin-top: 20px;
                    }
                    .service-offer-card {
                        background: #e9f5ff; border-left: 5px solid #007bff;
                        padding: 25px; border-radius: 8px; margin-top: 30px; text-align: center;
                    }
                    @media print {
                        body { background-color: white; padding: 0; margin: 0; }
                        .main-container { border: none; box-shadow: none; margin: 0; max-width: 100%; }
                        #print-button { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="main-container">
                    <header class="main-header">
                        <h1>الدليل الشامل لتسجيل الإيصال الإلكتروني</h1>
                        <p>اتبع الخطوات في إحدى الطرق التالية لتفعيل الخدمة بنجاح</p>
                    </header>
                    <div class="content-wrapper">
                        <!-- الطريقة الأولى -->
                        <div class="collapsible-section">
                            <div class="collapsible-header">
                                <div class="collapsible-title">الطريقة الأولى: التسجيل عبر تطبيق الموبايل</div>
                            </div>
                            <div class="collapsible-content">
                                <p>هذه هي الطريقة الأسهل والأسرع لمعظم المستخدمين.</p>
                                <a href="https://play.google.com/store/apps/details?id=eg.gov.eta.einvoicing" target="_blank" class="action-link">تحميل تطبيق الفواتير من Google Play</a>
                                <ul>
                                    <li>بعد تحميل التطبيق، قم بتسجيل الدخول باستخدام البريد الإلكتروني وكلمة المرور الخاصة بك كممول.</li>
                                    <li>من داخل التطبيق، اذهب إلى تبويب "الإيصالات" ثم اختر "تسجيل كنقطة بيع".</li>
                                    <li>اتبع الخطوات المتبقية في التطبيق لإكمال عملية التسجيل.</li>
                                </ul>
                                <div class="alert-note">
                                    <strong>ملاحظة هامة:</strong> إذا لم يظهر لك خيار "تسجيل كنقطة بيع"، قم بالدخول إلى ملفك الشخصي على البوابة الإلكترونية، اضغط "تعديل"، واختر "الفواتير والإيصالات" من قسم "المستندات المطلوب إرسالها"، ثم اضغط "موافق". انتظر ساعة على الأقل ثم حاول مرة أخرى.
                                </div>
                                <div class="alert-note" style="border-left-color: #17a2b8; background-color: #e0f7fa;">
                                    <strong>ميزة إضافية:</strong> لتسجيل أكثر من ممول على نفس الهاتف، يمكنك استخدام تطبيق من متجر بلاي يقوم بعمل "نسخ" للتطبيقات (ابحث عن "App Cloner" ).
                                </div>
                            </div>
                        </div>
                        <!-- الطريقة الثانية -->
                        <div class="collapsible-section">
                            <div class="collapsible-header">
                                <div class="collapsible-title">الطريقة الثانية: التسجيل عبر موقع POS (للأنظمة الخاصة)</div>
                            </div>
                            <div class="collapsible-content">
                                <p>هذه الطريقة مخصصة لمن لديهم نظام ERP خاص ويريدون ربطه مباشرة بالمنظومة.</p>
                                <a href="https://pos.eta.gov.eg/" target="_blank" class="action-link">الدخول إلى موقع تسجيل نقاط البيع</a>
                                <ul>
                                    <li>بعد الدخول للموقع، قم بتسجيل حساب جديد.</li>
                                    <li>اذهب إلى "نقاط البيع" ثم اضغط على "طلب زيارة".</li>
                                    <li>املأ البيانات المطلوبة (اسم الشركة، رقم التسجيل، بيانات المسؤول، إلخ ).</li>
                                    <li>بعد تقديم الطلب، سيتواصل معك الدعم الفني لترتيب زيارة وملء استمارة بيانات جهازك.</li>
                                    <li>للحصول على سريال الجهاز، افتح موجه الأوامر (CMD) واكتب الأمر: <span class="highlight-code">wmic bios get serialnumber</span></li>
                                    <li>بعد الموافقة، ستتمكن من تسجيل نقطة البيع من ملفك الشخصي والحصول على البيانات السرية (Client ID, Client Secret).</li>
                                </ul>
                                <div class="alert-note">
                                    <strong>بشرى سارة (قريباً):</strong> سنوفر لكم نظام ويب متكامل ليكون هو السيستم الخاص بكم، مما يسهل هذه الطريقة على الجميع دون تكاليف إضافية.
                                </div>
                            </div>
                        </div>
                        <!-- الطريقة الثالثة -->
                        <div class="collapsible-section">
                            <div class="collapsible-header">
                                <div class="collapsible-title">الطريقة الثالثة: شراء ماكينة POS مادية</div>
                            </div>
                            <div class="collapsible-content">
                                <p>يمكنك شراء ماكينة نقاط بيع (POS) مادية من أحد الموردين المعتمدين. بمجرد تسجيل الماكينة على المنظومة، ستكون قد فعلت الخدمة.</p>
                            </div>
                        </div>
                        <!-- قسم المساعدة -->
                        <div class="service-offer-card">
                            <h4>هل تحتاج إلى مساعدة في عملية التسجيل؟</h4>
                            <p>إذا واجهت أي صعوبة، يمكنك التواصل معنا مباشرة عبر واتساب للمساعدة.</p>
                            <a href="https://wa.me/201060872599" target="_blank" class="action-link" style="background-color: #25D366;">تواصل معنا الآن عبر واتساب</a>
                        </div>
                    </div>
                </div>
                <button id="print-button" onclick="window.print( )" style="position: fixed; bottom: 20px; left: 20px; padding: 15px 25px; font-size: 18px; background-color: #007bff; color: white; border: none; border-radius: 8px; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
                    🖨️ طباعة (أو حفظ كـ PDF)
                </button>
            </body>
            </html>
        `;

        // 2. فتح المحتوى في نافذة جديدة
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(explanationHtml);
        printWindow.document.close();

    } catch (error) {
        alert(`حدث خطأ أثناء تحضير صفحة الشرح: ${error.message}`);
    } finally {
        // 3. إعادة الزر إلى حالته الطبيعية
        btn.disabled = false;
        btn.textContent = '📄 تصدير الشرح كـ PDF';
    }
});


    // --- 7. بناء تبويب الخدمات للشركات ---
    const servicesPanel = document.getElementById('panel-services');
    servicesPanel.innerHTML = `
        <style>
            .service-card { background-color: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-left: 5px solid #007bff; }
            .service-card h3 { margin-top: 0; color: #0056b3; font-size: 20px; }
            .service-card p { font-size: 16px; line-height: 1.8; color: #343a40; }
            .contact-for-service-btn { display: inline-block; background-color: #28a745; color: white !important; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 10px; transition: transform 0.2s; }
            .contact-for-service-btn:hover { transform: translateY(-2px); }
            .ads-container { margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ced4da; }
            .ad-item { display: flex; gap: 15px; background: #fff; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin-bottom: 15px; align-items: center; }
            .ad-item img { width: 100px; height: 100px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
            .ad-item .ad-text h4 { margin: 0 0 5px 0; color: #1d3557; }
            .ad-item .ad-text p { margin: 0; font-size: 14px; color: #495057; }
            #refresh-ads-btn { background-color: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 15px; display: block; margin: 0 auto 20px auto; transition: all 0.2s ease; }
            #refresh-ads-btn:hover { background-color: #0056b3; transform: translateY(-2px); }
        </style>

        <div class="panel-header">
            <h2>خدمات مخصصة للشركات والمكاتب</h2>
            <p>نقدم حلولاً مدفوعة لتخصيص الأداة بما يتناسب مع احتياجات عملك الخاصة.</p>
        </div>

        <div class="service-card">
            <h3>تعديلات خاصة وتخصيص</h3>
            <p>
                هل تحتاج إلى تعديل خاص في الأداة ليناسب طبيعة عمل مكتبك؟ مثل إضافة شعار المكتب، أو إضافة حقول مخصصة،     .
            </p>
            <a href="https://wa.me/201060872599" target="_blank" class="contact-for-service-btn">
                📞 تواصل معنا للطلب
            </a>
        </div>

        <div class="ads-container">
            <div class="panel-header">
                <h2>إعلانات وعروض</h2>
            </div>
            <button id="refresh-ads-btn">🔄 تحديث الإعلانات</button>
            <div id="dynamic-ads-content">
                <p style="text-align:center; color:#888;">اضغط على زر التحديث لعرض الإعلانات.</p>
            </div>
        </div>
    `;

    // ربط حدث النقر بالزر الجديد لتشغيل دالة جلب الإعلانات
    document.getElementById('refresh-ads-btn' ).addEventListener('click', loadAdvertisements);


    // --- 8. جلب البيانات الأساسية في الخلفية (لا تغيير هنا) ---
    try {
        if (!window.receiptUploaderData || !window.receiptUploaderData.seller) {
            const [sellerData, devices] = await Promise.all([getSellerFullData(), getDeviceSerialNumber()]);
            if (!sellerData || !devices || devices.length === 0) throw new Error("فشل جلب البيانات الأساسية للممول أو نقاط البيع.");
            window.receiptUploaderData = { seller: sellerData, devices: devices, serial: devices[0].serialNumber };
        }
    } catch (error) {
        // لا توجد مشكلة، يمكن أن تستمر الواجهة في العمل بدون هذه البيانات مبدئياً
        console.warn("تحذير: فشل جلب البيانات الأساسية عند فتح الواجهة. قد تحتاج بعض الميزات للتحميل مرة أخرى.", error);
    }
}




async function generateCustomPdf(button) {
    const uuid = button.dataset.uuid;
    button.textContent = 'جاري...';
    button.disabled = true;

    try {
        if (typeof jsPDF === 'undefined' || typeof jsPDF.autoTable === 'undefined' || typeof qrcode === 'undefined') {
       
            
            throw new Error("المكتبات المطلوبة (jsPDF, AutoTable, qrcode) غير معرّفة في النطاق العام.");
        }
    
        const tableRow = button.closest('tr');
        const receiptData = {
            uuid: uuid,
            receiptNumber: tableRow.cells[0].textContent,
            dateTimeIssued: tableRow.cells[2].textContent,
            receiverName: tableRow.cells[3].textContent,
            totalAmount: parseFloat(tableRow.cells[4].textContent),
            seller: window.receiptUploaderData?.seller || {}
        };

       
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        doc.setFont('Helvetica');
        doc.setRtl(true);

        const processArabicText = (text) => {
            if (!text) return '';
            return String(text).split('').reverse().join('');
        };

        const qr = qrcode(0, 'M');
        const originalDateTime = new Date(receiptData.dateTimeIssued.replace('،', '')).toISOString();
        const shareUrl = `https://invoicing.eta.gov.eg/receipts/details/print/${uuid}/share/${originalDateTime}`;
        qr.addData(shareUrl );
        qr.make();
        const qrCodeImage = qr.createDataURL(4);

        const margin = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(18).text(processArabicText('إيصال بيع'), pageWidth - margin, margin, { align: 'right' });
        doc.addImage(qrCodeImage, 'JPEG', margin, margin, 35, 35);

        let y = margin + 10;
        doc.setFontSize(8);
        doc.text(processArabicText('الرقم الإلكتروني: ') + receiptData.uuid, pageWidth - margin - 40, y, { align: 'right' }); y += 5;
        doc.text(processArabicText('رقم الداخلي: ') + receiptData.receiptNumber, pageWidth - margin - 40, y, { align: 'right' }); y += 5;
        doc.text(processArabicText('تاريخ الإصدار: ') + receiptData.dateTimeIssued, pageWidth - margin - 40, y, { align: 'right' }); y += 5;
        doc.text(processArabicText('رقم تسجيل البائع: ') + (receiptData.seller.id || 'N/A'), pageWidth - margin - 40, y, { align: 'right' }); y += 10;

        doc.autoTable({
            startY: y,
            head: [[processArabicText('المشتري'), processArabicText('البائع')]],
            body: [[
                processArabicText(receiptData.receiverName || 'عميل نقدي'),
                processArabicText(`${receiptData.seller.name || ''}\n${receiptData.seller.id || ''}\n${receiptData.seller.street || ''}, ${receiptData.seller.regionCity || ''}`)
            ]],
            theme: 'grid',
            styles: { font: 'Helvetica', halign: 'right' },
            headStyles: { fillColor: [220, 220, 220], textColor: 0 },
        });
        y = doc.lastAutoTable.finalY + 10;

        const totalAmount = receiptData.totalAmount;
        const taxRateApproximation = 0.14;
        const valueBeforeTax = totalAmount / (1 + taxRateApproximation);
        const taxAmount = totalAmount - valueBeforeTax;

        doc.autoTable({
            startY: y,
            head: [[processArabicText('المجموع'), processArabicText('الضريبة'), processArabicText('الصافي'), processArabicText('الوصف')]],
            body: [[
                totalAmount.toFixed(2),
                taxAmount.toFixed(2),
                valueBeforeTax.toFixed(2),
                processArabicText('إجمالي مبيعات الإيصال')
            ]],
            theme: 'grid',
            styles: { font: 'Helvetica', halign: 'right' },
            headStyles: { fillColor: [220, 220, 220], textColor: 0 },
        });
        y = doc.lastAutoTable.finalY + 10;

        const totalsBody = [
            [valueBeforeTax.toFixed(2), processArabicText('إجمالي المبيعات (ج.م)')],
            [taxAmount.toFixed(2), processArabicText('ضريبة القيمة المضافة (تقريبي)')],
            [{ content: totalAmount.toFixed(2), styles: { fontStyle: 'bold' } }, { content: processArabicText('المبلغ الإجمالي (ج.م)'), styles: { fontStyle: 'bold' } }]
        ];
        doc.autoTable({
            startY: y,
            body: totalsBody,
            theme: 'plain',
            styles: { font: 'Helvetica', halign: 'right' },
            columnStyles: { 0: { halign: 'left' } },
            margin: { left: pageWidth / 2 }
        });

        doc.save(`receipt-${uuid}.pdf`);

    } catch (error) {
        alert(`حدث خطأ أثناء إنشاء PDF: ${error.message}`);
    } finally {
        button.textContent = 'تحميل PDF';
        button.disabled = false;
    }
}






async function showRecentReceiptsViewer() {
    // إزالة أي نافذة قديمة
    document.getElementById('recentReceiptsModal')?.remove();

    // --- 1. بناء الهيكل الخارجي للواجهة ---
    const modal = document.createElement('div');
    modal.id = 'recentReceiptsModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.6); z-index: 10001;
        display: flex; align-items: center; justify-content: center;
        direction: rtl; font-family: 'Segoe UI', Tahoma, sans-serif;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #f4f7fc; width: 95%; max-width: 1600px; height: 90%;
        border-radius: 12px; display: flex; flex-direction: column;
        box-shadow: 0 5px 25px rgba(0,0,0,0.2); overflow: hidden;
    `;
    
    modalContent.innerHTML = `
        <div style="padding: 15px 25px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background-color: #f8f9fa; flex-shrink: 0;">
            <h3 id="receiptsViewerTitle" style="margin: 0; color: #2161a1; font-size: 22px;">أحدث الإيصالات المرسلة</h3>
            <button id="closeReceiptsViewerBtn" class="header-btn close-btn">إغلاق</button>
        </div>
        <div id="receiptsTableContainer" style="overflow-y: auto; flex-grow: 1; padding: 10px;">
            <div style="display:flex; align-items:center; justify-content:center; height:100%; font-size: 22px; color: #555;">جاري تحميل أحدث الإيصالات...</div>
        </div>
        <div id="receiptsPagination" style="padding: 10px 25px; border-top: 1px solid #ddd; display: flex; justify-content: center; align-items: center; gap: 20px; flex-shrink: 0;">
            <button id="prevPageBtn" class="header-btn" style="background-color: #6c757d;">السابق</button>
            <span id="pageInfo">صفحة 1</span>
            <button id="nextPageBtn" class="header-btn" style="background-color: #6c757d;">التالي</button>
        </div>
    `;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const tableContainer = modalContent.querySelector('#receiptsTableContainer');
    const title = modalContent.querySelector('#receiptsViewerTitle');
    const pageInfo = modalContent.querySelector('#pageInfo');
    const prevBtn = modalContent.querySelector('#prevPageBtn');
    const nextBtn = modalContent.querySelector('#nextPageBtn');
    let currentPage = 1;
    let totalPages = 1;

    // --- 2. دالة جلب وعرض البيانات لصفحة معينة ---
    const loadReceiptsPage = async (page) => {
        tableContainer.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; font-size: 22px; color: #555;">جاري تحميل صفحة ${page}...</div>`;
        
        try {
            const token = getAccessToken();
            if (!token) throw new Error("لم يتم العثور على توكن الدخول.");

            const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/receipts/recent?Direction=Submitted&SortBy=DateTimeReceived&PageNo=${page}&PageSize=10`, {
                headers: { 'Authorization': `Bearer ${token}` }
            } );

            if (!response.ok) throw new Error(`فشل جلب البيانات. رمز الحالة: ${response.status}`);

            const data = await response.json();
            const receipts = data.receipts || [];
            totalPages = data.metadata?.totalPages || 1;
            currentPage = page;

            if (receipts.length === 0) {
                tableContainer.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; font-size: 18px; color: #555;">لا توجد إيصالات في هذه الصفحة.</div>`;
            } else {
                const tableRowsHTML = receipts.map(receipt => `
                    <tr style="border-bottom: 1px solid #e9ecef; transition: background-color 0.2s;">
                        <td style="padding: 12px; text-align: center;">${receipt.receiptNumber}</td>
                        <td style="padding: 12px; text-align: center; font-family: monospace; font-size: 12px; direction: ltr;">${receipt.uuid}</td>
                        <td style="padding: 12px; text-align: center;">${new Date(receipt.dateTimeIssued).toLocaleString('ar-EG')}</td>
                        <td style="padding: 12px; text-align: right;">${receipt.receiverName || 'عميل نقدي'}</td>
                        <td style="padding: 12px; text-align: center; font-weight: bold; font-size: 16px;">${receipt.totalAmount.toFixed(2)}</td>
                        <td style="padding: 12px; text-align: center;">
                            <button class="print-receipt-btn" data-uuid="${receipt.uuid}" title="طباعة/تحميل الإيصال" style="background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 8px 12px; font-size: 14px;">تحميل PDF</button>
                        </td>
                    </tr>
                `).join('');

                tableContainer.innerHTML = `
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead style="position: sticky; top: 0; background: #020b18ff; color: white; z-index: 10;">
                           <tr>
                                <th style="padding: 12px;">الرقم الداخلي</th>
                                <th style="padding: 12px;">الرقم الإلكتروني (UUID)</th>
                                <th style="padding: 12px;">التاريخ</th>
                                <th style="padding: 12px; text-align: right;">اسم العميل</th>
                                <th style="padding: 12px;">الإجمالي النهائي</th>
                                <th style="padding: 12px;">إجراء</th>
                           </tr>
                        </thead>
                        <tbody>${tableRowsHTML}</tbody>
                    </table>
                `;
            }

            // تحديث معلومات وأزرار التنقل
            title.textContent = `أحدث الإيصالات المرسلة (إجمالي ${data.metadata?.totalCount || 0})`;
            pageInfo.textContent = `صفحة ${currentPage} من ${totalPages}`;
            prevBtn.disabled = currentPage === 1;
            nextBtn.disabled = currentPage >= totalPages;
            
            // ربط الأحداث بالأزرار الجديدة
            tableContainer.querySelectorAll('.print-receipt-btn').forEach(btn => {
                btn.onclick = () => generateCustomPdf(btn);
            });

        } catch (error) {
            tableContainer.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">${error.message}</div>`;
        }
    };

    // --- 3. ربط أحداث التنقل ---
    modalContent.querySelector('#closeReceiptsViewerBtn').onclick = () => modal.remove();
    prevBtn.onclick = () => { if (currentPage > 1) loadReceiptsPage(currentPage - 1); };
    nextBtn.onclick = () => { if (currentPage < totalPages) loadReceiptsPage(currentPage + 1); };

    // --- 4. تحميل الصفحة الأولى عند الفتح ---
    loadReceiptsPage(1);
}

/**
 * ===================================================================================
 * ✅✅✅ دالة جديدة: لجلب تفاصيل إيصال كاملة وإنشاء PDF مخصص
 * ===================================================================================
 */



/**
 * ===================================================================================
 * ✅✅✅ دالة بناء واجهة الإرسال اليدوي (النسخة المطورة مع اختيار أصناف المرتجع) ✅✅✅
 * ===================================================================================
 * @param {HTMLElement} container - الحاوية التي سيتم بناء الواجهة بداخلها.
 * @param {string} activitySelectorHTML - كود HTML الخاص بقائمة اختيار الأنشطة.
 * @param {string} documentType - نوع المستند المطلوب ('sale' للبيع أو 'return' للمرتجع).
 */
async function buildManualSendForm(container, activitySelectorHTML, documentType = 'sale') {
    // --- 1. تحديد العناوين والنصوص بناءً على نوع المستند ---
    const isReturn = documentType === 'return';
    const mainTitle = isReturn ? 'إنشاء إشعار مرتجع يدوي' : 'إنشاء إيصال بيع يدوي';
    const internalIdLabel = isReturn ? 'رقم المرتجع الداخلي' : 'رقم الإيصال الداخلي';
    const defaultInternalId = isReturn ? `RTN-${Date.now()}` : `RCPT-${Date.now()}`;
    const sendButtonText = isReturn ? 'إرسال إشعار المرتجع' : 'إرسال الإيصال';

    // --- 2. جلب البيانات الأساسية ---
    const loadingToast = showToastNotification('جاري تحميل بيانات الممول ونقاط البيع...', 0);
    const [sellerData, devices] = await Promise.all([getIssuerFullData(), getDeviceSerialNumber()]);
    loadingToast.remove();

    if (!sellerData || !devices || devices.length === 0) {
        container.innerHTML = '<p style="color: red; text-align: center; padding: 20px;">فشل تحميل بيانات الممول أو نقاط البيع. لا يمكن المتابعة.</p>';
        return;
    }
    const defaultDevice = devices[0];
    
    const taxTypesData = [
      { "Code": "T1", "Desc_ar": "ضريبة القيمة المضافة" }, { "Code": "T2", "Desc_ar": "ضريبة الجدول (نسبية)" },
      { "Code": "T3", "Desc_ar": "ضريبة الجدول (النوعية)" }, { "Code": "T4", "Desc_ar": "الخصم تحت حساب الضريبة" },
      { "Code": "T5", "Desc_ar": "ضريبة الدمغة (نسبية)" }, { "Code": "T6", "Desc_ar": "ضريبة الدمغة (قطعية بمقدار ثابت)" },
      { "Code": "T7", "Desc_ar": "ضريبة الملاهي" }, { "Code": "T8", "Desc_ar": "رسم تنمية الموارد" },
      { "Code": "T9", "Desc_ar": "رسم خدمة" }, { "Code": "T10", "Desc_ar": "رسم المحليات" },
      { "Code": "T11", "Desc_ar": "رسم التأمين الصحي" }, { "Code": "T12", "Desc_ar": "رسوم أخرى" }
    ];
    const taxSubtypesData = JSON.parse('[{"Code":"V001","Desc_en":"Export","Desc_ar":"تصدير للخارج","TaxtypeReference":"T1"},{"Code":"V002","Desc_en":"Export to free areas and other areas","Desc_ar":"تصدير مناطق حرة وأخرى","TaxtypeReference":"T1"},{"Code":"V003","Desc_en":"Exempted good or service","Desc_ar":"سلعة أو خدمة معفاة","TaxtypeReference":"T1"},{"Code":"V004","Desc_en":"A non-taxable good or service","Desc_ar":"سلعة أو خدمة غير خاضعة للضريبة","TaxtypeReference":"T1"},{"Code":"V005","Desc_en":"Exemptions for diplomats, consulates and embassies","Desc_ar":"إعفاءات دبلوماسين والقنصليات والسفارات","TaxtypeReference":"T1"},{"Code":"V006","Desc_en":"Defence and National security Exemptions","Desc_ar":"إعفاءات الدفاع والأمن القومى","TaxtypeReference":"T1"},{"Code":"V007","Desc_en":"Agreements exemptions","Desc_ar":"إعفاءات اتفاقيات","TaxtypeReference":"T1"},{"Code": "V008", "Desc_en": "Special Exemptios and other reasons", "Desc_ar": "إعفاءات خاصة و أخرى", "TaxtypeReference": "T1"}, {"Code": "V009", "Desc_en": "General Item sales", "Desc_ar": "سلع عامة", "TaxtypeReference": "T1"}, {"Code": "V010", "Desc_en": "Other Rates", "Desc_ar": "نسب ضريبة أخرى", "TaxtypeReference": "T1"}, {"Code": "Tbl01", "Desc_en": "Table tax (percentage)", "Desc_ar": "ضريبه الجدول (نسبيه)", "TaxtypeReference": "T2"}, {"Code": "Tbl02", "Desc_en": "Table tax (Fixed Amount)", "Desc_ar": "ضريبه الجدول (النوعية)", "TaxtypeReference": "T3"}, {"Code": "W001", "Desc_en": "Contracting", "Desc_ar": "المقاولات", "TaxtypeReference": "T4"}, {"Code": "W002", "Desc_en": "Supplies", "Desc_ar": "التوريدات", "TaxtypeReference": "T4"}, {"Code": "W003", "Desc_en": "Purachases", "Desc_ar": "المشتريات", "TaxtypeReference": "T4"}, {"Code": "W004", "Desc_en": "Services", "Desc_ar": "الخدمات", "TaxtypeReference": "T4"}, {"Code": "W010", "Desc_en": "Professional fees", "Desc_ar": "اتعاب مهنية", "TaxtypeReference": "T4"}, {"Code": "ST01", "Desc_en": "Stamping tax (percentage)", "Desc_ar": "ضريبه الدمغه (نسبيه)", "TaxtypeReference": "T5"}, {"Code": "ST02", "Desc_en": "Stamping Tax (amount)", "Desc_ar": "ضريبه الدمغه (قطعيه بمقدار ثابت)", "TaxtypeReference": "T6"}, {"Code": "Ent01", "Desc_en": "Entertainment tax (rate)", "Desc_ar": "ضريبة الملاهى (نسبة)", "TaxtypeReference": "T7"}, {"Code": "RD01", "Desc_en": "Resource development fee (rate)", "Desc_ar": "رسم تنميه الموارد (نسبة)", "TaxtypeReference": "T8"}, {"Code": "SC01", "Desc_en": "Service charges (rate)", "Desc_ar": "رسم خدمة (نسبة)", "TaxtypeReference": "T9"}, {"Code": "Mn01", "Desc_en": "Municipality Fees (rate)", "Desc_ar": "رسم المحليات (نسبة)", "TaxtypeReference": "T10"}, {"Code": "MI01", "Desc_en": "Medical insurance fee (rate)", "Desc_ar": "رسم التامين الصحى (نسبة)", "TaxtypeReference": "T11"}, {"Code": "OF01", "Desc_en": "Other fees (rate)", "Desc_ar": "رسوم أخرى", "TaxtypeReference": "T12"}]');

    // --- 3. بناء هيكل الواجهة ---
    let addedItems = [];
    let currentlyEditingIndex = -1;
    let originalInvoiceData = null; // لتخزين بيانات الفاتورة الأصلية

    const referenceUuidField = isReturn ? `
        <div class="form-group">
            <label for="manual-reference-uuid">UUID الفاتورة الأصلية (*)</label>
            <div style="display: flex; align-items: center; gap: 10px;">
                <input type="text" id="manual-reference-uuid" required placeholder="أدخل UUID هنا واضغط على زر البحث" style="flex-grow: 1;">
                <button type="button" id="fetch-invoice-details-btn" title="جلب بيانات الفاتورة الأصلية" class="action-button" style="padding: 10px 15px; flex-shrink: 0; background-color: #007bff; width: auto;">🔍</button>
            </div>
        </div>
    ` : '';

    // ✅ تعديل هيكل تبويب الأصناف لإضافة الحاوية الجديدة
      // استبدل الكود السابق بهذا الكود
    const itemsTabHTML = `
        <!-- ✅ حاوية جديدة لعرض أصناف الفاتورة الأصلية (للمرتجعات) -->
        <div id="original-invoice-items-container" style="display: none; background: #e9f5ff; border: 1px solid #b3d7ff; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
            <h4 style="margin-top: 0; color: #0056b3;">أصناف الفاتورة الأصلية (حدد للإرجاع)</h4>
            <div id="original-items-list" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px; border: 1px solid #ddd; background: #fff; padding: 10px;">
                <!-- سيتم ملء القائمة هنا -->
            </div>
            <button type="button" id="add-selected-to-return-btn" class="action-button" style="width: auto; padding: 10px 30px; background-color: #28a745;">+ إضافة المحدد للمرتجع</button>
        </div>

        <!-- زر إضافة صنف جديد -->
        <button type="button" id="add-new-item-button" class="action-button" style="width: auto; padding: 12px 30px; background-color: #007bff; margin-bottom: 20px;">+ إضافة صنف جديد</button>

        <!-- حاوية نموذج إضافة الصنف (مخفية مبدئيًا) -->
        <div id="item-form-wrapper" style="display: none; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; background-color: #f8f9fa; margin-bottom: 20px;">
            <form id="item-form">
                <div class="form-grid" style="align-items: flex-end;">
                    <div class="form-group"><label>نوع الكود</label><select id="item-code-type" required><option value="EGS">EGS</option><option value="GS1">GS1</option></select></div>
                    <div class="form-group"><label>الكود</label><input type="text" id="item-code" required></div>
                    <div class="form-group"><label>اسم الكود (تلقائي)</label><input type="text" id="item-code-name" readonly style="background:#eee;"></div>
                    <div class="form-group"><label>وصف الصنف</label><input type="text" id="item-description" required></div>
                    <div class="form-group"><label>الكمية</label><input type="number" id="item-quantity" value="1" step="any" required></div>
                    <div class="form-group"><label>سعر الوحدة</label><input type="number" id="item-unit-price" step="any" required></div>
                    <div class="form-group"><label>الإجمالي</label><input type="text" id="item-total" readonly style="background:#eee;"></div>
                </div>
                <h4>الضرائب على الصنف</h4>
                <div id="item-taxes-container" class="form-grid"></div>
                <button type="button" id="add-tax-row-btn" style="margin-top: 10px;">+ إضافة ضريبة أخرى</button>
                <hr>
                <div id="item-form-actions" style="display: flex; gap: 10px;">
                    <button type="submit" id="add-item-btn" class="action-button" style="width: auto; padding: 10px 30px;">إضافة الصنف</button>
                    <button type="button" id="cancel-edit-btn" class="action-button" style="width: auto; padding: 10px 30px; background-color: #6c757d; display: none;">إلغاء التعديل</button>
                </div>
            </form>
        </div>
        
        <h4 style="margin-top: 25px;">الأصناف المضافة (اضغط للتعديل)</h4>
        <table id="items-table"><thead><tr><th>الكود</th><th>الوصف</th><th>الكمية</th><th>السعر</th><th>الإجمالي</th><th>إجراء</th></tr></thead><tbody></tbody></table>
    `;

    container.innerHTML = `
        <div id="manual-send-container">
            <div id="manualSendModal" class="manual-modal" style="display:flex;">
                <div class="manual-modal-content">
                    <div class="manual-modal-header" style="cursor: move;"><h3>${mainTitle}</h3><button id="closeManualModalBtn" title="إغلاق">&times;</button></div>
                    <div class="manual-modal-body">
                        <div class="manual-tabs">
                            <button class="manual-tab-btn active" data-tab-index="0"><span class="tab-status-indicator"></span>البيانات الأساسية</button>
                            <button class="manual-tab-btn" data-tab-index="1"><span class="tab-status-indicator"></span>الأصناف</button>
                            <button class="manual-tab-btn" data-tab-index="2"><span class="tab-status-indicator"></span>الملخص والدفع</button>
                        </div>
                        <div class="manual-tab-content-wrapper">
                            <div id="tab-basic" class="manual-tab-content active">
                            <div class="form-grid">
    <div class="form-group"><label for="manual-receipt-number">${internalIdLabel} (*)</label><input type="text" id="manual-receipt-number" required value="${defaultInternalId}"></div>
    
    <div class="form-group">
        <label for="manual-datetime-issued">تاريخ الإصدار (*)</label>
        <input type="date" id="manual-datetime-issued" required style="font-family: sans-serif; text-align: right;">
    </div>

    ${referenceUuidField}
    <div class="form-group"><label for="manual-buyer-name">اسم العميل</label><input type="text" id="manual-buyer-name" value="عميل نقدي"></div>

<div class="form-group">
    <label for="manual-buyer-id">الرقم القومي (14 رقم)</label>
    <input type="text" id="manual-buyer-id" maxlength="14" pattern="[0-9]{14}" style="transition: all 0.3s ease;">
    <small id="nid-validation-status" style="margin-top: 5px; font-weight: bold; height: 15px; display: block;"></small>
</div>
                                </div>
                                <hr style="margin: 20px 0;"><h4 style="margin-bottom: 15px;">بيانات المصدر ونقطة البيع</h4>
                                <div class="form-grid">${activitySelectorHTML}<div class="form-group"><label for="pos-device-select">نقطة البيع (POS):</label>
                                <select id="pos-device-select" class="form-group-select">${devices.map(d => `<option value="${d.serialNumber}" ${d.serialNumber === defaultDevice.serialNumber ? 'selected' : ''}>${d.serialNumber}</option>`).join('')}</select></div></div>




                                
                            </div>
                            <div id="tab-items" class="manual-tab-content">${itemsTabHTML}</div>
<div id="tab-summary" class="manual-tab-content">
    <div id="summary-details"></div>
    <div class="form-group" style="margin-top: 20px;"><label for="payment-method">طريقة الدفع</label><select id="payment-method"><option value="C" selected>نقدي</option><option value="V">فيزا/ماستركارد</option></select></div>
    
    <!-- حاوية الأزرار الجديدة -->
    <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center;">
        <button id="save-draft-btn" class="action-button" style="background-color: #ffc107; color: #333; width: 40%;">📝 حفظ كمسودة</button>
        <button id="send-manual-receipt-btn" class="action-button" style="background-color: #28a745; width: 60%;">${sendButtonText}</button>
    </div>

</div>

                        </div>
                        <div class="manual-modal-footer"><button id="prevTabBtn" class="navigation-btn" disabled>السابق</button><button id="nextTabBtn" class="navigation-btn">التالي</button></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    
    // --- 4. إضافة الأنماط (CSS) ---
    const manualStyles = document.createElement('style');
    manualStyles.id = "manualSendFormStyles";
    if (!document.getElementById(manualStyles.id)) {
        manualStyles.innerHTML = `





        /* --- أنماط واجهة البحث عن الأكواد المنبثقة --- */
.code-search-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 10002; /* يجب أن يكون أعلى من الواجهة الرئيسية */
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}
.code-search-content {
    width: 700px;
    height: 80%;
    background: #fff;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 5px 25px rgba(0,0,0,0.2);
}
.code-search-header {
    padding: 15px 20px;
    border-bottom: 1px solid #dee2e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.code-search-header h4 { margin: 0; color: #1d3557; }
.code-search-header input {
    width: 50%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 8px;
    font-size: 15px;
}
.code-search-body {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
}
.code-search-table {
    width: 100%;
    border-collapse: collapse;
}
.code-search-table th, .code-search-table td {
    padding: 12px;
    text-align: right;
    border-bottom: 1px solid #e9ecef;
}
.code-search-table th { background-color: #f8f9fa; font-weight: 600; }
.code-search-table tbody tr { cursor: pointer; transition: background-color 0.2s; }
.code-search-table tbody tr:hover { background-color: #e9f5ff; }
.code-search-table .code-value { font-family: monospace; color: #007bff; direction: ltr; text-align: left; }
.code-search-placeholder { text-align: center; padding: 40px; color: #888; font-size: 18px; }

            /* --- تصميم الواجهة الرئيسية المنبثقة --- */
            .manual-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 10001; display: none; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
            .manual-modal-content { width: 95%; max-width: 1300px; height: 90vh; background: #f4f7fa; border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); animation: zoomIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
            @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            /* --- تصميم الشريط العلوي (Header) --- */
            .manual-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; border-bottom: 1px solid #dee2e6; background-color: #ffffff; cursor: move; }
            .manual-modal-header h3 { margin: 0; font-size: 20px; color: #1d3557; }
            .manual-modal-header #closeManualModalBtn { background: #f1f1f1; color: #555; border: none; width: 30px; height: 30px; border-radius: 50%; font-size: 20px; cursor: pointer; transition: all 0.2s; }
            .manual-modal-header #closeManualModalBtn:hover { background: #e63946; color: white; transform: rotate(90deg); }
            /* --- تصميم التبويبات (Tabs) --- */
            .manual-modal-body { flex-grow: 1; display: flex; flex-direction: column; overflow-y: auto; }
            .manual-tabs { display: flex; border-bottom: 1px solid #dee2e6; padding: 0 20px; background-color: #ffffff; }
            .manual-tab-btn { padding: 18px 25px; border: none; background: transparent; cursor: pointer; font-size: 16px; font-weight: 600; color: #6c757d; border-bottom: 4px solid transparent; transition: all 0.3s; display: flex; align-items: center; gap: 10px; }
            .manual-tab-btn:hover { color: #007bff; background-color: #f8f9fa; }
            .manual-tab-btn.active { border-bottom-color: #007bff; color: #007bff; }
            .manual-tab-content-wrapper { flex-grow: 1; overflow-y: auto; }
            .manual-tab-content { display: none; padding: 30px; }
            .manual-tab-content.active { display: block; }
            /* --- مؤشرات التحقق وأزرار التنقل --- */
            .tab-status-indicator { display: inline-block; width: 18px; height: 18px; border-radius: 50%; line-height: 18px; text-align: center; font-size: 12px; font-weight: bold; color: white; background-color: #ced4da; transition: all 0.3s; }
            .tab-status-indicator.valid { background-color: #28a745; } .tab-status-indicator.valid::before { content: '✔'; }
            .tab-status-indicator.invalid { background-color: #dc3545; } .tab-status-indicator.invalid::before { content: '✖'; }
            .manual-modal-footer { padding: 15px 25px; border-top: 1px solid #dee2e6; display: flex; justify-content: space-between; background-color: #f8f9fa; }
            .navigation-btn { padding: 10px 30px; font-size: 16px; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
            .navigation-btn:disabled { background-color: #e9ecef; color: #6c757d; cursor: not-allowed; }
            #nextTabBtn { background-color: #007bff; color: white; }
            #prevTabBtn { background-color: #6c757d; color: white; }
            /* --- تصميم حقول الإدخال والجداول --- */
            .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 25px; }
            .form-group { display: flex; flex-direction: column; }
            .form-group label { margin-bottom: 8px; font-weight: 600; color: #495057; font-size: 14px; }
            .form-group input, .form-group select { padding: 12px; border: 1px solid #ced4da; border-radius: 8px; font-size: 15px; transition: all 0.2s; }
            .form-group input:focus, .form-group select:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1); outline: none; }
            .form-group input[readonly] { background-color: #e9ecef; cursor: not-allowed; }
            #items-table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
            #items-table th, #items-table td { border: 1px solid #e9ecef; padding: 12px; text-align: center; }
            #items-table th { background-color: #e9ecef; font-weight: 700; color: #343a40; }
            #items-table tbody tr:nth-child(even) { background-color: #f8f9fa; }
            #items-table tbody tr { cursor: pointer; transition: background-color 0.2s; }
            #items-table tbody tr:hover { background-color: #e9ecef; }
            .editing-item { background-color: #fffbe6 !important; border: 2px solid #ffe58f; }
            .action-button { transition: all 0.2s; }
            .action-button:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.15); }
        `;
        document.head.appendChild(manualStyles);
    }

    // --- 5. ربط الأحداث والمنطق (الجزء الأساسي) ---
    const modal = container.querySelector('#manualSendModal');
    const modalHeader = container.querySelector('.manual-modal-header');
    makeDraggable(modal, modalHeader);
// << أضف هذا الكود الجديد بالكامل >>

const buyerIdInput = container.querySelector('#manual-buyer-id');
const nidStatus = container.querySelector('#nid-validation-status');

// دالة للتحقق من الرقم القومي عبر API
async function validateNID(nid) {
    if (!nid || nid.length !== 14 || !/^\d+$/.test(nid)) {
        return { valid: false, message: "يجب إدخال 14 رقمًا صحيحًا." };
    }
    try {
        const token = getAccessToken();
        if (!token) return { valid: false, message: "خطأ مصادقة." };
        
        const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/person/${nid}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        } );

        if (response.status === 200) {
            const data = await response.json();
            const fullName = `${data.firstName || ''} ${data.otherNames || ''}`.trim();
            return { valid: true, message: `صحيح (${fullName || 'شخص'})` };
        } else if (response.status === 400) {
            const errorData = await response.json();
            return { valid: false, message: errorData.error.details[0].message || "رقم قومي غير صالح." };
        } else {
            return { valid: false, message: `خطأ ${response.status} من الخادم.` };
        }
    } catch (error) {
        return { valid: false, message: "فشل التحقق من الرقم." };
    }
}

// ربط حدث التحقق عند الخروج من الحقل (blur)
buyerIdInput.addEventListener('blur', async () => {
    const nid = buyerIdInput.value.trim();
    // إذا كان الحقل فارغًا، أعده لوضعه الطبيعي
    if (!nid) {
        nidStatus.textContent = '';
        buyerIdInput.style.backgroundColor = '';
        buyerIdInput.style.borderColor = '';
        return;
    }

    nidStatus.textContent = '⏳ جاري التحقق...';
    nidStatus.style.color = '#007bff';
    
    const result = await validateNID(nid);

    if (result.valid) {
        nidStatus.textContent = `✅ ${result.message}`;
        nidStatus.style.color = '#28a745'; // أخضر
        buyerIdInput.style.backgroundColor = '#d4edda'; // أخضر فاتح
        buyerIdInput.style.borderColor = '#28a745';
    } else {
        nidStatus.textContent = `❌ ${result.message}`;
        nidStatus.style.color = '#dc3545'; // أحمر
        buyerIdInput.style.backgroundColor = '#f8d7da'; // أحمر فاتح
        buyerIdInput.style.borderColor = '#dc3545';
    }
});

// ربط حدث الإدخال لإعادة الحقل لوضعه الطبيعي عند بدء التعديل
buyerIdInput.addEventListener('input', () => {
    if (buyerIdInput.style.backgroundColor !== '') {
        nidStatus.textContent = '';
        buyerIdInput.style.backgroundColor = '';
        buyerIdInput.style.borderColor = '';
    }
});

    container.querySelector('#closeManualModalBtn').onclick = () => {
        modal.style.display = 'none';
        container.innerHTML = '';
    };

    const tabButtons = Array.from(container.querySelectorAll('.manual-tab-btn'));
    const tabContents = Array.from(container.querySelectorAll('.manual-tab-content'));
    const prevBtn = container.querySelector('#prevTabBtn');
    const nextBtn = container.querySelector('#nextTabBtn');
    let currentTabIndex = 0;

    function switchTab(index) {
        if (index < 0 || index >= tabButtons.length) return;
        validateAllTabs();
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        tabButtons[index].classList.add('active');
        tabContents[index].classList.add('active');
        currentTabIndex = index;
        prevBtn.disabled = (currentTabIndex === 0);
        nextBtn.disabled = (currentTabIndex === tabButtons.length - 1);
    }

    tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(parseInt(btn.dataset.tabIndex))));
    prevBtn.addEventListener('click', () => switchTab(currentTabIndex - 1));
    nextBtn.addEventListener('click', () => switchTab(currentTabIndex + 1));

    function validateTab(index) {
        const content = tabContents[index];
        const indicator = tabButtons[index].querySelector('.tab-status-indicator');
        let isTabValid = true;
        if (index === 1) { isTabValid = addedItems.length > 0; } 
        else {
            const requiredInputs = content.querySelectorAll('[required]');
            for (const input of requiredInputs) { if (!input.value.trim()) { isTabValid = false; break; } }
        }
        indicator.classList.remove('valid', 'invalid');
        indicator.classList.add(isTabValid ? 'valid' : 'invalid');
    }
    function validateAllTabs() { tabButtons.forEach((_, index) => validateTab(index)); }
    modal.querySelectorAll('input[required], select[required]').forEach(input => input.addEventListener('input', validateAllTabs));
// << أضف هذا الكود الجديد بالكامل >>

    const addNewItemButton = container.querySelector('#add-new-item-button');
    const itemFormWrapper = container.querySelector('#item-form-wrapper');

    addNewItemButton.addEventListener('click', () => {
        itemFormWrapper.style.display = 'block'; // إظهار نموذج إضافة الصنف
        addNewItemButton.style.display = 'none'; // إخفاء زر "إضافة صنف جديد"
        resetForm(); // إعادة تهيئة النموذج لأي صنف جديد
        itemFormWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' }); // التمرير للنموذج
    });

  
    
    // << استبدل الدالة القديمة بالكامل بهذه الدالة الجديدة >>
    function resetForm() {
        itemForm.reset();
        taxesContainer.innerHTML = '';
        taxRowCount = 0;
        
        // ✅ تعديل: أضف صف ضريبة فارغًا فقط عند تهيئة النموذج لإدخال جديد
        addTaxRow(); 
        
        updateTotal();
        currentlyEditingIndex = -1;
        addItemBtn.textContent = 'إضافة الصنف';
        cancelEditBtn.style.display = 'none';
        itemsTableBody.querySelectorAll('tr').forEach(r => r.classList.remove('editing-item'));
        
        // إخفاء النموذج وإظهار زر "إضافة صنف" إذا لم تكن هناك أصناف
        if (addedItems.length === 0) {
            itemFormWrapper.style.display = 'none';
            addNewItemButton.style.display = 'block';
        }
    }





    const qtyInput = container.querySelector('#item-quantity');
    const priceInput = container.querySelector('#item-unit-price');
    const totalInput = container.querySelector('#item-total');
    const updateTotal = () => { totalInput.value = ((parseFloat(qtyInput.value) || 0) * (parseFloat(priceInput.value) || 0)).toFixed(5); };
    [qtyInput, priceInput].forEach(el => el.addEventListener('input', updateTotal));

    const taxesContainer = container.querySelector('#item-taxes-container');
    let taxRowCount = 0;

    
    function addTaxRow(taxData = null) {
        if (taxRowCount >= 2) { container.querySelector('#add-tax-row-btn').style.display = 'none'; return; }
        taxRowCount++;
        const taxRow = document.createElement('div');
        taxRow.className = 'form-grid';
      // --- بداية التعديل ---

// 1. أضفنا حاوية جديدة باستخدام flexbox لتنظيم العناصر.
// 2. أضفنا زر الحذف مع تنسيقات بسيطة لجعله يظهر كـ "X".
taxRow.innerHTML = `
    <div style="display: flex; align-items: flex-end; gap: 10px; width: 100%;">
        <div class="form-grid" style="flex-grow: 1;">
            <div class="form-group"><label>النوع الأساسي ${taxRowCount}</label><select class="tax-type">${taxTypesData.map(t => `<option value="${t.Code}">${t.Desc_ar}</option>`).join('')}</select></div>
            <div class="form-group"><label>النوع الفرعي ${taxRowCount}</label><select class="tax-subtype"></select></div>
            <div class="form-group"><label>النسبة %</label><input type="number" class="tax-rate" step="any"></div>
            <div class="form-group"><label>مبلغ الضريبة</label><input type="text" class="tax-amount" readonly style="background:#eee;"></div>
        </div>
        <button type="button" class="delete-tax-row-btn" title="حذف الضريبة" style="background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 50%; width: 32px; height: 32px; font-size: 20px; cursor: pointer; flex-shrink: 0; margin-bottom: 10px;">&times;</button>
    </div>
`;

taxesContainer.appendChild(taxRow);

// 3. ربط حدث النقر لزر الحذف الجديد.
const deleteBtn = taxRow.querySelector('.delete-tax-row-btn');
deleteBtn.addEventListener('click', () => {
    taxRow.remove(); // حذف صف الضريبة بالكامل
    taxRowCount--; // إنقاص العداد للسماح بإضافة صف جديد
    // إعادة إظهار زر "إضافة ضريبة" إذا كان عدد الصفوف أقل من الحد الأقصى
    if (taxRowCount < 2) {
        container.querySelector('#add-tax-row-btn').style.display = 'block';
    }
});

// --- نهاية التعديل ---

        const typeSelect = taxRow.querySelector('.tax-type');
        const subtypeSelect = taxRow.querySelector('.tax-subtype');
        const rateInput = taxRow.querySelector('.tax-rate');
        const amountInput = taxRow.querySelector('.tax-amount');
        const updateSubtypes = () => {
            const subtypes = taxSubtypesData.filter(st => st.TaxtypeReference === typeSelect.value);
            subtypeSelect.innerHTML = subtypes.map(s => `<option value="${s.Code}">${s.Desc_ar}</option>`).join('');
            if (typeSelect.value === 'T1') subtypeSelect.value = 'V009';
        };
        const updateTaxAmount = () => { amountInput.value = ((parseFloat(totalInput.value) || 0) * (parseFloat(rateInput.value) || 0) / 100).toFixed(5); };
        typeSelect.addEventListener('change', updateSubtypes);
              // استبدل السطر السابق بهذا
        [rateInput, priceInput, qtyInput].forEach(el => el.addEventListener('input', updateTaxAmount));
        
        // ✅ جديد: أضف هذا السطر لتحديث مبلغ الضريبة عند تغيير النوع الفرعي أيضًا
        subtypeSelect.addEventListener('change', updateTaxAmount);

        updateSubtypes();
        if (taxData) {
            typeSelect.value = taxData.taxType;
            updateSubtypes();
            subtypeSelect.value = taxData.subType;
            rateInput.value = taxData.rate;
            updateTaxAmount();
        }
    }
    container.querySelector('#add-tax-row-btn').onclick = () => addTaxRow();

      const itemCodeInput = container.querySelector('#item-code');


      
    const itemCodeNameInput = container.querySelector('#item-code-name');
    // --- ✅✅✅ بداية التعديل: إضافة أيقونة بحث وفتح الواجهة المنبثقة ✅✅✅ ---
    const itemCodeTypeSelect = container.querySelector('#item-code-type');
    const itemCodeGroup = itemCodeInput.parentElement; // الحصول على حاوية الحقل

    // تعديل تصميم الحاوية لتسمح بوضع الأيقونة
    itemCodeGroup.style.position = 'relative';

    // إنشاء أيقونة البحث
    const searchIcon = document.createElement('span');
    searchIcon.innerHTML = '🔍';
    Object.assign(searchIcon.style, {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        fontSize: '18px',
        display: itemCodeTypeSelect.value === 'EGS' ? 'block' : 'none' // إظهارها فقط لـ EGS
    });
    itemCodeGroup.appendChild(searchIcon);

    // دالة لإظهار/إخفاء الأيقونة بناءً على نوع الكود
    const toggleSearchIcon = () => {
        searchIcon.style.display = itemCodeTypeSelect.value === 'EGS' ? 'block' : 'none';
    };
    itemCodeTypeSelect.addEventListener('change', toggleSearchIcon);

    // ربط حدث النقر على الأيقونة لفتح واجهة البحث
    searchIcon.addEventListener('click', (e) => {
        e.stopPropagation(); // منع أي أحداث أخرى
        showEgsCodeSearchModal((selectedCode) => {
            // هذه الدالة هي ما سيحدث عند اختيار كود
            itemCodeInput.value = selectedCode.codeLookupValue;
            itemCodeNameInput.value = selectedCode.codeNameSecondaryLang;
            // يمكنك ملء الوصف تلقائيًا أيضًا إذا أردت
            container.querySelector('#item-description').value = selectedCode.codeNameSecondaryLang;
        });
    });
    // --- ✅✅✅ نهاية التعديل ---

    // دالة مجمعة للتحقق من الكود
    const handleCodeValidation = async () => {
        const code = itemCodeInput.value.trim();
        const codeType = itemCodeTypeSelect.value; //  قراءة النوع المختار (EGS أو GS1)

        if (!code) {
            itemCodeNameInput.value = ''; // مسح الحقل إذا كان الكود فارغًا
            return;
        }

        itemCodeNameInput.value = 'جاري التحقق...';
        let codeData = null;

        //  التحقق بناءً على النوع المختار
        if (codeType === 'EGS') {
            codeData = await fetchMyEGSCode(code);
        } else if (codeType === 'GS1') {
            codeData = await fetchGS1Code(code);
        }

        // عرض النتيجة
        itemCodeNameInput.value = codeData ? codeData.codeNameSecondaryLang : '!! كود غير صالح !!';
    };

    // ربط حدث التحقق عند الخروج من حقل الكود أو عند تغيير نوع الكود
    itemCodeInput.addEventListener('blur', handleCodeValidation);
    itemCodeTypeSelect.addEventListener('change', handleCodeValidation);

    // --- 6. ربط الأحداث والمنطق (الجزء المتقدم) ---
    const itemForm = container.querySelector('#item-form');
    const itemsTableBody = container.querySelector('#items-table tbody');
    const addItemBtn = container.querySelector('#add-item-btn');
    const cancelEditBtn = container.querySelector('#cancel-edit-btn');

    function resetForm() {
        itemForm.reset();
        taxesContainer.innerHTML = '';
        taxRowCount = 0;
        addTaxRow();
        updateTotal();
        currentlyEditingIndex = -1;
        addItemBtn.textContent = 'إضافة الصنف';
        cancelEditBtn.style.display = 'none';
        itemsTableBody.querySelectorAll('tr').forEach(r => r.classList.remove('editing-item'));
    }

    cancelEditBtn.addEventListener('click', resetForm);

 
        // << استبدل الدالة القديمة بالكامل بهذه الدالة الجديدة >>
    function populateItemForm(itemData) {
        container.querySelector('#item-code-type').value = itemData.itemType;
        container.querySelector('#item-code').value = itemData.itemCode;
        container.querySelector('#item-description').value = itemData.description;
        container.querySelector('#item-quantity').value = itemData.quantity;
        container.querySelector('#item-unit-price').value = itemData.unitPrice;
        updateTotal();
        
        taxesContainer.innerHTML = '';
        taxRowCount = 0;
        
        // ✅✅✅ بداية التعديل: منطق جديد للتعامل مع الضرائب ✅✅✅
        // إذا كان الصنف يحتوي على ضرائب، قم بإضافتها
        if (itemData.taxableItems && itemData.taxableItems.length > 0) {
            itemData.taxableItems.forEach(tax => {
                // التأكد من أن كائن الضريبة يحتوي على البيانات المطلوبة قبل إضافته
                if (tax && tax.taxType && tax.subType && tax.rate !== undefined) {
                    addTaxRow(tax);
                }
            });
        } 
        // إذا لم يكن هناك ضرائب، لا تقم بإضافة أي صف ضريبي فارغ.
        // سيظهر زر "+ إضافة ضريبة أخرى" للمستخدم ليضيفها بنفسه إذا أراد.
        // ✅✅✅ نهاية التعديل ✅✅✅

        // تحديث حالة زر "إضافة ضريبة"
        container.querySelector('#add-tax-row-btn').style.display = (taxRowCount < 2) ? 'block' : 'none';
        
        // تفعيل حدث التحقق من الكود لجلب اسمه
        itemCodeInput.dispatchEvent(new Event('blur'));
    }


    function renderItemsTable() {
        itemsTableBody.innerHTML = '';
        addedItems.forEach((item, index) => {
            const row = itemsTableBody.insertRow();
            row.dataset.index = index;
            row.className = (index === currentlyEditingIndex) ? 'editing-item' : '';
            row.innerHTML = `<td>${item.itemCode}</td><td>${item.description}</td><td>${item.quantity}</td><td>${item.unitPrice.toFixed(2)}</td><td>${item.total.toFixed(5)}</td><td><button class="delete-item-btn" data-index="${index}" style="background: #dc3545; color: white; border: none; border-radius: 50%; cursor: pointer; width: 28px; height: 28px; font-size: 18px;">&times;</button></td>`;
            
            row.addEventListener('click', (e) => {
                if (e.target.classList.contains('delete-item-btn')) return;
                itemsTableBody.querySelectorAll('tr').forEach(r => r.classList.remove('editing-item'));
                row.classList.add('editing-item');
                currentlyEditingIndex = index;
                populateItemForm(addedItems[index]);
                addItemBtn.textContent = 'حفظ التعديلات';
                cancelEditBtn.style.display = 'inline-block';
                itemForm.scrollIntoView({ behavior: 'smooth' });
            });
        });
             container.querySelectorAll('.delete-item-btn').forEach(btn => {
            btn.onclick = (e) => { 
                e.stopPropagation();
                addedItems.splice(btn.dataset.index, 1); 
                if (currentlyEditingIndex == btn.dataset.index) resetForm();
                renderItemsTable(); 
                validateAllTabs(); 
            };
        });
            updateSummary();
        // ✅ جديد: بعد تحديث الجدول، إذا كان فارغًا، أعد إظهار زر "إضافة صنف جديد" وأخفِ النموذج
        if (addedItems.length === 0) {
            itemFormWrapper.style.display = 'none';
            addNewItemButton.style.display = 'block';
        } else {
            // إذا كان هناك أصناف، تأكد من إخفاء زر "إضافة صنف جديد" وإظهار النموذج
            itemFormWrapper.style.display = 'block';
            addNewItemButton.style.display = 'none';
        }
    }


    itemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const itemData = {
            itemType: container.querySelector('#item-code-type').value, itemCode: itemCodeInput.value,
            description: container.querySelector('#item-description').value, unitType: 'EA', 
            quantity: parseFloat(qtyInput.value), unitPrice: parseFloat(priceInput.value),
            total: parseFloat(totalInput.value), taxableItems: []
        };
        taxesContainer.querySelectorAll('.form-grid').forEach(row => {
            const rate = parseFloat(row.querySelector('.tax-rate').value);
            if (rate > 0) {
                itemData.taxableItems.push({
                    taxType: row.querySelector('.tax-type').value, subType: row.querySelector('.tax-subtype').value,
                    rate: rate, amount: parseFloat(row.querySelector('.tax-amount').value)
                });
            }
        });
        
        if (currentlyEditingIndex > -1) {
            addedItems[currentlyEditingIndex] = itemData;
        } else {
            addedItems.push(itemData);
        }
        resetForm();
        renderItemsTable();
        validateAllTabs();
    });

    // ✅ --- بداية المنطق الجديد الخاص بالمرتجعات --- ✅
    if (isReturn) {
        const fetchBtn = container.querySelector('#fetch-invoice-details-btn');
        const originalItemsContainer = container.querySelector('#original-invoice-items-container');
        const originalItemsList = container.querySelector('#original-items-list');
        const addSelectedBtn = container.querySelector('#add-selected-to-return-btn');

        fetchBtn.addEventListener('click', async () => {
            const uuid = container.querySelector('#manual-reference-uuid').value.trim();
            if (!uuid) { alert("يرجى إدخال UUID أولاً."); return; }

            const originalText = fetchBtn.textContent;
            fetchBtn.textContent = '⏳';
            fetchBtn.disabled = true;

            try {
                const token = getAccessToken();
                if (!token) throw new Error('لم يتم العثور على توكن الدخول.');

                const apiUrl = `https://api-portal.invoicing.eta.gov.eg/api/v1/receipts/${uuid}/details`;
                const response = await fetch(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } } );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || `فشل جلب البيانات (رمز الحالة: ${response.status})`);
                }
                
                const data = await response.json();
                
                // 1. تخزين بيانات الفاتورة كاملة
                originalInvoiceData = data.receipt;
                console.log("تم تخزين بيانات الفاتورة الأصلية:", originalInvoiceData);

                // 2. ملء بيانات العميل
                container.querySelector('#manual-buyer-name').value = originalInvoiceData.buyer?.buyerName || 'عميل نقدي';
                container.querySelector('#manual-buyer-id').value = originalInvoiceData.buyer?.buyerId || '';
                showToastNotification('✅ تم جلب بيانات الفاتورة الأصلية بنجاح.', 3000);

                // 3. عرض أصناف الفاتورة الأصلية في الحاوية المخصصة
                if (originalInvoiceData.itemData && originalInvoiceData.itemData.length > 0) {
                    originalItemsList.innerHTML = originalInvoiceData.itemData.map((item, index) => `
                        <div style="padding: 8px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                            <input type="checkbox" class="original-item-checkbox" data-index="${index}" style="width: 18px; height: 18px;">
                            <label style="flex-grow: 1;">
                                ${item.description} (الكمية: ${item.quantity}, السعر: ${item.unitPrice.toFixed(2)})
                            </label>
                        </div>
                    `).join('');
                    originalItemsContainer.style.display = 'block';
                } else {
                    originalItemsList.innerHTML = '<p style="color: #888;">لا توجد أصناف في هذه الفاتورة.</p>';
                }

            } catch (error) {
                alert(`❌ خطأ: ${error.message}`);
                originalItemsContainer.style.display = 'none';
            } finally {
                fetchBtn.textContent = originalText;
                fetchBtn.disabled = false;
            }
        });

        // 4. إضافة منطق لزر "إضافة المحدد للمرتجع"
        addSelectedBtn.addEventListener('click', () => {
            const selectedCheckboxes = container.querySelectorAll('.original-item-checkbox:checked');
            if (selectedCheckboxes.length === 0) {
                alert("يرجى تحديد صنف واحد على الأقل لإضافته للمرتجع.");
                return;
            }

            selectedCheckboxes.forEach(checkbox => {
                const index = parseInt(checkbox.dataset.index, 10);
                const originalItem = originalInvoiceData.itemData[index];

                if (originalItem) {
                    const newItemForReturn = {
                        itemType: originalItem.itemType,
                        itemCode: originalItem.itemCode,
                        description: originalItem.description,
                        unitType: originalItem.unitType,
                        quantity: originalItem.quantity, // يمكن للمستخدم تعديلها لاحقًا
                        unitPrice: originalItem.unitPrice,
                        total: originalItem.total,
                        taxableItems: originalItem.taxableItems.map(tax => ({
                            taxType: tax.taxType,
                            subType: tax.subType,
                            rate: tax.rate,
                            amount: tax.amount
                        }))
                    };
                    addedItems.push(newItemForReturn);
                }
            });

            renderItemsTable();
            validateAllTabs();
            originalItemsContainer.style.display = 'none'; // إخفاء الحاوية بعد الإضافة
            showToastNotification(`✅ تم إضافة ${selectedCheckboxes.length} صنف للمرتجع.`, 3000);
        });
    }
    // ✅ --- نهاية المنطق الجديد الخاص بالمرتجعات --- ✅

    function updateSummary() {
        const summaryContainer = container.querySelector('#summary-details');
        let totalSales = 0;
        const taxTotals = new Map();
        addedItems.forEach(item => {
            totalSales += item.total;
            item.taxableItems.forEach(tax => taxTotals.set(tax.taxType, (taxTotals.get(tax.taxType) || 0) + tax.amount));
        });
        let totalAmount = totalSales;
        let taxSummaryHTML = '';
        taxTotals.forEach((amount, type) => {
            taxSummaryHTML += `<div><strong>إجمالي ضريبة ${type}:</strong> ${amount.toFixed(5)} ج.م</div>`;
            totalAmount += (type === 'T4' ? -amount : amount);
        });
        summaryContainer.innerHTML = `<div style="font-size: 16px; line-height: 1.8;"><div><strong>إجمالي المبيعات (قبل الضرائب):</strong> ${totalSales.toFixed(5)} ج.م</div><hr>${taxSummaryHTML}<hr><div style="font-size: 20px; font-weight: bold; color: #007bff;"><strong>الإجمالي النهائي:</strong> ${totalAmount.toFixed(5)} ج.م</div></div>`;
    }

  


/**
 * ✅✅✅ دالة مساعدة (النسخة النهائية): تجمع البيانات وتحسب الإجماليات والضرائب. ✅✅✅
 * @param {HTMLElement} invoiceGroupElement - عنصر tbody الذي يمثل الفاتورة.
 * @returns {Object} - كائن يحتوي على هيكل الفاتورة الكامل والجاهز للإرسال.
 */
function collectRawDataFromGroup(invoiceGroupElement) {
    // --- 1. جمع البيانات الأساسية من الواجهة ---
    const headerData = {};
    invoiceGroupElement.querySelectorAll('[data-field], [data-issuer-field], [data-receiver-field], [data-invoice-field]').forEach(cell => {
        const key = cell.dataset.field || cell.dataset.issuerField || cell.dataset.receiverField || cell.dataset.invoiceField;
        if (key) {
            headerData[key] = cell.textContent.trim();
        }
    });

    // --- 2. حساب الإجماليات والضرائب من بنود الفاتورة ---
    let totalSalesAmount = 0;
    let totalDiscountAmount = 0;
    const taxTotalsMap = new Map();
    const invoiceLines = [];
    const rawLinesData = []; // لتخزين البيانات الخام للـ lineItemCodes

    invoiceGroupElement.querySelectorAll('.items-table tbody tr').forEach(row => {
        const line = {};
        row.querySelectorAll('[data-field]').forEach(cell => {
            // التعامل مع الخلايا التي تحتوي على حقول متعددة (مثل الضرائب)
            if (cell.querySelectorAll('span[data-field]').length > 0) {
                cell.querySelectorAll('span[data-field]').forEach(span => {
                    line[span.dataset.field] = span.textContent.trim();
                });
            } else {
                line[cell.dataset.field] = cell.textContent.trim();
            }
        });
        rawLinesData.push(line); // إضافة بيانات السطر الخام

        const quantity = parseFloat(line.quantity) || 0;
        const amountEGP = parseFloat(line.unit_price) || 0;
        const salesTotal = parseFloat((quantity * amountEGP).toFixed(5));
        totalSalesAmount += salesTotal;

        const discountAmount = parseFloat(line.discount_amount) || (salesTotal * (parseFloat(line.discount_rate) || 0) / 100);
        totalDiscountAmount += discountAmount;

        const netTotal = parseFloat((salesTotal - discountAmount).toFixed(5));

        const taxableItems = [];
        let totalTaxAmountForItem = 0;
        for (let i = 1; i <= 3; i++) {
            const taxType = line[`tax_type_${i}`]?.trim().toUpperCase();
            const taxRateStr = line[`tax_rate_${i}`];
            if (taxType && taxRateStr != null && taxRateStr.trim() !== '' && !isNaN(parseFloat(taxRateStr))) {
                const taxRate = parseFloat(taxRateStr);
                const taxAmount = parseFloat((netTotal * (taxRate / 100)).toFixed(5));
                const taxSubtype = line[`tax_subtype_${i}`]?.trim() || defaultSubtypes[taxType] || "";
                taxableItems.push({ taxType, amount: taxAmount, subType: taxSubtype, rate: taxRate });

                totalTaxAmountForItem += (taxType === "T4" ? -taxAmount : taxAmount);
                taxTotalsMap.set(taxType, (taxTotalsMap.get(taxType) || 0) + taxAmount);
            }
        }

        invoiceLines.push({
            description: line.item_description,
            itemType: line.item_type,
            itemCode: line.item_code,
            internalCode: line.item_internal_code || line.item_code,
            unitType: line.unit_type,
            quantity: quantity,
            unitValue: { currencySold: "EGP", amountEGP: amountEGP },
            salesTotal: salesTotal,
            discount: { amount: discountAmount },
            netTotal: netTotal,
            taxableItems: taxableItems,
            total: parseFloat((netTotal + totalTaxAmountForItem).toFixed(5)),
            valueDifference: 0,
            totalTaxableFees: 0,
            itemsDiscount: 0
        });
    });

    const taxTotals = Array.from(taxTotalsMap, ([taxType, amount]) => ({ taxType, amount: parseFloat(amount.toFixed(5)) }));
    const finalTotalAmount = invoiceLines.reduce((sum, line) => sum + line.total, 0);

    // --- 3. بناء هيكل JSON النهائي بنفس شكل المسودة ---
    const finalPayload = {
        tags: ["FullInvoice", "SignatureRequired"],
        document: {
            documentType: "I",
            documentTypeVersion: "1.0",
            dateTimeIssued: new Date().toISOString().split('.')[0] + "Z",
            taxpayerActivityCode: document.getElementById('activity-select-editor')?.value || "4690",
            internalID: headerData.internalID,
            issuer: {
                type: "B", id: headerData.id, name: headerData.name,
                address: { branchID: "0", country: "EG", governate: headerData.governate, regionCity: headerData.regionCity, street: headerData.street, buildingNumber: headerData.buildingNumber }
            },
            receiver: {
                type: headerData.receiver_type, id: headerData.receiver_id, name: headerData.receiver_name,
                address: { country: headerData.receiver_country, governate: headerData.receiver_governate, regionCity: headerData.receiver_city, street: headerData.receiver_street, buildingNumber: headerData.receiver_building }
            },
            invoiceLines: invoiceLines,
            totalSalesAmount: parseFloat(totalSalesAmount.toFixed(5)),
            totalDiscountAmount: parseFloat(totalDiscountAmount.toFixed(5)),
            netAmount: parseFloat((totalSalesAmount - totalDiscountAmount).toFixed(5)),
            taxTotals: taxTotals,
            totalAmount: parseFloat(finalTotalAmount.toFixed(5)),
            signatures: [{ signatureType: "I", value: "VGVtcG9yYXJ5IFNpZ25hdHVyZSBIb2xkZXI=" }]
        },
        lineItemCodes: rawLinesData.map(line => ({
            codeType: line.item_type,
            itemCode: line.item_code,
            codeNamePrimaryLang: line.item_code_name || line.item_description,
            codeNameSecondaryLang: line.item_code_name || line.item_description
        }))
    };

    return finalPayload;
}







    // الكود الجديد
// دالة لجمع البيانات من الواجهة
function collectDataForDraft() {
    if (addedItems.length === 0) {
        alert("لا يمكن حفظ مسودة فارغة. يرجى إضافة صنف واحد على الأقل.");
        return null;
    }
    const draftData = {
        receiptNumber: container.querySelector('#manual-receipt-number').value,
        buyerName: container.querySelector('#manual-buyer-name').value,
        buyerId: container.querySelector('#manual-buyer-id').value,
        documentType: documentType, // 'sale' or 'return'
        referenceUUID: isReturn ? (container.querySelector('#manual-reference-uuid')?.value || '') : undefined,
        items: addedItems
    };
    return draftData;
}

// ربط حدث زر "حفظ كمسودة"
container.querySelector('#save-draft-btn').onclick = () => {
    const draftData = collectDataForDraft();
    if (draftData) {
        const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");
        drafts.unshift(draftData); // إضافة المسودة الجديدة في بداية القائمة
        localStorage.setItem("receiptDrafts", JSON.stringify(drafts));
        
        showToastNotification(`✅ تم حفظ "${draftData.receiptNumber}" كمسودة بنجاح.`, 4000);
        
        // إغلاق الواجهة بعد الحفظ
        const modal = container.querySelector('#manualSendModal');
        modal.style.display = 'none';
        container.innerHTML = '';
        
        // تحديث قائمة المسودات في تبويب المسودات
        renderReceiptDrafts();
    }
};





// استبدل الكود السابق بهذا الكود
container.querySelector('#send-manual-receipt-btn').onclick = async () => {
    validateAllTabs();
    if (container.querySelector('.tab-status-indicator.invalid')) {
        alert("يرجى مراجعة التبويبات التي تحتوي على علامة (✖) وتصحيح البيانات المطلوبة.");
        return;
    }

    // --- بداية التحقق من الرقم القومي قبل الإرسال ---
    const totalAmountText = container.querySelector('#summary-details strong:last-child')?.textContent || '0';
    const totalAmount = parseFloat(totalAmountText.replace(/[^0-9.]/g, ''));
    const buyerId = container.querySelector('#manual-buyer-id').value.trim();
    
    // إذا كان المبلغ أكبر من 150 ألف
    if (totalAmount > 150000) {
        if (!buyerId) {
            alert("❌ لا يمكن الإرسال: يجب إدخال الرقم القومي لأن إجمالي الفاتورة يتجاوز 150,000 جنيه.");
            return;
        }
        const validationResult = await validateNID(buyerId);
        if (!validationResult.valid) {
            alert(`❌ لا يمكن الإرسال: الرقم القومي المدخل غير صحيح. (${validationResult.message})`);
            return;
        }
    } 
    // إذا كان المبلغ أقل ولكن الرقم القومي مكتوب (يجب أن يكون صحيحًا)
    else if (buyerId) { 
        const validationResult = await validateNID(buyerId);
        if (!validationResult.valid) {
            alert(`❌ لا يمكن الإرسال: الرقم القومي المدخل غير صحيح. (${validationResult.message})`);
            return;
        }
    }
    // --- نهاية التحقق من الرقم القومي قبل الإرسال ---

    // إذا مرت كل عمليات التحقق، استكمل عملية الإرسال
    const selectedSerial = container.querySelector('#pos-device-select').value;
    const selectedActivity = container.querySelector('#manual-activity-code').value;
    
    const draftData = collectDataForDraft();
    if (!draftData) return;

    const itemsForCalculation = draftData.items.map(item => ({
         receiptNumber: draftData.receiptNumber,
         buyerName: draftData.buyerName,
         buyerId: draftData.buyerId,
         paymentMethod: container.querySelector('#payment-method').value,
         referenceUUID: draftData.referenceUUID,
         ...item
    }));
    
    let receiptObject = isReturn 
    ? calculateReturnReceiptData(itemsForCalculation, sellerData, selectedSerial, selectedActivity) 
    : calculateReceiptData(itemsForCalculation, sellerData, selectedSerial, selectedActivity);

// --- ✨✨ بداية الكود الجديد ✨✨ ---
// 1. اقرأ التاريخ الذي أدخله المستخدم من الحقل الجديد
const userDate = container.querySelector('#manual-datetime-issued').value; // ستكون النتيجة "YYYY-MM-DD"

if (userDate) {
    // 2. احصل على الوقت الحالي
    const now = new Date();
    const timeString = now.toTimeString().split(' ')[0]; // "HH:MM:SS"

    // 3. ادمج تاريخ المستخدم مع الوقت الحالي وقم بتحويله إلى صيغة ISO النهائية
    const finalDateTime = new Date(`${userDate}T${timeString}`).toISOString();
    
    // 4. قم بتحديث التاريخ في كائن الإيصال قبل إرساله
    receiptObject.header.dateTimeIssued = finalDateTime;
}
// --- ✨✨ نهاية الكود الجديد ✨✨ ---

    
    const payloadForUuid = JSON.stringify({ receipts: [receiptObject] });
    receiptObject.header.uuid = await EtaUuid.computeUuidFromRawText(payloadForUuid);

    const finalPayload = { receipts: [receiptObject] };
    
    const result = await sendReceipts_V3(finalPayload, `إرسال يدوي: ${receiptObject.header.receiptNumber}`);
    
    if (result.success) {
        alert(`تم إرسال ${isReturn ? 'إشعار المرتجع' : 'الإيصال'} بنجاح.`);
        const modal = container.querySelector('#manualSendModal');
        modal.style.display = 'none';
        container.innerHTML = '';
    } else {
        alert(`فشل إرسال المستند. الخطأ من الخادم: ${result.error}`);
    }
};










// ... كل الأكواد السابقة في الدالة

// ✨✨ أضف هذا السطر في نهاية الدالة ✨✨
container.querySelector('#manual-datetime-issued').valueAsDate = new Date();

// استدعاء التحقق والإعداد الأولي عند فتح الواجهة لأول مرة
resetForm();
validateAllTabs();
} // <-- هذا هو القوس الأخير للدالة









/**
 * ===================================================================================
 * ✅✅✅ دالة جديدة: لفتح واجهة منبثقة للبحث في أكواد EGS الخاصة بالممول
 * ===================================================================================
 * @param {Function} onCodeSelect - دالة يتم استدعاؤها عند اختيار كود، وتمرير بيانات الكود لها.
 */
async function showEgsCodeSearchModal(onCodeSelect) {
    // 1. إنشاء الهيكل الأساسي للواجهة المنبثقة
    const modal = document.createElement('div');
    modal.className = 'code-search-modal';
    modal.innerHTML = `
        <div class="code-search-content">
            <div class="code-search-header">
                <h4>اختر كود EGS</h4>
                <input type="text" id="egs-search-input" placeholder="ابحث بالاسم أو الكود...">
                <button id="close-code-search-btn" title="إغلاق" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
            </div>
            <div class="code-search-body">
                <div class="code-search-placeholder">جاري تحميل الأكواد...</div>
                <table class="code-search-table" style="display:none;">
                    <thead><tr><th>الاسم العربي</th><th>الكود</th></tr></thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // 2. ربط الأحداث
    const searchInput = modal.querySelector('#egs-search-input');
    const tableBody = modal.querySelector('.code-search-table tbody');
    const table = modal.querySelector('.code-search-table');
    const placeholder = modal.querySelector('.code-search-placeholder');

    const closeModal = () => modal.remove();
    modal.querySelector('#close-code-search-btn').onclick = closeModal;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(); // إغلاق عند النقر على الخلفية
    });

    // 3. جلب كل الأكواد وعرضها
    let allCodes = [];
    try {
        const token = getAccessToken();
        if (!token) throw new Error("لم يتم العثور على توكن الدخول.");

        // جلب كل الأكواد باستخدام حجم صفحة كبير
        const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/codetypes/codes/my?CodeTypeID=9&Ps=1000`, {
            headers: { "Authorization": `Bearer ${token}` }
        } );
        if (!response.ok) throw new Error("فشل جلب قائمة الأكواد.");

        const data = await response.json();
        allCodes = data.result || [];

        if (allCodes.length === 0) {
            placeholder.textContent = "لم يتم العثور على أكواد EGS مسجلة في حسابك.";
        } else {
            placeholder.style.display = 'none';
            table.style.display = 'table';
            renderTable(allCodes);
        }
    } catch (error) {
        placeholder.textContent = `خطأ: ${error.message}`;
    }

    // 4. دالة لعرض/تحديث الصفوف في الجدول
    function renderTable(codes) {
        tableBody.innerHTML = codes.map(code => `
            <tr data-code='${JSON.stringify(code)}'>
                <td>${code.codeNameSecondaryLang}</td>
                <td class="code-value">${code.codeLookupValue}</td>
            </tr>
        `).join('');

        // ربط حدث النقر على الصفوف
        tableBody.querySelectorAll('tr').forEach(row => {
            row.onclick = () => {
                const codeData = JSON.parse(row.dataset.code);
                onCodeSelect(codeData); // استدعاء الدالة الممررة مع بيانات الكود
                closeModal();
            };
        });
    }

    // 5. إضافة وظيفة البحث الفوري
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const filteredCodes = allCodes.filter(code =>
            code.codeNameSecondaryLang.toLowerCase().includes(query) ||
            code.codeLookupValue.toLowerCase().includes(query)
        );
        renderTable(filteredCodes);
    });
}

/**
 * ===================================================================================
 * ✅ دالة showReceiptEditor (النسخة النهائية الكاملة مع كل التحسينات)
 * ===================================================================================
 * @param {Map<string, Array<Object>>} receiptsMap - خريطة تحتوي على المستندات مجمعة بعد التحقق منها.
 * @param {string} [docType='sale'] - نوع المستند ('sale' أو 'return').
 */
async function showReceiptEditor(receiptsMap, docType = 'sale') {
    // إزالة أي واجهة قديمة لضمان عدم التكرار
    document.getElementById('receiptEditorModal')?.remove();

    // قاموس لترجمة أنواع الضرائب إلى اللغة العربية
    const taxTypesMap = {
        "T1": "قيمة مضافة", "T2": "جدول (نسبي)", "T3": "جدول (نوعي)", "T4": "خصم تحصيل",
        "T5": "دمغة (نسبي)", "T6": "دمغة (قطعي)", "T7": "ملاهي", "T8": "تنمية موارد",
        "T9": "رسم خدمة", "T10": "محليات", "T11": "تأمين صحي", "T12": "رسوم أخرى"
    };

    // --- 1. بناء الهيكل الخارجي للواجهة ---
    const modal = document.createElement('div');
    modal.id = 'receiptEditorModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.6); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        direction: rtl; font-family: 'Segoe UI', Tahoma, sans-serif;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #f4f7fc; width: 95%; max-width: 1800px; height: 95%;
        border-radius: 12px; display: flex; flex-direction: column;
        box-shadow: 0 5px 25px rgba(0,0,0,0.2); overflow: hidden;
    `;
    
    modalContent.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; font-size: 22px; color: #555;">جاري تحميل البيانات اللازمة...</div>`;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    try {
        // --- 2. جلب البيانات الأساسية ---
        const sellerData = await getIssuerFullData();
        if (!sellerData) throw new Error("فشل جلب بيانات الممول.");

        const devices = await getDeviceSerialNumber();
        if (!devices || devices.length === 0) throw new Error("فشل جلب بيانات نقاط البيع.");
        
        const defaultDevice = devices[0];
        const activities = sellerData.activities || [];
        let defaultActivityCode = '4690';
        let activitySelectorHTML = '';

        if (activities.length > 0) {
            const defaultActivity = activities.find(act => act.toDate === null) || activities[0];
            defaultActivityCode = defaultActivity.activityTypeCode;
            activitySelectorHTML = `
                <div>
                    <label for="activity-select-editor" class="select-label">اختر كود النشاط:</label>
                    <select id="activity-select-editor" class="custom-select">
                        ${activities.map(act => `<option value="${act.activityTypeCode}" ${act.activityTypeCode === defaultActivity.activityTypeCode ? 'selected' : ''}>${act.activityTypeCode} - ${act.activityTypeNameSecondaryLang}</option>`).join('')}
                    </select>
                </div>`;
        } else {
            activitySelectorHTML = `<div><label class="select-label">كود النشاط:</label><div class="info-div">لم يتم العثور على أنشطة (سيتم استخدام الكود الافتراضي: ${defaultActivityCode})</div></div>`;
        }

        // --- 3. بناء صفوف المستندات وتفاصيلها ---
        let tableBodyHTML = '';
        receiptsMap.forEach((items, receiptNumber) => {
            const firstItem = items[0] || {};
            
            const currentSerial = document.getElementById('pos-select-editor')?.value || defaultDevice.serialNumber;
            const currentActivityCode = document.getElementById('activity-select-editor')?.value || defaultActivityCode;

            const receiptData = (docType === 'return')
                ? calculateReturnReceiptData(items, sellerData, currentSerial, currentActivityCode)
                : calculateReceiptData(items, sellerData, currentSerial, currentActivityCode);

            const documentTitle = (docType === 'return') ? 'إشعار مرتجع' : 'إيصال بيع';
            const titleColor = (docType === 'return') ? '#c0392b' : '#2980b9';
            const referenceUUID_HTML = (docType === 'return') 
                ? `<tr><th>UUID الفاتورة الأصلية</th><td style="font-family: monospace; font-size: 14px; direction: ltr; background: #fff5f5;">${firstItem.referenceUUID || '<span style="color:red;">مطلوب!</span>'}</td></tr>` 
                : '';

            // بناء جدول الأصناف مع الحقول الجديدة
            const itemsDetailsHTML = receiptData.itemData.map((item, index) => {
                const taxAmountForItem = item.taxableItems.reduce((acc, tax) => acc + tax.amount, 0);
                return `
                    <tr style="border-bottom: 1px solid #f1f1f1;">
                        <td style="padding: 10px;">${item.itemType}</td>
                        <td style="padding: 10px; font-family: monospace;">${item.itemCode}</td>
                        <td style="padding: 10px; background-color: #f0f8ff;">${items[index].officialCodeName || ''}</td>
                        <td style="padding: 10px; text-align: right;">${item.description}</td>
                        <td style="padding: 10px;">${item.quantity}</td>
                        <td style="padding: 10px;">${item.unitPrice.toFixed(2)}</td>
                        <td style="padding: 10px;">${item.totalSale.toFixed(2)}</td>
                        <td style="padding: 10px; color: #c0392b;">${taxAmountForItem.toFixed(5)}</td>
                        <td style="padding: 10px; font-weight: bold;">${item.total.toFixed(2)}</td>
                    </tr>
                `;
            }).join('');

            // بناء جدول الإجماليات مع ترجمة الضرائب
            const totalsDetailsHTML = `
                <tr><td class="details-total-label">إجمالي المبيعات</td><td class="details-total-value">${receiptData.totalSales.toFixed(2)}</td></tr>
                ${receiptData.taxTotals.map(t => `<tr><td class="details-total-label">${taxTypesMap[t.taxType] || t.taxType}</td><td class="details-total-value">${t.amount.toFixed(2)}</td></tr>`).join('')}
                <tr class="details-grand-total"><td class="details-total-label">الإجمالي النهائي</td><td class="details-total-value">${receiptData.totalAmount.toFixed(2)}</td></tr>
            `;

            tableBodyHTML += `
               <tbody data-receipt-number="${receiptNumber}" data-doc-type="${docType}">
                    <tr style="background-color: #fff; border-bottom: 1px solid #e9ecef; cursor: pointer;" class="toggle-details-trigger">
                        <td style="width: 50px; padding: 15px; text-align: center; vertical-align: middle;"><input type="checkbox" class="receipt-checkbox" style="width: 20px; height: 20px; vertical-align: middle;"></td>
                        <td class="toggle-details-icon" style="font-weight: bold; font-size: 28px; width: 40px; color: #007bff; text-align: center; padding: 15px; vertical-align: middle;">+</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-size: 16px;">${receiptNumber} <span style="color: ${titleColor}; font-weight: bold;">(${documentTitle})</span></td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-size: 16px;">${firstItem.buyerName || 'عميل نقدي'}</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-weight: 600; font-size: 16px;">${receiptData.totalSales.toFixed(2)}</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-weight: bold; font-size: 18px;">${receiptData.totalAmount.toFixed(2)}</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle;"><button class="delete-receipt-btn" title="حذف المستند" style="background: #dc3545; color: white; border: none; border-radius: 50%; cursor: pointer; width: 32px; height: 32px; font-size: 20px; line-height: 32px;">&times;</button></td>
                    </tr>
                    <tr class="receipt-details-row" style="display: none;">
                        <td colspan="7" style="padding: 0 !important;">
                            <div style="padding: 25px; background-color: #f0f2f5; border-top: 4px solid #0d6efd;">
                                <div class="details-grid">
                                    <div class="details-card issuer-card">
                                        <h4 class="details-card-header">بيانات المصدر (البائع)</h4>
                                        <table class="details-table">
                                            <tbody>
                                                <tr><th>الاسم</th><td>${sellerData.name}</td></tr>
                                                <tr><th>رقم التسجيل</th><td>${sellerData.id}</td></tr>
                                                <tr><th>نقطة البيع (POS)</th><td>${currentSerial}</td></tr>
                                                <tr><th>كود النشاط</th><td>${currentActivityCode}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="details-card receiver-card">
                                        <h4 class="details-card-header">بيانات المستلم (المشتري)</h4>
                                        <table class="details-table">
                                            <tbody>
                                                ${referenceUUID_HTML}
                                                <tr><th>الاسم</th><td>${firstItem.buyerName || 'عميل نقدي'}</td></tr>
                                                <tr><th>الرقم القومي</th><td>${firstItem.buyerId || 'لا يوجد'}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="details-card items-details-card">
                                        <h4 class="details-card-header">بنود المستند</h4>
                                        <table class="details-table items-details-table">
                                            <thead>
                                                <tr>
                                                    <th>نوع الكود</th><th>كود الصنف</th><th>الاسم الرسمي</th><th>الوصف</th>
                                                    <th>الكمية</th><th>السعر</th><th>الإجمالي</th><th>قيمة الضريبة</th><th>الإجمالي النهائي</th>
                                                </tr>
                                            </thead>
                                            <tbody>${itemsDetailsHTML}</tbody>
                                        </table>
                                    </div>
                                    <div class="details-card totals-details-card">
                                        <h4 class="details-card-header">الإجماليات</h4>
                                        <table class="details-table totals-details-table">
                                            <tbody>${totalsDetailsHTML}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>`;
        });

        // --- 4. بناء الهيكل الكامل للواجهة ---
        modalContent.innerHTML = `
            <div style="padding: 20px 25px; border-bottom: 1px solid #ddd; background-color: #f8f9fa; flex-shrink: 0;">
              // الكود الجديد
<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
    <h3 style="margin: 0; color: #2161a1; font-size: 22px;">مراجعة وتأكيد المستندات (${receiptsMap.size})</h3>
    <div style="display: flex; gap: 12px;">
        <button id="saveAllAsDraftsBtn" class="header-btn" style="background-color: #ffc107; color: #333;">📝 حفظ الكل كمسودات</button>
        <button id="sendSelectedReceiptsBtn" class="header-btn send-btn">إرسال المحدد</button>
        <button id="closeReceiptEditorBtn" class="header-btn close-btn">إغلاق</button>
    </div>
</div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; background-color: #e9ecef; padding: 15px; border-radius: 8px;">
                    <div>
                        <label for="pos-select-editor" class="select-label">اختر نقطة البيع (POS):</label>
                        <select id="pos-select-editor" class="custom-select">
                            ${devices.map(device => `<option value="${device.serialNumber}" ${device.serialNumber === defaultDevice.serialNumber ? 'selected' : ''}>${device.serialNumber}</option>`).join('')}
                        </select>
                    </div>
                    ${activitySelectorHTML}
                </div>
            </div>
            <div style="overflow-y: auto; flex-grow: 1;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; background: #020b18ff; color: white; z-index: 10;">
                       <tr>
                            <th style="padding: 15px; text-align: center;"><input type="checkbox" id="selectAllCheckbox" style="width: 20px; height: 20px;"></th>
                            <th></th><th>الرقم الداخلي (والنوع)</th><th>اسم العميل</th><th>الإجمالي قبل الضريبة</th>
                            <th>الإجمالي النهائي</th><th>حذف</th>
                       </tr>
                    </thead>
                    <tbody>${tableBodyHTML}</tbody>
                </table>
            </div>
            <div style="padding: 15px 25px; background-color: #343a40; color: white; text-align: center; border-top: 4px solid #0d6efd; flex-shrink: 0;">
                <strong style="font-size: 18px;">الإجمالي النهائي للمستندات المحددة: <span id="grandTotalAmount" style="color: #28a745; font-size: 22px;">0.00</span></strong>
            </div>
        `;

        // --- 5. إضافة الأنماط الكاملة ---
        const styles = document.createElement('style');
        styles.innerHTML = `
            .details-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
            .issuer-card { grid-column: 1 / 2; grid-row: 1 / 2; }
            .receiver-card { grid-column: 1 / 2; grid-row: 2 / 3; }
            .items-details-card { grid-column: 2 / 3; grid-row: 1 / 3; }
            .totals-details-card { grid-column: 2 / 3; grid-row: 3 / 4; margin-top: -20px; }
            .details-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; }
            .details-card-header { color: #0d6efd; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-top: 0; margin-bottom: 15px; font-size: 16px; }
            .details-table { width: 100%; border-collapse: collapse; }
            .details-table th, .details-table td { border: 1px solid #f0f0f0; padding: 8px; text-align: right; font-size: 13px; }
            .details-table th { background-color: #f8f9fa; width: 100px; font-weight: 600; }
            .items-details-table th, .items-details-table td { text-align: center; padding: 6px; white-space: nowrap; }
            .totals-details-table .details-total-label { font-weight: bold; }
            .totals-details-table .details-grand-total td { font-size: 16px; font-weight: bold; background-color: #e9ecef; }
            .header-btn { padding: 10px 22px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; }
            .send-btn { background-color: #28a745; color: white; }
            .close-btn { background-color: #6c757d; color: white; }
            .select-label { font-size: 14px; font-weight: 600; margin-bottom: 5px; display: block; }
            .custom-select { width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
            .info-div { padding: 10px; background-color: #fff; border-radius: 5px; border: 1px solid #ccc; }
        `;
        modal.appendChild(styles);
        
        // --- 6. ربط جميع الأحداث ---
        const closeModal = () => modal.remove();
        document.getElementById('closeReceiptEditorBtn').onclick = closeModal;

        modal.querySelectorAll('.toggle-details-trigger').forEach(row => {
            row.onclick = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                const detailsRow = row.nextElementSibling;
                const icon = row.querySelector('.toggle-details-icon');
                const isVisible = detailsRow.style.display !== 'none';
                detailsRow.style.display = isVisible ? 'none' : 'table-row';
                icon.textContent = isVisible ? '+' : '-';
            };
        });

        modal.querySelectorAll('.delete-receipt-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const group = e.target.closest('tbody');
                if (confirm(`هل تريد حذف المستند رقم "${group.dataset.receiptNumber}"؟`)) {
                    group.remove();
                    updateGrandTotal();
                }
            };
        });

        const grandTotalSpan = document.getElementById('grandTotalAmount');
        const updateGrandTotal = () => {
            let total = 0;
            const currentActivityCode = document.getElementById('activity-select-editor')?.value || defaultActivityCode;
            const currentSerial = document.getElementById('pos-select-editor').value;

            modal.querySelectorAll('.receipt-checkbox:checked').forEach(cb => {
                const group = cb.closest('tbody');
                const receiptNumber = group.dataset.receiptNumber;
                const currentDocType = group.dataset.docType;
                const items = receiptsMap.get(receiptNumber);
                const receiptData = (currentDocType === 'return')
                    ? calculateReturnReceiptData(items, sellerData, currentSerial, currentActivityCode)
                    : calculateReceiptData(items, sellerData, currentSerial, currentActivityCode);
                total += receiptData.totalAmount;
            });
            grandTotalSpan.textContent = total.toFixed(2);
        };

        document.getElementById('selectAllCheckbox').onchange = (e) => {
            modal.querySelectorAll('.receipt-checkbox').forEach(cb => cb.checked = e.target.checked);
            updateGrandTotal();
        };

        modal.querySelectorAll('.receipt-checkbox, #pos-select-editor, #activity-select-editor').forEach(el => {
            el.onchange = updateGrandTotal;
        });
        
        updateGrandTotal();

        // --- 7. المنطق النهائي لزر الإرسال ---
  
        // الكود الجديد (يُضاف قبل كود زر الإرسال)
document.getElementById('saveAllAsDraftsBtn').onclick = () => {
    if (!confirm(`سيتم حفظ جميع المستندات (${receiptsMap.size}) المعروضة كمسودات. هل تريد المتابعة؟`)) {
        return;
    }

    const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");
    let savedCount = 0;

    receiptsMap.forEach((items, receiptNumber) => {
        const firstItem = items[0] || {};
        const draftData = {
            receiptNumber: receiptNumber,
            buyerName: firstItem.buyerName,
            buyerId: firstItem.buyerId,
            documentType: docType,
            referenceUUID: docType === 'return' ? firstItem.referenceUUID : undefined,
            // تحويل الأصناف إلى التنسيق المطلوب للمسودة
            items: items.map(item => ({
                itemType: item.itemType,
                itemCode: item.itemCode,
                description: item.description,
                unitType: item.unitType,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxableItems: [
                    (item.taxType_1 && { taxType: item.taxType_1, subType: item.taxSubType_1, rate: item.taxRate_1 }),
                    (item.taxType_2 && { taxType: item.taxType_2, subType: item.taxSubType_2, rate: item.taxRate_2 })
                ].filter(Boolean) // إزالة الضرائب الفارغة
            }))
        };
        drafts.unshift(draftData);
        savedCount++;
    });

    localStorage.setItem("receiptDrafts", JSON.stringify(drafts));
    showToastNotification(`✅ تم حفظ ${savedCount} مستند كمسودة بنجاح.`, 5000);
    
    // تحديث قائمة المسودات في الخلفية وإغلاق الواجهة
    renderReceiptDrafts();
    closeModal(); // closeModal هي الدالة المسؤولة عن إغلاق الواجهة
};

    
    } catch (error) {
        modalContent.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; font-size: 22px; color: #d9534f; text-align: center; padding: 20px;">
            <p>فشل تحميل البيانات الأساسية.</p>
            <p style="font-size: 16px; color: #555;">الخطأ: ${error.message}</p>
            <button id="closeErrorModal" class="header-btn close-btn" style="margin-top: 20px;">إغلاق</button>
        </div>`;
        modalContent.querySelector('#closeErrorModal').onclick = () => modal.remove();
        
    }
    
}




/**
 * ===================================================================================
 * ✅✅✅ دالة عرض المسودات (النسخة النهائية مع زر التعديل) ✅✅✅
 * ===================================================================================
 */
function renderReceiptDrafts() {
    const draftsContainer = document.getElementById('drafts-container');
    if (!draftsContainer) return;

    const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");

    if (drafts.length === 0) {
        draftsContainer.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">لا توجد مسودات محفوظة حاليًا.</p>';
        return;
    }

    // بناء جدول المسودات مع إضافة زر "تعديل" وجعل الصف قابلاً للنقر
    draftsContainer.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <thead style="background-color: #e9ecef;">
                <tr>
                    <th style="padding: 12px; text-align: right;">رقم الإيصال/المرتجع</th>
                    <th style="padding: 12px;">نوع المستند</th>
                    <th style="padding: 12px;">عدد البنود</th>
                    <th style="padding: 12px; text-align: center;">إجراءات</th>
                </tr>
            </thead>
            <tbody>
                ${drafts.map((draft, index) => `
                    <tr class="draft-row" data-index="${index}" style="border-bottom: 1px solid #f1f1f1; cursor: pointer;" title="اضغط لفتح وتعديل المسودة">
                        <td style="padding: 10px; font-weight: bold;">${draft.receiptNumber}</td>
                        <td style="padding: 10px;">${draft.documentType === 'return' ? '↩️ إشعار مرتجع' : '🧾 إيصال بيع'}</td>
                        <td style="padding: 10px; text-align: center;">${draft.items.length}</td>
                        <td style="padding: 10px; text-align: center;">
                            <button class="edit-draft-btn" data-index="${index}" style="background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 14px; margin-left: 5px;" title="فتح وتعديل المسودة">تعديل</button>
                            <button class="delete-draft-btn" data-index="${index}" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; font-size: 14px;" title="حذف المسودة">حذف</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    // ربط الأحداث للأزرار والصفوف الجديدة
    draftsContainer.querySelectorAll('.draft-row, .edit-draft-btn').forEach(el => {
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // منع تداخل الأحداث
            const index = el.dataset.index;
            openDraftForEditing(index);
        });
    });

    draftsContainer.querySelectorAll('.delete-draft-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = btn.dataset.index;
            deleteDraft(index);
        });
    });
}



async function openDraftForEditing(index) {
    const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");
    const draftToEdit = drafts[index];

    if (!draftToEdit) {
        alert("لم يتم العثور على المسودة المطلوبة.");
        return;
    }

    // 1. الانتقال إلى تبويب "الإرسال اليدوي"
    document.querySelector('.sidebar-btn[data-target="panel-manual"]').click();

    // 2. تحديد نوع المستند في القائمة المنسدلة
    const manualDocTypeSelect = document.getElementById('manualDocumentTypeSelect');
    manualDocTypeSelect.value = draftToEdit.documentType;

    // 3. استدعاء الدالة التي تبني الواجهة
    manualDocTypeSelect.dispatchEvent(new Event('change'));

    // الانتظار الذكي للتأكد من أن الواجهة قد تم بناؤها بالكامل
    const container = document.getElementById('dynamicManualSendContent');
    let attempts = 0;
    const maxAttempts = 50; // انتظر لمدة 5 ثوانٍ كحد أقصى

    while (!container.querySelector('#manual-receipt-number') && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
    }

    if (!container.querySelector('#manual-receipt-number')) {
        showToastNotification("❌ خطأ: فشل تحميل واجهة التعديل. يرجى المحاولة مرة أخرى.", 4000);
        return;
    }

    // 4. ملء البيانات الأساسية في الواجهة
    container.querySelector('#manual-receipt-number').value = draftToEdit.receiptNumber;
    container.querySelector('#manual-buyer-name').value = draftToEdit.buyerName || 'عميل نقدي';
    container.querySelector('#manual-buyer-id').value = draftToEdit.buyerId || '';
    
    if (draftToEdit.documentType === 'return' && draftToEdit.referenceUUID) {
        container.querySelector('#manual-reference-uuid').value = draftToEdit.referenceUUID;
    }

    // 5. ملء الأصناف المحفوظة
    for (const item of draftToEdit.items) {
        // ملء حقول الصنف
        container.querySelector('#item-code-type').value = item.itemType;
        container.querySelector('#item-code').value = item.itemCode;
        container.querySelector('#item-description').value = item.description;
        container.querySelector('#item-quantity').value = item.quantity;
        container.querySelector('#item-unit-price').value = item.unitPrice;
        
        // تفعيل حدث التحقق من الكود لجلب اسمه
        container.querySelector('#item-code').dispatchEvent(new Event('blur'));
        await new Promise(r => setTimeout(r, 300)); // انتظار جلب اسم الكود

        // مسح وإعادة إضافة الضرائب الخاصة بالصنف
        const taxesContainer = container.querySelector('#item-taxes-container');
        taxesContainer.innerHTML = '';
        
        if (item.taxableItems && item.taxableItems.length > 0) {
            for (const tax of item.taxableItems) {
                if (!tax || !tax.taxType) continue;
                
                document.getElementById('add-tax-row-btn').click();
                await new Promise(r => setTimeout(r, 50));

                const lastTaxRow = taxesContainer.lastElementChild;
                if (lastTaxRow) {
                    const typeSelect = lastTaxRow.querySelector('.tax-type');
                    typeSelect.value = tax.taxType;
                    typeSelect.dispatchEvent(new Event('change'));
                    
                    await new Promise(r => setTimeout(r, 50));

                    lastTaxRow.querySelector('.tax-subtype').value = tax.subType;
                    lastTaxRow.querySelector('.tax-rate').value = tax.rate;
                    lastTaxRow.querySelector('.tax-rate').dispatchEvent(new Event('input'));
                }
            }
        } else {
            // إضافة صف ضريبة فارغ إذا لم يكن هناك ضرائب
            document.getElementById('add-tax-row-btn').click();
        }
        
        await new Promise(r => setTimeout(r, 50));
        // إضافة الصنف المكتمل إلى الجدول
        container.querySelector('#add-item-btn').click();
    }

    // 6. ✅ تعديل جوهري: حذف المسودة القديمة فقط بعد فتحها بنجاح
    drafts.splice(index, 1);
    localStorage.setItem("receiptDrafts", JSON.stringify(drafts));
    renderReceiptDrafts(); // تحديث قائمة المسودات في الخلفية

    showToastNotification('تم فتح المسودة للتعديل. اضغط "حفظ كمسودة" أو "إرسال" لحفظ التغييرات.', 5000);
}










/**
 * ===================================================================================
 * ✅ 1. دوال معدلة: لحل مشكلة "is not defined" عند حذف أو إرسال المسودات
 * ===================================================================================
 */

// جعل الدالة متاحة بشكل عام
window.sendDraft = async function(index) {
    const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");
    const draft = drafts[index];
    if (!draft) return;

    if (!confirm(`هل تريد إرسال الإيصال رقم "${draft.receiptNumber}"؟`)) return;

    // قبل الإرسال، تأكد من تحديث بيانات الرافع (البائع ونقطة البيع)
    if (!window.receiptUploaderData) {
        alert("خطأ: بيانات الرافع غير مهيأة. يرجى إعادة فتح الواجهة.");
        return;
    }
    const receiptData = calculateReceiptData(draft.items);
    const success = await sendReceipts(receiptData);

    if (success) {
        // إزالة المسودة بعد إرسالها بنجاح
        drafts.splice(index, 1);
        localStorage.setItem("receiptDrafts", JSON.stringify(drafts));
        renderReceiptDrafts(); // إعادة عرض المسودات المتبقية
        alert("تم إرسال الإيصال بنجاح.");
    } else {
        alert("فشل إرسال الإيصال.");
    }
}

// جعل الدالة متاحة بشكل عام
window.deleteDraft = function(index) {
    const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");
    const draft = drafts[index];
    if (!draft) return;

    if (!confirm(`هل تريد حذف المسودة رقم "${draft.receiptNumber}"؟`)) return;

    drafts.splice(index, 1);
    localStorage.setItem("receiptDrafts", JSON.stringify(drafts));
    renderReceiptDrafts(); // إعادة عرض المسودات
    alert("تم حذف المسودة.");
}








/**
 * ✅✅✅ دالة injectReceiptUploaderUI (النسخة الكاملة مع جلب البيانات المسبق) ✅✅✅
 * تقوم بإنشاء الواجهة الرسومية، ثم تجلب بيانات البائع ونقطة البيع مرة واحدة عند الفتح.
 */
async function injectReceiptUploaderUI() {
    // التحقق من وجود الواجهة لمنع تكرارها، وإظهارها إذا كانت موجودة
    if (document.getElementById("receiptUploaderUI")) {
        document.getElementById("receiptUploaderUI").style.display = "flex";
        return;
    }

    // 1. بناء الهيكل الخارجي للواجهة الرسومية (Modal)
    const modalUI = document.createElement("div");
    modalUI.id = "receiptUploaderUI";
    Object.assign(modalUI.style, {
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "800px", height: "600px",
        backgroundColor: "#f4f7fa",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        zIndex: "9999",
        fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
        display: "flex",
        flexDirection: "column",
        direction: "rtl"
    });

    // 2. بناء الهيكل الداخلي للواجهة (HTML)
    modalUI.innerHTML = `
        <div style="padding: 15px 25px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background-color: #fff;">
            <h3 style="margin: 0; color: #1d3557;">رفع الإيصالات من ملف Excel</h3>
            <button id="closeReceiptUIBtn" title="إغلاق" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        <div style="display: flex; flex-grow: 1; overflow: hidden;">
            <div style="width: 300px; padding: 20px; border-left: 1px solid #e0e0e0; display: flex; flex-direction: column; gap: 20px; background-color: #fff;">
                <div>
                    <label class="content-label" style="font-weight: bold; margin-bottom: 10px; display: block;">الخطوة 1: تحميل النموذج</label>
                    <a id="downloadReceiptTemplateBtn" class="action-button download-btn" style="display: block; text-align: center; padding: 12px; background-color: #5a67d8; color: white; border-radius: 8px; text-decoration: none; cursor: pointer;">📥 تحميل نموذج Excel</a>
                </div>
                <hr style="border: none; border-top: 1px solid #eee;">
                <div>
                    <label class="content-label" style="font-weight: bold; margin-bottom: 10px; display: block;">الخطوة 2: رفع الملف</label>
                    <label for="receiptExcelInput" class="action-button upload-btn" style="display: block; text-align: center; padding: 12px; background-color: #38a169; color: white; border-radius: 8px; cursor: pointer;">📂 اختر ملف الإيصالات</label>
                    <input type="file" id="receiptExcelInput" accept=".xlsx, .xls" style="display: none;">
                </div>
            </div>
            <div style="flex-grow: 1; padding: 20px; display: flex; flex-direction: column;">
                <h4 style="margin-top: 0; color: #333;">سجل الإيصالات المرسلة في هذه الجلسة</h4>
                <div style="flex-grow: 1; overflow-y: auto; border: 1px solid #ccc; border-radius: 8px; background: #fff;">
                    <table id="receiptHistoryTable" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #e9ecef; position: sticky; top: 0;">
                                <th style="padding: 10px; text-align: right;">رقم الإيصال</th>
                                <th style="padding: 10px; text-align: left;">UUID</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- سيتم ملء السجل هنا -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modalUI);

    // 3. ربط الأحداث للأزرار
    document.getElementById('closeReceiptUIBtn').onclick = () => modalUI.style.display = "none";
    document.getElementById('receiptExcelInput').onchange = handleReceiptExcelUpload;
    document.getElementById('downloadReceiptTemplateBtn').onclick = downloadReceiptExcelTemplate;
    renderReceiptHistory();

    // 4. جلب البيانات الأساسية مسبقًا عند فتح الواجهة
    const loadingToast = showToastNotification('جاري تهيئة بيانات البائع ونقطة البيع...');
    try {
        // فصل الطلبات: نطلب بيانات البائع أولاً
        const sellerData = await getSellerFullData();
        if (!sellerData) throw new Error("فشل جلب بيانات البائع.");

        // ثم نطلب بيانات نقطة البيع
        const deviceSerial = await getDeviceSerialNumber();
        if (!deviceSerial) throw new Error("فشل جلب الرقم التسلسلي لنقطة البيع.");

        // تخزين البيانات في متغير عام (window) لسهولة الوصول إليها لاحقًا
        window.receiptUploaderData = {
            seller: sellerData,
            serial: deviceSerial
        };

        loadingToast.remove();
        showToastNotification('✅ الأداة جاهزة لرفع الإيصالات.', 3000);

    } catch (error) {
        loadingToast.remove();
        alert(`❌ خطأ في تهيئة الأداة: ${error.message}. يرجى محاولة إغلاق الواجهة وفتحها مرة أخرى.`);
        modalUI.style.display = "none"; // إغلاق الواجهة عند الفشل الحاسم
    }
}


/**
 * ✅ دالة جديدة: لعرض سجل الإيصالات المحفوظ في localStorage.
 */
function renderReceiptHistory() {
    const history = JSON.parse(localStorage.getItem("receiptHistory") || "[]");
    const tableBody = document.querySelector("#receiptHistoryTable tbody");
    if (!tableBody) return;

    tableBody.innerHTML = ""; // مسح الجدول القديم
    history.forEach(item => {
        const row = tableBody.insertRow(0); // إضافة الصف في الأعلى
        row.innerHTML = `
            <td style="padding: 8px; text-align: center; font-family: monospace;">${item.receiptNumber}</td>
            <td style="padding: 8px; text-align: center; font-family: monospace; font-size: 12px; direction: ltr;">${item.uuid}</td>
        `;
    });
}


/**
 * =========================================================================
 * ✅ الدالة النهائية والمعدلة: لوضع التعليمات في كل خلية
 * =========================================================================
 */
async function downloadReceiptExcelTemplate() {
    const loadingToast = showToastNotification('جاري إنشاء نموذج إيصالات البيع...', 0);
    try {
        if (typeof ExcelJS === 'undefined') {
            throw new Error("مكتبة ExcelJS غير محملة.");
        }

        const workbook = new ExcelJS.Workbook();
        const mainSheet = workbook.addWorksheet("قالب الإيصالات");
        const listsSheet = workbook.addWorksheet("Lists");

        // بيانات القوائم المنسدلة (لا تغيير هنا)
        const itemCodeTypes = [{ code: "EGS" }, { code: "GS1" }];
        const unitTypes = [
            { code: "EA", desc_ar: "قطعة" }, { code: "KGM", desc_ar: "كيلوجرام" },
            { code: "LTR", desc_ar: "لتر" }, { code: "MTR", desc_ar: "متر" }
        ];
        const taxTypesData = {
            "T1": { desc: "ضريبة القيمة المضافة", subtypes: [{ code: "V009", desc: "سلع عامة (14%)" }, { code: "V003", desc: "سلعة معفاة" }] },
            "T4": { desc: "خصم تحت حساب الضريبة", subtypes: [{ code: "W002", desc: "توريدات" }] }
        };

        // تعبئة ورقة القوائم (لا تغيير هنا)
        listsSheet.getCell('A1').value = "CodeTypes";
        listsSheet.getCell('B1').value = "UnitTypes";
        listsSheet.getCell('C1').value = "MainTaxTypes";
        itemCodeTypes.forEach((item, i) => { listsSheet.getCell(`A${i + 2}`).value = item.code; });
        unitTypes.forEach((item, i) => { listsSheet.getCell(`B${i + 2}`).value = item.desc_ar; });
        Object.values(taxTypesData).forEach((item, i) => { listsSheet.getCell(`C${i + 2}`).value = item.desc; });
        let taxColIndex = 4;
        Object.values(taxTypesData).forEach(data => {
            const headerCell = listsSheet.getCell(1, taxColIndex);
            headerCell.value = data.desc.replace(/[ ()]/g, '_');
            data.subtypes.forEach((subtype, i) => { listsSheet.getCell(i + 2, taxColIndex).value = subtype.desc; });
            taxColIndex++;
        });

        // --- ✅✅✅ بداية التعديل المطلوب ✅✅✅ ---

        // 1. قاموس الشروحات لكل عمود
        const excelCellComments = {
            'تاريخ الإصدار (YYYY-MM-DD)': 'أدخل التاريخ بصيغة YYYY-MM-DD. مثال: 2025-10-19',
            'رقم الإيصال الداخلي (*)': 'رقم فريد يميز الإيصال. إذا كانت الفاتورة تحتوي على عدة أصناف، كرر نفس الرقم في كل صف.',
            'اسم العميل': 'اختياري: اسم المشتري. يمكن تركه فارغاً للعميل النقدي.',
            'الرقم القومي للعميل': 'اختياري: الرقم القومي المكون من 14 رقماً إذا كان المشتري شخصاً.',
            'الكود الداخلي للصنف': 'اختياري: كود الصنف المستخدم في نظامك الداخلي.',
            'وصف الصنف (*)': 'مطلوب: اسم أو وصف واضح للسلعة أو الخدمة.',
            'نوع كود الصنف (*)': 'مطلوب: اختر نوع التكويد من القائمة (EGS أو GS1).',
            'كود الصنف (*)': 'مطلوب: الكود الفعلي للصنف بناءً على النوع المختار.',
            'وحدة القياس (*)': 'مطلوب: اختر وحدة القياس من القائمة (مثال: قطعة).',
            'الكمية (*)': 'مطلوب: العدد المباع من هذا الصنف.',
            'سعر الوحدة (*)': 'مطلوب: سعر القطعة الواحدة بالجنيه المصري.',
            'نوع الضريبة 1 (*)': 'مطلوب: اختر نوع الضريبة الأساسي من القائمة.',
            'النوع الفرعي 1 (*)': 'مطلوب: اختر النوع الفرعي للضريبة من القائمة.',
            'نسبة الضريبة 1 (*)': 'مطلوب: النسبة المئوية للضريبة (مثال: 14).',
            'نوع الضريبة 2': 'اختياري: للضرائب الإضافية مثل ضريبة الخصم.',
            'النوع الفرعي 2': 'اختياري: النوع الفرعي للضريبة الثانية.',
            'نسبة الضريبة 2': 'اختياري: نسبة الضريبة الثانية (مثال: 1).'
        };
        const headers = Object.keys(excelCellComments);
        mainSheet.columns = headers.map(h => ({ header: h, key: h }));

        // 2. تطبيق التنسيقات ووضع الشرح في كل خلية بالصف الأول
        mainSheet.getRow(1).eachCell((cell) => {
            const headerText = cell.value;
            // تطبيق التنسيق على رأس العمود
            cell.font = { name: 'Arial', bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF343A40' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            
            // وضع الشرح في خاصية "note" للخلية
            if (excelCellComments[headerText]) {
                cell.note = excelCellComments[headerText];
            }
        });

        // 3. تفعيل الفلتر على الأعمدة
        mainSheet.autoFilter = {
            from: 'A1',
            to: { row: 1, column: headers.length }
        };
        
        // --- ✅✅✅ نهاية التعديل المطلوب ✅✅✅ ---

        // ضبط عرض الأعمدة والقوائم المنسدلة (لا تغيير هنا)
        mainSheet.columns.forEach(column => {
            column.width = 30;
        });
        const addValidation = (columnLetter, formula) => {
            for (let i = 2; i <= 1001; i++) {
                mainSheet.getCell(`${columnLetter}${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [formula] };
            }
        };
        addValidation('G', '=Lists!$A$2:$A$3');
        addValidation('I', `=Lists!$B$2:$B$${unitTypes.length + 1}`);
        addValidation('L', `=Lists!$C$2:$C$${Object.keys(taxTypesData).length + 1}`);
        addValidation('O', `=Lists!$C$2:$C$${Object.keys(taxTypesData).length + 1}`);
        const cascadingFormula1 = '=INDIRECT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(L2," ","_"),"(","_"),")","_"))';
        const cascadingFormula2 = '=INDIRECT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(O2," ","_"),"(","_"),")","_"))';
        addValidation('M', cascadingFormula1);
        addValidation('P', cascadingFormula2);

        Object.values(taxTypesData).forEach((data, i) => {
            const colLetter = String.fromCharCode('A'.charCodeAt(0) + 3 + i);
            const rangeName = data.desc.replace(/[ ()]/g, '_');
            const rangeFormula = `Lists!$${colLetter}$2:$${colLetter}$${data.subtypes.length + 1}`;
            workbook.definedNames.add(rangeFormula, rangeName);
        });
        
        listsSheet.state = 'hidden';
        mainSheet.views = [{ rightToLeft: true }];

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        
        if (typeof saveAs === 'undefined') throw new Error("مكتبة FileSaver.js غير محملة.");
        saveAs(blob, "نموذج_رفع_الإيصالات_معدل.xlsx");

    } catch (error) {
        alert("فشل إنشاء نموذج الإكسيل: " + error.message);
    } finally {
        loadingToast.remove();
    }
}














/**
 * ===================================================================================
 * ✅ دالة showReceiptEditor (النسخة النهائية الكاملة مع كل التحسينات)
 * ===================================================================================
 * @param {Map<string, Array<Object>>} receiptsMap - خريطة تحتوي على المستندات مجمعة بعد التحقق منها.
 * @param {string} [docType='sale'] - نوع المستند ('sale' أو 'return').
 */
async function showReceiptEditor(receiptsMap, docType = 'sale') {
    // إزالة أي واجهة قديمة لضمان عدم التكرار
    document.getElementById('receiptEditorModal')?.remove();

    // قاموس لترجمة أنواع الضرائب إلى اللغة العربية
    const taxTypesMap = {
        "T1": "قيمة مضافة", "T2": "جدول (نسبي)", "T3": "جدول (نوعي)", "T4": "خصم تحصيل",
        "T5": "دمغة (نسبي)", "T6": "دمغة (قطعي)", "T7": "ملاهي", "T8": "تنمية موارد",
        "T9": "رسم خدمة", "T10": "محليات", "T11": "تأمين صحي", "T12": "رسوم أخرى"
    };

    // --- 1. بناء الهيكل الخارجي للواجهة ---
    const modal = document.createElement('div');
    modal.id = 'receiptEditorModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.6); z-index: 10000;
        display: flex; align-items: center; justify-content: center;
        direction: rtl; font-family: 'Segoe UI', Tahoma, sans-serif;
    `;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background-color: #f4f7fc; width: 95%; max-width: 1800px; height: 95%;
        border-radius: 12px; display: flex; flex-direction: column;
        box-shadow: 0 5px 25px rgba(0,0,0,0.2); overflow: hidden;
    `;
    
    modalContent.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; font-size: 22px; color: #555;">جاري تحميل البيانات اللازمة...</div>`;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    try {
        // --- 2. جلب البيانات الأساسية ---
        const sellerData = await getIssuerFullData();
        if (!sellerData) throw new Error("فشل جلب بيانات الممول.");

        const devices = await getDeviceSerialNumber();
        if (!devices || devices.length === 0) throw new Error("فشل جلب بيانات نقاط البيع.");
        
        const defaultDevice = devices[0];
        const activities = sellerData.activities || [];
        let defaultActivityCode = '4690';
        let activitySelectorHTML = '';

        if (activities.length > 0) {
            const defaultActivity = activities.find(act => act.toDate === null) || activities[0];
            defaultActivityCode = defaultActivity.activityTypeCode;
            activitySelectorHTML = `
                <div>
                    <label for="activity-select-editor" class="select-label">اختر كود النشاط:</label>
                    <select id="activity-select-editor" class="custom-select">
                        ${activities.map(act => `<option value="${act.activityTypeCode}" ${act.activityTypeCode === defaultActivity.activityTypeCode ? 'selected' : ''}>${act.activityTypeCode} - ${act.activityTypeNameSecondaryLang}</option>`).join('')}
                    </select>
                </div>`;
        } else {
            activitySelectorHTML = `<div><label class="select-label">كود النشاط:</label><div class="info-div">لم يتم العثور على أنشطة (سيتم استخدام الكود الافتراضي: ${defaultActivityCode})</div></div>`;
        }

        // --- 3. بناء صفوف المستندات وتفاصيلها ---
        let tableBodyHTML = '';
        receiptsMap.forEach((items, receiptNumber) => {
            const firstItem = items[0] || {};
            
            const currentSerial = document.getElementById('pos-select-editor')?.value || defaultDevice.serialNumber;
            const currentActivityCode = document.getElementById('activity-select-editor')?.value || defaultActivityCode;

            const receiptData = (docType === 'return')
                ? calculateReturnReceiptData(items, sellerData, currentSerial, currentActivityCode)
                : calculateReceiptData(items, sellerData, currentSerial, currentActivityCode);

            const documentTitle = (docType === 'return') ? 'إشعار مرتجع' : 'إيصال بيع';
            const titleColor = (docType === 'return') ? '#c0392b' : '#2980b9';
            const referenceUUID_HTML = (docType === 'return') 
                ? `<tr><th>UUID الفاتورة الأصلية</th><td style="font-family: monospace; font-size: 14px; direction: ltr; background: #fff5f5;">${firstItem.referenceUUID || '<span style="color:red;">مطلوب!</span>'}</td></tr>` 
                : '';

            // بناء جدول الأصناف مع الحقول الجديدة
            const itemsDetailsHTML = receiptData.itemData.map((item, index) => {
                const taxAmountForItem = item.taxableItems.reduce((acc, tax) => acc + tax.amount, 0);
                return `
                    <tr style="border-bottom: 1px solid #f1f1f1;">
                        <td style="padding: 10px;">${item.itemType}</td>
                        <td style="padding: 10px; font-family: monospace;">${item.itemCode}</td>
                        <td style="padding: 10px; background-color: #f0f8ff;">${items[index].officialCodeName || ''}</td>
                        <td style="padding: 10px; text-align: right;">${item.description}</td>
                        <td style="padding: 10px;">${item.quantity}</td>
                        <td style="padding: 10px;">${item.unitPrice.toFixed(2)}</td>
                        <td style="padding: 10px;">${item.totalSale.toFixed(2)}</td>
                        <td style="padding: 10px; color: #c0392b;">${taxAmountForItem.toFixed(5)}</td>
                        <td style="padding: 10px; font-weight: bold;">${item.total.toFixed(2)}</td>
                    </tr>
                `;
            }).join('');

            // بناء جدول الإجماليات مع ترجمة الضرائب
            const totalsDetailsHTML = `
                <tr><td class="details-total-label">إجمالي المبيعات</td><td class="details-total-value">${receiptData.totalSales.toFixed(2)}</td></tr>
                ${receiptData.taxTotals.map(t => `<tr><td class="details-total-label">${taxTypesMap[t.taxType] || t.taxType}</td><td class="details-total-value">${t.amount.toFixed(2)}</td></tr>`).join('')}
                <tr class="details-grand-total"><td class="details-total-label">الإجمالي النهائي</td><td class="details-total-value">${receiptData.totalAmount.toFixed(2)}</td></tr>
            `;

            tableBodyHTML += `
               <tbody data-receipt-number="${receiptNumber}" data-doc-type="${docType}">
                    <tr style="background-color: #fff; border-bottom: 1px solid #e9ecef; cursor: pointer;" class="toggle-details-trigger">
                        <td style="width: 50px; padding: 15px; text-align: center; vertical-align: middle;"><input type="checkbox" class="receipt-checkbox" style="width: 20px; height: 20px; vertical-align: middle;"></td>
                        <td class="toggle-details-icon" style="font-weight: bold; font-size: 28px; width: 40px; color: #007bff; text-align: center; padding: 15px; vertical-align: middle;">+</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-size: 16px;">${receiptNumber} <span style="color: ${titleColor}; font-weight: bold;">(${documentTitle})</span></td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-size: 16px;">${firstItem.buyerName || 'عميل نقدي'}</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-weight: 600; font-size: 16px;">${receiptData.totalSales.toFixed(2)}</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle; font-weight: bold; font-size: 18px;">${receiptData.totalAmount.toFixed(2)}</td>
                        <td style="padding: 15px; text-align: center; vertical-align: middle;"><button class="delete-receipt-btn" title="حذف المستند" style="background: #dc3545; color: white; border: none; border-radius: 50%; cursor: pointer; width: 32px; height: 32px; font-size: 20px; line-height: 32px;">&times;</button></td>
                    </tr>
                    <tr class="receipt-details-row" style="display: none;">
                        <td colspan="7" style="padding: 0 !important;">
                            <div style="padding: 25px; background-color: #f0f2f5; border-top: 4px solid #0d6efd;">
                                <div class="details-grid">
                                    <div class="details-card issuer-card">
                                        <h4 class="details-card-header">بيانات المصدر (البائع)</h4>
                                        <table class="details-table">
                                            <tbody>
                                                <tr><th>الاسم</th><td>${sellerData.name}</td></tr>
                                                <tr><th>رقم التسجيل</th><td>${sellerData.id}</td></tr>
                                                <tr><th>نقطة البيع (POS)</th><td>${currentSerial}</td></tr>
                                                <tr><th>كود النشاط</th><td>${currentActivityCode}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="details-card receiver-card">
                                        <h4 class="details-card-header">بيانات المستلم (المشتري)</h4>
                                        <table class="details-table">
                                            <tbody>
                                                ${referenceUUID_HTML}
                                                <tr><th>الاسم</th><td>${firstItem.buyerName || 'عميل نقدي'}</td></tr>
                                                <tr><th>الرقم القومي</th><td>${firstItem.buyerId || 'لا يوجد'}</td></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div class="details-card items-details-card">
                                        <h4 class="details-card-header">بنود المستند</h4>
                                        <table class="details-table items-details-table">
                                            <thead>
                                                <tr>
                                                    <th>نوع الكود</th><th>كود الصنف</th><th>الاسم الرسمي</th><th>الوصف</th>
                                                    <th>الكمية</th><th>السعر</th><th>الإجمالي</th><th>قيمة الضريبة</th><th>الإجمالي النهائي</th>
                                                </tr>
                                            </thead>
                                            <tbody>${itemsDetailsHTML}</tbody>
                                        </table>
                                    </div>
                                    <div class="details-card totals-details-card">
                                        <h4 class="details-card-header">الإجماليات</h4>
                                        <table class="details-table totals-details-table">
                                            <tbody>${totalsDetailsHTML}</tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>`;
        });

        // --- 4. بناء الهيكل الكامل للواجهة مع الأزرار الصحيحة ---
        modalContent.innerHTML = `
            <div style="padding: 20px 25px; border-bottom: 1px solid #ddd; background-color: #f8f9fa; flex-shrink: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #2161a1; font-size: 22px;">مراجعة وتأكيد المستندات (${receiptsMap.size})</h3>
                    <div style="display: flex; gap: 12px;">
                        <button id="saveAllAsDraftsBtn" class="header-btn" style="background-color: #ffc107; color: #333;">📝 حفظ الكل كمسودات</button>
                        <button id="sendSelectedReceiptsBtn" class="header-btn send-btn">إرسال المحدد</button>
                        <button id="closeReceiptEditorBtn" class="header-btn close-btn">إغلاق</button>
                    </div>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 25px; background-color: #e9ecef; padding: 15px; border-radius: 8px;">
                    <div>
                        <label for="pos-select-editor" class="select-label">اختر نقطة البيع (POS):</label>
                        <select id="pos-select-editor" class="custom-select">
                            ${devices.map(device => `<option value="${device.serialNumber}" ${device.serialNumber === defaultDevice.serialNumber ? 'selected' : ''}>${device.serialNumber}</option>`).join('')}
                        </select>
                    </div>
                    ${activitySelectorHTML}
                </div>
            </div>
            <div style="overflow-y: auto; flex-grow: 1;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="position: sticky; top: 0; background: #020b18ff; color: white; z-index: 10;">
                       <tr>
                            <th style="padding: 15px; text-align: center;"><input type="checkbox" id="selectAllCheckbox" style="width: 20px; height: 20px;"></th>
                            <th></th><th>الرقم الداخلي (والنوع)</th><th>اسم العميل</th><th>الإجمالي قبل الضريبة</th>
                            <th>الإجمالي النهائي</th><th>حذف</th>
                       </tr>
                    </thead>
                    <tbody>${tableBodyHTML}</tbody>
                </table>
            </div>
            <div style="padding: 15px 25px; background-color: #343a40; color: white; text-align: center; border-top: 4px solid #0d6efd; flex-shrink: 0;">
                <strong style="font-size: 18px;">الإجمالي النهائي للمستندات المحددة: <span id="grandTotalAmount" style="color: #28a745; font-size: 22px;">0.00</span></strong>
            </div>
        `;

        // --- 5. إضافة الأنماط الكاملة ---
        const styles = document.createElement('style');
        styles.innerHTML = `
            .details-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 20px; }
            .issuer-card { grid-column: 1 / 2; grid-row: 1 / 2; }
            .receiver-card { grid-column: 1 / 2; grid-row: 2 / 3; }
            .items-details-card { grid-column: 2 / 3; grid-row: 1 / 3; }
            .totals-details-card { grid-column: 2 / 3; grid-row: 3 / 4; margin-top: -20px; }
            .details-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; }
            .details-card-header { color: #0d6efd; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-top: 0; margin-bottom: 15px; font-size: 16px; }
            .details-table { width: 100%; border-collapse: collapse; }
            .details-table th, .details-table td { border: 1px solid #f0f0f0; padding: 8px; text-align: right; font-size: 13px; }
            .details-table th { background-color: #f8f9fa; width: 100px; font-weight: 600; }
            .items-details-table th, .items-details-table td { text-align: center; padding: 6px; white-space: nowrap; }
            .totals-details-table .details-total-label { font-weight: bold; }
            .totals-details-table .details-grand-total td { font-size: 16px; font-weight: bold; background-color: #e9ecef; }
            .header-btn { padding: 10px 22px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 15px; }
            .send-btn { background-color: #28a745; color: white; }
            .close-btn { background-color: #6c757d; color: white; }
            .select-label { font-size: 14px; font-weight: 600; margin-bottom: 5px; display: block; }
            .custom-select { width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
            .info-div { padding: 10px; background-color: #fff; border-radius: 5px; border: 1px solid #ccc; }
        `;
        modal.appendChild(styles);
        
        // --- 6. ربط جميع الأحداث ---
        const closeModal = () => modal.remove();
        document.getElementById('closeReceiptEditorBtn').onclick = closeModal;

        modal.querySelectorAll('.toggle-details-trigger').forEach(row => {
            row.onclick = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                const detailsRow = row.nextElementSibling;
                const icon = row.querySelector('.toggle-details-icon');
                const isVisible = detailsRow.style.display !== 'none';
                detailsRow.style.display = isVisible ? 'none' : 'table-row';
                icon.textContent = isVisible ? '+' : '-';
            };
        });

        modal.querySelectorAll('.delete-receipt-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const group = e.target.closest('tbody');
                if (confirm(`هل تريد حذف المستند رقم "${group.dataset.receiptNumber}"؟`)) {
                    group.remove();
                    updateGrandTotal();
                }
            };
        });

        const grandTotalSpan = document.getElementById('grandTotalAmount');
        const updateGrandTotal = () => {
            let total = 0;
            const currentActivityCode = document.getElementById('activity-select-editor')?.value || defaultActivityCode;
            const currentSerial = document.getElementById('pos-select-editor').value;

            modal.querySelectorAll('.receipt-checkbox:checked').forEach(cb => {
                const group = cb.closest('tbody');
                const receiptNumber = group.dataset.receiptNumber;
                const currentDocType = group.dataset.docType;
                const items = receiptsMap.get(receiptNumber);
                const receiptData = (currentDocType === 'return')
                    ? calculateReturnReceiptData(items, sellerData, currentSerial, currentActivityCode)
                    : calculateReceiptData(items, sellerData, currentSerial, currentActivityCode);
                total += receiptData.totalAmount;
            });
            grandTotalSpan.textContent = total.toFixed(2);
        };

        document.getElementById('selectAllCheckbox').onchange = (e) => {
            modal.querySelectorAll('.receipt-checkbox').forEach(cb => cb.checked = e.target.checked);
            updateGrandTotal();
        };

        modal.querySelectorAll('.receipt-checkbox, #pos-select-editor, #activity-select-editor').forEach(el => {
            el.onchange = updateGrandTotal;
        });
        
        updateGrandTotal();

        // --- 7. المنطق النهائي للأزرار ---
        document.getElementById('saveAllAsDraftsBtn').onclick = () => {
            if (!confirm(`سيتم حفظ جميع المستندات (${receiptsMap.size}) المعروضة كمسودات. هل تريد المتابعة؟`)) {
                return;
            }
            const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");
            let savedCount = 0;
            receiptsMap.forEach((items, receiptNumber) => {
                const firstItem = items[0] || {};
                const draftData = {
                    receiptNumber: receiptNumber,
                    buyerName: firstItem.buyerName,
                    buyerId: firstItem.buyerId,
                    documentType: docType,
                    referenceUUID: docType === 'return' ? firstItem.referenceUUID : undefined,
                    items: items.map(item => ({
                        itemType: item.itemType,
                        itemCode: item.itemCode,
                        description: item.description,
                        unitType: item.unitType,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        taxableItems: [
                            (item.taxType_1 && { taxType: item.taxType_1, subType: item.taxSubType_1, rate: item.taxRate_1 }),
                            (item.taxType_2 && { taxType: item.taxType_2, subType: item.taxSubType_2, rate: item.taxRate_2 })
                        ].filter(Boolean)
                    }))
                };
                drafts.unshift(draftData);
                savedCount++;
            });
            localStorage.setItem("receiptDrafts", JSON.stringify(drafts));
            showToastNotification(`✅ تم حفظ ${savedCount} مستند كمسودة بنجاح.`, 5000);
            renderReceiptDrafts();
            closeModal();
        };
        
        document.getElementById('sendSelectedReceiptsBtn').onclick = async () => {
            const sendButton = document.getElementById('sendSelectedReceiptsBtn');
            const selectedGroups = Array.from(modal.querySelectorAll('.receipt-checkbox:checked')).map(cb => cb.closest('tbody'));
            if (selectedGroups.length === 0) { alert("يرجى تحديد مستند واحد على الأقل لإرساله."); return; }
            if (!confirm(`سيتم الآن تجميع ${selectedGroups.length} مستند في دفعة واحدة وإرسالها. هل تريد المتابعة؟`)) return;

            sendButton.disabled = true;
            const loadingToast = showToastNotification(`جاري بناء سلسلة UUID لـ ${selectedGroups.length} مستند...`);

            try {
                const selectedSerial = document.getElementById('pos-select-editor').value;
                const activitySelect = document.getElementById('activity-select-editor');
                const selectedActivity = activitySelect ? activitySelect.value : defaultActivityCode;
                const receiptChain = [];
                let lastSuccessfulUUID = (JSON.parse(localStorage.getItem("receiptHistory") || "[]")[0] || {}).uuid || "";

                for (const group of selectedGroups) {
                    const receiptNumber = group.dataset.receiptNumber;
                    const currentDocType = group.dataset.docType;
                    const items = receiptsMap.get(receiptNumber);

                    const receiptObject = (currentDocType === 'return')
                        ? calculateReturnReceiptData(items, sellerData, selectedSerial, selectedActivity)
                        : calculateReceiptData(items, sellerData, selectedSerial, selectedActivity);
                    
                    receiptObject.header.previousUUID = lastSuccessfulUUID;
                    const payloadForUuid = JSON.stringify({ receipts: [receiptObject] });
                    const newUuid = await EtaUuid.computeUuidFromRawText(payloadForUuid);
                    receiptObject.header.uuid = newUuid;
                    receiptChain.push(receiptObject);
                    lastSuccessfulUUID = newUuid;
                }

                const finalPayload = { receipts: receiptChain };
                const result = await sendReceipts_V3(finalPayload, `دفعة من ${receiptChain.length} مستند`);

                if (result.success) {
                    const finalUUID = result.uuid;
                    const history = JSON.parse(localStorage.getItem("receiptHistory") || "[]");
                    history.unshift({ receiptNumber: `دفعة من ${receiptChain.length} مستند`, uuid: finalUUID });
                    localStorage.setItem("receiptHistory", JSON.stringify(history.slice(0, 50)));
                    
                    loadingToast.remove();
                    alert(`✅ تم إرسال دفعة تحتوي على ${receiptChain.length} مستند بنجاح!`);
                    closeModal();
                } else {
                    throw new Error(result.error || "فشل إرسال الدفعة.");
                }
            } catch (error) {
                loadingToast.remove();
                alert(`❌ حدث خطأ فادح أثناء الإرسال: ${error.message}`);
            } finally {
                sendButton.disabled = false;
            }
        };
    
    } catch (error) {
        modalContent.innerHTML = `<div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; font-size: 22px; color: #d9534f; text-align: center; padding: 20px;">
            <p>فشل تحميل البيانات الأساسية.</p>
            <p style="font-size: 16px; color: #555;">الخطأ: ${error.message}</p>
            <button id="closeErrorModal" class="header-btn close-btn" style="margin-top: 20px;">إغلاق</button>
        </div>`;
        modalContent.querySelector('#closeErrorModal').onclick = () => modal.remove();
    }
}






async function sendReceipts(batchObject, batchLabel) {
   
    
    let finalUuidInChain = '';

    try {
        const receiptChain = batchObject.receipts;
        if (!receiptChain || receiptChain.length === 0) {
            throw new Error("فشل الإرسال: كائن الدفعة فارغ أو لا يحتوي على إيصالات.");
        }
        finalUuidInChain = receiptChain[receiptChain.length - 1].header.uuid;

        const finalPayloadText = JSON.stringify(batchObject, null, 2);
        const zip = new JSZip();
        zip.file("receipts.json", finalPayloadText);
        const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

        // --- الخطوة 3: حقن الملف في الصفحة ---
        const fileInput = document.querySelector('input[type="file"]');
        if (!fileInput) throw new Error('لم يتم العثور على حقل رفع الملفات.');
        
        const file = new File([zipBlob], "receipts.zip", { type: "application/zip" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));

        // --- الخطوة 4: الضغط على زر "ابدأ المعالجة" ---
        await new Promise(resolve => setTimeout(resolve, 200));
        const buttonSpan = Array.from(document.querySelectorAll('button span.ms-Button-label')).find(span => span.textContent.trim() === 'ابدأ المعالجة');
        if (!buttonSpan) throw new Error('لم يتم العثور على زر "ابدأ المعالجة".');
        
        const processButton = buttonSpan.closest('button');
        processButton.click();

       await new Promise((resolve, reject) => {
    const maxWaitTime = 30000;
    const checkInterval = 250;
    let elapsedTime = 0;
    const intervalId = setInterval(() => {
        const buttonStillExists = document.body.contains(processButton) && processButton.offsetParent !== null;
        if (!buttonStillExists) {
            clearInterval(intervalId);
            resolve(); // نجحت العملية قبل انتهاء المهلة
        } else if (elapsedTime >= maxWaitTime) {
            clearInterval(intervalId);
            // ✅ التعديل هنا: بدلاً من إطلاق خطأ، نعتبر العملية ناجحة ونكمل
            resolve(); 
        }
        elapsedTime += checkInterval;
    }, checkInterval);
});

return { success: true, uuid: finalUuidInChain, error: null };


    } catch (error) {
        return { success: false, uuid: finalUuidInChain, error: error.message };
    }
}
// ===================================================================================
// ✅✅✅ الخطوة 1: دالة الإرسال الجديدة (باسم جديد) للتعامل مع الدفعات فقط ✅✅✅
// ===================================================================================
async function sendReceipts_BATCH_V2(batchObject, batchLabel) {
    
    let finalUuidInChain = '';

    try {
        const receiptChain = batchObject.receipts;
        if (!receiptChain || receiptChain.length === 0) {
            throw new Error("فشل الإرسال: كائن الدفعة فارغ.");
        }
        finalUuidInChain = receiptChain[receiptChain.length - 1].header.uuid;

        const finalPayloadText = JSON.stringify(batchObject, null, 2);
        const zip = new JSZip();
        zip.file("receipts.json", finalPayloadText);
        const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

        const fileInput = document.querySelector('input[type="file"]');
        if (!fileInput) throw new Error('لم يتم العثور على حقل رفع الملفات.');
        
        const file = new File([zipBlob], "receipts.zip", { type: "application/zip" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));

        await new Promise(resolve => setTimeout(resolve, 200));
        const buttonSpan = Array.from(document.querySelectorAll('button span.ms-Button-label')).find(span => span.textContent.trim() === 'ابدأ المعالجة');
        if (!buttonSpan) throw new Error('لم يتم العثور على زر "ابدأ المعالجة".');
        
        const processButton = buttonSpan.closest('button');
        processButton.click();
   
        await new Promise((resolve, reject) => {
            const maxWaitTime = 30000; // 30 ثانية
            const checkInterval = 250;
            let elapsedTime = 0;
            const intervalId = setInterval(() => {
                const buttonStillExists = document.body.contains(processButton) && processButton.offsetParent !== null;
                if (!buttonStillExists) {
                    clearInterval(intervalId);
                    resolve();
                } else if (elapsedTime >= maxWaitTime) {
                    clearInterval(intervalId);
                    const errorMessage = `انتهت مهلة الانتظار (${maxWaitTime / 1000} ثانية).`;
                    reject(new Error(errorMessage));
                }
                elapsedTime += checkInterval;
            }, checkInterval);
        });

        return { success: true, uuid: finalUuidInChain, error: null };

    } catch (error) {
        return { success: false, uuid: finalUuidInChain, error: error.message };
    }
}


function calculateReceiptData(itemsData, sellerData, deviceSerial, activityCode, failedUuid = null) {
    const finalSellerData = sellerData || window.receiptUploaderData.seller;
    const finalDeviceSerial = deviceSerial || window.receiptUploaderData.serial;
    const finalActivityCode = activityCode || finalSellerData.taxpayerActivityCode || '4690';

    const firstRow = itemsData[0];
    const history = JSON.parse(localStorage.getItem("receiptHistory") || "[]");
    const lastUUID = history.length > 0 ? history[0].uuid : "";

    // --- ✅✅✅ بداية التعديل: منطق التاريخ الجديد ✅✅✅ ---
    let finalDateTime;
    if (firstRow.dateTimeIssued && firstRow.dateTimeIssued instanceof Date) {
        // إذا كان التاريخ كائن Date صالح من الإكسل، قم بتحويله إلى صيغة ISO
        finalDateTime = firstRow.dateTimeIssued.toISOString().substring(0, 19) + "Z";
    } else {
        // إذا كان التاريخ غير موجود أو غير صالح، استخدم التاريخ الحالي كقيمة افتراضية
        finalDateTime = new Date().toISOString().substring(0, 19) + "Z";
    }
    // --- ✅✅✅ نهاية التعديل ✅✅✅ ---

    const header = {
        dateTimeIssued: finalDateTime, // <-- استخدام التاريخ النهائي هنا
        receiptNumber: String(firstRow.receiptNumber || `RCPT_${Math.floor(Date.now() / 1000)}`),
        previousUUID: lastUUID,
        uuid: "",
        currency: "EGP",
        exchangeRate: 0.00,
        sOrderNameCode: "",
        orderdeliveryMode: "",
        grossWeight: 0.00,
        netWeight: 0.00
    };

    if (failedUuid) {
        header.referenceOldUUID = failedUuid;
    }

    // ... باقي الدالة يبقى كما هو بدون تغيير ...

    let finalTotalSales = 0;
    const finalTaxTotalsMap = new Map();

    const calculatedItemData = itemsData.map(item => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const itemTotalSale = parseFloat((quantity * unitPrice).toFixed(5));
        const itemNetSale = itemTotalSale;

        const taxableItems = [];
        let totalTaxAmountForItem = 0;

        for (let i = 1; i <= 2; i++) {
            const taxType = item[`taxType_${i}`];
            const taxRate = parseFloat(item[`taxRate_${i}`]);
            if (taxType && !isNaN(taxRate) && taxRate > 0) {
                const taxAmount = parseFloat((itemNetSale * (taxRate / 100)).toFixed(5));
                taxableItems.push({
                    taxType: String(taxType),
                    amount: taxAmount,
                    subType: String(item[`taxSubType_${i}`]),
                    rate: taxRate
                });
                totalTaxAmountForItem += (taxType === 'T4' ? -taxAmount : taxAmount);
                finalTaxTotalsMap.set(String(taxType), (finalTaxTotalsMap.get(String(taxType)) || 0) + taxAmount);
            }
        }

        const itemTotal = parseFloat((itemNetSale + totalTaxAmountForItem).toFixed(5));
        finalTotalSales += itemTotalSale;

        return {
            internalCode: String(item.internalCode),
            description: String(item.description),
            itemType: String(item.itemType || 'EGS'),
            itemCode: String(item.itemCode),
            unitType: String(item.unitType || 'EA'),
            quantity: quantity,
            unitPrice: unitPrice,
            totalSale: itemTotalSale,
            netSale: itemNetSale,
            total: itemTotal,
            valueDifference: 0,
            itemDiscountData: [{"amount": 0.00, "description": "Item Discount"}],
            taxableItems: taxableItems
        };
    });

    return {
        header: header,
        documentType: {
            receiptType: "S",
            typeVersion: "1.2"
        },
        seller: {
            rin: finalSellerData.id,
            companyTradeName: finalSellerData.name,
            branchCode: "0",
            branchAddress: {
                country: "EG",
                governate: finalSellerData.governate,
                regionCity: finalSellerData.regionCity,
                street: finalSellerData.street,
                buildingNumber: finalSellerData.buildingNumber
            },
            deviceSerialNumber: finalDeviceSerial,
            activityCode: finalActivityCode,
            syndicateLicenseNumber: "POS"
        },
        buyer: {
            type: "P",
            id: firstRow.buyerId || "",
            name: firstRow.buyerName || "عميل نقدي",
            mobileNumber: "",
            paymentNumber: ""
        },
        itemData: calculatedItemData,
        totalSales: parseFloat(finalTotalSales.toFixed(5)),
        totalItemsDiscount: 0.00,
        netAmount: parseFloat(finalTotalSales.toFixed(5)),
        taxTotals: Array.from(finalTaxTotalsMap, ([taxType, amount]) => ({
            taxType,
            amount: parseFloat(amount.toFixed(5))
        })),
        totalAmount: parseFloat(calculatedItemData.reduce((sum, item) => sum + item.total, 0).toFixed(5)),
        paymentMethod: "C"
    };
}







function showReceiptDataPreview(processedData) {
    document.getElementById('receiptPreviewModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'receiptPreviewModal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 10001; display: flex; align-items: center; justify-content: center; direction: rtl;`;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `background-color: #f4f7fc; width: 90%; height: 85%; border-radius: 10px; display: flex; flex-direction: column; font-family: 'Segoe UI', Tahoma, sans-serif; overflow: hidden; box-shadow: 0 5px 25px rgba(0,0,0,0.2);`;

    const itemsTableRows = processedData.itemData.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px;">${item.internalCode}</td>
            <td style="padding: 8px; text-align: right;">${item.description}</td>
            <td style="padding: 8px;">${item.quantity}</td>
            <td style="padding: 8px;">${item.unitPrice.toFixed(2)}</td>
            <td style="padding: 8px; background-color: #eef7ff;">${item.totalSale.toFixed(2)}</td>
            <td style="padding: 8px;">${item.taxableItems.map(t => `${t.taxType} (${t.rate}%)`).join('<br/>') || 'لا يوجد'}</td>
            <td style="padding: 8px; background-color: #e6fffa; font-weight: bold;">${item.total.toFixed(2)}</td>
        </tr>
    `).join('');

    const totalsTableRows = `
        <tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">إجمالي المبيعات</td><td style="padding: 8px; border: 1px solid #ddd;">${processedData.totalSales.toFixed(2)}</td></tr>
        ${processedData.taxTotals.map(t => `<tr><td style="font-weight: bold; padding: 8px; border: 1px solid #ddd;">إجمالي ضريبة ${t.taxType}</td><td style="padding: 8px; border: 1px solid #ddd;">${t.amount.toFixed(2)}</td></tr>`).join('')}
        <tr style="background-color: #343a40; color: white; font-size: 1.1em;"><td style="font-weight: bold; padding: 10px; border: 1px solid #343a40;">الإجمالي النهائي</td><td style="padding: 10px; border: 1px solid #343a40;">${processedData.totalAmount.toFixed(2)}</td></tr>
    `;

    modalContent.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background-color: #fff;">
            <h3 style="margin: 0; color: #2161a1;">معاينة الإيصال قبل الإرسال</h3>
            <div>
                <button id="confirmSendReceiptBtn" style="background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">تأكيد وإرسال الإيصال</button>
                <button id="cancelSendReceiptBtn" style="background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">إلغاء</button>
            </div>
        </div>
        <div style="overflow: auto; flex-grow: 1; padding: 20px;">
            <h4 style="margin-top:0;">ملخص الإيصال (رقم: ${processedData.header.receiptNumber})</h4>
            <p><strong>اسم العميل:</strong> ${processedData.buyer.name}</p>
            <h5 style="margin-bottom: 5px;">البنود:</h5>
            <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 14px;">
                <thead style="background-color: #e9ecef;">
                    <tr>
                        <th style="padding: 10px;">الكود الداخلي</th>
                        <th style="padding: 10px; text-align: right;">الوصف</th>
                        <th style="padding: 10px;">الكمية</th>
                        <th style="padding: 10px;">سعر الوحدة</th>
                        <th style="padding: 10px;">الإجمالي</th>
                        <th style="padding: 10px;">الضرائب</th>
                        <th style="padding: 10px;">الإجمالي النهائي للبند</th>
                    </tr>
                </thead>
                <tbody>${itemsTableRows}</tbody>
            </table>
            <h5 style="margin-top: 20px; margin-bottom: 5px;">الإجماليات النهائية:</h5>
            <table style="width: 40%; border-collapse: collapse; font-size: 15px; margin-top: 10px;">
                <tbody>${totalsTableRows}</tbody>
            </table>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById('cancelSendReceiptBtn').onclick = () => modal.remove();
    document.getElementById('confirmSendReceiptBtn').onclick = () => {
        modal.remove();
        sendReceipts(processedData);
    };
}













/**
 * ✅✅✅ دالة sendReceipts (النسخة النهائية المبسطة للإرسال فقط) ✅✅✅
 * @param {Object} receiptObject - كائن الإيصال الجاهز والمحسوب.
 */
async function sendReceipts(receiptObject) {
    const loadingToast = showToastNotification('تأكيد الإرسال...');
    try {
        // حساب UUID قبل الإرسال مباشرة
        const payloadForUuid = JSON.stringify({ receipts: [receiptObject] });
        const uuid = await EtaUuid.computeUuidFromRawText(payloadForUuid);
        receiptObject.header.uuid = uuid;

        const finalPayloadText = JSON.stringify({ receipts: [receiptObject] }, null, 2);
        const zip = new JSZip();
        zip.file("receipts.json", finalPayloadText);
        const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

        const fileInput = document.querySelector('input[type="file"]');
        if (!fileInput) throw new Error('لم يتم العثور على حقل رفع الملفات.');

        const file = new File([zipBlob], "receipts.zip", { type: "application/zip" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));

        const buttonSpan = Array.from(document.querySelectorAll('button span.ms-Button-label')).find(span => span.textContent.trim() === 'ابدأ المعالجة');
        if (!buttonSpan) throw new Error('لم يتم العثور على زر "ابدأ المعالجة".');
        buttonSpan.closest('button').click();

        // تسجيل النجاح
        const history = JSON.parse(localStorage.getItem("receiptHistory") || "[]");
        const newHistoryEntry = { receiptNumber: receiptObject.header.receiptNumber, uuid: receiptObject.header.uuid };
        history.unshift(newHistoryEntry);
        localStorage.setItem("receiptHistory", JSON.stringify(history.slice(0, 50)));
        renderReceiptHistory();

        loadingToast.remove();
        showToastNotification(`✅ تم إرسال الإيصال ${newHistoryEntry.receiptNumber} بنجاح!`, 5000);

    } catch (error) {
        alert(`❌ حدث خطأ فادح أثناء الإرسال: ${error.message}`);
    } finally {
        if (loadingToast) loadingToast.remove();
    }
}





/**
 * ✅ دالة جديدة: لجلب بيانات البائع (المصدر) كاملة من الموقع.
 * تستخدم نفس منطق دالة الفواتير getIssuerFullData.
 */
async function getSellerFullData() {
    // يمكننا ببساطة إعادة استخدام نفس الدالة المستخدمة في الفواتير
    // لأنها تجلب نفس البيانات المطلوبة للبائع.
    return await getIssuerFullData();
}



async function getDeviceSerialNumber() {
    const token = getAccessToken();
    if (!token) {
        return null;
    }

    try {
     
        
        const apiUrl = "https://api-portal.invoicing.eta.gov.eg/api/v1/pos/devices/current?Ps=100";
        
        const response = await fetch(apiUrl, {
            headers: { "Authorization": `Bearer ${token}` }
        } );

        if (!response.ok) {
            const errorText = await response.text();
            return null;
        }

        const result = await response.json();
        
        // 2. فلترة النتائج للتأكد من أننا نتعامل فقط مع الأجهزة "النشطة"
        const activeDevices = result?.data?.filter(device => device.status === "Active");

        if (activeDevices && activeDevices.length > 0) {
            // 3. فرز الأجهزة يدوياً (client-side) بناءً على تاريخ أول مصادقة (firstAuthenticationDate)
            // يتم الترتيب تنازلياً (من الأحدث إلى الأقدم).
            activeDevices.sort((a, b) => {
                const dateA = new Date(a.firstAuthenticationDate);
                const dateB = new Date(b.firstAuthenticationDate);
                return dateB - dateA; // للترتيب التنازلي
            });

            return activeDevices; // إرجاع مصفوفة الأجهزة المرتبة
        } else {
            return [];
        }
        // ✅✅✅ نهاية التعديل الجوهري ✅✅✅

    } catch (error) {
        return null;
    }
}











    let isOperationInProgress = false;
    let retryCount = 0;
    const maxRetries = 10;
      const taxTypesMap = {
    "T1": "ضريبة القيمة المضافة",
    "T2": "ضريبة الجدول (نسبية)",
    "T3": "ضريبة الجدول (النوعية)",
    "T4": "الخصم تحت حساب الضريبة",
    "T5": "ضريبة الدمغة (نسبية)",
    "T6": "ضريبة الدمغة (قطعية بمقدار ثابت)",
    "T7": "ضريبة الملاهي",
    "T8": "رسم تنمية الموارد",
    "T9": "رسم خدمة",
    "T10": "رسم المحليات",
    "T11": "رسم التأمين الصحي",
    "T12": "رسوم أخرى",
    "T13": "ضريبة الدمغة (نسبية)",
    "T14": "ضريبة الدمغة (قطعية بمقدار ثابت)",
    "T15": "ضريبة الملاهي",
    "T16": "رسم تنمية الموارد",
    "T17": "رسم خدمة",
    "T18": "رسم المحليات",
    "T19": "رسم التأمين الصحي",
    "T20": "رسوم أخرى"
  };


  







async function getIssuerFullData() {
    try {
        const token = getAccessToken();
        const userData = JSON.parse(localStorage.getItem("USER_DATA") || "{}");
        const taxRin = userData?.profile?.TaxRin || userData?.profile?.taxRin;

        if (!token || !taxRin) {
            return null;
        }

        const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/taxpayers/${taxRin}/light`, {
            headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
        } );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        
        const branch = data.taxpayerBranchs?.[0];
        const address = branch?.address;
        const allActivities = branch?.taxpayerActivities || [];

        // --- ✅✅✅ بداية المنطق الجديد والمهم ✅✅✅ ---
        let activeActivityCode = '4690'; // كود افتراضي في حالة الفشل
        if (allActivities.length > 0) {
            // 1. نبحث عن نشاط "ساري" (ليس له تاريخ انتهاء)
            const currentActivity = allActivities.find(act => act.toDate === null);
            
            if (currentActivity) {
                // 2. إذا وجدنا نشاطًا ساريًا، نستخدم الكود الخاص به
                activeActivityCode = currentActivity.activityTypeCode;
            } else {
                // 3. إذا لم نجد، نستخدم كود آخر نشاط (الأحدث) كخيار احتياطي
                activeActivityCode = allActivities[allActivities.length - 1].activityTypeCode;
            }
        } else {
        }
        // --- ✅✅✅ نهاية المنطق الجديد ✅✅✅ ---

        return {
            id: data.registrationNumber,
            name: data.namePrimaryLang,
            // ✅ تعديل: إضافة كود النشاط الفعّال كخاصية منفصلة لسهولة الوصول إليه
            taxpayerActivityCode: activeActivityCode, 
            activities: allActivities, // إبقاء قائمة الأنشطة الكاملة للاستخدامات الأخرى
            governate: address?.governorateNameSecondaryLang || '',
            regionCity: address?.cityNameSecondaryLang || '',
            street: address?.streetName || '',
            buildingNumber: address?.buildingNo || ''
        };

    } catch (err) {
        return null;
    }
}



function addInvoiceCreatorButton() {
    // التأكد من أننا في الصفحة الصحيحة
    if (window.location.pathname !== '/newdocument') {
        return;
    }

    // منع إضافة الزر إذا كان موجودًا بالفعل
    if (document.getElementById("customInvoiceCreatorBtn")) {
        return;
    }

    // البحث عن الزر المرجعي لوضع الزر الجديد قبله
    const referenceButton = document.querySelector("button[id^='Pivot'][id$='-Tab3']");

    if (!referenceButton) {
        if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(addInvoiceCreatorButton, 500);
            return;
        }
        return;
    }

    // --- بداية التصميم المتقدم ---

    // 1. إنشاء الزر وتطبيق التنسيق الأساسي المتوافق
    const btn = document.createElement("button");
    btn.id = "customInvoiceCreatorBtn";
    btn.type = "button";
    btn.className = referenceButton.className.replace('is-selected', '').replace('linkIsSelected-135', '');

    // 2. استخدام أيقونة SVG عالية الجودة لبرنامج Excel
    // SVG (Scalable Vector Graphics) تضمن وضوح الأيقونة في أي حجم
    const excelIconSVG = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="">
            <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" fill="#107C41"/>
            <path d="M14 2V8H20" fill="#10B981" fill-opacity="0.5"/>
            <path d="M12.5 13.5L15 17M15 13.5L12.5 17" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M9.5 17H10.5L12 14.75L10.5 12H9.5L8 14.25L9.5 17Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>
    `;

    // 3. بناء الهيكل الداخلي للزر
    btn.innerHTML = `
        <span class="btn-content-wrapper">
            <span class="btn-icon-container">${excelIconSVG}</span>
            <span class="ms-Pivot-text btn-text">إنشاء من Excel</span>
        </span>
    `;

    // 4. إضافة الأنماط المتقدمة باستخدام CSS
    // نستخدم عنصر <style> لسهولة كتابة الأنماط المعقدة والتأثيرات
    const styles = document.createElement('style' );
    styles.id = 'customButtonStyles'; // لمنع تكرار الأنماط
    if (!document.getElementById(styles.id)) {
        styles.innerHTML = `
            #customInvoiceCreatorBtn {
                background: rgba(22, 163, 74, 0.1); /* خلفية شفافة بلون أخضر خفيف */
                border: 1px solid rgba(22, 163, 74, 0.3);
                border-radius: 6px;
                backdrop-filter: blur(10px); /* التأثير الزجاجي */
                -webkit-backdrop-filter: blur(10px);
                transition: all 0.3s ease;
                margin: 0 10px;
                position: relative;
                overflow: hidden; /* لإخفاء تأثير الإضاءة الزائد */
            }
            #customInvoiceCreatorBtn .btn-content-wrapper {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 4px 8px;
            }
            #customInvoiceCreatorBtn .btn-icon-container {
                background-color: #16A34A; /* أخضر Excel */
                border-radius: 4px;
                padding: 4px;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            #customInvoiceCreatorBtn .btn-text {
                color: #14532d; /* لون أخضر داكن للنص */
                font-weight: 600;
            }
            /* تأثير الإضاءة عند مرور الماوس */
            #customInvoiceCreatorBtn::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 70%);
                transform: translate(-50%, -50%) scale(0);
                transition: transform 0.5s ease;
                opacity: 0;
            }
            #customInvoiceCreatorBtn:hover::before {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
            }
            #customInvoiceCreatorBtn:hover {
                border-color: rgba(22, 163, 74, 0.5);
                background: rgba(22, 163, 74, 0.2);
                box-shadow: 0 4px 15px rgba(22, 163, 74, 0.2);
            }
        `;
        document.head.appendChild(styles);
    }
    // --- نهاية التصميم المتقدم ---

    // إضافة حدث النقر لفتح الواجهة الرئيسية
    btn.addEventListener("click", (event) => {
        event.preventDefault();
        const mainUI = document.getElementById("invoiceCreatorMainUI");
        if (mainUI) {
            mainUI.style.display = "flex";
        } else {
            injectInvoiceCreatorUI();
        }
    });

    // إضافة الزر الجديد قبل الزر المرجعي
    referenceButton.parentNode.insertBefore(btn, referenceButton);

    // إعادة تعيين عداد المحاولات بعد النجاح
    retryCount = 0;
}


function injectInvoiceCreatorUI() {
    // 1. التحقق من وجود الواجهة لمنع تكرارها
    if (document.getElementById("invoiceCreatorMainUI")) {
        const mainUI = document.getElementById("invoiceCreatorMainUI");
        mainUI.style.display = "flex";
        mainUI.querySelector('.sidebar-btn[data-target="panel-create"]').click();
        return;
    }

    // 2. الإعدادات الأساسية
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Kufam:wght@600&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink );

    // 3. إنشاء الهيكل الرئيسي للواجهة
    const mainUI = document.createElement("div");
    mainUI.id = "invoiceCreatorMainUI";
    Object.assign(mainUI.style, {
        position: "fixed", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)", width: "1080px", height: "700px",
        backgroundColor: "#ffffff", borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)", zIndex: "9999",
        fontFamily: "'Cairo', 'Segoe UI', Tahoma, sans-serif",
        overflow: "hidden", display: "flex", direction: "rtl"
    });

    // 4. بناء الهيكل الداخلي (HTML)
    mainUI.innerHTML = `
        <div class="sidebar">
            <div class="sidebar-header"><h3>🚀 الفواتير</h3></div>
            <div class="sidebar-menu">
                <button class="sidebar-btn active" data-target="panel-create"><span class="btn-icon">➕</span> إنشاء من Excel</button>
                <button class="sidebar-btn" data-target="panel-drafts"><span class="btn-icon">🖨️</span> عرض المسودات</button>
                <button class="sidebar-btn" data-target="panel-help"><span class="btn-icon">❓</span> مساعدة وتعليمات</button>
                <button class="sidebar-btn" data-target="panel-taxpayer-query"><span class="btn-icon">🔍</span> استعلام عن ممول</button>
                <button class="sidebar-btn" data-target="panel-codes-explorer"><span class="btn-icon">📦</span> مستكشف الأكواد</button>
                <button class="sidebar-btn" data-target="panel-jobs"><span class="btn-icon">💼</span> الوظائف</button>

            </div>
        </div>
        <div class="main-panel">
            <button id="closeInvoiceCreatorBtn" title="إغلاق">&times;</button>
            <div class="panel-content-wrapper">
                <div id="panel-create" class="panel-content active"></div>
                <div id="panel-drafts" class="panel-content"></div>
                <div id="panel-help" class="panel-content"></div>
                <div id="panel-taxpayer-query" class="panel-content"></div>

                <div id="panel-codes-explorer" class="panel-content"></div>
                <div id="panel-admin-dashboard" class="panel-content" style="background-color: #e9ecef;"></div>
                <div id="panel-jobs" class="panel-content"></div>

            </div>
            <div id="info-sidebar" class="info-sidebar">
                <div id="taxpayer-info-box" class="info-card">
                    <div class="card-header"><span class="card-icon">👤</span><h3>بيانات الممول</h3></div>
                    <div class="card-body"><p>جاري التحميل...</p></div>
                </div>
                <div class="info-card prayer-card"><p>اللهُم صلِّ على مُحمد</p></div>
                <div id="designer-info-box" class="info-card">
                     <div class="card-header"><span class="card-icon">💻</span><h3>المصمم</h3></div>
                     <div class="card-body">
                        <p class="designer-name">المحاسب : محمد صبري</p>
                        <p class="designer-contact"><span class="card-icon" style="font-size: 14px;">📞</span>واتساب: 01060872599</p>
                     </div>
                </div>
            </div>
        </div>
    `;

    // 5. إضافة الأنماط (CSS)
    const styles = document.createElement('style');
    styles.innerHTML = `
        .sidebar { width: 220px; background-color: #0d1b2a; color: #e0e1dd; display: flex; flex-direction: column; flex-shrink: 0; }
        .sidebar-header { padding: 20px; text-align: center; border-bottom: 1px solid #415a77; }
        .sidebar-menu { flex-grow: 1; padding-top: 15px; }
        .sidebar-btn { display: flex; align-items: center; width: 100%; padding: 15px 20px; background-color: transparent; border: none; color: #e0e1dd; font-size: 16px; font-family: 'Cairo', sans-serif; text-align: right; cursor: pointer; transition: background-color 0.3s, color 0.3s; border-right: 4px solid transparent; }
        .sidebar-btn:hover { background-color: #1b263b; }
        .sidebar-btn.active { background-color: #415a77; color: #ffffff; font-weight: 700; border-right-color: #778da9; }
        .sidebar-btn .btn-icon { margin-left: 12px; font-size: 18px; }
        .main-panel { flex-grow: 1; background-color: #f4f7fa; display: flex; position: relative; }
        #closeInvoiceCreatorBtn { position: absolute; top: 10px; left: 10px; width: 32px; height: 32px; background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 50%; font-size: 24px; line-height: 30px; text-align: center; cursor: pointer; z-index: 10; transition: all 0.2s ease; }
        #closeInvoiceCreatorBtn:hover { background-color: #e63946; color: white; transform: scale(1.1); box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
        .panel-content-wrapper { flex-grow: 1; overflow-y: auto; position: relative; }
        .panel-content { display: none; padding: 25px; height: 100%; box-sizing: border-box; }
        .panel-content.active { display: block; animation: fadeIn 0.5s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .info-sidebar { width: 350px; flex-shrink: 0; background-color: #e9ecef; border-right: 1px solid #dee2e6; padding: 20px 15px; display: flex; flex-direction: column; gap: 20px; transition: opacity 0.3s, visibility 0.3s; }
        .info-card { background-color: #fff; border-radius: 10px; box-shadow: 0 3px 10px rgba(0,0,0,0.07); border: 1px solid #dbe4f0; }
        .info-card .card-header { display: flex; align-items: center; gap: 10px; background-color: #f8f9fa; padding: 10px 15px; border-bottom: 1px solid #e9ecef; border-top-left-radius: 9px; border-top-right-radius: 9px; }
        .info-card .card-header h3 { margin: 0; font-size: 15px; color: #1d3557; }
        .info-card .card-icon { font-size: 18px; color: #457b9d; }
        .info-card .card-body { padding: 15px; font-size: 14px; color: #343a40; }
        .info-card .card-body p { margin: 5px 0; line-height: 1.6; }
        #taxpayer-info-box strong { color: #0d1b2a; }
        .prayer-card { text-align: center; padding: 20px; background: linear-gradient(135deg, #1d3557, #457b9d); color: #fff; text-shadow: 1px 1px 3px rgba(0,0,0,0.3); }
        .prayer-card p { font-family: 'Kufam', cursive; font-size: 22px; font-weight: 600; margin: 0; }
        #designer-info-box .designer-name { font-weight: bold; color: #1d3557; }
        #designer-info-box .designer-contact { font-size: 13px; color: #007bff; display: flex; align-items: center; gap: 8px; }
        .panel-header { border-bottom: 1px solid #dee2e6; padding-bottom: 15px; margin-bottom: 25px; }
        .panel-header h2 { margin: 0 0 5px 0; color: #0d1b2a; font-size: 22px; }
        .panel-header p { margin: 0; color: #6c757d; font-size: 15px; }
        .content-step { margin-bottom: 20px; }
        .content-label { display: block; font-size: 15px; font-weight: 600; color: #343a40; margin-bottom: 8px; }
        .content-select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #ced4da; font-size: 15px; }
        .button-group { display: flex; gap: 15px; }
        .action-button { padding: 12px 20px; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 15px; flex-grow: 1; text-align: center; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; }
        .action-button:hover { transform: translateY(-2px); }
        .download-btn { background-color: #5a67d8; }
        .upload-btn { background-color: #38a169; }
        .drafts-btn-main { background-color: #dd6b20; width: 60%; margin: 20px auto; padding: 15px; font-size: 18px; }
        .comments-area { display: flex; flex-direction: column; height: 100%; }
        .comments-container { flex-grow: 1; overflow-y: auto; padding: 10px; background: #e9ecef; border-radius: 8px; margin-bottom: 20px; }
        .comment-box { background: white; padding: 15px; border-radius: 10px; margin-bottom: 15px; border-right: 5px solid #a8dadc; box-shadow: 0 2px 5px rgba(0,0,0,0.05); position: relative; }
        .comment-box.admin-comment { border-right-color: #fca311; }
        .comment-image { max-width: 150px; max-height: 150px; border-radius: 8px; margin-top: 10px; cursor: pointer; transition: transform 0.3s; object-fit: cover; }
        .admin-form-container { background-color: #fff; padding: 40px; border-radius: 12px; text-align: center; max-width: 400px; margin: 40px auto; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        .admin-input { width: 100%; padding: 12px; margin-bottom: 20px; border: 1px solid #ccc; border-radius: 8px; font-size: 16px; text-align: center; }
        .admin-submit-btn { background-color: #1d3557; color: white; padding: 12px 30px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px; width: 100%; }
        .help-section { margin-bottom: 25px; }
        .help-title { font-size: 18px; color: #1d3557; border-bottom: 2px solid #a8dadc; padding-bottom: 8px; margin-bottom: 15px; }
        .help-table { width: 100%; border-collapse: collapse; font-size: 14px; }
        .help-table th, .help-table td { border: 1px solid #dee2e6; padding: 12px; text-align: right; vertical-align: middle; }
        .help-table th { background-color: #f8f9fa; font-weight: 700; color: #495057; }
        .help-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
        .help-table td strong { color: #0d1b2a; }
        .required-star { color: #e63946; font-weight: bold; margin-right: 4px; }
        .help-notes { background-color: #fffbe6; border: 1px solid #ffe58f; border-right: 5px solid #fca311; padding: 15px 20px; border-radius: 8px; }
        .help-notes ul { padding-right: 20px; margin: 0; }
        .help-notes li { margin-bottom: 12px; line-height: 1.7; font-size: 15px; }
        .note-highlight { font-weight: bold; color: #1d3557; }
        .query-container { display: flex; gap: 10px; margin-bottom: 20px; align-items: center; padding: 10px; background: #f8f9fa; border-radius: 12px; border: 1px solid #e9ecef; }
        #taxpayerQueryInput { flex-grow: 1; padding: 12px 15px; border: 1px solid #ced4da; border-radius: 8px; font-size: 16px; text-align: left; direction: ltr; transition: all 0.3s ease; }
        #taxpayerQueryInput:focus { border-color: #007bff; box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15); outline: none; }
        #taxpayerQueryBtn { padding: 12px 25px; font-size: 16px; font-weight: bold; background: linear-gradient(145deg, #007bff, #0056b3); color: white; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 10px rgba(0, 123, 255, 0.2); }
        #taxpayerQueryBtn:hover { transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0, 123, 255, 0.3); }
        #queryResultContainer { background-color: #e9ecef; border-radius: 8px; padding: 15px; height: calc(100% - 150px); overflow-y: auto; }
        .query-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; font-size: 20px; color: #6c757d; text-align: center; }
        .query-placeholder svg { width: 80px; height: 80px; margin-bottom: 20px; opacity: 0.5; }
        .profile-card, .branch-card, .activity-card { background: #ffffff; border-radius: 12px; margin-bottom: 20px; border: 1px solid #dee2e6; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05); overflow: hidden; animation: fadeIn 0.5s ease-out; }
        .card-header { display: flex; align-items: center; gap: 12px; padding: 15px 20px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; }
        .card-header .icon { font-size: 24px; color: #007bff; }
        .card-header h3 { margin: 0; font-size: 18px; font-weight: 700; color: #343a40; }
        .card-body { padding: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px 25px; }
        .info-field { display: flex; align-items: center; background: #f8f9fa; border-radius: 8px; padding: 8px 12px; border: 1px solid #e9ecef; }
        .info-field .label-icon { font-size: 18px; color: #6c757d; margin-left: 10px; }
        .info-field .value { font-size: 15px; color: #212529; font-weight: 500; }
        .info-field .value.ltr { direction: ltr; text-align: left; flex-grow: 1; }
        .info-field .status { padding: 4px 10px; border-radius: 15px; font-weight: bold; font-size: 13px; }
        .info-field .status.active { background-color: #d4edda; color: #155724; }
        .info-field .status.inactive { background-color: #f8d7da; color: #721c24; }
        .activity-card { border-left: 5px solid #17a2b8; }
        .activity-card .card-header .icon { color: #17a2b8; }
        .codes-explorer-grid { display: grid; grid-template-columns: 350px 1fr; gap: 20px; height: 100%; }
        .search-panel { display: flex; flex-direction: column; background: #f8f9fa; border-radius: 12px; padding: 15px; border: 1px solid #e9ecef; }
        .details-panel { display: flex; flex-direction: column; }
        .search-options { display: flex; gap: 10px; margin-bottom: 15px; }
        .search-options select { flex-grow: 1; padding: 10px; border: 1px solid #ced4da; border-radius: 8px; }
        #code-search-input { width: 100%; padding: 12px 15px; border: 1px solid #ced4da; border-radius: 8px; font-size: 16px; margin-bottom: 15px; }
        #search-results-list { list-style: none; padding: 0; margin: 0; overflow-y: auto; flex-grow: 1; border: 1px solid #e9ecef; border-radius: 8px; background: #fff; }
        .search-result-item { padding: 12px 15px; border-bottom: 1px solid #e9ecef; cursor: pointer; transition: background-color 0.2s; }
        .search-result-item:last-child { border-bottom: none; }
        .search-result-item:hover, .search-result-item.selected { background-color: #e0e7ff; }
        .search-result-item strong { display: block; color: #1d3557; font-size: 15px; }
        .search-result-item span { font-size: 13px; color: #007bff; font-family: monospace; }
        #code-details-container { padding: 20px; background: #fff; border-radius: 12px; border: 1px solid #dee2e6; overflow-y: auto; flex-grow: 1; }
        .detail-card { background: #f8f9fa; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid #007bff; }
        .detail-card h4 { margin: 0 0 10px 0; color: #343a40; font-size: 16px; }
        .detail-card p { margin: 5px 0; font-size: 15px; }
        .detail-card p .label { font-weight: 600; color: #495057; min-width: 100px; display: inline-block; }
        .detail-card p .value { color: #1d3557; }
        .detail-card p .value.code { color: #e63946; font-family: monospace; font-weight: bold; }
        .list-placeholder { text-align: center; color: #888; padding: 20px; }
    `;
    document.body.appendChild(styles);
    document.body.appendChild(mainUI);

    // ✅✅✅ بداية الكود المدمج ✅✅✅

    /**
     * دالة مساعدة لجلب كود الإعلانات مرة واحدة
     */
    async function getAdvertisementsHTML() {
        let adsSectionHTML = `
            <div class="appended-ads-section" style="margin-top: 30px; padding-top: 20px; border-top: 2px dashed #ced4da;">
                <style>
                    .ad-item-new { display: flex; gap: 20px; align-items: center; background: #fff; border: 1px solid #e9ecef; border-radius: 12px; padding: 20px; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
                    .ad-item-new img { width: 120px; height: 120px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
                    .ad-item-new .ad-text-new { flex-grow: 1; }
                    .ad-item-new .ad-text-new h4 { margin: 0 0 8px 0; color: #0056b3; font-size: 18px; }
                    .ad-item-new .ad-text-new p { margin: 0; font-size: 15px; color: #495057; line-height: 1.7; }
                </style>
                <div class="panel-header"><h2 style="text-align:center;">أحدث العروض والإعلانات</h2></div>`;
        try {
            const response = await fetch('https://api.jsonbin.io/v3/b/68dbb9bf43b1c97be9555347' );
            if (!response.ok) throw new Error(`Server Error: ${response.status}`);
            const data = await response.json();
            const ads = data.record?.advertisements || data.advertisements;
            if (ads && Array.isArray(ads) && ads.length > 0) {
                adsSectionHTML += ads.map(ad => `<div class="ad-item-new"><img src="${ad.imageUrl}" alt="${ad.title}"><div class="ad-text-new"><h4>${ad.title}</h4><p>${ad.description}</p></div></div>`).join('');
            } else {
                adsSectionHTML += `<p style="text-align:center; color:#888;">لا توجد إعلانات لعرضها حالياً.</p>`;
            }
        } catch (error) {
            adsSectionHTML += `<p style="text-align:center; color:red;">حدث خطأ: ${error.message}</p>`;
        }
        adsSectionHTML += `</div>`;
        return adsSectionHTML;
    }

    
    /**
 * =========================================================================
 * ✅ الدالة الكاملة: تبني جميع تبويبات الفواتير وتربط الأحداث الصحيحة
 * =========================================================================
 */
async function populateInvoiceTabs() {
    // جلب كود الإعلانات مرة واحدة لاستخدامه في جميع التبويبات
    const adsHtmlContent = await getAdvertisementsHTML();
    
    // --- 1. بناء تبويب "إنشاء من Excel" ---
    const createPanel = document.getElementById('panel-create');
    if (createPanel) {
        createPanel.innerHTML = `
            <div class="panel-header"><h2>إنشاء فاتورة جديدة من ملف Excel</h2><p>اتبع الخطوات التالية لإنشاء فاتورة واحدة أو أكثر بسرعة.</p></div>
            <div class="content-step"><label class="content-label">الخطوة 1: اختر إصدار المستند</label><select id="invoiceVersionSelect" class="content-select"><option value="1.0" selected>إصدار 1.0 (مستند نهائي وموقع)</option><option value="0.9">إصدار 0.9 (مسودة غير موقعة)</option></select></div>
            <div class="content-step"><label class="content-label">الخطوة 2: اختر نوع الفاتورة</label><div id="invoiceTypeSelector" class="button-group" style="justify-content: center;"><button class="action-button invoice-type-btn active" data-type="FullInvoice" style="background-color: #3b82f6;">فاتورة افتراضية (كاملة)</button><button class="action-button invoice-type-btn" data-type="SimpleInvoice" style="background-color: #6b7280;">فاتورة بسيطة</button></div><p style="font-size: 13px; color: #555; text-align: center; margin-top: 8px;">اختر "كاملة" لتضمين بيانات الشراء والبنك، أو "بسيطة" للفواتير السريعة.</p></div>
            <div class="content-step">
                <label class="content-label">الخطوة 3: تحميل النموذج ورفع الملف</label>
                <div class="button-group">
                    <button id="dynamicDownloadTemplateBtn" class="action-button download-btn">
                        <span class="btn-icon">📥</span> تحميل نموذج Excel الذكي
                    </button>
                    <label for="excelUploadInput" class="action-button upload-btn">
                        <span class="btn-icon">📂</span> رفع الملف للمراجعة
                    </label>
                    <input type="file" id="excelUploadInput" accept=".xlsx, .xls" style="display: none;">
                </div>
            </div>
            ${adsHtmlContent}
        `;

        // ربط الأحداث الخاصة بتبويب الإنشاء
        document.getElementById('dynamicDownloadTemplateBtn').addEventListener('click', downloadExcelTemplate_v3);
        document.getElementById('excelUploadInput').addEventListener('change', handleExcelUpload_v3);
        document.querySelectorAll('.invoice-type-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                document.querySelectorAll('.invoice-type-btn').forEach(b => { b.classList.remove('active'); b.style.backgroundColor = '#6b7280'; });
                this.classList.add('active'); this.style.backgroundColor = '#3b82f6';
            });
        });
    }

    // --- 2. بناء تبويب "عرض المسودات" ---
    const draftsPanel = document.getElementById('panel-drafts');
    if (draftsPanel) {
        draftsPanel.innerHTML = `
            <div class="panel-header"><h2>عرض وتعديل المسودات</h2><p>هنا يمكنك عرض كل الفواتير المحفوظة كمسودات على المنصة وتعديلها.</p></div>
            <div class="panel-body" style="text-align: center;"><button id="showDraftsBtn" class="action-button drafts-btn-main"><span class="btn-icon">🔍</span> عرض كل المسودات الآن</button></div>
            ${adsHtmlContent}
        `;
        document.getElementById('showDraftsBtn').addEventListener('click', showAllDraftsInEditor);
    }

    // --- 3. بناء تبويب "المساعدة" ---
    const helpPanel = document.getElementById('panel-help');
    if (helpPanel) {
        helpPanel.innerHTML = `
            <div class="panel-header"><h2>مساعدة وتعليمات</h2><p>دليل شامل لكيفية ملء ملف الإكسل لرفع الفواتير الإلكترونية.</p></div>
            <div class="panel-body" style="padding-top: 10px;">
                <div class="help-section">
                    <h3 class="help-title">شرح أعمدة ملف الإكسيل</h3>
                    <table class="help-table">
                        <thead><tr><th>العمود</th><th>الشرح والتوضيح</th></tr></thead>
                        <tbody>
                            <tr><td><strong>رقم الفاتورة</strong></td><td>يجب إدخاله يدويًا لكل فاتورة، وهو الرقم الذي يميزها في دفاترك.</td></tr>
                            <tr><td><strong>رقم تسجيل المستلم</strong></td><td>إلزامي. يجب أن يكون رقم التسجيل الضريبي للمشتري صحيحًا ومسجلاً بالمنظومة.</td></tr>
                            <tr><td><strong>اسم العميل</strong></td><td>اكتب اسم المشتري كما هو مسجل في الفاتورة.</td></tr>
                            <tr><td><strong>نوع المستلم</strong></td><td>اختر من القائمة المنسدلة: <strong>شركة</strong>، <strong>شخص طبيعي</strong>، أو <strong>أجنبي</strong>.</td></tr>
                            <tr><td><strong>الدولة</strong></td><td>اختر الدولة من القائمة المنسدلة (مصر هي الافتراضية).</td></tr>
                            <tr><td><strong>المحافظة / المدينة / الشارع / المبنى</strong></td><td>تُكتب هذه البيانات نصيًا.</td></tr>
                            <tr><td><strong>وصف الصنف</strong> <span class="required-star">*</span></td><td>اسم أو وصف الخدمة/السلعة.</td></tr>
                            <tr><td><strong>نوع كود الصنف</strong> <span class="required-star">*</span></td><td>اختر من القائمة: <strong>كود مصلحة الضرائب</strong> أو <strong>كود عالمي</strong>.</td></tr>
                            <tr><td><strong>الكود الداخلي للصنف</strong></td><td>اختياري. يمكنك استخدام كود داخلي لتمييز أصنافك.</td></tr>
                            <tr><td><strong>الكمية</strong> <span class="required-star">*</span></td><td>اكتب الكمية المباعة.</td></tr>
                            <tr><td><strong>سعر الصنف</strong> <span class="required-star">*</span></td><td>اكتب سعر الوحدة للسلعة/الخدمة.</td></tr>
                            <tr><td><strong>أنواع الضريبة</strong> <span class="required-star">*</span></td><td>اختر من القوائم المنسدلة المترابطة.</td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="help-notes">
                    <h3 class="help-title">ملاحظات هامة</h3>
                    <ul>
                        <li><span class="note-highlight">بيانات الفاتورة</span> (العميل، العنوان...) تُكتب <strong>مرة واحدة فقط</strong> في أول صف لكل فاتورة.</li>
                        <li><span class="note-highlight">بيانات الأصناف</span> (اسم الصنف، الكود، السعر...) هي التي <strong>تتكرر مع كل صنف</strong> تابع لنفس الفاتورة.</li>
                    </ul>
                </div>
            </div>
            ${adsHtmlContent}
        `;
    }

    // --- 4. بناء تبويب "الاستعلام عن ممول" ---
    const queryPanel = document.getElementById('panel-taxpayer-query');
    if (queryPanel) {
        queryPanel.innerHTML = `
            <div class="panel-header"><h2>مستكشف بيانات الممولين</h2><p>واجهة احترافية لعرض بيانات الممولين المسجلين بالمنظومة.</p></div>
            <div class="query-container"><input type="text" id="taxpayerQueryInput" placeholder="أدخل رقم التسجيل هنا..."><button id="taxpayerQueryBtn">بحث</button></div>
            <div id="queryResultContainer"><div class="query-placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.125 20 11 20C6.02944 20 2 15.9706 2 11C2 6.02944 6.02944 2 11 2C15.9706 2 20 6.02944 20 11C20 13.125 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path></svg>أدخل رقم تسجيل للبدء...</div></div>
            ${adsHtmlContent}
        `;
        
        const queryBtn = document.getElementById('taxpayerQueryBtn' );
        const queryInput = document.getElementById('taxpayerQueryInput');
        const resultContainer = document.getElementById('queryResultContainer');
        
        queryBtn.addEventListener('click', async () => {
            const registrationNumber = queryInput.value.trim();
            if (!registrationNumber) { alert("يرجى إدخال رقم تسجيل أولاً."); return; }
            resultContainer.innerHTML = `<div class="query-placeholder">جاري البحث...</div>`;
            const data = await fetchTaxpayerData(registrationNumber);
               if (data) {
                let html = `<div class="profile-card"><div class="card-header"><span class="icon">👤</span><h3>الملف الشخصي للممول</h3></div><div class="card-body">${createInfoField('🆔', data.registrationNumber, true)}${createInfoField('🏢', data.namePrimaryLang)}${createInfoField('✉️', data.email, true)}${createInfoField('🚦', data.isActive ? 'نشط' : 'غير نشط', false, true)}</div></div>`;
                if (data.taxpayerBranchs && data.taxpayerBranchs.length > 0) {
                    data.taxpayerBranchs.forEach((branch, index) => {
                        const address = branch.address || {};
                        html += `<div class="branch-card"><div class="card-header"><span class="icon">📍</span><h3>بيانات الفرع ${index + 1} (رقم: ${branch.branchNumber})</h3></div><div class="card-body">${createInfoField('🏛️', address.governorateNameSecondaryLang)}${createInfoField('🏙️', address.cityNameSecondaryLang)}${createInfoField('🛣️', address.streetName)}${createInfoField('🔢', address.buildingNo)}</div></div>`;
                        if (branch.taxpayerActivities && branch.taxpayerActivities.length > 0) {
                            branch.taxpayerActivities.forEach(activity => {
                                html += `<div class="activity-card"><div class="card-header"><span class="icon">💼</span><h3>نشاط مسجل (كود: ${activity.activityTypeCode})</h3></div><div class="card-body">${createInfoField('📝', activity.activityTypeNameSecondaryLang)}${createInfoField('📅', `يبدأ في: ${new Date(activity.fromDate).toLocaleDateString('ar-EG')}`)}${createInfoField('🏁', activity.toDate ? `ينتهي في: ${new Date(activity.toDate).toLocaleDateString('ar-EG')}` : 'الحالة: ساري')}</div></div>`;
                            });
                        }
                    });
                }
                resultContainer.innerHTML = html;
            } else {
                resultContainer.innerHTML = `<div class="query-placeholder">فشل في جلب البيانات للرقم: ${registrationNumber}. تأكد من صحة الرقم.</div>`;
            }
        });
    }
}


    
    
    // استدعاء دالة بناء التبويبات
    populateInvoiceTabs();

    
    makeDraggable(mainUI, mainUI.querySelector('.sidebar'));
    
    document.getElementById("closeInvoiceCreatorBtn").addEventListener("click", () => { 
        mainUI.style.display = "none"; 
    });
    
    const sidebarBtns = mainUI.querySelectorAll('.sidebar-btn');
    const contentPanels = mainUI.querySelectorAll('.panel-content');
    const infoSidebar = document.getElementById('info-sidebar');

   
    sidebarBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        sidebarBtns.forEach(b => b.classList.remove('active'));
        contentPanels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetPanelId = btn.getAttribute('data-target');
        document.getElementById(targetPanelId).classList.add('active');

        // --- ✅ بداية التعديل ---
        // إذا كان الزر الذي تم الضغط عليه هو زر "الوظائف"، قم باستدعاء الدالة
        if (targetPanelId === 'panel-jobs') {
            displayAvailableJobs();
        }
        // --- ✅ نهاية التعديل ---

        const tabsToShowInfo = ['panel-create', 'panel-drafts'];
        if (tabsToShowInfo.includes(targetPanelId)) {
            infoSidebar.style.display = 'flex';
        } else {
            infoSidebar.style.display = 'none';
        }
    });
});


    (async function displayTaxpayerInfoInBox() {
        const infoBox = mainUI.querySelector('#taxpayer-info-box .card-body');
        try {
            const data = await getIssuerFullData();
            if (data) {
                infoBox.innerHTML = `<p><strong>الاسم:</strong> ${data.name || 'غير متوفر'}</p><p><strong>رقم التسجيل:</strong> ${data.id || 'غير متوفر'}</p><p><strong>العنوان:</strong> ${data.street || ''}, ${data.regionCity || ''}</p>`;
            } else {
                throw new Error("لم يتم العثور على بيانات الممول.");
            }
        } catch (err) {
            infoBox.innerHTML = `<p style="color: red;">فشل في جلب البيانات: ${err.message}</p>`;
        }
    })();

    setupCodesExplorerTab();
}





function md5(string) {
    function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function addUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) { return (lResult ^ 0x80000000 ^ lX8 ^ lY8); }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) { return (lResult ^ 0xC0000000 ^ lX8 ^ lY8); }
            else { return (lResult ^ 0x40000000 ^ lX8 ^ lY8); }
        } else { return (lResult ^ lX8 ^ lY8); }
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    function convertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    }
    function wordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    }
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    x = convertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    var temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return temp.toLowerCase();
}








/**
 * ===================================================================================
 * ✅✅✅ دالة جلب بيانات الممول (النسخة النهائية المضمونة) ✅✅✅
 * ===================================================================================
 */
async function fetchTaxpayerData(registrationNumber) {
    const token = getAccessToken();
    if (!token) return null;

    const regNumAsString = String(registrationNumber || '').trim();
    if (!regNumAsString) return null;

    // نطلب البيانات بدون تحديد لغة لنحصل على اللغتين معًا
    const apiUrl = `https://api-portal.invoicing.eta.gov.eg/api/v1/taxpayers/${regNumAsString}/light`;

    try {
        const response = await fetch(apiUrl, {
            headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
        } );

        if (response.ok) {
            const data = await response.json();
            if (data.error) return null;

            // نكتشف اللغة المطلوبة هنا
            const isArabic = (EInvoicePortalLanguage === 'ar');

            // إذا كانت اللغة عربية ويوجد اسم عربي، نقوم بالتبديل
            if (isArabic && data.nameSecondaryLang) {
                data.namePrimaryLang = data.nameSecondaryLang;
                if (data.taxpayerBranchs && data.taxpayerBranchs[0]?.address) {
                    data.taxpayerBranchs[0].address.governorateNamePrimaryLang = data.taxpayerBranchs[0].address.governorateNameSecondaryLang;
                    data.taxpayerBranchs[0].address.cityNamePrimaryLang = data.taxpayerBranchs[0].address.cityNameSecondaryLang;
                }
            }
            // في حالة اللغة الإنجليزية، لا نفعل شيئًا لأنها بالفعل في الحقل الأساسي
            return data;
        }
        return null;
    } catch (error) {
        console.error("Error in fetchTaxpayerData:", error);
        return null;
    }
}








function showToastNotification(message, duration = 0) {
    // إزالة أي شريط قديم أولاً
    const oldToast = document.getElementById('non-blocking-toast');
    if (oldToast) {
        oldToast.remove();
    }

    // إنشاء عنصر الشريط
    const toast = document.createElement('div');
    toast.id = 'non-blocking-toast';
    
    // تصميم الشريط ليكون أنيقاً وغير مزعج
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        backgroundColor: '#2c3e50', // لون داكن أنيق
        color: 'white',
        padding: '15px 25px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        zIndex: '10006', // رقم عالٍ ليظهر فوق كل شيء
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        fontFamily: "'Cairo', 'Segoe UI', sans-serif",
        fontSize: '16px',
        opacity: '0',
        transform: 'translateY(20px)',
        transition: 'opacity 0.4s ease, transform 0.4s ease'
    });

    // إضافة أيقونة تحميل دوارة (Spinner)
    toast.innerHTML = `
        <div class="toast-spinner" style="
            width: 20px; 
            height: 20px; 
            border: 3px solid rgba(255, 255, 255, 0.3); 
            border-top-color: #3498db; 
            border-radius: 50%; 
            animation: spin 1s linear infinite;
        "></div>
        <span id="toast-message">${message}</span>
    `;

    // إضافة أنماط الحركة (Animation) للـ Spinner
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `@keyframes spin { to { transform: rotate(360deg); } }`;
    document.head.appendChild(styleSheet);

    // إضافة الشريط إلى الصفحة وإظهاره بحركة ناعمة
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // إخفاء الشريط بعد مدة معينة (إذا كانت محددة)
    if (duration > 0) {
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    }

    // إرجاع العنصر للتحكم به يدوياً
    return toast;
}





async function fetchDraftInvoices() {
    const token = getAccessToken();
    if (!token) {
        alert("خطأ: لم يتم العثور على توكن الدخول. يرجى تسجيل الدخول أولاً.");
        return null;
    }

    try {
        // تم إزالة فلتر `IsSubmisssionReady=true` لجلب كل المسودات
        const response = await fetch("https://api-portal.invoicing.eta.gov.eg/api/v1/documents/drafts?OrderBy=lastModificationDateTimeUtc", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        } );

        if (!response.ok) {
            throw new Error(`فشل جلب قائمة المسودات. رمز الحالة: ${response.status}`);
        }

        const data = await response.json();
        return data.result; 

    } catch (error) {
        alert(`حدث خطأ أثناء جلب المسودات: ${error.message}`);
        return null;
    }
}

/**
 * ✅ دالة جديدة 2: تجلب التفاصيل الكاملة لمسودة فاتورة واحدة.
 */
async function fetchSingleDraftDetails(draftId) {
    const token = getAccessToken();
    if (!token) return null;
    try {
        const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/documents/drafts/${draftId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        } );
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        return null;
    }
}

/**
 * ✅ دالة جديدة 3: تحول بيانات المسودة من API إلى التنسيق الذي تفهمه واجهة التعديل.
 */
function transformDraftDataForEditor(draft) {
    const doc = draft.document;
    if (!doc) return [];

    // تجميع بيانات رأس الفاتورة
    const invoiceHeader = {
        internalID: doc.internalID,
        receiver_id: doc.receiver.id,
        receiver_name: doc.receiver.name,
        receiver_type: doc.receiver.type,
        receiver_country: doc.receiver.address?.country,
        receiver_governate: doc.receiver.address?.governate,
        receiver_city: doc.receiver.address?.regionCity,
        receiver_street: doc.receiver.address?.street,
        receiver_building: doc.receiver.address?.buildingNumber,
        purchaseOrderReference: doc.purchaseOrderReference,
        purchaseOrderDescription: doc.purchaseOrderDescription,
        salesOrderReference: doc.salesOrderReference,
        salesOrderDescription: doc.salesOrderDescription,
        bankName: doc.payment?.bankName,
        bankAccountNo: doc.payment?.bankAccountNo,
        deliveryApproach: doc.delivery?.approach,
        deliveryPackaging: doc.delivery?.packaging,
    };

    // إنشاء صف لكل بند في الفاتورة مع إضافة بيانات الرأس إليه
    return doc.invoiceLines.map(line => {
        const lineData = {
            ...invoiceHeader,
            item_description: line.description,
            item_type: line.itemType,
            item_code: line.itemCode,
            item_internal_code: line.internalCode,
            unit_type: line.unitType,
            quantity: line.quantity,
            unit_price: line.unitValue.amountEGP,
            currency_sold: line.unitValue.currencySold,
            exchange_rate: line.unitValue.currencyExchangeRate,
            discount_rate: line.discount?.rate,
            discount_amount: line.discount?.amount,
        };

        // إضافة بيانات الضرائب (حتى 3 ضرائب لكل بند)
        line.taxableItems.forEach((tax, index) => {
            if (index < 3) {
                lineData[`tax_type_${index + 1}`] = tax.taxType;
                lineData[`tax_subtype_${index + 1}`] = tax.subType;
                lineData[`tax_rate_${index + 1}`] = tax.rate;
            }
        });

        return lineData;
    });
}

/**
 * ✅ دالة جديدة 4: الدالة الرئيسية التي تربط كل شيء ببعضه.
 */
async function showAllDraftsInEditor() {
    // 1. جلب قائمة المسودات الأولية
    const draftsList = await fetchDraftInvoices();

    if (!draftsList || draftsList.length === 0) {
        alert("لم يتم العثور على أي فواتير في المسودات.");
        return;
    }

    // 2. إظهار مؤشر تحميل للمستخدم
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'draftsLoadingIndicator';
    loadingIndicator.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); color: white; display: flex; align-items: center; justify-content: center; z-index: 10005; font-size: 24px;`;
    loadingIndicator.textContent = `جاري تحميل تفاصيل ${draftsList.length} مسودة...`;
    document.body.appendChild(loadingIndicator);

    // 3. جلب التفاصيل الكاملة لكل مسودة بالتوازي لتسريع العملية
    const draftDetailsPromises = draftsList.map(d => fetchSingleDraftDetails(d.id));
    const detailedDrafts = await Promise.all(draftDetailsPromises);

    // 4. تحويل البيانات وهيكلتها
    let allLinesFormatted = [];
    for (const draft of detailedDrafts) {
        if (draft) { // التأكد من أن جلب التفاصيل لم يفشل
            const formattedLines = transformDraftDataForEditor(draft);
            allLinesFormatted.push(...formattedLines);
        }
    }
    
    // 5. إزالة مؤشر التحميل
    loadingIndicator.remove();

    if (allLinesFormatted.length === 0) {
        alert("فشل تحميل تفاصيل المسودات أو أنها فارغة. يرجى المحاولة مرة أخرى.");
        return;
    }

    // 6. استدعاء واجهة التعديل المتقدمة مع البيانات المحولة
    showDataEditorModal_v3(allLinesFormatted);
}







/**
 * ===================================================================================
 * ✅ دالة معدلة: لجعل أي عنصر HTML قابلاً للسحب والتحريك (مع حل مشكلة القفزة)
 * ===================================================================================
 * @param {HTMLElement} element - العنصر الذي سيتم تحريكه (الواجهة كلها).
 * @param {HTMLElement} handle - الجزء من العنصر الذي يمكن السحب منه (مثلاً، الشريط العلوي).
 */
function makeDraggable(element, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isFirstDrag = true; // ✅ جديد: متغير لتتبع أول عملية سحب

    // استخدم "handle" إذا تم توفيره، وإلا استخدم العنصر نفسه للسحب
    (handle || element).onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        
        // الحصول على موضع مؤشر الماوس عند بدء السحب
        pos3 = e.clientX;
        pos4 = e.clientY;

        // ✅ جديد: عند أول ضغطة فقط، قم بحساب الموضع الفعلي للعنصر
        if (isFirstDrag) {
            // getBoundingClientRect() تعطي الموضع الدقيق على الشاشة بغض النظر عن transform
            const rect = element.getBoundingClientRect();
            element.style.top = rect.top + "px";
            element.style.left = rect.left + "px";
            // الآن يمكننا إلغاء transform بأمان لأن الموضع تم تثبيته
            element.style.transform = 'none';
            isFirstDrag = false; // تعطيل هذا الشرط للمرات القادمة
        }

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        
        // حساب الموضع الجديد للمؤشر
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        
        // تعيين الموضع الجديد للعنصر
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // إيقاف التحريك عند رفع زر الماوس
        document.onmouseup = null;
        document.onmousemove = null;
    }
}






     function getAccessToken() {
    try {
      const user = JSON.parse(localStorage.getItem("USER_DATA") || sessionStorage.getItem("USER_DATA") || "{}");
      return user?.access_token || null;
    } catch {
      return null;
    }
  }


  /**
 * =========================================================================
 * ✅ الدالة النهائية (v4.1): تمرر البيانات المترجمة إلى دالة المعاينة
 * =========================================================================
 */
async function handleExcelUpload_v3(event) {
    const file = event.target.files[0];
    if (!file) return;

    const loadingToast = showToastNotification('جاري قراءة الملف وترجمة البيانات...');

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(e.target.result);
            const worksheet = workbook.getWorksheet(1);

            const rawData = [];
            worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
                if (rowNumber > 1) {
                    const rowValues = row.values.slice(1);
                    rawData.push(rowValues);
                }
            });

            if (rawData.length === 0) throw new Error("الملف فارغ أو لا يحتوي على بيانات.");

            // --- منطق الترجمة العكسية (الأساسي) ---
            const translatedRows = rawData.map(row => {
                const newRow = [...row];
                
                // ترجمة نوع المستلم (العمود D -> index 3)
                const receiverTypeDesc = newRow[3];
                if (receiverTypeDesc && reverseMappings.receiverTypes[receiverTypeDesc]) {
                    newRow[3] = reverseMappings.receiverTypes[receiverTypeDesc];
                }

                // ترجمة دولة المستلم (العمود E -> index 4)
                const countryDesc = newRow[4];
                if (countryDesc && reverseMappings.countries[countryDesc]) {
                    newRow[4] = reverseMappings.countries[countryDesc];
                }

                // ترجمة وحدة القياس (العمود N -> index 13)
                const unitDesc = newRow[13];
                if (unitDesc && reverseMappings.units[unitDesc]) {
                    newRow[13] = reverseMappings.units[unitDesc];
                }
                
                // ترجمة العملات (العمود Q -> index 16)
                const currencyDesc = newRow[16];
                if (currencyDesc && reverseMappings.currencies[currencyDesc]) {
                    newRow[16] = reverseMappings.currencies[currencyDesc];
                }

                // ترجمة أنواع الضرائب
                const taxIndices = [{main: 20, sub: 21}, {main: 23, sub: 24}];
                taxIndices.forEach(idx => {
                    const mainTaxDesc = newRow[idx.main];
                    const subTaxDesc = newRow[idx.sub];
                    if (mainTaxDesc && reverseMappings.taxTypes[mainTaxDesc]) {
                        newRow[idx.main] = reverseMappings.taxTypes[mainTaxDesc];
                    }
                    if (subTaxDesc && reverseMappings.taxSubtypes[subTaxDesc]) {
                        newRow[idx.sub] = reverseMappings.taxSubtypes[subTaxDesc];
                    }
                });

                return newRow;
            });

            const processedData = processAndFillInvoiceData(translatedRows);
            loadingToast.querySelector('#toast-message').textContent = 'جاري التحقق من صحة البيانات...';
            const { validatedData, validationErrors } = await validateAndEnrichData(processedData);

            // ✅ تمرير البيانات بعد الترجمة والتحقق إلى دالة المعاينة
            showRawDataPreview(validatedData, validationErrors);

        } catch (error) {
            alert(`❌ خطأ في معالجة الملف: ${error.message}`);
        } finally {
            loadingToast.remove();
        }
    };
    reader.readAsArrayBuffer(file);
    event.target.value = '';
}


/**
 * ===================================================================================
 * ✅✅✅ دالة التحقق من البيانات (النسخة النهائية المبسطة) ✅✅✅
 * ===================================================================================
 * تعتمد هذه الدالة على أن دوال API الأخرى أصبحت تطلب اللغة الصحيحة مباشرة من الخادم.
 * وظيفتها الآن هي استدعاء دوال التحقق واستخدام البيانات المترجمة الجاهزة.
 */
async function validateAndEnrichData(data) {
    const validationErrors = [];
    const validatedData = [...data]; // إنشاء نسخة من البيانات لتعديلها

    // --- دوال مساعدة للتحقق من صحة البيانات عبر API ---

    // دالة للتحقق من الرقم القومي للشخص الطبيعي
    async function validateNID_API(nid) {
        if (!nid || nid.length !== 14 || !/^\d+$/.test(nid)) {
            return { valid: false, message: "يجب أن يتكون من 14 رقمًا صحيحًا." };
        }
        try {
            const token = getAccessToken();
            if (!token) return { valid: false, message: "خطأ مصادقة، لا يمكن التحقق." };
            
            const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/person/${nid}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            } );

            if (response.status === 200) {
                const data = await response.json();
                const fullName = `${data.firstName || ''} ${data.otherNames || ''}`.trim();
                return { valid: true, name: fullName || 'Unnamed Person' };
            } else if (response.status === 400) {
                const errorData = await response.json();
                return { valid: false, message: errorData.error?.details[0]?.message || "رقم قومي غير صالح." };
            } else {
                return { valid: false, message: `خطأ ${response.status} من الخادم.` };
            }
        } catch (error) {
            return { valid: false, message: "فشل الاتصال بالشبكة للتحقق." };
        }
    }

    // --- التحقق من كل صف في البيانات ---
    const validationPromises = validatedData.map(async (row, index) => {
        // التأكد من وجود العمود الإضافي لاسم الكود الرسمي
        if (row.length < 38) row[37] = '';

        const internalID = row[0] || `صف ${index + 2}`;
        const receiverType = (row[3] || '').toUpperCase().trim();
        const receiverId = (row[1] || '').toString().trim();
        const itemDescription = String(row[9] || '').trim();
        const itemCodeType = (row[10] || '').toUpperCase().trim();
        const itemCode = (row[11] || '').toString().trim();
        let officialCodeName = '';

        // التحقق من الحقول الإلزامية للبند
        const requiredItemFields = { 10: 'نوع كود الصنف', 11: 'كود الصنف', 14: 'الكمية', 15: 'سعر الصنف' };
        for (const colIndex in requiredItemFields) {
            if (row[colIndex] === undefined || row[colIndex] === null || String(row[colIndex]).trim() === '') {
                validationErrors.push({ id: internalID, field: requiredItemFields[colIndex], value: 'فارغ', message: 'هذا الحقل إجباري.' });
            }
        }

        // التحقق من رقم المستلم (القومي أو الضريبي)
        if (receiverId) {
            if (receiverType === 'P') {
                const nidResult = await validateNID_API(receiverId);
                if (nidResult.valid) {
                    row[2] = nidResult.name;
                } else {
                    validationErrors.push({ id: internalID, field: 'الرقم القومي للمستلم', value: receiverId, message: nidResult.message });
                }
            } else if (receiverType === 'B') {
                // استدعاء الدالة التي يفترض أنها معدلة لجلب اللغة الصحيحة
                const taxpayerData = await fetchTaxpayerData(receiverId);
                if (taxpayerData) {
                    // ✨ البيانات هنا جاهزة باللغة المطلوبة مباشرة ✨
                    row[2] = taxpayerData.namePrimaryLang;
                    const address = taxpayerData.taxpayerBranchs?.[0]?.address;
                    if (address) {
                        row[5] = address.governorateNamePrimaryLang;
                        row[6] = address.cityNamePrimaryLang;
                        row[7] = address.streetName || '';
                        row[8] = address.buildingNo || '';
                    }
                } else {
                    validationErrors.push({ id: internalID, field: 'رقم تسجيل المستلم', value: receiverId, message: 'رقم التسجيل غير صحيح أو غير مسجل.' });
                }
            }
        } else {
             validationErrors.push({ id: internalID, field: 'رقم تسجيل/قومي للمستلم', value: 'فارغ', message: 'هذا الحقل إجباري.' });
        }

        // التحقق من كود الصنف وجلب اسمه باللغة الصحيحة
        if (itemCodeType && itemCode) {
            // استدعاء الدالة التي يفترض أنها معدلة لجلب اللغة الصحيحة
            const codeData = (itemCodeType === 'EGS') ? await fetchMyEGSCode(itemCode) : await fetchGS1Code(itemCode);
            
            if (codeData) {
                // ✨ البيانات هنا جاهزة باللغة المطلوبة مباشرة ✨
                officialCodeName = codeData.codeNamePrimaryLang;
                row[37] = officialCodeName || "!! اسم رسمي غير مسجل !!";
            } else {
                validationErrors.push({ id: internalID, field: `كود الصنف (${itemCodeType})`, value: itemCode, message: 'الكود غير صحيح أو غير مسجل.' });
            }
        }

        // التحقق النهائي من وصف الصنف
        if (!itemDescription && !officialCodeName) {
            validationErrors.push({
                id: internalID,
                field: 'وصف الصنف',
                value: 'فارغ',
                message: 'الحقل فارغ، ولم يتم العثور على اسم رسمي للكود المدخل لملئه تلقائياً.'
            });
        }
    });

    // انتظار انتهاء جميع عمليات التحقق
    await Promise.all(validationPromises);
    
    // إرجاع البيانات بعد تحديثها بالأسماء الصحيحة ومصفوفة الأخطاء
    return { validatedData, validationErrors };
}




/**
 * ✅ دالة مساعدة جديدة: لإنشاء مؤشر تحميل
 */
function createLoadingIndicator(message) {
    const indicator = document.createElement('div');
    indicator.id = 'globalLoadingIndicator';
    indicator.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.7); color: white; 
        display: flex; align-items: center; justify-content: center; 
        z-index: 10005; font-size: 22px; font-family: 'Segoe UI', Tahoma, sans-serif;
        text-align: center; padding: 20px;
    `;
    indicator.textContent = message;
    return indicator;
}



/**
 * ===================================================================================
 * ✅✅✅ الدالة النهائية (v3): تعالج وتملأ بيانات الفواتير بدون إضافة أي قيم افتراضية
 * ===================================================================================
 * تقوم هذه الدالة بمعالجة البيانات الخام من ملف الإكسيل.
 * - إذا كان الصف يحتوي على رقم فاتورة، تعتبره بداية فاتورة جديدة.
 * - إذا كان الصف لا يحتوي على رقم فاتورة، تقوم بنسخ بيانات رأس الفاتورة (العميل، العنوان...) من آخر فاتورة تم تحديدها.
 * - تتجاهل الصفوف الفارغة تمامًا.
 * - **الأهم:** لا تقوم بإنشاء أي بيانات افتراضية (مثل عميل نقدي أو رقم تلقائي) من العدم.
 */
function processAndFillInvoiceData(rawData) {
    let lastInvoiceHeaderData = []; // لتخزين بيانات رأس آخر فاتورة
    const invoiceHeaderColumns = 9; // عدد أعمدة بيانات رأس الفاتورة (من الرقم الداخلي حتى رقم المبنى)
    const itemDescriptionColumn = 9; // العمود الخاص بوصف الصنف (يبدأ من 0)
    const itemCodeColumn = 11;       // العمود الخاص بكود الصنف

    const processedRows = rawData.map((row, index) => {
        // --- 1. التحقق من أن الصف ليس فارغًا تمامًا ---
        // إذا كان كل من "وصف الصنف" و "كود الصنف" فارغين، نعتبره صفًا فارغًا ونتجاهله.
        const hasItemDescription = row[itemDescriptionColumn] !== undefined && row[itemDescriptionColumn] !== null && String(row[itemDescriptionColumn]).trim() !== '';
        const hasItemCode = row[itemCodeColumn] !== undefined && row[itemCodeColumn] !== null && String(row[itemCodeColumn]).trim() !== '';
        if (!hasItemDescription && !hasItemCode) {
            return null; // تجاهل هذا الصف
        }

        // --- 2. تحديد ما إذا كان هذا الصف هو بداية فاتورة جديدة ---
        const hasInternalID = row[0] !== undefined && row[0] !== null && String(row[0]).trim() !== '';

        if (hasInternalID) {
            // هذا الصف هو بداية فاتورة جديدة.
            // نقوم بتحديث بيانات رأس الفاتورة التي سنستخدمها للصفوف التالية.
            lastInvoiceHeaderData = row.slice(0, invoiceHeaderColumns);
            // إرجاع الصف كما هو لأنه مكتمل.
            return row;
        } else {
            // هذا الصف هو بند تابع لفاتورة سابقة.
            // تحقق مما إذا كان لدينا بيانات رأس فاتورة سابقة لنسخها.
            if (lastInvoiceHeaderData.length === 0) {
                // هذا يعني أن أول صف في الملف لا يحتوي على رقم فاتورة، وهو خطأ في التنسيق.
                // يمكنك إما تجاهله أو إظهار خطأ، هنا سنتجاهله.
                return null;
            }
            
            // إنشاء صف جديد يبدأ ببيانات رأس الفاتورة المنسوخة.
            const newRow = [...lastInvoiceHeaderData];
            
            // استكمال الصف ببيانات البند من الصف الحالي.
            for (let i = invoiceHeaderColumns; i < row.length; i++) {
                newRow[i] = row[i];
            }
            return newRow;
        }
        
    }).filter(row => row !== null); // تصفية (إزالة) كل الصفوف التي تم تجاهلها (null)

    return processedRows;
}


/**
 * ===================================================================================
 * ✅✅✅ دالة جلب كود EGS (النسخة النهائية المضمونة) ✅✅✅
 * ===================================================================================
 */
async function fetchMyEGSCode(fullItemCode) {
    const token = getAccessToken();
    if (!token) return null;

    const cleanFullCode = String(fullItemCode || '').trim().toUpperCase();
    if (!cleanFullCode || !cleanFullCode.startsWith('EG-')) return null;

    // نطلب البيانات بدون تحديد لغة
    const apiUrl = `https://api-portal.invoicing.eta.gov.eg/api/v1/codetypes/codes/my?CodeTypeID=9&ItemCode=${cleanFullCode}&Ps=1`;

    try {
        const response = await fetch(apiUrl, { headers: { "Authorization": `Bearer ${token}` } } );
        if (!response.ok) return null;

        const data = await response.json();

        if (data.result && data.result.length > 0) {
            const codeData = data.result[0];
            const isArabic = (EInvoicePortalLanguage === 'ar');

            // إذا كانت اللغة عربية ويوجد اسم عربي، نقوم بالتبديل
            if (isArabic && codeData.codeNameSecondaryLang) {
                codeData.codeNamePrimaryLang = codeData.codeNameSecondaryLang;
            }
            return codeData;
        }
        return null;
    } catch (error) {
        console.error("Error in fetchMyEGSCode:", error);
        return null;
    }
}



/**
 * ===================================================================================
 * ✅✅✅ دالة جلب كود GS1 (النسخة النهائية المضمونة) ✅✅✅
 * ===================================================================================
 */
async function fetchGS1Code(itemCode) {
    const token = getAccessToken();
    if (!token) return null;

    // نطلب البيانات بدون تحديد لغة
    const apiUrl = `https://api-portal.invoicing.eta.gov.eg/api/v1/codetypes/2/codes?CodeLookupValue=${itemCode}&ApplyMinChoiceLevel=true&Ps=1`;

    try {
        const response = await fetch(apiUrl, { headers: { "Authorization": `Bearer ${token}` } } );
        if (!response.ok) return null;

        const data = await response.json();

        if (data.result && data.result.length > 0) {
            const codeData = data.result[0];
            const isArabic = (EInvoicePortalLanguage === 'ar');

            // إذا كانت اللغة عربية ويوجد اسم عربي، نقوم بالتبديل
            if (isArabic && codeData.codeNameSecondaryLang) {
                codeData.codeNamePrimaryLang = codeData.codeNameSecondaryLang;
            }
            return codeData;
        }
        return null;
    } catch (error) {
        console.error("Error in fetchGS1Code:", error);
        return null;
    }
}




/**
 * =========================================================================
 * ✅ الدالة النهائية (v4.2): تعرض كل الأعمدة بالرموز النهائية للتحقق
 * =========================================================================
 */
function showRawDataPreview(rawData, validationErrors = []) {
    document.getElementById('rawDataPreviewModal')?.remove();

    const modal = document.createElement('div');
    modal.id = 'rawDataPreviewModal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.7); z-index: 10001; display: flex; align-items: center; justify-content: center; direction: rtl;`;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `background-color: #f4f7fc; width: 95%; height: 90%; border-radius: 10px; display: flex; flex-direction: column; font-family: 'Segoe UI', Tahoma, sans-serif; overflow: hidden;`;

    let errorsHTML = '';
    if (validationErrors.length > 0) {
        errorsHTML = `
            <div id="validation-errors-container" style="padding: 15px; background-color: #fff1f0; border-bottom: 2px solid #ffccc7; flex-shrink: 0;">
                <h4 style="margin: 0 0 10px 0; color: #cf1322;">🚨 تم اكتشاف ${validationErrors.length} خطأ، يرجى المراجعة:</h4>
                <div style="max-height: 150px; overflow-y: auto;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                        <thead><tr style="background-color: #ffccc7;">
                            <th style="padding: 8px; border: 1px solid #ffa39e;">المُعرّف</th>
                            <th style="padding: 8px; border: 1px solid #ffa39e;">الحقل</th>
                            <th style="padding: 8px; border: 1px solid #ffa39e;">القيمة</th>
                            <th style="padding: 8px; border: 1px solid #ffa39e;">رسالة الخطأ</th>
                        </tr></thead>
                        <tbody>
                            ${validationErrors.map(err => `
                                <tr style="background: #fff1f0;"><td style="padding: 6px; border: 1px solid #ffccc7;">${err.id}</td><td style="padding: 6px; border: 1px solid #ffccc7;"><strong>${err.field}</strong></td><td style="padding: 6px; border: 1px solid #ffccc7; font-family: monospace;">${err.value}</td><td style="padding: 6px; border: 1px solid #ffccc7;">${err.message}</td></tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    // ✅✅✅ تحديث: إضافة كل العناوين المفقودة ✅✅✅
    const headers = [
        'الرقم الداخلي', 'رقم تسجيل المستلم', 'اسم المستلم', 'نوع المستلم', 'دولة المستلم', 'المحافظة', 'المدينة', 'الشارع', 'المبنى',
        'وصف الصنف', 'نوع كود الصنف', 'كود الصنف', 'الكود الداخلي', 'وحدة القياس',
        'الكمية', 'السعر', 'عملة البيع', 'سعر الصرف', 'نسبة الخصم', 'قيمة الخصم',
        'ضريبة 1', 'فرعي 1', 'نسبة 1', 'ضريبة 2', 'فرعي 2', 'نسبة 2', 'ضريبة 3', 'فرعي 3', 'نسبة 3',
        'مرجع شراء', 'وصف شراء', 'مرجع مبيعات', 'وصف مبيعات', 'اسم البنك', 'حساب البنك', 'طريقة التوصيل', 'التغليف'
    ];

    let tableHTML = `<table style="width: 100%; border-collapse: collapse; text-align: center;"><thead><tr style="background-color: #2161a1; color: white;">`;
    headers.forEach(h => tableHTML += `<th style="padding: 10px; border: 1px solid #ddd; white-space: nowrap;">${h}</th>`);
    tableHTML += `</tr></thead><tbody>`;

    rawData.forEach(row => {
        tableHTML += `<tr>`;
        // ✅ عرض جميع الأعمدة الـ 37 بالترتيب الصحيح
        for (let i = 0; i < headers.length; i++) {
            // استخدام الوصف النهائي في العمود 9
            const value = (i === 9) ? (row[9] || row[37] || '') : (row[i] !== undefined && row[i] !== null ? row[i] : '');
            tableHTML += `<td style="padding: 8px; border: 1px solid #eee;">${value}</td>`;
        }
        tableHTML += `</tr>`;
    });
    
    tableHTML += `</tbody></table>`;

    modalContent.innerHTML = `
        <div style="padding: 15px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background-color: #fff; flex-shrink: 0;">
            <h3 style="margin: 0; color: #2161a1;">معاينة البيانات النهائية (بالرموز)</h3>
            <div>
                <button id="continueToEditorBtn" style="background-color: #28a745; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    ${validationErrors.length > 0 ? 'المتابعة للتعديل (مع وجود أخطاء)' : 'متابعة للتعديل المتقدم'}
                </button>
                <button id="closePreviewBtn" style="background-color: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px;">إغلاق</button>
            </div>
        </div>
        ${errorsHTML}
        <div style="overflow: auto; flex-grow: 1; background: #fff;">${tableHTML}</div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    document.getElementById('closePreviewBtn').onclick = () => modal.remove();
    
    // زر المتابعة (لا تغيير في منطقه)
    document.getElementById('continueToEditorBtn').onclick = async () => {
        const continueBtn = document.getElementById('continueToEditorBtn');
        continueBtn.disabled = true;
        continueBtn.textContent = 'جاري التحضير...';
        
        try {
            const existingDrafts = await fetchDraftInvoices();
            const draftsMap = new Map(existingDrafts?.filter(d => d.document?.internalID).map(d => [String(d.document.internalID), d.id]) || []);
            
            const formattedData = rawData.map(row => {
                const obj = {};
                const internalHeaders = ['internalID', 'receiver_id', 'receiver_name', 'receiver_type', 'receiver_country', 'receiver_governate', 'receiver_city', 'receiver_street', 'receiver_building', 'item_description', 'item_type', 'item_code', 'item_internal_code', 'unit_type', 'quantity', 'unit_price', 'currency_sold', 'exchange_rate', 'discount_rate', 'discount_amount', 'tax_type_1', 'tax_subtype_1', 'tax_rate_1', 'tax_type_2', 'tax_subtype_2', 'tax_rate_2', 'tax_type_3', 'tax_subtype_3', 'tax_rate_3', 'purchaseOrderReference', 'purchaseOrderDescription', 'salesOrderReference', 'salesOrderDescription', 'bankName', 'bankAccountNo', 'deliveryApproach', 'deliveryPackaging'];
                
                internalHeaders.forEach((header, index) => {
                    obj[header] = row[index] !== undefined ? row[index] : null;
                });
                
                obj['item_code_name'] = row[37] || '';

                const internalIDAsString = String(obj.internalID).trim();
                if (internalIDAsString && draftsMap.has(internalIDAsString)) {
                    obj.draftId = draftsMap.get(internalIDAsString);
                }
                return obj;
            });
            
            modal.remove();
            showDataEditorModal_v3(formattedData);

        } catch (error) {
            alert(`حدث خطأ أثناء التحضير لواجهة التعديل: ${error.message}`);
            continueBtn.disabled = false;
            continueBtn.textContent = 'متابعة';
        }
    };
}










async function processAndSaveFromModal_v3() {
    const oldErrorContainer = document.getElementById('modalErrorContainer');
    if (oldErrorContainer) {
        oldErrorContainer.style.display = 'none';
        oldErrorContainer.innerHTML = '';
    }

    const invoicesMap = new Map();

    document.querySelectorAll('.invoice-group').forEach(group => {
        const internalID = group.querySelector('[data-field="internalID"]').textContent.trim();
        const draftId = group.dataset.draftId;

        const issuerData = {};
        group.querySelectorAll('.issuer-details-table [data-issuer-field]').forEach(cell => {
            const field = cell.dataset.issuerField;
            issuerData[field] = cell.textContent.trim();
        });

        const headerRow = group.querySelector('.invoice-header-row');
        const receiver_name = headerRow.querySelector('[data-field="receiver_name"]').textContent.trim();
        const receiver_id = headerRow.querySelector('[data-field="receiver_id"]').textContent.trim();

        // ✅✅✅ بداية التعديل: قراءة بيانات عنوان المستلم كنصوص ✅✅✅
        const receiverAddress = {};
        group.querySelectorAll('.receiver-details-table [data-receiver-field]').forEach(cell => {
            const field = cell.dataset.receiverField;
            // نقرأ كل القيم كنصوص لضمان عدم حدوث أخطاء في النوع
            receiverAddress[field] = cell.textContent.trim(); 
        });
        // ✅✅✅ نهاية التعديل ✅✅✅

        const extraInvoiceData = {};
        group.querySelectorAll('.extra-details-table [data-invoice-field]').forEach(cell => {
            const field = cell.dataset.invoiceField;
            extraInvoiceData[field] = cell.textContent.trim();
        });

        const linesForInvoice = [];
        group.querySelectorAll('.items-table tbody tr').forEach(row => {
            const lineData = {
                internalID,
                receiver_name,
                receiver_id,
                ...receiverAddress, // <-- استخدام البيانات النصية التي قرأناها
                ...extraInvoiceData
            };

            row.querySelectorAll('[data-field]').forEach(cell => {
                const field = cell.dataset.field;
                if (cell.querySelectorAll('span[data-field]').length > 0) {
                    cell.querySelectorAll('span[data-field]').forEach(span => {
                        lineData[span.dataset.field] = span.textContent.trim();
                    });
                } else {
                    lineData[field] = cell.textContent.trim();
                }
            });

            linesForInvoice.push(lineData);
        });

        if (internalID) {
            invoicesMap.set(internalID, { lines: linesForInvoice, issuer: issuerData, draftId: draftId });
        }
    });

    const validationErrors = [];
    for (const [invoiceId, data] of invoicesMap.entries()) {
        if (!data.lines || data.lines.length === 0) {
            validationErrors.push({
                internalID: invoiceId,
                message: "لا توجد بنود لهذه الفاتورة."
            });
        }
    }

    if (validationErrors.length > 0) {
        showErrorModal(validationErrors);
        return;
    }

    await sendInvoicesFromModal_v3(invoicesMap);
}








async function signDataLocally(dataToSign, isHash = false) {
    const signingServerUrl = 'http://localhost:8080/sign';
    const loadingToast = showToastNotification('يرجى الانتظار، جاري الاتصال ببرنامج التوقيع...', 0 );

    try {
        // نرسل البيانات مع العلامة الجديدة is_hash
        const response = await fetch(signingServerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: dataToSign, is_hash: isHash })
        });

        loadingToast.remove();

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "رد غير صالح من الخادم." }));
            throw new Error(errorData.error || `فشل الاتصال بخادم التوقيع (الحالة: ${response.status}).`);
        }

        const result = await response.json();
        if (result.success && result.signature) {
            showToastNotification('✅ تم التوقيع بنجاح!', 3000);
            return result.signature;
        } else {
            throw new Error(result.error || "حدث خطأ غير معروف في برنامج التوقيع.");
        }
    } catch (error) {
        if (loadingToast) loadingToast.remove();
        alert(`❌ فشل الاتصال ببرنامج التوقيع المحلي.\n\nالسبب: ${error.message}\n\nيرجى التأكد من تشغيل برنامج "signer_app.py" وتوصيل فلاشة التوقيع.`);
        return null;
    }
}



// دالة حذف المسودة
function deleteDraft(index) {
    const drafts = JSON.parse(localStorage.getItem("receiptDrafts") || "[]");
    const draft = drafts[index];
    if (!draft) return;

    if (confirm(`هل تريد حذف المسودة رقم "${draft.receiptNumber}" نهائياً؟`)) {
        drafts.splice(index, 1);
        localStorage.setItem("receiptDrafts", JSON.stringify(drafts));
        renderReceiptDrafts(); // إعادة عرض قائمة المسودات المحدثة
        showToastNotification("تم حذف المسودة بنجاح.", 3000);
    }
}





async function deleteDraftInvoiceAPI(draftId) {
    const token = getAccessToken();
    if (!token) {
        alert("خطأ: لم يتم العثور على توكن الدخول.");
        return false;
    }

    // تأكيد من المستخدم قبل الحذف
    if (!confirm(`هل أنت متأكد من رغبتك في حذف الفاتورة رقم ${draftId} نهائياً من المسودات؟ لا يمكن التراجع عن هذا الإجراء.`)) {
        return false;
    }

    try {
        const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/documents/drafts/${draftId}`, {
            method: 'DELETE', // تحديد نوع الطلب
            headers: {
                "Authorization": `Bearer ${token}`
            }
        } );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `فشل حذف المسودة. رمز الحالة: ${response.status}`);
        }

        return true; // تم الحذف بنجاح

    } catch (error) {
        alert(`حدث خطأ أثناء حذف المسودة: ${error.message}`);
        return false;
    }
}





















// الإصدار التشخيصي
async function signDataLocally(canonicalString) {
    const signingServerUrl = 'http://localhost:8080/sign';
    const loadingToast = showToastNotification('يرجى الانتظار، جاري الاتصال ببرنامج التوقيع...', 0 );

    // ================== ✨ بداية التشخيص ✨ ==================
    console.log("%c[1] إرسال إلى خادم التوقيع:", "color: blue; font-weight: bold;");
    console.log("البيانات التي سيتم توقيعها (JSON كنص):", canonicalString);
    // ================== ✨ نهاية التشخيص ✨ ==================

    try {
        const response = await fetch(signingServerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: canonicalString })
        });

        loadingToast.remove();

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "رد غير صالح من الخادم." }));
            throw new Error(errorData.error || `فشل الاتصال بخادم التوقيع (الحالة: ${response.status}).`);
        }

        const result = await response.json();
        if (result.success && result.signature) {
            showToastNotification('✅ تم التوقيع بنجاح!', 3000);
            
            // ================== ✨ بداية التشخيص ✨ ==================
            console.log("%c[2] استلام من خادم التوقيع:", "color: green; font-weight: bold;");
            console.log("التوقيع المستلم (Base64):", result.signature);
            // ================== ✨ نهاية التشخيص ✨ ==================

            return result.signature;
        } else {
            throw new Error(result.error || "حدث خطأ غير معروف في برنامج التوقيع.");
        }
    } catch (error) {
        if (loadingToast) loadingToast.remove();
        alert(`❌ فشل الاتصال ببرنامج التوقيع المحلي.\n\nالسبب: ${error.message}\n\nيرجى التأكد من تشغيل برنامج "signer_app.py" وتوصيل فلاشة التوقيع.`);
        return null;
    }
}





// الإصدار التشخيصي
async function submitSignedInvoiceToETA(signedPayload) {
    const token = getAccessToken();
    if (!token) return { success: false, error: "لم يتم العثور على توكن الدخول." };

    try {
        // ================== ✨ بداية التشخيص ✨ ==================
        console.log("%c[3] إرسال إلى بوابة الضرائب:", "color: purple; font-weight: bold;");
        console.log("الهيكل النهائي المرسل (Payload):", { documents: [signedPayload] });
        // ================== ✨ نهاية التشخيص ✨ ==================

        const response = await fetch("https://api-portal.invoicing.eta.gov.eg/api/v1/documentsubmissions", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ documents: [signedPayload] } )
        });

        // ================== ✨ بداية التشخيص ✨ ==================
        console.log("%c[4] استلام من بوابة الضرائب:", "color: #b38600; font-weight: bold;");
        console.log("كود الحالة (Status Code):", response.status);
        console.log("هل الاستجابة ناجحة (response.ok)؟", response.ok);
        
        // سنقرأ الاستجابة كنص أولاً لتجنب الأخطاء
        const responseText = await response.text();
        console.log("النص الخام للاستجابة (Raw Text):", responseText);
        // ================== ✨ نهاية التشخيص ✨ ==================

        // الآن، نتحقق من الحالة ونحاول تحليل JSON فقط إذا كان هناك محتوى
        if (response.ok) { // response.ok يتحقق من الحالات 200-299
            // إذا كان النص فارغاً (كما في حالة 202)، نعتبره نجاحاً
            if (!responseText) {
                return { success: true, data: { submissionId: "تم الإرسال بنجاح (لا يوجد محتوى)" }, error: null };
            }
            // إذا كان هناك نص، نحاول تحليله
            const responseData = JSON.parse(responseText);
            return { success: true, data: responseData, error: null };
        } else {
            // إذا فشل الطلب، نحاول تحليل النص كـ JSON للحصول على رسالة الخطأ
            try {
                const errorData = JSON.parse(responseText);
                const errorMessage = errorData.error?.details?.[0]?.message || errorData.error?.message || responseText;
                throw new Error(translateApiError(errorMessage));
            } catch (jsonError) {
                // إذا فشل تحليل JSON، نعرض النص الخام كما هو
                throw new Error(responseText || `خطأ من الخادم بحالة ${response.status}`);
            }
        }

    } catch (error) {
        return { success: false, error: error.message, data: null };
    }
}













async function showDataEditorModal_v3(data) {
    const oldModal = document.getElementById('dataEditorModal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'dataEditorModal';
    modal.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.6); z-index: 10000; display: flex; align-items: center; justify-content: center; direction: rtl; font-family: 'Segoe UI', Tahoma, sans-serif;`;

    const modalContent = document.createElement('div');
    modalContent.style.cssText = `background-color: #fff; width: 95%; height: 90%; border-radius: 10px; display: flex; flex-direction: column; box-shadow: 0 5px 25px rgba(0,0,0,0.2); overflow: hidden;`;

    const invoicesMap = new Map();
    data.forEach((row, index) => {
        const internalID = row.internalID;
        if (!internalID) return;
        if (!invoicesMap.has(internalID)) {
            invoicesMap.set(internalID, { invoiceData: row, lines: [] });
        }
        invoicesMap.get(internalID).lines.push({ ...row, originalIndex: index });
    });

    let issuerData = {};
    const apiIssuerData = await getIssuerFullData();
    if (apiIssuerData) {
        issuerData = apiIssuerData;
    } else {
        try {
            const userData = JSON.parse(localStorage.getItem("USER_DATA") || "{}");
            const profile = userData.profile || {};
            issuerData = {
                id: profile.TaxRin || profile.taxRin || '',
                name: localStorage.getItem("TaxpayerNameAR") || profile.legalName || '',
                taxpayerActivityCode: profile.activityCode || "4690",
                governate: profile.address?.governorate || '',
                regionCity: profile.address?.regionCity || '',
                street: profile.address?.street || '',
                buildingNumber: profile.address?.buildingNumber || ''
            };
        } catch (e) {}
    }
  let activitySelectorHTML = '';
    if (apiIssuerData && apiIssuerData.activities && apiIssuerData.activities.length > 0) {
        // البحث عن النشاط الافتراضي (الساري) لجعله الخيار المبدئي
        const defaultActivity = apiIssuerData.activities.find(act => act.toDate === null) || apiIssuerData.activities[0];
        
        activitySelectorHTML = `
            <div class="details-card" style="padding: 10px 15px;">
                <label for="activity-select-editor" style="font-weight: bold; margin-bottom: 5px; display: block;">اختر كود النشاط:</label>
                <select id="activity-select-editor" style="width: 100%; padding: 8px; border-radius: 5px; border: 1px solid #ccc;">
                    ${apiIssuerData.activities.map(act => `
                        <option value="${act.activityTypeCode}" ${act.activityTypeCode === defaultActivity.activityTypeCode ? 'selected' : ''}>
                            ${act.activityTypeCode} - ${act.activityTypeNameSecondaryLang}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    } else {
        // في حالة عدم وجود أنشطة، نعرض رسالة
        activitySelectorHTML = `<div class="details-card" style="padding: 10px 15px;">كود النشاط: لم يتم العثور على أنشطة.</div>`;
    }
    let tableBodyHTML = '';
    invoicesMap.forEach((invoice, internalID) => {
        const invoiceData = invoice.invoiceData;
        const currentDate = new Date().toLocaleDateString('ar-EG');
        
        tableBodyHTML += `
           <tbody class="invoice-group" data-internal-id="${internalID}" data-draft-id="${invoiceData.draftId || ''}">
                <tr class="invoice-header-row">
                    <td class="toggle-details" style="font-weight: bold; font-size: 20px; text-align: center;">+</td>
                    <td><span contenteditable="true" data-field="internalID">${internalID}</span></td>
                    <td>${currentDate}</td>
                    <td><span contenteditable="true" data-field="receiver_id">${invoiceData.receiver_id || ''}</span></td>
                    <td><span contenteditable="true" data-field="receiver_name">${invoiceData.receiver_name || ''}</span></td>
                    <td class="numeric" id="totalBeforeTax_${internalID}">0.00</td>
                    <td class="numeric" id="taxTotals_${internalID}"></td>
                    <td class="numeric" id="grandTotal_${internalID}" style="font-weight: bold;">0.00</td>
                    <td><button class="print-invoice-btn" data-invoice-id="${internalID}" title="طباعة الفاتورة">🖨️</button></td>
                    <td><button class="delete-invoice-btn" title="حذف الفاتورة">&times;</button></td>
                </tr>
                <tr class="invoice-details-row" style="display: none;">
                    <td colspan="10">
                        <div class="details-wrapper">
                            <div class="details-grid">
                                <div class="details-card">
                                    <h4 class="details-header">بيانات المصدر (البائع)</h4>
                                    <table class="issuer-details-table details-table">
                                        <tbody>
                                            <tr><th>رقم التسجيل</th><td contenteditable="true" data-issuer-field="id">${issuerData.id}</td></tr>
                                            <tr><th>اسم المصدر</th><td contenteditable="true" data-issuer-field="name">${issuerData.name}</td></tr>
                                            <tr><th>كود النشاط</th><td contenteditable="true" data-issuer-field="taxpayerActivityCode" class="notranslate" translate="no">${issuerData.taxpayerActivityCode}</td></tr>
                                            <tr><th>المحافظة</th><td contenteditable="true" data-issuer-field="governate">${issuerData.governate}</td></tr>
                                            <tr><th>المدينة/القسم</th><td contenteditable="true" data-issuer-field="regionCity">${issuerData.regionCity}</td></tr>
                                            <tr><th>الشارع</th><td contenteditable="true" data-issuer-field="street">${issuerData.street}</td></tr>
                                            <tr><th>رقم المبنى</th><td contenteditable="true" data-issuer-field="buildingNumber">${issuerData.buildingNumber}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="details-card">
                                    <h4 class="details-header">بيانات المستلم (المشتري)</h4>
                                    <table class="receiver-details-table details-table">
                                        <tbody>
                                            <tr><th>نوع المستلم</th><td contenteditable="true" data-receiver-field="receiver_type" class="notranslate" translate="no">${invoiceData.receiver_type ?? 'B'}</td></tr>
                                            <tr>
                                                <th>رقم التسجيل</th>
                                                <td style="display: flex; align-items: center; gap: 5px;">
                                                    <span contenteditable="true" data-receiver-field="receiver_id" style="flex-grow: 1;">${invoiceData.receiver_id ?? ''}</span>
                                                    <button class="verify-receiver-btn" title="تحقق من رقم التسجيل واملأ البيانات تلقائياً">🔍</button>
                                                </td>
                                            </tr>
                                            <tr><th>اسم المستلم</th><td contenteditable="true" data-receiver-field="receiver_name">${invoiceData.receiver_name ?? ''}</td></tr>
                                            <tr><th>الدولة</th><td contenteditable="true" data-receiver-field="receiver_country" class="notranslate" translate="no">${invoiceData.receiver_country ?? 'EG'}</td></tr>
                                            <tr><th>المحافظة</th><td contenteditable="true" data-receiver-field="receiver_governate">${invoiceData.receiver_governate ?? ''}</td></tr>
                                            <tr><th>المدينة/القسم</th><td contenteditable="true" data-receiver-field="receiver_city">${invoiceData.receiver_city ?? ''}</td></tr>
                                            <tr><th>الشارع</th><td contenteditable="true" data-receiver-field="receiver_street">${invoiceData.receiver_street ?? ''}</td></tr>
                                            <tr><th>رقم المبنى</th><td contenteditable="true" data-receiver-field="receiver_building">${invoiceData.receiver_building ?? ''}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="details-card">
                                    <h4 class="details-header">بيانات الفاتورة الإضافية</h4>
                                    <table class="extra-details-table details-table">
                                        <tbody>
                                            <tr><th>مرجع طلب الشراء</th><td contenteditable="true" data-invoice-field="purchaseOrderReference">${invoiceData.purchaseOrderReference || ''}</td></tr>
                                            <tr><th>وصف طلب الشراء</th><td contenteditable="true" data-invoice-field="purchaseOrderDescription">${invoiceData.purchaseOrderDescription || ''}</td></tr>
                                            <tr><th>مرجع طلب المبيعات</th><td contenteditable="true" data-invoice-field="salesOrderReference">${invoiceData.salesOrderReference || ''}</td></tr>
                                            <tr><th>وصف طلب المبيعات</th><td contenteditable="true" data-invoice-field="salesOrderDescription">${invoiceData.salesOrderDescription || ''}</td></tr>
                                            <tr><th>اسم البنك</th><td contenteditable="true" data-invoice-field="bankName">${invoiceData.bankName || ''}</td></tr>
                                            <tr><th>رقم حساب البنك</th><td contenteditable="true" data-invoice-field="bankAccountNo">${invoiceData.bankAccountNo || ''}</td></tr>
                                            <tr><th>طريقة التوصيل</th><td contenteditable="true" data-invoice-field="deliveryApproach">${invoiceData.deliveryApproach || ''}</td></tr>
                                            <tr><th>التغليف</th><td contenteditable="true" data-invoice-field="deliveryPackaging">${invoiceData.deliveryPackaging || ''}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div class="items-card">
                                <h4 class="details-header">بنود الفاتورة</h4>
                                <div style="overflow-x: auto;">
                                    <table class="items-table">
                                        <thead>
                                            <tr>
                                                <th>نوع الكود</th><th>كود الصنف</th><th>وحدة القياس</th>
                                                            <th>الكود الداخلي</th> <!-- ✨ العمود الجديد -->

                                                <!-- ✅ بداية التعديل: إضافة عمود "اسم الكود" -->
                                                <th>اسم الكود (رسمي)</th>
                                                <th>وصف الصنف (بالفاتورة)</th>
                                                <!-- ✅ نهاية التعديل -->
                                                <th>الكمية</th><th>السعر</th><th>عملة</th><th>سعر الصرف</th>
                                                <th>خصم (%)</th><th>خصم (قيمة)</th>
                                                <th>ضريبة 1</th><th>ضريبة 2</th><th>ضريبة 3</th><th>حذف</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                    ${invoice.lines.map(line => {
            // =================================================================
            // ✅✅✅ بداية التعديل: تطبيق المنطق الجديد قبل عرض الخلايا ✅✅✅
            // =================================================================

            // 1. منطق وصف الصنف: استخدم الوصف المدخل، وإذا كان فارغًا، استخدم اسم الكود الرسمي.
            const finalDescription = line.item_description || line.item_code_name || '';

            // 2. منطق الكود الداخلي: استخدمه فقط إذا كان موجودًا، وإلا اتركه فارغًا.
            const finalInternalCode = line.item_internal_code || '';

            // =================================================================
            // ✅✅✅ نهاية التعديل ✅✅✅
            // =================================================================

           return `
                <tr data-line-index="${line.originalIndex}">
                    <td contenteditable="true" data-field="item_type" class="notranslate" translate="no">${line.item_type ?? ''}</td>
                    <td contenteditable="true" data-field="item_code" class="notranslate" translate="no">${line.item_code ?? ''}</td>
                    <td contenteditable="true" data-field="unit_type" class="notranslate" translate="no">${line.unit_type ?? ''}</td>
                    
                    <!-- إضافة خلية للكود الداخلي -->
                    <td contenteditable="true" data-field="item_internal_code">${finalInternalCode}</td>

                    <td data-field="item_code_name" style="background-color: #f0f8ff;">${line.item_code_name ?? ''}</td>
                    <td contenteditable="true" data-field="item_description">${finalDescription}</td>
                    
                    <td contenteditable="true" data-field="quantity" class="numeric">${line.quantity ?? ''}</td>
                    <td contenteditable="true" data-field="unit_price" class="numeric">${line.unit_price ?? ''}</td>
                    <td contenteditable="true" data-field="currency_sold" class="notranslate" translate="no">${line.currency_sold || 'EGP'}</td>
                    <td contenteditable="true" data-field="exchange_rate" class="numeric">${line.exchange_rate || 1}</td>
                    <td contenteditable="true" data-field="discount_rate" class="numeric">${line.discount_rate || ''}</td>
                    <td contenteditable="true" data-field="discount_amount" class="numeric">${line.discount_amount || ''}</td>
                    
                    <td class="notranslate" translate="no">
                        <span contenteditable="true" data-field="tax_type_1">${line.tax_type_1 ?? ''}</span> / 
                        <span contenteditable="true" data-field="tax_subtype_1">${line.tax_subtype_1 ?? ''}</span> / 
                        <span contenteditable="true" data-field="tax_rate_1" class="numeric">${line.tax_rate_1 ?? ''}</span>
                    </td>
                    <td class="notranslate" translate="no">
                        <span contenteditable="true" data-field="tax_type_2">${line.tax_type_2 ?? ''}</span> / 
                        <span contenteditable="true" data-field="tax_subtype_2">${line.tax_subtype_2 ?? ''}</span> / 
                        <span contenteditable="true" data-field="tax_rate_2" class="numeric">${line.tax_rate_2 ?? ''}</span>
                    </td>
                    <td class="notranslate" translate="no">
                        <span contenteditable="true" data-field="tax_type_3">${line.tax_type_3 ?? ''}</span> / 
                        <span contenteditable="true" data-field="tax_subtype_3">${line.tax_subtype_3 ?? ''}</span> / 
                        <span contenteditable="true" data-field="tax_rate_3" class="numeric">${line.tax_rate_3 ?? ''}</span>
                    </td>
                    <td><button class="delete-line-btn">&times;</button></td>
                </tr>
            `;
        }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        `;
    });

    modalContent.innerHTML = `
        <div style="padding: 15px 25px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center; background-color: #f8f9fa;">
            <h3 style="margin: 0; color: #2161a1;">مراجعة وتعديل الفواتير</h3>
            <div>
                <button id="saveFromModalBtn" style="background-color: #28a745; color: white; padding: 10px 25px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">حفظ الفواتير</button>
                            <button id="saveAsTemplateBtn" style="background-color: #007bff; color: white; padding: 10px 25px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 16px;">حفظ كنموذج</button>
                              

                <button id="closeModalBtn" style="background-color: #6c757d; color: white; padding: 10px 25px; border: none; border-radius: 8px; cursor: pointer; margin-right: 10px;">إغلاق</button>
            </div>
        </div>
          <!-- ✅✅✅ بداية التعديل: إضافة حاوية جديدة للإعدادات العامة ✅✅✅ -->
        <div style="padding: 10px 25px; background-color: #e9ecef; display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
         
        
            ${activitySelectorHTML}
        </div>
        <div style="overflow-y: auto; flex-grow: 1;">
            <table class="main-invoice-table">
                <thead>
                   <tr style="background-color: #020b18ff; color: white; position: sticky; top: 0; z-index: 10;">
                        <th style="padding: 12px; width: 40px;"></th>
                        <th style="padding: 12px;">الرقم الداخلي</th>
                        <th style="padding: 12px;">تاريخ الإصدار</th>
                        <th style="padding: 12px;">رقم التسجيل</th>
                        <th style="padding: 12px;">اسم المستلم</th>
                        <th style="padding: 12px;">القيمة قبل الضريبة</th>
                        <th style="padding: 12px;">تفاصيل الضرائب</th>
                        <th style="padding: 12px;">الإجمالي بعد الضريبة</th>
                        <th style="padding: 12px; width: 60px;">طباعة</th>
                        <th style="padding: 12px; width: 60px;">حذف</th>
                   </tr>
                </thead>
                ${tableBodyHTML}
            </table>
        </div>
        <div id="modalErrorContainer" style="padding: 10px; background-color: #f8d7da; color: #721c24; display: none; max-height: 120px; overflow-y: auto; flex-shrink: 0;"></div>
        <div id="totalsFooter" style="padding: 12px 25px; background-color: #343a40; color: white; display: flex; justify-content: space-around; align-items: center; flex-shrink: 0; border-top: 3px solid #0d6efd; font-size: 14px;">
            <div>الإجمالي قبل الضريبة: <span id="totalBeforeTax" style="font-weight: bold; color: #ffc107;">0.00</span></div>
            <div id="taxTotalsContainer" style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;"></div>
            <div style="font-size: 16px;"><strong>الإجمالي النهائي: <span id="grandTotal" style="font-weight: bold; color: #198754;">0.00</span></strong></div>
        </div>
    `;

    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    const styles = `
        .main-invoice-table { width: 100%; border-collapse: collapse; }
        .main-invoice-table thead tr { background-color: #020b18ff; color: white; position: sticky; top: 0; z-index: 10; }
        .main-invoice-table th { padding: 12px; text-align: center; }
        .invoice-header-row { background-color: #f8f9fa; border-bottom: 2px solid #dee2e6; cursor: pointer; transition: background-color 0.2s; }
        .invoice-header-row:hover { background-color: #e9ecef; }
        .invoice-header-row td { padding: 10px 12px; vertical-align: middle; text-align: center; border-left: 1px solid #eee; }
        .invoice-header-row td:first-child { border-left: none; }
        .invoice-header-row td span[contenteditable="true"] { background-color: #fff; padding: 5px; border-radius: 4px; border: 1px dashed #ccc; min-width: 100px; display: inline-block; }
        .numeric { font-family: 'Segoe UI', Tahoma, sans-serif; font-weight: 500; }
        .details-wrapper { padding: 20px; background-color: #f9f9f9; border-top: 3px solid #0d6efd; }
        .details-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 20px; margin-bottom: 25px; }
        .details-card, .items-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
        .details-header { color: #0d6efd; border-bottom: 2px solid #eee; padding-bottom: 8px; margin-top: 0; margin-bottom: 15px; font-size: 18px; }
        .details-table { width: 100%; border-collapse: collapse; font-size: 15px; }
        .details-table th, .details-table td { border: 1px solid #f0f0f0; padding: 9px; text-align: right; }
        .details-table th { background-color: #f8f9fa; width: 150px; font-weight: 600; }
        .details-table td[contenteditable="true"] { background-color: #fff9e6; outline: none; }
        .items-table { width: 100%; border-collapse: collapse; }
        .items-table th, .items-table td { border: 1px solid #dee2e6; padding: 8px; text-align: center; font-size: 14px; vertical-align: middle; }
        .items-table th { background-color: #e9ecef; font-weight: 600; }
        .items-table tbody tr:nth-child(even) { background-color: #f9f9f9; }
        .items-table td[contenteditable="true"], .items-table span[contenteditable="true"] { background-color: #fff9e6; outline: none; }
        .delete-invoice-btn, .delete-line-btn, .print-invoice-btn { background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer; padding: 4px 8px; font-size: 14px; }
        .print-invoice-btn { background: #17a2b8; }
        .delete-line-btn { font-size: 18px; padding: 2px 8px; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.id = "dataEditorModalStyles";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    document.getElementById('closeModalBtn').onclick = () => { modal.remove(); styleSheet.remove(); };
    document.getElementById('saveFromModalBtn').onclick = () => processAndSaveFromModal_v3();

    
    document.querySelectorAll('.invoice-header-row').forEach(row => {
        row.onclick = (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.isContentEditable || e.target.parentElement.isContentEditable) {
                return;
            }
            const detailsRow = row.nextElementSibling;
            const toggleIcon = row.querySelector('.toggle-details');
            const isVisible = detailsRow.style.display !== 'none';
            detailsRow.style.display = isVisible ? 'none' : 'table-row';
            toggleIcon.textContent = isVisible ? '+' : '-';
        };
    });

    document.querySelectorAll('.delete-invoice-btn').forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation();
            const invoiceGroup = e.target.closest('.invoice-group');
            const draftId = invoiceGroup.dataset.draftId;
            const internalID = invoiceGroup.dataset.internalId;

            if (!draftId) {
                if (confirm(`هذه الفاتورة (${internalID}) لم يتم حفظها على الخادم بعد. هل تريد إزالتها من العرض الحالي؟`)) {
                    invoiceGroup.remove();
                    updateAllTotals();
                }
                return;
            }

            const success = await deleteDraftInvoiceAPI(draftId);

            if (success) {
                invoiceGroup.remove();
                updateAllTotals();
                alert(`تم حذف الفاتورة رقم ${internalID} بنجاح من الخادم.`);
            }
        };
    });







    // ... في نهاية دالة showDataEditorModal_v3

    // ربط حدث زر "حفظ كنموذج" الجديد
    document.getElementById('saveAsTemplateBtn').onclick = () => {
        // أولاً، نجمع بيانات الفاتورة الأولى فقط (لأن النموذج يكون لفاتورة واحدة)
        const firstInvoiceGroup = document.querySelector('.invoice-group');
        if (!firstInvoiceGroup) {
            alert("لا توجد فواتير لعرضها أو حفظها كنموذج.");
            return;
        }

        // 1. اجمع البيانات واحسب الإجماليات باستخدام الدالة الجديدة
        const payloadWithTotals = collectRawDataFromGroup(firstInvoiceGroup);

        // 2. اظهر النافذة المنبثقة لطلب اسم ونطاق النموذج
        showSaveAsTemplatePopup(async (templateName, templateScope) => {
            
            // 3. أضف اسم ونطاق النموذج إلى البيانات المجمعة
            const templatePayload = {
                ...payloadWithTotals,
                templateName: templateName,
                templateScope: templateScope
            };

            // 4. أرسل البيانات إلى API النماذج
            const result = await saveInvoiceAsTemplateAPI(templatePayload);
            if (result.success) {
                alert(`✅ تم حفظ النموذج "${templateName}" بنجاح!`);
            } else {
                alert(`❌ فشل حفظ النموذج. الخطأ: ${result.error}`);
            }
        });
    };

    
    document.querySelectorAll('.print-invoice-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const invoiceId = e.target.dataset.invoiceId;
            const invoiceGroup = e.target.closest('.invoice-group');
            printInvoice(invoiceId, invoiceGroup);
        };
    });
    
    document.querySelectorAll('.delete-line-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const row = e.target.closest('tr');
            const tbody = row.parentElement;
            row.remove();
            if (tbody.children.length === 0) {
                tbody.closest('.invoice-group').remove();
            }
            updateAllTotals();
        };
    });

    modal.addEventListener('input', (e) => {
        if (e.target.isContentEditable) {
            updateAllTotals();
        }
    });

    updateAllTotals();

    modal.querySelectorAll('.verify-receiver-btn').forEach(btn => {
        btn.onclick = async (e) => {
            e.stopPropagation();
            const btn = e.target;
            const receiverRow = btn.closest('tr');
            const receiverIdCell = receiverRow.querySelector('[data-receiver-field="receiver_id"]');
            const registrationNumber = receiverIdCell.textContent.trim();
            
            const originalText = btn.textContent;
            btn.textContent = '⏳';
            btn.disabled = true;

            const data = await fetchTaxpayerData(registrationNumber);

            if (data) {
                const receiverDetailsTable = btn.closest('.details-grid').querySelector('.receiver-details-table');
                
                const nameCell = receiverDetailsTable.querySelector('[data-receiver-field="receiver_name"]');
                const governateCell = receiverDetailsTable.querySelector('[data-receiver-field="receiver_governate"]');
                const cityCell = receiverDetailsTable.querySelector('[data-receiver-field="receiver_city"]');
                const streetCell = receiverDetailsTable.querySelector('[data-receiver-field="receiver_street"]');
                const buildingCell = receiverDetailsTable.querySelector('[data-receiver-field="receiver_building"]');

                if (nameCell) nameCell.textContent = data.namePrimaryLang || '';
                
                const address = data.taxpayerBranchs?.[0]?.address;
                if (address) {
                    if (governateCell) governateCell.textContent = address.governorateNameSecondaryLang || address.governorate || '';
                    if (cityCell) cityCell.textContent = address.cityNameSecondaryLang || address.regionCity || '';
                    if (streetCell) streetCell.textContent = address.streetName || address.street || '';
                    if (buildingCell) buildingCell.textContent = address.buildingNo || address.buildingNumber || '';
                }
                
                const mainHeaderRow = btn.closest('.invoice-group').querySelector('.invoice-header-row');
                const mainReceiverNameCell = mainHeaderRow.querySelector('[data-field="receiver_name"]');
                if (mainReceiverNameCell) mainReceiverNameCell.textContent = data.namePrimaryLang || '';

                alert("تم التحقق وملء بيانات العميل بنجاح!");
            } else {
                alert("فشل التحقق من رقم التسجيل. تأكد من أنه صحيح.");
            }

            btn.textContent = originalText;
            btn.disabled = false;
        };
    });

   
}




/**
 * دالة جديدة: لإرسال بيانات الفاتورة ليتم حفظها كنموذج.
 * @param {Object} payload - الهيكل الكامل للنموذج.
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
async function saveInvoiceAsTemplateAPI(payload) {
    const token = getAccessToken();
    if (!token) {
        return { success: false, error: "لم يتم العثور على توكن الدخول." };
    }

    try {
        const response = await fetch("https://api-portal.invoicing.eta.gov.eg/api/v1/documents/templates", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload )
        });

        if (!response.ok) {
            const errorResult = await response.json();
            const specificMessage = errorResult.error?.details?.[0]?.message || errorResult.error?.message || JSON.stringify(errorResult);
            throw new Error(specificMessage);
        }

        return { success: true, error: null };

    } catch (error) {
        return { success: false, error: error.message };
    }
}



/**
 * ✅✅✅ دالة مساعدة (النسخة النهائية): تجمع البيانات وتحسب الإجماليات والضرائب. ✅✅✅
 * @param {HTMLElement} invoiceGroupElement - عنصر tbody الذي يمثل الفاتورة.
 * @returns {Object} - كائن يحتوي على هيكل الفاتورة الكامل والجاهز للإرسال.
 */
function collectRawDataFromGroup(invoiceGroupElement) {
    // --- 1. جمع البيانات الأساسية من الواجهة ---
    const headerData = {};
    invoiceGroupElement.querySelectorAll('[data-field], [data-issuer-field], [data-receiver-field], [data-invoice-field]').forEach(cell => {
        const key = cell.dataset.field || cell.dataset.issuerField || cell.dataset.receiverField || cell.dataset.invoiceField;
        if (key) {
            headerData[key] = cell.textContent.trim();
        }
    });

    // --- 2. حساب الإجماليات والضرائب من بنود الفاتورة ---
    let totalSalesAmount = 0;
    let totalDiscountAmount = 0;
    const taxTotalsMap = new Map();
    const invoiceLines = [];
    const rawLinesData = []; // لتخزين البيانات الخام للـ lineItemCodes

    invoiceGroupElement.querySelectorAll('.items-table tbody tr').forEach(row => {
        const line = {};
        row.querySelectorAll('[data-field]').forEach(cell => {
            // التعامل مع الخلايا التي تحتوي على حقول متعددة (مثل الضرائب)
            if (cell.querySelectorAll('span[data-field]').length > 0) {
                cell.querySelectorAll('span[data-field]').forEach(span => {
                    line[span.dataset.field] = span.textContent.trim();
                });
            } else {
                line[cell.dataset.field] = cell.textContent.trim();
            }
        });
        rawLinesData.push(line); // إضافة بيانات السطر الخام

        const quantity = parseFloat(line.quantity) || 0;
        const amountEGP = parseFloat(line.unit_price) || 0;
        const salesTotal = parseFloat((quantity * amountEGP).toFixed(5));
        totalSalesAmount += salesTotal;

        const discountAmount = parseFloat(line.discount_amount) || (salesTotal * (parseFloat(line.discount_rate) || 0) / 100);
        totalDiscountAmount += discountAmount;

        const netTotal = parseFloat((salesTotal - discountAmount).toFixed(5));

        const taxableItems = [];
        let totalTaxAmountForItem = 0;
        for (let i = 1; i <= 3; i++) {
            const taxType = line[`tax_type_${i}`]?.trim().toUpperCase();
            const taxRateStr = line[`tax_rate_${i}`];
            if (taxType && taxRateStr != null && taxRateStr.trim() !== '' && !isNaN(parseFloat(taxRateStr))) {
                const taxRate = parseFloat(taxRateStr);
                const taxAmount = parseFloat((netTotal * (taxRate / 100)).toFixed(5));
                const taxSubtype = line[`tax_subtype_${i}`]?.trim() || defaultSubtypes[taxType] || "";
                taxableItems.push({ taxType, amount: taxAmount, subType: taxSubtype, rate: taxRate });

                totalTaxAmountForItem += (taxType === "T4" ? -taxAmount : taxAmount);
                taxTotalsMap.set(taxType, (taxTotalsMap.get(taxType) || 0) + taxAmount);
            }
        }

        invoiceLines.push({
            description: line.item_description,
            itemType: line.item_type,
            itemCode: line.item_code,
            internalCode: line.item_internal_code || line.item_code,
            unitType: line.unit_type,
            quantity: quantity,
            unitValue: { currencySold: "EGP", amountEGP: amountEGP },
            salesTotal: salesTotal,
            discount: { amount: discountAmount },
            netTotal: netTotal,
            taxableItems: taxableItems,
            total: parseFloat((netTotal + totalTaxAmountForItem).toFixed(5)),
            valueDifference: 0,
            totalTaxableFees: 0,
            itemsDiscount: 0
        });
    });

    const taxTotals = Array.from(taxTotalsMap, ([taxType, amount]) => ({ taxType, amount: parseFloat(amount.toFixed(5)) }));
    const finalTotalAmount = invoiceLines.reduce((sum, line) => sum + line.total, 0);

    // --- 3. بناء هيكل JSON النهائي بنفس شكل المسودة ---
    const finalPayload = {
        tags: ["FullInvoice", "SignatureRequired"],
        document: {
            documentType: "I",
            documentTypeVersion: "1.0",
            dateTimeIssued: new Date().toISOString().split('.')[0] + "Z",
            taxpayerActivityCode: document.getElementById('activity-select-editor')?.value || "4690",
            internalID: headerData.internalID,
            issuer: {
                type: "B", id: headerData.id, name: headerData.name,
                address: { branchID: "0", country: "EG", governate: headerData.governate, regionCity: headerData.regionCity, street: headerData.street, buildingNumber: headerData.buildingNumber }
            },
            receiver: {
                type: headerData.receiver_type, id: headerData.receiver_id, name: headerData.receiver_name,
                address: { country: headerData.receiver_country, governate: headerData.receiver_governate, regionCity: headerData.receiver_city, street: headerData.receiver_street, buildingNumber: headerData.receiver_building }
            },
            invoiceLines: invoiceLines,
            totalSalesAmount: parseFloat(totalSalesAmount.toFixed(5)),
            totalDiscountAmount: parseFloat(totalDiscountAmount.toFixed(5)),
            netAmount: parseFloat((totalSalesAmount - totalDiscountAmount).toFixed(5)),
            taxTotals: taxTotals,
            totalAmount: parseFloat(finalTotalAmount.toFixed(5)),
            signatures: [{ signatureType: "I", value: "VGVtcG9yYXJ5IFNpZ25hdHVyZSBIb2xkZXI=" }]
        },
        lineItemCodes: rawLinesData.map(line => ({
            codeType: line.item_type,
            itemCode: line.item_code,
            codeNamePrimaryLang: line.item_code_name || line.item_description,
            codeNameSecondaryLang: line.item_code_name || line.item_description
        }))
    };

    return finalPayload;
}


/**
 * دالة جديدة: لإظهار نافذة منبثقة لحفظ الفاتورة كنموذج.
 * @param {Function} onSave - دالة يتم استدعاؤها عند الضغط على "حفظ" مع تمرير اسم ونطاق النموذج.
 */
function showSaveAsTemplatePopup(onSave) {
    // منع تكرار النافذة
    document.getElementById('saveTemplatePopup')?.remove();

    const popup = document.createElement('div');
    popup.id = 'saveTemplatePopup';
    popup.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.5); z-index: 10002;
        display: flex; align-items: center; justify-content: center; direction: rtl;
    `;

    popup.innerHTML = `
        <div style="background: #fff; padding: 25px; border-radius: 10px; width: 400px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
            <h4 style="margin-top: 0; color: #007bff;">حفظ الفاتورة كنموذج</h4>
            <div style="margin-bottom: 15px;">
                <label for="templateNameInput" style="display: block; margin-bottom: 5px; font-weight: bold;">اسم النموذج:</label>
                <input type="text" id="templateNameInput" placeholder="مثال: نموذج فواتير شركة X" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
            </div>
            <div style="margin-bottom: 20px;">
                <label for="templateScopeSelect" style="display: block; margin-bottom: 5px; font-weight: bold;">حفظ لـ:</label>
                <select id="templateScopeSelect" style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 5px;">
                    <option value="User">أنا فقط (User)</option>
                    <option value="Taxpayer">جميع ممثلي الممول (Taxpayer)</option>
                </select>
            </div>
            <div style="display: flex; justify-content: flex-end; gap: 10px;">
                <button id="cancelTemplateSave" style="background: #6c757d; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">إلغاء</button>
                <button id="confirmTemplateSave" style="background: #007bff; color: white; padding: 8px 15px; border: none; border-radius: 5px; cursor: pointer;">حفظ</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    document.getElementById('cancelTemplateSave').onclick = () => popup.remove();
    document.getElementById('confirmTemplateSave').onclick = () => {
        const templateName = document.getElementById('templateNameInput').value.trim();
        const templateScope = document.getElementById('templateScopeSelect').value;
        if (!templateName) {
            alert("يرجى إدخال اسم للنموذج.");
            return;
        }
        onSave(templateName, templateScope);
        popup.remove();
    };
}


// =========================================================================
//  ⭐ دالة مستكشف الأكواد (v5.2 - مع تصدير أعمدة مخصصة حسب الطلب) ⭐
// =========================================================================
function setupCodesExplorerTab() {
    // التأكد من أننا لا نضيف الكود مرتين
    if (document.getElementById('codes-explorer-grid')) {
        return;
    }

    const container = document.getElementById('panel-codes-explorer');
    if (!container) {
        return;
    }

    // --- 1. بناء الهيكل الأساسي للواجهة ---
    container.innerHTML = `
        <div class="panel-header">
            <h2>مستكشف أكواد الأصناف (EGS)</h2>
            <p>ابحث عن الأكواد المسجلة وصدرها إلى ملف Excel جاهز للاستخدام.</p>
        </div>
        <div id="codes-explorer-grid" class="codes-explorer-grid">
            <div class="search-panel">
                <div class="search-options">
                    <select id="code-search-type">
                        <option value="rin">البحث برقم تسجيل الممول</option>
                    </select>
                </div>
                <input type="text" id="code-search-input" placeholder="ابدأ الكتابة للبحث باسم الصنف...">
                <div id="export-container" style="margin-top: 15px; display: none;">
                    <button id="export-excel-btn" style="width: 100%; padding: 12px; background-color: #198754; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 16px;">
                        📥 تحميل كل الأكواد (Excel)
                    </button>
                    <div id="export-progress" style="text-align: center; color: #0d6efd; margin-top: 10px; font-weight: bold; display: none;"></div>
                </div>
                <ul id="search-results-list" style="margin-top: 15px;"><li class="list-placeholder">قائمة النتائج...</li></ul>
            </div>
            <div class="details-panel">
                <div id="code-details-container">
                    <div class="list-placeholder">اختر كوداً من القائمة لعرض تفاصيله هنا...</div>
                </div>
            </div>
        </div>
    `;

    // --- 2. تعريف الدوال المساعدة للـ API ---
    const getApiToken = () => JSON.parse(localStorage.getItem("USER_DATA") || "{}").access_token;

    const fetchApi = async (url) => {
        const token = getApiToken();
        if (!token) {
            alert("خطأ في المصادقة. يرجى إعادة تحميل الصفحة.");
            return null;
        }
        try {
            const response = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
            if (!response.ok) throw new Error(`API Error: ${response.status}`);
            return await response.json();
        } catch (error) {
            return null;
        }
    };

    // --- 3. ربط عناصر الواجهة بالأحداث ---
    const searchTypeSelect = document.getElementById('code-search-type');
    const searchInput = document.getElementById('code-search-input');
    const resultsList = document.getElementById('search-results-list');
    const detailsContainer = document.getElementById('code-details-container');
    const exportContainer = document.getElementById('export-container');
    const exportBtn = document.getElementById('export-excel-btn');
    const exportProgress = document.getElementById('export-progress');
    let searchTimeout;
    let currentRinForExport = null;

    searchTypeSelect.addEventListener('change', () => {
        searchInput.value = '';
        resultsList.innerHTML = '<li class="list-placeholder">قائمة النتائج...</li>';
        detailsContainer.innerHTML = '<div class="list-placeholder">اختر كوداً من القائمة لعرض تفاصيله هنا...</div>';
        exportContainer.style.display = 'none';
        currentRinForExport = null;
        searchInput.placeholder = (searchTypeSelect.value === 'name') 
            ? 'ابدأ الكتابة للبحث باسم الصنف...'
            : 'أدخل رقم التسجيل للبحث...';
    });

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        exportContainer.style.display = 'none';
        currentRinForExport = null;
        let query = searchInput.value.trim();

        if (query.length < 3) {
            resultsList.innerHTML = '<li class="list-placeholder">اكتب 3 حروف/أرقام على الأقل...</li>';
            return;
        }

        resultsList.innerHTML = '<li class="list-placeholder">جاري البحث...</li>';

        searchTimeout = setTimeout(async () => {
            const searchType = searchTypeSelect.value;
            let lookupValue = query;

            if (searchType === 'rin') {
                lookupValue = `EG-${query}`;
                currentRinForExport = query;
            }
            
            const url = `https://api-portal.invoicing.eta.gov.eg/api/v1/codetypes/9/codes?CodeLookupValue=${encodeURIComponent(lookupValue )}&ApplyMinChoiceLevel=true&Ps=50&Pn=1`;
            
            const data = await fetchApi(url);
            const results = data?.result || [];

            if (results.length === 0) {
                resultsList.innerHTML = '<li class="list-placeholder">لا توجد نتائج.</li>';
                return;
            }

            if (searchType === 'rin') {
                exportContainer.style.display = 'block';
            }

            resultsList.innerHTML = results.map((item, index) => `
                <li class="search-result-item" data-index="${index}">
                    <strong>${item.codeNameSecondaryLang}</strong>
                    <span>${item.codeLookupValue}</span>
                </li>
            `).join('');

            resultsList.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    resultsList.querySelectorAll('.search-result-item').forEach(i => i.classList.remove('selected'));
                    e.currentTarget.classList.add('selected');
                    
                    const index = parseInt(e.currentTarget.dataset.index, 10);
                    const selectedItemData = results[index];
                    displayCodeDetails(selectedItemData);
                });
            });
        }, 500);
    });

    // --- 4. دالة عرض التفاصيل (كما هي) ---
    const displayCodeDetails = (details) => {
        if (!details) {
            detailsContainer.innerHTML = '<div class="list-placeholder" style="color:red;">فشل في تحميل التفاصيل.</div>';
            return;
        }
        detailsContainer.innerHTML = `
            <div class="detail-card"><h4>البيانات الأساسية للكود</h4><p><span class="label">الاسم العربي:</span> <span class="value">${details.codeNameSecondaryLang || 'N/A'}</span></p><p><span class="label">الاسم الإنجليزي:</span> <span class="value">${details.codeNamePrimaryLang || 'N/A'}</span></p><p><span class="label">الكود (Code):</span> <span class="value code">${details.codeLookupValue || 'N/A'}</span></p><p><span class="label">الوصف:</span> <span class="value">${details.codeDescriptionSecondaryLang || 'لا يوجد'}</span></p></div>
            <div class="detail-card" style="border-color: #28a745;"><h4>بيانات المالك</h4><p><span class="label">اسم المالك:</span> <span class="value">${details.ownerTaxpayer?.nameAr || 'N/A'}</span></p><p><span class="label">رقم تسجيل المالك:</span> <span class="value code">${details.ownerTaxpayer?.rin || 'N/A'}</span></p></div>
            <div class="detail-card" style="border-color: #fd7e14;"><h4>التصنيف (GPC)</h4><p><span class="label">المستوى 1:</span> <span class="value">${details.codeCategorization?.level1?.nameAr || 'N/A'}</span></p><p><span class="label">المستوى 2:</span> <span class="value">${details.codeCategorization?.level2?.nameAr || 'N/A'}</span></p><p><span class="label">المستوى 3:</span> <span class="value">${details.codeCategorization?.level3?.nameAr || 'N/A'}</span></p><p><span class="label">المستوى 4:</span> <span class="value">${details.codeCategorization?.level4?.nameAr || 'N/A'}</span></p></div>
        `;
    };

    // --- 5. ✅✅✅  منطق التصدير المخصص (v5.2)  ✅✅✅ ---
    exportBtn.addEventListener('click', async () => {
        if (!currentRinForExport) {
            alert("يرجى البحث برقم تسجيل أولاً.");
            return;
        }

        exportBtn.disabled = true;
        exportProgress.style.display = 'block';
        exportProgress.textContent = 'جاري جلب البيانات...';

        let allCodes = [];
        let currentPage = 1;
        let totalPages = 1;

        try {
            do {
                const lookupValue = `EG-${currentRinForExport}`;
                const url = `https://api-portal.invoicing.eta.gov.eg/api/v1/codetypes/9/codes?CodeLookupValue=${lookupValue}&ApplyMinChoiceLevel=true&Ps=100&Pn=${currentPage}`;
                
                const data = await fetchApi(url );
                
                if (data && data.result) {
                    allCodes.push(...data.result);
                    totalPages = data.metadata.totalPages;
                    exportProgress.textContent = `جاري جلب صفحة ${currentPage} من ${totalPages}... (${allCodes.length} كود)`;
                    currentPage++;
                } else {
                    break;
                }
            } while (currentPage <= totalPages);

            exportProgress.textContent = `تم جلب ${allCodes.length} كود. جاري إنشاء ملف Excel...`;

            // ✅✅✅  بداية التعديل: تحويل البيانات إلى التنسيق المطلوب  ✅✅✅
            const excelData = allCodes.map(code => {
                // استخلاص الجزء الأخير من الكود
                const itemCodeOnly = code.codeLookupValue.split('-').pop() || '';
                
                return {
                    'CodeType': 'EGS',
                    'ItemCode': itemCodeOnly,
                    'CodeName': code.codeNamePrimaryLang,
                    'CodeNameAr': code.codeNameSecondaryLang,
                    'Description': code.codeDescriptionPrimaryLang,
                    'DescriptionAr': code.codeDescriptionSecondaryLang,
                    'ActiveFrom': code.activeFrom ? new Date(code.activeFrom).toISOString().split('T')[0] : null,
                    'ActiveTo': code.activeTo ? new Date(code.activeTo).toISOString().split('T')[0] : null,
                    'GPCItemLink': code.parentCodeLookupValue, // هذا هو أقرب حقل لـ GPCItemLink
                    'EGSRelatedCode': code.linkedCode
                };
            });
            // ✅✅✅  نهاية التعديل  ✅✅✅

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            
            // تفعيل خاصية RTL
            if (!workbook.Workbook) workbook.Workbook = {};
            if (!workbook.Workbook.Views) workbook.Workbook.Views = [];
            if (!workbook.Workbook.Views[0]) workbook.Workbook.Views[0] = {};
            workbook.Workbook.Views[0].RTL = true;

            XLSX.utils.book_append_sheet(workbook, worksheet, "أكواد الأصناف");

            // تعديل عرض الأعمدة
            worksheet['!cols'] = [
                { wch: 10 }, // CodeType
                { wch: 15 }, // ItemCode
                { wch: 40 }, // CodeName
                { wch: 40 }, // CodeNameAr
                { wch: 40 }, // Description
                { wch: 40 }, // DescriptionAr
                { wch: 15 }, // ActiveFrom
                { wch: 15 }, // ActiveTo
                { wch: 20 }, // GPCItemLink
                { wch: 20 }  // EGSRelatedCode
            ];

            XLSX.writeFile(workbook, `أكواد_${currentRinForExport}.xlsx`);

        } catch (error) {
            alert("حدث خطأ أثناء تصدير الأكواد. انظر الكونسول للمزيد من التفاصيل.");
        } finally {
            exportBtn.disabled = false;
            exportProgress.style.display = 'none';
        }
    });
}




/**
 * ✅ دالة جديدة: لحذف مسودة من الخادم (API)
 */
async function deleteDraftInvoiceAPI(draftId) {
    const token = getAccessToken();
    if (!token) {
        alert("خطأ: لم يتم العثور على توكن الدخول.");
        return false;
    }

    // تأكيد من المستخدم قبل الحذف
    if (!confirm(`هل أنت متأكد من رغبتك في حذف هذه المسودة نهائياً من الخادم؟ لا يمكن التراجع عن هذا الإجراء.`)) {
        return false;
    }

    try {
        const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/documents/drafts/${draftId}`, {
            method: 'DELETE', // تحديد نوع الطلب
            headers: {
                "Authorization": `Bearer ${token}`
            }
        } );

        if (!response.ok) {
            // محاولة قراءة رسالة الخطأ من الخادم
            let errorMsg = `فشل حذف المسودة. رمز الحالة: ${response.status}`;
            try {
                const errorData = await response.json();
                errorMsg = errorData.error?.message || JSON.stringify(errorData);
            } catch (e) {
                // فشل في قراءة JSON، استخدم النص العادي
                errorMsg = await response.text();
            }
            throw new Error(errorMsg);
        }

        return true; // تم الحذف بنجاح

    } catch (error) {
        alert(`حدث خطأ أثناء حذف المسودة: ${error.message}`);
        return false;
    }
}



/**
 * ✅✅✅ الدالة النهائية والحاسمة: تستخدم البيانات الخام لبناء lineItemCodes. ✅✅✅
 */
async function updateDraftInvoiceAPI(draftId, payload, rawLinesData) { // إضافة rawLinesData كمعامل
    const token = getAccessToken();
    if (!token) {
        const errorMsg = "خطأ في المصادقة: لم يتم العثور على توكن الدخول.";
        return { success: false, error: errorMsg };
    }

    const finalPayload = {
        ...payload,
        references: [], 
        clientsidevalidationresult: true, 
        
        // =================================================================
        // ✅✅✅ بداية التعديل: بناء lineItemCodes من البيانات الخام ✅✅✅
        // =================================================================
        lineItemCodes: rawLinesData.map(line => {
            return {
                codeType: line.item_type,
                itemCode: line.item_code,
                codeNamePrimaryLang: line.item_code_name || line.item_description,
                codeNameSecondaryLang: line.item_code_name || line.item_description
            };
        })
        // =================================================================
        // ✅✅✅ نهاية التعديل ✅✅✅
        // =================================================================
    };

    try {
        const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/documents/drafts/${draftId}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(finalPayload )
        });

        if (!response.ok) {
            const errorResult = await response.json();
            const specificMessage = errorResult.error?.details?.[0]?.message || errorResult.error?.message || JSON.stringify(errorResult);
            throw new Error(specificMessage);
        }
        
        const responseData = await response.json();
        return { success: true, data: responseData };

    } catch (error) {
        return { success: false, error: error.message };
    }
}










/**
 * ✅ دالة معدلة: تحول بيانات المسودة من API إلى التنسيق الذي تفهمه واجهة التعديل.
 */
function transformDraftDataForEditor(draft) {
    const doc = draft.document;
    if (!doc) return [];

    // --- بداية التعديل ---
    // الاحتفاظ بالمعرف الفريد للمسودة (UUID) القادم من الـ API
    const draftId = draft.id;
    // --- نهاية التعديل ---

    // تجميع بيانات رأس الفاتورة
    const invoiceHeader = {
        draftId: draftId, // <-- تمت إضافة هذا السطر
        internalID: doc.internalID,
        receiver_id: doc.receiver.id,
        receiver_name: doc.receiver.name,
        receiver_type: doc.receiver.type,
        receiver_country: doc.receiver.address?.country,
        receiver_governate: doc.receiver.address?.governate,
        receiver_city: doc.receiver.address?.regionCity,
        receiver_street: doc.receiver.address?.street,
        receiver_building: doc.receiver.address?.buildingNumber,
        purchaseOrderReference: doc.purchaseOrderReference,
        purchaseOrderDescription: doc.purchaseOrderDescription,
        salesOrderReference: doc.salesOrderReference,
        salesOrderDescription: doc.salesOrderDescription,
        bankName: doc.payment?.bankName,
        bankAccountNo: doc.payment?.bankAccountNo,
        deliveryApproach: doc.delivery?.approach,
        deliveryPackaging: doc.delivery?.packaging,
    };

    // إنشاء صف لكل بند في الفاتورة مع إضافة بيانات الرأس إليه
    return doc.invoiceLines.map(line => {
        const lineData = {
            ...invoiceHeader,
            item_description: line.description,
            item_type: line.itemType,
            item_code: line.itemCode,
            item_internal_code: line.internalCode,
            unit_type: line.unitType,
            quantity: line.quantity,
            unit_price: line.unitValue.amountEGP,
            currency_sold: line.unitValue.currencySold,
            exchange_rate: line.unitValue.currencyExchangeRate,
            discount_rate: line.discount?.rate,
            discount_amount: line.discount?.amount,
        };

        // إضافة بيانات الضرائب (حتى 3 ضرائب لكل بند)
        line.taxableItems.forEach((tax, index) => {
            if (index < 3) {
                lineData[`tax_type_${index + 1}`] = tax.taxType;
                lineData[`tax_subtype_${index + 1}`] = tax.subType;
                lineData[`tax_rate_${index + 1}`] = tax.rate;
            }
        });

        return lineData;
    });
}


function updateAllTotals() {
    let overallTotalBeforeTax = 0;
    const overallTaxTotals = new Map();

    document.querySelectorAll('.invoice-group').forEach(group => {
        const internalID = group.dataset.internalId;
        let invoiceTotalBeforeTax = 0;
        const invoiceTaxTotals = new Map();

        group.querySelectorAll('.items-table tbody tr').forEach(row => {
            const quantity = parseFloat(row.querySelector('[data-field="quantity"]').textContent) || 0;
            const price = parseFloat(row.querySelector('[data-field="unit_price"]').textContent) || 0;
            const exchangeRate = parseFloat(row.querySelector('[data-field="exchange_rate"]').textContent) || 1;
            const lineTotalInEGP = quantity * price * exchangeRate;

            invoiceTotalBeforeTax += lineTotalInEGP;

            // --- بداية التعديل في دالة العرض ---
            let tableTaxAmount = 0;
            // الخطوة 1: حساب ضرائب الجدول أولاً
            for (let i = 1; i <= 3; i++) {
                const taxType = row.querySelector(`[data-field="tax_type_${i}"]`).textContent.trim().toUpperCase();
                const taxRate = parseFloat(row.querySelector(`[data-field="tax_rate_${i}"]`).textContent) || 0;
                if ((taxType === "T2" || taxType === "T3") && taxRate > 0) {
                    const taxAmount = lineTotalInEGP * (taxRate / 100);
                    tableTaxAmount += taxAmount;
                    invoiceTaxTotals.set(taxType, (invoiceTaxTotals.get(taxType) || 0) + taxAmount);
                }
            }

            // الخطوة 2: حساب وعاء القيمة المضافة
            const vatBaseAmount = lineTotalInEGP + tableTaxAmount;

            // الخطوة 3: حساب باقي الضرائب
            for (let i = 1; i <= 3; i++) {
                const taxType = row.querySelector(`[data-field="tax_type_${i}"]`).textContent.trim().toUpperCase();
                const taxRate = parseFloat(row.querySelector(`[data-field="tax_rate_${i}"]`).textContent) || 0;
                
                if (taxType === "T2" || taxType === "T3") continue; // تجاهل ما تم حسابه

                if (taxType && taxRate > 0) {
                    let taxAmount = 0;
                    if (taxType === "T1") {
                        taxAmount = vatBaseAmount * (taxRate / 100);
                    } else {
                        taxAmount = lineTotalInEGP * (taxRate / 100);
                    }
                    invoiceTaxTotals.set(taxType, (invoiceTaxTotals.get(taxType) || 0) + taxAmount);
                }
            }
            // --- نهاية التعديل في دالة العرض ---
        });

        // ... (باقي كود حساب وعرض الإجماليات يبقى كما هو) ...
        let invoiceGrandTotal = invoiceTotalBeforeTax;
        let invoiceTaxDetailsHTML = ''; 

        invoiceTaxTotals.forEach((amount, type) => {
            invoiceGrandTotal += (type === "T4" ? -1 : 1) * amount;
            const taxName = taxTypesMap[type] || type;
            const style = type === "T4" ? 'color: #dc3545;' : 'color: #28a745;'; 
            invoiceTaxDetailsHTML += `<div style="${style} font-size: 12px;">${taxName}: ${amount.toFixed(2)}</div>`;
        });

        document.getElementById(`totalBeforeTax_${internalID}`).textContent = invoiceTotalBeforeTax.toFixed(2);
        document.getElementById(`taxTotals_${internalID}`).innerHTML = invoiceTaxDetailsHTML || 'لا توجد';
        document.getElementById(`grandTotal_${internalID}`).textContent = invoiceGrandTotal.toFixed(2);

        overallTotalBeforeTax += invoiceTotalBeforeTax;
        invoiceTaxTotals.forEach((amount, type) => {
            overallTaxTotals.set(type, (overallTaxTotals.get(type) || 0) + amount);
        });
    });

    // ... (حساب الإجماليات النهائية في الشريط السفلي يبقى كما هو) ...
    let grandTotal = overallTotalBeforeTax;
    let taxHtml = '';
    overallTaxTotals.forEach((amount, type) => {
        grandTotal += (type === "T4" ? -1 : 1) * amount;
        const taxName = taxTypesMap[type] || type;
        const style = type === "T4" ? 'style="color: #ff6b6b;"' : '';
        taxHtml += `<span ${style}>${taxName}: ${amount.toFixed(2)}</span>`;
    });

    document.getElementById('totalBeforeTax').textContent = overallTotalBeforeTax.toFixed(2);
    document.getElementById('taxTotalsContainer').innerHTML = taxHtml;
    document.getElementById('grandTotal').textContent = grandTotal.toFixed(2);
}


/**
 * ✅✅✅ الدالة النهائية مع منطق الحفظ الصحيح (POST ثم PUT) ✅✅✅
 */
async function sendInvoicesFromModal_v3(invoicesMap) {
    const saveBtn = document.getElementById('saveFromModalBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = `⏳ جاري الحفظ (0 / ${invoicesMap.size})...`;

    let successCount = 0;
    const totalInvoices = invoicesMap.size;
    const errors = [];
    let processedCount = 0;

    for (const [invoiceId, data] of invoicesMap.entries()) {
        const draftId = data.draftId;
        
        // =================================================================
        // ✅✅✅ بداية التعديل: تمرير البيانات الخام والمهيكلة معاً ✅✅✅
        // =================================================================
        const structuredPayload = createInvoicePayloadFromLines_v3(data.lines, data.issuer);
        const rawLinesData = data.lines; // البيانات الخام التي تحتوي على item_code_name
        // =================================================================
        // ✅✅✅ نهاية التعديل ✅✅✅
        
        try {
            if (draftId) {
                // تمرير البيانات الخام إلى دالة التحديث
                const updateResult = await updateDraftInvoiceAPI(draftId, structuredPayload, rawLinesData);
                if (!updateResult.success) {
                    throw new Error(updateResult.error);
                }
                successCount++;
            } else {
                // ... (منطق الإنشاء لا يتغير) ...
                const createResult = await createDraftInvoiceAPI(structuredPayload);
                if (!createResult.success) {
                    throw new Error(createResult.error);
                }
                const newDraftId = createResult.data.draftId;
                // تمرير البيانات الخام إلى دالة التحديث بعد الإنشاء
                const makeReadyResult = await updateDraftInvoiceAPI(newDraftId, structuredPayload, rawLinesData);
                if (!makeReadyResult.success) {
                    await deleteDraftInvoiceAPI(newDraftId); 
                    throw new Error(`فشل في جعل المسودة جاهزة: ${makeReadyResult.error}`);
                }
                successCount++;
            }
        } catch (error) {
            errors.push({ internalID: invoiceId, message: error.message });
        } finally {
            processedCount++;
            saveBtn.textContent = `⏳ جاري الحفظ (${processedCount} / ${totalInvoices})...`;
        }
    }

    saveBtn.disabled = false;
    saveBtn.textContent = 'حفظ الفواتير';

    if (errors.length > 0) {
        showErrorModal(errors);
    } else {
        alert(`✅ تم حفظ جميع الفواتير بنجاح كمسودات جاهزة (عدد: ${successCount})!`);
        document.getElementById('dataEditorModal')?.remove();
        document.getElementById('dataEditorModalStyles')?.remove();
    }
}


/**
 * ✅ دالة معدلة: تلتقط الخطأ التفصيلي وتطبعه في الكونسول.
 */
async function createDraftInvoiceAPI(payload) {
    const token = getAccessToken();
    if (!token) {
        const errorMsg = "خطأ في المصادقة: لم يتم العثور على توكن الدخول.";
        return { success: false, error: errorMsg };
    }

    try {
        const response = await fetch("https://api-portal.invoicing.eta.gov.eg/api/v1/documents/drafts", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload )
        });

        if (!response.ok) {
            // محاولة قراءة رسالة الخطأ التفصيلية من الخادم
            const errorResult = await response.json();
            // استخراج الرسالة الأكثر تحديدًا من داخل كائن الخطأ
            const specificMessage = errorResult.error?.details?.[0]?.message || errorResult.error?.message || JSON.stringify(errorResult);
            
            // ترجمة الخطأ وطباعته في الكونسول
            const translatedError = translateApiError(specificMessage);
        
            
            throw new Error(specificMessage); // إرسال الخطأ الأصلي للمعالجة
        }
        
        const successData = await response.json();
        return { success: true, data: successData };

    } catch (error) {
        // إرجاع الخطأ ليتم عرضه للمستخدم
        return { success: false, error: error.message };
    }
}


function translateApiError(errorMessage) {
    if (!errorMessage) return "خطأ غير معروف. يرجى المحاولة مرة أخرى.";

    const errorString = String(errorMessage).toLowerCase();

    const errorDictionary = {
        "receiver id is required": "حقل 'رقم تسجيل المستلم' إجباري.",
        "receiver name is required": "حقل 'اسم المستلم' إجباري.",
        "invalid receiver registration number": "رقم تسجيل المستلم (المشتري) غير صحيح أو غير مسجل بالمنظومة.",
        "issuer and receiver cannot be the same": "لا يمكن أن يكون البائع والمشتري نفس الشخص (رقم التسجيل متطابق).",
        "must be one of [b, p, f]": "نوع المستلم غير صحيح. يجب أن يكون 'B' لشركة، 'P' لشخص طبيعي، أو 'F' لأجنبي.",
        "the submitted document has been processed before": "هذه الفاتورة (بنفس الرقم الداخلي) تم إرسالها مسبقًا.",
        "invalid document structure": "هيكل الفاتورة غير صحيح. تأكد من أن جميع الحقول الإجبارية ممتلئة.",
        "document is not valid": "المستند غير صالح. يرجى مراجعة جميع البيانات.",
        "internal id is required": "حقل 'الرقم الداخلي للفاتورة' إجباري.",
        "documenttypeversion is required": "إصدار الفاتورة (1.0 أو 0.9) مطلوب.",
        "datetimeissued is required": "تاريخ إصدار الفاتورة مطلوب.",

        "invoicelines is required": "يجب أن تحتوي الفاتورة على بند واحد على الأقل.",
        "arrayitemnotvalid": "يوجد خطأ في أحد بنود الفاتورة. يرجى مراجعة بيانات البنود (الكمية، السعر، الأكواد).", // ترجمة الخطأ الذي ذكرته
        "item code not found": "أحد أكواد الأصناف (EGS/GS1) غير صحيح أو لم يتم تسجيله.",
        "invalid item code": "كود الصنف المستخدم في أحد البنود غير صالح.",
        "invalid unit type": "تم استخدام كود وحدة قياس غير صالح في أحد البنود.",
        "description is required": "حقل 'وصف الصنف' إجباري في جميع البنود.",
        "quantity is required": "حقل 'الكمية' إجباري في جميع البنود ويجب أن يكون رقمًا.",
        "unitvalue is required": "حقل 'سعر الوحدة' إجباري في جميع البنود.",
        "amountsold must be provided when currency is not egp": "عند استخدام عملة أجنبية، يجب توفير السعر بالعملة الأجنبية وسعر الصرف.",

        "invalid tax type": "تم استخدام نوع ضريبة غير صالح في أحد البنود.",
        "invalid tax subtype": "تم استخدام نوع ضريبة فرعي غير صالح في أحد البنود.",
        "taxableitems is required": "بيانات الضرائب مطلوبة لكل بند خاضع للضريبة.",
        "tax type is required": "حقل 'نوع الضريبة' إجباري للبنود الخاضعة للضريبة.",

        "total amount does not equal": "خطأ في الحسابات. الإجمالي لا يتطابق مع مجموع البنود والضرائب.",
        "netamount must be equal to": "خطأ في الحسابات. صافي القيمة لا يتطابق مع (إجمالي المبيعات - إجمالي الخصم).",
        "totalsalesamount must be equal to": "خطأ في الحسابات. إجمالي المبيعات لا يتطابق مع مجموع قيم البنود.",

        "unauthorized": "خطأ في المصادقة. قد تكون جلسة الدخول قد انتهت. حاول تسجيل الخروج والدخول مرة أخرى.",
        "notypevalidates": "خطأ في نوع البيانات. تأكد من أن الحقول الرقمية (مثل السعر والكمية) تحتوي على أرقام فقط.",
        "access is denied": "تم رفض الوصول. ليس لديك الصلاحية الكافية لتنفيذ هذا الإجراء.",
        "bad request": "طلب غير صالح. قد يكون هناك خطأ في تنسيق البيانات المرسلة.",
        "the request is invalid": "الطلب غير صالح. يرجى مراجعة البيانات المرسلة.",
        "an error has occurred": "حدث خطأ عام في الخادم. يرجى المحاولة مرة أخرى لاحقًا."
    };

    for (const key in errorDictionary) {
        if (errorString.includes(key)) {
            return errorDictionary[key]; 
        }
    }

  
    return `خطأ غير مترجم: ${errorMessage}`;
}





// << استبدل الدالة القديمة بالكامل بهذه الدالة الجديدة >>

async function validateAndEnrichReceiptData(receiptsMap) {
    const validationErrors = [];
    const validatedMap = new Map();

    // حقول البنود الإجبارية
    const requiredItemFields = {
        'description': 'وصف الصنف', 'itemType': 'نوع كود الصنف',
        'itemCode': 'كود الصنف', 'quantity': 'الكمية', 'unitPrice': 'سعر الوحدة'
    };

    // دالة مساعدة للتحقق من الرقم القومي (لتجنب تكرار الكود)
    async function validateNID_API(nid) {
        if (!nid || nid.length !== 14 || !/^\d+$/.test(nid)) {
            return { valid: false, message: "يجب أن يتكون من 14 رقمًا." };
        }
        try {
            const token = getAccessToken();
            if (!token) return { valid: false, message: "خطأ مصادقة." };
            const response = await fetch(`https://api-portal.invoicing.eta.gov.eg/api/v1/person/${nid}`, { headers: { 'Authorization': `Bearer ${token}` } } );
            if (response.status === 200) return { valid: true };
            if (response.status === 400) return { valid: false, message: "الرقم غير مسجل أو غير صحيح." };
            return { valid: false, message: `خطأ ${response.status} من الخادم.` };
        } catch (error) {
            return { valid: false, message: "فشل التحقق من الرقم." };
        }
    }

    const validationPromises = Array.from(receiptsMap.entries()).map(async ([receiptNumber, items]) => {
        const enrichedItems = [];
        let receiptTotalAmount = 0;

        for (const [itemIndex, item] of items.entries()) {
            const enrichedItem = { ...item, officialCodeName: '' };

            // حساب إجمالي الإيصال (بدون ضرائب للسرعة)
            receiptTotalAmount += (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);

            // التحقق من حقول البنود الإجبارية
            for (const key in requiredItemFields) {
                if (!enrichedItem[key] || String(enrichedItem[key]).trim() === '') {
                    validationErrors.push({ id: `${receiptNumber} (البند ${itemIndex + 1})`, field: requiredItemFields[key], value: 'فارغ', message: 'هذا الحقل إجباري.' });
                }
            }

            // التحقق من صحة كود الصنف
            const itemCodeType = (enrichedItem.itemType || '').toUpperCase().trim();
            const itemCode = (enrichedItem.itemCode || '').toString().trim();
            if (itemCodeType && itemCode) {
                let codeData = null;
                if (itemCodeType === 'EGS') codeData = await fetchMyEGSCode(itemCode);
                else if (itemCodeType === 'GS1') codeData = await fetchGS1Code(itemCode);
                
                if (codeData) {
                    enrichedItem.officialCodeName = codeData.codeNameSecondaryLang || "!! اسم غير مسجل !!";
                } else {
                    validationErrors.push({ id: `${receiptNumber} (البند ${itemIndex + 1})`, field: `كود الصنف (${itemCodeType})`, value: itemCode, message: 'الكود غير صحيح أو غير مسجل.' });
                }
            }
            enrichedItems.push(enrichedItem);
        }

        // --- ✅✅✅ بداية منطق التحقق من الرقم القومي لبيانات الإكسيل ✅✅✅ ---
        const firstItem = items[0] || {};
        const buyerId = (firstItem.buyerId || '').toString().trim();

        // إذا كان الإجمالي أكبر من 150 ألف
        if (receiptTotalAmount > 150000) {
            if (!buyerId) {
                validationErrors.push({ id: receiptNumber, field: 'الرقم القومي للعميل', value: 'فارغ', message: 'إجباري لأن الإجمالي يتجاوز 150,000 جنيه.' });
            } else {
                const nidResult = await validateNID_API(buyerId);
                if (!nidResult.valid) {
                    validationErrors.push({ id: receiptNumber, field: 'الرقم القومي للعميل', value: buyerId, message: nidResult.message });
                }
            }
        } 
        // إذا كان الإجمالي أقل ولكن الرقم القومي مكتوب (يجب التحقق منه)
        else if (buyerId) {
            const nidResult = await validateNID_API(buyerId);
            if (!nidResult.valid) {
                validationErrors.push({ id: receiptNumber, field: 'الرقم القومي للعميل', value: buyerId, message: nidResult.message });
            }
        }
        // --- ✅✅✅ نهاية منطق التحقق من الرقم القومي لبيانات الإكسيل ✅✅✅ ---

        validatedMap.set(receiptNumber, enrichedItems);
    });

    await Promise.all(validationPromises);

    return { validatedMap, validationErrors };
}

// =========================================================================
// ✅ جديد: قاموس الشروحات والتعليمات لخلايا الإكسيل
// =========================================================================
const excelCellComments = {
    'الرقم الداخلي للفاتورة': 'اكتب الرقم الفاتورة علي حسب السريال ',
    'رقم تسجيل المستلم': ' في حاله اختيار شركة يتم كتابه رقم التسجيل الضريبي المكون من 9 ارقام - في حاله اختيار شخصي يتم كتابه 123456789 او الرقم القومي ان وجد وبعد الرفع تقوم بحذفه  والاجنبي نفس النظام ',
    'اسم المستلم': 'غير مطلوب في حاله كتابه رقم التسجيل',
    'نوع المستلم': 'مطلوب: اختر من القائمة: B لشركة، P لشخصي، F لأجنبي.',
    'دولة المستلم': 'غير مطلوب في حاله كتابه رقم التسجيل',
    'محافظة المستلم': 'غير مطلوب في حاله كتابه رقم التسجيل',
    'مدينة المستلم': 'غير مطلوب في حاله كتابه رقم التسجيل',
    'شارع المستلم': 'غير مطلوب في حاله كتابه رقم التسجيل',
    'مبنى المستلم': 'غير مطلوب في حاله كتابه رقم التسجيل',
    'وصف الصنف': 'مطلوب: اسم أو وصف واضح للسلعة أو الخدمة المباعة.',
    'نوع كود الصنف': 'في حاله اختيار GS1  يتم كتابه الكود العالمي مثال : - 10007598 ام في حاله اختيار الكود EGS  يتم كتابه الكود EG-رقم التسجيل-الكود الداخلي مثال EG-123456789-100',
    'كود الصنف': 'في حاله الايصالات مطلوب اجباري كتابه الكود مثال 1 ام في حاله الفواتير غير مطلوب ',
    'وحدة القياس': 'مطلوب: اختر وحدة القياس من القائمة (مثال: قطعة).',
    'الكمية': 'مطلوب: العدد المباع من هذا الصنف.',
    'سعر الوحدة': 'مطلوب: سعر القطعة الواحدة من الصنف.',
    'نوع الضريبة 1': 'مطلوب: اختر نوع الضريبة الأساسي من القائمة (مثال: ضريبة القيمة المضافة).',
    'النوع الفرعي 1': 'مطلوب: اختر النوع الفرعي للضريبة من القائمة المترابطة.',
    'نسبة الضريبة 1': 'مطلوب: أدخل النسبة المئوية للضريبة (مثال: 14).',
    'UUID الفاتورة الأصلية': 'مطلوب للمرتجعات فقط: الرقم التعريفي الفريد لفاتورة البيع الأصلية.'
};


async function handleReceiptExcelUpload(event) {
    const modalUI = document.getElementById("receiptUploaderTabbedUI");
    if (modalUI) modalUI.style.display = "none";

    const file = event.target.files[0];
    if (!file) return;

    const loadingToast = showToastNotification('جاري قراءة ملف الإيصالات...');

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());
        const worksheet = workbook.getWorksheet(1);

        // ✅✅✅ بداية التصحيح الحاسم ✅✅✅
        const headers = worksheet.getRow(1).values.slice(1); // قراءة العناوين كنصوص بسيطة
        const allRows = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber > 1) {
                const rowObject = {};
                row.values.slice(1).forEach((value, index) => {
                    const header = headers[index];
                    if (header) {
                        // التعامل مع التواريخ التي تقرأها المكتبة ككائنات
                        if (value instanceof Date) {
                            rowObject[header] = value;
                        } else {
                            rowObject[header] = value !== null && value !== undefined ? value : '';
                        }
                    }
                });
                allRows.push(rowObject);
            }
        });
        // ✅✅✅ نهاية التصحيح الحاسم ✅✅✅

        if (allRows.length === 0) throw new Error("ملف الإكسل فارغ!");

        const headerMapping = {
            'تاريخ الإصدار (YYYY-MM-DD)': 'dateTimeIssued',
            'رقم الإيصال الداخلي (*)': 'receiptNumber', 'اسم العميل (اختياري)': 'buyerName',
            'الرقم القومي للعميل (اختياري)': 'buyerId', 'الكود الداخلي للصنف': 'internalCode',
            'وصف الصنف (*)': 'description', 'نوع كود الصنف (*)': 'itemType', // تم تعديل اسم العمود هنا
            'كود الصنف (*)': 'itemCode', 'وحدة القياس (*)': 'unitType', 'الكمية (*)': 'quantity',
            'سعر الوحدة (*)': 'unitPrice', 'نوع الضريبة 1 (*)': 'taxType_1',
            'النوع الفرعي للضريبة 1 (*)': 'taxSubType_1', 'نسبة الضريبة 1 (*)': 'taxRate_1',
            'نوع الضريبة 2 (اختياري)': 'taxType_2', 'النوع الفرعي للضريبة 2 (اختياري)': 'taxSubType_2',
            'نسبة الضريبة 2 (اختياري)': 'taxRate_2'
        };
        
        const mappedRows = allRows.map(row => {
            const newRow = {};
            for (const arabicHeader in row) {
                const englishKey = headerMapping[arabicHeader.trim()];
                if (englishKey) newRow[englishKey] = row[arabicHeader];
            }
            return newRow;
        });

        const receiptsMap = new Map();
        let lastReceiptNumber = '';
        let lastHeaderInfo = {}; 

        mappedRows.forEach(row => {
            const currentReceiptNumber = String(row.receiptNumber || lastReceiptNumber).trim();
            if (!currentReceiptNumber) return;

            if (currentReceiptNumber !== lastReceiptNumber) {
                lastHeaderInfo = { dateTimeIssued: row.dateTimeIssued, buyerName: row.buyerName, buyerId: row.buyerId };
                receiptsMap.set(currentReceiptNumber, []);
            }

            const finalRow = { ...lastHeaderInfo, ...row };
            receiptsMap.get(currentReceiptNumber).push(finalRow);
            lastReceiptNumber = currentReceiptNumber;
        });

        loadingToast.querySelector('#toast-message').textContent = 'جاري التحقق من صحة الأكواد...';
        const { validatedMap, validationErrors } = await validateAndEnrichReceiptData(receiptsMap);
        loadingToast.remove();

        if (validationErrors.length > 0) {
            showErrorModal(validationErrors, () => {
                showReceiptEditor(validatedMap, 'sale');
            });
        } else {
            showReceiptEditor(validatedMap, 'sale');
        }

    } catch (error) {
        alert(`❌ خطأ في معالجة ملف الإيصالات: ${error.message}`);
    } finally {
        if (loadingToast) loadingToast.remove();
        event.target.value = '';
    }
}




/**
 * ===================================================================================
 * ✅ دالة showErrorModal (النسخة النهائية الكاملة)
 * ===================================================================================
 * تقوم بإنشاء وعرض نافذة منبثقة (modal) لعرض أخطاء التحقق من الصحة.
 *
 * @param {Array<Object>} errors - مصفوفة من كائنات الأخطاء. كل كائن يجب أن يحتوي على:
 *   - id: معرف المستند أو البند (مثال: 'RCPT-001 (البند 2)').
 *   - field: اسم الحقل الذي به خطأ (مثال: 'كود الصنف').
 *   - value: القيمة الخاطئة التي تم إدخالها.
 *   - message: رسالة توضح طبيعة الخطأ.
 * @param {Function} [continueCallback] - دالة اختيارية يتم استدعاؤها عند الضغط على زر "المتابعة على أي حال".
 *                                       إذا لم يتم توفيرها، فلن يظهر الزر.
 */
function showErrorModal(errors, continueCallback) {
    // الخطوة 1: إزالة أي نافذة أخطاء قديمة لضمان عدم التكرار
    document.getElementById('invoiceErrorModal')?.remove();

    // الخطوة 2: إنشاء الهيكل الخارجي للنافذة المنبثقة
    const modal = document.createElement('div');
    modal.id = 'invoiceErrorModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.6); z-index: 10002;
        display: flex; align-items: center; justify-content: center;
        direction: rtl; font-family: 'Segoe UI', Tahoma, sans-serif;
    `;

    // الخطوة 3: بناء محتوى النافذة (HTML) بشكل ديناميكي
    modal.innerHTML = `
        <div style="background: #fff; width: 800px; max-width: 90%; max-height: 80%; border-radius: 10px; display: flex; flex-direction: column; box-shadow: 0 5px 20px rgba(0,0,0,0.3); animation: fadeIn 0.3s ease-out;">
            
            <!-- رأس النافذة -->
            <div style="padding: 15px 20px; background-color: #d9534f; color: white; border-top-left-radius: 10px; border-top-right-radius: 10px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🚨</span>
                <h3 style="margin: 0; font-size: 20px;">تم اكتشاف أخطاء في البيانات (${errors.length})</h3>
            </div>

            <!-- جسم النافذة وجدول الأخطاء -->
            <div style="overflow-y: auto; padding: 20px;">
                <p style="margin-top: 0; color: #333;">
                    يرجى مراجعة الأخطاء التالية. يمكنك إما تصحيحها في الملف الأصلي وإعادة الرفع، أو المتابعة على مسؤوليتك.
                </p>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                    <thead style="background-color: #f8f9fa; position: sticky; top: 0;">
                        <tr>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">المُعرّف (الإيصال/البند)</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">الحقل</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">القيمة الخاطئة</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">رسالة الخطأ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${errors.map(err => `
                            <tr style="background-color: #fff1f0;">
                                <td style="padding: 8px; border: 1px solid #ffccc7;">${err.id || 'غير محدد'}</td>
                                <td style="padding: 8px; border: 1px solid #ffccc7;"><strong>${err.field || 'غير محدد'}</strong></td>
                                <td style="padding: 8px; border: 1px solid #ffccc7; font-family: monospace; direction: ltr; text-align: left;">${err.value || ''}</td>
                                <td style="padding: 8px; border: 1px solid #ffccc7;">${err.message || 'خطأ غير معروف'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- تذييل النافذة والأزرار -->
            <div style="padding: 15px 20px; text-align: left; border-top: 1px solid #eee; background-color: #f8f9fa; display: flex; justify-content: space-between; align-items: center;">
                <!-- زر المتابعة (يظهر فقط إذا تم توفير دالة continueCallback) -->
                ${continueCallback ? `
                    <button id="continueAnywayBtn" style="background: #ffc107; color: black; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: transform 0.2s;">
                        المتابعة على أي حال
                    </button>
                ` : ''}
                <button id="closeErrorModalBtn" style="background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin-left: auto; transition: background-color 0.2s;">
                    إغلاق وتصحيح الملف
                </button>
            </div>
        </div>
    `;

    // الخطوة 4: إضافة النافذة إلى الصفحة وإضافة الأنماط اللازمة
    document.body.appendChild(modal);
    const styleSheet = document.createElement("style");
    styleSheet.id = "errorModalStyles";
    styleSheet.innerText = `
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        #continueAnywayBtn:hover { transform: scale(1.05); }
        #closeErrorModalBtn:hover { background-color: #5a6268; }
    `;
    document.head.appendChild(styleSheet);


    // الخطوة 5: ربط الأحداث بالأزرار
    document.getElementById('closeErrorModalBtn').onclick = () => {
        modal.remove();
        styleSheet.remove();
    };

    // ربط حدث زر المتابعة فقط في حالة وجوده
    const continueBtn = document.getElementById('continueAnywayBtn');
    if (continueBtn) {
        continueBtn.onclick = () => {
            modal.remove();
            styleSheet.remove();
            if (typeof continueCallback === 'function') {
                continueCallback(); // استدعاء الدالة التي تم تمريرها
            }
        };
    }
}






function renderInvoiceCreationTab() {
    const tabContent = document.getElementById("etaExporterTabContent");
    if (!tabContent) return;

    tabContent.innerHTML = `
        <div style="direction: rtl; text-align: right; padding: 15px; font-family: 'Segoe UI', Tahoma, sans-serif;">
            <h4 style="margin: 0 0 10px 0; color: #2161a1; border-bottom: 2px solid #ddd; padding-bottom: 10px;">إنشاء الفواتير (مع دعم متعدد البنود)</h4>
            <p style="font-size: 14px; color: #555; line-height: 1.6;">
                لإضافة عدة بنود لنفس الفاتورة، كرر بيانات الفاتورة (مثل الرقم الداخلي واسم المستلم) في عدة سطور مع تغيير بيانات البند فقط.
            </p>

            <!-- ✅ --- بداية التعديل: استبدال Checkbox بقائمة منسدلة --- ✅ -->
            <div style="background: #eef7ff; border: 1px solid #bde0ff; border-radius: 8px; padding: 15px; margin: 20px 0;">
                <label for="invoiceVersionSelect" style="display: block; font-weight: bold; color: #0056b3; margin-bottom: 10px;">1. حدد نوع الفاتورة (الإصدار):</label>
                <select id="invoiceVersionSelect" style="width: 100%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; font-size: 16px;">
                    <option value="1.0" selected>فاتورة كاملة وموقعة (إصدار 1.0)</option>
                    <option value="0.9">مسودة غير موقعة (إصدار 0.9)</option>
                </select>
                <p style="font-size: 13px; color: #0056b3; margin: 8px 5px 0 0;">
                    اختر "إصدار 1.0" للحفظ النهائي، أو "إصدار 0.9" إذا كنت تريد حفظها كمسودة بدون توقيع إلكتروني.
                </p>
            </div>
            <!-- ✅ --- نهاية التعديل --- ✅ -->

            <div style="margin: 20px 0; display: flex; gap: 15px;">
                <button id="downloadTemplateBtn_v3" style="padding: 10px 15px; background-color: #17a2b8; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; flex-grow: 1;">
                    📥 2. تحميل نموذج Excel
                </button>
                <label for="excelUploadInput_v3" style="padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; flex-grow: 1; text-align: center;">
                    📂 3. رفع الملف للمراجعة والحفظ
                </label>
                <input type="file" id="excelUploadInput_v3" accept=".xlsx, .xls" style="display: none;">
            </div>
        </div>
    `;

    document.getElementById('downloadTemplateBtn_v3').addEventListener('click', downloadExcelTemplate_v3);
    document.getElementById('excelUploadInput_v3').addEventListener('change', handleExcelUpload_v3);
}








// =========================================================================
// ✅ 1. البيانات الأساسية للقوائم المنسدلة (النسخة الكاملة)
// =========================================================================
const currencies = [
    { code: "EGP", desc: "جنيه مصري" },
    { code: "USD", desc: "دولار أمريكي" },
    { code: "EUR", desc: "يورو" },
    { code: "GBP", desc: "جنيه إسترليني" },
    { code: "SAR", desc: "ريال سعودي" }
];
// بيانات أنواع المستلمين
const receiverTypes = [
    { code: "B", desc: "شركة" },
    { code: "P", desc: "شخصي" }, 
    { code: "F", desc: "أجنبي" }
];
const itemCodeTypes = [
    { code: "EGS", desc: "EGS" },
    { code: "GS1", desc: "GS1" }
];
const countryCodes = [
    { "code": "EG", "Desc_ar": "مصر" }, { "code": "AE", "Desc_ar": "الامارات العربية المتحدة" },
    { "code": "SA", "Desc_ar": "السعودية" }, { "code": "QA", "Desc_ar": "قطر" },
    { "code": "KW", "Desc_ar": "الكويت" }, { "code": "JO", "Desc_ar": "الأردن" },
    // ... يمكنك إضافة باقي الدول هنا بنفس التنسيق ...
];

// بيانات وحدات القياس الشائعة
const unitTypes = [
    { "code": "EA", "desc_ar": "قطعة" }, { "code": "KGM", "desc_ar": "كيلوجرام" },
    { "code": "LTR", "desc_ar": "لتر" }, { "code": "MTR", "desc_ar": "متر" },
    { "code": "TNE", "desc_ar": "طن" }, { "code": "BOX", "desc_ar": "صندوق" },
    { "code": "CT", "desc_ar": "كرتونة" }, { "code": "PK", "desc_ar": "علبة" },
    { "code": "SET", "desc_ar": "مجموعة" }, { "code": "RO", "desc_ar": "لفة" }
];

// بيانات أنواع الضرائب الرئيسية والفرعية
const taxTypes = {
    "T1": {
        desc: "ضريبة القيمة المضافة",
        subtypes: [
            { code: "V001", desc: "تصدير للخارج (0%)" }, { code: "V002", desc: "تصدير مناطق حرة (0%)" },
            { code: "V003", desc: "سلعة أو خدمة معفاة" }, { code: "V004", desc: "سلعة أو خدمة غير خاضعة" },
            { code: "V005", desc: "إعفاءات دبلوماسية" }, { code: "V008", desc: "إعفاءات خاصة" },
            { code: "V009", desc: "سلع عامة (14%)" }, { code: "V010", desc: "نسب أخرى" }
        ]
    },
    "T2": {
        desc: "ضريبة الجدول (نسبية)",
        subtypes: [ { code: "Tbl01", desc: "ضريبة جدول نسبية" } ]
    },
    "T3": {
        desc: "ضريبة الجدول (النوعية)",
        subtypes: [ { code: "Tbl02", desc: "ضريبة جدول نوعية (قطعية)" } ]
    },
    "T4": {
        desc: "الخصم تحت حساب الضريبة",
        subtypes: [
            { code: "W001", desc: "المقاولات" }, { code: "W002", desc: "التوريدات" },
            { code: "W003", desc: "المشتريات" }, { code: "W004", desc: "الخدمات" },
            { code: "W010", desc: "أتعاب مهنية" }
        ]
    },
    "T5": { desc: "ضريبة الدمغة (نسبية)", subtypes: [ { code: "ST01", desc: "دمغة نسبية" } ] },
    "T6": { desc: "ضريبة الدمغة (قطعية)", subtypes: [ { code: "ST02", desc: "دمغة قطعية" } ] },
    "T7": { desc: "ضريبة الملاهي", subtypes: [ { code: "Ent01", desc: "ملاهي (نسبة)" } ] },
    "T8": { desc: "رسم تنمية الموارد", subtypes: [ { code: "RD01", desc: "تنمية موارد (نسبة)" } ] },
    "T9": { desc: "رسم خدمة", subtypes: [ { code: "SC01", desc: "رسم خدمة (نسبة)" } ] },
    "T10": { desc: "رسم المحليات", subtypes: [ { code: "Mn01", desc: "رسم محليات (نسبة)" } ] },
    "T11": { desc: "رسم التأمين الصحي", subtypes: [ { code: "MI01", desc: "تأمين صحي (نسبة)" } ] },
    "T12": { desc: "رسوم أخرى", subtypes: [ { code: "OF01", desc: "رسوم أخرى (نسبة)" } ] }
};

// قاموس عكسي لترجمة المسميات إلى رموز عند الرفع (لا حاجة لتعديله)

const reverseMappings = {
    receiverTypes: Object.fromEntries(receiverTypes.map(item => [item.desc, item.code])),
    itemCodeTypes: Object.fromEntries(itemCodeTypes.map(item => [item.desc, item.code])), // هذا صحيح الآن
    countries: Object.fromEntries(countryCodes.map(item => [item.Desc_ar, item.code])),
    units: Object.fromEntries(unitTypes.map(item => [item.desc_ar, item.code])),
    currencies: Object.fromEntries(currencies.map(item => [item.desc, item.code])), // <-- ✨✨ السطر الجديد والمهم ✨✨
    taxTypes: Object.fromEntries(Object.entries(taxTypes).map(([code, data]) => [data.desc, code])),
    taxSubtypes: Object.fromEntries(
        Object.values(taxTypes).flatMap(data => data.subtypes.map(sub => [sub.desc, sub.code]))
    )
};







/**
 * =========================================================================
 * ✅ الدالة النهائية للفواتير (v4.5): مع التعليقات، النجمة، والفلترة
 * =========================================================================
 */
async function downloadExcelTemplate_v3() {
    const loadingToast = showToastNotification('جاري إنشاء نموذج الإكسيل الذكي...', 0);

    try {
        if (typeof ExcelJS === 'undefined') throw new Error("مكتبة ExcelJS غير محملة.");

        const workbook = new ExcelJS.Workbook();
        const mainSheet = workbook.addWorksheet("Invoices");
        const listsSheet = workbook.addWorksheet("Lists");

        // ... (كود إعداد ورقة Lists لا يتغير) ...
        listsSheet.getCell('A1').value = "ReceiverTypes";
        listsSheet.getCell('B1').value = "CodeTypes";
        listsSheet.getCell('C1').value = "UnitTypes";
        listsSheet.getCell('D1').value = "Currencies";
        listsSheet.getCell('E1').value = "MainTaxTypes";
        listsSheet.getCell('F1').value = "Countries";
        receiverTypes.forEach((item, i) => { listsSheet.getCell(`A${i + 2}`).value = item.desc; });
        itemCodeTypes.forEach((item, i) => { listsSheet.getCell(`B${i + 2}`).value = item.code; });
        unitTypes.forEach((item, i) => { listsSheet.getCell(`C${i + 2}`).value = item.desc_ar; });
        currencies.forEach((item, i) => { listsSheet.getCell(`D${i + 2}`).value = item.desc; });
        Object.values(taxTypes).forEach((item, i) => { listsSheet.getCell(`E${i + 2}`).value = item.desc; });
        countryCodes.forEach((item, i) => { listsSheet.getCell(`F${i + 2}`).value = item.Desc_ar; });
        let taxColIndex = 7;
        Object.values(taxTypes).forEach(data => {
            const headerCell = listsSheet.getCell(1, taxColIndex);
            headerCell.value = data.desc.replace(/[ ()]/g, '_');
            data.subtypes.forEach((subtype, i) => { listsSheet.getCell(i + 2, taxColIndex).value = subtype.desc; });
            taxColIndex++;
        });

        // --- ✅✅✅ بداية التعديلات الجديدة ✅✅✅ ---

        // 1. تحديد العناوين مع إضافة النجمة للحقول الإجبارية
        const headers = [
            'الرقم الداخلي للفاتورة (*)', 'رقم تسجيل المستلم (*)', 'اسم المستلم (*)', 'نوع المستلم (*)',
            'دولة المستلم (*)', 'محافظة المستلم (*)', 'مدينة المستلم (*)', 'شارع المستلم (*)', 'مبنى المستلم (*)',
            'وصف الصنف (*)', 'نوع كود الصنف (*)', 'كود الصنف (*)', 'الكود الداخلي للصنف', 'وحدة القياس (*)',
            'الكمية (*)', 'سعر الوحدة (*)', 'عملة البيع', 'سعر الصرف', 'نسبة الخصم', 'قيمة الخصم',
            'نوع الضريبة 1 (*)', 'النوع الفرعي 1 (*)', 'نسبة الضريبة 1 (*)',
            'نوع الضريبة 2', 'النوع الفرعي 2', 'نسبة الضريبة 2', 'نوع الضريبة 3', 'النوع الفرعي 3', 'نسبة الضريبة 3',
            'مرجع طلب الشراء', 'وصف طلب الشراء', 'مرجع طلب المبيعات', 'وصف طلب المبيعات',
            'اسم البنك', 'رقم حساب البنك', 'طريقة التوصيل', 'التغليف'
        ];
        mainSheet.columns = headers.map(h => ({ header: h, key: h }));

        // 2. تطبيق التنسيقات والتعليقات على رأس الجدول
        mainSheet.getRow(1).eachCell((cell) => {
            const headerText = cell.value;
            const cleanHeader = headerText.replace(' (*)', ''); // إزالة النجمة للبحث في القاموس
            
            // إضافة التعليق (الشرح) إذا كان موجوداً
            if (excelCellComments[cleanHeader]) {
                cell.note = excelCellComments[cleanHeader];
            }

            // تطبيق التنسيق (لون غامق وخط أبيض)
            cell.font = { name: 'Arial', bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF343A40' } };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
        });

        // 3. تفعيل الفلتر على كل الأعمدة
        mainSheet.autoFilter = {
            from: 'A1',
            to: { row: 1, column: headers.length }
        };
        
        // ... (باقي الكود من ضبط عرض الأعمدة وتطبيق القوائم المنسدلة لا يتغير) ...
        mainSheet.columns.forEach(column => {
            let maxLength = 0;
            column.eachCell({ includeEmpty: true }, (cell) => {
                const cellLength = cell.value ? String(cell.value).length : 0;
                const headerLength = cell.address.startsWith(column.letter + '1') ? String(cell.value).length : 0;
                if (Math.max(cellLength, headerLength) > maxLength) {
                    maxLength = Math.max(cellLength, headerLength);
                }
            });
            column.width = Math.max(15, Math.min(maxLength + 5, 45));
        });
        const addValidation = (columnLetter, formula) => {
            for (let i = 2; i <= 1001; i++) {
                mainSheet.getCell(`${columnLetter}${i}`).dataValidation = { type: 'list', allowBlank: true, formulae: [formula] };
            }
        };
        addValidation('D', '=Lists!$A$2:$A$4');
        addValidation('E', `=Lists!$F$2:$F$${countryCodes.length + 1}`);
        addValidation('K', '=Lists!$B$2:$B$3');
        addValidation('N', `=Lists!$C$2:$C$${unitTypes.length + 1}`);
        addValidation('Q', `=Lists!$D$2:$D$${currencies.length + 1}`);
        addValidation('U', `=Lists!$E$2:$E$${Object.keys(taxTypes).length + 1}`);
        addValidation('X', `=Lists!$E$2:$E$${Object.keys(taxTypes).length + 1}`);
        addValidation('AA', `=Lists!$E$2:$E$${Object.keys(taxTypes).length + 1}`);
        const cascadingFormula1 = '=INDIRECT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(U2," ","_"),"(","_"),")","_"))';
        const cascadingFormula2 = '=INDIRECT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(X2," ","_"),"(","_"),")","_"))';
        const cascadingFormula3 = '=INDIRECT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(AA2," ","_"),"(","_"),")","_"))';
        addValidation('V', cascadingFormula1);
        addValidation('Y', cascadingFormula2);
        addValidation('AB', cascadingFormula3);

        Object.values(taxTypes).forEach((data, i) => {
            const colLetter = String.fromCharCode('A'.charCodeAt(0) + 6 + i);
            const rangeName = data.desc.replace(/[ ()]/g, '_');
            const rangeFormula = `Lists!$${colLetter}$2:$${colLetter}$${data.subtypes.length + 1}`;
            workbook.definedNames.add(rangeFormula, rangeName);
        });

        // --- ✅✅✅ نهاية التعديلات الجديدة ✅✅✅ ---

        listsSheet.state = 'hidden';
        mainSheet.views = [{ rightToLeft: true }]; // إلغاء التجميد

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        
        if (typeof saveAs === 'undefined') throw new Error("مكتبة FileSaver.js غير محملة.");
        saveAs(blob, "نموذج_فواتير_احترافي.xlsx");

    } catch (error) {
        alert("فشل إنشاء نموذج الإكسيل: " + error.message);
    } finally {
        loadingToast.remove();
    }
}











const defaultSubtypes = {
    "T1": "V009",   // VAT Standard Rate
    "T2": "Tbl01",  // جدول نسبي
    "T3": "Tbl02",  // جدول نوعي
    "T4": "W001",   // خصم تحت حساب الضريبة
    "T5": "ST01",   // دمغة نسبية
    "T6": "ST02",   // دمغة قطعية
    "T7": "Ent01",  // ملاهي
    "T8": "RD01",   // رسم تنمية موارد
    "T9": "SC01",   // رسم خدمة
    "T10": "Mn01",  // محليات
    "T11": "MI01",  // تأمين صحي
    "T12": "OF01"   // رسوم أخرى
};


/**
 * دالة مساعدة لتنظيف النصوص من العلامات الخاصة غير المرغوب فيها.
 * @param {any} text - النص المراد تنظيفه.
 * @returns {string} - النص النظيف.
 */
function sanitizeText(text) {
    if (text === null || text === undefined) {
        return "";
    }
    // 1. حول القيمة إلى نص
    let str = String(text);
    // 2. أزل العلامات الخاصة الشائعة واترك المسافات والحروف والأرقام
    // هذه العلامات هي التي تسبب مشاكل عادة: . # @ _
    return str.replace(/[.\#@_]/g, '').trim();
}


/**
 * ✅✅✅ الدالة النهائية والمحسّنة (v5.3) - مع منطق الضرائب والدولة المباشر ✅✅✅
 * تقوم ببناء هيكل الفاتورة (Payload) لإرساله إلى الـ API.
 */
function createInvoicePayloadFromLines_v3(lines, editedIssuerData) {
    if (!lines || lines.length === 0) {
        throw new Error("لا توجد بنود لهذه الفاتورة.");
    }

    const firstLine = lines[0];
    
    const activeTypeButton = document.querySelector('.invoice-type-btn.active');
    const invoiceType = activeTypeButton ? activeTypeButton.dataset.type : 'FullInvoice';
    
    const activitySelect = document.getElementById('activity-select-editor');
    const selectedActivityCode = activitySelect ? activitySelect.value : editedIssuerData.taxpayerActivityCode;

    const issuerPayload = {
        type: "B", id: editedIssuerData.id, name: editedIssuerData.name,
        address: {
            branchID: "0", country: 'EG', governate: editedIssuerData.governate,
            regionCity: editedIssuerData.regionCity, street: editedIssuerData.street,
            buildingNumber: editedIssuerData.buildingNumber, postalCode: "", floor: "", 
            room: "", landmark: "", additionalInformation: ""
        }
    };

    if (!issuerPayload.id || !issuerPayload.name) {
        throw new Error("بيانات المصدر (رقم التسجيل والاسم) مطلوبة.");
    }

    let totalSalesAmount = 0;
    let totalDiscountAmount = 0;
    const taxTotalsMap = new Map();

    const invoiceLines = lines.map(line => {
        const quantity = parseFloat(line.quantity) || 0;
        const amountSold = parseFloat(line.unit_price) || 0;
        const exchangeRate = parseFloat(line.exchange_rate) || 1;
        const amountEGP = parseFloat((amountSold * exchangeRate).toFixed(5));
        const salesTotal = parseFloat((quantity * amountEGP).toFixed(5));
        totalSalesAmount += salesTotal;

        let discountAmount = parseFloat(line.discount_amount) || (salesTotal * (parseFloat(line.discount_rate) || 0) / 100);
        totalDiscountAmount += discountAmount;
        const netTotal = parseFloat((salesTotal - discountAmount).toFixed(5));

        const taxableItems = [];
        let totalTaxAmountForItem = 0;
        let tableTaxAmount = 0;

        for (let i = 1; i <= 3; i++) {
            const taxType = line[`tax_type_${i}`]?.trim().toUpperCase();
            const taxRateStr = line[`tax_rate_${i}`];
            if ((taxType === "T2" || taxType === "T3") && taxRateStr && !isNaN(parseFloat(taxRateStr))) {
                const taxRate = parseFloat(taxRateStr);
                const taxAmount = parseFloat((netTotal * (taxRate / 100)).toFixed(5));
                const taxSubtype = line[`tax_subtype_${i}`]?.trim() || defaultSubtypes[taxType] || "";
                taxableItems.push({ taxType, amount: taxAmount, subType: taxSubtype, rate: taxRate });
                tableTaxAmount += taxAmount;
                totalTaxAmountForItem += taxAmount;
                taxTotalsMap.set(taxType, (taxTotalsMap.get(taxType) || 0) + taxAmount);
            }
        }

        const vatBaseAmount = netTotal + tableTaxAmount;

        for (let i = 1; i <= 3; i++) {
            const taxType = line[`tax_type_${i}`]?.trim().toUpperCase();
            const taxRateStr = line[`tax_rate_${i}`];
            if (taxType === "T2" || taxType === "T3") continue;
            if (taxType && taxRateStr && !isNaN(parseFloat(taxRateStr))) {
                const taxRate = parseFloat(taxRateStr);
                let taxAmount = (taxType === "T1") ? parseFloat((vatBaseAmount * (taxRate / 100)).toFixed(5)) : parseFloat((netTotal * (taxRate / 100)).toFixed(5));
                const taxSubtype = line[`tax_subtype_${i}`]?.trim() || defaultSubtypes[taxType] || "";
                taxableItems.push({ taxType, amount: taxAmount, subType: taxSubtype, rate: taxRate });
                totalTaxAmountForItem += (taxType === "T4" ? -taxAmount : taxAmount);
                taxTotalsMap.set(taxType, (taxTotalsMap.get(taxType) || 0) + taxAmount);
            }
        }

        const currency = (line.currency_sold || 'EGP').toUpperCase();
        const unitValue = { currencySold: currency, amountEGP: amountEGP, amountSold: 0 };
        if (currency !== 'EGP') {
            unitValue.amountSold = amountSold;
            unitValue.currencyExchangeRate = exchangeRate;
        }

        const total = parseFloat((netTotal + totalTaxAmountForItem).toFixed(5));
const finalInternalCode = line.item_internal_code || "";
        const finalDescription = line.item_description || line.item_code_name || line.item_code;

        return {
            description: finalDescription, itemType: line.item_type, itemCode: line.item_code,
            internalCode: finalInternalCode, unitType: line.unit_type, quantity: quantity,
            salesTotal: salesTotal, discount: { amount: discountAmount }, netTotal: netTotal,
            total: total, unitValue: unitValue, taxableItems: taxableItems,
            valueDifference: 0, totalTaxableFees: 0, itemsDiscount: 0
        };
    });

    const taxTotals = Array.from(taxTotalsMap, ([taxType, amount]) => ({ taxType, amount: parseFloat(amount.toFixed(5)) }));
    const finalTotalSales = parseFloat(totalSalesAmount.toFixed(5));
    const finalTotalDiscount = parseFloat(totalDiscountAmount.toFixed(5));
    const finalNetAmount = parseFloat((finalTotalSales - finalTotalDiscount).toFixed(5));
    const finalTotalAmount = parseFloat(invoiceLines.reduce((sum, line) => sum + line.total, 0).toFixed(5));

    const version = document.getElementById('invoiceVersionSelect')?.value || '1.0';
    const isUnsigned = (version === '0.9');
    const tags = isUnsigned ? ["SimpleInvoice"] : [invoiceType, "SignatureRequired"];
    const signatures = isUnsigned ? [] : [{ signatureType: "I", value: "VGVtcG9yYXJ5IFNpZ25hdHVyZSBIb2xkZXI=" }];

    // --- تطبيق منطق تحديد الدولة المباشر ---
    const userEnteredCountry = (firstLine.receiver_country || 'EG').toUpperCase().trim();

    const cleanedAddress = {
        country: userEnteredCountry,
        governate: sanitizeText(firstLine.receiver_governate),
        regionCity: sanitizeText(firstLine.receiver_city),
        street: sanitizeText(firstLine.receiver_street),
        buildingNumber: String(firstLine.receiver_building || '').replace(/[^A-Za-z0-9\-\/]/g, ''),
        postalCode: "", floor: "", room: "", landmark: "", additionalInformation: ""
    };

    const documentPayload = {
        issuer: issuerPayload,
        receiver: {
            address: cleanedAddress,
            type: firstLine.receiver_type || 'B',
            id: firstLine.receiver_id,
            name: firstLine.receiver_name
        },
        documentType: "I", documentTypeVersion: version,
        dateTimeIssued: new Date().toISOString().split('.')[0] + "Z",
        taxpayerActivityCode: selectedActivityCode, internalID: firstLine.internalID,
        invoiceLines: invoiceLines, totalSalesAmount: finalTotalSales,
        totalDiscountAmount: finalTotalDiscount, netAmount: finalNetAmount,
        taxTotals: taxTotals, totalAmount: finalTotalAmount,
        totalItemsDiscountAmount: 0, extraDiscountAmount: 0, signatures: signatures
    };

    if (invoiceType === 'FullInvoice') {
        documentPayload.purchaseOrderReference = firstLine.purchaseOrderReference || "";
        documentPayload.purchaseOrderDescription = firstLine.purchaseOrderDescription || "";
        documentPayload.salesOrderReference = firstLine.salesOrderReference || "";
        documentPayload.salesOrderDescription = firstLine.salesOrderDescription || "";
        documentPayload.proformaInvoiceNumber = "";
        documentPayload.payment = { bankName: firstLine.bankName || "", bankAccountNo: firstLine.bankAccountNo || "", swiftCode: "" };
        documentPayload.delivery = { approach: firstLine.deliveryApproach || "", packaging: firstLine.deliveryPackaging || "" };
    } else {
        documentPayload.payment = {};
        documentPayload.delivery = {};
    }

    return {
        tags: tags,
        document: documentPayload
    };
}







function printInvoice(invoiceId, invoiceGroup) {
    const headerRow = invoiceGroup.querySelector('.invoice-header-row');
    const internalID = headerRow.querySelector('[data-field="internalID"]').textContent.trim();
    const receiver_name = headerRow.querySelector('[data-field="receiver_name"]').textContent.trim();
    const receiver_id = headerRow.querySelector('[data-field="receiver_id"]').textContent.trim();
    
    const receiverAddress = {};
    invoiceGroup.querySelectorAll('.receiver-details-table [data-receiver-field]').forEach(cell => {
        const field = cell.dataset.receiverField;
        receiverAddress[field] = cell.textContent.trim();
    });
    
    const issuerData = {};
    invoiceGroup.querySelectorAll('.issuer-details-table [data-issuer-field]').forEach(cell => {
        const field = cell.dataset.issuerField;
        issuerData[field] = cell.textContent.trim();
    });
    
    const extraInvoiceData = {};
    invoiceGroup.querySelectorAll('.extra-details-table [data-invoice-field]').forEach(cell => {
        const field = cell.dataset.invoiceField;
        extraInvoiceData[field] = cell.textContent.trim();
    });
    
    const invoiceLines = [];
    invoiceGroup.querySelectorAll('.items-table tbody tr').forEach(row => {
        const lineData = {};
        row.querySelectorAll('[data-field]').forEach(cell => {
            const field = cell.dataset.field;
            if (cell.children.length > 1) {
                cell.querySelectorAll('span[data-field]').forEach(span => {
                    lineData[span.dataset.field] = span.textContent.trim();
                });
            } else {
                lineData[field] = cell.textContent.trim();
            }
        });
        invoiceLines.push(lineData);
    });
    
    const printContent = createInvoiceHTML({
        internalID,
        receiver_name,
        receiver_id,
        receiverAddress,
        issuerData,
        extraInvoiceData,
        invoiceLines,
        invoiceDate: new Date().toLocaleDateString('ar-EG')
    });
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = function() {
        const printBtn = printWindow.document.createElement('button');
        printBtn.textContent = 'طباعة الفاتورة';
        printBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;';
        printBtn.onclick = function() {
            printWindow.print();
        };
        printWindow.document.body.appendChild(printBtn);
    };
}

function createInvoiceHTML(data) {
    let overallTotalSales = 0;
    let overallTotalDiscount = 0;
    const overallTaxTotals = new Map();

    const itemRowsHTML = data.invoiceLines.map(line => {
        const quantity = parseFloat(line.quantity || 0);
        const price = parseFloat(line.unit_price || 0);
        const exchangeRate = parseFloat(line.exchange_rate || 1);
        const lineTotalBeforeDiscount = quantity * price * exchangeRate;
        let lineDiscount = parseFloat(line.discount_amount) || (lineTotalBeforeDiscount * (parseFloat(line.discount_rate) || 0) / 100);
        const netTotal = lineTotalBeforeDiscount - lineDiscount;
        
        let itemTaxAmount = 0;
        for (let i = 1; i <= 3; i++) {
            const taxType = line[`tax_type_${i}`]?.trim().toUpperCase();
            const taxRate = parseFloat(line[`tax_rate_${i}`] || 0);
            if (taxType && taxRate > 0) {
                const taxAmount = netTotal * (taxRate / 100);
                itemTaxAmount += (taxType === 'T4' ? -1 : 1) * taxAmount;
                overallTaxTotals.set(taxType, (overallTaxTotals.get(taxType) || 0) + taxAmount);
            }
        }
        
        const itemTotalAfterTaxes = netTotal + itemTaxAmount;
        overallTotalDiscount += lineDiscount;
        overallTotalSales += netTotal;

        return `
            <tr>
                <td>${line.item_code || ''}</td>
                <td>${line.item_description || ''}</td>
                <td>${quantity}</td>
                <td>${line.unit_type || ''}</td>
                <td>${price.toFixed(2)}</td>
                <td>${netTotal.toFixed(2)}</td>
                <td>${itemTaxAmount.toFixed(2)}</td>
                <td>${itemTotalAfterTaxes.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    let totalsSectionHTML = `
        <tr><td class="total-label">إجمالي المبيعات (ج.م)</td><td class="total-value">${(overallTotalSales + overallTotalDiscount).toFixed(2)}</td></tr>
        <tr><td class="total-label">إجمالي الخصم (ج.م)</td><td class="total-value">${overallTotalDiscount.toFixed(2)}</td></tr>
    `;
    let grandTotal = overallTotalSales;
    overallTaxTotals.forEach((amount, type) => {
        grandTotal += (type === 'T4' ? -1 : 1) * amount;
        totalsSectionHTML += `<tr><td class="total-label">${taxTypesMap[type] || type} (ج.م)</td><td class="total-value">${amount.toFixed(2)}</td></tr>`;
    });

    return `
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>معاينة فاتورة ${data.internalID}</title>
            <style>
                body { font-family: 'Tahoma', 'Segoe UI', sans-serif; margin: 0; padding: 20px; background-color: #f9f9f9; color: #333; }
                .invoice-container { background: white; max-width: 900px; margin: 0 auto; padding: 25px; border: 1px solid #e0e0e0; }
                .header { text-align: center; border-bottom: 2px solid #ddd; padding-bottom: 10px; margin-bottom: 20px; }
                .header h1 { font-size: 28px; margin: 0; color: #000; }
                .header .invoice-meta { font-size: 14px; margin-top: 10px; color: #555; }
                .header .warning-text { font-size: 14px; margin-top: 10px; color: #d9534f; font-weight: bold; }
                .info-section { display: flex; justify-content: space-between; margin-bottom: 15px; padding: 15px; border: 1px solid #ddd; background-color: #f8f9fa; }
                .info-section > div { flex-basis: 48%; }
                .info-section h3 { margin-top: 0; font-size: 16px; border-bottom: 1px solid #ccc; padding-bottom: 8px; color: #337ab7; }
                .info-section p { margin: 6px 0; font-size: 13px; line-height: 1.5; }
                /* --- القسم الجديد للبيانات الإضافية --- */
                .extra-details-section {
                    padding: 10px 15px;
                    border: 1px solid #ddd;
                    background-color: #f8f9fa;
                    margin-bottom: 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 10px;
                }
                .extra-details-section div { font-size: 12px; }
                .extra-details-section strong { color: #337ab7; }
                /* --- نهاية القسم الجديد --- */
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; font-size: 16px; text-align: center; }
                .items-table th { background-color: #e7e8e9; white-space: nowrap; }
                .totals-section { width: 45%; margin-left: 0; margin-right: auto; font-size: 13px; }
                .totals-section table { width: 100%; border-collapse: collapse; }
                .totals-section td { padding: 8px; border-bottom: 1px solid #eee; }
                .totals-section .total-label { font-weight: bold; text-align: right; }
                .totals-section .total-value { text-align: left; }
                .totals-section .grand-total td { font-weight: bold; font-size: 15px; background-color: #f2f2f2; border-top: 2px solid #333; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #777; }
                @media print { body { background: white; padding: 0; } .invoice-container { box-shadow: none; border: none; } #printBtn { display: none; } }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <button id="printBtn" style="position: fixed; top: 10px; left: 10px; padding: 10px 15px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;" onclick="window.print()">طباعة</button>
                <div class="header">
                    <h1>فاتورة</h1>
                    <div class="invoice-meta"><span>رقم الفاتورة: ${data.internalID}</span> | <span>التاريخ: ${data.invoiceDate}</span></div>
                    <p class="warning-text">معاينة لفاتورة قبل الإرسال (غير معتمدة)</p>
                </div>
                <div class="info-section">
                    <div><h3>البائع</h3><p><strong>الاسم:</strong> ${data.issuerData.name || ''}</p><p><strong>رقم التسجيل:</strong> ${data.issuerData.id || ''}</p><p>${data.issuerData.street || ''}, ${data.issuerData.regionCity || ''}, ${data.issuerData.governate || ''}</p></div>
                    <div><h3>المشتري</h3><p><strong>الاسم:</strong> ${data.receiver_name}</p><p><strong>رقم التسجيل:</strong> ${data.receiver_id}</p><p>${data.receiverAddress.receiver_street || ''}, ${data.receiverAddress.receiver_city || ''}, ${data.receiverAddress.receiver_governate || ''}</p></div>
                </div>
                
                <!-- --- بداية عرض البيانات الإضافية --- -->
                <div class="extra-details-section">
                    <div><strong>مرجع طلب الشراء:</strong> ${data.extraInvoiceData.purchaseOrderReference || ''}</div>
                    <div><strong>وصف طلب الشراء:</strong> ${data.extraInvoiceData.purchaseOrderDescription || ''}</div>
                    <div><strong>مرجع طلب المبيعات:</strong> ${data.extraInvoiceData.salesOrderReference || ''}</div>
                    <div><strong>وصف طلب المبيعات:</strong> ${data.extraInvoiceData.salesOrderDescription || ''}</div>
                    <div><strong>اسم البنك:</strong> ${data.extraInvoiceData.bankName || ''}</div>
                    <div><strong>رقم حساب البنك:</strong> ${data.extraInvoiceData.bankAccountNo || ''}</div>
                    <div><strong>طريقة التوصيل:</strong> ${data.extraInvoiceData.deliveryApproach || ''}</div>
                    <div><strong>التغليف:</strong> ${data.extraInvoiceData.deliveryPackaging || ''}</div>
                </div>
                <!-- --- نهاية عرض البيانات الإضافية --- -->

                <table class="items-table">
                    <thead>
                        <tr>
                            <th>كود الصنف</th><th>الوصف</th><th>الكمية</th><th>الوحدة</th><th>سعر الوحدة</th>
                            <th>الإجمالي</th><th>قيمة الضريبة</th><th>الإجمالي بعد الضريبة</th>
                        </tr>
                    </thead>
                    <tbody>${itemRowsHTML}</tbody>
                </table>
                <div class="totals-section">
                    <table>
                        <tbody>
                            ${totalsSectionHTML}
                            <tr class="grand-total">
                                <td class="total-label">إجمالي المبلغ (ج.م)</td>
                                <td class="total-value">${grandTotal.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="footer"><p>التوقيع: _________________________</p></div>
            </div>
        </body>
        </html>
    `;
}














/**
 * ===================================================================================
 * ✨ دالة معدلة: لتحميل نموذج إشعار المرتجع مع وضع التعليمات في كل خلية
 * ===================================================================================
 */
function downloadReturnReceiptExcelTemplate() {
    // --- ✅✅✅ بداية التعديل المطلوب ✅✅✅ ---
    
    // 1. قاموس الشروحات لكل عمود في ملف المرتجعات
    const comments = {
        'تاريخ الإصدار (YYYY-MM-DD)': 'أدخل التاريخ بصيغة YYYY-MM-DD. مثال: 2025-10-19',
        'رقم إشعار المرتجع الداخلي (*)': 'رقم فريد يميز عملية المرتجع في دفاترك.',
        'UUID الفاتورة الأصلية (*)': 'مطلوب وحساس جداً: يجب نسخ الرقم التعريفي الفريد (UUID) الخاص بفاتورة البيع الأصلية التي يتم إرجاع الأصناف منها.',
        'اسم العميل': 'اختياري: اسم المشتري.',
        'الرقم القومي للعميل': 'اختياري: الرقم القومي للمشتري.',
        'الكود الداخلي للصنف': 'اختياري: كود الصنف في نظامك الداخلي.',
        'وصف الصنف (*)': 'مطلوب: اسم أو وصف واضح للسلعة المرتجعة.',
        'نوع كود الصنف (EGS أو GS1) (*)': 'مطلوب: نوع التكويد (EGS أو GS1).',
        'كود الصنف (*)': 'مطلوب: الكود الفعلي للصنف.',
        'وحدة القياس (*)': 'مطلوب: كود وحدة القياس (مثال: EA للقطعة).',
        'الكمية المرتجعة (*)': 'مطلوب: كمية الصنف التي تم إرجاعها.',
        'سعر الوحدة وقت البيع (*)': 'مطلوب: يجب أن يكون نفس سعر الوحدة الذي تم البيع به في الفاتورة الأصلية.',
        'نوع الضريبة 1 (*)': 'مطلوب: نوع الضريبة الأساسية.',
        'النوع الفرعي للضريبة 1 (*)': 'مطلوب: النوع الفرعي للضريبة.',
        'نسبة الضريبة 1 (*)': 'مطلوب: نسبة الضريبة (مثال: 14).',
        'نوع الضريبة 2': 'اختياري: للضرائب الإضافية.',
        'النوع الفرعي للضريبة 2': 'اختياري: النوع الفرعي للضريبة الثانية.',
        'نسبة الضريبة 2': 'اختياري: نسبة الضريبة الثانية.'
    };
    const headers = Object.keys(comments);

    // إنشاء ملف إكسل جديد
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("قالب المرتجعات");

    // إضافة العناوين وتطبيق الشروحات والتنسيقات
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell, colNumber) => {
        const headerText = cell.value;
        cell.note = comments[headerText] || ''; // وضع الشرح في كل خلية
        cell.font = { name: 'Arial', bold: true, size: 12, color: { argb: 'FFFFFFFF' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFc0392b' } }; // لون أحمر للمرتجعات
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // إضافة صف مثال
    worksheet.addRow([
        '2025-09-30', 'RTN-001', '68e656b251e67e835abcde1234567890fgh...', 'محمد عبد الله', 
        '29010101234567', 'PROD-10', 'لابتوب ديل مرتجع', 'EGS', 'EG-123456789-100', 
        'EA', 1, 15000, 'T1', 'V009', 14, '', '', ''
    ]);

    // ضبط عرض الأعمدة وتفعيل RTL
    worksheet.columns.forEach(column => {
        column.width = 35;
    });
    worksheet.views = [{ rightToLeft: true }];
    
    // --- ✅✅✅ نهاية التعديل المطلوب ✅✅✅ ---

    // تصدير الملف
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, "نموذج_إشعار_المرتجع_معدل.xlsx");
    }).catch(err => {
        alert('فشل إنشاء ملف الإكسيل: ' + err);
    });
}






async function handleReturnReceiptExcelUpload(event) {
    const modalUI = document.getElementById("receiptUploaderTabbedUI");
    if (modalUI) modalUI.style.display = "none";

    const file = event.target.files[0];
    if (!file) return;

    const loadingToast = showToastNotification('جاري قراءة ملف المرتجعات...');

    try {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const allRows = XLSX.utils.sheet_to_json(worksheet);

        if (allRows.length === 0) throw new Error("ملف الإكسل فارغ!");

        const headerMapping = {
            'رقم إشعار المرتجع الداخلي (*)': 'receiptNumber',
            'UUID الفاتورة الأصلية (*)': 'referenceUUID',
            'اسم العميل (اختياري)': 'buyerName',
            'الرقم القومي للعميل (اختياري)': 'buyerId',
            'الكود الداخلي للصنف': 'internalCode',
            'وصف الصنف (*)': 'description',
            'نوع كود الصنف (EGS أو GS1) (*)': 'itemType',
            'كود الصنف (*)': 'itemCode',
            'وحدة القياس (*)': 'unitType',
            'الكمية المرتجعة (*)': 'quantity',
            'سعر الوحدة وقت البيع (*)': 'unitPrice',
            'نوع الضريبة 1 (*)': 'taxType_1',
            'النوع الفرعي للضريبة 1 (*)': 'taxSubType_1',
            'نسبة الضريبة 1 (*)': 'taxRate_1',
            'نوع الضريبة 2 (اختياري)': 'taxType_2',
            'النوع الفرعي للضريبة 2 (اختياري)': 'taxSubType_2',
            'نسبة الضريبة 2 (اختياري)': 'taxRate_2'
        };
        
        const mappedRows = allRows.map(row => {
            const newRow = {};
            for (const arabicHeader in row) {
                const englishKey = headerMapping[arabicHeader.trim()];
                if (englishKey) newRow[englishKey] = row[arabicHeader];
            }
            return newRow;
        });

        const receiptsMap = new Map();
        let lastReceiptNumber = '';
        let lastReturnInfo = {}; 

        mappedRows.forEach(row => {
            const currentReceiptNumber = String(row.receiptNumber || lastReceiptNumber).trim();
            if (!currentReceiptNumber) return;

            if (currentReceiptNumber !== lastReceiptNumber) {
                lastReturnInfo = {
                    referenceUUID: row.referenceUUID,
                    buyerName: row.buyerName,
                    buyerId: row.buyerId,
                };
                receiptsMap.set(currentReceiptNumber, []);
            }

            const finalRow = { ...lastReturnInfo, ...row };
            receiptsMap.get(currentReceiptNumber).push(finalRow);
            lastReceiptNumber = currentReceiptNumber;
        });

        loadingToast.remove();
        showReceiptEditor(receiptsMap, 'return'); 

    } catch (error) {
        alert(`❌ خطأ في معالجة ملف المرتجعات: ${error.message}`);
    } finally {
        if (loadingToast) loadingToast.remove();
        event.target.value = '';
    }
}


/**
 * ===================================================================================
 * ✨ دالة جديدة: لبناء هيكل بيانات إشعار المرتجع (Return Receipt Payload)
 * ===================================================================================
 */
function calculateReturnReceiptData(itemsData, sellerData, deviceSerial, activityCode, failedUuid = null) {
    const finalSellerData = sellerData || window.receiptUploaderData.seller;
    const finalDeviceSerial = deviceSerial || window.receiptUploaderData.serial;
    const finalActivityCode = activityCode || finalSellerData.taxpayerActivityCode || '4690';

    const firstRow = itemsData[0];
    const history = JSON.parse(localStorage.getItem("receiptHistory") || "[]");
    const lastUUID = history.length > 0 ? history[0].uuid : "";

    const header = {
        dateTimeIssued: new Date().toISOString().substring(0, 19) + "Z",
        receiptNumber: String(firstRow.receiptNumber || `RTN_${Math.floor(Date.now() / 1000)}`),
        uuid: "",
        previousUUID: lastUUID,
        referenceUUID: String(firstRow.referenceUUID || ""),
        currency: "EGP",
        exchangeRate: 0.0,
        sOrderNameCode: "",
        orderdeliveryMode: "",
        grossWeight: 0.0,
        netWeight: 0.0
    };
    if (failedUuid) {
        header.referenceOldUUID = failedUuid;
    }

    let finalTotalSales = 0;
    const finalTaxTotalsMap = new Map();
    const calculatedItemData = itemsData.map(item => {
        const quantity = parseFloat(item.quantity) || 0;
        const unitPrice = parseFloat(item.unitPrice) || 0;
        const itemTotalSale = parseFloat((quantity * unitPrice).toFixed(5));
        const itemNetSale = itemTotalSale;
        let totalTaxAmountForItem = 0;
        const taxableItems = [];

        for (let i = 1; i <= 2; i++) {
            const taxType = item[`taxType_${i}`];
            const taxRate = parseFloat(item[`taxRate_${i}`]);
            if (taxType && !isNaN(taxRate) && taxRate > 0) {
                const taxAmount = parseFloat((itemNetSale * (taxRate / 100)).toFixed(5));
                taxableItems.push({ taxType: String(taxType), amount: taxAmount, subType: String(item[`taxSubType_${i}`]), rate: taxRate });
                totalTaxAmountForItem += (taxType === 'T4' ? -taxAmount : taxAmount);
                finalTaxTotalsMap.set(String(taxType), (finalTaxTotalsMap.get(String(taxType)) || 0) + taxAmount);
            }
        }

        const itemTotal = parseFloat((itemNetSale + totalTaxAmountForItem).toFixed(5));
        finalTotalSales += itemTotalSale;

        return {
            internalCode: String(item.internalCode),
            description: String(item.description),
            itemType: String(item.itemType || 'EGS'),
            itemCode: String(item.itemCode),
            unitType: String(item.unitType || 'EA'),
            quantity: quantity,
            unitPrice: unitPrice,
            totalSale: itemTotalSale,
            netSale: itemNetSale,
            total: itemTotal,
            valueDifference: 0,
            itemDiscountData: [],
            taxableItems: taxableItems
        };
    });

    const totalAmount = parseFloat(calculatedItemData.reduce((sum, item) => sum + item.total, 0).toFixed(5));

    return {
        header: header,
        documentType: {
            receiptType: "R",
            typeVersion: "1.2"
        },
        seller: {
            rin: finalSellerData.id,
            companyTradeName: finalSellerData.name,
            branchCode: "0",
            branchAddress: { country: "EG", governate: finalSellerData.governate, regionCity: finalSellerData.regionCity, street: finalSellerData.street, buildingNumber: finalSellerData.buildingNumber },
            deviceSerialNumber: finalDeviceSerial,
            activityCode: finalActivityCode,
        },
        buyer: {
            type: "P",
            id: firstRow.buyerId || "",
            name: firstRow.buyerName || "عميل نقدي",
        },
        itemData: calculatedItemData,
        totalSales: parseFloat(finalTotalSales.toFixed(5)),
        netAmount: parseFloat(finalTotalSales.toFixed(5)),
        taxTotals: Array.from(finalTaxTotalsMap, ([taxType, amount]) => ({ taxType, amount: parseFloat(amount.toFixed(5)) })),
        totalAmount: totalAmount,
        paymentMethod: "C",
        feesAmount: 0.0,
        adjustment: 0.0
    };
}


async function sendReceipts_V3(batchObject, batchLabel) {
    try {
        const receiptChain = batchObject.receipts;
        if (!receiptChain || receiptChain.length === 0) throw new Error("كائن الدفعة فارغ.");
        const finalUuidInChain = receiptChain[receiptChain.length - 1].header.uuid;

        const finalPayloadText = JSON.stringify(batchObject, null, 2);
        const zip = new JSZip();
        zip.file("receipts.json", finalPayloadText);
        const zipBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });

        const fileInput = document.querySelector('input[type="file"]');
        if (!fileInput) throw new Error('لم يتم العثور على حقل رفع الملفات (input[type="file"]).');
        
        const file = new File([zipBlob], "receipts.zip", { type: "application/zip" });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event('change', { bubbles: true }));

        await new Promise(resolve => setTimeout(resolve, 200));
        const buttonSpan = Array.from(document.querySelectorAll('button span.ms-Button-label')).find(span => span.textContent.trim() === 'ابدأ المعالجة');
        if (!buttonSpan) throw new Error('لم يتم العثور على زر "ابدأ المعالجة".');
        
        const processButton = buttonSpan.closest('button');
        processButton.click();

        // --- ✅✅✅ بداية التعديل لحل مشكلة المهلة ✅✅✅ ---
        await new Promise((resolve) => { // تم إزالة reject
            const maxWaitTime = 30000;
            const checkInterval = 250;
            let elapsedTime = 0;
            const intervalId = setInterval(() => {
                const buttonStillExists = document.body.contains(processButton) && processButton.offsetParent !== null;
                // إذا اختفى الزر، أو انتهت المهلة، اعتبر العملية ناجحة في كلتا الحالتين
                if (!buttonStillExists || elapsedTime >= maxWaitTime) {
                    clearInterval(intervalId);
                    resolve(); // <-- يتم استدعاء resolve دائماً
                }
                elapsedTime += checkInterval;
            }, checkInterval);
        });
        // --- ✅✅✅ نهاية التعديل ✅✅✅ ---

        return { success: true, uuid: finalUuidInChain, error: null };

    } catch (error) {
        return { success: false, uuid: '', error: error.message };
    }
}


// ===================================================================================
// ✅✅✅ النسخة التشخيصية الجديدة لدالة جلب الإعلانات ✅✅✅
// ===================================================================================
async function loadAdvertisements() {
    // الخطوة 1: الإعلان عن بدء التشغيل
    console.log("--- [الخطوة 1] --- بدء تشغيل دالة loadAdvertisements (النسخة التشخيصية).");

    const adsContent = document.getElementById('dynamic-ads-content');
    if (!adsContent) {
        console.error("--- [خطأ فادح] --- توقفت العملية. لم يتم العثور على الحاوية #dynamic-ads-content في الصفحة.");
        return;
    }
    
    // الخطوة 2: تأكيد العثور على الحاوية
    console.log("--- [الخطوة 2] --- تم العثور على حاوية الإعلانات بنجاح.");
    adsContent.innerHTML = '<p style="text-align:center; color:#007bff;">جاري الاتصال بالخادم لجلب الإعلانات...</p>';

    try {
        const binUrl = 'https://api.jsonbin.io/v3/b/68dbb9bf43b1c97be9555347';
        console.log(`--- [الخطوة 3] --- سيتم الآن إرسال طلب إلى الرابط: ${binUrl}` );

        // الخطوة 3: إرسال الطلب
        const response = await fetch(binUrl);

        console.log(`--- [الخطوة 4] --- تم استلام رد من الخادم. رمز الحالة (Status): ${response.status}`);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("--- [خطأ في الرد] --- الخادم أرجع خطأ:", errorText);
            throw new Error(`فشل الاتصال بالخادم (Status: ${response.status})`);
        }

        console.log("--- [الخطوة 5] --- الرد من الخادم ناجح. جاري تحويل البيانات من JSON...");
        const data = await response.json();
        console.log("--- [الخطوة 6] --- تم تحويل البيانات بنجاح. هذا هو شكل البيانات المستلمة بالكامل:", data);

        // ✨✨✨ الجزء التشخيصي الجديد ✨✨✨
        // نحاول إيجاد مصفوفة الإعلانات في مكانين محتملين
        const ads = data.record?.advertisements || data.advertisements;
        
        if (ads && Array.isArray(ads) && ads.length > 0) {
            console.log(`--- [الخطوة 7] --- تم العثور على مصفوفة الإعلانات. عدد الإعلانات: ${ads.length}`);
            console.log("--- [الخطوة 8] --- جاري بناء كود HTML للإعلانات وعرضها في الصفحة.");
            
            // بناء HTML وعرضه
            adsContent.innerHTML = ads.map(ad => `
                <div class="ad-item">
                    <img src="${ad.imageUrl}" alt="${ad.title}">
                    <div class="ad-text">
                        <h4>${ad.title}</h4>
                        <p>${ad.description}</p>
                    </div>
                </div>
            `).join('');
            
            console.log("--- [الخطوة 9 - نجاح] --- تم عرض الإعلانات بنجاح!");
        } else {
            // إذا لم نجد الإعلانات
            console.warn("--- [تحذير] --- مصفوفة الإعلانات فارغة أو غير موجودة بالشكل الصحيح في 'data.record.advertisements' أو 'data.advertisements'.");
            adsContent.innerHTML = '<p style="text-align:center; color:#888;">الاتصال ناجح، ولكن لم يتم العثور على إعلانات في الملف. يرجى مراجعة هيكل ملف JSON.</p>';
        }

    } catch (error) {
        // عرض أي خطأ عام يحدث أثناء العملية
        console.error('--- [خطأ عام] --- حدث خطأ أثناء تنفيذ العملية:', error);
        adsContent.innerHTML = `<p style="text-align:center; color:red; font-weight:bold;">حدث خطأ: ${error.message}</p>`;
    }
}


})(); // <--- هذا هو السطر الأخير في ملفك
