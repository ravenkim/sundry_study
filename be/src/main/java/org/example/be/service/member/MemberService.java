package org.example.be.service.member;

import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;

public interface MemberService {
    boolean isEmailAvailable(String email);

    boolean isUserNameAvailable(String userName);

    boolean registerMember(MemberRequest.Create request);

    MemberResponse.Detail findMemberById(String memberId);
}
