package com.veer.user.api.controller;

import com.veer.user.api.exception.GlobalExceptionHandler;
import com.veer.user.model.User;
import com.veer.user.repository.UserRepository;
import com.veer.user.service.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.HashSet;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@Import({UserServiceImpl.class, GlobalExceptionHandler.class})
@DisplayName("UserController Integration Tests")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        reset(userRepository);
    }

    @Nested
    @DisplayName("POST /api/user - Create User Tests")
    class CreateUserTests {

        @Test
        @DisplayName("Should create user successfully with all required headers")
        void shouldCreateUserSuccessfully() throws Exception {
            String userId      = "test-user-123";
            String userEmail   = "test@example.com";
            String userName    = "testuser";
            String userCountry = "United States";

            when(userRepository.findById(userId)).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setCreatedAt(Instant.now());
                user.setFollowers(new HashSet<>());
                user.setFollowing(new HashSet<>());
                return user;
            });

            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", userId)
                    .header("X-User-Email", userEmail)
                    .header("X-User-Name", userName)
                    .header("X-User-Country", userCountry)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(status().is(201))
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.email", is(userEmail)))
                .andExpect(jsonPath("$.username", is(userName)))
                .andExpect(jsonPath("$.country", is(userCountry)))
                .andExpect(jsonPath("$.followerCount", is(0)))
                .andExpect(jsonPath("$.followingCount", is(0)))
                .andExpect(jsonPath("$.joinedAt", notNullValue()));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should handle UserAlreadyExistsException when user already exists")
        void shouldHandleUserAlreadyExistsException() throws Exception {
            String userId = "existing-user-123";
            
            User existingUser = User.builder()
                .id(userId)
                .email("existing@example.com")
                .username("existinguser")
                .country("Germany")
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));

            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", userId)
                    .header("X-User-Email", "new@example.com")
                    .header("X-User-Name", "newuser")
                    .header("X-User-Country", "Poland")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status", is(409)))
                .andExpect(jsonPath("$.error", is("Conflict")))
                .andExpect(jsonPath("$.message", containsString("already exists")));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should verify the full integration flow through service layer")
        void shouldVerifyFullIntegrationFlow() throws Exception {
            String userId      = "integration-user";
            String userEmail   = "integration@example.com";
            String userName    = "integrationuser";
            String userCountry = "Canada";

            when(userRepository.findById(userId)).thenReturn(Optional.empty());
            
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setCreatedAt(Instant.now());
                user.setFollowers(new HashSet<>());
                user.setFollowing(new HashSet<>());
                return user;
            });

            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", userId)
                    .header("X-User-Email", userEmail)
                    .header("X-User-Name", userName)
                    .header("X-User-Country", userCountry)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.email", is(userEmail)))
                .andExpect(jsonPath("$.username", is(userName)))
                .andExpect(jsonPath("$.country", is(userCountry)));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).save(argThat(user ->
                user.getId().equals(userId) &&
                user.getEmail().equals(userEmail) &&
                user.getUsername().equals(userName) &&
                user.getCountry().equals(userCountry)
            ));
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenUserIdHeaderMissing() throws Exception {
            mockMvc.perform(post("/api/user")
                    .header("X-User-Email", "test@example.com")
                    .header("X-User-Name", "testuser")
                    .header("X-User-Country", "Poland")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Email header is missing")
        void shouldReturnBadRequestWhenUserEmailHeaderMissing() throws Exception {
            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", "test-user-123")
                    .header("X-User-Name", "testuser")
                    .header("X-User-Country", "Poland")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Name header is missing")
        void shouldReturnBadRequestWhenUserNameHeaderMissing() throws Exception {
            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", "test-user-123")
                    .header("X-User-Email", "test@example.com")
                    .header("X-User-Country", "Poland")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Country header is missing")
        void shouldReturnBadRequestWhenUserCountryHeaderMissing() throws Exception {
            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", "test-user-123")
                    .header("X-User-Email", "test@example.com")
                    .header("X-User-Name", "testuser")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when all headers are missing")
        void shouldReturnBadRequestWhenAllHeadersMissing() throws Exception {
            mockMvc.perform(post("/api/user")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should handle empty string headers as bad request")
        void shouldHandleEmptyStringHeaders() throws Exception {
            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", "")
                    .header("X-User-Email", "test@example.com")
                    .header("X-User-Name", "testuser")
                    .header("X-User-Country", "Poland")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should handle multiple user creations independently")
        void shouldHandleMultipleUserCreations() throws Exception {
            when(userRepository.findById(anyString())).thenReturn(Optional.empty());
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setCreatedAt(Instant.now());
                user.setFollowers(new HashSet<>());
                user.setFollowing(new HashSet<>());
                return user;
            });

            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", "user-1")
                    .header("X-User-Email", "user1@example.com")
                    .header("X-User-Name", "user1")
                    .header("X-User-Country", "Poland")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is("user-1")));

            mockMvc.perform(post("/api/user")
                    .header("X-User-Id", "user-2")
                    .header("X-User-Email", "user2@example.com")
                    .header("X-User-Name", "user2")
                    .header("X-User-Country", "Germany")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", is("user-2")));

            verify(userRepository, times(1)).findById("user-1");
            verify(userRepository, times(1)).findById("user-2");
            verify(userRepository, times(2)).save(any(User.class));
        }
    }

    @Nested
    @DisplayName("GET /api/user - Get User Private Data Tests")
    class GetUserPrivateDataTests {

        @Test
        @DisplayName("Should get user private data successfully")
        void shouldGetUserPrivateDataSuccessfully() throws Exception {
            String userId = "test-user-123";
            
            User user = User.builder()
                .id(userId)
                .email("private@example.com")
                .username("testuser")
                .bio("My bio")
                .country("Poland")
                .profilePicture("https://example.com/pic.jpg")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            mockMvc.perform(get("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.email", is("private@example.com")))
                .andExpect(jsonPath("$.username", is("testuser")))
                .andExpect(jsonPath("$.bio", is("My bio")))
                .andExpect(jsonPath("$.country", is("Poland")))
                .andExpect(jsonPath("$.profilePicture", is("https://example.com/pic.jpg")))
                .andExpect(jsonPath("$.followerCount", is(0)))
                .andExpect(jsonPath("$.followingCount", is(0)));

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should return 404 when user not found")
        void shouldReturnNotFoundWhenUserNotExists() throws Exception {
            String userId = "non-existent-user";
            
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            mockMvc.perform(get("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenHeaderMissing() throws Exception {
            mockMvc.perform(get("/api/user")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).findById(anyString());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is empty")
        void shouldReturnBadRequestWhenHeaderEmpty() throws Exception {
            mockMvc.perform(get("/api/user")
                    .header("X-User-Id", "")
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).findById(anyString());
        }
    }

    @Nested
    @DisplayName("GET /api/user/{userId} - Get User Public Data Tests")
    class GetUserPublicDataTests {

        @Test
        @DisplayName("Should get user public data successfully without email")
        void shouldGetUserPublicDataSuccessfully() throws Exception {
            String userId = "public-user-123";
            
            User user = User.builder()
                .id(userId)
                .email("should-be-hidden@example.com")
                .username("publicuser")
                .bio("Public bio")
                .country("Germany")
                .profilePicture("https://example.com/public.jpg")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            mockMvc.perform(get("/api/user/{userId}", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.email").doesNotExist())
                .andExpect(jsonPath("$.username", is("publicuser")))
                .andExpect(jsonPath("$.bio", is("Public bio")))
                .andExpect(jsonPath("$.country", is("Germany")))
                .andExpect(jsonPath("$.profilePicture", is("https://example.com/public.jpg")))
                .andExpect(jsonPath("$.followerCount", is(0)))
                .andExpect(jsonPath("$.followingCount", is(0)));

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should verify email is hidden in public data")
        void shouldVerifyEmailIsHidden() throws Exception {
            String userId = "user-with-email";
            
            User user = User.builder()
                .id(userId)
                .email("secret@example.com")
                .username("testuser")
                .country("France")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            mockMvc.perform(get("/api/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.email").doesNotExist())
                .andExpect(jsonPath("$.username", is("testuser")));

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should return 404 when user not found")
        void shouldReturnNotFoundWhenUserNotExists() throws Exception {
            String userId = "non-existent-public-user";
            
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            mockMvc.perform(get("/api/user/{userId}", userId)
                    .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(userRepository, times(1)).findById(userId);
        }

        @Test
        @DisplayName("Should handle different user IDs in path variable")
        void shouldHandleDifferentUserIds() throws Exception {
            String userId1 = "uuid-123-456";
            String userId2 = "simple-id";

            User user1 = User.builder()
                .id(userId1)
                .email("user1@example.com")
                .username("user1")
                .country("UK")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            User user2 = User.builder()
                .id(userId2)
                .email("user2@example.com")
                .username("user2")
                .country("Italy")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            when(userRepository.findById(userId1)).thenReturn(Optional.of(user1));
            when(userRepository.findById(userId2)).thenReturn(Optional.of(user2));

            mockMvc.perform(get("/api/user/{userId}", userId1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userId1)))
                .andExpect(jsonPath("$.username", is("user1")))
                .andExpect(jsonPath("$.email").doesNotExist());

            mockMvc.perform(get("/api/user/{userId}", userId2))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userId2)))
                .andExpect(jsonPath("$.username", is("user2")))
                .andExpect(jsonPath("$.email").doesNotExist());

            verify(userRepository, times(1)).findById(userId1);
            verify(userRepository, times(1)).findById(userId2);
        }

        @Test
        @DisplayName("Should return user with followers and following counts")
        void shouldReturnUserWithCounts() throws Exception {
            String userId = "popular-user";
            
            HashSet<User> followers = new HashSet<>();
            followers.add(User.builder().id("follower1").build());
            followers.add(User.builder().id("follower2").build());
            
            HashSet<User> following = new HashSet<>();
            following.add(User.builder().id("following1").build());

            User user = User.builder()
                .id(userId)
                .email("popular@example.com")
                .username("popularuser")
                .country("Spain")
                .createdAt(Instant.now())
                .followers(followers)
                .following(following)
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));

            mockMvc.perform(get("/api/user/{userId}", userId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.followerCount", is(2)))
                .andExpect(jsonPath("$.followingCount", is(1)))
                .andExpect(jsonPath("$.email").doesNotExist());

            verify(userRepository, times(1)).findById(userId);
        }
    }
}
