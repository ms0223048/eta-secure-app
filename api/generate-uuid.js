// المسار: api/server.js

import crypto from 'crypto';

// =========================================================================
// ✅ 1. دالة حساب UUID (المنطق المحمي على الخادم)
// =========================================================================
async function computeUuid(canonicalString) {
    const encoder = new TextEncoder();
    const data = encoder.encode(canonicalString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// =========================================================================
// ✅ 2. دالة إرسال المسودة إلى مصلحة الضرائب (المنطق المحمي على الخادم)
// =========================================================================
async function submitToETA(payload, token) {
    if (!token) {
        throw new Error("Authentication token is missing.");
    }

    const response = await fetch("https://api-portal.invoicing.eta.gov.eg/api/v1/documentsubmissions", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload )
    });

    if (!response.ok) {
        // محاولة قراءة رسالة الخطأ من الخادم
        const errorResult = await response.json().catch(() => ({ error: { message: `Request failed with status ${response.status}` } }));
        const errorMessage = errorResult.error?.details?.[0]?.message || errorResult.error?.message || JSON.stringify(errorResult);
        throw new Error(errorMessage);
    }

    // في حالة النجاح (Status 202)، قد لا يكون هناك جسم للرد
    if (response.status === 202) {
        return {
            submissionId: "SUBMISSION_ACCEPTED",
            acceptedDocuments: payload.documents.map(d => ({ uuid: d.uuid }))
        };
    }

    return await response.json();
}


// =========================================================================
// ✅ 3. المتحكم الرئيسي (Handler) الذي يوجه الطلبات
// =========================================================================
export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ message: 'Method Not Allowed' });
    }

    // قراءة نوع العملية والبيانات من الطلب
    const { action, data, token } = request.body;

    try {
        let result;
        switch (action) {
            // الحالة الأولى: طلب حساب UUID
            case 'generate-uuid':
                if (!data) throw new Error("Canonical string is required for UUID generation.");
                const uuid = await computeUuid(data);
                result = { uuid };
                break;

            // الحالة الثانية: طلب إرسال الفاتورة
            case 'submit-draft':
                if (!data) throw new Error("Payload is required for submission.");
                if (!token) throw new Error("Token is required for submission.");
                result = await submitToETA(data, token);
                break;

            default:
                throw new Error("Invalid action specified.");
        }
        // إرجاع النتيجة بنجاح
        return response.status(200).json(result);

    } catch (error) {
        // إرجاع أي خطأ يحدث
        return response.status(500).json({ error: error.message });
    }
}
