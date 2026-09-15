import Link from "next/link";
import styles from "./page.module.css";

const features = [
  { icon: "💬", title: "자유로운 소통", text: "일상부터 궁금한 이야기까지 부담 없이 나눠보세요." },
  { icon: "🔥", title: "인기 콘텐츠", text: "좋아요가 많은 이야기를 빠르게 발견할 수 있습니다." },
  { icon: "🔖", title: "나만의 저장", text: "다시 보고 싶은 게시글을 북마크로 모아보세요." },
  { icon: "👥", title: "팔로우와 연결", text: "관심 있는 이용자를 팔로우하고 새로운 이야기를 만나세요." },
  { icon: "🔔", title: "실시간 알림", text: "좋아요, 댓글, 팔로우 등 중요한 소식을 확인하세요." },
  { icon: "🛡️", title: "안전한 운영", text: "신고와 관리자 시스템, 데이터 보안 정책으로 공간을 지킵니다." },
  { icon: "👤", title: "익명 참여", text: "게스트 모드로 개인정보 없이 커뮤니티에 참여할 수 있습니다." },
  { icon: "📱", title: "어디서나 이용", text: "PC와 모바일 화면에 맞춰 편하게 사용할 수 있습니다." },
];

export default function JapsHome() {
  return <main className={styles.home}>
    <header className={styles.nav}><Link className={styles.logo} href="/japs"><span>J</span> JAPS</Link><nav><a href="#about">잽스 소개</a><a href="#features">서비스</a><Link href="/news">새소식</Link><a href="#vision">방향</a><Link href="/terms">약관</Link></nav><Link className="primary small" href="/">커뮤니티 바로가기 →</Link></header>
    <section className={styles.hero}><div className={styles.heroInner}><span className="eyebrow">JAPS · OFFICIAL</span><h1>사람과 이야기를<br /><em>연결하는 공간.</em></h1><p>잽스는 사람들이 편하게 소통하고, 정보를 나누며, 함께 새로운 문화를 만들어가는 커뮤니티 서비스입니다.</p><div className="hero-actions"><Link className="primary" href="/">잽스 커뮤니티 시작하기 →</Link><Link className="secondary" href="/community">커뮤니티 기능 보기</Link></div></div><div className={styles.orbit} aria-hidden="true"><div className={`${styles.ring} ${styles.ringOne}`} /><div className={`${styles.ring} ${styles.ringTwo}`} /><div className={styles.core}>J</div><span className={`${styles.dot} ${styles.dotOne}`}>✦</span><span className={`${styles.dot} ${styles.dotTwo}`}>•</span><span className={`${styles.dot} ${styles.dotThree}`}>✦</span></div></section>
    <section id="about" className={styles.section}><div><span className="eyebrow">ABOUT JAPS</span><h2>잽스는 무엇인가요?</h2></div><div className={styles.aboutCopy}><p>잽스는 누구나 편하게 자신의 생각을 이야기하고 다른 사람의 이야기를 발견할 수 있는 온라인 커뮤니티를 만들기 위해 시작되었습니다.</p><p>작게 시작하더라도 이용자와 함께 성장하며 오래 사용할 수 있는 공간을 만드는 것이 목표입니다.</p></div></section>
    <section id="features" className={styles.section}><div className={styles.sectionHead}><span className="eyebrow">WHAT WE DO</span><h2>잽스에서 할 수 있는 것</h2></div><div className={styles.featureGrid}>{features.map(feature => <article className={styles.feature} key={feature.title}><div className={styles.icon}>{feature.icon}</div><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div></section>
    <section className={styles.section}><div><span className="eyebrow">EXPLORE</span><h2>잽스를 직접 만나보세요.</h2></div><div className={styles.aboutCopy}><p>최신 게시글을 둘러보고 인기 글을 찾거나, 계정을 만들고 직접 이야기를 시작할 수 있습니다.</p><div className="hero-actions"><Link className="primary" href="/posts">게시판 둘러보기</Link><Link className="secondary" href="/posts/popular">🔥 인기 게시글</Link><Link className="secondary" href="/news">📢 새소식</Link><Link className="secondary" href="/community">커뮤니티 허브</Link></div></div></section>
    <section id="vision" className={styles.vision}><div className={styles.visionInner}><span className="eyebrow">OUR DIRECTION</span><h2>작게 시작하고,<br /><em>함께 크게 만들어갑니다.</em></h2><p>잽스는 단순히 게시글을 올리는 사이트가 아니라, 사람들이 다시 찾아오고 싶어지는 커뮤니티를 목표로 합니다.</p><Link className="primary" href="/">커뮤니티로 이동 →</Link></div></section>
    <footer className={styles.footer}><strong><span>J</span> JAPS</strong><p>사람과 이야기를 연결하는 공간.</p><div><Link href="/">잽스 커뮤니티</Link> · <Link href="/news">새소식</Link> · <Link href="/terms">이용약관</Link> · <Link href="/privacy">개인정보처리방침</Link></div></footer>
  </main>;
}
