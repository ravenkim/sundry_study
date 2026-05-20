package org.example.be.api.controller;

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

@ResponseBody
@Controller
public class LoginController {

    @Autowired
    private MemberAuthService memberAuthService;

    @PostMapping("/login")
    public ApiResponse<Void> login(@Valid @RequestBody MemberRequest.Login request) {
        if(memberAuthService.login(request)) {
            return ApiResponse.success(ResponseCode.LOGIN_SUCCESS);
        } else {
            throw new BusinessLogicException(ErrorCode.NOT_CORRECT, "Password is not correct");
        }
    }
}
