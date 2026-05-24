package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.AffiliationResponse;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.domain.repository.AffiliationRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/affiliations")
@RequiredArgsConstructor
public class AffiliationController {

    private final AffiliationRepository affiliationRepository;

    @GetMapping
    public ApiResponse<List<AffiliationResponse.Item>> listAffiliations() {
        List<AffiliationResponse.Item> items = affiliationRepository.findAll().stream()
                .map(AffiliationResponse.Item::of)
                .toList();
        return ApiResponse.success(ResponseCode.AFFILIATIONS_LIST, items);
    }
}
