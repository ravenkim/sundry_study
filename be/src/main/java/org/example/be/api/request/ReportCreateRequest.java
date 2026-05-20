package org.example.be.api.request;

import org.springframework.web.multipart.MultipartFile;

public record ReportCreateRequest(
        Long buildingSeq,         // 선택한 건물 ID
        String locationDetail,    // 상세 장소 (예: 303호)
        boolean isLightWasting,   // 조명 켜짐 체크 여부
        boolean isAcWasting,      // 에어컨 공회전 체크 여부
        boolean isOtherWasting,   // 기타 체크 여부
        MultipartFile image       // 촬영한 현장 사진 파일 (선택 사항)
) {}