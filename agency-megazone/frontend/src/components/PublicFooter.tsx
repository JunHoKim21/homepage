import Link from "next/link";
import { Building2, Clock, FileCheck2, PhoneCall } from "lucide-react";

interface CompanyInfo {
  name?: string;
  ceo?: string;
  bizNo?: string;
  phone?: string;
  address?: string;
  hours?: string;
}

export default function PublicFooter({ companyInfoJson }: { companyInfoJson: string }) {
  let info: CompanyInfo = {};
  try {
    info = JSON.parse(companyInfoJson || "{}") as CompanyInfo;
  } catch {
    info = {};
  }

  const companyName = info.name || "엘레브웹 (eleveWeb)";

  return (
    <footer className="w-full min-w-0 overflow-x-clip border-t border-white/10 bg-[#0B0F19] pb-20 pt-14 text-sm text-slate-300 lg:pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid min-w-0 gap-10 md:grid-cols-12">
          {/* Brand & Enterprise Info */}
          <div className="min-w-0 space-y-4 md:col-span-6">
            <div className="flex items-center gap-2.5 text-base font-extrabold text-white">
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0EA5E9] to-[#1D4ED8] text-xs font-black tracking-tighter text-white">
                eW
              </span>
              <span>{companyName}</span>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-400">
              매달 나가는 임대료 없이, 기업·병의원·전문직의 브랜드 자산을 온전히 소유할 수 있는
              독립형 홈페이지 구축 파트너입니다.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <Building2 className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <span>상호: {companyName}</span>
                <span className="text-slate-600">|</span>
                <span>대표자: {info.ceo || "김준호"}</span>
                <span className="text-slate-600">|</span>
                <span>사업자등록번호: {info.bizNo || "449-14-03005"}</span>
              </p>
              <p>주소: {info.address || "100% 비대면 온라인 스튜디오 (전국 온라인 지원)"}</p>
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <PhoneCall className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <span>대표전화: {info.phone || "010-4404-5263"}</span>
                <span className="text-slate-600">|</span>
                <Clock className="h-3.5 w-3.5 shrink-0 text-sky-400" />
                <span>운영시간: {info.hours || "온라인 접수 24시간 상시 (접수 후 24시간 이내 회신) | 유선·화상 상담: 사전 예약제 운영"}</span>
              </p>
            </div>
          </div>

          {/* Tax & Documentation */}
          <div className="min-w-0 space-y-3 md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              세금계산서 및 증빙 안내
            </h3>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-xs leading-relaxed text-slate-300">
              <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-sky-300">
                <FileCheck2 className="h-4 w-4 shrink-0" />
                <span>100% 공식 증빙 발행</span>
              </div>
              <p className="text-slate-400">
                일반과세자 정식 사업자로서 전자세금계산서, 비교견적서 및 거래명세서 즉시 발행을 지원합니다.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0 space-y-3 md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">바로가기</h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-400 md:grid-cols-1">
              <li>
                <Link href="/#portfolio-showcase" className="transition hover:text-sky-300">
                  업종별 샘플 보기
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="transition hover:text-sky-300">
                  투명 정찰제 요금
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition hover:text-sky-300">
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link href="/reservations" className="transition hover:text-sky-300">
                  1:1 상담예약
                </Link>
              </li>
              <li>
                <Link href="/inquiries" className="transition hover:text-sky-300">
                  무료 견적문의
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-sky-400 transition hover:text-sky-300">
                  관리자 콘솔 체험 →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
          <p className="text-slate-500">
            월 임대료 없는 독립형 홈페이지 구축 에이전시
          </p>
        </div>
      </div>
    </footer>
  );
}
