package org.example.be.api.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.be.api.request.LocationNodeRequest;
import org.example.be.api.response.ApiResponse;
import org.example.be.api.response.LocationNodeResponse;
import org.example.be.api.response.ResponseCode;
import org.example.be.service.auth.AdminAuthorizationHelper;
import org.example.be.service.location.LocationNodeService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/location-nodes")
@RequiredArgsConstructor
public class AdminLocationNodeController {

    private final LocationNodeService locationNodeService;
    private final AdminAuthorizationHelper adminAuthorizationHelper;

    @GetMapping("/tree")
    public ApiResponse<List<LocationNodeResponse.TreeNode>> getTree(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam Long affiliationId
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        return ApiResponse.success(
                ResponseCode.LOCATION_NODES_TREE,
                locationNodeService.getAdminTree(affiliationId)
        );
    }

    @PostMapping
    public ApiResponse<LocationNodeResponse.TreeNode> create(
            @AuthenticationPrincipal Jwt jwt,
            @Valid @RequestBody LocationNodeRequest.Create request
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        return ApiResponse.success(
                ResponseCode.LOCATION_NODE_CREATED,
                locationNodeService.create(request)
        );
    }

    @PatchMapping("/{id}")
    public ApiResponse<LocationNodeResponse.TreeNode> update(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id,
            @Valid @RequestBody LocationNodeRequest.Update request
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        return ApiResponse.success(
                ResponseCode.LOCATION_NODE_UPDATED,
                locationNodeService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable Long id
    ) {
        adminAuthorizationHelper.requireAdmin(jwt.getClaim("memberSeq"));
        locationNodeService.delete(id);
        return ApiResponse.success(ResponseCode.LOCATION_NODE_DELETED, null);
    }
}
