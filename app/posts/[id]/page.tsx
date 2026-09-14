"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

export default function PostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => { load(); }, [params.id]);
  async function load() {
    if (!supabase) return;
    const [{ data: p }, { data: c }, { data: s }] = await Promise.all([
      supabase.from("posts").select("id,title,content,created_at,author_id").eq("id", params.id).single(),
      supabase.from("comments").select("id,content,created_at,author_id").eq("post_id", params.id).order("created_at", { ascending: true }),
      supabase.auth.getSession(),
    ]);
    setSession(s.session?.user ?? null); setPost(p); setComments(c ?? []);
    const { data: ls } = await supabase.from("likes").select("user_id").eq("post_id", params.id);
    setLikes(ls?.length ?? 0); setLiked(Boolean(s.session?.user && ls?.some(x => x.user_id === s.session.user.id)));
  }
  async function toggleLike() {
    if (!supabase || !session) { setError("좋아요를 누르려면 로그인해주세요."); return; }
    if (liked) await supabase.from("likes").delete().eq("post_id", params.id).eq("user_id", session.id);
    else await supabase.from("likes").insert({ post_id: params.id, user_id: session.id });
    setLiked(!liked); setLikes(v => v + (liked ? -1 : 1));
  }
  async function addComment(e: FormEvent) {
    e.preventDefault(); if (!supabase || !session || !comment.trim()) return;
    const { error: insertError } = await supabase.from("comments").insert({ post_id: params.id, author_id: session.id, content: comment.trim() });
    if (insertError) { setError(insertError.message); return; }
    setComment(""); load();
  }
  if (!post) return <main className="post-page"><div className="page-wrap">게시글을 불러오는 중...</div></main>;
  return <main className="post-page"><header className="topbar"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-mark">J</span> 잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/profile">프로필</Link><Link href="/notifications">알림</Link></nav></div></header><div className="page-wrap"><button className="ghost" onClick={() => router.back()}>← 돌아가기</button><article className="detail-card"><div className="eyebrow">POST</div><h1>{post.title}</h1><div className="detail-meta">{new Date(post.created_at).toLocaleString("ko-KR")}</div><p className="detail-content">{post.content}</p><div className="detail-actions"><button className={liked ? "primary" : "secondary"} onClick={toggleLike}>♥ 좋아요 {likes}</button><span>💬 댓글 {comments.length}</span></div></article><section className="comments"><h2>댓글</h2>{comments.map(c => <div className="comment" key={c.id}><div className="avatar">J</div><div><strong>커뮤니티 사용자</strong><span>{new Date(c.created_at).toLocaleString("ko-KR")}</span><p>{c.content}</p></div></div>)}{session ? <form onSubmit={addComment} className="comment-form"><textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="댓글을 남겨주세요." rows={3}/><button className="primary">댓글 작성</button></form> : <p className="empty">댓글을 작성하려면 홈에서 로그인해주세요.</p>}{error && <p className="notice">{error}</p>}</section></div></main>;
}
