import {Suspense} from 'react';
import Explore from '@/components/explore';
export const metadata={title:'Khám phá bản đồ di sản'};
export default function Page(){return <Suspense fallback={<p className="loading-page">Đang mở bản đồ di sản…</p>}><Explore/></Suspense>}
