INSERT INTO site_configs (config_key, config_value, value_type, group_name, description, is_public, is_system) VALUES
('floating_left_enabled', 'true', 'BOOLEAN', 'FLOATING', '좌측 상담 플로팅 바(전화·카톡·WeChat) 노출 여부', TRUE, TRUE),
('floating_right_enabled', 'true', 'BOOLEAN', 'FLOATING', '우측 플로팅 사이드바 노출 여부 (ON/OFF)', TRUE, TRUE),
('quick_kakao_url', 'https://pf.kakao.com/', 'STRING', 'FLOATING', '카카오톡 채널 상담 URL (비워두면 버튼 숨김)', TRUE, TRUE),
('quick_wechat_id', '', 'STRING', 'FLOATING', 'WeChat 상담 ID (비워두면 버튼 숨김)', TRUE, TRUE),
('sns_instagram_url', '', 'STRING', 'FLOATING', '인스타그램 공식 URL (비워두면 아이콘 숨김)', TRUE, TRUE),
('sns_blog_url', '', 'STRING', 'FLOATING', '네이버 블로그 URL (비워두면 아이콘 숨김)', TRUE, TRUE),
('sns_youtube_url', '', 'STRING', 'FLOATING', '유튜브 채널 URL (비워두면 아이콘 숨김)', TRUE, TRUE)
ON CONFLICT (config_key) DO NOTHING;
