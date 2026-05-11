package com.cookandroid.dple_furryfriendscouple.model;

import com.cookandroid.dple_furryfriendscouple.singleton.Schedule;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.List;

public class ScheduleModel {
    private DatabaseReference databaseReference;
    private List<Schedule> mSchedules = new ArrayList<>();

    public void addScheduleModel(Schedule schedule) {
        mSchedules.add(schedule);
    }

    public List<Schedule> getSchedules() {
        return mSchedules;
    }

    public ScheduleModel() {
        databaseReference = FirebaseDatabase.getInstance().getReference();

        databaseReference.child("시간표").addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                for (DataSnapshot ds : dataSnapshot.getChildren()) {
                    String className = ds.getValue(Schedule.class).getClassName();
                    String classRoom = ds.getValue(Schedule.class).getClassRoom();
                    String classDay = ds.getValue(Schedule.class).getClassDay();
                    String classTime = ds.getValue(Schedule.class).getClassTime();

                    Schedule schedule = new Schedule(className, classRoom, classDay, classTime);
                    addScheduleModel(schedule);
                }
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {

            }

        });
    }


    public void writeSchedule(String className, String classRoom, String classDay, String classTime) {
        databaseReference = FirebaseDatabase.getInstance().getReference();
        databaseReference.child("시간표").
                push().setValue(Schedule.newSchedule(className, classRoom, classDay, classTime));
    }
}
