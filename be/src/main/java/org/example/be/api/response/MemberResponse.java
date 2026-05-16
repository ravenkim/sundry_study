package org.example.be.api.response;

import org.example.be.domain.model.Member;
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
    public static class Login {
        //needs when JWT authentication is enabled.
    }
}
