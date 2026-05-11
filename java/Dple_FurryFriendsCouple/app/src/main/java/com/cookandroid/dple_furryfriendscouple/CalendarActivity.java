package com.cookandroid.dple_furryfriendscouple;


import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import com.applandeo.materialcalendarview.CalendarView;
import com.applandeo.materialcalendarview.EventDay;
import com.applandeo.materialcalendarview.listeners.OnDayClickListener;
import com.cookandroid.dple_furryfriendscouple.model.CalendarModel;
import com.cookandroid.dple_furryfriendscouple.model.ScheduleModel;
import com.cookandroid.dple_furryfriendscouple.singleton.CalendarSingle;
import com.cookandroid.dple_furryfriendscouple.singleton.Schedule;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import static java.lang.String.valueOf;

public class CalendarActivity extends AppCompatActivity {
    public static final String RESULT = "result";
    public static final String EVENT = "event";
    private static final int ADD_NOTE = 44;
    private CalendarView mCalendarView;
    //private TextView textView;
    private List<EventDay> mEventDays = new ArrayList<>();
    private List<CalendarSingle> gCalendarSingles;
    private CalendarModel calendarModel = new CalendarModel("캘린더");
    private List<EventDay> gEventDats = new ArrayList <>();
    private List<Schedule> mSchedules = new ArrayList <>();
    private ScheduleModel scheduleModel = new ScheduleModel();

    private ProgressDialog progressDialog;
    private DatabaseReference databaseReference;



    public String getPostType() {
        return "캘린더";
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_calender);
        mCalendarView = (CalendarView) findViewById(R.id.calendarView);

        Calendar calendar1 = Calendar.getInstance();
        calendar1.set(2018,6-1,12);
        List<EventDay> eventDay = new ArrayList <>();
        eventDay.add(new EventDay(calendar1,R.drawable.ic_message_black_48dp));
        mCalendarView.setDate(calendar1);
        mCalendarView.setEvents(eventDay);

        this.mSchedules = scheduleModel.getSchedules();

        this.gCalendarSingles = calendarModel.getmCalendars();
        Log.i("가져xxf옴",valueOf(gCalendarSingles.size()));
        for(int i = 0; i< gCalendarSingles.size(); i++) {

            Calendar calendar = Calendar.getInstance();
            calendar.set(gCalendarSingles.get(i).getYear(), gCalendarSingles.get(i).getMonth(), gCalendarSingles.get(i).getDay());
            gEventDats.add(new EventDay(calendar,R.drawable.ic_message_black_48dp));
            mCalendarView.setDate(gEventDats.get(i).getCalendar());
            mCalendarView.setEvents(gEventDats);
        }
        mCalendarView.setOnDayClickListener(new OnDayClickListener() {
            @Override
            public void onDayClick(EventDay eventDay) {
                previewNote(eventDay);
                // setTextPreview(eventDay);
            }
        });
       // textView = findViewById(R.id.preview_note);
        FloatingActionButton floatingActionButton = (FloatingActionButton) findViewById(R.id.floatingActionButton);
        floatingActionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                addNote();
            }
        });

        ValueEventListener calendarlistener = new ValueEventListener() {
            @Override
            public void onDataChange(DataSnapshot dataSnapshot) {
                // Get CalendarSingle object and use the values to update the UI
//                CalendarSingle calendarSingle = dataSnapshot.getValue(CalendarSingle.class);
//                MyEventDay myEventDay;
//                Intent returnIntent = new Intent();
//                Calendar calendar = Calendar.getInstance();
//                calendar.set(calendarSingle.getYear(),calendarSingle.getMonth(),calendarSingle.getDay());
//                myEventDay = new MyEventDay(calendar, R.drawable.ic_message_black_48dp, calendarSingle.getNote());
//                returnIntent.putExtra(CalendarActivity.RESULT, myEventDay);
//                setResult(Activity.RESULT_OK, returnIntent);
            }

            @Override
            public void onCancelled(DatabaseError databaseError) {
                // Getting Post failed, log a message
                Log.w("cancelled", "loadPost:onCancelled", databaseError.toException());
                // ...
            }
        };
       // databaseReference.addValueEventListener(calendarlistener);


    }


    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == ADD_NOTE && resultCode == RESULT_OK) {
            MyEventDay myEventDay = data.getParcelableExtra(RESULT);
            mCalendarView.setDate(myEventDay.getCalendar());
            mEventDays.add(myEventDay);
            mCalendarView.setEvents(mEventDays);
        }
    }
    private void addNote() {
        Intent intent = new Intent(this, AddNoteActivity.class);
        startActivityForResult(intent, ADD_NOTE);
    }

    private void previewNote(EventDay eventDay) {
        Intent intent = new Intent(this, NotePreviewActivity.class);
        if(eventDay instanceof MyEventDay){
            intent.putExtra(EVENT, (MyEventDay) eventDay);
        }
        startActivity(intent);
    }
//    private void setTextPreview(EventDay eventDay) {
//        textView.setText();
//        //이후에 캘린더 텍스트뷰에 미리보기 추가
//    }

    private void showProgressDialog() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setCancelable(false);
        progressDialog.setMessage("Loading..");
        progressDialog.show();
    }

}
