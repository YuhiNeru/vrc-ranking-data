export function ensureFreshSnapshot(payload,now=Date.now()){
  const observed=Date.parse(payload.observedAt);
  if(!Number.isFinite(observed))throw new Error('Invalid observation time');
  if(observed>now+5*60*1000)throw new Error('Observation time is in the future');
  if(now-observed>150*60*1000)throw new Error(`Ranking has not updated for over 150 minutes (last observation: ${payload.observedAt}); check VPS collector, VRChat authentication and upload.`);
}
