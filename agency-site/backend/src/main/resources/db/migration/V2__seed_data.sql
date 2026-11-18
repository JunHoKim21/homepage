-- =====================================================================
-- V2__seed_data.sql
-- 웹 에이전시 본진 & 실시간 업종별 샘플 쇼룸 통합 초기 시드(Seed) 데이터
-- =====================================================================

-- 1. 기본 RBAC 역할 및 권한 시드
INSERT INTO roles (role_code, role_name, is_system) VALUES
('ROLE_SUPER_ADMIN', '최고 시스템 관리자', TRUE),
('ROLE_MANAGER', '일반 운영 매니저', TRUE);

INSERT INTO permissions (permission_code, permission_name) VALUES
('config:read', '사이트 설정 조회'),
('config:write', '사이트 설정 수정'),
('inquiry:read', '상담 문의 조회'),
('inquiry:write', '상담 문의 답변/상태변경'),
('reservation:read', '예약 현황 조회'),
('reservation:write', '예약 슬롯/상태 관리'),
('cms:read', '콘텐츠/게시판 조회'),
('cms:write', '콘텐츠/게시판 작성/수정'),
('media:write', '미디어 업로드/관리'),
('order:read', '주문/결제 조회'),
('order:write', '주문/결제 취소/환불');

-- ROLE_SUPER_ADMIN에 모든 권한 부여
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.role_code = 'ROLE_SUPER_ADMIN';

-- 2. 기본 메뉴 시드 (PUBLIC 헤더 메뉴 & ADMIN 사이드바 메뉴)
INSERT INTO menus (parent_id, menu_type, menu_name, route_path, icon_name, sort_order, is_visible, is_system, required_permission) VALUES
(NULL, 'PUBLIC', '회사·기술소개', '/about', 'Building2', 1, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '포트폴리오·샘플', '/portfolio', 'Briefcase', 2, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '정찰제·공지사항', '/notices', 'Megaphone', 3, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '1:1 상담예약', '/reservations', 'CalendarCheck', 4, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '무료 견적문의', '/inquiries', 'MessageSquarePlus', 5, TRUE, TRUE, NULL),
(NULL, 'ADMIN', '대시보드', '/admin', 'LayoutDashboard', 1, TRUE, TRUE, NULL),
(NULL, 'ADMIN', 'SEO·브랜딩 설정', '/admin/configs', 'Sliders', 2, TRUE, TRUE, 'config:write'),
(NULL, 'ADMIN', '상담문의 관리', '/admin/inquiries', 'Inbox', 3, TRUE, TRUE, 'inquiry:read'),
(NULL, 'ADMIN', '예약 관리', '/admin/reservations', 'Calendar', 4, TRUE, TRUE, 'reservation:read'),
(NULL, 'ADMIN', 'CMS 콘텐츠 관리', '/admin/cms', 'FileText', 5, TRUE, TRUE, 'cms:read'),
(NULL, 'ADMIN', '미디어 라이브러리', '/admin/media', 'Image', 6, TRUE, TRUE, 'media:write');

