package org.example.be.service.point;

import lombok.RequiredArgsConstructor;
import org.example.be.api.response.PointResponse;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.repository.GifticonExchangeRepository;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PointService {

    private final MemberRepository memberRepository;
    private final MemberPointRepository memberPointRepository;
    private final GifticonExchangeRepository gifticonExchangeRepository;

    @Transactional
    public PointResponse.Me getMyPoints(Long memberSeq) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        MemberPoint wallet = memberPointRepository.findByMember_Seq(memberSeq)
                .orElseGet(() -> memberPointRepository.save(new MemberPoint(member)));

        int totalRedeemed = gifticonExchangeRepository.sumRedeemedPointsByMember(memberSeq);
        return PointResponse.Me.of(wallet.getPoint(), totalRedeemed);
    }
}
