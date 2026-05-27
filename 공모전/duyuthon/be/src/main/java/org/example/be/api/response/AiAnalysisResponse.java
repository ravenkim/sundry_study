package org.example.be.api.response;

import lombok.Data;

@Data
public class AiAnalysisResponse {
    private String result;       // "PASS", "ERROR", "WASTE_DETECTED"
    private String message;      // 상세 메시지
    private String ac_status;    // "ON", "OFF", "UNKNOWN" 등
    private String light_status; // "ON", "OFF"
    private String reason;       // Gemini의 판단 이유
    private String expected;     // Gemini 산출 예상 절약 금액 (예: "494원")
    private String expectedKwh;  // Gemini 산출 예상 절약 전기량 (예: "3.8 kWh")
}