const posts = [
  { title: '요즘 학교생활이 너무 힘들어요', text: '친구 관계 때문에 계속 신경 쓰이고 하루 종일 생각나요. 어떻게 하면 좋을까요?', author: '익명의 잽스', likes: 24, comments: 8 },
  { title: '내가 잘하고 있는 건지 모르겠어요', text: '열심히 하고 있는데도 자꾸 부족한 것 같아서 불안합니다.', author: '마음이 복잡해', likes: 18, comments: 5 },
  { title: '친구에게 먼저 사과해야 할까요?', text: '사소한 일로 다퉜는데 먼저 연락할지 고민돼요.', author: '고민중', likes: 12, comments: 11 },
]

export default function Home() {
  return (
    <main>
      <header className="header">
        <div className="header-inner">
          <a className="logo" href="/">잽스<span>커뮤니티</span></a>
          <nav><a href="/">홈</a><a href="#popular">인기</a><a href="#recent">최신</a></nav>
          <div className="actions"><button className="login">로그인</button><button className="signup">회원가입</button></div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div>
            <p className="eyebrow">JAPS COMMUNITY</p>
            <h1>혼자 고민하지 말고,<br/><strong>함께 이야기해요.</strong></h1>
            <p className="hero-text">사소한 고민부터 마음속 깊은 이야기까지.<br/>잽스 커뮤니티에서 편하게 이야기해보세요.</p>
            <button className="write">✎ 고민 작성하기</button>
          </div>
          <div className="hero-card"><div className="bubble">💬</div><b>당신의 이야기를<br/>기다리고 있어요.</b><span>익명으로도 편하게 작성할 수 있어요.</span></div>
        </div>
      </section>

      <section className="content" id="recent">
        <div className="section-head"><div><p className="eyebrow">COMMUNITY</p><h2>오늘의 고민</h2></div><button className="more">전체 보기 →</button></div>
        <div className="tabs"><button className="active">최신</button><button id="popular">인기</button></div>
        <div className="post-list">
          {posts.map((post, i) => <article className="post" key={i}><div className="post-top"><span className="avatar">{['🌱','🌙','☁️'][i]}</span><span>{post.author}</span><time>방금 전</time></div><h3>{post.title}</h3><p>{post.text}</p><div className="meta"><span>♡ {post.likes}</span><span>💬 {post.comments}</span><span className="tag">#고민</span></div></article>)}
        </div>
      </section>

      <footer><div className="logo">잽스<span>커뮤니티</span></div><p>당신의 이야기가 누군가에게 힘이 될 수 있어요.</p></footer>
    </main>
  )
}
