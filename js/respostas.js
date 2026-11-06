/* =========================================================
   DLS ASSISTANT — RESPOSTAS PRONTAS (modo reserva)
   Usado quando a OpenAI não está configurada ou fora do ar.
   Baseado no briefing da DLS. Para mudar uma resposta, edite o
   texto dentro de "say" no tema correspondente.
========================================================= */
var DLS_PHONE_TXT = '(407) 285-1212';
var DLS_EMAIL_TXT = 'contact@dlsservicesfl.com';

/* cada tema: palavras que ativam (words) e a resposta (say).
   "book": true = abre o agendamento passo a passo pelo chat. */
var DLS_TOPICS = [
  { id:'book', book:true,
    words:['book','schedule','i want a','i need a','i would like','id like','sign up','hire','appointment','reserve','booking','set up a cleaning','marcar','agendar','agendamento','reservar','agenda','cita','programar','quote','estimate','orcamento','presupuesto','cotizacion'] },
  { id:'notoffered',
    words:['garage','organiz','closet','outdoor','patio','yard','pressure wash','window outside','exterior window','garagem','organizacao','quintal'],
    say:"Thanks for asking! DLS does <b>not</b> offer outdoor area cleaning, garage cleaning, light organization or closet organization.<br><br>Our cleaning services are Regular, Deep and Commercial Cleaning, plus add-ons for interior windows, refrigerator and oven." },
  { id:'difference',
    words:['difference','differ','vs','versus','compare','diferenca','diferencia'],
    say:"<b>Regular Cleaning</b> is recurring maintenance (weekly, bi-weekly or monthly) to keep your home clean and fresh.<br><br><b>Deep Cleaning</b> includes everything in Regular, plus detailed baseboards, blinds, ceiling fans, detailed kitchen and bathroom cleaning, and neglected or hard-to-reach areas — ideal when a space hasn't had a detailed cleaning in a while." },
  { id:'regular',
    words:['regular','recurring','weekly','biweekly','bi-weekly','monthly','maintenance clean','what is included','what\'s included','included','limpeza regular','semanal','mensal'],
    say:"<b>Regular Cleaning</b> includes dusting, making beds, vacuuming carpets and rugs, vacuuming and mopping floors, cleaning countertops and sinks, cabinet exteriors, exterior of appliances, complete bathroom cleaning and trash removal.<br><br>It's available <b>weekly, bi-weekly or monthly</b>." },
  { id:'deep',
    words:['deep','detailed','thorough','move out','move-out','move in','move-in','limpeza pesada','profunda','pesada'],
    say:"<b>Deep Cleaning</b> includes everything in Regular Cleaning, plus detailed baseboards, blinds, ceiling fans, detailed kitchen and bathroom cleaning, and neglected or hard-to-reach areas. It's available as an occasional or on-demand service." },
  { id:'commercial',
    words:['commercial','office','business','company','store','workspace','escritorio','empresa','comercial','oficina'],
    say:"Yes! DLS offers <b>Commercial Cleaning</b> — workstations, common areas, cafeterias, restrooms, trash and recycling, and floor maintenance. It can be recurring or on-demand, adapted to your business." },
  { id:'addons',
    words:['window','fridge','refrigerator','oven','add-on','addon','add on','extra','janela','geladeira','forno','ventana','refrigerador','horno'],
    say:"Our cleaning <b>add-ons</b> are interior window cleaning, refrigerator cleaning and oven cleaning. You can add them to any cleaning service." },
  { id:'summer',
    words:['summer kitchen','outdoor kitchen','bbq','grill','cozinha gourmet','cozinha externa'],
    say:"Yes — DLS builds and improves <b>summer kitchens</b> (construction, installation, finishing and structural improvements). Each project is evaluated according to your space and needs, and a site visit may be needed." },
  { id:'remodel',
    words:['remodel','renovat','renovation','reform','improvement','reforma','remodelacao','remodelacion'],
    say:"DLS handles <b>residential and commercial remodeling</b>, home improvements, space renovation and general property improvements. The scope is defined for each project." },
  { id:'handyman',
    words:['handyman','repair','fix','broken','drywall','masonry','carpentry','carpenter','paint','painting','demolition','install','installation','appliance','conserto','consertar','reparo','pintura','marcenaria','alvenaria','instalacao','reparacion','arreglar'],
    say:"Our <b>Handyman &amp; Remodeling</b> services include summer kitchens, drywall/finish/texture, general repairs and maintenance, masonry, carpentry, painting, demolition, appliance installation and remodeling.<br><br>Every project is evaluated individually — a site visit may be needed." },
  { id:'cleaning',
    words:['clean','cleaning','maid','housekeep','limpeza','limpar','faxina','diarista','limpieza'],
    say:"DLS offers <b>Regular Cleaning</b> (weekly, bi-weekly or monthly), <b>Deep Cleaning</b> and <b>Commercial Cleaning</b>, plus add-ons for interior windows, refrigerator and oven." },
  { id:'price',
    words:['price','cost','how much','pricing','rate','charge','fee','cheap','discount','quanto','preco','valor','custa','desconto','cuanto','precio'],
    say:"DLS doesn't use fixed prices — every estimate is <b>personalized</b>. It depends on the type of service, size of the space, amount of work, materials, complexity, urgency and your needs." },
  { id:'area',
    words:['area','serve','location','where','orlando','kissimmee','city','cities','near','region','florida','onde','atende','cidade','donde'],
    say:"DLS serves <b>Orlando, Florida and nearby areas</b>. Share your city or address and our team will confirm availability for your location." },
  { id:'hours',
    words:['hour','open','time','when','weekend','saturday','sunday','horario','hora','sabado','domingo'],
    say:"DLS works <b>Monday to Friday</b>, usually starting at <b>8:00 AM</b>. You can tell us your preferred date and time and we'll confirm availability." },
  { id:'experience',
    words:['experience','how long','years','insured','licensed','trust','reliable','experiencia','anos','confiavel'],
    say:"DLS Services has <b>7+ years of experience</b> providing professional cleaning, handyman and remodeling services, with attention to detail and genuine care for every space." },
  { id:'contact',
    words:['contact','phone','call','email','e-mail','text','talk','speak','human','person','agent','representative','owner','whatsapp','telefone','ligar','falar','atendente','pessoa','llamar','hablar'],
    say:"Of course! You can talk to the DLS team directly:", contact:true },
  { id:'thanks',
    words:['thank','thanks','thx','obrigad','gracias','great','perfect','awesome','ok thanks'],
    say:"You're welcome! 😊 Is there anything else I can help you with?" },
  { id:'hello',
    words:['hello','hi','hey','good morning','good afternoon','good evening','ola','oi','bom dia','boa tarde','hola','buenos'],
    say:"Hi! 👋 I'm the DLS assistant. I can explain our services, help you choose the right one, or <b>book a cleaning or a project estimate</b> right here. How can I help?" }
];

