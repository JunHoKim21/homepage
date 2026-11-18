"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clientApiFetch, DEFAULT_SITE_CONFIGS } from "@/lib/api";
import {
  ArrowUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Eye,
  Gift,
  Instagram,
  Lock,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Sparkles,
  Unlock,
  UserCheck,
  X,
} from "lucide-react";

type LangCode = "KR" | "US" | "JP" | "CN";
type EventTab =
  | "일요일 진료"
  | "리프팅 특가"
  | "스킨부스터"
  | "줄기세포센터"
  | "원장 상담";

interface SolutionChip {
  name: string;
  thumb: string;
  category: string;
  summary: string;
  target: string;
  duration: string;
}

interface SolutionCard {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  chips: SolutionChip[];
}

const LANG_HERO: Record<
  LangCode,
  {
    brandSub: string;
    solutionEyebrow: string;
    solutionTitle: string;
    stemEyebrow: string;
    stemTitle: string;
    stemDesc: string;
  }
> = {
  KR: {
    brandSub: "CHEONGDAM PRIVATE SKIN CLINIC",
    solutionEyebrow: "THE CELLUCE SKIN SOLUTIONS",
    solutionTitle: "더셀루체에서 완성되는 피부 디테일",
    stemEyebrow: "근본적 접근",
    stemTitle: "세포재생치료",
    stemDesc:
      "일시적인 개선을 넘어 피부 본연의 자생력을 깨우는 줄기세포·성장인자 기반 재생 프로토콜. 손상된 진피 환경을 근본부터 복원하여 시간이 흐를수록 건강하게 빛나는 피부를 완성합니다.",
  },
  US: {
    brandSub: "CHEONGDAM PRIVATE SKIN CLINIC · SEOUL",
    solutionEyebrow: "THE CELLUCE SKIN SOLUTIONS",
    solutionTitle: "Bespoke Skin Detail Perfected at The Celluce",
    stemEyebrow: "FUNDAMENTAL APPROACH",
    stemTitle: "Stem Cell Regeneration",
    stemDesc:
      "Beyond temporary fixes, our stem-cell and growth-factor regeneration protocol awakens your skin's natural vitality from deep within the dermis.",
  },
  JP: {
    brandSub: "清潭洞 プライベート美容皮膚科",
    solutionEyebrow: "THE CELLUCE SKIN SOLUTIONS",
    solutionTitle: "ザ・セルーチェで完成する肌のディテール",
    stemEyebrow: "根本的アプローチ",
    stemTitle: "細胞再生治療",
    stemDesc:
      "一時的な改善を超え、肌本来の再生力を呼び覚ます幹細胞・成長因子ベースの再生プロトコルで、内側から輝く素肌へ導きます。",
  },
  CN: {
    brandSub: "首尔清潭洞 私密高端皮肤科",
    solutionEyebrow: "THE CELLUCE SKIN SOLUTIONS",
    solutionTitle: "在 THE CELLUCE 成就精致肌肤细节",
    stemEyebrow: "根本性修护",
    stemTitle: "细胞再生治疗",
    stemDesc:
      "超越表层短暂改善，依托干细胞与生长因子再生方案，从真皮层根本修复受损肌底，唤醒肌肤原生健康光采。",
  },
};

