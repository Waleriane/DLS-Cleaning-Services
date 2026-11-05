/**
 * DLS SERVICES — recebe os formulários do site:
 *   1) salva uma linha na aba "Leads" da planilha
 *   2) manda um e-mail de aviso com os dados do pedido
 * Cole este código em: Planilha > Extensões > Apps Script.
 * Depois: Implantar > Gerenciar implantações > ✏️ > Versão: Nova versão > Implantar.
 */

// E-MAIL QUE RECEBE OS AVISOS (teste: o seu; depois: dlsservices19@gmail.com)
const NOTIFY_EMAIL = 'walerianediene@gmail.com';
const SHEET_NAME = 'Leads';

/**
 * PASSO ÚNICO: com esta função selecionada lá em cima, clique em "Executar"
 * e aceite as permissões. Ela manda um e-mail de teste para NOTIFY_EMAIL.
 */
function autorizarEmail() {
  MailApp.sendEmail(NOTIFY_EMAIL, 'DLS Services — teste de autorização', 'Pronto! O formulário do site já pode enviar e-mails.');
  SpreadsheetApp.getActiveSpreadsheet();
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = Object.assign({}, e.parameter);
    const subject = data._subject || 'New request — DLS Services website';
    delete data._subject;
    data['Date'] = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm');

    saveRow_(data);
    // se o e-mail falhar, o pedido já está salvo na planilha — não perde o cliente
    let mailError = '';
    try { sendEmail_(data, subject); } catch (mailErr) { mailError = String(mailErr); }

    return json_({ ok: true, mailError: mailError });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function saveRow_(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  const preferred = ['Date', 'Form', 'Name', 'first_name', 'last_name', 'email', 'phone',
    'service_type', 'service', 'Offers opt-in', 'address', 'city', 'state', 'zip',
    'bedrooms', 'bathrooms', 'square_feet', 'frequency', 'preferred_date',
    'preferred_time', 'notes', 'message', 'Page'];
  let headers = sheet.getLastRow() > 0
    ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    : [];
  if (headers.length === 0) {
    headers = preferred.slice();
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#DDF2F2');
    sheet.setFrozenRows(1);
  }
  Object.keys(data).forEach(function (k) {
    if (headers.indexOf(k) === -1) {
      headers.push(k);
      sheet.getRange(1, headers.length).setValue(k).setFontWeight('bold').setBackground('#DDF2F2');
    }
  });
  sheet.appendRow(headers.map(function (h) { return data[h] !== undefined ? data[h] : ''; }));
}

function sendEmail_(data, subject) {
  const labels = {
    first_name: 'First name', last_name: 'Last name', email: 'Email', phone: 'Phone',
    service_type: 'Service', service: 'Service', address: 'Address', city: 'City', state: 'State',
    zip: 'ZIP', bedrooms: 'Bedrooms', bathrooms: 'Bathrooms', square_feet: 'Square feet',
    frequency: 'Frequency', preferred_date: 'Preferred date', preferred_time: 'Preferred time',
    notes: 'Notes', message: 'Message'
  };
  let rows = '';
  Object.keys(data).forEach(function (k) {
    if (data[k] === '' || data[k] === undefined) return;
    const v = String(data[k]).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>');
    rows += '<tr><td style="padding:8px 12px;background:#F2F8F8;font-weight:bold;color:#063B4A;border:1px solid #DDEBEB">'
      + (labels[k] || k) + '</td><td style="padding:8px 12px;border:1px solid #DDEBEB">' + v + '</td></tr>';
  });
  const html = '<div style="font-family:Arial,sans-serif;color:#063B4A">'
    + '<h2 style="margin:0 0 12px">' + subject + '</h2>'
    + '<table style="border-collapse:collapse;font-size:14px">' + rows + '</table>'
    + '<p style="color:#62767B;font-size:12px;margin-top:14px">Reply to this email to answer the client directly.</p></div>';
  const opts = { htmlBody: html, name: 'DLS Services Website' };
  if (data.email && /@/.test(data.email)) opts.replyTo = data.email;
  MailApp.sendEmail(NOTIFY_EMAIL, subject, 'New request from the DLS Services website.', opts);
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// abre no navegador para conferir se está publicado
function doGet() {
  return ContentService.createTextOutput('DLS form receiver is running.');
}
