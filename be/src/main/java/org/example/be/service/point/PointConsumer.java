package org.example.be.service.point;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.common.kafka.Event;
import org.example.be.common.kafka.EventPayload;
import org.example.be.common.kafka.EventType;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.dto.PointEventPayload;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class PointConsumer {

    private final MemberPointRepository memberPointRepository;

    @KafkaListener(topics = EventType.Topic.ECO_POINT_TOPIC, groupId = "eco-point-group")
    @Transactional
    public void consumePointEvent(String message) {
        // 1단계: 문자열 -> Event 객체 파싱
        Event<EventPayload> event = Event.fromJson(message);
        if (event == null) return;

        // 2단계: 타입 확인 (확장성을 위한 방어 로직)
        if (event.getType() == EventType.REPORT_APPROVED) {
            // 3단계: 다운 캐스팅 후 비즈니스 로직 처리
            PointEventPayload payload = (PointEventPayload) event.getPayload();

            log.info("제보 승인 감지! 회원 {}에게 {} 포인트 지급", payload.getMemberSeq(), payload.getAmount());

            // (MemberPoint는 이전 답변에서 만든 1:1 테이블이라 가정)
            MemberPoint memberPoint = memberPointRepository.findByMemberSeq(payload.getMemberSeq())
                    .orElseThrow(() -> new IllegalArgumentException("Point Wallet Not Found"));

            memberPoint.addPoint(payload.getAmount());
        }
    }
}