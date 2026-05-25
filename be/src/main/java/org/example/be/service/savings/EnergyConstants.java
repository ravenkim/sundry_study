package org.example.be.service.savings;

public final class EnergyConstants {

    public static final int FLUORESCENT_WATTS = 40;
    public static final int LED_WATTS = 20;
    public static final int AC_WATTS = 1500;
    public static final int ELECTRICITY_RATE_KRW = 130;
    public static final int OFF_TIME_CAP_MINUTES = 120;
    public static final double POINT_RATE = 0.18;
    /** kWh → CO₂ 배출량(kg), 한국 전력 평균 계수 */
    public static final double CO2_KG_PER_KWH = 0.4594;

    private EnergyConstants() {
    }
}
