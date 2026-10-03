export const CROWD_THRESHOLDS = {quiet:40, moderate:70, busy:90};
export const WEIGHTS = {importance:.30,crowd:.25,proximity:.20,open:.15,weather:.10};
export type CrowdStatus = 'unknown'|'quiet'|'moderate'|'busy'|'capacity';
export function crowdStatus(value:number|null):CrowdStatus {
  if(value===null || !Number.isFinite(value)) return 'unknown';
  return value<40?'quiet':value<70?'moderate':value<90?'busy':'capacity';
}
export type Signals = {importance:number|null; crowd:number|null; minutes:number|null; open:boolean|null; weather:number|null; unesco?:boolean};
export function recommendationScore(s:Signals) {
  const entries:[number|null,number][] = [[s.importance===null?null:s.importance/5,WEIGHTS.importance],[s.crowd===null?null:1-s.crowd/100,WEIGHTS.crowd],[s.minutes===null?null:Math.max(0,1-s.minutes/120),WEIGHTS.proximity],[s.open===null?null:Number(s.open),WEIGHTS.open],[s.weather,WEIGHTS.weather]];
  const known=entries.filter((x):x is [number,number]=>x[0]!==null);
  if(!known.length) return {score:null,coverage:0};
  const coverage=known.reduce((a,[,w])=>a+w,0);
  const score=known.reduce((a,[v,w])=>a+Math.min(1,Math.max(0,v))*w,0)/coverage+(s.unesco?.03:0);
  return {score:s.open===false?score*.1:s.crowd!==null&&s.crowd>=90?score*.6:score,coverage};
}
export function distanceKm(a:[number,number],b:[number,number]) { const r=Math.PI/180; const dlat=(b[1]-a[1])*r,dlon=(b[0]-a[0])*r; const h=Math.sin(dlat/2)**2+Math.cos(a[1]*r)*Math.cos(b[1]*r)*Math.sin(dlon/2)**2; return 6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h)); }
export function estimateCrowd(curve:number[]|null,hour:number,dayFactor:number,holidayFactor:number,weatherFactor:number,capacity:number|null) {
  if(!curve || curve.length!==24 || !capacity || hour<0 || hour>23) return null;
  return {value:Math.round(Math.max(0,Math.min(100,curve[hour]*dayFactor*holidayFactor*weatherFactor))),source:'Estimate' as const,confidence:'low' as const, timestamp:new Date().toISOString()};
}
