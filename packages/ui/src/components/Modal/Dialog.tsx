'use client';

import React, { useEffect } from 'react';

export interface DialogProps {
  isOpen: boolean;
  title: string;
  description?: string;
  type?: 'alert' | 'confirm' | 'danger';
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function Dialog({
  isOpen,
  title,
  description,
  type = 'alert',
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  onCancel,
}: DialogProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        width: '100%', maxWidth: '320px', backgroundColor: '#fff',
        borderRadius: '16px', padding: '24px 20px 16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: '#111827' }}>{title}</h3>
        {description && (
          <p style={{ margin: '0 0 20px', fontSize: '14px', color: '#4B5563', lineHeight: 1.5 }}>
            {description}
          </p>
        )}
        <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
          {type !== 'alert' && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1, height: '44px', borderRadius: '8px', border: '1px solid #E5E7EB',
                backgroundColor: '#fff', color: '#4B5563', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
              }}
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={onConfirm}
            style={{
              flex: 1, height: '44px', borderRadius: '8px', border: 'none',
              backgroundColor: type === 'danger' ? '#EF4444' : '#1E64FF',
              color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer'
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}