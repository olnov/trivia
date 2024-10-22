package com.ctrlaltcomplete.trivia.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class AuthRequestTests {

    private AuthRequest authRequest;

    @BeforeEach
    public void setUp() {
        authRequest = new AuthRequest(); // Initialize before each test
    }

    @Test
    public void testSetAndGetEmail() {
        String email = "test@example.com";
        authRequest.setEmail(email); // Set email
        assertEquals(email, authRequest.getEmail(), "Email should match the value set");
    }

    @Test
    public void testSetAndGetPassword() {
        String password = "securePassword";
        authRequest.setPassword(password); // Set password
        assertEquals(password, authRequest.getPassword(), "Password should match the value set");
    }
}
