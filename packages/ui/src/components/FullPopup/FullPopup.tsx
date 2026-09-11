'use client';

import React from 'react';

export interface FullPopupProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  children: React.ReactNode;
}

export function FullPopup({
  isOpen,
  title,
  onClose,
  onConfirm,
  confirmText = '내용 확인 및 동의',
  children,
}: FullPopupProps) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: '#fff', display: 'flex', flexDirection: 'column'
    }}>
      <header style={{
        height: '56px', borderBottom: '1px solid #E5E7EB', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', padding: '0 16px'
      }}>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
        >
          ←
        </button>
        <span style={{ fontSize: '16px', fontWeight: 600 }}>{title}</span>
        <button
          type="button"
          onClick={onClose}
          style={{ background: 'none', border: 'none', fontSize: '14px', color: '#6B7280', cursor: 'pointer' }}
        >
          닫기
        </button>
      </header>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {children}
      </div>

      <footer style={{ padding: '12px 16px 24px', borderTop: '1px solid #E5E7EB' }}>
        <button
          type="button"
          onClick={onConfirm}
          style={{
            width: '100%', height: '48px', backgroundColor: '#1E64FF',
            color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer'
          }}
        >
          {confirmText}
        </button>
      </footer>
    </div>
  );
}