/* =========================================================
   DLS ASSISTANT — POP-UP (todas as páginas)
   Botão discreto no canto inferior direito. Abre um chat compacto.
   O "×" do botão esconde o pop-up nesta visita.
   Respostas: js/respostas.js
========================================================= */
(function(){
  if (typeof dlsGetAnswer !== 'function') return;
  var ai = window.DLS_AI ? DLS_AI.session() : null, busy = false;
  var KEY = 'dlsChatHidden';
  function hiddenNow(){ try { return sessionStorage.getItem(KEY) === '1'; } catch(e){ return false; } }
  function remember(){ try { sessionStorage.setItem(KEY, '1'); } catch(e){} }
  if (hiddenNow()) return;

  var css = ''
  + '.dcw{position:fixed;right:20px;bottom:20px;z-index:4000;font-family:Montserrat,Arial,sans-serif}'
  + '.dcw *{box-sizing:border-box;margin:0;padding:0}'
  + '.dcw-btn{position:relative;width:60px;height:60px;border-radius:50%;border:3px solid #fff;cursor:pointer;padding:0;overflow:hidden;background:#DDF2F2;box-shadow:0 8px 24px rgba(6,59,74,.28);transition:transform .25s ease}'
  + '.dcw-btn:hover{transform:scale(1.06)}'
  + '.dcw-btn img{width:100%;height:100%;object-fit:cover;display:block}'
  + '.dcw-dot{position:absolute;right:2px;bottom:2px;width:13px;height:13px;border-radius:50%;background:#38D6A5;border:2px solid #fff}'
  + '.dcw-x{position:absolute;top:-6px;right:-6px;width:22px;height:22px;border-radius:50%;border:0;cursor:pointer;background:#063B4A;color:#fff;font-size:14px;line-height:22px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.2);opacity:.9}'
  + '.dcw-x:hover{opacity:1;background:#0D9FA5}'
  + '.dcw-tip{position:absolute;right:72px;bottom:12px;white-space:nowrap;background:#fff;color:#063B4A;font-size:13px;font-weight:600;padding:9px 14px;border-radius:20px;box-shadow:0 6px 18px rgba(6,59,74,.16);opacity:0;transform:translateX(6px);transition:.35s ease;pointer-events:none}'
  + '.dcw-tip.show{opacity:1;transform:none}'
  + '.dcw-panel{position:absolute;right:0;bottom:76px;width:360px;max-width:calc(100vw - 32px);height:min(520px,calc(100vh - 120px));background:#fff;border-radius:16px;overflow:hidden;display:none;flex-direction:column;box-shadow:0 24px 60px rgba(6,59,74,.28)}'
  + '.dcw.open .dcw-panel{display:flex;animation:dcwUp .25s ease}'
  + '.dcw.open .dcw-tip{display:none}'
  + '@keyframes dcwUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}'
  + '.dcw-head{display:flex;align-items:center;gap:10px;padding:12px 14px;background:#063B4A;color:#fff}'
  + '.dcw-head img{width:38px;height:38px;border-radius:50%;border:2px solid rgba(255,255,255,.6);object-fit:cover;background:#DDF2F2}'
  + '.dcw-head b{display:block;font-size:14px}'
  + '.dcw-head small{display:flex;align-items:center;gap:6px;font-size:11.5px;color:rgba(255,255,255,.82)}'
  + '.dcw-head small i{width:7px;height:7px;border-radius:50%;background:#38D6A5}'
  + '.dcw-close{margin-left:auto;width:32px;height:32px;border-radius:50%;border:0;cursor:pointer;background:rgba(255,255,255,.12);color:#fff;font-size:20px;line-height:32px}'
  + '.dcw-close:hover{background:#0D9FA5}'
  + '.dcw-body{flex:1;overflow-y:auto;padding:14px;background:#F6FAFA;display:flex;flex-direction:column;gap:10px}'
  + '.dcw-msg{max-width:88%;padding:10px 13px;border-radius:4px 14px 14px 14px;background:#fff;border:1px solid rgba(6,59,74,.08);color:#3B4F55;font-size:14px;line-height:1.55}'
  + '.dcw-msg a{color:#0D9FA5;font-weight:600}'
  + '.dcw-me{align-self:flex-end;background:#0D9FA5;color:#fff;border:0;border-radius:14px 4px 14px 14px}'
  + '.dcw-opts{display:flex;flex-wrap:wrap;gap:6px}'
  + '.dcw-opts button{border:1px solid rgba(13,159,165,.3);background:#fff;color:#063B4A;border-radius:20px;padding:7px 12px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer}'
  + '.dcw-opts button:hover{background:#DDF2F2;border-color:#0D9FA5}'
  + '.dcw-typing{display:flex;gap:4px;padding:12px 14px}'
  + '.dcw-typing span{width:6px;height:6px;border-radius:50%;background:#0D9FA5;animation:dcwT 1.2s infinite}'
  + '.dcw-typing span:nth-child(2){animation-delay:.15s}.dcw-typing span:nth-child(3){animation-delay:.3s}'
  + '@keyframes dcwT{0%,60%,100%{opacity:.25}30%{opacity:1}}'
  + '.dcw-form{display:flex;gap:8px;padding:10px;border-top:1px solid #E6EEEE;background:#fff}'
  + '.dcw-form input{flex:1;min-width:0;border:1px solid #DCE8E8;border-radius:22px;padding:10px 14px;font-family:inherit;font-size:16px;color:#063B4A;outline:none}'
  + '.dcw-form input:focus{border-color:#0D9FA5}'
  + '.dcw-form button{width:42px;height:42px;flex:none;border-radius:50%;border:0;background:#0D9FA5;color:#fff;font-size:18px;cursor:pointer}'
  + '@media (max-width:640px){.dcw{right:14px;bottom:14px}.dcw-btn{width:54px;height:54px}.dcw-tip{display:none}'
  + '.dcw-panel{position:fixed;left:10px;right:10px;bottom:80px;width:auto;max-width:none;height:min(70vh,560px)}}'
  + '@media print{.dcw{display:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var AV = 'imagens/robo-avatar.jpg';
  var w = document.createElement('div'); w.className = 'dcw';
  w.innerHTML =
    '<div class="dcw-panel" role="dialog" aria-label="DLS Assistant chat">'
  +   '<div class="dcw-head"><img src="' + AV + '" alt=""><div><b>DLS Assistant</b><small><i></i>Online &amp; ready to help</small></div>'
  +   '<button class="dcw-close" type="button" aria-label="Close chat">×</button></div>'
  +   '<div class="dcw-body" aria-live="polite"></div>'
  +   '<form class="dcw-form"><input type="text" placeholder="Ask a question..." aria-label="Your question" autocomplete="off"><button type="submit" aria-label="Send">↑</button></form>'
  + '</div>'
  + '<span class="dcw-tip">Questions? Ask our assistant</span>'
  + '<button class="dcw-btn" type="button" aria-label="Open DLS Assistant chat"><img src="' + AV + '" alt=""><span class="dcw-dot"></span></button>'
  + '<button class="dcw-x" type="button" aria-label="Hide assistant">×</button>';
  document.body.appendChild(w);

  var body = w.querySelector('.dcw-body'), input = w.querySelector('.dcw-form input'), started = false;
  function esc(t){ var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function add(html, me){ var m = document.createElement('div'); m.className = 'dcw-msg' + (me ? ' dcw-me' : ''); m.innerHTML = html; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; }
  function ask(q){
    if (busy) return; busy = true;
    add(esc(q), true);
    var t = add('<span></span><span></span><span></span>'); t.className = 'dcw-msg dcw-typing';
    var t0 = Date.now();
    var p = ai ? ai.ask(q) : Promise.resolve({ html: dlsGetAnswer(q) });
    p.then(function(res){
      setTimeout(function(){
        t.remove();
        var m = add(String(res.html || '').replace(/\s+/g,' ').trim());
        if (ai) DLS_AI.renderExtras(m, res, ask);
        body.scrollTop = body.scrollHeight; busy = false;
      }, Math.max(0, 600 - (Date.now() - t0)));
    });
  }
  function start(){
    if (started) return; started = true;
    add("Hi! I'm the DLS Virtual Assistant. How can I help you today?");
    var o = document.createElement('div'); o.className = 'dcw-opts';
    ['Book a cleaning','Regular vs. Deep cleaning','Handyman & remodeling','How does pricing work?','Talk to the team'].forEach(function(q){
      var b = document.createElement('button'); b.type = 'button'; b.textContent = q;
      b.addEventListener('click', function(){ ask(q === 'Regular vs. Deep cleaning' ? 'What is the difference between regular and deep cleaning?' : q); });
      o.appendChild(b);
    });
    body.appendChild(o);
  }
  function open(){ w.classList.add('open'); start(); setTimeout(function(){ if (window.innerWidth > 640) input.focus(); }, 50); }
  function close(){ w.classList.remove('open'); }
  w.querySelector('.dcw-btn').addEventListener('click', function(){ w.classList.contains('open') ? close() : open(); });
  w.querySelector('.dcw-close').addEventListener('click', close);
  w.querySelector('.dcw-x').addEventListener('click', function(){ remember(); w.remove(); });
  w.querySelector('.dcw-form').addEventListener('submit', function(e){ e.preventDefault(); var q = input.value.trim(); if (!q) return; input.value = ''; ask(q); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
  

  /* dica aparece uma vez, alguns segundos depois de abrir a página */
  var tip = w.querySelector('.dcw-tip');
  setTimeout(function(){ if (!w.classList.contains('open')) tip.classList.add('show'); }, 4000);
  setTimeout(function(){ tip.classList.remove('show'); }, 10000);
})();
