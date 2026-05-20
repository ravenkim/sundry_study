package org.example.be.common.kafka;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.be.dto.PointEventPayload;

@Slf4j
@Getter
@RequiredArgsConstructor
public enum EventType {

    // 포인트 지급 이벤트 정의 (페이로드 클래스와 토픽 매핑)
    REPORT_APPROVED(PointEventPayload.class, Topic.ECO_POINT_TOPIC);

    private final Class<? extends EventPayload> payloadClass;
    private final String topic;

    public static EventType from(String type) {
        try {
            return valueOf(type);
        } catch (Exception e) {
            log.error("[EventType.from] type={}", type, e);
            return null;
        }
    }

    public static class Topic {
        public static final String ECO_POINT_TOPIC = "member-point-topic";
    }
}