package org.example.be.domain.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
@Table(
        name = "location_operating_schedule_db",
        uniqueConstraints = @UniqueConstraint(
                name = "UK_location_schedule_day",
                columnNames = {"location_node_seq", "day_of_week"}
        )
)
@Getter
@Setter
@NoArgsConstructor
public class LocationOperatingSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_node_seq", nullable = false)
    private LocationNode locationNode;

    @Column(name = "day_of_week", nullable = false)
    private int dayOfWeek;

    @Column(name = "is_closed", nullable = false)
    private boolean closed;

    @Column(name = "power_on_time")
    private LocalTime powerOnTime;

    @Column(name = "power_off_time")
    private LocalTime powerOffTime;

    @Builder
    public LocationOperatingSchedule(
            LocationNode locationNode,
            int dayOfWeek,
            boolean closed,
            LocalTime powerOnTime,
            LocalTime powerOffTime
    ) {
        this.locationNode = locationNode;
        this.dayOfWeek = dayOfWeek;
        this.closed = closed;
        this.powerOnTime = powerOnTime;
        this.powerOffTime = powerOffTime;
    }

    public DayOfWeek toDayOfWeek() {
        return DayOfWeek.of(dayOfWeek);
    }
}
