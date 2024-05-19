package com.cookandroid.dple_furryfriendscouple;


import com.android.volley.AuthFailureError;
import com.android.volley.Response;
import com.android.volley.toolbox.StringRequest;

import java.util.HashMap;
import java.util.Map;

public class RegisterRequest extends StringRequest {

    final static private String URL = "http://zerobar97.dothome.co.kr/UserRegister.php";
    private Map<String, String> parameters;

    public RegisterRequest (String userID, String userPassword, String userGender, String userEmail, String userName, String userBirth, String userBloodType, Response.Listener<String> listener) {
        super(Method.POST, URL, listener, null);
        parameters = new HashMap<>();
        parameters.put("userID", userID);
        parameters.put("userPassword", userPassword);
        parameters.put("userGender", userGender);
        parameters.put("userEmail", userEmail);
        parameters.put("userName", userName);
        parameters.put("userBirth", userBirth);
        parameters.put("userBloodType", userBloodType);
    }

    @Override
    protected Map<String, String> getParams() throws AuthFailureError {
        return parameters;
    }
}



