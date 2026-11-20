import Link from "next/link";

interface CompanyInfo {
  name?: string;
  ceo?: string;
  bizNo?: string;
  phone?: string;
  address?: string;
}

export default function PublicFooter({ companyInfoJson }: { companyInfoJson: string }) {
  let info: CompanyInfo = {};
  try {
    info = JSON.parse(companyInfoJson || "{}") as CompanyInfo;
  } catch {
    info = {};
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-10 text-sm text-slate-600">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-6 px-4 sm:flex-row sm:px-6">
        <div className="space-y-1.5">
          <p className="font-semibold text-slate-900">{info.name || "주식회사 스타터"}</p>
          <p>
            대표자: {info.ceo || "홍길동"} | 사업자등록번호: {info.bizNo || "123-45-67890"}
          </p>
          <p>
            주소: {info.address || "서울시 강남구 테헤란로 123"} | 전화: {info.phone || "02-1234-5678"}
          </p>
          <p className="pt-2 text-xs text-slate-400">
            © {new Date().getFullYear()} {info.name || "Starter Kit"}. All rights reserved.
          </p>
        </div>

        <div className="flex items-start gap-4 text-xs">
          <Link href="/notices" className="hover:underline">
            공지사항
          </Link>
          <Link href="/inquiries" className="hover:underline">
            상담문의
          </Link>
          <Link href="/admin" className="text-slate-400 hover:text-slate-700">
            관리자 콘솔
          </Link>
        </div>
      </div>
    </footer>
  );
}
