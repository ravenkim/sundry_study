package org.example.be.service;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.ReportCreateRequest;
import org.example.be.domain.model.*;
import org.example.be.domain.repository.BuildingRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final ReportRepository reportRepository;
    private final BuildingRepository buildingRepository;
    // private final MemberRepository memberRepository; // 로그인 연동 시 필요

    @Transactional
    public Long createReport(ReportCreateRequest request) {

        // 선택한 건물 정보 조회
        Building building = buildingRepository.findById(request.buildingSeq())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 건물입니다."));

        // 사진 이미지 저장 처리 로직 공간
        // (우선은 파일이 들어오면 가상의 URL을 매핑하고, 들어오지 않으면 null 처리)
        String imageUrl = null;
        if (request.image() != null && !request.image().isEmpty()) {
            imageUrl = "https://storage.ecoreport.kr/reports/" + request.image().getOriginalFilename();
        }

        // 화면에서 넘어온 체크박스 값들을 WasteType 임베디드 객체로 묶기
        WasteType wasteType = new WasteType(
                request.isLightWasting(),
                request.isAcWasting(),
                request.isHeaterWasting(),
                request.isOtherWasting()
        );

        // 엔티티 빌드 (초기 상태는 무조건 'PENDING - 처리중'으로 설정)
        Report report = Report.builder()
                .building(building)
                .locationDetail(request.locationDetail())
                .description(request.description())
                .imageUrl(imageUrl)
                .wasteType(wasteType)
                .status(ReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        // 6. DB에 최종 저장 (Insert 쿼리 실행)
        Report savedReport = reportRepository.save(report);

        // 생성된 제보의 고유 식별자(seq) 반환
        return savedReport.getSeq();
    }
}