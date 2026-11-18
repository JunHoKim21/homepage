"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApiFetch } from "@/lib/api";
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Gavel,
  Lock,
  MapPin,
  Menu,
  Phone,
  Scale,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";

type PracticeCategory = "전체" | "형사" | "이혼/가사" | "기업자문" | "부동산";
type ConsultField = Exclude<PracticeCategory, "전체">;

interface PracticeArea {
  id: ConsultField;
  title: string;
  eng: string;
  summary: string;
  keywords: string[];
  icon: typeof Gavel;
}

interface LawyerProfile {
  id: number;
  name: string;
  role: string;
  image: string;
  credential: string;
  specialty: string;
  career: string[];
  quote: string;
}

interface VictoryCase {
  id: number;
  category: ConsultField;
  resultBadge: string;
  title: string;
  clientType: string;
  duration: string;
  overview: string;
  issues: string[];
  outcome: string;
}

const PRACTICE_AREAS: PracticeArea[] = [
  {
    id: "형사",
    title: "형사 전문 대응",
    eng: "CRIMINAL DEFENSE",
    summary:
      "압수수색·구속영장 실질심사 등 초기 골든타임부터 경찰·검찰 조사 동행, 공판 변론까지 전담팀이 즉각 대응합니다.",
    keywords: ["경제·횡령·배임", "성범죄·무고", "디지털 포렌식", "영장실질심사"],
    icon: Gavel,
  },
  {
    id: "이혼/가사",
    title: "이혼·가사·상속",
    eng: "FAMILY & INHERITANCE",
    summary:
      "고액 재산분할, 은닉재산 추적, 친권·양육권, 유류분 및 상속분쟁까지 의뢰인의 삶과 자산을 치밀하게 지켜냅니다.",
    keywords: ["고액 재산분할", "상간자 소송", "친권·양육권", "상속·유류분"],
    icon: Users,
  },
  {
    id: "기업자문",
    title: "기업·조세 자문",
    eng: "CORPORATE & TAX",
    summary:
      "M&A, 주주간 분쟁, 영업비밀 침해, 세무조사 및 조세불복 등 기업 경영의 중대 리스크를 선제적으로 차단합니다.",
    keywords: ["경영권 분쟁", "계약·노무 자문", "조세불복·세무", "영업비밀 보호"],
    icon: Briefcase,
  },
  {
    id: "부동산",
    title: "부동산·건설",
    eng: "REAL ESTATE & CONSTRUCTION",
    summary:
      "재개발·재건축 조합 분쟁, 상가·주택 임대차, 명도소송, 시행·시공 하자 분쟁에 실전 특화 솔루션을 제공합니다.",
    keywords: ["재건축·재개발", "명도·임대차", "시행·시공 분쟁", "신탁·경매"],
    icon: Building2,
  },
];

const LAWYERS: LawyerProfile[] = [
  {
    id: 1,
    name: "강정율",
    role: "대표변호사",
    image: "/images/samples/law-attorney1.jpg",
    credential: "사법연수원 38기 · 전 서울중앙지검 검사",
    specialty: "형사·기업범죄·조세수사",
    career: [
      "서울대학교 법과대학 졸업",
      "전) 서울중앙지방검찰청 형사부·특수부 검사",
      "전) 대검찰청 반부패부 파견 연구관",
      "현) 대한변호사협회 등록 형사법 전문변호사",
    ],
    quote: "초기 48시간의 전략이 사건의 결론을 바꿉니다.",
  },
  {
    id: 2,
    name: "서윤아",
    role: "파트너 변호사",
    image: "/images/samples/law-attorney2.jpg",
    credential: "사법연수원 41기 · 전 서울가정법원 판사",
    specialty: "이혼·재산분할·상속분쟁",
    career: [
      "고려대학교 법과대학 졸업",
      "전) 서울가정법원 가사합의부·단독 판사",
      "전) 서울고등법원 가사부 재판연구원",
      "현) 대한변호사협회 등록 가사법 전문변호사",
    ],
    quote: "감정이 아닌 객관적 입증과 치밀한 재산 평가로 승부합니다.",
  },
  {
    id: 3,
    name: "민태현",
    role: "파트너 변호사",
    image: "/images/samples/law-attorney3.jpg",
    credential: "변호사시험 3회 · 공인회계사(KICPA)",
    specialty: "기업자문·M&A·부동산신탁",
    career: [
      "연세대학교 경영학과 · 법학전문대학원 졸업",
      "전) 삼일회계법인 세무자문본부",
      "전) 법무법인(유) 광장 기업자문·부동산팀",
      "현) 코스닥 상장사 다수 법률·조세 고문변호사",
    ],
    quote: "법률과 회계·세무의 교차점에서 가장 안전한 구조를 설계합니다.",
  },
];

