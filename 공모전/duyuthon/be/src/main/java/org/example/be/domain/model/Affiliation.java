package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "affiliation_db")
@Getter
@Setter
@NoArgsConstructor
public class Affiliation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @Column(nullable = false, length = 100)
    private String name;

    private String address; // 건물 주소 (예: 삼육대 - 화랑로 815)

    @Builder
    public Affiliation(String name, String address) {
        this.name = name;
        this.address = address;
    }
}