import 'server-only';
const buckets=new Map<string,{count:number;until:number}>();
export function rateLimited(key:string){const now=Date.now();if(buckets.size>10000)for(const [k,v]of buckets)if(v.until<now)buckets.delete(k);const b=buckets.get(key);if(!b||b.until<now){buckets.set(key,{count:1,until:now+60000});return false}b.count++;return b.count>30}
const cache=new Map<string,{data:unknown;expires:number}>();
export async function cached<T>(key:string,ttl:number,loader:()=>Promise<T>):Promise<T>{const hit=cache.get(key);if(hit&&hit.expires>Date.now())return hit.data as T;const data=await loader();if(cache.size>500)cache.delete(cache.keys().next().value!);cache.set(key,{data,expires:Date.now()+ttl});return data}
export async function jsonFetch(url:string|URL,init?:RequestInit){const r=await fetch(url,{...init,signal:AbortSignal.timeout(10000),cache:'no-store'});if(!r.ok)throw new Error('Upstream unavailable');return r.json()}