const VICTORY_CASES: VictoryCase[] = [
  {
    id: 1,
    category: "형사",
    resultBadge: "구속영장 기각 · 불송치",
    title: "특정경제범죄가중처벌법(배임) 48억 원대 혐의 방어",
    clientType: "중견 제조기업 대표이사",
    duration: "수사 개시 후 3개월",
    overview:
      "자회사 투자 과정에서 발생한 손실로 48억 원 상당의 업무상 배임 혐의 및 구속영장이 청구된 사안입니다.",
    issues: [
      "경영판단의 원칙 적용 가능성 및 이사회 결의 절차의 적법성",
      "투자 당시 외부 회계법인의 가치평가 보고서 신빙성 입증",
      "고의적 재산상 이익 취득 및 손해 발생 인식 부재 소명",
    ],
    outcome:
      "영장실질심사에서 경영상 합리적 판단이었음을 120쪽 분량의 의견서와 재무 데이터로 소명하여 구속영장 기각을 이끌어냈고, 후속 경찰 수사 단계에서 최종 혐의없음(불송치) 결정을 받았습니다.",
  },
  {
    id: 2,
    category: "이혼/가사",
    resultBadge: "재산분할 62% 인정",
    title: "비상장법인 지분 및 해외 은닉자산 포함 110억 원대 재산분할",
    clientType: "혼인기간 19년 의뢰인",
    duration: "소송 제기 후 11개월",
    overview:
      "상대방이 혼인 중 형성한 비상장법인 주식과 차명 계좌 자산을 특유재산이라 주장하며 재산분할을 거부한 사안입니다.",
    issues: [
      "금융거래정보 제출명령 및 사실조회를 통한 은닉 계좌·해외 송금 내역 추적",
      "비상장법인 주식의 실질적 가치 재산정 및 기여도 입증",
      "부동산 가압류·처분금지가처분 선제 집행을 통한 강제집행 보전",
    ],
    outcome:
      "가사 전담팀과 회계 자문 연계로 은닉 자산 28억 원을 추가 특정하여, 의뢰인에게 총 62% 비율의 재산분할 및 위자료 전액 인용 화해권고결정을 확정지었습니다.",
  },
  {
    id: 3,
    category: "기업자문",
    resultBadge: "과세처분 전액 취소",
    title: "법인세 및 부가가치세 34억 원 부과처분 조세심판원 인용",
    clientType: "IT 플랫폼 중견기업",
    duration: "심판 청구 후 5개월",
    overview:
      "과세관청이 특수관계인 간 용역 거래를 부당행위계산부인 대상으로 보아 총 34억 원의 세금을 추징한 사안입니다.",
    issues: [
      "비교대상 거래선 선정의 비합리성 및 시가 산정 오류 지적",
      "실제 용역 수행 내역과 사업상 정당한 경제적 합리성 입증",
      "유사 대법원 판례 및 기획재정부 예규의 정밀 대조 분석",
    ],
    outcome:
      "변호사·공인회계사 협업 팀이 과세 논리의 모순을 조세심판원 구술심리에서 조목조목 반박하여, 부과처분 34억 원 전액 취소 결정을 받아냈습니다.",
  },
  {
    id: 4,
    category: "부동산",
    resultBadge: "명도·손배 전액 승소",
    title: "강남권 대형 상업빌딩 무단점유 명도 및 지연손해금 청구",
    clientType: "부동산 자산운용사",
    duration: "가처분 포함 4개월",
    overview:
      "임대차 기간 만료 및 차임 연체에도 불구하고 건물을 인도하지 않고 영업을 지속한 임차인을 상대로 제기한 명도 분쟁입니다.",
    issues: [
      "점유이전금지가처분 7일 내 신속 집행으로 제3자 전대 차단",
      "권리금 회수기회 방해 주장에 대한 계약 해지 사유 적법성 방어",
      "보증금 공제 후 잔여 연체 차임 및 부당이득금 산정",
    ],
    outcome:
      "신속한 가처분 및 본안 변론을 통해 1심 원고 전부 승소 판결을 획득하고, 강제집행 예고만으로 자진 명도 및 지연손해금 정산을 완료했습니다.",
  },
  {
    id: 5,
    category: "형사",
    resultBadge: "무죄 판결 확정",
    title: "성폭력처벌법 위반 혐의 포렌식 반증을 통한 1심 무죄",
    clientType: "전문직 직장인",
    duration: "공판 7개월",
    overview:
      "고소인의 일관된 진술만을 근거로 기소되었으나, 사건 당일 동선과 메신저 맥락이 고소 내용과 배치되었던 사안입니다.",
    issues: [
      "피고인 및 참고인 휴대전화 디지털 포렌식 데이터 시계열 복원",
      "사건 직후 주고받은 메시지·CCTV 영상의 객관적 모순점 탄핵",
      "증인신문 과정에서 고소인 진술 번복 및 신빙성 붕괴 입증",
    ],
    outcome:
      "재판부가 공소사실에 합리적 의심이 배제될 정도로 입증되지 않았다고 판단하여 1심 무죄를 선고했고, 검찰 항소 포기 후 최종 확정되었습니다.",
  },
  {
    id: 6,
    category: "기업자문",
    resultBadge: "가처분 인용 · 합의",
    title: "핵심 기술인력 이직 및 영업비밀 유출 금지 가처분",
    clientType: "바이오 벤처기업",
    duration: "신청 후 3주",
    overview:
      "핵심 연구원이 퇴직 직전 연구데이터를 반출해 경쟁사로 이직하려던 정황이 포착되어 긴급 대응한 사안입니다.",
    issues: [
      "사내 보안로그 및 USB 반출 흔적 즉시 증거보전",
      "부정경쟁방지법상 영업비밀의 비밀관리성 요건 입증",
      "전직금지 약정의 유효 범위 및 대가성 소명",
    ],
    outcome:
      "신청 3주 만에 영업비밀 침해금지 및 전직금지 가처분이 인용되어 기술 유출을 원천 봉쇄하고, 경쟁사로부터 손해배상 합의를 이끌어냈습니다.",
  },
];

