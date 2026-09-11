import dynamic from 'next/dynamic';

// 핵심: ssr:false → 이 컴포넌트는 서버에서 절대 렌더링되지 않음
// → 서버가 만든 HTML에는 이 부분의 스타일이 존재하지 않음
const HeavyStyledWidget = dynamic(() => import('./HeavyStyledWidget'), {
  ssr: false,
  loading: () => <div style={{ padding: 40 }}>로딩 중...</div>,
});

export default function FoucDemoPage() {
  return (
    <main style={{ padding: 32, maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>FOUC 재현 데모</h1>
      <p style={{ fontSize: 13, color: '#6B7280' }}>
        새로고침 후 아래 박스가 스타일 없이(검정 텍스트) 잠깐 보였다가
        파란 박스로 바뀌는지 확인하세요. 개발자도구 → Network →
        Slow 3G로 조절하면 더 뚜렷하게 보입니다.
      </p>
      <HeavyStyledWidget />
    </main>
  );
}