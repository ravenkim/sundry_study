package org.example.be.service.auth;

import lombok.RequiredArgsConstructor;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.UserType;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtEncoder jwtEncoder;

    @Value("${jwt.expiration-ms:86400000}")
    private long expirationMs;

    public String createToken(Member member) {
        Instant now = Instant.now();
        String subject = member.getUserName();
        if (subject == null || subject.isBlank()) {
            subject = member.getEmail() != null ? member.getEmail() : String.valueOf(member.getSeq());
        }

        JwtClaimsSet.Builder claimsBuilder = JwtClaimsSet.builder()
                .issuer("ecoreport")
                .issuedAt(now)
                .expiresAt(now.plusMillis(expirationMs))
                .subject(subject)
                .claim("email", member.getEmail())
                .claim("memberSeq", member.getSeq())
                .claim("userType", member.getUserType() != null ? member.getUserType().name() : UserType.USER.name());

        var locationNode = member.getLocationNode();
        if (locationNode != null) {
            claimsBuilder
                    .claim("buildingId", locationNode.getSeq())
                    .claim("buildingName", locationNode.getName());
        }

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claimsBuilder.build())).getTokenValue();
    }
}
