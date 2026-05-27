-- V1: EcoReport baseline schema (location_node tree)

CREATE TABLE affiliation_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    address VARCHAR(255) DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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

CREATE TABLE member_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    user_name VARCHAR(255) DEFAULT NULL,
    provider VARCHAR(255) DEFAULT NULL,
    provider_id VARCHAR(255) DEFAULT NULL,
    user_type ENUM('ADMIN', 'USER') NOT NULL,
    affiliation_seq BIGINT DEFAULT NULL,
    location_node_seq BIGINT DEFAULT NULL,
    PRIMARY KEY (seq),
    KEY FK_member_affiliation (affiliation_seq),
    KEY FK_member_location_node (location_node_seq),
    CONSTRAINT FK_member_affiliation FOREIGN KEY (affiliation_seq) REFERENCES affiliation_db (seq),
    CONSTRAINT FK_member_location_node FOREIGN KEY (location_node_seq) REFERENCES location_node_db (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE member_point_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    point INT NOT NULL,
    member_seq BIGINT DEFAULT NULL,
    PRIMARY KEY (seq),
    UNIQUE KEY UK_member_point_member (member_seq),
    CONSTRAINT FK_member_point_member FOREIGN KEY (member_seq) REFERENCES member_db (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE report_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    created_at DATETIME(6) DEFAULT NULL,
    description VARCHAR(1000) DEFAULT NULL,
    image_url VARCHAR(255) DEFAULT NULL,
    location_detail VARCHAR(255) NOT NULL,
    status ENUM('APPROVED', 'PENDING', 'REJECTED') DEFAULT NULL,
    is_ac_wasting BIT(1) DEFAULT NULL,
    is_heater_wasting BIT(1) DEFAULT NULL,
    is_light_wasting BIT(1) DEFAULT NULL,
    is_other_wasting BIT(1) DEFAULT NULL,
    location_seq BIGINT DEFAULT NULL,
    member_seq BIGINT DEFAULT NULL,
    PRIMARY KEY (seq),
    KEY FK_report_location (location_seq),
    KEY FK_report_member (member_seq),
    CONSTRAINT FK_report_member FOREIGN KEY (member_seq) REFERENCES member_db (seq),
    CONSTRAINT FK_report_location FOREIGN KEY (location_seq) REFERENCES location_node_db (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
