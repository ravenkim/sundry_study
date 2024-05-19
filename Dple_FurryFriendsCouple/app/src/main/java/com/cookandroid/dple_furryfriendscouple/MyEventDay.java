package com.cookandroid.dple_furryfriendscouple;

import android.os.Parcel;
import android.os.Parcelable;

import com.applandeo.materialcalendarview.EventDay;

import java.util.Calendar;

public class MyEventDay extends EventDay implements Parcelable {
    private int year;
    private int mon;
    private int day;
    private String mNote;

    
    public MyEventDay(Calendar dayc, int imageResource, String note) {
        super(dayc, imageResource);
        year = dayc.get(Calendar.YEAR);
        mon = dayc.get(Calendar.MONTH)+1;
        day = dayc.get(Calendar.DAY_OF_MONTH);
        mNote = note;
//        Log.i("년",String.valueOf(year));
//        Log.i("달",String.valueOf(mon));
//        Log.i("일",String.valueOf(day));
    }

    String getNote() {
        return mNote;
    }
    public int getYear() {
        return this.year;
    }

    public int getMonth() {
        return this.mon;
    }

    public int getDay() {
        return this.day;
    }

    private MyEventDay(Parcel in) {
        super((Calendar) in.readSerializable(), in.readInt());
        mNote = in.readString();
    }
    public static final Creator<MyEventDay> CREATOR = new Creator<MyEventDay>() {
        @Override
        public MyEventDay createFromParcel(Parcel in) {
            return new MyEventDay(in);
        }
        @Override
        public MyEventDay[] newArray(int size) {
            return new MyEventDay[size];
        }
    };
    @Override
    public void writeToParcel(Parcel parcel, int i) {
        parcel.writeSerializable(getCalendar());
        parcel.writeInt(getImageResource());
        parcel.writeString(mNote);
    }
    @Override
    public int describeContents() {
        return 0;
    }
}
