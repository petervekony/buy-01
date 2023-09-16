package com.gritlab.buy01.userservice.payload.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserInfoResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private String jwtToken;

    public UserInfoResponse(String id, String name, String email, String role, String jwtToken) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.jwtToken = jwtToken;
    }
}
