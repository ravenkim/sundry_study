package org.example.be.service;

import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;

public interface MemberService {
    public boolean registerMember(MemberRequest.Create request);
    public MemberResponse.Detail findMemberById(String memberId);
}
