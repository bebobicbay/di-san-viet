import {monuments} from '@/data/monuments';
import type {MetadataRoute} from 'next';
export default function sitemap():MetadataRoute.Sitemap{const base=process.env.SITE_URL??'http://localhost:3000';return ['','/journey','/explore','/credits',...monuments.map(m=>'/monuments/'+m.slug)].map(path=>({url:base+path,changeFrequency:'monthly',priority:path===''?1:.7}))}
