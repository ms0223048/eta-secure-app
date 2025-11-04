// =========================================================================
// ✅ الملف الكامل والنهائي للخادم الآمن (api/server.js)
// =========================================================================

// استيراد مكتبة التشفير المدمجة في Node.js
import crypto from 'crypto';

// -------------------------------------------------------------------------
// 1. دالة حساب UUID (النسخة الكاملة والصحيحة)
// -------------------------------------------------------------------------
// هذه الدالة تقوم بنفس وظيفة sha256Hex التي كانت لديك، وهي ضرورية لحساب UUID.
async function computeUuid(canonicalString) {
    // تحويل النص إلى صيغة يفهمها نظام التشفير (UTF-8 bytes)
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalString);

    // استخدام web crypto API المدمج لعملية التجزئة (Hashing) من نوع SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // تحويل الناتج (وهو بيانات ثنائية) إلى مصفوفة من الأرقام
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    // تحويل كل رقم في المصفوفة إلى تمثيله الست عشري (hex) وتجميعها في نص واحد
    // .padStart(2, '0') تضمن أن كل جزء يكون مكوناً من رقمين (مثال: 5 تصبح 05)
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

// -------------------------------------------------------------------------
// 2. دالة حفظ المسودة في بوابة الضرائب (باستخدام الرابط الصحيح)
// -------------------------------------------------------------------------
async function submitDraftToETA(payload, token) {
    // التحقق من وجود توكن المصادقة
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    // الرابط الصحيح والمباشر لحفظ المسودات الذي أشرت إليه
    const DRAFT_API_URL = "https://api-portal.invoicing.eta.gov.eg/api/v1/documents/drafts";

    // إرسال الطلب إلى بوابة الضرائب
    const response = await fetch(DRAFT_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        // هذا الرابط يتوقع استلام كائن الفاتورة مباشرة
        body: JSON.stringify(payload )
    });

    // في حالة فشل الطلب، قم بإظهار رسالة خطأ واضحة
    if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ error: { message: `Request failed with status ${response.status}` } }));
        const errorMessage = errorResult.error?.details?.[0]?.message || errorResult.error?.message || JSON.stringify(errorResult);
        throw new Error(errorMessage);
    }

    // في حالة النجاح، قم بإرجاع الرد من البوابة
    return await response.json();
}

// -------------------------------------------------------------------------
// 3. المتحكم الرئيسي (Handler) الذي يستقبل الطلبات من الإضافة
// -------------------------------------------------------------------------
// هذه هي نقطة الدخول الرئيسية للخادم الخاص بك
export default async function handler(request, response) {
    // السماح فقط بطلبات POST
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    // قراءة البيانات المرسلة من الإضافة
    const { action, data, token } = request.body;

    try {
        let result;
        // توجيه الطلب بناءً على نوع الإجراء المطلوب
        switch (action) {
            // الحالة الأولى: طلب حساب UUID
            case 'generate-uuid':
                if (!data) throw new Error("Canonical string is required for UUID generation.");
                const uuid = await computeUuid(data);
                result = { uuid };
                break;

            // الحالة الثانية: طلب حفظ الفاتورة كمسودة
            case 'submit-draft':
                if (!data) throw new Error("Payload is required for submission.");
                if (!token) throw new Error("Token is required for submission.");
                
                // رابط المسودات يقبل فاتورة واحدة فقط في كل مرة،
                // لذا نأخذ أول فاتورة من مصفوفة receipts
                const singleInvoicePayload = data.receipts[0]; 
                result = await submitDraftToETA(singleInvoicePayload, token);
                break;

            // حالة وجود إجراء غير معروف
            default:
                throw new Error("Invalid action specified.");
        }
        // إرجاع النتيجة بنجاح إلى الإضافة
        return response.status(200).json(result);

    } catch (error) {
        // في حالة حدوث أي خطأ، قم بإرجاعه إلى الإضافة
        return response.status(500).json({ error: error.message });
    }
}
