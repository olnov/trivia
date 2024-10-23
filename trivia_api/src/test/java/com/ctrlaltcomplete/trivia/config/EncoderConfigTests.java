package com.ctrlaltcomplete.trivia.config;

import com.ctrlaltcomplete.trivia.model.User;
import com.ctrlaltcomplete.trivia.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import static org.junit.jupiter.api.Assertions.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
public class EncoderConfigTests {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private User testUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        testUser = new User();
        testUser.setPassword("password12345");
        testUser.setEmail("test@testmail.com");
        testUser.setFullName("Test User");

        when(userRepository.save(any(User.class))). thenReturn(testUser);
        when(passwordEncoder.encode(any(String.class))). thenReturn("Password encoded");
    }

    @Test
    public void testPasswordEncoder() {
        String encodedPassword = passwordEncoder.encode(testUser.getPassword());
        testUser.setPassword(encodedPassword);

        User savedUser = userRepository.save(testUser);

        assertNotEquals("password12345", savedUser.getPassword());
        assertEquals(encodedPassword, savedUser.getPassword());

        verify(userRepository).save(testUser);
    }
}
