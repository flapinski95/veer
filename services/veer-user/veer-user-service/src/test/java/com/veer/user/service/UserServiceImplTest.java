package com.veer.user.service;

import com.veer.user.model.User;
import com.veer.user.model.dto.CreateUserDto;
import com.veer.user.model.dto.ResponseUserDto;
import com.veer.user.model.dto.UpdateUserDto;
import com.veer.user.model.exception.FollowingAlreadyExistsException;
import com.veer.user.model.exception.FollowingNotFoundException;
import com.veer.user.model.exception.UserAlreadyExistsException;
import com.veer.user.model.exception.UserNotFoundException;
import com.veer.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("UserServiceImpl Tests")
class UserServiceImplTest {

    @Mock
    private UserRepository userRepository;

    private UserServiceImpl userService;

    @BeforeEach
    void setUp() {
        userService = new UserServiceImpl(userRepository);
    }

    @Nested
    @DisplayName("createUser Tests")
    class CreateUserTests {

        @Test
        @DisplayName("Should create user successfully with all fields")
        void shouldCreateUserSuccessfully() {
            CreateUserDto createUserDto = CreateUserDto.builder()
                .id("user-123")
                .email("test@example.com")
                .username("testuser")
                .country("United States")
                .build();

            User savedUser = User.builder()
                .id("user-123")
                .email("test@example.com")
                .username("testuser")
                .country("United States")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            when(userRepository.save(any(User.class))).thenReturn(savedUser);

            ResponseUserDto result = userService.createUser(createUserDto);

            assertNotNull(result);
            assertEquals("user-123", result.getId());
            assertEquals("test@example.com", result.getEmail());
            assertEquals("testuser", result.getUsername());
            assertEquals(null, result.getBio());
            assertEquals("United States", result.getCountry());
            assertEquals(0, result.getFollowingCount());
            assertEquals(0, result.getFollowerCount());
            assertEquals(null, result.getProfilePicture());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should create user with minimal required fields")
        void shouldCreateUserWithMinimalFields() {
            CreateUserDto createUserDto = CreateUserDto.builder()
                .id("user-456")
                .email("minimal@example.com")
                .username("minuser")
                .country("Canada")
                .build();

            User savedUser = User.builder()
                .id("user-456")
                .email("minimal@example.com")
                .username("minuser")
                .country("Canada")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            when(userRepository.save(any(User.class))).thenReturn(savedUser);

            ResponseUserDto result = userService.createUser(createUserDto);

            assertNotNull(result);
            assertEquals("user-456", result.getId());
            assertEquals("minimal@example.com", result.getEmail());
            assertEquals("minuser", result.getUsername());
            assertEquals("Canada", result.getCountry());
            assertNull(result.getBio());
            assertEquals(0, result.getFollowingCount());
            assertEquals(0, result.getFollowerCount());
            assertNull(result.getProfilePicture());

            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should verify correct User entity is passed to repository when creating")
        void shouldPassCorrectEntityToRepository() {
            CreateUserDto createUserDto = CreateUserDto.builder()
                .id("user-789")
                .email("verify@example.com")
                .username("verifyuser")
                .country("Germany")
                .build();

            User savedUser = User.builder()
                .id("user-789")
                .email("verify@example.com")
                .username("verifyuser")
                .country("Germany")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
            when(userRepository.save(any(User.class))).thenReturn(savedUser);

            userService.createUser(createUserDto);

            verify(userRepository).save(userCaptor.capture());
            User capturedUser = userCaptor.getValue();
            
            assertEquals("verify@example.com", capturedUser.getEmail());
            assertEquals("verifyuser", capturedUser.getUsername());
            assertEquals(null, capturedUser.getBio());
            assertEquals("Germany", capturedUser.getCountry());
            assertEquals(null, capturedUser.getProfilePicture());
            assertEquals(0, capturedUser.getFollowing().size());
            assertEquals(0, capturedUser.getFollowers().size());
        }

        @Test
        @DisplayName("Should throw UserAlreadyExistsException when user already exists")
        void shouldThrowUserAlreadyExistsExceptionWhenUserAlreadyExists() {
            CreateUserDto createUserDto = CreateUserDto.builder()
                .id("user-123")
                .email("test@example.com")
                .username("testuser")
                .build();

            when(userRepository
                .findById(createUserDto.getId()))
                .thenReturn(Optional.of(User.builder().build()));

            UserAlreadyExistsException exception = assertThrows(UserAlreadyExistsException.class, () -> {
                userService.createUser(createUserDto);
            });

            assertTrue(exception.getMessage().contains("User " + createUserDto.getId() + " already exists"));
            verify(userRepository, times(1)).findById(createUserDto.getId());
            verify(userRepository, never()).save(any(User.class));
        }

    }

    @Nested
    @DisplayName("getUserById Tests")
    class GetUserByIdTests {

        @Test
        @DisplayName("Should get user by ID successfully")
        void shouldGetUserByIdSuccessfully() {
            String userId = "user-123";
            User user = User.builder()
                .id(userId)
                .email("found@example.com")
                .username("founduser")
                .country("France")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            ResponseUserDto result = userService.getUserById(userId);

            assertNotNull(result);
            assertEquals(userId, result.getId());
            assertEquals("found@example.com", result.getEmail());
            assertEquals("founduser", result.getUsername());
            assertEquals("France", result.getCountry());
            assertEquals(null, result.getBio());
            assertEquals(null, result.getProfilePicture());
            assertEquals(0, result.getFollowingCount());
            assertEquals(0, result.getFollowerCount());

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when user not found")
        void shouldThrowUserNotFoundExceptionWhenUserNotFound() {
            String userId = "non-existent-user";
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
                userService.getUserById(userId);
            });
            
            assertTrue(exception.getMessage().contains("User " + userId + " not found"));

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should get user with null optional fields")
        void shouldGetUserWithNullOptionalFields() {
            String userId = "user-minimal";
            User user = User.builder()
                .id(userId)
                .email("minimal@example.com")
                .username("minimaluser")
                .country("Spain")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            ResponseUserDto result = userService.getUserById(userId);

            assertNotNull(result);
            assertEquals(userId, result.getId());
            assertEquals("minimal@example.com", result.getEmail());
            assertEquals("minimaluser", result.getUsername());
            assertEquals("Spain", result.getCountry());
            assertNull(result.getBio());
            assertNull(result.getProfilePicture());
            assertEquals(0, result.getFollowingCount());
            assertEquals(0, result.getFollowerCount());

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should handle different user IDs correctly")
        void shouldHandleDifferentUserIds() {
            String userId1 = "uuid-format-123-456";
            String userId2 = "simple-id";

            User user1 = User.builder()
                .id(userId1)
                .email("user1@example.com")
                .username("user1")
                .country("UK")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            User user2 = User.builder()
                .id(userId2)
                .email("user2@example.com")
                .username("user2")
                .country("Italy")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            when(userRepository.findById(userId1)).thenReturn(Optional.of(user1));
            when(userRepository.findById(userId2)).thenReturn(Optional.of(user2));

            ResponseUserDto result1 = userService.getUserById(userId1);
            ResponseUserDto result2 = userService.getUserById(userId2);

            assertEquals(userId1, result1.getId());
            assertEquals("user1", result1.getUsername());
            
            assertEquals(userId2, result2.getId());
            assertEquals("user2", result2.getUsername());

            verify(userRepository, times(1)).findById(userId1);
            verify(userRepository, times(1)).findById(userId2);
        }

        @Test
        @DisplayName("Should not include follower/following data in response")
        void shouldNotIncludeFollowerDataInResponse() {
            String userId = "user-with-followers";
            
            User follower = User.builder()
                .id("follower-1")
                .email("follower@example.com")
                .username("follower")
                .country("Japan")
                .build();

            HashSet<User> followers = new HashSet<>();
            followers.add(follower);

            User user = User.builder()
                .id(userId)
                .email("popular@example.com")
                .username("popularuser")
                .country("USA")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(followers)
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            ResponseUserDto result = userService.getUserById(userId);

            assertNotNull(result);
            assertEquals(userId, result.getId());
            assertEquals("popularuser", result.getUsername());
            assertEquals(0, result.getFollowingCount());
            assertEquals(1, result.getFollowerCount());

            verify(userRepository, times(1)).findById(userId);
        }
    }

    @Nested
    @DisplayName("deleteUserById Tests")
    class DeleteUserByIdTests {

        @Test
        @DisplayName("Should delete user by ID successfully")
        void shouldDeleteUserByIdSuccessfully() {
            String userId = "user-to-delete";
            User user = User.builder()
                .id(userId)
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            assertDoesNotThrow(() -> userService.deleteUserById(userId));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).delete(user);
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when trying to delete a non-existent user")
        void shouldThrowUserNotFoundExceptionForNonExistentUser() {
            String userId = "non-existent-user";
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
                userService.deleteUserById(userId);
            });

            assertEquals("User " + userId + " not found", exception.getMessage());
            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, never()).delete(any(User.class));
        }
    }

