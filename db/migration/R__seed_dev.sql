-- Dev seed data (idempotent). BCrypt strength 10 — admin1234! / user1234!

INSERT INTO affiliation_db (name, address)
SELECT '삼육대학교', '서울특별시 노원구 화랑로 815'
WHERE NOT EXISTS (SELECT 1 FROM affiliation_db WHERE name = '삼육대학교');

-- Root GROUP nodes (buildings)
INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT NULL, a.seq, '공학관 A동', 'GROUP', 1, 0
FROM affiliation_db a
WHERE a.name = '삼육대학교'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db n
      WHERE n.parent_seq IS NULL AND n.name = '공학관 A동'
  );

INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT NULL, a.seq, '도서관', 'GROUP', 1, 1
FROM affiliation_db a
WHERE a.name = '삼육대학교'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db n
      WHERE n.parent_seq IS NULL AND n.name = '도서관'
  );

INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT NULL, a.seq, '학생회관', 'GROUP', 1, 2
FROM affiliation_db a
WHERE a.name = '삼육대학교'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db n
      WHERE n.parent_seq IS NULL AND n.name = '학생회관'
  );

INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT NULL, a.seq, '본관', 'GROUP', 1, 3
FROM affiliation_db a
WHERE a.name = '삼육대학교'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db n
      WHERE n.parent_seq IS NULL AND n.name = '본관'
  );

-- LEAF nodes under 공학관 A동
INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT p.seq, p.affiliation_seq, v.name, 'LEAF', 2, v.sort_order
FROM location_node_db p
JOIN (
    SELECT '303호' AS name, 0 AS sort_order UNION ALL
    SELECT '304호', 1 UNION ALL
    SELECT '2층 복도', 2
) v ON 1 = 1
WHERE p.parent_seq IS NULL AND p.name = '공학관 A동'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db c
      WHERE c.parent_seq = p.seq AND c.name = v.name
  );

-- LEAF nodes under 도서관
INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT p.seq, p.affiliation_seq, v.name, 'LEAF', 2, v.sort_order
FROM location_node_db p
JOIN (
    SELECT '2열람실' AS name, 0 AS sort_order UNION ALL
    SELECT '3열람실', 1
) v ON 1 = 1
WHERE p.parent_seq IS NULL AND p.name = '도서관'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db c
      WHERE c.parent_seq = p.seq AND c.name = v.name
  );

-- LEAF nodes under 학생회관
INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT p.seq, p.affiliation_seq, v.name, 'LEAF', 2, v.sort_order
FROM location_node_db p
JOIN (
    SELECT '101호' AS name, 0 AS sort_order UNION ALL
    SELECT '201호', 1
) v ON 1 = 1
WHERE p.parent_seq IS NULL AND p.name = '학생회관'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db c
      WHERE c.parent_seq = p.seq AND c.name = v.name
  );

