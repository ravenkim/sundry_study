package org.example.be.service.point;

import lombok.RequiredArgsConstructor;
import org.example.be.common.kafka.Event;
import org.example.be.common.kafka.EventType;
import org.example.be.dto.PointEventPayload;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PointProducer {

    // KafkaTemplate의 Value 타입을 String으로 변경
    private final KafkaTemplate<String, String> kafkaTemplate;

    public void addEcoFreshPoint(Long memberSeq, Long reportId) {
        PointEventPayload payload = new PointEventPayload(memberSeq, 100);

        // Report ID를 eventId로 활용하여 멱등성 처리 등에 사용할 수 있음
        Event<org.example.be.common.kafka.EventPayload> event = Event.of(reportId, EventType.REPORT_APPROVED, payload);

        // JSON 문자열로 변환하여 전송
        kafkaTemplate.send(event.getType().getTopic(), event.toJson());
    }
}