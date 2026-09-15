"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function BookmarksPage() {
  const [items, setItems] = useState<any[]>([]); const [message, setMessage] = useState("");
  useEffect(() => { load(); }, []);
  async function load() { if (!supabase) return; const { data: s } = await supabase.auth.getSession(); if (!s.session) { setMessage("북마크를 보려면 로그인해주세요."); return; } const { data } = await supabase.from("bookmarks").select("post_id,created_at").eq("user_id", s.session.user.id).order("created_at", { ascending:false }); const ids = (data ?? []).map(x=>x.post_id); if (!ids.length) { setItems([]); return; } const { data: posts } = await supabase.from("posts").select("id,title,content,created_at,category").in("id", ids); setItems(ids.map(id => posts?.find(p=>p.id===id)).filter(Boolean)); }
  async function remove(id:string) { if (!supabase) return; const { data:s }=await supabase.auth.getSession(); if(!s.session)return; await supabase.from("bookmarks").delete().eq("user_id",s.session.user.id).eq("post_id",id); load(); }
  return <main><header className="topbar"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-mark">J</span> 잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/posts">게시판</Link><Link href="/community">커뮤니티</Link><Link href="/japs">공식 홈페이지</Link></nav></div></header><div className="page-wrap"><div className="section-head"><div><span className="eyebrow">SAVED</span><h1>🔖 내 북마크</h1></div></div>{message ? <div className="empty">{message}<br/><Link className="primary" href="/">로그인하러 가기</Link></div> : items.length ? <div className="board-list">{items.map(p=><article className="board-row" key={p.id}><div><span className="category-badge">{p.category || "게시글"}</span><Link href={`/posts/${p.id}`}><h3>{p.title}</h3></Link><p>{p.content.slice(0,180)}</p></div><button className="ghost" onClick={()=>remove(p.id)}>저장 취소</button></article>)}</div> : <div className="empty">저장한 게시글이 없습니다.<br/><Link className="ghost" href="/posts">게시판 둘러보기 →</Link></div>}</div></main>;
}
