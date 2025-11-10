package com.veer.user.service;

import com.veer.user.repository.UserRepository;
import com.veer.user.model.exception.UserAlreadyExistsException;
import com.veer.user.model.exception.UserNotFoundException;
import com.veer.user.model.exception.FollowingAlreadyExistsException;
import com.veer.user.model.exception.FollowingNotFoundException;
import com.veer.user.UserMapper;
import com.veer.user.model.User;
import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;
import com.veer.user.model.dto.UpdateUserDto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    UserRepository repository;

    public UserServiceImpl(UserRepository repository) {
        this.repository = repository;
    }

    @Transactional
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

    @Transactional(readOnly = true)
    @Override
    public ResponseUserDto getUserById(String userId) {
        User user = repository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + userId + " not found"
            ));
        return UserMapper.toResponseUserDto(user);
    }

    @Transactional
    @Override
    public void deleteUserById(String userId) {
        User user = repository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + userId + " not found"
            ));
        repository.delete(user);
    }

    @Transactional
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

    @Transactional
    @Override
    public ResponseUserDto createFollowRelationship(String followingUserId, String followedUserId) {
        if (followingUserId.equals(followedUserId)) {
            throw new IllegalArgumentException(
                "Following and followed users cannot be the same"
            );
        }

        User followingUser = repository.findById(followingUserId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + followingUserId + " not found"
            ));
        User followedUser = repository.findById(followedUserId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + followedUserId + " not found"
            ));

        /*
         * Only need to modify the "owning" side of the relationship. 
         * The following set is the owning side because it defines 
         * the @JoinTable. When a user is added to this set, JPA inserts 
         * a new row into the followers join table.
         * Look: User.java
         */
        boolean alreadyFollowing = !followingUser.getFollowing().add(followedUser);

        if (alreadyFollowing) {
            throw new FollowingAlreadyExistsException(
                "User " + followingUserId + " already follows user " + followedUserId
            );
        }

        return UserMapper.toResponseUserDto(followedUser);
    }

    @Transactional
    @Override
    public void deleteFollowRelationship(String followingUserId, String followedUserId) {
        if (followingUserId.equals(followedUserId)) {
            throw new IllegalArgumentException(
                "Following and followed users cannot be the same"
            );
        }

        User followingUser = repository.findById(followingUserId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + followingUserId + " not found"
            ));
        User followedUser = repository.findById(followedUserId)
            .orElseThrow(() -> new UserNotFoundException(
                "User " + followedUserId + " not found"
            ));

        boolean notFollowing = !followingUser.getFollowing().remove(followedUser);

        if (notFollowing) {
            throw new FollowingNotFoundException(
                "User " + followingUserId + " does not follow user " + followedUserId
            );
        }
    }
}