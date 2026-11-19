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
  index: string;
  engLabel: string;
  title: string;
  subtitle: string;
  image: string;
  chips: SolutionChip[];
}

const LANG_HERO: Record<
  LangCode,
  {
    brandSub: string;
    heroHeadline: string;
    heroDesc: string;
    ctaReserve: string;
    ctaProgram: string;
    solutionEyebrow: string;
    solutionTitle: string;
    solutionSub: string;
    stemEyebrow: string;
    stemTitle: string;
    stemDesc: string;
  }
> = {
  KR: {
    brandSub: "CHEONGDAM PRIVATE DERMATOLOGY",
    heroHeadline: "시간이 머무는 곳, 청담의 정제된 피부 미학",
    heroDesc:
      "피부과 전문의 1:1 전담 진료 · 전 객실 독립 VIP 프라이빗 스위트",
    ctaReserve: "1:1 프라이빗 상담 예약",
    ctaProgram: "시그니처 프로그램 보기",
    solutionEyebrow: "THE CELLUCE SIGNATURE SOLUTIONS",
    solutionTitle: "더셀루체에서 완성되는 피부 디테일",
    solutionSub:
      "개인별 피부 두께와 노화 패턴을 정밀 분석하여 가장 우아하고 자연스러운 변화를 설계합니다.",
    stemEyebrow: "FUNDAMENTAL CARE · 근본적 접근",
    stemTitle: "세포재생치료",
    stemDesc:
      "일시적인 개선을 넘어 피부 본연의 자생력을 깨우는 줄기세포·성장인자 기반 재생 프로토콜. 손상된 진피 환경을 근본부터 복원하여 시간이 흐를수록 건강하게 빛나는 피부를 완성합니다.",
  },
  US: {
    brandSub: "CHEONGDAM PRIVATE DERMATOLOGY · SEOUL",
    heroHeadline: "Timeless Aesthetic Craft in the Heart of Cheongdam",
    heroDesc:
      "Board-Certified 1:1 Private Consultation · All-Suite Independent Care",
    ctaReserve: "Book Private Consultation",
    ctaProgram: "Explore Signature Programs",
    solutionEyebrow: "THE CELLUCE SIGNATURE SOLUTIONS",
    solutionTitle: "Bespoke Skin Detail Perfected at The Celluce",
    solutionSub:
      "Precision diagnostics tailored to your dermal structure for subtle, lasting radiance.",
    stemEyebrow: "FUNDAMENTAL APPROACH",
    stemTitle: "Stem Cell Regeneration",
    stemDesc:
      "Beyond temporary fixes, our stem-cell and growth-factor regeneration protocol awakens your skin's natural vitality from deep within the dermis.",
  },
  JP: {
    brandSub: "清潭洞 プライベート美容皮膚科",
    heroHeadline: "時を超えて輝く、清潭プライベート美肌美学",
    heroDesc:
      "皮膚科専門医による1:1専任診療 · 全室完全個室VIPスイート",
    ctaReserve: "1:1 プライベート相談予約",
    ctaProgram: "シグネチャープログラムを見る",
    solutionEyebrow: "THE CELLUCE SIGNATURE SOLUTIONS",
    solutionTitle: "ザ・セルーチェで完成する肌のディテール",
    solutionSub:
      "お一人おひとりの肌質と老化サインを精密に分析し、品格ある美しさをデザインします。",
    stemEyebrow: "根本的アプローチ",
    stemTitle: "細胞再生治療",
    stemDesc:
      "一時的な改善を超え、肌本来の再生力を呼び覚ます幹細胞・成長因子ベースの再生プロトコルで、内側から輝く素肌へ導きます。",
  },
  CN: {
    brandSub: "首尔清潭洞 私密高端皮肤科",
    heroHeadline: "时光臻驻，清潭洞私密高定肌肤美学",
    heroDesc: "皮肤科专科医师1:1专属诊疗 · 全程独立VIP私密套房",
    ctaReserve: "预约 1:1 私密面诊",
    ctaProgram: "探索臻享护理方案",
    solutionEyebrow: "THE CELLUCE SIGNATURE SOLUTIONS",
    solutionTitle: "在 THE CELLUCE 成就精致肌肤细节",
    solutionSub:
      "基于真皮层精密诊断，为您定制自然、优雅且持久的专属抗衰方案。",
    stemEyebrow: "根本性修护",
    stemTitle: "细胞再生治疗",
    stemDesc:
      "超越表层短暂改善，依托干细胞与生长因子再生方案，从真皮层根本修复受损肌底，唤醒肌肤原生健康光采。",
  },
};

