-- building_db → location_node_db 마이그레이션 (기존 DB, idempotent)
-- 신규 설치는 energy_schema.sql만 사용하면 됩니다.

CREATE TABLE IF NOT EXISTS `location_node_db` (
  `seq` bigint NOT NULL AUTO_INCREMENT,
  `parent_seq` bigint DEFAULT NULL,
  `affiliation_seq` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `node_kind` enum('GROUP','LEAF') NOT NULL,
  `depth` int NOT NULL,
  `sort_order` int NOT NULL DEFAULT 0,
  `location_type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`seq`),
  KEY `FK_location_node_parent` (`parent_seq`),
  KEY `FK_location_node_affiliation` (`affiliation_seq`),
  CONSTRAINT `FK_location_node_affiliation` FOREIGN KEY (`affiliation_seq`) REFERENCES `affiliation_db` (`seq`),
  CONSTRAINT `FK_location_node_parent` FOREIGN KEY (`parent_seq`) REFERENCES `location_node_db` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- building → root GROUP 노드 이전 (building_db 가 있을 때만)
SET @has_building_table := (
  SELECT COUNT(*) FROM information_schema.TABLES
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'building_db'
);

SET @sql_building_migrate := IF(@has_building_table > 0,
  'INSERT INTO location_node_db (seq, parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
   SELECT b.seq, NULL, COALESCE(b.affiliation_seq, (SELECT MIN(seq) FROM affiliation_db)), b.name, ''GROUP'', 1, b.seq
   FROM building_db b
   WHERE NOT EXISTS (SELECT 1 FROM location_node_db ln WHERE ln.seq = b.seq)',
  'SELECT 1');
PREPARE stmt FROM @sql_building_migrate;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- member: building_seq → location_node_seq
SET @has_location_node_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'member_db' AND COLUMN_NAME = 'location_node_seq'
);

SET @sql_member_add := IF(@has_location_node_col = 0,
  'ALTER TABLE member_db ADD COLUMN location_node_seq bigint DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql_member_add;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_building_col := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'member_db' AND COLUMN_NAME = 'building_seq'
);

SET @sql_member_copy := IF(@has_building_col > 0,
  'UPDATE member_db SET location_node_seq = building_seq WHERE building_seq IS NOT NULL AND location_node_seq IS NULL',
  'SELECT 1');
PREPARE stmt FROM @sql_member_copy;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @fk_member_building := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'member_db'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = 'FKfnwegggrek5f9pagfxfu3ssn3'
  LIMIT 1
);

SET @sql_drop_fk := IF(@fk_member_building IS NOT NULL,
  'ALTER TABLE member_db DROP FOREIGN KEY FKfnwegggrek5f9pagfxfu3ssn3',
  'SELECT 1');
PREPARE stmt FROM @sql_drop_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql_drop_col := IF(@has_building_col > 0,
  'ALTER TABLE member_db DROP COLUMN building_seq',
  'SELECT 1');
PREPARE stmt FROM @sql_drop_col;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_member_fk := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'member_db'
    AND CONSTRAINT_NAME = 'FK_member_location_node'
);

SET @sql_member_fk := IF(@has_member_fk = 0,
  'ALTER TABLE member_db ADD CONSTRAINT FK_member_location_node FOREIGN KEY (location_node_seq) REFERENCES location_node_db (seq)',
  'SELECT 1');
PREPARE stmt FROM @sql_member_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- report: building_seq → location_seq
SET @has_location_seq := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'report_db' AND COLUMN_NAME = 'location_seq'
);

SET @sql_report_add := IF(@has_location_seq = 0,
  'ALTER TABLE report_db ADD COLUMN location_seq bigint DEFAULT NULL',
  'SELECT 1');
PREPARE stmt FROM @sql_report_add;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_report_building := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'report_db' AND COLUMN_NAME = 'building_seq'
);

SET @fk_report_building := (
  SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'report_db'
    AND CONSTRAINT_TYPE = 'FOREIGN KEY' AND CONSTRAINT_NAME = 'FKlw58bmh1bsf6hwbh98ce227qp'
  LIMIT 1
);

SET @sql_report_drop_fk := IF(@fk_report_building IS NOT NULL,
  'ALTER TABLE report_db DROP FOREIGN KEY FKlw58bmh1bsf6hwbh98ce227qp',
  'SELECT 1');
PREPARE stmt FROM @sql_report_drop_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql_report_drop_col := IF(@has_report_building > 0,
  'ALTER TABLE report_db DROP COLUMN building_seq',
  'SELECT 1');
PREPARE stmt FROM @sql_report_drop_col;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_report_fk := (
  SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'report_db'
    AND CONSTRAINT_NAME = 'FK_report_location'
);

SET @sql_report_fk := IF(@has_report_fk = 0,
  'ALTER TABLE report_db ADD CONSTRAINT FK_report_location FOREIGN KEY (location_seq) REFERENCES location_node_db (seq)',
  'SELECT 1');
PREPARE stmt FROM @sql_report_fk;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

DROP TABLE IF EXISTS `building_db`;

-- Hibernate validate: depth 는 INT 여야 함
ALTER TABLE location_node_db MODIFY depth int NOT NULL;
