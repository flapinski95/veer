package com.veer.user.service;

import com.veer.user.repository.UserRepository;
import com.veer.user.model.exception.UserAlreadyExistsException;
import com.veer.user.model.exception.UserNotFoundException;
import com.veer.user.UserMapper;
import com.veer.user.model.User;
import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;
import com.veer.user.model.dto.UpdateUserDto;

public class UserServiceImpl implements UserService {

    UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public ResponseUserDto createUser(CreateUserDto createUserDto) {
        if (repository.findById(createUserDto.getId()).isPresent()) {
            throw new UserAlreadyExistsException(
                "User " + createUserDto.getId() + " already exists"
            );
        }
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

    @Override
    public void deleteUserById(String userId) {
        User user = repository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + userId + " not found"
            ));
        repository.delete(user);
    }

    @Override
    public ResponseUserDto updateUser(UpdateUserDto updateUserDto) {
        User user = repository.findById(updateUserDto.getId())
            .orElseThrow(() -> new UserNotFoundException(
                "User " + updateUserDto.getId() + " not found"
            ));

        User updatedUser = updateUserEntity(user, updateUserDto);

        User savedUser = repository.save(updatedUser);
        
        return UserMapper.toResponseUserDto(savedUser);
    }

    private User updateUserEntity(User user, UpdateUserDto updateUserDto) {
        if (updateUserDto.getUsername() != null) 
            user.setUsername(updateUserDto.getUsername());
        if (updateUserDto.getBio() != null) 
            user.setBio(updateUserDto.getBio());
        if (updateUserDto.getCountry() != null) 
            user.setCountry(updateUserDto.getCountry());
        if (updateUserDto.getProfilePicture() != null)
            user.setProfilePicture(updateUserDto.getProfilePicture());

        return user;
    }
}