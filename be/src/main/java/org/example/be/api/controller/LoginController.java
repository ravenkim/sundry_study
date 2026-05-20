package org.example.be.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.example.be.service.auth.MemberAuthService;
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
    private MemberAuthService memberAuthService;

    @Operation(summary = "로그인", description = "사용자명과 비밀번호로 로그인합니다.")
    @PostMapping("/login")
    public ApiResponse<Void> login(@Valid @RequestBody MemberRequest.Login request) {
        if(memberAuthService.login(request)) {
            return ApiResponse.success(ResponseCode.LOGIN_SUCCESS);
        } else {
            throw new BusinessLogicException(ErrorCode.NOT_CORRECT, "Password is not correct");
        }
    }
}
