/*
 * POST /api/enquiry
 *
 * Accepts the Contact Us "Product Enquiry" form (multipart/form-data,
 * including the two optional file uploads) and:
 *   1. Emails the full enquiry (with attachments) to the sales inbox via SMTP.
 *   2. Best-effort notifies a WhatsApp number via the WhatsApp Business
 *      Cloud API, if configured.
 *
 * All credentials come from Vercel environment variables — never from the
 * frontend. See the "required env vars" list below.
 *
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS  (required — email)
 *   MAIL_FROM            (optional, defaults to SMTP_USER)
 *   ENQUIRY_TO_EMAIL      (optional, defaults to sales@triveniradiators.com)
 *   WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TO_NUMBER,
 *   WHATSAPP_TEMPLATE_NAME, WHATSAPP_TEMPLATE_LANG (optional — WhatsApp)
 *
 * If the SMTP env vars are missing, the request fails honestly (no fake
 * success). WhatsApp is a secondary channel: if it's unconfigured or its
 * send fails, the request still succeeds as long as the email went out,
 * and the failure reason is reported back in the JSON response.
 */

const busboy = require('busboy');
const nodemailer = require('nodemailer');

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB per file — Vercel's Node function
                                        // request body is hard-capped around
                                        // 4.5MB total, so this leaves headroom
                                        // for two files + form fields.
const MAX_FIELD_SIZE = 5000;
const ALLOWED_EXT = ['.pdf', '.dwg', '.jpg', '.jpeg', '.png'];

const REQUIRED_FIELDS = [
  'firstName', 'lastName', 'companyName', 'jobTitle', 'workEmail', 'phone',
  'organization', 'radiatorInterest', 'radiatorSize', 'radiatorWidth',
  'numElements', 'paintScheme', 'transformerRating', 'quantity',
  'deliveryTimeline', 'deliveryLocation',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(res, status, code, message, extra) {
  res.status(status).json(Object.assign({ success: false, code, message }, extra || {}));
}

function extOf(filename) {
  const i = filename.lastIndexOf('.');
  return i === -1 ? '' : filename.slice(i).toLowerCase();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function parseMultipart(req) {
  return new Promise((resolve, reject) => {
    let bb;
    try {
      bb = busboy({
        headers: req.headers,
        limits: { fileSize: MAX_FILE_SIZE, files: 2, fields: 40, fieldSize: MAX_FIELD_SIZE },
      });
    } catch (err) {
      reject(Object.assign(new Error('Invalid form submission.'), { code: 'MALFORMED_REQUEST' }));
      return;
    }

    const fields = {};
    const files = [];
    let fileTooLarge = false;
    let invalidFileType = false;
    let settled = false;

    bb.on('field', (name, val) => {
      if (fields[name] !== undefined) {
        fields[name] = Array.isArray(fields[name]) ? fields[name].concat(val) : [fields[name], val];
      } else {
        fields[name] = val;
      }
    });

    bb.on('file', (name, stream, info) => {
      const { filename, mimeType } = info;
      if (!filename) { stream.resume(); return; }

      if (!ALLOWED_EXT.includes(extOf(filename))) {
        invalidFileType = true;
        stream.resume();
        return;
      }

      const chunks = [];
      stream.on('data', (d) => chunks.push(d));
      stream.on('limit', () => { fileTooLarge = true; });
      stream.on('close', () => {
        if (!fileTooLarge) {
          files.push({ field: name, filename, mimeType, buffer: Buffer.concat(chunks) });
        }
      });
    });

    bb.on('error', (err) => {
      if (settled) return;
      settled = true;
      reject(Object.assign(new Error('Malformed form submission.'), { code: 'MALFORMED_REQUEST', cause: err }));
    });

    bb.on('close', () => {
      if (settled) return;
      settled = true;
      resolve({ fields, files, fileTooLarge, invalidFileType });
    });

    req.pipe(bb);
  });
}

async function sendEnquiryEmail(fields, files) {
  const {
    SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM, ENQUIRY_TO_EMAIL,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    const err = new Error(
      'The enquiry mailbox is not configured yet. Please email us directly, or contact the site administrator.'
    );
    err.code = 'EMAIL_NOT_CONFIGURED';
    throw err;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT || 587),
    secure: SMTP_SECURE === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = REQUIRED_FIELDS.concat(['remarks'])
    .filter((k) => fields[k])
    .map((k) => [k, fields[k]]);
  const additionalInterest = fields.additionalInterest
    ? [].concat(fields.additionalInterest).join(', ')
    : '';

  const textBody = rows.map(([k, v]) => `${k}: ${v}`).join('\n')
    + (additionalInterest ? `\nadditionalInterest: ${additionalInterest}` : '');

  const htmlBody = `
    <h2>New Product Enquiry</h2>
    <table cellpadding="6" cellspacing="0" border="0">
      ${rows.map(([k, v]) => `<tr><td><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v)}</td></tr>`).join('')}
      ${additionalInterest ? `<tr><td><b>additionalInterest</b></td><td>${escapeHtml(additionalInterest)}</td></tr>` : ''}
    </table>
  `;

  await transporter.sendMail({
    from: MAIL_FROM || SMTP_USER,
    to: ENQUIRY_TO_EMAIL || 'sales@triveniradiators.com',
    replyTo: EMAIL_RE.test(fields.workEmail || '') ? fields.workEmail : undefined,
    subject: `New Product Enquiry — ${fields.companyName || 'Unknown company'} (${fields.firstName || ''} ${fields.lastName || ''})`.trim(),
    text: textBody,
    html: htmlBody,
    attachments: files.map((f) => ({ filename: f.filename, content: f.buffer, contentType: f.mimeType })),
  });
}

