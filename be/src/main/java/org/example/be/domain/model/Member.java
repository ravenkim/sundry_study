package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.catalina.User;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliation_seq")
    private Affiliation affiliation; // 이용자의 소속

    private String provider;
    private String providerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type", nullable = false)
    private UserType userType;

    public Member(String userName, String password, String email, Affiliation affiliation) {
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.affiliation = affiliation;
    }

}