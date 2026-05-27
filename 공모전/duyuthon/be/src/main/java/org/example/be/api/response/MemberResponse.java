package org.example.be.api.response;

import org.example.be.domain.model.LocationNode;
import org.example.be.domain.model.Member;
import org.example.be.domain.model.UserType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

public class MemberResponse {
    @Getter
    @Setter
    @Builder
    public static class Detail {
        private Long memberSeq;
        private String userName;
        private String nickname;
        private String email;
        private String phoneNumber;
        private Long affiliationId;
        private String affiliationName;
        private Long buildingId;
        private String buildingName;
        private String userType;
        private String provider;

        public static Detail of(Member member) {
            LocationNode locationNode = member.getLocationNode();
            var affiliation = member.getAffiliation();
            return Detail.builder()
                    .memberSeq(member.getSeq())
                    .userName(member.getUserName())
                    .nickname(member.getNickname())
                    .email(member.getEmail())
                    .phoneNumber(member.getPhoneNumber())
                    .affiliationId(affiliation != null ? affiliation.getSeq() : null)
                    .affiliationName(affiliation != null ? affiliation.getName() : null)
                    .buildingId(locationNode != null ? locationNode.getSeq() : null)
                    .buildingName(locationNode != null ? locationNode.getName() : null)
                    .userType(member.getUserType() != null ? member.getUserType().name() : UserType.USER.name())
                    .provider(member.getProvider())
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    public static class UserNameCheck {
        private String userName;
        private boolean available;

        public static UserNameCheck of(String userName, boolean available) {
            return UserNameCheck.builder()
                    .userName(userName)
                    .available(available)
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    public static class EmailCheck {
        private String email;
        private boolean available;

        public static EmailCheck of(String email, boolean available) {
            return EmailCheck.builder()
                    .email(email)
                    .available(available)
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    public static class PhoneCheck {
        private String phoneNumber;
        private boolean available;

        public static PhoneCheck of(String phoneNumber, boolean available) {
            return PhoneCheck.builder()
                    .phoneNumber(phoneNumber)
                    .available(available)
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    public static class NicknameCheck {
        private String nickname;
        private boolean available;

        public static NicknameCheck of(String nickname, boolean available) {
            return NicknameCheck.builder()
                    .nickname(nickname)
                    .available(available)
                    .build();
        }
    }

    @Getter
    @Setter
    @Builder
    public static class Login {
        private String accessToken;
        private String userName;
        private String email;
        private Long buildingId;
        private String buildingName;
        private String userType;

        public static Login of(Member member, String accessToken) {
            LocationNode locationNode = member.getLocationNode();
            return Login.builder()
                    .accessToken(accessToken)
                    .userName(member.getUserName())
                    .email(member.getEmail())
                    .buildingId(locationNode != null ? locationNode.getSeq() : null)
                    .buildingName(locationNode != null ? locationNode.getName() : null)
                    .userType(member.getUserType() != null ? member.getUserType().name() : UserType.USER.name())
                    .build();
        }
    }
}
