package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.BuildingSavingsResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.savings.BuildingSavingsService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/savings/buildings")
@RequiredArgsConstructor
public class BuildingSavingsController {

    private final BuildingSavingsService buildingSavingsService;

    @GetMapping("/me")
    public ApiResponse<List<BuildingSavingsResponse.Item>> getMyBuildingSavings(
            @AuthenticationPrincipal Jwt jwt
    ) {
        Long memberSeq = jwt.getClaim("memberSeq");
        return ApiResponse.success(
                ResponseCode.SAVINGS_BUILDINGS_ME,
                buildingSavingsService.getMyBuildingSavings(memberSeq)
        );
    }
}
