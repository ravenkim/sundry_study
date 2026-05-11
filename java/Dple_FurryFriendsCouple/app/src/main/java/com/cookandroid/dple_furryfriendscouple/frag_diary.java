package com.cookandroid.dple_furryfriendscouple;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

public class frag_diary extends Fragment {

    private View view;

    @Nullable
    public static frag_diary newInstance(){ return new frag_diary();}

    @Override
    public View onCreateView( LayoutInflater inflater, @Nullable ViewGroup container, Bundle savedInstanceState ) {
        View view = inflater.inflate(R.layout.activity_main2, container, false);

        return view;
    }
}