-- 3. 무코드 SEO·브랜딩·하이브리드 예약 필수 설정 시드 (site_configs)
INSERT INTO site_configs (config_key, config_value, value_type, group_name, description, is_public, is_system) VALUES
('seo_title', '스타터웹 스튜디오 | Java·Next.js 정통 반응형 홈페이지 & 맞춤 관리자 구축 전문', 'STRING', 'SEO', '브라우저 탭 및 검색 결과 제목', TRUE, TRUE),
('seo_description', '월 임대료 0원, 100% 고객사 소유 정통 웹 개발. 무코드 SEO·AEO 검색최적화, 스팸방어 견적문의, 하이브리드 예약 시스템을 합리적인 정찰제로 구축합니다.', 'STRING', 'SEO', '네이버·구글 검색 결과 요약 설명문', TRUE, TRUE),
('seo_keywords', '홈페이지제작,반응형웹제작,기업홈페이지,병원홈페이지,예약홈페이지,자바개발,SpringBoot,Nextjs,SEO최적화', 'STRING', 'SEO', '검색 키워드 (쉼표 구분)', TRUE, TRUE),
('seo_og_image', '/uploads/public/default-og.webp', 'IMAGE', 'SEO', '카카오톡·SNS 링크 공유 시 대표 썸네일', TRUE, TRUE),
('naver_site_verification', '', 'STRING', 'SEO', '네이버 서치어드바이저 인증 메타태그 값', TRUE, TRUE),
('google_site_verification', '', 'STRING', 'SEO', '구글 서치콘솔 인증 메타태그 값', TRUE, TRUE),
('robots_txt_custom', 'User-agent: *\nAllow: /\nDisallow: /admin/', 'STRING', 'SEO', '검색 로봇 수집 규칙 설정', TRUE, TRUE),
('brand_primary_color', '#1E40AF', 'COLOR', 'BRANDING', '홈페이지 메인 포인트 색상 (HEX)', TRUE, TRUE),
('brand_logo_url', '/uploads/public/logo.webp', 'IMAGE', 'BRANDING', '상단 헤더 로고 이미지 URL', TRUE, TRUE),
('brand_favicon_url', '/uploads/public/favicon.ico', 'IMAGE', 'BRANDING', '브라우저 탭 파비콘 URL', TRUE, TRUE),
('site_theme_preset', 'AGENCY', 'STRING', 'BRANDING', '홈페이지 기본 테마 프리셋 (AGENCY: 웹에이전시 본진 | CORP: 기업·시공형 샘플 | CLINIC: 병의원·로펌 예약형 샘플)', TRUE, TRUE),
('demo_bar_enabled', 'true', 'BOOLEAN', 'BRANDING', '방문객용 실시간 업종 샘플 전환 바 및 1초 관리자 체험 버튼 노출 여부', TRUE, TRUE),
('footer_company_info', '{"name":"스타터웹 스튜디오 (주식회사 스타터)","ceo":"홍길동","bizNo":"123-45-67890","phone":"02-1234-5678","email":"contact@starterweb.kr","kakaoUrl":"https://open.kakao.com/","address":"서울시 강남구 테헤란로 123 스타터타워 8층","hours":"평일 09:30 ~ 18:30 (점심 12:30 ~ 13:30 / 주말·공휴일 휴무)"}', 'JSON', 'COMPANY', '푸터 하단 사업자 정보', TRUE, TRUE),
('reservation_mode', 'BOTH', 'STRING', 'RESERVATION', '예약 채널 모드 (OFF | NAVER | INTERNAL | BOTH)', TRUE, TRUE),
('reservation_capacity_mode', 'SINGLE', 'STRING', 'RESERVATION', '자체 예약 정원 모드 (SINGLE: 1:1 단독예약 | MULTI: 시간대별 N명 정원제)', TRUE, TRUE),
('reservation_default_capacity', '1', 'NUMBER', 'RESERVATION', 'MULTI 모드 시 시간대별 기본 정원 수 (SINGLE 모드 시 1로 강제)', TRUE, TRUE),
('naver_booking_url', 'https://booking.naver.com/', 'STRING', 'RESERVATION', '네이버 스마트플레이스 예약 연결 주소', TRUE, TRUE);

-- 4. 필수 시스템 약관 시드 (is_system = TRUE 로 삭제 방지)
INSERT INTO cms_contents (slug, category, title, summary, content_html, is_pinned, is_published, is_system, author_id) VALUES
('terms-of-service', 'TERMS', '서비스 이용약관', '스타터웹 스튜디오 및 표준 홈페이지 서비스 이용약관입니다.', '<h3>제1조 (목적)</h3><p>본 약관은 스타터웹 스튜디오(이하 "회사")가 제공하는 홈페이지 구축, 유지보수 및 온라인 상담·예약 서비스의 이용 조건과 절차를 규정함을 목적으로 합니다.</p><h3>제2조 (저작권 및 소유권 이전)</h3><p>대금 완납과 동시에 구축된 홈페이지의 프론트엔드·백엔드 소스코드 및 데이터베이스 스키마 사용권은 고객사에 귀속되며, 월 고정 임대료나 강제 약정을 부과하지 않습니다.</p>', FALSE, TRUE, TRUE, 'SYSTEM'),
('privacy-policy', 'TERMS', '개인정보처리방침', '개인정보 보호법 제30조에 따른 고객 개인정보 보호 및 처리방침 안내입니다.', '<h3>1. 개인정보의 수집 및 이용 목적</h3><p>당사는 홈페이지 제작 견적 문의 접수, 1:1 상담 예약 확정 안내, 고객 문의 회신을 위하여 최소한의 개인정보만을 적법하게 수집·이용합니다.</p><h3>2. 수집하는 개인정보 항목</h3><p>필수항목: 성함(담당자명), 연락처 / 선택항목: 이메일, 회사명, 예산 범위, 참고 사이트 주소 및 첨부파일</p><h3>3. 보유 및 이용기간</h3><p>수집된 정보는 상담 및 계약 이행 목적 달성 후 지체 없이 파기하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 안전하게 분리 보관합니다.</p>', FALSE, TRUE, TRUE, 'SYSTEM');

