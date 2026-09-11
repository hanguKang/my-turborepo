'use client';
/** @jsxImportSource @emotion/react */

import { useEffect, useState } from 'react';
import { css } from '@emotion/react';

// 스타일이 "늦게" 붙는 상황을 의도적으로 재현
const styledBox = css`
  background: #1e64ff;
  color: #fff;
  font-size: 22px;
  font-weight: 800;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  margin-top: 20px;
  transition: none; /* 스타일 전환 애니메이션으로 가려지지 않게 */
`;

export default function HeavyStyledWidget() {
  const [styled, setStyled] = useState(false);

  useEffect(() => {
    // 실제로는 청크 로딩/하이드레이션 지연이 이 역할을 함.
    // 여기서는 눈으로 보이게 800ms 지연을 흉내냄.
    const t = setTimeout(() => setStyled(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div css={styled ? styledBox : undefined} style={{ marginTop: 20 }}>
      이 텍스트가 스타일 적용 전/후로 어떻게 보이는지 확인하세요
    </div>
  );
}