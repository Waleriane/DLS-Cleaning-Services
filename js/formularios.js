/* =========================================================
   ENVIO DOS FORMULÁRIOS
   Caminho principal: script da planilha do Google (salva a linha e
   manda o e-mail — o e-mail de destino fica no próprio script,
   em NOTIFY_EMAIL). Reserva: FormSubmit, só se a planilha falhar.
   O botão nunca fica travado: depois de alguns segundos sem
   resposta, volta e mostra um aviso.
========================================================= */
/* PLANILHA DO GOOGLE: cole aqui o endereço do Apps Script (termina em /exec).
   Vazio = não salva na planilha (só envia o e-mail). */
var DLS_SHEET_URL = 'https://script.google.com/macros/s/AKfycbzhGfUIBDIO7rRu-vPR2Eq5sSGEbAqu5UC9OBLPnNpJhDiYpGZ8mWpydBqUj5tbvIXnNQ/exec';

var DLS_FORM_EMAIL = 'contact@dlsservicesfl.com';   // e-mail de reserva (FormSubmit) e mostrado nos avisos de erro

/* espera no máximo X segundos; nunca deixa o botão travado em "Sending..." */
function dlsFetchTimeout(url, opts, ms){
  return new Promise(function(resolve, reject){
    var done = false, t = setTimeout(function(){ if (!done){ done = true; reject(new Error('timeout')); } }, ms);
    fetch(url, opts).then(function(r){ if (!done){ done = true; clearTimeout(t); resolve(r); } },
                          function(e){ if (!done){ done = true; clearTimeout(t); reject(e); } });
  });
}

/* monta os dados do formulário */
function dlsCollect(form, subject){
  var data = {};
  new FormData(form).forEach(function(v, k){ if (String(v).trim() !== '') data[k] = v; });
  var spam = !!data._honey; delete data._honey;
  data['Form'] = /Contact/i.test(subject) ? 'Contact' : 'Quote Request';
  if (data.first_name || data.last_name) data['Name'] = ((data.first_name || '') + ' ' + (data.last_name || '')).trim();
  else if (data.name){ data['Name'] = data.name; delete data.name; }
  data['Offers opt-in'] = data.offers_opt_in ? 'Yes' : 'No'; delete data.offers_opt_in;
  data['Page'] = location.pathname;
  return { data: data, spam: spam };
}

/* 1º caminho: planilha do Google (salva a linha E manda o e-mail) */
function dlsSendViaSheet(data, subject){
  var body = new URLSearchParams(data); body.append('_subject', subject);
  return dlsFetchTimeout(DLS_SHEET_URL, { method:'POST', body: body }, 12000)
    .then(function(r){ return r.text(); })
    .then(function(t){
      var j = null; try { j = JSON.parse(t); } catch(e){}
      if (!j || !j.ok){
        console.warn('[DLS] A planilha recusou o envio. Resposta:', j ? j.error : t.slice(0, 300));
        throw new Error((j && j.error) || 'sheet failed');
      }
      if (j.mailError) console.warn('[DLS] Pedido salvo na planilha, mas o e-mail falhou:', j.mailError);
      else console.log('[DLS] Pedido salvo na planilha e e-mail enviado.');
    }, function(e){ console.warn('[DLS] Não foi possível falar com a planilha:', e); throw e; });
}

/* reserva: FormSubmit (só se a planilha falhar) */
function dlsSendViaFormSubmit(data, subject){
  /* envio "simples" (sem pré-checagem do navegador), que o FormSubmit não bloqueia */
  var fd = new FormData();
  Object.keys(data).forEach(function(k){ fd.append(k, data[k]); });
  fd.append('_subject', subject); fd.append('_template', 'table'); fd.append('_captcha', 'false');
  if (data.email) fd.append('_replyto', data.email);
  return dlsFetchTimeout('https://formsubmit.co/ajax/' + DLS_FORM_EMAIL, { method:'POST', body: fd }, 8000)
    .then(function(r){ if (!r.ok) throw new Error('send failed'); return r.json(); })
    .then(function(j){ if (j && (j.success === false || j.success === 'false')) throw new Error(j.message || 'send failed'); });
}

function dlsSendForm(form, subject){
  var c = dlsCollect(form, subject);
  if (c.spam) return Promise.resolve();            /* robô de spam: ignora */
  if (!DLS_SHEET_URL) return dlsSendViaFormSubmit(c.data, subject);
  return dlsSendViaSheet(c.data, subject).catch(function(){ return dlsSendViaFormSubmit(c.data, subject); });
}

/* botão mostra "Sending..." enquanto envia */
function dlsBusy(btn, on){
  if (!btn) return;
  if (on){ btn.dataset.label = btn.innerHTML; btn.innerHTML = 'Sending...'; btn.disabled = true; btn.style.opacity = '.7'; }
  else { if (btn.dataset.label) btn.innerHTML = btn.dataset.label; btn.disabled = false; btn.style.opacity = ''; }
}

/* mensagem de erro com alternativa por e-mail — aparece logo abaixo do botão */
function dlsFormError(form, btn){
  btn = btn || form.querySelector('button[type="submit"]');
  var anchor = (btn && btn.closest('.dls-step-buttons')) || btn || form.lastChild;
  var box = form.querySelector('.dls-send-error');
  if (!box){
    box = document.createElement('p'); box.className = 'dls-send-error'; box.setAttribute('role','alert');
    box.style.cssText = 'margin-top:12px;padding:12px 14px;border-radius:8px;background:#FDECEC;color:#8A1F1F;font-size:14px;line-height:1.5';
    anchor.parentNode.insertBefore(box, anchor.nextSibling);
  }
  box.innerHTML = "Sorry, we couldn't send your request right now. Please try again in a moment or email us at <a href=\"mailto:" + DLS_FORM_EMAIL + "\" style=\"color:#8A1F1F;font-weight:700\">" + DLS_FORM_EMAIL + "</a>.";
  box.style.display = 'block';
  box.scrollIntoView({ behavior:'smooth', block:'center' });
}
