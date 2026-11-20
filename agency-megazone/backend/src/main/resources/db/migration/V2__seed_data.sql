-- =====================================================================
-- V2__seed_data.sql
-- 메가존 에이전시 -> 엘레브웹(eleveWeb) 납품 즉시 운영 가능한 기본 시드(Seed) 데이터
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
(NULL, 'PUBLIC', '구축사례·샘플', '/portfolio', 'Briefcase', 2, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '정찰제·인사이트', '/notices', 'Megaphone', 3, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '1:1 상담예약', '/reservations', 'CalendarCheck', 4, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '무료 견적문의', '/inquiries', 'MessageSquarePlus', 5, TRUE, TRUE, NULL),
(NULL, 'ADMIN', '대시보드', '/admin', 'LayoutDashboard', 1, TRUE, TRUE, NULL),
(NULL, 'ADMIN', 'SEO·브랜딩 설정', '/admin/configs', 'Sliders', 2, TRUE, TRUE, 'config:write'),
(NULL, 'ADMIN', '상담문의 관리', '/admin/inquiries', 'Inbox', 3, TRUE, TRUE, 'inquiry:read'),
(NULL, 'ADMIN', '예약 관리', '/admin/reservations', 'Calendar', 4, TRUE, TRUE, 'reservation:read'),
(NULL, 'ADMIN', 'CMS 콘텐츠 관리', '/admin/cms', 'FileText', 5, TRUE, TRUE, 'cms:read'),
(NULL, 'ADMIN', '미디어 라이브러리', '/admin/media', 'Image', 6, TRUE, TRUE, 'media:write');

-- 3. 무코드 SEO·브랜딩·하이브리드 예약·테마 프리셋 필수 설정 시드 (site_configs)
INSERT INTO site_configs (config_key, config_value, value_type, group_name, description, is_public, is_system) VALUES
('seo_title', '엘레브웹(eleveWeb) | 월 임대료 0원 독립형 기업 홈페이지 제작', 'STRING', 'SEO', '브라우저 탭 및 검색 결과 제목', TRUE, TRUE),
('seo_description', '추가 유지비 부담 없는 투명한 정찰제! 검색에 잘 노출되고 예약·상담 문의가 바로 들어오는 맞춤형 기업 홈페이지를 제작해 드립니다.', 'STRING', 'SEO', '네이버·구글 검색 결과 요약 설명문', TRUE, TRUE),
('seo_keywords', '기업홈페이지제작,병원홈페이지,정찰제웹에이전시,자체홈페이지,맞춤형웹사이트,검색최적화,엘레브웹', 'STRING', 'SEO', '검색 키워드 (쉼표 구분)', TRUE, TRUE),
('seo_og_image', '/uploads/public/default-og.webp', 'IMAGE', 'SEO', '카카오톡·SNS 링크 공유 시 대표 썸네일', TRUE, TRUE),
('naver_site_verification', '', 'STRING', 'SEO', '네이버 서치어드바이저 인증 메타태그 값', TRUE, TRUE),
('google_site_verification', '', 'STRING', 'SEO', '구글 서치콘솔 인증 메타태그 값', TRUE, TRUE),
('robots_txt_custom', 'User-agent: *\nAllow: /\nDisallow: /admin/', 'STRING', 'SEO', '검색 로봇 수집 규칙 설정', TRUE, TRUE),
('brand_primary_color', '#1D4ED8', 'COLOR', 'BRANDING', '홈페이지 메인 포인트 색상 (HEX)', TRUE, TRUE),
('brand_logo_url', '/uploads/public/logo.webp', 'IMAGE', 'BRANDING', '상단 헤더 로고 이미지 URL', TRUE, TRUE),
('brand_favicon_url', '/uploads/public/favicon.ico', 'IMAGE', 'BRANDING', '브라우저 탭 파비콘 URL', TRUE, TRUE),
('site_theme_preset', 'AGENCY', 'STRING', 'BRANDING', '사이트 디자인 테마 프리셋 (AGENCY 등)', TRUE, TRUE),
('demo_bar_enabled', 'true', 'BOOLEAN', 'BRANDING', '상단 데모 체험 바 노출 여부', TRUE, TRUE),
('footer_company_info', '{"name":"엘레브웹 (eleveWeb)","ceo":"김준호","bizNo":"449-14-03005","phone":"010-4404-5263","email":"elevewebpage@gmail.com","address":"100% 비대면 온라인 스튜디오 (전국 온라인 지원)","hours":"온라인 접수 24시간 상시 (접수 후 24시간 이내 회신) | 유선·화상 미팅: 사전 예약제 운영"}', 'JSON', 'COMPANY', '푸터 하단 사업자 정보', TRUE, TRUE),
('reservation_mode', 'INTERNAL', 'STRING', 'RESERVATION', '예약 채널 모드 (OFF | NAVER | INTERNAL | BOTH)', TRUE, TRUE),
('reservation_capacity_mode', 'MULTI', 'STRING', 'RESERVATION', '자체 예약 정원 모드 (SINGLE: 1:1 단독예약 | MULTI: 시간대별 N명 정원제)', TRUE, TRUE),
('reservation_default_capacity', '3', 'NUMBER', 'RESERVATION', 'MULTI 모드 시 시간대별 기본 정원 수 (SINGLE 모드 시 1로 강제)', TRUE, TRUE),
('naver_booking_url', 'https://booking.naver.com/', 'STRING', 'RESERVATION', '네이버 스마트플레이스 예약 연결 주소', TRUE, TRUE),
('floating_left_enabled', 'true', 'BOOLEAN', 'FLOATING', '좌측 상담 플로팅 바(전화·카톡·WeChat) 노출 여부', TRUE, TRUE),
('floating_right_enabled', 'true', 'BOOLEAN', 'FLOATING', '우측 플로팅 사이드바 노출 여부 (ON/OFF)', TRUE, TRUE),
('quick_kakao_url', 'https://pf.kakao.com/_AqlvX/chat', 'STRING', 'FLOATING', '카카오톡 채널 상담 URL (비워두면 버튼 숨김)', TRUE, TRUE),
('quick_wechat_id', '', 'STRING', 'FLOATING', 'WeChat 상담 ID (비워두면 버튼 숨김)', TRUE, TRUE),
('sns_instagram_url', '', 'STRING', 'FLOATING', '인스타그램 공식 URL (비워두면 아이콘 숨김)', TRUE, TRUE),
('sns_blog_url', '', 'STRING', 'FLOATING', '네이버 블로그 URL (비워두면 아이콘 숨김)', TRUE, TRUE),
('sns_youtube_url', '', 'STRING', 'FLOATING', '유튜브 채널 URL (비워두면 아이콘 숨김)', TRUE, TRUE);

