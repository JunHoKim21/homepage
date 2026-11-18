import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Clock,
  Code2,
  LockKeyhole,
  Mail,
  MapPin,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";

interface CompanyInfo {
  name?: string;
  ceo?: string;
  bizNo?: string;
  phone?: string;
  email?: string;
  kakaoUrl?: string;
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

  const companyName =
    !info.name || info.name === "주식회사 스타터"
      ? "스타터웹 스튜디오 (주식회사 스타터랩)"
      : info.name;
  const ceo = !info.ceo || info.ceo === "홍길동" ? "김도현" : info.ceo;
  const bizNo = !info.bizNo || info.bizNo === "123-45-67890" ? "214-88-02941" : info.bizNo;
  const phone = !info.phone || info.phone === "02-1234-5678" ? "02-558-7942" : info.phone;
  const email = info.email || "contact@starterweb.kr";
  const address =
    !info.address || info.address === "서울시 강남구 테헤란로 123"
      ? "서울특별시 강남구 테헤란로 152 강남파이낸스센터 18층"
      : info.address;
  const hours =
    info.hours || "평일 09:30 ~ 18:30 (점심 12:30 ~ 13:30 / 주말·공휴일 휴무)";

  return (
    <footer className="w-full max-w-full overflow-x-clip border-t border-slate-800 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* 좌측: 브랜드 및 사업자 정보 */}
          <div className="min-w-0 space-y-4 lg:col-span-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-lg font-extrabold text-white">{companyName}</p>
                <p className="truncate text-[11px] font-bold tracking-wider text-blue-400">
                  CUSTOM WEB &amp; ADMIN AGENCY
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-400">
              매달 나가는 웹빌더 월 임대료 없이 100% 귀사 소유로 구축하는 정통 웹 에이전시입니다.
              초기창업패키지·정부지원사업 수행 및 전자세금계산서·비교견적서 즉시 발행을 지원합니다.
            </p>

            <div className="space-y-1.5 pt-1 text-xs text-slate-400">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="inline-flex items-center gap-1 text-slate-300">
                  <Building2 className="h-3.5 w-3.5 text-slate-500" />
                  상호: {companyName}
                </span>
                <span>대표자: {ceo}</span>
                <span>사업자등록번호: {bizNo}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span>주소: {address}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span>이메일: {email}</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300 ring-1 ring-slate-800">
                <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                전자세금계산서 100% 발행
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-300 ring-1 ring-slate-800">
                <ShieldCheck className="h-3 w-3 text-blue-400" />
                원본 소스코드 100% 이관 보증
              </span>
            </div>
          </div>

          {/* 중앙: 바로가기 메뉴 & 업종 샘플 */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:col-span-4">
            <div>
              <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">
                서비스 바로가기
              </h3>
              <ul className="mt-3.5 space-y-2.5 text-xs">
                <li>
                  <Link href="/about" className="transition hover:text-white">
                    회사·기술소개 (왜 독립 구축인가)
                  </Link>
                </li>
                <li>
                  <Link href="/portfolio" className="transition hover:text-white">
                    업종별 구축 포트폴리오
                  </Link>
                </li>
                <li>
                  <Link href="/notices" className="transition hover:text-white">
                    정찰제 가격표 및 공지사항
                  </Link>
                </li>
                <li>
                  <Link href="/reservations" className="transition hover:text-white">
                    1:1 상담예약 신청
                  </Link>
                </li>
                <li>
                  <Link href="/inquiries" className="font-semibold text-blue-400 transition hover:text-blue-300">
                    30초 무료 제작 견적문의 →
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-extrabold tracking-wider text-white uppercase">
                실시간 쇼룸 & CMS 체험
              </h3>
              <ul className="mt-3.5 space-y-2.5 text-xs">
                <li>
                  <Link href="/?preset=AGENCY" className="transition hover:text-white">
                    모드 0: 웹 에이전시 공식 홈
                  </Link>
                </li>
                <li>
                  <Link href="/?preset=CORP" className="transition hover:text-white">
                    샘플 1: 기업·시공·제조 홍보형
                  </Link>
                </li>
                <li>
                  <Link href="/?preset=CLINIC" className="transition hover:text-white">
                    샘플 2: 병의원·로펌·스튜디오 예약형
                  </Link>
                </li>
                <li className="pt-1">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-bold text-amber-300 ring-1 ring-amber-400/30 transition hover:bg-amber-500/20"
                  >
                    <LockKeyhole className="h-3 w-3" />
                    관리자 콘솔(CMS) 1초 체험
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* 우측: 고객센터 대표번호 큼직하게 표시 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 lg:col-span-3">
            <p className="text-xs font-bold text-blue-400">고객센터 · 제작 및 견적 상담</p>
            <a
              href={`tel:${phone}`}
              className="mt-1.5 flex items-center gap-2 text-2xl font-black tracking-tight text-white hover:text-blue-300"
            >
              <PhoneCall className="h-5 w-5 text-blue-400" />
              {phone}
            </a>
            <div className="mt-3 space-y-1 text-xs text-slate-400">
              <p className="flex items-start gap-1.5">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
                <span>{hours}</span>
              </p>
              <p className="text-[11px] text-slate-500">
                * 야간·주말 온라인 견적문의 접수 시 익영업일 오전 10시 전 피드백 보장
              </p>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link
                href="/inquiries"
                className="rounded-xl bg-blue-700 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-blue-600"
              >
                무료 견적신청
              </Link>
              <Link
                href="/reservations"
                className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-center text-xs font-bold text-slate-200 transition hover:bg-slate-700"
              >
                상담 예약하기
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {companyName}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <Link href="/notices" className="hover:text-slate-300">
              이용약관 및 정찰제 규정
            </Link>
            <Link href="/inquiries" className="hover:text-slate-300">
              개인정보처리방침
            </Link>
            <Link href="/admin/login" className="font-semibold text-slate-400 hover:text-white">
              관리자 콘솔 (CMS)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
