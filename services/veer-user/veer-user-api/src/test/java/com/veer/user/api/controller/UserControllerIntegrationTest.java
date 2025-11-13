package com.veer.user.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.veer.user.api.exception.GlobalExceptionHandler;
import com.veer.user.model.User;
import com.veer.user.model.dto.UpdateUserDto;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.Mockito.doNothing;

@WebMvcTest(UserController.class)
@Import({UserServiceImpl.class, GlobalExceptionHandler.class})
@DisplayName("UserController Integration Tests")
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

    @Nested
    @DisplayName("PATCH /api/user - Update User Tests")
    class UpdateUserTests {

        @Test
        @DisplayName("Should update user successfully with all fields")
        void shouldUpdateUserSuccessfully() throws Exception {
            String userId = "update-user-123";
            
            User existingUser = User.builder()
                .id(userId)
                .email("existing@example.com")
                .username("oldusername")
                .bio("Old bio")
                .country("OldCountry")
                .profilePicture("https://example.com/old.jpg")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("newusername")
                .bio("New bio")
                .country("NewCountry")
                .profilePicture("https://example.com/new.jpg")
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                user.setUsername("newusername");
                user.setBio("New bio");
                user.setCountry("NewCountry");
                user.setProfilePicture("https://example.com/new.jpg");
                return user;
            });

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.username", is("newusername")))
                .andExpect(jsonPath("$.bio", is("New bio")))
                .andExpect(jsonPath("$.country", is("NewCountry")))
                .andExpect(jsonPath("$.profilePicture", is("https://example.com/new.jpg")));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should update user with partial data (only username)")
        void shouldUpdateUserPartially() throws Exception {
            String userId = "partial-update-user";
            
            User existingUser = User.builder()
                .id(userId)
                .email("partial@example.com")
                .username("oldname")
                .bio("Keep this bio")
                .country("KeepCountry")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("newname")
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
                User user = invocation.getArgument(0);
                return user;
            });

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.username", is("newname")))
                .andExpect(jsonPath("$.bio", is("Keep this bio")))
                .andExpect(jsonPath("$.country", is("KeepCountry")));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should return 404 when user not found")
        void shouldReturnNotFoundWhenUserNotExists() throws Exception {
            String userId = "non-existent-user";
            
            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("newname")
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenHeaderMissing() throws Exception {
            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("newname")
                .build();

            mockMvc.perform(patch("/api/user")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).findById(anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is empty")
        void shouldReturnBadRequestWhenHeaderEmpty() throws Exception {
            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("newname")
                .build();

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", "")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).findById(anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should handle empty body (no changes)")
        void shouldHandleEmptyBody() throws Exception {
            String userId = "test-user";
            
            User existingUser = User.builder()
                .id(userId)
                .email("test@example.com")
                .username("testuser")
                .country("TestCountry")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(userId)))
                .andExpect(jsonPath("$.username", is("testuser"))); // No changes

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).save(any(User.class));
        }

        @Test
        @DisplayName("Should return 400 when username is too short")
        void shouldReturnBadRequestWhenUsernameInvalid() throws Exception {
            String userId = "validatily from header, not from request bodyon-user";
            
            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("ab")
                .build();

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).findById(anyString());
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should verify that ID from header overrides ID in body")
        void shouldUseIdFromHeader() throws Exception {
            String headerUserId = "correct-user-id";
            String bodyUserId = "wrong-user-id";
            
            User existingUser = User.builder()
                .id(headerUserId)
                .email("test@example.com")
                .username("testuser")
                .country("TestCountry")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            UpdateUserDto updateDto = UpdateUserDto.builder()
                .id(bodyUserId) // This should be overridden
                .username("updatedname")
                .build();
            
            when(userRepository.findById(headerUserId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", headerUserId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(headerUserId)));

            verify(userRepository, times(1)).findById(headerUserId);
            verify(userRepository, never()).findById(bodyUserId);
        }

        @Test
        @DisplayName("Should update multiple fields correctly")
        void shouldUpdateMultipleFields() throws Exception {
            String userId = "multi-update-user";
            
            User existingUser = User.builder()
                .id(userId)
                .email("multi@example.com")
                .username("oldname")
                .bio("Old bio")
                .country("OldCountry")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("newname")
                .bio("New bio")
                .country("NewCountry")
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk());

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).save(argThat(user ->
                user.getId().equals(userId) &&
                user.getUsername().equals("newname") &&
                user.getBio().equals("New bio") &&
                user.getCountry().equals("NewCountry")
            ));
        }

        @Test
        @DisplayName("Should not change email when updating user")
        void shouldNotChangeEmail() throws Exception {
            String userId = "email-protect-user";
            String originalEmail = "protected@example.com";
            
            User existingUser = User.builder()
                .id(userId)
                .email(originalEmail)
                .username("testuser")
                .country("TestCountry")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            UpdateUserDto updateDto = UpdateUserDto.builder()
                .username("newusername")
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            mockMvc.perform(patch("/api/user")
                    .header("X-User-Id", userId)
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(updateDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(originalEmail))); // Email unchanged

            verify(userRepository, times(1)).save(argThat(user ->
                user.getEmail().equals(originalEmail)
            ));
        }
    }

    @Nested
    @DisplayName("DELETE /api/user - Delete User Tests")
    class DeleteUserTests {

        @Test
        @DisplayName("Should delete user successfully")
        void shouldDeleteUserSuccessfully() throws Exception {
            String userId = "delete-user-123";
            
            User user = User.builder()
                .id(userId)
                .email("delete@example.com")
                .username("deleteuser")
                .country("Poland")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));
            doNothing().when(userRepository).delete(any(User.class));

            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent())
                .andExpect(content().string(""));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).delete(user);
        }

        @Test
        @DisplayName("Should return 404 when user not found")
        void shouldReturnNotFoundWhenUserNotExists() throws Exception {
            String userId = "non-existent-user";
            
            when(userRepository.findById(userId)).thenReturn(Optional.empty());

            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", userId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status", is(404)))
                .andExpect(jsonPath("$.error", is("Not Found")))
                .andExpect(jsonPath("$.message", containsString("not found")));

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, never()).delete(any(User.class));
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenHeaderMissing() throws Exception {
            mockMvc.perform(delete("/api/user"))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).findById(anyString());
            verify(userRepository, never()).delete(any(User.class));
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is empty")
        void shouldReturnBadRequestWhenHeaderEmpty() throws Exception {
            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", ""))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).findById(anyString());
            verify(userRepository, never()).delete(any(User.class));
        }

        @Test
        @DisplayName("Should verify correct user is deleted")
        void shouldVerifyCorrectUserDeleted() throws Exception {
            String userId = "verify-delete-user";
            
            User user = User.builder()
                .id(userId)
                .email("verify@example.com")
                .username("verifyuser")
                .country("Germany")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));
            doNothing().when(userRepository).delete(any(User.class));

            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent());

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).delete(argThat(u ->
                u.getId().equals(userId) &&
                u.getEmail().equals("verify@example.com") &&
                u.getUsername().equals("verifyuser")
            ));
        }

        @Test
        @DisplayName("Should delete user with followers and following")
        void shouldDeleteUserWithRelationships() throws Exception {
            String userId = "popular-delete-user";
            
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
            doNothing().when(userRepository).delete(any(User.class));

            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent());

            verify(userRepository, times(1)).findById(userId);
            verify(userRepository, times(1)).delete(user);
        }

        @Test
        @DisplayName("Should handle multiple delete requests for different users")
        void shouldHandleMultipleDeletes() throws Exception {
            String userId1 = "delete-user-1";
            String userId2 = "delete-user-2";

            User user1 = User.builder()
                .id(userId1)
                .email("user1@example.com")
                .username("user1")
                .country("Poland")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            User user2 = User.builder()
                .id(userId2)
                .email("user2@example.com")
                .username("user2")
                .country("Germany")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();

            when(userRepository.findById(userId1)).thenReturn(Optional.of(user1));
            when(userRepository.findById(userId2)).thenReturn(Optional.of(user2));
            doNothing().when(userRepository).delete(any(User.class));

            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", userId1))
                .andExpect(status().isNoContent());

            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", userId2))
                .andExpect(status().isNoContent());

            verify(userRepository, times(1)).findById(userId1);
            verify(userRepository, times(1)).findById(userId2);
            verify(userRepository, times(1)).delete(user1);
            verify(userRepository, times(1)).delete(user2);
        }

        @Test
        @DisplayName("Should return proper HTTP 204 No Content status")
        void shouldReturnNoContentStatus() throws Exception {
            String userId = "no-content-user";
            
            User user = User.builder()
                .id(userId)
                .email("nocontent@example.com")
                .username("nocontentuser")
                .country("France")
                .createdAt(Instant.now())
                .followers(new HashSet<>())
                .following(new HashSet<>())
                .build();
            
            when(userRepository.findById(userId)).thenReturn(Optional.of(user));
            doNothing().when(userRepository).delete(any(User.class));

            mockMvc.perform(delete("/api/user")
                    .header("X-User-Id", userId))
                .andExpect(status().isNoContent())
                .andExpect(status().is(204));

            verify(userRepository, times(1)).delete(any(User.class));
        }
    }

    @Nested
    @DisplayName("POST /api/user/{followedUserId}/follow - Follow User Tests")
    class FollowUserTests {

        @Test
        @DisplayName("Should follow user successfully")
        void shouldFollowUserSuccessfully() throws Exception {
            String followerId = "follower-user";
            String followedId = "followed-user";

            User follower = User.builder()
                .id(followerId)
                .username("follower")
                .email("follower@example.com")
                .country("Country")
                .followers(new HashSet<>()).following(new HashSet<>())
                .build();
            User followed = User.builder()
                .id(followedId)
                .username("followed")
                .email("followed@example.com")
                .country("Country")
                .followers(new HashSet<>()).following(new HashSet<>())
                .build();

            when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
            when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));
            when(userRepository.save(any(User.class))).thenAnswer(
                invocation -> invocation.getArgument(0)
            );

            mockMvc.perform(post("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(followedId)))
                .andExpect(jsonPath("$.username", is("followed")))
                .andExpect(jsonPath("$.followerCount", is(1)));

            verify(userRepository, times(1)).findById(followerId);
            verify(userRepository, times(1)).findById(followedId);
        }

        @Test
        @DisplayName("Should return 404 when follower not found")
        void shouldReturnNotFoundWhenFollowerNotFound() throws Exception {
            String followerId = "non-existent-follower";
            String followedId = "followed-user";

            User followed = User.builder().id(followedId).build();

            when(userRepository.findById(followerId)).thenReturn(Optional.empty());
            when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));

            mockMvc.perform(post("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isNotFound());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 404 when followed user not found")
        void shouldReturnNotFoundWhenFollowedNotFound() throws Exception {
            String followerId = "follower-user";
            String followedId = "non-existent-followed";

            User follower = User.builder().id(followerId).followers(new HashSet<>()).following(new HashSet<>()).build();

            when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
            when(userRepository.findById(followedId)).thenReturn(Optional.empty());

            mockMvc.perform(post("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isNotFound());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 409 when already following")
        void shouldReturnConflictWhenAlreadyFollowing() throws Exception {
            String followerId = "follower-user";
            String followedId = "followed-user";

            User follower = User.builder().id(followerId).username("follower").followers(new HashSet<>()).following(new HashSet<>()).build();
            User followed = User.builder().id(followedId).username("followed").followers(new HashSet<>()).following(new HashSet<>()).build();

            follower.getFollowing().add(followed);
            followed.getFollowers().add(follower);

            when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
            when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));

            mockMvc.perform(post("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isConflict());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenHeaderMissing() throws Exception {
            mockMvc.perform(post("/api/user/{followedUserId}/follow", "some-user"))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when trying to follow yourself")
        void shouldReturnBadRequestWhenTryingToFollowYourself() throws Exception {
            String followerId = "follower-user";
            String followedId = followerId;

            User follower = User.builder()
                .id(followerId)
                .username("follower")
                .email("follower@example.com")
                .country("Country")
                .followers(new HashSet<>()).following(new HashSet<>())
                .build();
            User followed = User.builder()
                .id(followedId)
                .username("followed")
                .email("followed@example.com")
                .country("Country")
                .followers(new HashSet<>()).following(new HashSet<>())
                .build();

            when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
            when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));

            mockMvc.perform(post("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    @DisplayName("DELETE /api/user/{followedUserId}/follow - Unfollow User Tests")
    class UnfollowUserTests {

        @Test
        @DisplayName("Should unfollow user successfully")
        void shouldUnfollowUserSuccessfully() throws Exception {
            String followerId = "follower-user";
            String followedId = "followed-user";

            User follower = User.builder().id(followerId).username("follower").email("follower@example.com").country("Country").followers(new HashSet<>()).following(new HashSet<>()).build();
            User followed = User.builder().id(followedId).username("followed").email("followed@example.com").country("Country").followers(new HashSet<>()).following(new HashSet<>()).build();

            follower.getFollowing().add(followed);
            followed.getFollowers().add(follower);

            when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
            when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));
            when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

            mockMvc.perform(delete("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isNoContent());

            verify(userRepository, times(1)).findById(followerId);
            verify(userRepository, times(1)).findById(followedId);
        }

        @Test
        @DisplayName("Should return 404 when follower not found")
        void shouldReturnNotFoundWhenFollowerNotFound() throws Exception {
            String followerId = "non-existent-follower";
            String followedId = "followed-user";

            User followed = User.builder().id(followedId).build();

            when(userRepository.findById(followerId)).thenReturn(Optional.empty());
            when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));

            mockMvc.perform(delete("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isNotFound());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 404 when followed user not found")
        void shouldReturnNotFoundWhenFollowedNotFound() throws Exception {
            String followerId = "follower-user";
            String followedId = "non-existent-followed";

            User follower = User.builder().id(followerId).followers(new HashSet<>()).following(new HashSet<>()).build();

            when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
            when(userRepository.findById(followedId)).thenReturn(Optional.empty());

            mockMvc.perform(delete("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isNotFound());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 404 when not following")
        void shouldReturnNotFoundWhenNotFollowing() throws Exception {
            String followerId = "follower-user";
            String followedId = "followed-user";

            User follower = User.builder().id(followerId).username("follower").followers(new HashSet<>()).following(new HashSet<>()).build();
            User followed = User.builder().id(followedId).username("followed").followers(new HashSet<>()).following(new HashSet<>()).build();

            when(userRepository.findById(followerId)).thenReturn(Optional.of(follower));
            when(userRepository.findById(followedId)).thenReturn(Optional.of(followed));

            mockMvc.perform(delete("/api/user/{followedUserId}/follow", followedId)
                    .header("X-User-Id", followerId))
                .andExpect(status().isNotFound());

            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should return 400 when X-User-Id header is missing")
        void shouldReturnBadRequestWhenHeaderMissing() throws Exception {
            mockMvc.perform(delete("/api/user/{followedUserId}/follow", "some-user"))
                .andExpect(status().isBadRequest());

            verify(userRepository, never()).save(any());
        }
    }
}
