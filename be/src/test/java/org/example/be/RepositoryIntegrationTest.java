package org.example.be;

import org.example.be.domain.model.Building;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.repository.BuildingRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.ReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest // JPA 관련 컴포넌트만 로드하여 빠르고 가볍게 테스트, 기본적으로 H2 인메모리 DB 사용
class RepositoryIntegrationTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Test
    @DisplayName("Member 저장이 정상적으로 수행되어야 한다.")
    void saveMemberTest() {
        // given
        Member member = new Member("eco_student", "password123", "student@univ.ac.kr");

        // when
        Member savedMember = memberRepository.save(member);

        // then
        assertThat(savedMember.getSeq()).isNotNull();
        assertThat(savedMember.getUserName()).isEqualTo("eco_student");
    }

    @Test
    @DisplayName("UserName으로 Member를 조회할 수 있어야 한다.")
    void findByUserNameTest() {
        // given
        Member member = new Member("test_user", "pass", "test@test.com");
        memberRepository.save(member);

        // when
        Member foundMember = memberRepository.findByUserName("test_user").orElse(null);

        // then
        assertThat(foundMember).isNotNull();
        assertThat(foundMember.getEmail()).isEqualTo("test@test.com");
    }

    @Test
    @DisplayName("Report가 Member와 Building 외래키를 포함하여 정상 저장되어야 한다.")
    void saveReportTest() {
        // given - 테스트를 위한 연관 객체 생성 및 저장
        Member member = new Member("reporter", "pass", "rep@univ.ac.kr");
        memberRepository.save(member);

        Building building = new Building(); // 엔티티 설계에 따라 파라미터 삽입 필요
        // building.setName("공학관 A동");
        buildingRepository.save(building);

        Report report = Report.builder()
                .member(member)
                .building(building)
                .locationDetail("303호 복도 끝")
                .description("에어컨이 아무도 없는데 켜져 있습니다.")
                .imageUrl("http://example.com/image.jpg")
                //.wasteType(...) // Embedded 구현체 삽입 필요
                .status(ReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        // when
        Report savedReport = reportRepository.save(report);

        // then
        assertThat(savedReport.getSeq()).isNotNull();
        assertThat(savedReport.getMember().getUserName()).isEqualTo("reporter");
        assertThat(savedReport.getLocationDetail()).isEqualTo("303호 복도 끝");
    }
}