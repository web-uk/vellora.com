(()=>{
  const config=window.VELLORA_CONFIG||{};
  let lang='en',copy=null,languageRequest=0;
  const get=(obj,path)=>path.split('.').reduce((a,k)=>a?.[k],obj);
  const localised=value=>typeof value==='string'?value:value?.[lang];
  const node=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
  const form=document.getElementById('enquiry');
  const formReady=()=>config.privacyReady===true&&/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(config.formspreeEndpoint||'');
  function renderStats(){
    const target=document.getElementById('stats');if(!target)return;
    const stats=Array.isArray(config.stats)?config.stats:[];
    const items=stats.filter(s=>String(localised(s.value)||'').trim()&&String(localised(s.label)||'').trim());
    target.replaceChildren(...items.map(s=>{const e=node('div',undefined,'stat');e.append(node('strong',localised(s.value)),node('span',localised(s.label)));return e}));
    target.closest('.proof-band').hidden=items.length===0;
  }
  function updateContacts(){
    if(!form)return;
    const fields=document.getElementById('form-fields');fields.disabled=!formReady();
    document.getElementById('contact-note').hidden=formReady();
    const labels=copy||{email:'Send an email',whatsapp:'Talk on WhatsApp'};
    const items=[];
    if(config.email){const a=node('a',labels.email,'contact-links');a.href=`mailto:${config.email}`;items.push(a)}
    document.querySelector('.whatsapp-float')?.remove();
    if(/^\d{8,15}$/.test(config.whatsapp||'')){
      const a=node('a',labels.whatsapp,'contact-links');a.href=`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(lang==='pt'?'Olá, gostaria de agendar uma conversa inicial.':'Hello, I would like to arrange a discovery conversation.')}`;a.target='_blank';a.rel='noopener noreferrer';items.push(a);
      const floating=a.cloneNode(true);floating.className='whatsapp-float';document.body.append(floating);
    }
    document.getElementById('contact-links').replaceChildren(...items);
  }
  function syncLanguage(){
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-lang]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.lang===lang)));
    document.querySelectorAll('a[href^="privacy.html"]').forEach(e=>e.href=`privacy.html${lang==='pt'?'?lang=pt':''}`);
    document.querySelector('[data-copy="back"]')?.setAttribute('href',`./${lang==='pt'?'?lang=pt':''}`);
    try{localStorage.setItem('vellora-language',lang)}catch{}
    const url=new URL(location.href);if(lang==='pt')url.searchParams.set('lang','pt');else url.searchParams.delete('lang');history.replaceState(null,'',url);
    renderStats();updateContacts();
  }
  async function chooseLanguage(next){
    const request=++languageRequest;
    try{
      const r=await fetch(`content/${next}.json`);if(!r.ok)throw Error('Language unavailable');
      const data=await r.json();if(request!==languageRequest)return;
      copy=data;lang=next;
      document.querySelectorAll('[data-copy]').forEach(e=>{const text=get(data,e.dataset.copy);if(typeof text==='string')e.textContent=text});
      document.title=document.body.dataset.page==='privacy'?`${copy.privacy} | Vellora Connect`:copy.metaTitle;
      document.querySelector('meta[name="description"]')?.setAttribute('content',copy.metaDescription);
      document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
      document.querySelector('meta[property="og:description"]')?.setAttribute('content',copy.metaDescription);
      syncLanguage();
    }catch(error){console.warn('Language could not be loaded; current page retained.',error)}
  }
  document.querySelectorAll('[data-lang]').forEach(e=>e.addEventListener('click',()=>chooseLanguage(e.dataset.lang)));
  let preferred=new URLSearchParams(location.search).get('lang');
  if(!['en','pt'].includes(preferred)){try{preferred=localStorage.getItem('vellora-language')}catch{}}
  if(preferred==='pt')chooseLanguage('pt');else syncLanguage();
  document.getElementById('year').textContent=new Date().getFullYear();
  document.querySelectorAll('[data-context]').forEach(a=>a.addEventListener('click',()=>{
    const select=document.getElementById('context');if(select)select.value=a.dataset.context;
  }));
  if(config.portrait&&config.portrait!=='assets/jesiel.jpg')document.querySelectorAll('[data-portrait]').forEach(p=>{
    p.querySelectorAll('source').forEach(s=>s.remove());const img=p.querySelector('img');img.removeAttribute('srcset');img.removeAttribute('sizes');img.src=config.portrait;
  });
  if(config.testimonialsEnabled&&Array.isArray(config.testimonials)&&config.testimonials.length){
    const section=document.getElementById('testimonials');if(section){section.hidden=false;section.className='section';const container=node('div',undefined,'container');config.testimonials.forEach(t=>{if(!t.quote||!t.name||!t.context)return;const q=node('blockquote');q.append(node('p',t.quote),node('cite',`${t.name} · ${t.context}`));container.append(q)});section.replaceChildren(container);if(!container.children.length)section.hidden=true;}
  }
  form?.addEventListener('submit',async e=>{
    e.preventDefault();if(!formReady())return;
    const status=document.getElementById('form-status'),button=form.querySelector('button');
    const messages=copy||{sending:'Sending…',success:'Thank you. Your enquiry has been sent to me.',failure:'Your enquiry could not be sent. Please try again or use an available contact channel.'};
    button.disabled=true;status.textContent=messages.sending;
    try{const r=await fetch(config.formspreeEndpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!r.ok)throw Error();status.textContent=messages.success;form.reset()}catch{status.textContent=messages.failure}finally{button.disabled=false}
  });
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const targets=document.querySelectorAll('.reveal,.photo-reveal');
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('waiting');observer.unobserve(entry.target)}}),{threshold:.08});
    document.documentElement.classList.add('motion-ready');targets.forEach(e=>{e.classList.add('waiting');observer.observe(e)});
  }
})();
