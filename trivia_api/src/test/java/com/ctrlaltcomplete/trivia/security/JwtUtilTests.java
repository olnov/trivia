package com.ctrlaltcomplete.trivia.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;
import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class JwtUtilTests {

    private JwtUtil jwtUtil;
    private Key secretKey;

    @BeforeEach
    public void setUp() {
        jwtUtil = new JwtUtil();
        secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        // Inject the SECRET_KEY into the JwtUtil for testing.
        ReflectionTestUtils.setField(jwtUtil, "SECRET_KEY", secretKey);
    }

    @Test
    public void testGenerateToken() {
        String email = "test@example.com";
        Long userId = 1L;

        String token = jwtUtil.generateToken(email, userId);

        assertNotNull(token);
        assertTrue(token.contains("Bearer") == false);  // Since token should not contain "Bearer"
    }

    @Test
    public void testExtractUsername() {
        String email = "test@example.com";
        Long userId = 1L;

        String token = jwtUtil.generateToken(email, userId);

        String extractedUsername = jwtUtil.extractUsername(token);
        assertEquals(email, extractedUsername);
    }

    @Test
    public void testIsTokenValid() {
        String email = "test@example.com";
        Long userId = 1L;

        String token = jwtUtil.generateToken(email, userId);
        assertTrue(jwtUtil.isTokenValid(token, email));
    }


}
