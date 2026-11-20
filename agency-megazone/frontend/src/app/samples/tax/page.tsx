"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { clientApiFetch } from "@/lib/api";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck2,
  FileSpreadsheet,
  Lock,
  MapPin,
  Menu,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Trash2,
  TrendingDown,
  Upload,
  X,
} from "lucide-react";

type CaseCategory = "전체" | "법인·절세" | "세무조사" | "상속·증여" | "병의원·이커머스";
type BusinessType = "개인사업자" | "법인사업자" | "신규 창업";
type RevenueTier = "1억 미만" | "1억~5억" | "5억~15억" | "15억 이상";
type StaffTier = "0명 (1인)" | "1~4명" | "5~15명" | "16명 이상";
type IndustryType = "일반 서비스·IT" | "병의원·전문직" | "이커머스·유통" | "제조·건설";

interface TaxCase {
  id: number;
  category: Exclude<CaseCategory, "전체">;
  metricValue: string;
  metricLabel: string;
  title: string;
  clientType: string;
  period: string;
  overview: string;
  points: string[];
  outcome: string;
}

interface AdvisorProfile {
  id: number;
  name: string;
  role: string;
  badge: string;
  image: string;
  credential: string;
  specialty: string;
  career: string[];
  quote: string;
}

const TRUST_METRICS = [
  { value: "1,850+", label: "누적 기장·자문 고객사" },
  { value: "국세청 출신", label: "조사국 경력 전담팀" },
  { value: "전 과정", label: "대표 세무사 직접 검토" },
  { value: "매월 10일", label: "월간 손익 리포트 발송" },
] as const;

const PRACTICE_AREAS = [
  {
    id: "corp",
    number: "01",
    title: "법인전환 · 법인세 절세 설계",
    subtitle: "성실신고확인대상 진입 전 최적의 전환 로드맵",
    summary:
      "매출 성장에 따른 개인사업자의 높은 누진세율 부담을 줄이기 위해 영업권 평가, 가지급금 정리, 대표이사 급여·배당 비율을 정밀 설계합니다.",
    deliverables: [
      "포괄양수도 vs 현물출자 유불리 시뮬레이션",
      "개인 영업권 감정평가를 통한 자금 회수 설계",
      "고용증대 · 연구전담부서 세액공제 사전 검토",
    ],
  },
  {
    id: "medical",
    number: "02",
    title: "병의원 · 전문직 특화 기장",
    subtitle: "비급여 정산 및 의료기기 투자세액공제 전담",
    summary:
      "일반 업종과 다른 병의원의 급여·비급여 매출 구조, 카드·현금영수증 정산, 페이닥터·간호 인력 4대보험 세액공제를 업종 기준에 맞춰 관리합니다.",
    deliverables: [
      "월간 진료과목·결제수단별 매출 정산 대사",
      "고액 의료장비 감가상각 및 투자세액공제 반영",
      "개원 초기 5개년 경정청구 누락분 전수 점검",
    ],
  },
  {
    id: "commerce",
    number: "03",
    title: "이커머스 · 다채널 플랫폼 정산",
    subtitle: "스마트스토어·쿠팡·PG사 매출 누락·과다납부 방지",
    summary:
      "플랫폼별 수수료, 쿠폰 할인, 반품·해외결제가 뒤섞이는 이커머스 업종의 정산 데이터를 표준화해 부가세 과다 납부를 원천 차단합니다.",
    deliverables: [
      "오픈마켓·자사몰·PG사 정산 내역 교차 검증",
      "플랫폼 부담 쿠폰 매출과세 제외 적정성 검토",
      "월별 실마진율 및 예상 부가세 적립 가이드",
    ],
  },
  {
    id: "audit",
    number: "04",
    title: "세무조사 대응 · 상속·증여",
    subtitle: "국세청 조사국 출신 세무사의 사전 소명·입회",
    summary:
      "정기·비정기 세무조사 통지 단계부터 예상 쟁점 시뮬레이션, 의견서 제출, 과세전적부심사까지 동행하며, 사전 증여·가업승계를 함께 설계합니다.",
    deliverables: [
      "조사 통지 즉시 쟁점 분석 및 모의 문답 진행",
      "부담부증여 · 감정평가 시점 조율 절세 설계",
      "자금출처 조사 대비 증빙 사전 아카이빙",
    ],
  },
] as const;

