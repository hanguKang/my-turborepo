'use client';

import React, { useRef } from 'react';

export interface FileItem {
  id: string;
  name: string;
  size: number;
}

export interface FileUploadProps {
  files: FileItem[];
  onUpload: (newFiles: File[]) => void;
  onRemove: (id: string) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  maxSizeMB?: number;
}

export const FileUpload = ({
  files,
  onUpload,
  onRemove,
  accept = '.pdf,.png,.jpg,.jpeg',
  multiple = true,
  disabled = false,
  maxSizeMB = 10,
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selected = Array.from(e.target.files);
    onUpload(selected);
    e.target.value = ''; // 재업로드 가능하도록 초기화
  };

  return (
    <div className="wds-fileupload-root">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div
        className={['wds-upload-box', disabled ? 'is-disabled' : ''].filter(Boolean).join(' ')}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <span className="wds-upload-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 13.333V3.333m0 0L6.667 6.667M10 3.333l3.333 3.334M16.667 13.333v2.5a.833.833 0 0 1-.834.834H4.167a.833.833 0 0 1-.834-.834v-2.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="wds-upload-text">파일 선택 또는 여기로 드래그 (건당 최대 {maxSizeMB}MB)</span>
      </div>

      {files.length > 0 && (
        <ul className="wds-file-list">
          {files.map((file) => (
            <li key={file.id} className="wds-file-item">
              <span className="wds-file-name">{file.name}</span>
              <span className="wds-file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemove(file.id)}
                  aria-label="파일 삭제"
                  className="wds-file-remove-btn"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <style jsx>{`
        .wds-fileupload-root {
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
        }
        .wds-upload-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 16px;
          border: 1px dashed var(--wanted-color-border-default, #caced3);
          border-radius: var(--wanted-radius-md, 6px);
          background-color: var(--wanted-color-bg-gray, #f7f8f9);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .wds-upload-box:hover:not(.is-disabled) {
          border-color: var(--wanted-color-primary, #3366ff);
          background-color: var(--wanted-color-bg-white, #ffffff);
        }
        .wds-upload-box.is-disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }
        .wds-upload-icon {
          color: var(--wanted-color-text-secondary, #666);
        }
        .wds-upload-text {
          font-size: 13px;
          color: var(--wanted-color-text-secondary, #4a4a4a);
        }
        .wds-file-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .wds-file-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background-color: var(--wanted-color-bg-white, #ffffff);
          border: 1px solid var(--wanted-color-border-subtle, #e1e4e6);
          border-radius: var(--wanted-radius-sm, 4px);
          font-size: 12px;
        }
        .wds-file-name {
          flex: 1;
          color: var(--wanted-color-text-primary, #171717);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .wds-file-size {
          color: var(--wanted-color-text-tertiary, #8e9499);
          margin-left: 8px;
        }
        .wds-file-remove-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          color: var(--wanted-color-text-secondary, #666);
          margin-left: 8px;
          padding: 2px 4px;
        }
        .wds-file-remove-btn:hover {
          color: var(--wanted-color-danger, #e53e3e);
        }
      `}</style>
    </div>
  );
};