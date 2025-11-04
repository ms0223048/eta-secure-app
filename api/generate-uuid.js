// File: /pages/api/eta-handler.js
// هذا الملف يعمل على خادم Vercel وليس في المتصفح

import crypto from 'crypto'; // مكتبة التشفير المدمجة في Node.js

/**
 * =========================================================================
 * ✅✅✅ الدالة الأولى: EtaUuid (نسخة الخادم) ✅✅✅
 * =========================================================================
 * هذا الكود بالكامل يتم تنفيذه على الخادم فقط ولن يراه المستخدم.
 */
const EtaUuidServer = (() => {
    function sha256Hex(str) {
        const hash = crypto.createHash('sha256');
        hash.update(str, 'utf8');
        return hash.digest('hex');
    }
    function isWS(c) { return c === 0x20 || c === 0x0A || c === 0x0D || c === 0x09; }
    function Serializer(src) { this.s = src; this.n = src.length; this.i = 0; this.out = []; }
    Serializer.prototype.peek = function() { return this.i < this.n ? this.s.charCodeAt(this.i) : -1; }
    Serializer.prototype.skip = function() { while (this.i < this.n && isWS(this.s.charCodeAt(this.i))) this.i++; }
    Serializer.prototype.expect = function(ch) { if (this.s[this.i] !== ch) throw new Error('Expected ' + ch + ' at ' + this.i); this.i++; }
    Serializer.prototype.readString = function() { let start = this.i; this.expect('"'); while (this.i < this.n) { const c = this.s.charCodeAt(this.i); if (c === 0x22) { this.i++; break; } if (c === 0x5C) { this.i += 2; } else { this.i++; } } return this.s.slice(start, this.i); }
    Serializer.prototype.readNumber = function() { let start = this.i; if (this.s[this.i] === '-') this.i++; if (this.s[this.i] === '0') { this.i++; } else { if (!(this.s[this.i] >= '1' && this.s[this.i] <= '9')) throw new Error('num'); while (this.s[this.i] >= '0' && this.s[this.i] <= '9') this.i++; } if (this.s[this.i] === '.') { this.i++; if (!(this.s[this.i] >= '0' && this.s[this.i] <= '9')) throw new Error('frac'); while (this.s[this.i] >= '0' && this.s[i] <= '9') this.i++; } if (this.s[this.i] === 'e' || this.s[this.i] === 'E') { this.i++; if (this.s[this.i] === '+' || this.s[this.i] === '-') this.i++; if (!(this.s[this.i] >= '0' && this.s[this.i] <= '9')) throw new Error('exp'); while (this.s[this.i] >= '0' && this.s[this.i] <= '9') this.i++; } return this.s.slice(start, this.i); }
    Serializer.prototype.readLiteral = function() { if (this.s.startsWith('true', this.i)) { this.i += 4; return 'true'; } if (this.s.startsWith('false', this.i)) { this.i += 5; return 'false'; } if (this.s.startsWith('null', this.i)) { this.i += 4; return 'null'; } throw new Error('literal@' + this.i); }
    Serializer.prototype.emitKey = function(nameUpper) { this.out.push('"' + nameUpper + '"'); }
    Serializer.prototype.emitScalar = function(lexeme) { this.out.push('"' + lexeme + '"'); }
    Serializer.prototype.serializeObject = function(path, exclude) { this.skip(); this.expect('{'); this.skip(); let first = true; while (this.i < this.n && this.s[this.i] !== '}') { if (!first) { if (this.s[this.i] === ',') { this.i++; this.skip(); } } const keyLex = this.readString(); const key = JSON.parse(keyLex); const K = key.toUpperCase(); this.skip(); this.expect(':'); this.skip(); const cur = path ? path + '.' + key : key; const ex = exclude.indexOf(cur) !== -1; const c = this.peek(); if (c === 0x22) { const v = this.readString(); if (!ex) { this.emitKey(K); this.emitScalar(v.slice(1, -1)); } } else if (c === 0x7B) { if (!ex) { this.emitKey(K); } this.serializeObject(cur, exclude); } else if (c === 0x5B) { if (!ex) { this.emitKey(K); } this.serializeArray(cur, exclude, ex, K); } else if ((c === 0x2D) || (c >= 0x30 && c <= 0x39)) { const num = this.readNumber(); if (!ex) { this.emitKey(K); this.emitScalar(num); } } else { const lit = this.readLiteral(); if (!ex) { this.emitKey(K); this.emitScalar(lit); } } this.skip(); first = false; } this.expect('}'); }
    Serializer.prototype.serializeArray = function(path, exclude, isExcluded, propNameUpper) { this.skip(); this.expect('['); this.skip(); let first = true; while (this.i < this.n && this.s[this.i] !== ']') { if (!first) { if (this.s[this.i] === ',') { this.i++; this.skip(); } } if (!isExcluded && propNameUpper) { this.emitKey(propNameUpper); } const c = this.peek(); if (c === 0x7B) { this.serializeObject(path, exclude); } else if (c === 0x22) { const v = this.readString(); if (!isExcluded) { this.emitScalar(v.slice(1, -1)); } } else if ((c === 0x2D) || (c >= 0x30 && c <= 0x39)) { const num = this.readNumber(); if (!isExcluded) { this.emitScalar(num); } } else { const lit = this.readLiteral(); if (!isExcluded) { this.emitScalar(lit); } } this.skip(); first = false; } this.expect(']'); }
    function findFirstReceiptSlice(src) { const m = src.match(/"receipts"\s*:\s*\[/); if (!m) return src.trim(); let i = m.index + m[0].length; while (i < src.length && /\s/.test(src[i])) i++; if (src[i] !== '{') return src.trim(); let depth = 0, start = i; while (i < src.length) { const ch = src[i]; if (ch === '"') { i++; while (i < src.length) { if (src[i] === '\\') { i += 2; continue; } if (src[i] === '"') { i++; break; } i++; } continue; } if (ch === '{') { depth++; } if (ch === '}') { depth--; if (depth === 0) { i++; break; } } i++; } return src.slice(start, i); }
    function getCanonicalFromRawText(raw) { const slice = findFirstReceiptSlice(raw); const ser = new Serializer(slice); ser.serializeObject('', []); return ser.out.join(''); }
    
    function computeUuidFromRawText(raw) {
        const canonical = getCanonicalFromRawText(raw);
        return sha256Hex(canonical);
    }

    return { computeUuidFromRawText };
})();


/**
 * =========================================================================
 * ✅✅✅ الدالة الثانية: sendInvoicesFromModal_v3 (منطق الخادم) ✅✅✅
 * =========================================================================
 * هذه الدالة ستقوم بتجهيز سلسلة الفواتير مع UUIDs الخاصة بها.
 */
async function prepareInvoiceChain(invoicesMap, lastSuccessfulUUID = "") {
    const receiptChain = [];
    
    for (const [invoiceId, data] of invoicesMap.entries()) {
        // ملاحظة: دالة createInvoicePayloadFromLines_v3 يجب أن تكون متاحة هنا
        // أو يتم تمرير البيانات المهيكلة مباشرة من العميل.
        // للتبسيط، سنفترض أن `data.structuredPayload` تحتوي على الهيكل الجاهز.
        const receiptObject = data.structuredPayload;
        
        receiptObject.header.previousUUID = lastSuccessfulUUID;
        
        const payloadForUuid = JSON.stringify({ receipts: [receiptObject] });
        const newUuid = EtaUuidServer.computeUuidFromRawText(payloadForUuid);
        
        receiptObject.header.uuid = newUuid;
        receiptChain.push(receiptObject);
        lastSuccessfulUUID = newUuid;
    }
    
    return { receipts: receiptChain };
}


/**
 * =========================================================================
 * ✅✅✅ المتحكم الرئيسي في الـ API (يستقبل الطلبات وينفذ الدوال) ✅✅✅
 * =========================================================================
 */
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { action, payload } = req.body;

        switch (action) {
            
            // هذا الإجراء يقوم بالعملية الكاملة: بناء السلسلة وتوقيعها وإرجاعها جاهزة
            case 'PROCESS_AND_SIGN_INVOICES':
                if (!payload || !payload.invoicesMap || !payload.lastUUID) {
                    return res.status(400).json({ error: 'Payload is missing invoicesMap or lastUUID.' });
                }

                const invoicesMap = new Map(Object.entries(payload.invoicesMap));
                const receiptChain = [];
                let lastSuccessfulUUID = payload.lastUUID;

                // بناء السلسلة وتوقيعها فاتورة تلو الأخرى
                for (const [invoiceId, data] of invoicesMap.entries()) {
                    const receiptObject = data.structuredPayload;
                    receiptObject.header.previousUUID = lastSuccessfulUUID;
                    
                    const payloadForUuid = JSON.stringify({ receipts: [receiptObject] });
                    const newUuid = EtaUuidServer.computeUuidFromRawText(payloadForUuid);
                    
                    receiptObject.header.uuid = newUuid;
                    receiptChain.push(receiptObject);
                    lastSuccessfulUUID = newUuid;
                }
                
                const finalPayload = { receipts: receiptChain };
                
                // إرجاع السلسلة الموقعة بالكامل إلى العميل
                return res.status(200).json({ success: true, signedPayload: finalPayload });

            default:
                return res.status(400).json({ error: 'Unknown action.' });
        }

    } catch (error) {
        console.error('Server-side error in /api/eta-handler:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
