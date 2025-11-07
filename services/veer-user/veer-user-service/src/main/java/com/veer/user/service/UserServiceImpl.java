package com.veer.user.service;

import com.veer.user.model.ResponseUserDto;
import com.veer.user.model.CreateUserDto;
import com.veer.user.repository.UserRepository;
import com.veer.user.model.exception.UserNotFoundException;
import com.veer.user.UserMapper;
import com.veer.user.model.User;

public class UserServiceImpl implements UserService {

    UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public ResponseUserDto createUser(CreateUserDto createUserDto) {
        User user = UserMapper.toEntity(createUserDto);
        User savedUser = repository.save(user);
        return UserMapper.toResponseUserDto(savedUser);
    }

    @Override
    public ResponseUserDto getUserById(String userId) {
        User user = repository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + userId + " not found"
            ));
        return UserMapper.toResponseUserDto(user);
    }

}