-- 5. 업종별 대표 포트폴리오 및 라이브 쇼룸 샘플 시드 (PORTFOLIO 6건)
INSERT INTO cms_contents (slug, category, title, summary, content_html, thumbnail_url, extra_json, view_count, is_pinned, is_published, is_system, author_id) VALUES
(
    'portfolio-b2b-tech',
    'PORTFOLIO',
    '[기업·IT솔루션] (주)엘씨테크놀로지 기업 홍보 및 글로벌 제품 카탈로그 구축',
    '반도체·정밀부품 제조 기업의 신뢰도를 높이는 다크 네이비 톤앤매너와 제품 사양서(PDF) 다운로드, 실시간 B2B 견적 요청 시스템을 구축했습니다.',
    '<h3>프로젝트 개요</h3><p>기존 노후화된 플래시·테이블 기반 기업 홈페이지를 Next.js 15 + Spring Boot 3.4 정통 아키텍처로 전면 리뉴얼하여 모바일 호환성과 구글·네이버 검색 노출(SEO) 점수를 98점으로 끌어올렸습니다.</p><h3>핵심 구축 기능</h3><ul><li>기업 연혁, 인증 현황, 주요 납품 실적 아카이브</li><li>관리자 콘솔에서 직접 제품 사진(WebP 자동 변환)과 PDF 카탈로그를 등록·수정하는 CMS</li><li>해외 바이어 및 국내 거래처 전용 스팸 방어(Honeypot + Rate Limit) B2B 견적 문의 폼</li></ul>',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"기업·시공","client":"(주)엘씨테크놀로지","period":"7일","plan":"DELUXE","demoPreset":"CORP","tags":["반응형웹","제품카탈로그","무코드SEO","B2B견적문의"]}'::jsonb,
    142,
    TRUE,
    TRUE,
    FALSE,
    'admin'
),
(
    'portfolio-interior-arch',
    'PORTFOLIO',
    '[인테리어·건축] 다가올 공간디자인 시공사례 갤러리 & 실시간 견적 문의 시스템',
    '고화질 시공 포트폴리오 사진 수백 장을 화질 저하 없이 0.1초 만에 로딩하는 WebP 자동 다이어트 엔진과 평수·예산별 맞춤 견적 폼을 적용했습니다.',
    '<h3>프로젝트 개요</h3><p>인테리어·건축 시공 업종의 특성상 고해상도 사진이 많아 기존 임대형 웹빌더 홈페이지에서 발생하던 이미지 로딩 지연 문제를 개선했습니다.</p><h3>핵심 구축 기능</h3><ul><li>주거·상업·오피스 공간별 필터링 포트폴리오 갤러리</li><li>원본 사진 업로드 시 백그라운드 워커가 360px/768px/1920px WebP로 자동 압축 변환</li><li>희망 평수, 시공 예산, 입주 예정일을 선택해 접수하는 맞춤형 견적 상담 및 실시간 알림톡 연동</li></ul>',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"기업·시공","client":"다가올 공간디자인","period":"6일","plan":"DELUXE","demoPreset":"CORP","tags":["시공갤러리","WebP최적화","맞춤견적폼","알림톡연동"]}'::jsonb,
    118,
    TRUE,
    TRUE,
    FALSE,
    'admin'
),
(
    'portfolio-medical-clinic',
    'PORTFOLIO',
    '[병의원·검진센터] 연세바른내과의원 진료 시간표·의료진 안내 및 온라인 진료 예약 구축',
    '환자분들이 스마트폰에서 3번의 터치만으로 진료 과목과 원장님 일정을 확인하고 네이버 예약 또는 자체 1:1 예약을 선택할 수 있는 하이브리드 병원 홈페이지입니다.',
    '<h3>프로젝트 개요</h3><p>고령층부터 직장인까지 누구나 쉽게 진료 시간과 검진 프로그램을 확인하고 즉시 예약할 수 있도록 직관적인 UI와 빠른 페이지 전환을 구현했습니다.</p><h3>핵심 구축 기능</h3><ul><li>의료진 약력, 진료 과목별 안내, 비급여 수가표 공지 게시판</li><li>네이버 스마트플레이스 예약과 자체 1:1 시간대별 예약을 동시에 지원하는 하이브리드 예약 시스템</li><li>비회원도 이름과 연락처만으로 예약 조회 및 변경이 가능한 간편 인터페이스</li></ul>',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"병의원·클리닉","client":"연세바른내과의원","period":"8일","plan":"DELUXE","demoPreset":"CLINIC","tags":["병원홈페이지","하이브리드예약","의료진안내","모바일최적화"]}'::jsonb,
    165,
    TRUE,
    TRUE,
    FALSE,
    'admin'
),
(
    'portfolio-law-tax',
    'PORTFOLIO',
    '[로펌·세무·전문직] 법무법인 정의 분야별 변호사 소개 및 1:1 비밀 보장 상담 예약 시스템',
    '민사·형사·기업법무 전담 변호사 프로필과 승소 사례를 체계적으로 전달하고, 1:1 단독(SINGLE) 예약 모드로 의뢰인의 상담 프라이버시를 철저히 보호합니다.',
    '<h3>프로젝트 개요</h3><p>전문직 홈페이지에서 가장 중요한 신뢰감 있는 타이포그래피와 철저한 개인정보 보호, 그리고 중복 예약을 원천 차단하는 DB 비관적 락(Pessimistic Lock) 기반 1:1 상담 스케줄러를 구축했습니다.</p><h3>핵심 구축 기능</h3><ul><li>전담 변호사·세무사 프로필 및 주요 승소·절세 업무 사례 아카이브</li><li>1:1 단독 예약(SINGLE 모드)으로 동일 시간대 중복 접수 완벽 차단</li><li>사건 관련 참고 서류(PDF, 이미지)를 외부 노출이 차단된 Private 스토리지에 안전하게 첨부</li></ul>',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"로펌·세무","client":"법무법인 정의","period":"7일","plan":"DELUXE","demoPreset":"CLINIC","tags":["로펌·세무사","1:1단독예약","비공개파일첨부","승소사례CMS"]}'::jsonb,
    97,
    FALSE,
    TRUE,
    FALSE,
    'admin'
),
(
    'portfolio-aesthetic-skin',
    'PORTFOLIO',
    '[피부과·뷰티] 청담엘레브 클리닉 프리미엄 시술 안내 및 네이버·자체 하이브리드 예약',
    '감각적인 브랜드 컬러 커스터마이징과 이벤트 팝업·배너 관리, 카카오톡 OG 썸네일 무코드 설정을 통해 마케팅 전환율을 극대화한 클리닉 웹사이트입니다.',
    '<h3>프로젝트 개요</h3><p>매월 바뀌는 프로모션과 시술 이벤트를 외주 개발자 도움 없이 병원 실장님이 관리자 화면에서 1분 만에 수정하고 즉시 반영(0.1초 캐시 갱신)할 수 있도록 구축했습니다.</p><h3>핵심 구축 기능</h3><ul><li>관리자 콘솔에서 메인 포인트 컬러(HEX) 및 OG 공유 이미지 실시간 변경</li><li>네이버 예약 연동과 자체 시술 상담 예약을 통합 제공하는 하이브리드 예약 모듈</li><li>상담 문의 및 예약 내역 원클릭 엑셀(.xlsx) 다운로드로 원내 CRM 연동 지원</li></ul>',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"병의원·클리닉","client":"청담엘레브 클리닉","period":"9일","plan":"PREMIUM","demoPreset":"CLINIC","tags":["피부과·클리닉","브랜드컬러커스텀","엑셀다운로드","이벤트CMS"]}'::jsonb,
    134,
    FALSE,
    TRUE,
    FALSE,
    'admin'
),
(
    'portfolio-studio-academy',
    'PORTFOLIO',
    '[스튜디오·아카데미] 뉴제스트 렌탈스튜디오 시간대별 정원제(MULTI) 공간 예약 구축',
    '시간대별 최대 수용 인원(MULTI 모드)을 설정하여 원데이 클래스와 공간 대관을 동시에 접수받고 잔여 좌석을 실시간으로 표시하는 예약 특화 홈페이지입니다.',
    '<h3>프로젝트 개요</h3><p>1:1 상담뿐만 아니라 시간대별 5~10명 정원제 수업이나 스튜디오 공간 대관을 운영하는 사업장을 위해 MULTI 정원제 모드를 적용했습니다.</p><h3>핵심 구축 기능</h3><ul><li>관리자 스위치 하나로 SINGLE(1:1 단독) ↔ MULTI(시간대별 N명 정원제) 즉시 전환</li><li>시간대별 잔여 좌석 실시간 계산 및 정원 초과 시 자동 마감 처리</li><li>룸별·클래스별 장비 안내 및 이용 수칙 FAQ 아코디언 제공</li></ul>',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"스튜디오·학원","client":"뉴제스트 스튜디오","period":"6일","plan":"DELUXE","demoPreset":"CLINIC","tags":["정원제예약(MULTI)","원데이클래스","공간대관","실시간잔여석"]}'::jsonb,
    89,
    FALSE,
    TRUE,
    FALSE,
    'admin'
);

