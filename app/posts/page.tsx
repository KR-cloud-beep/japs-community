"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const categories = [
  ["all", "전체"], ["free", "자유"], ["question", "질문"], ["information", "정보"], ["announcement", "공지"],
];

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPosts(); }, [category]);

  async function loadPosts() {
    setLoading(true);
    if (!supabase) { setLoading(false); return; }
    let request = supabase.from("posts").select("id,title,content,created_at,category,author_id").order("created_at", { ascending: false }).limit(100);
    if (category !== "all") request = request.eq("category", category);
    const { data } = await request;
    const rows = data ?? [];
    const ids = [...new Set(rows.map(p => p.author_id).filter(Boolean))];
    const { data: profiles } = ids.length ? await supabase.from("profiles").select("id,display_name,username").in("id", ids) : { data: [] };
    setPosts(rows.map(p => ({ ...p, author: profiles?.find(x => x.id === p.author_id) })));
    setLoading(false);
  }

  const filtered = posts.filter(p => !query.trim() || `${p.title} ${p.content}`.toLowerCase().includes(query.trim().toLowerCase()));
  const label = (value: string) => categories.find(c => c[0] === value)?.[1] ?? "자유";

  return <main className="post-page"><header className="topbar"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-mark">J</span> 잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/posts">게시판</Link><Link href="/profile">프로필</Link><Link href="/notifications">알림</Link></nav></div></header>
    <div className="page-wrap"><div className="section-head"><div><span className="eyebrow">COMMUNITY BOARD</span><h1>게시판</h1></div><Link className="primary" href="/#posts">글쓰기</Link></div>
      <div className="board-tools"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="제목이나 내용을 검색하세요" /> <button className="secondary" onClick={loadPosts}>새로고침 ↻</button></div>
      <div className="category-tabs">{categories.map(([value, text]) => <button key={value} className={category === value ? "primary" : "secondary"} onClick={() => setCategory(value)}>{text}</button>)}</div>
      {loading ? <div className="empty">게시글을 불러오는 중...</div> : filtered.length ? <div className="board-list">{filtered.map(post => <Link className="board-row" href={`/posts/${post.id}`} key={post.id}><div><span className="category-badge">{label(post.category)}</span><h3>{post.title}</h3><p>{post.content.slice(0, 100)}</p></div><div className="board-meta"><strong>{post.author?.display_name || post.author?.username || "익명"}</strong><span>{new Date(post.created_at).toLocaleDateString("ko-KR")}</span></div></Link>)}</div> : <div className="empty">조건에 맞는 게시글이 없습니다.</div>}
    </div></main>;
}
