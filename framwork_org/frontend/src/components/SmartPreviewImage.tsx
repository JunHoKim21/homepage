"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface SmartPreviewImageProps {
  src: string;
  alt: string;
  className?: string;
  iconClassName?: string;
}

/**
 * 비동기 이미지 최적화(WebP 변환) 완료 전 404가 발생하더라도
 * 짧은 간격으로 자동 재시도하여 미리보기를 안정적으로 표시하는 컴포넌트.
 */
export default function SmartPreviewImage({
  src,
  alt,
  className = "h-full w-full object-contain p-1",
  iconClassName = "h-6 w-6 text-slate-300",
}: SmartPreviewImageProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setRetryCount(0);
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <ImageIcon className={iconClassName} />;
  }

  const isLocalBlob = src.startsWith("blob:") || src.startsWith("data:");
  const effectiveSrc =
    retryCount > 0 && !isLocalBlob
      ? `${src}${src.includes("?") ? "&" : "?"}r=${retryCount}`
      : src;

  return (
    <img
      src={effectiveSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (retryCount < 6 && !isLocalBlob) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 500);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