    @Nested
    @DisplayName("updateUser Tests")
    class UpdateUserTests {

        @Test
        @DisplayName("Should update user successfully")
        void shouldUpdateUserSuccessfully() {
            String userId = "user-to-update";
            UpdateUserDto updateUserDto = UpdateUserDto.builder()
                .id(userId)
                .username("newUsername")
                .country("newCountry")
                .build();

            User existingUser = User.builder()
                .id(userId)
                .username("oldUsername")
                .country("oldCountry")
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            ResponseUserDto result = userService.updateUser(updateUserDto);

            assertNotNull(result);
            assertEquals(userId, result.getId());
            assertEquals("newUsername", result.getUsername());
            assertEquals("newCountry", result.getCountry());
            assertEquals(null, result.getBio());
            assertEquals(null, result.getProfilePicture());

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when user to update is not found")
        void shouldThrowUserNotFoundExceptionWhenUserNotFound() {
            String userId = "non-existent-user";
            UpdateUserDto updateUserDto = UpdateUserDto.builder().id(userId).build();

            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            assertThrows(UserNotFoundException.class, () -> {
                userService.updateUser(updateUserDto);
            });

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("Should only update non-null fields")
        void shouldOnlyUpdateNonNullFields() {
            String userId = "user-partial-update";
            UpdateUserDto updateUserDto = UpdateUserDto.builder()
                .id(userId)
                .username("newPartialUsername")
                .bio(null) 
                .build();

            User existingUser = User.builder()
                .id(userId)
                .username("oldPartialUsername")
                .country("oldPartialCountry")
                .build();

            ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);

            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            userService.updateUser(updateUserDto);

            verify(userRepository).save(userCaptor.capture());
            User savedUser = userCaptor.getValue();
            
            assertEquals("newPartialUsername", savedUser.getUsername());
            assertEquals(null, savedUser.getBio());
            assertEquals("oldPartialCountry", savedUser.getCountry());
        }
    }

