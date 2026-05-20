package org.example.be.api.controller;

import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.example.be.service.member.DefaultMemberService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@ResponseBody
@Controller
public class RegistrationController {
    @Autowired
    private DefaultMemberService defaultMemberService;

    @PostMapping("/register")
    public ApiResponse<Void> register(@Valid @RequestBody MemberRequest.Create request) {
        if(defaultMemberService.registerMember(request)) {
            return ApiResponse.success(ResponseCode.REGISTER_SUCCESS, null);
        }
        else {
            throw new BusinessLogicException(ErrorCode.DB_ERROR);
        }
    }
}
