/* =========================================================
   ENVIO DOS FORMULÁRIOS — chegam no e-mail da DLS
   Serviço: FormSubmit (gratuito). No 1º envio, a DLS recebe um
   e-mail "Confirm your email" e precisa clicar UMA vez em ativar.
   Para trocar o e-mail que recebe os pedidos, mude só a linha abaixo.
========================================================= */
/* PLANILHA DO GOOGLE: cole aqui o endereço do Apps Script (termina em /exec).
   Vazio = não salva na planilha (só envia o e-mail). */
var DLS_SHEET_URL = '';

var DLS_FORM_EMAIL = 'walerianediene@gmail.com';   // TESTE — depois voltar para 'dlsservices19@gmail.com'

function dlsSendForm(form, subject){
  var data = {};
  new FormData(form).forEach(function(v, k){ if (String(v).trim() !== '') data[k] = v; });
  if (data._honey) return Promise.resolve();            /* robô de spam: ignora */
  delete data._honey;
  data._subject  = subject;
  data._template = 'table';
  data._captcha  = 'false';
  if (data.email) data._replyto = data.email;           /* "Responder" vai direto para o cliente */
  data['Sent from'] = location.href;
  dlsSaveToSheet(data, subject);
  return fetch('https://formsubmit.co/ajax/' + DLS_FORM_EMAIL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(data)
  }).then(function(r){
    if (!r.ok) throw new Error('send failed');
    return r.json();
  }).then(function(j){
    if (j && (j.success === false || j.success === 'false')) throw new Error(j.message || 'send failed');
  });
}

/* botão mostra "Sending..." enquanto envia */
function dlsBusy(btn, on){
  if (!btn) return;
  if (on){ btn.dataset.label = btn.innerHTML; btn.innerHTML = 'Sending...'; btn.disabled = true; btn.style.opacity = '.7'; }
  else { if (btn.dataset.label) btn.innerHTML = btn.dataset.label; btn.disabled = false; btn.style.opacity = ''; }
}

/* mensagem de erro com alternativa por e-mail */
function dlsFormError(form){
  var box = form.querySelector('.dls-send-error');
  if (!box){
    box = document.createElement('p'); box.className = 'dls-send-error';
    box.style.cssText = 'margin-top:12px;padding:12px 14px;border-radius:8px;background:#FDECEC;color:#8A1F1F;font-size:14px;line-height:1.5';
    form.appendChild(box);
  }
  box.innerHTML = "Sorry, we couldn't send your request right now. Please try again or email us at <a href=\"mailto:" + DLS_FORM_EMAIL + "\" style=\"color:#8A1F1F;font-weight:700\">" + DLS_FORM_EMAIL + "</a>.";
  box.style.display = 'block';
}

/* salva uma cópia na planilha do Google (não atrapalha o envio do e-mail) */
function dlsSaveToSheet(data, subject){
  if (!DLS_SHEET_URL) return;
  try {
    var row = {};
    Object.keys(data).forEach(function(k){ if (k.charAt(0) !== '_' && k !== 'Sent from') row[k] = data[k]; });
    row['Form'] = /Contact/i.test(subject) ? 'Contact' : 'Quote Request';
    if (row.first_name || row.last_name) row['Name'] = ((row.first_name || '') + ' ' + (row.last_name || '')).trim();
    else if (row.name){ row['Name'] = row.name; delete row.name; }
    row['Offers opt-in'] = row.offers_opt_in ? 'Yes' : 'No'; delete row.offers_opt_in;
    row['Page'] = location.pathname;
    fetch(DLS_SHEET_URL, { method:'POST', mode:'no-cors', body:new URLSearchParams(row) });
  } catch(e){}
}
