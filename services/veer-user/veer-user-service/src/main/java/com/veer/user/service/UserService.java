package com.veer.user.service;

import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;
import com.veer.user.model.dto.UpdateUserDto;

public interface UserService {

    public abstract ResponseUserDto createUser(CreateUserDto createUserDto);

    public abstract ResponseUserDto getUserById(String userId);

    public abstract void deleteUserById(String userId);

    public abstract ResponseUserDto updateUser(UpdateUserDto updateUserDto);

    public abstract ResponseUserDto createFollowRelationship(String followingUserId, String followedUserId);

    public abstract void deleteFollowRelationship(String followingUserId, String followedUserId);

}
