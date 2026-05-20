package org.example.be.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.example.be.common.kafka.EventPayload;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PointEventPayload implements EventPayload {
    private Long memberSeq;
    private int amount;
}