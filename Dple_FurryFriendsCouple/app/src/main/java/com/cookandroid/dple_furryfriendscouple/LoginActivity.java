package com.cookandroid.dple_furryfriendscouple;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.toolbox.Volley;

import org.json.JSONObject;

public class LoginActivity extends AppCompatActivity {

    private AlertDialog dialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);


        TextView registerButton = (TextView) findViewById(R.id.registerButton);
        registerButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent registerIntent = new Intent(LoginActivity.this, RegisterActivity.class);
                LoginActivity.this.startActivity(registerIntent);
            }
        });


        final EditText idText = (EditText) findViewById(R.id.idText);
        final EditText passwordText = (EditText) findViewById(R.id.passwordText);
        final Button loginButton = (Button) findViewById(R.id.loginButton);


        loginButton.setOnClickListener(new View.OnClickListener() {

            @Override

            public void onClick(View view) {

                String userID = idText.getText().toString();

                String userPassword = passwordText.getText().toString();


                Response.Listener<String> responseLister = new Response.Listener<String>() {

                    @Override

                    public void onResponse(String response) {

                        try {

                            JSONObject jsonResponse = new JSONObject(response);

                            boolean success = jsonResponse.getBoolean("success");

                            if (success) {

                                AlertDialog.Builder builder = new AlertDialog.Builder(LoginActivity.this);

                                dialog = builder.setMessage("로그인에 성공했습니다")

                                        .setPositiveButton("확인", null)

                                        .create();

                                dialog.show();

                                Intent intent = new Intent(LoginActivity.this, MainActivity.class);

                                LoginActivity.this.startActivity(intent);

                                finish();

                            } else {

                                AlertDialog.Builder builder = new AlertDialog.Builder(LoginActivity.this);

                                dialog = builder.setMessage("계정을 다시 확인하세요")

                                        .setNegativeButton("다시시도", null)

                                        .create();

                                dialog.show();

                            }

                        } catch (Exception e) {

                            e.printStackTrace();

                        }

                    }

                };


                LoginRequest loginRequest = new LoginRequest(userID, userPassword, responseLister);

                RequestQueue queue = Volley.newRequestQueue(LoginActivity.this);

                queue.add(loginRequest);


            }

        });
    }

        @Override
        protected void onStop() {

            super.onStop();

            if (dialog != null) {     //다이얼로그가 켜져있을때 함부로 종료가 되지 않게함

                dialog.dismiss();

                dialog = null;
            }


        }

}
