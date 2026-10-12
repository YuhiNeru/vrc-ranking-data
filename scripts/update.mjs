import {readFile,writeFile} from 'node:fs/promises';
import {validateSnapshot} from './validate.mjs';
const source='https://vrc-ranking-board.vrc-ranking-board.workers.dev/api/latest';
const response=await fetch(source,{signal:AbortSignal.timeout(30000)});
if(!response.ok)throw new Error(`Source unavailable (${response.status}); previous data retained`);
const text=await response.text();
if(Buffer.byteLength(text)>3*1024*1024)throw new Error('Snapshot too large');
const payload=validateSnapshot(JSON.parse(text));
let old;
try{old=JSON.parse(await readFile('latest.json','utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
if(old&&Date.parse(old.observedAt)>=Date.parse(payload.observedAt)){
  console.log('No newer observation; files unchanged.');
}else{
const byTotal=[...payload.worlds].sort((a,b)=>b.total-a.total||b.public-a.public||a.id.localeCompare(b.id));
const byPublic=[...payload.worlds].sort((a,b)=>b.public-a.public||b.total-a.total||a.id.localeCompare(b.id));
const publicRanks=new Map(byPublic.map((world,index)=>[world.id,index+1]));
const cell=(value,text=false)=>{
  let string=value==null?'':String(value);
  if(text&&/^[\s]*[=+@-]/.test(string))string="'"+string;
  return '"'+string.replaceAll('"','""')+'"';
};
const header=['rank_total','rank_public','id','name','author','platforms','total','public','private','delta_total','delta_public','observed_at'];
const rows=byTotal.map((world,index)=>[index+1,publicRanks.get(world.id),world.id,world.name,world.author,world.platforms.join('|'),world.total,world.public,world.private,world.deltaTotal,world.deltaPublic,world.observedAt].map((value,column)=>cell(value,[2,3,4,5,11].includes(column))).join(','));
await writeFile('latest.json',JSON.stringify(payload,null,2)+'\n');
await writeFile('latest.csv','\ufeff'+[header.join(','),...rows].join('\r\n')+'\r\n');
console.log(`Saved ${payload.worlds.length} worlds observed at ${payload.observedAt}.`);
}
