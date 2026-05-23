package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "building_db")
@Getter
@Setter
@NoArgsConstructor
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq; // 기존 엔티티들과 ID 네이밍 스타일 통일

    @Column(nullable = false)
    private String name; // 건물 이름 (예: 공학관 A동)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliation_seq")
    private Affiliation affiliation; // 건물이 속한 구역

    @Builder
    public Building(String name, Affiliation affiliation) {
        this.name = name;
        this.affiliation = affiliation;
    }
}