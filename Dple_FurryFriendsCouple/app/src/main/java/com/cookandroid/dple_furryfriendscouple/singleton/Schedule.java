package com.cookandroid.dple_furryfriendscouple.singleton;

public class Schedule {
    private String className;
    private String classRoom;
    private String classDay;
    private String classTime;

    public Schedule() {

    }

    public Schedule(String className, String classRoom, String classDay, String classTime) {
        this.className = className;
        this.classRoom = classRoom;
        this.classDay = classDay;
        this.classTime = classTime;
    }


    public String getClassName() {
        return className;
    }

    public String getClassRoom() {
        return classRoom;
    }

    public String getClassDay() {
        return classDay;
    }

    public String getClassTime() {
        return classTime;
    }


    public static Schedule newSchedule(String className, String classRoom, String classDay, String classTime) {
        return new Schedule(className, classRoom, classDay, classTime);
    }


}