-- 6. 정찰제 안내·정부지원사업·기술칼럼 공지사항 시드 (NOTICE 5건)
INSERT INTO cms_contents (slug, category, title, summary, content_html, is_pinned, is_published, is_system, view_count, author_id) VALUES
(
    'notice-pricing-guide',
    'NOTICE',
    '[공지] 2026년 투명한 3단 정찰제(Standard / Deluxe / Premium) 구축 비용 및 제공 범위 안내',
    '부르는 게 값인 깜깜이 외주 견적 대신, 기능과 페이지 범위에 따른 합리적이고 투명한 3단 정찰제(59만 원 / 99만 원 / 179만 원)를 운영합니다.',
    '<h3>투명한 정찰제 홈페이지 구축 안내</h3><p>스타터웹 스튜디오는 검증된 엔터프라이즈 모듈형 아키텍처를 기반으로 개발 기간과 단가를 획기적으로 낮추면서도, 저가형 템플릿과 차원이 다른 순수 독립형 웹(Next.js 15 + Spring Boot 3.4)을 납품합니다.</p><ul><li><strong>Standard (59만 원)</strong>: 반응형 기업·브랜드 소개(5P 내외), 무코드 SEO·브랜딩 관리자, 스팸 방어 견적문의 폼, 공지사항·포트폴리오 CMS 기본 제공</li><li><strong>Deluxe (99만 원 · 가장 많은 선택)</strong>: Standard 전체 포함 + 업종별 맞춤 추가 입력 폼 + 하이브리드 예약 시스템(네이버 예약 & 자체 1:1·정원제 스케줄러) + 알림톡·이메일 발송 연동 + 문의·예약 엑셀(.xlsx) 다운로드</li><li><strong>Premium (179만 원)</strong>: Deluxe 전체 포함 + 회원/소셜 로그인(카카오·네이버·구글) + PG 예약금·결제 상태 머신 + 관리자 2FA(Google OTP) 및 데이터 변경 감사 로그(Audit Log)</li></ul><p>모든 플랜은 <strong>월 고정 임대료 0원</strong>이며, 납품 완료 시 원본 소스코드와 DB 소유권을 100% 고객사에 이전해 드립니다.</p>',
    TRUE,
    TRUE,
    FALSE,
    312,
    'admin'
),
(
    'notice-gov-voucher',
    'NOTICE',
    '[안내] 정부지원사업(초기창업패키지·소상공인 바우처) 전자세금계산서 및 비교견적서 발행 안내',
    '예비·초기창업패키지, 청년창업사관학교, 소상공인 디지털 전환 지원사업 등 정부지원금 집행에 필요한 모든 정식 증빙 서류를 신속히 지원합니다.',
    '<h3>정부지원사업 및 기업 법인 계약 완벽 지원</h3><p>정부지원사업이나 사내 품의를 통해 홈페이지를 구축하시는 대표님·담당자님을 위해 행정 절차에 필요한 서류를 당일 발급해 드립니다.</p><ul><li>정식 도장 날인 견적서 및 비교견적서 제공</li><li>사업자등록증, 통장사본, 국세·지방세 완납증명서 즉시 구비</li><li>전자세금계산서 발행 및 법인카드 결제 지원</li><li>과업지시서(RFP) 맞춤형 기능 명세서 및 완료보고서 산출물 제공</li></ul><p>무료 견적문의 또는 1:1 상담예약을 남겨주시면 전담 PM이 2시간 이내에 필요 서류와 일정을 안내해 드립니다.</p>',
    TRUE,
    TRUE,
    FALSE,
    245,
    'admin'
),
(
    'notice-seo-aeo',
    'NOTICE',
    '[기술칼럼] 기존 임대형 웹빌더 대비 Next.js + Spring Boot 독립형 웹이 네이버·구글 SEO에 유리한 이유',
    '검색 로봇과 AI 검색엔진(ChatGPT·Perplexity)이 가장 선호하는 서버사이드 렌더링(SSR) 및 시맨틱 HTML 구조의 차이를 설명해 드립니다.',
    '<h3>검색엔진이 선호하는 웹 아키텍처의 기준</h3><p>기존 임대형 웹빌더 환경에서는 범용 템플릿 구조 특성상 중첩 태그와 스크립트 비중이 높아져 초기 로딩 속도(LCP) 및 시맨틱 구조 최적화에 제약이 발생할 수 있습니다.</p><h3>스타터웹 스튜디오의 무코드 SEO + AEO 엔진</h3><ul><li><strong>Next.js 15 서버사이드 렌더링(SSR)</strong>: 검색 로봇이 접속하는 즉시 완성된 HTML과 메타태그, OpenGraph 정보를 0.1초 내에 응답합니다.</li><li><strong>무코드 SEO 콘솔</strong>: 개발자 없이도 관리자 화면에서 페이지 타이틀, 설명문, 키워드, 네이버·구글 소유권 확인 태그, robots.txt를 직접 수정하고 즉시 반영할 수 있습니다.</li><li><strong>자동 사이트맵(sitemap.xml)</strong>: 새로 작성한 공지사항과 포트폴리오가 검색엔진에 빠르게 색인되도록 표준 규격을 기본 내장했습니다.</li></ul>',
    FALSE,
    TRUE,
    FALSE,
    189,
    'admin'
),
(
    'notice-source-ownership',
    'NOTICE',
    '[정책] 월 고정 임대료 0원 보장 및 납품 후 원본 소스코드·DB 100% 이전 원칙 안내',
    '월별 고정 임대료 부담 없이 구축 완료와 동시에 기업 고유의 디지털 자산으로 영구 소유하실 수 있습니다.',
    '<h3>장기 운영 비용 절감과 완전한 데이터 주권 확보</h3><p>기존 임대형 웹빌더나 약정형 호스팅 서비스와 달리, 초기 구축 이후 매월 부과되는 고정 임대료 없이 독립적인 서버 환경에서 자유롭게 운영하고 확장할 수 있습니다.</p><h3>당사의 3대 클린 납품 원칙</h3><ol><li><strong>100% 라이선스 클린</strong>: 상업적 사용과 배포에 아무런 제약이 없는 검증된 오픈소스(Apache 2.0 / MIT) 기술 스택만 사용합니다.</li><li><strong>원본 소스코드 및 Docker 올인원 패키지 제공</strong>: 프론트엔드, 백엔드, 데이터베이스 마이그레이션 스크립트 전체를 고객사 Git 저장소 또는 압축 패키지로 100% 인도합니다.</li><li><strong>단일 서버 초경량 구동</strong>: 월 5천 원~1만 원대 클라우드 VPS(2GB RAM) 한 대에서도 HTTPS 보안인증서(Caddy 자동 갱신)와 함께 거뜬히 운영됩니다.</li></ol>',
    FALSE,
    TRUE,
    FALSE,
    176,
    'admin'
),
(
    'notice-webp-optimization',
    'NOTICE',
    '[업데이트] 고화질 사진 업로드 시 WebP 자동 다이어트 및 0.1초 캐시 즉시 갱신 엔진 기본 탑재 안내',
    '스마트폰이나 DSLR로 찍은 대용량 원본 사진을 그대로 올려도 서버가 알아서 용량을 80% 이상 줄인 고화질 WebP로 변환합니다.',
    '<h3>사진 용량 줄이느라 포토샵 켜실 필요가 없습니다</h3><p>고객사 담당자분들이 포트폴리오나 공지사항에 사진을 올릴 때 가장 불편해하시던 용량 초과 및 로딩 저하 문제를 기술적으로 해결했습니다.</p><ul><li><strong>Magic Bytes 보안 검사</strong>: 확장자만 바꾼 악성 스크립트나 위변조 파일을 바이트 단위로 즉시 차단합니다.</li><li><strong>3단 해상도 WebP 자동 생성</strong>: 원본 업로드 즉시 백그라운드에서 썸네일(360px), 모바일용(768px), 데스크톱 고화질(1920px) WebP 파일과 블러 프리뷰를 자동 생성합니다.</li><li><strong>0.1초 즉시 캐시 무효화</strong>: 관리자 화면에서 설정이나 글을 수정하면 방문객 화면에 새로고침 없이 즉시 반영됩니다.</li></ul>',
    FALSE,
    TRUE,
    FALSE,
    154,
    'admin'
);