const TAX_CASES: TaxCase[] = [
  {
    id: 1,
    category: "법인·절세",
    metricValue: "4,200만 원",
    metricLabel: "연간 세부담 절감",
    title: "성실신고 직전 IT·마케팅 에이전시 법인전환",
    clientType: "연 매출 14억 개인사업자",
    period: "4주",
    overview:
      "영업권 감정평가와 대표이사 급여·배당 분산을 결합해 개인 유지 대비 연간 세액을 대폭 경감했습니다.",
    points: [
      "개인사업자 영업권 평가를 통한 합법적 법인 자금 회수 구조 마련",
      "청년고용·통합고용 세액공제 및 연구전담부서 세액공제 동시 적용",
      "대표이사 급여·배당 비율 시뮬레이션으로 종합소득세 누진구간 분산",
    ],
    outcome:
      "법인 전환 첫해 기준 개인 유지 대비 연간 약 4,200만 원의 세부담을 경감하고, 자본금 유보 여력을 확보했습니다.",
  },
  {
    id: 2,
    category: "세무조사",
    metricValue: "85% 감액",
    metricLabel: "추징 예상액 방어",
    title: "지방국세청 개인통합 세무조사 소명 및 방어",
    clientType: "도소매·유통 법인",
    period: "6주",
    overview:
      "실물 거래 입증 자료 체계화와 과세전적부심사 의견서 제출로 초기 과세예고 세액의 대부분을 방어했습니다.",
    points: [
      "국세청 조사국 출신 세무사의 사전 모의 문답 및 소명 자료 체계화",
      "실물 거래 입증(운송장·발주서·입출고 대장)으로 가공경비 오인 해소",
      "과세전적부심사 단계의 논리적 의견서 제출로 가산세 최소화",
    ],
    outcome:
      "초기 과세예고 통지 금액 대비 약 85%를 감액 방어하며 추가 형사 고발 없이 종결했습니다.",
  },
  {
    id: 3,
    category: "병의원·이커머스",
    metricValue: "2,850만 원",
    metricLabel: "경정청구 세액 환급",
    title: "개원 치과·피부과 고용·투자 세액공제 환급",
    clientType: "강남 소재 의원 원장",
    period: "5주",
    overview:
      "기존 기장 과정에서 누락된 신규 채용 세액공제와 의료장비 투자세액공제를 5개년치 재검토해 환급받았습니다.",
    points: [
      "청년 정규직 순증 인원 재산정 및 사후관리 요건 충족 여부 검증",
      "비급여·현금영수증 매출 정산 대사 프로세스 월간 자동화 구축",
      "차기년도 중간예납·종합소득세 분납 자금 스케줄 사전 안내",
    ],
    outcome:
      "과거 3개 귀속연도 경정청구를 통해 2,850만 원의 세액을 환급받고, 월간 손익 리포트 체계를 정착시켰습니다.",
  },
  {
    id: 4,
    category: "상속·증여",
    metricValue: "6,100만 원",
    metricLabel: "증여세 절세 설계",
    title: "수익형 상가 건물 부담부증여 및 지분 분산",
    clientType: "수도권 상가 보유자",
    period: "3주",
    overview:
      "임대보증금·대출 승계 유불리와 감정평가 시점을 정밀 조율해 단순 증여 대비 세 부담을 크게 낮췄습니다.",
    points: [
      "임대보증금·담보대출 승계에 따른 부담부증여 vs 단순증여 세액 정밀 비교",
      "감정평가 시점 조율을 통한 시가 평가 유리 구간 확보",
      "자녀의 취득자금 출처 소명서 사전 완비로 자금출처 조사 리스크 차단",
    ],
    outcome:
      "단순 증여 대비 총 세부담을 약 6,100만 원 절감하며 안전하게 등기 이전을 마쳤습니다.",
  },
  {
    id: 5,
    category: "병의원·이커머스",
    metricValue: "6개 채널",
    metricLabel: "정산·부가세 표준화",
    title: "월 3억 규모 다채널 패션 이커머스 정산 대사",
    clientType: "온라인 커머스 법인",
    period: "2주",
    overview:
      "오픈마켓과 PG사의 쿠폰·수수료 매출 중복 과세를 바로잡고 매월 10일 손익 결산 체계를 구축했습니다.",
    points: [
      "채널별 정산 데이터 표준화 및 플랫폼 부담 쿠폰 매출과세 제외 검증",
      "해외 직구·수입 매입세액 공제 증빙(수입세금계산서) 누락분 전액 반영",
      "월별 실제 마진율과 예상 부가세·법인세 적립액 대시보드 제공",
    ],
    outcome:
      "기장 이관 첫 분기부터 과다 신고되던 부가세 구조를 바로잡고, 매월 10일 전월 손익 결산 체계를 완성했습니다.",
  },
  {
    id: 6,
    category: "법인·절세",
    metricValue: "3.5억 원",
    metricLabel: "누적 가지급금 해소",
    title: "제조법인 가지급금·미처분이익잉여금 정비",
    clientType: "업력 11년 제조법인",
    period: "6주",
    overview:
      "직무발명보상제도 및 급여·배당 구조 재설계로 장기 누적 가지급금을 정리하고 신용등급을 개선했습니다.",
    points: [
      "특허권·직무발명보상제도 활용 및 대표자 급여·배당 구조 재설계",
      "이익소각(자기주식 취득) 적법 절차 검토로 상법·세법 리스크 동시 점검",
      "정책자금·기업부설연구소 사후관리를 위한 결산 재무제표 건전화",
    ],
    outcome:
      "가지급금 3.5억 원을 세법상 적법한 절차로 전액 정리하고, 차기년도 기업 신용평가 등급을 2단계 상향했습니다.",
  },
];

const CASE_FILTERS: CaseCategory[] = [
  "전체",
  "법인·절세",
  "세무조사",
  "상속·증여",
  "병의원·이커머스",
];

const TAX_SCHEDULES = [
  {
    day: "매월 10일",
    badge: "정기 신고",
    title: "원천세 신고·납부 및 4대보험 반영",
  },
  {
    day: "매월 10일",
    badge: "현율 리포트",
    title: "전월 손익 결산 및 예상 세액 브리핑",
  },
  {
    day: "25일",
    badge: "부가세 점검",
    title: "부가가치세 예정고지 확인 및 매입 점검",
  },
  {
    day: "매월 말일",
    badge: "지급명세서",
    title: "일용근로·간이지급명세서 전자신고 마감",
  },
] as const;

const TAX_BRIEFINGS = [
  {
    id: "brief-1",
    tag: "법인전환",
    date: "2026.11",
    author: "강현율 대표 세무사",
    title: "성실신고확인대상 매출 기준 직전, 법인전환을 검토해야 하는 3가지 이유",
    summary:
      "개인사업자 최고세율 구간 진입 전, 영업권 평가와 대표이사 급여·배당 분산을 활용하면 세부담과 건보료 부담을 동시에 낮출 수 있습니다.",
  },
  {
    id: "brief-2",
    tag: "경정청구",
    date: "2026.11",
    author: "이서진 파트너 세무사",
    title: "최근 5년 내 직원을 1명이라도 늘렸다면? 통합고용세액공제 환급 체크",
    summary:
      "청년 정규직·경력단절여성 채용 시 1인당 수백만 원의 세액공제가 가능하지만, 사후관리 요건과 기존 기장 누락으로 혜택을 못 받는 사업장이 많습니다.",
  },
  {
    id: "brief-3",
    tag: "재산제세",
    date: "2026.11",
    author: "박도현 파트너 세무사",
    title: "수익형 부동산·상가 사전 증여 시 '부담부증여'가 항상 유리할까?",
    summary:
      "임대보증금·대출 승계분에는 양도소득세가 과세되므로, 증여자의 기존 보유 주택 수와 양도차익 규모에 따라 단순증여와 정밀 비교 후 실행해야 합니다.",
  },
] as const;

const ADVISORS: AdvisorProfile[] = [
  {
    id: 1,
    name: "강현율",
    role: "대표 세무사",
    badge: "세무조사 전문",
    image: "/images/samples/tax-advisor1.jpg",
    credential: "세무사 시험 48회 · 전 서울지방국세청 조사국",
    specialty: "세무조사 대응 · 법인전환 · 조세불복",
    career: [
      "연세대학교 경제학과 졸업",
      "전) 서울지방국세청 조사1국·조사4국 실무 경력",
      "전) 대형 회계법인 조세자문본부 매니저",
      "현) 한국세무사회 조세제도연구위원",
    ],
    quote: "숫자 뒤에 숨은 사업의 흐름까지 읽어내는 것이 진짜 세무 자문입니다.",
  },
  {
    id: 2,
    name: "이서진",
    role: "파트너 세무사",
    badge: "법인·병의원",
    image: "/images/samples/tax-advisor2.jpg",
    credential: "세무사 시험 52회 · 고려대학교 경영학 석사",
    specialty: "병의원 기장 · 이커머스 정산 · 고용세액공제",
    career: [
      "고려대학교 경영학과 졸업 및 동 대학원 조세법 석사",
      "전) 강남 메디컬 특화 세무그룹 팀장",
      "다수 성형외과·치과·스타트업 경정청구 환급 자문",
      "현) 중소기업벤처부 창업멘토링 세무 자문위원",
    ],
    quote: "매달 받아보는 손익 리포트 한 장이 대표님의 의사결정을 가볍게 만듭니다.",
  },
  {
    id: 3,
    name: "박도현",
    role: "파트너 세무사",
    badge: "상속·증여",
    image: "/images/samples/tax-advisor3.jpg",
    credential: "세무사 시험 50회 · 재산제세 전문",
    specialty: "상속·증여 · 가업승계 · 양도소득세",
    career: [
      "성균관대학교 경영학과 졸업",
      "전) 국세청 국선세무대리인 · 재산제세 전담",
      "고액 자산가·부동산 법인 승계 컨설팅 400건 이상 수행",
      "현) 대한상공회의소 가업승계 세무 강사",
    ],
    quote: "재산제세는 사후 신고가 아니라, 사전 설계 단계에서 결과가 결정됩니다.",
  },
];

