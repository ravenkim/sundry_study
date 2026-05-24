package org.example.be;

import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.NodeKind;
import org.example.be.domain.model.Report;
import org.example.be.domain.model.ReportStatus;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.LocationNodeRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.ReportRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class RepositoryIntegrationTest {

    @Autowired
    private MemberRepository memberRepository;

    @Autowired
    private AffiliationRepository affiliationRepository;

    @Autowired
    private LocationNodeRepository locationNodeRepository;

    @Autowired
    private ReportRepository reportRepository;

    @Test
    @DisplayName("Member 저장이 정상적으로 수행되어야 한다.")
    void saveMemberTest() {
        Affiliation affiliation = affiliationRepository.save(
                Affiliation.builder().name("테스트대학교").build()
        );
        Member member = new Member("eco_student", "password123", "student@univ.ac.kr", affiliation);

        Member savedMember = memberRepository.save(member);

        assertThat(savedMember.getSeq()).isNotNull();
        assertThat(savedMember.getUserName()).isEqualTo("eco_student");
    }

    @Test
    @DisplayName("UserName으로 Member를 조회할 수 있어야 한다.")
    void findByUserNameTest() {
        Affiliation affiliation = affiliationRepository.save(
                Affiliation.builder().name("테스트대학교2").build()
        );
        Member member = new Member("test_user", "pass", "test@test.com", affiliation);
        memberRepository.save(member);

        Member foundMember = memberRepository.findByUserName("test_user").orElse(null);

        assertThat(foundMember).isNotNull();
        assertThat(foundMember.getEmail()).isEqualTo("test@test.com");
    }

    @Test
    @DisplayName("Report가 Member와 LocationNode 외래키를 포함하여 정상 저장되어야 한다.")
    void saveReportTest() {
        Affiliation affiliation = affiliationRepository.save(
                Affiliation.builder().name("테스트대학교3").build()
        );
        Member member = new Member("reporter", "pass", "rep@univ.ac.kr", affiliation);
        memberRepository.save(member);

        LocationNode locationNode = locationNodeRepository.save(
                LocationNode.builder()
                        .affiliation(affiliation)
                        .name("303호")
                        .nodeKind(NodeKind.LEAF)
                        .depth(1)
                        .sortOrder(0)
                        .build()
        );

        Report report = Report.builder()
                .member(member)
                .locationNode(locationNode)
                .locationDetail("303호 복도 끝")
                .description("에어컨이 아무도 없는데 켜져 있습니다.")
                .imageUrl("http://example.com/image.jpg")
                .status(ReportStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Report savedReport = reportRepository.save(report);

        assertThat(savedReport.getSeq()).isNotNull();
        assertThat(savedReport.getMember().getUserName()).isEqualTo("reporter");
        assertThat(savedReport.getLocationDetail()).isEqualTo("303호 복도 끝");
    }
}