const SOLUTION_CARDS: SolutionCard[] = [
  {
    id: "lifting",
    index: "01",
    engLabel: "LIFTING & CONTOUR",
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
    index: "02",
    engLabel: "COLLAGEN DENSITY",
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
    index: "03",
    engLabel: "TONE & CLARITY",
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
    index: "04",
    engLabel: "PORE & TEXTURE",
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
    index: "05",
    engLabel: "RADIANCE & GLOW",
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
    index: "06",
    engLabel: "SCALP & REGENERATION",
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
    headline: "이달의 한정 시그니처 듀얼 리프팅 프로모션",
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

const PRIVATE_PROGRAM_OPTIONS = [
  "리프팅(윤곽)",
  "탄력(밀도)",
  "톤(색소·여드름)",
  "피부결(모공·결)",
  "광택(윤기·물광)",
  "탈모치료",
  "세포재생치료",
  "1:1 원장 맞춤 상담",
];

export default function TheCelluceSkinSamplePage() {
  const [lang, setLang] = useState<LangCode>("KR");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 회원 로그인 상태 (헤더 로그인 버튼 <-> 전후사진 잠금 해제 연동)
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(false);

  // 시술 칩 클릭 시 상세 모달
  const [selectedChip, setSelectedChip] = useState<SolutionChip | null>(null);

  // 탭형 이벤트 팝업 모달 (헤더 EVENT / 우측 플로팅 바 / 섹션 링크에서 열기)
  const [eventPopupOpen, setEventPopupOpen] = useState(false);
  const [activeEventTab, setActiveEventTab] =
    useState<EventTab>("리프팅 특가");

  // 퀵 컨시어지 상담/예약 모달 (전화상담, 시술상세, 이벤트특가 연동)
  const [quickModal, setQuickModal] = useState<{
    open: boolean;
    channel: string;
    topic: string;
  }>({ open: false, channel: "전화상담예약", topic: "" });
  const [reserveName, setReserveName] = useState("");
  const [reservePhone, setReservePhone] = useState("");
  const [reserveSubmitting, setReserveSubmitting] = useState(false);
  const [reserveDone, setReserveDone] = useState(false);

  // 페이지 내 프라이빗 예약 섹션 폼 상태
  const [inlineName, setInlineName] = useState("");
  const [inlinePhone, setInlinePhone] = useState("");
  const [inlineProgram, setInlineProgram] = useState("리프팅(윤곽)");
  const [inlineMemo, setInlineMemo] = useState("");
  const [inlineSubmitting, setInlineSubmitting] = useState(false);
  const [inlineDone, setInlineDone] = useState(false);

  const [siteConfigs, setSiteConfigs] =
    useState<Record<string, string>>(DEFAULT_SITE_CONFIGS);

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

  const floatingRightEnabled = siteConfigs.floating_right_enabled !== "false";
  const quickKakaoUrl = (siteConfigs.quick_kakao_url ?? "").trim();
  const snsInstagramUrl = (siteConfigs.sns_instagram_url ?? "").trim();
  const snsBlogUrl = (siteConfigs.sns_blog_url ?? "").trim();

  let companyPhone = "02-540-9800";
  try {
    const info = JSON.parse(siteConfigs.footer_company_info || "{}") as {
      phone?: string;
    };
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

  const submitSkinInquiry = async (params: {
    name: string;
    phone: string;
    channel: string;
    topic: string;
    memo?: string;
  }) => {
    const body = {
      category: "ESTIMATE",
      customerName: params.name.trim() || "샘플 체험 고객",
      customerPhone: params.phone.trim() || "010-0000-0000",
      customerEmail: null,
      title: `[샘플체험-피부과] ${params.channel || "1:1 프라이빗 예약"}${params.topic ? ` (${params.topic})` : ""}`,
      content: `예약채널: ${params.channel || "1:1 프라이빗 예약"} / 선택시술: ${params.topic || "일반 상담"}${params.memo?.trim() ? ` / 메모: ${params.memo.trim()}` : ""}`,
      customFieldsJson: JSON.stringify({
        sampleSource: "skin",
        channel: params.channel,
        topic: params.topic,
        memo: params.memo?.trim() || "",
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
  };

  const handleReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reserveName.trim() || !reservePhone.trim() || reserveSubmitting) return;
    setReserveSubmitting(true);
    try {
      await submitSkinInquiry({
        name: reserveName,
        phone: reservePhone,
        channel: quickModal.channel || "1:1 프라이빗 예약",
        topic: quickModal.topic,
      });
      setReserveDone(true);
    } finally {
      setReserveSubmitting(false);
    }
  };

  const handleInlineReserveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inlineName.trim() || !inlinePhone.trim() || inlineSubmitting) return;
    setInlineSubmitting(true);
    try {
      await submitSkinInquiry({
        name: inlineName,
        phone: inlinePhone,
        channel: "1:1 프라이빗 상담 예약",
        topic: inlineProgram,
        memo: inlineMemo,
      });
      setInlineDone(true);
    } finally {
      setInlineSubmitting(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-white text-[#1C1C1C] antialiased selection:bg-[#B89768]/25 selection:text-[#1C1C1C]">
      {/* 최상단 데모 안내 띠 */}
      <div className="border-b border-white/10 bg-[#1C1C1C] px-4 py-2 text-xs text-[#D6CFC5]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-1.5">
          <p className="min-w-0 text-[#C2B9AD]">
            현재 보고 계신 페이지는 업종별 맞춤형 구축 데모 샘플입니다.
          </p>
          <div className="flex flex-wrap items-center gap-3 font-medium">
            <Link
              href="/"
              className="text-white underline decoration-[#8C7250] underline-offset-4 transition-colors hover:text-[#D4BC96]"
            >
              에이전시 메인으로 돌아가기
            </Link>
            <span className="text-white/25" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/login"
              className="text-[#D4BC96] underline decoration-[#B89768]/60 underline-offset-4 transition-colors hover:text-white"
            >
              관리자(/admin) 체험하기
            </Link>
            <span className="text-white/25" aria-hidden="true">
              |
            </span>
            <Link
              href="/admin/inquiries"
              className="text-[#B89768] underline decoration-[#B89768]/60 underline-offset-4 transition-colors hover:text-[#E8D7BC]"
            >
              관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
            </Link>
          </div>
        </div>
      </div>

      {/* 1. 청담 에디토리얼 화이트 헤더 */}
      <header className="sticky top-0 z-40 border-b border-[#EAE5DD] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-2 px-3 sm:h-[78px] sm:gap-3 sm:px-6">
          {/* 좌측 미니멀 심볼 + 로고 */}
          <a href="#top" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1C1C1C] text-[#1C1C1C] sm:h-9 sm:w-9">
              <span className="font-serif text-xs font-normal tracking-tight">
                TC
              </span>
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate font-serif text-xs font-medium tracking-[0.22em] text-[#1C1C1C] sm:text-sm">
                THE CELLUCE
              </div>
              <div className="truncate text-[9px] font-medium tracking-[0.22em] text-[#8C7250]">
                CHEONGDAM SKIN CLINIC
              </div>
            </div>
          </a>

          {/* 중앙 1줄 시술 카테고리 */}
          <nav className="hidden items-center gap-5 text-[12px] font-medium tracking-[0.04em] text-[#4A453F] xl:flex xl:gap-6 xl:text-[13px]">
            {[
              { label: "ABOUT", href: "#stem-cell" },
              { label: "SIGNATURE", href: "#solutions" },
              { label: "리프팅/탄력", href: "#solutions" },
              { label: "피부/색소/여드름", href: "#solutions" },
              { label: "광택/부스터", href: "#solutions" },
              { label: "탈모/두피", href: "#solutions" },
              { label: "시술사례", href: "#before-after" },
              { label: "프라이빗 예약", href: "#private-reservation" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="shrink-0 transition-colors hover:text-[#8C7250]"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => setEventPopupOpen(true)}
              className="inline-flex shrink-0 items-center gap-1.5 font-semibold tracking-[0.12em] text-[#8C7250] transition-colors hover:text-[#1C1C1C]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B89768]" />
              <span>EVENT</span>
            </button>
          </nav>

          {/* 우측 로그인 | 회원가입 + 언어 전환 */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <div className="hidden items-center gap-1.5 text-[11px] font-medium text-[#6E675F] sm:flex">
              {isMemberLoggedIn ? (
                <button
                  type="button"
                  onClick={() => setIsMemberLoggedIn(false)}
                  className="inline-flex items-center gap-1 font-semibold text-[#8C7250] hover:underline"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  <span>회원 로그인중 (로그아웃)</span>
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsMemberLoggedIn(true)}
                    className="transition-colors hover:text-[#1C1C1C]"
                  >
                    로그인
                  </button>
                  <span className="text-[#DCD5CA]">|</span>
                  <button
                    type="button"
                    onClick={() => setIsMemberLoggedIn(true)}
                    className="transition-colors hover:text-[#1C1C1C]"
                  >
                    회원가입
                  </button>
                </>
              )}
            </div>

            {/* 언어 전환 버튼 (KR | US | JP | CN) */}
            <div
              className="inline-flex items-center rounded-full border border-[#E5DFD5] bg-[#F9F8F6] p-0.5"
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
                  className={`rounded-full px-1.5 py-1 text-[10px] font-semibold tracking-wider transition-colors sm:px-2.5 sm:text-[11px] ${
                    lang === item.code
                      ? "bg-[#1C1C1C] text-white"
                      : "text-[#6E675F] hover:text-[#1C1C1C]"
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
              className="inline-flex h-9 w-9 items-center justify-center border border-[#E5DFD5] text-[#1C1C1C] transition-colors hover:border-[#A68A64] xl:hidden"
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
          <div className="border-t border-[#EAE5DD] bg-white px-4 py-5 xl:hidden">
            <div className="mb-4 flex items-center justify-between border-b border-[#EAE5DD] pb-3 text-xs">
              <span className="font-medium text-[#6E675F]">회원 메뉴</span>
              <button
                type="button"
                onClick={() => {
                  setIsMemberLoggedIn((prev) => !prev);
                  setMobileMenuOpen(false);
                }}
                className="font-semibold text-[#8C7250]"
              >
                {isMemberLoggedIn
                  ? "로그아웃 (전후사진 잠금)"
                  : "로그인 (전후사진 잠금해제)"}
              </button>
            </div>
            <nav className="grid grid-cols-2 gap-2 text-xs font-medium text-[#3D3832]">
              {[
                { label: "ABOUT", href: "#stem-cell" },
                { label: "SIGNATURE", href: "#solutions" },
                { label: "리프팅/탄력", href: "#solutions" },
                { label: "피부/색소/여드름", href: "#solutions" },
                { label: "광택/부스터", href: "#solutions" },
                { label: "탈모/두피", href: "#solutions" },
                { label: "시술사례", href: "#before-after" },
                { label: "1:1 프라이빗 예약", href: "#private-reservation" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="border border-[#EAE5DD] bg-[#F9F8F6] px-3 py-2.5 transition-colors hover:border-[#A68A64]"
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
                className="col-span-2 border border-[#B89768]/50 bg-[#1C1C1C] px-3 py-2.5 text-center font-semibold tracking-[0.1em] text-[#E6D3B3]"
              >
                EVENT 프로모션 팝업 보기
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* 2. 풀스크린 청담 하이엔드 히어로 (min-h-[85vh]) */}
      <section
        id="top"
        className="relative flex min-h-[85vh] w-full items-center justify-center overflow-hidden bg-[#1C1C1C]"
      >
        <img
          src="/images/samples/skin-hero.jpg"
          alt="더셀루체 청담 프라이빗 대리석 로비"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/images/samples/fallback.svg";
          }}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1C]/60 via-[#1C1C1C]/30 to-[#1C1C1C]/65" />

        {/* 중앙 세리프 에디토리얼 타이틀 & 얇은 라인 CTA */}
        <div className="relative z-10 mx-auto max-w-4xl px-5 py-24 text-center text-white">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D4BC96]/65 bg-[#1C1C1C]/25 backdrop-blur-xs sm:h-16 sm:w-16">
            <span className="font-serif text-lg font-light tracking-[0.14em] text-[#F5EFE6] sm:text-xl">
              TC
            </span>
          </div>

          <p className="mt-7 text-[10px] font-medium tracking-[0.26em] text-[#E6D5B8] uppercase sm:text-xs">
            {t.brandSub}
          </p>

          <h1 className="mt-4 font-serif text-3xl font-light tracking-[0.22em] text-white drop-shadow-xs sm:text-5xl lg:text-[64px]">
            THE CELLUCE
          </h1>

          <div
            className="mx-auto my-6 h-px w-12 bg-[#B89768]/80"
            aria-hidden="true"
          />

          <p className="font-serif text-base font-light tracking-[0.08em] text-white/95 sm:text-2xl">
            {t.heroHeadline}
          </p>
          <p className="mt-3 text-xs font-normal tracking-[0.08em] text-white/80 sm:text-sm">
            {t.heroDesc}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row sm:gap-4">
            <a
              href="#private-reservation"
              className="inline-flex w-full max-w-[260px] items-center justify-center gap-2 border border-[#B89768] bg-[#1C1C1C]/75 px-7 py-3.5 text-xs font-medium tracking-[0.12em] text-white backdrop-blur-xs transition-all duration-300 hover:bg-[#B89768] hover:text-[#1C1C1C] sm:w-auto sm:max-w-none"
            >
              <span>{t.ctaReserve}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="#solutions"
              className="inline-flex w-full max-w-[260px] items-center justify-center gap-2 border border-white/60 bg-white/10 px-7 py-3.5 text-xs font-medium tracking-[0.12em] text-white backdrop-blur-xs transition-all duration-300 hover:border-white hover:bg-white hover:text-[#1C1C1C] sm:w-auto sm:max-w-none"
            >
              <span>{t.ctaProgram}</span>
            </a>
          </div>
        </div>

        {/* 하단 미니멀 스크롤 큐 */}
        <div
          className="pointer-events-none absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 sm:flex"
          aria-hidden="true"
        >
          <span className="text-[9px] tracking-[0.3em] text-white/70 uppercase">
            SCROLL
          </span>
          <span className="h-7 w-px bg-gradient-to-b from-[#B89768] to-transparent" />
        </div>
      </section>

      {/* 3. 시술/솔루션 섹션 — 순백(#FFFFFF) + 넓은 여백 + 부드러운 호버 줌인 + 에디토리얼 캡션 */}
      <section id="solutions" className="bg-[#FFFFFF] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-medium tracking-[0.26em] text-[#8C7250] uppercase">
              {t.solutionEyebrow}
            </p>
            <h2 className="mt-3.5 font-serif text-2xl font-normal tracking-[0.06em] text-[#1C1C1C] sm:text-4xl">
              {t.solutionTitle}
            </h2>
            <div
              className="mx-auto my-5 h-px w-10 bg-[#B89768]"
              aria-hidden="true"
            />
            <p className="text-xs leading-relaxed text-[#6E675F] sm:text-sm">
              {t.solutionSub}
            </p>
            <button
              type="button"
              onClick={() => setEventPopupOpen(true)}
              className="mt-5 inline-flex items-center gap-1.5 border-b border-[#B89768] pb-0.5 text-xs font-medium tracking-[0.08em] text-[#8C7250] transition-colors hover:border-[#1C1C1C] hover:text-[#1C1C1C]"
            >
              <span>이달의 프라이빗 프로모션 확인하기</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
            {SOLUTION_CARDS.map((card) => (
              <article
                key={card.id}
                className="group flex min-w-0 flex-col"
              >
                {/* 클린 포트레이트 에디토리얼 이미지 + 부드러운 줌인 */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F1EC]">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/samples/fallback.svg";
                    }}
                    className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>

                {/* 하단 에디토리얼 캡션 (인덱스 번호 01~06 + 세리프/산세리프 타이틀 + 정제된 시술 칩) */}
                <div className="flex flex-1 flex-col pt-6">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-sm tracking-[0.18em] text-[#A68A64]">
                      {card.index}
                    </span>
                    <span
                      className="h-px flex-1 bg-[#EAE5DD]"
                      aria-hidden="true"
                    />
                    <span className="text-[10px] font-medium tracking-[0.18em] text-[#8F877D] uppercase">
                      {card.engLabel}
                    </span>
                  </div>

                  <h3 className="mt-3.5 font-serif text-xl font-medium tracking-[0.04em] text-[#1C1C1C]">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-[#6E675F]">
                    {card.subtitle}
                  </p>

                  {/* 정제된 시술 알약 칩 */}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.chips.map((chip) => (
                      <button
                        key={chip.name}
                        type="button"
                        onClick={() => setSelectedChip(chip)}
                        className="group/chip inline-flex max-w-full items-center gap-2 rounded-full border border-[#E5DFD5] bg-[#F9F8F6] py-1 pl-1.5 pr-3 text-xs font-medium text-[#3D3832] transition-all duration-200 hover:border-[#A68A64] hover:bg-[#1C1C1C] hover:text-white"
                      >
                        <img
                          src={chip.thumb}
                          alt={chip.name}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/images/samples/fallback.svg";
                          }}
                          className="h-5 w-5 shrink-0 rounded-full object-cover ring-1 ring-[#EAE5DD]"
                        />
                        <span className="truncate">{chip.name}</span>
                        <ChevronRight className="h-3 w-3 shrink-0 text-[#A68A64] transition-transform group-hover/chip:translate-x-0.5 group-hover/chip:text-[#D4BC96]" />
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 에디토리얼 시그니처 섹션 — 웜 아이보리(#F9F8F6) 배경 위 차콜(#1C1C1C) & 뮤트 골드 배너 */}
      <section
        id="stem-cell"
        className="border-y border-[#EAE5DD] bg-[#F9F8F6] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden border border-[#B89768]/25 bg-[#1C1C1C] px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            {/* 상단 대형 세리프 영문 타이포 배너 */}
            <div className="border-b border-white/10 pb-10 text-center sm:pb-12">
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#B89768] uppercase">
                THE CELLUCE SIGNATURE LAB
              </p>
              <h2 className="mt-3.5 font-serif text-3xl font-light italic tracking-[0.06em] text-white sm:text-5xl lg:text-6xl">
                Stem Cell Regeneration
              </h2>
            </div>

            {/* 하단 좌측 정사각형 이미지 & 우측 에디토리얼 설명 */}
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="min-w-0 lg:col-span-5">
                <div className="mx-auto aspect-square max-w-md overflow-hidden border border-[#B89768]/30 bg-[#262320]">
                  <img
                    src="/images/samples/skin-stem.jpg"
                    alt="더셀루체 세포재생치료 연구소"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "/images/samples/fallback.svg";
                    }}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
              </div>

              <div className="min-w-0 lg:col-span-7">
                <span className="inline-block border border-[#B89768]/45 bg-[#B89768]/10 px-3.5 py-1 text-[11px] font-medium tracking-[0.16em] text-[#D4BC96]">
                  {t.stemEyebrow}
                </span>
                <h3 className="mt-5 font-serif text-2xl font-normal tracking-[0.06em] text-white sm:text-4xl">
                  {t.stemTitle}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-[#CFC8BE] sm:text-[15px]">
                  {t.stemDesc}
                </p>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "고순도 재생 인자", val: "자생력 극대화" },
                    { label: "3D 진피 정밀 진단", val: "1:1 맞춤 프로토콜" },
                    { label: "무균 클린룸 배합", val: "안전성 100% 검증" },
                  ].map((box) => (
                    <div
                      key={box.label}
                      className="border border-white/10 bg-white/[0.03] p-4"
                    >
                      <div className="text-[11px] tracking-[0.04em] text-[#B89768]">
                        {box.label}
                      </div>
                      <div className="mt-1.5 text-sm font-medium text-white">
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
                  className="mt-9 inline-flex items-center gap-2 border border-[#B89768] bg-transparent px-7 py-3.5 text-xs font-medium tracking-[0.12em] text-[#F5EFE6] transition-all duration-300 hover:bg-[#B89768] hover:text-[#1C1C1C] sm:text-sm"
                >
                  <span>세포재생치료 1:1 상담 신청</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 의료법 준수 전후사진 회원 잠금 섹션 — 순백(#FFFFFF) */}
      <section id="before-after" className="bg-[#FFFFFF] py-24 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium tracking-[0.26em] text-[#8C7250] uppercase">
                CLINICAL ARCHIVE
              </p>
              <h2 className="mt-3 font-serif text-2xl font-normal tracking-[0.05em] text-[#1C1C1C] sm:text-4xl">
                실제 시술 전후사진 (Before &amp; After)
              </h2>
              <p className="mt-2.5 text-xs leading-relaxed text-[#6E675F] sm:text-sm">
                의료법 제56조에 의거하여 시술 전후사진은 회원 로그인 후 열람
                가능합니다. (상단 헤더 로그인 버튼과 연동됩니다)
              </p>
            </div>

            {isMemberLoggedIn && (
              <button
                type="button"
                onClick={() => setIsMemberLoggedIn(false)}
                className="inline-flex shrink-0 items-center gap-1.5 self-start border border-[#DCD5CA] bg-[#F9F8F6] px-4 py-2.5 text-xs font-medium text-[#1C1C1C] transition-colors hover:border-[#1C1C1C] sm:self-auto"
              >
                <Lock className="h-3.5 w-3.5 text-[#8C7250]" />
                <span>잠금 상태로 되돌리기</span>
              </button>
            )}
          </div>

          <div className="relative mt-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {BEFORE_AFTER_CASES.map((item) => (
                <article
                  key={item.id}
                  className="min-w-0 overflow-hidden border border-[#EAE5DD] bg-[#F9F8F6]"
                >
                  <div className="grid grid-cols-2 gap-0.5 bg-[#EAE5DD]">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#EFECE6]">
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
                      <span className="absolute left-2.5 top-2.5 bg-[#1C1C1C]/80 px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] text-white">
                        BEFORE
                      </span>
                    </div>
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#EFECE6]">
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
                      <span className="absolute right-2.5 top-2.5 bg-[#8C7250] px-2 py-0.5 text-[10px] font-medium tracking-[0.14em] text-white">
                        AFTER
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#8C7250]">
                      <span>{item.period}</span>
                      <span className="text-[#8F877D]">{item.doctor}</span>
                    </div>
                    <h3 className="mt-2 font-serif text-sm font-medium text-[#1C1C1C] sm:text-base">
                      {item.title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>

            {!isMemberLoggedIn && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#1C1C1C]/50 p-4 backdrop-blur-[3px]">
                <div className="max-w-md border border-[#E5DFD5] bg-white p-7 text-center shadow-2xl sm:p-9">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E5DFD5] bg-[#F9F8F6] text-[#8C7250]">
                    <Lock className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-serif text-lg font-medium tracking-[0.04em] text-[#1C1C1C]">
                    회원 전용 전후사진 열람 안내
                  </h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-[#6E675F] sm:text-sm">
                    의료법 준수를 위해 비로그인 상태에서는 전후사진이 블러
                    처리됩니다. 아래 버튼 또는 상단 로그인 클릭 시 즉시
                    확인하실 수 있습니다.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsMemberLoggedIn(true)}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 bg-[#1C1C1C] px-5 py-3.5 text-xs font-medium tracking-[0.08em] text-white transition-colors hover:bg-[#8C7250] sm:text-sm"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>회원 로그인 후 전후사진 확인하기 (1초 데모)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {isMemberLoggedIn && (
            <div className="mt-6 flex items-center justify-center gap-2 border border-[#DFD4C3] bg-[#F9F8F6] px-4 py-3 text-xs font-medium text-[#5C4B35]">
              <Eye className="h-4 w-4 shrink-0 text-[#8C7250]" />
              <span>
                회원 로그인 상태가 활성화되어 실제 시술 전후사진이 선명하게
                공개되었습니다.
              </span>
            </div>
          )}
        </div>
      </section>

      {/* 6. 페이지 내 프라이빗 상담/예약 섹션 — 웜 아이보리(#F9F8F6) */}
      <section
        id="private-reservation"
        className="border-t border-[#EAE5DD] bg-[#F9F8F6] py-24 sm:py-28"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {/* 좌측 컨시어지 안내 */}
            <div className="min-w-0 lg:col-span-5">
              <p className="text-[11px] font-medium tracking-[0.26em] text-[#8C7250] uppercase">
                PRIVATE CONCIERGE
              </p>
              <h2 className="mt-3.5 font-serif text-3xl font-normal tracking-[0.06em] text-[#1C1C1C] sm:text-4xl">
                1:1 프라이빗 상담 예약
              </h2>
              <div
                className="my-6 h-px w-10 bg-[#B89768]"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-[#5C564E]">
                더셀루체 청담은 모든 고객님께 온전한 집중과 프라이버시를
                제공하기 위해 100% 사전 예약제 및 전 객실 1인 VIP 룸으로
                운영됩니다.
              </p>

              <div className="mt-8 space-y-4 border-t border-[#E5DFD5] pt-7 text-xs text-[#5C564E] sm:text-sm">
                <div className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#A68A64]" />
                  <div>
                    <div className="text-[11px] tracking-[0.12em] text-[#8F877D] uppercase">
                      CONCIERGE DESK
                    </div>
                    <div className="mt-0.5 font-serif text-lg tracking-[0.06em] text-[#1C1C1C]">
                      {companyPhone}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#A68A64]" />
                  <div>
                    <div className="text-[11px] tracking-[0.12em] text-[#8F877D] uppercase">
                      CLINIC HOURS
                    </div>
                    <p className="mt-0.5 leading-relaxed">
                      평일 10:00 ~ 19:30 / 토요일 10:00 ~ 16:00
                      <br />
                      일요일 11:00 ~ 17:00 (100% 사전예약제)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#A68A64]" />
                  <div>
                    <div className="text-[11px] tracking-[0.12em] text-[#8F877D] uppercase">
                      LOCATION
                    </div>
                    <p className="mt-0.5">
                      서울특별시 강남구 압구정로 428 루체타워 5층 (청담동) ·
                      발렛파킹
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {quickKakaoUrl && (
                  <a
                    href={quickKakaoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-[#1C1C1C] bg-white px-5 py-3 text-xs font-medium tracking-[0.08em] text-[#1C1C1C] transition-colors hover:bg-[#1C1C1C] hover:text-white"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-[#A68A64]" />
                    <span>카카오 컨시어지 상담</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setEventPopupOpen(true)}
                  className="inline-flex items-center gap-2 border border-[#B89768] bg-transparent px-5 py-3 text-xs font-medium tracking-[0.08em] text-[#8C7250] transition-colors hover:bg-[#B89768] hover:text-white"
                >
                  <Gift className="h-3.5 w-3.5" />
                  <span>이달의 이벤트 보기</span>
                </button>
              </div>
            </div>

            {/* 우측 예약 폼 카드 */}
            <div className="min-w-0 lg:col-span-7">
              <div className="border border-[#E5DFD5] bg-white p-6 shadow-xs sm:p-10">
                {inlineDone ? (
                  <div className="py-8 text-center">
                    <CheckCircle2 className="mx-auto h-12 w-12 text-[#8C7250]" />
                    <h3 className="mt-4 font-serif text-xl font-medium text-[#1C1C1C]">
                      프라이빗 상담 예약이 접수되었습니다
                    </h3>
                    <p className="mt-2.5 text-xs leading-relaxed text-[#6E675F] sm:text-sm">
                      {inlineName}님({inlinePhone}), 선택하신 [{inlineProgram}]
                      관련하여 전담 컨시어지가 확인 후 신속히 안내드리겠습니다.
                    </p>
                    <div className="mt-6 space-y-2 border border-[#E2D6C3] bg-[#F9F8F6] px-4 py-3.5 text-left text-xs leading-relaxed text-[#5C4B35]">
                      <p>
                        ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가
                        기록되었습니다.
                      </p>
                      <Link
                        href="/admin/inquiries"
                        className="inline-block font-semibold text-[#8C7250] underline underline-offset-4 transition-colors hover:text-[#1C1C1C]"
                      >
                        관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setInlineDone(false);
                        setInlineName("");
                        setInlinePhone("");
                        setInlineMemo("");
                      }}
                      className="mt-6 inline-flex items-center justify-center border border-[#1C1C1C] px-7 py-3 text-xs font-medium tracking-[0.12em] text-[#1C1C1C] transition-colors hover:bg-[#1C1C1C] hover:text-white"
                    >
                      추가 상담 예약하기
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleInlineReserveSubmit}
                    className="space-y-6"
                  >
                    <div className="border-b border-[#EAE5DD] pb-4">
                      <p className="text-[11px] font-medium tracking-[0.2em] text-[#8C7250] uppercase">
                        RESERVATION REQUEST
                      </p>
                      <h3 className="mt-1 font-serif text-xl font-normal text-[#1C1C1C]">
                        맞춤 진단 및 시술 예약 신청
                      </h3>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="inline-name"
                          className="block text-xs font-medium tracking-[0.04em] text-[#4A453F]"
                        >
                          성함 *
                        </label>
                        <input
                          id="inline-name"
                          type="text"
                          required
                          value={inlineName}
                          onChange={(e) => setInlineName(e.target.value)}
                          placeholder="성함을 입력해 주세요"
                          className="mt-2 w-full border border-[#DCD5CA] bg-[#FDFCFA] px-3.5 py-2.5 text-sm text-[#1C1C1C] placeholder:text-[#A8A095] focus:border-[#A68A64] focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="inline-phone"
                          className="block text-xs font-medium tracking-[0.04em] text-[#4A453F]"
                        >
                          연락처 *
                        </label>
                        <input
                          id="inline-phone"
                          type="tel"
                          required
                          value={inlinePhone}
                          onChange={(e) => setInlinePhone(e.target.value)}
                          placeholder="010-0000-0000"
                          className="mt-2 w-full border border-[#DCD5CA] bg-[#FDFCFA] px-3.5 py-2.5 text-sm text-[#1C1C1C] placeholder:text-[#A8A095] focus:border-[#A68A64] focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-medium tracking-[0.04em] text-[#4A453F]">
                        관심 프로그램 선택
                      </span>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {PRIVATE_PROGRAM_OPTIONS.map((program) => (
                          <button
                            key={program}
                            type="button"
                            onClick={() => setInlineProgram(program)}
                            className={`border px-3.5 py-1.5 text-xs transition-colors ${
                              inlineProgram === program
                                ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
                                : "border-[#E5DFD5] bg-[#F9F8F6] text-[#5C564E] hover:border-[#A68A64] hover:text-[#1C1C1C]"
                            }`}
                          >
                            {program}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="inline-memo"
                        className="block text-xs font-medium tracking-[0.04em] text-[#4A453F]"
                      >
                        희망 일정 및 피부 고민 (선택)
                      </label>
                      <textarea
                        id="inline-memo"
                        rows={3}
                        value={inlineMemo}
                        onChange={(e) => setInlineMemo(e.target.value)}
                        placeholder="희망하시는 방문 일시나 고민 부위를 남겨주시면 원장 상담 전 미리 검토해 드립니다."
                        className="mt-2 w-full resize-none border border-[#DCD5CA] bg-[#FDFCFA] px-3.5 py-2.5 text-sm text-[#1C1C1C] placeholder:text-[#A8A095] focus:border-[#A68A64] focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={inlineSubmitting}
                      className="w-full bg-[#1C1C1C] py-3.5 text-xs font-medium tracking-[0.16em] text-white transition-colors hover:bg-[#8C7250] disabled:opacity-60 sm:text-sm"
                    >
                      {inlineSubmitting
                        ? "예약 접수 중..."
                        : "1:1 프라이빗 상담 예약 신청하기"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. 청담 부티크 차콜 푸터 */}
      <footer
        id="location"
        className="border-t border-white/10 bg-[#1C1C1C] pb-28 pt-16 text-[#A8A095] sm:pb-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 border-b border-white/10 pb-12 md:grid-cols-3">
            <div>
              <div className="font-serif text-xl font-light tracking-[0.24em] text-white">
                THE CELLUCE
              </div>
              <div className="mt-1 text-[10px] tracking-[0.22em] text-[#B89768] uppercase">
                CHEONGDAM PRIVATE SKIN CLINIC
              </div>
              <p className="mt-4 text-xs leading-relaxed text-[#A8A095]">
                더셀루체 피부과의원은 피부과 전문의 책임 진료와 1인 프라이빗
                스위트 케어를 통해 가장 우아하고 안전한 피부 솔루션을
                제공합니다.
              </p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-medium tracking-[0.06em] text-white">
                <MapPin className="h-4 w-4 text-[#B89768]" />
                <span>오시는 길 · 발렛파킹</span>
              </div>
              <p>서울특별시 강남구 압구정로 428 루체타워 5층 (청담동)</p>
              <p>수인분당선 압구정로데오역 3번 출구 도보 3분 · 발렛파킹 지원</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 font-medium tracking-[0.06em] text-white">
                <Clock className="h-4 w-4 text-[#B89768]" />
                <span>진료시간 · 컨시어지 대표전화</span>
              </div>
              <p>평일 10:00~19:30 / 토요일 10:00~16:00 / 일요일 예약진료</p>
              <p className="flex items-center gap-2 pt-1 font-serif text-base tracking-[0.08em] text-white">
                <Phone className="h-3.5 w-3.5 text-[#B89768]" />
                <span>{companyPhone}</span>
              </p>
            </div>
          </div>

          <div className="mt-7 flex flex-col justify-between gap-2 text-[11px] text-[#7D766D] sm:flex-row">
            <p>
              의료기관명: 더셀루체피부과의원 | 대표원장: 강서연 |
              사업자등록번호: 261-94-01827 | 강남구 보건소 개설 신고 필
            </p>
            <p>© 2026 THE CELLUCE SKIN CLINIC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* 8. 우측 플로팅 컨시어지 바 (차콜 #1C1C1C + 뮤트 골드 #B89768 포인트 통합) */}
      {floatingRightEnabled && (
        <>
          <aside
            aria-label="프라이빗 퀵 메뉴"
            className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col overflow-hidden border border-[#B89768]/30 bg-[#1C1C1C]/95 text-[10px] font-medium text-[#D6CFC5] shadow-2xl backdrop-blur-md sm:flex"
          >
            <button
              type="button"
              onClick={() =>
                openQuickModal("전화상담예약", `대표전화 ${companyPhone}`)
              }
              className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
            >
              <Phone className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
              <span>전화</span>
            </button>

            {quickKakaoUrl && (
              <a
                href={quickKakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
              >
                <MessageCircle className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
                <span>카카오상담</span>
              </a>
            )}

            <a
              href="#private-reservation"
              className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
            >
              <Calendar className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
              <span>예약</span>
            </a>

            <button
              type="button"
              onClick={() => setEventPopupOpen(true)}
              className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
            >
              <Gift className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
              <span>이벤트</span>
            </button>

            <a
              href="#before-after"
              className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
            >
              <Eye className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
              <span>전후사진</span>
            </a>

            {snsInstagramUrl && (
              <a
                href={snsInstagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
              >
                <Instagram className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
                <span>인스타</span>
              </a>
            )}

            {snsBlogUrl && (
              <a
                href={snsBlogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
              >
                <BookOpen className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
                <span>블로그</span>
              </a>
            )}

            <a
              href="#location"
              className="group flex flex-col items-center gap-1 border-b border-white/10 px-2.5 py-2.5 transition-colors hover:bg-[#2A2622] hover:text-white"
            >
              <MapPin className="h-3.5 w-3.5 text-[#B89768] transition-colors group-hover:text-[#E6D3B3]" />
              <span>오시는길</span>
            </a>

            <button
              type="button"
              onClick={scrollToTop}
              className="flex flex-col items-center gap-0.5 bg-[#121110] px-2.5 py-2 text-[9px] font-semibold tracking-[0.16em] text-[#D4BC96] transition-colors hover:bg-[#B89768] hover:text-[#1C1C1C]"
            >
              <ArrowUp className="h-3.5 w-3.5" />
              <span>TOP</span>
            </button>
          </aside>

          {/* 모바일(360px) 전용 우측 하단 컴팩트 퀵 액션 */}
          <div className="fixed bottom-16 right-3 z-40 flex flex-col gap-2 sm:hidden">
            <a
              href="#private-reservation"
              className="flex h-10 w-10 items-center justify-center border border-[#B89768]/40 bg-[#1C1C1C]/95 text-[#B89768] shadow-lg backdrop-blur-xs"
              aria-label="프라이빗 상담 예약"
            >
              <Calendar className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={() =>
                openQuickModal("전화상담예약", `대표전화 ${companyPhone}`)
              }
              className="flex h-10 w-10 items-center justify-center border border-[#B89768]/40 bg-[#1C1C1C]/95 text-[#B89768] shadow-lg backdrop-blur-xs"
              aria-label="전화상담예약"
            >
              <Phone className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="flex h-10 w-10 items-center justify-center border border-white/15 bg-[#1C1C1C]/95 text-white shadow-lg backdrop-blur-xs"
              aria-label="맨 위로"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </>
      )}

      {/* 9. 탭형 이벤트 팝업 모달 */}
      {eventPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1C1C]/65 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg overflow-hidden border border-[#B89768]/30 bg-white shadow-2xl">
            {/* 팝업 헤더 */}
            <div className="flex items-center justify-between bg-[#1C1C1C] px-6 py-5 text-white">
              <div className="min-w-0 pr-3">
                <span className="text-[10px] font-medium tracking-[0.24em] text-[#B89768] uppercase">
                  THE CELLUCE PRIVATE PROMOTION
                </span>
                <h3 className="mt-1 font-serif text-base font-normal tracking-[0.03em] text-white sm:text-lg">
                  {EVENT_POPUP_TABS[activeEventTab].headline}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEventPopupOpen(false)}
                aria-label="팝업 닫기"
                className="shrink-0 p-1 text-[#A8A095] transition-colors hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 특가 3종 리스트 */}
            <div className="space-y-3 bg-[#F9F8F6] p-5">
              {EVENT_POPUP_TABS[activeEventTab].offers.map((offer) => (
                <div
                  key={offer.title}
                  className="flex items-center justify-between gap-3 border border-[#E5DFD5] bg-white p-4"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#1C1C1C]">
                      {offer.title}
                    </div>
                    <div className="mt-1 text-xs leading-relaxed text-[#6E675F]">
                      {offer.desc}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="font-serif text-sm font-semibold text-[#8C7250]">
                      {offer.price}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEventPopupOpen(false);
                        openQuickModal("이벤트 특가 예약", offer.title);
                      }}
                      className="mt-1.5 text-[11px] font-medium text-[#1C1C1C] underline decoration-[#B89768] underline-offset-4 transition-colors hover:text-[#8C7250]"
                    >
                      예약하기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 하단 5개 탭 전환 */}
            <div className="grid grid-cols-5 border-t border-[#E5DFD5] bg-white text-center text-[10px] font-medium sm:text-xs">
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
                  className={`border-r border-[#EAE5DD] px-1 py-3 last:border-r-0 transition-colors ${
                    activeEventTab === tab
                      ? "bg-[#1C1C1C] text-[#E6D3B3]"
                      : "text-[#5C564E] hover:bg-[#F9F8F6]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* 오늘 하루 보지 않기 / 닫기 */}
            <div className="flex items-center justify-between border-t border-[#E5DFD5] bg-[#F4F1EC] px-5 py-2.5 text-xs text-[#6E675F]">
              <button
                type="button"
                onClick={() => setEventPopupOpen(false)}
                className="transition-colors hover:text-[#1C1C1C]"
              >
                오늘 하루 보지 않기
              </button>
              <button
                type="button"
                onClick={() => setEventPopupOpen(false)}
                className="font-semibold text-[#1C1C1C] hover:underline"
              >
                닫기 X
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 10. 시술 알약 칩 클릭 시 시술 상세 모달 */}
      {selectedChip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1C1C]/65 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md overflow-hidden border border-[#E5DFD5] bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EAE5DD] px-6 py-5">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedChip.thumb}
                  alt={selectedChip.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/samples/fallback.svg";
                  }}
                  className="h-11 w-11 rounded-full object-cover ring-1 ring-[#DFD8CC]"
                />
                <div>
                  <div className="text-[11px] font-medium tracking-[0.12em] text-[#8C7250]">
                    {selectedChip.category}
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#1C1C1C]">
                    {selectedChip.name}
                  </h3>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedChip(null)}
                aria-label="닫기"
                className="p-1 text-[#8F877D] transition-colors hover:text-[#1C1C1C]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-6 text-sm">
              <p className="leading-relaxed text-[#4A453F]">
                {selectedChip.summary}
              </p>
              <div className="space-y-2 border border-[#EAE5DD] bg-[#F9F8F6] p-4 text-xs">
                <div>
                  <span className="font-semibold text-[#1C1C1C]">
                    추천 대상:{" "}
                  </span>
                  <span className="text-[#5C564E]">{selectedChip.target}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#1C1C1C]">
                    소요 시간:{" "}
                  </span>
                  <span className="text-[#5C564E]">
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
                className="w-full bg-[#1C1C1C] py-3.5 text-xs font-medium tracking-[0.12em] text-white transition-colors hover:bg-[#8C7250] sm:text-sm"
              >
                {selectedChip.name} 프라이빗 상담 예약하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11. 퀵 컨시어지 상담/예약 모달 */}
      {quickModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1C1C]/65 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md border border-[#E5DFD5] bg-white p-6 shadow-2xl sm:p-7">
            <div className="flex items-center justify-between border-b border-[#EAE5DD] pb-4">
              <div>
                <div className="text-[10px] font-medium tracking-[0.22em] text-[#8C7250] uppercase">
                  THE CELLUCE CONCIERGE
                </div>
                <h3 className="mt-1 font-serif text-lg font-medium text-[#1C1C1C]">
                  {quickModal.channel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() =>
                  setQuickModal({ open: false, channel: "", topic: "" })
                }
                aria-label="닫기"
                className="p-1 text-[#8F877D] transition-colors hover:text-[#1C1C1C]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {reserveDone ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-[#8C7250]" />
                <h4 className="mt-3.5 font-serif text-base font-medium text-[#1C1C1C]">
                  상담 예약이 접수되었습니다
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-[#6E675F]">
                  {reserveName}님({reservePhone}), 전담 코디네이터가 확인 후
                  빠르게 연락드리겠습니다.
                </p>
                <div className="mt-4 space-y-1.5 border border-[#E2D6C3] bg-[#F9F8F6] px-3.5 py-3 text-left text-xs leading-relaxed text-[#5C4B35]">
                  <p>
                    ※ 실제 백엔드 DB(또는 오프라인 데모 저장소)에 문의가
                    기록되었습니다.
                  </p>
                  <Link
                    href="/admin/inquiries"
                    className="inline-block font-semibold text-[#8C7250] underline underline-offset-4 transition-colors hover:text-[#1C1C1C]"
                  >
                    관리자(/admin/inquiries)에서 방금 넣은 문의 확인하기 →
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setQuickModal({ open: false, channel: "", topic: "" })
                  }
                  className="mt-5 w-full bg-[#1C1C1C] py-3 text-xs font-medium tracking-[0.14em] text-white transition-colors hover:bg-[#8C7250]"
                >
                  확인
                </button>
              </div>
            ) : (
              <form onSubmit={handleReserveSubmit} className="mt-5 space-y-4">
                {quickModal.topic && (
                  <div className="border border-[#EAE5DD] bg-[#F9F8F6] px-3.5 py-2.5 text-xs font-medium text-[#4A453F]">
                    선택 항목: {quickModal.topic}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-[#4A453F]">
                    성함 *
                  </label>
                  <input
                    type="text"
                    required
                    value={reserveName}
                    onChange={(e) => setReserveName(e.target.value)}
                    placeholder="홍길동"
                    className="mt-1.5 w-full border border-[#DCD5CA] bg-[#FDFCFA] px-3.5 py-2.5 text-sm text-[#1C1C1C] placeholder:text-[#A8A095] focus:border-[#A68A64] focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A453F]">
                    연락처 *
                  </label>
                  <input
                    type="tel"
                    required
                    value={reservePhone}
                    onChange={(e) => setReservePhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="mt-1.5 w-full border border-[#DCD5CA] bg-[#FDFCFA] px-3.5 py-2.5 text-sm text-[#1C1C1C] placeholder:text-[#A8A095] focus:border-[#A68A64] focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 border border-[#EAE5DD] bg-[#F9F8F6] p-3 text-xs text-[#6E675F]">
                  <Calendar className="h-4 w-4 shrink-0 text-[#A68A64]" />
                  <span>대표전화 {companyPhone} · 일요일 사전예약제 운영</span>
                </div>
                <button
                  type="submit"
                  disabled={reserveSubmitting}
                  className="w-full bg-[#1C1C1C] py-3.5 text-xs font-medium tracking-[0.14em] text-white transition-colors hover:bg-[#8C7250] disabled:opacity-60 sm:text-sm"
                >
                  {reserveSubmitting ? "접수 중..." : "상담 신청 완료하기"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
