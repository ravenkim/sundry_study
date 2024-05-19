package com.cookandroid.dple_furryfriendscouple;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.applandeo.materialcalendarview.CalendarView;
import com.cookandroid.dple_furryfriendscouple.model.CalendarModel;

public class AddNoteActivity extends AppCompatActivity {

    private CalendarModel calendarModel;
    private MyEventDay myEventDay;
    private EditText noteEditText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_note_write);

        final CalendarView datePicker = (CalendarView) findViewById(R.id.datePicker);
        Button addbutton = (Button) findViewById(R.id.addNoteButton);
        noteEditText = (EditText) findViewById(R.id.noteEditText);
        calendarModel = new CalendarModel("캘린더");
        addbutton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent returnIntent = new Intent();
                if(noteEditText.getText().toString()=="") {
                    finish();
                }
                 myEventDay = new MyEventDay(datePicker.getSelectedDate(),
                        R.drawable.ic_message_black_48dp, noteEditText.getText().toString());
                returnIntent.putExtra(CalendarActivity.RESULT, myEventDay);
                setResult(Activity.RESULT_OK, returnIntent);
                sendCalendar();

                finish();
            }
        });
    }
    public int getYear() {
        return this.myEventDay.getYear();
    }

    public int getMonth() {
        return this.myEventDay.getMonth();
    }

    public int getDay() {
        return this.myEventDay.getDay();
    }
    public void sendCalendar() {
        calendarModel.writeCalendar("캘린더",getYear(),getMonth(),getDay(),noteEditText.getText().toString());
        Toast.makeText(this, "작성이 완료되었습니다.", Toast.LENGTH_SHORT).show();
    }
}