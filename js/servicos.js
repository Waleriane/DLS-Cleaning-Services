/* =========================================================
   DLS — JANELA DE DETALHES DOS SERVIÇOS
   Usada na Home e na página Services.
   Qualquer botão com data-service="chave" abre a janela.
   Para mudar textos, edite a lista abaixo.
========================================================= */
var DLS_SERVICES = {
  regular: {
    eyebrow: 'Residential Cleaning',
    title: 'Regular Cleaning',
    text: 'Recurring cleaning to keep your home consistently clean, fresh and comfortable — so you can enjoy your space without worrying about the routine.',
    listTitle: "What's included",
    list: ['Dusting','Making beds','Vacuuming carpets and rugs','Vacuuming floors','Mopping floors','Cleaning countertops','Cleaning sinks','Cleaning cabinet exteriors','Exterior appliance cleaning','Complete bathroom cleaning','Trash removal'],
    note: 'Available weekly, bi-weekly or monthly. Your estimate depends on the size and needs of your home.',
    more: { label: 'See all cleaning services', href: '/services.html#cleaning' }
  },
  deep: {
    eyebrow: 'Detailed Cleaning',
    title: 'Deep Cleaning',
    text: 'A more detailed clean for spaces that need extra attention — ideal when a space has gone a long time without a detailed cleaning, or when you want a more complete clean.',
    listTitle: "What's included",
    list: ['Everything in Regular Cleaning','Detailed baseboard cleaning','Cleaning blinds','Cleaning ceiling fans','Detailed kitchen cleaning','Detailed bathroom cleaning','Cleaning neglected areas','Cleaning hard-to-reach areas'],
    note: 'Available as an occasional or on-demand service.',
    more: { label: 'See all cleaning services', href: '/services.html#cleaning' }
  },
  commercial: {
    eyebrow: 'Commercial',
    title: 'Commercial Cleaning',
    text: 'Professional cleaning for offices and businesses, keeping your workplace clean, organized and welcoming for your team and clients.',
    listTitle: 'Areas we take care of',
    list: ['Workstations','Common areas','Cafeterias','Restrooms','Trash and recycling','Floor maintenance'],
    note: 'Available as recurring or on-demand cleaning, and adapted to the needs of each company.',
    more: { label: 'See all cleaning services', href: '/services.html#cleaning' }
  },
  handyman: {
    eyebrow: 'Handyman & Remodeling',
    title: 'Handyman & Remodeling',
    text: 'From small repairs to bigger projects — reliable solutions for repairs, improvements, installations and remodeling.',
    listTitle: 'Services',
    list: ['Summer kitchens','Drywall, finish & texture','Handyman services','Masonry','Carpentry','Painting','Demolition','Appliance installation','Remodeling'],
    note: 'Every project is different. Estimates are based on the scope of work, materials, complexity, urgency and the specific needs of each project. A site visit may be requested when necessary.',
    more: { label: 'Explore handyman services', href: '/handyman.html' }
  },
  'summer-kitchens': {
    eyebrow: 'Handyman · Outdoor',
    title: 'Summer Kitchens',
    text: 'Creating and improving outdoor kitchens — evaluated according to each project and the needs of each client.',
    listTitle: 'May include',
    list: ['Construction','Installation','Finishing','Structural improvements'],
    note: null,
    more: { label: 'See our summer kitchen photos', href: '/#gallery' }
  },
  drywall: {
    eyebrow: 'Remodeling',
    title: 'Drywall, Finish & Texture',
    text: 'Clean finishes and wall improvements tailored to your project.',
    listTitle: 'Services include', list: ['Drywall','Finishing','Wall texture','Repairs','Surface preparation'], note: null
  },
  'general-handyman': {
    eyebrow: 'Handyman',
    title: 'Handyman Services',
    text: 'General maintenance and repairs for your property — the work involved depends on the evaluation of each request.',
    listTitle: 'How it works', list: null, note: null
  },
  masonry: {
    eyebrow: 'Remodeling',
    title: 'Masonry',
    text: 'Construction and repair of masonry structures.',
    listTitle: 'How it works', list: null, note: null
  },
  carpentry: {
    eyebrow: 'Handyman',
    title: 'Carpentry',
    text: 'Carpentry and woodwork for your home or property.',
    listTitle: 'How it works', list: null, note: null
  },
  painting: {
    eyebrow: 'Remodeling',
    title: 'Painting',
    text: 'Painting and space renewal for residential and commercial projects.',
    listTitle: 'How it works', list: null, note: null
  },
  demolition: {
    eyebrow: 'Remodeling',
    title: 'Demolition',
    text: 'Demolition to prepare spaces for renovation and remodeling projects.',
    listTitle: 'How it works', list: null, note: null
  },
  appliance: {
    eyebrow: 'Installation',
    title: 'Appliance Installation',
    text: 'Appliance installation, evaluated according to the equipment and the conditions of the site.',
    listTitle: 'How it works', list: null, note: null
  },
  remodeling: {
    eyebrow: 'Remodeling',
    title: 'Remodeling Projects',
    text: 'From updating a single room to improving an entire property — the scope of work is defined according to each project.',
    listTitle: 'Projects include',
    list: ['Residential remodeling','Commercial remodeling','Home improvements','Space renovation','General property improvements'],
    note: null
  }
};
/* passos padrão para os serviços de handyman sem lista própria */
var DLS_HANDYMAN_STEPS = ['You tell us what you need','DLS reviews your request','Site visit when necessary','Your estimate is prepared and presented','Work begins after your approval'];
var DLS_HANDYMAN_NOTE = 'DLS does not publish fixed prices. Estimates depend on the type of service, size of the space, amount of work, materials, complexity, urgency and your specific needs.';

