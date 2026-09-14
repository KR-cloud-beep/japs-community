"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  useEffect(() => { load(); }, []);
  async function load() { if (!supabase) return; const { data: s } = await supabase.auth.getSession(); if (!s.session) return; setUser(s.session.user); const { data } = await supabase.from("notifications").select("id,type,created_at,read_at,post_id").eq("user_id", s.session.user.id).order("created_at", { ascending: false }).limit(50); setItems(data ?? []); }
  async function readAll() { if (!supabase || !user) return; await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("user_id", user.id).is("read_at", null); load(); }
  return <main><header className="topbar"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-mark">J</span> 잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/profile">프로필</Link></nav></div></header><div className="page-wrap"><div className="section-head"><div><span className="eyebrow">NOTIFICATIONS</span><h1>알림</h1></div><button className="ghost" onClick={readAll}>모두 읽음</button></div>{!user ? <div className="empty">로그인하면 알림을 확인할 수 있습니다.</div> : items.length === 0 ? <div className="empty">새로운 알림이 없습니다.</div> : <div className="notification-list">{items.map(n => <div className={n.read_at ? "notification read" : "notification"} key={n.id}><div className="notification-dot">●</div><div><strong>{n.type === "like" ? "게시글에 좋아요가 추가되었습니다." : n.type === "comment" ? "게시글에 새 댓글이 달렸습니다." : n.type === "follow" ? "새로운 팔로워가 생겼습니다." : "새로운 알림이 있습니다."}</strong><p>{new Date(n.created_at).toLocaleString("ko-KR")}</p>{n.post_id && <Link href={`/posts/${n.post_id}`}>게시글 보기 →</Link>}</div></div>)}</div>}</div></main>;
}
