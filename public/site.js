(function(){
  var d=document,w=window,reduce=w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var head=d.querySelector('.site-head'),nav=d.getElementById('nav'),burger=d.querySelector('.burger'),ind=d.querySelector('.ind');
  /* sliding indicator */
  function moveInd(el){
    if(!ind||!el||el.classList.contains('nav-cta')||w.innerWidth<=1080){if(ind)ind.style.opacity=0;return}
    var n=nav.getBoundingClientRect(),r=el.getBoundingClientRect();
    ind.style.width=(r.width-28)+'px';ind.style.transform='translateX('+(r.left-n.left+14)+'px)';ind.style.opacity=1;
  }
  function home(){var a=d.querySelector('.nav [aria-current="page"]');moveInd(a)}
  if(nav){
    var items=nav.querySelectorAll(':scope>a,.has-menu>a');
    items.forEach(function(a){a.addEventListener('mouseenter',function(){moveInd(a)});a.addEventListener('focus',function(){moveInd(a)})});
    nav.addEventListener('mouseleave',home);w.addEventListener('resize',home);w.addEventListener('load',home);home();
  }
  /* touch devices: first tap opens the Products menu, second tap follows the link */
  var hm=d.querySelector('.has-menu');
  if(hm&&w.matchMedia&&w.matchMedia('(hover: none)').matches){
    var pa=hm.querySelector(':scope>a');
    pa.addEventListener('click',function(e){if(w.innerWidth>1080&&!hm.classList.contains('open')){e.preventDefault();hm.classList.add('open')}});
    d.addEventListener('click',function(e){if(!hm.contains(e.target))hm.classList.remove('open')});
  }
  if(burger){
    burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
    d.addEventListener('keydown',function(e){if(e.key==='Escape'){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}});
  }
  /* scroll: condense, hide on scroll down, progress, parallax */
  var last=0,ticking=false,par=d.querySelectorAll('.hero video,.page-hero img.bg');
  function onScroll(){
    var y=w.scrollY||0,h=d.documentElement.scrollHeight-w.innerHeight;
    head.classList.toggle('scrolled',y>40);
    if(y>260&&y>last+4&&!(nav&&nav.classList.contains('open')))head.classList.add('hide');else if(y<last-4||y<260)head.classList.remove('hide');
    head.style.setProperty('--p',h>0?Math.min(1,y/h):0);
    if(!reduce)par.forEach(function(p){if(y<900)p.style.transform='translate3d(0,'+(y*.22)+'px,0) scale(1.06)'});
    last=y;ticking=false;
  }
  w.addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(onScroll)}},{passive:true});onScroll();
  /* reveal on scroll */
  var sel='.sec-head,.card,.step,.fact,.split>*,.sched,.clients span,.film-grid>*,.chips,.kv>div,.info>div,form,.cta-band .wrap';
  var els=[].slice.call(d.querySelectorAll(sel));
  if('IntersectionObserver' in w&&!reduce){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('rv-in');io.unobserve(en.target);var c=en.target.querySelector('[data-count]');if(c)count(c);if(en.target.hasAttribute&&en.target.querySelector&&0){}}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    els.forEach(function(el,i){
      var r=el.getBoundingClientRect();
      if(r.top<w.innerHeight*.9){var c=el.querySelector('[data-count]');if(c)count(c);return}
      el.classList.add('will-rv');var sib=[].indexOf.call(el.parentNode.children,el);el.style.setProperty('--d',Math.min(sib,5)*.08+'s');io.observe(el);
    });
    setTimeout(function(){els.forEach(function(el){el.classList.add('rv-in')})},6000);
  }
  /* counters */
  function count(el){
    if(el.dataset.done)return;el.dataset.done=1;var to=+el.dataset.count,t0=null,from=to>1000?to-60:0;
    function f(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1200),e=1-Math.pow(1-p,3);el.textContent=Math.round(from+(to-from)*e);if(p<1)requestAnimationFrame(f)}
    if(reduce){el.textContent=to;return}requestAnimationFrame(f);
  }
  /* page transition */
  d.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');
    if(e.defaultPrevented||!a||e.metaKey||e.ctrlKey||e.shiftKey||a.target||a.hasAttribute('download'))return;
    var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||/^(https?:|mailto:|tel:)/.test(h)||/\.pdf$/.test(h)||reduce)return;
    e.preventDefault();d.body.classList.add('leaving');setTimeout(function(){location.href=a.href},180);
  });
  w.addEventListener('pageshow',function(){d.body.classList.remove('leaving')});
  /* hero video */
  var hv=d.querySelector('.hero video');if(hv&&reduce){try{hv.pause();hv.removeAttribute('autoplay')}catch(e){}}
  /* enquiry form */
  var f=d.getElementById('enq');
  if(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var g=function(i){return (d.getElementById(i)||{}).value||''};
      var t='To: info@swastikindustries.co.in\nSubject: Enquiry - '+g('f-prod')+'\n\nName: '+g('f-name')+'\nCompany: '+g('f-co')+'\nPhone: '+g('f-ph')+'\nEmail: '+g('f-em')+'\nProduct: '+g('f-prod')+'\nQuantity / Specification:\n'+g('f-msg');
      var o=d.getElementById('out');o.textContent=t;o.classList.add('on');
      var b=d.getElementById('copy');if(!b)return;b.hidden=false;
      b.onclick=function(){var done=function(){b.textContent='Copied'};
        if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){sel2(o)})}else{sel2(o)}};
    });
    function sel2(el){var r=d.createRange();r.selectNodeContents(el);var s=w.getSelection();s.removeAllRanges();s.addRange(r)}
  }
})();

/* glass depth: cards tilt toward the pointer; the soft background drifts the other way */
(function(){
  var d=document,w=window;
  if(!w.matchMedia||w.matchMedia('(prefers-reduced-motion: reduce)').matches||!w.matchMedia('(hover: hover)').matches)return;
  var root=d.documentElement,raf=0,px=0,py=0;
  w.addEventListener('pointermove',function(e){
    px=e.clientX/w.innerWidth-.5;py=e.clientY/w.innerHeight-.5;
    if(!raf)raf=requestAnimationFrame(function(){root.style.setProperty('--mx',px.toFixed(3));root.style.setProperty('--my',py.toFixed(3));raf=0});
  },{passive:true});
  var sel='.card,.stack-card,.whycard,.matcard,.kv>div';
  [].forEach.call(d.querySelectorAll(sel),function(el){
    el.classList.add('tilt');
    el.addEventListener('pointermove',function(e){
      var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      el.style.transition='transform .12s ease-out';
      el.style.transform='perspective(900px) rotateX('+((.5-y)*7).toFixed(2)+'deg) rotateY('+((x-.5)*9).toFixed(2)+'deg) translateY(-4px)';
      el.style.setProperty('--gx',(x*100)+'%');el.style.setProperty('--gy',(y*100)+'%');el.classList.add('is-tilting');
    });
    el.addEventListener('pointerleave',function(){el.style.transition='transform .5s cubic-bezier(.2,.7,.2,1)';el.style.transform='';el.classList.remove('is-tilting')});
  });
})();

/* company film: starts (muted) when it scrolls into view, pauses when it leaves */
(function(){
  var v=document.querySelector('video[data-autoplay]');
  if(!v||!('IntersectionObserver' in window))return;
  v.muted=true;
  new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}
      else if(!v.paused){v.pause()}
    });
  },{threshold:.45}).observe(v);
})();
