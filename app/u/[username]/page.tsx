'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Profile = { id: string; username: string | null; display_name: string | null; bio: string | null; avatar_url: string | null }
type Post = { id: string; title: string; content: string; category: string; created_at: string }

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>()
  const username = decodeURIComponent(params.username)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [followers, setFollowers] = useState(0)
  const [following, setFollowing] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [me, setMe] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const [{ data: p }, { data: sessionData }] = await Promise.all([
        supabase.from('profiles').select('id,username,display_name,bio,avatar_url').eq('username', username).maybeSingle(),
        supabase.auth.getSession(),
      ])
      setProfile(p)
      const userId = sessionData.session?.user.id ?? null
      setMe(userId)
      if (!p) { setLoading(false); return }

      const [{ data: ps }, { count: followerCount }, { count: followingCount }] = await Promise.all([
        supabase.from('posts').select('id,title,content,category,created_at').eq('author_id', p.id).order('created_at', { ascending: false }).limit(20),
        supabase.from('follows').select('follower_id', { count: 'exact', head: true }).eq('following_id', p.id),
        supabase.from('follows').select('following_id', { count: 'exact', head: true }).eq('follower_id', p.id),
      ])
      setPosts(ps ?? [])
      setFollowers(followerCount ?? 0)
      setFollowing(followingCount ?? 0)
      if (userId && userId !== p.id) {
        const { data: relation } = await supabase.from('follows').select('follower_id').eq('follower_id', userId).eq('following_id', p.id).maybeSingle()
        setIsFollowing(Boolean(relation))
      }
      setLoading(false)
    }
    load()
  }, [username])

  const toggleFollow = async () => {
    if (!me || !profile || me === profile.id || busy) return
    setBusy(true)
    if (isFollowing) {
      await supabase.from('follows').delete().eq('follower_id', me).eq('following_id', profile.id)
      setIsFollowing(false); setFollowers((n) => Math.max(0, n - 1))
    } else {
      const { error } = await supabase.from('follows').insert({ follower_id: me, following_id: profile.id })
      if (!error) { setIsFollowing(true); setFollowers((n) => n + 1) }
    }
    setBusy(false)
  }

  if (loading) return <main className="page-shell"><div className="card">프로필을 불러오는 중...</div></main>
  if (!profile) return <main className="page-shell"><div className="card"><h1>프로필을 찾을 수 없어요.</h1><Link href="/posts" className="button primary">게시판으로</Link></div></main>

  return <main className="page-shell">
    <header className="topbar"><Link href="/" className="brand">잽스 커뮤니티</Link><nav><Link href="/">홈</Link><Link href="/posts">게시판</Link>{me && <><Link href="/profile">내 프로필</Link><Link href="/notifications">알림</Link></>}</nav></header>
    <section className="profile-hero card">
      <div className="avatar">{(profile.display_name || profile.username || '?').slice(0, 1).toUpperCase()}</div>
      <div className="profile-main"><h1>{profile.display_name || profile.username}</h1><p className="muted">@{profile.username}</p>{profile.bio && <p>{profile.bio}</p>}<div className="profile-stats"><span><b>{followers}</b> 팔로워</span><span><b>{following}</b> 팔로잉</span><span><b>{posts.length}</b> 게시글</span></div></div>
      {me && me !== profile.id && <button className={`button ${isFollowing ? '' : 'primary'}`} onClick={toggleFollow} disabled={busy}>{busy ? '처리 중...' : isFollowing ? '팔로잉' : '팔로우'}</button>}
    </section>
    <section className="card"><div className="section-heading"><h2>{profile.display_name || profile.username}님의 게시글</h2><span className="muted">최근 20개</span></div>{posts.length === 0 ? <p className="muted">아직 작성한 게시글이 없습니다.</p> : <div className="post-list">{posts.map((post) => <Link href={`/posts/${post.id}`} className="post-row" key={post.id}><span className="category">{post.category}</span><div><h3>{post.title}</h3><p>{post.content.slice(0, 100)}{post.content.length > 100 ? '…' : ''}</p></div><time>{new Date(post.created_at).toLocaleDateString('ko-KR')}</time></Link>)}</div>}</section>
    <footer className="footer"><span>© 2026 잽스 커뮤니티</span><Link href="/">홈으로</Link></footer>
  </main>
}
