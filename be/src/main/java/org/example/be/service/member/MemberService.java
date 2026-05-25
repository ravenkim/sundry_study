package org.example.be.service.member;

import org.example.be.api.request.MemberProfileRequest;
import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;

public interface MemberService {
    boolean isEmailAvailable(String email);

    boolean isUserNameAvailable(String userName);

    boolean isPhoneAvailable(String phoneNumber);

    boolean isNicknameAvailable(String nickname);

    String normalizeNicknameForResponse(String nickname);

    boolean registerMember(MemberRequest.Create request);

    MemberResponse.Detail assignBuilding(Long memberSeq, Long buildingId);

    MemberResponse.Detail assignAffiliation(Long memberSeq, Long affiliationId, Long buildingId, String nickname);

    MemberResponse.Detail findMyProfile(Long memberSeq);

    MemberResponse.Detail updateProfile(Long memberSeq, MemberProfileRequest.Update request);

    MemberResponse.Detail findMemberById(String memberId);
}
