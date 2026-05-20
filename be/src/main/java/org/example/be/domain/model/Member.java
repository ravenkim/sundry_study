package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "member_db")
@Getter
@Setter
@NoArgsConstructor
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    private String userName;
    private String password;
    private String email;

    private String provider;
    private String providerId;

    public Member(String userName, String password, String email) {
        this.userName = userName;
        this.password = password;
        this.email = email;
    }

}