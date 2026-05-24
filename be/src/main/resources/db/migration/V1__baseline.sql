-- V1: 초기 스키마 (building_db 기반)

CREATE TABLE affiliation_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    address VARCHAR(255) DEFAULT NULL,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE building_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    address VARCHAR(255) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    affiliation_seq BIGINT DEFAULT NULL,
    PRIMARY KEY (seq),
    KEY FK_building_affiliation (affiliation_seq),
    CONSTRAINT FK_building_affiliation FOREIGN KEY (affiliation_seq) REFERENCES affiliation_db (seq)
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
    building_seq BIGINT DEFAULT NULL,
    PRIMARY KEY (seq),
    KEY FK_member_affiliation (affiliation_seq),
    KEY FK_member_building (building_seq),
    CONSTRAINT FK_member_building FOREIGN KEY (building_seq) REFERENCES building_db (seq),
    CONSTRAINT FK_member_affiliation FOREIGN KEY (affiliation_seq) REFERENCES affiliation_db (seq)
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
    building_seq BIGINT DEFAULT NULL,
    member_seq BIGINT DEFAULT NULL,
    PRIMARY KEY (seq),
    KEY FK_report_building (building_seq),
    KEY FK_report_member (member_seq),
    CONSTRAINT FK_report_member FOREIGN KEY (member_seq) REFERENCES member_db (seq),
    CONSTRAINT FK_report_building FOREIGN KEY (building_seq) REFERENCES building_db (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
