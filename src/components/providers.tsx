'use client';
import {createContext,useContext,useEffect,useState, type ReactNode} from 'react';
export type Lang='vi'|'en';
const Context=createContext({lang:'vi' as Lang,setLang:(_l:Lang)=>{},t:(vi:string,_en:string)=>vi});
export function Providers({children}:{children:ReactNode}){const [lang,setLang]=useState<Lang>('vi');useEffect(()=>{const l=localStorage.getItem('heritage-language');if(l==='en')setLang('en')},[]);useEffect(()=>{document.documentElement.lang=lang;localStorage.setItem('heritage-language',lang)},[lang]);return <Context.Provider value={{lang,setLang,t:(vi,en)=>lang==='vi'?vi:en}}>{children}</Context.Provider>}
export const useLanguage=()=>useContext(Context);