const SOLUTION_CARDS: SolutionCard[] = [
  {
    id: "lifting",
    title: "리프팅(윤곽)",
    subtitle: "무너진 페이스라인을 정밀하게 당기는 입체 리프팅",
    image: "/images/samples/skin-1.jpg",
    chips: [
      {
        name: "울쎄라",
        thumb: "/images/samples/skin-1.jpg",
        category: "리프팅(윤곽)",
        summary:
          "실시간 초음파 영상(DeepSEE)으로 근막층(SMAS) 깊이를 직접 확인하며 정확하게 에너지를 조사하는 프리미엄 리프팅",
        target: "심부볼 처짐, 이중턱, 무너진 턱선이 고민인 분",
        duration: "약 40~60분",
      },
      {
        name: "온다",
        thumb: "/images/samples/skin-2.jpg",
        category: "리프팅(윤곽)",
        summary:
          "극초단파(Microwave) 에너지로 불필요한 지방층은 줄이고 진피 콜라겐은 쫀쫀하게 수축시키는 통증 적은 리프팅",
        target: "이중턱·볼살 정리와 즉각적인 탄력을 원하는 분",
        duration: "약 25분",
      },
      {
        name: "올타이트",
        thumb: "/images/samples/skin-3.jpg",
        category: "리프팅(윤곽)",
        summary:
          "DLTD 기술로 표피 자극 없이 진피 하부까지 균일한 열 에너지를 전달해 매끄러운 윤곽을 형성",
        target: "다운타임 없이 빠른 일상 복귀를 원하는 분",
        duration: "약 30분",
      },
      {
        name: "슈링크 유니버스",
        thumb: "/images/samples/skin-4.jpg",
        category: "리프팅(윤곽)",
        summary:
          "울트라 부스터 펜타입 핸드피스로 눈가·팔자 등 굴곡진 부위까지 빈틈없이 밀착 리프팅",
        target: "합리적인 주기별 탄력 유지를 원하는 분",
        duration: "약 30분",
      },
    ],
  },
  {
    id: "elasticity",
    title: "탄력(밀도)",
    subtitle: "피부 속 콜라겐 밀도를 채워 탱탱하게 복원",
    image: "/images/samples/skin-2.jpg",
    chips: [
      {
        name: "써마지",
        thumb: "/images/samples/skin-5.jpg",
        category: "탄력(밀도)",
        summary:
          "단극성 고주파(RF) 열에너지로 진피층 콜라겐 재생을 극대화하여 잔주름과 피부 처짐을 동시에 개선",
        target: "얇아진 피부, 잔주름, 탄력 저하가 고민인 분",
        duration: "약 50~60분",
      },
      {
        name: "덴서티",
        thumb: "/images/samples/skin-6.jpg",
        category: "탄력(밀도)",
        summary:
          "모노폴라와 바이폴라 두 가지 고주파를 순차 조사하여 진피 깊은 곳부터 얕은 층까지 촘촘히 타이트닝",
        target: "즉각적인 쫀쫀함과 장기적 콜라겐 생성을 원하는 분",
        duration: "약 40분",
      },
      {
        name: "올리지오X",
        thumb: "/images/samples/skin-1.jpg",
        category: "탄력(밀도)",
        summary:
          "한국인 피부 두께에 최적화된 고주파 에너지와 쿨링 시스템으로 편안하게 받는 데일리 탄력 케어",
        target: "통증에 민감하지만 확실한 타이트닝을 원하는 분",
        duration: "약 35분",
      },
      {
        name: "텐써마",
        thumb: "/images/samples/skin-2.jpg",
        category: "탄력(밀도)",
        summary:
          "임피던스 매칭 기술로 부위별 피부 저항값을 측정해 최적의 고주파 에너지를 안정적으로 전달",
        target: "볼패임 걱정 없이 피부 밀도를 높이고 싶은 분",
        duration: "약 40분",
      },
    ],
  },
  {
    id: "tone",
    title: "톤(색소·여드름)",
    subtitle: "맑고 균일한 피부 톤을 되찾는 정밀 색소·트러블 케어",
    image: "/images/samples/skin-3.jpg",
    chips: [
      {
        name: "피코슈어 프로",
        thumb: "/images/samples/skin-3.jpg",
        category: "톤(색소·여드름)",
        summary:
          "755nm 알렉산드라이트 파장의 피코 레이저로 주변 조직 열손상 없이 기미·잡티·오타모반을 정밀 파괴",
        target: "재발성 기미, 잡티, 칙칙한 피부 톤 개선",
        duration: "약 20분",
      },
      {
        name: "레블라이트 SI",
        thumb: "/images/samples/skin-4.jpg",
        category: "톤(색소·여드름)",
        summary:
          "PTP 토닝 모드로 멜라닌 색소만을 선택적으로 잘게 부수어 자극 없이 맑은 피부 톤을 구현",
        target: "민감성 피부의 데일리 화이트닝 토닝",
        duration: "약 20분",
      },
      {
        name: "엑셀V 플러스",
        thumb: "/images/samples/skin-5.jpg",
        category: "톤(색소·여드름)",
        summary:
          "532nm·1064nm 듀얼 파장으로 안면 홍조, 확장된 모세혈관, 여드름 붉은 자국을 동시에 치료",
        target: "홍조, 혈관성 기미, 트러블 붉은기",
        duration: "약 25분",
      },
    ],
  },
  {
    id: "texture",
    title: "피부결(모공·결)",
    subtitle: "매끈하고 고운 도자기 피부결을 위한 모공·흉터 솔루션",
    image: "/images/samples/skin-4.jpg",
    chips: [
      {
        name: "포텐자",
        thumb: "/images/samples/skin-6.jpg",
        category: "피부결(모공·결)",
        summary:
          "미세 니들 고주파와 음압 펌핑팁으로 약물을 진피층에 직접 침투시켜 모공과 여드름 흉터를 복원",
        target: "넓어진 나비존 모공, 패인 흉터, 피지 과다",
        duration: "약 40분",
      },
      {
        name: "쥬베룩 스킨",
        thumb: "/images/samples/skin-1.jpg",
        category: "피부결(모공·결)",
        summary:
          "생분해성 고분자 PDLLA와 히알루론산 복합체로 자가 콜라겐을 유도해 요철과 잔주름을 매끈하게 개선",
        target: "피부결 개선, 모공 축소, 자연스러운 탄력",
        duration: "약 35분",
      },
      {
        name: "아쿠아필",
        thumb: "/images/samples/skin-2.jpg",
        category: "피부결(모공·결)",
        summary:
          "모공 속 피지·노폐물·모낭충을 부드럽게 용해·흡입하고 수분 영양을 채우는 저자극 메디컬 필링",
        target: "블랙헤드, 각질, 레이저 전 피부 정돈",
        duration: "약 25분",
      },
    ],
  },
  {
    id: "glow",
    title: "광택(윤기·물광)",
    subtitle: "속건조를 해결하고 고급스러운 윤기를 채우는 스킨부스터",
    image: "/images/samples/skin-5.jpg",
    chips: [
      {
        name: "리쥬란 힐러",
        thumb: "/images/samples/skin-3.jpg",
        category: "광택(윤기·물광)",
        summary:
          "연어 유래 PN 성분이 손상된 피부 장벽과 진피 두께를 회복시켜 건강한 속광을 되살리는 대표 힐러",
        target: "속건조, 얇고 예민해진 피부, 눈가 잔주름",
        duration: "약 35분",
      },
      {
        name: "엑소좀",
        thumb: "/images/samples/skin-4.jpg",
        category: "광택(윤기·물광)",
        summary:
          "고순도 줄기세포 배양액 유래 엑소좀으로 항염·진정·재생을 동시에 끌어올리는 프리미엄 부스터",
        target: "예비신부 광채 케어, 홍조·트러블 진정",
        duration: "약 35분",
      },
      {
        name: "릴리이드",
        thumb: "/images/samples/skin-5.jpg",
        category: "광택(윤기·물광)",
        summary:
          "고농축 히알루론산과 연어 DNA 복합 배합으로 시술 직후 촉촉하고 맑은 물광 피부결 연출",
        target: "즉각적인 수분 광채와 메이크업 밀착력 개선",
        duration: "약 30분",
      },
    ],
  },
  {
    id: "scalp",
    title: "탈모치료",
    subtitle: "모낭 환경부터 근본적으로 개선하는 1:1 두피·모발 클리닉",
    image: "/images/samples/skin-6.jpg",
    chips: [
      {
        name: "모발 줄기세포",
        thumb: "/images/samples/skin-6.jpg",
        category: "탈모치료",
        summary:
          "두피 혈류 개선과 모낭 세포 활성화를 유도하는 고농축 재생 인자를 두피 진피층에 정밀 주입",
        target: "정수리 숱 감소, 여성형·초기 남성형 탈모",
        duration: "약 40분",
      },
      {
        name: "두피 메조테라피",
        thumb: "/images/samples/skin-1.jpg",
        category: "탈모치료",
        summary:
          "비오틴·구리 펩타이드 등 모발 성장 필수 영양소를 두피에 직접 공급하여 모근을 강화",
        target: "가늘어진 모발, 산후·스트레스성 탈모",
        duration: "약 25분",
      },
      {
        name: "헤어셀",
        thumb: "/images/samples/skin-2.jpg",
        category: "탈모치료",
        summary:
          "비수술 자기장 치료로 모낭 주위 미세 혈류를 증가시켜 통증 없이 모발 성장 주기를 정상화",
        target: "주사 시술이 부담스러운 초기 탈모 고객",
        duration: "약 20분",
      },
    ],
  },
];

