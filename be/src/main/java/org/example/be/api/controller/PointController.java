package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.PointResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.point.PointService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/points")
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    @GetMapping("/me")
    public ApiResponse<PointResponse.Me> getMyPoints(@AuthenticationPrincipal Jwt jwt) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(ResponseCode.POINTS_ME, pointService.getMyPoints(memberSeq));
    }
}
