package org.example.be.service;

import org.example.be.api.request.MemberRequest;

public interface AuthService {
    public boolean login(MemberRequest.Login request);
}