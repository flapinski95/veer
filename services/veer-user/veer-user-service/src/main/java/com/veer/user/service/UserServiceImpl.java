package com.veer.user.service;

import com.veer.user.model.ResponseUserDto;
import com.veer.user.model.CreateUserDto;
import com.veer.user.repository.UserRepository;

public class UserServiceImpl implements UserService {

    UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public ResponseUserDto createUser(CreateUserDto createUserDto) {
        return null;
    }

    @Override
    public ResponseUserDto getUserById(String userId) {
        return null;
    }

}
