const ID=/^wrld_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const count=n=>Number.isSafeInteger(n)&&n>=0&&n<=10000000;
const date=s=>typeof s==='string'&&Number.isFinite(Date.parse(s));
const json=(data,status=200,headers={})=>Response.json(data,{status,headers:{'cache-control':'no-store','x-content-type-options':'nosniff',...headers}});
export function validateSnapshot(input){
  if(!input||input.demo||input.version!==1||!date(input.hour)||!date(input.observedAt)||!Array.isArray(input.worlds)||input.worlds.length>500||!count(input.candidateCount)||input.candidateCount>500||!count(input.failedCount)||!count(input.eligibleCount))throw new Error('Invalid snapshot');
  if(input.worlds.length>input.eligibleCount||input.eligibleCount>input.candidateCount||input.failedCount>input.eligibleCount)throw new Error('Invalid coverage');
  if(Date.parse(input.hour)%3600000!==0||Date.parse(input.observedAt)<Date.parse(input.hour)||Date.parse(input.observedAt)>Date.now()+300000)throw new Error('Invalid time');
  const ids=new Set();
  const worlds=input.worlds.map(w=>{
    if(!w||!ID.test(w.id)||ids.has(w.id)||typeof w.name!=='string'||w.name.length<1||w.name.length>200||!count(w.total)||!count(w.public)||!count(w.private)||!date(w.observedAt))throw new Error('Invalid world');
    ids.add(w.id);
    if(!Array.isArray(w.history)||w.history.length>49)throw new Error('Invalid history');
    let previous=-1;
    const history=w.history.map(p=>{if(!Array.isArray(p)||p.length!==4||!Number.isSafeInteger(p[0])||p[0]<=previous||p[0]*1000>Date.parse(input.observedAt)+300000||!p.slice(1).every(count))throw new Error('Invalid history point');previous=p[0];return p;});
    const thumbnail=typeof w.thumbnail==='string'&&/^https:\/\/api\.vrchat\.cloud\/api\/1\/(file|image)\/[a-zA-Z0-9_\-/]+$/.test(w.thumbnail)?w.thumbnail:null;
    return {id:w.id,name:w.name,author:typeof w.author==='string'?w.author.slice(0,200):'',platforms:Array.isArray(w.platforms)?w.platforms.filter(p=>['pc','quest','ios'].includes(p)):[],thumbnail,total:w.total,public:w.public,private:w.private,deltaTotal:Number.isSafeInteger(w.deltaTotal)?w.deltaTotal:null,deltaPublic:Number.isSafeInteger(w.deltaPublic)?w.deltaPublic:null,observedAt:w.observedAt,history};
  });
  return {version:1,demo:false,hour:new Date(input.hour).toISOString(),observedAt:new Date(input.observedAt).toISOString(),candidateCount:input.candidateCount,eligibleCount:input.eligibleCount,failedCount:input.failedCount,worlds};
}
