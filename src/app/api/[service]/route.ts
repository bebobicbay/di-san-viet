import {NextRequest,NextResponse} from 'next/server';
import {z} from 'zod';
import {monuments} from '@/data/monuments';
import {cached,jsonFetch,rateLimited} from '@/lib/server';
import {bestTime} from '@/lib/besttime';
const query=z.object({site:z.string(),lng:z.coerce.number().min(-180).max(180).optional(),lat:z.coerce.number().min(-90).max(90).optional(),mode:z.enum(['walking','driving','motorbike']).default('walking')});
const empty=(reason='not-configured')=>NextResponse.json({status:'unavailable',reason,data:null},{headers:{'Cache-Control':'no-store'}});
export async function GET(request:NextRequest,{params}:{params:Promise<{service:string}>}){
 const {service}=await params;
 if(!['weather','route','places','crowd'].includes(service))return NextResponse.json({error:'Not found'},{status:404});
 if(rateLimited((request.headers.get('x-forwarded-for')?.split(',')[0]??'local')+':'+service))return NextResponse.json({error:'Too many requests'},{status:429,headers:{'Retry-After':'60'}});
 const parsed=query.safeParse(Object.fromEntries(request.nextUrl.searchParams));if(!parsed.success)return NextResponse.json({error:'Invalid parameters'},{status:400});
 const {site,lat,lng,mode}=parsed.data;const monument=monuments.find(m=>m.id===site);if(!monument)return NextResponse.json({error:'Unknown monument'},{status:404});
 try{
  if(service==='weather'){
   if(!process.env.OPEN_METEO_API_KEY)return empty();
   const data=await cached('weather:'+site,30*60000,async()=>{
    const url=new URL('https://customer-api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:String(monument.coordinates[1]),longitude:String(monument.coordinates[0]),hourly:'temperature_2m,precipitation_probability,uv_index',forecast_days:'2',timezone:'Asia/Bangkok',apikey:process.env.OPEN_METEO_API_KEY!}).toString();const result=await jsonFetch(url);return z.object({hourly:z.object({time:z.array(z.string()),temperature_2m:z.array(z.number().nullable()),precipitation_probability:z.array(z.number().nullable()),uv_index:z.array(z.number().nullable())})}).parse(result);
   });return NextResponse.json({status:'ok',data,source:'Open-Meteo',sourceUrl:'https://open-meteo.com/',fetchedAt:new Date().toISOString()});
  }
  if(service==='route'){
   if(lat===undefined||lng===undefined)return NextResponse.json({error:'Origin required'},{status:400});
   if(mode==='motorbike')return empty('motorbike-provider-required');
   if(!process.env.MAPBOX_SECRET_TOKEN)return empty();
   const url=new URL(`https://api.mapbox.com/directions/v5/mapbox/${mode}/${lng},${lat};${monument.coordinates.join(',')}`);url.search=new URLSearchParams({access_token:process.env.MAPBOX_SECRET_TOKEN,geometries:'geojson',overview:'full'}).toString();
   const result=await jsonFetch(url);const schema=z.object({routes:z.array(z.object({distance:z.number(),duration:z.number(),geometry:z.object({type:z.literal('LineString'),coordinates:z.array(z.tuple([z.number(),z.number()]))})}))});const data=schema.parse(result).routes[0];if(!data)return empty('no-route');return NextResponse.json({status:'ok',data,source:'Mapbox',sourceUrl:'https://www.mapbox.com/about/maps/'},{headers:{'Cache-Control':'no-store'}});
  }
  if(service==='places'){
   if(!process.env.GOOGLE_PLACES_API_KEY||!monument.googlePlaceId)return empty();
   const data=await jsonFetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(monument.googlePlaceId)}?languageCode=vi`,{headers:{'X-Goog-Api-Key':process.env.GOOGLE_PLACES_API_KEY,'X-Goog-FieldMask':'displayName,rating,userRatingCount,reviews,googleMapsUri,attributions'}});return NextResponse.json({status:'ok',data,source:'Google Maps'},{headers:{'Cache-Control':'no-store'}});
  }
  const crowd=await bestTime(site);
  return crowd?NextResponse.json({status:'ok',data:crowd}):empty('verified-venue-required');
 }catch{return NextResponse.json({status:'unavailable',reason:'provider-error',data:null},{status:502,headers:{'Cache-Control':'no-store'}})}
}
