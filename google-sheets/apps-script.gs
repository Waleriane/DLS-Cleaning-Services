/**
 * DLS SERVICES — recebe os formulários do site e salva na planilha.
 * Cole este código em: Planilha > Extensões > Apps Script.
 * Cada envio vira uma linha na aba "Leads". Colunas novas são criadas sozinhas.
 */
const SHEET_NAME = 'Leads';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    const data = Object.assign({}, e.parameter);

    // ordem preferida das primeiras colunas
    const preferred = ['Date', 'Form', 'Name', 'first_name', 'last_name', 'email', 'phone',
      'service_type', 'service', 'Offers opt-in', 'address', 'city', 'state', 'zip',
      'bedrooms', 'bathrooms', 'square_feet', 'frequency', 'preferred_date',
      'preferred_time', 'notes', 'message', 'Page'];

    data['Date'] = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm');

    let headers = sheet.getLastRow() > 0
      ? sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
      : [];
    if (headers.length === 0) {
      headers = preferred.slice();
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#DDF2F2');
      sheet.setFrozenRows(1);
    }
    // cria coluna para qualquer campo novo
    Object.keys(data).forEach(function (k) {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sheet.getRange(1, headers.length).setValue(k).setFontWeight('bold').setBackground('#DDF2F2');
      }
    });
    sheet.appendRow(headers.map(function (h) { return data[h] !== undefined ? data[h] : ''; }));

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// abre no navegador para conferir se está publicado
function doGet() {
  return ContentService.createTextOutput('DLS form receiver is running.');
}