async function sendWhatsAppNotification(fields) {
  const {
    WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TO_NUMBER,
    WHATSAPP_TEMPLATE_NAME, WHATSAPP_TEMPLATE_LANG,
  } = process.env;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TO_NUMBER || !WHATSAPP_TEMPLATE_NAME) {
    return { sent: false, reason: 'not_configured' };
  }

  try {
    const resp = await fetch(`https://graph.facebook.com/v19.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: WHATSAPP_TO_NUMBER,
        type: 'template',
        template: {
          name: WHATSAPP_TEMPLATE_NAME,
          language: { code: WHATSAPP_TEMPLATE_LANG || 'en_US' },
          components: [{
            type: 'body',
            parameters: [
              { type: 'text', text: fields.companyName || '-' },
              { type: 'text', text: `${fields.firstName || ''} ${fields.lastName || ''}`.trim() || '-' },
              { type: 'text', text: fields.phone || '-' },
            ],
          }],
        },
      }),
    });
    const body = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      return { sent: false, reason: 'send_failed', detail: (body && body.error && body.error.message) || `HTTP ${resp.status}` };
    }
    return { sent: true };
  } catch (err) {
    return { sent: false, reason: 'send_failed', detail: err.message };
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return fail(res, 405, 'METHOD_NOT_ALLOWED', 'Only POST is supported.');
  }

  const contentType = req.headers['content-type'] || '';
  if (!contentType.startsWith('multipart/form-data')) {
    return fail(res, 400, 'MALFORMED_REQUEST', 'Expected multipart/form-data.');
  }

  const contentLength = Number(req.headers['content-length'] || 0);
  if (contentLength > 9 * 1024 * 1024) {
    return fail(res, 413, 'PAYLOAD_TOO_LARGE', 'Submission is too large. Please keep uploads under 4MB each.');
  }

  let parsed;
  try {
    parsed = await parseMultipart(req);
  } catch (err) {
    return fail(res, 400, err.code || 'MALFORMED_REQUEST', err.message || 'Malformed form submission.');
  }

  const { fields, files, fileTooLarge, invalidFileType } = parsed;

  if (fileTooLarge) {
    return fail(res, 413, 'FILE_TOO_LARGE', 'One of the uploaded files exceeds the 4MB limit.');
  }
  if (invalidFileType) {
    return fail(res, 400, 'INVALID_FILE_TYPE', 'Uploaded files must be PDF, DWG, JPG or PNG.');
  }

  const missing = REQUIRED_FIELDS.filter((k) => !fields[k] || !String(fields[k]).trim());
  if (missing.length) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Please fill in all required fields.', { missing });
  }
  if (!EMAIL_RE.test(fields.workEmail)) {
    return fail(res, 400, 'VALIDATION_ERROR', 'Please provide a valid work email address.', { missing: ['workEmail'] });
  }

  try {
    await sendEnquiryEmail(fields, files);
  } catch (err) {
    if (err.code === 'EMAIL_NOT_CONFIGURED') {
      console.error('[api/enquiry] email not configured:', err.message);
      return fail(res, 500, 'EMAIL_NOT_CONFIGURED', err.message);
    }
    console.error('[api/enquiry] email send failed:', err);
    return fail(res, 502, 'EMAIL_SEND_FAILED', 'We could not send your enquiry right now. Please try again shortly or email us directly.');
  }

  const whatsapp = await sendWhatsAppNotification(fields);
  if (!whatsapp.sent) {
    console.warn('[api/enquiry] whatsapp notification skipped/failed:', whatsapp);
  }

  return res.status(200).json({ success: true, email: { sent: true }, whatsapp });
};
