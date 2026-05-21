package org.example.be.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.member.DefaultMemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.example.be.api.response.MemberResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Tag(name = "Auth", description = "회원가입")
@ResponseBody
@Controller
public class RegistrationController {
    @Autowired
    private DefaultMemberService defaultMemberService;

    @Operation(summary = "이메일 중복 확인", description = "DB에서 이메일 사용 여부를 확인합니다.")
    @GetMapping("/register/check-email")
    public ApiResponse<MemberResponse.EmailCheck> checkEmail(@RequestParam String email) {
        boolean available = defaultMemberService.isEmailAvailable(email);
        String normalized = email == null ? "" : email.trim().toLowerCase();
        return ApiResponse.success(
                ResponseCode.OK,
                MemberResponse.EmailCheck.of(normalized, available)
        );
    }

    @Operation(summary = "아이디 중복 확인", description = "DB에서 아이디 사용 여부를 확인합니다.")
    @GetMapping("/register/check-username")
    public ApiResponse<MemberResponse.UserNameCheck> checkUserName(@RequestParam String userName) {
        boolean available = defaultMemberService.isUserNameAvailable(userName);
        String trimmed = userName == null ? "" : userName.trim();
        return ApiResponse.success(
                ResponseCode.OK,
                MemberResponse.UserNameCheck.of(trimmed, available)
        );
    }

    @Operation(summary = "회원가입", description = "새 사용자 계정을 등록합니다.")
    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody MemberRequest.Create request) {
        defaultMemberService.registerMember(request);
        return ApiResponse.success(ResponseCode.REGISTER_SUCCESS, null);
    }
}
