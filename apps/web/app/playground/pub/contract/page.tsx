'use client';

import React, { useState } from 'react';
import { FullPopup } from '@repo/ui/components/FullPopup/index';
import { Dialog } from '@repo/ui/components/Modal/index';
import { SimpleTerms } from './components/SimpleTerm';

export default function ContractPage() {
  // 약관 체크 상태
  const [terms, setTerms] = useState({
    credit: false,      // 필수 1
    electronic: false,  // 필수 2
    marketing: false,   // 선택
  });

  // 풀팝업 제어
  const [activePopup, setActivePopup] = useState<string | null>(null);

  // 미동의 시 사용자 경고 모달
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const handleSubmitContract = () => {
    if (!terms.credit || !terms.electronic) {
      setIsWarningOpen(true);
      return;
    }
    alert('계약 서류 제출 및 전자서명이 정상 완료되었습니다.');
  };

  return (
    <main style={{ maxWidth: '440px', margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px' }}>대출 전자계약 체결</h1>
      <p style={{ fontSize: '13px', color: '#6B7280', margin: '0 0 24px' }}>
        약관을 꼼꼼히 확인하고 동의해 주세요.
      </p>

      {/* 약관 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
        <SimpleTerms
          id="credit"
          label="신용정보 조회 및 제공 동의서"
          required
          checked={terms.credit}
          onChange={(checked) => setTerms({ ...terms, credit: checked })}
          onOpenDetail={() => setActivePopup('credit')}
        />
        <SimpleTerms
          id="electronic"
          label="여신거래 전자약정 체결 기본규약"
          required
          checked={terms.electronic}
          onChange={(checked) => setTerms({ ...terms, electronic: checked })}
          onOpenDetail={() => setActivePopup('electronic')}
        />
        <SimpleTerms
          id="marketing"
          label="금리인하 요구권 알림 등 마케팅 수신"
          checked={terms.marketing}
          onChange={(checked) => setTerms({ ...terms, marketing: checked })}
          onOpenDetail={() => setActivePopup('marketing')}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmitContract}
        style={{ width: '100%', height: '52px', backgroundColor: '#111827', color: '#fff', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
      >
        계약서 제출 및 전자서명
      </button>

      {/* [풀팝업 1] 신용정보 약관 상세 */}
      <FullPopup
        isOpen={activePopup === 'credit'}
        title="신용정보 조회 및 제공 동의서"
        onClose={() => setActivePopup(null)}
        confirmText="약관 확인 및 동의"
        onConfirm={() => {
          setTerms((prev) => ({ ...prev, credit: true }));
          setActivePopup(null);
        }}
      >
        <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#374151' }}>
          <h4>제 1 조 (수집 목적)</h4>
          <p>여신 심사, 리스크 산정, 신용등급 조회를 목적으로 고객의 개인 및 법인 정보를 신용조회회사에 제공합니다.</p>
          <h4>제 2 조 (보유 기간)</h4>
          <p>금융거래 종료일로부터 5년간 안전하게 분리 보관됩니다.</p>
        </div>
      </FullPopup>

      {/* [풀팝업 2] 여신거래 기본규약 상세 */}
      <FullPopup
        isOpen={activePopup === 'electronic'}
        title="여신거래 기본규약"
        onClose={() => setActivePopup(null)}
        confirmText="약관 확인 및 동의"
        onConfirm={() => {
          setTerms((prev) => ({ ...prev, electronic: true }));
          setActivePopup(null);
        }}
      >
        <div style={{ fontSize: '14px', lineHeight: 1.6, color: '#374151' }}>
          <h4>제 1 조 (원리금 상환 의무)</h4>
          <p>차주는 지정된 납부일에 맞춰 원금 및 이자를 연체 없이 상환하여야 합니다.</p>
          <h4>제 2 조 (기한이익 상실)</h4>
          <p>연체 발생 시 통지 후 기한의 이익이 상실되며 전액 일시 상환 청구가 발생할 수 있습니다.</p>
        </div>
      </FullPopup>

      {/* 필수 약관 누락 경고 Confirm */}
      <Dialog
        isOpen={isWarningOpen}
        type="confirm"
        title="필수 약관 미동의"
        description="필수 약관 2건에 동의하셔야 전자서명 페이지로 진입할 수 있습니다. 바로 전체 동의하시겠습니까?"
        confirmText="모두 동의하기"
        cancelText="돌아가기"
        onConfirm={() => {
          setTerms({ ...terms, credit: true, electronic: true });
          setIsWarningOpen(false);
        }}
        onCancel={() => setIsWarningOpen(false)}
      />
    </main>
  );
}

