package org.example.be.config;

import lombok.RequiredArgsConstructor;
import org.example.be.service.auth.CustomOAuth2UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomOAuth2UserService customOAuth2UserService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // 로컬 개발/테스트 완료를 위해 비활성화
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // 보안보단 완성이 목표이므로 모두 허용
                )
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo
                                .userService(customOAuth2UserService) // 작성한 OAuth2 서비스 연결
                        )
                        // 로그인 성공 시 이동할 엔드포인트 설정 (프론트엔드로 리다이렉트 등)
                        .defaultSuccessUrl("/api/login/success")
                );

        return http.build();
    }
}