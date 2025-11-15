package com.veer.user;

import com.veer.user.model.User;
import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;

public class UserMapper {

    public static User toEntity(CreateUserDto createUserDto) {
        return User.builder()
            .id(createUserDto.getId())
            .email(createUserDto.getEmail())
            .username(createUserDto.getUsername())
            .country(createUserDto.getCountry())
            .build();
    }

    public static ResponseUserDto toResponseUserDto(User user) {
        return ResponseUserDto.builder()
            .id(user.getId())
            .email(user.getEmail())
            .username(user.getUsername())
            .bio(user.getBio())
            .country(user.getCountry())
            .followingCount(user.getFollowing() != null ? user.getFollowing().size() : 0)
            .followerCount(user.getFollowers() != null ? user.getFollowers().size() : 0)
            .profilePicture(user.getProfilePicture())
            .joinedAt(user.getCreatedAt())
            .build();
    }

    public static ResponseUserDto toResponsePublicUserDto(User user) {
                return ResponseUserDto.builder()
            .id(user.getId())
            .username(user.getUsername())
            .bio(user.getBio())
            .country(user.getCountry())
            .followingCount(user.getFollowing() != null ? user.getFollowing().size() : 0)
            .followerCount(user.getFollowers() != null ? user.getFollowers().size() : 0)
            .profilePicture(user.getProfilePicture())
            .joinedAt(user.getCreatedAt())
            .build();
    }

}