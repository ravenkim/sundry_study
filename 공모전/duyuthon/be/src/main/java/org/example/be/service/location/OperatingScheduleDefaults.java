package org.example.be.service.location;

import org.example.be.api.request.LocationNodeRequest;
import org.example.be.domain.model.LocationOperatingSchedule;
import org.example.be.domain.model.LocationNode;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

public final class OperatingScheduleDefaults {

    private OperatingScheduleDefaults() {
    }

    public static List<LocationNodeRequest.OperatingScheduleItem> defaultScheduleItems() {
        List<LocationNodeRequest.OperatingScheduleItem> items = new ArrayList<>();
        for (int day = 1; day <= 7; day++) {
            LocationNodeRequest.OperatingScheduleItem item = new LocationNodeRequest.OperatingScheduleItem();
            item.setDayOfWeek(day);
            if (day == DayOfWeek.SUNDAY.getValue()) {
                item.setClosed(true);
            } else if (day == DayOfWeek.SATURDAY.getValue()) {
                item.setClosed(false);
                item.setPowerOnTime(LocalTime.of(8, 0));
                item.setPowerOffTime(LocalTime.of(18, 0));
            } else {
                item.setClosed(false);
                item.setPowerOnTime(LocalTime.of(7, 0));
                item.setPowerOffTime(LocalTime.of(22, 0));
            }
            items.add(item);
        }
        return items;
    }

    public static List<LocationOperatingSchedule> toEntities(
            LocationNode locationNode,
            List<LocationNodeRequest.OperatingScheduleItem> items
    ) {
        return items.stream()
                .sorted(Comparator.comparingInt(LocationNodeRequest.OperatingScheduleItem::getDayOfWeek))
                .map(item -> LocationOperatingSchedule.builder()
                        .locationNode(locationNode)
                        .dayOfWeek(item.getDayOfWeek())
                        .closed(Boolean.TRUE.equals(item.getClosed()))
                        .powerOnTime(Boolean.TRUE.equals(item.getClosed()) ? null : item.getPowerOnTime())
                        .powerOffTime(Boolean.TRUE.equals(item.getClosed()) ? null : item.getPowerOffTime())
                        .build())
                .toList();
    }
}
