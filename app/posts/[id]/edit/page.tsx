"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../../lib/supabase";

const categories = [["free", "자유"], ["question", "질문"], ["information", "정보"], ["announcement", "공지"]];

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("free");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, [params.id]);

  async function load() {
    if (!supabase) return;
    const [{ data: s }, { data: p, error: e }] = await Promise.all([
      supabase.auth.getSession(),
      supabase.from("posts").select("title,content,category,author_id").eq("id", params.id).single()
    ]);
    const current = s.session?.user ?? null;
    setSession(current);
    if (e || !p) { setError("게시글을 찾을 수 없습니다."); setLoading(false); return; }
    if (!current || current.id !== p.author_id) { setError("이 게시글을 수정할 권한이 없습니다."); setLoading(false); return; }
    setTitle(p.title ?? ""); setContent(p.content ?? ""); setCategory(p.category ?? "free"); setLoading(false);
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !session || !title.trim() || !content.trim()) return;
    setSaving(true); setError("");
    const { error: updateError } = await supabase.from("posts").update({ title: title.trim(), content: content.trim(), category }).eq("id", params.id).eq("author_id", session.id);
    if (updateError) { setError(updateError.message); setSaving(false); return; }
    router.push(`/posts/${params.id}`);
  }

  return <main className="post-page"><header className="topbar"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-mark">J</span> 잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/posts">게시판</Link><Link href="/profile">프로필</Link><Link href="/notifications">알림</Link></nav></div></header><div className="page-wrap"><button className="ghost back-button" onClick={() => router.back()}>← 돌아가기</button><section className="detail-card edit-card"><span className="eyebrow">EDIT POST</span><h1>게시글 수정</h1>{loading ? <div className="empty">불러오는 중...</div> : error ? <div className="empty">{error}</div> : <form className="profile-form edit-form" onSubmit={save}><label>카테고리<select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(([v, t]) => <option key={v} value={v}>{t}</option>)}</select></label><label>제목<input required value={title} onChange={e => setTitle(e.target.value)} maxLength={120}/></label><label>내용<textarea required value={content} onChange={e => setContent(e.target.value)} rows={12} maxLength={5000}/></label><div className="compose-foot"><span>{error}</span><button className="primary" disabled={saving}>{saving ? "저장 중..." : "수정 완료"}</button></div></form>}</section></div></main>;
}
