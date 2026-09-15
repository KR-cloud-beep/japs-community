"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default function CommunityHub() {
  const [stats, setStats] = useState({ posts: 0, comments: 0, users: 0 });
  useEffect(() => {
    if (!supabase) return;
    Promise.all([
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("comments").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
    ]).then(([p, c, u]) => setStats({ posts: p.count ?? 0, comments: c.count ?? 0, users: u.count ?? 0 }));
  }, []);
  const items = [
    ["🆕", "최신 게시글", "방금 올라온 이야기를 확인해요.", "/posts"],
    ["🔥", "인기 게시글", "좋아요가 많은 글을 모아봤어요.", "/posts/popular"],
    ["🔖", "내 북마크", "나중에 읽을 글을 저장해요.", "/bookmarks"],
    ["👤", "내 프로필", "프로필과 활동을 관리해요.", "/profile"],
    ["🔔", "알림센터", "좋아요, 댓글, 팔로우 소식을 확인해요.", "/notifications"],
  ];
  return <main><header className="topbar"><div className="nav-inner"><Link className="brand" href="/"><span className="brand-mark">J</span> 잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/posts">게시판</Link><Link href="/japs">JAPS 공식 홈페이지</Link></nav></div></header><div className="page-wrap"><section className="hero" style={{paddingTop:40}}><div><span className="eyebrow">JAPS COMMUNITY HUB</span><h1>커뮤니티의 모든 기능을<br/><em>한 곳에서.</em></h1><p>최신 글부터 인기 콘텐츠, 북마크와 내 활동까지 빠르게 이동하세요.</p></div></section><section className="content-grid"><div className="feed"><div className="section-head"><div><span className="eyebrow">EXPLORE</span><h2>빠른 메뉴</h2></div></div><div className="feature-grid">{items.map(([icon,title,text,href]) => <Link key={href} href={href} className="panel"><div style={{fontSize:28}}>{icon}</div><h3>{title}</h3><p>{text}</p><strong>바로가기 →</strong></Link>)}</div></div><aside className="side"><div className="panel"><span className="eyebrow">LIVE STATS</span><h3>잽스 현황</h3><p>게시글 <strong>{stats.posts}</strong></p><p>댓글 <strong>{stats.comments}</strong></p><p>가입 사용자 <strong>{stats.users}</strong></p></div><div className="panel muted"><strong>JAPS 공식 홈페이지</strong><p>잽스의 서비스 소개와 공지, 방향을 확인하세요.</p><Link className="primary full" href="/japs">공식 홈페이지 →</Link></div></aside></section></div></main>;
}