    @Nested
    @DisplayName("createFollowRelationship Tests")
    class CreateFollowRelationshipTests {

        @Test
        @DisplayName("Should create follow relationship successfully")
        void shouldCreateFollowRelationshipSuccessfully() {
            String followingUserId = "user-1";
            String followedUserId = "user-2";

            User followingUser = User.builder().id(followingUserId).following(new HashSet<>()).build();
            User followedUser = User.builder().id(followedUserId).followers(new HashSet<>()).build();

            when(userRepository.findById(followingUserId)).thenReturn(Optional.of(followingUser));
            when(userRepository.findById(followedUserId)).thenReturn(Optional.of(followedUser));

            ResponseUserDto result = userService.createFollowRelationship(followingUserId, followedUserId);

            assertNotNull(result);
            assertEquals(followedUserId, result.getId());
            assertNull(result.getEmail());
            assertTrue(followingUser.getFollowing().contains(followedUser));
        }

        @Test
        @DisplayName("Should throw IllegalArgumentException when user tries to follow themself")
        void shouldThrowExceptionWhenFollowingAndFollowedUsersAreSame() {
            String userId = "user-1";

            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
                userService.createFollowRelationship(userId, userId);
            });

            assertEquals("Following and followed users cannot be the same", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when following user is not found")
        void shouldThrowUserNotFoundExceptionWhenFollowingUserNotFound() {
            String followingUserId = "non-existent-user";
            String followedUserId = "user-2";

            when(userRepository.findById(followingUserId)).thenReturn(Optional.empty());

            assertThrows(UserNotFoundException.class, () -> {
                userService.createFollowRelationship(followingUserId, followedUserId);
            });
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when followed user is not found")
        void shouldThrowUserNotFoundExceptionWhenFollowedUserNotFound() {
            String followingUserId = "user-1";
            String followedUserId = "non-existent-user";

            User followingUser = User.builder().id(followingUserId).build();
            when(userRepository.findById(followingUserId)).thenReturn(Optional.of(followingUser));
            when(userRepository.findById(followedUserId)).thenReturn(Optional.empty());

            assertThrows(UserNotFoundException.class, () -> {
                userService.createFollowRelationship(followingUserId, followedUserId);
            });
        }

        @Test
        @DisplayName("Should throw FollowingAlreadyExistsException when user already follows another")
        void shouldThrowFollowingAlreadyExistsExceptionWhenRelationshipExists() {
            String followingUserId = "user-1";
            String followedUserId = "user-2";

            User followedUser = User.builder().id(followedUserId).build();
            HashSet<User> followingSet = new HashSet<>();
            followingSet.add(followedUser);
            User followingUser = User.builder().id(followingUserId).following(followingSet).build();

            when(userRepository.findById(followingUserId)).thenReturn(Optional.of(followingUser));
            when(userRepository.findById(followedUserId)).thenReturn(Optional.of(followedUser));

            assertThrows(FollowingAlreadyExistsException.class, () -> {
                userService.createFollowRelationship(followingUserId, followedUserId);
            });
        }
    }

    @Nested
    @DisplayName("deleteFollowRelationship Tests")
    class DeleteFollowRelationshipTests {

        @Test
        @DisplayName("Should delete follow relationship successfully")
        void shouldDeleteFollowRelationshipSuccessfully() {
            String followingUserId = "user-1";
            String followedUserId = "user-2";

            User followedUser = User.builder().id(followedUserId).build();
            HashSet<User> followingSet = new HashSet<>();
            followingSet.add(followedUser);
            User followingUser = User.builder().id(followingUserId).following(followingSet).build();

            when(userRepository.findById(followingUserId)).thenReturn(Optional.of(followingUser));
            when(userRepository.findById(followedUserId)).thenReturn(Optional.of(followedUser));

            assertDoesNotThrow(() -> userService.deleteFollowRelationship(followingUserId, followedUserId));

            assertFalse(followingUser.getFollowing().contains(followedUser));
        }

        @Test
        @DisplayName("Should throw IllegalArgumentException when user tries to unfollow themself")
        void shouldThrowExceptionWhenFollowingAndFollowedUsersAreSame() {
            String userId = "user-1";

            IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
                userService.deleteFollowRelationship(userId, userId);
            });

            assertEquals("Following and followed users cannot be the same", exception.getMessage());
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when following user is not found")
        void shouldThrowUserNotFoundExceptionWhenFollowingUserNotFound() {
            String followingUserId = "non-existent-user";
            String followedUserId = "user-2";

            when(userRepository.findById(followingUserId)).thenReturn(Optional.empty());

            assertThrows(UserNotFoundException.class, () -> {
                userService.deleteFollowRelationship(followingUserId, followedUserId);
            });
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when followed user is not found")
        void shouldThrowUserNotFoundExceptionWhenFollowedUserNotFound() {
            String followingUserId = "user-1";
            String followedUserId = "non-existent-user";

            User followingUser = User.builder().id(followingUserId).build();
            when(userRepository.findById(followingUserId)).thenReturn(Optional.of(followingUser));
            when(userRepository.findById(followedUserId)).thenReturn(Optional.empty());

            assertThrows(UserNotFoundException.class, () -> {
                userService.deleteFollowRelationship(followingUserId, followedUserId);
            });
        }

        @Test
        @DisplayName("Should throw FollowingNotFoundException when relationship does not exist")
        void shouldThrowFollowingNotFoundExceptionWhenRelationshipDoesNotExist() {
            String followingUserId = "user-1";
            String followedUserId = "user-2";

            User followingUser = User.builder().id(followingUserId).following(new HashSet<>()).build();
            User followedUser = User.builder().id(followedUserId).build();

            when(userRepository.findById(followingUserId)).thenReturn(Optional.of(followingUser));
            when(userRepository.findById(followedUserId)).thenReturn(Optional.of(followedUser));

            assertThrows(FollowingNotFoundException.class, () -> {
                userService.deleteFollowRelationship(followingUserId, followedUserId);
            });
        }
    }

    @Nested
    @DisplayName("getUserPublicDataById Tests")
    class GetUserPublicDataByIdTests {

        @Test
        @DisplayName("Should get user public data by ID successfully and not return email")
        void shouldGetUserPublicDataByIdSuccessfully() {
            String userId = "user-public";
            User user = User.builder()
                .id(userId)
                .email("public@example.com")
                .username("publicuser")
                .country("USA")
                .createdAt(Instant.now())
                .following(new HashSet<>())
                .followers(new HashSet<>())
                .build();

            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            ResponseUserDto result = userService.getUserPublicDataById(userId);

            assertNotNull(result);
            assertEquals(userId, result.getId());
            assertNull(result.getEmail()); // Should not return private data
            assertEquals("publicuser", result.getUsername());
            assertEquals(0, result.getFollowingCount());
            assertEquals(0, result.getFollowerCount());

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should throw UserNotFoundException when user not found for public data")
        void shouldThrowUserNotFoundExceptionWhenUserNotFound() {
            String userId = "non-existent-user";
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            UserNotFoundException exception = assertThrows(UserNotFoundException.class, () -> {
                userService.getUserPublicDataById(userId);
            });

            assertTrue(exception.getMessage().contains("User " + userId + " not found"));

            verify(userRepository, times(1)).findById(userId);
        }
    }
}
