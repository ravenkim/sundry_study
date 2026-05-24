-- V2: building_db → location_node_db 트리 구조 전환

CREATE TABLE location_node_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    parent_seq BIGINT DEFAULT NULL,
    affiliation_seq BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    node_kind ENUM('GROUP', 'LEAF') NOT NULL,
    depth INT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    location_type VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (seq),
    KEY FK_location_node_parent (parent_seq),
    KEY FK_location_node_affiliation (affiliation_seq),
    CONSTRAINT FK_location_node_affiliation FOREIGN KEY (affiliation_seq) REFERENCES affiliation_db (seq),
    CONSTRAINT FK_location_node_parent FOREIGN KEY (parent_seq) REFERENCES location_node_db (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO location_node_db (seq, parent_seq, affiliation_seq, name, node_kind, depth, sort_order)
SELECT b.seq,
       NULL,
       COALESCE(b.affiliation_seq, (SELECT MIN(a.seq) FROM affiliation_db a)),
       b.name,
       'GROUP',
       1,
       b.seq
FROM building_db b;

ALTER TABLE member_db
    ADD COLUMN location_node_seq BIGINT DEFAULT NULL;

UPDATE member_db
SET location_node_seq = building_seq
WHERE building_seq IS NOT NULL;

ALTER TABLE member_db
    DROP FOREIGN KEY FK_member_building;

ALTER TABLE member_db
    DROP COLUMN building_seq;

ALTER TABLE member_db
    ADD CONSTRAINT FK_member_location_node FOREIGN KEY (location_node_seq) REFERENCES location_node_db (seq);

ALTER TABLE report_db
    ADD COLUMN location_seq BIGINT DEFAULT NULL;

ALTER TABLE report_db
    DROP FOREIGN KEY FK_report_building;

ALTER TABLE report_db
    DROP COLUMN building_seq;

ALTER TABLE report_db
    ADD CONSTRAINT FK_report_location FOREIGN KEY (location_seq) REFERENCES location_node_db (seq);

DROP TABLE building_db;
