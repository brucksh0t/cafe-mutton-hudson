// Cafe Mutton status: hours as posted on cafemutton.com/location/cafe-mutton (checked Oct 12, 2026), America/New_York.
// Preview: ?now=2026-10-16T18:00
(function(){
  // day -> [openMin, closeMin, label]
  var H={3:[1020,1260,'Dinner'],4:[1020,1260,'Dinner'],5:[1020,1260,'Dinner'],6:[600,900,'Brunch'],0:[600,900,'Brunch']};
  var N=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  function t(m){var h=Math.floor(m/60);return (h%12||12)+(h>=12?' PM':' AM');}
  function now(){var q=new URLSearchParams(location.search).get('now'),m=q&&q.match(/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/);
    if(m)return {day:new Date(Date.UTC(+m[1],m[2]-1,+m[3])).getUTCDay(),min:+m[4]*60+ +m[5]};
    var p={};new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).forEach(function(x){p[x.type]=x.value;});
    return {day:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(p.weekday),min:(+p.hour%24)*60+ +p.minute};}
  function next(d){for(var i=1;i<=7;i++){var k=(d+i)%7;if(H[k])return {k:k,i:i};}}
  function compute(n){var h=H[n.day];
    if(h&&n.min>=h[0]&&n.min<h[1])return {c:'open',t:h[2]+' is on now, until '+t(h[1])+'.'+(n.day>=3&&n.day<=5?' Dinner takes reservations.':'')};
    if(h&&n.min<h[0])return {c:'later',t:'Opens today at '+t(h[0])+' for '+h[2].toLowerCase()+', until '+t(h[1])+'.'};
    var x=next(n.day),hh=H[x.k];return {c:'closed',t:'Closed now. Next: '+(x.i===1?'tomorrow, ':'')+N[x.k]+' '+hh[2].toLowerCase()+' at '+t(hh[0])+'.'};}
  var n=now(),r=compute(n),row=document.querySelector('[data-status]');
  if(row){row.querySelector('.dot').className='dot dot--'+r.c;row.querySelector('[data-text]').innerHTML=r.t+' Holiday hours aren’t posted. Call to confirm: <a href="tel:+15186716230">(518) 671-6230</a>';}
  var tr=document.querySelector('[data-hours] tr[data-day="'+n.day+'"]');if(tr)tr.classList.add('is-today');
  // Signature: menu tabs with a sliding underline (motion off under reduced-motion via CSS)
  var tabs=[].slice.call(document.querySelectorAll('.tab')),bar=document.querySelector('.tabs__bar');
  function place(b){if(bar){bar.style.width=b.offsetWidth+'px';bar.style.transform='translateX('+b.offsetLeft+'px)';}}
  function sel(b,focus){tabs.forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on;});place(b);if(focus)b.focus();}
  tabs.forEach(function(b,i){b.addEventListener('click',function(){sel(b);});
    b.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(d){e.preventDefault();sel(tabs[(i+d+tabs.length)%tabs.length],true);}});});
  // Brunch days default to the brunch menu
  if(tabs.length){sel(tabs[(n.day===6||n.day===0)?1:0]);addEventListener('resize',function(){place(document.querySelector('.tab[aria-selected=true]'));});
    if(document.fonts)document.fonts.ready.then(function(){place(document.querySelector('.tab[aria-selected=true]'));});}
  window.__cm={compute:compute};
})();
