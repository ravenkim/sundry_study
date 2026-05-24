package org.example.be.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.be.api.request.MemberProfileRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.MemberResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.member.MemberService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class MemberProfileController {

    private final MemberService memberService;

    @GetMapping
    public ApiResponse<MemberResponse.Detail> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        Long memberSeq = jwt.getClaim("memberSeq");
        MemberResponse.Detail detail = memberService.findMyProfile(memberSeq);
        return ApiResponse.success(ResponseCode.MEMBER_PROFILE, detail);
    }

    @PatchMapping("/profile")
    public ApiResponse<MemberResponse.Detail> updateProfile(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody MemberProfileRequest.Update request
    ) {
        Long memberSeq = jwt.getClaim("memberSeq");
        MemberResponse.Detail detail = memberService.updateProfile(memberSeq, request);
        return ApiResponse.success(ResponseCode.MEMBER_PROFILE_UPDATED, detail);
    }

    @PatchMapping("/building")
    public ApiResponse<MemberResponse.Detail> assignBuilding(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody MemberProfileRequest.AssignBuilding request
    ) {
        Long memberSeq = jwt.getClaim("memberSeq");
        MemberResponse.Detail detail = memberService.assignBuilding(memberSeq, request.getBuildingId());
        return ApiResponse.success(ResponseCode.MEMBER_BUILDING_UPDATED, detail);
    }

    @PatchMapping("/affiliation")
    public ApiResponse<MemberResponse.Detail> assignAffiliation(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody MemberProfileRequest.AssignAffiliation request
    ) {
        Long memberSeq = jwt.getClaim("memberSeq");
        MemberResponse.Detail detail = memberService.assignAffiliation(
                memberSeq,
                request.getAffiliationId(),
                request.getBuildingId()
        );
        return ApiResponse.success(ResponseCode.MEMBER_BUILDING_UPDATED, detail);
    }
}
