"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

export default function PopularPosts() {
  const [posts, setPosts] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { load(); }, []);
  async function load() { if (!supabase) { setLoading(false); return; } const { data } = await supabase.from("posts").select("id,title,content,created_at,category").order("created_at", { ascending: false }).limit(100); const rows = data ?? []; const ids = rows.map(p => p.id); const { data: likes } = ids.length ? await supabase.from("likes").select("post_id") .in("post_id", ids) : { data: [] as any[] }; const counts = new Map<string, number>(); (likes ?? []).forEach(x => counts.set(x.post_id, (counts.get(x.post_id) ?? 0) + 1)); setPosts(rows.sort((a,b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0)).slice(0,30).map(p => ({...p, likeCount: counts.get(p.id) ?? 0}))); setLoading(false); }
  return <main><header className="topbar"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-mark">J</span> 잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/posts">최신</Link><Link href="/posts/popular">인기</Link><Link href="/community">커뮤니티</Link><Link href="/japs">공식 홈페이지</Link></nav></div></header><div className="page-wrap"><div className="section-head"><div><span className="eyebrow">TRENDING</span><h1>🔥 인기 게시글</h1></div><Link className="ghost" href="/posts">최신 글 →</Link></div>{loading ? <div className="empty">불러오는 중...</div> : posts.length ? <div className="board-list">{posts.map((p,i)=><article className="board-row" key={p.id}><div><span className="category-badge">TOP {i+1}</span><Link href={`/posts/${p.id}`}><h3>{p.title}</h3></Link><p>{p.content.slice(0,160)}</p><small>{new Date(p.created_at).toLocaleString("ko-KR")}</small></div><strong>♥ {p.likeCount}</strong></article>)}</div> : <div className="empty">아직 게시글이 없습니다.</div>}</div></main>;
}
