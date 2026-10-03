import 'server-only';
import {z} from 'zod';
import {cached,jsonFetch} from './server';
import {calendarDay,vietnamTime} from './crowd';
const weekSchema=z.object({analysis:z.object({week_raw:z.array(z.number().min(0)).length(168)}),forecast_updated_on:z.string(),epoch_analysis:z.number().optional()});
const liveSchema=z.object({analysis:z.object({venue_live_busyness_available:z.boolean(),venue_live_busyness:z.number().optional()})});
export async function bestTime(site:string){
 const mapping=z.record(z.string(),z.string()).safeParse(JSON.parse(process.env.BESTTIME_VENUES??'{}'));
 const venue=mapping.success?mapping.data[site]:null;
 if(!venue||!process.env.BESTTIME_API_KEY_PUBLIC)return null;
 const forecast=await cached('besttime-week:'+venue,7*86400000,async()=>{const url=new URL('https://besttime.app/api/v1/forecasts/week/raw');url.search=new URLSearchParams({venue_id:venue,api_key_public:process.env.BESTTIME_API_KEY_PUBLIC!}).toString();return weekSchema.parse(await jsonFetch(url))});
 const {day,hour}=vietnamTime();const hours=calendarDay(forecast.analysis.week_raw,day);
 let value=hours[hour],source='Forecast',timestamp=forecast.forecast_updated_on;
 if(process.env.BESTTIME_ENABLE_LIVE==='true'&&process.env.BESTTIME_API_KEY_PRIVATE){try{const live=await cached('besttime-live:'+venue,3600000,async()=>{const url=new URL('https://besttime.app/api/v1/forecasts/live');url.search=new URLSearchParams({venue_id:venue,api_key_private:process.env.BESTTIME_API_KEY_PRIVATE!}).toString();return {result:liveSchema.parse(await jsonFetch(url,{method:'POST'})),timestamp:new Date().toISOString()}});if(live.result.analysis.venue_live_busyness_available&&live.result.analysis.venue_live_busyness!==undefined){value=live.result.analysis.venue_live_busyness;source='Live';timestamp=live.timestamp}}catch{/* Forecast remains usable when live coverage fails. */}}
 return {value,hours,source,timestamp,confidence:null,metric:'relative',sourceUrl:'https://besttime.app/'};
}