const EVENT_POPUP_TABS: Record<
  EventTab,
  {
    headline: string;
    offers: Array<{ title: string; desc: string; price: string }>;
  }
> = {
  "일요일 진료": {
    headline: "바쁜 직장인·해외 고객을 위한 일요일 프라이빗 진료",
    offers: [
      {
        title: "일요일 100% 예약제 정상 진료",
        desc: "매주 일요일 11:00 ~ 17:00 (점심시간 없이 원장 직접 시술)",
        price: "사전 예약 필수",
      },
      {
        title: "원데이 퀵 리프팅 (티타늄 + LDM)",
        desc: "티타늄 리프팅 60KJ + 물방울 진정 관리",
        price: "79만 원",
      },
      {
        title: "주말 스페셜 물광 토닝",
        desc: "피코슈어 프로 토닝 + 릴리이드 물광 케어",
        price: "39만 원",
      },
    ],
  },
  "리프팅 특가": {
    headline: "11월 한정 시그니처 듀얼 리프팅 프로모션",
    offers: [
      {
        title: "울써마지 프리미엄 패키지",
        desc: "울쎄라 300샷 + 써마지 FLX 600샷 + LDM 진정",
        price: "289만 원",
      },
      {
        title: "온다 + 올타이트 윤곽 타이트닝",
        desc: "이중턱·심부볼 집중 정리 듀얼 케어",
        price: "95만 원",
      },
      {
        title: "덴서티 600샷 콜라겐 부스트",
        desc: "모노·바이폴라 듀얼 고주파 + 크라이오 진정",
        price: "139만 원",
      },
    ],
  },
  스킨부스터: {
    headline: "건조한 환절기 속부터 채우는 광채 부스터 특가",
    offers: [
      {
        title: "리쥬란 힐러 2cc + 아이 리쥬란 1cc",
        desc: "눈가 잔주름과 전체 피부 장벽 동시 복원",
        price: "49만 원",
      },
      {
        title: "엑소좀 5cc + 포텐자 펌핑팁",
        desc: "모공 수축과 진피 재생 시너지 프로그램",
        price: "65만 원",
      },
      {
        title: "쥬베룩 스킨 1병 풀페이스",
        desc: "자가 콜라겐 생성 모공·결 집중 케어",
        price: "55만 원",
      },
    ],
  },
  줄기세포센터: {
    headline: "더셀루체 세포재생센터 근본 안티에이징",
    offers: [
      {
        title: "피부 줄기세포 배양액 프리미엄",
        desc: "고농축 성장인자 + 더마샤인 정밀 주입",
        price: "110만 원",
      },
      {
        title: "모발 줄기세포 탈모 집중 3회",
        desc: "두피 정밀 진단 + 줄기세포 인자 + 헤어셀",
        price: "159만 원",
      },
      {
        title: "줄기세포 + 써마지 FLX 풀케어",
        desc: "진피 재생과 탄력 밀도를 동시에 완성",
        price: "249만 원",
      },
    ],
  },
  "원장 상담": {
    headline: "피부과 전문의 1:1 3D 정밀 진단 상담 안내",
    offers: [
      {
        title: "마크뷰 3D 피부 정밀 분석",
        desc: "색소·모공·주름·피지 수치화 및 맞춤 처방",
        price: "시술 시 무료",
      },
      {
        title: "전 객실 1인 VIP 프라이빗 룸",
        desc: "상담부터 시술·회복까지 완전 독립 공간 제공",
        price: "전 고객 기본",
      },
      {
        title: "해외 고객 전담 통역 컨시어지",
        desc: "영어·일본어·중국어 전문 코디네이터 상주",
        price: "사전 요청 시",
      },
    ],
  },
};

