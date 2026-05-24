package org.example.be.service.reward;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.PointExchangeRequest;
import org.example.be.api.response.RewardResponse;
import org.example.be.domain.model.GifticonExchange;
import org.example.be.domain.model.GifticonExchangeStatus;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.model.Reward;
import org.example.be.domain.repository.GifticonExchangeRepository;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.domain.repository.RewardRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RewardService {

    private final RewardRepository rewardRepository;
    private final GifticonExchangeRepository gifticonExchangeRepository;
    private final MemberRepository memberRepository;
    private final MemberPointRepository memberPointRepository;

    public List<RewardResponse.Item> getActiveRewards() {
        return RewardResponse.Item.fromList(rewardRepository.findByActiveTrueOrderByPointCostAsc());
    }

    @Transactional
    public RewardResponse.Exchange exchange(Long memberSeq, PointExchangeRequest request) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        Reward reward = rewardRepository.findById(request.getRewardId())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "리워드를 찾을 수 없습니다."));

        if (!reward.isActive()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "현재 교환할 수 없는 리워드입니다.");
        }

        int quantity = Math.max(1, request.getQuantity());
        int pointUsed = reward.getPointCost() * quantity;

        MemberPoint wallet = memberPointRepository.findByMember_Seq(memberSeq)
                .orElseGet(() -> memberPointRepository.save(new MemberPoint(member)));

        if (wallet.getPoint() < pointUsed) {
            throw new BusinessLogicException(ErrorCode.INVALID, "포인트가 부족합니다.");
        }

        wallet.deductPoint(pointUsed);

        GifticonExchange exchange = GifticonExchange.createPending(member, reward, pointUsed);
        gifticonExchangeRepository.save(exchange);

        return RewardResponse.Exchange.from(exchange, wallet.getPoint());
    }

    public List<RewardResponse.ExchangeRow> getMyExchanges(Long memberSeq) {
        return RewardResponse.ExchangeRow.fromList(
                gifticonExchangeRepository.findByMember_SeqOrderByCreatedAtDesc(memberSeq)
        );
    }

    public List<RewardResponse.ExchangeRow> getAdminExchanges(GifticonExchangeStatus statusFilter) {
        List<GifticonExchange> exchanges = statusFilter == null
                ? gifticonExchangeRepository.findAllByOrderByCreatedAtDesc()
                : gifticonExchangeRepository.findByStatusOrderByCreatedAtDesc(statusFilter);
        return RewardResponse.ExchangeRow.fromList(exchanges);
    }

    public RewardResponse.ExchangeStats getAdminExchangeStats() {
        return RewardResponse.ExchangeStats.builder()
                .pendingCount(gifticonExchangeRepository.countByStatus(GifticonExchangeStatus.PENDING))
                .sentCount(gifticonExchangeRepository.countByStatus(GifticonExchangeStatus.SENT))
                .rejectedCount(gifticonExchangeRepository.countByStatus(GifticonExchangeStatus.REJECTED))
                .pendingPoints(gifticonExchangeRepository.sumPendingPoints())
                .build();
    }

    @Transactional
    public RewardResponse.ExchangeRow updateExchangeStatus(
            Long exchangeId,
            GifticonExchangeStatus nextStatus
    ) {
        if (nextStatus == GifticonExchangeStatus.PENDING) {
            throw new BusinessLogicException(ErrorCode.INVALID, "처리 상태를 변경할 수 없습니다.");
        }

        GifticonExchange exchange = gifticonExchangeRepository.findById(exchangeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "교환 신청을 찾을 수 없습니다."));

        if (exchange.getStatus() != GifticonExchangeStatus.PENDING) {
            throw new BusinessLogicException(ErrorCode.INVALID, "이미 처리된 신청입니다.");
        }

        if (nextStatus == GifticonExchangeStatus.REJECTED) {
            MemberPoint wallet = memberPointRepository.findByMember_Seq(exchange.getMember().getSeq())
                    .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "포인트 지갑을 찾을 수 없습니다."));
            wallet.refundPoint(exchange.getPointUsed());
        }

        exchange.setStatus(nextStatus);
        exchange.setProcessedAt(LocalDateTime.now());

        return RewardResponse.ExchangeRow.from(exchange);
    }
}
