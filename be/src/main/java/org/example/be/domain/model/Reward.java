package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reward_db")
@Getter
@Setter
@NoArgsConstructor
public class Reward {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @Column(nullable = false)
    private String name;

    @Column(name = "point_cost", nullable = false)
    private int pointCost;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "image_key", length = 50)
    private String imageKey;

    @Column(length = 50)
    private String tag;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
