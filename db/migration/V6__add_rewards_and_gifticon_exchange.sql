CREATE TABLE reward_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    point_cost INT NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_key VARCHAR(50) DEFAULT NULL,
    tag VARCHAR(50) DEFAULT NULL,
    is_active BIT(1) NOT NULL DEFAULT 1,
    PRIMARY KEY (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE gifticon_exchange_db (
    seq BIGINT NOT NULL AUTO_INCREMENT,
    member_seq BIGINT NOT NULL,
    reward_seq BIGINT NOT NULL,
    reward_name VARCHAR(255) NOT NULL,
    point_used INT NOT NULL,
    status ENUM('PENDING', 'SENT', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    created_at DATETIME(6) NOT NULL,
    processed_at DATETIME(6) DEFAULT NULL,
    PRIMARY KEY (seq),
    KEY FK_gifticon_exchange_member (member_seq),
    KEY FK_gifticon_exchange_reward (reward_seq),
    CONSTRAINT FK_gifticon_exchange_member FOREIGN KEY (member_seq) REFERENCES member_db (seq),
    CONSTRAINT FK_gifticon_exchange_reward FOREIGN KEY (reward_seq) REFERENCES reward_db (seq)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
