package org.example.be.service.member;

import lombok.RequiredArgsConstructor;
import org.example.be.api.request.MemberProfileRequest;
import org.example.be.api.request.MemberRequest;
import org.example.be.api.response.MemberResponse;
import org.example.be.domain.model.Affiliation;
import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.MemberPoint;
import org.example.be.domain.model.NodeKind;
import org.example.be.domain.model.UserType;
import org.example.be.domain.repository.AffiliationRepository;
import org.example.be.domain.repository.LocationNodeRepository;
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
    private final LocationNodeRepository locationNodeRepository;
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

    @Override
    public boolean isPhoneAvailable(String phoneNumber) {
        String normalized = normalizePhone(phoneNumber);
        if (normalized.isBlank()) {
            throw new BusinessLogicException(ErrorCode.INVALID, "전화번호를 입력해 주세요.");
        }
        validatePhoneFormat(normalized);
        return memberRepository.findByPhoneNumber(normalized).isEmpty();
    }

    @Transactional
    @Override
    public boolean registerMember(MemberRequest.Create request) {
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new BusinessLogicException(ErrorCode.INVALID, "비밀번호는 8자 이상이어야 합니다.");
        }

        String userName = request.getUserName().trim();
        String normalizedEmail = normalizeEmail(request.getEmail());
        String normalizedPhone = normalizePhone(request.getPhoneNumber());
        validatePhoneFormat(normalizedPhone);

        if (memberRepository.findByUserName(userName).isPresent()) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "이미 사용 중인 아이디입니다.");
        }

        if (memberRepository.findByEmailIgnoreCase(normalizedEmail).isPresent()) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "이미 사용 중인 이메일입니다.");
        }

        if (memberRepository.findByPhoneNumber(normalizedPhone).isPresent()) {
            throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "이미 사용 중인 전화번호입니다.");
        }

        if (request.getBuildingId() != null) {
            return saveNewMember(
                    userName,
                    request.getPassword(),
                    normalizedEmail,
                    normalizedPhone,
                    resolveAffiliationFromLocationNode(request.getBuildingId()),
                    request.getBuildingId()
            );
        }

        if (request.getAffiliation() == null) {
            throw new BusinessLogicException(ErrorCode.INVALID, "소속을 선택해 주세요.");
        }

        Affiliation affiliation = affiliationRepository.findById(request.getAffiliation())
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 소속입니다."));

        return saveNewMember(userName, request.getPassword(), normalizedEmail, normalizedPhone, affiliation, null);
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
            LocationNode locationNode = resolveGroupLocationNode(buildingId);

            if (!locationNode.getAffiliation().getSeq().equals(affiliation.getSeq())) {
                throw new BusinessLogicException(ErrorCode.INVALID, "선택한 장소가 소속과 일치하지 않습니다.");
            }

            member.setLocationNode(locationNode);
        } else {
            member.setLocationNode(null);
        }

        return MemberResponse.Detail.of(member);
    }

    @Transactional
    @Override
    public MemberResponse.Detail assignBuilding(Long memberSeq, Long buildingId) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        LocationNode locationNode = resolveGroupLocationNode(buildingId);
        Affiliation affiliation = locationNode.getAffiliation();

        member.setLocationNode(locationNode);
        member.setAffiliation(affiliation);

        return MemberResponse.Detail.of(member);
    }

    @Override
    public MemberResponse.Detail findMyProfile(Long memberSeq) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));
        return MemberResponse.Detail.of(member);
    }

    @Transactional
    @Override
    public MemberResponse.Detail updateProfile(Long memberSeq, MemberProfileRequest.Update request) {
        Member member = memberRepository.findById(memberSeq)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "회원을 찾을 수 없습니다."));

        boolean hasEmail = request.getEmail() != null && !request.getEmail().isBlank();
        boolean hasPhone = request.getPhoneNumber() != null && !request.getPhoneNumber().isBlank();
        boolean hasPassword = request.getPassword() != null && !request.getPassword().isBlank();

        if (!hasEmail && !hasPhone && !hasPassword) {
            throw new BusinessLogicException(ErrorCode.INVALID, "변경할 정보를 입력해 주세요.");
        }

        if (hasEmail) {
            String normalizedEmail = normalizeEmail(request.getEmail());
            memberRepository.findByEmailIgnoreCase(normalizedEmail)
                    .filter(existing -> !existing.getSeq().equals(memberSeq))
                    .ifPresent(existing -> {
                        throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "이미 사용 중인 이메일입니다.");
                    });
            member.setEmail(normalizedEmail);
        }

        if (hasPhone) {
            String normalizedPhone = normalizePhone(request.getPhoneNumber());
            validatePhoneFormat(normalizedPhone);
            memberRepository.findByPhoneNumber(normalizedPhone)
                    .filter(existing -> !existing.getSeq().equals(memberSeq))
                    .ifPresent(existing -> {
                        throw new BusinessLogicException(ErrorCode.ALREADY_EXISTS, "이미 사용 중인 전화번호입니다.");
                    });
            member.setPhoneNumber(normalizedPhone);
        }

        if (hasPassword) {
            if (request.getPassword().length() < 8) {
                throw new BusinessLogicException(ErrorCode.INVALID, "비밀번호는 8자 이상이어야 합니다.");
            }
            if (member.getProvider() == null || member.getProvider().isBlank()) {
                if (request.getCurrentPassword() == null || request.getCurrentPassword().isBlank()) {
                    throw new BusinessLogicException(ErrorCode.INVALID, "현재 비밀번호를 입력해 주세요.");
                }
                if (!passwordEncoder.matches(request.getCurrentPassword(), member.getPassword())) {
                    throw new BusinessLogicException(ErrorCode.INVALID, "현재 비밀번호가 일치하지 않습니다.");
                }
            }
            member.setPassword(passwordEncoder.encode(request.getPassword()));
        }

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
            String normalizedPhone,
            Affiliation affiliation,
            Long locationNodeId
    ) {
        Member member = new Member(
                userName,
                passwordEncoder.encode(password),
                normalizedEmail,
                affiliation
        );
        member.setPhoneNumber(normalizedPhone);
        member.setUserType(UserType.USER);

        if (locationNodeId != null) {
            member.setLocationNode(resolveGroupLocationNode(locationNodeId));
        }

        memberRepository.save(member);
        memberPointRepository.save(new MemberPoint(member));
        return true;
    }

    private Affiliation resolveAffiliationFromLocationNode(Long locationNodeId) {
        LocationNode locationNode = resolveGroupLocationNode(locationNodeId);
        return locationNode.getAffiliation();
    }

    private LocationNode resolveGroupLocationNode(Long locationNodeId) {
        LocationNode locationNode = locationNodeRepository.findById(locationNodeId)
                .orElseThrow(() -> new BusinessLogicException(ErrorCode.NOT_FOUND, "존재하지 않는 장소입니다."));

        if (locationNode.getNodeKind() != NodeKind.GROUP) {
            throw new BusinessLogicException(ErrorCode.INVALID, "그룹 장소만 소속으로 선택할 수 있습니다.");
        }

        return locationNode;
    }

    private static String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase();
    }

    private static String normalizePhone(String phoneNumber) {
        if (phoneNumber == null) {
            return "";
        }
        return phoneNumber.replaceAll("[^0-9]", "");
    }

    private static void validatePhoneFormat(String normalizedPhone) {
        if (!normalizedPhone.matches("^01[016789]\\d{7,8}$")) {
            throw new BusinessLogicException(ErrorCode.INVALID, "올바른 휴대전화 번호를 입력해 주세요.");
        }
    }
}

