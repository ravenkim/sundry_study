package org.example.be.service.ranking;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.RankingResponse;
import org.example.be.domain.model.Member;
import org.example.be.domain.repository.AffiliationRankingProjection;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.ReportRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AffiliationRankingService {

    private final MemberRepository memberRepository;
    private final ReportRepository reportRepository;

    public RankingResponse.AffiliationLeaderboard getMyAffiliationRanking(Long memberSeq, String period) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        if (member.getAffiliation() == null) {
            throw new BusinessLogicException(ErrorCode.INVALID, "소속을 먼저 선택해 주세요.");
        }

        String normalizedPeriod = normalizePeriod(period);
        LocalDateTime periodStart = "month".equals(normalizedPeriod)
                ? YearMonth.now().atDay(1).atStartOfDay()
                : null;

        Long affiliationId = member.getAffiliation().getSeq();
        List<AffiliationRankingProjection> rows =
                reportRepository.findAffiliationRanking(affiliationId, periodStart);

        List<RankingResponse.Entry> entries = new ArrayList<>();
        Integer myRank = null;
        int rank = 0;
        long previousReportCount = -1;
        double previousTotalKwh = -1;

        for (int index = 0; index < rows.size(); index++) {
            AffiliationRankingProjection row = rows.get(index);
            long reportCount = row.getReportCount() != null ? row.getReportCount() : 0L;
            double totalKwh = row.getTotalKwh() != null ? roundKwh(row.getTotalKwh()) : 0.0;
            long pointAwarded = row.getPointAwarded() != null ? row.getPointAwarded() : 0L;

            if (reportCount != previousReportCount || totalKwh != previousTotalKwh) {
                rank = index + 1;
                previousReportCount = reportCount;
                previousTotalKwh = totalKwh;
            }

            if (reportCount > 0 && row.getMemberSeq().equals(memberSeq)) {
                myRank = rank;
            }

            entries.add(RankingResponse.Entry.builder()
                    .rank(rank)
                    .memberSeq(row.getMemberSeq())
                    .nickname(row.getNickname())
                    .reportCount(reportCount)
                    .totalKwh(totalKwh)
                    .pointAwarded(pointAwarded)
                    .build());
        }

        return RankingResponse.AffiliationLeaderboard.builder()
                .affiliationId(affiliationId)
                .affiliationName(member.getAffiliation().getName())
                .period(normalizedPeriod)
                .myRank(myRank)
                .entries(entries)
                .build();
    }

    private static String normalizePeriod(String period) {
        if (period == null || period.isBlank() || "month".equalsIgnoreCase(period)) {
            return "month";
        }
        if ("all".equalsIgnoreCase(period)) {
            return "all";
        }
        throw new BusinessLogicException(ErrorCode.INVALID, "period는 month 또는 all만 가능합니다.");
    }

    private static double roundKwh(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
