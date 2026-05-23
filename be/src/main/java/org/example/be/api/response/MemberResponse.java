package org.example.be.api.response;

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
        private String email;

        public static Detail of(Member member) {
            return Detail.builder()
                    .memberSeq(member.getSeq())
                    .userName(member.getUserName())
                    .email(member.getEmail())
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
    public static class Login {
        private String accessToken;
        private String userName;
        private String email;
        private Long buildingId;
        private String buildingName;
        private String userType;

        public static Login of(Member member, String accessToken) {
            return Login.builder()
                    .accessToken(accessToken)
                    .userName(member.getUserName())
                    .email(member.getEmail())
                    .buildingId(member.getBuilding() != null ? member.getBuilding().getSeq() : null)
                    .buildingName(member.getBuilding() != null ? member.getBuilding().getName() : null)
                    .userType(member.getUserType() != null ? member.getUserType().name() : UserType.USER.name())
                    .build();
        }
    }
}
