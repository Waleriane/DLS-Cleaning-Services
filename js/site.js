/* =========================================================
   CONTATOS DA DLS — PREENCHA AQUI (vale para todas as páginas)
   Deixe vazio ('') o que não tiver: o ícone leva ao formulário e o texto some.
========================================================= */
var DLS_CONTACT = {
  phone:     '',   // ex.: '(407) 555-1234'
  email:     '',   // ex.: 'contact@dlsservices.com'
  instagram: ''    // ex.: 'dlsservices'  (só o @, sem https)
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
    if (links[k]) a.setAttribute('href', links[k]); else { a.setAttribute('href', '/#quote'); a.removeAttribute('target'); }
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
      var hm = document.getElementById('handyman');
      key = (hm && hm.getBoundingClientRect().top + window.scrollY <= y) ? 'handyman' : 'services';
      if (atBottom) key = 'contact';
    } else {
      key = 'home';
      var ab = document.getElementById('about');
      if (ab && ab.getBoundingClientRect().top + window.scrollY <= y) key = 'about';
      var sv = document.getElementById('services');
      if (sv && sv.getBoundingClientRect().top + window.scrollY <= y) key = 'none';
      if (atBottom) key = 'contact';
    }
    mark(key);
  }
  window.addEventListener('scroll', setActive, { passive:true }); setActive();
})();
