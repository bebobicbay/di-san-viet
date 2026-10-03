import type {Metadata} from 'next';

export const metadata:Metadata={
  title:'Hành trình di sản tương tác',
  description:'Bước qua cổng thời gian, khám phá bảy dấu mốc di sản Việt Nam.',
};

type PageProps={searchParams:Promise<{site?:string|string[]}>};

export default async function JourneyPage({searchParams}:PageProps){
  const params=await searchParams;
  const site=Array.isArray(params.site)?params.site[0]:params.site;
  const query=site?`?site=${encodeURIComponent(site)}`:'';
  return <main id="main" style={{width:'100%',height:'100dvh',minHeight:540,overflow:'hidden',background:'#090807'}}>
    <iframe title="Hành trình di sản Việt Nam" src={`/journey.html${query}`} style={{display:'block',width:'100%',height:'100%',border:0}} allow="autoplay" />
  </main>;
}