-- 4. 필수 시스템 약관 시드 (TERMS 2건 - is_system = TRUE 로 삭제 방지)
INSERT INTO cms_contents (slug, category, title, summary, content_html, is_pinned, is_published, is_system, author_id) VALUES
('terms-of-service', 'TERMS', '서비스 이용약관', '엘레브웹 홈페이지 서비스 이용약관입니다.', '<h3>제1조 (목적)</h3><p>본 약관은 엘레브웹(이하 "회사")이 제공하는 홈페이지 제작 상담 및 온라인 예약 서비스의 이용 조건과 절차를 규정함을 목적으로 합니다.</p><h3>제2조 (소유권 및 저작권)</h3><p>최종 납품이 완료되고 잔금 정산이 끝난 홈페이지의 소스코드 및 디자인 결과물에 대한 사용·소유 권리는 고객사에 귀속됩니다.</p>', FALSE, TRUE, TRUE, 'SYSTEM'),
('privacy-policy', 'TERMS', '개인정보처리방침', '개인정보 보호법에 따른 상담 및 예약 개인정보 처리방침입니다.', '<h3>1. 수집하는 개인정보 항목</h3><p>회사는 무료 견적문의 및 1:1 상담예약 처리를 위해 성함, 연락처, 이메일(선택), 문의 내용을 수집합니다.</p><h3>2. 보유 및 이용 기간</h3><p>상담 완료 및 서비스 안내 목적 달성 후 관련 법령에 따라 안전하게 파기하며, 고객 요청 시 즉시 삭제합니다.</p>', FALSE, TRUE, TRUE, 'SYSTEM');

