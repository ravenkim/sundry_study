package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "gifticon_exchange_db")
@Getter
@Setter
@NoArgsConstructor
public class GifticonExchange {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_seq", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reward_seq", nullable = false)
    private Reward reward;

    @Column(name = "reward_name", nullable = false)
    private String rewardName;

    @Column(name = "point_used", nullable = false)
    private int pointUsed;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private GifticonExchangeStatus status = GifticonExchangeStatus.PENDING;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "processed_at")
    private LocalDateTime processedAt;

    public static GifticonExchange createPending(
            Member member,
            Reward reward,
            int pointUsed
    ) {
        GifticonExchange exchange = new GifticonExchange();
        exchange.member = member;
        exchange.reward = reward;
        exchange.rewardName = reward.getName();
        exchange.pointUsed = pointUsed;
        exchange.status = GifticonExchangeStatus.PENDING;
        exchange.createdAt = LocalDateTime.now();
        return exchange;
    }
}
