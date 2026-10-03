import type {Metadata} from 'next';
import '@fontsource/be-vietnam-pro/vietnamese-400.css';
import '@fontsource/be-vietnam-pro/latin-400.css';
import '@fontsource/be-vietnam-pro/vietnamese-500.css';
import '@fontsource/be-vietnam-pro/latin-500.css';
import '@fontsource/cormorant-garamond/vietnamese-400.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/vietnamese-500.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import './globals.css';
import {Providers} from '@/components/providers';
export const metadata:Metadata={metadataBase:new URL(process.env.SITE_URL??'http://localhost:3000'),title:{default:'DI SẢN VIỆT — Chạm vào chiều sâu lịch sử',template:'%s | DI SẢN VIỆT'},description:'Hành trình khám phá di tích lịch sử Việt Nam. Tìm điểm đến, khám phá kiến trúc và lên kế hoạch tham quan có trách nhiệm.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><a className="skip-link" href="#main">Đến nội dung chính</a><Providers>{children}</Providers></body></html>}

