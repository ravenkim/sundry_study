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

    @Column(name = "phone_number")
    private String phoneNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "affiliation_seq")
    private Affiliation affiliation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_node_seq")
    private LocationNode locationNode;

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