const BEFORE_AFTER_CASES = [
  {
    id: 1,
    title: "울쎄라 400샷 + 써마지 FLX 600샷",
    period: "시술 후 8주 경과",
    doctor: "강서연 대표원장",
    beforeImg: "/images/samples/skin-1.jpg",
    afterImg: "/images/samples/skin-2.jpg",
  },
  {
    id: 2,
    title: "피코슈어 프로 + 포텐자 3회 집중",
    period: "3회차 후 4주 경과",
    doctor: "윤재혁 원장",
    beforeImg: "/images/samples/skin-3.jpg",
    afterImg: "/images/samples/skin-4.jpg",
  },
  {
    id: 3,
    title: "세포재생치료 + 리쥬란 힐러 풀페이스",
    period: "시술 후 6주 경과",
    doctor: "강서연 대표원장",
    beforeImg: "/images/samples/skin-5.jpg",
    afterImg: "/images/samples/skin-6.jpg",
  },
];

export default function TheCelluceSkinSamplePage() {
  const [lang, setLang] = useState<LangCode>("KR");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 회원 로그인 상태 (헤더 로그인 버튼 <-> 전후사진 잠금 해제 연동)
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(false);

  // 시술 칩 클릭 시 상세 모달
  const [selectedChip, setSelectedChip] = useState<SolutionChip | null>(null);

  // 중앙 이벤트 팝업 모달 (스크린샷 3)
  const [eventPopupOpen, setEventPopupOpen] = useState(true);
  const [activeEventTab, setActiveEventTab] =
    useState<EventTab>("리프팅 특가");

  // 퀵 상담/예약 모달 (전화상담, 카카오, 위챗, 시술예약 통합)
  const [quickModal, setQuickModal] = useState<{
    open: boolean;
    channel: string;
    topic: string;
  }>({ open: false, channel: "전화상담예약", topic: "" });
  const [reserveName, setReserveName] = useState("");
  const [reservePhone, setReservePhone] = useState("");
  const [reserveDone, setReserveDone] = useState(false);

  const [siteConfigs, setSiteConfigs] = useState<Record<string, string>>(DEFAULT_SITE_CONFIGS);

  useEffect(() => {
    let active = true;
    async function loadConfigs() {
      let merged: Record<string, string> = { ...DEFAULT_SITE_CONFIGS };
      try {
        const res = await fetch("/api/v1/configs/public");
        if (res.ok) {
          const json = (await res.json()) as { data?: Record<string, string> };
          if (json?.data) {
            merged = { ...merged, ...json.data };
          }
        }
      } catch {
        // ignore backend offline error
      }
      try {
        const raw = localStorage.getItem("demo_site_configs_override");
        if (raw) {
          const override = JSON.parse(raw) as Record<string, string>;
          merged = { ...merged, ...override };
        }
      } catch {
        // ignore storage error
      }
      if (active) {
        setSiteConfigs(merged);
      }
    }
    loadConfigs();
    return () => {
      active = false;
    };
  }, []);

  const floatingLeftEnabled = siteConfigs.floating_left_enabled !== "false";
  const floatingRightEnabled = siteConfigs.floating_right_enabled !== "false";
  const quickKakaoUrl = (siteConfigs.quick_kakao_url ?? "").trim();
  const quickWechatId = (siteConfigs.quick_wechat_id ?? "").trim();
  const snsInstagramUrl = (siteConfigs.sns_instagram_url ?? "").trim();
  const snsBlogUrl = (siteConfigs.sns_blog_url ?? "").trim();

  let companyPhone = "02-540-9800";
  try {
    const info = JSON.parse(siteConfigs.footer_company_info || "{}") as { phone?: string };
    if (info.phone && info.phone.trim()) {
      companyPhone = info.phone.trim();
    }
  } catch {
    // ignore
  }

  const t = LANG_HERO[lang];

  const openQuickModal = (channel: string, topic = "") => {
    setReserveDone(false);
    setQuickModal({ open: true, channel, topic });
  };

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveName.trim() || !reservePhone.trim()) return;
    const body = {
      category: "ESTIMATE",
      customerName: reserveName.trim() || "샘플 체험 고객",
      customerPhone: reservePhone.trim() || "010-0000-0000",
      customerEmail: null,
      title: `[샘플체험-피부과] ${quickModal.channel || "1:1 시크릿 예약"}${quickModal.topic ? ` (${quickModal.topic})` : ""}`,
      content: `예약채널: ${quickModal.channel || "1:1 시크릿 예약"} / 선택시술: ${quickModal.topic || "일반 상담"}`,
      customFieldsJson: JSON.stringify({
        sampleSource: "skin",
        channel: quickModal.channel,
        topic: quickModal.topic,
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
    setReserveDone(true);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-slate-900 antialiased selection:bg-[#0EA5E9]/20 selection:text-slate-900">
      {/* 최상단 데모 안내 띠 */}
      <div className="bg-slate-950 px-4 py-2 text-xs text-slate-200">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
          <p className="min-w-0 text-slate-300">
            현재 보고 계신 페이지는 업종별 맞춤형 구축 데모 샘플입니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-semibold">
            <Link
              href="/"
              className="text-white underline decoration-slate-500 underline-offset-4 transition-colors hover:text-sky-300"
            >
              에이전시 메인으로 돌아가기
            </Link>
            <span className="text-slate-600" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/login"
              className="text-sky-300 underline decoration-sky-500/60 underline-offset-4 transition-colors hover:text-sky-200"
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

      {/* 1. 클린 화이트 헤더 (스크린샷 1 상단) */}
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-3 px-4 sm:h-[74px] sm:px-6">
          {/* 좌측 미니멀 심볼 + 로고 */}
          <a href="#top" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-900 text-slate-900">
              <span className="font-serif text-xs font-bold tracking-tighter">
                TC
              </span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-xs font-bold tracking-[0.2em] text-slate-900 sm:text-sm">
                THE CELLUCE
              </div>
              <div className="truncate text-[9px] font-medium tracking-[0.18em] text-slate-400">
                SKIN CLINIC
              </div>
            </div>
          </a>

          {/* 중앙 1줄 시술 카테고리 */}
          <nav className="hidden items-center gap-4 text-[12px] font-medium tracking-tight text-slate-700 xl:flex xl:gap-5 xl:text-[13px]">
            {[
              { label: "ABOUT", href: "#stem-cell" },
              { label: "SIGNATURE", href: "#solutions" },
              { label: "리프팅/탄력", href: "#solutions" },
              { label: "피부/색소/여드름", href: "#solutions" },
              { label: "쁘띠성형/주사", href: "#solutions" },
              { label: "관리/케어", href: "#solutions" },
              { label: "탈모/두피", href: "#solutions" },
              { label: "시술사례", href: "#before-after" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="shrink-0 transition-colors hover:text-sky-600"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setEventPopupOpen(true)}
              className="shrink-0 font-bold text-[#6B1D2F] transition-colors hover:text-sky-600"
            >
              EVENT
            </button>
          </nav>

          {/* 우측 로그인 | 회원가입 + 국기/언어 전환 버튼 */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-1.5 text-[11px] font-medium text-slate-500 sm:flex">
              {isMemberLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setIsMemberLoggedIn(false)}
                  className="inline-flex items-center gap-1 font-semibold text-sky-600 hover:underline"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>회원 로그인중 (로그아웃)</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsMemberLoggedIn(true)}
                    className="transition-colors hover:text-slate-900"
                  >
                    로그인
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setIsMemberLoggedIn(true)}
                    className="transition-colors hover:text-slate-900"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>

            {/* 언어 전환 버튼 (KR | US | JP | CN) */}
            <div
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5"
              role="group"
              aria-label="언어 선택"
            >
              {(
                [
                  { code: "KR", label: "KR" },
                  { code: "US", label: "US" },
                  { code: "JP", label: "JP" },
                  { code: "CN", label: "CN" },
                ] as const
              ).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`rounded-full px-2 py-1 text-[10px] font-bold transition-colors sm:px-2.5 sm:text-[11px] ${
                    lang === item.code
                      ? "bg-slate-900 text-white"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="메뉴 열기"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 xl:hidden"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* 모바일/태블릿 내비게이션 드로어 */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 xl:hidden">
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
              <span className="font-semibold text-slate-500">회원 메뉴</span>
              <button
                type="button"
                onClick={() => {
                  setIsMemberLoggedIn((prev) => !prev);
                  setMobileMenuOpen(false);
                }}
                className="font-bold text-sky-600"
              >
                {isMemberLoggedIn
                  ? "로그아웃 (전후사진 잠금)"
                  : "로그인 (전후사진 잠금해제)"}
              </button>
            </div>
            <nav className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
              {[
                { label: "ABOUT", href: "#stem-cell" },
                { label: "SIGNATURE", href: "#solutions" },
                { label: "리프팅/탄력", href: "#solutions" },
                { label: "피부/색소/여드름", href: "#solutions" },
                { label: "쁘띠성형/주사", href: "#solutions" },
                { label: "탈모/두피", href: "#solutions" },
                { label: "시술사례", href: "#before-after" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-md bg-slate-50 px-3 py-2 hover:bg-slate-100"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setEventPopupOpen(true);
                }}
                className="rounded-md bg-[#6B1D2F]/10 px-3 py-2 text-left font-bold text-[#6B1D2F]"
              >
                EVENT 팝업
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 2. 풀와이드 파노라마 히어로 (스크린샷 1 중앙) */}
      <section
        id="top"
        className="relative flex h-[76vh] min-h-[520px] max-h-[820px] w-full items-center justify-center overflow-hidden bg-slate-900"
      >
        <img
          src="/images/samples/skin-hero.jpg"
          alt="더셀루체 피부과의원 파노라마 전경"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/samples/fallback.svg";
          }}
          className="absolute inset-0 h-full w-full object-cover object-center brightness-90"
        />
        <div className="absolute inset-0 bg-black/35" />

        {/* 중앙 심볼 + 브랜드 타이포만 얹은 압도적 첫 화면 */}
        <div className="relative z-10 px-4 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/70 bg-white/10 backdrop-blur-xs sm:h-20 sm:w-20">
            <span className="font-serif text-xl font-light tracking-widest text-white sm:text-2xl">
              TC
            </span>
          </div>
          <h1 className="mt-6 font-serif text-3xl font-light tracking-[0.28em] text-white sm:text-5xl lg:text-6xl">
            THE CELLUCE
          </h1>
          <p className="mt-3 text-[11px] font-medium tracking-[0.3em] text-white/85 uppercase sm:text-xs">
            {t.brandSub}
          </p>
        </div>
      </section>

      {/* 3. 시그니처 3×2 포트레이트 카드 + 하단 원형 썸네일 알약 칩 (스크린샷 2) */}
      <section id="solutions" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.22em] text-[#0EA5E9] uppercase">
              {t.solutionEyebrow}
            </p>
            <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              {t.solutionTitle}
            </h2>
          </div>

          <div className="mt-12 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {SOLUTION_CARDS.map((card) => (
              <div key={card.id} className="min-w-0">
                {/* 포트레이트 화보 카드 */}
                <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-slate-100 shadow-sm">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/samples/fallback.svg";
                    }}
                    className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
                    <h3 className="text-xl font-bold tracking-tight">
                      {card.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/85">
                      {card.subtitle}
                    </p>
                  </div>
                </div>

                {/* 하단 원형 미니 썸네일 아이콘 + 시술명 알약 칩 */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {card.chips.map((chip) => (
                    <button
                      key={chip.name}
                      type="button"
                      onClick={() => setSelectedChip(chip)}
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1.5 pr-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:border-sky-400 hover:bg-sky-50/50 hover:text-sky-700"
                    >
                      <img
                        src={chip.thumb}
                        alt={chip.name}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/samples/fallback.svg";
                        }}
                        className="h-6 w-6 shrink-0 rounded-full object-cover"
                      />
                      <span className="truncate">{chip.name}</span>
                      <ChevronRight className="h-3 w-3 shrink-0 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 에디토리얼 시그니처 섹션 (스크린샷 4: 딥 와인/버건디 배경 + 대형 세리프 영문 타이포) */}
      <section
        id="stem-cell"
        className="relative overflow-hidden bg-gradient-to-br from-[#4D1220] via-[#601829] to-[#310A13] py-16 text-white sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 상단 대형 세리프 영문 타이포 배너 */}
          <div className="border-b border-white/15 pb-10 text-center sm:pb-14">
            <p className="text-[11px] font-semibold tracking-[0.28em] text-rose-200/80 uppercase">
              THE CELLUCE SIGNATURE LAB
            </p>
            <h2 className="mt-3 font-serif text-4xl font-light italic tracking-wide text-white sm:text-6xl lg:text-7xl">
              Stem Cell Regeneration
            </h2>
          </div>

          {/* 하단 좌측 라운드 정사각형 이미지 & 우측 한글 설명 */}
          <div className="mt-12 grid items-center gap-8 lg:grid-cols-12 lg:gap-14">
            <div className="min-w-0 lg:col-span-5">
              <div className="mx-auto aspect-square max-w-md overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
                <img
                  src="/images/samples/skin-stem.jpg"
                  alt="더셀루체 세포재생치료 연구소"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/samples/fallback.svg";
                  }}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <span className="inline-block rounded-full border border-rose-200/35 bg-white/10 px-3.5 py-1 text-xs font-semibold tracking-widest text-rose-100">
                {t.stemEyebrow}
              </span>
              <h3 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {t.stemTitle}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-rose-100/85 sm:text-base">
                {t.stemDesc}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "고순도 재생 인자", val: "자생력 극대화" },
                  { label: "3D 진피 정밀 진단", val: "1:1 맞춤 프로토콜" },
                  { label: "무균 클린룸 배합", val: "안전성 100% 검증" },
                ].map((box) => (
                  <div
                    key={box.label}
                    className="rounded-xl border border-white/15 bg-black/20 p-4"
                  >
                    <div className="text-[11px] text-rose-200/75">
                      {box.label}
                    </div>
                    <div className="mt-1 text-sm font-bold text-white">
                      {box.val}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  openQuickModal("전화상담예약", "세포재생치료 정밀 상담")
                }
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-bold text-[#4D1220] transition-colors hover:bg-rose-50 sm:text-sm"
              >
                <span>세포재생치료 1:1 상담 신청</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 의료법 준수 전후사진 회원 잠금 섹션 */}
      <section
        id="before-after"
        className="border-b border-slate-100 bg-slate-50 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#0EA5E9] uppercase">
                CLINICAL CASES
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-4xl">
                실제 시술 전후사진 (Before &amp; After)
              </h2>
              <p className="mt-2 text-xs text-slate-500 sm:text-sm">
                의료법 제56조에 의거하여 시술 전후사진은 회원 로그인 후 열람
                가능합니다. (상단 헤더 로그인 버튼과 연동됩니다)
              </p>
            </div>

            {isMemberLoggedIn && (
              <button
                type="button"
                onClick={() => setIsMemberLoggedIn(false)}
                className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 sm:self-auto"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>잠금 상태로 되돌리기</span>
              </button>
            )}
          </div>

          <div className="relative mt-10">
            <div className="grid gap-6 md:grid-cols-3">
              {BEFORE_AFTER_CASES.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
                >
                  <div className="grid grid-cols-2 gap-0.5 bg-slate-200">
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={item.beforeImg}
                        alt={`${item.title} 전`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/samples/fallback.svg";
                        }}
                        className={`h-full w-full object-cover transition-all duration-500 ${
                          isMemberLoggedIn ? "blur-0" : "scale-105 blur-lg"
                        }`}
                      />
                      <span className="absolute left-2.5 top-2.5 rounded-sm bg-slate-900/75 px-2 py-0.5 text-[10px] font-bold text-white">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={item.afterImg}
                        alt={`${item.title} 후`}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/images/samples/fallback.svg";
                        }}
                        className={`h-full w-full object-cover transition-all duration-500 ${
                          isMemberLoggedIn ? "blur-0" : "scale-105 blur-lg"
                        }`}
                      />
                      <span className="absolute right-2.5 top-2.5 rounded-sm bg-sky-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        AFTER
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-sky-600">
                      <span>{item.period}</span>
                      <span className="text-slate-400">{item.doctor}</span>
                    </div>
                    <h3 className="mt-1.5 text-sm font-bold text-slate-900 sm:text-base">
                      {item.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>

            {!isMemberLoggedIn && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-slate-950/50 p-4 backdrop-blur-[3px]">
                <div className="max-w-md rounded-2xl border border-white/20 bg-white p-6 text-center shadow-2xl sm:p-8">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-800">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 sm:text-lg">
                    회원 전용 전후사진 열람 안내
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    의료법 준수를 위해 비로그인 상태에서는 전후사진이 블러
                    처리됩니다. 아래 버튼 또는 상단 로그인 클릭 시 즉시
                    확인하실 수 있습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsMemberLoggedIn(true)}
                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-sky-600 sm:text-sm"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>회원 로그인 후 전후사진 확인하기 (1초 데모)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isMemberLoggedIn && (
            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-xs font-medium text-sky-800">
              <Eye className="h-4 w-4" />
              <span>
                회원 로그인 상태가 활성화되어 실제 시술 전후사진이 선명하게
                공개되었습니다.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 오시는 길 & 한국형 병원 푸터 */}
      <footer
        id="location"
        className="bg-[#1A1A1A] pb-32 pt-14 text-stone-400 sm:pb-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-3">
            <div>
              <div className="font-serif text-lg font-light tracking-[0.22em] text-white">
                THE CELLUCE
              </div>
              <p className="mt-2 text-xs leading-relaxed text-stone-400">
                더셀루체 피부과의원은 피부과 전문의 책임 진료와 1인 프라이빗
                케어를 통해 가장 우아한 피부 솔루션을 제공합니다.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-white">
                <MapPin className="h-4 w-4 text-sky-400" />
                <span>오시는 길 · 주차</span>
              </div>
              <p>서울특별시 강남구 압구정로 428 루체타워 5층 (청담동)</p>
              <p>수인분당선 압구정로데오역 3번 출구 도보 3분 · 발렛파킹 지원</p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 font-semibold text-white">
                <Clock className="h-4 w-4 text-sky-400" />
                <span>진료시간 · 대표전화</span>
              </div>
              <p>평일 10:00~19:30 / 토요일 10:00~16:00 / 일요일 예약진료</p>
              <p className="flex items-center gap-1.5 text-sm font-bold text-white">
                <Phone className="h-3.5 w-3.5 text-sky-400" />
                02-540-9800
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col justify-between gap-2 text-[11px] text-stone-500 sm:flex-row">
            <p>
              의료기관명: 더셀루체피부과의원 | 대표원장: 강서연 |
              사업자등록번호: 261-94-01827 | 강남구 보건소 개설 신고 필
            </p>
            <p>© 2026 THE CELLUCE SKIN CLINIC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 5-A. 좌측 하단 고정 4색 알약 스택 (samples/layout.tsx 배지 위로 배치) */}
      {floatingLeftEnabled && (
        <div className="fixed bottom-16 left-3 z-40 flex flex-col gap-1.5 sm:left-4 sm:gap-2">
          <button
            type="button"
            onClick={() => openQuickModal("전화상담예약", `대표전화 ${companyPhone}`)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488] px-3 py-2 text-[11px] font-bold text-white shadow-lg transition-transform hover:scale-105 sm:px-4 sm:text-xs"
          >
            <Phone className="h-3.5 w-3.5 shrink-0" />
            <span>전화상담예약</span>
          </button>

          {quickKakaoUrl && (
            <a
              href={quickKakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#FEE500] px-3 py-2 text-[11px] font-bold text-[#191919] shadow-lg transition-transform hover:scale-105 sm:px-4 sm:text-xs"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span>카카오 상담하기</span>
            </a>
          )}

          {quickWechatId && (
            <button
              type="button"
              onClick={() => openQuickModal("WeChat", `WeChat ID: ${quickWechatId}`)}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#16A34A] px-3 py-2 text-[11px] font-bold text-white shadow-lg transition-transform hover:scale-105 sm:px-4 sm:text-xs"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span>WeChat</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setEventPopupOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#1E3A8A] px-3 py-2 text-[11px] font-bold text-white shadow-lg transition-transform hover:scale-105 sm:px-4 sm:text-xs"
          >
            <Gift className="h-3.5 w-3.5 shrink-0" />
            <span>이벤트 팝업 보기</span>
          </button>
        </div>
      )}

      {/* 5-B. 우측 고정 다크 세로 아이콘 바 (bg-[#1A1A1A]) */}
      {floatingRightEnabled && (
        <>
          <aside className="fixed right-2 top-1/2 z-40 hidden -translate-y-1/2 flex-col overflow-hidden rounded-xl border border-white/10 bg-[#1A1A1A] text-[10px] font-medium text-stone-200 shadow-2xl sm:right-3 sm:flex">
            <button
              type="button"
              onClick={() => setEventPopupOpen(true)}
              className="flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 hover:bg-white/10 hover:text-white"
            >
              <Gift className="h-4 w-4 text-rose-300" />
              <span>이벤트</span>
            </button>
            <a
              href="#before-after"
              className="flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 hover:bg-white/10 hover:text-white"
            >
              <Eye className="h-4 w-4 text-sky-400" />
              <span>전후사진</span>
            </a>
            <a
              href="#solutions"
              className="flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 hover:bg-white/10 hover:text-white"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>시술사례</span>
            </a>
            {snsInstagramUrl && (
              <a
                href={snsInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 hover:bg-white/10 hover:text-white"
              >
                <Instagram className="h-4 w-4 text-pink-400" />
                <span>인스타그램</span>
              </a>
            )}
            {snsBlogUrl && (
              <a
                href={snsBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 hover:bg-white/10 hover:text-white"
              >
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <span>블로그</span>
              </a>
            )}
            <a
              href="#location"
              className="flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 hover:bg-white/10 hover:text-white"
            >
              <MapPin className="h-4 w-4 text-stone-300" />
              <span>오시는길</span>
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex flex-col items-center gap-0.5 bg-black/50 px-2.5 py-2 font-bold text-white hover:bg-black"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>TOP</span>
            </button>
          </aside>

          {/* 모바일(360px) 전용 우측 하단 컴팩트 TOP + 오시는길 버튼 */}
          <div className="fixed bottom-16 right-3 z-40 flex flex-col gap-1.5 sm:hidden">
            <a
              href="#before-after"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-white shadow-lg"
              aria-label="전후사진"
            >
              <Eye className="h-4 w-4 text-sky-400" />
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1A1A1A] text-white shadow-lg"
              aria-label="맨 위로"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {/* 6. 더셀 스타일 중앙 이벤트 팝업 모달 (스크린샷 3) */}
      {eventPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between bg-[#1A1A1A] px-5 py-4 text-white">
              <div>
                <span className="text-[10px] font-bold tracking-[0.2em] text-sky-400 uppercase">
                  THE CELLUCE SPECIAL EVENT
                </span>
                <h3 className="text-base font-bold sm:text-lg">
                  {EVENT_POPUP_TABS[activeEventTab].headline}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEventPopupOpen(false)}
                aria-label="팝업 닫기"
                className="rounded-full p-1 text-stone-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 특가 3종 리스트 */}
            <div className="space-y-3 bg-slate-50 p-5">
              {EVENT_POPUP_TABS[activeEventTab].offers.map((offer) => (
                <div
                  key={offer.title}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900">
                      {offer.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {offer.desc}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-sm font-extrabold text-[#6B1D2F]">
                      {offer.price}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEventPopupOpen(false);
                        openQuickModal("이벤트 특가 예약", offer.title);
                      }}
                      className="mt-1 text-[11px] font-semibold text-sky-600 underline underline-offset-2"
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 5개 탭 전환 */}
            <div className="grid grid-cols-5 border-t border-slate-200 bg-white text-center text-[10px] font-bold sm:text-xs">
              {(
                [
                  "일요일 진료",
                  "리프팅 특가",
                  "스킨부스터",
                  "줄기세포센터",
                  "원장 상담",
                ] as EventTab[]
              ).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveEventTab(tab)}
                  className={`border-r border-slate-100 px-1 py-3 last:border-r-0 transition-colors ${
                    activeEventTab === tab
                      ? "bg-[#1A1A1A] text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 오늘 하루 보지 않기 / 닫기 X */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-100 px-5 py-2.5 text-xs text-slate-600">
              <button
                type="button"
                onClick={() => setEventPopupOpen(false)}
                className="hover:text-slate-900"
              >
                오늘 하루 보지 않기
              </button>
              <button
                type="button"
                onClick={() => setEventPopupOpen(false)}
                className="font-bold text-slate-900 hover:underline"
              >
                닫기 X
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 알약 칩 클릭 시 시술 상세 모달 */}
      {selectedChip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedChip.thumb}
                  alt={selectedChip.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/samples/fallback.svg";
                  }}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <div className="text-[11px] font-bold text-sky-600">
                    {selectedChip.category}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedChip.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChip(null)}
                aria-label="닫기"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 p-5 text-sm">
              <p className="leading-relaxed text-slate-700">
                {selectedChip.summary}
              </p>
              <div className="space-y-1.5 rounded-xl bg-slate-50 p-3.5 text-xs">
                <div>
                  <span className="font-bold text-slate-900">추천 대상: </span>
                  <span className="text-slate-600">{selectedChip.target}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">소요 시간: </span>
                  <span className="text-slate-600">
                    {selectedChip.duration}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const name = selectedChip.name;
                  setSelectedChip(null);
                  openQuickModal("시술 맞춤 상담", name);
                }}
                className="w-full rounded-full bg-slate-900 py-3 text-xs font-bold text-white transition-colors hover:bg-sky-600 sm:text-sm"
              >
                {selectedChip.name} 상담 예약하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 퀵 상담/예약 모달 */}
      {quickModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="text-[11px] font-bold text-[#0D9488]">
                  THE CELLUCE CONCIERGE
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {quickModal.channel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setQuickModal({ open: false, channel: "", topic: "" })
                }
                aria-label="닫기"
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reserveDone ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#0D9488]" />
                <h4 className="mt-3 text-base font-bold text-slate-900">
                  상담 예약이 접수되었습니다
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {reserveName}님({reservePhone}), 전담 코디네이터가 확인 후
                  빠르게 연락드리겠습니다.
                </p>
                <div className="mt-3 space-y-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs leading-relaxed text-amber-900">
                  <p>
                    ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가
                    기록되었습니다.
                  </p>
                  <Link
                    href="/admin/inquiries"
                    className="inline-block font-bold text-sky-700 underline underline-offset-4 hover:text-sky-900"
                  >
                    관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuickModal({ open: false, channel: "", topic: "" })
                  }
                  className="mt-5 w-full rounded-full bg-slate-900 py-2.5 text-sm font-bold text-white"
                >
                  확인
                </button>
              </div>
            ) : (
              <form onSubmit={handleReserveSubmit} className="mt-4 space-y-3">
                {quickModal.topic && (
                  <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700">
                    선택 항목: {quickModal.topic}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    성함 *
                  </label>
                  <input
                    type="text"
                    required
                    value={reserveName}
                    onChange={(e) => setReserveName(e.target.value)}
                    placeholder="홍길동"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={reservePhone}
                    onChange={(e) => setReservePhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
                  <Calendar className="h-4 w-4 shrink-0 text-sky-600" />
                  <span>대표전화 {companyPhone} · 일요일 사전예약제 운영</span>
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-slate-900 py-3 text-sm font-bold text-white transition-colors hover:bg-sky-600"
                >
                  상담 신청 완료하기
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
