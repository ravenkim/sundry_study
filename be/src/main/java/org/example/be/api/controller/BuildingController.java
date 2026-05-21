package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.BuildingResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.building.BuildingService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/buildings")
@RequiredArgsConstructor
public class BuildingController {

    private final BuildingService buildingService;

    @GetMapping
    public ApiResponse<List<BuildingResponse.Item>> listBuildings() {
        return ApiResponse.success(ResponseCode.BUILDINGS_LIST, buildingService.listBuildings());
    }
}