function dlsNorm(t){
  return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9@'\- ]+/g,' ').replace(/\s+/g,' ').trim();
}

/* encontra o tema com mais palavras batendo (palavra inteira ou começo de palavra) */
function dlsMatchTopic(text){
  var q = ' ' + dlsNorm(text) + ' ';
  var best = null, bestScore = 0;
  DLS_TOPICS.forEach(function(t){
    var score = 0;
    t.words.forEach(function(w){
      var n = dlsNorm(w);
      if (!n) return;
      if (n.length <= 3){ if (q.indexOf(' ' + n + ' ') > -1) score += 1; }
      else if (q.indexOf(' ' + n) > -1) score += n.split(' ').length + 0.5;
    });
    /* "hello"/"thanks" só ganham quando a frase é curta */
    if ((t.id === 'hello' || t.id === 'thanks') && q.split(' ').length > 7) score = 0;
    /* pedir para marcar/orçar tem prioridade sobre o resto */
    if (t.book && score > 0) score += 10;
    if (score > bestScore){ bestScore = score; best = t; }
  });
  return best;
}

/* compatibilidade com o código antigo: devolve só o texto */
function dlsGetAnswer(question){
  var t = dlsMatchTopic(question);
  if (t && t.say) return t.say;
  if (t && t.book) return "I can help you book! Tell me which service you need.";
  return "I'm not sure about that one — our team can help you directly.";
}
