package org.example.be.service.auth;

import org.example.be.api.request.MemberRequest;
import org.example.be.domain.model.Member;

public interface AuthService {
    Member authenticate(MemberRequest.Login request);
}