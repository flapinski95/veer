package com.veer.user.service;

import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;

public interface UserService {

    public abstract ResponseUserDto createUser(CreateUserDto createUserDto);

    public abstract ResponseUserDto getUserById(String userId);

    public abstract void deleteUserById(String userId);

}
