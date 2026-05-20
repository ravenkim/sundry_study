package org.example.be.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/* This one has made to test ping from some clients. */
@Tag(name = "Health", description = "서버 상태 확인")
@ResponseBody
@Controller
public class PingController {
    @Operation(summary = "Ping 테스트", description = "서버 연결 상태를 확인합니다.")
    @GetMapping("/ping")
    public ApiResponse<String> pingTest() {
        return ApiResponse.success(ResponseCode.OK, "pong");
    }
}
