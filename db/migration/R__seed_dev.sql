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
INSERT INTO member_db (user_name, password, email, phone_number, user_type, affiliation_seq, location_node_seq)
SELECT
    'admin',
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

-- User account
INSERT INTO member_db (user_name, password, email, phone_number, user_type, affiliation_seq, location_node_seq)
SELECT
    'user',
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