-- 5. 업종별 표준 제작 모델 시드 (PORTFOLIO 6건)
INSERT INTO cms_contents (slug, category, title, summary, content_html, thumbnail_url, extra_json, is_pinned, is_published, is_system, author_id) VALUES
(
    'portfolio-gangnam-clinic',
    'PORTFOLIO',
    '의료·병원 업종별 표준 제작 모델',
    '네이버 예약과 자체 1:1 상담 예약을 함께 연동하고, 진료과목 안내와 주의사항 게시판을 통합한 병원 전용 표준 모델입니다.',
    '<p><strong>핵심 구성 방향</strong><br>모바일 방문 비중이 높은 병원 특성에 맞춰 진료과목별 상세 안내 페이지와 온라인 상담·예약 동선을 직관적으로 배치했습니다.</p><p><strong>탑재 기능</strong><br>진료과목별 CMS 게시판, 시간대별 정원제(MULTI) 상담 예약 슬롯, 네이버 스마트플레이스 예약 링크 연동 기능을 기본 제공합니다.</p>',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"의료/병원","client":"업종별 표준 제작 모델","period":"3주","plan":"Pro","demoPreset":"MEDICAL","tags":["모바일 예약연동","진료안내 CMS","SEO 최적화"]}'::jsonb,
    TRUE, TRUE, FALSE, 'SYSTEM'
),
(
    'portfolio-seoul-lawfirm',
    'PORTFOLIO',
    '법률·세무 업종별 표준 제작 모델',
    '의뢰인이 사건 분야를 선택해 비공개 자료를 첨부하고, 담당자에게 바로 1:1 비밀 상담을 접수할 수 있는 전문직 표준 모델입니다.',
    '<p><strong>핵심 구성 방향</strong><br>신뢰감 있는 타이포그래피와 차분한 컬러 시스템을 바탕으로, 복잡한 메뉴 없이 사건 분야별 안내 페이지로 바로 이동할 수 있게 설계했습니다.</p><p><strong>탑재 기능</strong><br>분야별 업무 사례 아카이브, 비공개 파일 첨부가 가능한 1:1 상담 폼, 검색엔진(SEO) 메타태그 관리자 직접 설정 기능을 포함합니다.</p>',
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"법률/세무","client":"업종별 표준 제작 모델","period":"2주","plan":"Standard","demoPreset":"LAW","tags":["비밀상담 폼","성공사례 아카이브","네이버 검색등록"]}'::jsonb,
    TRUE, TRUE, FALSE, 'SYSTEM'
),
(
    'portfolio-roastery-dining',
    'PORTFOLIO',
    'F&B·카페 업종별 표준 제작 모델',
    '브랜드 스토리와 메뉴 갤러리를 고화질로 보여주면서, 기업·창업주 대상 B2B 납품 견적 문의까지 한곳에서 받는 F&B 표준 모델입니다.',
    '<p><strong>핵심 구성 방향</strong><br>매장 분위기와 메뉴 사진이 가장 돋보이도록 여백 중심의 갤러리 레이아웃을 적용하고, 일반 방문객과 사업자 문의 동선을 분리했습니다.</p><p><strong>탑재 기능</strong><br>WebP 자동 경량화 이미지 파이프라인, 사업자 전용 샘플·납품 견적 문의 폼, 모바일 반응형 메뉴판을 기본 탑재합니다.</p>',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"F&B/카페","client":"업종별 표준 제작 모델","period":"2주","plan":"Standard","demoPreset":"FNB","tags":["고화질 갤러리","B2B 납품문의","반응형 웹"]}'::jsonb,
    FALSE, TRUE, FALSE, 'SYSTEM'
),
(
    'portfolio-arch-interior',
    'PORTFOLIO',
    '인테리어·건축 업종별 표준 제작 모델',
    '고해상도 시공 사진을 빠르게 로딩하고, 평수·공간별 포트폴리오 탐색과 현장 실측 예약을 연결하는 건축·인테리어 표준 모델입니다.',
    '<p><strong>핵심 구성 방향</strong><br>시공 사진이 많은 인테리어 업종 특성을 고려해 이미지 자동 경량화 기술로 모바일 환경에서도 빠르고 선명하게 시안을 탐색할 수 있도록 구성했습니다.</p><p><strong>탑재 기능</strong><br>업로드 이미지 3단계 WebP 자동 변환, 카테고리별 포트폴리오 관리 CMS, 현장 실측 1:1 예약 연동 기능을 제공합니다.</p>',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"인테리어/건축","client":"업종별 표준 제작 모델","period":"3주","plan":"Pro","demoPreset":"INTERIOR","tags":["이미지 자동최적화","실측 예약","포트폴리오 필터"]}'::jsonb,
    FALSE, TRUE, FALSE, 'SYSTEM'
),
(
    'portfolio-smart-factory',
    'PORTFOLIO',
    '제조·B2B 업종별 표준 제작 모델',
    '제품 사양서와 기술력을 체계적으로 소개하고, 바이어가 도면·요청서를 첨부해 바로 견적을 의뢰할 수 있는 B2B 기업 표준 모델입니다.',
    '<p><strong>핵심 구성 방향</strong><br>오프라인 카탈로그 내용을 웹 표준 구조로 정리해 국내외 검색엔진에 제품명과 사양이 잘 노출되도록 설계했습니다.</p><p><strong>탑재 기능</strong><br>제품 카탈로그 CMS, 비공개 첨부파일(도면·사양서)을 지원하는 견적 문의 시스템, 관리자 문의 상태 관리 및 메모 기능을 제공합니다.</p>',
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"제조/B2B","client":"업종별 표준 제작 모델","period":"4주","plan":"Enterprise","demoPreset":"B2B","tags":["비공개 도면첨부","제품 카탈로그","구글 SEO"]}'::jsonb,
    FALSE, TRUE, FALSE, 'SYSTEM'
),
(
    'portfolio-wellness-pilates',
    'PORTFOLIO',
    '뷰티·웰니스 업종별 표준 제작 모델',
    '강사 소개, 프로그램 안내, 시간대별 소그룹 체험 레슨 예약까지 한 번에 연결되는 피트니스·뷰티·웰니스 표준 모델입니다.',
    '<p><strong>핵심 구성 방향</strong><br>방문자가 강사진과 커리큘럼을 확인한 뒤, 별도의 전화 문의 없이 남은 정원을 실시간으로 보고 체험 예약을 신청할 수 있도록 구성했습니다.</p><p><strong>탑재 기능</strong><br>시간대별 정원제(MULTI) 예약 슬롯 관리, 강사·프로그램 소개 CMS, 예약 상태(신청·확정·취소) 관리자 제어 기능을 기본 탑재합니다.</p>',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80',
    '{"industry":"뷰티/웰니스","client":"업종별 표준 제작 모델","period":"2주","plan":"Standard","demoPreset":"WELLNESS","tags":["정원제 예약","강사소개 CMS","실시간 예약 알림"]}'::jsonb,
    FALSE, TRUE, FALSE, 'SYSTEM'
);

