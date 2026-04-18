import type { ReactNode } from 'react';

interface ClinicalTextProps {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'strong' | 'em' | 'code';
  title?: string;
}

export function ClinicalText({ children, className = '', as = 'span', title }: ClinicalTextProps) {
  const Tag = as;
  return (
    <Tag
      className={`notranslate ${className}`}
      translate="no"
      lang="en"
      dir="ltr"
      title={title}
      data-clinical="true"
    >
      {children}
    </Tag>
  );
}

export function ClinicalBanner({ message }: { message: string }) {
  return (
    <div className="mb-3 rounded-xl border border-[#E7CD72] bg-[#FFF3CF] px-3 py-2 text-[12px] text-[#6B4A05]">
      <span className="font-semibold mr-1">⚠</span>
      {message}
    </div>
  );
}