-- LEAF nodes under 본관
INSERT INTO location_node_db (parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT p.seq, p.affiliation_seq, v.name, 'LEAF', 2, v.sort_order
FROM location_node_db p
JOIN (
    SELECT '501호' AS name, 0 AS sort_order UNION ALL
    SELECT '502호', 1
) v ON 1 = 1
WHERE p.parent_seq IS NULL AND p.name = '본관'
  AND NOT EXISTS (
      SELECT 1 FROM location_node_db c
      WHERE c.parent_seq = p.seq AND c.name = v.name
  );

-- Admin account
INSERT INTO member_db (user_name, nickname, password, email, phone_number, user_type, affiliation_seq, location_node_seq)
SELECT
    'admin',
    '에코관리자',
    '$2b$10$u76UxwI8aDheM9FsbKTcW.PQnaIIrZX5BswXAZfj8dKN53A53O0G.',
    'admin@ecoreport.kr',
    '01011110001',
    'ADMIN',
    a.seq,
    n.seq
FROM affiliation_db a
JOIN location_node_db n ON n.parent_seq IS NULL AND n.name = '공학관 A동'
WHERE a.name = '삼육대학교'
  AND NOT EXISTS (SELECT 1 FROM member_db m WHERE m.user_name = 'admin');

INSERT INTO member_point_db (point, member_seq)
SELECT 0, m.seq
FROM member_db m
WHERE m.user_name = 'admin'
  AND NOT EXISTS (SELECT 1 FROM member_point_db mp WHERE mp.member_seq = m.seq);

-- 기존 admin 계정 소속·건물을 삼육대학교로 맞춤 (시드 재실행 시)
UPDATE member_db m
JOIN affiliation_db a ON a.name = '삼육대학교'
JOIN location_node_db n ON n.parent_seq IS NULL AND n.name = '공학관 A동' AND n.affiliation_seq = a.seq
SET m.affiliation_seq = a.seq,
    m.location_node_seq = n.seq,
    m.nickname = '에코관리자'
WHERE m.user_name = 'admin';

-- User account
INSERT INTO member_db (user_name, nickname, password, email, phone_number, user_type, affiliation_seq, location_node_seq)
SELECT
    'user',
    '에코유저',
    '$2b$10$M20EFNpJiVd8zG4K36.um.kG1.ebqmPztuHMOAEtLKGPvtK5doATK',
    'user@ecoreport.kr',
    '01022220002',
    'USER',
    a.seq,
    n.seq
FROM affiliation_db a
JOIN location_node_db n ON n.parent_seq IS NULL AND n.name = '도서관'
WHERE a.name = '삼육대학교'
  AND NOT EXISTS (SELECT 1 FROM member_db m WHERE m.user_name = 'user');

INSERT INTO member_point_db (point, member_seq)
SELECT 0, m.seq
FROM member_db m
WHERE m.user_name = 'user'
  AND NOT EXISTS (SELECT 1 FROM member_point_db mp WHERE mp.member_seq = m.seq);

UPDATE member_db SET nickname = '에코유저' WHERE user_name = 'user';
UPDATE member_db SET nickname = '에코관리자' WHERE user_name = 'admin';

-- Phase 1: LEAF 노드 전기 자원 수량 (데모용, idempotent)
UPDATE location_node_db n
SET n.ac_count = 1, n.fluorescent_count = 8, n.led_count = 2
WHERE n.node_kind = 'LEAF' AND n.name = '303호';

UPDATE location_node_db n
SET n.ac_count = 1, n.fluorescent_count = 10, n.led_count = 0
WHERE n.node_kind = 'LEAF' AND n.name = '304호';

UPDATE location_node_db n
SET n.ac_count = 0, n.fluorescent_count = 6, n.led_count = 4
WHERE n.node_kind = 'LEAF' AND n.name = '2층 복도';

UPDATE location_node_db n
SET n.ac_count = 2, n.fluorescent_count = 12, n.led_count = 6
WHERE n.node_kind = 'LEAF' AND n.name = '2열람실';

UPDATE location_node_db n
SET n.ac_count = 2, n.fluorescent_count = 10, n.led_count = 8
WHERE n.node_kind = 'LEAF' AND n.name = '3열람실';

UPDATE location_node_db n
SET n.ac_count = 1, n.fluorescent_count = 6, n.led_count = 2
WHERE n.node_kind = 'LEAF' AND n.name IN ('101호', '201호', '501호', '502호');

-- Phase 1: LEAF 요일별 운영시간 (월~금 07-22, 토 08-18, 일 휴무, idempotent)
INSERT INTO location_operating_schedule_db (location_node_seq, day_of_week, is_closed, power_on_time, power_off_time)
SELECT n.seq, d.day_of_week, d.is_closed, d.power_on_time, d.power_off_time
FROM location_node_db n
CROSS JOIN (
    SELECT 1 AS day_of_week, 0 AS is_closed, '07:00:00' AS power_on_time, '22:00:00' AS power_off_time UNION ALL
    SELECT 2, 0, '07:00:00', '22:00:00' UNION ALL
    SELECT 3, 0, '07:00:00', '22:00:00' UNION ALL
    SELECT 4, 0, '07:00:00', '22:00:00' UNION ALL
    SELECT 5, 0, '07:00:00', '22:00:00' UNION ALL
    SELECT 6, 0, '08:00:00', '18:00:00' UNION ALL
    SELECT 7, 1, NULL, NULL
) d
WHERE n.node_kind = 'LEAF'
  AND NOT EXISTS (
      SELECT 1 FROM location_operating_schedule_db s WHERE s.location_node_seq = n.seq
  );

-- Rewards catalog (포인트샵)
INSERT INTO reward_db (name, point_cost, category, image_key, tag, is_active)
SELECT v.name, v.point_cost, v.category, v.image_key, v.tag, 1
FROM (
    SELECT '스타벅스 아이스 아메리카노 T' AS name, 500 AS point_cost, '커피/음료' AS category, 'coffee' AS image_key, NULL AS tag UNION ALL
    SELECT 'GS25 모바일 상품권 3천원', 300, '편의점', 'convenience', NULL UNION ALL
    SELECT '학식 포인트 100원', 100, '편의점', 'meal', NULL UNION ALL
    SELECT '지구온난화 방지 기금 기부', 1000, '환경 기부', 'donation', '기부'
) v
WHERE NOT EXISTS (SELECT 1 FROM reward_db r WHERE r.name = v.name);

-- Demo user points for 포인트샵 교환 테스트
UPDATE member_point_db mp
JOIN member_db m ON m.seq = mp.member_seq
SET mp.point = 370
WHERE m.user_name = 'user' AND mp.point = 0;