-- 6. 정찰제·바우처·SEO·소유권·성능 안내 공지 시드 (NOTICE 5건)
INSERT INTO cms_contents (slug, category, title, summary, content_html, is_pinned, is_published, is_system, author_id) VALUES
(
    'transparent-fixed-pricing-guide',
    'NOTICE',
    '[안내] 추가 비용 없는 100% 투명 정찰제 제작 요금표',
    '상담할 때마다 달라지는 불투명한 견적 대신, 기능과 페이지 수에 따른 명확한 정찰제 패키지를 공개합니다.',
    '<h3>왜 정찰제인가요?</h3><p>처음 홈페이지를 제작하시는 사장님들이 가장 어려워하시는 부분이 "적정 가격이 얼마인지 알 수 없다"는 점입니다. 엘레브웹은 모든 제작 패키지와 작업 범위를 사전에 투명하게 공개하며, 5분 설문지 기반 카피 초안 세팅까지 기본 제공합니다.</p><ul><li><strong>Standard(69만 원)</strong>: 반응형 원페이지(5~6섹션) + 스팸차단 견적폼 + 5분 설문지 카피 초안 + 기본 한글 관리자 (맞춤 시안 1종·수정 2회 / 무상 A/S 1개월)</li><li><strong>Deluxe(129만 원 · BEST)</strong>: 메인 + 서브 5~7P 맞춤 UI + 업종별 아카이브 DB + 1:1/네이버 예약 연동 + 전체 한글 관리자 (맞춤 시안 1종·수정 3회 / 무상 A/S 2개월)</li><li><strong>Premium(219만 원)</strong>: 메인 + 서브 10P 내외 + 업종 특화 모듈 1종 + 알림톡/PG/다국어 중 1종 포함 (맞춤 시안 1종·수정 5회 / 무상 A/S 3개월 SLA)</li></ul><p>※ 자사 홈페이지 직계약은 VAT 별도(일반과세자 전자세금계산서 100% 발행)이며, 기본 카피라이팅 초안은 무료로 잡아드리나 업종별 법적 심의 및 최종 문구 검수 책임은 고객사에 있습니다.</p>',
    TRUE, TRUE, FALSE, 'SYSTEM'
),
(
    'government-voucher-support-guide',
    'NOTICE',
    '[지원사업] 소상공인·중소기업 정부지원 바우처 활용 제작 안내',
    '수출바우처, 혁신바우처, 소상공인 스마트상점 등 정부지원 사업을 통한 홈페이지 구축 절차를 안내해 드립니다.',
    '<h3>정부지원 바우처로 부담 없이 제작하세요</h3><p>매년 진행되는 소상공인 디지털 전환 지원사업 및 중소기업 바우처 선정 기업이라면, 자기부담금을 대폭 낮추어 완성도 높은 자체 홈페이지를 구축하실 수 있습니다.</p><p>사업계획서 제출 시 필요한 <strong>표준 견적서, 과업지시서, 사업자 증빙 서류</strong>를 상담 즉시 발급해 드립니다. 바우처 일정에 맞춘 빠른 검수 및 정산 서류 대응도 전담 매니저가 함께 지원합니다.</p>',
    TRUE, TRUE, FALSE, 'SYSTEM'
),
(
    'naver-google-seo-checklist',
    'NOTICE',
    '[인사이트] 네이버·구글 검색 첫 페이지에 잘 노출되는 홈페이지의 비밀',
    '예쁘기만 하고 검색되지 않는 홈페이지가 아니라, 고객이 검색할 때 바로 찾아오는 검색 최적화(SEO) 구조를 기본 탑재합니다.',
    '<h3>검색 로봇이 읽기 좋은 구조로 만듭니다</h3><p>홈페이지를 만들고 나서도 네이버나 구글에 상호명이 검색되지 않아 고민하는 분들이 많습니다. 저희는 제작 완료 시점에 다음 항목을 기본으로 세팅해 드립니다.</p><ul><li>페이지별 고유 제목(Title) 및 요약 설명(Description) 관리자 직접 수정 기능</li><li>네이버 서치어드바이저 &amp; 구글 서치콘솔 사이트 소유 확인 등록</li><li>사이트맵(sitemap.xml) 및 검색 수집 규칙(robots.txt) 자동 생성</li><li>카카오톡 링크 공유 시 깔끔한 대표 썸네일(OG 이미지) 자동 적용</li></ul>',
    FALSE, TRUE, FALSE, 'SYSTEM'
),
(
    'full-ownership-and-source-code',
    'NOTICE',
    '[핵심원칙] 매달 내는 임대료 걱정 없는 100% 고객사 소유권 보장',
    '일반 임대형 웹빌더처럼 매월 고정 사용료를 내며 종속되는 구조가 아닌, 완성된 홈페이지 자산을 고객사가 온전히 소유하는 방식입니다.',
    '<h3>내 사업의 디지털 자산, 직접 소유하세요</h3><p>일반 임대형 웹빌더를 이용하면 초기 진입은 쉬워 보이지만, 매년 반복되는 요금제 인상이나 원하는 기능 확장의 한계, 플랫폼 이동의 어려움 등 장기적인 제약이 생길 수 있습니다.</p><p>엘레브웹은 표준 최신 웹 기술로 제작한 <strong>원본 소스코드와 데이터베이스, 도메인 권한을 100% 고객사 명의로 귀속</strong>시켜 드립니다. 덕분에 향후 사업이 커져서 기능을 추가하거나 서버를 이전할 때도 아무런 제약 없이 자유롭게 확장할 수 있습니다.</p>',
    FALSE, TRUE, FALSE, 'SYSTEM'
),
(
    'mobile-speed-and-conversion-rate',
    'NOTICE',
    '[성능안내] 방문자 10명 중 7명이 떠나는 느린 홈페이지, 속도가 곧 매출입니다',
    '모바일 환경에서 3초 이상 화면이 늦게 뜨면 절반 이상의 고객이 뒤로가기를 누릅니다. 자동 이미지 최적화로 쾌적한 속도를 보장합니다.',
    '<h3>사장님이 사진만 올려도 자동으로 가벼워집니다</h3><p>고화질 매장 사진이나 포트폴리오 이미지를 그대로 올리면 홈페이지가 무거워져 스마트폰에서 한참을 기다려야 합니다.</p><p>저희 관리자 시스템은 사장님이 스마트폰으로 찍은 원본 사진을 그대로 업로드하셔도 <strong>자동으로 차세대 WebP 형식으로 변환하고 화면 크기에 맞게 3단계로 경량화</strong>하여 저장합니다. 덕분에 별도의 포토샵 작업 없이도 언제나 빠르고 선명한 홈페이지를 유지할 수 있습니다.</p>',
    FALSE, TRUE, FALSE, 'SYSTEM'
);
