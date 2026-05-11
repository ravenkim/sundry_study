package com.cookandroid.dple_furryfriendscouple;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class MainActivity extends AppCompatActivity {

    private FragmentManager fm;
    private FragmentTransaction ft;
    private BottomNavigationView bottomNavigationView;
    private frag_calendar fragment_calendar;
    private frag_bucket fragment_bucket;
    private frag_home fragment_home;
    private frag_diary fragment_diary;
    private frag_setting fragment_setting;
    private static MainActivity2 mainActivity2= new MainActivity2();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        bottomNavigationView = findViewById(R.id.bottom_nav);
        bottomNavigationView.setOnNavigationItemSelectedListener(
                new BottomNavigationView.OnNavigationItemSelectedListener() {

            @Override
            public boolean onNavigationItemSelected(@NonNull MenuItem menuItem) {
                switch (menuItem.getItemId()){
                    case R.id.menu_home:
                        setFrag(0);
                        break;
                    case R.id.menu_bucket:
                        setFrag(1);
                        break;
                    case R.id.menu_calender:
                        setFrag(2);
                        break;
                    case R.id.menu_diary:
                        setFrag(3);
                        break;
                    case R.id.menu_setting:
                        setFrag(4);
                        break;

                }
                return true;
            }
        });
        fragment_calendar = new frag_calendar();
        fragment_bucket = new frag_bucket();
        fragment_home = new frag_home();
        fragment_diary = new frag_diary();
        fragment_setting = new frag_setting();
        setFrag(0); //첫 frag 화면 home
    }

    //프레그먼트 교체 실행문
    private void setFrag(int n) {
        fm = getSupportFragmentManager();
        ft = fm.beginTransaction();
        switch (n){
            case 0:
                ft.replace(R.id.fragments_frame, fragment_home);
                ft.commit();
                break;
            case 1:
                ft.replace(R.id.fragments_frame, fragment_bucket);
                ft.commit();
                break;
            case 2:
                ft.replace(R.id.fragments_frame, fragment_calendar);
                ft.commit();
                break;
            case 3:
                Intent mainActivity2Intent = new Intent(MainActivity.this, MainActivity2.class);
                startActivity(mainActivity2Intent);
                break;
            case 4:
                ft.replace(R.id.fragments_frame, fragment_setting);
                ft.commit();
                break;

        }
    }
}