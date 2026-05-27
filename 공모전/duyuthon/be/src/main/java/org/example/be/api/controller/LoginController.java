package org.example.be.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.MemberResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.domain.model.Member;
import org.example.be.service.auth.AuthService;
import org.example.be.service.auth.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import jakarta.validation.Valid;

@Tag(name = "Auth", description = "로그인")
@ResponseBody
@Controller
public class LoginController {

    @Autowired
    private AuthService memberAuthService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Operation(summary = "로그인", description = "사용자명과 비밀번호로 로그인합니다. JWT access token을 반환합니다.")
    @PostMapping("/api/auth/login")
    public ApiResponse<MemberResponse.Login> login(@Valid @RequestBody MemberRequest.Login request) {
        Member member = memberAuthService.authenticate(request);
        String accessToken = jwtTokenProvider.createToken(member);
        return ApiResponse.success(ResponseCode.LOGIN_SUCCESS, MemberResponse.Login.of(member, accessToken));
    }
}