const CASE_CATEGORIES: PracticeCategory[] = [
  "전체",
  "형사",
  "이혼/가사",
  "기업자문",
  "부동산",
];

export default function JungyulLawFirmSamplePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<PracticeCategory>("전체");
  const [activeCase, setActiveCase] = useState<VictoryCase | null>(null);

  // 1:1 비밀상담 폼 상태
  const [consultField, setConsultField] = useState<ConsultField>("형사");
  const [hopeDate, setHopeDate] = useState("2026-11-25");
  const [hopeTime, setHopeTime] = useState("오후 2:00 ~ 4:00");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [summary, setSummary] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [honeypot, setHoneypot] = useState("");
  const [formError, setFormError] = useState("");
  const [submittedData, setSubmittedData] = useState<{
    field: ConsultField;
    date: string;
    time: string;
    name: string;
    phone: string;
    fileCount: number;
  } | null>(null);

  const filteredCases =
    selectedCategory === "전체"
      ? VICTORY_CASES
      : VICTORY_CASES.filter((item) => item.category === selectedCategory);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCase(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setAttachedFiles((prev) => [...prev, ...Array.from(files)].slice(0, 5));
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleConsultSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim() !== "") {
      // 자동 스팸 봇 차단
      return;
    }
    if (!clientName.trim() || !clientPhone.trim() || !hopeDate) {
      setFormError("성함, 연락처, 희망 상담 일정을 모두 입력해 주세요.");
      return;
    }
    setFormError("");
    const body = {
      category: "ESTIMATE",
      customerName: clientName.trim() || "샘플 체험 고객",
      customerPhone: clientPhone.trim() || "010-0000-0000",
      customerEmail: null,
      title: `[샘플체험-법무법인] ${consultField} 1:1 비밀상담 (${hopeDate})`,
      content: `상담분야: ${consultField} / 희망일정: ${hopeDate} (${hopeTime}) / 첨부파일: ${attachedFiles.length}건 / 개요: ${summary.trim() || "미입력"}`,
      customFieldsJson: JSON.stringify({
        sampleSource: "law",
        consultField,
        hopeDate,
        hopeTime,
        fileCount: attachedFiles.length,
        summary: summary.trim(),
      }),
      attachmentMediaId: null,
      privacyAgreed: true,
      websiteUrl: "",
    };
    try {
      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch {
      if (typeof window !== "undefined") {
        const existing = JSON.parse(
          localStorage.getItem("demo_sample_inquiries") || "[]"
        );
        existing.unshift({
          id: Date.now(),
          ...body,
          status: "NEW",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("demo_sample_inquiries", JSON.stringify(existing));
      }
    }
    setSubmittedData({
      field: consultField,
      date: hopeDate,
      time: hopeTime,
      name: clientName.trim(),
      phone: clientPhone.trim(),
      fileCount: attachedFiles.length,
    });
  };

  const jumpToConsultWithField = (field: ConsultField) => {
    setConsultField(field);
    setActiveCase(null);
    const el = document.getElementById("secret-consult");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="top"
      className="min-h-screen overflow-x-clip bg-[#0F172A] text-slate-100 antialiased selection:bg-[#C9A24D] selection:text-[#0F172A]"
    >
      {/* 최상단 데모 안내 띠 */}
      <div className="bg-slate-950 px-4 py-2 text-xs text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
          <p className="min-w-0 text-slate-300">
            현재 보고 계신 페이지는 업종별 맞춤형 구축 데모 샘플입니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-semibold">
            <Link
              href="/"
              className="text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:text-[#C9A24D]"
            >
              에이전시 메인으로 돌아가기
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/login"
              className="text-[#C9A24D] underline decoration-[#C9A24D]/60 underline-offset-4 transition-colors hover:text-[#E2C478]"
            >
              관리자(/admin) 체험하기
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/inquiries"
              className="text-emerald-300 underline decoration-emerald-500/60 underline-offset-4 transition-colors hover:text-emerald-200"
            >
              관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
            </Link>
          </div>
        </div>
      </div>

      {/* 1. 자체 상단 헤더 */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#0F172A]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
          <a href="#top" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-[#C9A24D]/50 bg-[#1E293B] text-[#C9A24D]">
              <Scale className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="truncate font-serif text-sm font-bold tracking-[0.22em] text-white sm:text-base">
                JUNGYUL
              </div>
              <div className="truncate text-[11px] font-medium tracking-wider text-[#C9A24D]">
                법무법인 정율
              </div>
            </div>
          </a>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-300 lg:flex">
            <a
              href="#about"
              className="transition-colors hover:text-[#C9A24D]"
            >
              법무법인 소개
            </a>
            <a
              href="#practice"
              className="transition-colors hover:text-[#C9A24D]"
            >
              전문분야
            </a>
            <a
              href="#lawyers"
              className="transition-colors hover:text-[#C9A24D]"
            >
              변호사 소개
            </a>
            <a
              href="#cases"
              className="transition-colors hover:text-[#C9A24D]"
            >
              승소사례
            </a>
            <a
              href="#secret-consult"
              className="transition-colors hover:text-[#C9A24D]"
            >
              1:1 비밀상담
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href="tel:02-590-7700"
              className="hidden items-center gap-1.5 rounded-sm border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#C9A24D] hover:text-[#C9A24D] sm:inline-flex"
            >
              <Phone className="h-3.5 w-3.5 text-[#C9A24D]" />
              <span>02-590-7700</span>
            </a>
            <a
              href="#secret-consult"
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#C9A24D] px-3.5 py-2 text-xs font-bold text-[#0F172A] transition-colors hover:bg-[#E2C478] sm:px-4 sm:text-sm"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>비밀상담 예약</span>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="메뉴 열기"
              className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-slate-700 text-slate-200 lg:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일 내비게이션 */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-800 bg-[#0B1120] px-4 py-4 lg:hidden">
            <nav className="flex flex-col gap-3 text-sm font-medium text-slate-200">
              {[
                { label: "법무법인 소개", href: "#about" },
                { label: "전문분야", href: "#practice" },
                { label: "변호사 소개", href: "#lawyers" },
                { label: "승소사례", href: "#cases" },
                { label: "1:1 비밀상담", href: "#secret-consult" },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-sm px-2 py-1.5 transition-colors hover:bg-slate-800/70 hover:text-[#C9A24D]"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* 2. 묵직한 히어로 섹션 */}
      <section
        id="about"
        className="relative overflow-hidden border-b border-slate-800/80 bg-[#0B1120]"
      >
        <img
          src="/images/samples/law-hero.jpg"
          alt="법무법인 정율 서초 본사 전경"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/samples/fallback.svg";
          }}
          className="absolute inset-0 h-full w-full object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/90 via-[#0F172A]/85 to-[#0F172A]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-[#C9A24D]/10 blur-3xl"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-sm border border-[#C9A24D]/40 bg-[#C9A24D]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#C9A24D]">
                <Award className="h-3.5 w-3.5" />
                <span>HIGH-END LEGAL COUNSEL · SEOCHO</span>
              </div>
              <h1 className="mt-5 font-serif text-3xl leading-tight font-bold tracking-tight text-white sm:text-5xl sm:leading-[1.18]">
                절체절명의 순간,
                <br />
                결과로 증명하는{" "}
                <span className="text-[#C9A24D]">정율의 변론</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                검사·판사·공인회계사 출신 파트너 변호사가 사건의 첫 단추부터
                직접 전략을 수립합니다. 형사 긴급대응부터 고액 가사·기업·부동산
                분쟁까지, 타협 없는 치밀함으로 의뢰인의 권익을 수호합니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#secret-consult"
                  className="inline-flex items-center gap-2 rounded-sm bg-[#C9A24D] px-6 py-3.5 text-sm font-bold text-[#0F172A] shadow-lg shadow-[#C9A24D]/15 transition-colors hover:bg-[#E2C478]"
                >
                  <span>1:1 비밀상담 예약</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#cases"
                  className="inline-flex items-center gap-2 rounded-sm border border-slate-700 bg-slate-900/70 px-6 py-3.5 text-sm font-semibold text-slate-100 transition-colors hover:border-[#C9A24D] hover:text-[#C9A24D]"
                >
                  <span>주요 승소사례 보기</span>
                </a>
              </div>
            </div>

            {/* 핵심 누적 성과 카드 */}
            <div className="min-w-0 lg:col-span-5">
              <div className="rounded-sm border border-[#C9A24D]/30 bg-[#1E293B]/60 p-6 backdrop-blur-sm sm:p-8">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#C9A24D]">
                    CUMULATIVE TRACK RECORD
                  </span>
                  <ShieldCheck className="h-5 w-5 text-[#C9A24D]" />
                </div>

                <div className="mt-6 grid grid-cols-2 gap-5">
                  <div className="border-l-2 border-[#C9A24D] pl-3.5">
                    <div className="font-serif text-2xl font-bold text-white sm:text-3xl">
                      3,420+
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      누적 승소·성공사례
                    </div>
                  </div>
                  <div className="border-l-2 border-[#C9A24D] pl-3.5">
                    <div className="font-serif text-2xl font-bold text-white sm:text-3xl">
                      24H
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      형사 긴급 압수·체포 대응
                    </div>
                  </div>
                  <div className="border-l-2 border-[#C9A24D] pl-3.5">
                    <div className="font-serif text-2xl font-bold text-white sm:text-3xl">
                      100%
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      파트너 변호사 직접 수임
                    </div>
                  </div>
                  <div className="border-l-2 border-[#C9A24D] pl-3.5">
                    <div className="font-serif text-2xl font-bold text-white sm:text-3xl">
                      4대
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      변협 등록 전문 전담팀
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-sm bg-[#0F172A]/80 px-4 py-3 text-xs leading-relaxed text-slate-300">
                  <span className="font-semibold text-[#C9A24D]">
                    비밀보장 원칙:
                  </span>{" "}
                  모든 상담 및 제출 자료는 변호사법 제26조에 따라 철저히
                  비밀이 유지됩니다.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 4대 전문 분야 */}
      <section id="practice" className="bg-[#F8FAFC] py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold tracking-[0.2em] text-[#9A7422]">
              PRACTICE AREAS
            </span>
            <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
              4대 핵심 전담 분야
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">
              분야별 전담 팀장 변호사가 사건 초기 진단부터 소송·협상 종결까지
              원팀으로 밀착 수행합니다.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PRACTICE_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <div
                  key={area.id}
                  className="group flex min-w-0 flex-col justify-between rounded-sm border border-slate-200 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-[#C9A24D] hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0F172A] text-[#C9A24D]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest text-slate-400">
                        {area.eng}
                      </span>
                    </div>
                    <h3 className="mt-5 font-serif text-xl font-bold text-[#0F172A]">
                      {area.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {area.summary}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {area.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="rounded-sm bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => jumpToConsultWithField(area.id)}
                    className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-[#0F172A] transition-colors group-hover:text-[#9A7422]"
                  >
                    <span>{area.id} 비밀상담 신청</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 대표·파트너 변호사 3인 프로필 */}
      <section
        id="lawyers"
        className="border-y border-slate-800 bg-[#0F172A] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#C9A24D]">
                PARTNER ATTORNEYS
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-4xl">
                대표 · 파트너 변호사
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm">
              법무법인 정율은 사무장이 아닌 검증된 전관·전문 변호사가 상담부터
              서면 작성, 법정 변론까지 전 과정을 직접 책임집니다.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {LAWYERS.map((lawyer) => (
              <article
                key={lawyer.id}
                className="flex min-w-0 flex-col justify-between overflow-hidden rounded-sm border border-slate-800 bg-[#1E293B]/60 transition-colors hover:border-[#C9A24D]/60"
              >
                <div>
                  <div className="aspect-[4/3] overflow-hidden bg-slate-900">
                    <img
                      src={lawyer.image}
                      alt={`${lawyer.name} ${lawyer.role}`}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/samples/fallback.svg";
                      }}
                      className="h-full w-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3 border-b border-slate-700/80 pb-4">
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold tracking-wider text-[#C9A24D]">
                          {lawyer.role}
                        </span>
                        <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                          {lawyer.name}{" "}
                          <span className="text-sm font-normal text-slate-400">
                            변호사
                          </span>
                        </h3>
                      </div>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-[#C9A24D]/30 bg-[#0F172A] font-serif text-base font-bold text-[#C9A24D]">
                        {lawyer.name.slice(0, 1)}
                      </div>
                    </div>

                    <div className="mt-4 text-xs font-semibold text-slate-200">
                      {lawyer.credential}
                    </div>
                    <div className="mt-1 text-xs font-medium text-[#C9A24D]">
                      주력 분야: {lawyer.specialty}
                    </div>

                    <ul className="mt-4 space-y-2 text-xs leading-relaxed text-slate-300">
                      {lawyer.career.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span
                            className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#C9A24D]"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <blockquote className="mx-6 mb-6 border-t border-slate-700/80 pt-4 font-serif text-xs italic leading-relaxed text-slate-300">
                  &ldquo;{lawyer.quote}&rdquo;
                </blockquote>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 승소·성공사례 필터 및 상세 모달 */}
      <section id="cases" className="bg-white py-16 text-slate-900 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#9A7422]">
                VICTORY CASES
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#0F172A] sm:text-4xl">
                주요 승소·성공사례
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                사건 카드를 클릭하시면 사건 개요와 핵심 쟁점, 최종 결과를
                상세히 확인하실 수 있습니다.
              </p>
            </div>

            {/* 카테고리 필터 탭 */}
            <div className="flex flex-wrap gap-2">
              {CASE_CATEGORIES.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-sm px-3.5 py-2 text-xs font-bold transition-colors sm:text-sm ${
                      active
                        ? "bg-[#0F172A] text-[#C9A24D]"
                        : "border border-slate-200 bg-slate-50 text-slate-700 hover:border-[#C9A24D] hover:text-[#0F172A]"
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCases.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveCase(item)}
                className="group flex min-w-0 flex-col justify-between rounded-sm border border-slate-200 bg-[#F8FAFC] p-6 text-left transition-all hover:border-[#C9A24D] hover:bg-white hover:shadow-lg"
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-sm bg-[#0F172A] px-2.5 py-1 text-[11px] font-bold text-[#C9A24D]">
                      {item.category}
                    </span>
                    <span className="rounded-sm border border-[#C9A24D]/40 bg-[#C9A24D]/10 px-2.5 py-1 text-[11px] font-bold text-[#8A6414]">
                      {item.resultBadge}
                    </span>
                  </div>
                  <h3 className="mt-4 font-serif text-lg leading-snug font-bold text-[#0F172A] group-hover:text-[#0F172A]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
                    {item.overview}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-xs text-slate-500">
                  <span>{item.clientType}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#0F172A] group-hover:text-[#9A7422]">
                    <span>상세보기</span>
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. 1:1 비밀상담 예약 섹션 */}
      <section
        id="secret-consult"
        className="border-t border-slate-800 bg-[#0B1120] py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* 좌측 안내 */}
            <div className="min-w-0 lg:col-span-5">
              <span className="text-xs font-bold tracking-[0.2em] text-[#C9A24D]">
                PRIVATE CONSULTATION
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold text-white sm:text-4xl">
                1:1 비밀상담 예약
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                모든 상담 내용은 외부로 유출되지 않으며, 사건 자료를 미리
                첨부하시면 전담 변호사가 검토 후 보다 정밀한 1차 진단과 대응
                방향을 제시해 드립니다.
              </p>

              <div className="mt-8 space-y-4 rounded-sm border border-slate-800 bg-[#0F172A] p-6">
                <div className="flex items-start gap-3">
                  <Lock className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A24D]" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      사건자료 암호화 첨부 및 비밀유지
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      고소장, 공소장, 계약서, 등기부등본 등 비공개 문서를
                      첨부하여 사전 검토를 요청하실 수 있습니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A24D]" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      자동 스팸 방어 시스템 적용
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      비정상 자동화 봇 및 허위 광고성 접수를 차단하는 보안
                      필터링이 상시 작동하고 있습니다.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#C9A24D]" />
                  <div>
                    <div className="text-sm font-bold text-white">
                      오시는 길 · 상담시간
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      서울 서초구 서초대로 272 정율빌딩 12층 (교대역 9번 출구)
                      <br />
                      평일 09:00 ~ 19:00 (긴급 형사사건 24시간 핫라인)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 예약 폼 */}
            <div className="min-w-0 lg:col-span-7">
              <div className="rounded-sm border border-[#C9A24D]/30 bg-[#0F172A] p-6 shadow-2xl sm:p-8">
                {submittedData ? (
                  <div className="py-6">
                    <div className="flex items-center gap-2.5 text-[#C9A24D]">
                      <CheckCircle2 className="h-7 w-7 shrink-0" />
                      <h3 className="font-serif text-xl font-bold text-white">
                        1:1 비밀상담 예약이 접수되었습니다
                      </h3>
                    </div>

                    <div className="mt-5 space-y-2.5 rounded-sm border border-slate-800 bg-[#1E293B]/60 p-4 text-xs sm:text-sm">
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">상담 분야</span>
                        <span className="font-bold text-[#C9A24D]">
                          {submittedData.field}
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">희망 일정</span>
                        <span className="font-semibold text-white">
                          {submittedData.date} ({submittedData.time})
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">의뢰인</span>
                        <span className="font-semibold text-white">
                          {submittedData.name} ({submittedData.phone})
                        </span>
                      </div>
                      <div className="flex justify-between gap-2">
                        <span className="text-slate-400">첨부 자료</span>
                        <span className="font-semibold text-slate-200">
                          {submittedData.fileCount}건
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 rounded-sm border border-[#C9A24D]/40 bg-[#C9A24D]/10 px-4 py-3 text-xs leading-relaxed text-[#E2C478]">
                      <p>
                        ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가
                        기록되었습니다.
                      </p>
                      <Link
                        href="/admin/inquiries"
                        className="inline-block font-bold text-emerald-300 underline underline-offset-4 hover:text-emerald-200"
                      >
                        관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
                      </Link>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSubmittedData(null);
                        setClientName("");
                        setClientPhone("");
                        setSummary("");
                        setAttachedFiles([]);
                      }}
                      className="mt-5 inline-flex items-center gap-1.5 rounded-sm border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:border-[#C9A24D] hover:text-[#C9A24D]"
                    >
                      <span>새로운 비밀상담 작성하기</span>
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleConsultSubmit} className="space-y-5">
                    {/* 허니팟 스팸 방어 필드 (시각적 숨김) */}
                    <div className="hidden" aria-hidden="true">
                      <label htmlFor="law-hp">Leave this empty</label>
                      <input
                        id="law-hp"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300">
                        상담 분야 선택 *
                      </label>
                      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {(
                          ["형사", "이혼/가사", "기업자문", "부동산"] as ConsultField[]
                        ).map((field) => {
                          const selected = consultField === field;
                          return (
                            <button
                              key={field}
                              type="button"
                              onClick={() => setConsultField(field)}
                              className={`rounded-sm border px-3 py-2.5 text-xs font-bold transition-colors ${
                                selected
                                  ? "border-[#C9A24D] bg-[#C9A24D] text-[#0F172A]"
                                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-500"
                              }`}
                            >
                              {field}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="law-date"
                          className="block text-xs font-semibold text-slate-300"
                        >
                          희망 상담 날짜 *
                        </label>
                        <div className="relative mt-1.5">
                          <Calendar className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#C9A24D]" />
                          <input
                            id="law-date"
                            type="date"
                            value={hopeDate}
                            onChange={(e) => setHopeDate(e.target.value)}
                            className="w-full rounded-sm border border-slate-700 bg-slate-900 py-2.5 pr-3 pl-9 text-sm text-white focus:border-[#C9A24D] focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="law-time"
                          className="block text-xs font-semibold text-slate-300"
                        >
                          희망 시간대
                        </label>
                        <select
                          id="law-time"
                          value={hopeTime}
                          onChange={(e) => setHopeTime(e.target.value)}
                          className="mt-1.5 w-full rounded-sm border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-[#C9A24D] focus:outline-none"
                        >
                          <option value="오전 10:00 ~ 12:00">
                            오전 10:00 ~ 12:00
                          </option>
                          <option value="오후 2:00 ~ 4:00">
                            오후 2:00 ~ 4:00
                          </option>
                          <option value="오후 4:00 ~ 7:00">
                            오후 4:00 ~ 7:00
                          </option>
                          <option value="긴급 야간·주말 상담 요청">
                            긴급 야간·주말 상담 요청
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="law-name"
                          className="block text-xs font-semibold text-slate-300"
                        >
                          성함 (가명 가능) *
                        </label>
                        <input
                          id="law-name"
                          type="text"
                          placeholder="예: 홍길동"
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          className="mt-1.5 w-full rounded-sm border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#C9A24D] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="law-phone"
                          className="block text-xs font-semibold text-slate-300"
                        >
                          연락처 *
                        </label>
                        <input
                          id="law-phone"
                          type="tel"
                          placeholder="010-0000-0000"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="mt-1.5 w-full rounded-sm border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#C9A24D] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="law-summary"
                        className="block text-xs font-semibold text-slate-300"
                      >
                        사건 개요 (선택)
                      </label>
                      <textarea
                        id="law-summary"
                        rows={3}
                        placeholder="현재 진행 상황이나 핵심 쟁점을 간략히 남겨주시면 전담 변호사가 사전 검토 후 연락드립니다."
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        className="mt-1.5 w-full rounded-sm border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#C9A24D] focus:outline-none"
                      />
                    </div>

                    {/* 비공개 사건자료 파일 첨부 UI */}
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <label className="text-xs font-semibold text-slate-300">
                          비공개 사건자료 첨부 (최대 5개)
                        </label>
                        <span className="inline-flex items-center gap-1 text-[11px] text-[#C9A24D]">
                          <Lock className="h-3 w-3" />
                          <span>비공개 암호화 전송</span>
                        </span>
                      </div>

                      <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-slate-700 bg-slate-900/70 px-4 py-4 text-xs text-slate-300 transition-colors hover:border-[#C9A24D] hover:text-white">
                        <Upload className="h-4 w-4 text-[#C9A24D]" />
                        <span>
                          고소장 · 계약서 · 판결문 등 파일 선택 (PDF, JPG, PNG,
                          DOCX)
                        </span>
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.hwp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      {attachedFiles.length > 0 && (
                        <ul className="mt-2.5 space-y-1.5">
                          {attachedFiles.map((file, idx) => (
                            <li
                              key={`${file.name}-${idx}`}
                              className="flex items-center justify-between gap-2 rounded-sm border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <FileText className="h-3.5 w-3.5 shrink-0 text-[#C9A24D]" />
                                <span className="truncate">{file.name}</span>
                                <span className="shrink-0 text-[11px] text-slate-400">
                                  ({Math.max(1, Math.round(file.size / 1024))}
                                  KB)
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(idx)}
                                aria-label="첨부파일 삭제"
                                className="shrink-0 rounded-sm p-1 text-slate-400 hover:bg-slate-800 hover:text-rose-400"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {formError && (
                      <p className="text-xs font-semibold text-rose-400">
                        {formError}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#C9A24D]" />
                        <span>자동 스팸 방어 및 봇 차단 보안 적용됨</span>
                      </span>
                      <span>변호사법 제26조 비밀보장</span>
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#C9A24D] py-3.5 text-sm font-bold text-[#0F172A] transition-colors hover:bg-[#E2C478]"
                    >
                      <Lock className="h-4 w-4" />
                      <span>1:1 비밀상담 예약 신청하기</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className="border-t border-slate-800 bg-[#070B14] py-10 text-xs text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 font-serif text-sm font-bold tracking-widest text-white">
              <Scale className="h-4 w-4 text-[#C9A24D]" />
              <span>법무법인 정율 (JUNGYUL LAW FIRM)</span>
            </div>
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#C9A24D]" />
                서울 서초구 서초대로 272 정율빌딩 12층
              </span>
              <span>|</span>
              <span>광고책임변호사: 강정율</span>
              <span>|</span>
              <span>사업자등록번호: 214-88-09210</span>
            </p>
          </div>
          <p className="shrink-0 text-slate-500">
            © 2026 JUNGYUL LAW FIRM. All rights reserved.
          </p>
        </div>
      </footer>

      {/* 승소사례 상세 모달 */}
      {activeCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
          onClick={() => setActiveCase(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-[#C9A24D]/40 bg-[#0F172A] p-6 text-slate-100 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-[#C9A24D] px-2.5 py-0.5 text-[11px] font-bold text-[#0F172A]">
                    {activeCase.category}
                  </span>
                  <span className="rounded-sm border border-[#C9A24D]/40 px-2.5 py-0.5 text-[11px] font-semibold text-[#C9A24D]">
                    {activeCase.resultBadge}
                  </span>
                </div>
                <h3 className="mt-3 font-serif text-xl leading-snug font-bold text-white sm:text-2xl">
                  {activeCase.title}
                </h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                  <span>의뢰인: {activeCase.clientType}</span>
                  <span>|</span>
                  <span>소요기간: {activeCase.duration}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                aria-label="닫기"
                className="shrink-0 rounded-sm p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-5 text-sm">
              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#C9A24D]">
                  01. 사건 개요
                </h4>
                <p className="mt-2 leading-relaxed text-slate-300">
                  {activeCase.overview}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold tracking-wider text-[#C9A24D]">
                  02. 핵심 쟁점 및 정율의 대응 전략
                </h4>
                <ul className="mt-2 space-y-2 text-slate-300">
                  {activeCase.issues.map((issue) => (
                    <li key={issue} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24D]" />
                      <span>{issue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-sm border border-[#C9A24D]/30 bg-[#1E293B]/70 p-4">
                <h4 className="text-xs font-bold tracking-wider text-[#C9A24D]">
                  03. 최종 결과
                </h4>
                <p className="mt-2 leading-relaxed font-medium text-white">
                  {activeCase.outcome}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-slate-800 pt-5">
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                className="rounded-sm border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => jumpToConsultWithField(activeCase.category)}
                className="inline-flex items-center gap-1.5 rounded-sm bg-[#C9A24D] px-5 py-2.5 text-xs font-bold text-[#0F172A] hover:bg-[#E2C478]"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>유사 사건 1:1 비밀상담 신청</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