(function(){
  var modal = document.getElementById('dlsSvcModal');
  if (!modal) return;
  var box = modal.querySelector('.svm-box');
  var el = {
    img: modal.querySelector('.svm-img'), imgWrap: modal.querySelector('.svm-media'),
    eyebrow: modal.querySelector('.svm-eyebrow'), title: modal.querySelector('.svm-title'),
    text: modal.querySelector('.svm-text'), listTitle: modal.querySelector('.svm-list-title'),
    list: modal.querySelector('.svm-list'), note: modal.querySelector('.svm-note'),
    more: modal.querySelector('.svm-more'), cta: modal.querySelector('.svm-cta')
  };
  var onHome = !!document.getElementById('quote');
  var lastFocus = null;

  function open(key, trigger){
    var d = DLS_SERVICES[key]; if (!d) return;
    var card = trigger && trigger.closest('[data-card]');
    var photo = card && card.querySelector('img');
    if (photo){ el.img.src = photo.currentSrc || photo.src; el.img.alt = photo.alt; el.imgWrap.style.display = ''; }
    else el.imgWrap.style.display = 'none';
    el.eyebrow.textContent = d.eyebrow; el.title.textContent = d.title; el.text.textContent = d.text;
    var items = d.list || DLS_HANDYMAN_STEPS;
    el.listTitle.textContent = d.listTitle || "What's included";
    el.list.innerHTML = ''; el.list.classList.toggle('steps', !d.list);
    items.forEach(function(t){ var li = document.createElement('li'); li.textContent = t; el.list.appendChild(li); });
    el.note.textContent = d.note || DLS_HANDYMAN_NOTE;
    if (d.more && !(location.pathname.indexOf('services') > -1 && d.more.href.indexOf('/services.html') === 0)){
      el.more.style.display = ''; el.more.textContent = d.more.label + ' →'; el.more.href = d.more.href;
    } else el.more.style.display = 'none';
    el.cta.href = onHome ? '#quote' : '/#quote';
    lastFocus = document.activeElement;
    modal.classList.add('open'); document.body.style.overflow = 'hidden';
    box.scrollTop = 0; modal.querySelector('.svm-close').focus();
  }
  function close(){
    modal.classList.remove('open'); document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-service]');
    if (t){ e.preventDefault(); open(t.getAttribute('data-service'), t); }
  });
  modal.addEventListener('click', function(e){ if (e.target === modal) close(); });
  modal.querySelector('.svm-close').addEventListener('click', close);
  el.cta.addEventListener('click', close);
  el.more.addEventListener('click', close);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && modal.classList.contains('open')) close(); });
})();
