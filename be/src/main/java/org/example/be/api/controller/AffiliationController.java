package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.AffiliationResponse;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.affiliation.AffiliationService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/affiliations")
@RequiredArgsConstructor
public class AffiliationController {

    private final AffiliationService affiliationService;

    @GetMapping
    public ApiResponse<AffiliationResponse.ListPayload> listAffiliations() {
        return ApiResponse.success(
                ResponseCode.AFFILIATIONS_LIST,
                affiliationService.listAffiliations()
        );
    }
}