export default function TaxSamplePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePracticeId, setActivePracticeId] = useState<string>("corp");
  const [openBriefingId, setOpenBriefingId] = useState<string>("brief-1");
  const [selectedFilter, setSelectedFilter] = useState<CaseCategory>("전체");
  const [activeCase, setActiveCase] = useState<TaxCase | null>(null);

  // 월 기장료 · 법인전환 절세 시뮬레이터 상태
  const [bizType, setBizType] = useState<BusinessType>("개인사업자");
  const [revenue, setRevenue] = useState<RevenueTier>("1억~5억");
  const [staff, setStaff] = useState<StaffTier>("1~4명");
  const [industry, setIndustry] = useState<IndustryType>("일반 서비스·IT");

  // 1:1 비공개 세무 진단 신청 폼 상태
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [consultTopic, setConsultTopic] = useState("월 세무기장·절세 상담");
  const [consultContent, setConsultContent] = useState("");
  const [attachmentMediaId, setAttachmentMediaId] = useState<number | null>(null);
  const [attachmentName, setAttachmentName] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const activePractice = useMemo(
    () => PRACTICE_AREAS.find((a) => a.id === activePracticeId) || PRACTICE_AREAS[0],
    [activePracticeId]
  );

  const simulation = useMemo(() => {
    let baseMin = bizType === "법인사업자" ? 15 : 10;
    let baseMax = bizType === "법인사업자" ? 20 : 14;

    if (revenue === "1억~5억") {
      baseMin += 3;
      baseMax += 5;
    } else if (revenue === "5억~15억") {
      baseMin += 8;
      baseMax += 12;
    } else if (revenue === "15억 이상") {
      baseMin += 15;
      baseMax += 22;
    }

    if (staff === "1~4명") {
      baseMin += 2;
      baseMax += 3;
    } else if (staff === "5~15명") {
      baseMin += 5;
      baseMax += 8;
    } else if (staff === "16명 이상") {
      baseMin += 10;
      baseMax += 15;
    }

    if (industry === "병의원·전문직" || industry === "제조·건설") {
      baseMin += 5;
      baseMax += 8;
    } else if (industry === "이커머스·유통") {
      baseMin += 3;
      baseMax += 5;
    }

    const savingPotential =
      revenue === "15억 이상"
        ? 88
        : revenue === "5억~15억"
        ? 76
        : revenue === "1억~5억"
        ? 58
        : 42;

    const corpSignal =
      bizType === "개인사업자" && (revenue === "5억~15억" || revenue === "15억 이상")
        ? {
            label: "법인전환 적극 검토 구간",
            desc: "성실신고확인대상 진입 또는 최고 누진세율 구간으로, 영업권 평가 기반 법인전환 시 유의미한 절세가 가능합니다.",
          }
        : bizType === "법인사업자"
        ? {
            label: "법인 세액공제 · 대표 급여 최적화 구간",
            desc: "고용증대 세액공제, 가지급금 관리 및 대표이사 급여·배당 비율 조정을 통해 법인세와 소득세를 함께 줄일 수 있습니다.",
          }
        : {
            label: "초기 세액감면 · 장부 기장 기초 세팅 구간",
            desc: "창업중소기업 세액감면 요건(지역·연령·업종) 검토 및 초기 매입세액 누락 방지가 가장 중요한 단계입니다.",
          };

    const checkpoints = [
      industry === "이커머스·유통"
        ? "오픈마켓·PG사 정산 수수료 및 쿠폰 매출 부가세 과표 정밀 대사"
        : industry === "병의원·전문직"
        ? "의료기기 투자세액공제 및 비급여·현금영수증 월간 정산 관리"
        : "통합고용 세액공제 및 창업·중소기업 특별세액감면 적용 여부 점검",
      bizType === "신규 창업"
        ? "사업 초기 인테리어·설비 매입 부가세 조기환급 신청 검토"
        : "전년도 귀속 누락 공제 항목 경정청구(최근 5년) 환급 가능성 진단",
      "매월 10일 전월 손익 추정치 및 예상 납부세액 사전 안내 제공",
    ];

    return {
      minFee: baseMin,
      maxFee: baseMax,
      savingPotential,
      corpSignal,
      checkpoints,
    };
  }, [bizType, revenue, staff, industry]);

  const filteredCases = useMemo(() => {
    if (selectedFilter === "전체") return TAX_CASES;
    return TAX_CASES.filter((c) => c.category === selectedFilter);
  }, [selectedFilter]);

  function scrollToSection(id: string) {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  function applySimulationToForm() {
    const summaryText = `[시뮬레이션 조건] ${bizType} / 연 매출 ${revenue} / 직원 ${staff} / 업종: ${industry} (예상 기장료 월 ${simulation.minFee}~${simulation.maxFee}만 원)\n\n위 조건 기준으로 정밀 절세 진단 및 맞춤 기장료 견적을 요청합니다.`;
    setConsultTopic(
      bizType === "개인사업자" && (revenue === "5억~15억" || revenue === "15억 이상")
        ? "법인전환 · 절세 컨설팅"
        : "월 세무기장·절세 상담"
    );
    setConsultContent(summaryText);
    scrollToSection("tax-consult");
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/inquiries/attachment", {
        method: "POST",
        body: formData,
      });
      const json = (await res.json()) as {
        success: boolean;
        message?: string;
        data?: { id: number; originalFilename: string };
      };
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "파일 업로드 실패");
      }
      setAttachmentMediaId(json.data.id);
      setAttachmentName(json.data.originalFilename);
    } catch {
      setAttachmentMediaId(null);
      setAttachmentName(file.name);
    } finally {
      setUploadingFile(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      category: "ESTIMATE",
      customerName: clientName.trim() || "샘플 체험 고객",
      customerPhone: clientPhone.trim(),
      customerEmail: null,
      title: `[샘플체험-세무법인] ${consultTopic}`,
      content:
        consultContent.trim() ||
        `${consultTopic} 관련 비공개 세무 진단을 요청합니다.`,
      customFieldsJson: JSON.stringify({
        sampleSource: "tax-consult",
        consultTopic,
        bizType,
        revenue,
        industry,
        attachedFileName: attachmentName || undefined,
      }),
      attachmentMediaId,
      privacyAgreed,
      websiteUrl,
    };

    try {
      await clientApiFetch("/api/v1/inquiries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      try {
        const raw = localStorage.getItem("demo_sample_inquiries");
        const prev = raw ? (JSON.parse(raw) as unknown[]) : [];
        const nextItem = {
          id: Date.now(),
          ...payload,
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };
        localStorage.setItem(
          "demo_sample_inquiries",
          JSON.stringify([nextItem, ...(Array.isArray(prev) ? prev : [])])
        );
      } catch {
        // ignore storage errors
      }
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-900 antialiased">
      {/* 1. 최상단 데모 안내 띠 */}
      <div className="bg-[#062119] px-3 py-2 text-center text-[11px] font-medium text-emerald-100/90 sm:text-xs">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <span>현재 보고 계신 페이지는 업종별 맞춤형 구축 데모 샘플입니다.</span>
          <Link
            href="/admin/inquiries"
            className="font-bold text-[#E2C68D] underline decoration-[#E2C68D]/60 underline-offset-2 transition hover:text-white"
          >
            관리자(/admin/inquiries)에서 방금 남긴 문의 확인하기 →
          </Link>
        </div>
      </div>

      {/* 2. Sticky 퓨어 화이트 헤더 */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-sm bg-[#0B3B2D] font-serif text-base font-bold text-[#E2C68D]">
              玄
            </span>
            <div>
              <div className="font-serif text-base font-bold tracking-tight text-slate-900 sm:text-lg">
                세무법인 현율
              </div>
              <div className="text-[10px] font-semibold tracking-[0.18em] text-[#C5A059]">
                HYUNYUL TAX &amp; ADVISORY
              </div>
            </div>
          </button>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            <button
              type="button"
              onClick={() => scrollToSection("practice-areas")}
              className="transition hover:text-[#0B3B2D]"
            >
              전문 분야
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("fee-simulator")}
              className="transition hover:text-[#0B3B2D]"
            >
              기장료·절세 계산기
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("tax-cases")}
              className="transition hover:text-[#0B3B2D]"
            >
              절세·조사 사례
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("advisors")}
              className="transition hover:text-[#0B3B2D]"
            >
              세무사 소개
            </button>
          </nav>

          <div className="hidden items-center gap-2.5 lg:flex">
            <a
              href="tel:02-558-8200"
              className="inline-flex items-center gap-1.5 rounded-sm border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 transition hover:border-[#0B3B2D] hover:text-[#0B3B2D]"
            >
              <Phone className="h-3.5 w-3.5 text-[#0B3B2D]" />
              <span>02-558-8200</span>
            </a>
            <button
              type="button"
              onClick={() => scrollToSection("tax-consult")}
              className="inline-flex items-center gap-1.5 rounded-sm bg-[#0B3B2D] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#082B20]"
            >
              <Lock className="h-3.5 w-3.5 text-[#E2C68D]" />
              <span>1:1 무료 세무진단</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-sm border border-slate-200 bg-white p-2 text-slate-800 lg:hidden"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
            <div className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
              <button
                type="button"
                onClick={() => scrollToSection("practice-areas")}
                className="rounded-sm px-3 py-2 text-left hover:bg-slate-50"
              >
                전문 분야
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("fee-simulator")}
                className="rounded-sm px-3 py-2 text-left hover:bg-slate-50"
              >
                기장료·절세 계산기
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("tax-cases")}
                className="rounded-sm px-3 py-2 text-left hover:bg-slate-50"
              >
                절세·조사 사례
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("advisors")}
                className="rounded-sm px-3 py-2 text-left hover:bg-slate-50"
              >
                세무사 소개
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("tax-consult")}
                className="mt-2 rounded-sm bg-[#0B3B2D] px-3 py-2.5 text-center text-xs font-bold text-white"
              >
                1:1 무료 세무진단 신청
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. PB 라운지 스타일 2단 히어로 (딥 에메랄드 + 우측 선명한 tax-hero.jpg) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#07271E] via-[#0B3B2D] to-[#0E4837] py-14 text-white sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#C5A059]/10 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
            {/* 좌측 카피 */}
            <div className="min-w-0 lg:col-span-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/45 bg-[#062119]/60 px-4 py-1.5 text-xs font-bold text-[#E2C68D]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>국세청 조사국 출신 · 프라이빗 세무 자문</span>
              </div>

              <h1 className="mt-6 font-serif text-3xl font-bold leading-[1.2] tracking-tight text-white sm:text-5xl">
                세무는 단순 신고가 아닌
                <br />
                <span className="text-[#E2C68D]">기업의 자산을 지키는 전략</span>입니다
              </h1>

              <p className="mt-5 text-sm leading-relaxed text-emerald-50/85 sm:text-base">
                전 과정 대표·파트너 세무사 직접 검토 원칙으로, 매월 10일 손익 리포트부터
                법인전환, 경정청구, 세무조사 방어까지 흔들리지 않는 세무 파트너가 되어드립니다.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => scrollToSection("fee-simulator")}
                  className="inline-flex items-center gap-2 rounded-sm bg-[#C5A059] px-6 py-3.5 text-sm font-extrabold text-[#07271E] shadow-lg transition hover:bg-[#E2C68D]"
                >
                  <Calculator className="h-4 w-4" />
                  <span>30초 기장료·절세 계산하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection("tax-consult")}
                  className="inline-flex items-center gap-2 rounded-sm border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:border-[#C5A059] hover:text-[#E2C68D]"
                >
                  <span>1:1 비공개 세무진단</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 우측 선명한 tax-hero.jpg 라운지 비주얼 */}
            <div className="min-w-0 lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-[#C5A059]/35 bg-[#062119] shadow-2xl">
                <img
                  src="/images/samples/tax-hero.jpg"
                  alt="세무법인 현율 강남 프라이빗 라운지"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/samples/fallback.svg";
                  }}
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#062119]/75 via-transparent to-transparent" />
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 rounded-sm border border-white/15 bg-[#062119]/85 px-4 py-3 backdrop-blur-md">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.18em] text-[#E2C68D] uppercase">
                      PRIVATE TAX ADVISORY
                    </div>
                    <div className="mt-0.5 text-xs font-semibold text-white sm:text-sm">
                      매월 10일 전월 손익 및 예상 세액 리포트 발송
                    </div>
                  </div>
                  <Award className="h-5 w-5 shrink-0 text-[#E2C68D]" />
                </div>
              </div>
            </div>
          </div>

          {/* 하단 신뢰 지표 4종 */}
          <div className="mt-12 grid grid-cols-2 gap-3 border-t border-white/15 pt-8 sm:grid-cols-4 sm:gap-4">
            {TRUST_METRICS.map((m) => (
              <div
                key={m.label}
                className="rounded-sm border border-white/15 bg-white/5 p-4 backdrop-blur-sm"
              >
                <div className="font-serif text-xl font-bold text-[#E2C68D] sm:text-2xl">
                  {m.value}
                </div>
                <div className="mt-1 text-xs font-medium text-emerald-50/85">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-1. 권위 · 인증 띠 + 5대 핵심 세무 퀵 메뉴 바 */}
      <section className="border-b border-slate-200 bg-slate-50 py-5">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {[
              {
                label: "법인세무기장",
                sub: "월간 손익 · 기장료 진단",
                icon: Building2,
                onClick: () => scrollToSection("fee-simulator"),
              },
              {
                label: "법인전환 컨설팅",
                sub: "영업권 평가 · 절세 로드맵",
                icon: TrendingDown,
                onClick: () => {
                  setActivePracticeId("corp");
                  scrollToSection("practice-areas");
                },
              },
              {
                label: "양도·상속·증여",
                sub: "재산제세 사전 승계 설계",
                icon: Briefcase,
                onClick: () => {
                  setSelectedFilter("상속·증여");
                  scrollToSection("tax-cases");
                },
              },
              {
                label: "세무조사 대응",
                sub: "조사국 출신 입회 · 소명",
                icon: ShieldCheck,
                onClick: () => {
                  setActivePracticeId("audit");
                  scrollToSection("practice-areas");
                },
              },
              {
                label: "경정청구 환급",
                sub: "최근 5년 누락 공제 점검",
                icon: RefreshCw,
                onClick: () => {
                  setConsultTopic("경정청구 (과거 세금 환급)");
                  scrollToSection("tax-consult");
                },
              },
            ].map((q) => {
              const QIcon = q.icon;
              return (
                <button
                  key={q.label}
                  type="button"
                  onClick={q.onClick}
                  className="group flex items-center gap-3 rounded-sm border border-slate-200 bg-white px-4 py-3 text-left shadow-2xs transition hover:border-[#0B3B2D] hover:bg-[#0B3B2D] hover:text-white"
                >
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-emerald-50 text-[#0B3B2D] transition group-hover:bg-[#C5A059] group-hover:text-[#07271E]">
                    <QIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-xs font-extrabold sm:text-sm">{q.label}</div>
                    <div className="truncate text-[10px] text-slate-500 group-hover:text-emerald-100">
                      {q.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. 4대 특화 전문 분야 — 비대칭 인터랙티브 + 월간 리포트 UI 프리뷰 */}
      <section id="practice-areas" className="scroll-mt-20 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                CORE ADVISORY AREAS
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-4xl">
                업종과 성장 단계에 맞춘 전담 세무 설계
              </h2>
            </div>
            <p className="text-xs text-slate-500 sm:text-sm">
              분야를 클릭하시면 실제 제공되는 세무 자문 내역을 확인하실 수 있습니다.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            {/* 좌측 4대 분야 리스트 */}
            <div className="space-y-3 lg:col-span-5">
              {PRACTICE_AREAS.map((area) => {
                const active = area.id === activePracticeId;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setActivePracticeId(area.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-sm border p-5 text-left transition ${
                      active
                        ? "border-[#0B3B2D] bg-[#0B3B2D] text-white shadow-md"
                        : "border-slate-200 bg-slate-50/70 text-slate-900 hover:border-[#0B3B2D]/40 hover:bg-white"
                    }`}
                  >
                    <div className="min-w-0">
                      <span
                        className={`font-serif text-xs font-bold ${
                          active ? "text-[#E2C68D]" : "text-[#C5A059]"
                        }`}
                      >
                        {area.number}
                      </span>
                      <div className="mt-1 text-base font-bold">{area.title}</div>
                      <div
                        className={`mt-0.5 truncate text-xs ${
                          active ? "text-emerald-100/85" : "text-slate-500"
                        }`}
                      >
                        {area.subtitle}
                      </div>
                    </div>
                    <ChevronRight
                      className={`h-4 w-4 shrink-0 ${
                        active ? "text-[#E2C68D]" : "text-slate-400"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* 우측 선택 상세 + 월간 손익 리포트 시각 프리뷰 */}
            <div className="flex flex-col justify-between rounded-sm border border-slate-200 bg-slate-50 p-6 sm:p-8 lg:col-span-7">
              <div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-bold text-[#C5A059]">
                      PART {activePractice.number}
                    </span>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-[#0B3B2D]">
                      {activePractice.title}
                    </h3>
                  </div>
                  <BarChart3 className="h-6 w-6 text-[#0B3B2D]" />
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {activePractice.summary}
                </p>

                <div className="mt-6 space-y-2.5">
                  <div className="text-xs font-bold text-slate-900">핵심 자문 제공 내역</div>
                  {activePractice.deliverables.map((d) => (
                    <div
                      key={d}
                      className="flex items-center gap-2.5 rounded-sm border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#0B3B2D]" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 월간 손익 리포트 미니 UI 카드 */}
              <div className="mt-6 rounded-sm border border-[#0B3B2D]/15 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#0B3B2D]">
                  <span>MONTHLY TAX BRIEFING PREVIEW (매월 10일 발송)</span>
                  <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] text-[#0B3B2D]">
                    대표자 전용 리포트
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-sm bg-slate-50 p-2.5">
                    <div className="text-[10px] text-slate-500">전월 추정 매출</div>
                    <div className="mt-0.5 text-sm font-extrabold text-slate-900">1억 4,200만</div>
                  </div>
                  <div className="rounded-sm bg-slate-50 p-2.5">
                    <div className="text-[10px] text-slate-500">매입·경비 반영률</div>
                    <div className="mt-0.5 text-sm font-extrabold text-[#0B3B2D]">68.4%</div>
                  </div>
                  <div className="rounded-sm bg-slate-50 p-2.5">
                    <div className="text-[10px] text-slate-500">예상 부가세 적립</div>
                    <div className="mt-0.5 text-sm font-extrabold text-[#C5A059]">410만 원</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 30초 월 기장료 · 법인전환 절세 시뮬레이터 */}
      <section
        id="fee-simulator"
        className="scroll-mt-20 border-y border-slate-200 bg-slate-50 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#0B3B2D] uppercase">
              TRANSPARENT FEE SIMULATOR
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              30초 예상 월 기장료 · 절세 포인트 진단
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              사업 형태와 매출 규모를 선택하시면 예상 월 기장료와 우선 점검해야 할 절세 전략을 즉시 확인하실 수 있습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-12">
            {/* 좌측 선택 패널 */}
            <div className="space-y-5 rounded-sm border border-slate-200 bg-white p-6 shadow-2xs lg:col-span-7">
              <div>
                <label className="mb-2 block text-xs font-bold text-slate-900">
                  1. 사업자 유형
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["개인사업자", "법인사업자", "신규 창업"] as BusinessType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBizType(type)}
                      className={`rounded-sm border px-3 py-2.5 text-xs font-bold transition sm:text-sm ${
                        bizType === type
                          ? "border-[#0B3B2D] bg-[#0B3B2D] text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0B3B2D]/40"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-900">
                  2. 연 매출 규모
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["1억 미만", "1억~5억", "5억~15억", "15억 이상"] as RevenueTier[]).map(
                    (rev) => (
                      <button
                        key={rev}
                        type="button"
                        onClick={() => setRevenue(rev)}
                        className={`rounded-sm border px-3 py-2.5 text-xs font-bold transition ${
                          revenue === rev
                            ? "border-[#0B3B2D] bg-[#0B3B2D] text-white"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0B3B2D]/40"
                        }`}
                      >
                        {rev}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-900">
                  3. 4대보험 직원 수
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(["0명 (1인)", "1~4명", "5~15명", "16명 이상"] as StaffTier[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStaff(st)}
                      className={`rounded-sm border px-3 py-2.5 text-xs font-bold transition ${
                        staff === st
                          ? "border-[#0B3B2D] bg-[#0B3B2D] text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0B3B2D]/40"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-slate-900">
                  4. 주요 업종
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      "일반 서비스·IT",
                      "병의원·전문직",
                      "이커머스·유통",
                      "제조·건설",
                    ] as IndustryType[]
                  ).map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={`rounded-sm border px-3 py-2.5 text-xs font-bold transition ${
                        industry === ind
                          ? "border-[#0B3B2D] bg-[#0B3B2D] text-white"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-[#0B3B2D]/40"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 우측 실시간 진단 결과 카드 + 시각 게이지 */}
            <div className="flex flex-col justify-between rounded-sm bg-[#0B3B2D] p-6 text-white shadow-lg lg:col-span-5">
              <div>
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <span className="text-xs font-bold tracking-wider text-[#E2C68D] uppercase">
                    ESTIMATED MONTHLY FEE
                  </span>
                  <FileSpreadsheet className="h-4 w-4 text-[#E2C68D]" />
                </div>

                <div className="mt-5">
                  <div className="text-xs text-emerald-100/80">예상 월 세무기장료 (VAT 별도)</div>
                  <div className="mt-1 font-serif text-3xl font-bold text-white sm:text-4xl">
                    월 {simulation.minFee}만 ~ {simulation.maxFee}만 원
                  </div>
                </div>

                {/* 절세 여력 시각화 게이지 */}
                <div className="mt-5 rounded-sm bg-black/25 p-3.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-emerald-100/90">맞춤 절세 검토 필요도</span>
                    <span className="text-[#E2C68D]">{simulation.savingPotential}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/15">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#C5A059] to-[#E2C68D] transition-all duration-300"
                      style={{ width: `${simulation.savingPotential}%` }}
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-sm border border-white/15 bg-white/10 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#E2C68D]">
                    <TrendingDown className="h-4 w-4" />
                    <span>{simulation.corpSignal.label}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-emerald-50/90">
                    {simulation.corpSignal.desc}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="text-xs font-bold text-[#E2C68D]">우선 절세 체크포인트</div>
                  {simulation.checkpoints.map((cp) => (
                    <div key={cp} className="flex items-start gap-2 text-xs text-emerald-50/90">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#E2C68D]" />
                      <span>{cp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={applySimulationToForm}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-sm bg-[#C5A059] px-5 py-3.5 text-sm font-extrabold text-[#07271E] transition hover:bg-[#E2C68D]"
              >
                <span>이 조건으로 정밀 진단받기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. 절세 · 세무조사 대응 사례 아카이브 (핵심 성과 숫자 강조 + 여백 확대) */}
      <section id="tax-cases" className="scroll-mt-20 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                CASE ARCHIVE
              </p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
                업종별 절세 · 세무조사 대응 사례
              </h2>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {CASE_FILTERS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedFilter(cat)}
                  className={`rounded-sm px-3.5 py-2 text-xs font-bold transition ${
                    selectedFilter === cat
                      ? "bg-[#0B3B2D] text-white"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:border-[#0B3B2D]/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCases.map((item) => (
              <article
                key={item.id}
                onClick={() => setActiveCase(item)}
                className="group flex cursor-pointer flex-col justify-between rounded-sm border border-slate-200 bg-white p-7 shadow-2xs transition hover:-translate-y-0.5 hover:border-[#0B3B2D]/60 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-sm bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#0B3B2D]">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400">
                      {item.period}
                    </span>
                  </div>

                  {/* 핵심 성과 숫자 강조 */}
                  <div className="mt-5 border-b border-slate-100 pb-4">
                    <div className="font-serif text-2xl font-extrabold text-[#0B3B2D] sm:text-3xl">
                      {item.metricValue}
                    </div>
                    <div className="mt-0.5 text-xs font-bold text-[#C5A059]">
                      {item.metricLabel}
                    </div>
                  </div>

                  <h3 className="mt-4 text-base font-bold leading-snug text-slate-900 transition group-hover:text-[#0B3B2D]">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {item.overview}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-2 text-xs">
                  <span className="font-medium text-slate-400">{item.clientType}</span>
                  <span className="inline-flex items-center gap-1 font-bold text-[#0B3B2D]">
                    상세 보기 <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6-1. 이달의 세무 일정 & 최신 절세 브리핑 */}
      <section id="tax-calendar" className="scroll-mt-20 border-y border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* 좌측: 이달의 세무 신고 캘린더 */}
            <div className="min-w-0 lg:col-span-5">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#0B3B2D] uppercase">
                <CalendarDays className="h-4 w-4 text-[#C5A059]" />
                <span>MONTHLY TAX CALENDAR</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
                이달의 주요 세무 일정
              </h2>

              <div className="mt-6 space-y-3">
                {TAX_SCHEDULES.map((sch) => (
                  <div
                    key={sch.title}
                    className="flex items-center gap-4 rounded-sm border border-slate-200 bg-white p-4 shadow-2xs"
                  >
                    <div className="w-20 shrink-0 rounded-sm bg-[#0B3B2D] px-2 py-2.5 text-center text-white">
                      <div className="text-[10px] font-semibold text-[#E2C68D]">{sch.badge}</div>
                      <div className="mt-0.5 text-xs font-extrabold">{sch.day}</div>
                    </div>
                    <h3 className="text-xs font-bold leading-snug text-slate-900 sm:text-sm">
                      {sch.title}
                    </h3>
                  </div>
                ))}
              </div>
            </div>

            {/* 우측: 대표 세무사 최신 세법·절세 브리핑 3선 */}
            <div className="min-w-0 lg:col-span-7">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#C5A059] uppercase">
                <BookOpen className="h-4 w-4" />
                <span>TAX INSIGHT BRIEFING</span>
              </div>
              <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
                파트너 세무사 최신 절세 브리핑
              </h2>

              <div className="mt-6 space-y-3">
                {TAX_BRIEFINGS.map((brief) => {
                  const isOpen = openBriefingId === brief.id;
                  return (
                    <div
                      key={brief.id}
                      className={`rounded-sm border transition ${
                        isOpen
                          ? "border-[#0B3B2D] bg-white shadow-sm"
                          : "border-slate-200 bg-white hover:border-[#0B3B2D]/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenBriefingId(isOpen ? "" : brief.id)}
                        className="flex w-full items-start justify-between gap-3 p-5 text-left"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="rounded-sm bg-emerald-50 px-2 py-0.5 font-bold text-[#0B3B2D]">
                              {brief.tag}
                            </span>
                            <span className="font-medium text-slate-400">
                              {brief.author} · {brief.date}
                            </span>
                          </div>
                          <h3 className="mt-2 text-sm font-bold leading-snug text-slate-900 sm:text-base">
                            {brief.title}
                          </h3>
                        </div>
                        <ChevronRight
                          className={`mt-1 h-4 w-4 shrink-0 text-[#0B3B2D] transition-transform ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 px-5 pb-5 pt-3.5">
                          <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                            {brief.summary}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setConsultContent(`[브리핑 상담 요청] ${brief.title}`);
                              scrollToSection("tax-consult");
                            }}
                            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0B3B2D] hover:underline"
                          >
                            <span>이 주제로 무료 세무진단 신청하기</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 대표 · 파트너 세무사 소개 (매거진 화보형 프로필 카드) */}
      <section id="advisors" className="scroll-mt-20 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <p className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">
              PARTNER TAX ADVISORS
            </p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900 sm:text-3xl">
              전 과정 직접 검토하는 파트너 세무사
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ADVISORS.map((advisor) => (
              <div
                key={advisor.id}
                className="group flex flex-col justify-between overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xs transition hover:border-[#0B3B2D]/40 hover:shadow-md"
              >
                <div>
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
                    <img
                      src={advisor.image}
                      alt={`${advisor.name} ${advisor.role}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/samples/fallback.svg";
                      }}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#062119]/90 via-transparent to-transparent" />
                    <div className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-2 text-white">
                      <div>
                        <span className="text-[11px] font-bold tracking-wider text-[#E2C68D]">
                          {advisor.role}
                        </span>
                        <h3 className="mt-0.5 font-serif text-2xl font-bold">
                          {advisor.name}{" "}
                          <span className="text-sm font-normal text-emerald-100/80">세무사</span>
                        </h3>
                      </div>
                      <span className="shrink-0 rounded-sm border border-[#C5A059]/50 bg-[#0B3B2D]/90 px-2.5 py-1 text-[11px] font-bold text-[#E2C68D]">
                        {advisor.badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-bold text-[#0B3B2D]">
                      {advisor.credential}
                    </div>
                    <div className="mt-1 text-xs font-medium text-slate-500">
                      주력 분야: {advisor.specialty}
                    </div>

                    <ul className="mt-4 space-y-1.5 text-xs leading-relaxed text-slate-600">
                      {advisor.career.map((c) => (
                        <li key={c} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#0B3B2D]" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <blockquote className="mx-6 mb-6 border-t border-slate-100 pt-4 font-serif text-xs italic leading-relaxed text-slate-600">
                  &ldquo;{advisor.quote}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. 1:1 비공개 세무 진단 신청 + 본사 오피스 안내 */}
      <section id="tax-consult" className="scroll-mt-20 border-t border-slate-200 bg-slate-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 lg:grid-cols-12">
            {/* 좌측 상담 폼 */}
            <div className="min-w-0 lg:col-span-7">
              <div className="rounded-sm border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="border-b border-slate-100 pb-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3B2D]">
                    <Lock className="h-3.5 w-3.5 text-[#C5A059]" />
                    <span>1:1 비공개 세무 진단 (가명 접수 가능)</span>
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-slate-900">
                    무료 세무진단 및 기장 이관 상담
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    재무제표·부가세 신고서 등을 첨부하시면 보다 정확한 절세 포인트를 검토해 드립니다.
                  </p>
                </div>

                {submitted ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-[#0B3B2D]" />
                    <h3 className="mt-4 text-xl font-bold text-slate-900">
                      비공개 세무 진단 신청이 접수되었습니다.
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      전담 세무사가 검토 후 24시간 이내에 입력하신 연락처로 회신드립니다.
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가 기록되었습니다.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setConsultContent("");
                        setAttachmentMediaId(null);
                        setAttachmentName("");
                      }}
                      className="mt-6 rounded-sm bg-[#0B3B2D] px-5 py-2.5 text-xs font-bold text-white"
                    >
                      추가 문의하기
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-800">
                        상담 분야
                      </label>
                      <select
                        value={consultTopic}
                        onChange={(e) => setConsultTopic(e.target.value)}
                        className="w-full rounded-sm border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
                      >
                        <option value="월 세무기장·절세 상담">월 세무기장·절세 상담</option>
                        <option value="법인전환 · 절세 컨설팅">법인전환 · 절세 컨설팅</option>
                        <option value="경정청구 (과거 세금 환급)">경정청구 (과거 세금 환급)</option>
                        <option value="세무조사 대응 · 소명 자문">세무조사 대응 · 소명 자문</option>
                        <option value="상속·증여 재산제세 상담">상속·증여 재산제세 상담</option>
                      </select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-800">
                          성함 또는 상호 (가명 가능) *
                        </label>
                        <input
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="예: 김대표"
                          className="w-full rounded-sm border border-slate-200 px-3 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-800">
                          연락처 *
                        </label>
                        <input
                          type="tel"
                          required
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="010-1234-5678"
                          className="w-full rounded-sm border border-slate-200 px-3 py-2.5 text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-800">
                        현재 사업 현황 및 고민 사항 *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={consultContent}
                        onChange={(e) => setConsultContent(e.target.value)}
                        placeholder="업종, 연 매출 규모, 현재 기장 여부나 궁금한 절세 포인트를 편하게 적어주세요."
                        className="w-full rounded-sm border border-slate-200 px-3 py-2.5 text-sm"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-800">
                        참고 서류 비공개 첨부 (선택 · PDF/이미지)
                      </label>
                      <div className="flex items-center gap-2">
                        <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-sm border border-dashed border-slate-300 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-600 hover:bg-slate-100">
                          <Upload className="h-4 w-4 shrink-0 text-[#0B3B2D]" />
                          <span className="truncate">
                            {uploadingFile
                              ? "암호화 업로드 중..."
                              : attachmentName || "사업자등록증, 재무제표 등 파일 선택"}
                          </span>
                          <input type="file" className="hidden" onChange={handleFileUpload} />
                        </label>
                        {attachmentName && (
                          <button
                            type="button"
                            onClick={() => {
                              setAttachmentMediaId(null);
                              setAttachmentName("");
                            }}
                            className="rounded-sm border border-rose-200 bg-rose-50 p-2 text-rose-600"
                            aria-label="첨부 취소"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <label className="flex items-start gap-2 text-xs text-slate-500">
                      <input
                        type="checkbox"
                        checked={privacyAgreed}
                        onChange={(e) => setPrivacyAgreed(e.target.checked)}
                        required
                        className="mt-0.5"
                      />
                      <span>세무 상담 회신을 위한 개인정보 수집·이용에 동의합니다. (필수)</span>
                    </label>

                    {errorMsg && (
                      <div className="rounded-sm bg-rose-50 p-3 text-xs text-rose-600">
                        {errorMsg}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-2 rounded-sm bg-[#0B3B2D] py-3.5 text-sm font-bold text-white transition hover:bg-[#082B20] disabled:opacity-50"
                    >
                      <ShieldCheck className="h-4 w-4 text-[#E2C68D]" />
                      <span>{submitting ? "안전하게 접수 중..." : "비공개 무료 세무진단 신청하기"}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* 우측 오피스 안내 */}
            <div className="min-w-0 space-y-5 lg:col-span-5">
              <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xs">
                <div className="relative aspect-[16/10] bg-slate-100">
                  <img
                    src="/images/samples/tax-office.jpg"
                    alt="세무법인 현율 강남 본사 VIP 상담실"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/samples/fallback.svg";
                    }}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-3 left-3 rounded-sm bg-[#0B3B2D]/90 px-3 py-1.5 text-xs font-bold text-[#E2C68D]">
                    TEHERAN-RO VIP ADVISORY ROOM
                  </div>
                </div>
                <div className="space-y-3 p-6 text-sm">
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    세무법인 현율 강남 본사
                  </h3>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#0B3B2D]" />
                    <span>서울특별시 강남구 테헤란로 318 현율타워 9층 (선릉역 4번 출구)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#0B3B2D]" />
                    <span>평일 09:00 ~ 18:30 (점심 12:00 ~ 13:00 · 사전 예약 시 야간/비대면 가능)</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-600">
                    <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0B3B2D]" />
                    <span>방문 미팅 시 건물 내 무료 주차 2시간 지원</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. 푸터 */}
      <footer className="border-t border-slate-800 bg-[#062119] py-10 text-xs text-emerald-100/75">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-4 sm:flex-row sm:items-center sm:px-6">
          <div>
            <div className="font-serif text-sm font-bold text-white">세무법인 현율</div>
            <p className="mt-1">
              대표세무사: 강현율 | 사업자등록번호: 211-88-90412 | 대표전화: 02-558-8200
            </p>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-emerald-100/60">
            <Briefcase className="h-3.5 w-3.5 text-[#E2C68D]" />
            <span>© 2026 HYUNYUL TAX &amp; ADVISORY.</span>
          </div>
        </div>
      </footer>

      {/* 10. 우측 미니멀 3버튼 플로팅 바 */}
      <aside
        aria-label="세무 상담 빠른 메뉴"
        className="fixed right-4 top-1/2 z-40 hidden w-[78px] -translate-y-1/2 flex-col overflow-hidden rounded-sm border border-[#0B3B2D]/20 bg-white/95 shadow-xl backdrop-blur-md lg:flex"
      >
        <a
          href="tel:02-558-8200"
          className="flex flex-col items-center justify-center gap-1 bg-[#0B3B2D] px-2 py-3.5 text-center text-white transition hover:bg-[#082B20]"
        >
          <Phone className="h-4 w-4 text-[#E2C68D]" />
          <span className="text-[11px] font-bold leading-tight">
            전화
            <br />
            상담
          </span>
        </a>
        <button
          type="button"
          onClick={() => scrollToSection("tax-consult")}
          className="flex flex-col items-center justify-center gap-1 border-t border-slate-200 px-2 py-3.5 text-center text-slate-800 transition hover:bg-slate-50"
        >
          <Lock className="h-4 w-4 text-[#0B3B2D]" />
          <span className="text-[11px] font-semibold leading-tight">
            무료
            <br />
            세무진단
          </span>
        </button>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="맨 위로"
          className="flex flex-col items-center justify-center gap-0.5 border-t border-slate-200 bg-slate-50 px-2 py-2.5 text-slate-500 transition hover:text-[#0B3B2D]"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          <span className="text-[10px] font-bold tracking-wider">TOP</span>
        </button>
      </aside>

      {/* 사례 상세 모달 */}
      {activeCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-xs"
          onClick={() => setActiveCase(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-sm border border-slate-200 bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-sm bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-[#0B3B2D]">
                    {activeCase.category}
                  </span>
                  <span className="text-xs font-bold text-[#C5A059]">
                    {activeCase.metricValue} · {activeCase.metricLabel}
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-xl font-bold text-slate-900">
                  {activeCase.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                className="rounded-sm p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-sm text-slate-700">
              <p className="leading-relaxed">{activeCase.overview}</p>
              <div>
                <h4 className="font-bold text-[#0B3B2D]">핵심 절세·대응 전략</h4>
                <ul className="mt-2 space-y-1.5 text-xs leading-relaxed">
                  {activeCase.points.map((p) => (
                    <li key={p} className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0B3B2D]" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-sm border border-[#0B3B2D]/20 bg-slate-50 p-4">
                <div className="text-xs font-bold text-[#0B3B2D]">최종 결과</div>
                <p className="mt-1 text-xs leading-relaxed text-slate-700">
                  {activeCase.outcome}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setActiveCase(null)}
                className="rounded-sm border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  const title = activeCase.title;
                  setActiveCase(null);
                  setConsultContent(`[유사 사례 상담 요청] ${title}`);
                  scrollToSection("tax-consult");
                }}
                className="rounded-sm bg-[#0B3B2D] px-4 py-2 text-xs font-bold text-white"
              >
                유사 사례로 상담 신청 →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
