package com.veer.user.service;

import com.veer.user.model.ResponseUserDto;
import com.veer.user.model.CreateUserDto;

public interface UserService {

    public abstract ResponseUserDto createUser(CreateUserDto createUserDto);

    public abstract ResponseUserDto getUserById(String userId);

}
