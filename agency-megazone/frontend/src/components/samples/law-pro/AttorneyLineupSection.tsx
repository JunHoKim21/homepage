"use client";

interface AttorneyProfile {
  id: string;
  name: string;
  role: string;
  image: string;
  institution: string;
  subCredential: string;
  career: string[];
  focusArea: string;
}

const ATTORNEYS: AttorneyProfile[] = [
  {
    id: "kim-dohyun",
    name: "김도현",
    role: "대표변호사",
    image: "/images/samples/law-attorney1.jpg",
    institution: "전) 서울중앙지검 형사부 부장검사",
    subCredential: "사법연수원 31기 · 강력/특수/성범죄 전담",
    career: [
      "서울대학교 법과대학 졸업",
      "전) 서울중앙지방검찰청 형사부 부장검사",
      "전) 대검찰청 형사정책단 파견 연구관",
      "현) 대한변호사협회 등록 형사법 전문변호사",
    ],
    focusArea: "강력 · 특수 · 성범죄 불송치·무혐의 총괄",
  },
  {
    id: "seo-jiyeon",
    name: "서지연",
    role: "파트너변호사",
    image: "/images/samples/law-attorney2.jpg",
    institution: "전) 서울고등법원 형사부 판사",
    subCredential: "사법연수원 36기 · 형사 항소심/구속영장 실질심사 전담",
    career: [
      "고려대학교 법과대학 졸업",
      "전) 서울고등법원 형사부 판사",
      "전) 서울중앙지방법원 영장전담 재판부",
      "현) 구속영장 기각 · 항소심 무죄 변론 전담",
    ],
    focusArea: "영장실질심사 · 형사 항소심 · 양형 전략",
  },
  {
    id: "park-jinwoo",
    name: "박진우",
    role: "파트너변호사",
    image: "/images/samples/law-attorney3.jpg",
    institution: "전) 서울강남경찰서 수사과장 · 경찰대 수석",
    subCredential: "경찰 초기 조사 입회 · 음주/경제범죄 전담",
    career: [
      "경찰대학 법학과 수석 졸업",
      "전) 서울강남경찰서 수사과장",
      "전) 서울경찰청 광역수사단 지능범죄수사팀장",
      "현) 경찰 첫 조사 입회 · 디지털 포렌식 대응 전담",
    ],
    focusArea: "경찰 초기 조사 동석 · 음주 · 경제범죄",
  },
];

export default function AttorneyLineupSection() {
  return (
    <section
      id="attorneys"
      className="border-t border-slate-200 bg-white py-20 text-[#111827] sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 섹션 헤더 */}
        <div className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 lg:flex-row lg:items-end">
          <div className="min-w-0 max-w-2xl">
            <p className="text-xs font-bold tracking-[0.22em] text-[#0F2952]">
              CRIMINAL DEFENSE ATTORNEYS
            </p>
            <h2 className="mt-3 text-2xl leading-tight font-extrabold tracking-tight text-[#111827] sm:text-4xl">
              수사기관과 법원을 모두 아는
              <br className="hidden sm:inline" /> 형사 전담 변호사 라인업
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
              상담만 받고 사건을 넘기는 구조가 아닙니다. 검사·판사·수사과장
              출신 파트너 변호사가 초기 경찰 조사 동석부터 의견서 작성, 공판
              변론까지 직접 수행합니다.
            </p>
          </div>

          <div className="shrink-0 border-l-2 border-[#0F2952] pl-4 text-xs leading-relaxed text-slate-600 sm:text-sm">
            <p className="font-bold text-[#111827]">
              사무장 상담 배제 · 전담 파트너 직접 수행
            </p>
            <p className="mt-0.5 text-slate-500">
              사건별 3인 교차 검토 회의 상시 운영
            </p>
          </div>
        </div>

        {/* 3인 전담 변호사 카드 그리드 */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {ATTORNEYS.map((attorney) => (
            <article
              key={attorney.id}
              className="flex min-w-0 flex-col rounded-none border border-slate-200 bg-white transition-colors hover:border-[#0F2952]"
            >
              {/* 인물 사진 프레임 */}
              <div className="aspect-[4/5] w-full overflow-hidden border-b border-slate-200 bg-[#F5F7FA]">
                <img
                  src={attorney.image}
                  alt={`${attorney.name} ${attorney.role}`}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/samples/fallback.svg";
                  }}
                  className="block h-full w-full object-cover object-top"
                />
              </div>

              {/* 핵심 경력 본문 */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="text-2xl font-extrabold tracking-tight text-[#111827]">
                    {attorney.name}{" "}
                    <span className="text-sm font-semibold text-slate-500">
                      {attorney.role}
                    </span>
                  </h3>
                </div>

                {/* 출신 기관 강조 블록 (굵은 로열 네이비 + 얇은 구분선) */}
                <div className="mt-4 border-y border-slate-200 py-3.5">
                  <p className="text-[15px] leading-snug font-extrabold tracking-tight text-[#0F2952] sm:text-base">
                    {attorney.institution}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed font-medium text-slate-600">
                    {attorney.subCredential}
                  </p>
                </div>

                {/* 세부 약력 */}
                <ul className="mt-5 space-y-2 text-[13px] leading-relaxed text-slate-700">
                  {attorney.career.map((line) => (
                    <li key={line} className="flex items-start gap-2.5">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 bg-[#0F2952]"
                        aria-hidden="true"
                      />
                      <span className="min-w-0">{line}</span>
                    </li>
                  ))}
                </ul>

                {/* 하단 담당 영역 및 지정 상담 링크 */}
                <div className="mt-auto pt-6">
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-medium text-slate-500">
                      전담 영역:{" "}
                      <span className="font-semibold text-[#111827]">
                        {attorney.focusArea}
                      </span>
                    </p>
                    <a
                      href="#reservation"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold tracking-tight text-[#0F2952] transition-colors hover:text-[#111827]"
                    >
                      <span>{attorney.name} 변호사 지정 상담 예약</span>
                      <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 하단 3인 협진 시스템 안내 바 */}
        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-none border border-slate-200 bg-[#F5F7FA] p-6 sm:flex-row sm:items-center sm:px-8">
          <div className="min-w-0">
            <p className="text-xs font-bold tracking-[0.18em] text-[#0F2952]">
              3-WAY COLLABORATIVE DEFENSE
            </p>
            <p className="mt-1.5 text-base font-extrabold tracking-tight text-[#111827] sm:text-lg">
              경찰 초기 조사 · 검찰 기소 판단 · 법원 영장·공판까지 단일 사건
              3인 협진 대응
            </p>
          </div>
          <a
            href="#diagnosis"
            className="inline-flex shrink-0 items-center justify-center rounded-none bg-[#0F2952] px-6 py-3.5 text-xs font-bold tracking-tight text-white transition-colors hover:bg-[#111827] sm:text-sm"
          >
            내 사건 대응 전략 확인하기
          </a>
        </div>
      </div>
    </section>
  );
}
