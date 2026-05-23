package org.example.be.service.member;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.Building;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.model.UserType;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.BuildingRepository;
import org.example.be.domain.repository.MemberPointRepository;
import org.example.be.domain.repository.MemberRepository;
import org.example.be.exception.BusinessLogicException;
import org.example.be.exception.ErrorCode;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class DefaultMemberService implements MemberService {

    private final MemberRepository memberRepository;
    private final MemberPointRepository memberPointRepository;
    private final PasswordEncoder passwordEncoder;
    private final BuildingRepository buildingRepository;
    private final AffiliationRepository affiliationRepository;

    @Override
    public boolean isEmailAvailable(String email) {
        String normalized = normalizeEmail(email);
        if (normalized.isBlank()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "이메일을 입력해 주세요.");
        }
        return memberRepository.findByEmailIgnoreCase(normalized).isEmpty();
    }

    @Override
    public boolean isUserNameAvailable(String userName) {
        String trimmed = userName == null ? "" : userName.trim();
        if (trimmed.isBlank()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "아이디를 입력해 주세요.");
        }
        return memberRepository.findByUserName(trimmed).isEmpty();
    }

    @Transactional
    @Override
    public boolean registerMember(MemberRequest.Create request) {
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new BusinessLogicException(ErrorCode.INVALID, "비밀번호는 8자 이상이어야 합니다.");
        }

        String userName = request.getUserName().trim();
        String normalizedEmail = normalizeEmail(request.getEmail());

        if (memberRepository.findByUserName(userName).isPresent()) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "이미 사용 중인 아이디입니다.");
        }

        if (memberRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "이미 사용 중인 이메일입니다.");
        }

        if (request.getBuildingId() != null) {
            return saveNewMember(userName, request.getPassword(), normalizedEmail, resolveAffiliationFromBuilding(request.getBuildingId()), request.getBuildingId());
        }

        if (request.getAffiliation() == null) {
            throw new BusinessLogicException(ErrorCode.INVALID, "소속을 선택해 주세요.");
        }

        Affiliation affiliation = affiliationRepository.findById(request.getAffiliation())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 소속입니다."));

        return saveNewMember(userName, request.getPassword(), normalizedEmail, affiliation, null);
    }

    @Transactional
    @Override
    public MemberResponse.Detail assignAffiliation(Long memberSeq, Long affiliationId, Long buildingId) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        Affiliation affiliation = affiliationRepository.findById(affiliationId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 소속입니다."));

        member.setAffiliation(affiliation);

        if (buildingId != null) {
            Building building = buildingRepository.findById(buildingId)
                    .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 건물입니다."));

            if (building.getAffiliation() == null
                    || !building.getAffiliation().getSeq().equals(affiliation.getSeq())) {
                throw new BusinessLogicException(ErrorCode.INVALID, "선택한 구역이 소속과 일치하지 않습니다.");
            }

            member.setBuilding(building);
        } else {
            member.setBuilding(null);
        }

        return MemberResponse.Detail.of(member);
    }

    @Transactional
    @Override
    public MemberResponse.Detail assignBuilding(Long memberSeq, Long buildingId) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        Affiliation affiliation = resolveAffiliationFromBuilding(buildingId);

        member.setBuilding(buildingRepository.findById(buildingId).orElseThrow());
        member.setAffiliation(affiliation);

        return MemberResponse.Detail.of(member);
    }

    @Override
    public MemberResponse.Detail findMemberById(String userName) {
        memberRepository.findByUserName(userName)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "Member not found"));

        return null;
    }

    private boolean saveNewMember(
            String userName,
            String password,
            String normalizedEmail,
            Affiliation affiliation,
            Long buildingId
    ) {
        Member member = new Member(
                userName,
                passwordEncoder.encode(password),
                normalizedEmail,
                affiliation
        );
        member.setUserType(UserType.USER);

        if (buildingId != null) {
            member.setBuilding(buildingRepository.findById(buildingId).orElseThrow());
        }

        memberRepository.save(member);
        memberPointRepository.save(new MemberPoint(member));
        return true;
    }

    private Affiliation resolveAffiliationFromBuilding(Long buildingId) {
        Building building = buildingRepository.findById(buildingId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 건물입니다."));

        Affiliation affiliation = building.getAffiliation();
        if (affiliation == null) {
            throw new BusinessLogicException(ErrorCode.INVALID, "건물에 연결된 소속 정보가 없습니다.");
        }

        return affiliation;
    }

    private static String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }
}
