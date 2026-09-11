'use client';

import React, { useState } from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

export default function EmotionRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css' }); //Emotion이 CSS를 만들 때 쓰는 "작업 공간(캐시)"을 하나 새로 만들어요. 요청(request)마다 컴포넌트가 새로 마운트되니 useState로 감싸서 이 캐시 인스턴스가 리렌더링돼도 유지되게 합니다.
    cache.compat = true;//Emotion의 구버전 호환 모드예요. css prop, <Global> 등을 쓸 때 필요한 옵션입니다. (지금 코드에서 <Global>을 쓰고 계시니 필요해요.)
    return cache;
  });


  //이게 핵심이에요. Next.js가 제공하는 훅으로, 서버가 스트리밍으로 HTML을 보내는 도중, 지금까지 이 캐시에 쌓인 CSS를 <style> 태그로 정확한 타이밍에 <head>에 끼워 넣어줍니다. 이걸 안 쓰면 Emotion이 자기 방식대로(구식 Pages Router 방식으로) DOM을 직접 건드리려다가 서버/클라이언트 결과물이 어긋나요 — 지금까지 겪으신 hydration 에러가 바로 이거예요.
  useServerInsertedHTML(() => {
    const inserted = Object.keys(cache.inserted).join(' '); //chche.inserted : Emotion이 지금까지 생성한 모든 CSS 클래스/글로벌 스타일이 { 해시키: css텍스트 } 형태로 저장되는 객체예요. 이걸 그대로 <style> 태그 내용으로 출력합니다.
    return (
      <style
        data-emotion={`${cache.key} ${inserted}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;//자식 트리(즉 UIProvider와 그 안의 <Global>)가 이 특정 캐시 인스턴스를 쓰도록 강제합니다. 이게 없으면 Emotion은 전역 기본 캐시를 쓰는데, 그러면 서버 렌더링분과 useServerInsertedHTML이 추적하는 캐시가 서로 다른 인스턴스가 돼서 스타일이 제대로 안 나옵니다.
}