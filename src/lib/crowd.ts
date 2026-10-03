export function vietnamTime(date=new Date()){const local=new Date(date.getTime()+7*3600000);return {day:(local.getUTCDay()+6)%7,hour:local.getUTCHours(),minute:local.getUTCMinutes()}}
// BestTime's weekly window starts Monday at 06:00, not midnight.
export function calendarDay(week:number[],day:number){if(week.length!==168)throw new Error('Expected 168 hourly values');return Array.from({length:24},(_,h)=>week[(day*24+h-6+168)%168])}
export function openingAtArrival(siteId:string,date:Date):boolean|null{if(siteId!=='van-mieu')return null;const {hour}=vietnamTime(date);return hour>=8&&hour<17}
export function decision(value:number|null,open:boolean|null,metric:'relative'|'occupancy'='relative'){
 if(open===false)return {status:'closed',promote:false,alternatives:true};
 if(value===null)return {status:'unknown',promote:false,alternatives:false};
 if(value<40)return {status:'quiet',promote:true,alternatives:false};
 if(value<70)return {status:'moderate',promote:true,alternatives:false};
 if(value<90)return {status:'busy',promote:false,alternatives:true};
 return {status:metric==='occupancy'?'capacity':'very-busy',promote:false,alternatives:true};
}
