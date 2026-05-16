package org.example.be.api.controller;

import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/* This one has made to test ping from some clients. */
@ResponseBody
@Controller
public class PingController {
    @GetMapping("/ping")
    public ApiResponse<String> pingTest() {
        return ApiResponse.success(ResponseCode.OK, "pong");
    }
}
