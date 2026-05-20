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

    private String address; // 건물 주소 (예: 서울시 XX구 XX로 1)
    //근데 도로명 주소가 필요할까?

    @Builder
    public Building(String name, String address) {
        this.name = name;
        this.address = address;
    }
}