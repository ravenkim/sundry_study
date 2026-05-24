package org.example.be.api.controller;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.api.response.RewardResponse;
import org.example.be.service.reward.RewardService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rewards")
@RequiredArgsConstructor
public class RewardController {

    private final RewardService rewardService;

    @GetMapping
    public ApiResponse<List<RewardResponse.Item>> getRewards() {
        return ApiResponse.success(ResponseCode.REWARDS_LIST, rewardService.getActiveRewards());
    }
}
