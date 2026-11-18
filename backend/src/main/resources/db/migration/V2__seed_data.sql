-- =====================================================================
-- V2__seed_data.sql
-- 납품 즉시 관리자 화면에서 바로 제어 가능한 핵심 기본 시드(Seed) 데이터
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
(NULL, 'PUBLIC', '회사소개', '/about', 'Building2', 1, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '포트폴리오', '/portfolio', 'Briefcase', 2, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '공지사항', '/notices', 'Megaphone', 3, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '온라인 예약', '/reservations', 'CalendarCheck', 4, TRUE, TRUE, NULL),
(NULL, 'PUBLIC', '상담문의', '/inquiries', 'MessageSquarePlus', 5, TRUE, TRUE, NULL),
(NULL, 'ADMIN', '대시보드', '/admin', 'LayoutDashboard', 1, TRUE, TRUE, NULL),
(NULL, 'ADMIN', 'SEO·브랜딩 설정', '/admin/configs', 'Sliders', 2, TRUE, TRUE, 'config:write'),
(NULL, 'ADMIN', '상담문의 관리', '/admin/inquiries', 'Inbox', 3, TRUE, TRUE, 'inquiry:read'),
(NULL, 'ADMIN', '예약 관리', '/admin/reservations', 'Calendar', 4, TRUE, TRUE, 'reservation:read'),
(NULL, 'ADMIN', 'CMS 콘텐츠 관리', '/admin/cms', 'FileText', 5, TRUE, TRUE, 'cms:read'),
(NULL, 'ADMIN', '미디어 라이브러리', '/admin/media', 'Image', 6, TRUE, TRUE, 'media:write');

-- 3. 무코드 SEO·브랜딩·하이브리드 예약 필수 설정 시드 (site_configs)
INSERT INTO site_configs (config_key, config_value, value_type, group_name, description, is_public, is_system) VALUES
('seo_title', '정확하고 빠른 비즈니스 파트너 | 표준 기업 홈페이지', 'STRING', 'SEO', '브라우저 탭 및 검색 결과 제목', TRUE, TRUE),
('seo_description', '전문적인 상담과 맞춤형 솔루션을 제공합니다.', 'STRING', 'SEO', '네이버·구글 검색 결과 요약 설명문', TRUE, TRUE),
('seo_keywords', '기업홈페이지,전문상담,맞춤견적', 'STRING', 'SEO', '검색 키워드 (쉼표 구분)', TRUE, TRUE),
('seo_og_image', '/uploads/public/default-og.webp', 'IMAGE', 'SEO', '카카오톡·SNS 링크 공유 시 대표 썸네일', TRUE, TRUE),
('naver_site_verification', '', 'STRING', 'SEO', '네이버 서치어드바이저 인증 메타태그 값', TRUE, TRUE),
('google_site_verification', '', 'STRING', 'SEO', '구글 서치콘솔 인증 메타태그 값', TRUE, TRUE),
('robots_txt_custom', 'User-agent: *\nAllow: /\nDisallow: /admin/', 'STRING', 'SEO', '검색 로봇 수집 규칙 설정', TRUE, TRUE),
('brand_primary_color', '#4F46E5', 'COLOR', 'BRANDING', '홈페이지 메인 포인트 색상 (HEX)', TRUE, TRUE),
('brand_logo_url', '/uploads/public/logo.webp', 'IMAGE', 'BRANDING', '상단 헤더 로고 이미지 URL', TRUE, TRUE),
('brand_favicon_url', '/uploads/public/favicon.ico', 'IMAGE', 'BRANDING', '브라우저 탭 파비콘 URL', TRUE, TRUE),
('footer_company_info', '{"name":"주식회사 스타터","ceo":"홍길동","bizNo":"123-45-67890","phone":"02-1234-5678","address":"서울시 강남구 테헤란로 123"}', 'JSON', 'COMPANY', '푸터 하단 사업자 정보', TRUE, TRUE),
('reservation_mode', 'BOTH', 'STRING', 'RESERVATION', '예약 채널 모드 (OFF | NAVER | INTERNAL | BOTH)', TRUE, TRUE),
('reservation_capacity_mode', 'SINGLE', 'STRING', 'RESERVATION', '자체 예약 정원 모드 (SINGLE: 1:1 단독예약 | MULTI: 시간대별 N명 정원제)', TRUE, TRUE),
('reservation_default_capacity', '1', 'NUMBER', 'RESERVATION', 'MULTI 모드 시 시간대별 기본 정원 수 (SINGLE 모드 시 1로 강제)', TRUE, TRUE),
('naver_booking_url', 'https://booking.naver.com/', 'STRING', 'RESERVATION', '네이버 스마트플레이스 예약 연결 주소', TRUE, TRUE);

-- 4. 필수 시스템 약관 시드 (is_system = TRUE 로 삭제 방지)
INSERT INTO cms_contents (slug, category, title, summary, content_html, is_pinned, is_published, is_system, author_id) VALUES
('terms-of-service', 'TERMS', '서비스 이용약관', '표준 홈페이지 서비스 이용약관입니다.', '<p>제1조(목적) 본 약관은 서비스 이용 조건 및 절차를 규정합니다.</p>', FALSE, TRUE, TRUE, 'SYSTEM'),
('privacy-policy', 'TERMS', '개인정보처리방침', '개인정보 보호법에 따른 처리방침입니다.', '<p>당사는 상담 문의 및 예약 접수를 위해 최소한의 개인정보만을 수집·이용합니다.</p>', FALSE, TRUE, TRUE, 'SYSTEM');
