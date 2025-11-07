package com.veer.user.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseUserDto {

    private String id;

    private String email;

    private String username;

    private String bio;

    private String country;

    private int followingCount;

    private int followerCount;

    private String profilePicture;

    private Instant joinedAt;

}
