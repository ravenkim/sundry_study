package org.example.be.api.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

public class MemberRequest {
    @Getter
    @Setter
    @ToString
    @RequiredArgsConstructor
    public static class Create {
        @NotEmpty(message="Enter the userName.")
        private String userName;
        @NotEmpty(message="Enter the password.")
        private String password;
        @NotEmpty(message="Enter the email.")
        private String email;
        @NotEmpty(message="Enter the phoneNumber.")
        private String phoneNumber;
        @NotEmpty(message="Enter the nickname.")
        private String nickname;
        private Long affiliation;
        private Long buildingId;
    }

    @Getter
    @Setter
    @ToString
    @RequiredArgsConstructor
    public static class Update {
        @NotEmpty(message="No Seq received")
        private Long memberSeq;
        private String password;
        private String email;
    }

    @Getter
    @Setter
    @ToString
    @RequiredArgsConstructor
    public static class Delete {
        @NotEmpty(message="No Seq received")
        private Long memberSeq;
    }

    @Getter
    @Setter
    @ToString
    @RequiredArgsConstructor
    public static class Login {
        @NotEmpty(message="Enter the userName.")
        private String userName;
        @NotEmpty(message="Enter the password.")
        private String password;
    }

}
