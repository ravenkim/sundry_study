package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "member_point_db")
@Getter
@Setter
@NoArgsConstructor
public class MemberPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    // Member와 1:1 관계 매핑
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_seq", unique = true)
    private Member member;

    private int point = 0;

    public MemberPoint(Member member) {
        this.member = member;
        this.point = 0;
    }

    public void addPoint(int amount) {
        this.point += amount;
    }
}