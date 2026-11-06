/* =========================================================
   DLS ASSISTANT — "cérebro" do chat (pop-up e chat das páginas)
   1) Tenta a OpenAI pela função /api/chat (chave guardada na Vercel).
   2) Se não estiver configurada ou falhar, usa as respostas prontas
      (js/respostas.js), com agendamento passo a passo pelo chat.
   Pedidos feitos pelo chat vão para a planilha e para os e-mails
   (mesmo caminho dos formulários — js/formularios.js).
========================================================= */
(function(){
  var PHONE_TEL = '+14072851212';
  var API = '/api/chat';

  /* ---------- estilo dos botões dentro do chat ---------- */
  var css = '.dls-ai-acts{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}'
    + '.dls-ai-acts a,.dls-ai-acts button{display:inline-flex;align-items:center;gap:6px;padding:8px 12px;border-radius:20px;border:1px solid rgba(13,159,165,.35);background:#fff;color:#063B4A;font:600 13px Montserrat,Arial,sans-serif;text-decoration:none;cursor:pointer;line-height:1.2}'
    + '.dls-ai-acts a:hover,.dls-ai-acts button:hover{background:#DDF2F2;border-color:#0D9FA5}'
    + '.dls-ai-acts .main{background:#0D9FA5;color:#fff;border-color:#0D9FA5}'
    + '.dls-ai-acts .main:hover{background:#063B4A;border-color:#063B4A;color:#fff}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function contactActions(){
    return [
      { label:'📞 Call ' + (typeof DLS_PHONE_TXT !== 'undefined' ? DLS_PHONE_TXT : ''), href:'tel:' + PHONE_TEL, main:true },
      { label:'💬 Text us', href:'sms:' + PHONE_TEL },
      { label:'✉️ Email', href:'mailto:' + (typeof DLS_EMAIL_TXT !== 'undefined' ? DLS_EMAIL_TXT : 'contact@dlsservicesfl.com') }
    ];
  }
  function esc(t){ var d = document.createElement('div'); d.textContent = String(t == null ? '' : t); return d.innerHTML; }
  function fmtReply(t){
    /* texto da OpenAI: escapa e transforma **negrito** e quebras de linha */
    return esc(t).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
  }

  /* envia um pedido feito pelo chat para a planilha + e-mails */
  function saveLead(lead){
    var data = {
      Form:'Chat Assistant', Name: lead.name || '', phone: lead.phone || '', email: lead.email || '',
      service: lead.service || '', address: lead.address || '', city: lead.city || '',
      preferred_date: lead.preferred_date || '', preferred_time: lead.preferred_time || '',
      notes: lead.details || '', 'Offers opt-in':'No', Page: location.pathname
    };
    Object.keys(data).forEach(function(k){ if (data[k] === '') delete data[k]; });
    if (typeof dlsSendViaSheet !== 'function' || typeof DLS_SHEET_URL === 'undefined' || !DLS_SHEET_URL)
      return Promise.reject(new Error('no sheet'));
    var subj = 'New Booking Request (Chat) — DLS Services website';
    return dlsSendViaSheet(data, subj).catch(function(){
      return typeof dlsSendViaFormSubmit === 'function' ? dlsSendViaFormSubmit(data, subj) : Promise.reject();
    });
  }

  /* ---------- uma conversa ---------- */
  function Session(){
    this.history = [];         /* para a OpenAI */
    this.remote = true;        /* tenta a OpenAI até ela dizer que não está configurada */
    this.booking = null;       /* agendamento passo a passo (modo reserva) */
    this.lastSay = '';
    this.misses = 0;
  }

  Session.prototype.ask = function(text){
    var self = this;
    text = String(text || '').trim();
    if (!text) return Promise.resolve({ html:'' });
    self.history.push({ role:'user', content:text });
    if (!self.remote || self.booking) return Promise.resolve(self.local(text)).then(function(r){ self.remember(r); return r; });

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function(){ if (ctrl) ctrl.abort(); }, 20000);
    return fetch(API, { method:'POST', headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ messages: self.history.slice(-16) }), signal: ctrl ? ctrl.signal : undefined })
      .then(function(r){
        clearTimeout(timer);
        if (r.status === 503 || r.status === 404 || r.status === 405) { self.remote = false; throw new Error('local'); }
        if (!r.ok) throw new Error('remote ' + r.status);
        return r.json();
      })
      .then(function(j){
        var res = { html: fmtReply(j.reply || ''), actions: j.contact ? contactActions() : [] };
        self.history.push({ role:'assistant', content: j.reply || '' });
        if (j.lead){
          return saveLead(j.lead).then(function(){ return res; }, function(){
            res.html += '<br><br>⚠️ I couldn\'t send your request automatically. Please contact our team so we don\'t miss it:';
            res.actions = contactActions(); return res;
          });
        }
        return res;
      })
      .catch(function(){
        clearTimeout(timer);
        var r = self.local(text); self.remember(r); return r;
      });
  };

  Session.prototype.remember = function(r){
    this.history.push({ role:'assistant', content: String(r.html || '').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim() });
  };

  /* ---------- modo reserva (sem OpenAI) ---------- */
  var SERVICES = [
    ['Regular Cleaning',['regular','recurring','weekly','biweekly','bi-weekly','monthly','semanal','mensal']],
    ['Deep Cleaning',['deep','move out','move-out','move in','pesada','profunda']],
    ['Commercial Cleaning',['commercial','office','business','escritorio','comercial','oficina']],
    ['Summer Kitchen',['summer kitchen','outdoor kitchen','cozinha']],
    ['Remodeling',['remodel','renovat','reforma']],
    ['Handyman Services',['handyman','repair','fix','drywall','masonry','carpentry','paint','demolition','install','appliance','conserto','reparo','pintura']],
    ['Cleaning',['clean','limpeza','faxina','limpieza']]
  ];
  function detectService(t){
    var q = ' ' + dlsNorm(t) + ' ';
    for (var i = 0; i < SERVICES.length; i++){
      for (var k = 0; k < SERVICES[i][1].length; k++) if (q.indexOf(' ' + dlsNorm(SERVICES[i][1][k])) > -1) return SERVICES[i][0];
    }
    return '';
  }

  var STEPS = [
    { key:'service', ask:'Which service do you need?', quick:['Regular Cleaning','Deep Cleaning','Commercial Cleaning','Handyman / Remodeling'] },
    { key:'name', ask:'What is your <b>full name</b>?' },
    { key:'contact', ask:'What is the best <b>phone number or email</b> to reach you?' },
    { key:'city', ask:'Which <b>city</b> is the property in? (Address too, if you\'d like.)' },
    { key:'when', ask:'Do you have a <b>preferred date and time</b>? (It\'s a preference — DLS will confirm availability.)', quick:['As soon as possible','This week','Next week','I\'m flexible'] },
    { key:'details', ask:'Any details we should know? (e.g. number of bedrooms/bathrooms, or a short description of the project)', quick:['No, that\'s all'] }
  ];

  Session.prototype.local = function(text){
    var self = this, n = dlsNorm(text);

    /* --- agendamento em andamento --- */
    if (self.booking){
      var b = self.booking;
      if (/^(cancel|stop|nevermind|never mind|cancelar|parar|desistir)\b/.test(n)){
        self.booking = null;
        return { html:'No problem — booking cancelled. Anything else I can help with?' };
      }
      if (b.step === 'confirm'){
        if (/^(yes|y|yep|yeah|correct|right|ok|okay|sure|confirm|sim|isso|certo|si)\b/.test(n)){
          var lead = { name:b.name, service:b.service, city:b.city, preferred_date:b.when, details:b.details };
          if (/@/.test(b.contact)) lead.email = b.contact; else lead.phone = b.contact;
          self.booking = null;
          return saveLead(lead).then(function(){
            return { html:'✅ Thank you, <b>' + esc(b.name.split(' ')[0]) + '</b>! Your request was sent to the DLS team. We\'ll contact you soon to confirm availability and your personalized estimate.' };
          }, function(){
            return { html:'⚠️ I couldn\'t send your request automatically. Please contact our team directly so we don\'t miss it:', actions: contactActions() };
          });
        }
        if (/^(no|nope|nao|wrong|change|edit)\b/.test(n)){
          self.booking = { step:'service' };
          return { html:'Okay, let\'s start over. ' + STEPS[0].ask, quick: STEPS[0].quick };
        }
        return { html:'Please reply <b>Yes</b> to send your request, or <b>No</b> to start over.', quick:['Yes','No'] };
      }
      /* pergunta no meio do agendamento: responde e repete a etapa */
      var t = dlsMatchTopic(text);
      if (/\?$/.test(text.trim()) && t && t.say && !t.book){
        var cur = STEPS.filter(function(s){ return s.key === b.step; })[0];
        return { html: t.say + '<br><br>Back to your booking: ' + cur.ask, quick: cur.quick };
      }
      if (b.step === 'service'){ b.service = detectService(text) || text; }
      else if (b.step === 'name'){ b.name = text.replace(/^(my name is|i am|i'm|meu nome e|me llamo)\s+/i,''); }
      else if (b.step === 'contact'){
        var digits = text.replace(/\D/g,'');
        if (!/@\S+\.\S+/.test(text) && digits.length < 10) return { html:'Hmm, that doesn\'t look like a phone number or email. Could you type it again?' };
        b.contact = text;
      }
      else if (b.step === 'city'){ b.city = text; }
      else if (b.step === 'when'){ b.when = text; }
      else if (b.step === 'details'){ b.details = /^(no|none|nothing|that'?s all|nao|nada)\b/.test(n) ? '' : text; }
      return self.nextStep();
    }

    var topic = dlsMatchTopic(text);
    if (topic && topic.book){
      self.booking = { step:'service', service: detectService(text) };
      if (self.booking.service) self.booking.step = 'name';
      return self.nextStep(true);
    }
    if (topic && topic.say){
      self.misses = 0;
      var out = { html: topic.say };
      if (topic.contact) out.actions = contactActions();
      else if (['regular','deep','commercial','cleaning','handyman','summer','remodel','addons','price','area','difference'].indexOf(topic.id) > -1){
        out.quick = ['Book a cleaning','Request a project estimate'];
      }
      if (out.html === self.lastSay){ out.html = 'As I mentioned: ' + out.html; out.actions = contactActions(); }
      self.lastSay = topic.say;
      return out;
    }
    self.misses++;
    return {
      html: self.misses > 1
        ? 'I\'m still not sure I understood — our team will be happy to help you directly:'
        : 'I\'m not sure about that one. I can tell you about our services, pricing, service area, or <b>book a cleaning</b> for you. Or you can talk to our team:',
      actions: contactActions(),
      quick: self.misses > 1 ? [] : ['Book a cleaning','What services do you offer?']
    };
  };

  Session.prototype.nextStep = function(start){
    var b = this.booking;
    var order = ['service','name','contact','city','when','details'];
    var next = null;
    for (var k = 0; k < order.length; k++){
      var key = order[k];
      if (key === 'details' ? b.details === undefined : !b[key]){ next = key; break; }
    }
    if (!next){
      b.step = 'confirm';
      return {
        html:'Please confirm your request:<br><br>'
          + '• <b>Service:</b> ' + esc(b.service) + '<br>'
          + '• <b>Name:</b> ' + esc(b.name) + '<br>'
          + '• <b>Contact:</b> ' + esc(b.contact) + '<br>'
          + '• <b>City:</b> ' + esc(b.city) + '<br>'
          + '• <b>Preferred date/time:</b> ' + esc(b.when) + '<br>'
          + (b.details ? '• <b>Details:</b> ' + esc(b.details) + '<br>' : '')
          + '<br>Is everything correct?',
        quick:['Yes','No']
      };
    }
    b.step = next;
    var s = STEPS.filter(function(x){ return x.key === next; })[0];
    var intro = start ? (b.service ? 'Happy to help you book <b>' + esc(b.service) + '</b>! ' : 'Happy to help you book! ') : '';
    return { html: intro + s.ask + (start ? '<br><small>(Type "cancel" anytime to stop.)</small>' : ''), quick: s.quick };
  };

  /* ---------- desenha botões de resposta rápida e de contato ---------- */
  function renderExtras(container, res, onAsk){
    var items = (res.quick || []).map(function(q){ return { label:q, ask:q }; }).concat(res.actions || []);
    if (!items.length) return;
    var box = document.createElement('div'); box.className = 'dls-ai-acts';
    items.forEach(function(it){
      var el;
      if (it.href){ el = document.createElement('a'); el.href = it.href; }
      else { el = document.createElement('button'); el.type = 'button';
        el.addEventListener('click', function(){ box.remove(); onAsk(it.ask); }); }
      if (it.main) el.className = 'main';
      el.innerHTML = it.label;
      box.appendChild(el);
    });
    container.appendChild(box);
  }

  window.DLS_AI = {
    session: function(){ return new Session(); },
    renderExtras: renderExtras,
    contactActions: contactActions
  };
})();
