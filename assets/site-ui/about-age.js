export function ageForYear(birthYear,year){
  if(!Number.isInteger(birthYear)||birthYear<1||!Number.isInteger(year)||year<birthYear)throw new Error('出生年与当前年无效');
  return year-birthYear;
}
export function createAgeController({window,document,now=()=>new Date()}){
  const maxTimeout=2147483647;let timer=null,started=false;
  const clear=()=>{if(timer!==null){window.clearTimeout(timer);timer=null;}};
  const update=()=>{
    clear();const date=now(),nodes=[...document.querySelectorAll('[data-current-age]')].filter(node=>node.isConnected);
    for(const node of nodes){const birthYear=Number(node.dataset.birthYear);node.textContent=(node.dataset.ageFormat||'{age}').replace('{age}',String(ageForYear(birthYear,date.getFullYear())));}
    if(!started||document.visibilityState==='hidden'||!nodes.length)return;
    const untilNewYear=new Date(date.getFullYear()+1,0,1).getTime()-date.getTime()+25;
    timer=window.setTimeout(()=>{timer=null;update();},Math.min(maxTimeout,Math.max(1000,untilNewYear)));
  };
  const visibility=()=>{if(document.visibilityState==='hidden')clear();else update();};
  const events=[[document,'astro:page-load',update],[window,'pageshow',update],[document,'visibilitychange',visibility],[window,'pagehide',clear]];
  const ready=()=>update();
  return {
    update,
    start(){if(started)return;started=true;for(const [host,name,fn]of events)host.addEventListener(name,fn);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else update();},
    stop(){clear();started=false;for(const [host,name,fn]of events)host.removeEventListener(name,fn);document.removeEventListener('DOMContentLoaded',ready);}
  };
}
if(typeof window!=='undefined'&&typeof document!=='undefined'){
  window.SiteAge ||= createAgeController({window,document});window.SiteAge.start();
}
