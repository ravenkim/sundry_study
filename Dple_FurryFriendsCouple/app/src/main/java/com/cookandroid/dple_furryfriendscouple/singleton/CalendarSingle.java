package com.cookandroid.dple_furryfriendscouple.singleton;


public class CalendarSingle {

    private String note;
    private int year;
    private int month;
    private int day;
    private String type;

    public CalendarSingle() {

    }

    public String getNote() {
        return note;
    }

    public int getYear() {
        return this.year;
    }

    public int getMonth() {
        return this.month;
    }

    public int getDay() {
        return this.day;
    }

    public CalendarSingle( String note, int y, int m, int d, String type) {
        this.note = note;
        this.year =y;
        this.month=m;
        this.day=d;
        this.type=type;
    }

    public static CalendarSingle newCalendar( String note, int y, int m, int d, String type) {
        return new CalendarSingle(note,y,m,d,type);
    }

}
