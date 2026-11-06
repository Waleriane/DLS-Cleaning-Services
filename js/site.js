/* =========================================================
   CONTATOS DA DLS — PREENCHA AQUI (vale para todas as páginas)
   Deixe vazio ('') o que não tiver: o ícone leva ao formulário e o texto some.
========================================================= */
var DLS_CONTACT = {
  phone:     '',   // PREENCHER — ex.: '(407) 555-1234'
  email:     'contact@dlsservicesfl.com',
  instagram: 'dls.cleaningservices'
};

(function(){
  var c = DLS_CONTACT;
  var links = {
    phone:     c.phone ? 'tel:+1' + c.phone.replace(/\D/g,'').replace(/^1(?=\d{10}$)/,'') : '',
    email:     c.email ? 'mailto:' + c.email : '',
    instagram: c.instagram ? 'https://www.instagram.com/' + c.instagram.replace(/^@/,'') : ''
  };
  var texts = { phone:c.phone, email:c.email, instagram:c.instagram ? '@' + c.instagram.replace(/^@/,'') : '' };
  document.querySelectorAll('[data-contact]').forEach(function(a){
    var k = a.getAttribute('data-contact');
    if (links[k]) a.setAttribute('href', links[k]);
    else { a.setAttribute('href', '/contact.html'); a.removeAttribute('target'); }   /* sem o dado ainda: leva à página de contato */
    if (a.hasAttribute('data-text')) a.textContent = texts[k] || '';
  });
  document.querySelectorAll('[data-show]').forEach(function(li){
    if (!c[li.getAttribute('data-show')]) li.style.display = 'none';
  });
  var y = document.getElementById('ftYear'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- MENU ---------- */
  var header = document.querySelector('.dls-header');
  if (!header) return;
  var burger = header.querySelector('.hd-burger');
  var page = document.body.getAttribute('data-page') || 'home';

  window.addEventListener('scroll', function(){ header.classList.toggle('scrolled', window.scrollY > 10); }, { passive:true });
  burger.addEventListener('click', function(){
    var open = header.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* link aponta para esta mesma página? então rola suave em vez de recarregar */
  function samePageTarget(a){
    var url = new URL(a.getAttribute('href'), location.href);
    var here = location.pathname.replace(/index\.html$/,'');
    var there = url.pathname.replace(/index\.html$/,'');
    if (here !== there || !url.hash) return null;
    return url.hash === '#top' ? document.body : document.querySelector(url.hash);
  }
  document.querySelectorAll('a[href]').forEach(function(a){
    a.addEventListener('click', function(e){
      var target = samePageTarget(a);
      var fromMobile = !!a.closest('.hd-mobile');
      if (fromMobile){ header.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
      if (!target) return;
      e.preventDefault();
      setTimeout(function(){
        if (target === document.body) window.scrollTo({ top:0, behavior:'smooth' });
        else target.scrollIntoView({ behavior:'smooth', block:'start' });
        history.replaceState(null, '', a.getAttribute('href').replace(/^[^#]*/, '') || location.pathname);
      }, fromMobile ? 360 : 0);
    });
  });

  /* link ativo do menu */
  var navLinks = header.querySelectorAll('.hd-nav a');
  function mark(key){ navLinks.forEach(function(a){ a.classList.toggle('active', a.getAttribute('data-nav') === key); }); }
  function setActive(){
    var y = window.scrollY + 140, key;
    var atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (page === 'services'){
      key = 'services';
    } else if (page === 'about' || page === 'contact' || page === 'handyman'){
      key = page;
    } else {
      key = 'home';
    }
    mark(key);
  }
  window.addEventListener('scroll', setActive, { passive:true }); setActive();
})();

/* =========================================================
   BOTÃO DE E-MAIL — no computador abre um menuzinho:
   Gmail / programa de e-mail / copiar endereço.
   (O link "mailto" sozinho não faz nada em quem usa Gmail no navegador.)
   No celular continua abrindo o app de e-mail direto.
========================================================= */
(function(){
  var email = (typeof DLS_CONTACT !== 'undefined' && DLS_CONTACT.email) || '';
  if (!email) return;
  var css = '.dls-mailmenu{position:absolute;z-index:6000;min-width:230px;background:#fff;border-radius:12px;padding:6px;box-shadow:0 14px 40px rgba(6,59,74,.22);font-family:Montserrat,Arial,sans-serif}'
    + '.dls-mailmenu a,.dls-mailmenu button{display:flex;align-items:center;gap:10px;width:100%;padding:11px 12px;border:0;background:none;border-radius:8px;cursor:pointer;text-decoration:none;color:#063B4A;font:600 14px Montserrat,Arial,sans-serif;text-align:left}'
    + '.dls-mailmenu a:hover,.dls-mailmenu button:hover{background:#EEF7F7;color:#0D9FA5}'
    + '.dls-mailmenu small{display:block;padding:6px 12px 4px;font-size:12px;color:#62767B;word-break:break-all}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var menu = null;
  function close(){ if (menu){ menu.remove(); menu = null; } }
  function open(link){
    close();
    var subject = encodeURIComponent('Quote request — DLS Services');
    menu = document.createElement('div'); menu.className = 'dls-mailmenu'; menu.setAttribute('role','menu');
    menu.innerHTML = '<small>' + email + '</small>'
      + '<a role="menuitem" target="_blank" rel="noopener" href="https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email) + '&su=' + subject + '">✉️ Send with Gmail</a>'
      + '<a role="menuitem" href="mailto:' + email + '?subject=' + subject + '">📨 Open email app</a>'
      + '<button role="menuitem" type="button" data-copy>📋 Copy email address</button>';
    document.body.appendChild(menu);
    var r = link.getBoundingClientRect(), mw = menu.offsetWidth;
    var left = Math.min(Math.max(10, r.left + window.scrollX + r.width/2 - mw/2), window.scrollX + document.documentElement.clientWidth - mw - 10);
    var top = r.bottom + window.scrollY + 8;
    if (r.bottom + menu.offsetHeight + 16 > window.innerHeight) top = r.top + window.scrollY - menu.offsetHeight - 8;
    menu.style.left = left + 'px'; menu.style.top = top + 'px';
    menu.querySelector('[data-copy]').addEventListener('click', function(){
      var b = this;
      function done(){ b.textContent = '✅ Copied!'; setTimeout(close, 1200); }
      if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, function(){ prompt('Copy the email address:', email); });
      else { prompt('Copy the email address:', email); }
    });
    menu.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', function(){ setTimeout(close, 100); }); });
  }
  var touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  document.addEventListener('click', function(e){
    var a = e.target.closest('a[href^="mailto:"]');
    if (a && !a.closest('.dls-mailmenu')){
      if (touch) return;                 /* celular: abre o app de e-mail normalmente */
      e.preventDefault(); e.stopPropagation(); open(a); return;
    }
    if (menu && !e.target.closest('.dls-mailmenu')) close();
  }, true);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
  window.addEventListener('resize', close);
})();
