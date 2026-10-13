(async()=>{
  let lang=new URLSearchParams(location.search).get('lang');
  if(!['en','pt'].includes(lang)){try{lang=localStorage.getItem('vellora-language')}catch{} }
  if(!['en','pt'].includes(lang))lang='en';
  let copy; const config=window.VELLORA_CONFIG||{};
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n};
  const replace=(id,nodes)=>{const target=document.getElementById(id);if(target)target.replaceChildren(...nodes)};
  const links=['audience','approach','about','contact'];
  async function render(next){
    let response;try{response=await fetch(`content/${next}.json`);if(!response.ok)throw Error();copy=await response.json()}catch{document.getElementById('main').textContent='Unable to load this page. Please refresh. / Não foi possível carregar. Atualize a página.';return}
    lang=next;document.documentElement.lang=lang;
    document.title=document.body.dataset.page==='privacy'?`${copy.privacy} | Vellora Connect`:copy.metaTitle;
    document.querySelector('meta[name="description"]').content=copy.metaDescription;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content',document.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content',copy.metaDescription);
    document.querySelectorAll('[data-text]').forEach(n=>n.textContent=copy[n.dataset.text]||'');
    document.querySelectorAll('[data-lang]').forEach(n=>n.setAttribute('aria-pressed',String(n.dataset.lang===lang)));
    try{localStorage.setItem('vellora-language',lang)}catch{}
    const url=new URL(location.href);url.searchParams.set('lang',lang);history.replaceState(null,'',url);
    document.querySelectorAll('a[href^="privacy.html"]').forEach(n=>n.href=`privacy.html?lang=${lang}`);
    if(document.body.dataset.page==='privacy'){
      replace('privacy-sections',copy.privacySections.map(([h,p])=>{const s=el('section');s.append(el('h2',h),el('p',p));return s}));return;
    }
    replace('navigation',copy.nav.map((label,i)=>{const a=el('a',label);a.href=`#${links[i]}`;return a}));
    replace('proof',copy.proof.map(([a,b])=>{const d=el('div');d.append(el('strong',a),el('span',b));return d}));
    replace('audience-cards',copy.audiences.map(([h,p,s],i)=>{const d=el('article',null,'card');const ix=el('div',null,'card-index');ix.append(el('span',`0${i+1}`),el('span','↗'));d.append(ix,el('h3',h),el('p',p),el('small',s));return d}));
    replace('steps',copy.steps.map(([h,p],i)=>{const d=el('article',null,'step'),body=el('div');body.append(el('h3',h),el('p',p));d.append(el('span',`0${i+1}`,'number'),body);return d}));
    replace('formats',copy.formats.map(([n,h,p])=>{const d=el('article',null,'format');d.append(el('small',n),el('h3',h),el('p',p));return d}));
    replace('values',copy.values.map(([h,p])=>{const d=el('div',null,'value');d.append(el('h3',h),el('p',p));return d}));
    replace('questions',copy.faqs.map(([q,a])=>{const d=el('details');d.append(el('summary',q),el('p',a));return d}));
    document.querySelectorAll('[data-field]').forEach(n=>n.textContent=copy.fields[Number(n.dataset.field)]);
    const context=document.getElementById('context'),old=context.value;replace('context',copy.options.map((label,i)=>{const o=el('option',label);o.value=i?['leader','business','individual','organisation'][i-1]:'';return o}));context.value=old;
    const formReady=/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(config.formspreeEndpoint||'')&&config.privacyReady;
    document.getElementById('form-fields').disabled=!formReady;
    document.getElementById('contact-note').hidden=formReady;
    const contactLinks=[];
    if(config.email){const a=el('a',copy.email,'contact-links');a.href=`mailto:${config.email}`;contactLinks.push(a)}
    document.querySelector('.whatsapp-float')?.remove();
    if(/^\d{8,15}$/.test(config.whatsapp||'')){const a=el('a',copy.whatsapp,'contact-links');a.href=`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(lang==='pt'?'Olá, gostaria de agendar uma conversa inicial.':'Hello, I would like to arrange a discovery conversation.')}`;a.target='_blank';a.rel='noopener noreferrer';contactLinks.push(a);const f=a.cloneNode(true);f.className='whatsapp-float';document.body.append(f)}
    replace('contact-links',contactLinks);
    if(config.testimonialsEnabled&&config.testimonials?.length){const s=document.getElementById('testimonials');s.hidden=false;s.className='section';s.replaceChildren(el('h2',lang==='pt'?'Experiências compartilhadas':'Shared experiences'));config.testimonials.forEach(t=>{const b=el('blockquote');b.append(el('p',t.quote),el('cite',`${t.name} · ${t.context}`));s.append(b)})}
  }
  document.querySelectorAll('[data-lang]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.lang)));
  await render(lang);document.getElementById('year').textContent=new Date().getFullYear();
  if(config.portrait&&document.querySelector('.arch')){const img=el('img');img.src=config.portrait;img.alt='Jesiel Machado';img.style.cssText='width:100%;height:100%;object-fit:cover;position:absolute;inset:0';document.querySelector('.arch').replaceChildren(img)}
  const form=document.getElementById('enquiry');form?.addEventListener('submit',async e=>{e.preventDefault();const status=document.getElementById('form-status'),button=form.querySelector('button');if(!config.privacyReady||!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(config.formspreeEndpoint||''))return;button.disabled=true;status.textContent=copy.sending;try{const r=await fetch(config.formspreeEndpoint,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});if(!r.ok)throw Error();status.textContent=copy.success;form.reset()}catch{status.textContent=copy.failure}finally{button.disabled=false}});
})();
