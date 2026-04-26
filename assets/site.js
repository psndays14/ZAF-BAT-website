window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}

document.documentElement.classList.remove('no-js');

document.addEventListener('DOMContentLoaded',function(){
  document.querySelectorAll('a[href*="wa.me"]').forEach(function(a){
    a.addEventListener('click',function(){gtag('event','whatsapp_click',{event_category:'lead',event_label:a.textContent.trim()});});
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
    a.addEventListener('click',function(){gtag('event','phone_click',{event_category:'lead',event_label:'appel'});});
  });
  var form=document.getElementById('zafbat-form');
  if(form){form.addEventListener('submit',function(){gtag('event','form_submit',{event_category:'lead',event_label:'formulaire_contact'});});}
});

(function(){
  if(!('IntersectionObserver' in window))return;
  var els=document.querySelectorAll('.reveal');
  if(!els.length)return;
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}
    });
  },{threshold:0.15,rootMargin:'0px 0px -40px 0px'});
  els.forEach(function(el){io.observe(el);});
})();

(function(){
  var cards=document.querySelectorAll('.svc:not(.svc-featured),.why-point,.real-card');
  cards.forEach(function(card){
    card.addEventListener('mousemove',function(e){
      var r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(e.clientX-r.left)+'px');
      card.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
    card.addEventListener('mouseleave',function(){
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
})();
