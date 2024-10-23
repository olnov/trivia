package com.ctrlaltcomplete.trivia.model;

import com.ctrlaltcomplete.trivia.repository.UserRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;

@SpringBootTest
public class UserTests {

    private static User testUser;

    @BeforeAll
    public static void setUp() {
        testUser = new User();
        testUser.onCreate();
        testUser.setId(1L);
        testUser.setPassword("password");
        testUser.setEmail("email@mail.com");
        testUser.setFullName("full name");
    }

     @Test
     void userCreated() {
         assertEquals(testUser.getId(), 1L);
         assertEquals(testUser.getPassword(), "password");
         assertEquals(testUser.getEmail(), "email@mail.com");
         assertEquals(testUser.getFullName(), "full name");
         assertNotNull(testUser.getRegisteredAt());
     }
 }