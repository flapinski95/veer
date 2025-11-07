package com.veer.user.service;

import com.veer.user.model.CreateUserDto;
import com.veer.user.model.ResponseUserDto;
import com.veer.user.model.User;
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
                .email("test@example.com")
                .username("testuser")
                .bio("Test bio")
                .country("United States")
                .profilePicture("https://example.com/profile.jpg")
                .build();

            User savedUser = User.builder()
                .id("user-123")
                .email("test@example.com")
                .username("testuser")
                .bio("Test bio")
                .country("United States")
                .profilePicture("https://example.com/profile.jpg")
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
            assertEquals("Test bio", result.getBio());
            assertEquals("United States", result.getCountry());
            assertEquals(0, result.getFollowingCount());
            assertEquals(0, result.getFollowerCount());
            assertEquals("https://example.com/profile.jpg", result.getProfilePicture());
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should create user with minimal required fields")
        void shouldCreateUserWithMinimalFields() {
            CreateUserDto createUserDto = CreateUserDto.builder()
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
                .email("verify@example.com")
                .username("verifyuser")
                .bio("Verification bio")
                .country("Germany")
                .profilePicture("https://example.com/verify.jpg")
                .build();

            User savedUser = User.builder()
                .id("user-789")
                .email("verify@example.com")
                .username("verifyuser")
                .bio("Verification bio")
                .country("Germany")
                .profilePicture("https://example.com/verify.jpg")
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
            assertEquals("Verification bio", capturedUser.getBio());
            assertEquals("Germany", capturedUser.getCountry());
            assertEquals("https://example.com/verify.jpg", capturedUser.getProfilePicture());
            assertEquals(0, capturedUser.getFollowing().size());
            assertEquals(0, capturedUser.getFollowers().size());
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
                .bio("Found bio")
                .country("France")
                .profilePicture("https://example.com/found.jpg")
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
            assertEquals("Found bio", result.getBio());
            assertEquals("France", result.getCountry());
            assertEquals("https://example.com/found.jpg", result.getProfilePicture());
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
}

