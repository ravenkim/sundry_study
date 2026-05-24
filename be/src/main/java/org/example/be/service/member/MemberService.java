package org.example.be.service.member;

import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;

public interface MemberService {
    boolean isEmailAvailable(String email);

    boolean isUserNameAvailable(String userName);

    boolean isPhoneAvailable(String phoneNumber);

    boolean registerMember(MemberRequest.Create request);

    MemberResponse.Detail assignBuilding(Long memberSeq, Long buildingId);

    MemberResponse.Detail assignAffiliation(Long memberSeq, Long affiliationId, Long buildingId);

    MemberResponse.Detail findMemberById(String memberId);
}
