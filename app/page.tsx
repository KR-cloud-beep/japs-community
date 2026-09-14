"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

type User = { id: string; email?: string | null };
type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  author_id?: string;
  author?: { display_name?: string | null; username?: string | null };
};

const demoPosts: Post[] = [
  { id: "demo-1", title: "잽스 커뮤니티에 오신 것을 환영합니다!", content: "여기에서 자유롭게 이야기하고 정보를 나눠보세요. 로그인하면 글을 작성할 수 있습니다.", created_at: new Date().toISOString(), author: { display_name: "잽스 운영팀" } },
  { id: "demo-2", title: "오늘의 자유게시판", content: "궁금한 점이나 공유하고 싶은 이야기를 편하게 남겨주세요.", created_at: new Date(Date.now() - 3600000).toISOString(), author: { display_name: "잽스" } },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(demoPosts);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email } : null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ? { id: session.user.id, email: session.user.email } : null));
    loadPosts();
    setLoading(false);
    return () => data.subscription.unsubscribe();
  }, []);

  async function loadPosts() {
    if (!supabase) return;
    const { data, error } = await supabase.from("posts").select("id,title,content,created_at,author_id").order("created_at", { ascending: false }).limit(30);
    if (!error && data) {
      const ids = [...new Set(data.map((p) => p.author_id).filter(Boolean))];
      let profiles: { id: string; display_name: string | null; username: string | null }[] = [];
      if (ids.length) {
        const result = await supabase.from("profiles").select("id,display_name,username").in("id", ids);
        profiles = result.data ?? [];
      }
      setPosts(data.map((p) => ({ ...p, author: profiles.find((x) => x.id === p.author_id) })));
    }
  }

  async function handleAuth(e: FormEvent) {
    e.preventDefault(); setMessage("");
    if (!supabase) { setMessage("Supabase 환경변수가 아직 설정되지 않았어요."); return; }
    const result = authMode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (result.error) { setMessage(result.error.message); return; }
    setMessage(authMode === "signup" ? "가입 완료! 이메일 인증이 필요할 수 있어요." : "로그인되었습니다.");
    if (authMode === "login") setAuthOpen(false);
  }

  async function handleLogout() { await supabase?.auth.signOut(); }

  async function createPost(e: FormEvent) {
    e.preventDefault();
    if (!supabase || !user || !title.trim() || !content.trim()) return;
    setPosting(true); setMessage("");
    const { error } = await supabase.from("posts").insert({ title: title.trim(), content: content.trim(), author_id: user.id });
    setPosting(false);
    if (error) { setMessage(error.message); return; }
    setTitle(""); setContent(""); setMessage("게시글을 등록했습니다."); await loadPosts();
  }

  const time = (value: string) => new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

  return (
    <main>
      <header className="topbar">
        <div className="nav-inner">
          <a className="brand" href="#"><span className="brand-mark">J</span> 잽스 커뮤니티</a>
          <nav><a href="#home">홈</a><a href="#posts">게시판</a><a href="#about">커뮤니티</a></nav>
          {user ? <div className="account"><span>{user.email}</span><button className="ghost" onClick={handleLogout}>로그아웃</button></div> : <button className="primary small" onClick={() => { setAuthMode("login"); setAuthOpen(true); }}>로그인</button>}
        </div>
      </header>

      <section id="home" className="hero wrap">
        <div><span className="eyebrow">JAPS COMMUNITY</span><h1>편하게 이야기하고<br/><em>함께 만들어가는</em> 커뮤니티.</h1><p>질문하고, 공유하고, 새로운 사람들과 연결되는 잽스 커뮤니티입니다.</p><div className="hero-actions"><a className="primary" href="#posts">게시판 둘러보기 →</a>{!user && <button className="secondary" onClick={() => { setAuthMode("signup"); setAuthOpen(true); }}>회원가입</button>}</div></div>
        <div className="hero-card"><div className="spark">✦</div><strong>오늘도 환영합니다</strong><p>작은 이야기 하나가<br/>좋은 커뮤니티를 만듭니다.</p></div>
      </section>

      <section id="posts" className="wrap content-grid">
        <div className="feed"><div className="section-head"><div><span className="eyebrow">COMMUNITY</span><h2>최신 게시글</h2></div><button className="ghost" onClick={loadPosts}>새로고침 ↻</button></div>
          {loading ? <div className="empty">불러오는 중...</div> : posts.map((post) => <article className="post" key={post.id}><div className="avatar">{(post.author?.display_name || "잽").slice(0,1)}</div><div className="post-body"><div className="post-meta"><strong>{post.author?.display_name || post.author?.username || "익명"}</strong><span>{time(post.created_at)}</span></div><h3>{post.title}</h3><p>{post.content}</p><div className="post-foot"><span>♡ 좋아요</span><span>💬 댓글</span><span>공유</span></div></div></article>)}
          {posts.length === 0 && <div className="empty">아직 게시글이 없습니다.</div>}</div>
        <aside className="side"><div className="panel"><span className="eyebrow">QUICK START</span><h3>커뮤니티 시작하기</h3><p>로그인하면 나만의 게시글을 바로 작성할 수 있어요.</p>{user ? <span className="status">● 로그인됨</span> : <button className="primary full" onClick={() => setAuthOpen(true)}>로그인 / 회원가입</button>}</div><div id="about" className="panel muted"><strong>잽스 커뮤니티</strong><p>서로 존중하는 문화를 만들어요. 개인정보와 비밀번호는 안전하게 관리해주세요.</p></div></aside>
      </section>

      {user && <section className="wrap composer"><span className="eyebrow">WRITE</span><h2>새 글 작성</h2><form onSubmit={createPost}><input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목" maxLength={120}/><textarea value={content} onChange={e => setContent(e.target.value)} placeholder="어떤 이야기를 나누고 싶나요?" rows={5} maxLength={5000}/><div className="compose-foot"><span>{message}</span><button className="primary" disabled={posting}>{posting ? "등록 중..." : "게시글 등록"}</button></div></form></section>}

      {authOpen && <div className="modal-backdrop" onMouseDown={() => setAuthOpen(false)}><div className="modal" onMouseDown={e => e.stopPropagation()}><button className="close" onClick={() => setAuthOpen(false)}>×</button><span className="eyebrow">JAPS</span><h2>{authMode === "login" ? "다시 만나서 반가워요" : "잽스에 가입하기"}</h2><p>{authMode === "login" ? "계정으로 로그인하세요." : "이메일과 비밀번호로 간단하게 시작하세요."}</p><form onSubmit={handleAuth}><input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일"/><input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호 (6자 이상)"/><button className="primary full">{authMode === "login" ? "로그인" : "회원가입"}</button></form>{message && <div className="notice">{message}</div>}<button className="switch" onClick={() => { setAuthMode(authMode === "login" ? "signup" : "login"); setMessage(""); }}>{authMode === "login" ? "처음이신가요? 회원가입" : "이미 계정이 있나요? 로그인"}</button>{!isSupabaseConfigured && <small>배포 전 NEXT_PUBLIC_SUPABASE_URL과 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY를 설정하세요.</small>}</div></div>}
      <footer>© 2026 잽스 커뮤니티 · Built with Next.js & Supabase</footer>
    </main>
  );
}
