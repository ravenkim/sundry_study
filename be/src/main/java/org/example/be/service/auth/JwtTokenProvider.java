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
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("ecoreport")
                .issuedAt(now)
                .expiresAt(now.plusMillis(expirationMs))
                .subject(member.getUserName())
                .claim("email", member.getEmail())
                .claim("memberSeq", member.getSeq())
                .claim("userType", member.getUserType() != null ? member.getUserType().name() : UserType.USER.name())
                .claim("buildingId", member.getLocationNode() != null ? member.getLocationNode().getSeq() : null)
                .claim("buildingName", member.getLocationNode() != null ? member.getLocationNode().getName() : null)
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        return jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
    }
}
